// The two paths at the end of sign up, walked end to end without a database,
// a Stripe account or a browser.
//
// Justin, 14 August 2026: "At the end of sign up, the parent chooses one of
// exactly two paths." Everything downstream of that choice turns on two pure
// functions, inStarterTrial and hasFullAccess, plus one rule the Stripe
// webhook applies. Between them they decide whether a family may use the
// product at all, whether they see six scripts or two hundred and forty six,
// and whether their card is charged on day five.
//
// So the whole life of both paths is played out below, day by day, the same
// way scripts/check-paywall-paths.mjs walks a subscription's life. The webhook
// is not importable (it needs Stripe and a service key), so the ONE line of it
// that matters here is restated as endTrialOnFirstCharge and pinned to the
// real thing by name: if that line changes, this check has to change with it,
// which is the point.
//
// Usage: node --experimental-strip-types scripts/check-signup-charging.mjs

import { inStarterTrial, hasFullAccess, needsPlanChoice, trialDaysToGrant, TRIAL_DAYS } from '../lib/access.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const inDays = n => new Date(Date.now() + n * 86400000).toISOString()
const agoDays = n => new Date(Date.now() - n * 86400000).toISOString()

/**
 * The one line of app/api/stripe/webhook/route.ts this file depends on.
 *
 *   if (sub.status === 'active') update.trial_ends_at = new Date().toISOString()
 *
 * Strictly 'active', so a founder who cancels mid trial keeps the days they
 * were promised rather than losing them on the way out.
 */
function endTrialOnFirstCharge(profile, stripeStatus) {
  if (stripeStatus !== 'active') return profile
  return { ...profile, trial_ends_at: new Date().toISOString() }
}

// ── PATH ONE · CARD AT SIGN UP ──────────────────────────────────────────────

let founder = {
  subscription_status: 'free',
  trial_ends_at: null,
  onboarding_complete: true,
  plan_choice: null,
}

check('path one · setup finished, the choice is owed',
  needsPlanChoice(founder) === true)

check(`path one · Stripe is handed the full ${TRIAL_DAYS} day trial at sign up`,
  trialDaysToGrant(founder) === TRIAL_DAYS,
  `got ${trialDaysToGrant(founder)}`)

// checkout.session.completed lands: active, founder, and the clock the trial
// route started is already running.
founder = { ...founder, subscription_status: 'active', plan_choice: 'founder', trial_ends_at: inDays(4) }

check('path one · the choice is never asked twice',
  needsPlanChoice(founder) === false)

check('path one · day one, they are in',
  hasFullAccess(founder) === true)

// THE ONE THAT MATTERS. A card on file does not buy them out of the trial,
// because the trial is the same offer on both paths.
check('path one · day one, still on the trial limits despite the card',
  inStarterTrial(founder) === true)

const founderDay3 = { ...founder, trial_ends_at: inDays(1) }
check('path one · day three, still limited and still in',
  inStarterTrial(founderDay3) === true && hasFullAccess(founderDay3) === true)

// Day five. Stripe charges and moves the subscription out of trialing.
const founderCharged = endTrialOnFirstCharge({ ...founder, trial_ends_at: inDays(0.01) }, 'active')
check('path one · the first charge lifts the limits on the same event',
  inStarterTrial(founderCharged) === false && hasFullAccess(founderCharged) === true)

// Cancelling during the free days. Stripe says canceled, the webhook maps that
// to 'cancelled' and deliberately does NOT close the clock.
const founderCancelled = endTrialOnFirstCharge({ ...founder, subscription_status: 'cancelled' }, 'canceled')
check('path one · cancelling mid trial keeps the free days that were promised',
  inStarterTrial(founderCancelled) === true && hasFullAccess(founderCancelled) === true)

check('path one · and once those days run out, cancelled means out',
  hasFullAccess({ ...founderCancelled, trial_ends_at: agoDays(1) }) === false)

// ── PATH TWO · NO CARD ──────────────────────────────────────────────────────

