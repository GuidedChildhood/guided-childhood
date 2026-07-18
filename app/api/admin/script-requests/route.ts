import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Founder only. What parents asked DiGi for and could not find a script for. The
// pipeline for writing the next scripts from real demand. Grouped so repeated
// asks rise to the top, with the closest existing script noted, newest first.
// PATCH marks a request handled once a script has been written for it.

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

  const [openRes, scriptsRes] = await Promise.all([
    admin.from('script_requests').select('id, problem, matched_sort_order, created_at')
      .eq('status', 'new').order('created_at', { ascending: false }).limit(200),
    admin.from('scripts').select('sort_order, title'),
  ])
  const titleFor = new Map((scriptsRes.data ?? []).map(s => [s.sort_order as number, s.title as string]))
  const rows = (openRes.data ?? []).map(r => ({
    id: r.id as string,
    problem: String(r.problem),
    created_at: r.created_at as string,
    closest: r.matched_sort_order != null ? (titleFor.get(r.matched_sort_order as number) ?? null) : null,
  }))
  return NextResponse.json({ total: rows.length, requests: rows })
}

export async function PATCH(request: Request) {
  if (!(await requireFounder())) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const { id } = await request.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const admin = createAdminClient()
  await admin.from('script_requests').update({ status: 'handled' }).eq('id', id)
  return NextResponse.json({ ok: true })
}
