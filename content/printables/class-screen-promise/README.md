# Our Class Screen Promise: product folder

A classroom poster set for KS1 and KS2 teachers, ages 5 to 11. Part of the
paid line in plans/2026-11-06-etsy-paid-downloads-build-plan.md. Listed at
£6.99 with a permanent 25 percent sale, so buyers pay £5.24. Fronted by DiGi
the golden star with all five Planet Friends. No Passport page and no phone
version.

## Contents

- `product/`: class-screen-promise-A4.pdf (colour),
  class-screen-promise-USLetter.pdf, class-screen-promise-A4-ink-friendly.pdf.
  Eleven pages:
  1. Cover.
  2. Teacher notes: talk, vote, sign in one lesson, one question per promise,
     where to display it, printing at A3, a half term revisit tracker.
  3. The class poster: six promises, class name, the date, the five friends.
  4. The same poster with six blank lines, for classes who write their own.
  5 to 9. Thirty pupil promise slips, six per sheet, one friend per sheet.
  10. The letter home, with blanks for the class and teacher, one
      conversation to have at home, and a cut off family promise.
  11. Thank you and the free gift (gift only, `../pack-finish.js`).
- `images/`: the approved friends and DiGi art, `preview/` (a PNG per page)
  and the image ledger (images.md).
- `listing/`: `listing.md` (title, price, description, 13 tags, photo slots,
  compliance) and `images/`, the 2000 by 2000 photo set from
  `listing/images.html` and `../listing-images.js`.
- `print.html`, `fonts/`: the editable source. The slip sheets are written
  by a short script inside `print.html` so all five stay identical.

## Where the promises come from

Each promise matches a habit the Guided Childhood primary lessons already
teach (`content/modules`):

| Promise | Lesson |
|---|---|
| We are kind on screens, just like in class | eyfs-01, ks2-08 |
| If something on a screen feels bad or scary, we tell a grown up | ks1-02 (feel it, name it, tell a grown up), ks2-08 |
| Real or pretend? We stop, look and ask before we believe it | eyfs-01, ks1-03 |
| We keep private things private, and ask before we share | ks1-32, ks2-07 |
| We notice who is on the other side of the screen | ks1-33 |
| The screen never says stop, so we pick our stop | eyfs-30, ks2-04 |

## Claims rule

The set gives a class a promise to talk about, vote on and sign. It never
claims to keep children safe, reduce risk, prevent bullying or meet a
statutory duty, and it makes no safeguarding claim. The teacher notes send a
teacher to their own school's safeguarding policy if a child says something
worrying, as in any lesson.

## Rebuild

    node content/printables/build-pack.mjs class-screen-promise [print|listing]

Prints A4, US Letter (the A4 sheet at 94 percent, centred) and ink friendly,
writes `images/preview/` and the listing photos. System Chrome and the main
checkout's playwright-core (override with CHROME and PW_CORE).
