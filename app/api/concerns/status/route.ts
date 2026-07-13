import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// The parent's own verdict on a concern from the Progress page: solved,
// still going, or stuck and wanting help, plus happened again on a thing
// that had been marked solved. Solved marks it resolved, stuck keeps it
// open and stamps that it was looked at today so the daily loop does not
// nag about it again the same day. Happened again reopens it and bumps
// the flag count and timestamp so the pathway and DiGi treat it as a
// live, recurring pattern rather than a settled one. Need help is
// handled on the client for now as an email to the team, no status change.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { slug, status } = await request.json() as { slug?: string; status?: string }
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  if (status !== 'resolved' && status !== 'open' && status !== 'recurred') {
    return NextResponse.json({ error: 'status must be resolved, open or recurred' }, { status: 400 })
  }

  const now = new Date().toISOString()

  // Happened again: reopen and record it as a fresh flag so it climbs back
  // up the pathway and DiGi can read the recurrence. Needs the current
  // count to increment it, so read then write.
  if (status === 'recurred') {
    const { data: existing } = await supabase
      .from('concerns')
      .select('times_flagged')
      .eq('user_id', user.id)
      .eq('slug', slug)
      .maybeSingle()

    const { error } = await supabase
      .from('concerns')
      .update({
        status: 'open',
        times_flagged: (existing?.times_flagged ?? 0) + 1,
        last_flagged_at: now,
        last_checked_at: now,
      })
      .eq('user_id', user.id)
      .eq('slug', slug)

    if (error) return NextResponse.json({ error: 'could not update' }, { status: 500 })
    return NextResponse.json({ saved: true, status: 'open', recurred: true })
  }

  const { error } = await supabase
    .from('concerns')
    .update({ status, last_checked_at: now })
    .eq('user_id', user.id)
    .eq('slug', slug)

  if (error) return NextResponse.json({ error: 'could not update' }, { status: 500 })
  return NextResponse.json({ saved: true, status })
}
