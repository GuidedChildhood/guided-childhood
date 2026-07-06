// Slide shapes for the interactive lesson player. Mirrors the JSONB contract
// documented in supabase/migrations/017_lesson_slides.sql (v1) and extended
// by 031_lesson_v2_reference.sql (v2). A lesson with a non null slides array
// renders in the player; without one it falls back to the four section text
// layout.
//
// v2 additions (the "proper lesson" pass, JP directive 6 Jul 2026):
//  - every slide can carry `script`: the teacher's word for word script for
//    that moment, shown in the teacher script panel, never on the projector
//    by default
//  - `objective`: the purpose slide (what pupils gain, why it matters), the
//    thing Ofsted deep dives actually ask pupils about
//  - `keywords`: tier 2/3 vocabulary with pupil friendly definitions
//  - `scenario`: a realistic social feed post rendered on screen, the raw
//    material pupils run their checks against
//  - `diagram`: an animated flow diagram built from steps, no images needed
//  - `digi`: the animated DiGi closing, the star speaking the lesson home

type SlideBase = {
  // Word for word teacher script for this slide. Optional on every type.
  script?: string
}

export type TitleSlide = SlideBase & {
  type: 'title'
  eyebrow?: string
  title: string
  body?: string
}

export type ObjectiveSlide = SlideBase & {
  type: 'objective'
  // The pupil voice outcome, Oak convention: "I can..."
  outcome: string
  // Why this lesson exists, one or two sentences, pupil facing.
  why: string
  // What pupils will be able to do by the end, shown as ticks.
  gains: string[]
}

export type KeywordsSlide = SlideBase & {
  type: 'keywords'
  heading?: string
  words: { word: string; meaning: string }[]
}

export type ConceptSlide = SlideBase & {
  type: 'concept'
  heading: string
  body: string
  emoji?: string
}

export type QuoteSlide = SlideBase & {
  type: 'quote'
  label?: string
  text: string
}

export type ChoiceOption = {
  text: string
  correct: boolean
  feedback: string
}

export type ChoiceSlide = SlideBase & {
  type: 'choice'
  question: string
  options: ChoiceOption[]
}

// A realistic feed post pupils investigate. Rendered as a phone style card.
export type ScenarioSlide = SlideBase & {
  type: 'scenario'
  label?: string // eyebrow, defaults to "Evidence"
  platform?: 'feed' | 'message' // feed post or messaging app style
  handle: string // account name shown bold
  avatar: string // emoji standing in for the profile picture
  meta?: string // "2h · Shared 41,000 times" style line
  text: string // the post body
  image?: string // large emoji standing in for the post image
  stats?: string // "❤ 89.2K   ↻ 41K   💬 12K" style engagement line
  prompt?: string // the question the class answers about this post
}

export type DiagramSlide = SlideBase & {
  type: 'diagram'
  heading: string
  caption?: string
  // Steps render as an animated flow, top to bottom with connectors.
  steps: { emoji: string; title: string; text?: string }[]
  // Optional verdict chips rendered after the flow (believe / pause / do not share).
  verdicts?: string[]
}

export type TryItSlide = SlideBase & {
  type: 'tryit'
  heading: string
  body: string
}

export type RecapSlide = SlideBase & {
  type: 'recap'
  heading: string
  points: string[]
}

// A DiGi Squad video beat: the character explains the idea to a class,
// produced in Higgsfield, hosted at a plain mp4 URL.
export type VideoSlide = SlideBase & {
  type: 'video'
  src: string
  caption?: string
  poster?: string
}

// The animated closing: DiGi (the golden star, always) speaks the lesson
// home, one bubble at a time. Pure CSS and GSAP, no render pipeline needed.
export type DigiSlide = SlideBase & {
  type: 'digi'
  heading?: string
  lines: string[]
}

export type LessonSlide =
  | TitleSlide
  | ObjectiveSlide
  | KeywordsSlide
  | ConceptSlide
  | QuoteSlide
  | ChoiceSlide
  | ScenarioSlide
  | DiagramSlide
  | TryItSlide
  | RecapSlide
  | VideoSlide
  | DigiSlide

const SLIDE_TYPES = new Set([
  'title', 'objective', 'keywords', 'concept', 'quote', 'choice',
  'scenario', 'diagram', 'tryit', 'recap', 'video', 'digi',
])

// Defensive parse: slides come from a JSONB column, so a malformed row should
// fall back to the text layout rather than crash the page.
export function parseSlides(raw: unknown): LessonSlide[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const valid = raw.every(
    s => s && typeof s === 'object' && SLIDE_TYPES.has((s as { type?: string }).type ?? '')
  )
  return valid ? (raw as LessonSlide[]) : null
}
