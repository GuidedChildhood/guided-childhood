import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface DailyStreak {
  /** Consecutive completed days ending today or yesterday. 0 means no live streak. */
  count: number
  /** True when today's daily session is already completed. */
  aliveToday: boolean
}

function dayString(offsetDays: number): string {
  return new Date(Date.now() - offsetDays * 86400000).toISOString().slice(0, 10)
}

// The current daily streak, computed from completed daily_sessions rows.
// A streak is alive when today's session is done. If the chain ends on
// yesterday the streak still stands but is at risk: the UI shows it grey
// with a nudge to keep it alive today. Anything older is a dead streak
// and counts as zero.
export async function getDailyStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<DailyStreak> {
  const { data } = await supabase
    .from('daily_sessions')
    .select('session_date')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('session_date', { ascending: false })
    .limit(366)

  const days = new Set((data ?? []).map(d => d.session_date as string))

  const aliveToday = days.has(dayString(0))
  if (!aliveToday && !days.has(dayString(1))) return { count: 0, aliveToday: false }

  let count = 0
  let offset = aliveToday ? 0 : 1
  while (days.has(dayString(offset))) {
    count++
    offset++
  }
  return { count, aliveToday }
}
