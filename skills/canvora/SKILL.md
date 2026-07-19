---
name: canvora
description: Create on-brand visuals (social posts, carousels, decks, ads, documents) from any text, URL, or PDF via Canvora. 100+ formats, native generation in 150+ languages, per-client brand kits. Use when the user asks to create, generate, or design visual content for social media, marketing, or presentations.
---

# Canvora — on-brand visuals as a shell command

Canvora turns text, URLs, docs, and PDFs into finished visuals: single images
(10 credits) and multi-slide carousels/decks (15 credits per slide) in 100+
formats, generated natively in 150+ languages. Brand kits keep every output in
the client's colors, fonts, logo, and tone.

## Setup (once)

1. `npm install -g @canvora/cli` (Node 18+, zero dependencies)
2. Get an API key: canvora.ai → Integrations → API Keys (free plan works, no card)
3. `export CANVORA_API_KEY=vd_...`

Verify: `canvora credits --json` returns the account balance.

## Creating visuals

Always pass `--json`: results print to stdout as JSON, progress goes to stderr.

```bash
# From a short concept (Canvora develops it into content)
canvora generate --idea "5 tips for remote work" \
  --format linkedin_carousel --slides linkedin_carousel=5 --wait --json

# From YOUR full content (used as the source material; needs 50+ chars)
canvora generate --input "$FULL_POST_TEXT" --format instagram_post --wait --json

# From a URL (blog post, landing page — content is extracted automatically)
canvora generate --url https://example.com/post \
  --format instagram_post,blog_header --wait --json

# From a PDF
canvora generate --file-url https://example.com/report.pdf \
  --format presentation_slide --slides presentation_slide=8 --wait --json
```

The final JSON contains `generation.outputs[]`, each with a stable CDN
`fileUrl` you can post, embed, or download.

## Choosing formats

`canvora formats --json` lists all format IDs with dimensions and which are
carousels. Common ones: `instagram_post`, `instagram_carousel`,
`linkedin_post`, `linkedin_carousel`, `twitter_post`, `blog_header`,
`youtube_thumbnail`, `presentation_slide`. Carousel formats take
`--slides <format>=<n>` (1-10, default 5).

Choosing the slide count: if the idea or content promises N items ("5 tips",
"6 formas", "7 steps"), set `--slides` to N so each item gets its own slide
(or N+1 if you also want a cover). If you omit `--slides`, the default is 5
and Canvora will combine or stretch the items to fit.

## Brand kits

`canvora brands --json` lists the account's brand kits. Pass one with
`--brand <uuid>` so outputs use that client's colors, fonts, and logo.

## Styles and language

`--style` accepts: modern, minimal, bold, elegant, playful, corporate,
creative, dark. Visuals are generated natively in the language of your input
(a Spanish idea yields a Spanish carousel). To force a specific language,
pass `--language` with a code or name: `--language es`, `--language Turkish`.

## Budgeting and errors

- Check before large jobs: `canvora credits --json` (10 credits per visual,
  15 per slide; a 5-slide carousel = 75 credits).
- Exit code 0 = success, 1 = failure (message on stderr), 2 = usage error.
- Failed generations refund automatically; safe to retry on exit 1 unless the
  error says the request was declined by content safety checks (those are
  terminal — do not retry).
- `--wait` times out after 600s by default (override with `--timeout`); the
  generation keeps running server-side and `canvora status <id>` retrieves it.

## Other commands

```bash
canvora status <generationId> --json      # progress + output URLs
canvora download <generationId> --dir ./  # save files locally
```
