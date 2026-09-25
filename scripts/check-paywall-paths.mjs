// Which paths does the paywall let through?
//
// Justin, 11 August 2026, asked whether the free daily path went behind the
// paywall too: "yes everything is behind the paywall after 4 days and if not
// subscribed."
//
// So the gate is now one check in the middleware rather than fifteen scattered
// through the pages, and the entire behaviour of it rests on one pure function
// of the path. That makes it exhaustively testable without a database, which is
// the whole reason it was written as a pure function.
//
// TWO WAYS THIS GOES WRONG AND ONLY ONE OF THEM IS OBVIOUS.
//
// A hole is obvious: a product page nobody thought of, still open. The other
// one is worse, because it looks like the paywall working: locking the till.
// A parent who cannot reach billing cannot pay, cannot cancel, and cannot
// unsubscribe, and a subscription somebody cannot cancel is a chargeback and a
// complaint rather than a customer. Every one of those is checked below.
//
// Usage: node --experimental-strip-types scripts/check-paywall-paths.mjs

import { needsMembership, hasFullAccess, paymentNeedsAttention, trialDaysLeft, inTrial, TRIAL_DAYS } from '../lib/access.ts'
import { ourStatusFor } from '../lib/stripe/subscription-status.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── THE TILL STAYS OPEN ─────────────────────────────────────────────────────
for (const open of [
  '/dashboard/upgrade',
  '/dashboard/settings',
  '/dashboard/settings/anything/deeper',
  '/dashboard/orders',
  '/dashboard/admin',
  '/dashboard/admin/health',
  '/dashboard/email-check',
]) {
  check(`${open} is reachable without paying`, !needsMembership(open))
}

// ── AND EVERYTHING ELSE IS NOT ──────────────────────────────────────────────
//
// The full list of dashboard routes as they stand, so a route that quietly
// stops being covered shows up here rather than in the takings.
for (const shut of [
  '/dashboard',
  '/dashboard/agreement', '/dashboard/ai-module', '/dashboard/checkin',
  '/dashboard/daily', '/dashboard/devices', '/dashboard/digi',
  '/dashboard/explore', '/dashboard/guide', '/dashboard/homework',
  '/dashboard/insights', '/dashboard/keepsakes', '/dashboard/learning',
  '/dashboard/lessons', '/dashboard/moments', '/dashboard/new-script',
  '/dashboard/notifications', '/dashboard/pathway', '/dashboard/road', '/dashboard/passport', '/dashboard/phone-setup',
  '/dashboard/printables', '/dashboard/quests', '/dashboard/school',
  '/dashboard/scripts', '/dashboard/secondary', '/dashboard/setup',
  '/dashboard/social-settings', '/dashboard/stats', '/dashboard/tell-a-parent',
  '/dashboard/toolbox', '/dashboard/tracker', '/dashboard/week',
]) {
  check(`${shut} needs a membership`, needsMembership(shut))
}

// A new page is behind the paywall by being a page. That is the property the
// per feature checks did not have, and the reason only fifteen files had one.
check('a route nobody has written yet is behind it too',
  needsMembership('/dashboard/something-invented-next-tuesday'))
check('and so is anything nested under one',
  needsMembership('/dashboard/quests/manage'))

// ── NOT A PREFIX MATCH BY ACCIDENT ──────────────────────────────────────────
//
// The open list is matched on a path boundary, so a route that merely begins
// with the same letters is not waved through.
check('a route that only starts like settings is still shut',
  needsMembership('/dashboard/settings-for-schools'))
check('and one that only starts like upgrade',
  needsMembership('/dashboard/upgrades-explained'))

// ── OFF THE DASHBOARD ENTIRELY ──────────────────────────────────────────────
for (const outside of ['/', '/join', '/starter-pack', '/login', '/scripts', '/k/abc123', '/pathway']) {
  check(`${outside} is not the paywall's business`, !needsMembership(outside))
}

// ── WHO GETS THROUGH ────────────────────────────────────────────────────────
const soon = new Date(Date.now() + 2 * 86400000).toISOString()
const past = new Date(Date.now() - 86400000).toISOString()

check('a member is in', hasFullAccess({ subscription_status: 'active', trial_ends_at: null }))
check('day two of four is in', hasFullAccess({ subscription_status: null, trial_ends_at: soon }))
check('a trial that ran out is not', !hasFullAccess({ subscription_status: null, trial_ends_at: past }))
check('and neither is an account that never started one',
  !hasFullAccess({ subscription_status: null, trial_ends_at: null }))
check('no profile at all is not', !hasFullAccess(null))
check('the founder is never locked out of his own product',
  hasFullAccess(null, 'justin@thesocialbillboard.com'))
