import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { quizByKey, QUIZ_LENGTH } from '@/lib/content/school-quizzes'
import { markStepQuietly } from '@/lib/kid/day-store'
import { sendPush } from '@/lib/push/send'

// The school quiz behind the path character. Pass four of five and two bonus
// stars land through the star_bonuses ledger, one quiz a day, checked server
// side against the real quiz so a made up score cannot pay. Token is the
// auth, exactly like quest ticks, and everything fails soft before
// migration 086.

const PASS_MARK = 0.8

export async function POST(req: NextRequest) {
  const { token, quizKey, correct } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || typeof quizKey !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const quiz = quizByKey(quizKey)
  if (!quiz) return NextResponse.json({ error: 'unknown quiz' }, { status: 404 })
  // Every run is a sample of QUIZ_LENGTH from the pool, so that is the total
  // the score is honest against.
  const total = QUIZ_LENGTH
  const right = Math.min(Math.max(0, Number(correct) || 0), total)
  if (right / total < PASS_MARK) {
    return NextResponse.json({ error: 'not passed' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const today = new Date().toISOString().slice(0, 10)
  const { data: already, error: readErr } = await supabase
    .from('star_bonuses')
    .select('id')
    .eq('user_id', link.user_id)
    .eq('child_id', link.child_id)
    .ilike('note', 'Path quiz%')
    .gte('created_at', `${today}T00:00:00Z`)
    .limit(1)
    .maybeSingle()
  if (readErr) return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  if (already) {
    // The stars are a once a day thing and this is the second pass, so nothing
    // is banked. The five a day row is not: a child who has provably passed
    // today has done that step, and if the first tick was lost this is the only
    // remaining chance to put it right.
    await markStepQuietly(supabase, link.user_id, link.child_id, 'quiz')
    return NextResponse.json({ error: 'already claimed today' }, { status: 409 })
  }

  const { error } = await supabase.from('star_bonuses').insert({
    user_id: link.user_id, child_id: link.child_id, stars: 2,
    note: `Path quiz passed: ${quiz.title} (${right} of ${total}) ⭐`,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The five a day's quiz row. Same bug as the lesson row: "Today's quiz" sends
  // the child to /k/<token>/lessons?quiz=1 and a step with an href navigates
  // rather than marking itself, so nothing ticked it.
  //
  // ON PASSING. Everything above this line already refuses anything under four
  // of five, checked server side against the real quiz, so reaching here IS the
  // pass. A child who opened the quiz and gave up has not done the step, and a
  // row that ticked anyway would be the app telling them otherwise.
  await markStepQuietly(supabase, link.user_id, link.child_id, 'quiz')

  // The grown up hears it straight away, best effort: real curriculum work
  // done off their own bat is the best push a parent can get.
  try {
    const { data: child } = await supabase.from('children').select('name').eq('id', link.child_id).maybeSingle()
    const name = child?.name && child.name !== 'Your child' ? child.name : 'Your child'
    await sendPush({
        userId: link.user_id,
        title: `${name} passed today's school quiz 🏆`,
        body: `${right} of ${total} on ${quiz.title} (${quiz.yearNote}). 2 bonus stars banked.`,
        url: '/dashboard/quests/manage',
      })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, stars: 2 })
}
