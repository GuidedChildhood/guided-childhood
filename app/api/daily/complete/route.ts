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
  const body = await req.json().catch(() => ({} as { child_id?: string }))
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

  const row = { user_id: user.id, session_date: today, cards_completed: 5, completed_at: new Date().toISOString() }
  const { error: upsertError } = await supabase
    .from('daily_sessions')
    .upsert({ ...row, child_id: childId }, { onConflict: 'user_id,child_id,session_date' })
  // A database that has not run 210 yet has neither the column nor the new
  // constraint, so the old shape is retried rather than costing a parent the
  // day they just finished.
  if (upsertError) {
    await supabase.from('daily_sessions').upsert(row, { onConflict: 'user_id,session_date' })
  }

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
