-- Guided Childhood — Migration 034
-- Star Lessons: parents send a lesson to a child as a mission, the child
-- plays the pretty kid version through their private quest link, and the
-- multiple choice checks at the end pay stars into the same star bank the
-- quests feed. The lessons are the schools curriculum rows (audience
-- column made this the plan from day one). Kid access goes through the
-- kid_links token exactly like quest ticks: no account, no login.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.kid_lesson_missions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        not null references public.children(id) on delete cascade,
  lesson_id     uuid        not null references public.school_lessons(id) on delete cascade,
  stars         int         not null default 3 check (stars between 1 and 10),
  status        text        not null default 'sent' check (status in ('sent', 'done')),
  score_correct int,
  score_total   int,
  sent_at       timestamptz not null default now(),
  completed_at  timestamptz,
  unique (child_id, lesson_id)
);

alter table public.kid_lesson_missions enable row level security;

drop policy if exists "Parents manage own lesson missions" on public.kid_lesson_missions;
create policy "Parents manage own lesson missions" on public.kid_lesson_missions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists idx_kid_lesson_missions_child on public.kid_lesson_missions (child_id, status);
create index if not exists idx_kid_lesson_missions_user  on public.kid_lesson_missions (user_id, sent_at desc);
