import type { SupabaseClient } from '@supabase/supabase-js'
import { pickDay, dayComplete, ukToday, type StepKey } from '@/lib/kid/five-a-day'
import { grantDayMinutes, MINUTES_PER_COMPLETED_DAY } from '@/lib/quests/holiday-daily'

// Reading and ticking the five a day, in one place.
//
// This used to live inside /api/kid/day, which was fine while the only thing
// that could tick a step was the list itself. It is not fine any more, and the
// reason is the bug that made this file necessary.
//
// A step with an href renders as a plain link: it navigates and never calls
// mark(). So a step that sends the child somewhere can ONLY be completed if the
// page it lands on ticks it. `ask` had nothing on the far side that could, so
// no child had ever finished a day since the five a day shipped. `lesson`,
// `quiz` and `printable` were three more of exactly the same shape, found by
// the wiring check the day after.
//
// Fixing them means ticking from the route that already knows the child did the
// thing. Those routes need the WHOLE tick, not just the done list: the day has
// to be able to complete, completed_at has to be set, and the holiday minutes
// have to be banked. A second copy of that logic in three more files is how the
// two versions drift and a child stops getting paid on Tuesdays.
//
// So it moves here, once, and /api/kid/day becomes one of its callers.

type Admin = SupabaseClient

export interface DayRow {
  steps: StepKey[]
  done: StepKey[]
  completed_at: string | null
  streak_awarded: boolean
}

/**
 * Load today's row, creating it if this is the first look.
 *
 * The insert is upsert-on-conflict-do-nothing followed by a read, rather than
 * "check then insert". Two tabs opening at once is a real thing on a child's
 * phone, and the check-then-insert version races into a duplicate key error
 * that would show as a broken screen.
 */
export async function loadDay(
  admin: Admin,
  userId: string,
  childId: string,
  available?: Partial<Record<StepKey, boolean>>,
): Promise<{ day: string; row: DayRow }> {
  const day = ukToday()
  const { data: existing } = await admin
    .from('kid_days').select('steps, done, completed_at, streak_awarded')
    .eq('child_id', childId).eq('day', day).maybeSingle()
  if (existing) return { day, row: existing as DayRow }

  const steps = pickDay(childId, day, available)
  await admin.from('kid_days')
    .upsert({ user_id: userId, child_id: childId, day, steps, done: [] }, { onConflict: 'child_id,day', ignoreDuplicates: true })
  const { data: row } = await admin
    .from('kid_days').select('steps, done, completed_at, streak_awarded')
    .eq('child_id', childId).eq('day', day).maybeSingle()
  return { day, row: (row as DayRow) ?? { steps, done: [], completed_at: null, streak_awarded: false } }
}

/**
 * How many days in a row, ending today or yesterday.
 *
 * Ending YESTERDAY still counts, because a streak a child has not yet had the
 * chance to continue is not broken. Reading it as broken before the day is over
 * would show a child a zero every morning.
 *
 * Justin's call on a missed day: the run starts again and everything already
 * earned stays. There is no freeze to buy back, which is the pattern this
 * product exists to be the alternative to.
 */
export async function streakCount(admin: Admin, childId: string): Promise<number> {
  const { data } = await admin
    .from('kid_days').select('day')
    .eq('child_id', childId).not('completed_at', 'is', null)
    .order('day', { ascending: false }).limit(400)
  const days = new Set((data ?? []).map(r => String(r.day)))
  if (days.size === 0) return 0

  const stamp = (offset: number) => {
    const d = new Date(`${ukToday()}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() - offset)
    return d.toISOString().slice(0, 10)
  }
  // Start at today if today is done, else yesterday, else there is no live run.
  let cursor = days.has(stamp(0)) ? 0 : days.has(stamp(1)) ? 1 : -1
  if (cursor < 0) return 0
  let count = 0
  while (days.has(stamp(cursor))) { count++; cursor++ }
  return count
}

export interface MarkResult {
  ok: boolean
  /** Why it did not land, for the route that has to answer with a status. */
  reason?: 'not-part-of-today' | 'write-failed'
  message?: string
  day: string
  steps: StepKey[]
  done: StepKey[]
  complete: boolean
  /** True only on the transition, so a refresh never replays the takeover. */
  justCompleted: boolean
  holidayMinutes: number
}

/**
 * Tick one step of today, and everything that follows from it.
 *
 * Not marking is a normal outcome, not an error. A child can finish a lesson on
 * a day whose five did not include one, and the honest answer there is to write
 * nothing and say so. Every caller outside the route itself should ignore the
 * result entirely: none of them are ticking as their main job, and a child who
 * has just passed a quiz must never see a failure about a checklist.
 */
export async function markStep(
  admin: Admin,
  userId: string,
  childId: string,
  step: StepKey,
  available?: Partial<Record<StepKey, boolean>>,
): Promise<MarkResult> {
  const { day, row } = await loadDay(admin, userId, childId, available)
  const steps = row.steps as StepKey[]
  const base = { day, steps, done: row.done as StepKey[], complete: !!row.completed_at, justCompleted: false, holidayMinutes: 0 }

  // A step that is not part of today is not marked done. Without this a stale
  // tab from yesterday could complete a day it was never shown.
  if (!steps.includes(step)) return { ...base, ok: false, reason: 'not-part-of-today' }

  const done = Array.from(new Set([...(row.done as StepKey[]), step]))
  const complete = dayComplete(steps, done)
  // completed_at is only ever set, never cleared, so a day that landed stays
  // landed even if the pool later changes what today would have been.
  const patch: Record<string, unknown> = { done, updated_at: new Date().toISOString() }
  if (complete && !row.completed_at) patch.completed_at = new Date().toISOString()

  const { error } = await admin
    .from('kid_days').update(patch).eq('child_id', childId).eq('day', day)
  if (error) return { ...base, ok: false, reason: 'write-failed', message: error.message }

  // Five minutes of holiday time for finishing the day, on the transition only.
  // justCompleted is the same condition on purpose: the reward and the
  // celebration should be true together or not at all, so a child never sees
  // one without the other.
  const justCompleted = complete && !row.completed_at
  if (justCompleted) await grantDayMinutes(admin, userId, childId, day)

  return {
    ok: true,
    day,
    steps,
    done,
    complete,
    justCompleted,
    holidayMinutes: justCompleted ? MINUTES_PER_COMPLETED_DAY : 0,
  }
}

/**
 * Tick a step from a route whose real job was something else.
 *
 * The three callers are the moments a child provably did the thing: passing a
 * lesson, passing the quiz, sending a printable to their grown up. None of them
 * should fail, slow down or change their own answer because of a checklist, so
 * this swallows everything and never throws.
 */
export async function markStepQuietly(
  admin: Admin,
  userId: string,
  childId: string,
  step: StepKey,
): Promise<void> {
  try {
    await markStep(admin, userId, childId, step)
  } catch (err) {
    console.error(`five a day: quiet tick of "${step}" threw:`, err)
  }
}
