import { createAdminClient } from '@/lib/supabase/admin'
import { normaliseAddress, dueAgain } from './floor'

// Re-exported so callers have one import for the whole guard. The rule
// itself lives in floor.ts, which has no imports and can therefore be tested
// without a database. See the note at the top of that file.
export { MIN_DAYS_BETWEEN_PROGRAMME_EMAILS, normaliseAddress, dueAgain } from './floor'

// May we email this address, and when did we last?
//
// The one gate every send passes through. It lives here rather than in any
// programme because the fault that created it was two programmes each doing
// their own job correctly: the lead nurture and the teaser drip both fired at
// the same lead 1.1 seconds apart, each perfectly deduped against its own
// ledger, neither able to see the other. Three ledgers, none of which could
// answer "when did we last write to this person".
//
// Justin, 12 August 2026: "we must be careful only to send one once per week
// from all systems." From all systems is the load bearing half, and the only
// way to mean it is one shared row per address, checked inside sendEmail.

export type GuardVerdict =
  | { allowed: true }
  | { allowed: false; reason: 'suppressed' | 'too_soon'; lastSentAt?: string }

/**
 * The check, run before a programme send.
 *
 * FAILS OPEN, and that is a deliberate and slightly uncomfortable choice. If
 * this table cannot be read, or does not exist yet because migration 189 has
 * not been run by hand, every send is allowed. The alternative is a database
 * hiccup silently switching off the entire email programme, which is the exact
 * failure this codebase has already had twice and which looks identical to
 * everything being fine.
 *
 * The cost of failing open is a duplicate email on a bad day. The cost of
 * failing closed is a dead programme nobody notices for a month.
 */
export async function maySendProgramme(address: string): Promise<GuardVerdict> {
  const addr = normaliseAddress(address)
  if (!addr) return { allowed: true }

  try {
    const { data, error } = await createAdminClient()
      .from('email_addresses')
      .select('suppressed_at, last_sent_at')
      .eq('address', addr)
      .maybeSingle()
    if (error) return { allowed: true }
    if (!data) return { allowed: true }

    if (data.suppressed_at) return { allowed: false, reason: 'suppressed' }

    if (!dueAgain(data.last_sent_at as string | null)) {
      return { allowed: false, reason: 'too_soon', lastSentAt: String(data.last_sent_at) }
    }
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

/** Stamp a successful programme send. Best effort: the email has already gone,
 *  so a failure here must not be reported to the caller as a failed send, or a
 *  programme that rolls back its own ledger on failure would send it again. */
export async function recordProgrammeSend(address: string, key?: string): Promise<void> {
  const addr = normaliseAddress(address)
  if (!addr) return
  try {
    await createAdminClient()
      .from('email_addresses')
      .upsert({ address: addr, last_sent_at: new Date().toISOString(), last_key: key ?? null },
              { onConflict: 'address' })
  } catch { /* the email went, which is the part that matters */ }
}

/**
 * This address has asked to be forgotten. Programme mail stops for good.
 *
 * Returns whether it stuck, because the delete account route needs to know: it
 * suppresses BEFORE deleting the user, so that a delete which half succeeds
 * cannot leave a forgotten parent on the mailing list. If the delete then
 * fails, the caller lifts this again.
 */
export async function suppressAddress(address: string, reason: string): Promise<boolean> {
  const addr = normaliseAddress(address)
  if (!addr) return false
  try {
    const { error } = await createAdminClient()
      .from('email_addresses')
      .upsert({ address: addr, suppressed_at: new Date().toISOString(), suppressed_reason: reason },
              { onConflict: 'address' })
    return !error
  } catch {
    return false
  }
}

/**
 * A fresh opt in lifts a suppression.
 *
 * Someone who deleted their account in March and asks us for a printable in
 * September has just told us they want to hear from us, and honouring the older
 * instruction over the newer one is not respecting their wishes, it is
 * ignoring them. Only ever called from a route where the person themselves has
 * just acted.
 */
export async function unsuppressAddress(address: string): Promise<void> {
  const addr = normaliseAddress(address)
  if (!addr) return
  try {
    await createAdminClient()
      .from('email_addresses')
      .update({ suppressed_at: null, suppressed_reason: null })
      .eq('address', addr)
  } catch { /* best effort */ }
}
