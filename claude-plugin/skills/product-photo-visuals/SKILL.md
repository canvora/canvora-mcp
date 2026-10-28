---
name: product-photo-visuals
description: Build Canvora visuals around the user's OWN photos — real product shots, team headshots, venue or event photos embedded into the design instead of generic stock imagery. Use when the user has photos to include, wants their actual product shown, or says the visuals must feature their real people or place.
---

# Visuals built around the user's own photos

The difference between a generic AI visual and a usable one is usually whether
the actual product is in it. Canvora composes the user's real photos into a
generated design: the layout, typography and brand styling are generated
around the photo, not pasted on top of it.

The generate loop and credits: see the `canvora` skill.

## Getting the photos to Canvora (up to 5)

Pick the first route that fits:

1. **The photo is already online** (their website, a product page, a CDN): put
   its public `https://` URL straight into `embedding_photos` on
   `confirm_generation`. Nothing to upload.
2. **The photo is a file you can read** (Claude Code, a local folder): shrink it
   first (about 1600px on the long edge, JPEG), then send it to `upload_photo`
   as a `data:image/jpeg;base64,...` URL. It returns a CDN URL for
   `embedding_photos`. JPEG, PNG, WebP and HEIC are accepted, up to 8 MB.
3. **The photo only exists as an attachment in this chat** and you can't read
   its file: don't describe it, redraw it or generate a look-alike. Tell the
   user to upload it at https://canvora.ai/create, where the same request takes
   their photo directly.

Then the normal loop: `chat` (describe the visual and say the photos are the
subject) → show the plan → `confirm_generation` with `embedding_photos` →
poll `get_generation`. Never fire a second `confirm_generation` for the same
job; poll instead.

State the cost in the same message as the run: 10 credits per single visual,
15 per carousel slide. If you chose the slide count rather than the user,
confirm that number first.

## Intake

1. **How many photos, and what's in each?** Tell the pipeline what it's looking
   at ("the blue jar, front label visible", "our head chef in the kitchen").
   A photo with no description gets used generically.
2. **Which photo is the hero?** With multiple photos and multiple slides, say
   which is the cover.
3. **Format and brand**: as normal (`instagram_post`, `ad_square`, a
   carousel…) plus the brand kit.
4. **Must the photo be untouched?** Say so explicitly in the brief. Otherwise
   the model may crop, relight or restyle it to fit the composition.

## What works, what doesn't

**Works well**
- One clear product on a clean background: the pipeline can place and light it
- Food, drinks, packaging, physical goods, venues
- A single person, well lit, facing camera
- Photos where the important part is centred, not at the edge

**Struggles**
- Cluttered scenes with no clear subject
- Faces that must stay pixel-identical: treat close likeness as a review step,
  never assume it. Have the user check before publishing anything with a real
  person in it.
- Text inside the photo (packaging copy, signage): it may be re-rendered
- More than 5 photos in one generation (hard cap)

## Craft notes

- **Name the photo's role in the design**: "product hero on the left, headline
  right", not a full layout spec. One line of placement intent is the sweet spot.
- **Brand kit still matters**: the design around the photo carries the brand.
- **Exact copy:** if the pack copy or price must be legible and correct, put it
  in the text content (with `use_exact_content: true`) rather than relying on
  the photo.
- Everything from the `canvora` skill still applies: keep slide order,
  refine with `edit_image` rather than regenerating.

## Delivery

- Show the user the result next to their original photo and ask explicitly
  whether the product or person reads correctly. This is the one Canvora flow
  with a real-world ground truth to check against.
- Layout or text wrong around the photo? `edit_image` with a `layout` or `text`
  operation: cheap and design-preserving. Changing the photo itself or what it
  shows is done in the Canvora editor (the edit comes back with a link).

## Quality checklist

- [ ] Photos reached Canvora by URL or `upload_photo` (never redrawn from a description)
- [ ] ≤5 photos, each described
- [ ] Hero photo identified for multi-slide work
- [ ] Brand kit applied to the surrounding design
- [ ] User verified the product/person against the original before publishing
