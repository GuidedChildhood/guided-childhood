import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { londonToday } from '@/lib/pathway/today'

// The Tonight rung's one tap: this child's mechanism is on tonight.
// One row per child per day (migration 255); a second tap is a no op.

const MECHANISMS = new Set(['bedtime', 'timer', 'words', 'morning', 'gaming'])

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

  const { error } = await supabase
    .from('tonight_confirmations')
    .upsert(
      { user_id: user.id, child_id: childId, day: londonToday(), mechanism },
      { onConflict: 'user_id,child_id,day' },
    )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
