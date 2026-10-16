import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { londonToday } from '@/lib/pathway/today'
import { readTopConcern } from '@/lib/pathway/tonight'
import { logConcernEventById } from '@/lib/concerns/events'

// The Tonight rung's one tap: this child's mechanism is on tonight.
// One row per child per day (migration 255); a second tap is a no op.

const MECHANISMS = new Set(['bedtime', 'timer', 'words', 'morning', 'gaming', 'phone'])

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { child_id?: string; mechanism?: string }))
  const mechanism = typeof body.mechanism === 'string' && MECHANISMS.has(body.mechanism) ? body.mechanism : null
  if (!mechanism) return NextResponse.json({ error: 'mechanism required' }, { status: 400 })

  // The child has to be this parent's, checked rather than trusted.
  let childId: string | null = null
  if (typeof body.child_id === 'string' && body.child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', body.child_id).eq('parent_id', user.id).maybeSingle()
    childId = owned?.id ?? null
  }
  if (!childId) return NextResponse.json({ error: 'child required' }, { status: 400 })

  // ignoreDuplicates so a second tap really is a no op, and so the select
  // below returns a row only on the first tap of the day.
  const { data: inserted, error } = await supabase
    .from('tonight_confirmations')
    .upsert(
      { user_id: user.id, child_id: childId, day: londonToday(), mechanism },
      { onConflict: 'user_id,child_id,day', ignoreDuplicates: true },
    )
    .select('id')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // ── THE TAP JOINS THE LEDGER (review board, tonight-tap-closes-loop) ──────
  //
  // Stored only in tonight_confirmations, the tap was invisible to What is
  // working, which reads concern_events.linked_type to say what a worry moved
  // alongside. So the first tap of the day also writes one 'tried' event,
  // linked 'tonight', against the same worry the page showed (readTopConcern
  // is the page's own pick). No score and no answer: a thing tried is never a
  // check in, and every reader that counts check ins filters on the score.
  // Best effort, as every ledger write is: the tap has already saved.
  if ((inserted ?? []).length > 0) {
    try {
      const top = await readTopConcern(supabase, user.id, childId)
      if (top) {
        await logConcernEventById(supabase, user.id, top.id, {
          event: 'tried', source: 'tonight', linkedType: 'tonight',
        })
      }
    } catch { /* the ledger never blocks the tap */ }
  }
  return NextResponse.json({ ok: true })
}
