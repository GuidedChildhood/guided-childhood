// How many Planet Friends this family has actually earned, read on the parent
// side. The child app already works this out in app/k/[token]/page.tsx; this is
// the same reading from the parent's session, so the shop and the child app
// can never disagree about whether Bloop is theirs.
//
// It matters that this is a server read of the real tables rather than anything
// the browser hands over, because it is the thing standing between a doctored
// basket and a charm nobody earned.

import type { SupabaseClient } from '@supabase/supabase-js'
import { earnedFriends, streakCurrency } from '@/lib/pathway/streak-unlock'

export async function earnedFriendCount(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
): Promise<number> {
  // No child, no Friends. The count belongs to a child's completed days, and
  // there is no family wide version of it to fall back on.
  if (!childId) return 0

  // Both halves of the streak currency, which is what the child app reads.
  //
  // This used to count job_streaks alone and then take the max against the
  // parent's finished pathway stages. Two faults in one line. The stage half
  // sold a charm for work the CHILD had not done, which is the same fault
  // migration 165 is cleaning up out of the sticker book. And counting only
  // job_streaks meant a child who earned their Friends the ordinary way, by
  // completing days in kid_days, could see Bloop in their own book and find the
  // charm still locked in the shop, which is exactly the disagreement the note
  // above promises cannot happen.
  const [jobStreaks, completedDays] = await Promise.all([
    countRows(supabase, 'job_streaks', childId),
    countCompletedDays(supabase, childId),
  ])

  // Fails soft to zero on either read, and zero is the safe direction: the
  // worst case is a parent told to keep going, never a charm sold for a streak
  // that never happened.
  return earnedFriends(streakCurrency(jobStreaks, completedDays))
}

async function countRows(supabase: SupabaseClient, table: string, childId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from(table).select('id', { count: 'exact', head: true }).eq('child_id', childId)
    return count ?? 0
  } catch { return 0 }
}

async function countCompletedDays(supabase: SupabaseClient, childId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('kid_days').select('id', { count: 'exact', head: true })
      .eq('child_id', childId).not('completed_at', 'is', null)
    return count ?? 0
  } catch { return 0 }
}
