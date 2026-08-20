-- Guided Childhood — Migration 214
-- The last four tables that could only ever describe one child.
--
--   ai_literacy_checkins  unique (user_id)              one row per household, EVER
--   digi_weekly_reviews   unique (user_id, week_start)  one review per household per week
--   wellbeing_checkins    no child column               (its twin wellbeing_checks is correct)
--   digi_safety_flags     no child column               a flag that cannot say who it is about
--
-- ai_literacy_checkins is the starkest: unique on user_id alone means a second
-- child can never have one at all, not this week, not ever.
--
-- wellbeing_checkins and wellbeing_checks are two tables one letter apart, one
-- per child and one not. Whichever is the survivor, the wrong one being family
-- wide is a trap for the next person, so it gains the column too rather than
-- being left as the odd one out.
--
-- digi_safety_flags is the one that matters most in principle even though it is
-- the smallest. A safety concern that cannot name the child it is about is the
-- single worst record in this product to get wrong.
--
-- Additive and loosening only. Backfill only where a family has exactly one
-- child, so nothing is invented.

alter table public.ai_literacy_checkins add column if not exists child_id uuid references public.children(id) on delete cascade;
alter table public.digi_weekly_reviews  add column if not exists child_id uuid references public.children(id) on delete cascade;
alter table public.wellbeing_checkins   add column if not exists child_id uuid references public.children(id) on delete cascade;
alter table public.digi_safety_flags    add column if not exists child_id uuid references public.children(id) on delete cascade;

do $$
declare r record; con_name text;
begin
  for r in
    select * from (values
      ('ai_literacy_checkins', array['user_id']),
      ('digi_weekly_reviews',  array['user_id','week_start'])
    ) as t(tbl, cols)
  loop
    select c.conname into con_name
    from pg_constraint c
    join pg_class cl on cl.oid = c.conrelid
    join pg_namespace n on n.oid = cl.relnamespace
    where n.nspname='public' and cl.relname = r.tbl and c.contype='u'
      and (select array_agg(a.attname::text order by a.attname)
           from unnest(c.conkey) k join pg_attribute a on a.attrelid=c.conrelid and a.attnum=k)
          = r.cols
    limit 1;
    if con_name is not null then
      execute format('alter table public.%I drop constraint %I', r.tbl, con_name);
    end if;
    con_name := null;
  end loop;
end $$;

create unique index if not exists uq_ai_literacy_child
  on public.ai_literacy_checkins (user_id, child_id) where child_id is not null;
create unique index if not exists uq_ai_literacy_family
  on public.ai_literacy_checkins (user_id) where child_id is null;

create unique index if not exists uq_digi_weekly_child
  on public.digi_weekly_reviews (user_id, child_id, week_start) where child_id is not null;
create unique index if not exists uq_digi_weekly_family
  on public.digi_weekly_reviews (user_id, week_start) where child_id is null;

update public.ai_literacy_checkins t set child_id = k.id
from public.children k
where t.child_id is null and k.parent_id = t.user_id
  and (select count(*) from public.children c2 where c2.parent_id = t.user_id) = 1;

update public.wellbeing_checkins t set child_id = k.id
from public.children k
where t.child_id is null and k.parent_id = t.user_id
  and (select count(*) from public.children c2 where c2.parent_id = t.user_id) = 1;

create index if not exists idx_wellbeing_checkins_child on public.wellbeing_checkins (user_id, child_id);
create index if not exists idx_digi_safety_flags_child  on public.digi_safety_flags  (user_id, child_id);
