-- The share step needs a way to be FINISHED, not just a way to be done.
--
-- Justin, 17 August 2026: "if we are saying share screens is done when they
-- either skip or say done it needs to tick off set up to be able to move onto
-- next set up step."
--
-- Until now the share step ticked on exactly two things: a kid_links row, which
-- means the code was actually generated, or the family answering "no phone,
-- keep it on the fridge" through lib/handover/settled.ts. Both are real, and
-- neither covers the common case: a parent who showed their child the code, or
-- who intends to co-view on their own phone, and now wants to get on. There was
-- no third door, so setup could not be finished from that step at all.
--
-- That is the un-tickable step this product has now had to fix three times: the
-- phone link for a family who said no, the reminders for a parent on a laptop,
-- and this. A step whose whole promise is to tell a parent what is still
-- missing must always have an answer that closes it.
--
-- One timestamp rather than a boolean, for the same reason no_phone_at exists:
-- the monthly re-offer has to be measured from WHEN they settled it. A boolean
-- cannot tell a no from a not-asked, and it cannot tell a no from a no six
-- months ago that is now worth revisiting because the child has a phone.
--
-- It does NOT record which of the two doors they took. The distinction between
-- "I have shared it" and "I will run it on my phone" matters to the copy on the
-- day and not to anything downstream: both mean the child's side is handled,
-- both should stop the setup step asking, and both should get the same gentle
-- monthly reminder that the QR code is there whenever they want it.
alter table public.profiles
  add column if not exists child_app_settled_at timestamptz;

comment on column public.profiles.child_app_settled_at is
  'When the parent closed the share-the-child-app step themselves, by saying they had shared it or that they will co-view on their own phone. Distinct from a kid_links row (the code was really made) and from children.no_phone (there is no device). Nullable; the monthly re-offer is measured from it.';
