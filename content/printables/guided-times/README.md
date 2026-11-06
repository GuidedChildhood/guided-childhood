# The Guided Times: the paid Happy News newspaper

A numbered children's newspaper sold on Etsy, one listing per issue, in the
Happy News finish of the free Planet Post but on its own masthead, twelve
pages long and with a page turning version. Plan and research:
`plans/2026-11-05-paid-happy-news-newspaper-plan.md`.

Justin's choices, 5 November 2026: single issues plus season and back issue
bundles (Etsy has no subscriptions); Issue 1 is the Christmas edition, New
Screens Under the Tree; the name is The Guided Times, with his "Guided
Childhood News" as the line above it.

## How it is built

| File | What it does |
|---|---|
| `paper.css` | The page (740 by 1000 CSS px, the Planet Post's box), the tokens, the ink friendly rules |
| `paper.js` | Draws the twelve pages from an issue's words: masthead, sections, the puzzles (the word search and maze are generated from a seed, so the answers always match) |
| `issue-N/issue.js` | Every word of that issue, and the `live` flag for each product on the shop page |
| `issue-N/print.html` | Loads the two above; open it in a browser to see every page |
| `reader/` | The page turning reader: shell, styles, script, and the how to open note |
| `build.mjs` | Builds everything: `node content/printables/guided-times/build.mjs issue-1 [print|reader|listing]` |
| `fonts/`, `images/` | Nunito and IBM Plex Mono; the approved Planet Friend stills and DiGi (see images/images.md); the shop thumbnails |

`build.mjs` fails the build if anything runs past the bottom or edge of a
page, and waits for every picture before it prints.

## What one issue ships (`issue-N/product/`, five files for Etsy's five)

- A4 and US Letter colour PDFs, the page centred on each paper, never scaled
- The ink friendly zip: A4 and US Letter with every fill white
- The read on screen PDF: pages exactly the size of the page, for tablets,
  phones and Books on an iPhone
- The page turning zip: one offline HTML file with every font and picture
  inside, plus How-to-open-it.txt. Two page spreads on a computer or a tablet
  held sideways, one page at a time on a phone, swipe, tap, keys, double tap
  to zoom, contents. With scripts off (an iPhone Files preview) it falls back
  to a strip of pages you swipe through.

Checked on 5 November 2026 in Chrome and in WebKit (Safari's engine) at
1440 by 900, 1024 by 768 and 390 by 844. Safari ignores backface-visibility
when a page has transformed children, so the reader swaps the faces at the
half way point of a turn rather than trusting it.

## The free taster (6 November 2026)

Justin: the paper also goes on the Guided Childhood Instagram carousel, free
for an email, as a taster and never the whole issue. `print.html?edition=taster`
draws four pages (the front, the ID card, the puzzles, and a closing page with
the six step plan, the answers, the full issue's pages and the stage check).
`build.mjs issue-1 taster` writes the A4 and US Letter PDFs and four page
previews straight into `public/printables/free/guided-times-1-taster-*`. The
gate is the `guided-times-taster` magnet in `lib/magnets/registry.ts` and the
page is `/free/guided-times`. It is never listed on Etsy.

## A new issue

Copy `issue-1` to `issue-2`, rewrite `issue.js`, check the shop page's `live`
flags, run the build, look at every page in `images/preview` and
`images/preview-ink`, run `npm run ai-tells` and the tag check, then write its
listing. Keep each issue different from the free Planet Post: that is the
website's free paper and never goes on Etsy.
