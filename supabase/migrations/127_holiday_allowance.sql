-- Guided Childhood — Migration 127
--
-- Holiday allowance: the screen time a child earned that the week had no room
-- for, banked for the school holidays.
--
-- Justin: "when they run over, the stars and minutes earned higher than they
-- can use in a normal week ... maybe any extra should be used for holiday
-- allowance." And: "we do need to let the child app know that any unused stars
-- go towards holiday amount, and when we say holiday it is the school holiday
-- period."
--
-- What this replaces is not a feature, it is a hole. lib/quests/bank.ts caps the
-- week with Math.min(week.earned, weekCap) and the difference was simply
-- discarded. In the live data that is 180 stars for one test child over four
-- weeks and 97 for another: fifteen hours of earned screen time that evaporated,
-- with nothing anywhere telling the child it had happened. They did the jobs and
-- bought nothing.
--
-- ── Why this beats the flat holiday lift it replaces ────────────────────────
--
-- The first attempt at holidays gave every family the same automatic increase,
-- 1.6x in summer. That is precisely "handed over", and the product says the
-- opposite on its own welcome card: screen time is "earned from real world
-- jobs, never just handed over". A child who did nothing all term got the same
-- August as one who did everything.
--
-- Banking the surplus keeps the term time ceiling exactly where the evidence
-- puts it, wastes none of the effort above it, and makes holiday screen time
-- the one thing the whole product claims it is. It is also a lesson a child can
-- actually see: the work you did in June is why there is more in August.
--
-- ── Surplus is not the same as unused, and both now pay ─────────────────────
--
--   UNUSED    time you had available and chose not to spend. Already pays, in
--             sticker credits (migration 124). Rewards restraint.
--
--   SURPLUS   work you did that the week had no room for. Pays here. Rewards
--             effort.
--
-- Two different behaviours, deliberately two different rewards, and neither
-- cannibalises the other: a child cannot bank surplus by simply not watching,
-- and cannot earn sticker credits by doing more jobs.
--
-- ── Spending it ─────────────────────────────────────────────────────────────
--
-- Holiday minutes are spendable ONLY during a school holiday, which is the
-- window lib/learning/holidays.ts already knows for the UK and the US. Outside
-- one they sit banked and visible. That is the point: a balance you can see and
-- cannot touch yet is what makes it a saving rather than a top up.
--
-- Never expires and never resets. It is the counterweight to the weekly reset,
-- which is what stopped hoarding in the first place: the reset says you cannot
-- stockpile ordinary screen time, and this says the extra work still counted.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.holiday_allowance (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  child_id     uuid        not null references public.children(id) on delete cascade,
  -- Minutes banked from that week's surplus. Always positive: a week with no
  -- surplus writes no row rather than a zero, so the table reads as a list of
  -- weeks the child went beyond what the week could hold.
  minutes      int         not null check (minutes > 0),
  -- The stars it came from, kept so a child can be shown the working rather
  -- than a number that appeared from nowhere.
  stars        int         not null default 0 check (stars >= 0),
  -- The Monday of the week being banked, not the day the rollover ran.
  week_start   date        not null,
  -- Minutes taken back out during a holiday. Spending decrements this rather
  -- than deleting rows, so the history of what was earned stays readable.
  spent        int         not null default 0 check (spent >= 0),
  created_at   timestamptz not null default now(),
  -- The whole safety of the rollover. A cron that fires twice, or a manual
  -- re-run, must not bank a child twice for one week. Enforced here rather than
  -- by remembering to check, exactly as sticker_credits does.
  unique (child_id, week_start)
);

create index if not exists idx_holiday_allowance_child
  on public.holiday_allowance (child_id, week_start desc);

alter table public.holiday_allowance enable row level security;

drop policy if exists "Parents read own holiday allowance" on public.holiday_allowance;
create policy "Parents read own holiday allowance"
  on public.holiday_allowance for select
  using (auth.uid() = user_id);

-- Written only by the Monday rollover and the spend path, both service role. A
-- currency a client could mint is not a currency, and the child app reaches
-- this through the server or not at all.
drop policy if exists "Service role manages holiday allowance" on public.holiday_allowance;
create policy "Service role manages holiday allowance"
  on public.holiday_allowance for all
  using (auth.role() = 'service_role');

comment on table public.holiday_allowance is
  'Screen time a child earned above the weekly cap, banked for the school holidays. Spendable only during a school holiday window. Never resets, unlike the weekly star balance. One row per child per week, so a repeated rollover cannot bank twice.';
comment on column public.holiday_allowance.minutes is
  'Minutes banked from that week surplus. Spend is tracked in the spent column rather than by reducing this, so the earning history stays readable.';
