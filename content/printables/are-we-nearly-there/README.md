# Are We Nearly There: product folder

A screen free car and travel pack for ages 4 to 11, part of the paid Etsy
line (plans/2026-11-06-etsy-paid-downloads-build-plan.md). Listed at £4.99
with the permanent 25 percent sale, so buyers pay £3.74: the entry offer of
the line, deliberately under the £4 floor.

Built 6 November 2026. Fronted by Pebble, with Bloop on the older games and
DiGi Junior on the star tally.

## The idea

The tablet is not banned on the journey. It comes at a point the family
agrees at home (after the next town, at the services, at the halfway point),
and stars from the games add minutes to it at the family rate. That is the
app's star economy on paper: one star is five minutes, as in
`lib/quests/device-time.ts`, and the same three kinds of time as the
earn-your-screen-time pack. Some tablet time is the child's anyway, extra is
earned, and the first half hour and the arriving are protected. A request at
a protected time is an ask, never a flat no.

## Contents

- `product/`: are-we-nearly-there-A4.pdf (colour),
  are-we-nearly-there-USLetter.pdf, are-we-nearly-there-A4-ink-friendly.pdf.
  Eleven pages:
  1. Cover
  2. How to use it: print, clip to a board, agree the deal before you set off
  3. The journey deal card
  4. Car bingo with pictures, ages 4 to 7 (sixteen hand drawn icons)
  5. Car bingo, the hard card, ages 8 to 11 (twenty four words, free star)
  6. The number plate game and alphabet spotting
  7. Twenty questions and twelve would you rather questions
  8. The journey map to colour, home to there, a star at each stop
  9. Six doodle prompts
  10. The star tally: stars per game, minutes at your rate, when the tablet came in
  11. The Passport stickers (Pebble and Bloop pages, under the doing) and the free gift
- No phone version: the pack lives on a clipboard in the back seat. The
  fourth format card in the listing says every page works in black and white.
- `images/`: the approved Pebble, Bloop and DiGi art, `preview/` (a PNG per
  page) and the image ledger (images.md).
- `listing/`: listing.md (title, price, description, 13 tags, photo slots,
  compliance) and `images/`, the 2000 by 2000 photo set from
  `listing/images.html` and `../listing-images.js`.
- `print.html`, `fonts/`: the editable source.

## Claims rule

The pack gives a family games and a deal to agree. It never promises a quiet
car, a calmer child or less screen time.

The free Bored Jar taster is a separate product. This pack does not include
or repeat its slips.

## Rebuild

    node content/printables/build-pack.mjs are-we-nearly-there [print|listing]

Prints A4, US Letter (the A4 sheet at 94 percent, centred) and ink friendly,
writes `images/preview/` and the listing photos.
