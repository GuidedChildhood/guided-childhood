# Handoff: put the AI panel lessons into the app, by age stage

**From:** the research and content session (branch claude/kids-mental-health-researcher-uvdyfy)
**Date:** 25 July 2026
**Source content:** content/lesson-scripts/ai-panel-additions.md
**For:** the next build session that owns the platform or curriculum lane

Per non-negotiable 6, lessons are database rows, not hardcoded. This handoff turns the panel additions into rows in the right tables, staged to the right age. Nothing here is in the app yet. The scripts are written and committed. This is the wiring job.

## What needs to go in, and where

| Piece (in ai-panel-additions.md) | Age stage | App surface | Table |
|---|---|---|---|
| NEW LESSON, Let AI help you not do it for you | KS2, Years 3 to 6, ages 7 to 11 | Child lesson, interactive player | `public.school_lessons` (slides deck + video_beats) |
| KS3 uplift, added beat + framing | KS3, Years 7 to 9, ages 11 to 14 | Existing Lesson 12, Misinformation, deepfakes and AI content | update the Lesson 12 row in `public.school_lessons` |
| KS4 and KS5 uplift, cognitive offload beat | KS4 to KS5, ages 14 to 18 | Existing Lesson 20, AI mastery and data rights | update the Lesson 20 row in `public.school_lessons` |
| PARENT LESSON, connection over control | Parent | Parent lessons surface | `public.lessons` (parent seed, see 050_parent_lessons_seed.sql) |

## Steps

1. **Claim a migration number first.** Highest on origin/main is 062. Before writing, re-check origin/main and every open PR for the next free number (the sync rules in CLAUDE.md), then name it in the draft PR at claim time. Likely 063, do not assume.

2. **New KS2 lesson.** Insert one row into `public.school_lessons` following the exact shape in 033_full_curriculum.sql.
   - **Decided (Justin, 25 Jul 2026): this is module 22.** A clean addition, no renumbering of the existing 21. Do not touch the other modules' sort_order.
   - `module_id`: `ks2-22-ai-maker`.
   - `key_stage` KS2, `year_band` Years 3 to 6, `audience` teacher, `character_cast` DiGi.
   - `single_action_outcome`: I can let AI help me and still do the thinking myself.
   - Build the `slides` v3 deck from the seven beats in the script (title, objective, then one teaching slide per beat, DiGi closing), matching the teacher script and phase and minutes pattern already used in 033. `video_beats` can stay an empty array until a Higgsfield render pass, same as the other modules.
   - `sort_order`: place it after Lesson 6, How algorithms work, so the two KS2 AI lessons sit together, using a fractional or end sort value that does not disturb the existing rows.

3. **KS3 Lesson 12 update.** Add the extra teaching beat and the it-is-the-activity-not-the-device framing to the existing Lesson 12 row. Idempotent upsert, on conflict update, same as 033.

4. **KS4 to KS5 Lesson 20 update.** Add the cognitive offload beat (the autopilot metaphor) to the existing Lesson 20 row.

5. **Parent lesson.** Add one row to `public.lessons` in a seed migration in the style of 050_parent_lessons_seed.sql.
   - `stage_id`: pick the band that fits, likely `explorer` or `shaper`, `audience` parent, `category` screen_habits.
   - `title`: Connection, not control.
   - `the_idea`, `why_it_matters`, `try_this`, `key_message`, `digi_prompt`: draft straight from the PARENT LESSON section (the three parts, the dinner story, the come-to-you-or-hide-it line). Keep DiGi as calibrated pathway, never allow or deny.

6. **Checks before done.** Idempotent inserts (on conflict update), all content dollar quoted, no DO blocks (dashboard safe, as noted in 033). No dashes in any copy. Then mobile and desktop in the player, per non-negotiable 5.

## Guardrails carried from the source
- It is the activity, not the device, is the frame for the whole AI strand.
- The new lesson teaches the child to stay the maker, the explain-it-back test, never that AI is bad.
- No developmental outcome claims. The claim is you learn it when you can explain it, not that AI makes children cleverer.
- DiGi is a calibrated pathway everywhere it appears.
- Safeguarding lessons are untouched here.

## Decisions locked
Module number for the new KS2 lesson is **module 22** (Justin, 25 Jul 2026), a clean addition with no renumbering. Nothing else is blocked. The build session can proceed end to end.
