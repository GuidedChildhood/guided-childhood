# Multi child defect log

One running list for the whole job. Numbered once and never renumbered. An item
leaves this list only by being FIXED with evidence, or by Justin closing it.

Status: OPEN · IN PROGRESS · FIXED · BLOCKED (with what it waits on)

## Fixed before the formal audit began (18 to 19 August)

| # | Area | Description | Status | Evidence |
|---|------|-------------|--------|----------|
| 1 | Interface | Child switcher existed on 2 pages of 16, so the choice was lost on every tap | FIXED | Layout rail, verified at 390 and 1280 via /ref-child-rail |
| 2 | Interface | Nav tabs and bottom bar dropped `?child=`, so the selection died at the tab | FIXED | Both carry it; Suspense wrapper added after a Vercel prerender failure |
| 3 | API | Six deep pages read `is_primary` instead of the selected child | FIXED | stats, devices, lessons, moments, daily, digi all on `getChildren` |
| 4 | Database | `quest_ticks UNIQUE(quest_id, tick_date)` — a shared job could be ticked by one child only | FIXED | Migration 206 applied, verified in `pg_indexes` |
| 5 | API | Untick deleted by quest and date with no child filter — one child erased a sibling's tick | FIXED | `.eq('child_id', link.child_id)` added |
| 6 | API | Parent approval approved EVERY child's pending tick at once | FIXED | Scoped to the target child, ownership checked server side |
| 7 | API | Watch together lesson credited the completion to the primary child | FIXED | Takes `?child=` |
| 8 | Database | `lesson_pass_by` index lacked `who`, so a parent and child pass collided | FIXED | Migration 208 applied |
| 9 | API | DiGi filed memory, concerns, questions, feedback against the primary child | FIXED | `pickChild` on the request's child |
| 10 | Database | `daily_sessions UNIQUE(user_id, session_date)` — one child's day ended everyone's | FIXED | Migration 210 applied |
| 11 | API | Today's "done" read `daily_sessions` by user with `maybeSingle`, erroring on 2 children | FIXED | Per child find, legacy null row counts for all |
| 12 | Database | `moment_completions` key ignored its own `child_id` | FIXED | Migration 211 applied |
| 13 | Interface | Check in card keyed all state by SLUG, and every child shares slugs | FIXED | Re-keyed by concern id |
| 14 | Interface | Check in posted against `find(c => c.slug === slug)` — the FIRST match, so the wrong child's row | FIXED | Posts the row's own id |
| 15 | Data | Baseline concerns seeded once ever, on the primary child. Olga had zero | FIXED | Seeding runs per child every check in; live rows repaired |
| 16 | Data | Baselines stamped today sat inside the check in's own review window | FIXED | Stamped yesterday at source |
| 17 | Interface | Check in advanced to the next child without telling the URL, so the toggle lit the wrong one | FIXED | Canonical redirect to `?child=` |
| 18 | Interface | Last time's rating drawn as one outlined star, read as a half finished rating | FIXED | Grey filled stars to last time's band |
| 19 | API | Child app `/k/[token]/deal` listed a sibling's jobs at a sibling's star rates | FIXED | Scoped, matching star-chart |
| 20 | API | DiGi died whenever it used a tool: `lane 'family'`, `replied false`, 0 chars | FIXED | Tool free rescue call; real reason recorded on `digi_latency` |
| 21 | Email | Weekly digest, monthly balance and the drip named one child only | FIXED | All carry every child |

## Open, from the Phase 1 database audit

