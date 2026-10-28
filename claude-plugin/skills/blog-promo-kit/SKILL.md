---
name: blog-promo-kit
description: Turn one published article URL into its full visual kit with Canvora — blog header, Open Graph share card, and the social promo set that distributes it. Use when the user publishes a blog post, wants a featured image, an OG image, or asks how to promote an article.
---

# Blog and article promo kits

One URL, one generation, the whole distribution set. Canvora extracts the
article itself, so every asset carries the same argument and the same look,
which is exactly what hand-assembling these one at a time fails to do.

The generate loop and credits: see the `canvora` skill.

## The two jobs, don't confuse them

**On-page assets** (the post needs these to ship):

| Format | Size | Role |
|---|---|---|
| `blog_header` | 16:9 1200×675 | the in-post header image |
| `blog_featured` | 16:9 1920×1080 | featured/hero image in the CMS |
| `og_image` | 16:9 1200×630 | the social share card: the one everyone forgets |
| `web_banner` | 21:9 1920×550 | category/section banner |

**Off-page distribution** (the post needs these to travel):
`linkedin_post`, `instagram_carousel_portrait`, `twitter_post`, `quote_card`,
`stat_card`.

`og_image` is the highest-leverage asset here: it is what appears in every
share, every Slack paste, every LinkedIn link preview. If the user asked only
for "a blog image", ask whether they have an OG card; usually they don't.

## Intake

1. **The published URL** (public and live: extraction fetches it).
2. **Do they need on-page, distribution, or both?** Default: both.
3. **Which channels do they actually post to?** Don't generate a TikTok asset
   for someone who only uses LinkedIn.
4. **Brand kit** → `brand_id` (+ `embed_logo` for the social assets; headers
   usually read better without).

## The canonical runs

`chat` messages:

> From https://example.com/blog/post, create blog_header, og_image,
> linkedin_post and a 6-slide instagram_carousel_portrait, using our brand kit.

> From https://example.com/blog/post, create blog_featured and og_image.

> From https://example.com/blog/post, create linkedin_post, twitter_post and a
> quote_card.

Then `confirm_generation` with `brand_id` and poll `get_generation`.

Cost check: the first example is 3 singles (30) + a 6-slide carousel (90) =
120 credits. Say it in the same message as the run: announce it, don't ask
permission. If the slide count was your call rather than the article's, confirm
that number.

## Craft notes

- **Let the URL do the work.** Don't paste the article into a vague summary:
  extraction keeps the structure, the stats and the pull quotes.
- **The carousel is the post's argument, not its summary.** If the article has
  a clear list ("7 signs your pricing is wrong"), match the slide count to it.
- **`quote_card` / `stat_card` for the one line worth lifting.** If the user
  names the quote, give it verbatim and set `use_exact_content: true`.
- **Style:** match the publication's voice: `minimal` for technical writing,
  `bold` for opinion, `elegant` for editorial work.
- Same rule as everywhere: no slide-by-slide art direction, but carry the
  user's stated look through.

## Delivery

- Return assets grouped **on-page** vs **distribution**, with dimensions, so
  the user knows what goes in the CMS and what goes in the scheduler.
- The output URLs are stable; they can go straight into a posting tool.
- Keep carousel slides in the order `get_generation` lists them (that is slide order).

## Quality checklist

- [ ] `og_image` included unless they explicitly have one
- [ ] Only the channels they use
- [ ] Carousel slide count matches the article's list, when it has one
- [ ] Brand kit applied
- [ ] Cost stated before the run; assets grouped on delivery
