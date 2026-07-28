-- Guided Childhood — Migration 117
-- Record when a family actually prints their star chart.
--
-- The Quests board's tiles carry live status, and the star chart tile was the
-- one that could not. It wanted to say "Not printed yet", which is the single
-- most useful thing that tile could tell a parent, and nothing in the system
-- knew: StarChartBuilder built the chart, opened the print dialog and saved
-- nothing at all. So the badge could only ever have been a guess inferred from
-- something adjacent, and a number a parent learns to distrust is worse than no
-- number. This is the column that knows.
--
-- Deliberately NOT printable_completions. That table is the child's side of the
-- loop: a child marks a sheet "show my grown up" and the parent confirms it for
-- stars. A parent printing a chart is the opposite direction and carries no
-- pending state, and folding it in there would have quietly inflated the
-- Printables "waiting" badge with rows nobody is waiting on.
--
-- A row per print rather than a flag, so a reprint is visible. The chart goes
-- stale when the jobs on it change, and knowing the last print was in March
-- when the jobs changed in July is a thing we will want to say later. Today
-- only "has this family ever printed one" is read.
--
-- child_id is nullable: a family with one child prints one chart and never
-- picks anybody, and a chart built before any child exists is still a print.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.star_chart_prints (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        references public.children(id) on delete cascade,
  printed_at timestamptz not null default now()
);

-- The only read this supports today is "the most recent print for this family",
-- which this index answers without touching the table.
create index if not exists idx_star_chart_prints_user
  on public.star_chart_prints (user_id, printed_at desc);

alter table public.star_chart_prints enable row level security;

drop policy if exists "star_chart_prints_own" on public.star_chart_prints;

create policy "star_chart_prints_own" on public.star_chart_prints
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
