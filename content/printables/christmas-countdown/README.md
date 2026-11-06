# The Christmas Screen Free Countdown: product folder

Product 3 of the paid Etsy line
(plans/2026-11-06-etsy-paid-downloads-build-plan.md). Ages 4 to 11. Listed at
£5.99 with a permanent 25 percent sale, so buyers pay £4.49. Seasonal: live
by 20 November.

Twenty four doors, 1 to 24 December, one small thing a day to do together
away from a screen. All five Planet Friends take turns (Pebble, Bloop, Orbit,
Nova, Cosmo, in that order, day 1 is Pebble), and DiGi the golden star sits on
top of the tree. It adds family time; it never bans screens and never says
they are bad.

Proof path: the child app's five a day (lib/quests/day-star.ts,
lib/quests/today-split.ts, lib/content/proof.ts), a small daily mix of things
done and ticked off together. The how it works page names it, with no link or
price.

## Contents

- `product/`: christmas-screen-free-countdown-A4.pdf (colour),
  christmas-screen-free-countdown-USLetter.pdf,
  christmas-screen-free-countdown-A4-ink-friendly.pdf. Eleven pages:
  1. Cover: the five friends as a tree with DiGi on top.
  2. How it works, for the grown up: one door a day, ten to twenty minutes,
     things already in the house, swap any day, nothing to buy.
  3. The 24 days at a glance: date, whose day, the activity, what you need,
     a done circle, and quick swaps for a day that will not fit.
  4. The countdown poster: a tree of 24 scattered doors, each with a sticker
     circle, three in the pot, door 24 at the top under DiGi.
  5 to 8. The 24 activity cards, six to a page (days 1 to 6, 7 to 12, 13 to
     18, 19 to 24).
  9. The sticker sheet: 24 day stickers (the day's friend and the date),
     6 DiGi Junior spares, 6 blank circles to draw your own.
  10. Our favourite days, for Christmas Eve: three best days, a drawing, the
      one we keep doing in January, signed by all of us.
  11. The Passport stickers (Pebble and Bloop pages, under the doing) and the
      free gift, from `../pack-finish.js`.
- No phone version. Listing slot 5's fourth format card is the sticker sheet.
- `images/`: the approved art, `preview/` and the ledger (images.md).
- `listing/`: listing.md and the 2000 by 2000 photo set (`images/`).
- `print.html`, `fonts/`: the editable source. The 24 days live once, in the
  DAYS array at the foot of print.html, and fill the planner, the poster, the
  cards and the stickers.

## The free taster (days 1 to 7), not built yet

Days 1 to 7 do not sit on their own page: six cards fit a page, so days 1 to
6 are page 5 and day 7 is the first card on page 6, next to days 8 to 12.
Every card carries `data-day`, so a taster edition can print pages 4 (the
poster), 5 and 6 with `[data-cards="7"] .dcard:nth-child(n+2)` hidden
(visibility, so the grid keeps its shape), leaving day 7 alone on page 6.
The taster also wants the how it works page (2) and the sticker sheet (9),
with `#stickers .cut:nth-child(n+8)` hidden the same way.

## Claims rule

It gives a family one thing to do together each day. It never claims to cut
screen time, change behaviour or help a child's wellbeing. "Away from a
screen", never "screens are bad".

## Rebuild

    node content/printables/build-pack.mjs christmas-countdown [print|listing]

Checks: `node scripts/check-ai-tells.mjs` on every html and md file here and
`node content/printables/check-listing-tags.mjs content/printables/christmas-countdown/listing/listing.md`.
