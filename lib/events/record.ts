import type { createClient } from '@/lib/supabase/server'
import { londonToday } from '@/lib/pathway/today'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// The habit loop's learning stream (migration 238): what a surface put in
// front of a family and what became of it. Thin on purpose: a surface name,
// an item on it, one of four verbs, the London day. Every write here feeds a
// decision the product makes for this family, never a dashboard for us.
//
// Best effort by design. An event that fails to record must never cost a
// parent the page they asked for, so callers do not await failure and this
// swallows everything, including the daily unique index rejecting a
// duplicate 'shown', which is the index doing its job.
export type SurfaceEventInput = {
  surface: 'script' | 'moment' | 'lesson' | 'digi' | 'path'
  item: string | number
  event: 'shown' | 'opened' | 'read' | 'completed'
  childId?: string | null
}

export async function recordSurfaceEvents(
  supabase: SupabaseClient,
  userId: string,
  events: SurfaceEventInput[],
): Promise<void> {
  if (events.length === 0) return
  const day = londonToday()
  const rows = events.map(e => ({
    user_id: userId,
    child_id: e.childId ?? null,
    surface: e.surface,
    item: String(e.item),
    event: e.event,
    day,
  }))
  try {
    const { error } = await supabase.from('surface_events').insert(rows)
    if (!error) return
    // One duplicate fails a whole batch insert, so the batch that hit the
    // daily index retries row by row and each duplicate is dropped alone.
    for (const row of rows) {
      await supabase.from('surface_events').insert(row).then(() => {}, () => {})
    }
  } catch { /* the page always wins over the ledger */ }
}
