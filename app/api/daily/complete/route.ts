import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { londonToday } from '@/lib/pathway/today'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // WHOSE DAY THIS WAS. Migration 210.
  //
  // daily_sessions was one row per FAMILY per day, so finishing Today with Teo
  // silently ended Olgie's day too: she showed "Done for today" before anybody
  // had done anything with her. Justin hit it on 18 August.
  //
  // Checked against the account rather than trusted, and null when nothing is
  // named, which is the old behaviour and what every existing row means.
  const body = await req.json().catch(() => ({} as { child_id?: string; cards?: number }))

  // ── A CARD DONE IS A CARD DONE, NOT ONLY THE WHOLE SET ────────────────────
  //
  // Justin, 11 September 2026: "just did moment cards on check in pathway to
  // do today but did not update... check that when we do a moment or card it
  // says done on pathway."
  //
  // This route only ever ran from the LAST card of the deck, so a parent who
  // worked two cards and put the phone down had genuinely done today's moment
  // and the rung still said no. The deck is the only moment surface with that
  // hole: opening a card in the library writes its own row through
  // /api/moments/complete on the first tap.
  //
  // So the deck reports progress. A partial post records the cards and nothing
  // else: no completed_at, because the day is not finished, and no bump to the
  // week's actions, because the action is the deck and counting it twice would
  // inflate every family's week. The final post is unchanged.
  const asked = Number(body.cards)
  const cards = Number.isFinite(asked) ? Math.max(1, Math.min(5, Math.round(asked))) : 5
  const partial = cards < 5
  let childId: string | null = null
  if (typeof body.child_id === 'string' && body.child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', body.child_id).eq('parent_id', user.id).maybeSingle()
    childId = owned?.id ?? null
  }

  // London, not UTC. daily-tasks.ts reads this row back with londonToday(), and
  // through British Summer Time a UTC date rolls over an hour early, so a deck
  // finished at half past midnight was filed under yesterday and today's rung
  // stayed lit. Same fault as the feedback route beside it.
  const today = londonToday()

  // Never counts DOWN. A partial post arriving after the full one (a slow
  // network, a second tab) must not turn five cards back into one, so the
  // existing count is read and the higher of the two is written.
  const existing = await supabase
    .from('daily_sessions')
    .select('id, cards_completed, child_id')
    .eq('user_id', user.id).eq('session_date', today).limit(10)
  const held = (existing.data ?? []) as { id: string; cards_completed: number | null; child_id: string | null }[]
  const mine = held.find(r => r.child_id === childId) ?? held.find(r => r.child_id === null)
  const count = Math.max(cards, mine?.cards_completed ?? 0)

  const row: Record<string, unknown> = { user_id: user.id, session_date: today, cards_completed: count }
  if (!partial) row.completed_at = new Date().toISOString()
  const { error: upsertError } = await supabase
    .from('daily_sessions')
    .upsert({ ...row, child_id: childId }, { onConflict: 'user_id,child_id,session_date' })
  // A database that has not run 210 yet has neither the column nor the new
  // constraint, so the old shape is retried rather than costing a parent the
  // day they just finished.
  if (upsertError) {
    await supabase.from('daily_sessions').upsert(row, { onConflict: 'user_id,session_date' })
  }

  // The week's actions belong to the finished deck, so a partial stops here.
  if (partial) return NextResponse.json({ ok: true, cards: count })

  // The week's actions belong to the child the parent was working with, not to
  // whoever happens to be flagged primary. Same fault, one line down.
  const childQ = supabase
    .from('children')
    .select('id, streak_weeks, actions_this_week')
    .eq('parent_id', user.id)
  const { data: child } = childId
    ? await childQ.eq('id', childId).maybeSingle()
    : await childQ.eq('is_primary', true).maybeSingle()

  if (child) {
    await supabase
      .from('children')
      .update({ actions_this_week: (child.actions_this_week ?? 0) + 1 })
      .eq('id', child.id)
  }

  return NextResponse.json({ ok: true })
}
