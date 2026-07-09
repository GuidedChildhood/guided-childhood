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

// The five phases of the 60 minute arc. Shown as the phase strip in the
// player so the lesson's shape is visible at a glance (Oak convention:
// starter quiz, exposition cycles, practice, exit quiz).
export type LessonPhase = 'starter' | 'teach' | 'practise' | 'prove' | 'close'

export const PHASE_LABELS: Record<LessonPhase, string> = {
  starter: 'Starter',
  teach: 'Teach',
  practise: 'Practise',
  prove: 'Prove it',
  close: 'Close',
}

export const PHASE_ORDER: LessonPhase[] = ['starter', 'teach', 'practise', 'prove', 'close']

type SlideBase = {
  // Word for word teacher script for this slide. Optional on every type.
  script?: string
  // Which part of the lesson arc this slide belongs to (v3).
  phase?: LessonPhase
  // Rough minutes this slide takes, shown as the timing chip (v3).
  minutes?: number
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

// A timed talk task: think pair share, group talk, or whole class.
// The player runs the countdown so pacing takes care of itself.
export type DiscussionSlide = SlideBase & {
  type: 'discussion'
  prompt: string
  mode?: 'pairs' | 'groups' | 'class'
  seconds?: number // countdown length, defaults to 60
  lookFor?: string // what a good answer sounds like, shown after the timer
}

// One big number and where it comes from. The evidence register: honest,
// sourced, never a scare tactic.
export type StatSlide = SlideBase & {
  type: 'stat'
  figure: string // the big number as displayed, e.g. "9 in 10"
  claim: string // what the number says
  source: string // where it comes from, always shown
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
  | DiscussionSlide
  | StatSlide
  | TryItSlide
  | RecapSlide
  | VideoSlide
  | DigiSlide

const SLIDE_TYPES = new Set([
  'title', 'objective', 'keywords', 'concept', 'quote', 'choice',
  'scenario', 'diagram', 'discussion', 'stat', 'tryit', 'recap', 'video', 'digi',
])

// Defensive parse: slides come from a JSONB column, so a malformed row
// should fall back gracefully rather than crash the page. Unknown slide
// types are SKIPPED, not fatal: when the database is ahead of a deploy
// (a migration lands before the code that renders a new type), the lesson
// still plays with every slide this build understands. Only a deck with
// nothing recognisable returns null.
export function parseSlides(raw: unknown): LessonSlide[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null
  const known = raw.filter(
    s => s && typeof s === 'object' && SLIDE_TYPES.has((s as { type?: string }).type ?? '')
  )
  return known.length > 0 ? (known as LessonSlide[]) : null
}

// Build a slide deck from a parent lesson's own content when it has no
// authored deck. Every parent lesson already carries the four parts (the
// idea, why it matters, try this, the key message), so this turns the flat
// text layout into the interactive player: one part per slide, a title to
// open, DiGi to close. Authored decks always win; this is only the fallback
// so that every lesson plays as slides, not a wall of text. Returns null
// when there is genuinely no content to build from.
export function autoSlidesFromLesson(
  lesson: {
    title: string
    the_idea?: string | null
    why_it_matters?: string | null
    try_this?: string | null
    key_message?: string | null
  },
  opts?: { eyebrow?: string },
): LessonSlide[] | null {
  const idea = (lesson.the_idea ?? '').trim()
  const why = (lesson.why_it_matters ?? '').trim()
  const tryThis = (lesson.try_this ?? '').trim()
  const key = (lesson.key_message ?? '').trim()
  if (!idea && !why && !tryThis && !key) return null

  const slides: LessonSlide[] = [
    { type: 'title', eyebrow: opts?.eyebrow, title: lesson.title },
  ]
  if (idea) slides.push({ type: 'concept', heading: 'The idea', body: idea })
  if (why) slides.push({ type: 'concept', heading: 'Why it matters', body: why })
  if (tryThis) slides.push({ type: 'tryit', heading: 'Try this tonight', body: tryThis })
  if (key) slides.push({ type: 'digi', heading: 'Remember', lines: [key] })
  return slides
}
