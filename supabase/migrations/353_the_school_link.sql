-- The school link (25 September 2026).
--
-- Justin chose idea 1 of three for testing whether schools are a real route
-- to families before building a paid school pass: a link the school puts in
-- its newsletter. Families who come through it get exactly what everyone gets
-- (the four free days and the founder rate while it lasts). The only new
-- thing is that we know which school sent them, so a pilot can be judged on
-- how many families signed up and how many went on to pay.
--
-- Deliberately NOT public.schools. That table is the paid school licence, and
-- a school sharing a link has bought nothing. Nor profiles.school_id, which
-- points at that licence. Two meanings on one column is how a report ends up
-- counting a newsletter as a customer.
--
-- Service role only. Nobody reads or writes these from a browser: the link
-- route, the trial grant and the founder's admin page all run on the server.

create table if not exists public.school_links (
  code         text primary key check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(code) between 3 and 40),
  school_name  text not null check (length(trim(school_name)) between 2 and 120),
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.school_links enable row level security;
revoke all on public.school_links from anon, authenticated;
grant select, insert, update, delete on public.school_links to service_role;

comment on table public.school_links is
  'A school newsletter link, /s/<code>. Attribution only: families through it get the ordinary trial and offer. Not the paid licence, which is public.schools.';

-- Which link a family came through, written once by /api/trial/start when the
-- trial is granted. Not in the column list migration 175 lets a parent update,
-- so only the server can set it.
alter table public.profiles
  add column if not exists school_link text references public.school_links(code) on delete set null;

create index if not exists idx_profiles_school_link on public.profiles(school_link) where school_link is not null;
