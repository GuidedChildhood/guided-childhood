import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { recordSurfaceEvents } from '@/lib/events/record'

// A parent opening a moment card and reading it counts as doing today's moment,
// so the daily pathway ticks the Moment step from the library too, not only
// from the daily deck. Idempotent on the unique (user, moment, day), so opening
// the same card twice never double counts.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { momentId, childId } = await request.json().catch(() => ({})) as { momentId?: string; childId?: string }
  if (!momentId || !/^[0-9a-f-]{36}$/i.test(momentId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // ── WHICH CHILD THIS MOMENT WAS WITH ──────────────────────────────────────
  //
  // This read is_primary, so a parent who switched to Olgie, opened a card and
  // talked it through with her filed it against Teo. Checked against the
  // account rather than trusted; falls back to the first child, which is what
  // is_primary meant, so nothing changes for a one child family.
  let forChild: string | null = null
  if (typeof childId === 'string' && childId) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle()
    forChild = owned?.id ?? null
  }
  if (!forChild) {
    const { data: kids } = await supabase
      .from('children').select('id').eq('parent_id', user.id)
      .order('is_primary', { ascending: false }).order('created_at', { ascending: true }).limit(1)
    forChild = (kids ?? [])[0]?.id ?? null
  }

  // A plain insert with the duplicate swallowed, not an upsert. Migration 211
  // made the uniqueness a PARTIAL index, one per child per moment per day, and
  // a partial index is not a target PostgREST can name in an on conflict
  // clause. Doing the same moment twice in a day is a no op either way.
  const { error } = await supabase.from('moment_completions').insert({
    user_id: user.id,
    child_id: forChild,
    moment_id: momentId,
  })
  if (error && /duplicate|unique/i.test(error.message)) {
    return NextResponse.json({ ok: true })
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The learning stream (migration 238), best effort beside the real ledger.
  await recordSurfaceEvents(supabase, user.id, [{ surface: 'moment', item: momentId, event: 'completed', childId: forChild }])

  return NextResponse.json({ ok: true })
}
