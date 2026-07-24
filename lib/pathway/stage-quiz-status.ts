import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// Which stages this family has already passed the passport quiz for, read once
// for the pathway page. Returns a set of stage numbers with at least one passed
// row, so the readiness check can show the stamp as earned and not ask again.
// Fails soft to an empty set before migration 098, so a preview without the
// table renders the quiz as available rather than erroring the whole page.
export async function getPassedStageQuizzes(
  supabase: SupabaseClient,
  userId: string,
  childId?: string | null,
): Promise<Set<number>> {
  let query = supabase
    .from('stage_quiz_passes')
    .select('stage_id')
    .eq('user_id', userId)
    .eq('passed', true)
  if (childId) query = query.eq('child_id', childId)

  const { data, error } = await query
  if (error || !data) return new Set()
  return new Set(data.map(r => r.stage_id as number))
}
