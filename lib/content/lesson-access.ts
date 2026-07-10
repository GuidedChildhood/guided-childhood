import type { SupabaseClient } from '@supabase/supabase-js'

// Free tier: one lesson per stage is a free taste, the rest unlock with
// membership (or during the 7 day trial, when everything is open). The free
// lesson in a stage is the one with the lowest sort_order among the parent
// lessons for that stage. A lesson the family has already completed never
// locks, nothing free ever degrades.

export type LessonLite = { id: string; stage_id: string; sort_order: number }

// The set of free (taste) lesson ids from an already loaded list: the lowest
// sort_order parent lesson in each stage.
export function freeLessonIds(lessons: LessonLite[]): Set<string> {
  const best = new Map<string, LessonLite>()
  for (const l of lessons) {
    const cur = best.get(l.stage_id)
    if (!cur || l.sort_order < cur.sort_order) best.set(l.stage_id, l)
  }
  return new Set([...best.values()].map(l => l.id))
}

// Detail page check: is this single parent lesson the free taste for its
// stage? True when no other parent lesson in the stage has a lower sort_order.
export async function isParentLessonFree(
  supabase: SupabaseClient,
  stageId: string,
  lessonId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from('lessons')
    .select('id')
    .eq('audience', 'parent')
    .eq('stage_id', stageId)
    .neq('status', 'stub')
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle()
  return !!data && data.id === lessonId
}
