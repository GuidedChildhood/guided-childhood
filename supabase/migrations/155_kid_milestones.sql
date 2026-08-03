-- Guided Childhood — Migration 155
--
-- A child's wins, written down, so a celebration is a fact rather than a
-- browser setting.
--
-- Justin: "when streaks are achieved on child's app the add a family member are
-- real celebrations and can pop up then on next login so you can see the family
-- growing and they feel they have achieved. need to show clearly what they have
-- achieved in streaks so if comparing with sibling they can see how they
-- progressed, also letting parents know streaks achieved link to passport
-- purchase and family stickers option."
--
-- THREE ASKS, AND THEY ALL NEED THE SAME ROW.
--
--   1. It pops on next login. So something has to know the child has not seen it
--      yet, which is a different question from whether they earned it.
--   2. It shows clearly what was achieved. So the win has to survive being
--      celebrated, as a record rather than a moment.
--   3. The parent is told. So it has to be readable from the parent's side, days
--      later, by an email job that was nowhere near the child's screen.
--
-- WHAT IS THERE NOW, AND WHY IT CANNOT DO ANY OF THE THREE. Every celebration on
-- the child's home screen is localStorage:
--
--   gc_kid_friends_earned   a Planet Friend joined
--   gc_kid_bank_mile        a star bank milestone
--   gc_kid_streak_seen      a run of days
--
-- So a win celebrates once per DEVICE. Twice for a child with a tablet and a
-- phone. Never again on a cleared browser, and never at all on a new one. The
-- server never learns it happened, so no parent can be told and no record can be
-- shown. A child asked "how many streaks have you got?" has nothing to point at.
--
-- WHAT IS ALREADY RIGHT, AND WHAT THIS COPIES. Migration 109 solved exactly this
-- for stickers: earned_stickers.celebrated, flipped by /api/kid/stickers/seen,
-- and its own comment says why a plain "is it earned" check cannot tell whether
-- the child has seen the moment yet. This is that idea with room for the other
-- three kinds of win, so there is one queue rather than four half ones.
--
-- WHY NOT DERIVE IT ON READ. The counts are all derivable: streaks from
-- kid_days, Friends from the streak count, stars from the bank. What is not
-- derivable is whether a child has SEEN a win, and that is the whole feature. A
-- derived list would celebrate every milestone on every load forever.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

create table if not exists public.kid_milestones (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        not null references public.children(id) on delete cascade,

  -- What kind of win. Three today:
  --   friend  a Planet Friend joined the family (every four streaks)
  --   run     days in a row: 3, 5, 7, 10, 14, 21, 30, 50, 100
  --   bank    stars banked: 10, 25, 50, 100, 200, 500
  kind          text        not null,

  -- The rung of that ladder, as text so a future kind can key on something that
  -- is not a number. Unique per child per kind, which IS the once only rule: the
  -- insert simply does nothing the second time a win is noticed.
  key           text        not null,

  -- The number behind it, for the record card and for sorting. Streak count for
  -- friend, days for run, stars for bank.
  value         integer     not null default 0,

  -- What to say, written at the moment it is earned rather than recomputed on
  -- read. A win that happened in April must still read the way it read in April,
  -- even after the copy changes, and the parent's email must be able to name it
  -- without knowing anything about ladders.
  label         text        not null,
  detail        text,
  -- Which squad friend delivers it, so the pop has a face. Matches the character
  -- keys HappyNews already takes.
  character     text        not null default 'orbit',

  earned_on     date        not null default ((now() at time zone 'Europe/London')::date),

  -- Null until the child has actually seen it on a screen. This is the column
  -- that makes "pops on next login" true rather than nearly true.
  celebrated_at timestamptz,

  -- Null until the parent has been told. A separate clock on purpose: the child
  -- seeing their moment and the grown up hearing about it are different events,
  -- and the email must not depend on the child having opened the app.
  told_parent_at timestamptz,

  created_at    timestamptz not null default now(),

  unique (child_id, kind, key)
);

comment on table public.kid_milestones is
  'A child''s real wins, one row each, written once. celebrated_at is whether the child has seen it; told_parent_at is whether the grown up has heard. The row outlives both, which is what makes it a record a child can show a sibling.';

-- The child's own queue: what is waiting to be celebrated, newest first.
create index if not exists kid_milestones_pending_idx
  on public.kid_milestones (child_id, earned_on desc)
  where celebrated_at is null;

-- The parent's queue: what they have not been told about yet, across children.
create index if not exists kid_milestones_untold_idx
  on public.kid_milestones (user_id, earned_on desc)
  where told_parent_at is null;

-- The record card: everything this child has ever done, in order.
create index if not exists kid_milestones_record_idx
  on public.kid_milestones (child_id, kind, value desc);

alter table public.kid_milestones enable row level security;

-- The parent reads their own family's wins, which is what the dashboard card and
-- the monthly email are built on.
drop policy if exists "Parents read own kid milestones" on public.kid_milestones;
create policy "Parents read own kid milestones"
  on public.kid_milestones for select
  using (auth.uid() = user_id);

-- No insert or update policy, deliberately. The child's app has no account and
-- no session: it authenticates with the link token and writes through the
-- service role, exactly like quest_ticks, kid_days and earned_stickers. A parent
-- must never be able to write their child a milestone, because then the record a
-- child shows their sibling would be worth nothing.
