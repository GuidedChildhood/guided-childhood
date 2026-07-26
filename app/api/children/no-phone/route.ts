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
  const { error } = await supabase
    .from('children').update({ no_phone: noPhone }).eq('id', childId).eq('parent_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
