-- Guided Childhood — Migration 177 (split step 6, plans/split-plan.md)
-- The 11 schools tables and their 4 membership functions move from public
-- into their own schema, so the schools product owns its corner of the one
-- Supabase project and no schools RLS can ever couple to parent tables
-- (verified in the split audit: none did, this keeps it that way).
--
-- A schema move is metadata only: data, indexes, RLS policies and grants
-- travel with each table, instantly, and revert is the same statement with
-- the schemas swapped.
--
-- RUN 176 FIRST (the kid_lesson_missions FK must be gone before its target
-- leaves public).
--
-- AFTER RUNNING THIS, one dashboard action: Settings → API → Exposed
-- schemas → add "schools". Until that is saved, the app's schools schema
-- reads fall back to public and find nothing, so Star Lessons would show
-- an empty list: run this and save the setting in the same sitting.
--
-- Supabase editor rules: idempotent where the syntax allows, flat statements.

create schema if not exists schools;

grant usage on schema schools to anon, authenticated, service_role;

alter table if exists public.school_accounts     set schema schools;
alter table if exists public.school_educators    set schema schools;
alter table if exists public.school_classes      set schema schools;
alter table if exists public.pupils              set schema schools;
alter table if exists public.school_lessons      set schema schools;
alter table if exists public.lesson_deliveries   set schema schools;
alter table if exists public.check_responses     set schema schools;
alter table if exists public.teacher_judgements  set schema schools;
alter table if exists public.action_commitments  set schema schools;
alter table if exists public.evidence_items      set schema schools;
alter table if exists public.generated_reports   set schema schools;

-- The membership helper functions the RLS policies call. Moving them keeps
-- the whole schools security model in one schema; the policies hold the
-- function by identity, not by name, so the move is transparent to them.
-- (ALTER FUNCTION has no IF EXISTS, so rerunning this file after a
-- successful run stops here with "function does not exist in schema
-- public", which is the harmless sign the move already happened.)
alter function public.is_school_member(uuid)   set schema schools;
alter function public.is_school_lead(uuid)     set schema schools;
alter function public.is_class_member(uuid)    set schema schools;
alter function public.is_delivery_member(uuid) set schema schools;

-- Default privileges so future schools tables behave like the moved ones.
alter default privileges in schema schools grant select on tables to anon, authenticated;
