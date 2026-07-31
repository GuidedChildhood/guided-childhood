-- Which of the columns the running code depends on actually exist.
--
-- Answers the question trial_ends_at made urgent. That column was added to the
-- repo on 24 July in the same commit as the code selecting it, and the
-- migration was never applied. Every query naming it failed from that moment:
-- all three email crons, the DiGi paywall, agreement, rehearse, rightnow,
-- printables and the kid lesson pages. PostgREST returns an error, the routes
-- destructure only data, and ?? [] turns a broken query into "nobody was due"
-- and replies 200. Five weeks, silent, found by hand.
--
-- Not a migration count. The question that matters is not "is every migration
-- applied" but "can the code that runs today read what it asks for". A column
-- dropped by hand in the dashboard is caught by this and would be missed by
-- counting migrations.
create or replace function required_columns_present(wanted text[])
returns setof text
language sql
stable
security definer
set search_path = public
as $$
  select w
  from unnest(wanted) as w
  where exists (
    select 1 from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = split_part(w, '.', 1)
      and c.column_name = split_part(w, '.', 2)
  );
$$;
