import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readMoment } from '@/lib/digi/moment'

// GET: the parent's pending proactive prompts. When nothing is pending, DiGi
// reads the moment (lib/digi/moment.ts) and steps in only if there is
// something worth saying, under the cap. This runs on dashboard visits, so
// DiGi leads without needing the parent to ask, and stays quiet most days.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const pendingQuery = () => supabase
    .from('digi_prompts').select('id, kind, title, body, href, created_at, outcome_id')
    .eq('user_id', user.id).eq('status', 'pending').neq('kind', 'insight')
    .order('created_at', { ascending: false }).limit(3)

  const { data: pending } = await pendingQuery()
  if ((pending ?? []).length > 0) return NextResponse.json({ prompts: pending ?? [] })

  // ── THE MOMENT READER, NOT THE CALENDAR ────────────────────────────────────
  //
  // This used to run four hard rules and a drumbeat (a tip every three days,
  // a parent care nudge, a printable nudge on alternate days), then ask the
  // model to write a card per trigger. Since 13 September 2026 the question is
  // the other way round: DiGi reads what changed for this family and decides
  // whether anything is worth saying today, under a cap that is code. See
  // lib/digi/moment.ts. Most visits it stays quiet, and that is the product.
  try {
    await readMoment(supabase, user.id)
  } catch { /* a dashboard visit never fails on a step in */ }

  const { data: fresh } = await pendingQuery()
  return NextResponse.json({ prompts: fresh ?? [] })
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !['seen', 'dismissed', 'acted'].includes(status)) {
    return NextResponse.json({ error: 'missing or invalid id / status' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase.from('digi_prompts').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