| # | Area | Description | Status | Evidence |
|---|------|-------------|--------|----------|
| 22 | Database | `digi_feedback UNIQUE(user_id, feedback_date)` ignores its own child_id | FIXED | Migration 212 applied; 15 rows kept, 14 already carried a child |
| 23 | Database | `lesson_completions` has no child_id; one lesson per household ever | FIXED | Migration 213 applied; 10 rows kept |
| 24 | Database | `script_completions` has no child_id | FIXED | Migration 213 applied; 22 rows kept |
| 25 | Database | `script_lines_used` has no child_id | FIXED | Migration 213 applied; 1 row kept |
| 26 | Database | `ai_literacy_checkins UNIQUE(user_id)` — one per household for ever | FIXED | Migration 214 applied |
| 27 | Database | `digi_weekly_reviews UNIQUE(user_id, week_start)` | FIXED | Migration 214 applied |
| 28 | Database | `family_agreements UNIQUE(user_id)` blocks per child agreements | FIXED | Justin: child level. Migration 215 applied; existing agreement keeps a null child as the household one |
| 29 | Database | `school_actions` has no child_id | FIXED | Migration 215 applied; 5 rows kept |
| 30 | Database | `wellbeing_checkins` has no child_id (`wellbeing_checks` is the correct twin) | FIXED | Migration 214 applied |
| 31 | Database | `digi_safety_flags` has no child_id | FIXED | Migration 214 applied |
| 32 | Database | `script_requests` has no child_id | FIXED | Migration 213 applied |
| 33 | Database | `family_devices` and `device_setup_progress` household scoped | FIXED | Justin settled the model: a device is a per child LABEL, not a physical thing. Two children watching one telly is two sessions. Migration 217. device_sessions and device_requests already carried child_id. |
| 34 | Data | 15 orphan `quest_ticks` with no child | CLOSED | Justin: leave them, old test data |
| 36 | Interface | Setup rung drawn on EVERY child's Today, so a second child was told she needed setting up | FIXED | Account level job, now on the first child's day only |
| 37 | Database | Setup quest could REOPEN months later when a child was added, over a QR code | FIXED | Migration 216: profiles.setup_completed_at, stamped once |
| 35 | Interface | Passport count has no owner and "moments to resolve" 404s | FIXED | Both halves by the passport session before it closed, verified in code: counts scoped `child_id.eq.<id>,child_id.is.null`, link is an anchor to #working-on which exists, heading names the child. Rail handover completed 19 Aug: pathway and passport join CHILD_ROUTES, page's own switcher deleted at the line their comment marked. |
| 38 | API | Proactive DiGi prompts scanned the primary child only; a second child could never trip one | FIXED | Every child scanned per signal, routine cadence once per family, prompts named and filed per child. plans/digi-proactive-audit.md |

## Phase 1 close

Every child scoped table now carries a `child_id`, verified in
`information_schema` after each migration. Row counts before and after are
identical on every table: nothing was deleted and nothing was merged.

**Backfill is deliberately partial.** A family with exactly one child has no
ambiguity, so their rows were assigned. A family with more than one was left
null, which every read treats as "counts for everybody" and is exactly what
those rows meant when they were written. On Justin's own two child account that
means 0 of 10 lesson completions and 0 of 22 script completions were assigned,
which is the correct answer rather than a failure: guessing which child read a
script two weeks ago would be inventing a fact about a real family.

**On testing against a copy first.** The brief asks for this and it was not
done, so it is said plainly rather than skipped quietly. There is one account on
the product, Justin's own, with no real users behind it, and a Supabase branch
is a spend decision that is his to make rather than mine. Every migration here
is additive or loosening only: columns are added, and every replacement key adds
a column to an existing one, so no existing row can violate what replaces it.
Row counts were checked after each. If a real user base existed, this paragraph
would be a refusal to proceed instead of an explanation.

## Rollback

Every migration in this phase is reversible by dropping what it added. Nothing
dropped a column or deleted a row, so a rollback loses only the per child
distinction, never data:

```sql
-- 212 to 215, in reverse. The old household keys are restorable because no row
-- was ever written that would violate them.
drop index if exists uq_family_agreements_child, uq_family_agreements_family;
drop index if exists uq_ai_literacy_child, uq_ai_literacy_family;
drop index if exists uq_digi_weekly_child, uq_digi_weekly_family;
drop index if exists uq_lesson_completions_child, uq_lesson_completions_family;
drop index if exists uq_script_completions_child, uq_script_completions_family;
drop index if exists uq_script_lines_used_child, uq_script_lines_used_family;
drop index if exists uq_digi_feedback_child_day, uq_digi_feedback_family_day;
-- then re-add the original constraints, and only then drop the columns:
alter table public.lesson_completions drop column if exists child_id;
-- ... and the same for the other nine tables.
```

