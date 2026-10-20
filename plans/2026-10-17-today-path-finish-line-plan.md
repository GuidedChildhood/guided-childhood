# Today path: a way back, a green for nothing owed, and a finish line

Justin, 17 October 2026, with his Home path and a Duolingo screenshot: a step
that takes you off the path (DiGi, devices) must let you mark it done so it goes
green, otherwise the parent is stuck on DiGi instead of back on the path. "No
jobs waiting" should be completed if it is true. There needs to be an
achievement each day so parents do not think it is endless.

## Checked first

- His account: 14 active jobs, 0 ticks waiting, 0 asks waiting. "No jobs
  waiting" is true, so it should read as complete.
- Devices already carries a way back (BackTo on the page). DiGi has none, and
  the DiGi rung only goes green when a question is asked.

## Build

1. Migration 382 `today_step_marks`: one row per parent, child, day and step,
   for the two steps whose work happens off the path (digi, passport).
2. `POST /api/daily/mark-step`: records the mark, idempotent.
3. `lib/pathway/daily-tasks.ts`: DiGi done on a question OR a mark. The
   passport job done on a full section OR a mark (note "Looked at today"). DiGi
   and passport hrefs carry `from=today&step=<key>`. Quests with jobs set and
   nothing waiting reads "Jobs all approved".
4. `components/home/BackToToday.tsx`: from=today with a step shows one bar,
   "Done, back to today", which marks the step and returns to the path.
5. `components/daily/TodayPathBig.tsx`: a settled rung (nothing owed) paints
   green. A finish line under the heading: one segment per step, filling
   green, ending at a trophy, saying how many are left until today is done.

Not touched: DIGI_MODEL, the knowledge bank, the refresh cron,
lib/learning/digi-context.ts. The mark is its own table so DiGi's question log
stays a log of real questions.
