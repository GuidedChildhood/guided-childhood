import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logConcernEventById, isScore } from '@/lib/concerns/events'
import { markFirstCheckIn } from '@/lib/checkin/first'

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

  const { concernId, slug, answer, score } = await request.json() as {
    concernId?: string
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

  // ── BY ID FIRST, BECAUSE SLUG IS NO LONGER UNIQUE ─────────────────────────
  //
  // Concerns went per child with migration 194, and seedChildBaseline gives
  // every new child the same four common worries, so a two child family holds
  // two rows with slug 'phone-handover-fight'. maybeSingle returns an ERROR on
  // two rows, not the first of them, so this lookup would have failed with a
  // 404 for every family who used the new "add your other children" step, and
  // the check in would have looped silently.
  //
  // The client sends the row's own id now. slug is still accepted and still
  // works for a one child family, because an app open from before this deploy
  // is still holding a page that only knows the slug, and limit(1) keeps that
  // path from throwing on the ambiguity rather than resolving it wrongly.
  const byId = typeof concernId === 'string' && concernId.length > 0
  const { data: concern } = byId
    ? await supabase.from('concerns').select('id, status')
        .eq('user_id', user.id).eq('id', concernId).maybeSingle()
    : await supabase.from('concerns').select('id, status')
        .eq('user_id', user.id).eq('slug', slug)
        .order('created_at', { ascending: true }).limit(1).maybeSingle()

  if (!concern) {
    return NextResponse.json({ error: 'Concern not found' }, { status: 404 })
  }

  let verdict: 'better' | 'same' | 'hard'
  if (legacyAnswer) {
    verdict = legacyAnswer
  } else {
    const { data: lastEvent } = await supabase
      .from('concern_events')
      .select('score')
      .eq('concern_id', concern.id)
      .not('score', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    const last = lastEvent?.score as number | null | undefined
    const s = score as number
    // ── COMPARED BY BAND, NOT BY RAW NUMBER (12 August 2026) ────────────────
    //
    // The card now asks for one of five bands rather than a number out of ten,
    // and the five it offers are exactly the five scoreWord has always used:
    // 1-2 really tough, 3-4 hard going, 5-6 up and down, 7-8 getting there,
    // 9-10 going great. Each answer posts the top of its band, so the column
    // keeps its 1 to 10 shape and every reader of it carries on unchanged.
    //
    // The comparison has to move with it. Raw numbers would call a legacy 7
    // followed by today's "getting there" (an 8) an improvement, when the
    // parent has just told us it is the same as it was. Worse, that was the
    // old fault in miniature: a one point wobble inside a band reading as
    // progress is precisely the drift Justin was being shown as a climbing
    // line. Bands only move when the parent picks a different word.
    const band = (n: number) => Math.ceil(Math.min(10, Math.max(1, n)) / 2)
    verdict = s >= 9 ? 'better'
      : typeof last === 'number' ? (band(s) > band(last) ? 'better' : band(s) < band(last) ? 'hard' : 'same')
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
    score: isScore(score) ? score : null,
    source: 'daily',
  })

  // The first one is the baseline, and it is also what earns the right to ask
  // them to choose a way in. Both read one timestamp. See lib/checkin/first.
  await markFirstCheckIn(supabase, user.id)

  return NextResponse.json({ saved: true, status, verdict })
}
