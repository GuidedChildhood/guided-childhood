import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The parent states whether a child manages without a phone. When true the app
// stops nudging to share the QR handover and leans into the fridge and parent
// managed flow. Scoped to their own children by session and RLS, mirroring the
// device_trust route.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, noPhone } = await req.json().catch(() => ({}))
  if (!childId || typeof noPhone !== 'boolean') {
    return NextResponse.json({ error: 'childId and noPhone required' }, { status: 400 })
  }
  // THE CLOCK STARTS HERE.
  //
  // Justin, 14 August 2026: stop telling them to set up a child device, "but
  // later in we just need to make them aware when they get a phone that we can
  // share child's app." Later has to be measured from something, and until
  // migration 193 there was nothing: no_phone was a bare boolean with no record
  // of when it was tapped, so the only re-offer the data could support was
  // always or never.
  //
  // Cleared when they turn it back on, so a parent who changes their mind is
  // not carrying an old clock that fires a re-offer at a child who now has a
  // phone and a link.
  const patch: Record<string, unknown> = {
    no_phone: noPhone,
    no_phone_at: noPhone ? new Date().toISOString() : null,
  }

  let { error } = await supabase
    .from('children').update(patch).eq('id', childId).eq('parent_id', user.id)

  // Before migration 193 lands the column is not there. The answer itself
  // matters more than the clock beside it, so save it without.
  if (error) {
    ;({ error } = await supabase
      .from('children').update({ no_phone: noPhone }).eq('id', childId).eq('parent_id', user.id))
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
