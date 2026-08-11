import type { SupabaseClient } from '@supabase/supabase-js'

// Is this script locked?
//
// Justin, 11 August 2026, twice: "I don't want the scripts free so that needs to
// be paywalled, as everything should be 4 days free paywall."
//
// ── WHAT THIS USED TO DO ────────────────────────────────────────────────────
//
// A permanent free tier underneath the trial, in the Duolingo shape: two free
// scripts a week, a soft ceiling that refreshed rather than a wall, drawn from
// the 63 scripts carrying is_free. A free script already opened stayed open for
// ever, and the allowance came back every Monday.
//
// It was a reasonable design and it is not the one being sold. The trial is the
// free offer: four days, everything open, and then a membership. Two free offers
// running side by side meant a parent could sit on the second one indefinitely
// and never meet the first one's deadline, which is the deadline the product
// converts on.
//
// ── AND IT IS NOW ONE LINE ──────────────────────────────────────────────────
//
// Paid means an active subscription, a trial that has not run out, or the
// founder allowlist. That is lib/access.ts and it has not changed. Everything
// else is locked, which is what the sentence above says.
//
// The database says the same thing rather than trusting this. Migration 187
// drops the anon policy that made those 63 rows world readable, so a script is
// unreachable as well as unopenable. The screen and the row agreeing is the
// lesson from the profiles hole on 8 August, and from the scripts policy in 148:
// a paywall enforced only in the client is a paywall with a browser console
// sized door in it.
//
// is_free is still on those 63 rows and still means something, just not this.
// It marks the scripts we would use as a sample. It grants nothing.

/**
 * True when the parent cannot open this script.
 *
 * Deliberately still async and still taking the client and the user id. Every
 * caller awaits it, and a free tier is the kind of thing that comes back: when
 * it does, it comes back here, with the arguments it needs already in place,
 * rather than by rethreading a signature through half a dozen routes.
 */
export async function isScriptLocked(
  _supabase: SupabaseClient,
  _userId: string,
  isPaid: boolean,
  _script: { sort_order: number; is_free: boolean }
): Promise<boolean> {
  return !isPaid
}
