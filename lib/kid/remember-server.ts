// THE REMEMBER CHECK, READ AND MARKED ON THE SERVER (see lib/kid/remember-due.ts).
//
// One question per due lesson, from the child's own kid deck (the standalone
// choice slides the big check also draws on), the one they last got wrong
// first. The route rebuilds the same questions and marks each posted answer
// against them; the phone's own tally is never read. No stars, no stamp: it is
// the record of what the child kept, and it is what lets the passport say so.

import type { SupabaseClient } from '@supabase/supabase-js'
import { parseSlides, visibleSlides } from '@gc/shared/lesson-slides'
import { FLAGGED_MODULES } from '@gc/shared/schools-curriculum'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { questionsFromSlides } from '@/lib/pathway/stage-quiz-gather'
import { fetchAnswerFacts, orderPoolByHistory } from '@/lib/lessons/answers'
import type { StageQuizQuestion } from '@/lib/content/stage-quizzes'
import { rememberDue, type RememberPass } from './remember-due'

export type RememberQuestion = StageQuizQuestion & { lessonId: string; lessonTitle: string; flagged: boolean }

/** The lessons due a Remember check now, without reading any decks: cheap enough for a list or a card. */
export async function loadRememberDue(
  db: Pick<SupabaseClient, 'from'>,
  args: { userId: string; childId: string; now?: Date },
): Promise<string[]> {
  try {
    const [{ data: passRows }, { data: askedRows }] = await Promise.all([
      db.from('lesson_completions').select('lesson_id, completed_at')
        .eq('user_id', args.userId).eq('child_id', args.childId).eq('lesson_source', 'school_lesson').eq('passed', true),
      db.from('lesson_question_answers').select('lesson_id, answered_at')
        .eq('user_id', args.userId).eq('child_id', args.childId).eq('source', 'remember')
        .order('answered_at', { ascending: false }).limit(400),
    ])
    const passes: RememberPass[] = ((passRows ?? []) as { lesson_id: string; completed_at: string | null }[])
      .filter(r => r.completed_at).map(r => ({ lessonId: r.lesson_id, passedAt: r.completed_at as string }))
    const lastAsked = new Map<string, string>()
    for (const r of (askedRows ?? []) as { lesson_id: string | null; answered_at: string }[]) {
      if (r.lesson_id && !lastAsked.has(r.lesson_id)) lastAsked.set(r.lesson_id, r.answered_at)
    }
    return rememberDue({ passes, lastAsked, now: args.now })
  } catch { return [] }
}

/** What the child kept: right of asked on Remember checks in the last 90 days. Null under three answers. */
export async function rememberKept(
  db: Pick<SupabaseClient, 'from'>,
  args: { userId: string; childId: string },
): Promise<{ right: number; asked: number } | null> {
  try {
    const since = new Date(Date.now() - 90 * 86400000).toISOString()
    const { data } = await db.from('lesson_question_answers').select('correct')
      .eq('user_id', args.userId).eq('child_id', args.childId).eq('source', 'remember').gte('answered_at', since)
    const rows = (data ?? []) as { correct: boolean }[]
    if (rows.length < 3) return null
    return { right: rows.filter(r => r.correct).length, asked: rows.length }
  } catch { return null }
}

export async function loadRememberCheck(
  admin: SupabaseClient,
  args: { userId: string; childId: string; now?: Date },
): Promise<{ due: string[]; questions: RememberQuestion[] }> {
  const [{ data: passRows }, { data: askedRows }] = await Promise.all([
    admin.from('lesson_completions').select('lesson_id, completed_at')
      .eq('user_id', args.userId).eq('child_id', args.childId).eq('lesson_source', 'school_lesson').eq('passed', true),
    admin.from('lesson_question_answers').select('lesson_id, answered_at')
      .eq('user_id', args.userId).eq('child_id', args.childId).eq('source', 'remember')
      .order('answered_at', { ascending: false }).limit(400),
  ])
  const passes: RememberPass[] = ((passRows ?? []) as { lesson_id: string; completed_at: string | null }[])
    .filter(r => r.completed_at).map(r => ({ lessonId: r.lesson_id, passedAt: r.completed_at as string }))
  const lastAsked = new Map<string, string>()
  for (const r of (askedRows ?? []) as { lesson_id: string | null; answered_at: string }[]) {
    if (r.lesson_id && !lastAsked.has(r.lesson_id)) lastAsked.set(r.lesson_id, r.answered_at)
  }
  const due = rememberDue({ passes, lastAsked, now: args.now })
  if (!due.length) return { due, questions: [] }

  const facts = await fetchAnswerFacts(admin, args.userId, args.childId)
  const questions: RememberQuestion[] = []
  for (const lessonId of due) {
    const row = await getStarLesson(admin as never, lessonId, 'id, title, module_id, slides').catch(() => null) as
      { id: string; title?: string; module_id?: string | null; slides?: unknown } | null
    if (!row) continue
    const slides = visibleSlides(parseSlides(row.slides), 'kid')?.slides ?? null
    if (!slides) continue
    const pool = questionsFromSlides(slides, row.title ?? 'this lesson')
    const first = orderPoolByHistory(pool, facts)[0]
    if (!first) continue
    questions.push({
      ...first, lessonId, lessonTitle: row.title ?? 'An earlier lesson',
      flagged: !!row.module_id && FLAGGED_MODULES.some(f => f.moduleId === row.module_id),
    })
  }
  return { due, questions }
}

/** Marks a Remember run against the questions the server served. Each lesson once. */
export function markRemember(
  questions: RememberQuestion[],
  answers: { question: string; chosen: string }[],
): { right: number; total: number; marked: { lessonId: string; question: string; chosen: string; correct: boolean }[] } {
  const byQ = new Map(questions.map(q => [q.q.trim(), q]))
  const seen = new Set<string>()
  const marked: { lessonId: string; question: string; chosen: string; correct: boolean }[] = []
  for (const a of answers) {
    const q = byQ.get(a.question.trim())
    if (!q || seen.has(q.lessonId)) continue
    seen.add(q.lessonId)
    marked.push({ lessonId: q.lessonId, question: q.q, chosen: a.chosen, correct: a.chosen.trim() === (q.options[q.answer] ?? '').trim() })
  }
  return { right: marked.filter(m => m.correct).length, total: questions.length, marked }
}
