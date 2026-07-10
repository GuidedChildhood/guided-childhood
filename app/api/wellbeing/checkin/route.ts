import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Save a monthly wellbeing check in: how the parent is doing, what has got
// better, and anything new. One row per check in, RLS keeps it to the owner.
export async function POST(req: NextRequest) {
  let body: { parentMood?: number; fixed?: string[]; newConcerns?: string[]; note?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const mood = typeof body.parentMood === 'number' && body.parentMood >= 1 && body.parentMood <= 5
    ? Math.round(body.parentMood) : null
  const fixed = Array.isArray(body.fixed) ? body.fixed.slice(0, 20).map(String) : []
  const newConcerns = Array.isArray(body.newConcerns) ? body.newConcerns.slice(0, 20).map(String) : []
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 1000) || null : null

  const { error } = await supabase.from('wellbeing_checkins').insert({
    user_id: user.id, parent_mood: mood, fixed, new_concerns: newConcerns, note,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
