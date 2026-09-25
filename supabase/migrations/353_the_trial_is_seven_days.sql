-- The free trial is seven days (25 September 2026).
--
-- Justin, after the Duolingo review: "7 days, card for Founder". It had been
-- four since migration 201. lib/access.ts TRIAL_DAYS moves to 7 in the same
-- pull request, and the copy that names the length moves with it, so run this
-- when that pull request merges. Until it runs, new trials are still granted
-- four days while the pages say seven.
--
-- Only NEW trials change. A trial already running keeps the trial_ends_at it
-- was written with, and a Founder card trial keeps the trial_period_days
-- Stripe was handed at checkout.
--
-- lib/config/trial.ts caches the value for sixty seconds, so it takes effect
-- within a minute with no deploy.

update public.platform_config
   set value = '7'::jsonb,
       updated_at = now()
 where key = 'trial_days';
