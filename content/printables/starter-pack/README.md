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

## The pages (14)

1. Masthead cover, The Guided Childhood Weekly, with DiGi.
2. Let us agree the jobs: the page filled in together first.
3. The star chart: your jobs, bonus rows, the spend row.
4. The jobs list with star values, plus how to make your chart.
5. Stars to stick and Planet Friends to earn.
6. The Planet Friend board: four stars a day earns a Friend.
7. How to guides: lay the table, tidy your room, load the dishwasher.
8. The five minute wake up workout, with Bloop and a round counter.
9. Four football skills and six dance moves.
10. A breakfast plate in three parts.
11. Seven stories, seven nights, and the done it dance.
12. Tips to put the pack together, and the app note.
13. Cut out star tokens and the weekly tracker.
14. The Passport sticker and the free gift (`../pack-finish.js`).

Pages 2 to 6 and 13 are also the Star Chart (`../star-chart`), printed from
this file with `body.edition-star-chart` and its own last page.

## The deal (must match the app)

1 star = 5 minutes of screen time (STAR_MINUTES, config value). Younger
children (4 to 7) reward daily, older (8 up) tally weekly. Never a hard stop,
always the calibrated pathway. Play and outside jobs pay the most stars.

## Etsy ready, 5 November 2026

One of the five packs the Guided Childhood Passport names in the Go further
strip on its stage pages: the Pebble page, under the doing. Checked and fixed before listing, per
Justin's decision that the Passport does not go live before its packs.

- Art: approved Planet Friend cutouts and DiGi only (see images/images.md).
- Last page: the pack's own Passport sticker for that page, then the free gift
  at guidedchildhood.com/etsy-bonus (the Starter Pack for an email, which is
  what that page gives). Shared with the other packs: `../pack-finish.js`.
- Listing: `listing/listing.md` (title, description, 13 tags, price with the
  permanent 25 percent sale) and `listing/images/`, the 2000 by 2000 photo
  set from `listing/images.html` and `../listing-images.js`.
- Checks: `node content/printables/check-listing-tags.mjs` and
  `npm run ai-tells` on the listing and the rendered page text.

## Rebuild

    node content/printables/build-pack.mjs starter-pack [print|phone|listing]

Prints A4, US Letter (the A4 sheet at 94 percent, centred) and ink friendly,
writes `images/preview/`, the phone screens and the listing photos. System
Chrome and the main checkout's playwright-core (override with CHROME and
PW_CORE).
