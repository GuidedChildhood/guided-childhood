import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The lines a parent took out of a rehearsal.
//
// Recorded with no question attached. Asking "which of these worked?" at the
// end of a rehearsal would be asking about a simulation, and an answer about a
// simulation is a preference rather than evidence. So this just remembers, and
// the Did this help prompt, which fires after the real moment, asks the one
// question worth asking.
//
// Everything here fails quietly. A rehearsal must never be interrupted by a
// bookkeeping call, and before migration 107 there is no table to write to.

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { sortOrder, line } = await req.json().catch(() => ({}))
  if (typeof sortOrder !== 'number' || typeof line !== 'string' || !line.trim()) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  // ignoreDuplicates, because tapping the same line twice in one rehearsal is
  // a parent practising, not a second line worth offering back to them.
  await supabase.from('script_lines_used').upsert(
    { user_id: user.id, script_sort_order: sortOrder, line: line.trim().slice(0, 400) },
    { onConflict: 'user_id,script_sort_order,line', ignoreDuplicates: true },
  )

  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const sortOrder = Number(req.nextUrl.searchParams.get('sortOrder'))
  if (!Number.isFinite(sortOrder)) return NextResponse.json({ lines: [] })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ lines: [] })

  const { data, error } = await supabase
    .from('script_lines_used')
    .select('line')
    .eq('user_id', user.id).eq('script_sort_order', sortOrder)
    .order('created_at', { ascending: true })
    .limit(6)

  if (error) return NextResponse.json({ lines: [] })
  return NextResponse.json({ lines: (data ?? []).map(r => String(r.line)) })
}
