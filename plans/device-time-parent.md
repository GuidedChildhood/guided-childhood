# Device time, parent side (item 3)

Justin: "parent can set time to use child device for each kid and it alarms and
warns both platforms each time up then time to set new tasks list."

## What exists today
- Child spends earned stars as device minutes (DeviceTimeCard on /k/[token]).
- `device_sessions` row holds device, minutes, stars, ends_at, status.
- Parent gets a Web Push at START only (app/api/quests/time/start).
- The child's own screen alarms (3 beeps + buzz) at zero (client countdown).
- Parent has NO way to start/grant time, and gets NO alarm at END.

## To build
1. Parent grant control (per child): on the quests board, a "Screen time" card
   per child. Parent picks device + minutes and starts a session on the child's
   behalf. New route POST /api/quests/time/parent-start, auth by parent session
   (not the token), reusing the same device_sessions insert + spend logic.
2. Live parent countdown: the card shows the running session's MM:SS for each
   child, picked up from getActiveSession, refreshing on an interval.
3. Alarm to the parent at zero: when the running session hits zero while the
   parent has the board open, play the same alarm + show "Time is up for {name}.
   Set the next quests" with a button to the quest manager. Plus a Web Push at
   END so a parent who is not looking still gets warned. The END push needs a
   trigger at ends_at: a once-a-minute cron that finds sessions whose ends_at
   just passed and status is still active, marks them ended, and pushes the
   parent. (Vercel cron; gate on CRON_SECRET like the others.)
4. "Then set the next task list": the zero-state on both sides links straight to
   adding the next quests (parent: quest manager; child: ask for more).

## THE FORK for Justin (blocks a clean build)
When the PARENT sets device time, does it:
  A) Spend the child's earned stars (same economy as the child flow) — keeps
     stars meaningful, parent just does it for them. RECOMMENDED.
  B) Grant free bonus minutes outside the star economy — simpler for the
     parent, but weakens "stars buy screen time", a core rule.
  C) Both: default to spending stars, with a small "give bonus time" option.
Recommendation: C, defaulting to A.
