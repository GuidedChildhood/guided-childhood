// How many Planet Friends this family has actually earned, read on the parent
// side. The child app already works this out in app/k/[token]/page.tsx; this is
// the same reading from the parent's session, so the shop and the child app
// can never disagree about whether Bloop is theirs.
//
// It matters that this is a server read of the real tables rather than anything
// the browser hands over, because it is the thing standing between a doctored
// basket and a charm nobody earned.

import type { SupabaseClient } from '@supabase/supabase-js'
import { getAllStagesProgress } from '@/lib/pathway/progress'
import { earnedFriends } from '@/lib/pathway/streak-unlock'

const STAGES = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

export async function earnedFriendCount(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
): Promise<number> {
  let stageEarned = 0
  try {
    const progress = await getAllStagesProgress(supabase, userId, 0)
    stageEarned = STAGES.filter(s => progress[s]?.contentComplete).length
  } catch { stageEarned = 0 }

  let completedStreaks = 0
  if (childId) {
    try {
      const { count } = await supabase
        .from('job_streaks')
        .select('id', { count: 'exact', head: true })
        .eq('child_id', childId)
      completedStreaks = count ?? 0
    } catch { completedStreaks = 0 }
  }

  // Fails soft to zero on either read, and zero is the safe direction: the
  // worst case is a parent told to keep going, never a charm sold for a streak
  // that never happened.
  return earnedFriends(stageEarned, completedStreaks)
}
