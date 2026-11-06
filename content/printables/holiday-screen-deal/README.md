# The Holiday Screen Deal: product folder

A two week school holiday planner for ages 5 to 12. Written for the
Christmas holidays and worded so it works for any school holiday. Listed
£4.99 with the permanent 25 percent sale, so buyers pay £3.74: the entry
offer of the paid line, deliberately under the £4 floor (see
listing/listing.md). Fronted by Bloop, whose Passport page is about routines.

Built 6 November 2026 from plans/2026-11-06-etsy-paid-downloads-build-plan.md.

## What it does, and where that lives in the app

The planner is the app's own time model on paper, so a family who later
joins sees the same deal on screen.

- Three kinds of time: a core that is the child's every day, earned time
  from stars, and protected times no stars can buy, where a start becomes an
  ask to the parent. `lib/quests/time-tiers.ts`, `components/quests/TimeTiersCard.tsx`.
- One star is five minutes on any screen, and a family can agree its own
  rate. `lib/quests/device-time.ts`, `lib/quests/time-tiers.ts` (starMinutes).
- A weekly cap and a fresh start every Monday. `lib/quests/star-week.ts`.
- Stars count when a grown up says yes. `lib/quests/today-split.ts`.
- Family jobs earn nothing: contribution is belonging. `lib/quests/bank.ts`.
- The starting numbers on the How it works page (about 70, 90 and 110
  minutes a day at 5 to 7, 8 to 10 and 11 to 12) are the app's age guide
  (`lib/quests/screen-balance.ts`) relaxed for the Christmas holidays
  (`lib/learning/holidays.ts`, relax 1.2), offered as a starting point.

## Contents

- `product/`: holiday-screen-deal-A4.pdf (colour),
  holiday-screen-deal-USLetter.pdf, holiday-screen-deal-A4-ink-friendly.pdf.
  Nine pages: cover, how it works, our holiday deal, my daily core, the jobs
  board, week one, week two, the look back, the Passport stickers and free
  gift page.
- `phone/`: 1080x1920 screens: our-holiday-deal.png and jobs-board.png.
- `images/`: the approved Bloop, Pebble and DiGi art, `preview/` (a PNG per
  page) and the image ledger (images.md).
- `listing/`: the Etsy listing package (listing.md) and the 2000 by 2000
  photo set in `listing/images/`, from `listing/images.html` and
  `../listing-images.js`.
- `print.html`, `phone.html`, `fonts/`: the editable source. The jobs rows
  and the two week grids are written by a small script at the foot of
  print.html, so a change to one row changes every row.

## Claims rule

It gives a family a written deal for the holidays. It never claims to stop
arguments, improve behaviour, reduce screen time or anything else about a
child. No price, no checkout link. The last page points only to
guidedchildhood.com/etsy-bonus.

## Rebuild

    node content/printables/build-pack.mjs holiday-screen-deal [print|phone|listing]
