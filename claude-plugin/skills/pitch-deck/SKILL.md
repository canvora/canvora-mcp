---
name: pitch-deck
description: Build presentation decks with Canvora — pitch decks, sales decks, training and webinar slides, or a document's content turned into slides. Use when the user wants a presentation, deck, slide set, investor pitch, sales enablement slides, or asks to turn a document into slides.
---

# Decks and presentations

Deck formats run through Canvora's **structured slide pipeline**: one planning
pass builds the narrative arc and a shared design system, then every slide is
rendered against it. That is why a deck holds together where N separate images
would not. Your job is the narrative input and the format choice; the pipeline
does the rest. The generate loop and credits: see the `canvora` skill.

## Pick the format by audience, not by shape

| Format | Size | Use for |
|---|---|---|
| `pitch_deck` | 16:9 | investors, fundraising, "the story of the company" |
| `sales_deck` | 16:9 | prospects, product value, objection handling |
| `presentation_slide` | 16:9 1920×1080 | the general default: talks, internal, conference |
| `training_slide` | 16:9 | teaching, onboarding, step-by-step instruction |
| `webinar_slide` | 16:9 | live sessions, screen-share readability |
| `presentation_4x3` | 4:3 1024×768 | only when the user's projector or template demands it |

All six are carousel formats: **15 credits per slide**. A 10-slide deck = 150.
State the cost in the same message as the run: announce it, don't ask
permission. When *you* chose the slide count (the defaults below), confirm that
number with them; when they said "10 slides", just run it.

## Intake: three questions, maximum

1. **What's the source?** A link (put the URL in the `chat` message), content
   they wrote or a document's text in the conversation (pass it in full), or
   just the pitch in their head (describe it).
2. **How many slides?** If they don't know, use the audience: pitch 10,
   sales 8, training as many as there are steps, general 8. Cap is 10 per run.
3. **Whose brand?** `list_brands` → `brand_id`, plus `embed_logo: true`: decks
   are the one place a logo is expected.

If they gave you a document, do NOT summarise it into a vague idea. Pass its
content as the source (or its public URL) so the numbers, names and structure
survive.

## The canonical runs

`chat` messages:

> Turn this Q3 report into an 8-slide presentation (presentation_slide), using
> our brand kit: [the report text, or its public URL]

> Create a 10-slide seed pitch deck (pitch_deck) for a B2B logistics SaaS:
> problem, market size, product, traction, team, ask. Corporate style, close on
> the ask.

> Make an 8-slide sales deck (sales_deck) from https://example.com/product, with a CTA.

Then `confirm_generation` with `brand_id`, `embed_logo: true` and, for
pitch/sales decks, `include_cta: true`; poll `get_generation`.

## Narrative shaping (this is where a deck is won)

- **Name the arc in the brief when it's a pitch.** "problem, market, product,
  traction, team, ask" beats "a pitch deck for my startup": the planner maps
  each beat to a slide.
- **One claim per slide.** If the source has 20 points and they asked for 8
  slides, say which 8 matter; otherwise the planner compresses for you.
- **`include_cta` for anything persuasive.** Pitch and sales decks should close
  on an ask. Training decks usually shouldn't.
- **`visual_style`:** investors/enterprise → `corporate` or `minimal`; product
  launches → `bold`; premium/brand-led → `elegant`.
- **Don't art-direct slide by slide.** But if the user has a stated look or an
  existing template aesthetic, pass it as one line.

## Delivering a deck

1. **Keep the slide order** `get_generation` lists. A deck out of order is worthless.
2. **Export it**: this is the step users actually want. `export_visuals` with
   `format: "pptx"` (PowerPoint / Google Slides) or `"pdf"`.
3. **Fix a single slide with `edit_image`** (3 credits, design preserved);
   never regenerate the deck because slide 4 has a typo.

## Quality checklist

- [ ] Source passed in full (content or URL), not paraphrased
- [ ] Slide count matches the narrative beats
- [ ] Brand kit + `embed_logo` applied when a kit exists
- [ ] `include_cta` on pitch/sales, off on training
- [ ] Cost stated up front (15 × slides); plan shown before confirming
- [ ] Slides in order; exported to PPTX or PDF
