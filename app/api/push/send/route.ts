import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.VAPID_EMAIL || !process.env.NEXT_PUBLIC_VAPID_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID not configured' }, { status: 500 })
  }

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'service key not configured' }, { status: 500 })
  }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)

  const { title, body, url = '/dashboard', userId, audience } = await req.json()

  // Parent messages never reach kid devices and kid reminders never
  // reach parents: subscriptions are split by child_id (migration 031).
  const query = supabase.from('push_subscriptions').select('*')
  if (userId) query.eq('user_id', userId)
  if (audience === 'kids') query.not('child_id', 'is', null)
  else query.is('child_id', null)

  const { data: subs, error } = await query
  if (error || !subs?.length) {
    return NextResponse.json({ sent: 0 })
  }

  const payload = JSON.stringify({ title, body, url })
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
        // 410 Gone = subscription expired, clean up
        if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === 410) {
          stale.push(sub.endpoint)
        }
      }
    })
  )

  if (stale.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', stale)
  }

  return NextResponse.json({ sent, stale: stale.length })
}
