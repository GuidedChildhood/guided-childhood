import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// "Not now" on the school offer, remembered against the account.
//
// It used to be a localStorage key, which was right while the card sat near the
// bottom of Home. From 17 September 2026 the card can take the top of Home on
// its day, and at the top a device local no means a parent who declines on
// their phone meets it again on the laptop the same morning. Asking twice after
// someone has said no is how a good feature earns a bad reputation.
//
// Migration 304. Written here rather than through a general settings route
// because there is no general settings route, and inventing one for a single
// nullable timestamp would be the bigger change.

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('profiles')
    .update({ school_promo_dismissed_at: new Date().toISOString() })
    .eq('id', user.id)

  // Reported honestly, and the card hides locally either way. Migration 304
  // runs by hand, so before it has the column this fails, and a parent who
  // tapped "not now" should still get what they asked for on this device
  // rather than a card that refuses to go away.
  if (error) return NextResponse.json({ ok: false, error: error.message })
  return NextResponse.json({ ok: true })
}
