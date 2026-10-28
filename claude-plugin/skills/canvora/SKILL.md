---
name: canvora
description: Create on-brand visuals (social posts, carousels, decks, PDFs, ads, landing-page sections, infographics) from any idea, text, or URL with the Canvora connector. 100+ formats, native generation in 150+ languages, per-client brand kits. Use when the user asks to create, generate, or design visual content for social media, marketing, presentations, or documents.
---

# Canvora: on-brand visuals from the conversation

Canvora turns ideas, text and URLs into finished visuals: single images
(10 credits) and multi-slide carousels, decks and documents (15 credits per
slide) across 100+ formats, generated natively in 150+ languages. Brand kits keep
every output in the client's colors, fonts, logo and tone.

This is the core skill: the connector tools, the generate loop, credits and
refinement. Task-specific skills build on it (see "Companion skills" at the bottom).

## Setup

This plugin includes the Canvora connector. The first time a Canvora tool runs,
the user signs in with their Canvora account (OAuth). A free account at
canvora.ai includes free credits; no card and no API key are needed.

## Before you generate: the four things that decide the output

Generation costs credits and takes a minute or two (multi-slide work longer).
Get these right on the first call; there is no cheap retry.
Ask the user ONLY for what you cannot infer from the conversation; never
interrogate. In order of impact:

1. **Source**: do they have finished content, a link, or just a topic?
2. **Where it goes**: the platform or artifact decides the format, not the
   other way round ("LinkedIn carousel", "a PDF one-pager", "Meta ads").
3. **Whose brand**: if a client or company is named, call `list_brands` and
   use that kit's `brand_id`. Skipping this is the single biggest quality drop.
