import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Logged in self test for the school reminder, the same shape as
// /api/push/test but built from this parent's own real school actions
// instead of a generic line, so setting it up can be verified in one
// tap tonight rather than waiting to see if tomorrow evening's cron
// actually fires. Sends to the parent's own devices, and to the
// child's if there is at least one weekly routine set to auto send.

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!process.env.VAPID_EMAIL || !process.env.NEXT_PUBLIC_VAPID_KEY || !process.env.VAPID_PRIVATE_KEY) {
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

  webpush.setVapidDetails(process.env.VAPID_EMAIL, process.env.NEXT_PUBLIC_VAPID_KEY, process.env.VAPID_PRIVATE_KEY)
  const admin = createAdminClient()

  const { data: parentSubs } = await admin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', user.id)
    .is('child_id', null)

  if (!parentSubs?.length) {
    return NextResponse.json({ sent: 0, reason: 'no subscription on this account yet' })
  }

  const parentPayload = JSON.stringify({ title: 'Test: from school, due tomorrow', body, url: '/dashboard' })
  let sent = 0
  const errors: string[] = []
  await Promise.allSettled(
    parentSubs.map(async sub => {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, parentPayload)
        sent++
      } catch (err: unknown) {
        errors.push(err && typeof err === 'object' && 'statusCode' in err ? String(err.statusCode) : 'unknown')
      }
    })
  )

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

  return NextResponse.json({ sent, devices: parentSubs.length, errors, childSent, childHasDevice: (child ? childSent > 0 : null) })
}
