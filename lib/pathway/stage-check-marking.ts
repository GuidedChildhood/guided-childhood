// MARKING THE CHILD'S BIG CHECK, PURE (see lib/pathway/child-stage-check.ts).
//
// On its own so scripts/check-passport-pass.mjs can run it in the guards job,
// which installs nothing: no database client, no catalogue, only the run's
// length and pass mark and the pool the server served.

import { STAGE_QUIZ_LENGTH, STAGE_QUIZ_PASS, type StageQuizQuestion } from '../content/stage-quizzes'

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
