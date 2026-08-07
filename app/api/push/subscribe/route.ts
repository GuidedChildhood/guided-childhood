import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { isMissingColumn } from '@/lib/push/devices'

// Build the client lazily, inside the handler, so a missing env var at
// build time (for example on the marketing Vercel project, which has no
// Supabase keys) never crashes the whole build. If the keys are absent at
// runtime the route returns a clean 503 instead of a page data failure.
function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Push not configured' }, { status: 503 })

    const { subscription, userId, stage, deviceId } = await req.json()

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    // One row per device, not one per subscription this device has ever had.
    // The parent side had accumulated seventeen rows on Google and six on Apple
    // for a single account, which is why every message arrived as a pile. Same
    // cause and same fix as the child route; see migration 166.
    const device = typeof deviceId === 'string' && deviceId.length > 0 && deviceId.length <= 64
      ? deviceId
      : null
    if (device) {
      try {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', userId)
          .is('child_id', null)
          .eq('device_id', device)
          .neq('endpoint', subscription.endpoint)
      } catch { /* best effort */ }
    }

    const base = {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      stage: stage ?? null,
      updated_at: new Date().toISOString(),
    }

    // Written twice if it has to be. device_id arrives with migration 166 and
    // migrations here are applied by hand, so until it runs this insert names a
    // column that does not exist and the whole subscribe fails. Saving the
    // subscription matters more than recording which device it came from.
    let { error } = await supabase
      .from('push_subscriptions')
      .upsert({ ...base, device_id: device }, { onConflict: 'endpoint' })
    if (error && isMissingColumn(error, 'device_id')) {
      ({ error } = await supabase
        .from('push_subscriptions')
        .upsert(base, { onConflict: 'endpoint' }))
    }

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ error: 'Push not configured' }, { status: 503 })

    const { endpoint } = await req.json()
    await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
