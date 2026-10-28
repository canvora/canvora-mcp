---
name: data-infographic
description: Turn data, comparisons, processes and timelines into explanatory visuals with Canvora — process flows, comparison charts, timelines, stat cards, checklists and long-form infographics. Use when the user has numbers, steps, a before/after, a roadmap, or asks for an infographic or diagram.
---

# Infographics and explanatory visuals

The format is decided by the *shape of the information*, not by the platform.
Get that mapping right and the output is good on the first run. These formats
are the least discoverable in the catalog and among the most useful.

The generate loop and credits: see the `canvora` skill.

## Shape → format

| The information is… | Format | Size |
|---|---|---|
| A sequence of steps | `process_flow` | 3:4 1200×1600 |
| A vs B, or before/after | `comparison_chart` | 4:3 1200×900 |
| Events over time, a roadmap | `timeline` | 3:4 1200×1600 |
| A mix of stats and points | `infographic` | 4:5 1080×1350 |
| A long scroll of many points | `infographic_long` | 2:3 1080×1620 |
| A list to tick off | `checklist` | 4:5 |
| One number that matters | `stat_card` | 1:1 |
| Two options side by side, social-sized | `comparison_card` | 4:5 |
| Branching, non-linear relationships | `mind_map` | 4:3 1600×1200 |
| A single how-to tip | `tip_card` | 1:1 |

Rule of thumb: **linear → `process_flow`; two-sided → `comparison_chart`;
dated → `timeline`; one number → `stat_card`; everything else → `infographic`.**

## Intake

1. **Show me the data.** Ask for the actual numbers, steps or rows, not a
   description of them. This is the one skill where vagueness in equals garbage
   out.
2. **What's the takeaway?** One sentence. It becomes the headline and decides
   what gets emphasised.
3. **Where does it go?** Social → the 4:5 formats. Deck or doc → the 3:4/4:3
   ones. Both → generate both; they're 10 credits each.
4. **Brand kit** → `brand_id`.

## The canonical runs

`chat` messages (paste the data itself):

> Make a process_flow from these steps, keeping the wording exactly: [steps]

> Make a comparison_chart and a comparison_card from this table: [rows]

> Make a stat_card: "73% of returns happen in the first 48 hours".

> Make a timeline of these milestones: [milestones]

Then `confirm_generation` with `use_exact_content: true` and `brand_id`, and
poll `get_generation`.

These are single-image formats at 10 credits each: tell the user the total in
the same message as the run, announcing it rather than asking permission.

## The rule specific to data: exact content

Numbers, labels, step names and dates must survive the pipeline unchanged, so
set `use_exact_content: true`. **A rephrased statistic is a wrong statistic**;
this matters more here than anywhere else in Canvora.

Related: don't ask the model to *derive* data. If the user says "make a chart
of our growth", get the actual figures first. Canvora renders what you give it;
it is not a spreadsheet.

## Craft notes

- **Keep labels short.** ≤6 words per step or row. Long labels are the #1 cause
  of cramped, unreadable infographics.
- **One takeaway per visual.** Two competing messages → two visuals.
- **Style:** data reads best as `minimal` or `corporate`; consumer-facing
  explainers as `playful`; reports as `modern`.

## Delivery

- Read the numbers back to the user against the source before they publish.
  A rendering error in a statistic is the worst failure mode in this skill.
- Wrong label or figure? `edit_image` with `operation: "text"` and an
  instruction like "change 73% to 78%": 3 credits, design preserved.

## Quality checklist

- [ ] Format matches the information's shape
- [ ] Real data supplied, never invented
- [ ] `use_exact_content` set so figures and labels survive verbatim
- [ ] Labels ≤6 words; one takeaway per visual
- [ ] Numbers verified against the source before delivery
