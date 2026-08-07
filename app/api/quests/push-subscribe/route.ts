import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isMissingColumn } from '@/lib/push/devices'

// The kid side of notifications: the quest page subscribes with the kid
// link token as the auth (no account, same trust model as ticking).
// The subscription is stored against the CHILD, so parent check ins
// never reach the child's phone and quest reminders never reach the
// parent's.

export async function POST(req: NextRequest) {
  const { token, subscription, deviceId } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || !subscription?.endpoint) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // THIS PHONE ALREADY HAS A ROW. Replace it, do not add to it.
  //
  // Justin, 6 August 2026: "Every reminder eg jobs or agree timer seems to send
  // 4 pwas to child's phone." Teo had five subscriptions to one phone and four
  // of them still delivered.
  //
  // The upsert below is on endpoint, and an endpoint is not a device: the push
  // service issues a new one on a reinstall, on clearing site data, on an iOS
  // update, and on its own schedule. Every one of those inserted a row and none
  // of them removed the row before, so the table became a log of every
  // subscription this phone has ever had and every send fanned out across all
  // of it.
  //
  // device_id survives the rotation, so this clears out what this device left
  // behind. Fails soft: a child standing at a permission prompt should get
  // their reminders turned on even if the tidy up cannot run.
  const device = typeof deviceId === 'string' && deviceId.length > 0 && deviceId.length <= 64
    ? deviceId
    : null
  if (device) {
    try {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', link.user_id)
        .eq('child_id', link.child_id)
        .eq('device_id', device)
        .neq('endpoint', subscription.endpoint)
    } catch { /* best effort, and a no op before migration 166 */ }
  }

  const base = {
    user_id: link.user_id,
    child_id: link.child_id,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys?.p256dh ?? '',
    auth: subscription.keys?.auth ?? '',
  }

  // Written twice if it has to be. Migration 166 adds device_id and migrations
  // here are applied by hand, so until it runs this insert names a column that
  // does not exist and the route answers 500 to a child standing at a permission
  // prompt. Saving the subscription matters more than recording which device it
  // came from: without the row they get no reminders at all, and without the
  // device_id they get the duplicates we already know how to collapse at send
  // time. So the id is the part that gives way.
  let { error } = await supabase.from('push_subscriptions')
    .upsert({ ...base, device_id: device }, { onConflict: 'endpoint' })
  if (error && isMissingColumn(error, 'device_id')) {
    ({ error } = await supabase.from('push_subscriptions')
      .upsert(base, { onConflict: 'endpoint' }))
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
