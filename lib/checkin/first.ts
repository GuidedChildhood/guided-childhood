import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Stamp the family's first ever check in, once.
 *
 * Two jobs ride on this one timestamp and both want the FIRST one:
 *
 *   the baseline   every later reading on the what is working page is
 *                  measured against where things were when they arrived
 *   the block      the two doors are shown after a parent has given
 *                  something and had something back, never at sign up
 *
 * Guarded by `is null` in the statement rather than by reading first, so two
 * check ins landing together cannot race the value forward and quietly move
 * a family's starting point. Postgres decides, not us.
 *
 * Best effort by design. A check in is the parent's work and it is already
 * saved by the time this runs; losing the stamp costs a day's delay on the
 * block, and failing the request would cost the check in itself.
 */
export async function markFirstCheckIn(supabase: SupabaseClient, userId: string): Promise<void> {
  try {
    await supabase
      .from('profiles')
      .update({ first_checkin_at: new Date().toISOString() })
      .eq('id', userId)
      .is('first_checkin_at', null)
  } catch {
    /* the check in matters more than the stamp */
  }
}
