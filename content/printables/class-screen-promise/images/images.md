# Image ledger: Our Class Screen Promise

Built 6 November 2026. No image in this pack is generated or redrawn. Every
character is an approved file, copied in unaltered.

| File | Source | Where |
|---|---|---|
| `friends/pebble.png` | `public/digi-squad/friends/pebble.png` | the cover, both posters, slip sheet 1, the thank you page |
| `friends/bloop.png` | `public/digi-squad/friends/bloop.png` | the cover, both posters, slip sheet 2, the thank you page |
| `friends/orbit.png` | `public/digi-squad/friends/orbit.png` | the cover, both posters, slip sheet 3, the thank you page |
| `friends/nova.png` | `public/digi-squad/friends/nova.png` | the cover, both posters, slip sheet 4, the thank you page |
| `friends/cosmo.png` | `public/digi-squad/friends/cosmo.png` | the cover, both posters, slip sheet 5, the thank you page |
| `DiGi-star-3d.png` | `public/digi-squad/DiGi-star-3d.png` | the cover, the letter home, the last page (the free gift), listing slots 1 and 6 |
| `DiGi-star.svg` | `public/digi-squad/DiGi-star.svg` | kept with the set for reprints; not on a page |
| `preview/page-NN.png` | build output, one per page, A4 colour | the check by eye and the listing photos |

Hand drawn inline SVG (the six promise icons, stars, the gold road on the
thank you page) lives in `print.html` in house tokens.

Cosmo appears as a friend around the poster and on a slip sheet, never
teaching or saying anything, since Cosmo fronts no lesson.

Never use `public/printables/friends/` or the old
`starter-pack/images/friends/` art (damaged transparency), Sofia, Oliver,
Zara, the green robot `Digi.png` or the owl. All retired.

## Rebuild

    node content/printables/build-pack.mjs class-screen-promise
