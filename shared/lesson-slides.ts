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
  // THE DROPPABLE SET. A slide a teacher short of time can skip and still run
  // the whole arc, land the objective and reach the exit quiz.
  //
  // It exists because of where the minutes sit. 26 of the 29 school lessons run
  // longer than 55 minutes, and every one of them puts its prove phase, the
  // exit quiz, LAST and gives it four minutes. So a teacher who stops at the
  // bell loses one hundred per cent of the assessment and keeps all of the
  // explaining, which is exactly backwards. A reviewer heard what actually
  // happens in the room: teachers cut the last two practise slides to reach
  // the quiz, and some never reach it.
  //
  // So this is not a stopping point, it is a droppable set in the MIDDLE. Only
  // legal in the teach and practise phases: never starter, never prove, never
  // close, because the arc has to survive the cut. scripts/check-lesson-core.mjs
  // holds that rule and four others, including that the core still fits 55
  // minutes and still carries every protected phrase.
  //
  // Nothing is deleted and no minute changes. The published length stays the
  // real total of every slide, core and extension together, because that is
  // what a lesson actually contains.
  extension?: boolean
  // A slide only a child at home sees (the content PR adds them). The
  // classroom audience drops it, so a schools deploy can never show one
  // whatever order the two apps ship in.
  kid_only?: boolean
}

export type TitleSlide = SlideBase & {
  type: 'title'
  eyebrow?: string
  title: string
  body?: string
  // Which Planet Friend opens the lesson: a CharacterKey (pebble, bloop,
  // orbit, nova, cosmo, digi). The July slot names (football, dance,
  // celebrate) still resolve as aliases. When absent the intro picks one
  // from the title, which is a coin flip and why migration 296 wrote a key
  // onto every row.
  character?: string
  // The friend's hello, when a lesson wants its own words. Otherwise the
  // friend's default line from intro-characters. The DSL modules use this
  // to open quieter than DiGi's usual line.
  line?: string
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
  // A drawn Happy News icon by name (shared/components/HappyIcon.tsx), in
  // place of the emoji. Justin, 26 September 2026: "don't use the flower
  // icons, use Happy News style icons". Loose like the character fields and
  // resolved at render: a name we do not draw falls back to the emoji.
  icon?: string
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
  // A child only spare (the content PR): the prove question it stands in for,
  // by that question's text. A right answer on the spare counts for it.
  reserve_for?: string
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
  // THE POST'S ACTUAL PHOTO (18 September 2026).
  //
  // Justin, watching the sample lesson: "the sample video has bloop talking
  // and says this is hot and points but no photo we have. a funny photo as if
  // on instagram with the likes, showing bloop doing something silly."
  //
  // He was reading a real hole. ks3-12's video beat has Orbit hold a photo up
  // and say "this photo got two million shares, it is completely fake", and
  // the class was never shown any photo at all. An emoji is not a photo, so
  // `image` could not close it.
  //
  // A Planet Friend is the only subject a classroom deck can honestly put in
  // a fake: you cannot print a real person's face on a forged post and hand
  // it to thirty children. Ours is provably fake, it is funny, and the laugh
  // is the teach, because the next post is one they cannot call.
  //
  // Drawn from the friend's own cutout art, which FriendPlate already proves
  // carries a beat: no render pipeline and no credits.
  picture?: {
    // A CharacterKey (pebble, bloop, orbit, nova, cosmo). Loose like every
    // other character field in this file, and resolved at render.
    friend: string
    // happy, wave or thinking. Absent keeps the base cutout.
    mood?: 'happy' | 'wave' | 'thinking'
    // What the photo shows. REQUIRED, not optional like every other alt in
    // this file, because the lesson's whole argument rests on this picture
    // and a pupil who cannot see it must still be in the room.
    alt: string
    // The silly, staged around the friend. Two or three, no more.
    props?: string[]
  }
  stats?: string // "❤ 89.2K   ↻ 41K   💬 12K" style engagement line
  prompt?: string // the question the class answers about this post
}

