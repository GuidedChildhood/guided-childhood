# The daily jobs guide: start small, build up as weeks go well, advice not a block

Justin, 14 September 2026, 13:04, with the Top picks tab showing twelve jobs
ticked "On the board already": "It allowed me to add 12 jobs on parent app.
Can we check we only allow recommended daily jobs and build up as they get
better at doing them so they are not overwhelmed. A little warning and
advice, not blocked."

## What exists

`lib/quests/job-load.ts` already holds the sweet spot per age (3 a day at 4
to 7, 4 at 8 to 10, 5 at 11 to 13, 6 from 13) with NHS, NSPCC and the chores
research behind it, and `JobComposer` says a gentle word at that number. The
tile picker (`JobPicker`, the screen in the screenshot) never consulted it,
so twelve went in without a word.

## The guide

`lib/quests/job-guide.ts`, pure:
- `ceiling` is the age's sweet spot from job load.
- `start` is where a new child begins: two at 4 to 10, three from 11.
- A week goes well when four or more jobs were ticked and agreed in it. The
  last four weeks count, this one included.
- `guide = min(ceiling, start + weeks going well)`. Status `room`, `at` or
  `over` against the jobs due today.

Nothing is enforced. The API takes every add it took before.

## Where it shows

- `JobGuideCard` on the Add a job tab, between the composer and the picker:
  the headline, the advice in Justin's voice, the sources line, and "Nothing
  is blocked". Coral wash when over, butter when at the guide, quiet when
  there is room. A door to their jobs list to trim.
- `JobComposer`'s gentle word uses the same number, so the two never disagree.
- The "N jobs on the board" line says "over the guide of N" when it is.
- `/api/quests` returns `recentApproved` (child, date) for the last 28 days
  so the page can count the weeks.

## Wiring

- `scripts/check-job-guide.mjs`: a probe on the maths (start, ceiling, the
  weeks, the three statuses), the card on the page, the composer fed the same
  number, the API's field, no dashes, "Nothing is blocked". Mutation tested.
- Fixture `/dev/add-job?board=12`, `?board=4`, `?board=1`. Walked at 390
  and 1440.
