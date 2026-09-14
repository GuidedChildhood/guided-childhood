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
  /**
   * True at four to seven. Justin, 14 September 2026, with Andy's Foundation
   * passport reading Timer days 0: "Andy prob won't use timer at this age."
   * At that age the timer is the parent's to run, so a zero against the
   * child's name was a score for a thing they cannot do. The strip shows the
   * deal in that cell instead and drops the timer nudge.
   */
  parentRunsTimer: boolean
  /**
   * The family deal, which is what the jobs, the stars and the screen time
   * all rest on. Null when the family has not started one. The passport says
   * where it stands, because a record of the journey that never mentions the
   * thing the journey runs on is missing its first page.
   */
  deal: PassportDeal | null
}

export type PassportDeal = {
  /** Both signatures in. A draft signed by one side is not agreed. */
  signed: boolean
  agreedDate: string | null
  reviewDate: string | null
}

/** Ages four to seven: the parent runs the screens, so the timer is theirs. */
export function parentRunsTimerFor(ageBand: string | null): boolean {
  return ageBand === '4-7'
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
  const empty: PassportChildRead = { daysDone: 0, stars: null, timerDays: 0, parentRunsTimer: parentRunsTimerFor(ageBand), deal: null }
  if (!childId) return empty

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [daysRes, banks, sessionsRes, dealRes] = await Promise.all([
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
    // One deal per family by design, so it is read by the parent, not the child.
    supabase.from('family_agreements').select('signed_by_parent, signed_by_child, agreed_date, review_date')
      .eq('user_id', userId).limit(1).maybeSingle()
      .then(r => r, () => ({ data: null })),
  ])

  const rows = (sessionsRes as { data?: { started_at?: string | null }[] | null }).data ?? []
  // Distinct DAYS, not sessions. Three sessions on Tuesday is one day the timer
  // was used, and counting sessions would flatter a family who ran it once and
  // restarted it twice.
  const days = new Set(rows.map(r => (r.started_at ?? '').slice(0, 10)).filter(Boolean))

  const dealRow = (dealRes as { data?: { signed_by_parent?: boolean | null; signed_by_child?: boolean | null; agreed_date?: string | null; review_date?: string | null } | null }).data ?? null

  return {
    daysDone: (daysRes as { count?: number | null }).count ?? 0,
    stars: banks[0]?.balance ?? null,
    timerDays: days.size,
    parentRunsTimer: parentRunsTimerFor(ageBand),
    deal: dealRow
      ? {
          signed: !!dealRow.signed_by_parent && !!dealRow.signed_by_child,
          agreedDate: dealRow.agreed_date ?? null,
          reviewDate: dealRow.review_date ?? null,
        }
      : null,
  }
}
