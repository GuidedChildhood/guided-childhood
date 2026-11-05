# Star Reward Chart (standalone Etsy listing)

The star reward chart sold on its own, separate from the full Starter Pack, so
Etsy has a cheap, single purpose chart listing (the review engine) as well as
the premium pack. Same design, same deal: one star is five minutes of screen
time.

## What it is (7 pages)

Printed from the Starter Pack's print.html in its star chart edition, so the
two never drift: let us agree the jobs, the star chart, the jobs list, stars
and Friends to cut out, the Planet Friend board, star tokens and the tracker,
then the Star Chart's own last page (the Passport sticker and the free gift).

## Price rung and season

- Etsy: standalone single, 3 to 4 pounds. The review engine, evergreen.
- The full Starter Pack stays the premium 8 to 12 pound anchor. This listing
  feeds buyers up to it.

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

    node content/printables/build-pack.mjs star-chart [print|phone|listing]

Prints A4, US Letter (the A4 sheet at 94 percent, centred) and ink friendly,
writes `images/preview/`, the phone screens and the listing photos. System
Chrome and the main checkout's playwright-core (override with CHROME and
PW_CORE).
