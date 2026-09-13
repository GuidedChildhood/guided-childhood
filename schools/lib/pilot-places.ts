import { db } from '@/lib/supabase/server-db'
import { PILOT_BAND, PILOT_PLACES } from './pilot'

/** How many of the pilot places are still open. Counted from the requests
 *  themselves, through the server only client, so the page can say "3 of 5"
 *  and mean it. Null when the count cannot be read, and the page then says
 *  nothing rather than something wrong. */
export async function pilotPlacesLeft(): Promise<number | null> {
  try {
    const { count, error } = await db
      .schema('schools')
      .from('invoice_requests')
      .select('id', { count: 'exact', head: true })
      .eq('band', PILOT_BAND)
    if (error || count === null || count === undefined) return null
    return Math.max(0, PILOT_PLACES - count)
  } catch {
    return null
  }
}
