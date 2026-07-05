import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Parent approval: the one tap that lands the stars. Approve or reject a
// pending tick; parents can also tick on the child's behalf (the printed
// sheet flow) which lands directly approved.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { tick_id, decision, quest_id } = await req.json()

  // Parent ticks directly from the dashboard (printed sheet flow)
  if (quest_id && !tick_id) {
    const today = new Date().toISOString().slice(0, 10)
    const { data: quest } = await supabase
      .from('family_quests').select('id, child_id').eq('id', quest_id).eq('user_id', user.id).maybeSingle()
    if (!quest) return NextResponse.json({ error: 'unknown quest' }, { status: 404 })
    const { error } = await supabase.from('quest_ticks').insert({
      quest_id: quest.id, user_id: user.id, child_id: quest.child_id,
      tick_date: today, status: 'approved', ticked_by: 'parent',
      approved_at: new Date().toISOString(),
    })
    if (error && !error.message.includes('duplicate')) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (error) {
      // Already ticked today: approve the existing one instead
      await supabase.from('quest_ticks')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('quest_id', quest.id).eq('tick_date', today).eq('user_id', user.id)
    }
    return NextResponse.json({ ok: true })
  }

  if (!tick_id || !['approve', 'reject'].includes(decision)) {
    return NextResponse.json({ error: 'tick_id and decision required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('quest_ticks')
    .update({
      status: decision === 'approve' ? 'approved' : 'rejected',
      approved_at: decision === 'approve' ? new Date().toISOString() : null,
    })
    .eq('id', tick_id)
    .eq('user_id', user.id)
    .eq('status', 'pending')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
