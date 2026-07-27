import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Founder only. Add a script to the library from the dashboard, so hundreds of
// scripts and new ones from parent requests are quick to write. Scripts live in
// the scripts table, never hardcoded. Sort order is assigned automatically as
// the next free number so a new script always lands at the end of the shelf.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()
const STAGES = new Set(['foundation', 'builder', 'explorer', 'shaper', 'independent'])

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const b = await request.json().catch(() => ({}))
  const s = (v: unknown, max = 4000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
  const stage_id = s(b.stage_id, 20)
  if (!STAGES.has(stage_id)) return NextResponse.json({ error: 'Pick a stage' }, { status: 400 })

  const required = { title: s(b.title, 200), situation: s(b.situation), say_this: s(b.say_this), not_this: s(b.not_this), why_it_works: s(b.why_it_works), tonight: s(b.tonight) }
  for (const [k, v] of Object.entries(required)) {
    if (!v) return NextResponse.json({ error: `${k.replace(/_/g, ' ')} is needed` }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: top } = await admin.from('scripts').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
  const nextOrder = ((top?.sort_order as number | undefined) ?? 0) + 1

  const row = {
    stage_id,
    category: s(b.category, 60) || null,
    ...required,
    if_they_push_back: s(b.if_they_push_back) || null,
    check_back: s(b.check_back) || null,
    for_your_child: s(b.for_your_child) || null,
    is_free: b.is_free === true,
    sort_order: nextOrder,
  }
  const { error } = await admin.from('scripts').insert(row)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, sort_order: nextOrder })
}