4. **Any look they already have in mind**: one line is enough ("black and
   white, big type"). If they say nothing, do not invent art direction.

Defaults that are safe when the user gives nothing: 5 slides, `modern` style,
2K, language taken from their input.

## The generate loop

1. **`chat`**: send one message that carries the brief: the source (paste
   their content, or include the URL), the format, the slide count, the brand,
   and any stated look. Canvora plans the visual and replies with its plan:
   formats, slide counts, style, credit cost, plus the account's brand kits and
   saved design styles (so you often don't need `list_brands`). The
   conversation is stateful; keep the `conversation_id` for follow-ups.
2. **Show the plan to the user** and wait for their go-ahead. Adjust by sending
   another `chat` message in the same conversation.
3. **`confirm_generation`** with the `conversation_id`. Pass overrides only for
   what the plan got wrong or left out (see the table below). It returns a
   generation ID immediately.
4. **`get_generation`** with that ID until `status` is `completed`, `partial`
   or `failed`. Outputs arrive incrementally; show them as they land.

**Never call `confirm_generation` twice for the same job.** If it seems slow,
keep polling `get_generation`; a second confirm starts a second, separately
charged generation. This is the single most expensive mistake you can make.

### `confirm_generation` levers

| Parameter | Use it when |
|---|---|
| `brand_id` | a brand kit applies (from the plan or `list_brands`) |
| `design_style_id` | the user picks one of their saved design styles (listed in the plan) |
| `embed_logo: true` | the visual should carry the brand mark (needs `brand_id`; first and last slide on carousels) |
| `include_cta: true` | a carousel or deck should end on a call-to-action slide (it **uses one of your slides**: 6 slides with a CTA means slide 6 is the CTA) |
| `carousel_counts` | the slide count must change, e.g. `{"instagram_carousel_portrait": 6}` |
| `visual_style` | `modern`, `minimal`, `bold`, `elegant`, `playful`, `corporate`, `creative`, `dark` |
| `use_exact_content: true` | the text must appear verbatim (quotes, taglines, prices, legal lines) |
| `language` | force the output language, e.g. an English brief for a Turkish audience |
| `resolution: "4K"` | print or large displays (Pro plan) |
| `embedding_photos` | the user's own photos go into the design (see `product-photo-visuals`) |
| `workspace_id` | a team workspace pays (from `list_workspaces`; must match the one used in `chat`) |

To change the **format** (especially to or from a carousel) or the **content**,
send a new `chat` message instead of overriding `formats`: chat re-plans the
design and the slide count.

## Choosing formats

`list_formats` (optionally filtered by `category`) is the source of truth; do
not guess IDs. Match the user's intent against each format's category and
description.

Two ID traps: landing-page formats are camelCase with a hyphen
(`landingPage-Hero`, not `landing_page_hero`), and the multi-page PDF format is
called `document_page` (see the `pdf-document` skill).

Combos worth knowing (they span formats, so the catalog can't tell you):
- Announcing something: `announcement_card` + `instagram_post` + `instagram_story`
- Promoting an article: `blog_header` + `og_image` + a carousel from the same URL
- Ad campaign: `ad_square` + `ad_landscape` + `ad_portrait` (covers all placements)
- A claim and its proof: a carousel plus `stat_card` or `testimonial_card` from the same source

One generation can carry several formats, all from the same source with a
consistent look; cost is the sum. Prefer one batched request over several.
For three *different* Instagram posts, run three generations with three ideas.

## Slide counts (carousel formats only)

1 to 10 slides, default 5. If the content promises N items ("5 tips",
"7 steps"), ask for N slides, or N+1 with a cover. Put the count in the `chat`
message, or fix it with `carousel_counts`. `x_multi_image` caps at 4.

## Brand kits and logos

`list_brands` returns the account's kits. If the user names a client or brand,
ALWAYS use their kit: it is the difference between on-brand and generic output.
`brand_id` applies colors, fonts and voice but **does not** stamp the logo; add
`embed_logo: true` for that. On a carousel or deck the logo goes on the first
and last slide only, deliberately. For a logo on a middle slide, add it
afterwards with an `edit_image` brand edit.

## Styles, art direction and language

Pick the style from the user's tone:

- corporate, professional, B2B → `corporate` or `minimal`
- friendly, consumer, lifestyle → `playful` or `creative`
- premium, luxury → `elegant` or `dark`
- loud, promotional → `bold`

**How much to art-direct.** Let Canvora own the design execution: layout,
composition, per-slide imagery, color harmony. Do not write slide-by-slide
visual instructions. But when the user states an aesthetic ("black and white,
grey background, large type", "hand-drawn"), pass it through in one line: it is
honoured, and dropping the user's stated look is a worse failure than
over-specifying.

Language comes from the brief: a Spanish brief yields a natively Spanish visual
(designed, not translated). To target another language, say so in `chat` or
pass `language` on confirm.

## Credits, plans and errors

- 10 credits per single visual, 15 per carousel, deck or document slide
  (a 5-slide carousel is 75). **State the total in the same message as the
  run**: announce it, don't ask permission. When you chose a slide count or
  number of variants yourself, confirm that number.
- Call `check_credits` only when the user asks about their balance.
- `partial` means some visuals were blocked or failed; their credits are
  refunded automatically. Say what came back and why; don't silently hand over
  a short carousel.
- Failed generations refund automatically. A request declined by content
  safety checks is final; don't retry it.
- A 403 with a plan message is a plan limit, not an auth problem. Pass on the
  message and the pricing link; don't retry.
- Free-plan outputs carry a watermark; paid plans export clean.
- Everything created is saved in the user's Canvora account (canvora.ai) for
  review, editing and export; tell the user where to find it.

## Delivering: order and files

- `get_generation` lists outputs numbered in slide order. Keep that order when
  showing carousels, decks and documents; `export_visuals` keeps it too.
- `export_visuals` turns a generation into a **PDF** (LinkedIn document posts,
  documents), **PPTX** (decks) or **ZIP** (all images).
- `download_visual` gives one output's direct URL; `convert_image` returns
  JPG, WebP or PNG.

## Refining (NEVER regenerate from scratch)

Regenerating loses the design and costs full price. Use these instead:

| Operation | Tool | Credits |
|---|---|---|
| Change one visual | `edit_image` | **3** |
| Same design, other languages | `localize_generation` | 10 per visual per language |
| Fresh takes on the same content | `create_variation` | 10 per image, 15 per carousel slide, for **every** visual (`count` is per visual) |
| Undo an edit | `get_edit_history` + `revert_edit` | free |

`edit_image` is a two-step flow: call it with an `operation` (`text`,
`colour`, `layout` or `brand`) and an `instruction`; show the user the edit plan
it returns; then call again with `confirmed: true` and the
`confirmed_instruction`. Edits that change what the image depicts (the subject,
people, products, scene) aren't available in this connector and come back
declined with a link to the Canvora editor; pass that link on.

`localize_generation` and `create_variation` need the Visual Editor feature
(Starter plan or a Campaign Pack); a 403 there is the plan.

## Companion skills

Load the one that matches the job; each builds on this one:

| Skill | For |
|---|---|
| `instagram-carousel` | Instagram carousels and swipe posts |
| `linkedin-carousel` | LinkedIn document carousels |
| `pitch-deck` | presentations, pitch, sales and training decks, document → deck |
| `pdf-document` | multi-page PDFs: brochures, reports, one-pagers, menus |
| `landing-page-visuals` | visuals for a landing page's sections, from its URL |
| `ad-campaign` | paid social and display ad sets |
| `blog-promo-kit` | blog header, OG image and promo set from one post |
| `data-infographic` | process flows, comparisons, timelines, stat cards |
| `multilingual-campaign` | one campaign, many languages |
| `product-photo-visuals` | designs built around the user's own photos |
| `visual-refresh` | fixing, varying and versioning what already exists |
