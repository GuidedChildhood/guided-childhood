-- Guided Childhood — Migration 075
-- DiGi's graded literacy check ins. Each week DiGi asks the parent one short
-- question on a strand (safe online always, social media from 13). The answer
-- is graded by DiGi into green or red with one warm line of why, stored here,
-- and folded into the strand ticks on the Progress page, so the conversation
-- itself becomes part of the reading.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.literacy_checkins (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  strand     text        not null check (strand in ('safe', 'social')),
  question   text        not null,
  answer     text        not null,
  grade      text        not null check (grade in ('green', 'red')),
  grade_note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_literacy_checkins_user on public.literacy_checkins (user_id, strand, created_at desc);

alter table public.literacy_checkins enable row level security;

drop policy if exists "literacy_checkins_own" on public.literacy_checkins;

create policy "literacy_checkins_own" on public.literacy_checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
