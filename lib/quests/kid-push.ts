import webpush from 'web-push'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

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
    const { data: subs } = await admin
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', userId)
      .eq('child_id', childId)
    if (!subs?.length) return

    webpush.setVapidDetails(process.env.VAPID_EMAIL, VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)
    const payload = JSON.stringify({ title, body, url: '/' })
    const stale: string[] = []
    await Promise.allSettled(
      subs.map(async sub => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
        } catch (err: unknown) {
          if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === 410) {
            stale.push(sub.endpoint)
          }
        }
      })
    )
    if (stale.length) await admin.from('push_subscriptions').delete().in('endpoint', stale)
  } catch { /* best effort */ }
}
