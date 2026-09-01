# The daily habit loop, planned step by step

Justin, 1 September 2026: check in leads them through moments, scripts and
DiGi; a top 5 of recommended scripts per child from what they have told us
and the age; one main tick a day with the rest recommended; viewing a script
or moment ticks the day by itself; a finished day flows into device balance
advice, then quests, then see you tomorrow; days rotate (a lessons day for
the age, a DiGi day, a passport check once a week); DiGi decluttered; every
reader fills the phone screen like Good Inside; everything feeds the data we
learn from; the whole thing a Duolingo grade habit loop where the parent
knows it is building habits for their child.

## What already exists (so we build on it, not beside it)

- The Today path lives in `lib/pathway/daily-tasks.ts` (`getTodayLoop`) and
  renders as the Duolingo style meander in `components/daily/TodayPathBig.tsx`
  on the dashboard home. Rungs: setup, check in, moment, agreement, script,
  quests, passport, digi.
- Opening a script already ticks the script rung (the reader upserts a
  completion on open) and viewing a moment already ticks the moment rung. So
  "viewing updates ticks" is mostly true today; what is missing is the ONE
  main tick framing and the flow after it.
- `getRecommendedScript` already scores scripts per child from four signals
  (concerns, check in dips, devices, signup answer) with a written reason.
  The top 5 is a ranked extension of it, not new machinery.
- `components/cards/MomentCard.tsx` is already a full screen mobile takeover
  in the Good Inside shape (fixed inset, progress bar, tap to advance, safe
  areas). It is the model for every other reader.
- Streaks exist (`lib/pathway/streak.ts`, Planet Friend unlocks at 2, 10,
  22, 38, 58 days). There is no day type rotation and no parent end of day
  screen; the deck at /dashboard/daily has the only celebration.
- There is no view or impression logging; `MarkReadOnEnd` (scripts) and
  `MarkStepOnArrival` (kid balance) are the only two honest "actually
  consumed" signals. The learning loop generalises them.

## The routine, in one picture

A day has ONE lead tick. Which lead depends on the day's focus, and the
focus rotates on COMPLETED days, not calendar days, so a parent who logs in
twice a week still walks the same road in order and never faces a pile of
missed days (the Duolingo lesson: the path waits, it never punishes).

- CONNECT day (the default, roughly two in three): check in leads, then a
  moment, then tonight's script. Viewing the script or moment ticks it.
- LESSON day: the next lesson for this child's age, one by one, ticked on
  completion.
- DIGI day: one real question to DiGi about this child ticks it.
- PASSPORT day (every 7th completed day): a simple progress check, what has
  moved, and one named next thing.

When the lead tick lands, the day completes and flows, in order, into:

1. BALANCE: device settings advice for this child's age (what to set, kept
   simple), the child app's balance view explained, and one line of
   encouragement toward offline family time.
2. QUESTS: approve anything waiting, or set the first job.
3. SEE YOU TOMORROW: a proper close with the streak, and tomorrow's focus
   named so the loop hooks.

Everything else stays on the path as "also recommended", ticked the same
way, never required.

## Build steps, in order

Each step is small enough to verify alone. The diff for every step is
checked against review.md, tsc, and Chrome DevTools mobile and desktop
before moving on. Mobbin references are pulled before any new UI.

**Step 1. The day focus engine.** `lib/pathway/day-focus.ts`: pure function
from a child's completed day count to a focus (connect, connect, lesson,
connect, digi, connect, passport, repeat). Migration 237 adds
`daily_sessions.focus` so a day keeps the focus it started with (two opens
on one day must agree). Anchored on completed days so "log in whenever"
works by design.

**Step 2. One main tick.** `getTodayLoop` learns the focus: the lead rung
comes first and alone decides day completion; the rest render under "also
today, if you fancy it". The lesson rung returns (the next uncompleted
lesson for the child's stage by sort order, the ordering that already
existed in the legacy `getDailyTasks`), used on lesson days. Day done
becomes lead-rung done rather than the minutes budget; the minutes chips
stay as a preference for how much extra to show.

**Step 3. The top 5 scripts.** `rankScripts` beside `chooseScript` in
`lib/pathway/recommend-pick.ts`: same signals, same never speak first guard,
returns the top five with each one's reason ("You have raised bedtime three
times", "Matches age 8 to 10"). Surfaced as "Picked for {child}" at the top
of the scripts library and inside the script rung. The one recommended
script stays the lead; the other four are the choices Justin asked for.

**Step 4. The day complete flow.** A parent takeover (built from the
MomentCard shell + Celebration confetti): tick summary, then the BALANCE
card (recommended minutes for the age from `screen-balance.ts`, the device
sweep if one is due from `/api/devices/sweep`, one offline encouragement
line, and "the child app checks this balance with them" explained), then
the QUESTS card (approve waiting ticks or set the first job), then SEE YOU
TOMORROW naming tomorrow's focus. Runs through `popupQueue` so it never
collides with another sheet.

**Step 5. Full screen readers everywhere.** One shared `TakeoverReader`
extracted from the MomentCard recipe (fixed inset, progress, swipe or tap,
safe areas, big Nunito text). The script reader opens inside it on mobile
(the inline page stays for desktop), a DiGi answer can expand into it, and
lessons already have SlidePlayer. Good Inside simplicity: one thing on
screen, big text, swipe to move on.

**Step 6. DiGi decluttered.** The thread becomes the page: hero only on a
fresh day with no messages, the research line and flag box fold into one
quiet footer row, the between chats block trims to a single "Back to today"
line plus at most one suggestion chip, the reflection card appears only
after the day's first answer. Bigger type, more air, nothing above the fold
but DiGi and the conversation.

**Step 7. Passport fed and checked weekly.** Passport day surfaces the
existing `PassportToDo` as three lines and one button, and the see you
tomorrow screen occasionally (at most once a week) names the single next
passport item. Daily activity already feeds the passport through its
ledgers (scripts read, lessons passed, moments resolved); the weekly day
makes that visible instead of invisible.

**Step 8. The learning loop.** Migration 238: `surface_events` (child,
surface, item, event: shown, opened, read, completed, day) written by the
readers and the path, generalising MarkReadOnEnd. The recommender and
nudge facts read it so the top 5 and the daily prompts sharpen with use.
No third party analytics; our tables, our rules.

**Step 9. The polish pass.** GSAP tick pops on the path, the fold to "Today,
sorted", reduced motion respected, no dashes, Checker tokens only, and a
full Playwright walkthrough of the whole day on a phone viewport: open,
tick, balance, quests, see you tomorrow, next day rotates.

## What we deliberately keep

- Streaks and Planet Friend unlocks unchanged (they already pace rewards).
- Free plan honesty: the lead script rung never routes into a paywall.
- The never speak first guard on sensitive scripts applies to all five
  recommendations, not just the first.
- The child app five a day stays exactly as shipped; the parent day
  completing does not touch the child's day.

## Order of pull requests

PR A: steps 1 to 3 (engine, one tick, top 5). PR B: steps 4 and 5 (day
complete flow, readers). PR C: steps 6 and 7 (DiGi declutter, passport
day). PR D: steps 8 and 9 (learning loop, polish). Small PRs, merged same
day where possible, per the house sync rules. Migrations 237 and 238 are
claimed by this plan.
