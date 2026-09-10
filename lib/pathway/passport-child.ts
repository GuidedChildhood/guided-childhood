import type { createClient } from '@/lib/supabase/server'
import { getStarBanks } from '@/lib/quests/bank'

// The child's half of a passport page.
//
// Justin, 10 September 2026, with photos of a real children's sticker passport:
// the stage pages should add "days done in child's app to digi stars done links
// or ability to send reminders to child's app lessons outstanding and balance
// reminder to use device timer".
//
// ── WHY THIS EXISTS AS ITS OWN READ ────────────────────────────────────────
//
// The passport has always read the PARENT'S half: devices set up, moments
// resolved, lessons watched, jobs kept, screen balance. All five are true and
// all five are about what a grown up has done. A parent looking at their
// child's page could not see a single thing the CHILD had done, which is an odd
// thing for an object with the child's name on the cover.
//
// Every number here already exists somewhere in the product. Nothing new is
// stored, no column is added: this is four existing readings brought to one
// place so the page can say them together.
//
// ── THE TIMER READING IS THE ODD ONE ───────────────────────────────────────
//
// The other three say what has been done. The timer says what has NOT: a family
// who has not started a session all week is a family whose screen balance
// numbers are guesses, because nothing is being measured. That is the "balance
// reminder to use device timer" Justin asked for, and it is the one line here
// that can be a nudge rather than a score.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type PassportChildRead = {
  /** Full days finished on the child's own app, all time. */
  daysDone: number
  /** Stars the child is holding right now. Null when there is no bank to read. */
  stars: number | null
  /** Days this week a device session was actually run. 0 says the timer is unused. */
  timerDays: number
}

/**
 * The child's own numbers, for the passport page.
 *
 * Fails soft to zeroes throughout. This decorates a page that already works,
 * and a passport that fails to render because a star bank query timed out would
 * be a worse product than one that shows a zero for a minute.
 */
export async function readPassportChild(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
  ageBand: string | null,
): Promise<PassportChildRead> {
  const empty: PassportChildRead = { daysDone: 0, stars: null, timerDays: 0 }
  if (!childId) return empty

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [daysRes, banks, sessionsRes] = await Promise.all([
    // completed_at is the honest column: `done` is a running list of what has
    // been ticked today and a day with four of five in it is not a day done.
    // See migration 134, which separates the two on purpose.
    supabase.from('kid_days').select('id', { count: 'exact', head: true })
      .eq('child_id', childId).not('completed_at', 'is', null)
      .then(r => r, () => ({ count: 0 })),
    getStarBanks(supabase, userId, [childId], { [childId]: ageBand }).catch(() => []),
    supabase.from('device_sessions').select('started_at')
      .eq('user_id', userId).eq('child_id', childId).gte('started_at', weekAgo)
      .then(r => r, () => ({ data: [] })),
  ])

  const rows = (sessionsRes as { data?: { started_at?: string | null }[] | null }).data ?? []
  // Distinct DAYS, not sessions. Three sessions on Tuesday is one day the timer
  // was used, and counting sessions would flatter a family who ran it once and
  // restarted it twice.
  const days = new Set(rows.map(r => (r.started_at ?? '').slice(0, 10)).filter(Boolean))

  return {
    daysDone: (daysRes as { count?: number | null }).count ?? 0,
    stars: banks[0]?.balance ?? null,
    timerDays: days.size,
  }
}
