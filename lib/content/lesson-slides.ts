// Slide shapes for the interactive lesson player. Mirrors the JSONB contract
// documented in supabase/migrations/017_lesson_slides.sql. A lesson with a
// non null slides array renders in the player; without one it falls back to
// the four section text layout.

export type TitleSlide = {
  type: 'title'
  eyebrow?: string
  title: string
  body?: string
}

export type ConceptSlide = {
  type: 'concept'
  heading: string
  body: string
  emoji?: string
}

export type QuoteSlide = {
  type: 'quote'
  label?: string
  text: string
}

export type ChoiceOption = {
  text: string
  correct: boolean
  feedback: string
}

export type ChoiceSlide = {
  type: 'choice'
  question: string
  options: ChoiceOption[]
}

export type TryItSlide = {
  type: 'tryit'
  heading: string
  body: string
}

export type RecapSlide = {
  type: 'recap'
  heading: string
  points: string[]
}

export type LessonSlide =
  | TitleSlide
  | ConceptSlide
  | QuoteSlide
  | ChoiceSlide
  | TryItSlide
  | RecapSlide

const SLIDE_TYPES = new Set(['title', 'concept', 'quote', 'choice', 'tryit', 'recap'])

// Defensive parse: slides come from a JSONB column, so a malformed row should
// fall back to the text layout rather than crash the page.
export function parseSlides(raw: unknown): LessonSlide[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const valid = raw.every(
    s => s && typeof s === 'object' && SLIDE_TYPES.has((s as { type?: string }).type ?? '')
  )
  return valid ? (raw as LessonSlide[]) : null
}
