import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// The morning after a concern is flagged, the daily loop asks how it went.
// The parent's one tap answer moves the concern along its arc:
//   better → improving, and a second better in a row → resolved
//   same   → stays open
//   hard   → stays open
// Every answer stamps last_checked_at so the check in never repeats same day.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { slug, answer } = await request.json() as { slug?: string; answer?: string }

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Concern slug is required' }, { status: 400 })
  }
  if (answer !== 'better' && answer !== 'same' && answer !== 'hard') {
    return NextResponse.json({ error: 'Answer must be better, same or hard' }, { status: 400 })
  }

  const { data: concern } = await supabase
    .from('concerns')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('slug', slug)
    .maybeSingle()

  if (!concern) {
    return NextResponse.json({ error: 'Concern not found' }, { status: 404 })
  }

  const status = answer === 'better'
    ? (concern.status === 'improving' ? 'resolved' : 'improving')
    : 'open'

  const { error } = await supabase
    .from('concerns')
    .update({ status, last_checked_at: new Date().toISOString() })
    .eq('id', concern.id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Could not save the check in' }, { status: 500 })
  }

  return NextResponse.json({ saved: true, status })
}
