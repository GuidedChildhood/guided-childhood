# Passport daily progress and stickers: the audit before any code

Requested by Justin, 10 September 2026, under an explicit gate: audit first,
label everything, do not implement until the audit is clear.

Nothing in this document has been built. No file has been changed for it.

**Headline: most of what the brief asks for already exists and is wired. The
gap is not an engine, it is that the engine is invisible, the day is not age
aware, and there is no per day sticker.**

---

## 1. How the Passport currently works

Two books, one rule.

- **Parent:** `components/pathway/PassportBook.tsx` on `/dashboard/pathway`,
  drawing five stage sections from `lib/pathway/passport-sections.ts`.
- **Child:** the sticker book, `lib/stickers/book.ts` + `catalog.ts`, table
  `earned_stickers`.
- **Stamped** is defined once, in `lib/pathway/stamped.ts`: a stage stamps when
  its content is complete **and** the child passes the stage check. That file
  exists because an audit on 2 September found four different definitions.

The five parent sections are Devices set up, Moments to resolve, Lessons and
tests, Jobs and routines, Screen balance. Each carries `pct`, `label`, `href`,
`help`, `ongoing`.

Stage percentage comes from `lib/pathway/progress.ts`:
`lessons 40% + scripts 30% + streak 15% + devices 15%`.

**KEEP.**

## 2. Everything currently feeding Passport progress

| Feeds | Table | Read by |
| --- | --- | --- |
| Lessons passed | `lesson_completions` + `lesson_pass_by` | `progress.ts`, sections |
| Scripts resolved | `script_completions` (`countsTowardPathway`) | `progress.ts` |
| Devices set up | `device_setup_progress`, `family_devices` | `progress.ts` |
| Moments | `moment_completions`, `concerns` | sections |
| Screen balance | `device_sessions`, `star_spends` | `screen-balance.ts` |
| Completed child days | `kid_days` | `streak-unlock.ts`, sticker book |
| Worry sorted to 5 stars | `concerns` | sticker book (`kind: 'sorted'`) |
| Stage stamp | derived | `stamped.ts` |

**KEEP. DO NOT DUPLICATE.**

## 3. Current daily routine logic

**This is the big finding.** The daily engine the brief describes already
exists, for the child, as *five a day*.

`lib/kid/five-a-day.ts` + table `kid_days` (`child_id, day, steps, done,
completed_at, streak_awarded, notes`), unique on `(child_id, day)`.

Fifteen step kinds: `jobs, lesson, quiz, balance, ask, reading, homework,
printable, move, maths, tidy, make, kind, talk, grownup_break`.

`pickDay(childId, day, available)` chooses once and stores, seeded by child and
date so it cannot be rerolled. `dayComplete()` is the streak rule.
`available` drops steps that cannot be completed today.

The parent has an equivalent, separate loop: `lib/pathway/daily-tasks.ts`
driving the road on Home.

**EXTEND, do not rebuild.** Section 43's product test is close to describable
in terms of what `kid_days` already stores.

## 4. How timer completion is stored

`device_sessions`: `started_at, ends_at, ended_at, status, minutes, manual,
in_protected_window, activity`.

**We know:** a block was agreed, for how long, when it actually ended.
Comparing `ended_at` to `ends_at` gives an honest "closed on time" signal.

**We do NOT know:** whether the child put the device down. We have no OS
telemetry and never will from a web app. Per the brief's own instruction, the
sticker rule must say "used the agreed timer", never "stopped using the
device", and the copy must not imply otherwise.

`lib/quests/usage.ts` computes minutes used today from `device_sessions` +
`star_spends`, de-duplicated via `spend_id`.

**KEEP the store. Its day boundary needs a fix, see risk 3.**

## 5. How child jobs are stored and approved

`family_quests` (the job) → `quest_ticks` (`quest_id, child_id, tick_date,
status, ticked_by, approved_at`).

Child ticks, parent approves, `getStarBanks` counts only approved. Unique
indexes already exist per child per day and per family per day.

**KEEP. Never add a second approval.** The Passport must read the approved
state, not the tap.

## 6. How lessons are completed

`lesson_completions` (`passed`, `score`) plus `lesson_pass_by` (`who`,
`child_id`) which records whether the parent or the child passed it. Unique on
`(user_id, child_id, lesson_id, lesson_source)`.

Credit rules live in `lessonCreditKeys` in `progress.ts`, including the legacy
rule for rows written before `lesson_pass_by` existed.

