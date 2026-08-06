import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// The gate itself. Founder only.
//
// A rebuild writes candidates into the holding pen (pending = true) and stops.
// This is the only thing in the codebase that can put words in front of a
// parent's DiGi, and it only runs when a person clicks it.
//
// approve  the live set goes inactive, the pen goes live and stamps approved_at
// discard  the pen is emptied, the live set is untouched
//
// There is deliberately no partial approve. The corpus is distilled as a set,
// the patterns lean on each other, and picking four lines out of eleven would
// leave a shape nobody designed. Discard and rerun is the honest way to reject.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const { action } = await request.json().catch(() => ({ action: '' })) as { action?: string }
  if (action !== 'approve' && action !== 'discard') {
    return NextResponse.json({ error: 'action must be approve or discard' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: pending } = await admin
    .from('digi_wisdom')
    .select('id')
    .eq('pending', true)

  if (!pending?.length) {
    return NextResponse.json({ error: 'Nothing waiting to review' }, { status: 400 })
  }

  if (action === 'discard') {
    await admin.from('digi_wisdom').delete().eq('pending', true)
    return NextResponse.json({ discarded: pending.length })
  }

  // Promote. Retire the live set first: if the second step failed after the
  // first, DiGi would fall back to no wisdom at all and answer normally, which
  // is a safe landing. The other order could briefly serve both sets at once
  // and contradict itself inside one reply.
  const now = new Date().toISOString()
  await admin.from('digi_wisdom').update({ active: false }).eq('active', true)

  const { error } = await admin
    .from('digi_wisdom')
    .update({ active: true, pending: false, approved_at: now, updated_at: now })
    .eq('pending', true)

  if (error) return NextResponse.json({ error: 'Could not promote the new wisdom' }, { status: 500 })

  return NextResponse.json({ approved: pending.length, approvedAt: now })
}
