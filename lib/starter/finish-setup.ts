// WRITING THE FAMILY THROUGH, ONCE, FROM WHEREVER THE ACCOUNT WAS MADE.
//
// There are two ways into the product from the starter pack now, and they end
// in different places in the browser:
//
//   EMAIL AND PASSWORD  never leaves the page, so the answers are still sitting
//                       in React state when the session appears.
//   GOOGLE OR APPLE     leaves the site entirely, goes to the provider, comes
//                       back through /auth/callback, and lands on a freshly
//                       mounted page with no state at all.
//
// This file is what both of them call, because two copies of the code that
// creates a family's first child row is how the two come to disagree, and the
// one that disagrees quietly is the one that ships.
//
// ── WHY A BLOB OF ITS OWN, WHEN THERE ARE ALREADY THREE KEYS ───────────────
//
// Because the three keys lose the birthday. `gc_starter_answers` is written at
// the reveal and carries no birthday and no child name; `gc_starter_progress`,
// which does hold the birthday, is DELETED at that same moment; the name sits
// in `gc_starter_child_name` on its own. A parent who tapped Continue with
// Google would have come back and been asked their child's birthday a second
// time, which is the exact double asking the July front loading set out to end.
//
// So the moment before the browser leaves for Google, everything the write
// through needs goes into one place, and it is read back once and cleared.

import type { SupabaseClient } from '@supabase/supabase-js'
import { getStageFromAgeBand, type AgeBand, type ChallengeId, type FeelingId, type TimeCommitmentId } from '@/lib/content/stages'

export const PENDING_KEY = 'gc_starter_pending'

/** Everything the write through needs, and nothing it does not. */
export type PendingSetup = {
  ageBand: AgeBand | null
  challenge: ChallengeId | null
  /** Every worry ticked, most pressing first. */
  picks: string[]
  /** The one they typed under Something else, already tidied. */
  worryOther: string
  feeling: FeelingId | null
  timeCommitment: TimeCommitmentId | null
  childName: string
  /** ISO date, first of the birth month. The band is derived FROM this, so
   *  losing it means lib/learning/term.ts cannot say which school year the
   *  child is in and setup has to ask all over again. */
  dob: string | null
}

/** Put it somewhere that survives a trip to Google and back. */
export function keepPendingSetup(pending: PendingSetup): void {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(pending)) } catch { /* private mode: the setup wizard is still the fallback */ }
}

/** Read it back, once. Returns null when there is nothing waiting, which is the
 *  normal case for every visit that is not a return from a provider. */
export function takePendingSetup(): PendingSetup | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PendingSetup
  } catch { return null }
}

export function clearPendingSetup(): void {
  try { localStorage.removeItem(PENDING_KEY) } catch { /* nothing to clear */ }
}

/**
 * Mark onboarding complete, start the free trial, and create the child.
 *
 * This is what the old separate onboarding did, folded into the one flow so the
 * child is never asked about twice. Best effort throughout: if any part of it
 * fails the setup wizard at /onboarding remains the fallback and will ask for
 * whatever did not land.
 *
 * THE TRIAL IS NOT WRITTEN HERE, and that is the point rather than a tidy up.
 * It used to set trial_ends_at straight onto the parent's own profile row from
 * the browser, which meant a client write that could be repeated (run the
 * starter pack again and the four days start again for ever) and, worse,
 * REQUIRED trial_ends_at to be writable by `authenticated`, the same grant that
 * let anyone set subscription_status to active and take the product free.
 * Justin, 8 August 2026: "we must make sure real users can not continue without
 * subscribing." Migration 175 revokes both columns and /api/trial/start grants
 * the trial once, on the server, where the rule can be enforced.
 */
export async function writeStarterSetup(supabase: SupabaseClient, p: PendingSetup): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    // No session means no account yet, which happens when email confirmation is
    // on. Writing anything here would write it against nobody.
    if (!user) return

    const stg = p.ageBand ? getStageFromAgeBand(p.ageBand) : null

    // EVERY WORRY, NOT JUST THE FIRST. This wrote `challenge` alone, one id,
    // and then set onboarding_complete true, which makes the setup wizard skip
    // itself for every parent who came through the quiz. The wizard is the ONLY
    // place that ever wrote `challenges`, the whole list, so for a quiz parent
    // the list was never written at all: they ticked three worries, one reached
    // seedBaselineConcerns, and the other two were topped up with the stock
    // starters. It looked like the app had chosen for them, because it had.
    //
    // Justin, 9 September 2026: "Make sure changes are all wired into platform
    // so we include the issues in daily check up." This is that wire.
    await supabase.from('profiles').update({
      onboarding_complete: true,
      onboarding_answers: {
        ageBand: p.ageBand,
        challenge: p.challenge,
        challenges: p.picks,
        challenge_other: p.worryOther.trim() || null,
        feeling: p.feeling,
        timeCommitment: p.timeCommitment,
      },
    }).eq('id', user.id)

    // Best effort, like everything else in here. A trial that fails to start is
    // a parent who sees the upgrade page a little early, which is a far better
    // failure than a setup that cannot finish.
    try { await fetch('/api/trial/start', { method: 'POST' }) } catch { /* onboarding is the fallback */ }

    const { data: existing } = await supabase.from('children').select('id').eq('parent_id', user.id).limit(1)
    if (!existing || existing.length === 0) {
      await supabase.from('children').insert({
        parent_id: user.id,
        name: p.childName.trim() || 'Your child',
        age_band: p.ageBand,
        date_of_birth: p.dob,
        stage_id: stg ? stg.name.toLowerCase() : 'explorer',
        is_primary: true,
      })
    }

    // ── AND SAY HELLO TODAY, NOT TOMORROW MORNING ─────────────────────────
    //
    // Justin, 11 September 2026: "do we send a confirmation email once set up,
    // with welcome and user email confirmation?"
    //
    // The welcome lives in the daily email cron, which runs at 08:00, so a
    // family who joined at ten in the morning heard nothing for twenty two
    // hours. Confirm email is off on the project (every account on it was
    // confirmed the instant it was made), so there was no other mail in that
    // gap either: the day a parent signs up was the one day we said nothing.
    //
    // Best effort, like everything else in here, and idempotent on the server
    // through email_log, so the cron's own copy tomorrow is a safety net rather
    // than a second welcome.
    try { await fetch('/api/email/welcome', { method: 'POST' }) } catch { /* the cron still has it */ }

    try { localStorage.removeItem('gc_starter_answers') } catch { /* private mode */ }
    clearPendingSetup()
  } catch { /* onboarding remains the fallback */ }
}
