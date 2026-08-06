import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
    } catch { /* best effort */ }
  }

  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: link.user_id,
    child_id: link.child_id,
    device_id: device,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys?.p256dh ?? '',
    auth: subscription.keys?.auth ?? '',
  }, { onConflict: 'endpoint' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
