import { db } from '@/lib/supabase/server-db'
import { FOUNDING } from './pricing'

/** How many founding school places are still open, counted from the
 *  requests themselves, the way the pilot counts its five. Null when the
 *  count cannot be read: the page then says nothing about places, and the
 *  invoice action refuses the band rather than risk selling a fifty first. */
export async function foundingPlacesLeft(): Promise<number | null> {
  try {
    const { count, error } = await db
      .schema('schools')
      .from('invoice_requests')
      .select('id', { count: 'exact', head: true })
      .eq('band', FOUNDING.key)
    if (error || count === null || count === undefined) return null
    return Math.max(0, FOUNDING.places - count)
  } catch {
    return null
  }
}
