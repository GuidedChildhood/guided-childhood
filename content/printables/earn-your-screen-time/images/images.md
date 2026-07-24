# Image ledger — Earn Your Screen Time

| Asset | Source | Job ID | Status |
|---|---|---|---|
| Bloop hero (screen time host) | Planet Friend cutout, the same art the app uses, saved locally as `images/bloop-hero.png` (transparent cutout from the GUIDED CHARACTERS Drive art; the build no longer depends on the CDN) | n/a | referenced as `images/bloop-hero.png` in print.html and phone.html. Bloop owns screen routines, gaming and good habits, so he fronts this pack in place of the retired Oliver. |
| DiGi-star.svg | Repo canonical art (public/digi-squad/DiGi-star.svg) | n/a | in use |
| Row icons (shirt, toothbrush, ball, book, heart, speech) | Hand built inline SVG in print.html, house tokens | n/a | in use |

Build script: scratchpad build-printable.mjs (Playwright over print.html and
phone.html). Re run after any asset swap. Preview PNGs in this folder are
build outputs for visual checking, one per page.
