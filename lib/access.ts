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

export function hasFullAccess(profile: AccessProfile | null | undefined, email?: string | null): boolean {
  if (email && ACCESS_ALLOWLIST.includes(email.trim().toLowerCase())) return true
  if (!profile) return false
  if (profile.subscription_status === 'active') return true
  if (profile.trial_ends_at) return new Date(profile.trial_ends_at).getTime() > Date.now()
  return false
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
