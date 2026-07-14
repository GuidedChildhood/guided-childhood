import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

// A parent pings their child's phone right now: a quest nudge, a come
// off the screen call, dinner in ten. It only reaches a device where
// the child opened their quest link and turned reminders on, and it
// only ever goes from this parent to their own child.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'Notifications not configured' }, { status: 500 })
  }

  const { child_id, message } = await req.json()
  if (!child_id) return NextResponse.json({ error: 'child_id required' }, { status: 400 })

  // The child must be this parent's own.
  const { data: child } = await supabase
    .from('children')
    .select('id, name')
    .eq('id', child_id)
    .eq('parent_id', user.id)
    .maybeSingle()
  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  const admin = createAdminClient()
  const [{ data: subs }, { data: link }] = await Promise.all([
    admin.from('push_subscriptions').select('endpoint, p256dh, auth').eq('user_id', user.id).eq('child_id', child_id),
    admin.from('kid_links').select('token').eq('user_id', user.id).eq('child_id', child_id).maybeSingle(),
  ])

  if (!subs?.length) {
    return NextResponse.json({ sent: 0, reason: 'no_subscription' })
  }

  // Tapping the notification opens the child's own quest page.
  const openUrl = (link as { token?: string } | null)?.token ? `/k/${(link as { token: string }).token}` : '/'

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  const body = typeof message === 'string' && message.trim()
    ? message.trim().slice(0, 140)
    : 'Have a look at your quests when you get a minute.'
  const payload = JSON.stringify({ title: 'A ping from home ⭐', body, url: openUrl })

  let sent = 0
  const stale: string[] = []
  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        sent++
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === 410) {
          stale.push(sub.endpoint)
        }
      }
    })
  )
  if (stale.length) {
    await admin.from('push_subscriptions').delete().in('endpoint', stale)
  }

  return NextResponse.json({ sent })
}
