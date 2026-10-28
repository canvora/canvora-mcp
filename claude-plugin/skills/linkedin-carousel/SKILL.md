---
name: linkedin-carousel
description: Create LinkedIn document carousels and post visuals with Canvora — correct aspect ratio, safe zones for LinkedIn's UI chrome, B2B content shaping. Use when the user wants a LinkedIn carousel, document post, swipe post for LinkedIn, or B2B thought-leadership visuals.
---

# LinkedIn carousels and post visuals

LinkedIn's document carousel is the highest-reach organic format on the
platform, and it has one detail everyone gets wrong: the bottom of every slide
is covered by LinkedIn's own UI. Canvora's LinkedIn formats declare safe zones
for exactly this. The generate loop and credits: see the `canvora` skill.

## Format choice

| Format | Ratio | Bottom safe zone | Use |
|---|---|---|---|
| `linkedin_carousel_portrait` | 4:5 | 60px | **the default**: most feed space per swipe |
| `linkedin_carousel` | 1:1 | 60px | when their existing template is square |
| `linkedin_carousel_vertical` | 9:16 | 80px | mobile-first, maximum height |
| `linkedin_post` | 16:9 1200×627 | — | single-image post |
| `linkedin_article` | 16:9 1920×1080 | — | article header |

Default to `linkedin_carousel_portrait` unless the user says otherwise. All
three carousels are 15 credits per slide. State that cost in the same message
as the run (a 7-slide carousel = 105): announce it, don't ask permission. If
*you* chose the slide count rather than the user, confirm that number with them.

## Intake

1. **What's the point of view?** LinkedIn rewards a stance, not a summary. Get
   one sentence of opinion, not a topic.
2. **How many slides?** 6-8 is the sweet spot; match any promised count. Max 10.
3. **Personal brand or company brand?** Company → `brand_id` + `embed_logo`.
   Personal/founder posts often read better without a logo on every slide.
4. **Is there a CTA?** Newsletter, demo, comment-bait → `include_cta: true`.

## The canonical run

`chat` message from an idea:

> Create a 7-slide LinkedIn carousel (linkedin_carousel_portrait): "Most B2B
> pipelines die at handoff, not at close: 6 fixes for the sales-to-CS
> transition". Minimal style, with a CTA slide, using our brand kit.

From content the user already wrote (a post, a newsletter section): paste it
into the `chat` message as the source and ask for the carousel and slide count.

Then `confirm_generation` (`brand_id`, `visual_style: "minimal"`,
`include_cta: true`) and poll `get_generation`.

## Content shaping for LinkedIn specifically

- **Slide 1 is a claim, not a title.** "Your pipeline is leaking at handoff"
  beats "Sales to CS handoff". The cover decides whether anyone swipes.
- **One idea per slide, in professional register.** No hype, no emoji walls.
  `minimal` or `corporate` matches the room; `bold` only for contrarian posts.
- **Keep text off the bottom edge.** The pipeline handles the safe zone, but
  don't request bottom-anchored text; LinkedIn's UI will cover it.
- **Last slide earns the follow:** `include_cta`.
- **Don't art-direct slide by slide.** Do carry a stated brand look through.

## After generation

- **Deliver it as a *document* post (PDF)**, slides in order: that is
  what LinkedIn treats as a carousel. `export_visuals` with `format: "pdf"`
  produces it in one step.
- **Also write the post caption**: the visuals don't carry the algorithm, the
  first two lines of the caption do. That's your job, not Canvora's.
- Fix one slide with `edit_image` (3 credits), never a full regeneration.

## Quality checklist

- [ ] Portrait 4:5 unless the user's template says otherwise
- [ ] Cover states a claim; 6-8 slides; count matches any promise
- [ ] Professional register; `minimal`/`corporate` unless the take is contrarian
- [ ] `include_cta` when there's an ask
- [ ] Delivered as a PDF document post, slides in order
- [ ] Caption written alongside the visuals
