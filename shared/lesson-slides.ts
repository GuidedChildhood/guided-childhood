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

// The six phases of a lesson, always in this order, rendered as the phase
// strip across the top of the player (plans/lesson-standard-plan.md).
//
// Five of them are Rosenshine: retrieval, small steps, guided then
// independent practice, checking for understanding. `connect` is the sixth
// and it is borrowed from Jigsaw, who put Connect us and Calm me before any
// content. Rosenshine has nothing to say about that because Rosenshine is
// about explicit instruction of academic material, and our subject is one
// where children are asked to talk about themselves. A class that has not
// settled cannot safely be asked whether anything frightening happened on a
// screen this week, so the settle is part of the teaching, not a warm up to
// it.
//
// `connect` was added last, on purpose, at the FRONT of the order rather
// than by renumbering: every existing slide keeps the phase it already had,
// and nothing in the twenty one live lessons needed rewriting.
export type LessonPhase = 'connect' | 'starter' | 'teach' | 'practise' | 'prove' | 'close'

// What a teacher and an observing head see on the strip.
export const PHASE_LABELS: Record<LessonPhase, string> = {
  connect: 'Connect',
  starter: 'Recall',
  teach: 'Teach',
  practise: 'Practise',
  prove: 'Prove',
  close: 'Reflect',
}

export const PHASE_ORDER: LessonPhase[] = ['connect', 'starter', 'teach', 'practise', 'prove', 'close']

// One named learning cycle, from teacher_notes.cycles (migration 268).
//
// The shape is Common Sense's, who publish a verb, a title and a runtime for
// every section of every lesson; Oak specifies learning cycles in its own
// authoring guide but does not publish them on the lesson page, so this is
// the half of the idea that was actually visible to copy. The verb matters:
// it tells a pupil what they will be DOING, where an outcome only tells them
// what they will know afterwards.
//
// `minutes` is the same budget the lesson's timing string already states, and
// migration 268 checked that a module's cycle minutes sum to its stated
// teaching minutes. The player uses them to work out which cycle a slide sits
// in rather than being told, so a deck cannot claim a shape it does not have.
export type LessonCycle = {
  verb: string
  title: string
  outcome: string
  minutes: number
}

// The one thing a class leaves with, already carried by every module in
// teacher_notes.tool and already printed on the poster and the organiser. It
// was never shown inside the player, which is how ks3-12 ended up asking
// "which check does that feeling trigger?" with options reading "Check three"
// and "Check one only" while the three checks themselves were nine slides
// back and off screen. A question a class cannot answer without remembering a
// list is testing memory for the list, not the thinking.
export type LessonTool = {
  heading?: string
  strapline?: string
  lines: string[]
}

// THE ANSWER BEAT, as pure state so it can be argued with in a test rather
// than only in a browser.
//
// A wrong first pick does not end the question. It says why THAT option fails,
// leaves the answer hidden and the others live, and the class gets one more
// go. The second pick settles it either way, and settling always reveals the
// right answer with its reasoning, found or not, so nobody leaves the slide
// without hearing the why.
//
// Indices here are DISPLAY indices, after the per run shuffle, because that is
// what a pupil actually taps.
export type OptionState =
  | 'idle'   // untouched and still tappable
  | 'right'  // the correct answer, revealed
  | 'wrong'  // tapped and wrong
  | 'dead'   // never tapped, wrong, and the question is over

export function answerBeat(correctIndex: number, optionCount: number, tries: number[]) {
  const foundIt = tries.includes(correctIndex)
  // A true or false slide gets no retry. With one option left, "try again" is
  // a forced tap that hands over the answer by elimination, which is worse
  // than simply showing it and saying why.
  const retryWorthHaving = optionCount > 2
  const settled = foundIt || tries.length >= 2 || (tries.length >= 1 && !retryWorthHaving)
  const retrying = !settled && tries.length === 1
  const states: OptionState[] = Array.from({ length: optionCount }, (_, i) => {
    if (i === correctIndex) return settled ? 'right' : 'idle'
    if (tries.includes(i)) return 'wrong'
    return settled ? 'dead' : 'idle'
  })
  return { settled, retrying, states }
}

// The same phases wearing Rosenshine openly, for the quiet mono label on an
// individual slide. `starter` says Retrieval here rather than Recall because
// this is the label aimed at the adult who knows the literature, and
// retrieval practice is the term they will be looking for.
export const ROSENSHINE_LABELS: Record<LessonPhase, string> = {
  connect: 'Connect',
  starter: 'Retrieval',
  teach: 'Teach',
  practise: 'Practise',
  prove: 'Prove',
  close: 'Reflect',
}

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
  // Which intro character clip plays: football, dance or celebrate. When
  // absent the intro picks one from the title.
  character?: string
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
  // Show the lesson's tool under the question, for a question whose options
  // refer to it by name or number. Opt in per slide rather than automatic:
  // most choice slides stand on their own and a strip on all of them would be
  // wallpaper by the third one.
  toolStrip?: boolean
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
  // Eyebrow, defaults to "Try it tonight". In the parents app a tryit really
  // is homework, so that default is right there. In school every one of them
  // sits in the practise phase, mid lesson, and the wall was telling a class
  // to do tonight the thing they had worksheets out for (migration 276).
  label?: string
  heading: string
  body: string
}

export type RecapSlide = SlideBase & {
  type: 'recap'
  heading: string
  points: string[]
}

