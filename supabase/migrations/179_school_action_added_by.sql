-- Guided Childhood — Migration 179
-- Who put this on the school diary.
--
-- Justin, 9 August 2026: the school diary moves to the top of the child's home
-- screen, the child can add things themselves, and it must be obvious which
-- items the child added and which the parent added.
--
-- Provenance is STORED, not inferred. Every row today came through the parent
-- (typed on the dashboard or extracted from a school email), so the default is
-- parent and the backfill is free. A guess from context would not survive an
-- edit, and the child's badge has to keep telling the truth after one.
--
-- added_by_child_id names WHICH child, because a family can have three and a
-- parent reading "added by your child" still has to ask the room. It is set
-- null on delete rather than cascading: the diary item outlives the child
-- record, it just stops naming them.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements only.

alter table public.school_actions
  add column if not exists added_by text not null default 'parent';

alter table public.school_actions
  add column if not exists added_by_child_id uuid references public.children(id) on delete set null;

alter table public.school_actions
  drop constraint if exists school_actions_added_by_check;

alter table public.school_actions
  add constraint school_actions_added_by_check check (added_by in ('parent', 'child'));
