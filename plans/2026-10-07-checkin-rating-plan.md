# 7 October 2026: check in rating, quick, obvious and honest

From the brief written off the weekly UX walkthrough. Justin: "Stars rating
needs to be made super easy and quick to do and obvious to do ... Happy face
icons, easy messaging, flows super easy ... Tell the user exactly what happens."

## Decision taken under the brief's recommendation

Two top scores in a row still rest a worry (`SILVER_RUN = 2`, 9 September).
The card now says so plainly on the first five, so it reads as one step with
a visible finish line. Changing to one five is a one line edit to
`lib/concerns/resting.ts` and `scripts/check-silver-rule.mjs` if Justin wants
it, and it is his call, not this session's.

## PR 1, small, no visual change

- `lib/concerns/bands.ts` holds the one `bandOf`. The card, the monthly
  review and DiGi's approaches import it. Three copies become one.
- The five star message: the green "sorted, off your list" shows only on the
  second top score in a row. A first five says "one more like this". Four
  stars no longer promises "until five stars, then it is done".
- `scripts/check-concern-dots.mjs` proves both, and the fixture's third row
  carries a legacy 9 so a second five has something to be second to.

## PR 2, the faces and the flow

- `lib/concerns/outcome.ts`: `checkinOutcome({ band, lastBand, topRun })`
  returns the ONLY message the card renders: kind, line, next, actions. Reads
  `TOP_BAND` and `SILVER_RUN` from resting.ts. Every row of the brief's table
  is a unit test in `scripts/check-checkin-outcome.mjs`.
- Five faces drawn in house style, 48px targets, the band word under each,
  last time grey on its band, today in butter. Faces not stars because gold
  stars are the child's currency.
- Save beat about a second, a Change link while it runs. No re rating after
  the save: a second "better" post in one day would mark the concern
  resolved on the server and `lib/checkin/today.ts` never asks about a
  resolved concern again. That is a worse failure than a wrong reading that
  tomorrow corrects, so the record stands once it lands.
- Special attention at one or two: Ask DiGi and Get the words on every low
  score, not only a dip.
- review.md 4a updated first, then the guards, then the code.

## What does not move

Five bands, 2/4/6/8/10 posted, bands compared on the server, the history
write first, `resting.ts` the only copy of the rule, per child keying by
concern id. Every reader named in the brief is untouched.
