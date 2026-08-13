// Who gets asked to choose a way in, and how many free days the founder door
// actually grants.
//
// Justin, 13 August 2026: "Nothing blocks on sign up, so nobody is ever asked
// to pay." Ten of the eleven accounts on the platform read subscription_status
// 'free', so he was right, and the reason was placement rather than pricing.
//
// This gate decides whether a parent meets a payment screen, so it is exactly
// the kind of rule that must never be reasoned about from the code again. Both
// functions are pure, so the awkward cases can be thrown at them for nothing.
//
// Usage: node --experimental-strip-types scripts/check-plan-choice.mjs

import { needsPlanChoice, trialDaysToGrant, TRIAL_DAYS, hasFullAccess } from '../lib/access.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const inDays = n => new Date(Date.now() + n * 86400000).toISOString()
const agoDays = n => new Date(Date.now() - n * 86400000).toISOString()

// ── WHO IS ASKED ────────────────────────────────────────────────────────────

check('a family who has never checked in is never asked',
  needsPlanChoice({ subscription_status: 'free', trial_ends_at: inDays(4), first_checkin_at: null }) === false)

check('the first check in is what opens the block',
  needsPlanChoice({ subscription_status: 'free', trial_ends_at: inDays(4), first_checkin_at: agoDays(0) }) === true)

check('having chosen free clears it for good',
  needsPlanChoice({ subscription_status: 'free', trial_ends_at: inDays(4), first_checkin_at: agoDays(1), plan_choice: 'free' }) === false)

check('paying clears it without any write of ours',
  needsPlanChoice({ subscription_status: 'active', trial_ends_at: inDays(4), first_checkin_at: agoDays(1) }) === false)

// A bounced card is still a subscription everywhere else in this file, and it
// must be here too. Meeting a "pick a plan" screen while Stripe is retrying a
// renewal would read as the subscription having silently vanished.
check('a card mid retry is not asked to choose again',
  needsPlanChoice({ subscription_status: 'past_due', trial_ends_at: null, first_checkin_at: agoDays(30) }) === false)

// A failed profile read must never conjure a payment screen in front of a
// paying family. This is the same rule the onboarding init guard learned the
// hard way: we do not know is not a yes.
check('an unreadable profile is not asked',
  needsPlanChoice(null) === false && needsPlanChoice(undefined) === false)

// The block is only ever reached by somebody who still HAS access, because
// hasFullAccess runs first in the middleware. This pins that ordering: an
// expired trial fails access, so it meets the upgrade page and its standard
// pricing rather than a choice with one live option.
const expired = { subscription_status: 'free', trial_ends_at: agoDays(1), first_checkin_at: agoDays(5) }
check('an expired trial is blocked by access before it is ever asked to choose',
  hasFullAccess(expired) === false)

// ── HOW MANY FREE DAYS THE CARD DOOR GRANTS ─────────────────────────────────
//
// The founder door is taken DURING the free days. A flat TRIAL_DAYS would hand
// out a longer trial than the copy promises; nothing at all would charge a card
// on a day the parent was told was free.

check(`day one grants the whole ${TRIAL_DAYS}`,
  trialDaysToGrant({ trial_ends_at: inDays(TRIAL_DAYS) }) === TRIAL_DAYS,
  `got ${trialDaysToGrant({ trial_ends_at: inDays(TRIAL_DAYS) })}`)

check('halfway through grants only what is left',
  trialDaysToGrant({ trial_ends_at: inDays(2) }) === 2,
  `got ${trialDaysToGrant({ trial_ends_at: inDays(2) })}`)

// Stripe rejects a zero day trial, so the last hours round up to one rather
// than erroring on the screen where somebody is typing a card number.
check('the last hours still grant a day rather than erroring at Stripe',
  trialDaysToGrant({ trial_ends_at: inDays(0.2) }) === 1,
  `got ${trialDaysToGrant({ trial_ends_at: inDays(0.2) })}`)

check('an expired clock cannot mint a negative trial',
  trialDaysToGrant({ trial_ends_at: agoDays(3) }) === 1,
  `got ${trialDaysToGrant({ trial_ends_at: agoDays(3) })}`)

check('no clock at all falls back to the full offer',
  trialDaysToGrant({ trial_ends_at: null }) === TRIAL_DAYS && trialDaysToGrant(null) === TRIAL_DAYS)

// Nothing may mint a longer trial than the product offers, whatever is in the
// column. A hand edited date in the database is not a free month.
check('a wild future date is capped at the offer',
  trialDaysToGrant({ trial_ends_at: inDays(400) }) === TRIAL_DAYS,
  `got ${trialDaysToGrant({ trial_ends_at: inDays(400) })}`)

console.log(failures === 0 ? '\nAll good.' : `\n${failures} failing.`)
process.exit(failures === 0 ? 0 : 1)
