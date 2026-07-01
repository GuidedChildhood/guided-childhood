# Week 8 (cont.) — The pathway spine: connecting scripts, DiGi, progress, and lessons

**Date:** 2026-07-01
**Branch:** claude/agent-management-guided-childhood-lDYLl
**Status:** Approved, building. Not merging to main yet, per explicit instruction.

## What audit found

Every individual feature works. Nothing connects them into one guided journey:
- The challenge answer from the starter-pack quiz personalizes the result screen once, then is never read again inside the dashboard.
- DiGi has stage context but no concept of "what task is next," so it never proactively directs, only reacts.
- No lesson completion tracking exists at all (ai_lessons and lessons have no per-user done/not-done state).
- Scripts, daily practice, devices, and lessons each have their own counter. Nothing rolls them into one progress number.
- Family agreements are marketing copy for a feature that was never built (deferred, separate project per decision).

## Decisions (confirmed with Justin)

1. Guided but not locked: show a clear "next recommended task," never lock other content behind it.
2. Family agreements: separate project, not this round.
3. Progress percentage per stage = average of: scripts read, daily practice streak, devices set up, lessons completed.

## Build order

1. Migration 016: `lesson_completions` table (mirrors script_completions pattern), since lessons currently have no completion tracking at all. Covers both the `lessons` table and `ai_lessons` table via a source column.
2. `lib/content/challenge-map.ts`: maps each onboarding ChallengeId to the script category it matches, so the challenge answer becomes useful again.
3. Shared stage progress calculator (`lib/pathway/progress.ts`): given a user and stage, returns scripts/streak/devices/lessons sub-scores and one blended percentage.
4. `/dashboard/scripts`: scripts matching the parent's challenge surface first within their stage, with a small "Matches what you told us" tag. A "Recommended next" card at the top surfaces the single best next script.
5. `/dashboard/pathway`: show the blended progress percentage per stage card, most prominent on the current stage.
6. `/api/digi/route.ts`: inject the same "recommended next script" into the system prompt so DiGi can mention it proactively when relevant, not just answer what is asked.
7. Add "Mark as done" to the AI module and Lessons hub detail pages (mirroring the Device Hub pattern), writing to lesson_completions, so lesson completion is real, trackable data, not aspirational.

## Non-negotiables carried over

No dashes in copy. Design tokens only. No new dark backgrounds. Mobile checked before done.
