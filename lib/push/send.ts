import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'
import { oneRowPerDevice } from '@/lib/push/devices'

// Sending a push, in process.
//
// This used to live only inside /api/push/send, and the thirty other files that
// wanted to send something reached it by fetching their own deployment over the
// public internet. That cost two outages. Deployment Protection answers 401 on
// the per deployment host Vercel Cron invokes, so every send died there and the
// calling route still replied 200 with the failure tucked in its body. The
// eventual fix was an environment variable pointing at an unprotected alias,
// which works and which rests on three things staying right that nothing in the
// code enforces: the variable, the domain, and a protection setting.
//
// An in process call cannot 401, cannot 404, does not care which domain the app
// is on, and does not break the next time somebody changes a setting. It is
// also faster, since every one of those calls was a network round trip to reach
// a function already in memory.
//
// The route stays, as a thin wrapper, for anything genuinely outside the
// deployment.

export type PushAudience = 'parents' | 'kids'

export type SendPushInput = {
  title: string
  body: string
  url?: string
  /** Send to one family only. Omitted means everyone matching the rest. */
  userId?: string | null
  /** kids reaches child devices, anything else reaches parents. */
  audience?: string | null
  /** morning, afternoon or evening. Omitted reaches every subscription. */
  slot?: string | null
  /** The handful of alerts a parent has to ACT on rather than read later. */
  urgent?: boolean
}

export type SendPushResult = {
  sent: number
  /** Subscriptions the push service refused. Counted, not hidden. */
  failed: number
  /** Endpoints removed because the refusal was permanent. */
  pruned: number
  /** Set only when the send could not be attempted at all. */
  error?: string
}

/**
 * Endpoints worth deleting rather than retrying for ever.
 *
 * 410 Gone is the one the spec is loudest about and the only one the old code
 * removed. 404 Not Found means the same thing in practice: FCM and Apple both
 * return it for an endpoint that no longer exists, and an endpoint that is not
 * there is not coming back.
 *
 * Everything else is left alone on purpose. A 429 or a 500 is the push service
 * having a moment, and deleting a real family's subscription because Apple was
 * briefly unhappy would silently unsubscribe them for ever.
 */
const PERMANENT = new Set([404, 410])

/**
 * Send one notification to everyone who matches.
 *
 * Never throws. Callers are crons and route handlers doing something else, and
 * a push that fails is not worth taking their work down with it. The failure
 * comes back in the result instead, which is the point of this function
 * returning three numbers rather than one.
 */
export async function sendPush(input: SendPushInput): Promise<SendPushResult> {
  const { title, body, url = '/dashboard', userId, audience, slot, urgent } = input

  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PRIVATE_KEY) {
    return { sent: 0, failed: 0, pruned: 0, error: 'VAPID not configured' }
  }
  const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { sent: 0, failed: 0, pruned: 0, error: 'service key not configured' }
  }

  webpush.setVapidDetails(process.env.VAPID_EMAIL, VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { persistSession: false },
  })

  // Parent messages never reach kid devices and kid reminders never reach
  // parents: subscriptions are split by child_id (migration 031).
  const query = supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, device_id, child_id, updated_at, created_at')
  if (userId) query.eq('user_id', userId)
  if (audience === 'kids') query.not('child_id', 'is', null)
  else query.is('child_id', null)
  // Slot aware sends only reach subscriptions that asked for that slot
  // (migration 046). Sends without a slot, like tests, reach everyone.
  if (slot && ['morning', 'afternoon', 'evening'].includes(slot)) query.contains('slots', [slot])

  const { data: subs, error } = await query

  // A failed read is not an empty list, and the old code treated them as the
  // same thing: `if (error || !subs?.length) return { sent: 0 }`. That is the
  // fault that has cost this product most often, a definite answer invented out
  // of a query that never came back. Nobody due anything and the database being
  // unreachable look identical from outside, and only one of them is fine.
  if (error) return { sent: 0, failed: 0, pruned: 0, error: error.message }
  if (!subs?.length) return { sent: 0, failed: 0, pruned: 0 }

  // ONE BUZZ PER DEVICE.
  //
  // Justin, 6 August 2026: "Every reminder eg jobs or agree timer seems to send
  // 4 pwas to child's phone."
  //
  // Every row here used to be sent to, and the table is not a list of devices:
  // a push service issues a new endpoint whenever the subscription is recreated
  // and nothing removed the old row, so one account had twenty three rows and
  // one child's phone had five. See migration 166, which cleans the table and
  // stops it refilling.
  //
  // This stays regardless of that migration, because it is the layer the child
  // actually feels. A row can slip in between the delete and the write in a
  // subscribe, an older client can subscribe with no device_id, and a family can
  // be halfway through the rollout. `sent` counts devices reached now, which is
  // the number that was always meant.
  const devices = oneRowPerDevice(subs)

  const payload = JSON.stringify({ title, body, url, urgent: urgent === true })

  // urgent raises the delivery urgency on the wire. Web push defaults to
  // "normal", which explicitly allows a push service to sit on a message and
  // batch it to save the device's battery. That is right for a school reminder
  // and wrong for "the timer has finished", which is worth nothing if it lands
  // ten minutes after the argument started.
  const options = urgent === true ? { urgency: 'high' as const, TTL: 600 } : undefined

  let sent = 0
  let failed = 0
  const stale: string[] = []

  await Promise.allSettled(
    devices.map(async sub => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
          options,
        )
        sent++
      } catch (err: unknown) {
        // Counted, always. The old version incremented nothing here, so a run
        // that reached thirteen of twenty three devices reported "sent 13" and
        // said nothing at all about the ten that went nowhere. That is the same
        // shape as every other fault in this codebase: a success number that is
        // true on its own terms and hides the half that failed.
        failed++
        const status = err && typeof err === 'object' && 'statusCode' in err
          ? Number((err as { statusCode?: unknown }).statusCode)
          : 0
        if (PERMANENT.has(status)) stale.push(sub.endpoint)
      }
    })
  )

  let pruned = 0
  if (stale.length) {
    const { error: delError } = await supabase.from('push_subscriptions').delete().in('endpoint', stale)
    if (!delError) pruned = stale.length
  }

  return { sent, failed, pruned }
}
