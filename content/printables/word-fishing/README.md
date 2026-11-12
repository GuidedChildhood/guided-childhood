# Word Fishing — product folder

Recipe: build at home kit (printables-engine recipe 3) crossed with the
tracing and fine motor early learning lane (recipe 5). Price rung £3.99 with
a 25 percent launch sale. Evergreen, with back to school and January pushes.
Verified gap: the top English language rival listing has 12 ratings.

Built 21 July 2026 by the printables-engine pipeline. Fronted by the Word
Fishing fish, a hand drawn house style SVG in five house colours, with DiGi
on the bonus page. Higgsfield CDN was unavailable this session, so all
artwork is hand drawn inline SVG plus the DiGi-star.svg reference asset.

## Contents
- `product/` — word-fishing-A4.pdf (colour), word-fishing-USLetter.pdf,
  word-fishing-A4-ink-friendly.pdf. Ten pages: cover, the 10 minute build
  page (materials table plus five illustrated steps), how to play (three
  games), Phase 2 tricky word fish across two pages (18 fish: the, to, I,
  no, go, into), Phase 3 tricky word fish across two pages (24 fish: he,
  she, we, me, be, was, you, they, all, are, my, her), letter fish
  (s a t p i n m d, two of each), blank fish, free bonus page.
- `phone/` — 1080x1920 set: how-to-play.png and tricky-words-practice.png.
- `images/` — DiGi-star.svg plus preview-page-N.png and ink spot checks.
- `listing/` — full Etsy listing package: title, tags, photo plan, video and
  reel scripts, compliance notes.
- `print.html`, `phone.html`, `fonts/` — the editable source. Rebuild with
  build-word-fishing.mjs (Playwright, modelled on the shared build script).

## Funnel wiring
Last PDF page offers the free Secret Word decoding game at
guidedchildhood.com/etsy-bonus (page still to be built on the platform).
Discreet guidedchildhood.com footer on every page.

## Phonics labelling rule
Everything is labelled by Phase 2 and Phase 3 tricky words and first letter
sounds, the generic terms UK parents search. No commercial phonics scheme is
ever named in copy, on the PDF or in the listing.

## Still to do before listing goes live
1. Phase 4 and Phase 5 tricky word expansion pack (said, have, like, so, do,
   some, come, were, there, little, one, when, out, what) as a follow on
   listing and a bundle with this one.
2. Seasonal fish skins: Christmas hat fish, summer sunglasses fish, pumpkin
   fish, swapped in as free listing refreshes.
3. Cursive font variant for schools that teach a joined or looped style.
4. Build /etsy-bonus on the platform and wire the Secret Word decoding game.
5. Shoot the two real hands videos (listing video and reel) and the mockup
   photos per the 10 slot plan.

## Etsy edition, 11 November 2026

Listed on Etsy with the Canva look photo set (`listing/images.html`, built by
`node content/printables/build-pack.mjs word-fishing listing`). Two things differ
from the July build:

- **The last page was swapped.** It promised a bonus of its own at
  /etsy-bonus that the page does not give. `node content/printables/cut-pack.mjs
  word-fishing` replaces it, in all three product PDFs, with the thank you page from
  `../pack-finish.js`: the Starter Pack for an email, which is what the page
  really gives. `print.html` still carries the old last sheet, so rerun that
  command after any rebuild, until the sheet itself is changed.
- **Previews for the photos** are in `images/preview/`, made straight from the
  A4 PDF by `../pdf-previews.mjs`. The older `images/preview-page-N.png` files
  are the July renders and still show the old last page.
