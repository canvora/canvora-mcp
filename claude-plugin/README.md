# Canvora for Claude

Turn any idea, URL, or document into on-brand marketing visuals: social posts, carousels, ads, slides, PDFs and landing-page visuals, in 100+ formats and 150+ languages, matched to your brand kit.

This plugin bundles:

- **The Canvora connector** (`https://api.canvora.ai/mcp`): create, edit, localize, vary and export visuals. You sign in with your Canvora account (OAuth) the first time a tool runs.
- **12 task skills** that tell Claude how to get a great result on the first try:

| Skill | For |
|---|---|
| `canvora` | core: setup, the generate loop, credits, refinement |
| `instagram-carousel` | Instagram carousels and swipe posts |
| `linkedin-carousel` | LinkedIn document carousels, with safe zones |
| `pitch-deck` | pitch, sales and training decks; document → slides |
| `pdf-document` | brochures, reports, one-pagers, menus, ebooks |
| `landing-page-visuals` | a whole page's visual kit from its URL |
| `ad-campaign` | paid social and display ad sets |
| `blog-promo-kit` | header, OG image and promo set from one post |
| `data-infographic` | process flows, comparisons, timelines, stats |
| `multilingual-campaign` | one campaign in many languages, designed natively |
| `product-photo-visuals` | designs built around your own photos |
| `visual-refresh` | edit, vary, localize and revert what exists |

## Install

```
# Claude Code (in Cowork and the Claude apps, add Canvora from the plugin directory)
/plugin marketplace add canvora/canvora-mcp
/plugin install canvora@canvora
```

## Setup

1. Create a free Canvora account at [canvora.ai](https://canvora.ai). Free credits are included, no card needed.
2. The first time Claude uses a Canvora tool, sign in with that account. No API key or setup is needed; it works the same in Claude Code, Cowork and the Claude apps.

Then ask in plain words, for example:

- "Turn https://example.com/blog/post into a 6-slide LinkedIn carousel in my brand."
- "Make a 10-slide pitch deck from this document."
- "Localize my last carousel into Spanish and German."

Visuals cost credits: 10 per image, 15 per carousel or deck slide. Everything you create is saved in your Canvora account.

## Links

- Docs: [canvora.ai/help/integrations/mcp-setup](https://canvora.ai/help/integrations/mcp-setup)
- Support: support@canvora.ai
- Privacy: [canvora.ai/privacy](https://canvora.ai/privacy) · Terms: [canvora.ai/terms](https://canvora.ai/terms)
