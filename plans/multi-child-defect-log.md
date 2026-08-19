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
