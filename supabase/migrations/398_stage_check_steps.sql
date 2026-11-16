-- Two more counted steps after a stage check start (16 November 2026).
--
-- Round 1 of the paid adverts: after the one tap first question (PR 1541)
-- 8 of 119 advert visitors started the stage check and none made an account,
-- and nothing past the start could say where they stopped. PostHog would, but
-- it is not switched on for the live site.
--
-- So video_link_events gains two kinds beside opened and started:
--
--   pathway   the parent reached their built pathway (the result screen)
--   save      they tapped Save this pathway and opened the account screen
--
-- Each is counted once per browser per followed link, against the same code
-- the start was counted against, so per link the four numbers read as a
-- funnel: opened, started, pathway, save, and then profiles.video_link for
-- the account itself. Still nothing about the person: a code, a kind, the
-- post's UTMs and a time.
--
-- Every existing read (video_link_counts, video_link_utm_counts, the founder
-- videos page) filters on kind = 'opened' or 'started', so the new rows change
-- none of their numbers.

alter table public.video_link_events
  drop constraint if exists video_link_events_kind_check;

alter table public.video_link_events
  add constraint video_link_events_kind_check
  check (kind in ('opened', 'started', 'pathway', 'save'));

comment on table public.video_link_events is
  'One row per follow of a source link, per stage check begun, per pathway reached and per save screen opened (398). A code, a kind, the post''s UTMs and a time; nothing that identifies a person.';
