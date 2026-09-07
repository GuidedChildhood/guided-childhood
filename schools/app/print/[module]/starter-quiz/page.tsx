import { anon as supabase } from '@/lib/supabase/anon'
import { notFound } from 'next/navigation'
import QuizSheet, { type QuizQuestion } from '@/components/QuizSheet'

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
export const metadata = { title: 'Starter quiz', robots: { index: false, follow: false } }

type Lesson = {
  module_id: string
  title: string
  year_band: string
  teacher_notes: { starter_quiz?: QuizQuestion[] } | null
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
    .select('module_id, title, year_band, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const questions = lesson.teacher_notes?.starter_quiz ?? []
  if (questions.length === 0) notFound()

  return (
    <QuizSheet
      kind="starter"
      moduleId={lesson.module_id}
      title={lesson.title}
      yearBand={lesson.year_band}
      questions={questions}
      answers={answers !== undefined}
    />
  )
}
