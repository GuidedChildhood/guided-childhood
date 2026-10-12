-- The video link (12 October 2026).
--
-- The DiGi shorts panel found the gap that decides whether the films are
-- worth making: nothing records a stage check start, so a film that sends a
-- thousand parents to the stage check looks the same as one that sends none.
-- Justin approved a link per film ("Yes, build it"), on the school link's
-- pattern (353): /v/<code> goes in the caption, the bio or the pinned comment,
-- remembers which film sent the family in a cookie, and hands them to the
-- stage check like every other way in (non negotiable 9).
--
-- Three numbers per film, and nothing about any person:
--   opened   the link was followed (one row per visit to /v/<code>)
--   started  the stage check was begun after following it (once per browser)
--   signed up, and paying, from profiles.video_link, written once at the
--            trial grant, exactly as school_link is.
--
-- The events table holds a code, a kind and a time. No IP, no user agent, no
-- account: a count of how many, never who. Service role only, like the school
-- links: the link route, the start counter, the trial grant and the founder's
-- admin page all run on the server.

create table if not exists public.video_links (
  code        text primary key check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(code) between 3 and 40),
  title       text not null check (length(trim(title)) between 2 and 120),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.video_links enable row level security;
revoke all on public.video_links from anon, authenticated;
grant select, insert, update, delete on public.video_links to service_role;

comment on table public.video_links is
  'A link per film, /v/<code>, for the caption or bio. Attribution only: families through it get the ordinary stage check, trial and offer.';

create table if not exists public.video_link_events (
  id          bigint generated always as identity primary key,
  code        text not null references public.video_links(code) on delete cascade,
  kind        text not null check (kind in ('opened', 'started')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_video_link_events_code_kind on public.video_link_events(code, kind);

alter table public.video_link_events enable row level security;
revoke all on public.video_link_events from anon, authenticated;
grant select, insert, update, delete on public.video_link_events to service_role;
grant usage, select on sequence public.video_link_events_id_seq to service_role;

comment on table public.video_link_events is
  'One row per follow of a film link and per stage check begun after one. A code, a kind and a time; nothing that identifies a person.';

-- Which film a family came through, written once by /api/trial/start when the
-- trial is granted. Not in the column list migration 175 lets a parent update,
-- so only the server can set it.
alter table public.profiles
  add column if not exists video_link text references public.video_links(code) on delete set null;

create index if not exists idx_profiles_video_link on public.profiles(video_link) where video_link is not null;

-- The first two films, so their links work the day this ships.
insert into public.video_links (code, title) values
  ('digi-hero', 'DiGi hero film'),
  ('switch-off', 'Short 1: the switch off fight')
on conflict (code) do nothing;
