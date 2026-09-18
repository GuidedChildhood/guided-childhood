import type { SupabaseClient } from '@supabase/supabase-js'
import { TOP_BAND } from '@/lib/concerns/resting'

// WHAT ACTUALLY MOVED THIS MONTH, PER CHILD.
//
// Justin, 18 September 2026: "we report a monthly review [showing] these have
// all progressed, by email and PWA ... and that the results also [summarise]
// the child's progress and passport progress."
//
// The monthly email existed and reported screen time only. A parent who never
// runs the timer got nothing at all, which is most of them, and a parent who
// does got a number about minutes and not one word about the worries they
// actually came here for.
//
// Measured before this was written, across every family: 23 worries have
// reached done and 134 are still being chased. That is the number this report
// exists to make visible. Hiding it would be the comfortable choice and the
// wrong one: a tracker nobody can see the score of is a diary.
//
// ── BANDS, NEVER RAW NUMBERS (review.md 4a) ────────────────────────────────
//
// The five stars are five bands and star n posts the top of its band, so the
// stored scores are 2, 4, 6, 8 and 10. Comparing 8 against 7 would call a
// rounding a result. Everything here compares the BAND, which is the only
// comparison that means what a parent thinks it means.
export const bandOf = (score: number) => Math.max(1, Math.min(5, Math.ceil(score / 2)))

export type MonthProgress = {
  /** Live worries this child still has with us at the end of the month. */
  tracked: number
  /** Worries that finished the month in a higher band than they started it. */
  moved: number
  /** Worries that reached the top band and stopped being asked about. */
  rested: number
  /** The one that moved furthest, for the sentence a parent will actually read. */
  biggestMover: { label: string; from: number; to: number } | null
  /** Lessons this child passed inside the month. */
  lessonsPassed: number
  /** Stages stamped inside the month. */
  stagesAwarded: number
}

/** Nothing happened, or nothing could be read. Same shape either way. */
export const EMPTY_PROGRESS: MonthProgress = {
  tracked: 0, moved: 0, rested: 0, biggestMover: null, lessonsPassed: 0, stagesAwarded: 0,
}

export function progressWorthSending(p: MonthProgress): boolean {
  return p.tracked > 0 || p.moved > 0 || p.rested > 0 || p.lessonsPassed > 0 || p.stagesAwarded > 0
}

/**
 * One child's month.
 *
 * Every read is allowed to fail on its own. This runs inside a cron that also
 * sends the email, and a missing column on one of five queries must not cost a
 * family their whole review: the block simply says less.
 */
export async function buildMonthProgress(
  supabase: SupabaseClient,
  userId: string,
  childId: string,
  monthStart: Date,
  monthEnd: Date,
): Promise<MonthProgress> {
  const from = monthStart.toISOString()
  const to = monthEnd.toISOString()

  const [concernsRead, lessonsRead, stagesRead] = await Promise.all([
    supabase.from('concerns').select('id, label, status').eq('user_id', userId).eq('child_id', childId),
    supabase.from('lesson_completions').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('child_id', childId).eq('passed', true)
      .gte('completed_at', from).lt('completed_at', to),
    supabase.from('stage_passports').select('id', { count: 'exact', head: true })
      .eq('child_id', childId).gte('awarded_at', from).lt('awarded_at', to),
  ])

  const concerns = ((concernsRead.data ?? []) as { id: string; label: string; status: string }[])
  const tracked = concerns.filter(c => c.status === 'open' || c.status === 'improving').length

  let moved = 0
  let rested = 0
  let biggestMover: MonthProgress['biggestMover'] = null

  if (concerns.length > 0) {
    const ids = concerns.map(c => c.id)
    // Every scored event up to the end of the month, newest first. The ones
    // BEFORE the month give the starting band, which is the only honest thing
    // to measure against: a worry first asked about on the 20th did not
    // improve from zero, it simply had not been asked yet.
    const { data: events } = await supabase
      .from('concern_events')
      .select('concern_id, score, event, created_at')
      .in('concern_id', ids)
      .lt('created_at', to)
      .order('created_at', { ascending: false })

    const rows = ((events ?? []) as { concern_id: string; score: number | null; event: string | null; created_at: string }[])
    const labelById = new Map(concerns.map(c => [c.id, c.label]))

    for (const id of ids) {
      const mine = rows.filter(r => r.concern_id === id)
      const scored = mine.filter(r => r.score != null)
      const endOfMonth = scored.find(r => r.created_at < to)
      const startOfMonth = scored.find(r => r.created_at < from)
      // Resting is the top band reached inside the month, read off the events
      // rather than off the row's status, because a row resolved in March
      // must not be reported again every month for ever.
      if (mine.some(r => r.created_at >= from && (r.event === 'resolved' || (r.score ?? 0) >= TOP_BAND))) rested += 1
      if (!endOfMonth || endOfMonth.created_at < from) continue
      const to_ = bandOf(endOfMonth.score as number)
      const from_ = startOfMonth ? bandOf(startOfMonth.score as number) : null
      if (from_ == null || to_ <= from_) continue
      moved += 1
      if (!biggestMover || to_ - from_ > biggestMover.to - biggestMover.from) {
        biggestMover = { label: labelById.get(id) ?? 'one of them', from: from_, to: to_ }
      }
    }
  }

  return {
    tracked,
    moved,
    rested,
    biggestMover,
    lessonsPassed: lessonsRead.count ?? 0,
    stagesAwarded: stagesRead.count ?? 0,
  }
}
