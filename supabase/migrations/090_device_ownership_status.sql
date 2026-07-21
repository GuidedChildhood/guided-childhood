-- Guided Childhood — Migration 090
-- Device ownership state. A parent should not have to pretend to own a device
-- to clear it off the checklist. This adds a status to device_setup_progress
-- so a device can be marked "not in our home yet": it drops off the active
-- coverage ring and the layers, but stays findable in a quiet group so the
-- moment they do get it, the age matched settings guide is one tap away.
--
-- Every existing row is a real set up, so the column defaults to 'done' and
-- nothing already recorded changes meaning.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside
-- string literals, flat statements only.

alter table public.device_setup_progress
  add column if not exists status text not null default 'done';
