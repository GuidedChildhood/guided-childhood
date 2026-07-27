-- Guided Childhood — Migration 096
-- The jobs streak. Five days in a row where every job a parent set for that day
-- was done by the child and confirmed on time. A completed streak is a real
-- milestone: it shows the child a gift is coming, alerts the parent with the
-- reward to send (a printable, device time or a lesson), stamps the passport for
-- that stage, and is remembered as brain data DiGi can refer to later.
--
-- The run itself is worked out in code from family_quests and quest_ticks, so a
-- day only counts when every job due that day has an approved tick dated that
-- day. A job done late lands on a later date, so the missed day never fills and
-- the run resets to zero. This table only records the moments a streak is
-- actually completed, and doubles as the parent alert and reward queue: a row
-- with no reward_sent_at is a streak still waiting for the parent to celebrate.
--
-- The parent alert rides the existing digi_prompts flow and the brain note is
-- written to digi_memory, both from the API, so nothing new is needed for those.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.job_streaks (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  child_id       uuid        not null references public.children(id) on delete cascade,
  stage_id       text        not null,
  length         int         not null default 5 check (length between 1 and 60),
  started_on     date        not null,
  completed_on   date        not null,
  child_seen_at  timestamptz,
  parent_seen_at timestamptz,
  reward_kind    text        check (reward_kind in ('printable', 'device_time', 'lesson', 'tutor', 'other')),
  reward_note    text,
  reward_sent_at timestamptz,
  brain_note     text        not null default '',
  created_at     timestamptz not null default now(),
  unique (child_id, completed_on)
);

create index if not exists idx_job_streaks_user  on public.job_streaks (user_id, created_at desc);
create index if not exists idx_job_streaks_child on public.job_streaks (child_id, completed_on desc);
create index if not exists idx_job_streaks_queue on public.job_streaks (user_id, reward_sent_at, parent_seen_at);

alter table public.job_streaks enable row level security;

drop policy if exists "job_streaks_own" on public.job_streaks;

create policy "job_streaks_own" on public.job_streaks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
