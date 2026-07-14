// Parent and child co view lessons: the watch together layer of the
// pathway. Content lives in the database (parent_lessons, segments and
// cards from migration 049, seeded by 050); videos live on the CDN.
// This file is the one place the app reads that content from, for the
// parent dashboard, the kid link and the completion API alike.

// Stars: the full award lands once on first completion, the smaller
// fixed award on every redo. Redo is the whole point (rewatching with
// the grown up), the smaller award keeps it worth doing without
// becoming farmable. Stars flow into the existing star bank via
// lib/quests/bank.ts, never a parallel currency.
export const FIRST_COMPLETION_STARS = 10
export const REDO_STARS = 2

export type ParentLessonSegmentName = 'full' | 'A' | 'B' | 'C'

export type ParentLesson = {
  id: string
  lesson_code: string
  stage_id: number
  journey_step: number
  title: string
  strand: string
  keyword: string
  catchphrase: string
  knowledge_intention: string
  emotional_intention: string
  misconception: string
  parent_note: string | null
  poster_url: string | null
  active: boolean
}

export type ParentLessonSegment = {
  id: string
  lesson_id: string
  segment: ParentLessonSegmentName
  video_url: string
  duration_seconds: number | null
  sort: number
}

export type QuizOption = {
  text: string
  correct: boolean
  reaction: string
}

export type ParentLessonCard = {
  id: string
  lesson_id: string
  position: number
  card_type: 'ask' | 'say' | 'quiz'
  prompt: string
  older_variant: string | null
  options: QuizOption[] | null
}

export type ParentLessonCompletion = {
  child_id: string
  lesson_code: string
  first_completed_at: string
  last_completed_at: string
  times_completed: number
  quiz_right_first_try: boolean | null
  stars_awarded: number
}

// Works with the parent session client and the admin client alike.
type LessonClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

// Every active lesson with its full segment, in journey order. The
// parent list and the kid adventures list both start here; the kid
// side applies the age gate on top (stage_id <= the child's stage).
export async function getParentLessons(supabase: LessonClient): Promise<{
  lessons: ParentLesson[]
  segmentsByLesson: Map<string, ParentLessonSegment[]>
}> {
  const [lessonsRes, segmentsRes] = await Promise.all([
    supabase
      .from('parent_lessons')
      .select('id, lesson_code, stage_id, journey_step, title, strand, keyword, catchphrase, knowledge_intention, emotional_intention, misconception, parent_note, poster_url, active')
      .eq('active', true)
      .order('stage_id', { ascending: true })
      .order('journey_step', { ascending: true }),
    supabase
      .from('parent_lesson_segments')
      .select('id, lesson_id, segment, video_url, duration_seconds, sort')
      .order('sort', { ascending: true }),
  ])
  const lessons = (lessonsRes.data ?? []) as ParentLesson[]
  const segmentsByLesson = new Map<string, ParentLessonSegment[]>()
  for (const seg of (segmentsRes.data ?? []) as ParentLessonSegment[]) {
    const list = segmentsByLesson.get(seg.lesson_id) ?? []
    list.push(seg)
    segmentsByLesson.set(seg.lesson_id, list)
  }
  return { lessons, segmentsByLesson }
}

// One lesson with everything the player needs: segments A, B, C and
// the pause and quiz cards in position order.
export async function getParentLessonByCode(supabase: LessonClient, lessonCode: string): Promise<{
  lesson: ParentLesson
  segments: ParentLessonSegment[]
  cards: ParentLessonCard[]
} | null> {
  const { data: lesson } = await supabase
    .from('parent_lessons')
    .select('id, lesson_code, stage_id, journey_step, title, strand, keyword, catchphrase, knowledge_intention, emotional_intention, misconception, parent_note, poster_url, active')
    .eq('lesson_code', lessonCode)
    .eq('active', true)
    .maybeSingle()
  if (!lesson) return null

  const [segmentsRes, cardsRes] = await Promise.all([
    supabase
      .from('parent_lesson_segments')
      .select('id, lesson_id, segment, video_url, duration_seconds, sort')
      .eq('lesson_id', lesson.id)
      .order('sort', { ascending: true }),
    supabase
      .from('parent_lesson_cards')
      .select('id, lesson_id, position, card_type, prompt, older_variant, options')
      .eq('lesson_id', lesson.id)
      .order('position', { ascending: true }),
  ])

  return {
    lesson: lesson as ParentLesson,
    segments: (segmentsRes.data ?? []) as ParentLessonSegment[],
    cards: (cardsRes.data ?? []) as ParentLessonCard[],
  }
}

// Completion rows for one child, keyed by lesson code.
export async function getCompletionsForChild(
  supabase: LessonClient,
  childId: string
): Promise<Map<string, ParentLessonCompletion>> {
  const { data } = await supabase
    .from('parent_lesson_completions')
    .select('child_id, lesson_code, first_completed_at, last_completed_at, times_completed, quiz_right_first_try, stars_awarded')
    .eq('child_id', childId)
  return new Map(((data ?? []) as ParentLessonCompletion[]).map(c => [c.lesson_code, c]))
}

// A friendly duration line from the full segment, for the lesson cards.
export function durationLabel(segments: ParentLessonSegment[] | undefined): string | null {
  const full = segments?.find(s => s.segment === 'full')
  const seconds = full?.duration_seconds
  if (!seconds) return null
  const minutes = Math.max(1, Math.round(Number(seconds) / 60))
  return `About ${minutes} minute${minutes === 1 ? '' : 's'}`
}
