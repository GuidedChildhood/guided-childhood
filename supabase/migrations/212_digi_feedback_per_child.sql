-- Guided Childhood — Migration 212
-- DiGi's daily feedback is about ONE child.
--
-- digi_feedback already has child_id. Its key ignores it:
--
--     unique (user_id, feedback_date)
--
-- One row per family per day. So a parent who answers DiGi's reflective
-- question about Teo cannot answer it about Olga at all: the second write is
-- rejected as a duplicate, or overwrites the first, depending on the caller.
-- Exactly the shape of the moment_completions fault fixed in 211, and it is the
-- most dangerous shape in this schema because the column is RIGHT THERE and
-- looks like the job is done.
--
-- Loosening only. Anything unique on (user_id, feedback_date) is already unique
-- with child_id added, so no existing row can violate the replacement.

do $$
declare con_name text;
begin
  select c.conname into con_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname='public' and t.relname='digi_feedback' and c.contype='u'
    and (select array_agg(a.attname::text order by a.attname)
         from unnest(c.conkey) k join pg_attribute a on a.attrelid=c.conrelid and a.attnum=k)
        = array['feedback_date','user_id']
  limit 1;
  if con_name is not null then
    execute format('alter table public.digi_feedback drop constraint %I', con_name);
  end if;
end $$;

create unique index if not exists uq_digi_feedback_child_day
  on public.digi_feedback (user_id, child_id, feedback_date)
  where child_id is not null;

create unique index if not exists uq_digi_feedback_family_day
  on public.digi_feedback (user_id, feedback_date)
  where child_id is null;
