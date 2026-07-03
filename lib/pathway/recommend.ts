import type { createClient } from '@/lib/supabase/server'
import { CHALLENGE_TO_CATEGORY } from '@/lib/content/challenge-map'
import type { StageId } from './progress'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface RecommendedScript {
  sort_order: number
  title: string
  situation: string
  matchesChallenge: boolean
}

// The single best next script for this parent: prefers their stage's
// scripts in the category matching what they told us their main concern
// was at signup, skips anything already completed, falls back to sort
// order within the stage if everything matching is already done.
// With preferFree set, free scripts win over paid ones at every step,
// so an unpaid parent is never routed straight into the paywall.
export async function getRecommendedScript(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  challenge: string | null | undefined,
  opts?: { preferFree?: boolean }
): Promise<RecommendedScript | null> {
  const [{ data: scripts }, { data: completions }] = await Promise.all([
    supabase
      .from('scripts')
      .select('sort_order, title, situation, category, is_free')
      .eq('stage_id', stageId)
      .order('sort_order', { ascending: true }),
    supabase
      .from('script_completions')
      .select('script_sort_order')
      .eq('user_id', userId),
  ])

  if (!scripts || scripts.length === 0) return null

  const completedOrders = new Set((completions ?? []).map(c => c.script_sort_order))
  const notDone = scripts.filter(s => !completedOrders.has(s.sort_order))
  if (notDone.length === 0) return null

  const matchCategory = challenge ? CHALLENGE_TO_CATEGORY[challenge] : null
  const matching = matchCategory ? notDone.filter(s => s.category === matchCategory) : []

  const pick = (pool: typeof notDone) => {
    if (!opts?.preferFree) return pool[0]
    return pool.find(s => s.is_free) ?? pool[0]
  }

  let chosen = matching.length > 0 ? pick(matching) : pick(notDone)
  if (opts?.preferFree && chosen && !chosen.is_free) {
    // Nothing free in the matching category: fall back to any free script
    // in the stage before settling for a paid one.
    chosen = pick(notDone)
  }
  if (!chosen) return null

  return {
    sort_order: chosen.sort_order,
    title: chosen.title,
    situation: chosen.situation,
    matchesChallenge: matching.some(s => s.sort_order === chosen.sort_order),
  }
}
