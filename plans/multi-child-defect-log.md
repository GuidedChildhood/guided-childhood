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
| 22 | Database | `digi_feedback UNIQUE(user_id, feedback_date)` ignores its own child_id | OPEN | Audit §1 D1 |
| 23 | Database | `lesson_completions` has no child_id; one lesson per household ever | OPEN | Audit §1 D2 |
| 24 | Database | `script_completions` has no child_id | OPEN | Audit §1 D3 |
| 25 | Database | `script_lines_used` has no child_id | OPEN | Audit §1 D4 |
| 26 | Database | `ai_literacy_checkins UNIQUE(user_id)` — one per household for ever | OPEN | Audit §1 D5 |
| 27 | Database | `digi_weekly_reviews UNIQUE(user_id, week_start)` | OPEN | Audit §1 D6 |
| 28 | Database | `family_agreements UNIQUE(user_id)` blocks per child agreements | BLOCKED | Question 1 |
| 29 | Database | `school_actions` has no child_id | OPEN | Audit §2 D8 |
| 30 | Database | `wellbeing_checkins` has no child_id (`wellbeing_checks` is the correct twin) | OPEN | Audit §2 D9 |
| 31 | Database | `digi_safety_flags` has no child_id | OPEN | Audit §2 D10 |
| 32 | Database | `script_requests` has no child_id | OPEN | Audit §2 D11 |
| 33 | Database | `device_setup_progress` is household scoped | BLOCKED | Device decision, Audit §2 D12 |
| 34 | Data | 15 orphan `quest_ticks` with no child | BLOCKED | Awaiting assign / leave |
| 35 | Interface | Passport count has no owner and "moments to resolve" 404s | OPEN | Justin's reference case, other session's lane |
