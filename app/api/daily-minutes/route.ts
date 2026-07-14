import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The parent's daily budget: how much time they have today. Only 5, 10 or 15
// are allowed, the three sizes the habit is built around. Saved on the
// profile so the home path can count the day done against it.
const ALLOWED = [5, 10, 15]

export async function POST(req: NextRequest) {
  const { minutes } = await req.json().catch(() => ({}))
  if (!ALLOWED.includes(minutes)) {
    return NextResponse.json({ error: 'minutes must be 5, 10 or 15' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase.from('profiles').update({ daily_minutes: minutes }).eq('id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, minutes })
}
