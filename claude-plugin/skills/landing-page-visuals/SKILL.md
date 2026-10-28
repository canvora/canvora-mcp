---
name: landing-page-visuals
description: Generate visuals for a landing page's sections from its URL — hero, features, process, stats, testimonials, comparison, timeline and CTA imagery, matched to the page's own content. Use when the user wants landing page images, website section visuals, hero images, or asks to "make visuals for my site".
---

# Landing page section visuals

Canvora has a set of landing-page formats sized and art-directed for website
sections. Give it the page's URL and the sections you want, and every visual is
built from the page's own content, in the page's own language.
The generate loop and credits: see the `canvora` skill.

## The section formats

| Format | Section |
|---|---|
| `landingPage-Hero` | 21:9 hero banner |
| `landingPage-Feature` | feature blocks |
| `landingPage-Process` | how it works |
| `landingPage-Showcase` | product showcase |
| `landingPage-UseCase` | use cases |
| `landingPage-Stats` | metrics / proof |
| `landingPage-Testimonial` | quotes |
| `landingPage-Comparison` | vs / before-after |
| `landingPage-Timeline` | roadmap / history |
| `landingPage-CTA` | closing call to action |

The IDs are camelCase with a hyphen: `landingPage-Hero`, not
`landing_page_hero`. Guessing the snake_case version fails.

10 credits per visual. Say the total in the same message as the run, announcing
it rather than asking permission. A whole page can run to 8-10 visuals, so if
they only wanted a hero, settle that first.

## Intake

Usually just: **the URL** and **the brand kit**. Then two judgement calls:

1. **Is the page live and public?** The page has to be publicly fetchable;
   staging sites, localhost and pages behind a login won't work. Ask for the
   public URL.
2. **Which sections?** Look at what the page actually has. Hero and CTA are
   almost always worth it; add Feature, Process, Stats, Testimonial, Comparison
   or Timeline only where the page has that section. FAQ, team, contact, footer
   and logo walls are not visual sections; skip them.

Language is taken from the site itself, so a Spanish page yields Spanish
visuals without you setting anything.

## The canonical runs

`chat` messages:

> Create a landing-page hero (landingPage-Hero) for [the page URL], using
> our brand kit.

> From [the page URL], create landing-page visuals for its sections:
> landingPage-Hero, landingPage-Feature, landingPage-Process,
> landingPage-Testimonial and landingPage-CTA.

Then `confirm_generation` with `brand_id` (and `embed_logo: true` if they want
the mark), and poll `get_generation`.

## After generation

- Hand back **one URL per section**, not a flat list: the user has to place
  these. Label each with its section and format ID.
- A section that looks wrong is an `edit_image` (3 credits), not a re-run.
- Want other options for the whole set? `create_variation`.

## Quality checklist

- [ ] Public, live URL confirmed
- [ ] Only sections the page actually has; hero-only requests stay hero-only
- [ ] Brand kit applied
- [ ] Cost stated before the run; plan shown before confirming
- [ ] Outputs labelled by section, not dumped as a list
