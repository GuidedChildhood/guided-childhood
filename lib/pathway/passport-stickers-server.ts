import type { SupabaseClient } from '@supabase/supabase-js'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { isStageStamped } from '@/lib/pathway/stamped'
import { loadStoredStamps } from '@/lib/pathway/stamp-store'
import { STAGE_IDS } from '@/lib/pathway/passport-print-style'

// WHICH STICKERS THIS CHILD HAS, READ THE ONE WAY (17 November 2026).
//
// The colour sticker sheet prints for the parent (/dashboard/keepsakes/
// passport-print/stickers) and for the child (/k/[token]/print?stickers=1).
// Both read the stamp exactly as the passport page does: the stored stamp
// first (migration 378, a stamp never comes off), otherwise the one rule in
// lib/pathway/stamped.ts. So the paper can never hold a sticker the app has
// not given. Works with the parent's session client or the admin client:
// every read here is filtered by user and child.

export async function stampedStickerNums(
  db: SupabaseClient,
  userId: string,
  childId: string | null,
): Promise<number[]> {
  if (!childId) return []
  const [progress, passed, stored] = await Promise.all([
    getAllStagesProgress(db, userId, 0, childId),
    getPassedStageQuizzes(db, userId, childId),
    loadStoredStamps(db, childId),
  ])
  return STAGE_IDS
    .map((id: StageId, i) => (isStageStamped(progress[id], passed, i + 1, stored) ? i + 1 : 0))
    .filter(n => n > 0)
}
