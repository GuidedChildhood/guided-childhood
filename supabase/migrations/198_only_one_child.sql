-- 198: "it is just the one", the second door on the fourth Setup Quest step.
--
-- Justin, 14 August 2026, on the check in reading done for a child it had never
-- asked about: "this will need to be child by child so part of the set up list
-- will need to have add other children."
--
-- So setup gains a fourth step, and a fourth step needs the same thing steps
-- two and three have: a way to be FINISHED rather than merely un-started. The
-- share step ticks on "no phone, keep it on the fridge". This is the same
-- shape. A parent with one child has answered the question "are there others",
-- and an answered question is a done step.
--
-- Without this the step could never be ticked by a one child family, which is
-- most of them. That is the un-tickable step lib/handover/settled.ts exists to
-- end, and shipping a new one in the same week we removed the last would be
-- the product forgetting its own lesson.
--
-- WHY A TIMESTAMP AND NOT A BOOLEAN. A boolean cannot tell "no" from "not
-- asked", which is the exact ambiguity that made children.use_mode useless as
-- a signal (see lib/handover/settled.ts). It also dates the answer, so a family
-- who said one child two years ago can be asked once more, the same way the six
-- month re-offer works for the child device.
--
-- Nullable, no backfill. Every existing parent reads as not answered, which is
-- true: we have never asked them.

alter table public.profiles
  add column if not exists only_one_child_at timestamptz;

comment on column public.profiles.only_one_child_at is
  'When this parent said there are no other children to add. Second door on the fourth Setup Quest step, so a one child family can finish it. Null means not asked, never means no.';
