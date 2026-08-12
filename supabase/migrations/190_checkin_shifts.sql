-- Guided Childhood — Migration 190
--
-- The check in data goes onto the DiGi brain.
--
-- Justin: "we must make sure that the check in data goes onto digi brain.
-- Digi must learn what we did when the rating goes up ... like natural
-- selection we need to examine what works and why from data."
--
-- THE HOLE THIS FILLS. wellbeing_checks has held five scores out of five, per
-- child, per week, since migration 001, and DiGi reads the last six weeks of
-- it in chat. But nothing anywhere ever connected a rating MOVING to what the
-- family actually did that week. A rise was a nicer number in the context; the
-- scripts tried, the Sunday plan agreed, the follow ups answered in the same
-- seven days were all in other tables, and no code ever put the two side by
-- side. DiGi could see the family got better and could not say what they did.
--
-- So this table is the join, computed once a week by /api/cron/checkin-learning:
-- one row per child per week that compares this week's ratings with the
-- previous week's, per dimension, and carries a list of everything the family
-- did in that window. Up, down or flat, plus the evidence. The chat context,
-- the Sunday review, the weekly plan generator, the wisdom rebuild and the
-- founder insight agent all read it, each for their own half of the loop.
--
-- WHY COMPUTED ROWS RATHER THAN A VIEW. The moment of computation matters: the
-- cron also writes a digi_memory fact when a rating rises ("the week of X they
-- did Y and things got better"), and that must happen exactly once per shift,
-- which needs a row that either exists or does not. A view cannot remember
-- that it already told the brain.
--
-- PRIVACY. Rows are per family and readable only by their owner. The cross
-- family reader (rebuildWisdom, the insight agent) uses the service role and
-- reads shapes and directions, never notes. Same rule as migration 147.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

create table if not exists public.checkin_shifts (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  child_id        uuid        references public.children(id) on delete cascade,

  -- The newer of the two weeks being compared, as stored on wellbeing_checks.
  week_start      date        not null,
  prev_week_start date        not null,

  -- Average of whichever of the five scores were filled in, 1 to 5.
  avg_now         numeric(3, 2),
  avg_prev        numeric(3, 2),
  direction       text        not null check (direction in ('up', 'down', 'flat')),

  -- Per dimension detail, only the dimensions present in both weeks:
  -- {"mood": {"now": 4, "prev": 2}, "sleep": {"now": 3, "prev": 3}}
  dimensions      jsonb,

  -- What the family actually did in the window, gathered from the tables that
  -- already record it: [{"kind": "script", "detail": "..."}]. Kinds today:
  -- script, plan, followup, moment, lesson. The evidence half of the row.
  actions         jsonb       not null default '[]'::jsonb,

  -- Whether an agreed Sunday plan was live during the window. A fall under a
  -- live plan is the single most useful row here: it is the one that earns
  -- the family a different plan next Sunday.
  had_plan        boolean     not null default false,

  -- One plain sentence for the DiGi context, written by the cron. No dashes.
  summary         text,

  created_at      timestamptz not null default now()
);

-- One shift per child per week. child_id can be null (a check in saved before
-- any child row existed), so the uniqueness lives in an expression index; the
-- cron selects before inserting rather than upserting against it.
create unique index if not exists idx_checkin_shifts_once
  on public.checkin_shifts (user_id, coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid), week_start);

-- The family's own read, newest first.
create index if not exists idx_checkin_shifts_user
  on public.checkin_shifts (user_id, week_start desc);

-- The cross family read: recent shifts by direction for wisdom and insights.
create index if not exists idx_checkin_shifts_recent
  on public.checkin_shifts (week_start desc, direction);

alter table public.checkin_shifts enable row level security;

-- Dropped first, because create policy has no "if not exists" and this file
-- has to be safe to run twice.
drop policy if exists "Users read own checkin shifts" on public.checkin_shifts;

-- Owner reads only. Writes come from the cron through the service role, which
-- bypasses RLS, so no insert or update policy exists on purpose: a client can
-- never write its own history of what worked.
create policy "Users read own checkin shifts" on public.checkin_shifts for select
  using (auth.uid() = user_id);

comment on table public.checkin_shifts is
  'One row per child per week: did the wellbeing rating move against the previous week, and what did the family do in that window. Computed by /api/cron/checkin-learning. The selection data of the natural selection loop.';
