# The Guided Childhood Starter Pack

The flagship printable. A premium, newspaper styled booklet that teaches the
whole Guided Childhood deal on paper: real jobs earn stars, one star is five
minutes of screen time, and the daily battle becomes a deal the family already
made. Ages 4 and up.

## Recipe

A blend of the routine and screen time chart recipe (the fridge chart is the
hero) and the build at home kit recipe (a full booklet of activities). DiGi
hosts. The characters demonstrate every job and skill, never decorate.

## Price rung and season

- Etsy: premium single, 8 to 12 pounds. Evergreen, the shop's anchor listing.
- App: the free bonus behind /etsy-bonus email capture, and a member printable
  in the library. Served funnel free (the app edition strips the last page
  bonus panel, the Etsy edition keeps it).

## The pages (11)

1. Masthead cover, The Guided Childhood Weekly.
2. The star reward chart, the hero. Name field, the deal, five daily jobs
   across seven days, spend row, age guidance.
3. The jobs list plus how to make your chart.
4. How to guides: lay the table, tidy your room, load the dishwasher.
5. Move your body, the five minute wake up workout.
6. Football skills and dance moves.
7. Healthy breakfast, build a plate that lasts till lunch.
8. Read with a grown up tick list, plus goal celebrations.
9. The Star Run, a print and play game.
10. Colour in DiGi and the family.
11. Tips, assembly and the free bonus (Etsy edition only).

## The deal (must match the app)

1 star = 5 minutes of screen time (STAR_MINUTES, config value). Younger
children (4 to 7) reward daily, older (8 up) tally weekly. Never a hard stop,
always the calibrated pathway. Play and outside jobs pay the most stars.

## Bonus wired

Last page points to guidedchildhood.com/etsy-bonus, the free app trial, on the
Etsy edition only. No checkout link, no off Etsy transaction move.

## Build

`content/printables/starter-pack/print.html` is the Etsy edition (funnel kept).
Rebuild with the scratchpad `gh/build-starter.mjs` script (A4, US Letter at
0.94 scale, ink friendly, plus per page previews). The app edition strips the
`.etsy-bonus` panel and is served from `public/printables`.

## Illustrations

Happy News spirit illustrations (soft ink outlines, warm butter and cream) drop
into the art slots on the cover and the move page, synced through the GUIDED
CHARACTERS Google Drive folder. Job IDs in `images/images.md`.
