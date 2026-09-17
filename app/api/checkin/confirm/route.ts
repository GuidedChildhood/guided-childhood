import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// "THESE ARE THE ONES WE START ON."
//
// The whole of day one, in one column. Justin, 17 September 2026, having rated
// seven worries in thirty five seconds ninety seconds after signing up: "it's
// just to acknowledge first concerns raised so seems overkill to ask them to do
// a check in maybe we should just acknowledge they are added to solve first and
// are on next day".
//
// WHY THIS IS NOT first_checkin_at. That column means "they have given us a
// reading" and lib/checkin/today.ts keys its review filter off it: do not ask a
// parent how last night went about something flagged twenty minutes ago.
// Setting it here would switch that filter on before any reading existed, and
// the baseline rows are stamped as of yesterday precisely so they survive it.
// That exact bug has eaten a family's first check in twice already. It gets its
// own column instead.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { error } = await supabase
    .from('profiles')
    .update({ concerns_confirmed_at: new Date().toISOString() })
    .eq('id', user.id)

  // Said out loud rather than swallowed. If this write fails the parent is sent
  // round the same screen tomorrow, and a silent Saved would make that look
  // like the app forgetting them on their second day.
  if (error) return NextResponse.json({ error: 'could not save' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
