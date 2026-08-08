import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logConcernEvent, isScore } from '@/lib/concerns/events'

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

  // score: where it is right now, 1 really tough to 10 going great, optional.
  // scoreAtStart: asked only when marking something solved, looking back from
  // the end. That is the retrospective pre-test, and it exists because people
  // re-scale what a 7 means to them as they get to know their own problem. It is
  // the cheapest thing we can do to keep the before and after honest.
  const { slug, status, score, scoreAtStart } = await request.json() as {
    slug?: string
    status?: string
    score?: unknown
    scoreAtStart?: unknown
  }
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

    // The most valuable row in the table. A thing that came back after being
    // sorted is what stops the wisdom corpus reading every win as permanent.
    await logConcernEvent(supabase, user.id, slug, {
      event: 'recurred',
      score: isScore(score) ? score : null,
      source: 'progress',
    })

    return NextResponse.json({ saved: true, status: 'open', recurred: true })
  }

  const { error } = await supabase
    .from('concerns')
    .update({ status, last_checked_at: now })
    .eq('user_id', user.id)
    .eq('slug', slug)

  if (error) return NextResponse.json({ error: 'could not update' }, { status: 500 })

  await logConcernEvent(supabase, user.id, slug, {
    event: status === 'resolved' ? 'resolved' : 'reopened',
    score: isScore(score) ? score : null,
    // Only meaningful on the way out, and only when they answered it.
    scoreAtStart: status === 'resolved' && isScore(scoreAtStart) ? scoreAtStart : null,
    source: 'progress',
  })

  return NextResponse.json({ saved: true, status })
}
