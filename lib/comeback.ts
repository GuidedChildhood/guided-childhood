import { createHmac, timingSafeEqual } from 'crypto'
import { APP_ORIGIN } from '@/lib/config/site'

// THE FREE WEEK BACK, FOR A FAMILY WHOSE FREE DAYS RAN OUT.
//
// Justin, 28 November 2026: give sign ups who lapsed another chance at the
// founding rate, with an offer and a poll, "but all needs to actually work".
//
// The offer is a week, not a discount. A cut off £7.99 for life would undercut
// the founders who pay it, and the founding rate is already the best price we
// will ever have. A week back lets a family who drifted see the thing working
// again, with the founding rate still open while places last.
//
// How it works: a signed link in win back 2 and 3 (lib/email/templates.ts).
// One tap moves trial_ends_at to seven days from now, which is the one date
// hasFullAccess reads (lib/access.ts), so every gate opens with no other
// change. Once per family, ever: the claim is an email_log row under
// COMEBACK_KEY, and the table's unique (user_id, email_key) makes a second tap,
// a double tap or two devices at once all the same single grant.
//
// Never for a paying member (they have everything already), and never for a
// family still inside their free days (the week would shorten nothing and
// waste the one chance).

export const COMEBACK_DAYS = 7
export const COMEBACK_KEY = 'comeback-week'

/** Signed with CRON_SECRET under its own prefix, so an unsubscribe or an ask
 *  token can never be replayed as a free week. */
export function comebackToken(userId: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? 'dev')
    .update(`comeback:${userId}`)
    .digest('hex')
    .slice(0, 32)
}

export function comebackTokenValid(userId: string | null | undefined, token: string | null | undefined): boolean {
  if (!userId || !token || !/^[0-9a-f-]{36}$/i.test(userId) || token.length !== 32) return false
  const want = Buffer.from(comebackToken(userId))
  const got = Buffer.from(token)
  return want.length === got.length && timingSafeEqual(want, got)
}

export function comebackUrl(userId: string): string {
  return `${APP_ORIGIN}/api/comeback?u=${userId}&k=${comebackToken(userId)}`
}

export type ComebackVerdict =
  | { grant: true; trialEndsAt: string }
  | { grant: false; reason: 'paying' | 'still_free' | 'used' }

/**
 * May this family have the week, and until when.
 *
 * Pure, so the rule is tested without a database. `used` is whether the claim
 * row already exists; the route still relies on the unique insert, so this is
 * the polite answer and the insert is the lock.
 */
export function comebackVerdict(
  profile: { subscription_status: string | null; trial_ends_at: string | null; created_at: string | null },
  used: boolean,
  nowMs: number,
  trialDays: number,
): ComebackVerdict {
  const status = (profile.subscription_status ?? '').toLowerCase()
  if (status === 'active' || status === 'past_due' || status === 'trialing') return { grant: false, reason: 'paying' }
  if (used) return { grant: false, reason: 'used' }
  const endsMs = profile.trial_ends_at
    ? new Date(profile.trial_ends_at).getTime()
    : profile.created_at ? new Date(profile.created_at).getTime() + trialDays * 86400000 : 0
  if (endsMs > nowMs) return { grant: false, reason: 'still_free' }
  return { grant: true, trialEndsAt: new Date(nowMs + COMEBACK_DAYS * 86400000).toISOString() }
}

// ── THE GRANT, WITH THE DATABASE PASSED IN ─────────────────────────────────
//
// The route's whole job in one function, so it is tested end to end against a
// fake (lib/comeback.test.ts) rather than trusted: the double tap, the second
// device, and the write that fails and must hand the chance back.

export type ComebackProfile = { subscription_status: string | null; trial_ends_at: string | null; created_at: string | null }

export type ComebackDb = {
  profile(userId: string): Promise<ComebackProfile | null>
  used(userId: string): Promise<boolean>
  /** Insert the claim row. False when it already exists (the unique key). */
  claim(userId: string): Promise<boolean>
  setTrialEnd(userId: string, iso: string): Promise<boolean>
  unclaim(userId: string): Promise<void>
}

export type ComebackOutcome =
  | { kind: 'granted'; trialEndsAt: string }
  | { kind: 'refused'; reason: 'paying' | 'still_free' | 'used' }
  | { kind: 'missing' }
  | { kind: 'failed' }

/** What the offer page should say, without granting anything (the GET). */
export async function checkComeback(db: ComebackDb, userId: string, nowMs: number, trialDays: number): Promise<ComebackOutcome | { kind: 'offer' }> {
  const profile = await db.profile(userId)
  if (!profile) return { kind: 'missing' }
  const v = comebackVerdict(profile, await db.used(userId), nowMs, trialDays)
  return v.grant ? { kind: 'offer' } : { kind: 'refused', reason: v.reason }
}

/** Grant the week (the POST). */
export async function grantComeback(db: ComebackDb, userId: string, nowMs: number, trialDays: number): Promise<ComebackOutcome> {
  const profile = await db.profile(userId)
  if (!profile) return { kind: 'missing' }
  const v = comebackVerdict(profile, await db.used(userId), nowMs, trialDays)
  if (!v.grant) return { kind: 'refused', reason: v.reason }
  // The claim is the lock: a double tap or a second device loses here.
  if (!(await db.claim(userId))) return { kind: 'refused', reason: 'used' }
  if (!(await db.setTrialEnd(userId, v.trialEndsAt))) {
    // Give the chance back rather than spend it on a write that did not land.
    await db.unclaim(userId)
    return { kind: 'failed' }
  }
  return { kind: 'granted', trialEndsAt: v.trialEndsAt }
}
