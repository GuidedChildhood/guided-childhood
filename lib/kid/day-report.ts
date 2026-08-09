import type { SupabaseClient } from '@supabase/supabase-js'
import { ukToday, type StepKey } from '@/lib/kid/five-a-day'
import type { FiveADayDay } from '@/components/pathway/FiveADayReport'

// Reading the child's five a day for the grown up.
//
// The parent side had no read of kid_days at all, which is why they had no view
// of it. Everything else in the app that touches this table counts rows for a
// streak or a sticker; nothing ever looked at what was actually in one.
//
// Read with the PARENT's own client rather than the service role, so the
// existing "Parents read own kid days" policy is the thing deciding whether
// these rows may be seen. A report about a child that reached for the admin key
// would be one policy change away from showing the wrong family's week.

const WINDOW_DAYS = 7

export async function getFiveADayReport(
  supabase: SupabaseClient,
  childId: string | null,
  now: Date = new Date(),
): Promise<{ days: FiveADayDay[]; today: string }> {
  const today = ukToday(now)
  if (!childId) return { days: [], today }

  // Seven days back from today, so the strip is a week and the query cannot
  // walk the whole history of a family who have been here a year.
  const from = new Date(`${today}T12:00:00Z`)
  from.setUTCDate(from.getUTCDate() - (WINDOW_DAYS - 1))
  const since = from.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('kid_days')
    .select('day, steps, done, completed_at, notes')
    .eq('child_id', childId)
    .gte('day', since)
    .order('day', { ascending: false })

  // A report that cannot load is a report that does not render. Nothing here is
  // load bearing for the page around it, and half a week shown as zero would be
  // worse than showing nothing: a parent would read it as their child having
  // stopped.
  if (error || !data) return { days: [], today }

  return {
    today,
    days: data.map(r => ({
      day: r.day as string,
      steps: (r.steps ?? []) as StepKey[],
      done: (r.done ?? []) as StepKey[],
      complete: Boolean(r.completed_at),
      // notes is new in migration 181. Until it runs the column is absent and
      // the select returns undefined for it, so the report simply shows the
      // ticks without the child's own words rather than throwing.
      notes: (r.notes ?? {}) as Record<string, string>,
    })),
  }
}
