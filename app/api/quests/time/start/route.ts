import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { isDeviceKey, minutesToStars, deviceLabel } from '@/lib/quests/device-time'
import { questDueToday } from '@/lib/quests/due'

// The child spends earned stars as device time. The link token is the auth,
// same trust model as ticking. Starting a session records the spend against
// the bank straight away (so the balance can never be spent twice) and sets
// the countdown both sides watch. The parent's phone gets a heads up.

export async function POST(req: NextRequest) {
  const { token, device, minutes } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (!isDeviceKey(device)) {
    return NextResponse.json({ error: 'bad device' }, { status: 400 })
  }
  const mins = Number(minutes)
  if (!Number.isFinite(mins) || mins < STAR_MINUTES || mins > 600 || mins % STAR_MINUTES !== 0) {
    return NextResponse.json({ error: 'bad minutes' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // Trust level decides how much the child can do alone: ask (needs the grown
  // up's yes first), watch (starts freely, parent gets the ping and countdown),
  // trusted (starts freely, lighter touch, no per session ping).
  const { data: childRow } = await supabase
    .from('children').select('name, device_trust').eq('id', link.child_id).maybeSingle()
  const trust = (childRow?.device_trust as string) ?? 'watch'
  const childName = childRow?.name ?? 'Your child'

  // Vital chores gate: any quest the parent flagged before screens, due today
  // and not yet approved, blocks the child from starting device time. The
  // parent still keeps the override from their own board.
  const gateToday = new Date().toISOString().slice(0, 10)
  const { data: gateQuests } = await supabase
    .from('family_quests')
    .select('id, title, schedule')
    .eq('user_id', link.user_id)
    .eq('active', true)
    .eq('blocks_screens', true)
    .or(`child_id.eq.${link.child_id},child_id.is.null`)
  const dueGate = (gateQuests ?? []).filter(q => questDueToday(q.schedule))
  if (dueGate.length > 0) {
    const { data: approvedToday } = await supabase
      .from('quest_ticks').select('quest_id')
      .eq('child_id', link.child_id).eq('status', 'approved').eq('tick_date', gateToday)
    const doneIds = new Set((approvedToday ?? []).map(t => t.quest_id))
    const blocking = dueGate.filter(q => !doneIds.has(q.id))
    if (blocking.length > 0) {
      return NextResponse.json({ error: 'chores first', blocking: blocking.map(q => q.title) }, { status: 400 })
    }
  }

  const stars = minutesToStars(mins)
  const [bank] = await getStarBanks(supabase, link.user_id, [link.child_id])
  if (!bank || bank.balance < stars) {
    return NextResponse.json({ error: 'not enough stars', balance: bank?.balance ?? 0 }, { status: 400 })
  }

  // Ask first: record the ask and nudge the parent, but do not start or spend.
  // The parent approves it from their screen time card, which starts the timer.
  if (trust === 'ask') {
    // Clear any earlier pending ask so one child never stacks a queue.
    await supabase.from('device_requests')
      .update({ status: 'declined' })
      .eq('child_id', link.child_id).eq('status', 'pending')
    await supabase.from('device_requests').insert({
      user_id: link.user_id, child_id: link.child_id, device, minutes: mins, status: 'pending',
    })
    try {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({
          userId: link.user_id,
          title: `${childName} is asking for screen time ⏳`,
          body: `${mins} minutes on the ${deviceLabel(device)}, that is ${stars} star${stars === 1 ? '' : 's'}. Tap to say yes on your board.`,
          url: '/dashboard/quests',
        }),
      })
    } catch { /* best effort */ }
    return NextResponse.json({ pending: true })
  }

  // One live session at a time: close any that is still open before the new
  // one starts, so two timers never run at once.
  await supabase.from('device_sessions')
    .update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('child_id', link.child_id).eq('status', 'active')

  // Record the spend now (the balance drops immediately) then open the
  // session that points back at it, so stopping early can trim it.
  const { data: spend, error: spendError } = await supabase.from('star_spends').insert({
    user_id: link.user_id, child_id: link.child_id, stars, minutes: mins,
    note: `Device time: ${deviceLabel(device)}`,
  }).select('id').single()
  if (spendError) return NextResponse.json({ error: spendError.message }, { status: 500 })

  const endsAt = new Date(Date.now() + mins * 60000).toISOString()
  const { data: session, error: sessionError } = await supabase.from('device_sessions').insert({
    user_id: link.user_id, child_id: link.child_id, device, minutes: mins, stars,
    spend_id: spend.id, ends_at: endsAt,
  }).select('id, device, minutes, stars, ends_at, started_at').single()
  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 })

  await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  // Tell the parent their child has started, best effort. A trusted child
  // starts with a lighter touch, so no per session ping; watch still pings.
  if (trust !== 'trusted') {
    try {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({
          userId: link.user_id,
          title: `${childName} started ${mins} minutes on the ${deviceLabel(device)} ⏱️`,
          body: `That is ${stars} star${stars === 1 ? '' : 's'} spent. The timer is running, you can watch it on the quests board.`,
          url: '/dashboard/quests',
        }),
      })
    } catch { /* push is best effort */ }
  }

  return NextResponse.json({ ok: true, session })
}
