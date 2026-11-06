# Screens At Granny's: product folder

House rules that travel. A Christmas visit pack for ages 4 to 12: the
family's screen deal, written on cards for the host and the child, so the
same three kinds of time hold in a different house. Fronted by Bloop
(routines). Part of the paid line, plans/2026-11-06-etsy-paid-downloads-build-plan.md.
List price £4.99 with a permanent 25 percent sale (£3.74, a deliberate entry
offer under the £4 floor).

## Contents
- `product/`: screens-at-grannys-A4.pdf (colour), USLetter.pdf,
  A4-ink-friendly.pdf. Eight pages: cover, for the grown ups at home, the
  three kinds of time, the host card (two to a page), My deal at Granny's,
  the visit tally (up to seven days), thank you for having me notes (two to a
  page), the Passport sticker and free gift page.
- `phone/`: 1080x1920 screens: the host card to send by message, and the
  three kinds of time.
- `images/`: the approved Bloop and DiGi art, `preview/` and the image ledger
  (images.md).
- `listing/`: listing.md (title, price, description, 13 tags, photo slots,
  video and reel, compliance) and `listing/images/`, the 2000 by 2000 photo
  set from `listing/images.html` and `../listing-images.js`.
- `print.html`, `phone.html`, `fonts/`: the editable source.

## Proof paths

The three kinds of time match the app: `lib/quests/time-tiers.ts` (core spends
first and dies at midnight, protected windows become an ask, the protected
lines), `lib/quests/device-time.ts` (one star is five minutes, any screen),
`components/quests/TimeTiersCard.tsx` (the parent's own settings: core
minutes, star rate, bedtime window, mealtimes). The earn your screen time pack
uses the same rate.

## Last page

`../pack-finish.js` with "strip":false: this pack is not named in the
Passport's Go further strip, so the family sticks the Bloop sticker on with
no tick. The gift is guidedchildhood.com/etsy-bonus.

## Rebuild

    node content/printables/build-pack.mjs screens-at-grannys [print|phone|listing]
