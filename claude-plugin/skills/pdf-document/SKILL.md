---
name: pdf-document
description: Create multi-page PDF documents with Canvora — brochures, reports, one-pagers, company profiles, proposals, menus, catalogs, ebooks, worksheets and cheat sheets. Use when the user wants a PDF, a printable document, a brochure, a lead magnet, or anything paginated rather than a social post.
---

# Multi-page documents and PDFs

Canvora has a dedicated **document mode**: `document_page` runs through the
structured pipeline with print layout rather than slide layout: margins,
reading order and typography built for a page, not a screen. This is the
format behind "make me a brochure / report / company profile / proposal /
menu / catalog / lead magnet". Nobody guesses the ID, so you have to know it.

The generate loop and credits: see the `canvora` skill.

## Format map

| Want | Format | Notes |
|---|---|---|
| A multi-page document of any kind | `document_page` | 3:4, 816×1056 (US Letter portrait). **Carousel format: slides = pages.** 15 credits per page. |
| A single-page one-pager | `one_pager` | 816×1056, single image, 10 credits |
| An exec summary page | `executive_summary` | 816×1056 |
| A cheat sheet / reference card | `cheat_sheet` | 816×1056 |
| A worksheet / workbook page | `worksheet` | 3:4 1200×1600 |
| An ebook / report cover | `ebook_cover` | 3:4 1600×2133 |
| A visual mind map | `mind_map` | 4:3 1600×1200 |

Rule: **more than one page → `document_page` with a page count.** Exactly one
page → the specific single-page format. Cover + pages → `ebook_cover` together
with `document_page` in the same request.

## Intake

1. **What is the document?** (brochure, report, proposal, menu, profile…):
   this goes into the brief verbatim; the pipeline uses it to pick the layout
   language.
2. **How many pages?** If unknown: brochure 4, company profile 6, report 8,
   menu 2. Max 10 per run; for longer, run consecutive generations.
3. **Source?** The user's own copy or a document's text (pass it in full), a
   public URL, or a topic.
4. **Brand kit?** Documents are where an off-brand result is most obvious:
   `brand_id` + `embed_logo: true`.

## The canonical runs

`chat` messages:

> Create a 6-page company brochure (document_page), corporate style, from this
> copy: [their copy]

> Create a lead magnet: an ebook_cover plus 4 document_page pages on "The 2026
> SEO audit checklist for small e-commerce stores", ending on a CTA page.

> Lay out this restaurant menu as a 2-page document (document_page). Keep every
> dish name and price exactly as written: [menu text]

Then `confirm_generation`: `brand_id`, `embed_logo: true`, `include_cta: true`
for brochures, proposals and lead magnets, and `use_exact_content: true`
whenever facts, prices or legal text must survive. Poll `get_generation`.

Documents are 15 credits per page: say the total in the same message as the
run (a 6-page brochure = 90), announcing it rather than asking permission. When
the page count came from the defaults above rather than from the user, confirm
that number first.

## Things that ruin documents (avoid)

- **Paraphrasing the source.** Documents carry facts: prices, names, figures,
  legal lines. Pass the text in full, and set `use_exact_content` whenever the
  wording is not yours to change.
- **Treating pages like slides.** Don't ask for a "hook" page. Documents open
  with a title or cover and proceed in reading order.
- **Forgetting the CTA page.** Brochures, proposals and lead magnets should end
  on one: `include_cta`.
- **Landscape.** `document_page` is portrait by design. If they want landscape,
  they want a deck: use the `pitch-deck` skill.

## Delivering the PDF

The user asked for a *PDF*, not for images. Finish the job:
`export_visuals` with `format: "pdf"` returns the assembled multi-page PDF, pages
in order.

## Quality checklist

- [ ] `document_page` with the page count (not separate runs per page)
- [ ] Source passed in full; `use_exact_content` when facts/prices/legal text must survive
- [ ] Brand kit + logo applied
- [ ] `include_cta` on anything persuasive
- [ ] Delivered as an actual PDF via `export_visuals`
