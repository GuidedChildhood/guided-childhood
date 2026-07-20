import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getActiveSession } from '@/lib/quests/device-time'

// What the child's status banner needs in one call: their latest screen time
// ask (so an ask's fate is never hunted for), the live session if one runs,
// and any unread nudges their grown up sent. The kid link token is the auth,
// same trust model as ticking. Fed by the same 12 second poll the tick watch
// already runs, so the yes lands live without a refresh.

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // The latest ask from the last twelve hours, whatever its state. Older
  // answers have gone stale: yesterday's not yet should never greet a child.
  const sinceIso = new Date(Date.now() - 12 * 3600000).toISOString()
  const { data: askRow } = await supabase
    .from('device_requests')
    .select('id, device, minutes, status, created_at')
    .eq('child_id', link.child_id)
    .gte('created_at', sinceIso)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const session = await getActiveSession(supabase, link.child_id)

  // Unread nudges, newest first. Fails soft before migration 081: the
  // banner simply shows none yet.
  let nudges: { id: string; message: string }[] = []
  {
    const { data, error } = await supabase
      .from('kid_nudges')
      .select('id, message')
      .eq('child_id', link.child_id)
      .eq('seen', false)
      .order('created_at', { ascending: false })
      .limit(4)
    if (!error) nudges = (data ?? []).map(n => ({ id: String(n.id), message: String(n.message) }))
  }

  return NextResponse.json({
    ask: askRow ? {
      id: String(askRow.id),
      device: String(askRow.device),
      minutes: Number(askRow.minutes),
      status: String(askRow.status),
    } : null,
    session,
    nudges,
  })
}
