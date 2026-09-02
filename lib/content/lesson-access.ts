import type { SupabaseClient } from '@supabase/supabase-js'

// Free tier: one lesson per stage is a free taste, the rest unlock with
// membership (or during the 7 day trial, when everything is open). The free
// lesson in a stage is the one with the lowest sort_order among the parent
// lessons for that stage. A lesson the family has already completed never
// locks, nothing free ever degrades.

export type LessonLite = { id: string; stage_id: string; sort_order: number }

// The one order every reader agrees on: sort_order, then id. Nine lessons in
// each stage share sort_order 500 from the curriculum matrix, and until
// migration 250 spread them out, a tie was broken by whatever order the row
// came back in. The child's list ordered by sort_order and the lesson page
// did not order at all, so the two pages could pick DIFFERENT lessons as the
// free taste and the next open one. A free tier child tapped Go on the lesson
// the list had unlocked and the lesson page, holding a different first
// lesson, bounced them straight back to the list (Justin's screenshot, 2
// September, "does not run when clicked"). The id tie break costs nothing and
// means a tie can never split the two pages again, whatever the query did.
export function byLessonOrder(a: LessonLite, b: LessonLite): number {
  return a.sort_order - b.sort_order || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
}

// The set of free (taste) lesson ids from an already loaded list: the first
// parent lesson in each stage by byLessonOrder.
export function freeLessonIds(lessons: LessonLite[]): Set<string> {
  const best = new Map<string, LessonLite>()
  for (const l of lessons) {
    const cur = best.get(l.stage_id)
    if (!cur || byLessonOrder(l, cur) < 0) best.set(l.stage_id, l)
  }
  return new Set([...best.values()].map(l => l.id))
}

// The child's next lesson in a stage is always open to them, even on the free
// tier, so the fortnightly drip never stalls behind the paywall: they can
// always take the single next step in order. Everything past it still waits
// for membership. Returns the id of the first stage lesson the child has not
// yet passed, or null when they have passed them all.
export function nextOpenLessonId(
  stageLessons: LessonLite[],
  passedIds: Set<string>,
): string | null {
  const ordered = [...stageLessons].sort(byLessonOrder)
  return ordered.find(l => !passedIds.has(l.id))?.id ?? null
}

// Detail page check: is this single parent lesson the free taste for its
// stage? True when no other parent lesson in the stage comes before it in
// byLessonOrder, the same tie break the list pages use.
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
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle()
  return !!data && data.id === lessonId
}
