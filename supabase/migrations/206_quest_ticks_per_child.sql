-- Guided Childhood — Migration 206
-- A shared job is done by each child SEPARATELY.
--
-- quest_ticks has carried child_id since migration 029, and every write sets it
-- correctly. The key never did:
--
--     unique (quest_id, tick_date)
--
-- One tick per job per DAY, for the whole family. So on a household job, the
-- kind family_quests.child_id is null exists to express, "everyone makes their
-- bed", the first child to tap it takes the only row there is. The second child
-- taps, Postgres rejects the insert as a duplicate, and app/api/quests/tick
-- swallows that error on purpose because a repeat tap by the SAME child is
-- genuinely fine. So the second child is told "done", banks nothing, and their
-- sibling is paid for work they both did.
--
-- Silent, and a write. Nobody is told. The child sees a tick, the parent sees
-- one name, and the stars land in one account.
--
-- Justin, 18 August 2026: "we are working on making all aspects such as
-- scripts, moments, lessons child related not family." A shared job is the one
-- place where family level is the correct shape for the JOB. It is never the
-- correct shape for the DOING of it. This migration draws that line in the key.
--
-- Two partial indexes rather than one three column unique, because child_id is
-- nullable and nulls do not collide in a plain unique index: the parent's own
-- ticks, the printed sheet flow, would lose their duplicate protection entirely.
-- NULLS NOT DISTINCT would also do it on Postgres 15, but partial indexes say
-- what they mean and work anywhere.
--
-- LOOSENING, never tightening. Anything unique on (quest_id, tick_date) is
-- already unique on (quest_id, child_id, tick_date), so no existing row can
-- violate what replaces it and no data is at risk.

do $$
declare
  con_name text;
begin
  -- Find the unique constraint on exactly (quest_id, tick_date), whatever it
  -- ended up being called, rather than trusting the generated name.
  select c.conname into con_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'quest_ticks'
    and c.contype = 'u'
    and (
      select array_agg(a.attname::text order by a.attname)
      from unnest(c.conkey) k
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k
    ) = array['quest_id', 'tick_date']
  limit 1;

  if con_name is not null then
    execute format('alter table public.quest_ticks drop constraint %I', con_name);
  end if;
end $$;

-- A child ticks a given job once a day. Their sibling ticks the same job the
-- same day and gets their own row.
create unique index if not exists uq_quest_ticks_child_day
  on public.quest_ticks (quest_id, child_id, tick_date)
  where child_id is not null;

-- The parent ticking with no child named keeps exactly the protection it had.
create unique index if not exists uq_quest_ticks_family_day
  on public.quest_ticks (quest_id, tick_date)
  where child_id is null;
