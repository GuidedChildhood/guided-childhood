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

import { needsMembership, hasFullAccess, TRIAL_DAYS } from '../lib/access.ts'

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
  '/dashboard/notifications', '/dashboard/pathway', '/dashboard/phone-setup',
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

// ── THE NUMBER ──────────────────────────────────────────────────────────────
check('the trial is four days, which is what he asked for', TRIAL_DAYS === 4, String(TRIAL_DAYS))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
