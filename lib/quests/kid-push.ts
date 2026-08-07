import webpush from 'web-push'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'
import { oneRowPerDevice, DEVICE_COLUMNS, LEGACY_COLUMNS, isMissingColumn, type PushRow } from '@/lib/push/devices'

// A best effort nudge to the child's own device, through the reminders
// they turned on from their quest link. Only ever from a parent to their
// own child, and silence is fine: the quest page shows the same news on
// the next open.

type PushClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export async function pushToChild(
  admin: PushClient,
  userId: string,
  childId: string,
  title: string,
  body: string
) {
  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PRIVATE_KEY) return
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
    if (!subs?.length) return

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
    await Promise.allSettled(
      devices.map(async sub => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
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
  } catch { /* best effort */ }
}
