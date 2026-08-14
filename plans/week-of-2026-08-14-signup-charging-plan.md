# Sign up and charging, rebuilt to match the homepage

Branch: `claude/guided-childhood-signup-charging-0f3c78`
Lane: app (sign up, Stripe, emails). The homepage is not touched.
Migration claimed: **196**. Highest on origin/main is 195, highest on any open
branch is 194.

## Why this exists

PR #849 and #851 put a promise on the front page and the app does not keep it.
The homepage now sells:

- a four day trial, no card, with DiGi on a daily limit and a starter set of
  scripts,
- a founder rate of £7.99 a month for life, first 50 families, and the words
  **"The founder rate is claimed at sign up"**,
- standard prices of £12.99 a month or £99 a year for everybody after that.

The app asks none of this at sign up. The two doors live at
`/dashboard/choose`, gated on `first_checkin_at`, so the offer arrives days
after the page that sold it. The trial hands over the entire product rather
than the limited version being advertised, and a founder whose card is on file
gets no reminder before the first charge.

## The two paths, exactly

### Path 1, commit at sign up (founder)

- Card taken at sign up. One Stripe subscription, `trial_period_days: 4`,
  £7.99 a month, first charge on day 5, automatic.
- Locks £7.99 for life. First 50 families. **Only card committed sign ups
  count**, enforced against the live Stripe count in the checkout route.
- The button screen says it plainly: "£7.99 a month starts after your 4 free
  days. Cancel any time before and pay nothing."
- Day 3 reminder email before the first charge (DMCCA 2024 expects a pre
  charge reminder).

### Path 2, no card

- Four free days, no card collected, no founder place held or counted.
- When the four days end the account locks to the subscribe screen at the
  standard rate, £12.99 monthly or £99 annual. The founder card is not shown.

### Both

- The trial is identical: four days, DiGi on a daily limit, a starter set of
  scripts. Limits read from the database, not from constants in the app.
- Cancelling during the trial charges nothing, both paths. One step from
  account settings.
- Chosen path, trial start and trial end all stored on the profile so the app
  can gate and the cron can send.

## What changes

### 1  Migration 196

- `profiles.trial_started_at` — when the four days began. The day 3 email is
  computed from this rather than inferred backwards from the end date.
- `platform_config` — a `key`/`value` table so the trial limits are data.
  Seeded with `trial_days`, `trial_digi_daily_limit`,
  `trial_starter_scripts_per_stage`. Service role writes, nobody else reads it
  from the browser.
- `scripts.starter_set` — which scripts a trialling family can open. Seeded
  from `is_free` plus the first N per stage by `sort_order`, so every stage has
  a real sample rather than the one row Explorer, Shaper and Independent each
  carry today.
- The scripts RLS policy learns the trial: a live trial sees `starter_set`,
  a member sees everything.

`plan_choice` is reused for the chosen path rather than duplicated. It already
holds exactly `founder` or `free` and migration 191 already backfilled it.

### 2  The gate moves to the end of sign up

`needsPlanChoice` stops asking for `first_checkin_at` and asks for
`onboarding_complete` instead. The doors stay on their own route,
`/dashboard/choose`, enforced by the middleware. That is what stops the old
failure from migration 191 coming back: the offer is not a screen inside a
wizard whose completion flag was already written, it is a route the middleware
puts back in front of anyone who reloads, closes the tab or wanders off.

Onboarding's last screen sends them there.

### 3  The trial ends when the money starts

One rule, everywhere: a family is on trial limits while `trial_ends_at` is in
the future. The webhook writes `trial_ends_at = now()` the moment Stripe says
the subscription left `trialing` for `active`, so the limits lift on the same
event that takes the first payment and can never lag behind it.

This is also what keeps a parent who pays immediately from being limited: the
charge lands, the trial is over, everything opens.

### 4  DiGi, the scripts and the copy

- The DiGi daily cap applies to any live trial, both paths, and its value comes
  from `platform_config` rather than the `const FREE_DAILY_LIMIT = 3` in the
  route.
- The founder card carries the required sentence above the button.
- The free card says what it costs and what happens on day 5, at the standard
  rate, never the founder one.
- Once the four days are up on path 2, the upgrade screen shows £12.99 and £99
  and no founder rate, because no place was held.

### 5  The day 3 email

A new `founder-precharge` key in the daily lifecycle cron, sent when
`plan_choice = 'founder'` and the trial started two days ago, so it lands on
day 3 and at least a full day before the charge. Existing email infrastructure,
existing `email_log` uniqueness, Justin's voice, no dashes.

### 6  Cancel in one step

Settings already opens the Stripe billing portal. It gains a plain trial line
that says cancelling now costs nothing, and the portal button sits directly
under it rather than three cards down.

## Checks

- `scripts/check-signup-charging.mjs`: the new pure logic. Who is owed the
  block, what the trial grants, when the limits lift, when the day 3 email
  fires.
- `scripts/check-plan-choice.mjs` updated for the moved gate.
- Mobile 390 and desktop 1280 on `/ref-choose` before this is called done.

## Not in this branch

The homepage. It is already right and it is another session's lane.