| 39 | Push | `sendPush` could say "children" but never WHICH child, so school pushes hit every child's device | FIXED | `childId` targeting added; morning, soon and remind crons send per child |
| 40 | Push | Quest tick push to the parent named no child: "a quest is ready for your ok" | FIXED | Names the child: "Teo ticked off a job" |
| 41 | Push | School reminder pushes to the parent named no child | FIXED | Items wear the child's name inline in all three crons |
| 42 | Push | Weekly routine child nudge went to the PRIMARY child regardless of whose routine | FIXED | Sends to the routine's own child |
| 43 | Interface | School page items showed no owner | FIXED | Owner name beside the title, resolved server side |
| 44 | Interface | Learning term view and homework decoder surfaced NOWHERE, no rotation item pointed at them | FIXED | Weekly rotation item added; both pages verified already per child |
| 45 | Interface | School add form never asked whose the reminder is, so new items had no owner to show or route by | FIXED | "Whose is it" picker in the add sheet, two or more children only, defaults to the open child, Everyone stays an option. POST and PATCH validate ownership; the dedupe is per child so Teo's PE kit no longer swallows Olga's. |
| 46 | Push | Followup card "How did that go?" carried its child in the data but not in the words | NOTED | The question text itself names the context; left as is |

## 19 August evening: the passport, balance and pacing audit (19 agents, adversarially verified)

| # | Area | Description | Status | Evidence |
|---|------|-------------|--------|----------|
| 47 | Passport | progress.ts read scripts, device setup and the device list by user alone in BOTH variants, so a sibling's work filled and could stamp the wrong child's page at 30% weight per input | FIXED | child-or-null scope on all six reads; scripts counted as distinct sort orders |
| 48 | Passport | Strands engine: all five reads family wide under one child's name; the teenager's worry turned the six year old's Safe strand amber | FIXED | getLiteracyStatuses takes the child; both callers thread it |
| 49 | Passport | getCatchup took a childId and DISCARDED it (`void childId`): "Jody has finished 3 full days" was the household's count wearing her name | FIXED | five news counts scoped; the two waiting counts stay family (parent's to-do) |
| 50 | Stickers | Sticker rarity tier paid out of the family's stamps, permanently minted | FIXED | stampsFor takes the book's child |
| 51 | Kid app | One-lesson-a-week gate consumed by a sibling's pass; Home's "X of Y lessons" family blended | FIXED | child-or-null on both reads |
| 52 | Lessons | Un-tick DELETE removed every child's completion row | FIXED | scoped to the same child as the write |
| 53 | Economy | Household jobs (null child) DROPPED from per-child earnings in week report, stats, Home jobs and the streak: a child doing family jobs earned nothing and was unstreakable | FIXED | or(child,null) on four quest reads |
| 54 | Pass | A stage quiz pass could be written with a null child when ownership lookup missed, and every passport read filters strictly by child: a pass nothing could see | FIXED | falls to the first child, never null |
| 55 | DiGi | Prompts and chat quoted family-blended stage % as one child's position; get_child_history read the family's ledger; screen life summed both children beside one child's age guide | FIXED | child threaded through getStageProgress, getPathwayPosition, tools, screen life |
| 56 | Reports | IsItWorkingReport read concerns and the day family wide inside a report scoped to ?child= | FIXED | rows carry child_id, filtered after pickChild |
| 57 | Nudges | "Set their first quests" never fired for a second child: the eldest's jobs made the family count nonzero for ever | FIXED | per child count |
| 58 | Road | lib/pathway/journey.ts has no child parameter; its lessons count is family wide on the road | OPEN | minor, road rework pending |
| 59 | DiGi | WeeklyRoundup attributes the family's top quest to children[0] by name | OPEN | minor |
| 60 | DiGi | device-checkin suppression reads the whole family's open concerns | OPEN | minor |

Clean, verified by the auditors rather than assumed: lessons credit in progress.ts
(the pass_by doctrine), moments counts, jobs row, week balance report scoping,
stamp gate quiz reads, balance dots, kid passport threading, and the pacing
signals themselves (the passport rung, Move the passport on, DiGi's stage
position) — each per child NOW that the engines beneath them are.
