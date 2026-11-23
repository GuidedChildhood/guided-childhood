// THE THREE LEVELS OF A PUPIL BOOKLET (23 November 2026).
//
// Taken from how the French scheme is built: every activity comes in three
// versions, Expected, Adapted and Inclusion, so a teacher can hand each pupil
// the sheet that lets them take part, from the same lesson, in the same
// order. Justin's note of 23 November and plans/2026-11-23-booklet-levels-plan.md.
//
// Generated from the lesson row, so all 34 modules get all three with nothing
// typed twice:
//   expected   the booklet as it was: a verdict and a written reason per card
//   adapted    the same cards, a word box at the top, and the reason sentence
//              already started, so the pupil finishes it rather than starts it
//   inclusion  the first four cards only, big choices to point at and colour,
//              no writing, done with an adult; the mission is a drawing
//
// Pure, so it can be tested without a database.

import type { WorksheetItem } from './worksheet'

export type BookletLevel = 'expected' | 'adapted' | 'inclusion'
export const LEVELS: BookletLevel[] = ['expected', 'adapted', 'inclusion']
export const LEVEL_LABEL: Record<BookletLevel, string> = {
  expected: 'Expected',
  adapted: 'Adapted',
  inclusion: 'Inclusion',
}
export const LEVEL_NOTE: Record<BookletLevel, string> = {
  expected: 'The whole booklet, with a reason written for every card',
  adapted: 'A word box, and every reason sentence already started',
  inclusion: 'Four cards, point and colour, no writing, with an adult',
}

/** The level a ?level= value names, Expected for anything else. */
export function parseLevel(raw: unknown): BookletLevel {
  const v = Array.isArray(raw) ? raw[0] : raw
  return v === 'adapted' || v === 'inclusion' ? v : 'expected'
}

/** How many cards the Inclusion booklet keeps: a whole lesson of cards is too
 *  much for a pupil who needs it, and the first four carry the idea. */
export const INCLUSION_CARDS = 4

export function itemsFor(level: BookletLevel, items: WorksheetItem[]): WorksheetItem[] {
  return level === 'inclusion' ? items.slice(0, INCLUSION_CARDS) : items
}

/** The reason line on an Adapted card: the card's own stem, with the start of
 *  the sentence written in. A card that brings its own stem keeps it. */
export function startedReason(item: WorksheetItem): string {
  if (item.stem) return item.stem.replace(/\.\.\.$|…$/, '').trim()
  return 'I think this because'
}

/** The word box on an Adapted booklet: the verdicts the pupil chooses
 *  between, then the lesson's own key words, eight at most, no repeats. */
export function wordBox(verdicts: string[], keywords: { word?: string }[] | undefined): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const w of [...verdicts, ...(keywords ?? []).map(k => k.word ?? '')]) {
    const t = w.trim()
    const key = t.toLowerCase()
    if (!t || seen.has(key)) continue
    seen.add(key)
    out.push(t)
    if (out.length >= 8) break
  }
  return out
}
