-- Guided Childhood — Migration 031
-- Kid reminders: a push subscription can now belong to a child's quest
-- page (child_id set) instead of the parent's dashboard (child_id null).
-- Parent check ins only ever go to parent subscriptions, kid quest
-- reminders only to the child's own device. Run AFTER 030.

alter table public.push_subscriptions
  add column if not exists child_id uuid references public.children(id) on delete cascade;
