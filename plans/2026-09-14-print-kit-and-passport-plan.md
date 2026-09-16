# The print kit and the passport print out (14 September 2026)

Justin, 14 September 2026, with the print room open: run the best design
agents over the print outs (the booklet and the rest) and make them print
formatted, in colour, with the Planet Friends on the page, a finish children
and teachers are amazed by. And somewhere, a print out of the passport as a
task: print, cut out, stick the stickers, with words that say what a child
should know at each stage, super simple and super fun, more engaging the
older the level.

## What exists (read from the code, 14 September)

- Seven print routes per module (`schools/app/print/[module]`: the paper
  pack, the pupil booklet, the knowledge organiser, the teacher overview, the
  learning record, the starter quiz, the exit quiz) and the print room
  (`schools/app/print/page.tsx`). All of them black and white: boxes, write
  lines, mono eyebrows, one brand footer. 783 lines in all.
- The art already exists and costs nothing: every Planet Friend has a cutout
  and three expression stills (happy, wave, thinking) on the CDN, with an
  accent, a soft tint and an ink colour in `shared/schools-curriculum.ts`
  (`CHARACTERS`), and DiGi is the star SVG. No new images; nothing spends a
  credit.
- The register ladder by key stage (`shared/friend-register.ts`): bouncy for
  EYFS and KS1, playful for KS2, level for KS3, still for KS4 and KS5.
- The passport: five stages with a stamp friend and a page name
  (`shared/passport-stages.ts`), four areas in a fixed order
  (`shared/passport-areas.ts`), one area per module by hand, the stage
  pastels as tokens (`--stage-1` to `--stage-5`). A module row carries the
  words a passport can print: `single_action_outcome` ("I can..."), the
  `i_can` statements, the keywords, the commitment stem, the parent note and
  the home code.
- Print rules in `schools/app/schools.css`: A4, 12mm top and bottom, 14mm
  sides, `gc-avoid-break` on every card, headings never orphaned.

## The design: the print kit

**The signature.** The friend is on the page with you. Every sheet a child or
a teacher holds carries the key stage's own friend, in colour, doing
something on that page: waving on a cover, thinking beside a question,
happy on a finished record, holding the stamp ring on a passport page. The
friend demonstrates; it never decorates.

**Colour that photocopies.** Colour from the friend: its soft tint as the
header band and the sticker fill, its accent as 2px rules, chips and the
name, its ink for words on the tint. Body text is always ink. No text on an
accent. Every box keeps a 1.5px ink border, so a black and white copy keeps
the structure and a colour print keeps the joy. No gradients anywhere.

**The register in print.** The same ladder as the wall, so a Reception sheet
and a Year 11 sheet are the same scheme and never the same page:

| Register | Key stages | On paper |
|---|---|---|
| bouncy | EYFS, KS1 | One idea per page, 22px words, giant boxes to draw in, stars to colour, the friend at 60mm |
| playful | KS2 | Cards to cut, tick rows, a verdict strip, the friend at 40mm |
| level | KS3 | Two columns, cleaner rules, the friend at 28mm beside the question |
| still | KS4, KS5 | Editorial: dense grids, quiet colour, the friend as an 18mm mark on the first page only |

**Type.** Nunito 900 for titles, Nunito for the words, IBM Plex Mono for the
eyebrows and the page furniture, exactly as the site. Sizes step up with the
register rather than with the page.

**The pieces** (`schools/components/print/`): `PrintSheet` (the A4 page
with the brand band and the page footer), `FriendHeader` (the tint band with
the friend, the eyebrow, the title and a name line), and the primitives
`Sticker`, `Stamp`, `CutLine`, `FoldLine`, `WriteLines`, `BigBox` and
`TickRow`. One `printRegister(keyStage)` decides the sizes.

## The passport print out

**Where.** `/print/passport` lists the editions; `/print/passport/[stage]`
prints one: First steps (Pebble, EYFS and KS1), Good habits (Bloop, KS2),
Making choices (Orbit, KS3) and Ready at sixteen (Nova, KS4), the four pages
the school scheme actually fills (explorer is folded into shaper the way the
code already does, and KS5 sits after the passport). Linked from the print
room, the hub passport page and every module's paper pack.

**Sheet A, the one sheet passport.** One A4 sheet, landscape, three folds and
one cut, and it is an eight page booklet the size of a real passport: the
cover (the stage's page name, the friend, "This passport belongs to"), a page
that says what this page is for, one page per area with a stamp ring and the
words of what a child on this page should know (the `I can` line of every
module on the page, in that area, straight from the curriculum, never
invented), the seal page ("when every ring has its sticker, the page is
full") and the back cover with the home code line and the brand. The top
row of panels prints upside down so the fold works; the render checks it.

**Sheet B, the stickers.** One round sticker per module on the page (the
friend's face and two words), one sticker per area, and the stage seal (the
friend's happy face), with cut lines. Print on sticker paper or plain paper
and glue.

**The ladder.** First steps: four huge rings, a star to colour, ten words a
page. Good habits: more rings, a "my promise" line from the commitment
stems, a tick row. Making choices: the passport becomes a licence card with
endorsements, the words as challenges. Ready at sixteen: a wallet card and
the four areas as tests to pass, the friend small, the tone adult.

## The batches

- **P0** this plan, the claim (this file pushed, the draft PR open).
- **P1** the print kit, and the child facing sheets first: the pupil booklet
  and the paper pack (cover, cards, worksheet, parent note). Rendered to PDF,
  viewed in colour and in greyscale.
- **P2** the knowledge organiser, the two quizzes, the learning record, the
  teacher overview and the print room on the kit.
- **P3** the passport print out, both sheets, four editions.
- **P4** the design council: two critics read the rendered pages (the
  Reception teacher with the child beside her; the head of PSHE with the
  Apple bar) and the fixes land.
- **P5** the guard (`scripts/check-print-kit.mjs`: every print route on the
  kit, the friend on every sheet, no dashes, A4 rules intact), decisions.md,
  the report.

## Verification, every batch

- Every route printed to A4 PDF from the render harness, first page and the
  fold sheet viewed as images, and a greyscale conversion viewed for the
  photocopier.
- 390 and 1440 for the screen view of each route (the print button, the
  chrome).
- Both typechecks, every guard in wiring.yml, the dash scan, review.md
  section 7 (top quality print, checked by printing).

## Not in this plan

New character art (nothing spends a credit without Justin's yes). The
parents app's passport book. The staffroom. The pilot's scope, which Justin
raised the same morning and which is a decision, not a print job.
