import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

// Founder only. The review queue for the research updater. GET lists the
// pending candidate findings; POST approves one (which promotes it into the
// live expert_knowledge bank) or rejects it. This is the human gate: a finding
// only reaches DiGi when the founder clicks OK here.

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
  const { data, error } = await admin
    .from('expert_knowledge_candidates')
    .select('id, source_type, source_name, finding, age_bands, topics, url, rationale, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  return NextResponse.json({ candidates: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!(await requireFounder())) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const { id, action } = await req.json().catch(() => ({}))
  if (!id || (action !== 'approve' && action !== 'reject')) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  const admin = createAdminClient()

  const { data: cand } = await admin
    .from('expert_knowledge_candidates')
    .select('id, source_type, source_name, finding, age_bands, topics, url, status')
    .eq('id', id).maybeSingle()
  if (!cand || cand.status !== 'pending') {
    return NextResponse.json({ error: 'Already reviewed or not found' }, { status: 409 })
  }

  if (action === 'approve') {
    // Promote into the live bank, then mark the candidate approved.
    const { error: insErr } = await admin.from('expert_knowledge').insert({
      source_type: cand.source_type, source_name: cand.source_name, finding: cand.finding,
      age_bands: cand.age_bands ?? [], topics: cand.topics ?? [], url: cand.url, active: true,
    })
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 502 })
  }

  await admin.from('expert_knowledge_candidates')
    .update({ status: action === 'approve' ? 'approved' : 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true, action })
}
