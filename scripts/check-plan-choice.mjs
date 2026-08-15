// Who gets asked to choose a way in, and how many free days the founder door
// actually grants.
//
// Justin, 14 August 2026: "At the end of sign up, the parent chooses one of
// exactly two paths." The homepage sells the founder rate as "claimed at sign
// up", so finishing setup is what makes the choice owed. It was the first
// check in until this morning, and before that a screen inside the wizard that
// a reload could delete for good. See lib/access.ts for that whole story.
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

check('a parent still mid setup is never asked',
  needsPlanChoice({ subscription_status: 'free', trial_ends_at: inDays(4), onboarding_complete: false }) === false)

check('finishing setup is what opens the block',
  needsPlanChoice({ subscription_status: 'free', trial_ends_at: inDays(4), onboarding_complete: true }) === true)

check('having chosen the no card path clears it for good',
  needsPlanChoice({ subscription_status: 'free', trial_ends_at: inDays(4), onboarding_complete: true, plan_choice: 'free' }) === false)

check('paying clears it without any write of ours',
  needsPlanChoice({ subscription_status: 'active', trial_ends_at: inDays(4), onboarding_complete: true }) === false)

// A bounced card is still a subscription everywhere else in this file, and it
// must be here too. Meeting a "pick a plan" screen while Stripe is retrying a
// renewal would read as the subscription having silently vanished.
check('a card mid retry is not asked to choose again',
  needsPlanChoice({ subscription_status: 'past_due', trial_ends_at: null, onboarding_complete: true }) === false)

// A failed profile read must never conjure a payment screen in front of a
// paying family. This is the same rule the onboarding init guard learned the
// hard way: we do not know is not a yes.
check('an unreadable profile is not asked',
  needsPlanChoice(null) === false && needsPlanChoice(undefined) === false)

// The block is only ever reached by somebody who still HAS access, because
// hasFullAccess runs first in the middleware. This pins that ordering: an
// expired trial fails access, so it meets the upgrade page and its standard
// pricing rather than a choice with one live option.
const expired = { subscription_status: 'free', trial_ends_at: agoDays(1), onboarding_complete: true }
check('an expired trial is blocked by access before it is ever asked to choose',
  hasFullAccess(expired) === false)

// ── HOW MANY FREE DAYS THE CARD DOOR GRANTS ─────────────────────────────────
//
// Taken at the end of sign up, the clock has been running for seconds and this
// is the flat four the button screen promises. It still earns its keep for the
// parent who closes the tab on the choice and comes back on day three: a flat
// TRIAL_DAYS would hand out a longer trial than the copy promises, and nothing
// at all would charge a card on a day they were told was free.

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
