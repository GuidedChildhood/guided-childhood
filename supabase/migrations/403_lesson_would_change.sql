-- WHAT WOULD YOU CHANGE ABOUT THIS LESSON? (22 November 2026)
--
-- One optional line on a teacher's lesson record, beside the note. The note is
-- for the teacher's own record; this line is for us. A weekly digest
-- (app/api/cron/lesson-changes) sends Justin every line written that week, with
-- the revisit counts per lesson across all schools, so every lesson taught
-- anywhere can improve the lesson. Modelled on the French scheme, which its
-- author changes after every run. Plan: plans/2026-11-22-lesson-shape-vs-french-scheme.md.
--
-- No pupil data, the same 280 character rule as the note, and "no pupil names"
-- under the box. Nullable and additive: nothing that reads the table changes.

alter table schools.lesson_records
  add column if not exists would_change text
    check (would_change is null or length(would_change) <= 280);

comment on column schools.lesson_records.would_change is
  'Optional: what the teacher would change about the lesson. 280 characters, no pupil names. Read by the weekly lesson changes digest.';
