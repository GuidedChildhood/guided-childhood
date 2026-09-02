import type { SupabaseClient } from '@supabase/supabase-js'
import { restingConcernIds } from '@/lib/concerns/resting'

// Which children have been checked in on today.
//
// Justin, 2 September 2026: "when we do check in for first time when we do
// each child can they have a green tick go by their name at top indicating
// done." The child switcher wears the tick; this is the one place that
// decides who gets it, so the rail, the check in page and the home rung can
// never disagree about whether a child is done.
//
// Done means: every worry of theirs that is still live and not resting was
// checked today, and at least one was. The resting rule is the same one the
// check in itself uses (lib/concerns/resting): a worry scored top and not
// flagged since is not asked, so it must not hold a tick back either. A child
// with no worries yet is not done, they are simply not started.
//
// Two reads, both small, and the layout runs them inside a Suspense boundary
// so no page waits on them.

export async function checkedInToday(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const today = new Date().toISOString().split('T')[0]
  const done = new Set<string>()
  try {
    const { data: rows } = await supabase
      .from('concerns')
      .select('id, child_id, last_flagged_at, last_checked_at')
      .eq('user_id', userId)
      .in('status', ['open', 'improving'])
      .limit(200)
    const live = ((rows ?? []) as { id: string; child_id: string | null; last_flagged_at: string; last_checked_at: string | null }[])
      .filter(r => r.child_id)
    if (live.length === 0) return done

    const lastScore = new Map<string, number>()
    const lastScoreAt = new Map<string, string>()
    const { data: scores } = await supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', live.map(r => r.id))
      .not('score', 'is', null)
      .order('created_at', { ascending: false })
      .limit(400)
    for (const s of (scores ?? []) as { concern_id: string; score: number | null; created_at: string }[]) {
      if (typeof s.score === 'number' && !lastScore.has(s.concern_id)) {
        lastScore.set(s.concern_id, s.score)
        lastScoreAt.set(s.concern_id, s.created_at)
      }
    }
    const resting = restingConcernIds(live, lastScore, lastScoreAt)

    const byChild = new Map<string, { asked: number; checked: number }>()
    for (const r of live) {
      const id = r.child_id as string
      const t = byChild.get(id) ?? { asked: 0, checked: 0 }
      const checkedToday = !!r.last_checked_at && String(r.last_checked_at) >= today
      if (checkedToday) t.checked += 1
      if (!resting.has(r.id)) t.asked += checkedToday ? 0 : 1
      byChild.set(id, t)
    }
    for (const [id, t] of byChild) {
      if (t.checked > 0 && t.asked === 0) done.add(id)
    }
  } catch {
    /* the rail simply shows no ticks */
  }
  return done
}
