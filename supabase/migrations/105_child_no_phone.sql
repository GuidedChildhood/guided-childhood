-- Guided Childhood — Migration 105
-- An explicit "this child has no phone" flag. The app already infers a parent
-- managed child from age and the absence of a kid link, but a family who will
-- never give a phone still got nudged to share the QR handover. This lets the
-- parent state it once, so the app stops asking and leans into the fridge and
-- parent managed flow (parent ticks jobs, parent starts the timer, stars still
-- land). Mirrors the existing per child device_trust column.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.children
  add column if not exists no_phone boolean not null default false;
