-- 392: the free tasters, counted by post (11 November 2026).
--
-- Justin, 11 November: "the email funnel that gives our printables away for
-- free ... we promised Saturdays for Guided". Each Saturday post sends people
-- to guidedchildhood.com/free/<slug> for a free taster of a pack. Two things
-- were missing to make that a funnel rather than a hope:
--
--   free_download_events   one row per claim: which free page, which post
--                          (the src and the four UTMs), and whether the email
--                          was new to us. Without it the founder page could
--                          say a lead came from magnet:<slug> and nothing
--                          about which Saturday sent them, because the gate
--                          only ever posted the email and the slug.
--
--   starter_leads          taster_slug and taster_at, the clock the three
--                          email taster nurture runs on (app/api/email/cron):
--                          the taster at once, the stage check on day 1, the
--                          full pack on Etsy and the membership on day 7.
--
-- NOTHING ABOUT THE PERSON IS IN A COUNTED ROW. The src and UTMs are slugs
-- about the post (ig, instagram, 1114-calm-kit), cleaned by shared/utm.ts and
-- held to the same pattern here as migration 388. lead_id links a row to the
-- lead so a post can be credited with new leads, and it is set null when the
-- lead is erased, so the count survives and the link to a person does not.
--
-- Written by the server only (service role). No browser reads it, so RLS is
-- on with no policy, and only service_role is granted.

create table if not exists public.free_download_events (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  lead_id       uuid references public.starter_leads(id) on delete set null,
  new_lead      boolean not null default false,
  src           text check (src          is null or (src          ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(src)          <= 60)),
  utm_source    text check (utm_source   is null or (utm_source   ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_source)   <= 60)),
  utm_medium    text check (utm_medium   is null or (utm_medium   ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_medium)   <= 60)),
  utm_campaign  text check (utm_campaign is null or (utm_campaign ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_campaign) <= 60)),
  utm_content   text check (utm_content  is null or (utm_content  ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_content)  <= 60)),
  created_at    timestamptz not null default now()
);

alter table public.free_download_events enable row level security;

revoke all on public.free_download_events from anon, authenticated;
grant select, insert, update, delete on public.free_download_events to service_role;

create index if not exists free_download_events_slug_idx on public.free_download_events (slug, created_at desc);
create index if not exists free_download_events_campaign_idx on public.free_download_events (utm_campaign, created_at desc) where utm_campaign is not null;
create index if not exists free_download_events_lead_idx on public.free_download_events (lead_id) where lead_id is not null;

comment on table public.free_download_events is
  'One row per free download claimed on a /free page: the slug, the post that sent them (src, utm_*) and whether the email was new. Slugs only, nothing about the person; lead_id is set null on erasure.';

alter table public.starter_leads
  add column if not exists taster_slug text,
  add column if not exists taster_at   timestamptz;

comment on column public.starter_leads.taster_slug is
  'The first free taster this lead claimed (content/printables/free-tasters.json). The day 7 email names its full pack.';
comment on column public.starter_leads.taster_at is
  'When that first taster was claimed: the clock for the taster nurture (day 1 stage check, day 7 full pack). Written once.';

create index if not exists starter_leads_taster_at_idx on public.starter_leads (taster_at) where taster_at is not null;

-- One read for the founder: claims and new leads per free page and post, all
-- time and the last seven days.
create or replace view public.free_download_counts
with (security_invoker = true) as
select
  slug,
  coalesce(utm_campaign, src) as post,
  utm_source,
  count(*)                                                                   as claims,
  count(*) filter (where new_lead)                                           as new_leads,
  count(*) filter (where created_at >= now() - interval '7 days')            as claims_week,
  count(*) filter (where new_lead and created_at >= now() - interval '7 days') as new_leads_week
from public.free_download_events
group by slug, coalesce(utm_campaign, src), utm_source;

revoke all on public.free_download_counts from anon, authenticated;
grant select on public.free_download_counts to service_role;

comment on view public.free_download_counts is
  'Claims and new leads per free page and per post (utm_campaign, else src), all time and the last seven days. Service role only.';
