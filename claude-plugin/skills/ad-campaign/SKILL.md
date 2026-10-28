---
name: ad-campaign
description: Produce paid ad creative sets with Canvora — Meta, Instagram, LinkedIn, Google Display and banner placements in one pass, with variants for testing. Use when the user wants ads, ad creative, paid social assets, display banners, or a campaign creative set.
---

# Ad creative sets

Ads fail on placement coverage and on having only one creative to test. Canvora
fixes both cheaply: every placement from one source in a single generation,
then variants. The generate loop and credits: see the `canvora` skill.

## Placement map

| Format | Size | Placement |
|---|---|---|
| `ad_square` | 1:1 | feed (Meta, LinkedIn; the safe default) |
| `ad_portrait` | 9:16 | stories, reels, vertical slots |
| `ad_landscape` | 16:9 1200×628 | link ads, in-stream, LinkedIn sponsored |
| `ad_banner` | 21:9 728×90 | classic leaderboard display |
| `google_display` | 1200×628 | Google Display Network |

**Full coverage = `ad_square`, `ad_portrait`, `ad_landscape`**: three
placements, 30 credits, one consistent look. Add `ad_banner` / `google_display`
only if they actually run display.

Ads are 10 credits per creative. Say the total for the whole plan in the same
message as the run: announce it, don't ask permission. If you decided the
number of angles yourself, confirm that number.

## Intake

1. **What's being advertised?** A product URL is the best input: it carries
   the offer, the proof and the brand voice. Otherwise the offer in one line.
2. **Where does it run?** Meta/IG → square + portrait. LinkedIn → square +
   landscape. Google Display → `google_display` + `ad_banner`. Unsure → the
   three-format set.
3. **Brand kit**: `brand_id` + `embed_logo: true`. Ads without the mark waste the spend.
4. **The offer/CTA**: "20% off first order", "Book a demo". Put it in the
   brief and set `include_cta: true`.

## The canonical runs

`chat` messages:

> Create an ad set (ad_square, ad_portrait, ad_landscape) from
> https://store.example.com/product. Bold style, with a CTA, using our brand kit.

> Create ad_square and ad_landscape ads: "Book a free 30-minute logistics
> audit", for e-commerce ops managers losing money on returns.

Then `confirm_generation` (`brand_id`, `embed_logo: true`, `include_cta: true`,
`visual_style: "bold"`) and poll `get_generation`.

## Getting testable variants (do this properly)

One creative is not a campaign. Two correct ways, in order of preference:

1. **Different angles, separate generations.** Run the same format 2-4 times
   with genuinely different briefs: benefit-led, problem-led, social-proof-led,
   price-led. Creative diversity is what actually moves CTR; one generation
   cannot make N distinct instances of the same format.
2. **`create_variation`** for visual re-rolls of the same message (10 credits
   per new image; `count` applies to every visual in the generation). Use this
   when the copy is right and only the look needs alternatives.

Run angle generations one after another, not all at once.

## Craft notes

- **`bold`** is the right default for promotional creative; `elegant` or `dark`
  for premium/luxury; `minimal` for B2B SaaS.
- **Text-light wins on paid social.** Keep the offer to one line in the brief;
  platforms penalise cluttered creative and so does attention.
- **`use_exact_content`** when legal or pricing copy must appear verbatim.
- Don't art-direct per placement. Do pass a stated brand look once.

## Delivery

- Label each output by placement, not by index: the media buyer uploads them
  into different slots.
- Fix a headline with `edit_image` (3 credits) rather than regenerating a set.
- `export_visuals` with `format: "zip"` hands over the whole set at once.

## Quality checklist

- [ ] Every placement they actually run is covered
- [ ] Brand kit + logo on every asset
- [ ] `include_cta` set and the offer stated in the brief
- [ ] At least 2-3 distinct angles for anything with real spend behind it
- [ ] Outputs labelled by placement
