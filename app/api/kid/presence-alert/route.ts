import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child has been browsing their app for half an hour with no timer
// running. Their screen already nudged them at twenty minutes; this sends the
// grown up one quiet line so both sides know. Token is the auth, exactly like
// quest ticks, the client fires it at most once a day, and everything here is
// best effort: a failed push changes nothing for the child.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { data: child } = await supabase
    .from('children').select('name').eq('id', link.child_id).maybeSingle()
  const name = child?.name && child.name !== 'Your child' ? child.name : 'Your child'

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} has been in the app a while 🌱`,
        body: `Half an hour of browsing with no timer running. Their screen has nudged them toward a job or the timer. A word about something offline might help too.`,
        url: '/dashboard/quests',
      }),
    })
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true })
}