const free = {
  subscription_status: 'free',
  trial_ends_at: inDays(4),
  onboarding_complete: true,
  plan_choice: 'free',
}

check('path two · the choice is answered and never asked again',
  needsPlanChoice(free) === false)

check('path two · the same four days, the same limits',
  inStarterTrial(free) === true && hasFullAccess(free) === true)

const freeExpired = { ...free, trial_ends_at: agoDays(0.1) }
check('path two · day five, locked out until they join',
  hasFullAccess(freeExpired) === false)

check('path two · and an expired clock is not a live trial',
  inStarterTrial(freeExpired) === false)

// ── THE TWO PATHS ARE IDENTICAL FOR FOUR DAYS ───────────────────────────────
//
// Said as a check rather than only in a comment, because it is the promise the
// front page makes and the one a future edit is most likely to break by
// exempting the card holder from something.
for (const day of [0.5, 1, 2, 3, 3.9]) {
  const f = { ...founder, trial_ends_at: inDays(4 - day) }
  const n = { ...free, trial_ends_at: inDays(4 - day) }
  check(`both paths agree on the limits at day ${day}`,
    inStarterTrial(f) === inStarterTrial(n) && inStarterTrial(f) === true)
}

// ── NOBODY WHO HAS PAID OUTRIGHT IS EVER LIMITED ────────────────────────────
//
// A parent who buys from the dashboard with no trial at all. The subscription
// is created 'active', so the webhook closes the clock on customer.
// subscription.created and they never see a starter set.
const boughtOutright = endTrialOnFirstCharge(
  { subscription_status: 'active', trial_ends_at: inDays(4), onboarding_complete: true, plan_choice: 'founder' },
  'active',
)
check('an outright purchase is never handed a sample of what it just bought',
  inStarterTrial(boughtOutright) === false)

// ── THE DAY 3 EMAIL FIRES ON DAY 3, AND ONLY FOR PATH ONE ───────────────────
//
// The rule from the pre charge pass in app/api/email/cron/route.ts, restated:
// path one only, two whole days elapsed, and the trial not yet over.
const PRECHARGE_AFTER_DAYS = 2
const daysSince = iso => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
function prechargeDue(p) {
  if (p.plan_choice !== 'founder') return false
  if (!p.trial_started_at || !p.trial_ends_at) return false
  if (daysSince(p.trial_started_at) < PRECHARGE_AFTER_DAYS) return false
  return new Date(p.trial_ends_at).getTime() > Date.now()
}

check('day 3 email · not on day one',
  prechargeDue({ plan_choice: 'founder', trial_started_at: agoDays(0), trial_ends_at: inDays(4) }) === false)

check('day 3 email · not on day two',
  prechargeDue({ plan_choice: 'founder', trial_started_at: agoDays(1), trial_ends_at: inDays(3) }) === false)

check('day 3 email · yes on day three, with a day still to run',
  prechargeDue({ plan_choice: 'founder', trial_started_at: agoDays(2), trial_ends_at: inDays(2) }) === true)

// A missed cron run must not mean a silent charge, which is the exact outcome
// the consumer act rule exists to prevent.
check('day 3 email · a missed run still sends on day four',
  prechargeDue({ plan_choice: 'founder', trial_started_at: agoDays(3), trial_ends_at: inDays(1) }) === true)

check('day 3 email · never after the charge has already happened',
  prechargeDue({ plan_choice: 'founder', trial_started_at: agoDays(5), trial_ends_at: agoDays(1) }) === false)

check('day 3 email · never to the no card path, which is charged nothing',
  prechargeDue({ plan_choice: 'free', trial_started_at: agoDays(2), trial_ends_at: inDays(2) }) === false)

check('day 3 email · never to an account with no trial recorded',
  prechargeDue({ plan_choice: 'founder', trial_started_at: null, trial_ends_at: inDays(2) }) === false)

console.log(failures === 0 ? '\nAll good.' : `\n${failures} failing.`)
process.exit(failures === 0 ? 0 : 1)
