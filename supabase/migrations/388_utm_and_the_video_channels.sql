-- UTMs kept with the sign up, and TikTok and YouTube as channels (6 November 2026).
--
-- Funnel audit, 6 November 2026 (fix 7): the source links (372, 379) can say
-- which of our links sent a family, but every UTM on a post was thrown away.
-- /v/<code> dropped the query string, nothing read utm_*, and the sign up kept
-- only the code. And TikTok and YouTube had no channel, so their links were
-- filed as film or other.
--
-- So, three things:
--
--   video_links.channel     gains tiktok and youtube
--   video_link_events       the opened and started rows carry the post's UTMs
--   profiles                the UTMs of the visit that brought the family,
--                           written once by /api/trial/start beside video_link
--
-- And one read for the founder page, video_link_utm_counts: opened and
-- started per link and campaign.
--
-- The values are slugs about the post (instagram, social, 1106-stage-check),
-- never anything about the person. shared/utm.ts drops anything else before a
-- write, and the checks below hold the database to the same pattern, so an
-- email address or a phone number pasted into a link can never land here.

-- ── THE CHANNELS ────────────────────────────────────────────────────────────
alter table public.video_links
  drop constraint if exists video_links_channel_check;

alter table public.video_links
  add constraint video_links_channel_check check (channel in (
    'film', 'linkedin', 'facebook', 'group', 'instagram', 'tiktok', 'youtube', 'print',
    'share', 'referral', 'school', 'direct', 'other'
  ));

comment on column public.video_links.channel is
  'Which channel the link belongs to, for the checks per channel count on the founder page. film, linkedin, facebook, group, instagram, tiktok, youtube, print, share, other, or the three counted without a link: direct, referral, school.';

-- ── THE UTMs ON EACH COUNTED ROW ────────────────────────────────────────────
alter table public.video_link_events
  add column if not exists utm_source   text check (utm_source   is null or (utm_source   ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_source)   <= 60)),
  add column if not exists utm_medium   text check (utm_medium   is null or (utm_medium   ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_medium)   <= 60)),
  add column if not exists utm_campaign text check (utm_campaign is null or (utm_campaign ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_campaign) <= 60)),
  add column if not exists utm_content  text check (utm_content  is null or (utm_content  ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_content)  <= 60));

comment on table public.video_link_events is
  'One row per follow of a source link and per stage check begun. A code, a kind, the post''s UTMs and a time; nothing that identifies a person.';

-- ── THE UTMs ON THE FAMILY, AT THE GRANT ────────────────────────────────────
-- Written once by /api/trial/start, as video_link is. Not in the column list
-- migration 175 lets a parent update, so only the server can set them.
alter table public.profiles
  add column if not exists utm_source   text check (utm_source   is null or (utm_source   ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_source)   <= 60)),
  add column if not exists utm_medium   text check (utm_medium   is null or (utm_medium   ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_medium)   <= 60)),
  add column if not exists utm_campaign text check (utm_campaign is null or (utm_campaign ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_campaign) <= 60)),
  add column if not exists utm_content  text check (utm_content  is null or (utm_content  ~ '^[a-z0-9]+([_-][a-z0-9]+)*$' and length(utm_content)  <= 60));

create index if not exists idx_profiles_utm_source on public.profiles(utm_source, utm_campaign) where utm_source is not null;

comment on column public.profiles.utm_source is
  'The utm_source of the visit that brought the family (instagram, tiktok, youtube, facebook, linkedin). Written once at the trial grant.';
comment on column public.profiles.utm_campaign is
  'The utm_campaign of that visit, the post slug. Written once at the trial grant.';

-- ── ONE READ FOR THE FOUNDER PAGE ───────────────────────────────────────────
-- Per link and campaign, all time and the last seven days. Rows with no UTMs
-- at all are left out: video_link_counts already counts every row.
create or replace view public.video_link_utm_counts
with (security_invoker = true) as
select
  e.code,
  l.channel,
  e.utm_source,
  e.utm_medium,
  e.utm_campaign,
  count(*) filter (where e.kind = 'opened')                                                as opened,
  count(*) filter (where e.kind = 'started')                                               as started,
  count(*) filter (where e.kind = 'opened'  and e.created_at >= now() - interval '7 days') as opened_week,
  count(*) filter (where e.kind = 'started' and e.created_at >= now() - interval '7 days') as started_week
from public.video_link_events e
join public.video_links l on l.code = e.code
where e.utm_source is not null or e.utm_campaign is not null
group by e.code, l.channel, e.utm_source, e.utm_medium, e.utm_campaign;

revoke all on public.video_link_utm_counts from anon, authenticated;
grant select on public.video_link_utm_counts to service_role;

comment on view public.video_link_utm_counts is
  'Followed and begun counts per source link and UTM campaign, all time and the last seven days. Service role only; read by /dashboard/admin/videos.';
