// THE WORKSHEET ITEMS, IN ONE SHAPE.
//
// Two shapes reached the printables: the database authored modules carry
// `{ n, item, expected_verdict, teaching_point }`, and the four JSON authored
// modules (ks2-23, ks2-25, ks3-22, ks3-24) carry `{ n, stem, text }`, a card
// with a sentence stem the child completes rather than a verdict a teacher
// marks. The booklet and the pack read `item` and printed the second shape as
// empty cards (found on the KS2 render of 14 September 2026). One reader,
// both shapes, the same rule as the quiz banks (schools/lib/quiz.ts).

export type WorksheetItem = {
  n: number
  /** The card as the child reads it. */
  item: string
  /** A sentence stem to complete, where the module writes one. */
  stem?: string
  /** The verdict a teacher marks against, where the module writes one. */
  expected_verdict?: string
  teaching_point?: string
}

type Raw = { n?: number; item?: string; text?: string; stem?: string; expected_verdict?: string; teaching_point?: string }

export function worksheetItems(notes: { worksheet_items?: unknown } | null | undefined): WorksheetItem[] {
  const raw = notes?.worksheet_items
  if (!Array.isArray(raw)) return []
  return (raw as Raw[])
    .map((r, i) => ({
      n: typeof r.n === 'number' ? r.n : i + 1,
      item: (r.item ?? r.text ?? '').trim(),
      stem: r.stem?.trim() || undefined,
      expected_verdict: r.expected_verdict?.trim() || undefined,
      teaching_point: r.teaching_point?.trim() || undefined,
    }))
    .filter(it => it.item.length > 0)
}

/** Whether an answer key can be printed: at least one card carries a verdict. */
export const hasAnswerKey = (items: WorksheetItem[]) => items.some(it => it.expected_verdict)
