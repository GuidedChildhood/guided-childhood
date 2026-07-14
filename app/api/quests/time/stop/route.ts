import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { minutesToStars } from '@/lib/quests/device-time'

// The child stops their device time early, or their app calls this when the
// countdown hits zero. Either way the session closes and the recorded spend
// is trimmed back to the minutes actually used, so nothing earned is wasted
// when they hand the device back before the time is up.

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
    .select('id, minutes, stars, spend_id, started_at, ends_at')
    .eq('child_id', link.child_id).eq('status', 'active')
  if (typeof session_id === 'string') query = query.eq('id', session_id)
  const { data: session } = await query.order('started_at', { ascending: false }).limit(1).maybeSingle()
  if (!session) return NextResponse.json({ ok: true, alreadyEnded: true })

  const now = Date.now()
  const startedMs = new Date(session.started_at as string).getTime()
  const planned = session.minutes as number
  // Minutes used so far, at least one, never more than what was booked. A
  // finished countdown (now past ends_at) simply used the whole block.
  const elapsedMin = Math.max(1, Math.ceil((now - startedMs) / 60000))
  const usedMinutes = Math.min(planned, elapsedMin)
  const usedStars = minutesToStars(usedMinutes)

  // Trim the spend to what was used, refunding the rest to the bank.
  if (session.spend_id && (usedMinutes < planned)) {
    await supabase.from('star_spends')
      .update({ minutes: usedMinutes, stars: usedStars })
      .eq('id', session.spend_id)
  }
  await supabase.from('device_sessions')
    .update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('id', session.id)

  return NextResponse.json({ ok: true, usedMinutes, usedStars, refundedStars: (session.stars as number) - usedStars })
}
