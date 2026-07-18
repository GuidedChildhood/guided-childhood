import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface DailyStreak {
  /** Consecutive meaningful days ending today or yesterday. 0 means no live streak. */
  count: number
  /** True when something meaningful already happened today. */
  aliveToday: boolean
  /** Total meaningful days shown up, ever climbing, never reset by a missed day. */
  total: number
}

function dayString(offsetDays: number): string {
  return new Date(Date.now() - offsetDays * 86400000).toISOString().slice(0, 10)
}

// A streak day is ANY meaningful showing up, never one specific surface:
// completing the daily practice, working a moment card, approving a
// quest tick, or answering the check in. A parent who rescued a bedtime
// with Help now and approved two quests has absolutely shown up, and the
// streak must never punish them for skipping one particular screen.
// Alive today keeps the flame lit; a chain ending yesterday stands but
// is at risk; older chains are dead.
export async function getDailyStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<DailyStreak> {
  const yearAgo = dayString(366)

  const [sessions, moments, ticks, feedback] = await Promise.all([
    supabase
      .from('daily_sessions')
      .select('session_date')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .gte('session_date', yearAgo)
      .limit(366),
    supabase
      .from('moment_completions')
      .select('completed_on')
      .eq('user_id', userId)
      .gte('completed_on', yearAgo)
      .limit(366),
    supabase
      .from('quest_ticks')
      .select('approved_at')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .not('approved_at', 'is', null)
      .gte('approved_at', yearAgo)
      .limit(500),
    supabase
      .from('digi_feedback')
      .select('feedback_date')
      .eq('user_id', userId)
      .not('parent_response', 'is', null)
      .gte('feedback_date', yearAgo)
      .limit(366),
  ])

  const days = new Set<string>()
  for (const r of sessions.data ?? []) days.add(String(r.session_date))
  for (const r of moments.data ?? []) days.add(String(r.completed_on))
  for (const r of ticks.data ?? []) days.add(String(r.approved_at).slice(0, 10))
  for (const r of feedback.data ?? []) days.add(String(r.feedback_date))

  const total = days.size
  const aliveToday = days.has(dayString(0))
  if (!aliveToday && !days.has(dayString(1))) return { count: 0, aliveToday: false, total }

  let count = 0
  let offset = aliveToday ? 0 : 1
  while (days.has(dayString(offset))) {
    count++
    offset++
  }
  return { count, aliveToday, total }
}
