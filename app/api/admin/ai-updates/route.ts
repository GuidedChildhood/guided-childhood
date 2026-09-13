import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

// The human gate on platform changes.
//
// GET lists the drafts the weekly platform watch (and the hand fed refresh
// route) have written. POST publishes or rejects one. Publishing is the ONLY
// way an ai_updates row leaves draft, and it is what sends the update to the
// families it affects: one digi_prompts card each, kind new_research, so it
// rides the same queue with the same dismiss and the same quiet rules. A
// teacher facing draft publishes without a card; the schools product carries
// those on its own surfaces.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

/** The audiences a draft can name, and the child age band each one reaches. */
const AUDIENCE_BANDS: Record<string, string[] | 'all' | 'none'> = {
  parent: 'all',
  age_13: ['13-15'],
  age_16: ['16+'],
  teacher: 'none',
}

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
    .from('ai_updates')
    .select('id, headline, summary, audience, category, source_name, source_url, created_at')
    .eq('status', 'draft')
    .order('created_at', { ascending: false })
    .limit(60)
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  return NextResponse.json({ updates: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!(await requireFounder())) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const { id, action } = await req.json().catch(() => ({}))
  if (!id || (action !== 'publish' && action !== 'reject')) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  const admin = createAdminClient()
  const { data: row } = await admin.from('ai_updates')
    .select('id, headline, summary, audience, source_name, source_url, status')
    .eq('id', id).maybeSingle()
  if (!row || row.status !== 'draft') {
    return NextResponse.json({ error: 'Already reviewed or not found' }, { status: 409 })
  }

  if (action === 'reject') {
    // The table's status check knows draft, approved, published and archived.
    // A rejected draft is archived: kept for the record, never shown, never sent.
    await admin.from('ai_updates').update({ status: 'archived' }).eq('id', id)
    return NextResponse.json({ ok: true, action, reached: 0 })
  }

  const { error: pubErr } = await admin.from('ai_updates')
    .update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id)
  if (pubErr) return NextResponse.json({ error: pubErr.message }, { status: 502 })

  // The fan out: one card per affected family, idempotent on the reason.
  const reach = AUDIENCE_BANDS[String(row.audience)] ?? 'none'
  let reached = 0
  if (reach !== 'none') {
    const kidsQuery = admin.from('children').select('parent_id, age_band').limit(2000)
    const { data: kids } = reach === 'all' ? await kidsQuery : await kidsQuery.in('age_band', reach)
    const parents = [...new Set((kids ?? []).map(k => k.parent_id as string).filter(Boolean))]
    const reason = `platform: ${row.id}`
    const { data: already } = parents.length > 0
      ? await admin.from('digi_prompts').select('user_id').eq('reason', reason).in('user_id', parents)
      : { data: [] }
    const done = new Set((already ?? []).map(r => r.user_id as string))
    const rows = parents.filter(p => !done.has(p)).map(p => ({
      user_id: p, child_id: null, kind: 'new_research', status: 'pending',
      title: String(row.headline).slice(0, 80),
      body: `${row.summary}${row.source_name ? `\n\nSource: ${row.source_name}.` : ''}`,
      href: null, source: row.source_name ?? null, reason,
    }))
    if (rows.length > 0) {
      const { error: fanErr, count } = await admin.from('digi_prompts').insert(rows, { count: 'exact' })
      if (!fanErr) reached = count ?? rows.length
    }
  }
  return NextResponse.json({ ok: true, action, reached })
}
