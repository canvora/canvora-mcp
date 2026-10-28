#!/usr/bin/env node
/**
 * Builds the Claude plugin (claude-plugin/) from the shared skills in skills/.
 *
 *   node scripts/build-claude-plugin.mjs
 *
 * The Claude plugin bundles the Canvora connector, whose Claude listing offers design visuals
 * only: no text-free "pure imagery" output. So the plugin's copy of each skill drops the
 * --no-text guidance. Other agents keep the full skills/ versions. Run this after any skill edit;
 * it fails if a removal no longer matches, so a reworded skill can't slip through unchanged.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'skills');
const OUT = join(ROOT, 'claude-plugin', 'skills');

// [skill, exact text to remove or replace, replacement]
const EDITS = [
  ['canvora', '`--logo`, `--cta`, `--no-text`, `--freeform`, `--landing-page`', '`--logo`, `--cta`, `--freeform`, `--landing-page`'],
  ['canvora', '| `--no-text` | they want pure imagery: backgrounds, hero art, textures |\n', ''],
  ['data-infographic', '- **`--no-text`** is almost never right here — the text *is* the content.\n', ''],
  ['ad-campaign', '- **`--no-text`** if the team overlays their own copy in Ads Manager.\n', ''],
  ['landing-page-visuals', '\n# Pure imagery with no typography baked in (devs adding their own copy in HTML)\ncanvora generate --url $URL --format landingPage-Hero --no-text --wait --json\n', '\n'],
  ['landing-page-visuals', '\n`--no-text` is the flag web teams want and never find: it produces the artwork\nwithout text, so the copy stays in the DOM where it belongs.\n', ''],
  ['landing-page-visuals', '- [ ] `--no-text` offered when the visuals go into a real HTML page\n', ''],
  // The plugin keeps the API key in its own settings (masked, secure storage) and exports it for
  // the session, so the skill never asks the user to put a key in their shell or the chat.
  ['canvora', '2. Get an API key: canvora.ai → Integrations → API Keys (all plans, incl. Free)\n3. `export CANVORA_API_KEY=vd_...`\n',
    '2. Get an API key: canvora.ai → Integrations → API Keys (all plans, incl. Free)\n'
    + '3. Save it in this plugin\'s settings: `/plugin configure canvora@canvora`. It is stored\n'
    + '   in secure storage and given to the CLI as `CANVORA_API_KEY` from the next session on.\n'
    + '   Never ask the user to paste the key into the chat. No key? The bundled Canvora\n'
    + '   connector signs in with OAuth: see "What needs the MCP server instead of the CLI".\n'],
];
// OpenClaw-only frontmatter (it declares CANVORA_API_KEY as a machine env requirement).
const OPENCLAW_META = /^metadata: \{"openclaw".*\}\n/m;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const problems = [];
for (const skill of readdirSync(SRC)) {
  cpSync(join(SRC, skill), join(OUT, skill), { recursive: true });
  const file = join(OUT, skill, 'SKILL.md');
  let text = readFileSync(file, 'utf8');
  for (const [s, from, to] of EDITS.filter(([s]) => s === skill)) {
    if (!text.includes(from)) problems.push(`${s}: text to remove not found: ${JSON.stringify(from.slice(0, 60))}`);
    text = text.replace(from, to);
  }
  if (!OPENCLAW_META.test(text)) problems.push(`${skill}: OpenClaw metadata line not found`);
  text = text.replace(OPENCLAW_META, '');
  if (/no-text|no_text/.test(text)) problems.push(`${skill}: still mentions --no-text`);
  if (/export CANVORA_API_KEY/.test(text)) problems.push(`${skill}: still tells the user to export the key`);
  writeFileSync(file, text);
}
if (problems.length) {
  console.error('Plugin build FAILED:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log(`Built ${readdirSync(OUT).length} skills into claude-plugin/skills (no --no-text guidance).`);
