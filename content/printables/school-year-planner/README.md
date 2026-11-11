# My School Year Planner 2026 to 2027 — product folder

Recipe: school planner (printables-engine recipe 2), the core seasonal rung.
Price rung £8 to £12, listed £8.99. Season window: July to September, second
bump in January. Fronted by DiGi (the golden star) with a warm coaching one
liner on every month and section opener.

Built 21 July 2026 by the printables-engine pipeline. All calendar grids are
computed with node for the real 2026 and 2027 dates (Monday start, September
2026 opens on Tuesday the 1st), never guessed.

## Contents
- `product/` — school-year-planner-A4.pdf (colour), USLetter.pdf,
  A4-ink-friendly.pdf. Twenty two pages: cover, this planner belongs to,
  timetable, term dates (fill in, because councils differ), twelve monthly
  calendars September 2026 to August 2027, weekly homework tracker, reading
  log, exam and revision planner, my subjects, DiGi's screen balance corner,
  free bonus page.
- `phone/` — 1080x1920 send to child phone set: homework tracker, DiGi's
  homework first screen, reading log.
- `images/` — assets plus the imagery ledger (images.md). Higgsfield CDN was
  blocked this session, so the set is repo character art plus hand drawn
  inline SVG in house tokens.
- `listing/` — full Etsy listing package: title, tags, photo plan, video and
  reel scripts, compliance notes.
- `print.html`, `phone.html`, `fonts/` — the editable source. Rebuild with
  the Playwright script referenced in images.md.

## Funnel wiring
Last PDF page offers the free term dates sticker pack plus DiGi's mini
lesson at guidedchildhood.com/etsy-bonus (page still to be built on the
platform). Discreet footer URL on every page. One warm Etsy review ask on
the bonus page, no incentives.

## Still to do before listing goes live
1. GoodNotes hyperlinked version (month to week to day tabs) as a follow up,
   the 2 to 3x price format the research flagged.
2. Undated version as a follow up listing for mid year buyers.
3. Re date every May by rerunning the calendar generator, never relist, so
   reviews compound on the one listing.
4. Build /etsy-bonus on the platform: the term dates sticker pack plus the
   DiGi mini lesson.
5. Higgsfield imagery for the photo slots (desk hero, flat lay) once the CDN
   is reachable, logged in images.md.
6. Shoot the two real hands videos (listing video and reel).

## Etsy edition, 11 November 2026

Listed on Etsy with the Canva look photo set (`listing/images.html`, built by
`node content/printables/build-pack.mjs school-year-planner listing`). Two things differ
from the July build:

- **The last page was swapped.** It promised a bonus of its own at
  /etsy-bonus that the page does not give. `node content/printables/cut-pack.mjs
  school-year-planner` replaces it, in all three product PDFs, with the thank you page from
  `../pack-finish.js`: the Starter Pack for an email, which is what the page
  really gives. `print.html` still carries the old last sheet, so rerun that
  command after any rebuild, until the sheet itself is changed.
- **Previews for the photos** are in `images/preview/`, made straight from the
  A4 PDF by `../pdf-previews.mjs`. The older `images/preview-page-N.png` files
  are the July renders and still show the old last page.
