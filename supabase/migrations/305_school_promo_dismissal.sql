-- Guided Childhood — Migration 305
-- The school promo remembers a "not now" against the ACCOUNT, not the device.
--
-- Justin, 17 September 2026, agreeing the card should take the top of Home one
-- day a week instead of sitting at the bottom where nobody scrolls.
--
-- The card already had a dismissal, in localStorage. That was the right call
-- while it lived near the bottom of a long page: cheap, no round trip, and the
-- worst case was a curious parent meeting it again on another device, which the
-- original note called out as deliberate.
--
-- Moving it to the top of Home changes what that worst case costs. A parent who
-- waves it away on their phone on Sunday morning and then opens the laptop
-- meets it again, at the top, the same day. Twice in one morning is not a
-- feature being discoverable, it is a feature nagging, and the fastest way to
-- make someone dislike a good thing is to ask twice after they said no.
--
-- So the no travels with the person. Nullable timestamp rather than a boolean,
-- because knowing WHEN someone declined is what lets us decide later whether it
-- is ever fair to ask again (a new term, say). A boolean would throw that away
-- and could not be recovered.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside
-- strings, flat statements only.

alter table public.profiles
  add column if not exists school_promo_dismissed_at timestamptz;
