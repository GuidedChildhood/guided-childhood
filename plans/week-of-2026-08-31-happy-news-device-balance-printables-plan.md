# Happy news device balance printables

Justin, 2 September 2026: "Also let's add more happy news style printables
just as other ones like this" (The Happy Newspaper: the Feel Your Happy book
and the School of Kindness postcards). "Come up with ideas using this style
for age related device balance use etc."

## What "this style" means here

The bucket list is the model: a sheet drawn in code (SVG line art, every bit
of it a colouring job), a wavy masthead ribbon with smiley dots, the child's
name on it, a star strip at the foot, one side of A4 from any phone (PR 954).
Nothing generated, nothing photographed. The Happy Newspaper energy is bright
line drawings, big friendly lettering, a positive one liner, and things a
child does with their hands. The School of Kindness postcards are drawings
by children, cut out and given away. The Feel Your Happy book is small
prompts that turn a feeling into a thing to do.

So every sheet below is: one page, drawn to be coloured, one plain positive
sentence, something the child fills in, and a proof path into the product
(stars, the three kinds of time, the stages, the Planet Friends).

## The set, by age

The product's device balance mechanics are the three kinds of time (a core
that is theirs, extra earned with stars, protected windows nobody can buy),
the ladder from parent regulation to self regulation, and the stage model on
the way to sixteen. Each sheet puts one of those on paper for the age that
needs it.

| Sheet | Stages | Ages | The device balance idea | What they do |
|---|---|---|---|---|
| My Balance Wheel | 1, 2 | 4 to 10 | A good day has many colours, not one | A wheel of eight slices (Outside, Make, Read, Move, Help, Family, Rest, Screen). Colour a slice every time you do it. Screen is one slice among eight. |
| Phones Go To Bed | 1 to 5 | 4 to 16 | Protected time: bedtime is nobody's to buy | A poster for the charging spot: phones tucked into a drawn bed, the child writes the bedtime, colours it, sticks it where the chargers are. |
| My Screen Time Deal | 2 to 5 | 8 to 16 | The three kinds of time, in three jars | Three drawn jars: Mine every day, Earned with stars, Nobody's. Filled in from the child's real settings (minutes per star, protected windows) when printed from their app, dotted lines otherwise. |
| My Helping Hand | 1 to 3 | 4 to 12 | Connection is the protection | Draw round your hand, a trusted grown up on each finger, and one line on the palm: "If something online feels odd, I tell ___". |
| Ready For My Phone | 3, 4 | 10 to 15 | The ladder to self regulation | A rocket path of ten checkpoints (I can put it down at dinner, I know who to tell, I have done the passwords lesson). Colour each one when a grown up agrees it is true. The last stop is the phone. |
| Kindness Postcards | 1 to 5 | 4 to 16 | Offline connection, the postcard pack made ours | Four postcards on one sheet to colour, cut and give: Thank you for, You made my day when, I noticed you, Let's do this with no screens. |

Six sheets, one component each, all on the same A4 paper as the bucket list.

## Where it lives

- `components/printables/drawn/HappyPaper.tsx`: the one page A4 paper (a
  fixed 794 by 1077 pixels, 210 by 285mm on paper, no page margin, body zoom
  off) with the ribbon, the write lines and the small drawings every sheet
  shares. The bucket list keeps its own fluid paper (PR 954), untouched.
- `components/printables/drawn/*Sheet.tsx`: one file per sheet above, pure
  drawing, props for the child's name and the family's real numbers.
- `components/printables/drawn/index.tsx`: the map from a registry key to
  its drawn component, so the registry stays data. `DrawnPaper.tsx` fits the
  paper to whatever is looking at it (SheetScale), so the tile IS the print.
- `lib/printables/deal-facts.ts`: a child's time settings row as the words
  on the page (minutes per star, the daily core, the bedtime, the windows).
- `lib/printables/registry.ts`: six new entries with `drawn: <key>`. A drawn
  sheet has no CDN art: the grid tile and the sheet screen render the real
  sheet scaled down (SheetScale), so the preview is the print.
- `components/kid/KidSheetPaper.tsx`: renders the drawn component when the
  spec carries one, the image otherwise.
- `app/k/[token]/print/page.tsx`: `?sheet=<key>` already routes registry
  sheets here; drawn sheets ride the same door.
- Parent side: the dashboard printables grid shows the same tiles, and
  `/dashboard/printables/sheet/[key]` prints the sheet for the chosen child
  with the family's deal on it (same paywall as the PDF route).

## Copy rules

Justin's voice. No dashes. Ages as 4 to 10. Never allow or deny: every sheet
is a pathway (colour when it is true, write your own time), never a rule
sheet. No medical claims. Every line has a proof path in the product.

## Checks before push

- Chromium PDF page count: every sheet one page from an 800 wide and a 390
  wide layout, the PR 954 test.
- Print media screenshots of all six, eyeballed.
- The child printables grid at iPhone size with the new tiles.
- tsc, wiring, dash grep, checkin guard.
