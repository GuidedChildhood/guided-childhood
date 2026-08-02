-- Minutes the parent marked by hand become a real session.
--
-- Two paths put screen time in the system, and only one of them was visible to
-- the reports:
--
--   device_sessions  a timer block. Carries the device, the activity, the
--                    family_device_id. Everything the weekly breakdown reads.
--   star_spends      "screen time used", marked by the parent in the co view,
--                    for a child with no phone. Carries minutes and stars and
--                    nothing else.
--
-- getWeekParentReport reads device_sessions only, so every minute recorded by
-- hand was missing from the per device and per activity breakdown. The guide
-- for a 4 to 7 year old is 27 minutes watching and 24 learning; a family who
-- marks time by hand was measured against that guide with an empty numerator.
-- The stars came off the bank, so the economy was right, and the balance report
-- said the week was nearly untouched.
--
-- The fix is to write the session too, linked to its spend by spend_id, which
-- lib/quests/usage.ts already skips so nothing is counted twice. This column is
-- the one thing that link cannot say: whether a person typed these minutes or a
-- countdown measured them. A parent reading the breakdown deserves to know
-- which, because "45 minutes on the TV" means something different when it is a
-- recollection at bedtime rather than a clock.
--
-- Default false, so every session already in the table stays what it is: timed.

alter table public.device_sessions
  add column if not exists manual boolean not null default false;

comment on column public.device_sessions.manual is
  'True when a parent recorded these minutes after the fact rather than a timer measuring them. Set by /api/quests/spend; every timed block leaves it false.';
