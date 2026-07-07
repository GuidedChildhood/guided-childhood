import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Logged in self test: sends one notification to the caller's own devices
// so a parent (or Justin) can verify the whole push chain in one tap.
// Auth is the session, and it can only ever notify the caller.

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!process.env.VAPID_EMAIL || !process.env.NEXT_PUBLIC_VAPID_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID keys are not set on the server' }, { status: 500 })
  }

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  const admin = createAdminClient()
  const { data: subs } = await admin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', user.id)

  if (!subs?.length) {
    return NextResponse.json({ sent: 0, reason: 'no subscription on this account yet' })
  }

  const payload = JSON.stringify({
    title: 'Notifications are working',
    body: 'This is your test from Guided Childhood. The daily check ins will arrive just like this.',
    url: '/dashboard',
  })

  let sent = 0
  const errors: string[] = []
  const details: string[] = []
  const hosts = new Set<string>()
  await Promise.allSettled(
    subs.map(async sub => {
      try { hosts.add(new URL(sub.endpoint).host) } catch { /* ignore */ }
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        sent++
      } catch (err: unknown) {
        const e = err as { statusCode?: number; body?: string; message?: string }
        errors.push(e?.statusCode != null ? String(e.statusCode) : 'unknown')
        // The push service puts the real reason in the body, which is the
        // thing that actually tells us what is wrong with a 400 or 403.
        const reason = (e?.body || e?.message || '').toString().replace(/\s+/g, ' ').trim().slice(0, 300)
        if (reason) details.push(reason)
      }
    })
  )

  return NextResponse.json({ sent, devices: subs.length, errors, details, hosts: [...hosts] })
}
