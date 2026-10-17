// THE CHILD'S BIG CHECK ASKS WHAT THE CHILD WAS TAUGHT, AND THE SERVER MARKS IT
// (plans/2026-10-16-passport-journey-plan.md, item 1.6).
//
// Until 17 October 2026 the child's check drew its questions from the PARENT
// lessons library, topped up from a bank written for parents, and the route
// stamped the page on whatever score the phone sent. So the one test between a
// page and its stamp asked a child about lessons they had never played, and a
// stamp could be earned by a number. Justin's ask was "confidence the child is
// actually learning", and neither half of that was true of the check.
//
// Now the pool is the questions this child's OWN passed lessons on the page
// asked them (the kid deck's choice slides that stand alone), nothing from the
// parent side, and the route marks each posted answer against the pool it
// rebuilds on the server. A run is five questions, or fewer when the page has
// fewer, and the pass is the same share: four in five. A question from a
// safeguarding flagged lesson is marked, so the screen can carry the tell
// route beside it, as the lesson player does.

import type { SupabaseClient } from '@supabase/supabase-js'
import { parseSlides, visibleSlides } from '@gc/shared/lesson-slides'
import { FLAGGED_MODULES } from '@gc/shared/schools-curriculum'
import { STAGE_QUIZ_LENGTH, STAGE_QUIZ_PASS, type StageQuizQuestion } from '@/lib/content/stage-quizzes'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { loadChildLessonPath } from './lesson-path-server'
import { questionsFromSlides, dedupe } from './stage-quiz-gather'
import type { StageId } from './progress'

const SLUGS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

export type ChildCheckQuestion = StageQuizQuestion & { flagged?: boolean }

export type ChildCheckPool = {
  questions: ChildCheckQuestion[]
  lessonsDone: number
  lessonsTotal: number
}

/** The questions this child's own passed lessons on this page asked. Needs the service role client. */
export async function childStageCheckPool(
  admin: SupabaseClient,
  args: { userId: string; childId: string; stageNum: number },
): Promise<ChildCheckPool> {
  const stageId = SLUGS[args.stageNum - 1]
  if (!stageId) return { questions: [], lessonsDone: 0, lessonsTotal: 0 }
  const { modules, path } = await loadChildLessonPath(admin as never, { userId: args.userId, childId: args.childId, stageId, paid: true })
  const passed = modules.filter(m => path.statusById[m.id]?.state === 'passed')
  const rows = await Promise.all(passed.map(m =>
    getStarLesson(admin as never, m.id, 'id, title, module_id, slides').catch(() => null) as Promise<{ id: string; title?: string; module_id?: string | null; slides?: unknown } | null>))
  const questions: ChildCheckQuestion[] = []
  for (const row of rows) {
    if (!row) continue
    const slides = visibleSlides(parseSlides(row.slides), 'kid')?.slides ?? null
    if (!slides) continue
    const flagged = !!row.module_id && FLAGGED_MODULES.some(f => f.moduleId === row.module_id)
    questions.push(...questionsFromSlides(slides, row.title ?? 'this lesson').map(q => ({ ...q, flagged })))
  }
  return { questions: dedupe(questions), lessonsDone: passed.length, lessonsTotal: modules.length }
}

/** How long a run is, and how many earn the stamp: five and four, or the same share of a shorter page. */
export function checkShape(poolSize: number): { length: number; passMark: number } {
  const length = Math.min(STAGE_QUIZ_LENGTH, Math.max(0, poolSize))
  return { length, passMark: length === 0 ? 0 : Math.ceil((length * STAGE_QUIZ_PASS) / STAGE_QUIZ_LENGTH) }
}

/**
 * Marks a run on the server. Each posted answer counts once, only when its
 * question is in the pool and the chosen text is that question's right answer
 * (options are shuffled on the phone, so the text is what is compared).
 */
export function markStageCheck(
  pool: StageQuizQuestion[],
  answers: { question: string; chosen: string }[],
): { right: number; total: number; passed: boolean; marked: { question: string; chosen: string; correct: boolean }[] } {
  const byQ = new Map(pool.map(q => [q.q.trim(), q]))
  const seen = new Set<string>()
  const marked: { question: string; chosen: string; correct: boolean }[] = []
  for (const a of answers) {
    const key = a.question.trim()
    const q = byQ.get(key)
    if (!q || seen.has(key)) continue
    seen.add(key)
    marked.push({ question: key, chosen: a.chosen, correct: a.chosen.trim() === (q.options[q.answer] ?? '').trim() })
  }
  const { length, passMark } = checkShape(pool.length)
  const right = Math.min(marked.filter(m => m.correct).length, length)
  return { right, total: length, passed: length > 0 && marked.length >= length && right >= passMark, marked }
}
