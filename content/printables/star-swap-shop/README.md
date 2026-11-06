# The Star Swap Shop: product folder

Recipe: routine and screen time charts (printables-engine recipe 1), with
the swap day mechanic. Guided Childhood's own take on the category Tiny
Goals' "Mi Liga en Casa" sells in, which Justin shared on 6 November 2026.
Plan approved by Justin the same day: `plans/2026-11-06-star-swap-shop-plan.md`.

Price: £7.99 listed, £5.99 with the shop's standing 25 percent sale. One
tier. Evergreen.

## The idea

Stars all week for jobs and healthy tech habits. On swap day the shop opens:
screen time on one shelf (one star is five minutes, as in the app), time
together on the next (prices the family sets), the big save on the last.
Twelve habit cards are collected, never spent.

## Contents

- `product/`: star-swap-shop-A4.pdf (colour), USLetter.pdf,
  A4-ink-friendly.pdf. Ten pages: cover, parent guide, ages 4 to 7 chart
  (Pebble), ages 8 to 10 chart (Bloop), the shop menu, swap tickets, habit
  cards 1 to 6, habit cards 7 to 12, two certificates, the Passport stickers
  and free gift page.
- `phone/`: 1080 by 1920: both charts and the shop menu.
- `images/`: the approved Pebble, Bloop, Orbit and DiGi art, `preview/` and
  the image ledger (images.md).
- `listing/`: listing.md (title, description, 13 tags, price, photo plan,
  video and reel scripts, compliance) and `images/`, the 2000 by 2000 set.
- `print.html`, `phone.html`, `fonts/`: the source. Chart rows, menu tags,
  tickets and habit cards are lists in the script at the foot of print.html.

## Passport

Last page via `../pack-finish.js`: the Pebble and Bloop stickers, under the
doing, then the Starter Pack at /etsy-bonus, plus one line on the app.

The pack is in `../guided-childhood-passport/passport-data.js` with ready
off, so the Passport's Go further strip does not print it yet. Once it is
listed on Etsy, flip it to ready and rebuild the Passport.

## Rebuild

    node content/printables/build-pack.mjs star-swap-shop [print|phone|listing]

Checks: `node content/printables/check-listing-tags.mjs` and
`npm run ai-tells` on the listing and the rendered page text.
