# The Calm Down Corner Kit: product folder

Recipe: calm down and feelings kits (printables-engine recipe 6), rank 5 in
the verified top ten. Price rung £5 to £8, listed £5.99 with the launch sale.
Evergreen, dual market: home plus schools, with back to school and January
pushes.

Built 21 July 2026 by the printables-engine pipeline. Fronted by Pebble
(the Pebble page, ages 4 to 7) with DiGi Junior leading the star breathing pages.
Sofia fronted it until 5 November 2026; she is retired.

## Contents
- `product/`: calm-down-kit-A4.pdf (colour), calm-down-kit-USLetter.pdf,
  calm-down-kit-A4-ink-friendly.pdf. Nine pages: cover, parent and teacher
  setup guide, calm corner sign, 8 feelings check in cards, DiGi Junior star
  breathing poster, 12 calm choice cards, the feeling is going page, grown
  up script card, the Passport sticker and free gift page.
- `phone/`: 1080x1920 send to phone set: star-breathing.png and
  feelings-check-in.png.
- `images/`: the approved Pebble and DiGi art, `preview/` (a PNG per page)
  and the image ledger (images.md).
- `listing/`: full Etsy listing package: title, tags, photo plan, video and
  reel scripts, compliance notes with the strict claims rule.
- `print.html`, `phone.html`, `fonts/`: the editable source. Rebuild with
  the Playwright script referenced in images.md.

## Claims rule (strict, applies everywhere)
This kit helps children practise calming down and builds a calm corner
habit. It never claims to reduce anxiety, treat anything, or improve any
mental health outcome. No therapy language on child facing pages.

## Etsy ready, 5 November 2026

One of the five packs the Guided Childhood Passport names in the Go further
strip on its stage pages: the Pebble page, under the talk. Checked and fixed before listing, per
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

    node content/printables/build-pack.mjs calm-down-kit [print|phone|listing]

Prints A4, US Letter (the A4 sheet at 94 percent, centred) and ink friendly,
writes `images/preview/`, the phone screens and the listing photos. System
Chrome and the main checkout's playwright-core (override with CHROME and
PW_CORE).
