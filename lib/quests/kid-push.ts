import webpush from 'web-push'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'
import { oneRowPerDevice, DEVICE_COLUMNS, LEGACY_COLUMNS, isMissingColumn, type PushRow } from '@/lib/push/devices'
import { inChildQuietHours } from '@/lib/push/quiet-hours'

// A best effort nudge to the child's own device, through the reminders
// they turned on from their quest link. Only ever from a parent to their
// own child, and silence is fine: the quest page shows the same news on
// the next open.

type PushClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

/**
 * What a push did, counted (plan v10, item 1.5). It returned nothing until
 * 9 October 2026, even on the happy path, so a caller could not tell a sent
 * nudge from one swallowed by quiet hours, and the send route's one nudge per
 * lesson would have been spent on a tap at half nine.
 */
export type ChildPushResult = { sent: number; reason: 'sent' | 'quiet_hours' | 'not_configured' | 'no_device' | 'failed' }

export async function pushToChild(
  admin: PushClient,
  userId: string,
  childId: string,
  title: string,
  body: string
): Promise<ChildPushResult> {
  // Night time. This is the busiest of the three doors to a child's phone,
  // about twenty five call sites, so the gate lives here rather than in each
  // of them: the next feature that nudges a child gets it without knowing it
  // exists, which is the only version of this that stays true.
  if (inChildQuietHours()) return { sent: 0, reason: 'quiet_hours' }

  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PRIVATE_KEY) return { sent: 0, reason: 'not_configured' }
  try {
    // Twice, because device_id arrives with migration 166 and migrations here
    // are run by hand, so there is a window where this code knows about a column
    // the database has not got. Asking for it fails the whole read, `subs` comes
    // back null, and the early return below sends a child nothing at all. See
    // lib/push/devices.ts.
    const read = (columns: string) => admin
      .from('push_subscriptions')
      .select(columns)
      .eq('user_id', userId)
      .eq('child_id', childId)

    let { data: subs, error } = await read(DEVICE_COLUMNS)
    if (error && isMissingColumn(error, 'device_id')) {
      ({ data: subs, error } = await read(LEGACY_COLUMNS))
    }
    if (!subs?.length) return { sent: 0, reason: 'no_device' }

    // ONE BUZZ PER DEVICE.
    //
    // Justin, 6 August 2026: "Every reminder eg jobs or agree timer seems to
    // send 4 pwas to child's phone." This function is the one behind the jobs
    // nudge and the timer, and it was sending to every row it found. Teo had
    // five rows for one phone, four of which still delivered.
    //
    // A push endpoint is not a device: the service issues a new one on a
    // reinstall, on clearing site data, on an iOS update and on its own
    // schedule, and the old row was never removed. Migration 166 cleans the
    // table and the subscribe route stops it refilling; this is the guard that
    // holds while both of those are rolling out.
    // Asserted: see the note in lib/push/devices.ts on PushRow.
    const devices = oneRowPerDevice(subs as unknown as PushRow[])

    // Tapping the notification must open the child's own quest page, not
    // the site root (where a child, with no login, lands nowhere useful).
    // Look up their private link token and deep link straight to it.
    const { data: link } = await admin
      .from('kid_links').select('token').eq('user_id', userId).eq('child_id', childId).maybeSingle()
    const url = (link as { token?: string } | null)?.token ? `/k/${(link as { token: string }).token}` : '/'

    webpush.setVapidDetails(process.env.VAPID_EMAIL, VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
    const payload = JSON.stringify({ title, body, url })
    const stale: string[] = []
    let sent = 0
    await Promise.allSettled(
      devices.map(async sub => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
          sent += 1
        } catch (err: unknown) {
          // 404 as well as 410. Apple and Google both answer 404 for an endpoint
          // that no longer exists, and an endpoint that is not there is not
          // coming back. Only removing 410 is part of why dead rows sat in this
          // table for a month. Anything else is left alone: a 429 or a 500 is
          // the push service having a moment, and deleting a real family's
          // subscription over that unsubscribes them for good.
          const status = err && typeof err === 'object' && 'statusCode' in err
            ? Number((err as { statusCode?: unknown }).statusCode)
            : 0
          if (status === 404 || status === 410) stale.push(sub.endpoint)
        }
      })
    )
    if (stale.length) await admin.from('push_subscriptions').delete().in('endpoint', stale)
    return { sent, reason: sent > 0 ? 'sent' : 'failed' }
  } catch { return { sent: 0, reason: 'failed' } }
}