**KEEP.**

## 7. How stars work

`lib/quests/bank.ts` → `getStarBanks`. Earned = approved quest ticks + finished
star lessons + watch together completions + `star_bonuses`. Spent =
`star_spends`. Server side only, never trusted from a client.

**KEEP. Stars are the currency and are already correct.**

## 8. How age and stage requirements are calculated

`children.age_band` → `getStageFromAgeBand` → stage id → `lessons.stage_id`,
`scripts.stage_id`, `device_guides.min_age`. Five stages, `STAGE_ORDER` in
`progress.ts`.

**KEEP as the source of truth**, exactly as the brief asks.

## 9. Parent Home Passport integration

Two rungs on the road (`daily-tasks.ts`): a passport rung and, on passport day,
a "look at the record" ask. `PassportToDo` sits above the book.

`FiveADayReport` (the child's week) renders on **`/dashboard/pathway`, not on
Home**. So a parent's Home never shows today's child progress.

**EXTEND: this is section 37's gap.**

## 10. Child Home Passport integration

`app/k/[token]/KidQuestScreen.tsx` renders the five a day. Completing the day
writes `kid_days.completed_at` and can award a Planet Friend via
`streak-unlock.ts`.

**The child's day and the child's passport are two screens with no link
between them.** Finishing the day does not put anything in the book beyond a
counted streak.

**EXTEND: this is sections 8, 10, 11 and 36.**

## 11. Existing database entities involved

`children, kid_days, kid_milestones, earned_stickers, family_quests,
quest_ticks, quest_requests, star_bonuses, star_spends, star_goals,
device_sessions, device_requests, device_setup_progress, family_devices,
lesson_completions, lesson_pass_by, script_completions, moment_completions,
concerns, concern_events, printable_completions, job_streaks, surface_events,
planet_events, daily_sessions, wellbeing_checks`.

## 12. Current APIs and services

`/api/kid/day` (chooses and stores the five), `/api/kid/celebrations`,
`/api/cron/five-a-day`, `/api/daily/complete`, `/api/daily/feedback`,
`/api/daily/day-done`, the quests approve routes, `/api/keepsakes/*`.

`lib/events/record.ts` → `recordSurfaceEvents` writes `surface_events`
(`surface, item, event, day`), best effort, with a daily unique index.

**This is an event stream for learning, not a progression bus.** It is
deliberately fire and forget and swallows failures, so it must **NOT** be made
load bearing for awarding anything.

## 13. What can be reused unchanged (KEEP)

- `kid_days` and `five-a-day.ts` as the daily record
- `getStarBanks` as the star ledger
- `quest_ticks` approval flow
- `stamped.ts` as the one stage rule
- `progress.ts` stage percentages
- `passport-sections.ts` as the five stage rows
- every idempotency index listed in 16

## 14. What needs extending (EXTEND)

1. **`pickDay` is not age aware.** It takes `childId` and `day` only. A five
   year old and a fourteen year old draw from the same pool, filtered only by
   what is technically available. The brief forbids this in sections 2 and 19.
   Fix: pass the stage and give each stage its own pool and its own required
   count.
2. **No per day sticker exists.** `earned_stickers` is `UNIQUE (child_id,
   sticker_key)`, correct for one off stickers, unusable for a daily one
   without encoding the date in the key.
3. **Child Home does not show what is left towards the passport** in passport
   language (sections 9, 10, 27, 28, 36).
4. **Parent Home does not show today's child progress at all** (section 37).
5. **Catch up** exists as `lib/pathway/catchup.ts` for the parent road; the
   child side has no equivalent (section 18).

## 15. Risks of the proposed redesign

1. **A second daily engine.** The single largest risk. If a "passport daily
   requirement" is written separately from five a day, the two will disagree
   within a week and the child will see two different counts. This is exactly
   the failure `stamped.ts` was written to end.
2. **`earned_stickers` shape.** A daily row under a `(child_id, sticker_key)`
   unique index needs the day in the key, or a separate table. Choosing wrong
   here is a migration later.
3. **Day boundary.** `lib/quests/usage.ts` still computes "today" as UTC
   (`new Date().toISOString().slice(0,10)`). `londonToday()` exists and is used
   by the road, the check in and five a day. Any daily sticker reading usage
   would inherit the UTC bug and mis-award for an hour every British summer
   night. Section 25 is not satisfied today.
4. **Overclaiming the timer.** See 4. Copy that says a child "stopped" when we
   only know a timer block closed would be a false claim about a child, to
   their parent.
5. **Streak pressure.** `kid_days.streak_awarded`, `job_streaks` and
   `FRIEND_STREAKS` already exist and Planet Friends unlock on completed day
   counts. Section 31 says do not build streak pressure; some already exists
   and the honest answer is that this needs a decision, not a silent change.
6. **Backfill.** `kid_days` holds real history. Counting past completed days as
   "balanced days" is defensible; inventing daily stickers for days before the
   rule existed is not (section 21).

## 16. Idempotency and timezone, as they stand today

| Table | Guarantee | Verdict |
| --- | --- | --- |
| `kid_days` | UNIQUE (child_id, day) | **KEEP**, already right |
| `quest_ticks` | partial UNIQUE per child/day and family/day | **KEEP** |
| `lesson_completions` | UNIQUE (user, child, lesson, source) | **KEEP** |
| `moment_completions` | UNIQUE (user, child, moment, day) | **KEEP** |
| `surface_events` | daily UNIQUE | **KEEP**, but not a progression bus |
| `earned_stickers` | UNIQUE (child_id, sticker_key) | **EXTEND** for daily |

Day handling: `londonToday()` / `ukToday()` are correct and widely used.
`lib/quests/usage.ts` is the outlier. **REFACTOR SAFELY.**

## 17. Proposed daily sticker rule engine

One evaluator, reading `kid_days`, not a new one.

- The stage decides the required set and the count, from the existing pathway.
- A day qualifies when its stored `steps` are all in `done`, which is
  `dayComplete()` today.
- The award is latched on the `kid_days` row itself, next to `streak_awarded`,
  so the unique `(child_id, day)` index is the idempotency guarantee and no new
  constraint is needed for the daily case.
- Lesson steps only appear on days the curriculum schedules one, so a day with
  no lesson due can still qualify (section 7).

**NEW, but small, and sitting on existing storage.**

## 18. Proposed canonical Passport state

One server function returning: today's steps and which are done, whether today
qualifies, lifetime balanced days, stickers earned, skill and stage progress
from `progress.ts` and `stamped.ts`. Both apps render it. Neither recomputes.

**NEW (the function). KEEP (everything it reads).**

## 19. Files likely to change

`lib/kid/five-a-day.ts` (stage aware `pickDay`) · `app/api/kid/day/route.ts` ·
new `lib/passport/daily.ts` · `lib/stickers/catalog.ts` + `book.ts` ·
`app/k/[token]/KidQuestScreen.tsx` · `components/pathway/PassportBook.tsx` ·
`app/(dashboard)/dashboard/page.tsx` (parent Home card) ·
`lib/quests/usage.ts` (day boundary) · one migration.

## 20. Tests required before release

- `pickDay` per stage: required count, no impossible step, deterministic
- a day with no lesson due still qualifies (section 7, explicit)
- award exactly once across refresh, two devices, retry, offline replay
- London midnight, in and out of British Summer Time
- backfill leaves every existing child's stars, stamps and Friends unchanged
- parent and child render identical state from one call
- no red cross, no lost progress, no streak loss copy anywhere (section 17)
- the nine existing guards plus a new one holding the single engine rule

---

## Labels, in one place

**KEEP** stars, quest approval, lesson credit, `stamped.ts`, `progress.ts`,
passport sections, every existing unique index, `kid_days` as the day record.

**EXTEND** `pickDay` to be stage aware · the sticker catalogue for a daily kind
· Child Home to show today in passport language · Parent Home to show it at all
· catch up to the child side.

**REFACTOR SAFELY** `lib/quests/usage.ts` day boundary to London.

**NEW** one daily evaluator, one canonical state function, one migration.

**DO NOT DUPLICATE** the timer, jobs, approvals, lessons, the star ledger, the
day record, or the stage rule.

---

## What I need decided before Phase 1

1. **Streaks.** Section 31 says do not build streak pressure. `streak_awarded`,
   `job_streaks` and Friends unlocking on completed days already exist. Keep
   as is, soften the language, or unpick the mechanic?
2. **Sticker storage.** Day encoded in `earned_stickers.sticker_key`, or latch
   on `kid_days` and treat the daily sticker as a read of that table? I
   recommend the latch: no new constraint, no catalogue bloat, and the unique
   index already guarantees once per child per day.
3. **Backfill.** Count historical completed `kid_days` as balanced days, and
   show them honestly as legacy, without inventing per day stickers for them?
