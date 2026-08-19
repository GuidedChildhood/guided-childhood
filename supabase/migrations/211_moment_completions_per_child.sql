-- Guided Childhood — Migration 211
-- A moment is done WITH a child, so two children can both do it today.
--
-- moment_completions has carried child_id since migration 009 and the write
-- has always set it. The KEY never did:
--
--     unique (user_id, moment_id, completed_on)
--
-- One row per moment per DAY for the whole household. So a parent who talks
-- through "what to do when a video upsets you" with Teo and then has the same
-- conversation with Olgie writes the SAME row twice: the upsert overwrites
-- Teo's with Olgie's, and the family ends the day with one record of a
-- conversation that happened twice. Whichever child went first disappears.
--
-- Justin, 18 August 2026: "moments needs to show add moment for child name, and
-- only when added for each child does it say done ... each step has to be done
-- and saved for each child before done in total, needs to save results and
-- track per child so all reports are per child."
--
-- That rule is impossible while the key says one per household, because the
-- second child's row cannot exist to be counted.
--
-- Two partial indexes rather than one four column unique, for the same reason
-- as migration 206: child_id is nullable, nulls do not collide in a plain
-- unique index, and the rows written before today all have a real child anyway.
--
-- LOOSENING, never tightening. Anything unique on (user_id, moment_id,
-- completed_on) is already unique with child_id added, so no existing row can
-- violate what replaces it.

do $$
declare
  con_name text;
begin
  select c.conname into con_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'moment_completions'
    and c.contype = 'u'
    and (
      select array_agg(a.attname::text order by a.attname)
      from unnest(c.conkey) k
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k
    ) = array['completed_on', 'moment_id', 'user_id']
  limit 1;

  if con_name is not null then
    execute format('alter table public.moment_completions drop constraint %I', con_name);
  end if;
end $$;

-- One row per child per moment per day. Their sibling gets their own.
create unique index if not exists uq_moment_completions_child_day
  on public.moment_completions (user_id, child_id, moment_id, completed_on)
  where child_id is not null;

-- A row with no child named keeps exactly the protection it had.
create unique index if not exists uq_moment_completions_family_day
  on public.moment_completions (user_id, moment_id, completed_on)
  where child_id is null;

create index if not exists idx_moment_completions_child
  on public.moment_completions (user_id, child_id, completed_on desc);
