import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The kid side of notifications: the quest page subscribes with the kid
// link token as the auth (no account, same trust model as ticking).
// The subscription is stored against the CHILD, so parent check ins
// never reach the child's phone and quest reminders never reach the
// parent's.

export async function POST(req: NextRequest) {
  const { token, subscription } = await req.json()
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

  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: link.user_id,
    child_id: link.child_id,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys?.p256dh ?? '',
    auth: subscription.keys?.auth ?? '',
  }, { onConflict: 'endpoint' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
