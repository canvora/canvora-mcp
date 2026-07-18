#!/usr/bin/env node
/**
 * canvora — CLI for the Canvora API (https://canvora.ai)
 *
 * Turn any idea, URL, doc, or PDF into on-brand visuals: 100+ formats,
 * native in 150+ languages. Built for agents and automation: every command
 * supports --json (machine-readable stdout; progress goes to stderr).
 *
 * Auth:    CANVORA_API_KEY  (vd_... API key from canvora.ai -> Integrations -> API Keys,
 *                            or an OAuth access token)
 * Server:  CANVORA_API_URL  (default https://api.canvora.ai)
 *
 * Zero runtime dependencies. Node 18+.
 */

'use strict';

// Agents pipe output constantly (| head, | jq). A closed pipe must be a clean
// exit, not an EPIPE crash.
process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); throw e; });
process.stderr.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); throw e; });

const fs = require('fs');
const path = require('path');
const VERSION = '1.0.0';
const API_URL = (process.env.CANVORA_API_URL || 'https://api.canvora.ai').replace(/\/+$/, '');
const API_KEY = process.env.CANVORA_API_KEY || '';
const REQUEST_TIMEOUT_MS = 60000;

// ---------------------------------------------------------------------------
// arg parsing (tiny, no deps): flags may be --k v, --k=v, or boolean
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        addFlag(args.flags, a.slice(2, eq), a.slice(eq + 1));
      } else {
        const key = a.slice(2);
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('--')) {
          addFlag(args.flags, key, next);
          i++;
        } else {
          addFlag(args.flags, key, true);
        }
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}
function addFlag(flags, key, value) {
  if (flags[key] === undefined) flags[key] = value;
  else if (Array.isArray(flags[key])) flags[key].push(value);
  else flags[key] = [flags[key], value];
}
const asArray = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

// ---------------------------------------------------------------------------
// output helpers: stdout = result, stderr = progress/errors
// ---------------------------------------------------------------------------
const say = (msg) => process.stderr.write(msg + '\n');
const emit = (data, json, human) => {
  if (json) process.stdout.write(JSON.stringify(data, null, 2) + '\n');
  else human(data);
};
function fail(message, code = 1) {
  say(`error: ${message}`);
  process.exit(code);
}

// ---------------------------------------------------------------------------
// API client
// ---------------------------------------------------------------------------
function authHeaders() {
  if (!API_KEY) return {};
  // vd_ keys go in X-API-Key; anything else (OAuth token) as Bearer
  return API_KEY.startsWith('vd_')
    ? { 'X-API-Key': API_KEY }
    : { Authorization: `Bearer ${API_KEY}` };
}

