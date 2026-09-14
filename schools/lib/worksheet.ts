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

/** The cards a sheet can hold, by the print register: the first sheet
 *  carries the header, so it holds one fewer. Reception cards are three faces
 *  in crayon sized circles, so three a sheet at every position. */
export const SHEET_CAPACITY: Record<'bouncy' | 'playful' | 'level' | 'still', { first: number; rest: number }> = {
  bouncy: { first: 3, rest: 3 },
  playful: { first: 3, rest: 3 },
  level: { first: 4, rest: 5 },
  still: { first: 4, rest: 5 },
}

/** Split the cards into sheets that each fit, spread evenly so no sheet
 *  carries a single card while the one before it is full. Every sheet then
 *  keeps its footer at its foot (the design council, 14 September 2026). */
export function splitSheets<T>(items: T[], cap: { first: number; rest: number }): T[][] {
  if (items.length === 0) return [[]]
  const sheets = items.length <= cap.first ? 1 : 1 + Math.ceil((items.length - cap.first) / cap.rest)
  const base = Math.floor(items.length / sheets)
  const extra = items.length % sheets
  // The later sheets have more room, so they take the remainder.
  const sizes = Array.from({ length: sheets }, (_, i) => base + (i >= sheets - extra ? 1 : 0))
  const out: T[][] = []
  let at = 0
  for (const size of sizes) { out.push(items.slice(at, at + size)); at += size }
  return out
}
