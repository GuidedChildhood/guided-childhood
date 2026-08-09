-- Guided Childhood — Migration 176 (split step 5, plans/split-plan.md)
-- The one cross product foreign key goes: kid_lesson_missions (a parent
-- feature) no longer hard references school_lessons (schools content),
-- because the schools tables move to their own schema in 177 and the two
-- products must not be chained at the database layer. The column keeps its
-- uuids and every sent mission keeps working; the app resolves the lesson
-- title at read time and shows a kind fallback if a lesson is ever retired.
--
-- Supabase editor rules: idempotent, flat statements. Revert is one line:
-- re add the constraint (data unchanged, so it validates instantly).

alter table public.kid_lesson_missions
  drop constraint if exists kid_lesson_missions_lesson_id_fkey;
