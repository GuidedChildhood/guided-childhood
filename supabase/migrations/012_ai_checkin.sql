-- Guided Childhood: AI Literacy check-in for parents of children aged 11+
-- Stores parent answers to a short AI readiness questionnaire.
-- One row per user (upsert on user_id).
create table if not exists public.ai_literacy_checkins (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  answers    jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint ai_literacy_checkins_user_unique unique (user_id)
);

alter table public.ai_literacy_checkins enable row level security;

create policy "Users can read own checkins"
  on public.ai_literacy_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.ai_literacy_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.ai_literacy_checkins for update
  using (auth.uid() = user_id);

create index if not exists ai_checkins_user_idx on public.ai_literacy_checkins (user_id);