check('and the check on that is not case sensitive',
  hasFullAccess(null, 'Justin@TheSocialBillboard.com '))

// ── A SUBSCRIPTION THAT IS TRYING TO PAY ────────────────────────────────────
//
// Justin, 11 August 2026: "so will this work if payment is not received even
// though they subscribed?" It would not have. The webhook writes past_due on
// the first failed renewal, and before this only 'active' got through, so a
// bounced charge locked a paying family out of the whole product. Stripe
// retries for about three weeks and most of those retries succeed.
check('a card that bounced this morning still gets in',
  hasFullAccess({ subscription_status: 'past_due', trial_ends_at: null }))
check('and it is flagged so they can fix it before Stripe gives up',
  paymentNeedsAttention({ subscription_status: 'past_due' }))

// AND THE DOOR STILL CLOSES. Stripe decides when the retries are over, and
// the webhook maps both of its endings onto cancelled.
check('once Stripe gives up, they are out',
  !hasFullAccess({ subscription_status: 'cancelled', trial_ends_at: null }))
check('a cancelled account is not asked to fix a card',
  !paymentNeedsAttention({ subscription_status: 'cancelled' }))
check('and neither is a healthy one',
  !paymentNeedsAttention({ subscription_status: 'active' }))
check('nor an account with no profile at all', !paymentNeedsAttention(null))

// The webhook maps a Stripe side trial onto active, so this is belt and braces
// against that mapping ever being removed.
check('an unknown status is not waved through',
  !hasFullAccess({ subscription_status: 'incomplete_expired', trial_ends_at: null }))

// ── THE NUMBER ──────────────────────────────────────────────────────────────
check('the trial is four days, which is what he asked for', TRIAL_DAYS === 4, String(TRIAL_DAYS))

// ── THE COUNTDOWN ON THE FREE DAYS ──────────────────────────────────────────
//
// Justin, 14 August 2026: "make sure there is countdown on free days."
// TrialCountdown on Home reads these two, so what they say is what a parent
// sees. Rounded UP, so the last part day still reads as a day rather than as
// zero days left while the door is demonstrably still open.
// A minute SHORT of n days, not a minute over. Over rounds up to n + 1, which
// is the fixture lying rather than the product: trialEndsFromNow writes exactly
// now + 4 days, so the very first reading is 4 and this has to model that.
const inDays = n => ({ trial_ends_at: new Date(Date.now() + n * 86400000 - 60000).toISOString() })
check('day one of four counts four', trialDaysLeft(inDays(4)) === 4, String(trialDaysLeft(inDays(4))))
check('the last hours still count one, never zero', trialDaysLeft(inDays(0.2)) === 1, String(trialDaysLeft(inDays(0.2))))
check('an expired trial counts zero', trialDaysLeft(inDays(-3)) === 0, String(trialDaysLeft(inDays(-3))))
check('and never a negative number', trialDaysLeft(inDays(-90)) >= 0)
check('a member is not shown a countdown',
  !inTrial({ subscription_status: 'active', trial_ends_at: inDays(3).trial_ends_at }))
check('a family mid trial is', inTrial(inDays(3)))

// ── THE WHOLE LIFE OF A SUBSCRIPTION, END TO END ────────────────────────────
//
// Stripe says a word, ourStatusFor turns it into one of our three, hasFullAccess
// decides whether the door opens. This walks the chain rather than each link,
// because every real fault in this area has been at a join: a status nobody
// mapped, or a mapped status nobody gated on.
const door = stripeStatus =>
  hasFullAccess({ subscription_status: ourStatusFor(stripeStatus), trial_ends_at: null })

check('they pay, the door opens', door('active'))
check('a card up front trial is in, not locked out of its own free days', door('trialing'))
check('the charge bounces, the door STAYS open while Stripe retries', door('past_due'))
check('and they are told, so the card can be fixed before Stripe gives up',
  paymentNeedsAttention({ subscription_status: ourStatusFor('past_due') }))
check('Stripe gives up and cancels, the door shuts', !door('canceled'))
check('an unpaid subscription is shut too', !door('unpaid'))
check('a checkout that expired never opened it', !door('incomplete_expired'))
check('and a status Stripe has not invented yet fails CLOSED', !door('some_future_status'))
check('nothing at all fails closed', !door(null) && !door(undefined))

// The one that would cost money silently: an unknown Stripe word must never
// become one of our paying words.
check('no unknown status can ever map to a paying one',
  ['canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused', '', 'ACTIVE']
    .every(x => ourStatusFor(x) === 'cancelled'))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
