import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { londonToday } from '@/lib/pathway/today'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // London, not UTC. daily-tasks.ts reads this row back with londonToday(), and
  // through British Summer Time a UTC date rolls over an hour early, so a deck
  // finished at half past midnight was filed under yesterday and today's rung
  // stayed lit. Same fault as the feedback route beside it.
  const today = londonToday()

  await supabase
    .from('daily_sessions')
    .upsert(
      { user_id: user.id, session_date: today, cards_completed: 5, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,session_date' }
    )

  // Increment streak on children record for primary child
  const { data: child } = await supabase
    .from('children')
    .select('id, streak_weeks, actions_this_week')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  if (child) {
    await supabase
      .from('children')
      .update({ actions_this_week: (child.actions_this_week ?? 0) + 1 })
      .eq('id', child.id)
  }

  return NextResponse.json({ ok: true })
}
