import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

// Logged in self test for the school reminder, the same shape as
// /api/push/test but built from this parent's own real school actions
// instead of a generic line, so setting it up can be verified in one
// tap tonight rather than waiting to see if tomorrow evening's cron
// actually fires. Sends to the parent's own devices, and to the
// child's if there is at least one weekly routine set to auto send.

// Push subscriptions are per device, so a parent testing on their laptop
// gets the notification on the laptop, not the phone. We label the endpoint
// host so the UI can say plainly where it landed, and whether a phone (an
// Apple push endpoint) is subscribed at all. Chrome uses the same host on
// desktop and Android, so that one stays the honest "Chrome".
function platformLabel(endpoint: string): string {
  if (endpoint.includes('push.apple.com')) return 'an Apple device (iPhone, iPad or Mac Safari)'
  if (endpoint.includes('googleapis.com')) return 'Chrome (desktop or Android)'
  if (endpoint.includes('mozilla')) return 'Firefox'
  if (endpoint.includes('windows.com')) return 'Windows'
  return 'a device'
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID keys are not set on the server' }, { status: 500 })
  }

  const [actionsResult, childResult] = await Promise.all([
    supabase.from('school_actions').select('title, auto_send_to_child').eq('user_id', user.id).eq('status', 'open').limit(10),
    supabase.from('children').select('id, name').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])

  const actions = actionsResult.data ?? []
  const titles = actions.map(a => a.title)
  const body = titles.length === 0
    ? 'This is a test. Once you add a reminder, it will read like: "Tomorrow: PE kit. Sort it tonight while it is easy."'
    : titles.length === 1
    ? `Tomorrow: ${titles[0]}. Sort it tonight while it is easy.`
    : `Tomorrow: ${titles.slice(0, 3).join(', ')}${titles.length > 3 ? ', and more' : ''}. Sort tonight while it is easy.`

  webpush.setVapidDetails(process.env.VAPID_EMAIL, VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
  const admin = createAdminClient()

  const { data: parentSubs } = await admin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', user.id)
    .is('child_id', null)

  if (!parentSubs?.length) {
    return NextResponse.json({ sent: 0, reason: 'no subscription on this account yet' })
  }

  const parentPayload = JSON.stringify({ title: 'Test: from school, due tomorrow', body, url: '/dashboard/school' })
  let sent = 0
  const errors: string[] = []
  const details: string[] = []
  const delivered = new Set<string>()
  // Endpoints the push service has told us are permanently dead. Collected
  // here and deleted after, so the next test is not dragged down by devices
  // that stopped existing weeks ago.
  const gone: string[] = []
  await Promise.allSettled(
    parentSubs.map(async sub => {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, parentPayload)
        sent++
        delivered.add(platformLabel(sub.endpoint))
      } catch (err: unknown) {
        const e = err as { statusCode?: number; body?: string; message?: string }
        errors.push(e?.statusCode != null ? String(e.statusCode) : 'unknown')
        // The push service puts the real reason in the body. Keep it: it is
        // the difference between a fixable setup problem and a server one.
        const why = (e?.body || e?.message || '').toString().replace(/\s+/g, ' ').trim().slice(0, 300)
        if (why) details.push(why)
        // 404 and 410 mean this subscription is gone for good, not busy. The
        // spec is explicit, and keeping the row only guarantees the same
        // failure every morning the cron runs.
        if (e?.statusCode === 404 || e?.statusCode === 410) gone.push(sub.endpoint)
      }
    })
  )

  // A subscription rots when a browser clears its data, or when an iPhone PWA
  // is removed and added again: the row survives, the endpoint does not. They
  // pile up, and once every live one has been replaced the test looks broken
  // when it is only stale. Clearing them is what makes it self healing.
  if (gone.length > 0) {
    try {
      await admin.from('push_subscriptions').delete().in('endpoint', gone).is('child_id', null).eq('user_id', user.id)
    } catch { /* the answer below is still honest without it */ }
  }
  const platforms = [...delivered]
  const hasApple = parentSubs.some(s => s.endpoint.includes('push.apple.com'))

  let childSent = 0
  const child = childResult.data
  const hasAutoRoutine = actions.some(a => a.auto_send_to_child)
  if (child && hasAutoRoutine) {
    const { data: childSubs } = await admin
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('child_id', child.id)
    const childPayload = JSON.stringify({
      title: 'Test: from home ⭐',
      body: 'This is a test of your weekly reminder. The real one lands the day it is due.',
      url: '/',
    })
    await Promise.allSettled(
      (childSubs ?? []).map(async sub => {
        try {
          await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, childPayload)
          childSent++
        } catch { /* best effort */ }
      })
    )
  }

  return NextResponse.json({
    sent, devices: parentSubs.length, platforms, hasApple, errors, details,
    // How many rows were dropped as dead, so the card can say the retry is
    // worth making rather than leaving a parent to guess.
    removed: gone.length,
    // Every device on file refused. Not the same as having none, and it was
    // this gap that made a real setup problem read as "something went wrong".
    allFailed: sent === 0 && parentSubs.length > 0,
    childSent, childHasDevice: (child ? childSent > 0 : null),
  })
}
