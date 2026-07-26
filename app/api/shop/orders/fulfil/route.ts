import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Founder only. Marks a paid keepsake order as posted, or puts it back if it
// was ticked by mistake.
//
// The service key is needed because orders are read only to the family that
// placed them under RLS, so the founder's own session cannot write to someone
// else's order. The email check above it is the real gate.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({})) as { id?: string; undo?: boolean }
  if (!body.id) return NextResponse.json({ error: 'No order' }, { status: 400 })

  let admin
  try { admin = createAdminClient() } catch {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // Only ever moves between paid and fulfilled. A pending order is one where
  // the payment never landed, and marking that posted would be posting
  // something nobody paid for.
  const { error } = body.undo
    ? await admin.from('orders')
        .update({ status: 'paid', fulfilled_at: null })
        .eq('id', body.id).eq('status', 'fulfilled')
    : await admin.from('orders')
        .update({ status: 'fulfilled', fulfilled_at: new Date().toISOString() })
        .eq('id', body.id).eq('status', 'paid')

  if (error) return NextResponse.json({ error: 'Could not update' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
