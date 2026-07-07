import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { reengageMessageForDay } from '@/lib/content/reengage-messages'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Called once a day by Vercel Cron (see vercel.json). The Duolingo
// tactic: when a parent has gone quiet for 3 days or more, one fun,
// DiGi voiced nudge, never a guilt trip, never more than one every 4
// days per non-negotiable 1 (DiGi never punishes, never shames). Sent
// only to parents who already turned notifications on, so this never
// spams anyone who has not opted in.

const QUIET_DAYS = 3
const MIN_GAP_DAYS = 4

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Only parents who have a live push subscription (child_id is null:
  // the parent side of migration 031's split) are worth checking at all.
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('user_id')
    .is('child_id', null)
  const candidateIds = [...new Set((subs ?? []).map(s => s.user_id))]
  if (candidateIds.length === 0) {
    return NextResponse.json({ checked: 0, sent: 0 })
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, created_at, last_reengage_push_at')
    .in('id', candidateIds)

  const { data: sessions } = await supabase
    .from('daily_sessions')
    .select('user_id, session_date')
    .in('user_id', candidateIds)

  const lastSessionByUser = new Map<string, string>()
  for (const s of sessions ?? []) {
    const prev = lastSessionByUser.get(s.user_id)
    if (!prev || s.session_date > prev) lastSessionByUser.set(s.user_id, s.session_date)
  }

  const dayIndex = Math.floor(Date.now() / 86400000)
  const message = reengageMessageForDay(dayIndex)

  let sent = 0
  for (const profile of profiles ?? []) {
    const lastActive = lastSessionByUser.get(profile.id) ?? profile.created_at
    const quietDays = daysSince(lastActive)
    if (quietDays < QUIET_DAYS) continue

    if (profile.last_reengage_push_at && daysSince(profile.last_reengage_push_at) < MIN_GAP_DAYS) continue

    try {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
      const res = await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({ userId: profile.id, title: message.title, body: message.body, url: '/dashboard' }),
      })
      const result = await res.json()
      if (result.sent > 0) {
        sent++
        await supabase.from('profiles').update({ last_reengage_push_at: new Date().toISOString() }).eq('id', profile.id)
      }
    } catch { /* best effort, next day tries again */ }
  }

  return NextResponse.json({ checked: (profiles ?? []).length, sent, message: message.title })
}
