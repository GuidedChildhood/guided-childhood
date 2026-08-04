import { parseSlides, autoSlidesFromLesson, type LessonSlide } from '@/lib/content/lesson-slides'
import { stageQuizFor, STAGE_QUIZ_LENGTH, type StageQuizQuestion } from '@/lib/content/stage-quizzes'
import type { createClient } from '@/lib/supabase/server'

// The parent pathway reads this with the request scoped server client and the
// child app with the admin client behind a kid token, so it takes either.
type SupabaseClient =
  | Awaited<ReturnType<typeof createClient>>
  | ReturnType<typeof import('@/lib/supabase/admin').createAdminClient>

// The stage quiz, gathered from the stage's own lessons rather than a bank
// typed into the app. Justin's design: the quiz sits at the END of a stage and
// gathers the questions already asked across that stage's lessons, so passing
// it is retrieval practice at stage scale and the passport stamp means the
// family held on to what the stage actually taught.
//
// This is the same idea the lesson player already runs on. Every deck opens on
// a starter the player labels Retrieval (ROSENSHINE_LABELS). The stage quiz is
// that, one level up, and it is why a pass is allowed to tick the passport.
//
// Questions live as `choice` slides inside lessons.slides (JSONB contract in
// migration 017, extended by 031 and 032). Nothing new is authored here and no
// content is hardcoded: this reads what the lessons already ask.

const STAGE_SLUGS = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

type LessonRow = {
  id: string
  title: string
  slides: unknown
  the_idea: string | null
  why_it_matters: string | null
  try_this: string | null
  key_message: string | null
}

// A choice slide only becomes a stage quiz question if it can stand on its own.
// Inside a lesson a question often points at the slide before it, the feed post
// pupils just read or the diagram just built. Lifted out of that deck and into a
// stage quiz weeks later, "which check would you run on this post" has no post,
// and the family is being asked something unanswerable.
//
// The test is the WORDS, not the neighbours. Sitting after a scenario slide was
// the first rule tried and it is much too blunt: measured over the real library
// it threw away "why is one reused password across ten accounts worse than one
// weak password on one account", which needs nothing around it, and dropped
// Explorer below a full run on its own. Adjacency is corroboration, never proof.
const CARRIES_CONTEXT: LessonSlide['type'][] = ['scenario', 'diagram', 'quote', 'stat', 'video']

// Nouns that name a thing a question can point at. Deliberately excludes the
// generic ones ("screen", "story", "account"), which appear in perfectly self
// contained questions: "now the timer says the screen is done" points at
// nothing.
const THING = '(post|message|photo|video|image|clip|chat|reply|comment|profile|diagram|quote|screenshot|feed|ad|offer|headline)'

// A demonstrative in front of one of those, or an outright pointer, means the
// question cannot be answered without the slide it came from. Always dropped.
const STRONG_DEIXIS = new RegExp(
  `\\b(this|that|these|those) ${THING}\\b|\\bwhich of these\\b|\\babove\\b|\\bon screen\\b|\\bjust (read|seen|watched)\\b`,
  'i',
)

// "The chat", "the message". Ambiguous alone, since a question can introduce its
// own. Dropped only when the slide before it actually put one on screen.
const WEAK_DEIXIS = new RegExp(`\\bthe ${THING}\\b`, 'i')

function standsAlone(slide: LessonSlide, previous: LessonSlide | undefined): boolean {
  if (slide.type !== 'choice') return false
  if (STRONG_DEIXIS.test(slide.question)) return false
  const nearContext = !!previous && CARRIES_CONTEXT.includes(previous.type)
  return !(nearContext && WEAK_DEIXIS.test(slide.question))
}

