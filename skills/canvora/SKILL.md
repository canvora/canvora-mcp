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
2. Get an API key: canvora.ai → Integrations → API Keys (all plans, incl. Free)
3. `export CANVORA_API_KEY=vd_...`

Verify: `canvora credits --json` returns the account balance.

## Creating visuals

Always pass `--json`: results print to stdout as JSON, progress goes to stderr.

```bash
# From a short concept (Canvora plans it: detects language, develops the items)
canvora generate --idea "5 tips for remote work" \
  --format linkedin_carousel_portrait --slides linkedin_carousel_portrait=5 --wait --json

# From YOUR full content (used as the source material; needs 50+ chars)
canvora generate --input "$FULL_POST_TEXT" --format instagram_post --wait --json

# From a URL (blog post, landing page - content is extracted automatically)
canvora generate --url https://example.com/post \
  --format instagram_post,quote_card --wait --json

# From a PDF or DOCX (the URL must be PUBLICLY fetchable - no localhost/private links)
canvora generate --file-url https://example.com/report.pdf \
  --format presentation_slide --slides presentation_slide=8 --wait --json
```

Also available: `--title "Q3 launch"` (names the generation in the dashboard)
and `--resolution 4K` (paid plans; default 2K).

The final JSON contains `generation.outputs[]`, each with a stable CDN
`fileUrl` you can post, embed, or download.

## Choosing the input mode

- `--idea`: a concept, not content ("5 tips for X"). Canvora runs a planning
  pass: detects the language, invents the substance, maps items to slides.
- `--input`: the user already wrote the content (50+ chars). It is used as
  source material; wording is respected, not reinvented.
- `--url` / `--file-url`: content is extracted from the page/PDF/DOCX first.
- Rule of thumb: if the user hands you finished text, use `--input`; if they
  hand you a topic, use `--idea`; if they hand you a link or file, pass it
  directly instead of copy-pasting its text.

## Choosing formats

The live catalog is the source of truth - do not guess format IDs:

```bash
canvora formats --json
```

Each entry has `id`, `dimensions`, `category` (social, marketing, document,
presentation, advertising, infographic, email, landing_page), `is_carousel`,
and a `description` that includes recommendations (e.g. the LinkedIn carousel
marked "recommended", `pitch_deck` "for investors"). Match the user's intent
against category + description and pick accordingly. Carousel-flagged formats
take `--slides`.

Combos worth knowing (these span formats, so the catalog can't tell you):
- Announcing something: `announcement_card` + `instagram_post` + `instagram_story`
- Promoting an article: `blog_header` + `og_image` + a carousel from the same URL
- Ad campaign: `ad_square` + `ad_landscape` + `ad_portrait` (covers all placements)
- A claim + its proof: a carousel plus `stat_card` or `testimonial_card` from the same source

Batching: one generation can carry several formats
(`--format instagram_post,linkedin_post,quote_card`) - all outputs come from
the same source with a consistent look, and cost is simply the sum
(10/visual, 15/slide). Prefer one batched call over several separate ones.
One instance per format per call: for 3 different Instagram posts, run 3
calls with 3 different ideas (not `instagram_post,instagram_post`).

## Slide counts (carousel formats only)

`--slides <format>=<n>` (1-10, default 5). If the idea or content promises N
items ("5 tips", "6 formas", "7 steps"), set `--slides` to N so each item
gets its own slide - or N+1 if you also want a cover. If you omit it, Canvora
fits the items into 5 slides (combining or stretching as needed).

## Brand kits

`canvora brands --json` lists the account's brand kits. Pass one with
`--brand <uuid>` so outputs use that client's colors, fonts, and logo. If the
user names a client or brand, ALWAYS look up and pass their kit - it is the
difference between on-brand output and generic output.

## Styles and language

`--style` sets the aesthetic. Pick from the user's tone:
- corporate, professional, B2B -> `corporate` or `minimal`
- friendly, consumer, lifestyle -> `playful` or `creative`
- premium, luxury -> `elegant` or `dark`
- loud, promotional -> `bold`
- default / unsure -> `modern`

Language is detected from your input automatically - a Spanish idea yields a
Spanish carousel, natively generated (not translated). To force a specific
language (e.g. an English brief for a Turkish audience), pass
`--language tr` or `--language Turkish`.

## Recipes for common asks

```bash
# "Promote this blog post" - full promo set from one URL
canvora generate --url $POST_URL \
  --format blog_header,instagram_carousel,linkedin_post --slides instagram_carousel=6 \
  --brand $BRAND --wait --json

# "Weekly content in English and Spanish" - run twice, native each time
canvora generate --idea "3 mistakes first-time founders make" --format instagram_carousel --slides instagram_carousel=4 --wait --json
canvora generate --idea "3 errores de los fundadores primerizos" --format instagram_carousel --slides instagram_carousel=4 --wait --json

# "Turn this report into a deck"
canvora generate --file-url $PDF_URL --format presentation_slide --slides presentation_slide=8 --wait --json

# "Make an ad set for this product page"
canvora generate --url $PRODUCT_URL --format ad_square,ad_landscape,ad_portrait --brand $BRAND --wait --json
```

## Budgeting and errors

- Check before large jobs: `canvora credits --json` (10 credits per visual,
  15 per slide; a 5-slide carousel = 75 credits).
- Exit code 0 = success, 1 = failure (message on stderr), 2 = usage error.
- Failed generations refund automatically; safe to retry on exit 1 unless the
  error says the request was declined by content safety checks (those are
  terminal - do not retry).
- `--wait` times out after 600s by default (override with `--timeout`); the
  generation keeps running server-side and `canvora status <id>` retrieves it.
  NEVER re-run `generate` after a timeout - that creates a NEW paid
  generation. Poll `canvora status <id>` instead.
- Rate limit: 20 generation requests/minute. For big batches, run
  sequentially with `--wait` rather than firing them all at once.
- Free-plan outputs carry a watermark; paid plans export clean. If the user
  asks why there is a watermark, that is the reason.
- Everything you create also lands in the user's Canvora dashboard for review
  and editing - tell the user where to find it.

## Delivering carousels: slide order matters

Each output in `generation.outputs[]` has a `sortOrder` field. When posting
or downloading carousel/deck slides, ALWAYS sort by `sortOrder` first -
outputs can complete out of order, and a scrambled carousel ruins the story.

## What the CLI does NOT do (yet)

Editing ("make the headline bigger"), variations, localizing an existing
visual, and PDF/PPTX export are not CLI commands. When the user asks for
these, do NOT regenerate from scratch (it costs full credits and loses the
design). Instead point them to the visual in their Canvora dashboard, where
all of that is one click - or to the Canvora MCP server
(https://api.canvora.ai/mcp), which exposes edit, variations, localize, and
export as tools for MCP-capable agents.

## Other commands

```bash
canvora status <generationId> --json      # progress + output URLs
canvora download <generationId> --dir ./  # save files locally
```
