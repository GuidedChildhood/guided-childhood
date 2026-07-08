-- Guided Childhood — Migration 036
-- School reminders reach the child too, not just the parent's card. A
-- reminder sent to the child is marked here so the button never
-- double sends and the parent can see at a glance what already went.

alter table public.school_actions add column if not exists sent_to_child boolean not null default false;
