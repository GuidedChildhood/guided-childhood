import { anon as supabase } from '@/lib/supabase/anon'
import { notFound } from 'next/navigation'
import QuizSheet, { type QuizQuestion } from '@/components/QuizSheet'

// The assessment exit quiz, in Oak's pattern: five questions in mixed
// formats, run at the end, question version and answer version from one route.
//
// This is a different job from the choice slides inside the lesson. Those are
// checks for understanding: they run mid cycle, they are discussed out loud,
// and a wrong answer is the point of them. This is marked afterwards, on
// paper, against an answer sheet. Both exist on purpose and neither replaces
// the other.

export const revalidate = 3600
export const metadata = { title: 'Exit quiz', robots: { index: false, follow: false } }

type Lesson = {
  module_id: string
  title: string
  year_band: string
  teacher_notes: { exit_quiz?: QuizQuestion[] } | null
}

export default async function ExitQuizPage({
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

  const questions = lesson.teacher_notes?.exit_quiz ?? []
  if (questions.length === 0) notFound()

  return (
    <QuizSheet
      kind="exit"
      moduleId={lesson.module_id}
      title={lesson.title}
      yearBand={lesson.year_band}
      questions={questions}
      answers={answers !== undefined}
    />
  )
}
