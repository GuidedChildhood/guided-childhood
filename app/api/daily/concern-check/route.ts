import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logConcernEventById, isSeverity } from '@/lib/concerns/events'

// The morning after a concern is flagged, the daily loop asks how it went.
// The parent's one tap answer moves the concern along its arc:
//   better → improving, and a second better in a row → resolved
//   same   → stays open
//   hard   → stays open
// Every answer stamps last_checked_at so the check in never repeats same day.
//
// The tap also writes an immutable row to concern_events (migration 164), which
// is where the arc actually survives. The update below still overwrites status
// in place, on purpose: it is the fast read the whole app depends on. The log
// beside it is the history.
//
// `severity` is an optional 0 to 10 the parent may add after tapping. It never
// gates the answer. A missing number is the normal case, not a failure.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { slug, answer, severity } = await request.json() as {
    slug?: string
    answer?: string
    severity?: unknown
  }

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

  // One parent action, one event. A check in that tips the concern over into
  // resolved is recorded as the resolution rather than as a check plus a
  // resolution, so counting resolutions never double counts the same tap.
  await logConcernEventById(supabase, user.id, concern.id as string, {
    event: status === 'resolved' ? 'resolved' : 'checked',
    answer: answer as 'better' | 'same' | 'hard',
    severity: isSeverity(severity) ? severity : null,
    source: 'daily',
  })

  return NextResponse.json({ saved: true, status })
}