export type DiagramSlide = SlideBase & {
  type: 'diagram'
  heading: string
  caption?: string
  // Steps render as an animated flow, top to bottom with connectors. A step
  // carries an emoji or a drawn icon (as ConceptSlide.icon); the icon wins.
  steps: { emoji?: string; icon?: string; title: string; text?: string }[]
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
  // Set only by visibleSlides for a child (plan v10, sync plan A3 and A5),
  // never authored: the reason shown after a child commits to an answer on a
  // reasoning card, and a flag on the prompts that ask who they would tell.
  kidReveal?: string
  tellPrompt?: boolean
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
  // THE EXHIBIT THE FILM POINTS AT (21 September 2026).
  //
  // A beat can refer to something the class is supposed to be looking at.
  // ks3-12 opens with Orbit holding a photo up and saying "This photo got two
  // million shares". Migration 308 answered the first half of that problem by
  // putting the photo in the deck, on the slide after the film. Justin, on a
  // phone on 21 September: "he says this photo and the photo has gone". The
  // prop leaves Orbit's hands before the line lands, and a generated film
  // cannot be directed frame by frame, so the fix that does not depend on a
  // re-render is to have the exhibit on the wall while the words are said.
  //
  // It is drawn by the same ScenarioBlock the deck uses everywhere else, so a
  // post looks identical whether a film points at it or a slide presents it.
  // Carry only what is looked at: the prompt and the teacher script belong to
  // the slide that runs the discussion, not to the film.
  post?: ScenarioSlide
}

