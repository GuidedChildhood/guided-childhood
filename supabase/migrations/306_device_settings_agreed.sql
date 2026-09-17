-- Guided Childhood, Migration 306
--
-- DEVICE SETTINGS AGREED. A third honest answer, so a stage is never locked
-- shut by a decision a family made well.
--
-- Justin, 17 September 2026: "don't want to force then never able to complete
-- stage of passport ... maybe override which just means a note added device
-- settings agreed but set trust child."
--
-- device_setup_progress.status has carried two values since 090: done, the
-- settings walkthrough has been worked through on that screen, and not_owned,
-- we do not have this. A family who owns a Switch, has talked about it, and has
-- decided together that this one runs on trust has neither. Their only moves
-- were to claim settings they have not set, to claim they do not own it, or to
-- leave the stage short for good.
--
-- The third value is 'agreed'. It counts for the passport exactly as done does,
-- because every reader already counts status <> 'not_owned'. What it carries
-- instead of a walkthrough is this column: one line, in the parent's words, of
-- what was actually agreed. That line is the whole point. The record then says
-- a decision was made, rather than that a job was skipped.
--
-- The status column has no check constraint, so the third value itself needs no
-- DDL. Only the note does.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside string
-- literals, flat statements only.

alter table public.device_setup_progress
  add column if not exists agreed_note text;

comment on column public.device_setup_progress.agreed_note is
  'What the family agreed instead of setting controls, in their own words. Only meaningful when status is agreed.';
