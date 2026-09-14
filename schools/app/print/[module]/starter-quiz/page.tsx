import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import QuizSheet from '@/components/QuizSheet'
import { quizQuestions, type QuizBank } from '@/lib/quiz'
import { CURRICULUM as MODULE_MANIFEST } from '@gc/shared/schools-curriculum'

// The tab names the module, so a teacher with eight tabs open can find this
// one. Read from the manifest rather than the row: no second database read.
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title
  return { robots: { index: false, follow: false }, title: title ? `Starter quiz: ${title}` : 'Starter quiz: Module' }
}

// The prior knowledge starter quiz, in Oak's pattern: four questions, run
// cold before the lesson, question version and answer version from one route.
//
// Oak publishes a starter QUIZ and no prior knowledge statement, which turns
// out to be the better artefact: four questions a teacher can actually run
// beats a paragraph they have to interpret. The reasoning is written up in
// research/2026-09-07-oak-and-common-sense-source-mining.md.
//
// A module whose bank has not been written simply has no sheet, rather than
// printing an empty one. Same rule as the learning record.

export const revalidate = 3600

type Lesson = {
  module_id: string
  title: string
  year_band: string
  key_stage: string
  character_cast: string | null
  teacher_notes: { starter_quiz?: QuizBank } | null
}

export default async function StarterQuizPage({
  params, searchParams,
}: {
  params: Promise<{ module: string }>
  searchParams: Promise<{ answers?: string }>
}) {
  const { module: moduleId } = await params
  const { answers } = await searchParams

  const { data } = await supabase
    .from('school_lessons')
    .select('module_id, title, year_band, key_stage, character_cast, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const questions = quizQuestions(lesson.teacher_notes?.starter_quiz)
  if (questions.length === 0) notFound()

  return (
    <QuizSheet
      kind="starter"
      moduleId={lesson.module_id}
      title={lesson.title}
      yearBand={lesson.year_band}
      keyStage={lesson.key_stage}
      characterCast={lesson.character_cast}
      questions={questions}
      answers={answers !== undefined}
    />
  )
}
