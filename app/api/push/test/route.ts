import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

// Logged in self test: sends one notification to the caller's own devices
// so a parent (or Justin) can verify the whole push chain in one tap.
// Auth is the session, and it can only ever notify the caller.

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Name exactly which vars are missing so the Vercel fix is unambiguous.
  // Never leak the values, only whether each is present. The public key is
  // no longer required here: it has a baked in fallback (lib/config/vapid),
  // so only the two true server secrets can block a send.
  const missing = [
    ['VAPID_EMAIL', process.env.VAPID_EMAIL],
    ['VAPID_PRIVATE_KEY', process.env.VAPID_PRIVATE_KEY],
  ].filter(([, v]) => !v).map(([k]) => k)
  if (missing.length) {
    return NextResponse.json({
      error: `Not set on the server yet: ${missing.join(', ')}. Add these in Vercel then redeploy.`,
    }, { status: 500 })
  }

  // A subtle wrong value that still 400s or 403s: the subject must be a
  // mailto or https url, so catch a bare email here with a clear message.
  const email = process.env.VAPID_EMAIL as string
  if (!/^(mailto:|https:\/\/)/i.test(email)) {
    return NextResponse.json({
      error: `VAPID_EMAIL must start with mailto: (it is currently "${email.slice(0, 40)}"). Set it to mailto:hello@guidedchildhood.com and redeploy.`,
    }, { status: 500 })
  }

  webpush.setVapidDetails(
    email,
    VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY as string
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
  // Endpoints the push service says are gone for good.
  const dead: string[] = []
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
        // 404 and 410 are the push service telling us this endpoint is dead
        // and will never work again. Anything else might be temporary.
        if (e?.statusCode === 404 || e?.statusCode === 410) dead.push(sub.endpoint)
        // The push service puts the real reason in the body, which is the
        // thing that actually tells us what is wrong with a 400 or 403.
        const reason = (e?.body || e?.message || '').toString().replace(/\s+/g, ' ').trim().slice(0, 300)
        if (reason) details.push(reason)
      }
    })
  )

  // Delete the dead ones.
  //
  // Nothing ever did, which is why a phone that has had the app removed from
  // the home screen and added back a few times ends up with a pile of devices
  // on file that all refuse: iOS mints a brand new endpoint each time and the
  // old row just sat there forever. The count only ever grew, and every one of
  // them counted towards "every device refused", so the message got more
  // alarming the longer the account had been used.
  //
  // The card that shows this already reads a removed count and already has the
  // sentence for it. It could just never fire, because this route never sent
  // one. Same shape of bug as the passport fallback and the badge clip guard:
  // the handling was written, the thing that triggers it was not.
  let removed = 0
  if (dead.length > 0) {
    const { error } = await admin
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .in('endpoint', dead)
    if (!error) removed = dead.length
  }

  return NextResponse.json({
    sent,
    devices: subs.length,
    // The card branches on this to explain a total refusal rather than
    // reporting a vague fault. It was reading a field nobody sent.
    allFailed: sent === 0,
    removed,
    errors,
    details,
    hosts: [...hosts],
  })
}
