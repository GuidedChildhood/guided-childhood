# Batch 2: the shape, and the boxes that are actually nested

18 September 2026. Session 0u09q9. Schools app only.

Justin, 18 September 2026: "Only school service thou sbd bit break wiring."
Read as: the schools app only, and it must not break the wiring. Both are
constraints on this batch and both are enforced below rather than promised.

## The premise was wrong, and the measurement says so

Batch 2 was announced as "delete most of the boxes", on my reading that the app
had the nested card look. So the first thing done was to count, in the rendered
DOM at 1440 rather than in the JSX, because a border written once in a
component is forty boxes on screen and a regex cannot tell the difference.

A first pass counted 1,062 boxes with 67 percent nested and looked damning. It
was wrong: it counted every table cell with a rule as a box. A table with rules
is a table.

Counting CARDS instead, which is a div or a section drawn as a surface, wider
than 120px and taller than 40px, excluding tables, buttons and inputs:

```
  home             0 cards     0 nested        philosophy      21 cards   0 nested
  pricing          8 cards     0 nested        hub-rshe         5 cards   0 nested
  curriculum      57 cards    25 nested        supplies         3 cards   0 nested
  hub             14 cards     0 nested        pilot            1 card    0 nested
  lesson          34 cards     8 nested (2 deep)  print-index   7 cards   0 nested
  TOTAL          150 cards    33 nested (22 percent)
```

**The schools app does not have a runaway nested card problem.** Eight of the
ten routes have none at all. It is concentrated on exactly two: the curriculum
page and the lesson page. So this batch is not the sweep that was announced,
and saying so is cheaper than doing the sweep and discovering it afterwards.

## What IS wrong, and it is bigger than the nesting

**The schools app uses none of the shape tokens. Not one.**

```
  borderRadius via var(--radius-*)     0
  borderRadius hardcoded             126   in ten distinct values
  var(--edge)                          0
  var(--lift)                          0
```

The SHAPE block landed in `shared/tokens.css` on 13 September and its own words
are "Four radii, one edge, three lifts. Nothing else. Change these eight lines
and the whole platform moves together, which is the point of having them." The
schools app never adopted it, so the platform cannot move together, and the ten
radii are 10, 12, 14, 16, 18, 20, 22, 100 and two markers.

And the same border is drawn at two weights for one job: `1px solid
var(--border)` in 18 files and `1.5px solid var(--border)` in 15 of them.

So batch 2 is: adopt a decision already taken, and unnest the two routes that
genuinely have the problem. That is smaller, safer and more true than the sweep.

## The wiring rule, which is how the second constraint is kept

**Never remove an element. Only its decoration.**

Every div, every Link, every form, every handler stays exactly where it is.
What changes is `border`, `background`, `boxShadow` and `borderRadius`. A card
that stops looking like a card still submits the same form to the same route
and still carries the same href. There is no version of this batch that can
move a route, a table, the HMAC cookie or the letterbox, because nothing that
carries behaviour is touched.

## The mapping

| From | To | Why |
|---|---|---|
| 100px | `var(--radius-pill)` | a capsule |
| 18, 20, 22px | `var(--radius-card)` | the surface a thing sits on |
| 15, 16, 17px | `var(--radius-btn)` | buttons and inputs |
| 10, 12, 14px | `var(--radius-tile)` | the small tile inside a card |
| 1.5px solid var(--border) | `1px solid var(--border)` | one weight for one job |

**Left alone, each for a reason.** `50%`, because the SHAPE block already says
a circle is a circle. Radii under 8px, which are all tick boxes and 16px square
markers, a shape the four card radii were never meant to cover. The print
sheets, fenced in batch 1 and still fenced. The parents and child apps, which
this batch does not touch at all.

## What the second measurement settled, and it ended the batch

Printing what those 33 "nested cards" actually are finished the argument.

**All 25 on the curriculum page are the same element**: the "Ready to teach"
link at the foot of each module card, coloured by its Planet Friend and styled
as a button. The probe missed it because it is an `<a>` rather than a
`<button>`. It is a control, not a card inside a card.

**Of the eight on the lesson page**, three are pills, one is the passport card
itself, and four are the passport area tiles inside it. A tile inside a card is
not a mistake; `--radius-tile` exists in the SHAPE block for exactly that,
described there as "the small tiles inside a card".

**So the schools app has no nested card problem, and batch 2 is half of what
was announced.** The shape adoption is real and large and lands. The box
deletion does not, because there are no boxes to delete. Saying that is worth
more than finding 33 things to change so the batch matches its name.

The probe is kept as `scripts/count-schools-cards.mjs` so the claim can be
re-checked rather than believed.

## Verification

The same bar as batch 1. Both typechecks, every guard by exit code including
`wiring-check.mjs`, frames at 390 and 1440 compared against the batch 1 frames
rather than declared, and the card probe re run so the nesting number is a
measurement at the end and not a hope.
