-- Guided Childhood — Migration 035
-- An editable display name and optional URN on the school profile, so
-- educators can set who they are and correct the school details after
-- signup. Data minimisation still holds: display name is the teacher's
-- own, nothing about pupils changes.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

alter table public.school_educators
  add column if not exists display_name text;

-- urn already exists on school_accounts (migration 023); nothing to add
-- there. This migration is intentionally small.
