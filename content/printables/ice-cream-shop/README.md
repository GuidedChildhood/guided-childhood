# Pebble's Ice Cream Shop — product folder

Recipe: build at home kit (printables-engine recipe 3), filling gap 3 from
the July 2026 market sweep: pound coin pretend play money games barely
exist on Etsy while dollar versions are crowded. Price rung £4 to £5.
Evergreen with a summer peak. Fronted by Pebble (age six, warm lane,
ages 4 to 9), which fits a first shop game for ages 5 to 7.

Built 21 July 2026 by the printables-engine pipeline.

## The curriculum hook
UK parents search by year group, so the three games are labelled on the
pages themselves: Game 1 is Year 1 maths (recognise coins and their
values), Game 2 is Year 2 maths (combinations of coins that make an
amount), Game 3 is Year 2 stretch (giving change from 50p and £1). Every
menu price is chosen so it can be made with two or three coins, and every
order card answer is arithmetic checked against the menu.

## Contents
- `product/` — ice-cream-shop-A4.pdf (colour), USLetter.pdf (scaled to fit
  Letter), A4-ink-friendly.pdf. Nine pages: cover, set up and play guide,
  menu board, cones and scoops sheet, two play money pages (coppers and
  small silvers, big silvers and pounds), twelve order and challenge
  cards, shopkeeper kit (badges, OPEN and CLOSED signs, today's special
  board, receipt pad), free bonus page.
- `phone/` — 1080x1920 set: menu-board.png and coin-chart.png, the send to
  a phone versions no competitor ships.
- `images/` — Pebble source art, page previews and the imagery ledger
  (images.md).
- `listing/` — full Etsy listing package: title, tags, photo plan, video
  and reel scripts, compliance notes.
- `print.html`, `phone.html`, `fonts/` — the editable source. All coins,
  cones, scoops, cart and toppings are hand drawn inline SVG in house
  colours. Rebuild with the Playwright script referenced in images.md.

## Legal note on the coins
The play coins are stylised circles in shop colours (coppers golden,
silvers blue, pounds deep gold) with the value large and PLAY MONEY
microtext on every face. Diameters sit close to the real coins so the game
transfers to real pocket change, but no Royal Mint artwork is reproduced.

## Funnel wiring
Last PDF page offers the free Mini Market price cards at
guidedchildhood.com/etsy-bonus (bonus asset and page still to be built).
Discreet guidedchildhood.com footer on every page. No off Etsy checkout
moves anywhere.

## Still to do before listing goes live
1. Build the Mini Market price cards bonus and wire /etsy-bonus.
2. Free cut down lead magnet version (menu plus one coin page) for the
   email list.
3. Editable prices version (Canva or fillable PDF) to justify the editable
   tag and the higher price format the research flagged.
4. US dollar edition later, once the UK listing has reviews; the gap runs
   the other way there, so it needs its own coin plates, not a reskin.
5. Shoot the two real hands videos (listing video and reel) and the mockup
   photos per the photo plan.

## Etsy edition, 11 November 2026

Listed on Etsy with the Canva look photo set (`listing/images.html`, built by
`node content/printables/build-pack.mjs ice-cream-shop listing`). Two things differ
from the July build:

- **The last page was swapped.** It promised a bonus of its own at
  /etsy-bonus that the page does not give. `node content/printables/cut-pack.mjs
  ice-cream-shop` replaces it, in all three product PDFs, with the thank you page from
  `../pack-finish.js`: the Starter Pack for an email, which is what the page
  really gives. `print.html` still carries the old last sheet, so rerun that
  command after any rebuild, until the sheet itself is changed.
- **Previews for the photos** are in `images/preview/`, made straight from the
  A4 PDF by `../pdf-previews.mjs`. The older `images/preview-page-N.png` files
  are the July renders and still show the old last page.
