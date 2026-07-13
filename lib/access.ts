// Full access to Guided Childhood: an active subscription, or a 7 day free
// trial that has not yet passed. When the trial ends the family settles onto
// the free tier, never a lockout. One helper so every feature gate agrees.

export const TRIAL_DAYS = 7

export type AccessProfile = {
  subscription_status?: string | null
  trial_ends_at?: string | null
}

// The founder is never paywalled on his own product. Keyed to the same
// FOUNDER_NOTIFY_EMAIL config the insights page uses, so setting that one
// env value unlocks both. Server side only, the env never reaches a client.
const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export function hasFullAccess(profile: AccessProfile | null | undefined, email?: string | null): boolean {
  if (email && email.toLowerCase() === FOUNDER_EMAIL) return true
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
