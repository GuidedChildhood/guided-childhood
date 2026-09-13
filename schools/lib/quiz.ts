import type { QuizQuestion } from '@/components/QuizSheet'

// THE QUIZ BANK, IN EVERY SHAPE IT ARRIVES IN.
//
// Migration 269 wrote the two banks as plain arrays of {format, question,
// options, pairs, answer, teaching_point} on 21 modules. The four modules
// authored as JSON since (ks3-22, ks2-23, ks3-24, ks2-25) carry
// {title, instructions, questions} and each question as the compact
// multiple choice shape {q, options, answer: <index>}. The print pages called
// questions.map on the row as it came and answered 500 on those four in
// production, found by the schools review of 13 September 2026. One reader
// turns either shape into what the sheet draws; the contract check pins that
// nothing else arrives.
export type QuizBank =
  | QuizQuestion[]
  | { title?: string; instructions?: string; questions?: unknown[] }
  | null
  | undefined

type RawRow = Partial<QuizQuestion> & { q?: unknown; options?: unknown; answer?: unknown; teaching_point?: unknown }

function normalise(raw: unknown): QuizQuestion | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as RawRow
  const question = typeof row.question === 'string' ? row.question : typeof row.q === 'string' ? row.q : null
  if (!question) return null
  const options = Array.isArray(row.options) && row.options.every(o => typeof o === 'string') ? (row.options as string[]) : undefined
  const answer =
    typeof row.answer === 'string' ? row.answer
    : typeof row.answer === 'number' && options ? (options[row.answer] ?? '')
    : ''
  const format: QuizQuestion['format'] =
    row.format === 'tick_one' || row.format === 'true_false' || row.format === 'match' || row.format === 'fill_blank' || row.format === 'short_answer'
      ? row.format
      : options ? 'tick_one' : 'short_answer'
  return {
    format,
    question,
    options,
    pairs: Array.isArray(row.pairs) ? row.pairs : undefined,
    answer,
    teaching_point: typeof row.teaching_point === 'string' ? row.teaching_point : '',
  }
}

export function quizQuestions(bank: QuizBank): QuizQuestion[] {
  if (!bank) return []
  const rows: unknown[] = Array.isArray(bank) ? bank : Array.isArray(bank.questions) ? bank.questions : []
  return rows.map(normalise).filter((q): q is QuizQuestion => q !== null)
}
