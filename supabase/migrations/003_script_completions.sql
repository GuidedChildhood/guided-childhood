-- Guided Childhood — Migration 003
-- Tracks which scripts a user has completed in the card deck flow.

create table if not exists public.script_completions (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  script_sort_order int       not null,
  completed_at    timestamptz not null default now(),
  unique(user_id, script_sort_order)
);

create index if not exists idx_script_completions_user
  on public.script_completions(user_id, completed_at desc);

alter table public.script_completions enable row level security;

create policy "Users can manage their own completions"
  on public.script_completions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
