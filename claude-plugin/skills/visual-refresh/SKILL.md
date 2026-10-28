---
name: visual-refresh
description: Change, fix, re-roll or version visuals that Canvora already produced — targeted edits, variations, localization, edit history and revert — without paying to regenerate. Use when the user wants to tweak, fix, restyle, translate or undo an existing visual.
---

# Refining what already exists

The most expensive mistake with Canvora is regenerating. A new generation costs
full price, throws away a design the user already liked, and comes back
different in ways they didn't ask for. Almost every "can you change X" is a
3-credit edit. The generate loop and credits: see the `canvora` skill.

## Pick the right operation

| The user says | Tool | Cost |
|---|---|---|
| "make the headline bigger", "change 73% to 78%", "warmer colors", "move the logo" | `edit_image` on one visual | **3** |
| "same thing in Spanish" | `localize_generation` | 10 per visual per language |
| "show me some other options" | `create_variation` | 10 per image (15 per carousel slide) |
| "go back to the previous one" | `revert_edit` | **free** |
| "what did we change?" | `get_edit_history` | free |
| "completely different message" | a new generation | full price: the only honest case |

If you're unsure between an edit and variations: does the user want *this*
design fixed, or a *different* design? Fixed → edit. Different → variations.

To find the visual: `get_generation` (omit the ID for the most recent one)
lists each output, numbered, with its format and image URL.

## Targeted edits

`edit_image` is two steps:

1. Call it with `operation` and `instruction`, and point at the visual with its
   image URL as `source_image_url` (or `format` when the user names a platform,
   e.g. `"instagram_post"`). It returns Canvora's edit plan and spends nothing.
2. Show the user the plan. Then call again with `confirmed: true` and the
   `confirmed_instruction` from step 1.

| Operation | Covers |
|---|---|
| `text` | change, fix, translate, resize or restyle text |
| `colour` | colours, background, gradients, theme |
| `layout` | move, resize, align or remove elements, spacing, decorative shapes or icons |
| `brand` | add, move or replace the logo; apply brand colours or fonts |

- **One change per edit.** "Bigger headline and make it blue" is two edits, and
  each preserves more of the design than a combined instruction would.
- **Be concrete:** name *which* text or *which* element. A vague instruction
  comes back asking for clarification.
- Changes to what the image depicts (the subject, people, products, the scene)
  aren't available through this connector; the edit comes back with a link to
  the Canvora editor. Pass the link on rather than trying another route.

## Whole-generation operations

- `localize_generation` with the `generation_id` and `languages`: every visual,
  new language, layout untouched.
- `create_variation` with the `generation_id` and `count`: fresh takes on the
  same content, for **every** visual (`count` is per visual).

**Always state the cost in the same message as the run**: announce it, don't
ask permission. Variations with `count: 2` on a 5-slide carousel is 10 new
images at 15 credits = 150. That surprises people. When you picked `count`
yourself, confirm that number first. Both return new generation IDs; poll them
with `get_generation`.

Both need the Visual Editor feature (Starter plan or an active Campaign Pack).
A 403 is a plan limit, not an auth failure: say that, don't retry.

## Versioning

- `get_edit_history` with the `generation_id` and `output_index` (0 = the first
  listed visual): every version of one visual
- `revert_edit` with the `generation_id`, `output_index` and `edit_id` (omit
  `edit_id` for the original): go back, free

This is the safety net that makes editing worth trying: an edit the user
dislikes costs 3 credits and can be undone. Say that when they hesitate.

## When regeneration IS correct

Be honest about the three cases where refining won't help:

1. The **message** is wrong, not the design.
2. They need a **different format or size**: an edit can't reflow a 1:1 into 9:16.
3. The generation came back `partial` and slides are **missing**: the failed
   ones were refunded; generate those specific slides again.

## Quality checklist

- [ ] `edit_image` tried before anything more expensive
- [ ] The right visual targeted (`source_image_url` or `format`); the right generation for localize/variations
- [ ] One change per edit; the edit plan shown before confirming
- [ ] Cost stated before `create_variation` / `localize_generation`
- [ ] 403 explained as a plan limit
- [ ] Revert offered so the user knows edits are reversible
