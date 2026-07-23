// The jobs streak, the strict one. A day counts only when every recurring job
// a parent set for that day was done by the child and confirmed on time, which
// here means an approved tick dated that same day (a job done late lands on a
// later date, so the missed day never fills). Five such days in a row is a real
// milestone. This is deliberately separate from getDailyStreak, which is the
// generous "showing up" streak that feeds the passport blend; this one is only
// about jobs done on time and it is what earns the gift and the passport stamp.
//
// A day with no recurring job due is neutral: it neither advances nor breaks the
// run, so a quiet day never punishes a family. Only a real miss, a day that had
// jobs due and did not finish them, resets the run to zero. Today is never a
// miss, because the day is not over yet.

import { questDueToday } from '@/lib/quests/due'

export interface StreakQuest {
  id: string
  schedule: string
  schedule_days: number[] | null
  created_at?: string | null
}

export interface StreakTick {
  quest_id: string
  tick_date: string // 'YYYY-MM-DD'
  status: string
}

const RECURRING = new Set(['daily', 'weekdays', 'weekend'])

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

// A routine repeats; a one off (schedule 'once') does not, so it never gates the
// daily streak. Named days always mean a routine.
function isRecurring(q: StreakQuest): boolean {
  if (q.schedule_days && q.schedule_days.length > 0) return true
  return RECURRING.has(q.schedule)
}

type DayClass = 'good' | 'miss' | 'neutral'

export interface JobsStreak {
  streakDays: number
  startedOn: string | null
  todayGood: boolean
}

// Walk back day by day from today, counting good days, skipping neutral ones,
// and stopping at the first real miss on a finished day.
export function computeJobsStreak(
  quests: StreakQuest[],
  ticks: StreakTick[],
  today: Date = new Date(),
): JobsStreak {
  const routines = quests.filter(isRecurring)
  // Approved ticks indexed by 'date|quest_id' for a same day, on time match.
  const approved = new Set<string>()
  for (const t of ticks) {
    if (t.status === 'approved') approved.add(`${t.tick_date}|${t.quest_id}`)
  }

  const classify = (d: Date): DayClass => {
    const day = ymd(d)
    const dueToday = routines.filter(q => {
      // A job only counts from the day it existed, never retroactively.
      if (q.created_at && q.created_at.slice(0, 10) > day) return false
      return questDueToday(q.schedule, q.schedule_days ?? null, d)
    })
    if (dueToday.length === 0) return 'neutral'
    const allDone = dueToday.every(q => approved.has(`${day}|${q.id}`))
    return allDone ? 'good' : 'miss'
  }

  let streakDays = 0
  let startedOn: string | null = null
  let todayGood = false

  for (let i = 0; i < 400; i++) {
    const d = addDays(today, -i)
    const cls = classify(d)
    if (i === 0) todayGood = cls === 'good'
    if (cls === 'neutral') continue
    if (cls === 'good') {
      streakDays++
      startedOn = ymd(d)
      continue
    }
    // A miss. Today is never a break (its jobs are still in play); a past miss
    // ends the run.
    if (i === 0) continue
    break
  }

  return { streakDays, startedOn, todayGood }
}

// The milestone length: a gift every five good days in a row.
export const STREAK_TARGET = 5

// Today at a glance, for the parent greeting: on_track when every job due today
// is approved (or nothing is due, a rest day is not behind), pending when a job
// due today is still open, none when no recurring jobs are set at all.
export function jobsTodayStatus(
  quests: StreakQuest[],
  ticks: StreakTick[],
  today: Date = new Date(),
): 'on_track' | 'pending' | 'none' {
  const routines = quests.filter(isRecurring)
  if (routines.length === 0) return 'none'
  const day = ymd(today)
  const due = routines.filter(q => {
    if (q.created_at && q.created_at.slice(0, 10) > day) return false
    return questDueToday(q.schedule, q.schedule_days ?? null, today)
  })
  if (due.length === 0) return 'on_track'
  const approved = new Set(
    ticks.filter(t => t.status === 'approved' && t.tick_date === day).map(t => t.quest_id),
  )
  return due.every(q => approved.has(q.id)) ? 'on_track' : 'pending'
}

// ── Server side: record a completed milestone ──
// Called right after a parent confirms a job. Works out the strict streak and,
// when today has just landed a fresh multiple of five good days, records the
// milestone once (idempotent on child and day), rings the parent bell, saves a
// brain note for DiGi, and credits the passport. Everything is best effort: a
// streak never blocks an approval, and a duplicate for the same day is ignored.

import type { SupabaseClient } from '@supabase/supabase-js'

export interface StreakChild {
  id: string
  name: string | null
  stage_id: string | null
}

export async function recordJobsStreak(
  supabase: SupabaseClient,
  userId: string,
  child: StreakChild,
  today: Date = new Date(),
): Promise<{ id: string; streakDays: number } | null> {
  const { data: quests } = await supabase
    .from('family_quests')
    .select('id, schedule, schedule_days, created_at')
    .eq('user_id', userId)
    .eq('child_id', child.id)
    .eq('active', true)
  if (!quests || quests.length === 0) return null

  const since = ymd(addDays(today, -60))
  const { data: ticks } = await supabase
    .from('quest_ticks')
    .select('quest_id, tick_date, status')
    .eq('user_id', userId)
    .eq('child_id', child.id)
    .gte('tick_date', since)

  const { streakDays, startedOn, todayGood } = computeJobsStreak(
    quests as StreakQuest[],
    (ticks ?? []) as StreakTick[],
    today,
  )
  if (!todayGood || streakDays === 0 || streakDays % STREAK_TARGET !== 0) return null

  const completedOn = ymd(today)
  const name = child.name && child.name !== 'Your child' ? child.name : 'Your child'

  const { data: inserted, error } = await supabase
    .from('job_streaks')
    .insert({
      user_id: userId,
      child_id: child.id,
      stage_id: child.stage_id ?? 'foundation',
      length: streakDays,
      started_on: startedOn ?? completedOn,
      completed_on: completedOn,
      brain_note: `${name} kept a ${streakDays} day run of every job done on time, finishing ${completedOn}.`,
    })
    .select('id')
    .maybeSingle()
  // A duplicate for today (unique on child and completed day) simply means it is
  // already recorded, so there is nothing more to do.
  if (error || !inserted) return null

  // The gentle parent alert on the bell. The reward itself is chosen from the
  // job_streaks queue on the Quests page, so no link is needed on the prompt.
  await supabase.from('digi_prompts').insert({
    user_id: userId,
    child_id: child.id,
    kind: 'celebration',
    title: `${name} kept a ${streakDays} day jobs streak`,
    body: `Every job done on time for ${streakDays} days running. Mark it with a reward: a printable, some device time, or a lesson.`,
    reason: 'jobs_streak',
    status: 'pending',
  })

  // Brain memory, so DiGi can refer to it later.
  await supabase.from('digi_memory').insert({
    user_id: userId,
    child_id: child.id,
    kind: 'win',
    source: 'system',
    content: `${name} completed a ${streakDays} day streak of every job done on time, to ${completedOn}. The jobs and stars routine is landing well for this family.`,
  })

  // Credit the passport: streak_weeks feeds the passport's streak reading.
  const { data: current } = await supabase
    .from('children')
    .select('streak_weeks')
    .eq('id', child.id)
    .maybeSingle()
  const weeks = ((current?.streak_weeks as number | null) ?? 0) + 1
  await supabase.from('children').update({ streak_weeks: weeks }).eq('id', child.id)

  return { id: inserted.id as string, streakDays }
}
