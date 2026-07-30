import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

// The shared parts of the email crons.
//
// There used to be one route doing everything, and it is why the weekly digest
// and the monthly review stopped reaching anybody. The evidence, from the live
// log: of the twelve parents eligible for the week 29 digest, five got it and
// seven never did. Weeks 30 and 31 sent nothing at all, and the monthly review,
// which sat last in the same handler, has never sent a single email in its life.
//
// Two separate faults, and both are fixed here rather than in one of them.
//
// ── One budget shared by everything ────────────────────────────────────────
//
// Every phase ran inside a single 60 second function, in file order. The
// lifecycle emails and the lead drip come first and still work; the digest is
// second from last and degraded as the data grew; the monthly review is last
// and never once got there. That gradient IS the bug. Splitting the routes
// gives each phase its own budget, and the guard below makes a run stop
// cleanly on its own terms instead of being killed halfway through a send.
//
// ── A partial run could never be retried ───────────────────────────────────
//
// The quieter fault, and the one that turned a slow function into seven people
// getting nothing. The digest was gated on "it is Monday", so the five who were
// reached got their email and the seven the run never got to had to wait for
// next Monday, which had a NEW key. They were not delayed, they were skipped
// for ever.
//
// The keys were always week and month scoped, so the routes can simply run
// every day: the first run of the week sends everyone, later runs in the same
// week find nothing left to do and cost one query. Whoever is missed on Monday
// is picked up on Tuesday. Self healing rather than one shot.

export interface ProfileRow {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
  subscription_status: string | null
  trial_ends_at: string | null
  email_opt_out: boolean
  onboarding_complete: boolean | null
  // Only the digest selects this, for the school spotlight. Optional so the
  // lifecycle and monthly routes keep the same row type without it.
  school_id?: string | null
}

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

/** ISO week key, so a week's digest is one idempotent thing whatever day it runs. */
export function digestKey(now: Date): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `digest-${d.getUTCFullYear()}-${String(week).padStart(2, '0')}`
}

/** The month just finished, as its own key. */
export function monthKey(monthStart: Date): string {
  return `balance-${monthStart.getUTCFullYear()}-${String(monthStart.getUTCMonth() + 1).padStart(2, '0')}`
}

export function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  )
}

/**
 * A stopwatch with a deadline, so a run ends on its own terms.
 *
 * The platform kills a function at maxDuration with no warning and no record,
 * which is how seven parents were dropped silently. Stopping ourselves a
 * comfortable margin earlier means the run finishes properly, reports what is
 * left, and the next day picks it up.
 *
 * Checked between whole parents, never mid send, so a stop can never leave an
 * email logged but not delivered.
 */
export function deadline(ms: number) {
  const start = Date.now()
  return {
    out: () => Date.now() - start >= ms,
    spentMs: () => Date.now() - start,
  }
}

type Client = ReturnType<typeof adminClient>

/**
 * Who has already had which email.
 *
 * One read of the whole log rather than a query per parent. The log is small
 * and this runs once, where the alternative is a round trip inside the loop
 * that was already too slow.
 */
export async function loadSentKeys(supabase: Client): Promise<Set<string>> {
  const { data } = await supabase.from('email_log').select('user_id, email_key')
  return new Set((data ?? []).map(l => `${l.user_id}:${l.email_key}`))
}

/**
 * Send one email, exactly once, ever.
 *
 * The log row goes in FIRST and is deleted again if the send fails. That order
 * is deliberate: the unique key on (user_id, email_key) means two overlapping
 * runs cannot both get past the insert, so a slow run being retried can never
 * double send. Losing the row on failure is the right trade, because the cost
 * of a retry tomorrow is nothing and the cost of a duplicate is a parent
 * deciding we are spam.
 */
export async function deliverOnce(
  supabase: Client,
  userId: string,
  email: string,
  key: string,
  content: { subject: string; html: string },
): Promise<'sent' | 'skipped' | 'failed'> {
  const { error: logError } = await supabase.from('email_log').insert({ user_id: userId, email_key: key })
  if (logError) return 'skipped' // unique violation: another run got here first
  const sent = await sendEmail({ to: email, subject: content.subject, html: content.html })
  if (sent.ok) return 'sent'
  await supabase.from('email_log').delete().eq('user_id', userId).eq('email_key', key)
  return 'failed'
}

/** Shared auth gate for every email cron. */
export function cronAuthorised(req: { headers: { get(name: string): string | null } }): boolean {
  return req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}
