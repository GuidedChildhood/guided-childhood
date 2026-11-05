# Image ledger: The Starter Pack

Checked and rebuilt 5 November 2026, when the pack was made Etsy ready. No
image in this pack is generated or redrawn. Every character is an approved
file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/*.png` | `public/digi-squad/friends/` (all five) | the chart, the cut outs, the board, page headers, the move page, the sticker |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | the DiGi says notes |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the last page (the free gift) and listing slot 6 |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (icons, stars, faces) lives in `print.html` and
`phone.html` in house tokens.

Replaced 5 November 2026: `friends/*.png` were the damaged copies from
`public/printables/friends/`. The cover and the move page had placeholder
slots waiting for Higgsfield art that never landed; the cover now shows DiGi
and the move page shows Bloop with a round counter. No scene art is planned:
the brand file allows generated environments only, never a character.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs starter-pack
