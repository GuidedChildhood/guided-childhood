-- Guided Childhood — Migration 164
--
-- The concern ledger stops overwriting itself.
--
-- Today `concerns` holds one row per (user_id, slug) and every status change is
-- an UPDATE in place. `app/api/concerns/status/route.ts` and
-- `app/api/daily/concern-check/route.ts` both read the row, compute the next
-- status, and write it back. So at any moment we know where a family is and we
-- have destroyed how they got there.
--
-- What that costs, concretely. On 6 August 2026 there were 67 concerns across 44
-- parents, 23 of them already marked resolved and 9 improving. We could not say
-- when a single one of them resolved, how long it took, how bad it was to begin
-- with, whether it came back, or what the parent did in between. The most
-- valuable thing the product knows, and it was unreadable.
--
-- WHY AN EVENT LOG RATHER THAN MORE COLUMNS ON `concerns`
--
-- Adding resolved_at and a severity column would answer today's question and
-- lose tomorrow's. A concern that resolves, comes back and resolves again is the
-- single most interesting shape in the data, and any design that keeps one
-- current value per concern flattens it back out the second it happens. The
-- recurrence is not noise around the result, it IS the result: a pattern that
-- keeps failing at bedtime for 8 year olds should lose weight in what DiGi
-- recommends, and it can only do that if the failures survive.
--
-- So `concerns` keeps its current state, unchanged, as the fast read every
-- existing call site already depends on. `concern_events` is append only and
-- becomes the evidence. Nothing in this migration alters `concerns`, so no
-- existing query changes behaviour.
--
-- ON THE BACKFILL AND WHY IT IS FLAGGED
--
-- The 67 concerns that already exist get a reconstructed opening event, and the
-- 23 already resolved get a reconstructed closing one, so the history does not
-- start empty and a parent who has been here for months does not see a blank
-- page. Those rows are stamped `backfilled = true`, because their timestamps are
-- inferred from created_at and last_checked_at rather than observed at the time.
-- Any figure we ever publish has to be able to exclude them. Reconstructed data
-- presented as measured is how an evidence base becomes a liability.
--
-- Supabase editor rules: idempotent creates, flat statements, seeds guarded.

create table if not exists public.concern_events (
  id uuid primary key default gen_random_uuid(),
  concern_id uuid not null references public.concerns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  -- flagged   the parent raised it, first time or again
  -- checked   the daily loop asked how it went and got an answer
  -- resolved  the parent said it is sorted
  -- recurred  it came back after being sorted
  -- reopened  the parent put it back on the list without it being a recurrence
  event text not null check (event in ('flagged', 'checked', 'resolved', 'recurred', 'reopened')),

  -- The parent's own read, 0 fine to 10 the worst it gets. Null whenever we did
  -- not ask or they did not answer, which is most of the time by design: the
  -- number is always optional and the product never blocks on it.
  severity smallint check (severity >= 0 and severity <= 10),

  -- Asked once, at the point of resolution: looking back now, how bad was it
  -- when you started. This is the retrospective pre-test, and it is here because
  -- people re-calibrate what a 7 means as they learn more about their own
  -- problem. Comparing this to the closing severity is the standard correction
  -- for that drift, and it costs one extra question.
  severity_at_start smallint check (severity_at_start >= 0 and severity_at_start <= 10),

  -- The daily loop's three way answer, kept alongside the number rather than
  -- replaced by it. It is answered far more often, so it stays the thing that
  -- moves status.
  answer text check (answer in ('better', 'same', 'hard')),

  -- Which surface this came from, so we can tell a Right Now rescue at 7pm from
  -- a calm moment picked on the pathway.
  source text,

  -- What the parent had just used, when we know it. This is what turns "it got
  -- better" into "it got better after they tried this", which is the only way to
  -- answer how. A sequence, never proof of cause.
  linked_type text check (linked_type in ('script', 'lesson', 'digi', 'moment', 'rightnow')),
  linked_id uuid,

  -- True for the one time reconstruction below, false for everything observed
  -- live from here on. Never publish a number without checking this column.
  backfilled boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists idx_concern_events_concern
  on public.concern_events (concern_id, created_at);

create index if not exists idx_concern_events_user
  on public.concern_events (user_id, created_at desc);

-- The aggregate reads (how many moved, by how much, how many came back) scan by
-- event across every family, so this one carries the reporting.
create index if not exists idx_concern_events_event
  on public.concern_events (event, created_at desc);

alter table public.concern_events enable row level security;

-- A parent reads and writes only their own events, same shape as the concerns
-- policy this sits beside. The wisdom rebuild reads through the service role.
drop policy if exists "own concern events" on public.concern_events;
create policy "own concern events" on public.concern_events
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "service role manages concern events" on public.concern_events;
create policy "service role manages concern events" on public.concern_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ════════════════════════════════════════════════════════════════════════════
-- ONE TIME RECONSTRUCTION
--
-- An opening event for every concern that already exists, dated from when the
-- concern was created, and a closing event for every one already resolved,
-- dated from the last time anyone checked it. Both stamped backfilled.
--
-- No severity on either, because nobody was ever asked. A null here is honest;
-- a guessed number would quietly poison every average we ever compute.
--
-- Guarded on the absence of a backfilled row for that concern, so a re-run in
-- the Supabase editor inserts nothing.
-- ════════════════════════════════════════════════════════════════════════════

insert into public.concern_events (concern_id, user_id, event, source, backfilled, created_at)
select c.id, c.user_id, 'flagged', c.source, true, c.created_at
from public.concerns c
where not exists (
  select 1 from public.concern_events e
  where e.concern_id = c.id and e.event = 'flagged' and e.backfilled = true
);

insert into public.concern_events (concern_id, user_id, event, source, backfilled, created_at)
select c.id, c.user_id, 'resolved', c.source, true, coalesce(c.last_checked_at, c.last_flagged_at)
from public.concerns c
where c.status = 'resolved'
and not exists (
  select 1 from public.concern_events e
  where e.concern_id = c.id and e.event = 'resolved' and e.backfilled = true
);
