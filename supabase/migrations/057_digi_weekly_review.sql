-- Guided Childhood — Migration 057
-- The Sunday DiGi weekly review. Every Sunday evening DiGi looks across a
-- family's own week, the quests done, stars earned and spent, device minutes,
-- the streak, and hands the parent a warm summary plus one concrete thing to
-- set up for next week. Stored here so the dashboard can show the latest one
-- and the parent can act on it. One review per family per week (the Monday
-- that starts the week is the key), so a re-run never duplicates.
--
-- Never a report card on the child: the tone stands beside the parent,
-- celebrates effort, never shames a quiet week. The stats are the family's
-- own, never shared or compared.

create table if not exists public.digi_weekly_reviews (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  week_start         date not null,
  stats              jsonb not null default '{}'::jsonb,
  summary            text not null default '',
  watch_for          text,
  suggestion         text,
  suggestion_routine text,
  status             text not null default 'unread' check (status in ('unread','read','dismissed')),
  created_at         timestamptz not null default now(),
  unique (user_id, week_start)
);

create index if not exists idx_digi_weekly_reviews_user
  on public.digi_weekly_reviews (user_id, week_start desc);

alter table public.digi_weekly_reviews enable row level security;

create policy "Users read own weekly reviews" on public.digi_weekly_reviews
  for select using (auth.uid() = user_id);

create policy "Users update own weekly reviews" on public.digi_weekly_reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
