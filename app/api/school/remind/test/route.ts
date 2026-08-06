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
//
// ONE BUZZ PER DEVICE, NOT ONE PER ROW.
//
// Justin, 5 August 2026: "when I clicked test it sent 5 notifications to
// child's app?"
//
// It did. A row in push_subscriptions is an ENDPOINT, not a phone, and iOS
// mints a brand new endpoint every time a home screen app is removed and added
// back, or the browser data is cleared. The old row survives and stays live for
// a while, so one phone quietly becomes four rows over a couple of days. This
// route then sent one notification per row.
//
// The numbers on the live database when this was written: Teo's phone had four
// Apple rows, all created inside twenty five hours. Justin's own account had
// twenty three, so his test was fanning out twenty three ways and he only
// noticed the child's because that phone was sitting next to him.
//
// A test answers one question: does the chain work. So it now sends to ONE
// device per platform, newest first, and walks down the list only when a send
// actually fails. Dead endpoints are deleted as they are found, on both the
// parent and the child path, which is what stops the pile growing again. The
// child path never pruned at all, which is why it was the worst of the two.
//
// The real evening reminder still reaches every live device. It is only the
// test that is deliberately quiet.

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

type Sub = { endpoint: string; p256dh: string; auth: string; updated_at?: string | null }

type Attempt = {
  ok: boolean
  errors: string[]
  details: string[]
  // Endpoints the push service says are gone for good, safe to delete.
  gone: string[]
}

/**
 * Send to ONE device from a list, newest first, and report what happened.
 *
 * Stops at the first success, because that is all a test needs to prove. Keeps
 * walking past a dead endpoint rather than giving up on it, so a phone that has
 * been reinstalled still gets its buzz from whichever of its rows is current,
 * and every dead one it passed is named for deletion on the way.
 */
async function sendToOne(subs: Sub[], payload: string): Promise<Attempt> {
  const out: Attempt = { ok: false, errors: [], details: [], gone: [] }
  // Newest first: on a phone that has been reinstalled, the live endpoint is
  // almost always the most recent row.
  const ordered = [...subs].sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))

  for (const sub of ordered) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      )
      out.ok = true
      return out
    } catch (err: unknown) {
      const e = err as { statusCode?: number; body?: string; message?: string }
      out.errors.push(e?.statusCode != null ? String(e.statusCode) : 'unknown')
      // The push service puts the real reason in the body. Keep it: it is
      // the difference between a fixable setup problem and a server one.
      const why = (e?.body || e?.message || '').toString().replace(/\s+/g, ' ').trim().slice(0, 300)
      if (why) out.details.push(why)
      // 404 and 410 mean this subscription is gone for good, not busy. The
      // spec is explicit, and keeping the row only guarantees the same
      // failure every morning the cron runs.
      if (e?.statusCode === 404 || e?.statusCode === 410) out.gone.push(sub.endpoint)
      // Anything else is a real fault rather than a stale row, so stop here
      // rather than hammering every other device with the same failing send.
      else return out
    }
  }
  return out
}

// Which platform a row belongs to, so the parent gets one buzz per platform
// rather than one per row. A parent with a laptop and a phone still gets both.
function platformKey(endpoint: string): string {
  try { return new URL(endpoint).host } catch { return endpoint }
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID keys are not set on the server' }, { status: 500 })
  }

  // The child is no longer looked up at all. See the note further down: the
  // test is the parent asking about the parent's own phone.
  const { data: actionsData } = await supabase
    .from('school_actions').select('title').eq('user_id', user.id).eq('status', 'open').limit(10)

  const actions = actionsData ?? []
  const titles = actions.map(a => a.title)
  const body = titles.length === 0
    ? 'This is a test. Once you add a reminder, it will read like: "Tomorrow: PE kit. Sort it tonight while it is easy."'
    : titles.length === 1
    ? `Tomorrow: ${titles[0]}. Sort it tonight while it is easy.`
    : `Tomorrow: ${titles.slice(0, 3).join(', ')}${titles.length > 3 ? ', and more' : ''}. Sort tonight while it is easy.`

  webpush.setVapidDetails(process.env.VAPID_EMAIL, VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
  const admin = createAdminClient()

  const { data: parentRows } = await admin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, updated_at')
    .eq('user_id', user.id)
    .is('child_id', null)
  const parentSubs = (parentRows ?? []) as Sub[]

  if (!parentSubs.length) {
    return NextResponse.json({ sent: 0, reason: 'no subscription on this account yet' })
  }

  const parentPayload = JSON.stringify({ title: 'Test: from school, due tomorrow', body, url: '/dashboard/school' })

  // One send per platform, in parallel across platforms.
  const byPlatform = new Map<string, Sub[]>()
  for (const sub of parentSubs) {
    const key = platformKey(sub.endpoint)
    const list = byPlatform.get(key)
    if (list) list.push(sub)
    else byPlatform.set(key, [sub])
  }

  const attempts = await Promise.all(
    [...byPlatform.values()].map(async list => ({ list, result: await sendToOne(list, parentPayload) })),
  )

  let sent = 0
  const errors: string[] = []
  const details: string[] = []
  const delivered = new Set<string>()
  const gone: string[] = []
  for (const { list, result } of attempts) {
    if (result.ok) { sent++; delivered.add(platformLabel(list[0].endpoint)) }
    errors.push(...result.errors)
    details.push(...result.details)
    gone.push(...result.gone)
  }

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

  // THE TEST NEVER TOUCHES THE CHILD'S PHONE.
  //
  // Justin, 6 August 2026, asked directly: "no need for test to go to child."
  //
  // It used to send them one as well, on the reasoning that a routine set to
  // auto send should be provable end to end. That reasoning was wrong. The
  // person tapping the button is the parent, the question they are asking is
  // "will MY phone buzz", and the answer arriving on a child's phone in the
  // next room is a notification nobody asked for, sent to somebody who is not
  // in the conversation. A child should only ever get the real thing.
  //
  // Their devices are still pruned, just by the cron that actually sends to
  // them, not by a button the parent pressed to check their own setup.

  return NextResponse.json({
    sent, devices: parentSubs.length, platforms, hasApple, errors, details,
    // How many rows were dropped as dead, so the card can say the retry is
    // worth making rather than leaving a parent to guess.
    removed: gone.length,
    // Every device on file refused. Not the same as having none, and it was
    // this gap that made a real setup problem read as "something went wrong".
    allFailed: sent === 0 && parentSubs.length > 0,
  })
}
