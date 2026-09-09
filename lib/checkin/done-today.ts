import { londonNow } from '@/lib/time/london'
import type { SupabaseClient } from '@supabase/supabase-js'
import { restingConcernIds, TOP_BAND } from '@/lib/concerns/resting'
import { readScores, type ScoredEvent } from '@/lib/concerns/scores'

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
  // ── "TODAY" IS THE FAMILY'S TODAY, NOT THE SERVER'S ────────────────────────
  //
  // Justin, 9 September 2026: "check that this refreshes each day."
  //
  // It did not, quite. This was `new Date().toISOString().split('T')[0]`, which
  // is the date in UTC, and the server runs in UTC while every family using
  // this product is in the UK. From late March to late October the two are an
  // hour apart, and that hour lands in exactly the wrong place:
  //
  //   A check in done at 00:30 on Tuesday is stored 23:30 Monday UTC, so it
  //   counts as MONDAY. The parent is asked the same questions again a few
  //   hours later.
  //
  //   Between midnight and 1am on Tuesday the server still reads Monday, so a
  //   parent who did Monday's check in and looks after midnight is told they
  //   are done for a day that has already started.
  //
  // lib/time/london was written for this and six other files already use it.
  // The check in, which is the one thing in the product that has to know what
  // day it is, was the one that did not.
  const today = londonNow().dateStr
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

    const { data: scores } = await supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', live.map(r => r.id))
      .not('score', 'is', null)
      .order('created_at', { ascending: false })
      .limit(400)
    const read = readScores((scores ?? []) as ScoredEvent[], TOP_BAND)
    const resting = restingConcernIds(live, read.topRun, read.lastAt)

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
