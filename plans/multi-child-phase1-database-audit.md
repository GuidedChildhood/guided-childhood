# Phase 1 — Database audit

Run against the live database (project zgkdfiwtnzqmtfgfsxzo) on 19 August 2026.
104 base tables. Nothing changed by this document: it is the findings, per the
rule that the audit is reported before anything is patched.

## The three questions, applied to every table

- **Whose is it?** Can the child be told from the row alone.
- **What happens with three children?** Does the key allow three rows.
- **Would a parent be confused?** Could a number belong to any of them.

---

## 1. THE DANGEROUS CLASS: keys that silently merge children

These are the ones the brief calls hardest to spot, and it is right: they do not
error, they present as MISSING DATA. The second child's write is rejected as a
duplicate and swallowed, or it overwrites the first child's row.

| # | Table | Key | What actually happens |
|---|-------|-----|----------------------|
| D1 | `digi_feedback` | `UNIQUE (user_id, feedback_date)` | **Has child_id and ignores it.** One DiGi feedback per family per day, so answering for Teo blocks Olga for the rest of the day. Identical shape to the moment_completions bug fixed in 211. |
| D2 | `lesson_completions` | `UNIQUE (user_id, lesson_id, lesson_source)` | No child_id at all. One lesson per household, ever. The eldest passing on Monday marks it done for everybody. |
| D3 | `script_completions` | `UNIQUE (user_id, script_sort_order)` | No child_id. Reading a script with the eldest retires it for the younger, who is never offered it. |
| D4 | `script_lines_used` | `UNIQUE (user_id, script_sort_order, line)` | No child_id. Which line worked for one child is recorded as which line worked, full stop. |
| D5 | `ai_literacy_checkins` | `UNIQUE (user_id)` | One row per household FOR EVER. A second child can never have one. |
| D6 | `digi_weekly_reviews` | `UNIQUE (user_id, week_start)` | One weekly review per household. Cannot be per child without a key change. |
| D7 | `family_agreements` | `UNIQUE (user_id)` | One agreement per household. Blocks per child agreements outright. **Blocked on question 1.** |

## 2. Child-scoped tables with no `child_id` column

| # | Table | Rows | How it currently decides whose |
|---|-------|------|-------------------------------|
| D8 | `school_actions` | 5 | Nothing. Every school item lands on every child. |
| D9 | `wellbeing_checkins` | — | Nothing. Note: `wellbeing_checks` (plural, different table) IS per child and correct. Two tables, one letter apart, one right and one wrong. |
| D10 | `digi_safety_flags` | — | Nothing. A safety flag cannot say which child it is about. |
| D11 | `script_requests` | — | Nothing. |
| D12 | `device_setup_progress` | — | Keyed `(user_id, device_key, family_device_id)`. Household by design, which matches Justin's shared device answer, but it means "devices done" cannot be a per child tick. **Depends on the device decision.** |
| D13 | `concern_events` | — | Via `concern_id`, which carries the child. Derivable, so acceptable as is. Noted, not a defect. |
| D14 | `digi_conversations` | `UNIQUE (user_id)` | One chat thread per parent. Arguably correct: DiGi is the PARENT's conversation, and it now reads every child. Flagged for a decision rather than assumed. |

## 3. Already correct: the child is in the key

holiday_allowance, job_streaks, kid_days, kid_homework_notes,
kid_lesson_missions, kid_links, kid_milestones, parent_lesson_completions,
stage_passports, star_goals, sticker_credits, wellbeing_checks, plus the four
fixed this week: quest_ticks (206), lesson_pass_by (208), daily_sessions (210),
moment_completions (211).

## 4. Correctly account or reference scoped, no change wanted

profiles, orders, order_items, products, email_log, lead_email_log,
starter_leads, spotlight_shown, feature_interest, keepsake_interest,
community_polls and votes, school_connections, schools, cron_runs,
platform_config, and every content table (lessons, scripts, daily_moments,
device_guides, curriculum_objectives, expert_knowledge, digi_wisdom, and the
rest).

## 5. Orphaned rows: a decision is needed, not a guess

Rows with a null `child_id` in a table that has the column. The brief says ask
rather than decide, so these are listed and nothing is touched.

| Table | Orphans | Total | My read |
|-------|---------|-------|---------|
| `family_quests` | 3 | 61 | **Almost certainly deliberate.** A null child is how a whole family job is expressed. Recommend LEAVE. |
| `quest_ticks` | 15 | 267 | Ticks with no child, from before the child was recorded. They pay stars to nobody. Recommend ASSIGN to the primary child, since they predate the second child being added. |
| `daily_sessions` | 1 | 16 | Pre migration 210. Counts for everybody, which is what it meant. Recommend LEAVE. |
| `digi_questions` | 1 | 64 | A question asked before DiGi recorded the child. Recommend LEAVE. |
| `digi_memory` | 1 | 41 | As above. Recommend LEAVE. |
| `digi_feedback` | 1 | 15 | As above. Recommend LEAVE. |

No orphan is in a table where a wrong guess would move stars or send anything to
a device, except `quest_ticks`, which is the one worth an actual answer.

## 6. What Phase 1 does NOT cover

Reads. A table can be perfectly per child and still be read `by user_id` on
sixteen pages, which is the fault that produced "Olga is done". That is Phase 2
and Phase 3, and it is where most of the remaining defects will be.
