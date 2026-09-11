import { londonNow } from '@/lib/time/london'
import type { SupabaseClient } from '@supabase/supabase-js'

// Which children are DONE today, for the green tick by their name.
//
// ── WHAT THE TICK MEANS, AND WHAT IT USED TO MEAN ──────────────────────────
//
// Justin, 2 September 2026: "when we do check in for first time when we do
// each child can they have a green tick go by their name at top indicating
// done." So this file answered "has this child been checked in on today",
// reading the concerns ledger and honouring the resting rule.
//
// Justin, 10 September 2026, looking at his own home screen: "make sure that
// the done today, which i think its the 5 rungs on pathway green coins, then
// ticks by the side of their name on buttons for child name so clear todays
// is done." And on 11 September, deciding it: "one tick keeps the streak, the
// pathway earns the celebration."
//
// That is the whole answer. Three things in the product claimed to know when
// a day was done and all three said something different: the streak counted
// any showing up, the celebration fired on the one lead rung, and this tick
// meant the check in. A parent who answered two star questions was told, by a
// green tick and by a full screen "Today is made", that they had finished,
// while the road behind both still had four rungs open on it.
//
// So the tick reads the road now. daily_sessions.all_done_at (migration 287)
// is stamped when every rung on that child's road goes green, and nothing
// else writes it. completed_at, the one tick that keeps the streak, is
// deliberately NOT read here: a ten minute day still counts, it is simply not
// finished, and the tick is the word for finished.
//
// The old concerns read went with it rather than sitting here unused. It is
// in git if the check in ever wants its own mark, but two live definitions of
// done is how this got confusing in the first place.
//
// Fails soft to an empty set. A rail with no ticks is a much smaller wrong
// than a dashboard that will not render.
export async function pathwayDoneToday(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  // The family's today, not the server's. The server runs in UTC and every
  // family using this is in the UK, so from late March to late October a
  // finish at half past midnight would land on yesterday.
  const today = londonNow().dateStr
  const done = new Set<string>()
  try {
    const { data: rows } = await supabase
      .from('daily_sessions')
      .select('child_id, all_done_at')
      .eq('user_id', userId)
      .eq('session_date', today)
      .not('all_done_at', 'is', null)
      .limit(20)
    for (const r of (rows ?? []) as { child_id: string | null }[]) {
      if (r.child_id) done.add(r.child_id)
    }
  } catch {
    /* the rail simply shows no ticks */
  }
  return done
}
