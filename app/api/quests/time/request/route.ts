import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Resolve a child's ask-first screen time request. The parent's card starts the
// session itself (through parent-start) when approving; this just records the
// outcome so the ask clears. Scoped to their own by session and RLS.

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, status } = await req.json().catch(() => ({}))
  if (!id || !['approved', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  }
  const { error } = await supabase
    .from('device_requests').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