async function api(pathname, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${API_URL}${pathname}`, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `canvora-cli/${VERSION}`,
        ...authHeaders()
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error(`request timed out after ${REQUEST_TIMEOUT_MS / 1000}s: ${method} ${pathname}`);
    throw new Error(`network error: ${e.message}`);
  }
  clearTimeout(timer);

  let data = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { /* non-JSON body */ }

  if (!res.ok) {
    const apiMsg = data && (data.message || data.error) ? `${data.error ? data.error + ': ' : ''}${data.message || ''}`.trim() : text.slice(0, 200);
    if (res.status === 401) throw new Error('unauthorized. Set CANVORA_API_KEY (create one at canvora.ai -> Integrations -> API Keys).');
    if (res.status === 402) throw new Error(`insufficient credits. ${apiMsg}`);
    throw new Error(`API ${res.status}: ${apiMsg || 'request failed'}`);
  }
  return data;
}

function requireKey() {
  if (!API_KEY) fail('CANVORA_API_KEY is not set. Create a key at canvora.ai -> Integrations -> API Keys.', 2);
}

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------
async function cmdFormats(flags) {
  const data = await api('/api/formats');
  emit(data, flags.json, (d) => {
    for (const f of d.formats) {
      process.stdout.write(`${f.id.padEnd(34)} ${String(f.dimensions).padEnd(12)} ${f.category}${f.is_carousel ? '  (carousel)' : ''}\n`);
    }
    process.stdout.write(`\n${d.count} formats. Carousel formats accept per-format slide counts via --slides.\n`);
  });
}

async function cmdCredits(flags) {
  requireKey();
  const d = await api('/api/credits/balance');
  emit(d, flags.json, () => {
    process.stdout.write(`balance:  ${d.balance}\n`);
    if (d.packBalance) process.stdout.write(`  pack:    ${d.packBalance}${d.nextPackExpiry ? ` (expires ${d.nextPackExpiry.slice(0, 10)})` : ''}\n`);
    process.stdout.write(`  monthly: ${d.monthlyBalance ?? 0}\n  bonus:   ${d.topupBalance ?? 0}\n`);
  });
}

async function cmdBrands(flags) {
  requireKey();
  const d = await api('/api/brands');
  emit(d, flags.json, () => {
    for (const b of d.brands || []) {
      process.stdout.write(`${b.id}  ${b.name || '(unnamed)'}${b.isDefault || b.is_default ? '  [default]' : ''}\n`);
    }
    if (!(d.brands || []).length) process.stdout.write('no brand kits yet. Create one at canvora.ai/brands\n');
  });
}

function parseSlides(flags) {
  // --slides linkedin_carousel=7 (repeatable)
  const counts = {};
  for (const s of asArray(flags.slides)) {
    const [fmt, n] = String(s).split('=');
    const num = parseInt(n, 10);
    if (!fmt || !Number.isInteger(num) || num < 1 || num > 10) fail(`invalid --slides "${s}" (expected format_id=1..10)`, 2);
    counts[fmt] = num;
  }
  return counts;
}

async function cmdGenerate(flags) {
  requireKey();
  const formats = asArray(flags.format).flatMap((f) => String(f).split(',')).map((s) => s.trim()).filter(Boolean);
  if (!formats.length) fail('at least one --format is required (see: canvora formats)', 2);

  const body = { outputFormats: formats };
  if (flags.url) { body.inputType = 'url'; body.inputUrl = String(flags.url); }
  else if (flags['file-url']) { body.inputType = 'pdf'; body.inputFileUrl = String(flags['file-url']); }
  else if (flags.idea) { body.inputType = 'idea'; body.inputContent = String(flags.idea); }
  else if (flags.input) {
    const text = String(flags.input);
    // The API's text mode expects source MATERIAL (>=50 chars). Short prompts are
    // ideas: the idea path expands them into content instead of rejecting them.
    if (text.trim().length < 50) {
      fail(`--input expects real content (50+ chars of text to visualize). For a short concept like "${text.slice(0, 40)}", use --idea instead - Canvora will develop it into content.`, 2);
    }
    body.inputType = 'text'; body.inputContent = text;
  }
  else fail('provide --idea "concept", --input "content text", --url <url>, or --file-url <pdf-url>', 2);

  const carouselCounts = parseSlides(flags);
  if (Object.keys(carouselCounts).length) body.carouselCounts = carouselCounts;
  if (flags.brand) body.brandId = String(flags.brand);
  if (flags.style) body.visualStyle = String(flags.style);
  if (flags.resolution) body.resolution = String(flags.resolution);
  if (flags.title) body.title = String(flags.title);

  const created = await api('/api/generations', { method: 'POST', body });
  const gen = created.generation;
  say(`generation ${gen.id} started (${gen.creditsCharged} credits)`);

  if (!flags.wait) {
    emit(created, flags.json, () => {
      process.stdout.write(`${gen.id}\n`);
      process.stdout.write(`check progress: canvora status ${gen.id}\n`);
    });
    return;
  }

  // --wait: poll until terminal state
  const timeoutMs = (parseInt(flags.timeout, 10) || 600) * 1000;
  const pollMs = (parseInt(flags.poll, 10) || 5) * 1000;
  const started = Date.now();
  let last = null;

  while (Date.now() - started < timeoutMs) {
    await new Promise((r) => setTimeout(r, pollMs));
    last = await api(`/api/generations/${gen.id}`);
    const g = last.generation;
    say(`  ${g.status}${g.progress != null ? ` ${g.progress}%` : ''}`);
    if (['completed', 'failed', 'partial', 'cancelled'].includes(g.status)) {
      emit(last, flags.json, () => {
        for (const o of g.outputs || []) {
          if (o.fileUrl) process.stdout.write(`${o.fileUrl}\n`);
        }
      });
      if (g.status === 'failed' || g.status === 'cancelled') {
        fail(`generation ${g.status}${g.errorMessage ? `: ${g.errorMessage}` : ''}`);
      }
      return;
    }
  }
  fail(`timed out after ${timeoutMs / 1000}s waiting for generation ${gen.id} (it may still complete: canvora status ${gen.id})`);
}

async function cmdStatus(flags, id) {
  requireKey();
  if (!id) fail('usage: canvora status <generationId>', 2);
  const d = await api(`/api/generations/${id}`);
  emit(d, flags.json, () => {
    const g = d.generation;
    process.stdout.write(`status: ${g.status}${g.progress != null ? ` (${g.progress}%)` : ''}\n`);
    for (const o of g.outputs || []) {
      if (o.fileUrl) process.stdout.write(`${o.fileUrl}\n`);
    }
  });
}

async function cmdDownload(flags, id) {
  requireKey();
  if (!id) fail('usage: canvora download <generationId> [--dir <path>]', 2);
  const d = await api(`/api/generations/${id}`);
  const g = d.generation;
  if (g.status !== 'completed' && g.status !== 'partial') {
    fail(`generation is ${g.status}, nothing to download yet`);
  }
  const dir = path.resolve(String(flags.dir || '.'));
  fs.mkdirSync(dir, { recursive: true });
  const saved = [];
  for (const o of g.outputs || []) {
    const url = o.fileUrl;
    if (!url) continue;
    // path.basename after decode: a hostile/compromised URL must never be able
    // to write outside --dir (e.g. a segment decoding to "../../.zshrc").
    const rawName = decodeURIComponent(new URL(url).pathname.split('/').pop() || `${o.id}.png`);
    const name = path.basename(rawName).replace(/[^\w.\-]/g, '_') || `${o.id}.png`;
    const dest = path.join(dir, name);
    const res = await fetch(url);
    if (!res.ok) { say(`skip ${name}: HTTP ${res.status}`); continue; }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    saved.push(dest);
    say(`saved ${dest}`);
  }
  emit({ saved }, flags.json, () => {
    process.stdout.write(saved.map((s) => s + '\n').join(''));
  });
}

// ---------------------------------------------------------------------------
const HELP = `canvora ${VERSION} - on-brand visuals for agents and automation

usage: canvora <command> [flags]

commands:
  generate    create visuals        --idea "concept" | --input "content text" |
                                    --url <url> | --file-url <pdf>
                                    --format <id>[,<id>...]   (see: canvora formats)
                                    [--slides <format>=<n>] [--brand <uuid>]
                                    [--style modern|minimal|bold|elegant|playful|corporate|creative|dark]
                                    [--resolution 2K|4K] [--title <t>]
                                    [--wait [--timeout 600] [--poll 5]]
  status      check a generation    canvora status <generationId>
  download    save output files     canvora download <generationId> [--dir out/]
  formats     list all format IDs
  brands      list your brand kits
  credits     show credit balance
  version     print version

flags: --json on any command prints machine-readable JSON to stdout
       (progress and errors always go to stderr)

auth:  export CANVORA_API_KEY=vd_...   create at canvora.ai -> Integrations -> API Keys
env:   CANVORA_API_URL to override the API host

examples:
  canvora generate --idea "5 tips for remote work" --format linkedin_carousel --slides linkedin_carousel=5 --wait --json
  canvora generate --url https://yourblog.com/post --format instagram_post,blog_header --brand <uuid> --wait
  canvora download <generationId> --dir ./visuals
`;

async function main() {
  const { _: pos, flags } = parseArgs(process.argv.slice(2));
  const cmd = pos[0];
  try {
    switch (cmd) {
      case 'generate': return await cmdGenerate(flags);
      case 'status': return await cmdStatus(flags, pos[1]);
      case 'download': return await cmdDownload(flags, pos[1]);
      case 'formats': return await cmdFormats(flags);
      case 'brands': return await cmdBrands(flags);
      case 'credits': return await cmdCredits(flags);
      case 'version': return process.stdout.write(VERSION + '\n');
      case 'help': case undefined: return process.stdout.write(HELP);
      default: fail(`unknown command "${cmd}" (see: canvora help)`, 2);
    }
  } catch (e) {
    fail(e.message);
  }
}

main();
