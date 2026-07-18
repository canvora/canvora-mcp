# Canvora — visuals for AI agents

Turn any idea, URL, doc, or PDF into on-brand visuals: **100+ formats** (posts, carousels, decks, ads, documents), generated natively in **150+ languages**. Brand kits keep colors, fonts, logo, and tone consistent per client.

This repo is the agent-facing toolkit for [Canvora](https://canvora.ai/for-agents):

- **Remote MCP server** — for Claude, ChatGPT, Cursor, and any MCP client. Nothing to install.
- **`canvora` CLI** — for OpenClaw, Hermes, cron jobs, CI, and anything that runs shell commands. Zero dependencies.
- **OpenClaw skill** — in [`skills/canvora/`](skills/canvora/SKILL.md).

> The Canvora service itself is hosted; this repo contains client tooling and docs only.

## Option 1 — MCP (Claude, ChatGPT, any MCP client)

One remote server, OAuth sign-in, 16 tools your agent discovers on connect:

| | |
|---|---|
| **Server URL** | `https://api.canvora.ai/mcp` (streamable HTTP) |
| **Claude** | Settings → Connectors → Add custom connector → OAuth Client ID `claude_mcp` |
| **ChatGPT** | Settings → Apps → Developer mode → Create app → OAuth Client ID `chatgpt_mcp` |
| **Registry** | `ai.canvora/canvora` on the [official MCP Registry](https://registry.modelcontextprotocol.io) |

Step-by-step: [canvora.ai/help/integrations/mcp-setup](https://canvora.ai/help/integrations/mcp-setup)

## Option 2 — CLI (OpenClaw, Hermes, shell-native agents)

```bash
npm install -g canvora-cli

# or install the agent skill (Claude Code, Cursor, Codex, OpenCode and 60+ agents):
npx skills add canvora/canvora-mcp

export CANVORA_API_KEY=vd_...   # create at canvora.ai → Integrations → API Keys

# one atomic command: generates, polls, exits with the output URLs
canvora generate \
  --idea "5 tips for remote work" \
  --format linkedin_carousel --slides linkedin_carousel=5 \
  --wait --json
```

### Commands

| Command | What it does |
|---|---|
| `canvora generate` | Create visuals from an `--idea` (short concept, Canvora develops it), `--input` (your full content text), `--url`, or `--file-url` (PDF). `--wait` polls to completion and prints output URLs. |
| `canvora status <id>` | Check a generation and list its output URLs |
| `canvora download <id> --dir out/` | Save all output files locally |
| `canvora formats` | All 100+ format IDs with dimensions |
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
--slides <format>=<n>     slide count for carousel/deck formats (1-10)
--brand <uuid>            apply a brand kit
--style <name>            modern | minimal | bold | elegant | playful | corporate | creative | dark
--resolution 2K|4K        4K on paid plans
--wait                    poll until done (--timeout 600, --poll 5 seconds)
--json                    machine-readable output
```

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

## Built to be called by software

- **Predictable costs** — flat credit pricing (10/visual, 15/slide); `canvora credits` before big jobs; failed generations auto-refund.
- **Human in the loop** — everything an agent creates lands in the Canvora dashboard for review, editing, and export.
- **Scoped, revocable keys** — hashed at rest, per-key usage tracking, one-click revoke.
- **Outputs on a CDN** — stable URLs your agent can post, embed, or hand to a scheduler.
- **Works on every plan** — API and MCP access included on Free (free credits, no card).

## Links

- [canvora.ai/for-agents](https://canvora.ai/for-agents) — the agent overview
- [MCP setup guide](https://canvora.ai/help/integrations/mcp-setup) · [API guide](https://canvora.ai/help/integrations/api-keys)
- [Pricing](https://canvora.ai/pricing)

MIT licensed (CLI and docs in this repo).
