// Full access to Guided Childhood: an active subscription, or a short free
// trial that has not yet passed. One helper so every feature gate agrees.

// Justin: "it should be 4 days free not 7".
//
// Four rather than seven because the thing this trial has to prove happens
// daily. A parent who is going to get it gets it in the first two or three
// days: they set a job, the child ticks it, they say yes, the minutes land.
// Seven days does not add a fifth proof, it adds four days for the habit to go
// quiet in, and a trial that ends after the family has already drifted converts
// worse than one that ends while they are still in it.
//
// Changing this number changes the Stripe checkout's trial_period_days too, so
// the card and the app can never disagree about when it runs out.
export const TRIAL_DAYS = 4

export type AccessProfile = {
  subscription_status?: string | null
  trial_ends_at?: string | null
}

// The founder and any test logins are never paywalled on their own product.
//
// This used to key off FOUNDER_NOTIFY_EMAIL, which is really the answer to a
// different question (where do founder notifications go). One env value doing
// two unrelated jobs meant that pointing notifications at another address
// silently switched the paywall back on for the founder, with nothing to say
// why. FOUNDER_EMAILS is the allowlist now, a comma separated list so a test
// login can be added without a deploy, and the notify address is still honoured
// as a fallback so nothing that worked before stops working.
//
// Server side only, the env never reaches a client.
const ACCESS_ALLOWLIST: string[] = (
  process.env.FOUNDER_EMAILS
  ?? process.env.FOUNDER_NOTIFY_EMAIL
  ?? 'justin@thesocialbillboard.com'
)
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

// The founder address is always in, whatever the env says, so a typo or a
// reassigned notify address can never lock him out of his own product.
if (!ACCESS_ALLOWLIST.includes('justin@thesocialbillboard.com')) {
  ACCESS_ALLOWLIST.push('justin@thesocialbillboard.com')
}

// A subscription that is trying to pay is still a subscription.
//
// Justin, 11 August 2026: "so will this work if payment is not received even
// though they subscribed?"
//
// It would not have, and after this morning's change it would have been much
// worse than it used to be. The webhook writes past_due the moment a renewal
// charge fails, and this function only accepted 'active', so the first bounced
// payment locked a family out. Before the paywall moved into the middleware
// that cost them about fifteen screens. After it, it costs them the entire
// product, on a Tuesday, over an expired card.
//
// Stripe does not give up when a charge fails. It retries for around three
// weeks, and most of those retries succeed: a card replaced, a bank that
// blocked a foreign transaction, a balance that arrives on payday. Throughout
// that window the family is a paying customer who intends to keep paying.
//
// So past_due keeps its access and STRIPE decides when it is over, which it
// already tells us: when the retries finally fail it either cancels the
// subscription, firing customer.subscription.deleted, or leaves it unpaid,
// and the webhook maps both of those to 'cancelled'. That is the door closing,
// and it closes on Stripe's judgement rather than on a first failed charge.
//
// The asymmetry is deliberate. Letting a lapsed family keep the app for three
// more weeks costs a few pounds. Locking a paying family out of the thing they
// use with their child every morning costs the family.
const PAYING_STATUSES = ['active', 'past_due'] as const

export function hasFullAccess(profile: AccessProfile | null | undefined, email?: string | null): boolean {
  if (email && ACCESS_ALLOWLIST.includes(email.trim().toLowerCase())) return true
  if (!profile) return false
  if ((PAYING_STATUSES as readonly string[]).includes(profile.subscription_status ?? '')) return true
  if (profile.trial_ends_at) return new Date(profile.trial_ends_at).getTime() > Date.now()
  return false
}

/**
 * A payment has bounced and Stripe is still retrying.
 *
 * They keep everything, and they need telling, because the one way this goes
 * wrong is silently: three weeks of retries fail, the subscription cancels, and
 * the first a family hears about it is the app shutting. The card takes a
 * minute to fix in the billing portal while the door is still open.
 */
export function paymentNeedsAttention(profile: AccessProfile | null | undefined): boolean {
  return profile?.subscription_status === 'past_due'
}

export function inTrial(profile: AccessProfile | null | undefined): boolean {
  if (!profile || profile.subscription_status === 'active' || !profile.trial_ends_at) return false
  return new Date(profile.trial_ends_at).getTime() > Date.now()
}

// Whole days left in the trial, rounded up, floored at zero. Zero once it has
// passed. Only meaningful when inTrial is true.
export function trialDaysLeft(profile: AccessProfile | null | undefined): number {
  if (!profile?.trial_ends_at) return 0
  const ms = new Date(profile.trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86400000))
}

// The trial start value to write at onboarding completion.
export function trialEndsFromNow(): string {
  return new Date(Date.now() + TRIAL_DAYS * 86400000).toISOString()
}

// ── WHAT STAYS OPEN WHEN THE FOUR DAYS ARE UP ───────────────────────────────
//
// Justin, 11 August 2026, asked whether the free daily path went behind the
// paywall too: "yes everything is behind the paywall after 4 days and if not
// subscribed."
//
// So the rule is the whole dashboard, and the interesting part of the rule is
// the short list of things that cannot be behind it, because a paywall that
// locks these does not collect any money, it just traps people.
//
//   upgrade      the paywall itself. Locking the till is its own punchline.
//   settings     billing, the card, cancelling, exporting, signing out. A
//                parent who cannot reach this cannot leave, and a subscription
//                somebody cannot cancel is a chargeback and a complaint rather
//                than a customer.
//   orders       what a family has already bought and paid for. Locking a
//                receipt behind a new payment is not a paywall, it is taking
//                something back.
//   admin        the founder's own console, which has its own allowlist and is
//                how the paywall gets fixed when it goes wrong.
//   email-check  unsubscribing and verifying an address. Making somebody pay
//                to stop being emailed is the one that draws regulators.
//
// A prefix list rather than a list of exact paths, so /dashboard/settings/x
// stays reachable without anybody remembering to add it.
const PAYWALL_OPEN_PREFIXES = [
  '/dashboard/upgrade',
  '/dashboard/settings',
  '/dashboard/orders',
  '/dashboard/admin',
  '/dashboard/email-check',
] as const

/**
 * Does this path need a membership?
 *
 * Deliberately a pure function of the path, with no database in it, so the rule
 * can be tested exhaustively without a Supabase instance and so the middleware
 * only pays for a profile read on the paths that can actually be blocked.
 */
export function needsMembership(pathname: string): boolean {
  if (!pathname.startsWith('/dashboard')) return false
  return !PAYWALL_OPEN_PREFIXES.some(
    p => pathname === p || pathname.startsWith(p + '/'),
  )
}
