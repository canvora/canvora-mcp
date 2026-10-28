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
];

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
  if (/no-text|no_text/.test(text)) problems.push(`${skill}: still mentions --no-text`);
  writeFileSync(file, text);
}
if (problems.length) {
  console.error('Plugin build FAILED:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log(`Built ${readdirSync(OUT).length} skills into claude-plugin/skills (no --no-text guidance).`);
