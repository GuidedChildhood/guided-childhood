import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { STAR_MINUTES } from '@/lib/quests/templates'

// Parent approval: the one tap that lands the stars. Approve or reject a
// pending tick; parents can also tick on the child's behalf (the printed
// sheet flow) which lands directly approved. On approval the child's own
// device gets the news: the grown up said yes, and the stars have become
// real minutes of screen time to use.

// The child hears the yes on their own phone: the task is confirmed and
// the stars are now minutes to spend. Best effort, silent if their phone
// is not set up (the quest page shows the same on next open).
async function tellChildConfirmed(userId: string, childId: string, title: string, stars: number) {
  const minutes = stars * STAR_MINUTES
  await pushToChild(
    createAdminClient(), userId, childId,
    'Your grown up said yes! ✅',
    `"${title}" is confirmed. You earned ${stars} star${stars === 1 ? '' : 's'}, that is ${minutes} minutes of device time to use. Nice one!`
  )
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { tick_id, decision, quest_id } = await req.json()

  // Parent ticks directly from the dashboard (printed sheet flow)
  if (quest_id && !tick_id) {
    const today = new Date().toISOString().slice(0, 10)
    const { data: quest } = await supabase
      .from('family_quests').select('id, child_id, title, stars').eq('id', quest_id).eq('user_id', user.id).maybeSingle()
    if (!quest) return NextResponse.json({ error: 'unknown quest' }, { status: 404 })
    // If the child already ticked it today, approve THAT row so their pending
    // tick clears, instead of inserting a second one that leaves the first
    // sitting in the parent's notifications as still waiting. Only insert a
    // fresh approved tick when there was nothing pending to approve.
    const { data: promoted } = await supabase.from('quest_ticks')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('quest_id', quest.id).eq('tick_date', today).eq('user_id', user.id).neq('status', 'approved')
      .select('id')
    if (!promoted || promoted.length === 0) {
      const { error } = await supabase.from('quest_ticks').insert({
        quest_id: quest.id, user_id: user.id, child_id: quest.child_id,
        tick_date: today, status: 'approved', ticked_by: 'parent',
        approved_at: new Date().toISOString(),
      })
      if (error && !error.message.includes('duplicate')) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }
    if (quest.child_id) await tellChildConfirmed(user.id, quest.child_id, quest.title, quest.stars ?? 1)
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

  // Tell the child their tick was confirmed, with the minutes it earned.
  if (decision === 'approve') {
    const { data: tick } = await supabase
      .from('quest_ticks').select('quest_id, child_id').eq('id', tick_id).eq('user_id', user.id).maybeSingle()
    if (tick?.child_id && tick.quest_id) {
      const { data: quest } = await supabase
        .from('family_quests').select('title, stars').eq('id', tick.quest_id).maybeSingle()
      if (quest) await tellChildConfirmed(user.id, tick.child_id, quest.title, quest.stars ?? 1)
    }
  }
  return NextResponse.json({ ok: true })
}
