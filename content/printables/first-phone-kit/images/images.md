# Image ledger: The First Phone Kit

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/orbit.png` | `public/digi-squad/friends/orbit.png` | the cover, the child's readiness check, the deal, setup night, the 30 days, the review, the sticker, the phone screen, listing slot 1 |
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the nine or ten note on page 2, the child's readiness check |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | the grown up pages (readiness, setup night, review, the words) and the setup night phone screen |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the last page (the free gift) and listing slot 6 |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (the phone on the cover, the stars) lives in
`print.html` in house tokens.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, Teo, Olga, Alma, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs first-phone-kit