// The animated closing: DiGi (the golden star, always) speaks the lesson
// home, one bubble at a time. Pure CSS and GSAP, no render pipeline needed.
export type DigiSlide = SlideBase & {
  type: 'digi'
  heading?: string
  lines: string[]
  // Which friend speaks. Absent means DiGi, exactly as every closing beat
  // written before 13 September 2026. A Planet Friend key (pebble, bloop,
  // orbit, nova, cosmo) makes this an arrival, an explain or a mission beat
  // in the friend's own plate and register, drawn in code by FriendPlate.
  character?: string
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

// ── ONE DECK FILTER, FOR EVERY AUDIENCE (plan v10, item 1.4) ────────────────
//
// The same thirty four decks are taught to a class, played by one child alone
// in their own app, and played by an under 7 with a grown up reading it out.
// Until 9 October 2026 the child got the classroom deck with only the teacher
// script removed, so a ten year old on their own was told to "tell your
// partner", shown a sixty second talk timer, read "Exit check one." aloud
// from a question, and handed a worksheet they did not have.
//
// So every parseSlides caller passes its deck through here, and the guard in
// scripts/check-lesson-path.mjs finds the callers by search rather than by a
// list, because a hand written list of callers was wrong twice.
//
// `classroom` returns the deck exactly as authored, which is every school
// route and the parent's own library. `kid` is a child alone in their app.
// `together` is the same child with a grown up reading it out (under 7).
//
// What the kid and together audiences change, and nothing else:
//   - the teacher channel goes: `script`, and a discussion's `lookFor`, which
//     is written to the teacher on most decks ("Pupils naming tricks without
//     shame") and so never reaches the child's client
//   - a discussion becomes Think it: its prompt reworded for one child, or
//     dropped when it only works with another pupil ("Swap sheets")
//   - a prove question loses a leading "Exit check one." sentence. Here and
//     not in the player, so the client, the completion route and the answers
//     ledger hold ONE spelling of every question
//   - the practise worksheet becomes the child's own sort, when the deck's
//     worksheet items carry verdicts (25 of 34 decks), in the tryit's place
//
// It returns a STABLE array per audience plus the map back to the stored
// deck, because the stored deck is what the server marks against. A slide
// dropped here shifts every later index, so a stored index read against this
// array lands on the wrong slide unless it goes through `storedIndex`.

export type SlideAudience = 'classroom' | 'kid' | 'together'

export type WorksheetForKid = {
  verdict_options?: unknown
  items?: unknown
}

export type VisibleDeck = {
  slides: LessonSlide[]
  /** For each visible slide, its index in the stored deck. */
  storedIndex: number[]
  /** For each stored index still visible, its index here. Dropped slides are absent. */
  visibleIndex: Record<number, number>
}

const EXIT_CHECK_LEAD = /^\s*Exit check(?: (?:one|two|three|1|2|3))?\s*[.:]\s*/i

/** A prove question without the classroom's "Exit check one." lead. */
export function stripExitCheck(question: string): string {
  return question.replace(EXIT_CHECK_LEAD, '')
}

/**
 * A discussion prompt for one child (or a child and their grown up), or null
 * when the task only exists with another pupil in the room.
 */
export function kidPrompt(prompt: string, audience: 'kid' | 'together'): string | null {
  if (/^\s*Swap sheets\b/i.test(prompt)) return null
  const p = prompt
    .replace(/someone at your table/gi, 'someone you know')
    .replace(/without looking at the board/gi, 'without looking back')
    .replace(/\bThen swap:\s*/g, 'Then: ')
  // Under 7 the partner is the grown up reading it out.
  if (audience === 'together') return p.replace(/\byour partner\b/g, 'your grown up')
  // On their own, the child thinks it rather than says it to anyone.
  return p
    .replace(/\s*Tell your partner\.\s*$/, '')
    .replace(/Talk to your partner:\s*(\w)/g, (_m, c: string) => c.toUpperCase())
    .replace(/\s+with your partner\b/g, '')
    .replace(/Tell your partner (?:about |what you think |who you think )?(?=(?:what|which|who|why|how|when|where)?\b)/g, (m: string) =>
      /what you think $/.test(m) ? 'Think about what '
      : /who you think $/.test(m) ? 'Think about who '
      : /about $/.test(m) ? 'Think about '
      : 'Tell your partner ')
    .replace(/Tell your partner (?=(?:what|which|who|why|how|when|where)\b)/g, 'Think about ')
    .replace(/Tell your partner /g, 'Think of ')
}

/**
 * Classroom furniture in a line a child reads alone (sync plan A2): the half
 * time "tell your neighbour... write it on your sheet", the scenario "Hands up"
 * and "Vote", the title's "One hour", "before the bell". Applied to every
 * string a child's slide shows. Under 7 the person beside them is the grown up
 * reading it out, so "your neighbour" becomes "your grown up" rather than a
 * thought.
 */
export function kidText(text: string, audience: 'kid' | 'together'): string {
  const together = audience === 'together'
  let t = text
    .replace(/tell someone before the bell/g, 'tell your grown up, a teacher you trust, or Childline on 0800 1111')
    .replace(/^One hour, one (\w)/, (_m, c: string) => `One ${c}`)
    .replace(/^One hour on (\w)/, (_m, c: string) => `A lesson on ${c}`)
    .replace(/Hands up:\s*(\w)/g, (_m, c: string) => c.toUpperCase())
    .replace(/Thirty seconds with the person next to you, then /g, 'Have a think, then ')
    .replace(/wave bye bye to the board/g, 'wave bye bye to the screen')
    .replace(/\s*Hands up for your answer!/g, '')
    .replace(/Thirty seconds with your partner, then hands up with a number\./g, 'Have a think, then pick a number.')
    .replace(/Thirty seconds with your partner, then verdicts with reasons\./g, 'Have a think, then give your verdict and your reason.')
    .replace(/Thirty seconds with your partner:\s*(\w)/g, (_m, c: string) => c.toUpperCase())
    .replace(/Vote now, hands up\.\s*/g, '')
    .replace(/Vote:\s*(\w)/g, (_m, c: string) => c.toUpperCase())
    .replace(/Hands up: who has seen/g, 'Have you seen')
    .replace(/\s+on your sheet(?=,)/g, '')
    .replace(/,\s*on paper(?=[:.,])/g, '')
  // The two sixth form half times are about a sheet the child does not have,
  // and a grown up switch can put an older child on the together deck.
  if (/\b(?:read back what you have so far|a colder read of your own sheet)\b/.test(t)) {
    return 'Two slow breaths. Then think of one thing from today you want to remember.'
  }
  if (together) {
    return t
      .replace(/\b([Tt])ell (?:your neighbour|the person next to you|your partner)\b/g, (_m, c: string) => `${c}ell your grown up`)
      .replace(/ out loud to your partner/g, ' out loud to your grown up')
      .replace(/,? and (?:draw or )?write it on your sheet/g, '')
      .replace(/\bon your sheet\b/g, 'on paper')
  }
  return t
    // The half time line: the breath stays, the sharing becomes a thought.
    .replace(/Then tell (?:your neighbour|the person next to you|your partner) (one [^,.]*?)(?:, and (?:draw or )?write it on your sheet)?\./g, 'Then think of $1.')
    .replace(/ out loud to your partner(?=[,.])/g, ' out loud')
    .replace(/\bon your sheet\b/g, 'on paper')
}

/** kidText over every string a slide carries, keys and all, except the type fields. */
function kidSlideText<T>(value: T, audience: 'kid' | 'together'): T {
  if (typeof value === 'string') return kidText(value, audience) as T
  if (Array.isArray(value)) return value.map(v => kidSlideText(v, audience)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = k === 'type' || k === 'component' || k === 'phase' || k === 'character' ? v : kidSlideText(v, audience)
    }
    return out as T
  }
  return value
}

