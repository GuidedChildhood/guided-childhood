import type { SupabaseClient } from '@supabase/supabase-js'
import { pickDay, dayComplete, ukToday, STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { grantDayMinutes, MINUTES_PER_COMPLETED_DAY } from '@/lib/quests/holiday-daily'
import { sendPush } from '@/lib/push/send'

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
/**
 * Has this child already had a lesson day this week?
 *
 * Justin: lessons are "just a once a week ask". A lesson is fifteen minutes of
 * real work and the only step of the five that is, so drawing it daily turns
 * the list from a habit into homework and the streak into something a child
 * stops trying for. Once a week it is the interesting one; every day it is the
 * reason they stop opening the app.
 *
 * Counts the step being SET for a day, not passed. A child who was offered a
 * lesson on Monday and skipped it has had their lesson day: offering it again
 * on Tuesday is the nagging this rule exists to prevent.
 *
 * Monday start, matching the star week the rest of the app runs on. Fails open,
 * because a lookup that cannot answer should cost a child a slightly repetitive
 * week, never a day they are unable to finish.
 */
async function lessonAlreadyThisWeek(admin: Admin, childId: string, day: string): Promise<boolean> {
  try {
    const d = new Date(`${day}T12:00:00Z`)
    // getUTCDay is 0 on Sunday, which belongs to the week that began six days
    // earlier rather than to the one starting tomorrow.
    const back = (d.getUTCDay() + 6) % 7
    d.setUTCDate(d.getUTCDate() - back)
    const weekStart = d.toISOString().slice(0, 10)

    const { data, error } = await admin
      .from('kid_days').select('steps')
      .eq('child_id', childId).gte('day', weekStart).lt('day', day)
    if (error || !data) return false
    return data.some(r => Array.isArray(r.steps) && (r.steps as string[]).includes('lesson'))
  } catch {
    return false
  }
}

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

  // Only ever narrows what the caller already allowed: a caller saying there is
  // no lesson left in the stage still wins.
  const weekly = { ...available }
  if (weekly.lesson !== false && await lessonAlreadyThisWeek(admin, childId, day)) {
    weekly.lesson = false
  }
  const steps = pickDay(childId, day, weekly)
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

/**
 * Tell the parent their child finished the whole day, and what "the whole day"
 * actually was.
 *
 * Justin: when all jobs are done it should send "a child completion breakdown
 * to parent that it's done, and a note of homework done ... as they wrote it,
 * as we will match it with what is required another time".
 *
 * A bare "Teo finished his day" is a notification a parent learns to ignore,
 * because it says nothing they can act on or ask about at tea. The five steps
 * named, and the homework in the child's own words, is a thing to talk about.
 *
 * The note goes VERBATIM. Not summarised, not tidied. The whole point is that
 * it can be held against what the school actually set, and a rewrite would
 * quietly destroy the only evidence of what the child understood the homework
 * to be. Trimmed for the notification only; the full text stays in
 * kid_homework_notes either way.
 *
 * Best effort by contract, and called after the day is already saved. A child
 * who has just finished five things must never see a failure about a push to
 * somebody else's phone.
 */
async function notifyParentDayComplete(
  admin: Admin,
  userId: string,
  childId: string,
  day: string,
  steps: StepKey[],
): Promise<void> {
  try {
    const [{ data: child }, { data: homework }] = await Promise.all([
      admin.from('children').select('name').eq('id', childId).maybeSingle(),
      admin.from('kid_homework_notes').select('note').eq('child_id', childId).eq('day', day).maybeSingle(),
    ])
    const name = (child as { name?: string } | null)?.name ?? 'Your child'
    const breakdown = steps.map(k => STEPS[k]?.label ?? k).join(', ')

    const note = ((homework as { note?: string } | null)?.note ?? '').trim()
    const clipped = note.length > 140 ? `${note.slice(0, 137)}...` : note
    const body = note
      ? `${breakdown}. Homework, in their words: "${clipped}"`
      : `${breakdown}.`

    await sendPush({
      userId,
      title: `${name} finished all five today 🌟`,
      body,
      url: '/dashboard/quests',
    })
  } catch (err) {
    console.error('five a day: parent completion notice failed:', err)
  }
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
  if (justCompleted) {
    await grantDayMinutes(admin, userId, childId, day)
    await notifyParentDayComplete(admin, userId, childId, day, steps)
  }

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
