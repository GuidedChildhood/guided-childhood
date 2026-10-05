// Does Give £5, get £5 still pay only for friends who stayed, and say so?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 3 to 4 October 2026: a referral system "proven to work", £5 cash to
// the person who shared once the friend has stayed two months. Three things
// can drift without anything going red:
//
// 1. The rule for when £5 is owed. A trial invoice of £0 counted as a payment,
//    or a refund not voiding it, and we pay out for friends who never paid.
// 2. The disclosure. CAP Code rule 2.1 needs a shared message to say the
//    sharer gets something. Trim the message and every share is a breach.
// 3. The refer page sitting behind the paywall. Anyone with an account can
//    share, so it has to live under an open prefix.
//
// Usage: node --experimental-strip-types scripts/check-referrals.mjs

import { referralStage, shareMessage, normaliseCode, proposeCode, ANNUAL_QUALIFY_DAYS } from '../lib/referrals/index.ts'
import { readFileSync, existsSync } from 'node:fs'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const now = new Date('2026-10-04T12:00:00Z')
const daysAgo = n => new Date(now.getTime() - n * 86_400_000)
const paid = (n, amount = 1499) => ({ paidAt: daysAgo(n), amountPaid: amount })

// ── WHEN £5 IS OWED ─────────────────────────────────────────────────────────
const stage = input => referralStage({ interval: 'month', subscriptionStatus: 'active', paidInvoices: [], refunded: false, ...input }, now).status

check('nothing paid is started', stage({}) === 'started')
check('a £0 trial invoice is not a payment', stage({ paidInvoices: [paid(30, 0)] }) === 'started')
check('one paid month is joined, nothing owed yet', stage({ paidInvoices: [paid(10)] }) === 'joined')
check('a trial plus one paid month is still only joined', stage({ paidInvoices: [paid(40, 0), paid(36)] }) === 'joined')
check('two paid months is qualified', stage({ paidInvoices: [paid(40), paid(10)] }) === 'qualified')
check('a refund voids it, even after two months', stage({ paidInvoices: [paid(40), paid(10)], refunded: true }) === 'void')
check('annual paid recently is joined', stage({ interval: 'year', paidInvoices: [paid(10)] }) === 'joined')
check(`annual qualifies at ${ANNUAL_QUALIFY_DAYS} days`, stage({ interval: 'year', paidInvoices: [paid(ANNUAL_QUALIFY_DAYS)] }) === 'qualified')
check('annual cancelled before then never qualifies', stage({ interval: 'year', subscriptionStatus: 'canceled', paidInvoices: [paid(90)] }) === 'joined')

// ── THE DISCLOSURE ──────────────────────────────────────────────────────────
const msg = shareMessage('https://guidedchildhood.com/r/SARAH47')
check('the share message says the sharer gets £5', /I get £5/.test(msg), msg)
check('the share message says what the friend gets', /you get £5 off/.test(msg))
check('the share message carries the link', msg.includes('/r/SARAH47'))
check('the share message has no dashes', !/[–—]|\s-\s/.test(msg))

// ── CODES ───────────────────────────────────────────────────────────────────
check('a pasted code is cleaned', normaliseCode(' sarah-47 ') === 'SARAH47')
check('junk is not a code', normaliseCode('<>!') === null && normaliseCode('ab') === null && normaliseCode(42) === null)
check('a code reads as the parent', proposeCode('Sarah', 47) === 'SARAH47')
check('no name still gives a valid code', normaliseCode(proposeCode(null, 4821)) !== null)

// ── WIRING ──────────────────────────────────────────────────────────────────
const access = readFileSync('lib/access.ts', 'utf8')
check('the refer page is under settings, which the paywall leaves open', access.includes("'/dashboard/settings'") && existsSync('app/(dashboard)/dashboard/settings/refer/page.tsx'))
const checkout = readFileSync('app/api/stripe/checkout/route.ts', 'utf8')
check('checkout reads the referral and applies the friend coupon', checkout.includes('referralForCheckout(') && checkout.includes('STRIPE_REFERRAL_COUPON') && checkout.includes('discounts:'))
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'))
check('the daily referral check is scheduled', (vercel.crons ?? []).some(c => c.path === '/api/cron/referrals'))
const admin = readFileSync('app/api/admin/referrals/route.ts', 'utf8')
check('the payout list is founder gated', admin.includes('FOUNDER_NOTIFY_EMAIL') && (admin.match(/await founder\(\)/g) ?? []).length >= 2)
check('the PayPal file leaves out anyone flagged for a hand check', admin.includes('!o.handCheck'))
const privacy = readFileSync('app/(marketing)/privacy/page.tsx', 'utf8')
check('the privacy policy names the PayPal email and PayPal', /PayPal email/.test(privacy) && /<strong>PayPal<\/strong>/.test(privacy))

console.log(failures ? `\n${failures} referral check(s) failed` : '\nGive £5, get £5 holds')
process.exit(failures ? 1 : 0)
