# The Family Phone Agreement: product folder

Recipe: family screen agreements and parent guides (printables-engine
recipe 8), the hero of the screen time contracts niche (verified whitespace,
no incumbent). Price rung £4 to £6, listed £4.99. Evergreen with Christmas,
birthday and September peaks. Ages 10 to 12, the first phone moment.

Built 21 July 2026 by the printables-engine pipeline. Fronted by DiGi (golden
star, the guide who speaks to parents). Core stance: a calibrated pathway the
family builds together, binding both sides. Never a ban, never surveillance.

## Contents
- `product/`: family-phone-agreement-A4.pdf (colour), USLetter.pdf,
  A4-ink-friendly.pdf. Eight pages: cover, parent guide (ceremony beats
  lecture), the five question conversation page, the agreement spread (child
  promises in their own handwriting plus printed parent promises, signatures,
  term review dates), trust levels pathway, when something feels wrong page
  with cut out wallet cards, the Passport stickers and free gift page.
- `phone/`: 1080x1920 send to child phone set: my-deal.png (the child's
  copy of the signed deal) and feels-wrong-card.png.
- `images/`: DiGi, the Bloop and Orbit cutouts for the stickers, `preview/`
  and the image ledger (images.md).
- `listing/`: full Etsy listing package: title, price, 13 tags, 10 photo
  slots, video and reel scripts, compliance notes.
- `print.html`, `phone.html`, `fonts/`: the editable source. Rebuild with
  the Playwright script referenced in images.md.

## Etsy ready, 5 November 2026

One of the five packs the Guided Childhood Passport names in the Go further
strip on its stage pages: the Bloop page and the Orbit page, under the talk. Checked and fixed before listing, per
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

    node content/printables/build-pack.mjs family-phone-agreement [print|phone|listing]

Prints A4, US Letter (the A4 sheet at 94 percent, centred) and ink friendly,
writes `images/preview/`, the phone screens and the listing photos. System
Chrome and the main checkout's playwright-core (override with CHROME and
PW_CORE).
