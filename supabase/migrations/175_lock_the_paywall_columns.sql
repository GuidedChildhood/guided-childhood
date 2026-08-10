-- Guided Childhood — Migration 175
-- A parent cannot grant themselves the product.
--
-- Justin, 8 August 2026: "I was able to go around the block, maybe that's for
-- testing, but we must make sure real users can not continue without
-- subscribing."
--
-- He was right to ask, and it was not only the testing allowlist.
--
-- WHAT WAS ACTUALLY OPEN. The RLS policy on profiles is "Users can update own
-- profile", auth.uid() = id, with no column restriction, and `authenticated`
-- held a table wide UPDATE grant. RLS decides WHICH ROWS you may write, never
-- which columns, and nothing else was standing in the way. So any signed in
-- parent could open the browser console and run
--
--   supabase.from('profiles').update({ subscription_status: 'active' })
--
-- against their own row and have the whole product, free, for ever. The same
-- write on trial_ends_at restarts the four day trial as often as they like.
-- Neither needed a bug. It is the ordinary client the app already ships, doing
-- what it was allowed to do.
--
-- WHY THIS IS A REVOKE AND RE GRANT, not a column revoke. The obvious version
-- is `revoke update (subscription_status, ...) from authenticated`, and it is a
-- silent no op: a column level revoke cannot cut into a TABLE level grant, so
-- the privilege survives and the migration looks like it worked. That was the
-- first draft of this file, and it was caught only by running it and reading
-- the privileges back. The table grant has to go first, then the columns a
-- parent legitimately writes are granted back by name.
--
-- Five columns are deliberately NOT granted back:
--
--   subscription_status   the flag hasFullAccess reads. The whole product.
--   subscription_tier     which plan, and the founder rate is capped at 50.
--   is_founder            the same cap, said another way.
--   trial_ends_at         a fresh four days, as many times as you want.
--   id                    the primary key. The UPDATE policy has no WITH CHECK,
--                         so a writable id is a row a user can point at someone
--                         else. Nothing legitimate has ever written it.
--
-- stripe_customer_id IS granted back. The checkout route writes it with the
-- signed in user's own client, so revoking it would break paying, and it grants
-- nothing on its own: access is read from subscription_status.
--
-- WHAT STILL WRITES THE LOCKED ONES. The Stripe webhook and /api/trial/start
-- both use the service role, which keeps its own grants and bypasses RLS, so
-- paying and the free trial are untouched. The only thing that stops working is
-- a parent writing their own subscription.
--
-- Verified against the live database in a transaction and rolled back: after
-- this runs, `authenticated` can update the nineteen ordinary columns and none
-- of the five above.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside string
-- literals, flat statements only.

revoke update on public.profiles from authenticated;

revoke update on public.profiles from anon;

grant update (
  email, full_name, avatar_url,
  onboarding_complete, onboarding_answers,
  email_opt_out, daily_minutes,
  handover_choice, handover_asks,
  devices_asked_at,
  wellbeing_consent_at, wellbeing_consent_version,
  school_id, school_region,
  stripe_customer_id,
  last_reengage_push_at,
  home_last_at, home_catchup_from,
  updated_at
) on public.profiles to authenticated;