// The accessible alternative to a video beat (migration 271).
//
// Not called `transcript`, because half of our beats have nothing to
// transcribe. The four primary clips were authored with no dialogue at all,
// so a lone transcript field would render them empty and let us call the
// accessibility job done while a pupil still got nothing. What a video
// actually locks away is two separate things, and a pupil can be shut out
// of either one: a deaf pupil loses the words, a blind or low vision pupil
// loses the action and the writing on the board behind the character.
export type VideoAlternative = {
  // What is said, in order, one entry per continuous run of speech. An
  // empty array is a statement rather than a gap: nothing is said in this
  // clip, and the player says so out loud instead of showing a blank panel.
  spoken: string[]
  // What happens on screen. On a silent clip this is the whole content of
  // the beat, which is why it is required and not optional.
  described: string
  // Words shown on screen. They are pixels: without this field they reach
  // nobody using a screen reader and survive into no printout.
  onScreen?: string
}

// A DiGi Squad video beat: the character explains the idea to a class,
// produced in Higgsfield, hosted at a plain mp4 URL.
export type VideoSlide = SlideBase & {
  type: 'video'
  src: string
  caption?: string
  poster?: string
  // Present on every wired beat since migration 271. Optional on the type
  // because a deck written before it, or by hand tomorrow, must still play.
  alternative?: VideoAlternative
}

// The animated closing: DiGi (the golden star, always) speaks the lesson
// home, one bubble at a time. Pure CSS and GSAP, no render pipeline needed.
export type DigiSlide = SlideBase & {
  type: 'digi'
  heading?: string
  lines: string[]
}

// The eighth slide type: a named animated interaction. The row names a
// component key (verdict-sort, signal-meter, star-breath, ...) and passes
// config; the component code lives in components/lessons/interactives.
// Every interaction is tap based, GSAP only, with a paper twin in the
// teacher notes for the no device room.
export type InteractiveSlide = SlideBase & {
  type: 'interactive'
  component: string
  config?: Record<string, unknown>
  caption?: string
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
  | InteractiveSlide

const SLIDE_TYPES = new Set([
  'title', 'objective', 'keywords', 'concept', 'quote', 'choice',
  'scenario', 'diagram', 'discussion', 'stat', 'tryit', 'recap', 'video', 'digi', 'interactive',
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
// One authored choice slide off a lesson row, validated before it is trusted.
// Anything malformed returns null and the generated check runs instead, so a
// half written question can never leave a lesson with no check at all.
function authoredQuiz(raw: unknown): ChoiceSlide | null {
  if (!raw || typeof raw !== 'object') return null
  const q = raw as { type?: unknown; question?: unknown; options?: unknown; phase?: unknown }
  if (q.type !== 'choice' || typeof q.question !== 'string' || !q.question.trim()) return null
  if (!Array.isArray(q.options) || q.options.length < 2) return null

  const options: ChoiceOption[] = []
  for (const o of q.options) {
    if (!o || typeof o !== 'object') return null
    const opt = o as { text?: unknown; correct?: unknown; feedback?: unknown }
    if (typeof opt.text !== 'string' || !opt.text.trim()) return null
    options.push({
      text: opt.text,
      correct: opt.correct === true,
      feedback: typeof opt.feedback === 'string' ? opt.feedback : '',
    })
  }
  // Exactly one right answer, or it cannot be graded.
  if (options.filter(o => o.correct).length !== 1) return null

  return { type: 'choice', phase: 'prove', question: q.question, options }
}

export function autoSlidesFromLesson(
  lesson: {
    title: string
    the_idea?: string | null
    why_it_matters?: string | null
    try_this?: string | null
    key_message?: string | null
    // An authored prove check for this lesson (migration 161, ai_lessons.quiz).
    // Used in place of the generated one below when present.
    quiz?: unknown
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

  // A prove check before the close, so a lesson can never be passed by tapping
  // straight through: the score gate has a real question to grade. The
  // takeaway from the lesson is the right answer, sat among two plausible but
  // wrong readings, so finishing means engaging with the idea, not clicking
  // past it. Authored decks bring their own richer questions; this is the
  // floor for the lighter, text only lessons that had none.
  // An authored question always wins. The generated one below asks the same
  // thing of every lesson with the same two wrong answers, so a reader meeting
  // it repeatedly learns the shape of the answer rather than the idea. Where a
  // lesson has been given its own question, that is the check.
  const authored = authoredQuiz(lesson.quiz)
  if (authored) {
    slides.push(authored)
    if (key) slides.push({ type: 'digi', heading: 'Remember', lines: [key] })
    return slides
  }

  const takeaway = (key || idea || why).replace(/\s+/g, ' ').trim()
  if (takeaway) {
    const short = takeaway.length > 128 ? `${takeaway.slice(0, 122).replace(/[\s,.;:]+\S*$/, '')}…` : takeaway
    slides.push({
      type: 'choice',
      phase: 'prove',
      question: 'Before you finish, show what stuck. Which one is the big idea here?',
      options: [
        { text: short, correct: true, feedback: 'Yes. That is exactly it.' },
        { text: 'It is best to keep what happens online a secret from a grown up.', correct: false, feedback: 'Not this one. A grown up you trust is always the safe person to tell.' },
        { text: 'None of this really matters, so you can ignore it.', correct: false, feedback: 'Not this one. Have another look and pick again.' },
      ],
    })
  }

  if (key) slides.push({ type: 'digi', heading: 'Remember', lines: [key] })
  return slides
}
