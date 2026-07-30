-- Guided Childhood — Migration 124
--
-- The star economy: a weekly reset, and unused minutes that turn into something
-- worth keeping.
--
-- Justin, after a test child was holding 342 stars and 1,710 minutes: "we
-- refresh each week ... any time not used resets each week fresh for a Monday
-- morning ... then we have a reward system for unused minutes." And later: "let's
-- get unused minutes to convert to sticker book and make the maths realistic to
-- take a month or so."
--
-- 342 was never a daily earning problem. Three jobs a day at two stars is 42 a
-- week, and eight weeks of testing is about 336. It matches. The number was eight
-- weeks with no reset, which is why a cap on daily jobs would have bitten a
-- ceiling nobody reaches and changed nothing at all.
--
-- The reset alone would have been unfair, and worse, it would have broken the
-- sticker book: lib/stickers/book.ts earned stickers from the same cumulative
-- lifetime total that produced 342, so a Monday reset would have taken sticker
-- progress away every week. Hence the split, which is a better rule than the one
-- it replaces:
--
--   SPENDABLE STARS   weekly, reset Monday, capped at the age band's recommended
--                     minutes. Buys screen time. Computed, not stored.
--
--   STICKER CREDITS   never reset. Earned from minutes NOT spent. This table.
--
-- Today stickers come from EARNING, which is the same behaviour the star chart
-- already rewards, so the book is a second scoreboard for one thing. Under this,
-- stickers come from RESTRAINT. The chart pays doing the jobs; the book pays not
-- spending what you earned. Two currencies, two lessons, and the second one is
-- the lesson the product exists to teach: the child who uses less gets more.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.sticker_credits (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  child_id       uuid        not null references public.children(id) on delete cascade,
  -- Credits awarded for that week. Always positive: a week with nothing left
  -- over writes no row rather than a zero, so the table reads as a list of wins.
  credits        int         not null check (credits > 0),
  -- The unused minutes this came from, kept so a parent can be shown the
  -- working rather than a number that appeared from nowhere.
  minutes_unused int         not null default 0 check (minutes_unused >= 0),
  -- The Monday of the week being paid out, not the day the rollover ran.
  week_start     date        not null,
  created_at     timestamptz not null default now(),
  -- The whole safety of the rollover. A cron that fires twice, or a manual
  -- re-run, must not pay a child twice for one week. One row per child per week,
  -- enforced by the database rather than by remembering to check.
  unique (child_id, week_start)
);

create index if not exists idx_sticker_credits_child on public.sticker_credits (child_id, week_start desc);

alter table public.sticker_credits enable row level security;

drop policy if exists "Parents read own sticker credits" on public.sticker_credits;
create policy "Parents read own sticker credits"
  on public.sticker_credits for select
  using (auth.uid() = user_id);

-- Written only by the Monday rollover, which runs with the service role. There
-- is deliberately no insert policy for parents: a currency a client could mint
-- is not a currency, and the child app talks to this through the server or not
-- at all.
drop policy if exists "Service role manages sticker credits" on public.sticker_credits;
create policy "Service role manages sticker credits"
  on public.sticker_credits for all
  using (auth.role() = 'service_role');

comment on table public.sticker_credits is
  'Sticker book currency, earned from screen minutes a child earned and chose not to spend, paid out at Monday rollover. Never resets, unlike spendable stars. One row per child per week, so a repeated rollover cannot pay twice.';
comment on column public.sticker_credits.week_start is
  'The Monday of the star week being paid out, in Europe/London, not the day the job ran.';
