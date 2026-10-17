import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { sendPush } from '@/lib/push/send'
import { sanitizeAnswers, recordQuestionAnswers } from '@/lib/lessons/answers'
import { childStageCheckPool, markStageCheck } from '@/lib/pathway/child-stage-check'
import { passportStageFor } from '@/lib/lessons/school-path'
import { loadPassportToday, kidOf, type PassportChild } from '@/lib/pathway/passport-today'
import { awardStampIfEarned } from '@/lib/pathway/stamp-store'
import { pageCountLine } from '@/lib/pathway/page-count'
import { claimPageMoment, sendPassportPush } from '@/lib/push/passport-push'

// The child finished the end of stage check on their own link. Token is the
// auth, exactly like quest ticks and lesson completions.
//
// This is the child's quiz, not the grown up's: the questions are gathered from
// the lessons the child worked through, so the child is the one who answers
// them, and the pass is what earns the stamp on their passport.
//
// The row still lands under the PARENT user_id, because stage_quiz_passes is
// read by the pathway page under RLS as auth.uid(). Same shape as
// /api/kid/lesson-complete: the child's work shows up on the parent's board
// without the child needing an account.

const STAGE_NUM: Record<string, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

export async function POST(req: NextRequest) {
  let body: { token?: string; stage_id?: number; correct?: number; answers?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const { token } = body
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const stage = Number(body.stage_id)
  if (!Number.isInteger(stage) || stage < 1 || stage > 5) {
    return NextResponse.json({ error: 'bad stage' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // A child can only sit the check for a stage they have actually reached, the
  // same forward only age gate the lesson pages apply, enforced here too so the
  // gate is not just a link they could edit.
  const { data: child } = await supabase
    .from('children').select('id, name, age_band, date_of_birth, streak_weeks').eq('id', link.child_id).maybeSingle()
  // The page their class is on (one clock, decision 1, 17 October 2026).
  const theirStage = child
    ? STAGE_NUM[passportStageFor(child as { date_of_birth?: string | null; age_band?: string | null })] ?? getStageFromAgeBand((child.age_band as AgeBand | null) ?? '8-10').id
    : getStageFromAgeBand('8-10').id
  if (stage > theirStage) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // MARKED HERE, NOT ON THE PHONE (passport journey plan, 1.6, 17 October
  // 2026). The pool is rebuilt from this child's own passed lessons on the
  // page and each posted answer is checked against it; the score the phone
  // sends is never read. A page with no passed lessons has no check yet.
  const pool = await childStageCheckPool(supabase, { userId: link.user_id, childId: link.child_id, stageNum: stage })
  if (pool.questions.length === 0) return NextResponse.json({ error: 'not ready' }, { status: 409 })
  // One go a day: a miss today comes back tomorrow, so the check stays a
  // check rather than a guess repeated until it lands.
  const todayLondon = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
  const { data: earlier } = await supabase
    .from('stage_quiz_passes').select('passed, taken_at')
    .eq('user_id', link.user_id).eq('child_id', link.child_id).eq('stage_id', stage)
    .order('taken_at', { ascending: false }).limit(5)
  const triedToday = ((earlier ?? []) as { passed: boolean; taken_at: string }[])
    .some(r => !r.passed && new Date(r.taken_at).toLocaleDateString('en-CA', { timeZone: 'Europe/London' }) === todayLondon)
  const passedBefore = ((earlier ?? []) as { passed: boolean }[]).some(r => r.passed)
  if (triedToday && !passedBefore) return NextResponse.json({ error: 'tomorrow' }, { status: 429 })
  const marking = markStageCheck(pool.questions, sanitizeAnswers(body.answers))
  const { right, total, passed } = marking

  const { error } = await supabase.from('stage_quiz_passes').insert({
    user_id: link.user_id,
    child_id: link.child_id,
    stage_id: stage,
    score: right,
    total,
    passed,
  })
  // Before migration 098 the table is absent. Say so plainly rather than 500,
  // so the child still sees their score instead of an error.
  if (error) {
    return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  }

  // The run's questions, kept one by one (migration 239): the next check
  // puts the missed ones first. Best effort, after the pass is banked.
  await recordQuestionAnswers(
    supabase,
    { userId: link.user_id, childId: link.child_id, source: 'stage_check', stageId: stage },
    marking.marked,
  )

  // THE STAMP, WHEN THIS PASS COMPLETES THE PAGE (passport journey plan,
  // PR 3): stored once (migration 378), and the parent hears it once, as the
  // stamp, not as "the last green before the stamp".
  if (passed && child) {
    try {
      const today = await loadPassportToday(supabase, { userId: link.user_id, child: child as PassportChild, paid: false })
      if (today.stageNum === stage) {
        const name = kidOf(child.name as string | null)
        if (today.stamped) {
          await awardStampIfEarned(supabase, {
            userId: link.user_id, childId: link.child_id, stageNum: stage,
            lessonsDone: today.count.lessons.done, lessonsTotal: today.count.lessons.total,
          })
          if (await claimPageMoment(supabase, { userId: link.user_id, childId: link.child_id, stageNum: stage, moment: 'stamp_pushed_at' })) {
            await sendPassportPush({
              userId: link.user_id, childId: link.child_id, stageNum: stage,
              title: `${name} earned the ${today.friend} stamp`,
              body: `The ${today.page} page is stamped: every lesson passed with its check, every talk done, and the big check passed.`,
            })
          }
        } else {
          await sendPassportPush({
            userId: link.user_id, childId: link.child_id, stageNum: stage,
            title: `${name} passed the big check · ${pageCountLine(today.count)}`,
            body: `${right} of ${total} right. ${today.nextLine}`,
          })
        }
        return NextResponse.json({ ok: true, passed, score: right, total, stamped: today.stamped })
      }
    } catch { /* fall through to the plain push */ }
  }

  // The grown up hears, best effort. A stage check is the biggest thing a child
  // does on their side, so this one is worth the parent's phone buzzing.
  try {
    const name = child?.name ?? 'Your child'
    await sendPush({
      userId: link.user_id,
      title: passed ? `${name} passed the stage check 🏅` : `${name} had a go at the stage check 💪`,
      body: passed
        ? `${right} of ${total} right. That is the last green before the stamp.`
        : `${right} of ${total} this time. They can go back over the lessons and try again.`,
      url: '/dashboard/pathway',
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, passed, score: right, total })
}