// A lesson's choice slides, turned into the shape the quiz already speaks.
// The right answer's feedback becomes the why line, so a wrong answer still
// teaches, exactly as the hand written bank does.
function questionsFromSlides(slides: LessonSlide[], lessonTitle: string): StageQuizQuestion[] {
  const out: StageQuizQuestion[] = []
  slides.forEach((slide, i) => {
    if (!standsAlone(slide, slides[i - 1])) return
    if (slide.type !== 'choice') return

    const options = slide.options ?? []
    // Exactly one right answer, at least two options, or it cannot be graded.
    const correctAt = options.findIndex(o => o.correct)
    if (options.length < 2 || correctAt < 0) return
    if (options.filter(o => o.correct).length !== 1) return

    const why = (options[correctAt].feedback ?? '').trim()
    out.push({
      q: qualify(slide.question, lessonTitle),
      options: options.map(o => o.text),
      answer: correctAt,
      why: why || `That is the one. It is the idea ${lessonTitle} was built around.`,
    })
  })
  return out
}

// The generated floor question (autoSlidesFromLesson) is worded for the end of
// the lesson it came from: "Before you finish, show what stuck." Gathered into
// a stage quiz that sentence is a lie, nothing is being finished, and worse,
// every deckless lesson produces the SAME sentence, so a five question run
// could ask it five times over. Naming the lesson makes each one distinct and
// gives the family the context the question assumes.
const GENERATED_OPENER = /^Before you finish, show what stuck\./i

function qualify(question: string, lessonTitle: string): string {
  if (!GENERATED_OPENER.test(question)) return question
  return `In "${lessonTitle}", which one is the big idea?`
}

/**
 * Every question this stage's lessons already ask, as the quiz pool.
 *
 * Fails soft to an empty array: a stage with no readable lessons returns
 * nothing rather than throwing, and the caller tops up from the floor bank so a
 * family always meets a full length quiz rather than a short or broken one.
 */
export async function gatherStageQuizPool(
  supabase: SupabaseClient,
  stageId: number,
): Promise<StageQuizQuestion[]> {
  const slug = STAGE_SLUGS[stageId - 1]
  if (!slug) return []

  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, slides, the_idea, why_it_matters, try_this, key_message')
    .eq('stage_id', slug)
    .order('sort_order', { ascending: true })

  if (error || !data) return []

  const pool: StageQuizQuestion[] = []
  for (const lesson of data as LessonRow[]) {
    // Authored deck first, the generated floor only when there is no deck, so a
    // lesson never contributes both its real questions and a synthetic one.
    const slides = parseSlides(lesson.slides) ?? autoSlidesFromLesson(lesson)
    if (!slides) continue
    pool.push(...questionsFromSlides(slides, lesson.title))
  }

  // Two lessons can land on the same question, most often the generated floor
  // where two decks share a key message. Asking it twice in one run reads as a
  // bug, so the first wins.
  return dedupe(pool)
}

function dedupe(questions: StageQuizQuestion[]): StageQuizQuestion[] {
  const seen = new Set<string>()
  return questions.filter(q => {
    const key = q.q.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * The pool the stage quiz actually samples from: the stage's own lesson
 * questions first, topped up from the hand written bank only when the lessons
 * cannot fill a run.
 *
 * The top up is a floor, not a source, and measured against the library today
 * it is never reached: every stage yields enough on its own (foundation 8,
 * builder 10, explorer 10, shaper 25, independent 11, against a run of five).
 * It stays because a stage is one retired lesson away from being short, and a
 * family meeting a two question quiz at the end of a stage would rightly read
 * the stamp as unearned.
 */
export async function stageQuizPool(
  supabase: SupabaseClient,
  stageId: number,
): Promise<{ questions: StageQuizQuestion[]; fromLessons: number; toppedUp: number }> {
  const gathered = await gatherStageQuizPool(supabase, stageId)
  if (gathered.length >= STAGE_QUIZ_LENGTH) {
    return { questions: gathered, fromLessons: gathered.length, toppedUp: 0 }
  }

  const floor = stageQuizFor(stageId)?.pool ?? []
  const merged = dedupe([...gathered, ...floor])
  return {
    questions: merged,
    fromLessons: gathered.length,
    toppedUp: Math.max(0, merged.length - gathered.length),
  }
}