const OPINION_ASK = /Do you agree|Explain your (?:reasoning|verdict)|why or why not|Tell us why/i

/** A teaching point with what was written to the teacher taken out. */
function childReason(point: string): string {
  return point
    .replace(/^(?:Explain|Recognise|Recognition|Apply)\.?:?\s*/, '')
    .split(/(?<=\.)\s+/)
    .filter(sentence => !/^(?:Credit|Accept|Strong answers|Weak answers|Listen for|Reasoning is the prize|The explain item|Look for|Praise)\b/i.test(sentence))
    .filter(sentence => !/\bpupils?\b/i.test(sentence))
    .join(' ')
    .trim()
}

/**
 * The child's own sort, from the worksheet the class does on paper. Only when
 * every item carries a verdict that is one of the sheet's options, so the
 * card can turn over to the right answer and its reason. Anything else (the
 * completion decks, the plain string items) keeps its tryit for now.
 *
 * The sixth item on 20 decks is a reasoning card ("Do you agree? Explain your
 * reasoning"), which verdict buttons cannot answer. It leaves the sort and
 * comes back as a Think it: the child commits first, then reads the reason.
 * The panel suggested two reasons to pick between, the teaching point against
 * a listed misconception; the decks' misconceptions are written per lesson,
 * not per card, so a picked one read as a non sequitur beside the claim, and
 * generating before the reveal keeps the part that matters.
 */
function worksheetSort(worksheet: WorksheetForKid | null | undefined, heading: string): { sort: InteractiveSlide; opinion: DiscussionSlide | null } | null {
  const verdicts = Array.isArray(worksheet?.verdict_options)
    ? (worksheet!.verdict_options as unknown[]).filter((v): v is string => typeof v === 'string' && v.trim() !== '')
    : []
  const items = Array.isArray(worksheet?.items) ? (worksheet!.items as unknown[]) : []
  if (verdicts.length < 2 || items.length === 0) return null
  const posts: { text: string; answer: number; why: string }[] = []
  let opinion: DiscussionSlide | null = null
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') return null
    const it = raw as { item?: unknown; expected_verdict?: unknown; teaching_point?: unknown }
    if (typeof it.item !== 'string' || typeof it.expected_verdict !== 'string') return null
    const answer = verdicts.indexOf(it.expected_verdict)
    if (answer < 0) return null
    const why = typeof it.teaching_point === 'string' ? childReason(it.teaching_point) : ''
    if (OPINION_ASK.test(it.item) && !opinion) {
      const claim = it.item
        .replace(/\s*Do you agree[^?]*\?/gi, '')
        .replace(/\s*(?:Explain|Tell (?:your teacher|us|your partner)|Use the|Run the)[^.]*\./gi, '')
        .trim()
      opinion = { type: 'discussion', phase: 'practise', prompt: `${claim} Do you agree?`, kidReveal: why || undefined }
      continue
    }
    posts.push({ text: it.item, answer, why })
  }
  if (posts.length < 4) return null
  return {
    sort: {
      type: 'interactive',
      phase: 'practise',
      component: 'verdict-sort',
      config: { verdicts, posts, doneTitle: 'All sorted', doneBody: `${heading.replace(/,\s*on paper$/i, '')}: every card has a verdict and a reason.` },
    },
    opinion,
  }
}

