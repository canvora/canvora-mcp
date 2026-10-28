---
name: multilingual-campaign
description: Turn one Canvora generation into a native multilingual campaign — generate once, convert per language with layout-preserving localization. 150+ languages including RTL (Arabic, Hebrew, Urdu) and CJK. Use when the user wants social visuals in multiple languages, localized campaigns, translated posts, or content for LATAM/MENA/European/Asian markets.
---

# Multilingual campaign creation

The canonical flow: **generate the campaign once, then convert it per
language.** Canvora's localization converts the finished visuals image to
image: layout, colors, fonts and imagery stay exactly the same; only the text
changes language. Design effort happens once, in the master; every language
inherits it. The generate loop and credits: see the `canvora` skill. Don't
art-direct slide by slide, but do carry through any overall look the user has
stated.

## The flow

1. **Generate the master once** (usually in the user's primary market's
   language) with the normal loop: `chat` → show the plan →
   `confirm_generation` → poll `get_generation` until `completed`.
2. **Confirm the language list with the user**, then call
   `localize_generation` with the master's `generation_id` and `languages`
   (up to 10 per call, named the way the market means them, e.g.
   "Brazilian Portuguese").
3. It returns one generation ID per language: poll each with `get_generation`.

`localize_generation` converts ALL visuals in the generation: 10 credits per
visual per language (a 6-slide deck into Spanish = 60). To convert only ONE
visual out of a multi-visual generation, use `edit_image` on that visual with
`operation: "text"` and "Translate all visible text into Spanish".

Add up the whole plan: master + (visuals × 10 × languages). State that total in
the same message as the run: announce it, don't ask permission (the language
list is the thing you confirm, not the price).

## Briefing the master so conversions survive

- **Short text:** translations expand (German/Portuguese commonly +20–35%). Keep
  master slide text ≤20 words per slide; overflow in the converted versions is
  the #1 multilingual failure.
- **Pin what shouldn't move:** brand names, product names and campaign hashtags
  stay in the source language; say so in the brief ("keep 'Acme' and
  '#AcmeLaunch' untranslated").
- **Language precision at conversion time:** "Brazilian Portuguese" vs
  "Portuguese"; Simplified vs Traditional Chinese. Pass what the user's market
  actually means.
- **RTL check:** Arabic/Hebrew/Urdu conversions handle text direction
  automatically; still check reading order on multi-column layouts before
  shipping.

## When NOT to localize (the exception)

If a market needs different *content* (a different hook for Brazil than for
Germany, market-specific examples or CTAs), that is not a conversion job. Run a
separate generation per market with its own brief, written in that market's
language (a Spanish brief yields a natively Spanish generation), or set
`language` on `confirm_generation`. Same message everywhere → localize;
different message per market → separate generations.

## Delivery

- Group results by language, slides in their listed order within each.
- **Captions are not visuals:** write each language's caption natively (your
  job); never translate the master caption literally.

## Campaign patterns

- **Market test:** master → localize into 3 candidate markets → post all →
  double down where engagement is highest. Cheap enough to treat languages as
  A/B variants.
- **The multilingual flex post:** one design in 4+ languages side by side is
  itself strong social content.
- **Agency onboarding:** brand kit per client once → every campaign ships in
  all their market languages by default.

## Quality checklist

- [ ] Master generated once; languages produced with `localize_generation` (not regeneration)
- [ ] Master slide text ≤20 words; brand/product names pinned untranslated
- [ ] Language list confirmed with the user before converting
- [ ] RTL outputs reviewed for reading order
- [ ] Per-language captions written natively; slides in listed order
