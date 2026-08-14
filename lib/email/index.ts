import { Resend } from 'resend'
import { createHmac } from 'crypto'
import { maySendProgramme, recordProgrammeSend } from './address-guard'
import { APP_ORIGIN } from '@/lib/config/site'

let _resend: Resend | null = null

function client(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export const EMAIL_FROM = process.env.EMAIL_FROM ?? 'Justin at Guided Childhood <hello@guidedchildhood.com>'

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

// The unsubscribe link carries the user id plus an HMAC so it cannot be
// forged for other accounts. Keyed off CRON_SECRET which already exists
// in every environment that sends email.
export function unsubscribeToken(userId: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? 'dev')
    .update(userId)
    .digest('hex')
    .slice(0, 32)
}

export function unsubscribeUrl(userId: string): string {
  const origin = APP_ORIGIN
  return `${origin}/api/email/unsubscribe?u=${userId}&k=${unsubscribeToken(userId)}`
}

// "Would you use this?", as a link rather than a question they have to answer
// in words. Signed with the same token as the unsubscribe link, so a guessed
// URL cannot write a row and the count stays worth reading.
export function interestUrl(userId: string, feature: string, answer: 'yes' | 'no'): string {
  const origin = APP_ORIGIN
  return `${origin}/api/interest?u=${userId}&k=${unsubscribeToken(userId)}&f=${encodeURIComponent(feature)}&a=${answer}`
}

// The same one click stop, for someone who gave us their email before they had
// an account. There is no user id to key off, so the address itself is signed.
//
// This exists because the pre sign up sequence used to offer nothing but a
// mailto, and a parent who has since joined under a different address had no
// way to stop being sold something they already own except by writing to us.
// It is also what the bulk sender rules ask for: a link that works in one tap,
// not an email to compose.
export function leadUnsubscribeToken(email: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? 'dev')
    .update(`lead:${email.trim().toLowerCase()}`)
    .digest('hex')
    .slice(0, 32)
}

export function leadUnsubscribeUrl(email: string): string {
  const origin = APP_ORIGIN
  const addr = email.trim().toLowerCase()
  return `${origin}/api/email/unsubscribe?e=${encodeURIComponent(addr)}&k=${leadUnsubscribeToken(addr)}`
}

// Signed the same way as the unsubscribe links, and for a sharper reason than
// tamper proofing. An endpoint that answers "does this address have an account"
// for any address typed into it is an account checker, and someone would point
// a list at it. The HMAC means it only ever answers for addresses we already
// emailed, which is a question the sender can already answer.
export function starterCtaToken(email: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? 'dev')
    .update(`cta:${email.trim().toLowerCase()}`)
    .digest('hex')
    .slice(0, 32)
}

/**
 * The "see the starter pack" link, resolved when it is clicked rather than when
 * it is sent.
 *
 * Send time is the wrong moment to decide. The lead crons do check for an
 * account first, but only ever on the exact address, so a parent who took a
 * printable as you+test@gmail.com and then joined as you@gmail.com still reads
 * as a stranger. And nothing at send time can know about an account made the
 * following morning, which leaves a live link inviting a paying member to go
 * and start the thing they already have.
 *
 * Click time knows both. The route sends anyone with an account to their
 * dashboard and everyone else to the pack.
 */
export function starterCtaUrl(email: string): string {
  const origin = APP_ORIGIN
  const addr = email.trim().toLowerCase()
  return `${origin}/api/go/starter?e=${encodeURIComponent(addr)}&k=${starterCtaToken(addr)}`
}

/**
 * Why this email exists, which decides whether the one a week floor applies.
 *
 * 'programme'     we decided to send it: a drip, a digest, a nurture, a win
 *                 back, a nudge. Throttled to one per address per six days
 *                 across every system, and never sent to an address that has
 *                 asked to be forgotten. THIS IS THE DEFAULT, on purpose. A
 *                 future feature that forgets to say gets throttled, which
 *                 shows up as a missing email; forgetting the other way shows
 *                 up as a parent getting thirty.
 *
 * 'transactional' the person is waiting for it right now: the printable they
 *                 just asked for, a school reminder they set up themselves, a
 *                 receipt, a password link. Never throttled, never suppressed,
 *                 because none of it is ours to withhold.
 *
 * 'operational'   it goes to us, not to a parent. Health alerts, refresh
 *                 reports, the founder desk. Throttling our own alarms would be
 *                 daft and suppressing them impossible, since there is nobody
 *                 to unsubscribe.
 */
export type EmailKind = 'programme' | 'transactional' | 'operational'

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  kind?: EmailKind
  /** Which programme, for the record on the address. Diagnostic only. */
  key?: string
}): Promise<{ ok: boolean; error?: string; skipped?: 'suppressed' | 'too_soon' }> {
  if (!emailConfigured()) return { ok: false, error: 'RESEND_API_KEY not set' }

  const kind = params.kind ?? 'programme'

  // The shared floor. One row per address, one check, every system.
  //
  // Justin, 12 August 2026: "we must be careful only to send one once per week
  // from all systems." It sits here rather than in each programme because the
  // fault was two programmes each sending exactly one, 1.1 seconds apart, each
  // correctly deduped against a ledger that could not see the other.
  //
  // Reported as skipped rather than as an error, and that distinction matters
  // to the callers: a programme that treats a failed send as "try again
  // tomorrow" will roll its own ledger back and retry, which is precisely the
  // right behaviour here. It is not an error, it is a not yet.
  if (kind === 'programme') {
    const verdict = await maySendProgramme(params.to)
    if (!verdict.allowed) return { ok: false, skipped: verdict.reason, error: verdict.reason }
  }

  try {
    const { error } = await client().emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })
    if (error) return { ok: false, error: error.message }
    if (kind === 'programme') await recordProgrammeSend(params.to, params.key)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'send failed' }
  }
}
