import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deviceLabel, type DeviceKey } from '@/lib/quests/device-time'
import { refundToHolidayBank } from '@/lib/quests/holiday-spend'
import { planTieredRefund } from '@/lib/quests/time-tiers'
import { sendPush } from '@/lib/push/send'

// The child stops their device time early, or their app calls this when the
// countdown hits zero. Either way the session closes and the recorded spend
// is trimmed back to the minutes actually used, so nothing earned is wasted
// when they hand the device back before the time is up. The parent is told the
// moment it happens, so their live timer stops with the child's rather than
// waiting on the next poll, and the used minutes land on the balance and stats.

export async function POST(req: NextRequest) {
  const { token, session_id } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  let query = supabase.from('device_sessions')
    .select('id, minutes, stars, spend_id, started_at, ends_at, device')
    .eq('child_id', link.child_id).eq('status', 'active')
  if (typeof session_id === 'string') query = query.eq('id', session_id)
  const { data: session } = await query.order('started_at', { ascending: false }).limit(1).maybeSingle()
  if (!session) return NextResponse.json({ ok: true, alreadyEnded: true })

  // Read separately and best effort, never in the select above. Migration 128
  // adds this column, and asking for a column that does not exist fails the
  // whole row read, which would stop every child in the world being able to end
  // a timer on a deploy that had not run it. Zero is also the honest answer on
  // an older database: nothing there could have drawn from the bank.
  let holidayDrawn = 0
  let coreDrawn = 0
  {
    const { data, error } = await supabase
      .from('device_sessions').select('holiday_minutes').eq('id', session.id).maybeSingle()
    if (!error) holidayDrawn = Number(data?.holiday_minutes) || 0
  }
  // Same shape for the core draw (migration 223): read apart and best effort,
  // and zero is the honest answer on an older database.
  {
    const { data, error } = await supabase
      .from('device_sessions').select('core_minutes').eq('id', session.id).maybeSingle()
    if (!error) coreDrawn = Number((data as { core_minutes?: number } | null)?.core_minutes) || 0
  }

  const now = Date.now()
  const startedMs = new Date(session.started_at as string).getTime()
  const planned = session.minutes as number
  // Minutes used so far, at least one, never more than what was booked. A
  // finished countdown (now past ends_at) simply used the whole block.
  const elapsedMin = Math.max(1, Math.ceil((now - startedMs) / 60000))
  const usedMinutes = Math.min(planned, elapsedMin)

  // Unwind the unused part, holiday bank first. Those minutes never expire
  // while this week's stars are gone on Monday, so putting back the perishable
  // pocket first would quietly destroy time the child had already earned.
  // planRefund does the arithmetic; a block that drew nothing behaves exactly
  // as it did before any of this existed.
  // Since migration 223 the unwind runs over three pockets, most durable
  // first: the holiday bank is made whole, then the star spend is trimmed,
  // and the core draw gives back last, because tonight it is worth the least.
  // With no core drawn this is exactly the old planRefund.
  const refund = planTieredRefund(planned, usedMinutes, holidayDrawn, coreDrawn)
  const usedStars = refund.starCost
  if (refund.holidayRefund > 0) {
    await refundToHolidayBank(supabase, link.user_id, link.child_id, refund.holidayRefund)
  }

  // Trim the spend to what was used, refunding the rest to the bank.
  if (session.spend_id && !refund.unchanged) {
    await supabase.from('star_spends')
      .update({ minutes: usedMinutes, stars: usedStars })
      .eq('id', session.spend_id)
  }
  // And correct the session to what the holiday bank and the core baseline
  // ended up paying, so the row is a true record of the block rather than of
  // what was booked. The core trim also frees the difference for the rest of
  // today, since the drawdown is computed from these rows. The status filter
  // above is what actually stops a second stop double refunding, since an
  // ended session is never picked up again.
  if (refund.holidayRefund > 0) {
    await supabase.from('device_sessions')
      .update({ holiday_minutes: refund.holidayKept })
      .eq('id', session.id)
  }
  if (coreDrawn > refund.coreKept) {
    await supabase.from('device_sessions')
      .update({ core_minutes: refund.coreKept })
      .eq('id', session.id)
  }
  const nowIso = new Date().toISOString()
  // Record the minutes actually used on the session too, not just the spend, so
  // the balance and the where the time goes read (both count device_sessions.
  // minutes) stop overcounting an early hand back. On a finished countdown
  // usedMinutes equals what was booked, so nothing changes there.
  await supabase.from('device_sessions')
    .update({ status: 'ended', ended_at: nowIso, minutes: usedMinutes })
    .eq('id', session.id)

  // Did the child hand it back early, or did the countdown simply finish? Early
  // means they stopped it themselves, which is the thing a parent wants to know.
  const stoppedEarly = usedMinutes < planned
  const device = String(session.device) as DeviceKey

  // Tell the parent now, so their live timer stops with the child's instead of
  // waiting on the twenty second poll. The used minutes are already recorded on
  // the session and the spend above, so the balance and the stats are correct.
  try {
    const { data: childRow } = await supabase
      .from('children').select('name').eq('id', link.child_id).maybeSingle()
    const childName = childRow?.name ?? 'Your child'
    await sendPush({
        userId: link.user_id,
        title: stoppedEarly ? `${childName} has stopped watching ⏹️` : `${childName}'s screen time is up ⏰`,
        body: stoppedEarly
          ? `${usedMinutes} minute${usedMinutes === 1 ? '' : 's'} used on the ${deviceLabel(device)}, and it is on the balance. The rest of the stars went back.`
          : `The ${deviceLabel(device)} timer finished. ${usedMinutes} minute${usedMinutes === 1 ? '' : 's'} recorded.`,
        // The timer's own page, not the old board anchor. Landing on a
        // screen headed Start some screen time is right for both cases here:
        // the session just ended, and starting the next one is the only thing
        // a parent might want to do about it.
        url: '/dashboard/quests/timer',
        // The timer finishing is urgent and needs acting on; handing the device
        // back early is good news that can wait. Same alert route, different
        // weight, so the one that matters is the one that stays on screen.
        urgent: !stoppedEarly,
      })
  } catch { /* push is best effort; the session is already recorded */ }

  return NextResponse.json({ ok: true, usedMinutes, usedStars, refundedStars: (session.stars as number) - usedStars })
}
