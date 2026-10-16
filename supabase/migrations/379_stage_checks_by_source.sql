-- Every stage check start, counted by where it came from (16 October 2026).
--
-- Review board, 13 October 2026 (count-stage-checks-by-source): the target is
-- 1,000 stage checks by 13 November and nothing in the product could say how
-- many had been begun, or which post sent them. The film link (372) counted a
-- start only for a visitor holding a film cookie; the printed Planet Post
-- sends ?src=planet-post-1 and nothing read it; a LinkedIn post, a group seed
-- and a Facebook post all printed the same bare /starter-pack.
--
-- So the film link becomes the source link. Same two tables, one new column:
--
--   video_links.channel  which channel a link belongs to, so the founder page
--                        can add up checks per channel each week (the Friday
--                        number). Every existing link is a film.
--
-- And every start is now counted, against one of three rows that are never
-- links themselves (switched off, so /v/direct is not a way in):
--
--   direct    no link at all: typed, bookmarked, the home page
--   referral  arrived through a member's /r/ link
--   school    arrived through a school newsletter link (/s/)
--
-- Still nothing about any person: a code, a kind and a time.

alter table public.video_links
  add column if not exists channel text not null default 'film';

alter table public.video_links
  drop constraint if exists video_links_channel_check;

alter table public.video_links
  add constraint video_links_channel_check check (channel in (
    'film', 'linkedin', 'facebook', 'group', 'instagram', 'print',
    'share', 'referral', 'school', 'direct', 'other'
  ));

comment on column public.video_links.channel is
  'Which channel the link belongs to, for the checks per channel count on the founder page. film, linkedin, facebook, group, instagram, print, share, or the three counted without a link: direct, referral, school.';

-- The three ways in that carry no link of their own. Switched off so /v/<code>
-- never treats them as a link; /api/video-link/started writes to them directly.
insert into public.video_links (code, title, channel, active) values
  ('direct',   'No link: typed, bookmarked or the home page', 'direct',   false),
  ('referral', 'A member''s referral link (/r/)',              'referral', false),
  ('school',   'A school newsletter link (/s/)',               'school',   false)
on conflict (code) do update set channel = excluded.channel, active = false;

-- The ?src= codes already printed or published, so the starter pack can count
-- them the moment this ships (a printed page cannot be reprinted).
insert into public.video_links (code, title, channel) values
  ('planet-post-1',     'The Planet Post, issue 1 (printable)', 'print'),
  ('guided-planet-001', 'The Guided Planet, issue 001',         'print'),
  ('guided-planet-002', 'The Guided Planet, issue 002',         'print')
on conflict (code) do nothing;

-- The share action on the stage result (stage-result-share-action), the
-- Instagram bio, and the three Facebook posts in the week of 19 October.
-- tools/social-cards/week.mjs names a Facebook post's code fb-<mmdd>-<slug>.
insert into public.video_links (code, title, channel) values
  ('stage-share',          'Shared from the stage result',                 'share'),
  ('instagram-bio',        'Instagram bio link',                           'instagram'),
  ('fb-1021-phone-policy', 'Facebook, Wed 21 Oct: the school phone ban',   'facebook'),
  ('fb-1023-scripts',      'Facebook, Fri 23 Oct: the scripts',            'facebook'),
  ('fb-1024-happy-news',   'Facebook, Sat 24 Oct: happy news',             'facebook')
on conflict (code) do nothing;

-- One read for the founder page: per link, all time and the last seven days.
-- security_invoker so it runs with the caller's rights, and the caller is only
-- ever the service role, like the tables under it.
create or replace view public.video_link_counts
with (security_invoker = true) as
select
  l.code,
  l.channel,
  count(e.id) filter (where e.kind = 'opened')                                                  as opened,
  count(e.id) filter (where e.kind = 'started')                                                 as started,
  count(e.id) filter (where e.kind = 'opened'  and e.created_at >= now() - interval '7 days')   as opened_week,
  count(e.id) filter (where e.kind = 'started' and e.created_at >= now() - interval '7 days')   as started_week
from public.video_links l
left join public.video_link_events e on e.code = l.code
group by l.code, l.channel;

revoke all on public.video_link_counts from anon, authenticated;
grant select on public.video_link_counts to service_role;

comment on view public.video_link_counts is
  'Followed and begun counts per source link, all time and the last seven days. Service role only; read by /dashboard/admin/videos.';
