import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logConcernEventById, isScore } from '@/lib/concerns/events'
import { markFirstCheckIn } from '@/lib/checkin/first'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { bandOf } from '@/lib/concerns/bands'
import { ATTENTION_BAND, BAND_WORDS } from '@/lib/concerns/outcome'

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

  // The row's own id is the identity since concerns went per child; slug is
  // only the legacy path for an app open from before that deploy. Requiring
  // slug WITH an id present is what broke every save on 19 August: the
  // re keyed client posted { concernId, score }, this guard 400ed it, and the
  // card said "did not save, tap a star to try again" for every star on every
  // line. The client's own fix travels in the same commit, but the route must
  // not depend on it: one of the two ends being right has to be enough.
  const hasId = typeof concernId === 'string' && concernId.length > 0
  if (!hasId && (!slug || typeof slug !== 'string')) {
    return NextResponse.json({ error: 'A concern id or slug is required' }, { status: 400 })
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
  const byId = hasId
  const { data: concern } = byId
    ? await supabase.from('concerns').select('id, status, label, child_id')
        .eq('user_id', user.id).eq('id', concernId).maybeSingle()
    : await supabase.from('concerns').select('id, status, label, child_id')
        .eq('user_id', user.id).eq('slug', slug)
        .order('created_at', { ascending: true }).limit(1).maybeSingle()

  if (!concern) {
    return NextResponse.json({ error: 'Concern not found' }, { status: 404 })
  }

  let verdict: 'better' | 'same' | 'hard'
  // True on the tap that takes a worry to five stars for the first time since
  // it was last below, which is the tap the child's stamp lands on.
  let justSorted = false
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
    verdict = s >= 9 ? 'better'
      : typeof last === 'number' ? (bandOf(s) > bandOf(last) ? 'better' : bandOf(s) < bandOf(last) ? 'hard' : 'same')
      : 'same'
    justSorted = s >= 9 && !(typeof last === 'number' && last >= 9)
  }

  const status = verdict === 'better'
    ? (concern.status === 'improving' ? 'resolved' : 'improving')
    : 'open'

  // ── THE HISTORY ROW GOES FIRST, AND ITS FAILURE IS AN ERROR ───────────────
  //
  // Until 1 September 2026 this ran the other way: status moved, then the
  // event write ran best effort with its result thrown away. So a failed
  // insert still returned saved:true, the status advanced with no history
  // row behind it, and the Today rung, which is done only when a SCORED
  // event exists for the day, stayed undone with no error anywhere. That is
  // the same silent-failure family as the 15 August loop, one layer down.
  //
  // The event is the record a parent's tap actually creates, everything else
  // reads from it, so it is written first and a failure comes back as a 500
  // the row can retry from. If the status update then fails, the retry logs
  // a second event with the same score: a duplicate reading is benign (every
  // reader takes the latest), a missing one is not.
  //
  // One parent action, one event. A check in that tips the concern over into
  // resolved is recorded as the resolution rather than as a check plus a
  // resolution, so counting resolutions never double counts the same tap.
  const logged = await logConcernEventById(supabase, user.id, concern.id as string, {
    event: status === 'resolved' ? 'resolved' : 'checked',
    answer: verdict,
    score: isScore(score) ? score : null,
    source: 'daily',
  })
  if (!logged) {
    return NextResponse.json({ error: 'Could not save the check in' }, { status: 500 })
  }

  const { error } = await supabase
    .from('concerns')
    .update({ status, last_checked_at: new Date().toISOString() })
    .eq('id', concern.id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Could not save the check in' }, { status: 500 })
  }

  // The first one is the baseline, and it is also what earns the right to ask
  // them to choose a way in. Both read one timestamp. See lib/checkin/first.
  await markFirstCheckIn(supabase, user.id)

  // ── THE INVITE THAT STAYS, AND STAYS ONCE (7 October 2026) ────────────────
  //
  // Justin: "once check in done it flashes up ask digi but quickly flips to
  // next child. Can we invite to ask digi and option later so goes on alert
  // notification? But only once."
  //
  // A tough score puts Ask DiGi and Get the words on the row, and the row
  // stays open now rather than folding, but a parent mid list moves on and a
  // parent on the last child meets the next child button. So the same invite
  // lands once on Notifications and on Home, keyed by the worry in `source`,
  // so a second tough day does not make a second card. It clears itself the
  // day the worry scores above the attention band, and the morning cron
  // dismisses one older than a week either way. Never blocks the save.
  if (isScore(score)) {
    try {
      const band = bandOf(score as number)
      const source = `checkin:${concern.id}`
      if (band <= ATTENTION_BAND) {
        const { count } = await supabase.from('digi_prompts').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('source', source).in('status', ['pending', 'seen'])
        if (!count) {
          let name: string | null = null
          if (concern.child_id) {
            const { data: kid } = await supabase.from('children').select('name').eq('id', concern.child_id).maybeSingle()
            name = kid?.name && kid.name !== 'Your child' ? String(kid.name) : null
          }
          const label = String(concern.label ?? 'A worry')
          const word = BAND_WORDS[band - 1].toLowerCase()
          const ask = `${label} is ${word} at today's check in${name ? ` for ${name}` : ''}. What is our next move?`
          await supabase.from('digi_prompts').insert({
            user_id: user.id,
            child_id: concern.child_id ?? null,
            kind: 'watch_for',
            title: `DiGi can help with ${label.toLowerCase()}`,
            body: `${name ? `${name}'s ` : ''}${label.toLowerCase()} was ${word} at today's check in. Talk it through when you have a minute, or get the words for tonight.`,
            reason: 'A tough score on the daily check in.',
            href: `/dashboard/digi?${concern.child_id ? `child=${concern.child_id}&` : ''}ask=${encodeURIComponent(ask)}`,
            cta: 'Talk it through',
            source,
          })
        }
      } else {
        await supabase.from('digi_prompts').update({ status: 'dismissed' })
          .eq('user_id', user.id).eq('source', source).in('status', ['pending', 'seen'])
      }
    } catch { /* the check in saved; the row itself still offers the help */ }
  }

  // ── THE CHILD HEARS ABOUT IT ──────────────────────────────────────────────
  //
  // Justin, 2 September 2026: "trace the moment the parent said phones in
  // the car were a problem: as the star went to 5 stars, so great, you scored
  // a stamp in your passport." The stamp itself is derived when the child's
  // app next reads (lib/concerns/sorted feeds the sticker book and the wins
  // queue), so nothing here has to be remembered. This is only the knock on
  // the door: one nudge, on the tap that sorted it, never on a repeat five,
  // and never at night, which pushToChild enforces for every caller.
  if (justSorted && concern.child_id) {
    try {
      const admin = createAdminClient()
      const { data: kid } = await admin.from('children').select('name').eq('id', concern.child_id).maybeSingle()
      const name = kid?.name && kid.name !== 'Your child' ? String(kid.name) : null
      const label = String(concern.label ?? 'A worry')
      await pushToChild(
        admin, user.id, String(concern.child_id),
        name ? `${name}, a stamp in your passport 🛂` : 'A stamp in your passport 🛂',
        `${label}: sorted. Your grown up gave it five stars. That was you.`,
      )
    } catch { /* the check in saved; the stamp still lands on their next open */ }
  }

  return NextResponse.json({ saved: true, status, verdict })
}
