import type { createClient } from '@/lib/supabase/server'
import type { createAdminClient } from '@/lib/supabase/admin'

// The per question answer store (migration 239): what came off the wire,
// scrubbed; how it lands, best effort; and how the stage check reads it
// back. The page always wins over the ledger, same doctrine as
// lib/events/record.ts: a failed insert here must never cost a family a
// pass, a stamp or even an error toast.

type AnySupabase =
  | Awaited<ReturnType<typeof createClient>>
  | ReturnType<typeof createAdminClient>

export type AnswerRow = {
  question: string
  chosen: string
  correct: boolean
}

const MAX_ANSWERS = 40
const MAX_TEXT = 500

/**
 * The client's answers array, validated down to what we store. Anything
 * malformed is dropped row by row rather than rejecting the request: the
 * completion write these ride beside is the thing that matters.
 */
export function sanitizeAnswers(raw: unknown): AnswerRow[] {
  if (!Array.isArray(raw)) return []
  const out: AnswerRow[] = []
  for (const item of raw.slice(0, MAX_ANSWERS)) {
    if (!item || typeof item !== 'object') continue
    const a = item as { question?: unknown; chosen?: unknown; correct?: unknown }
    if (typeof a.question !== 'string' || !a.question.trim()) continue
    out.push({
      question: a.question.trim().slice(0, MAX_TEXT),
      chosen: typeof a.chosen === 'string' ? a.chosen.trim().slice(0, MAX_TEXT) : '',
      correct: a.correct === true,
    })
  }
  return out
}

/**
 * Land the answers, best effort. Batch first; if the batch fails (most
 * likely a database the migration has not reached), give up quietly.
 */
export async function recordQuestionAnswers(
  supabase: AnySupabase,
  facts: {
    userId: string
    childId: string | null
    source: 'lesson' | 'ai_lesson' | 'school_lesson' | 'stage_check'
    lessonId?: string | null
    stageId?: number | null
  },
  answers: AnswerRow[],
): Promise<void> {
  if (answers.length === 0) return
  try {
    await supabase.from('lesson_question_answers').insert(
      answers.map(a => ({
        user_id: facts.userId,
        child_id: facts.childId,
        source: facts.source,
        lesson_id: facts.lessonId ?? null,
        stage_id: facts.stageId ?? null,
        question: a.question,
        chosen: a.chosen,
        correct: a.correct,
      })),
    )
  } catch { /* the page always wins over the ledger */ }
}

// ── Reading it back: the stage check's ordering ─────────────────────────────

export type AnswerFact = { question: string; correct: boolean }

const norm = (q: string) => q.trim().toLowerCase()

/**
 * Order a stage quiz pool by this child's history: questions whose most
 * recent answer was WRONG first (the ones retrieval practice exists for),
 * questions never met second (coverage), questions already held last.
 * Shuffled within each group so two runs differ, but the groups hold.
 *
 * `facts` must arrive newest first (the query orders answered_at desc);
 * the first fact seen for a question is its latest answer.
 */
export function orderPoolByHistory<T extends { q: string }>(
  pool: T[],
  facts: AnswerFact[],
): T[] {
  const latest = new Map<string, boolean>()
  for (const f of facts) {
    const key = norm(f.question)
    if (!latest.has(key)) latest.set(key, f.correct)
  }
  const missed: T[] = []
  const unmet: T[] = []
  const held: T[] = []
  for (const q of pool) {
    const l = latest.get(norm(q.q))
    if (l === false) missed.push(q)
    else if (l === undefined) unmet.push(q)
    else held.push(q)
  }
  return [...shuffle(missed), ...shuffle(unmet), ...shuffle(held)]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * This child's answer history for ordering, newest first, scoped the way
 * every per child read is: the child's own rows plus the household's null
 * rows. Fails soft to empty, which leaves the pool in gathered order.
 */
export async function fetchAnswerFacts(
  supabase: AnySupabase,
  userId: string,
  childId: string | null,
): Promise<AnswerFact[]> {
  try {
    let q = supabase
      .from('lesson_question_answers')
      .select('question, correct, child_id')
      .eq('user_id', userId)
      .order('answered_at', { ascending: false })
      .limit(500)
    if (childId) q = q.or(`child_id.eq.${childId},child_id.is.null`)
    const { data } = await q
    return ((data ?? []) as { question: string; correct: boolean }[])
      .map(r => ({ question: r.question, correct: r.correct }))
  } catch {
    return []
  }
}
