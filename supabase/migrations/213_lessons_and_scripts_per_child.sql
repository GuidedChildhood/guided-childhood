-- Guided Childhood — Migration 213
-- A lesson is learned by a child. A script is a conversation with a child.
--
-- Justin, 18 August 2026: "we are working on making all aspects such as
-- scripts, moments, lessons child related not family."
--
-- Four tables, all household keyed, all describing something that happens with
-- one child:
--
--   lesson_completions  unique (user_id, lesson_id, lesson_source)
--   script_completions  unique (user_id, script_sort_order)
--   script_lines_used   unique (user_id, script_sort_order, line)
--   script_requests     no child column at all
--
-- What each one costs today:
--
--   The eldest passing a lesson on Monday marks it done for the household, and
--   the one lesson a week gate then offers the younger child nothing all week.
--   Reading a script with the eldest retires it for the younger, who is never
--   offered it. And which LINE actually worked, the most valuable thing this
--   product learns, is recorded as "the line that worked" rather than "the line
--   that worked on the nine year old", so it is fed back to a five year old as
--   proven.
--
-- BACKFILL, AND WHY IT IS DELIBERATELY INCOMPLETE. A family with exactly one
-- child has no ambiguity, so their rows are assigned to that child. A family
-- with more than one is left NULL, which every read treats as "counts for
-- everybody" and is precisely what those rows meant when they were written.
-- Guessing which child read a script two weeks ago would be inventing a fact.
--
-- Loosening only: every replacement key adds a column to an existing one, so no
-- existing row can violate it.

alter table public.lesson_completions add column if not exists child_id uuid references public.children(id) on delete cascade;
alter table public.script_completions add column if not exists child_id uuid references public.children(id) on delete cascade;
alter table public.script_lines_used  add column if not exists child_id uuid references public.children(id) on delete cascade;
alter table public.script_requests    add column if not exists child_id uuid references public.children(id) on delete cascade;

-- Drop each household key, whatever it ended up being called.
do $$
declare r record; con_name text;
begin
  for r in
    select * from (values
      ('lesson_completions', array['lesson_id','lesson_source','user_id']),
      ('script_completions', array['script_sort_order','user_id']),
      ('script_lines_used',  array['line','script_sort_order','user_id'])
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

-- One row per child, and the family wide row keeps exactly the protection it had.
create unique index if not exists uq_lesson_completions_child
  on public.lesson_completions (user_id, child_id, lesson_id, lesson_source) where child_id is not null;
create unique index if not exists uq_lesson_completions_family
  on public.lesson_completions (user_id, lesson_id, lesson_source) where child_id is null;

create unique index if not exists uq_script_completions_child
  on public.script_completions (user_id, child_id, script_sort_order) where child_id is not null;
create unique index if not exists uq_script_completions_family
  on public.script_completions (user_id, script_sort_order) where child_id is null;

create unique index if not exists uq_script_lines_used_child
  on public.script_lines_used (user_id, child_id, script_sort_order, line) where child_id is not null;
create unique index if not exists uq_script_lines_used_family
  on public.script_lines_used (user_id, script_sort_order, line) where child_id is null;

-- Only where there is exactly one child, so nothing is invented.
update public.lesson_completions t set child_id = k.id
from public.children k
where t.child_id is null and k.parent_id = t.user_id
  and (select count(*) from public.children c2 where c2.parent_id = t.user_id) = 1;

update public.script_completions t set child_id = k.id
from public.children k
where t.child_id is null and k.parent_id = t.user_id
  and (select count(*) from public.children c2 where c2.parent_id = t.user_id) = 1;

update public.script_lines_used t set child_id = k.id
from public.children k
where t.child_id is null and k.parent_id = t.user_id
  and (select count(*) from public.children c2 where c2.parent_id = t.user_id) = 1;

create index if not exists idx_lesson_completions_child on public.lesson_completions (user_id, child_id);
create index if not exists idx_script_completions_child on public.script_completions (user_id, child_id);
create index if not exists idx_script_lines_used_child  on public.script_lines_used  (user_id, child_id);
create index if not exists idx_script_requests_child    on public.script_requests    (user_id, child_id);
