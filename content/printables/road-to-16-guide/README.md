# The Road to 16

The free reward for a Guided Childhood Passport stamped up to the child's age
(Justin, 5 November 2026). Claimed at guidedchildhood.com/etsy-bonus, which the
printable Passport names on its grown ups page. Not an Etsy listing.

What it covers, in Justin's words: balance, behaviour, what to watch for on each
platform and the age it usually turns up, and the school pressure points.

## Pages (11)

Cover, up to date certificate, the five stages, balance, behaviour, the apps
(two pages, eight apps), the school moments, when something goes wrong, sixteen,
sources.

## Files

- `guide-data.js`: every word. Proof paths are listed at its head.
- `print.html`: the layout, the Passport printable's tokens, fonts and cover.
- `build-guide.mjs`: prints the four PDFs to `product/`, page previews to
  `images/preview/` (ink saver and Letter in `check/`), `guide-text.md`, and
  copies the PDFs to `public/printables/road-to-16/` for the `road-to-16` magnet.
  It stops if anything runs into the footer on any paper size.
- `guide-text.md`: every printed word as plain text, for the evidence check and
  `npm run ai-tells`. Generated, never edited by hand.
- `evidence-check.md`: the evidence red team's verdict, line by line, and the
  fixes applied.

## Rebuild

    node content/printables/road-to-16-guide/build-guide.mjs

Then refresh the claim's cover thumbnail if the cover changed:

    sips -Z 640 content/printables/road-to-16-guide/images/preview/page-01.png --out public/printables/road-to-16/road-to-16-cover.png

## Keep it true

Platform ages, Ofcom figures and the law were read on 5 November 2026. Recheck
them against the sources page at least once a term, and whenever a platform
changes its terms, then rebuild.
