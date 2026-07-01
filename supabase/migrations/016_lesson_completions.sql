-- Guided Childhood — Migration 016
-- Tracks which lessons a user has marked done. Neither the lessons table nor
-- ai_lessons had any per-user completion state before this, so lesson
-- progress could never be counted toward anything. lesson_source
-- disambiguates which table lesson_id points into, since ids are not
-- unique across the two tables.

create table if not exists public.lesson_completions (
  id            uuid        primary key default uuid_generate_v4(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  lesson_id     uuid        not null,
  lesson_source text        not null check (lesson_source in ('lesson', 'ai_lesson')),
  completed_at  timestamptz not null default now(),
  unique(user_id, lesson_id, lesson_source)
);

create index if not exists idx_lesson_completions_user
  on public.lesson_completions(user_id, completed_at desc);

alter table public.lesson_completions enable row level security;

create policy "Users can manage their own lesson completions"
  on public.lesson_completions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
