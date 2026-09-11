# Done today means the pathway, and a star a day for jobs

Justin, 11 September 2026: "lets go with one tick keeps the streak, the pathway
earns the celebration. also the need the passport to sync that when kids do
their today jobs it adds a star per day."

That settles the question that had three answers in the code.

## The three definitions that existed

1. **The streak** (lib/pathway/streak.ts) counted ANY showing up: a finished
   day, a moment worked, a quest tick approved, a check in answered.
2. **The celebration** ("Today is made", components/daily/DayCompleteFlow)
   fired when the ONE lead rung went green, which is why a parent who had only
   answered the check in was told the day was finished.
3. **The tick by the child's name** (lib/checkin/done-today.ts) read the
   `concerns` table, so it meant the check in was done, not the pathway.

Justin has seen all three and 2 is the one that reads as a lie.

## What it becomes

- **One tick keeps the streak.** Unchanged. The lead rung still records the
  day, the rotation still advances, the flame stays lit. A parent with ten
  minutes is not punished.
- **The pathway earns the celebration.** "Today is made" and the day close
  flow fire when every rung on the road is green, never before. Until then the
  road stays open and says plainly that today counts and there is more if they
  want it.
- **The tick by the name means the pathway.** It is the visible "this child is
  finished today", so it must mean the thing the celebration means.

## The build

1. Migration 287: `daily_sessions.all_done_at`. The day the WHOLE road was
   walked, per child, per day. `completed_at` keeps its meaning (the one tick
   landed) so nothing that reads it changes.
2. `/api/daily/day-done` takes `all_done`, stamps it once, idempotent.
3. `TodayPathBig` and `TodayPathStrip` split one flag into two: `streakDone`
   (the lead rung, quiet) and `pathDone` (every rung, the celebration).
4. `pathwayDoneToday` replaces `checkedInToday` behind the name tick.

## A star a day for jobs

Justin's second half. The passport's Jobs row read TODAY only
(`jobsTodayStatus`), so it sat green all weekend on a weekday only routine and
green on the day a family joined. It is now the count of DAYS in this stage
where every job due was done and approved, drawn as one star per day, which is
what the row's star already promised.

And the child's own numbers (days done in their app, stars held, days the
timer ran) were computed by `lib/pathway/passport-child.ts` and never rendered
anywhere but a dev fixture. They are on the passport page now, so a parent
looking at their child's page can see something the CHILD did.

## Not in this change

The passport audit found the five slots enforce one of five and enforce two
they never show (scripts, the stage test). The false "All five, done" is
fixed here because it is the same lie as the celebration. The rest of the
audit goes to Justin as findings, not as a silent rewrite of what a stage
means.
