-- 195: the home screen half of the last Setup Quest step.
--
-- The Setup Quest is three steps now (plans/setup-quest-three-steps.md) and the
-- third is "set up as home page, and set reminders". The reminders half already
-- had a server side record: a row in push_subscriptions is proof a parent
-- granted notifications. The home screen half had nothing. InstallPrompt kept
-- its whole state in localStorage under gc_install_done, which is the right
-- place for "do not show this banner again" and useless for a setup flag,
-- because a flag has to be readable on the server, has to survive a cleared
-- browser, and has to be the same answer on the phone and on the laptop.
--
-- WHAT WRITES IT, and this is the part that matters.
--
-- Not the banner being shown, and not the parent tapping "Done, it is on my
-- Home Screen", which is an assertion rather than a fact. It is written when
-- the app is next OPENED from the home screen, which the browser tells us for
-- free through display-mode: standalone. So the step goes green off proof that
-- the thing actually happened.
--
-- That distinction is the whole reason this column exists rather than a
-- localStorage key. A step that ticks because a parent LOOKED at the
-- instructions is the exact fault fixed for the daily practice step on 13
-- August 2026, and the plan names it as the one most likely to recur here.
--
-- Nullable with no default and no backfill. Every existing parent reads as not
-- done on this half, which is correct: we have never known whether the app is
-- on their home screen. They tick the step through the reminders half if push
-- is already on, and otherwise the step is genuinely still to do.

alter table public.profiles
  add column if not exists home_screen_at timestamptz;

comment on column public.profiles.home_screen_at is
  'First time this parent opened the app in standalone display mode, so it is genuinely on their home screen. Half of the third Setup Quest step; the other half is a push_subscriptions row. Never written from a tap that only claims it.';
