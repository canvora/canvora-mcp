## Install as a skill

```bash
npx skills add canvora/canvora-mcp
```

# Canvora — visuals for AI agents

[![npm](https://img.shields.io/npm/v/%40canvora%2Fcli)](https://www.npmjs.com/package/@canvora/cli)
[![Canvora MCP server](https://glama.ai/mcp/servers/canvora/canvora-mcp/badges/score.svg)](https://glama.ai/mcp/servers/canvora/canvora-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Give your agent a design department.** Turn any idea, URL, doc, or PDF into finished, on-brand visuals: **100+ formats** (posts, carousels, decks, PDFs, ads, infographics, landing-page kits), generated natively in **150+ languages** — including RTL and CJK. Brand kits keep every output in the client's colors, fonts, logo, and tone.

```bash
canvora generate --idea "5 tips for remote work" \
  --format linkedin_carousel --slides linkedin_carousel=5 \
  --brand $BRAND_ID --wait --json
# → 5 finished branded slides on CDN URLs
```

Your agent writes the brief. Canvora does the design. The outputs are stable CDN URLs ready to post, embed, or hand to a scheduler (works great upstream of [Postiz](https://github.com/gitroomhq/postiz-agent) or any posting tool: **generate → schedule**, end to end agentic).

This repo is the agent-facing toolkit for [Canvora](https://canvora.ai/for-agents):

- **Agent skills** — [`skills/`](skills/): 12 task-specific skills, one `npx skills add` installs all of them into Claude Code, Cursor, Codex, OpenCode, OpenClaw and 60+ agents.

  | Skill | For |
  |---|---|
  | [`canvora`](skills/canvora/SKILL.md) | core: setup, generate loop, credits, refinement |
  | [`instagram-carousel`](skills/instagram-carousel/SKILL.md) | Instagram carousels / swipe posts |
  | [`linkedin-carousel`](skills/linkedin-carousel/SKILL.md) | LinkedIn document carousels + safe zones |
  | [`pitch-deck`](skills/pitch-deck/SKILL.md) | pitch/sales/training decks, document → slides |
  | [`pdf-document`](skills/pdf-document/SKILL.md) | multi-page PDFs: brochures, reports, one-pagers |
  | [`landing-page-visuals`](skills/landing-page-visuals/SKILL.md) | a whole page's visual kit from its URL |
  | [`ad-campaign`](skills/ad-campaign/SKILL.md) | paid social + display ad sets and variants |
  | [`blog-promo-kit`](skills/blog-promo-kit/SKILL.md) | header, OG image and promo set from one post |
  | [`data-infographic`](skills/data-infographic/SKILL.md) | process flows, comparisons, timelines, stats |
  | [`multilingual-campaign`](skills/multilingual-campaign/SKILL.md) | one campaign → many languages |
  | [`product-photo-visuals`](skills/product-photo-visuals/SKILL.md) | designs built around the user's own photos |
  | [`visual-refresh`](skills/visual-refresh/SKILL.md) | edit, vary, localize and revert what exists |
- **Remote MCP server** — for Claude, ChatGPT, Cursor, and any MCP client. Nothing to install.
- **`canvora` CLI** — for shell-native agents, cron jobs, and CI. Zero dependencies.

> The Canvora service itself is hosted; this repo contains client tooling, skills, and docs.

## Option 1 — Skills + CLI (Claude Code, Cursor, Codex, OpenClaw, shell-native agents)

```bash
npx skills add canvora/canvora-mcp     # installs the skills (they set up the CLI on first use)
# or just the CLI:
npm install -g @canvora/cli

export CANVORA_API_KEY=vd_...   # create at canvora.ai → Integrations → API Keys (all plans, incl. Free)

# one atomic command: generates, polls, exits with the output URLs
canvora generate \
  --idea "5 tips for remote work" \
  --format linkedin_carousel --slides linkedin_carousel=5 \
  --wait --json
```

More runnable recipes: [`examples/`](examples/)

### Commands

| Command | What it does |
|---|---|
| `canvora generate` | Create visuals from an `--idea` (short concept, Canvora develops it), `--input` (your full content text), `--url`, or `--file-url` (PDF). `--wait` polls to completion and prints output URLs. |
| `canvora localize <id> --language es` | Same design, new language: translates an existing generation's visuals, layout untouched |
| `canvora variations <id> [--count n]` | Fresh takes on an existing generation's visuals |
| `canvora edit <outputId> --prompt "..."` | Natural-language edit of one visual (previews the change; `--yes` auto-confirms) |
| `canvora status <id>` | Check a generation and list its output URLs |
| `canvora download <id> --dir out/` | Save all output files locally |
| `canvora formats` | All format IDs with dimensions (live catalog) |
| `canvora brands` | Your brand kits (pass one via `--brand <uuid>`) |
| `canvora credits` | Credit balance (10 credits per visual, 15 per carousel/deck slide) |

Every command takes `--json` for machine-readable stdout; progress and errors go to stderr, so piping stays clean. Exit codes: `0` success, `1` failure, `2` usage error.

### Generate flags

```
--idea "concept"          short concept - Canvora develops it into content
--input "text"            your full content text, used as the source material
--url <url>               extract content from a webpage
--file-url <pdf-url>      extract content from a PDF
--format <id>[,<id>...]   output formats (see: canvora formats)
--slides <format>=<n>     slide count for carousel/deck formats (1-10, default 5); match it to the item count your idea promises
--brand <uuid>            apply a brand kit
--style <name>            modern | minimal | bold | elegant | playful | corporate | creative | dark
--resolution 2K|4K        4K on paid plans
--language <code-or-name> visual text language ("es", "Spanish"); default: matches your input's language
--exact                   use --input text verbatim, no rewording (quotes, taglines)
--logo                    place the brand kit's logo on the visual (needs --brand)
--cta                     end a carousel/deck on a call-to-action slide
--no-text                 pure visual, no typography (backgrounds, hero imagery)
--freeform                ignore format-specific art direction, use dimensions only
--landing-page            with --url: read the page's sections and produce a matching
                          landingPage-* visual kit (Starter plan or higher)
--project <uuid>          group outputs into a project/campaign
--workspace <uuid>        bill a team workspace pool instead of your personal credits
--wait                    poll until done (--timeout 600, --poll 5 seconds)
--json                    machine-readable output
```

## Option 2 — MCP (Claude, ChatGPT, any MCP client)

One remote server, OAuth sign-in, 16 tools your agent discovers on connect:

| | |
|---|---|
| **Server URL** | `https://api.canvora.ai/mcp` (streamable HTTP) |
| **Claude** | Settings → Connectors → Add custom connector → OAuth Client ID `claude_mcp` |
| **ChatGPT** | Apps → search **Canvora** → Connect, then start a message with `@Canvora` |
| **Registry** | `ai.canvora/canvora` on the [official MCP Registry](https://registry.modelcontextprotocol.io) — also on [Glama](https://glama.ai/mcp/servers/canvora/canvora-mcp), [Smithery](https://smithery.ai/servers/canvora-ai/canvora-ai), [mcpservers.org](https://mcpservers.org/servers/canvora/canvora-mcp) |

Step-by-step: [canvora.ai/help/integrations/mcp-setup](https://canvora.ai/help/integrations/mcp-setup)

**stdio-only clients:** [`mcp/`](mcp/) is a small stdio server that forwards every call to the remote server with your API key (same 16 tools, nothing generated locally):

```json
{
  "mcpServers": {
    "canvora": {
      "command": "node",
      "args": ["/path/to/canvora-mcp/mcp/server.js"],
      "env": { "CANVORA_API_KEY": "vd_..." }
    }
  }
}
```

Run `npm install` in `mcp/` first, or use the [`Dockerfile`](Dockerfile): `docker build -t canvora-mcp . && docker run -i -e CANVORA_API_KEY=vd_... canvora-mcp`.

## Option 3 — Raw REST

```bash
curl -X POST https://api.canvora.ai/api/generations \
  -H "X-API-Key: vd_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "inputType": "text",
    "inputContent": "5 tips for remote work",
    "outputFormats": ["linkedin_carousel"],
    "carouselCounts": {"linkedin_carousel": 5}
  }'
```

Full API guide: [canvora.ai/help/integrations/api-keys](https://canvora.ai/help/integrations/api-keys)

## What agents build with this

- **Client content pipelines** — brief in, branded multi-format campaign out, scheduled by your posting tool
- **Multilingual campaigns** — generate once, `canvora localize` into 10 markets; layout survives, text goes native ([skill](skills/multilingual-campaign/SKILL.md))
- **Save-optimized carousels** — hook-first structure and per-slide art direction encoded as a skill ([skill](skills/instagram-carousel/SKILL.md))
- **Docs → decks** — point `--file-url` at a PDF report, get presentation slides
- **Ad sets** — `ad_square,ad_landscape,ad_portrait` from one product URL, all placements covered

## Built to be called by software

- **Predictable costs** — flat credit pricing (10/visual, 15/slide); `canvora credits` before big jobs; failed generations auto-refund.
- **Human in the loop** — everything your agent creates also lands in your Canvora dashboard, ready for review, editing, and export before it goes anywhere.
- **Scoped, revocable keys** — hashed at rest, per-key usage tracking, one-click revoke.
- **Outputs on a CDN** — stable URLs your agent can post, embed, or hand to a scheduler.
- **Works on every plan** — API and MCP access included on Free (free credits, no card).

## Links

- [canvora.ai/for-agents](https://canvora.ai/for-agents) — the agent overview
- [MCP setup guide](https://canvora.ai/help/integrations/mcp-setup) · [API guide](https://canvora.ai/help/integrations/api-keys)
- [Pricing](https://canvora.ai/pricing)

MIT licensed (CLI, skills, and docs in this repo).
