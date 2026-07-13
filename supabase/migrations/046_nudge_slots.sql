-- Guided Childhood — Migration 046
-- When do you want your daily nudge? The check in pushes ran at three fixed
-- times for everyone. Now each subscription carries the slots the parent
-- actually wants (morning 7:30, afternoon 3:30, evening 9), defaulting to all
-- three so nothing changes for anyone who never touches the setting. The
-- routine choice as personalisation, the pattern the best daily apps use.

alter table public.push_subscriptions
  add column if not exists slots text[] not null default '{morning,afternoon,evening}';
