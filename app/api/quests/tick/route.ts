import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'

// The kid side tick. No account, no session: the kid link token is the
// auth, exactly like the school letterbox. A tick lands as pending, the
// parent's phone gets a nudge, approval releases the stars.

// The kid app polls this to see the grown up's answer land without a refresh:
// today's tick status for every quest, keyed by quest id. Token is the auth.
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token') ?? ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const supabase = createAdminClient()
  const { data: link } = await supabase.from('kid_links').select('child_id').eq('token', token).maybeSingle()
  const childId = (link as { child_id?: string } | null)?.child_id
  if (!childId) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  const today = new Date().toISOString().slice(0, 10)
  const { data: rows } = await supabase
    .from('quest_ticks').select('quest_id, status').eq('child_id', childId).eq('tick_date', today)
  const ticks: Record<string, string> = {}
  for (const r of rows ?? []) ticks[r.quest_id as string] = r.status as string
  return NextResponse.json({ ticks })
}

export async function POST(req: NextRequest) {
  const { token, quest_id, untick } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || !quest_id) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // The quest must belong to the same family and be active
  const { data: quest } = await supabase
    .from('family_quests')
    .select('id, title, stars, child_id, user_id, active')
    .eq('id', quest_id)
    .eq('user_id', link.user_id)
    .eq('active', true)
    .maybeSingle()
  if (!quest) return NextResponse.json({ error: 'unknown quest' }, { status: 404 })

  const today = new Date().toISOString().slice(0, 10)

  if (untick) {
    // A kid can take back a pending tick, never an approved one, and ONLY
    // THEIR OWN.
    //
    // The child_id filter is new and it was data loss without it. On a shared
    // job the delete matched by quest and date alone, so Alma changing her mind
    // deleted Teo's pending tick as well: his work vanished from the parent's
    // approval list and he was never told. He had done the job.
    //
    // Migration 206 is what makes their two ticks separate rows in the first
    // place. Before it there was only ever one row to delete, which is why this
    // read as correct for as long as it did.
    await supabase.from('quest_ticks')
      .delete()
      .eq('quest_id', quest.id)
      .eq('child_id', link.child_id)
      .eq('tick_date', today)
      .eq('status', 'pending')
    await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)
    return NextResponse.json({ ok: true, status: null })
  }

  const { error } = await supabase.from('quest_ticks').insert({
    quest_id: quest.id,
    user_id: link.user_id,
    child_id: link.child_id,
    tick_date: today,
    status: 'pending',
    ticked_by: 'child',
  })
  // Unique (quest_id, child_id, tick_date) since migration 206: the SAME child
  // tapping twice is fine, not an error. It used to be (quest_id, tick_date),
  // so this same line silently swallowed a second CHILD's tick on a shared job
  // and told them it had worked.
  if (error && !error.message.includes('duplicate')) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  // Nudge the parent's phone, straight to the decision.
  //
  // This used to land on /dashboard/quests, the whole quests page, so a parent
  // tapping "a quest is ready for your ok" arrived at a menu and had to go
  // looking for the thing they had just been told about. Justin: "when we click
  // on notifications it should, to approve, take straight to approve page not
  // quests general menu."
  //
  // /dashboard/quests/manage leads with Waiting on you, so the tap lands on the
  // Done button. Every push that needs a DECISION from a parent now points
  // here. The ones that are only news (a timer started, a goal redeemed) still
  // go to the quests page, because there is nothing to decide.
  try {
    // WHOSE tick this is, on the notification itself. Justin, 19 August 2026:
    // "pushes have the child's name so the parent knows which reminder." With
    // two children, "a quest is ready for your ok" made a parent open the app
    // to find out who they were saying yes to.
    const { data: whoRow } = await supabase
      .from('children').select('name').eq('id', link.child_id).maybeSingle()
    const who = whoRow?.name && whoRow.name !== 'Your child' ? whoRow.name : null
    await sendPush({
        userId: link.user_id,
        title: who ? `${who} ticked off a job` : 'A quest is ready for your ok',
        body: `${quest.title}${who ? `, waiting for your ok.` : ' was just ticked off.'} One tap to approve and the stars land.`,
        url: '/dashboard/quests/manage',
      })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, status: 'pending' })
}