const TELL_PROMPT = /the person I (?:will|would|could) tell|grown up YOU could tell|who (?:could|would|will) you tell/i

const isClassSort = (s: LessonSlide) => s.type === 'interactive' && s.component === 'verdict-sort' && s.phase === 'practise'

export function visibleSlides(slides: LessonSlide[], audience: SlideAudience, opts?: { worksheet?: WorksheetForKid | null }): VisibleDeck
export function visibleSlides(slides: LessonSlide[] | null, audience: SlideAudience, opts?: { worksheet?: WorksheetForKid | null }): VisibleDeck | null
export function visibleSlides(
  slides: LessonSlide[] | null,
  audience: SlideAudience,
  opts: { worksheet?: WorksheetForKid | null } = {},
): VisibleDeck | null {
  if (!slides) return null
  if (audience === 'classroom') {
    // The authored deck itself while nothing in it is child only, which is
    // every deck until the content PR; then the same deck minus those slides.
    if (!slides.some(s => s.kid_only)) {
      return { slides, storedIndex: slides.map((_, i) => i), visibleIndex: Object.fromEntries(slides.map((_, i) => [i, i])) }
    }
    const kept = slides.map((s, i) => ({ s, i })).filter(({ s }) => !s.kid_only)
    return {
      slides: kept.map(({ s }) => s),
      storedIndex: kept.map(({ i }) => i),
      visibleIndex: Object.fromEntries(kept.map(({ i }, k) => [i, k])),
    }
  }

  // ONE PRACTICE SORT, NEVER TWO (sync plan A1). Fifteen decks run the class
  // sort and then the worksheet, eleven with the same six cards. When the
  // class sort is core it stays and the worksheet goes; when it is an
  // `extension` slide (eight decks) the worksheet sort stays and the class
  // sort goes, so no trim can ever leave a deck without practice.
  const firstTryit = slides.find(s => s.type === 'tryit' && s.phase === 'practise')
  const fromSheet = firstTryit ? worksheetSort(opts.worksheet, (firstTryit as TryItSlide).heading) : null
  const coreClassSort = slides.some(s => isClassSort(s) && !s.extension)
  const sheetWins = !!fromSheet && !coreClassSort

  const out: LessonSlide[] = []
  const storedIndex: number[] = []
  const visibleIndex: Record<number, number> = {}
  const push = (slide: LessonSlide, i: number) => {
    if (visibleIndex[i] === undefined) visibleIndex[i] = out.length
    storedIndex.push(i)
    out.push(slide)
  }
  let sortUsed = false
  slides.forEach((stored, i) => {
    let s = stored
    // The passport beat fills a page from the classroom's memory before the
    // check is marked. A child's tick comes from their pass (sync plan A4).
    if (s.type === 'interactive' && s.component === 'passport-page') return
    if (isClassSort(s) && s.extension && sheetWins) return
    if (s.type === 'interactive') {
      // A caption is the teacher's instruction to the room ("The honest hands
      // up"), and the widget never shows it to a child, so it does not travel.
      const { caption: _caption, ...rest } = s
      s = rest as LessonSlide
    }
    let classOpinion: DiscussionSlide | null = null
    if (s.type === 'interactive' && s.component === 'verdict-sort' && s.config) {
      // The widget says "Your turn · tap your verdict" to a child; the
      // classroom label ("tap the class verdict") never reaches the client.
      const { label: _label, ...config } = s.config as Record<string, unknown>
      // A reasoning card inside a class sort goes the same way as the
      // worksheet's: out of the sort, back as a Think it after it.
      const posts = (Array.isArray(config.posts) ? config.posts : Array.isArray(config.items) ? config.items : null) as { text?: string; why?: string }[] | null
      if (posts) {
        const opinionAt = posts.findIndex(p => typeof p.text === 'string' && OPINION_ASK.test(p.text))
        if (opinionAt >= 0 && posts.length - 1 >= 4) {
          const card = posts[opinionAt]
          const claim = String(card.text)
            .replace(/\s*Do you agree[^?]*\?/gi, '')
            .replace(/\s*(?:Explain|Tell (?:your teacher|us|your partner)|Use the|Run the)[^.]*\./gi, '')
            .trim()
          classOpinion = { type: 'discussion', phase: 'practise', prompt: `${claim} Do you agree?`, kidReveal: card.why ? childReason(card.why) || undefined : undefined }
          const kept = posts.filter((_, k) => k !== opinionAt)
          if (Array.isArray(config.posts)) config.posts = kept
          else config.items = kept
        }
      }
      s = { ...s, config } as LessonSlide
    }

    let slide: LessonSlide = { ...s }
    delete (slide as { script?: string }).script
    if (slide.type === 'discussion') {
      const prompt = kidPrompt(slide.prompt, audience)
      if (prompt === null) return
      slide = { ...slide, prompt }
      delete (slide as { lookFor?: string }).lookFor
      if (TELL_PROMPT.test(prompt)) slide = { ...slide, tellPrompt: true }
    } else if (slide.type === 'choice' && slide.phase === 'prove') {
      slide = { ...slide, question: stripExitCheck(slide.question) }
    } else if (slide.type === 'tryit' && slide.phase === 'practise') {
      if (coreClassSort && fromSheet) return
      if (fromSheet && !sortUsed) {
        sortUsed = true
        push(kidSlideText(fromSheet.sort, audience), i)
        if (fromSheet.opinion) push(kidSlideText(fromSheet.opinion, audience), i)
        return
      }
      slide = { ...slide, heading: slide.heading.replace(/,\s*on paper$/i, '') }
    }
    push(kidSlideText(slide, audience), i)
    if (classOpinion) push(kidSlideText(classOpinion, audience), i)
  })
  return { slides: out, storedIndex, visibleIndex }
}

