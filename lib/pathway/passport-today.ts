// THE PASSPORT, TODAY, IN ONE LINE (plans/2026-10-16-passport-journey-plan.md, PR 3).
//
// Justin, 15 October 2026: "make sure daily loop gives simple update on
// progress, what needs to be done ... use the PWA to update you on your
// child's progress along the pathway." So one function says where a child's
// passport page is and the one next step, and every surface that speaks for
// the passport reads it: the passport page's Next card, the passport card on
// Home, and the pushes about the page. One writer, so they cannot disagree.
//
// Server only. Reads with whichever client the caller holds (the parent's
// session, or the service role in a push route); every query is filtered by
// user and child.

import type { SupabaseClient } from '@supabase/supabase-js'
import { getStageProgress, type StageId } from './progress'
import { getPassedStageQuizzes } from './stage-quiz-status'
import { loadStoredStamps } from './stamp-store'
import { isStageStamped } from './stamped'
import { pageCount, pageCountLine, type PageCount } from './page-count'
import { passportNext, type NextStep } from './passport-next'
import { countsTowardPathway } from './script-status'
import { loadChildLessonPath } from './lesson-path-server'
import { newMissionAllowed, passportStageFor } from '@/lib/lessons/school-path'
import { isHeavyModule, stillWaiting } from '@/lib/lessons/heavy'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { createAdminClient } from '@/lib/supabase/admin'
import { FLAGGED_MODULES } from '@gc/shared/schools-curriculum'
import { STAGE_PAGES } from '@gc/shared/stage-map'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

type Db = SupabaseClient

const SLUGS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

export type PassportChild = {
  id: string
  name: string | null
  date_of_birth?: string | null
  age_band?: string | null
  streak_weeks?: number | null
}

export type PassportToday = {
  stageNum: number
  stageId: StageId
  page: string
  friend: string
  img: string
  /** The small friend cutout made for email, public/digi-squad/friends/email. */
  emailImg: string
  count: PageCount
  stamped: boolean
  step: NextStep
  /** "Sam's Asking questions page: 7 of 12 done." */
  line: string
  /** "Next for Sam: Your feed is a guess." */
  nextLine: string
  /** The weekday the next lesson opens, when this week's is done. */
  opensOn: string | null
}

/** Sentence start name: "Sam", or "Your child". */
export const kidOf = (name: string | null | undefined) => (name && name !== 'Your child' ? name : 'Your child')

export async function loadPassportToday(
  db: Db,
  args: { userId: string; child: PassportChild; paid: boolean },
): Promise<PassportToday> {
  const { userId, child, paid } = args
  const stageId = passportStageFor(child)
  const stageNum = SLUGS.indexOf(stageId) + 1
  const kid = kidOf(child.name)
  const page = STAGE_PAGES[stageId].page
  const character = STAGE_CHARACTERS[stageNum - 1]

  const [progress, passed, stored, lessonPath, { data: missionRows }, { data: lastPassRow }, { data: stageScripts }, { data: scriptRows }] = await Promise.all([
    getStageProgress(db as never, userId, stageId, child.streak_weeks ?? 0, child.id),
    getPassedStageQuizzes(db as never, userId, child.id),
    loadStoredStamps(db, child.id),
    loadChildLessonPath(db as never, { userId, childId: child.id, stageId, paid }),
    db.from('kid_lesson_missions').select('lesson_id, status, sent_at').eq('user_id', userId).eq('child_id', child.id),
    db.from('lesson_completions').select('lesson_id, completed_at')
      .eq('user_id', userId).eq('child_id', child.id).eq('lesson_source', 'school_lesson').eq('passed', true)
      .order('completed_at', { ascending: false }).limit(1).maybeSingle(),
    db.from('scripts').select('sort_order, title, is_free, only_on_signal').eq('stage_id', stageId).order('sort_order'),
    db.from('script_completions').select('script_sort_order, status').eq('user_id', userId).or(`child_id.eq.${child.id},child_id.is.null`),
  ])

  const checkPassed = passed.has(stageNum)
  const count = pageCount(progress, checkPassed)
  const stamped = isStageStamped(progress, passed, stageNum, stored)

  const nextId = lessonPath.path.school.next?.id ?? null
  const nextMod = nextId ? lessonPath.modules.find(m => m.id === nextId) ?? null : null
  const missions = (missionRows ?? []) as { lesson_id: string; status: string; sent_at: string | null }[]
  const lastPassAt = (lastPassRow as { completed_at?: string | null } | null)?.completed_at ?? null
  const weekOpen = !nextId || missions.some(m => m.lesson_id === nextId) || newMissionAllowed({
    lastPassAt, isFirstOfStage: lessonPath.modules[0]?.id === nextId, isSkippedRestart: false,
  })
  const opensOn = lastPassAt
    ? new Date(Date.parse(lastPassAt) + 7 * 86400000).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/London' })
    : null
  const heavyWaiting = !!nextMod && isHeavyModule((nextMod as { module_id?: string | null }).module_id)
    && missions.some(m => m.lesson_id === nextMod.id && m.status === 'sent' && stillWaiting(m.sent_at))
  const resolved = new Set(((scriptRows ?? []) as { script_sort_order: number; status: string | null }[])
    .filter(c => countsTowardPathway(c.status)).map(c => c.script_sort_order))
  const script = ((stageScripts ?? []) as { sort_order: number; title: string; is_free: boolean | null; only_on_signal: boolean | null }[])
    .find(sc => !sc.only_on_signal && !resolved.has(sc.sort_order) && (paid || sc.is_free)) ?? null

  // The tea question from the lesson just passed, for seven days, never from
  // a safeguarding flagged lesson (plan T7).
  let lastPass: { title: string; question: string | null; listenFor: string | null } | null = null
  const lastId = (lastPassRow as { lesson_id?: string } | null)?.lesson_id
  if (lastId && lastPassAt && Date.now() - Date.parse(lastPassAt) < 7 * 86400000) {
    const row = await getStarLesson(createAdminClient(), lastId, 'id, title, module_id, parent_note').catch(() => null) as
      { title?: string; module_id?: string | null; parent_note?: { family_question?: string; listen_for?: string } | null } | null
    const flagged = !!row?.module_id && FLAGGED_MODULES.some(m => m.moduleId === row.module_id)
    if (row && !flagged) lastPass = { title: row.title ?? '', question: row.parent_note?.family_question ?? null, listenFor: row.parent_note?.listen_for ?? null }
  }

  const step = passportNext({
    kid, childId: child.id, stageNum, page, count, stamped,
    lesson: nextMod ? { id: nextMod.id, title: nextMod.title, heavyWaiting } : null,
    weekOpen, opensOn,
    script: script ? { id: String(script.sort_order), title: script.title } : null,
    lastPass,
  })

  const line = stamped
    ? `${kid}'s ${page} page is stamped.`
    : `${kid}'s ${page} page: ${pageCountLine(count)}.`
  const nextLine = step.key === 'lesson' ? `Next for ${kid}: ${step.title}.`
    : step.key === 'check' ? `Next for ${kid}: the big check.`
    : step.key === 'note' || step.key === 'script' ? `Next for you: ${step.title}.`
    : step.title

  return { stageNum, stageId, page, friend: character.name, img: character.cutout, emailImg: `/digi-squad/friends/email/${character.key}.png`, count, stamped, step, line, nextLine, opensOn: weekOpen ? null : opensOn }
}
