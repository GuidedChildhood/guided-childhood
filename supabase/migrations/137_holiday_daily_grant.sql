-- Holiday minutes for finishing a day, alongside the Monday rollover.
--
-- The reward loop needs a second way into the holiday bank. The rollover pays
-- a child for going beyond what a week could hold, which is a good reward and
-- a slow one: nothing lands until Monday, and a child who does everything
-- inside the cap gets nothing at all from it. Finishing a day pays five
-- minutes, so the loop closes on the day the work happened.
--
-- The problem this migration exists to solve is the constraint.
-- holiday_allowance had `unique (child_id, week_start)`, and that is not a
-- tidiness rule, it is the whole safety of the rollover: the cron upserts with
-- ignoreDuplicates against it so a retry, or a manual re-run, cannot bank a
-- child twice for one week. A per day grant wants a second row for the same
-- child and the same week, so it collides head on with the only thing standing
-- between us and paying a child twice.
--
-- So the key gains a source and a day, and the guarantee gets sharper rather
-- than weaker: one rollover per child per week, AND one daily grant per child
-- per day. Neither can pay twice, and they cannot collide with each other.
--
-- on_date is NOT NULL, and that is load bearing. Postgres treats NULLs in a
-- unique constraint as DISTINCT, so a nullable on_date would let two identical
-- rollover rows both land and the guard would fail silently, with no error and
-- no way to notice except a child quietly holding double. Verified on a
-- scratch table before writing this: with the column nullable, two identical
-- rollover inserts both landed. With it NOT NULL and set to week_start, the
-- second was correctly ignored.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

-- Where the minutes came from. Rollover rows are the week's surplus; daily
-- rows are one finished day each.
alter table public.holiday_allowance
  add column if not exists source text not null default 'rollover';

alter table public.holiday_allowance
  drop constraint if exists holiday_allowance_source_check;
alter table public.holiday_allowance
  add constraint holiday_allowance_source_check check (source in ('rollover', 'daily'));

-- The day this row is for. Added nullable so existing rows survive the add,
-- backfilled, then pinned NOT NULL, because the constraint below is only a
-- guard while it is.
alter table public.holiday_allowance
  add column if not exists on_date date;

-- Every existing row is a rollover, and the day that identifies a rollover is
-- the Monday it banked. Idempotent: reruns match nothing once it has run.
update public.holiday_allowance set on_date = week_start where on_date is null;

alter table public.holiday_allowance alter column on_date set not null;

-- The swap. The old key cannot survive, because it is the thing that says a
-- child gets one holiday row per week, and a child can now have eight.
alter table public.holiday_allowance
  drop constraint if exists holiday_allowance_child_id_week_start_key;
alter table public.holiday_allowance
  drop constraint if exists holiday_allowance_child_source_day_key;
alter table public.holiday_allowance
  add constraint holiday_allowance_child_source_day_key unique (child_id, source, on_date);

create index if not exists idx_holiday_allowance_child_day
  on public.holiday_allowance (child_id, on_date desc);

comment on column public.holiday_allowance.source is
  'Where the minutes came from: rollover for the Monday surplus, daily for a finished day. Part of the unique key, so the two can never collide.';
comment on column public.holiday_allowance.on_date is
  'The day this row is for: the Monday for a rollover, the finished day for a daily grant. NOT NULL because Postgres treats NULLs in a unique constraint as distinct, which would silently break the no double banking guarantee.';
comment on constraint holiday_allowance_child_source_day_key on public.holiday_allowance is
  'One rollover per child per week and one daily grant per child per day. Replaces unique (child_id, week_start), which could not express both.';
