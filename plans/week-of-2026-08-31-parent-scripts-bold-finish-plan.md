# The parent scripts get the child's bold finish

Justin, 2 September 2026, with the child's Printed! screen: "make sure the
scripts and cards on parent screen have this finish you did on kids app,
looks super good, but use our chosen colours. Looks great how it fills the
screen."

## What the finish is

From the child's print page and the happy news bits: a 2 to 2.5px ink edge
on every card, a hard ink ledge (0 4px 0 or 0 5px 0 ink) instead of a soft
blur, Nunito 900 set big, a full width colour band with white words for a
state (the green Printed! bar), butter for the thing to tap. The parent
keeps its calmer register: no smiley dots, no stickers, no scatter. The
energy comes from the edges, the ledges and the type, in the parent's own
tokens (butter, ink, cream, retro green, the stage pastels).

## Where it lives

- `components/scripts/card-system.ts`: the one card grammar the detail page
  already shares. `card`, `sheet`, `sheetBand`, `stepCircle`, `sheetBody`
  move to the bold finish, and three new exports carry the rest: `band`
  (a full width colour band, green or butter), `chunky` (the button) and
  `pill` (the chip). Changing this file restyles most of the detail page.
- `components/scripts/ScriptReader.tsx`, `ScriptDepth.tsx`,
  `ScriptStatusButtons.tsx`, `ScriptHelpPrompt.tsx`, `MarkReadOnEnd.tsx`,
  `ScriptFinder.tsx`, `ScriptDetailView.tsx`: inline styles swapped for the
  grammar. Used it and Read become green bands with white words.
- `app/(dashboard)/dashboard/scripts/page.tsx`: the recommended hero, the
  also picked shelf, the topic list, the chips, the folded stages and the
  paywall cards on the same grammar. The hero keeps ink words on butter.
- `app/(dashboard)/dashboard/scripts/category/[slug]/page.tsx`: the cards.
- `components/ui/BrowseTile.tsx`: the shared library tile (scripts and
  lessons) gets the ink edge and ledge, so "cards on the parent screen"
  match wherever they are.
- `components/ui/TakeoverReader.tsx`: the mobile bar's edge goes ink.

## Checks

- `/ref-script-premium` at iPhone and desktop widths, before and after.
- The scripts library at both widths (the tile grid, chips, hero).
- tsc, wiring, dash grep. review.md design test: tokens only, no dashes.
