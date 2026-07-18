-- Guided Childhood — Migration 070
-- When a parent cannot find a script for their problem, they tell DiGi in plain
-- words. DiGi points them at the closest one we have, and the ask lands here so
-- the founder sees, in the insights dashboard, exactly what parents needed and
-- could not find. That is the pipeline for writing the next scripts from real
-- demand, not guesswork.

set lock_timeout = '3s';

create table if not exists public.script_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem text not null,
  matched_sort_order int,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_script_requests_status on public.script_requests (status, created_at desc);

alter table public.script_requests enable row level security;

drop policy if exists script_requests_insert_own on public.script_requests;
create policy script_requests_insert_own on public.script_requests
  for insert with check (auth.uid() = user_id);

drop policy if exists script_requests_select_own on public.script_requests;
create policy script_requests_select_own on public.script_requests
  for select using (auth.uid() = user_id);
