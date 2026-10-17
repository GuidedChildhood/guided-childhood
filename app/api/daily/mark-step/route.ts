import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { londonToday } from '@/lib/pathway/today'

// A step on today's path, marked done from the page it sent the parent to.
//
// Justin, 17 October 2026: DiGi and the devices job take a parent off the
// path, and without a way to say "done" the rung stayed open and the parent
// stayed on the page. The bar that posts here lives in BackToToday and only
// shows when the page was opened from the path with a step named.
//
// Idempotent: one mark per parent, child, day and step (migration 382), and a
// second tap, a second device or a double render lands as the same fact.
const STEPS = new Set(['digi', 'passport'])

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { step?: string; child_id?: string }))
  const step = typeof body.step === 'string' && STEPS.has(body.step) ? body.step : null
  if (!step) return NextResponse.json({ error: 'Unknown step' }, { status: 400 })

  // The child off the wire, validated as this parent's, null meaning the
  // household, exactly as every other daily write does it.
  let childId: string | null = null
  if (typeof body.child_id === 'string' && body.child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', body.child_id).eq('parent_id', user.id).maybeSingle()
    childId = owned?.id ?? null
  }

  const { error } = await supabase.from('today_step_marks').insert({
    user_id: user.id, child_id: childId, day: londonToday(), step_key: step,
  })
  // 23505 is the mark already being there, which is the same answer.
  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
