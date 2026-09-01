import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { londonToday } from '@/lib/pathway/today'

// The day's ONE tick landed, however it landed.
//
// The moments deck already records its own finish through /api/daily/complete,
// but since the rotation (September 2026) a day can complete on a lesson, a
// DiGi question or a passport look, none of which pass through the deck. This
// route records that: the lead rung went green, the day is done, and the
// rotation may advance tomorrow. It never claims cards were completed, because
// none were; the deck's own route keeps that meaning to itself.
//
// Idempotent on purpose: the path posts it from the client when it sees the
// lead rung done, and two devices or two renders posting the same day must
// land as one fact. An existing completed_at is left alone so the first
// completion's timestamp is the one that stands.
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { child_id?: string; focus?: string }))

  // The child off the wire, validated as this parent's, null meaning the
  // household, exactly as every other daily write does it.
  let childId: string | null = null
  if (typeof body.child_id === 'string' && body.child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', body.child_id).eq('parent_id', user.id).maybeSingle()
    childId = owned?.id ?? null
  }

  const focus = typeof body.focus === 'string' && ['connect', 'lesson', 'digi', 'passport'].includes(body.focus)
    ? body.focus
    : null

  const today = londonToday()

  // Today's rows, matched in code: this child's own row first, then the pre
  // migration 210 household row, which the readers already treat as counting
  // for everybody. Filling that one in rather than adding a sibling row keeps
  // one day one fact.
  const { data: rows } = await supabase
    .from('daily_sessions')
    .select('id, completed_at, focus, child_id')
    .eq('user_id', user.id)
    .eq('session_date', today)
    .limit(10)
  type Row = { id: string; completed_at: string | null; focus: string | null; child_id: string | null }
  const held = (rows ?? []) as Row[]
  const row = held.find(r => r.child_id === childId) ?? held.find(r => r.child_id === null)

  if (row) {
    const patch: Record<string, string> = {}
    if (!row.completed_at) patch.completed_at = new Date().toISOString()
    if (!row.focus && focus) patch.focus = focus
    if (Object.keys(patch).length > 0) {
      await supabase.from('daily_sessions').update(patch).eq('id', row.id)
    }
    return NextResponse.json({ ok: true })
  }

  const insert: Record<string, unknown> = {
    user_id: user.id,
    session_date: today,
    completed_at: new Date().toISOString(),
    child_id: childId,
  }
  if (focus) insert.focus = focus
  const { error } = await supabase
    .from('daily_sessions')
    .upsert(insert, { onConflict: 'user_id,child_id,session_date' })
  // A database without migration 210's per child key falls back to the old
  // family wide shape rather than losing the day, same as the deck's route.
  if (error) {
    await supabase.from('daily_sessions').upsert(
      { user_id: user.id, session_date: today, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,session_date' },
    )
  }
  return NextResponse.json({ ok: true })
}
