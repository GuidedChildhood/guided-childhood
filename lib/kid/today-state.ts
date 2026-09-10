import type { SupabaseClient } from '@supabase/supabase-js'
import { STEPS, dayComplete, ukToday, type StepKey } from '@/lib/kid/five-a-day'

// What is left today, read once, rendered twice.
//
// Justin, 10 September 2026, having agreed the daily sticker: both Homes should
// then show what is left today. The parent should not have to open the child's
// app to find out whether the day is going.
//
// ── WHY ONE FUNCTION AND NOT TWO READS ──────────────────────────────────────
//
// The audit called for exactly this (§18) and the reason is not tidiness. Two
// screens answering the same question from the same table is how they come to
// disagree: one counts a day complete on completed_at, the other on the length
// of done, and six weeks later a parent is looking at "4 of 5" while their child
// is looking at a finished day. That is not hypothetical here. The Moment and
// script rungs on the daily path both did it, both read a real column that meant
// something else, and both had to be fixed on 10 September.
//
// So there is one reading. Both apps render it. Neither recomputes it.

type Client = Pick<SupabaseClient, 'from'>

export type TodayState = {
  /** The London day this describes. */
  day: string
  /** The steps chosen for today, in the order they are shown. */
  steps: StepKey[]
  /** Which of them are done. Always a subset of steps. */
  done: StepKey[]
  /** How many are left. The number both Homes actually print. */
  left: number
  /** Is the day finished? The stored fact, not a recount. */
  complete: boolean
  /** Did today earn its sticker? */
  stickerToday: boolean
  /** How many daily stickers this child has ever earned. */
  stickersEver: number
  /** The labels of what is left, for a parent who wants to know what to ask. */
  leftLabels: string[]
}

const EMPTY = (day: string): TodayState => ({
  day, steps: [], done: [], left: 0, complete: false,
  stickerToday: false, stickersEver: 0, leftLabels: [],
})

/**
 * Today for one child, plus their sticker count.
 *
 * Fails soft to an empty day throughout. Both Homes render this, and a screen a
 * family opens every morning must never fall over because a count timed out.
 *
 * `complete` is the STORED completed_at, never a recount of done against steps.
 * A day that landed stays landed even if the step pool later changes what today
 * would have been, which is the same rule migration 134 wrote down and the
 * reason completed_at exists as its own column.
 */
export async function readTodayState(
  supabase: Client,
  childId: string | null,
  today?: string,
): Promise<TodayState> {
  const day = today ?? ukToday()
  if (!childId) return EMPTY(day)

  try {
    const [rowRes, countRes] = await Promise.all([
      supabase.from('kid_days')
        .select('steps, done, completed_at, sticker_awarded_at')
        .eq('child_id', childId).eq('day', day).maybeSingle(),
      supabase.from('kid_days')
        .select('id', { count: 'exact', head: true })
        .eq('child_id', childId).not('sticker_awarded_at', 'is', null),
    ])

    const row = (rowRes as { data?: {
      steps?: StepKey[] | null; done?: StepKey[] | null
      completed_at?: string | null; sticker_awarded_at?: string | null
    } | null }).data
    if (!row) return { ...EMPTY(day), stickersEver: (countRes as { count?: number | null }).count ?? 0 }

    const steps = (row.steps ?? []) as StepKey[]
    const done = (row.done ?? []) as StepKey[]
    const outstanding = steps.filter(s => !done.includes(s))

    return {
      day,
      steps,
      done,
      left: outstanding.length,
      complete: !!row.completed_at,
      stickerToday: !!row.sticker_awarded_at,
      stickersEver: (countRes as { count?: number | null }).count ?? 0,
      // The step's own label, so a parent reads "a lesson, time outside" rather
      // than "lesson, outside", which are keys and not words.
      leftLabels: outstanding.map(s => STEPS[s]?.label ?? s),
    }
  } catch {
    return EMPTY(day)
  }
}

/**
 * What is left today, in one sentence, for a grown up.
 *
 * Never a nag and never a count on its own. "Two things left today" is a score;
 * "Two left today: a lesson and time outside" is something a parent can act on
 * in the next four minutes, which is the whole difference.
 */
export function leftTodayLine(state: TodayState, childName: string | null): string {
  const who = childName ?? 'They'
  if (state.steps.length === 0) return `${who} has not opened today yet.`
  if (state.complete) return `${who} finished everything today.`
  const labels = state.leftLabels.map(l => l.toLowerCase())
  const list = labels.length === 1
    ? labels[0]
    : `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
  return `${state.left} left today: ${list}.`
}
