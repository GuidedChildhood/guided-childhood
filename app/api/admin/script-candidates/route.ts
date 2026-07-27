import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Founder only. The review queue for the scripts DiGi drafts every two weeks.
// GET lists the pending drafts. POST approves one (inserting it into the live
// scripts table at the next sort order) or rejects it. Nothing goes live until
// the founder says so.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

async function requireFounder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) return null
  return user
}

export async function GET() {
  if (!(await requireFounder())) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const admin = createAdminClient()
  const { data } = await admin
    .from('script_candidates')
    .select('id, stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, grounded_in, rationale')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)
  return NextResponse.json({ candidates: data ?? [] })
}

export async function POST(request: Request) {
  if (!(await requireFounder())) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const { id, action } = await request.json().catch(() => ({}))
  if (!id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'id and action required' }, { status: 400 })
  }
  const admin = createAdminClient()

  if (action === 'reject') {
    await admin.from('script_candidates').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id)
    return NextResponse.json({ ok: true })
  }

  // Approve: copy the draft into the live scripts table at the next sort order.
  const { data: c } = await admin.from('script_candidates').select('*').eq('id', id).single()
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: top } = await admin.from('scripts').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
  const nextOrder = ((top?.sort_order as number | undefined) ?? 0) + 1

  const { error } = await admin.from('scripts').insert({
    stage_id: c.stage_id, category: c.category, title: c.title, situation: c.situation,
    say_this: c.say_this, not_this: c.not_this, why_it_works: c.why_it_works, tonight: c.tonight,
    is_free: false, sort_order: nextOrder,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await admin.from('script_candidates').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id)
  return NextResponse.json({ ok: true, sort_order: nextOrder })
}
