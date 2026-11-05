-- The school parent share (5 November 2026).
--
-- Justin: schools share every lesson with parents, and a parent sees the whole
-- lesson by making a free account, "a secret way to get users". The schools
-- app puts a signed link on every lesson page a school's code opens; the
-- parents app opens it at /from-school/<module>/<ref>.<sig> (shared/parent-share.ts).
--
-- This records which school's link brought a family, so the founder can count
-- parents acquired through schools, and which lesson it was. Written once by
-- /api/trial/start at the trial grant, exactly as school_link (353) and
-- video_link (372) are: a fresh grant, an empty column, best effort.
--
-- WHY NOT school_link. That column is the newsletter link, /s/<code>, and it
-- references public.school_links, a list the founder types school names into.
-- The share ref is a pseudonym of the school's ACCESS CODE (an HMAC under the
-- share secret, eight hex characters), because the access code is the
-- password to the licence and a link that goes home in book bags is public.
-- The founder turns a code into its ref with scripts/school-share-ref.mjs to
-- put a name on a row. Two meanings on one column is how a report ends up
-- counting a newsletter as a lesson, so it is a column of its own.
--
-- Nothing about a child. Nothing a parent can write: neither column is in the
-- list migration 175 grants back to authenticated, so only the server sets them.

alter table public.profiles
  add column if not exists school_share_ref text
    check (school_share_ref is null or school_share_ref ~ '^[0-9a-f]{8}$');

alter table public.profiles
  add column if not exists school_share_module text
    check (school_share_module is null or (school_share_module ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(school_share_module) between 3 and 80));

create index if not exists idx_profiles_school_share_ref on public.profiles(school_share_ref) where school_share_ref is not null;

comment on column public.profiles.school_share_ref is
  'The school whose lesson share link brought this family, as its pseudonymous ref (shared/parent-share.ts). Written once by /api/trial/start. Not the access code.';
comment on column public.profiles.school_share_module is
  'The lesson that share link opened, by module id. Written with school_share_ref.';
