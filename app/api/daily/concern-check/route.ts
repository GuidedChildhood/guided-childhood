import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logConcernEventById, isScore } from '@/lib/concerns/events'

// The morning after a concern is flagged, the daily loop asks how it went.
//
// ONE NUMBER IS THE WHOLE ANSWER
//
// The parent moves a slider to where things are today, 1 really tough to 10
// going great, and the direction is worked out here by comparing it with the
// last number they gave for the same concern. They used to answer twice, a
// better same or still hard chip and then an optional number on a timer, and
// the timer shut the number down on anyone who paused to think (Justin,
// 8 August). Now the score IS the answer:
//   up on last time, or 9 and above  → better
//   below last time                  → hard
//   level, or a first ever score     → same
// and the concern walks its arc exactly as before: better → improving, a
// second better in a row → resolved, anything else stays open.
//
// The comparison lives here rather than in the client because the client's
// idea of "last time" is whatever the page happened to load. The event log is
// the truth, so the event log decides.
//
// A legacy `answer` in the payload still wins when present, so the older
// call shape keeps working.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { slug, answer, score } = await request.json() as {
    slug?: string
    answer?: string
    score?: unknown
  }

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Concern slug is required' }, { status: 400 })
  }
  const legacyAnswer = answer === 'better' || answer === 'same' || answer === 'hard' ? answer : null
  if (!legacyAnswer && !isScore(score)) {
    return NextResponse.json({ error: 'A score from 1 to 10, or an answer, is required' }, { status: 400 })
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

  // Last time's number, needed either way: to compare against a score, or to
  // move on from when the answer is a direction.
  const { data: lastEvent } = await supabase
    .from('concern_events')
    .select('score')
    .eq('concern_id', concern.id)
    .not('score', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const last = lastEvent?.score as number | null | undefined

  // ── THE ANSWER IS A DIRECTION AGAIN (12 August 2026) ───────────────────────
  //
  // Justin: "1 to 10 is confusing. I know we need to see previous rating and we
  // record movement, but this needs to be quick and easy to go through."
  //
  // So the parent answers better, same or harder, and the number is DERIVED
  // here rather than asked for. That is the whole trick, and it is what lets a
  // three tap answer keep everything the ten point scale was feeding:
  //
  //   the progress chart      reads score and score_at_start, and still gets
  //                           both, built from the moves actually reported
  //   DiGi's wisdom bank      reads the same rows, unchanged
  //   the resolution machine  already ran on better, same and hard. The score
  //                           was layered over the top on 8 August; underneath,
  //                           this is the shape it always had.
  //
  // A derived level is also the more honest number. Nobody knows whether
  // bedtime is a 7 or an 8, and the app never used the difference: scoreWord
  // collapses ten points into five bands, so 7 and 8 both read "Getting there".
  // What a parent genuinely does know is whether this week was better than last
  // week, and a line built from those is a record of what they told us rather
  // than of what they guessed.
  let verdict: 'better' | 'same' | 'hard'
  let derived: number | null = null
  if (legacyAnswer) {
    verdict = legacyAnswer
    // Start in the middle when there is no history, because the first answer
    // is about a week we have no number for. Then one step per check in, and
    // clamped, so a long good run tops out at 10 rather than running away.
    const base = typeof last === 'number' ? last : 5
    derived = Math.min(10, Math.max(1, base + (verdict === 'better' ? 1 : verdict === 'hard' ? -1 : 0)))
  } else {
    const s = score as number
    verdict = s >= 9 ? 'better'
      : typeof last === 'number' ? (s > last ? 'better' : s < last ? 'hard' : 'same')
      : 'same'
  }

  const status = verdict === 'better'
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
    answer: verdict,
    // The derived level for a direction answer, the raw one for a score.
    // Either way a number lands on the row, so the chart never sees a gap.
    score: isScore(score) ? score : derived,
    source: 'daily',
  })

  return NextResponse.json({ saved: true, status, verdict })
}
