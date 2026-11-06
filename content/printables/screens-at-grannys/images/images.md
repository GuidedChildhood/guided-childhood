# Image ledger: Screens At Granny's

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the cover, the three kinds of time, the host cards, the child's card, the visit tally, the Bloop sticker, both phone screens, listing slot 1 |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | DiGi Junior on the child's card ("If I want more, I say") |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the last page (the free gift) and listing slot 6 |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (clock, star, shield, faces, heart, stars to colour)
lives in `print.html` and `phone.html` in house tokens.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art, Sofia, Oliver, Zara, Teo, Olga, Alma, the
green robot or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs screens-at-grannys
