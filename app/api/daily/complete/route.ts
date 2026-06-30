import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]

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
