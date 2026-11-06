# The Planet Day Flip Chart: product folder

Build next number 2 (`plans/2026-11-06-etsy-build-next-five-plan.md`), from
rows 3 and 4 of `plans/2026-11-06-etsy-top-sellers-research.md`. Ages 4 to
10: Pebble fronts 4 to 7, Bloop 8 to 10. List £6.99 with the permanent 25
percent sale, buyers pay £5.24.

The one idea: the chart answers "is it screen time now?" before anyone asks.

## Pages (25)

1. Cover.
2. Three kinds of time, for the grown up: my time, star time, protected
   time, family jobs, and the weekly star guide.
3. Making the flip chart: the staircase diagram, cut, stack, staple, cards.
4. to 7. Pebble's flip chart: name sheet (cut at 222mm), morning (240mm),
   after school (258mm), bedtime (whole).
8. to 11. Bloop's flip chart, the same.
12. and 13. Ready made week charts, Pebble then Bloop, Monday start.
14. to 23. 120 picture cards at 2 inches, twelve to a page.
24. The star tally strips and the star shop.
25. The Pebble and Bloop Passport stickers and the free gift
    (`../pack-finish.js`, `strip: false`).

## The 120 cards

20 morning, 20 after school, 16 bedtime (routine, no stars), 12 jobs with a
star space, the same 12 as family jobs (no stars), 12 screens rest (striped,
no star space: breakfast, lunch, tea, school time, the hour before bed,
bedtime, two of each), 4 my time (gold), 4 star time, 20 blank. Built in
`print.html` from the `add(...)` lists, so the count is the code.

## Proof paths

In the head comment of `print.html`: core time (`lib/quests/time-tiers.ts`,
`components/quests/TimeTiersCard.tsx`), the star rate (`lib/quests/templates.ts`,
migration 225), the weekly cap (`lib/quests/star-week.ts`,
`lib/quests/screen-balance.ts`), protected windows (`lib/quests/time-tiers.ts`),
family jobs (migration 223).

## Icons

`icons.js`: 67 line icons drawn for this pack on a 48 unit grid in house ink.
Objects only, never a character. Other packs can load it.

## Contents

- `product/`: planet-day-flip-chart-A4.pdf, USLetter.pdf, A4-ink-friendly.pdf,
  all fillable.
- `images/`: Pebble, Bloop, DiGi, `preview/`, the ledger.
- `listing/`: `listing.md` and `images/`, the 2000 by 2000 photo set.

## Rebuild

    node content/printables/build-pack.mjs planet-day-flip-chart [print|listing]

Checks: `node scripts/check-ai-tells.mjs` on the html and md here, and
`node content/printables/check-listing-tags.mjs content/printables/planet-day-flip-chart/listing/listing.md`.