// ── THE CHILD'S STATUS LINE: computed, never written ────────────────────────
//
// The classroom line reads the slide's own `minutes` and Rosenshine's phase
// names, which is right on a wall and wrong in a hand: "Retrieval · ~8 min"
// over a single question. The child's line is worked out from the deck the
// child actually has.

/** Rough minutes one child spends on a slide, alone. */
const KID_MINUTES: Record<LessonSlide['type'], number> = {
  title: 0.25, objective: 0.25, keywords: 0.5, concept: 0.5, quote: 0.25,
  choice: 0.5, scenario: 0.75, diagram: 0.75, discussion: 0.5, stat: 0.25,
  tryit: 1, recap: 0.5, video: 1.5, digi: 0.25, interactive: 1,
}
const KID_INTERACTIVE_MINUTES: Record<string, number> = {
  'verdict-sort': 2, 'star-breath': 1, 'passport-page': 0.5, 'class-tally': 0.5,
  'feed-loop': 1.5, 'spread-race': 1.5, 'signal-meter': 1,
}

export function kidSlideMinutes(s: LessonSlide): number {
  if (s.type === 'interactive') return KID_INTERACTIVE_MINUTES[s.component] ?? KID_MINUTES.interactive
  return KID_MINUTES[s.type]
}

/** Whole minutes left from `index` to the end, rounded up. */
export function kidMinutesLeft(slides: LessonSlide[], index: number): number {
  let total = 0
  for (let i = Math.max(0, index); i < slides.length; i += 1) total += kidSlideMinutes(slides[i])
  return Math.ceil(total)
}

const KID_PHASE: Record<LessonPhase, string> = {
  connect: 'Hello', starter: 'Warm up', teach: 'Learn it', practise: 'Have a go', prove: 'Check', close: 'Wrap up',
}

/** The child's eyebrow for a slide: the phase in their words, a check counted. */
export function kidEyebrow(slides: LessonSlide[], index: number): string | null {
  const s = slides[index]
  if (!s?.phase) return null
  if (s.phase === 'prove' && s.type === 'choice') {
    const checks = slides.map((x, i) => ({ x, i })).filter(({ x }) => x.phase === 'prove' && x.type === 'choice')
    const n = checks.findIndex(c => c.i === index) + 1
    return `Check ${n} of ${checks.length}`
  }
  return KID_PHASE[s.phase]
}

