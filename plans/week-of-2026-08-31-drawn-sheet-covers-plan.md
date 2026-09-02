# Drawn sheets: a filled in, coloured example on the front of every tile

Justin, 2 September 2026, with the child's Printables tab: "new printables
need a better front page display on app, misaligned. We need a filled out,
coloured in example. Check all new ones as they look messy."

## What is wrong (traced from his screenshot)

- The six drawn sheets show the WHOLE blank A4 shrunk into a phone tile:
  brand header, ribbon, kicker, footer, all at a fifth of their size. Every
  line of text is unreadable, the tile looks like a form, and the bottom of
  the page is cut off because the tile box is a touch shorter than the page.
- The Ask sticker sits across the ribbon title.
- Beside them, the image sheets (Month of Stories, the colour in monster)
  show one big coloured picture, which is what a tile is for.

## The build

1. Example mode on the sheets. `DrawnSpec.example` puts the sheet in a
   filled in, coloured in state: every drawing gets crayon colours, every
   line has something written on it in a child's hand, ticks are ticked, the
   step or slice they are on is coloured. One context in HappyPaper, read by
   the drawing primitives, and each sheet passes its own sample words. The
   print stays blank: example is never on for a print.
2. `DrawnCover`: the cover crop. A per sheet window onto the paper (the
   wheel, the bed, the jars, the hand, the road, the postcards) scaled so it
   fills the tile like an image with object fit cover. Used on the child's
   grid tile, the parent's grid card and the quest screen thumbnail. The tap
   through still opens the real blank paper, which is the print.
3. On the sheet screen, a "See one filled in" toggle above the paper, so a
   child can see what theirs could look like. The print is unaffected.
4. Dev fixture: /dev/drawn-sheets?example=1 (all six filled in) and
   ?covers=1 (the six tiles at phone width).

## Checks

- Phone width screenshots of the Printables grid tiles.
- Each example sheet at full size, nothing overflowing.
- Print PDF of one sheet still one page and still blank.
- tsc, wiring, dash grep, checkin guard.
