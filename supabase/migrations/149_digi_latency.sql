-- Guided Childhood — Migration 149
--
-- How long DiGi actually takes, per phase, per message.
--
-- Justin, twice: "DiGi took a little bit long to load answer." The closed loop
-- plan parked it with the instruction that matters: measure before touching it.
-- This table is where the measurements land.
--
-- WHY A TABLE AND NOT JUST THE HEADER. The route also emits Server-Timing,
-- which Chrome DevTools renders natively, and that is the fastest way to see
-- one request. But one request is an anecdote. "DiGi felt slow" is a claim
-- about a distribution, and the fix depends on which phase is slow at the
-- ninetieth percentile rather than which one was slow the single time somebody
-- happened to have DevTools open. Deciding between an index, a wider keyword
-- list and leaving our own code alone entirely needs a spread of real rows.
--
-- WHY TIME TO FIRST TOKEN IS THE HEADLINE. The reply streams. What a parent
-- feels is when it starts moving, not when it finishes. Nine seconds that start
-- in one read as fast; four seconds of nothing then a whole reply reads as slow.
-- total_ms stops at the first byte for exactly that reason, and it is the sum of
-- the six phases rather than the length of the request.
--
-- WHAT IS DELIBERATELY NOT IN HERE. The message. Not a truncated version of it,
-- not a hash of it. Durations, the lane, whether a tool fired, whether it was
-- the first message of a thread. A latency table has no business holding what a
-- worried parent typed at midnight, and once a column like that exists somebody
-- will eventually have a good reason to read it.
--
-- WRITTEN OFF THE HOT PATH. The insert happens inside the existing after() call
-- in the route, which already runs once the reply is on its way. A write on the
-- critical path would add latency to the thing being measured, which is a
-- genuinely funny way to break a performance investigation.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

create table if not exists public.digi_latency (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Kept so a slow family can be looked at as a family: their row count, their
  -- history size, their child. Cascades, so a deleted account takes its timings
  -- with it rather than leaving orphans nobody can attribute.
  user_id uuid references auth.users(id) on delete cascade,

  -- The six phases, in the order the route runs them. Nullable rather than
  -- defaulted to zero: a phase that did not run and a phase that took no time
  -- are different facts, and a zero here would quietly claim the second when it
  -- meant the first.
  auth_ms integer,
  gather1_ms integer,
  lane_ms integer,
  gather2_ms integer,
  prompt_ms integer,
  model_ms integer,

  -- The sum of the above, stopping at the first byte out.
  total_ms integer,

  -- The shape of the message, for slicing. lane 'general' skips most of round
  -- two, so mixing those in with parenting messages would flatter the average
  -- and hide the case that actually matters.
  lane text,
  first_message boolean,
  tool_fired boolean
);

comment on table public.digi_latency is
  'One row per DiGi message: how long each phase took before the first token reached the parent. Durations only, never message content.';

comment on column public.digi_latency.total_ms is
  'Time to FIRST TOKEN, not total request duration. The reply streams, so this is the number a parent actually feels.';

comment on column public.digi_latency.model_ms is
  'Anthropic time to first token. If this dominates, the fix is not in our own code.';

comment on column public.digi_latency.lane_ms is
  'classifyLane. Near zero when the keyword pass answers it, up to 8000 when it falls through to the model. A big number here means widen the keyword list.';

comment on column public.digi_latency.tool_fired is
  'Whether a client tool ran, which costs a whole extra model turn. Note this is known only after streaming starts, so it describes the request, not the measured window.';

-- Reading is always "the recent ones", so the index matches.
create index if not exists digi_latency_created_at_idx
  on public.digi_latency (created_at desc);

-- ── RLS ───────────────────────────────────────────────────────────────────
--
-- Nobody reads this from the browser. It is founder diagnostics, and the only
-- writer is the route's own server side client acting as the signed in user.
-- So: insert allowed for the owner, no select policy at all. Service role
-- bypasses RLS and is how the numbers get read.

alter table public.digi_latency enable row level security;

drop policy if exists "own latency insert" on public.digi_latency;
create policy "own latency insert" on public.digi_latency
  for insert with check (auth.uid() = user_id);
