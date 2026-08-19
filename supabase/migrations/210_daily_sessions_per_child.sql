-- Guided Childhood — Migration 210
-- Today is a day PER CHILD, not one day for the household.
--
-- daily_sessions has been unique (user_id, session_date) since migration 007:
-- one row per family per day. So a parent who works through Today with Teo has
-- also, silently, ended Olgie's day. She shows "Done for today" before anybody
-- has done anything with her.
--
-- Justin hit exactly this on 18 August: "I did just 1 line for Olgie and it
-- flashed done ... each check in each day has to be a check in per child."
--
-- This is the sharpest of the multi child faults because Today IS the daily
-- loop. Everything else in the product is something a parent chooses to go and
-- look at; this is the thing they are asked to do every morning, and for the
-- second child it was over before it started.
--
-- child_id is nullable and nothing is backfilled. Rows written before today
-- genuinely were "the family did the day", which is what they meant when the
-- table only knew about one child, and the streak reads them as a set of DATES
-- (lib/pathway/streak.ts:62) so a null child costs nobody their streak and two
-- children finishing the same day still counts as one day shown up.
--
-- NULLS NOT DISTINCT, with a fallback, and the reason is PostgREST rather than
-- Postgres. The completion route upserts with onConflict naming the columns,
-- and a partial index cannot be named there, which is the trap migration 162
-- left in lesson_pass_by and 208 had to clean up. A real constraint can be
-- named. NULLS NOT DISTINCT then keeps the legacy null rows from duplicating
-- against each other, which a plain unique would allow.

alter table public.daily_sessions
  add column if not exists child_id uuid references public.children(id) on delete cascade;

do $$
declare
  con_name text;
begin
  select c.conname into con_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'daily_sessions'
    and c.contype = 'u'
    and (
      select array_agg(a.attname::text order by a.attname)
      from unnest(c.conkey) k
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k
    ) = array['session_date', 'user_id']
  limit 1;

  if con_name is not null then
    execute format('alter table public.daily_sessions drop constraint %I', con_name);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'daily_sessions_user_child_date_unique'
  ) then
    begin
      alter table public.daily_sessions
        add constraint daily_sessions_user_child_date_unique
        unique nulls not distinct (user_id, child_id, session_date);
    exception when others then
      -- Postgres 14 or older: nulls collide as distinct, so two legacy rows
      -- with a null child could coexist. Harmless, because nothing writes a
      -- null child from today onward.
      alter table public.daily_sessions
        add constraint daily_sessions_user_child_date_unique
        unique (user_id, child_id, session_date);
    end;
  end if;
end $$;

-- ── AND THE ROWS ALREADY THERE ARE THE PRIMARY CHILD'S ──────────────────────
--
-- Not a guess. Until today the completion route incremented actions_this_week
-- on the primary child and nowhere else, so every daily_sessions row ever
-- written was, in every way the app could express it, about that child.
-- Naming them is recording what happened rather than inventing it.
--
-- It also matters TONIGHT rather than in principle. A row for today with no
-- child would otherwise read as "the family did today", which is the honest
-- reading of an old row and would show BOTH children as done on the very first
-- evening this is tested, hiding the fix behind the bug it fixes.
--
-- Only where the family has exactly one primary child, so nothing is guessed
-- for an account where that is ambiguous. Migration 203 made that the normal
-- case.
update public.daily_sessions ds
set child_id = c.id
from public.children c
where ds.child_id is null
  and c.parent_id = ds.user_id
  and c.is_primary = true
  and (select count(*) from public.children c2 where c2.parent_id = ds.user_id and c2.is_primary) = 1;

create index if not exists idx_daily_sessions_child
  on public.daily_sessions (user_id, child_id, session_date desc);
