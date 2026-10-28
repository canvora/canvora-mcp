---
name: instagram-carousel
description: Create high-performing Instagram carousels with Canvora — right format, right slide count, hook-first content shaping, and the correct refine workflow. Use when the user wants an Instagram carousel, multi-slide IG post, swipe post, or educational/listicle content for Instagram.
---

# Instagram carousel creation

Map the user's intent onto the right Canvora levers. Canvora's carousel
pipeline owns the design *execution*: layout, composition, imagery, visual
variety per slide. Your job is the content and the parameters. The generate
loop, credits and refinement: see the `canvora` skill.

## Intake: ask only what you can't infer

Usually you already know the topic. Then you need at most two more things:

1. **How many items?** ("5 tips" → 5, plus a cover if they want one). If they
   don't say, use 6.
2. **Whose brand?** If a client or company is named, `list_brands` and use the
   kit. If they have no kit, don't ask again.

Anything else (style, language, CTA): infer it and state your assumption in
one line when you report back. Do not run a questionnaire.

## The rule that matters

**Don't art-direct slide by slide.** Do not prescribe per-slide layouts, color
values or illustration details; over-specified briefs fight the tuned format
pipeline and produce worse, samey output.

**But do carry the user's stated look.** If they said "black and white with big
type" or "hand-drawn", pass it through as one line of overall direction. It is
honoured, and dropping it is the more common and more damaging mistake. The
line is: *overall aesthetic = yes, slide-by-slide instructions = no.*

## Parameter mapping (your actual job)

| User intent | Lever |
|---|---|
| Any IG carousel | format `instagram_carousel_portrait` (1080×1350; outperforms square for reach). Square (`instagram_carousel`) only if they ask for it. |
| "N tips/mistakes/steps" | N slides (or N+1 with a cover). Never leave a promised count unmatched. No count promised → 6. |
| A named client or brand | `brand_id` from `list_brands`; mandatory when a kit exists. Add `embed_logo: true` to stamp the logo. |
| Tone words | `visual_style`: educational/punchy → `bold`; clean/professional → `modern` or `minimal`; luxury/coaching → `elegant`; consumer/fun → `playful`. |
| No tone signal at all | `modern`, chosen deliberately. |
| "End with a follow/save CTA" | `include_cta: true` (the final slide becomes the call to action) |
| Exact wording required (quotes, taglines) | paste the text and set `use_exact_content: true` |
| User gave a topic only | describe the topic; Canvora develops the substance |
| User gave finished content | paste it as the source; wording is respected |

## Content shaping (what goes in the brief: copy craft, not design)

- **Hook first:** phrase the idea as the specific promise the cover should
  carry: "5 client-content mistakes that kill engagement", not "content
  mistakes". Numbers and specificity win.
- **One idea per item:** if the user gave content, structure it as a clean list
  (one point per item, ≤25 words). The pipeline maps items to slides.
- **End intent:** if they want a save/follow CTA, use `include_cta` rather than
  describing it in prose.

Example `chat` message:

> Create a 6-slide Instagram carousel (instagram_carousel_portrait): "5
> client-content mistakes that kill engagement", for freelance social media
> managers. Cover plus one mistake per slide, bold style, using our brand kit.

Then `confirm_generation` with `brand_id`, `embed_logo: true`,
`visual_style: "bold"`, `include_cta: true`, and poll `get_generation`.

State the cost in the same message as the run: 15 credits per slide, so 6
slides is 90. Announce it, don't ask permission. Confirm the *number* only when
you picked it (the 6 default), not when they said "5 tips".

## After generation

- **Keep the slides in the order `get_generation` lists them** (that is slide order).
- **`partial` status?** Some slides were blocked or failed, and those credits
  were refunded. Say so and offer to re-run the missing slides; don't hand over
  a 4-slide carousel that was meant to be 6 without explaining.
- **Different look wanted?** `create_variation` gives fresh takes (15 credits
  per slide, for every slide). Do NOT regenerate with a more prescriptive brief.
- **One slide needs a fix?** `edit_image` on that slide: targeted, design
  preserved, 3 credits. Always the first thing to try.

## Quality checklist

- [ ] Portrait format; slide count matches the promised item count
- [ ] Brand kit applied when one exists (plus `embed_logo` if they want the mark)
- [ ] Brief carries hook + content items + the user's stated look; no invented art direction
- [ ] Style chosen deliberately
- [ ] Plan shown to the user before `confirm_generation`
- [ ] Slides presented in order; partials reported
- [ ] Revisions via `edit_image` (3 cr) or `create_variation`, never regeneration