// ── THE PASS, MARKED ON THE SERVER (plan v10, item 1.5) ─────────────────────
//
// The client sends what was tapped, never whether it was right. The route
// rebuilds the deck the child was shown (visibleSlides, same audience), finds
// each answer's slide by its question first and its index second, and marks
// the taps against that slide's own options. A crafted request claiming both
// answers right therefore marks nothing it did not tap, and the pass, the
// passport tick and the stars rest on the deck rather than the tap's say so.

export type PostedAnswer = {
  /** The answer's index in the visible deck; the tiebreak after the question. */
  slide?: number
  question: string
  /** The first option tapped. */
  chosenFirst?: string
  /** The option the slide settled on (the second tap after a wrong first). */
  chosen: string
  phase?: string
  run_id?: string
}

export type MarkedAnswer = {
  slide: number
  question: string
  phase: LessonPhase | null
  chosenFirst: string
  chosen: string
  firstCorrect: boolean
  correct: boolean
  runId: string | null
}

const sameQuestion = (a: string, b: string) => stripExitCheck(a).trim() === stripExitCheck(b).trim()

/** Mark posted taps against the deck itself. Rows that do not resolve, or name an option the slide does not have, are dropped. */
export function markAnswers(deck: LessonSlide[], posted: PostedAnswer[]): MarkedAnswer[] {
  const out: MarkedAnswer[] = []
  for (const p of posted) {
    if (!p || typeof p.question !== 'string' || typeof p.chosen !== 'string') continue
    const byQuestion = deck
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.type === 'choice' && sameQuestion((s as ChoiceSlide).question, p.question))
    const hit = byQuestion.length === 1 ? byQuestion[0]
      : byQuestion.find(({ i }) => i === p.slide)
        ?? (byQuestion.length === 0 && typeof p.slide === 'number' && deck[p.slide]?.type === 'choice' ? { s: deck[p.slide], i: p.slide } : undefined)
    if (!hit) continue
    const slide = hit.s as ChoiceSlide
    const settled = slide.options.find(o => o.text === p.chosen)
    if (!settled) continue
    const first = slide.options.find(o => o.text === (p.chosenFirst ?? p.chosen)) ?? settled
    out.push({
      slide: hit.i,
      question: slide.question,
      phase: slide.phase ?? null,
      chosenFirst: first.text,
      chosen: settled.text,
      firstCorrect: first.correct,
      correct: settled.correct,
      runId: typeof p.run_id === 'string' ? p.run_id : null,
    })
  }
  return out
}

/** The check: every prove question the child's deck carries, spares excluded. */
export function proveQuestions(deck: LessonSlide[]): ChoiceSlide[] {
  return deck.filter((s): s is ChoiceSlide => s.type === 'choice' && s.phase === 'prove' && !s.reserve_for)
}

/**
 * Whether a run passes a school lesson. Every prove question right on its
 * latest settled answer, a spare standing in for the question it names. In a
 * lesson done together with a grown up (under 7, or a retake they opened from
 * their own app) every prove question answered is the pass: the grown up is
 * the check, and the answers are a record, not a gate.
 */
export function lessonPassed(deck: LessonSlide[], marked: MarkedAnswer[], opts: { together?: boolean } = {}): boolean {
  const proves = proveQuestions(deck)
  if (proves.length === 0) return marked.length > 0
  const latest = new Map<string, MarkedAnswer>()
  for (const m of marked) {
    if (m.phase !== 'prove') continue
    const slide = deck[m.slide] as ChoiceSlide | undefined
    const key = slide?.reserve_for ? stripExitCheck(slide.reserve_for).trim() : stripExitCheck(m.question).trim()
    // A spare stands in for its question only when it is right; a wrong spare
    // never undoes a question already settled right.
    if (slide?.reserve_for && !m.correct && latest.get(key)?.correct) continue
    latest.set(key, m)
  }
  return proves.every(p => {
    const m = latest.get(stripExitCheck(p.question).trim())
    return opts.together ? !!m : !!m?.correct
  })
}
