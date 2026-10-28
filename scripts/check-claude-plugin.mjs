#!/usr/bin/env node
/**
 * Checks the Claude plugin (claude-plugin/) before you commit it.
 *
 *   node scripts/check-claude-plugin.mjs            # offline checks
 *   node scripts/check-claude-plugin.mjs --online   # also checks format IDs against the live catalog
 *
 * The plugin's skills (claude-plugin/skills/) are the connector edition: Claude uses the Canvora
 * connector's tools, so they work in Claude Code, Cowork and the Claude apps without a CLI or API
 * key. They are written separately from skills/ (the CLI edition other agents install), so this
 * script keeps the two in step: same skill set, no CLI or key instructions, and only connector
 * tools and parameters that really exist (from mcp/tools.json).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI_SKILLS = join(ROOT, 'skills');
const PLUGIN_SKILLS = join(ROOT, 'claude-plugin', 'skills');
const tools = JSON.parse(readFileSync(join(ROOT, 'mcp', 'tools.json'), 'utf8'));

const toolNames = new Set(tools.map((t) => t.name));
const paramNames = new Set(tools.flatMap((t) => Object.keys(t.inputSchema?.properties || {})));
// Values and field names the skills legitimately quote that are neither tools nor parameters.
// landing_page_hero is quoted only as the wrong spelling to avoid.
const ALLOWED = new Set(['output_index', 'x_multi_image', 'landing_page_hero']);

const problems = [];
const skillNames = (dir) => readdirSync(dir).filter((d) => existsSync(join(dir, d, 'SKILL.md'))).sort();

const cli = skillNames(CLI_SKILLS);
const plugin = skillNames(PLUGIN_SKILLS);
for (const s of cli) if (!plugin.includes(s)) problems.push(`${s}: in skills/ but missing from claude-plugin/skills/`);
for (const s of plugin) if (!cli.includes(s)) problems.push(`${s}: in claude-plugin/skills/ but not in skills/`);

const FORBIDDEN = [
  [/\bcanvora (generate|status|localize|variations|edit|download|formats|brands|credits)\b/, 'a canvora CLI command'],
  [/npm install|npx /, 'a package install'],
  [/CANVORA_API_KEY|X-API-Key|\bvd_/, 'an API key instruction'],
  [/--no-text|no_text/, 'text-free imagery (not offered in Claude)'],
  [/--[a-z][a-z-]+/, 'a CLI flag'],
];

let formatIds = null;
if (process.argv.includes('--online')) {
  const res = await fetch('https://api.canvora.ai/api/formats');
  const body = await res.json();
  const data = body.data ?? body;
  const list = Array.isArray(data) ? data : data.formats || [];
  formatIds = new Set(list.map((f) => f.id || f.format_id).filter(Boolean));
  if (!formatIds.size) throw new Error('Could not read the live format catalog');
}

for (const s of plugin) {
  const text = readFileSync(join(PLUGIN_SKILLS, s, 'SKILL.md'), 'utf8');
  const head = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!head) { problems.push(`${s}: no frontmatter`); continue; }
  const name = head[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const desc = head[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (name !== s) problems.push(`${s}: frontmatter name is "${name}"`);
  if (!desc) problems.push(`${s}: no description`);
  else if (desc.length > 1024) problems.push(`${s}: description is ${desc.length} characters (max 1024)`);

  for (const [re, what] of FORBIDDEN) {
    const m = text.match(re);
    if (m) problems.push(`${s}: contains ${what}: "${m[0]}"`);
  }

  // Every backticked snake_case identifier must be a real tool, parameter or (online) format ID.
  for (const [, id] of text.matchAll(/`([a-z]+(?:_[a-z0-9]+)+)`/g)) {
    if (toolNames.has(id) || paramNames.has(id) || ALLOWED.has(id)) continue;
    if (formatIds ? formatIds.has(id) : true) continue;
    problems.push(`${s}: unknown tool, parameter or format "${id}"`);
  }
  if (formatIds) {
    for (const [, id] of text.matchAll(/`(landingPage-[A-Za-z]+)`/g)) {
      if (!formatIds.has(id)) problems.push(`${s}: unknown format "${id}"`);
    }
  }
}

if (problems.length) {
  console.error('Claude plugin check FAILED:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log(`Claude plugin OK: ${plugin.length} connector skills match skills/${formatIds ? `, ${formatIds.size} live format IDs checked` : ''}.`);
