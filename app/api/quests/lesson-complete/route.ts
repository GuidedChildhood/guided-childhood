import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { KID_LESSONS, kidLessonQuestTitle, kidLessonBaseTitle } from '@/lib/quests/kid-lessons'
import { getQuestGame } from '@/lib/quest-games/registry'
import { getWeekBrief } from '@/lib/learning/this-week'
import { sendPush } from '@/lib/push/send'
import { getStarLesson, type StarLessonRow } from '@/lib/quests/star-lesson-catalogue'
import { markStepQuietly } from '@/lib/kid/day-store'
import { parseSlides, visibleSlides, markAnswers, lessonPassed, proveQuestions, type PostedAnswer } from '@gc/shared/lesson-slides'
import { FLAGGED_MODULES } from '@gc/shared/schools-curriculum'
import { isTogetherStage, stageForKeyStage } from '@/lib/lessons/school-path'
import { isTogether, TOGETHER_COOKIE } from '@/lib/lessons/together'
import { recordMarkedAnswers } from '@/lib/lessons/answers'

// Monday of this week as an ISO instant, London week convention like the
// rest of the quests system: the school week mission dedupes against it.
function mondayIso(now: Date): string {
  const d = new Date(now)
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// A kid finished a lesson on their quest link. Token is the auth, exactly
// like quest ticks. Two lesson kinds share this endpoint:
//  - lesson_key: a two minute mini lesson (lib/quests/kid-lessons) ending
//    in a three question quiz. Marked HERE against the server side answer
//    key: 100% earns the bonus star, and the client is never trusted with
//    star maths. It becomes a one off quest with a pending tick so stars
//    land through the parent approve loop.
//  - mission_id: a full Star Lesson from the schools curriculum, sent by
//    the parent (kid_lesson_missions). Stars award once on completion,
//    replays never mint again.

export async function POST(req: NextRequest) {
  let body: { token?: string; lesson_key?: string; mission_id?: string; game_key?: string; school_week?: boolean; correct?: number; total?: number; answers?: unknown; run_id?: unknown; audience?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const { token } = body
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // ── Star Lesson mission (the full curriculum lesson) ──
  //
  // THE PASS CONTRACT, MARKED HERE (plan v10, item 1.5). Until 9 October 2026
  // this branch took `correct` and `total` from the client and passed at 70
  // percent of every question, warm up included, so a crafted request could
  // take the pass, the passport tick and the stars, and a child who missed the
  // starter could fail a lesson whose check they got right. Now:
  //   - the deck is rebuilt as the child saw it (visibleSlides, same audience)
  //     and every posted tap is marked against that slide's own options
  //   - the pass is every prove question right on its settled answer, or
  //     answered when a grown up is the check (under 7, or a retake they
  //     opened from their own session: lib/lessons/together)
  //   - a fail leaves the mission `sent` and counts one attempt, once; only a
  //     pass flips it `done`, so `done` means passed
  //   - stars pay once, on the first finish, pass or not, keyed on `paid_at`
  //     (decision 2: the check is the one place nothing rides on being right)
  //   - without spares a solo second go cannot pass, and a third go always
  //     needs a grown up: the second go replays questions whose answers have
  //     just been shown
  if (body.mission_id) {
    const { data: mission } = await supabase
      .from('kid_lesson_missions')
      .select('id, child_id, status, stars, lesson_id, attempts, paid_at')
      .eq('id', body.mission_id)
      .maybeSingle()
    if (!mission || mission.child_id !== link.child_id) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    const lesson = await getStarLesson(supabase, mission.lesson_id, 'id, module_id, title, slides, key_stage, teacher_notes, parent_note') as
      (StarLessonRow & { module_id?: string | null; slides?: unknown; key_stage?: string | null; teacher_notes?: unknown; parent_note?: unknown }) | null
    if (!lesson) return NextResponse.json({ error: 'not found' }, { status: 404 })

    // The deck the child was shown, the way the mission page built it.
    const audience = isTogetherStage(stageForKeyStage(lesson.key_stage ?? null)) ? 'together' : 'kid'
    const notes = (lesson.teacher_notes ?? {}) as { worksheet?: { verdict_options?: unknown }; worksheet_items?: unknown }
    const deck = visibleSlides(parseSlides(lesson.slides) ?? [], audience, {
      worksheet: { verdict_options: notes.worksheet?.verdict_options, items: notes.worksheet_items },
    }).slides
    const posted = Array.isArray(body.answers) ? (body.answers as PostedAnswer[]).slice(0, 60) : []
    const marked = markAnswers(deck, posted)

    const cookieTogether = isTogether(req.cookies.get(TOGETHER_COOKIE)?.value, link.child_id, mission.lesson_id)
    const together = audience === 'together' || cookieTogether
    const hasSpares = deck.some(s => s.type === 'choice' && !!(s as { reserve_for?: string }).reserve_for)
    const attempts = Number(mission.attempts) || 0
    const soloRetakeRefused = !together && attempts >= 1 && (!hasSpares || attempts >= 2)
    const passed = !soloRetakeRefused && lessonPassed(deck, marked, { together })

    // The check's own score: prove questions right on their settled answer.
    const proves = proveQuestions(deck)
    const total = proves.length
    const correct = proves.filter(p => {
      const last = [...marked].reverse().find(m => m.question === p.question)
      return !!last?.correct
    }).length

    // The ledger: this run's rows only, both flags, the phase, the run.
    const runId = typeof body.run_id === 'string' && /^[0-9a-f-]{36}$/i.test(body.run_id) ? body.run_id : null
    await recordMarkedAnswers(
      supabase,
      { userId: link.user_id, childId: link.child_id, lessonId: mission.lesson_id, runId },
      marked.filter(m => !runId || m.runId === runId),
    )

    // Stars pay once, on the first finish. The `is null` is the lock, so two
    // finishes racing pay one of them.
    let paidNow = false
    if (!mission.paid_at) {
      const { data: paidRows } = await supabase
        .from('kid_lesson_missions')
        .update({ paid_at: new Date().toISOString() })
        .eq('id', mission.id)
        .is('paid_at', null)
        .select('id')
      paidNow = (paidRows?.length ?? 0) > 0
    }

    const credit = async (): Promise<boolean> => {
      const { data: prior } = await supabase
        .from('lesson_completions')
        .select('id, passed')
        .eq('user_id', link.user_id).eq('child_id', link.child_id)
        .eq('lesson_id', mission.lesson_id).eq('lesson_source', 'school_lesson')
        .maybeSingle()
      if (prior?.passed) return false
      await supabase.from('lesson_completions').upsert({
        user_id: link.user_id, child_id: link.child_id,
        lesson_id: mission.lesson_id, lesson_source: 'school_lesson',
        score: correct,
        passed, completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,child_id,lesson_id,lesson_source' })
      if (passed) await markStepQuietly(supabase, link.user_id, link.child_id, 'lesson')
      return passed
    }

    // QUIET ON THE FLAGGED LESSONS (sync plan G4). A lock screen never reads
    // the title of a lesson about blackmail or self harm, and never carries
    // its tea question: those open inside the app.
    const flagged = !!lesson.module_id && FLAGGED_MODULES.some(m => m.moduleId === lesson.module_id)
    // A miss opens the lesson on the parent's page, where "Do it together" is
    // the next go (the only one without spares, and the third on any deck).
    const lessonUrl = `/dashboard/lessons/path?child=${link.child_id}&lesson=${mission.lesson_id}`
    const tellParent = async (starsLine: string) => {
      if (flagged) {
        await notifyParent(req, supabase, link,
          passed ? 'finished this week\'s lesson' : 'had a go at this week\'s lesson',
          passed ? 'Open the app for the question to ask at tea.' : 'Open the app for what to say tonight.',
          passed ? '/dashboard' : lessonUrl)
        return
      }
      const askLine = askAtTea(lesson.parent_note)
      await notifyParent(
        req, supabase, link,
        passed ? `passed ${lesson.title ? `"${lesson.title}"` : 'a star lesson'} 🎬` : `finished a star lesson 🎬`,
        [`${correct} of ${total} on the check.`, passed && askLine ? `Ask them at tea: ${askLine}` : starsLine, !passed && (!hasSpares || attempts + 1 >= 2) ? 'The next go is one to do together.' : ''].filter(Boolean).join(' '),
        passed ? '/dashboard' : lessonUrl,
      )
    }
    const starsLine = paidNow ? `${mission.stars} stars landed in their bank.` : ''

    if (mission.status === 'done') {
      // A replay of a lesson already passed: recorded, nothing moves.
      return NextResponse.json({ stars: 0, already_passed: true, passed })
    }

    if (passed) {
      const { data: flipped, error } = await supabase
        .from('kid_lesson_missions')
        .update({
          status: 'done', score_correct: correct, score_total: total,
          completed_at: new Date().toISOString(), done_together: together,
        })
        .eq('id', mission.id)
        .eq('status', 'sent')
        .select('id')
      if (error) return NextResponse.json({ error: 'update failed' }, { status: 500 })
      // The status flip is the lock: a second finish racing this one lands here.
      if (!flipped?.length) return NextResponse.json({ stars: 0, already_passed: true, passed: true })
      await credit()
      await tellParent(starsLine)
      return NextResponse.json({ stars: paidNow ? mission.stars : 0, passed: true })
    }

    // A fail: the mission stays `sent`, and the attempt read at the start is
    // the lock, so a double tap on the last slide counts one attempt.
    await supabase
      .from('kid_lesson_missions')
      .update({ attempts: attempts + 1, score_correct: correct, score_total: total })
      .eq('id', mission.id)
      .eq('status', 'sent')
      .eq('attempts', attempts)
      .select('id')
    await credit()
    await tellParent(starsLine)
    return NextResponse.json({
      stars: paidNow ? mission.stars : 0,
      passed: false,
      attempts: attempts + 1,
      // The next go is with a grown up: no spares, or the third go.
      together_next: !hasSpares || attempts + 1 >= 2,
    })
  }

  // ── This week at school (the weekly mission, phase 2 of the curriculum
  //    plan). The child says they practised the week's school objective; it
  //    becomes a one off quest with a pending tick, so the stars land
  //    through the parent approve loop exactly like a game. The objective
  //    is recomputed HERE from the child's date of birth, never trusted
  //    from the client, and the dedupe is per week so it can be earned
  //    again when school moves on. ──
  if (body.school_week) {
    const { data: child } = await supabase
      .from('children')
      .select('date_of_birth')
      .eq('id', link.child_id)
      .maybeSingle()
    const brief = child?.date_of_birth ? await getWeekBrief(supabase, child.date_of_birth) : null
    if (!brief || brief.preview) return NextResponse.json({ error: 'no school week' }, { status: 404 })

    const title = `School: ${brief.questTitle}`
    const monday = mondayIso(new Date())
    const { data: existing } = await supabase
      .from('family_quests')
      .select('id')
      .eq('user_id', link.user_id)
      .eq('child_id', link.child_id)
      .eq('title', title)
      .gte('created_at', monday)
      .limit(1)
      .maybeSingle()
    if (existing) return NextResponse.json({ ok: true, already: true, stars: 0 })

    const { data: quest, error: questError } = await supabase
      .from('family_quests')
      .insert({
        user_id: link.user_id,
        child_id: link.child_id,
        title,
        emoji: '📘',
        stars: 3,
        schedule: 'once',
      })
      .select('id')
      .single()
    if (questError || !quest) {
      return NextResponse.json({ error: questError?.message ?? 'could not save' }, { status: 500 })
    }

    await supabase.from('quest_ticks').insert({
      quest_id: quest.id,
      user_id: link.user_id,
      child_id: link.child_id,
      tick_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      ticked_by: 'child',
    })

    await notifyParent(req, supabase, link, 'practised this week’s school work 📘', `${brief.questTitle}, 3 stars. One tap to approve and they land.`)
    return NextResponse.json({ ok: true, stars: 3 })
  }

  // ── Quest game (a game a child plays to earn stars) ──
  // Fixed, transparent stars from the registry, never trusted from the
  // client, landing as a one off quest with a pending tick, once per child,
  // exactly like the mini lessons below.
  if (body.game_key) {
    const game = getQuestGame(body.game_key)
    if (!game) return NextResponse.json({ error: 'unknown game' }, { status: 404 })
    const title = `Game: ${game.title}`

    const { data: existing } = await supabase
      .from('family_quests')
      .select('id')
      .eq('user_id', link.user_id)
      .eq('child_id', link.child_id)
      .like('title', `${title}%`)
      .limit(1)
      .maybeSingle()
    if (existing) return NextResponse.json({ ok: true, already: true, stars: 0 })

    const { data: quest, error: questError } = await supabase
      .from('family_quests')
      .insert({
        user_id: link.user_id,
        child_id: link.child_id,
        title,
        emoji: game.emoji,
        stars: game.stars,
        schedule: 'once',
      })
      .select('id')
      .single()
    if (questError || !quest) {
      return NextResponse.json({ error: questError?.message ?? 'could not save' }, { status: 500 })
    }

    await supabase.from('quest_ticks').insert({
      quest_id: quest.id,
      user_id: link.user_id,
      child_id: link.child_id,
      tick_date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      ticked_by: 'child',
    })

    await notifyParent(req, supabase, link, `played a game 🎮`, `${game.title}, ${game.stars} stars. One tap to approve and they land.`)
    return NextResponse.json({ ok: true, stars: game.stars })
  }

  // ── Mini lesson (two minute card lesson on the quest screen) ──
  if (!body.lesson_key) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const lesson = KID_LESSONS.find(l => l.key === body.lesson_key)
  if (!lesson) return NextResponse.json({ error: 'unknown lesson' }, { status: 404 })

  const answers = body.answers
  if (!Array.isArray(answers) || answers.length !== lesson.questions.length) {
    return NextResponse.json({ error: 'answers required' }, { status: 400 })
  }

  const correct = lesson.questions.reduce(
    (sum, q, i) => sum + (Number(answers[i]) === q.answer ? 1 : 0), 0
  )
  const perfect = correct === lesson.questions.length
  const stars = Math.min(10, lesson.stars + (perfect ? lesson.bonusStars : 0))

  // Each lesson lands its base stars once per child, perfect or not.
  const { data: existing } = await supabase
    .from('family_quests')
    .select('id, title')
    .eq('user_id', link.user_id)
    .eq('child_id', link.child_id)
    .like('title', `${kidLessonBaseTitle(lesson)}%`)
    .limit(1)
    .maybeSingle()
  if (existing) {
    // The improve to 100% path: a child who came back and aced a lesson they
    // did not ace before claims the bonus star, once, as its own tiny one off
    // so the base stars are never re-minted and it can never be farmed. The
    // first pass already carried the 💯 in its title if it was perfect, so a
    // title without it means there is genuine room to improve.
    const wasPerfect = String(existing.title).includes('💯')
    if (perfect && !wasPerfect && lesson.bonusStars > 0) {
      const bonusTitle = `100% bonus: ${lesson.title}`
      const { data: bonusExists } = await supabase
        .from('family_quests')
        .select('id')
        .eq('user_id', link.user_id).eq('child_id', link.child_id)
        .eq('title', bonusTitle).limit(1).maybeSingle()
      if (!bonusExists) {
        const { data: bonusQuest } = await supabase
          .from('family_quests')
          .insert({ user_id: link.user_id, child_id: link.child_id, title: bonusTitle, emoji: '💯', stars: lesson.bonusStars, schedule: 'once' })
          .select('id').single()
        if (bonusQuest) {
          await supabase.from('quest_ticks').insert({
            quest_id: bonusQuest.id, user_id: link.user_id, child_id: link.child_id,
            tick_date: new Date().toISOString().slice(0, 10), status: 'pending', ticked_by: 'child',
          })
          await notifyParent(req, supabase, link, `improved to 100% 💯`, `${lesson.title}, every question right this time. Approve and the ${lesson.bonusStars} bonus star lands.`)
          return NextResponse.json({ ok: true, improved: true, correct, perfect, stars: lesson.bonusStars })
        }
      }
    }
    return NextResponse.json({ ok: true, already: true, correct, perfect })
  }

  const { data: quest, error: questError } = await supabase
    .from('family_quests')
    .insert({
      user_id: link.user_id,
      child_id: link.child_id,
      title: kidLessonQuestTitle(lesson, perfect),
      emoji: lesson.emoji,
      stars,
      schedule: 'once',
    })
    .select('id')
    .single()
  if (questError || !quest) {
    return NextResponse.json({ error: questError?.message ?? 'could not save' }, { status: 500 })
  }

  await supabase.from('quest_ticks').insert({
    quest_id: quest.id,
    user_id: link.user_id,
    child_id: link.child_id,
    tick_date: new Date().toISOString().slice(0, 10),
    status: 'pending',
    ticked_by: 'child',
  })

  await notifyParent(
    req, supabase, link,
    perfect ? `got 100% on a lesson 💯` : `finished a lesson 🧠`,
    perfect
      ? `${lesson.title}, every question right. Approve and ${stars} stars land, bonus included.`
      : `${lesson.title}, ${correct} of ${lesson.questions.length} right. One tap to approve and ${stars} stars land.`,
  )
  return NextResponse.json({ ok: true, correct, perfect, stars })
}

// Nudge the parent's phone, best effort.
async function notifyParent(
  req: NextRequest,
  supabase: ReturnType<typeof createAdminClient>,
  link: { user_id: string; child_id: string },
  titleSuffix: string,
  bodyText: string,
  url = '/dashboard',
) {
  try {
    const { data: child } = await supabase
      .from('children')
      .select('name')
      .eq('id', link.child_id)
      .maybeSingle()
    const name = child?.name ?? 'Your child'
    await sendPush({
        userId: link.user_id,
        title: `${name} ${titleSuffix}`,
        body: bodyText,
        url,
      })
  } catch { /* push is best effort */ }
}

// The one question a parent asks at tea, from the module's parent note.
// Every module carries a family_question (32 of 32 on 29 September 2026).
function askAtTea(note: unknown): string | null {
  if (!note || typeof note !== 'object') return null
  const q = (note as { family_question?: unknown }).family_question
  return typeof q === 'string' && q.trim() ? q.trim() : null
}
