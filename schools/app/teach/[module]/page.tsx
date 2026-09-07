import { anon as supabase } from '@/lib/supabase/anon'
import { notFound } from 'next/navigation'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides, type LessonCycle } from '@gc/shared/lesson-slides'

// The teach route: any live module, played full screen for the classroom.
//
// PROJECTOR, NOT teacherView ALONE. This route said "full screen for the
// classroom" in this comment while passing teacherView and wrapping the
// player in a 720px column, so `projector` was false and every projector
// aware size fell to the phone branch: concept headings at 2.4rem instead of
// 3.2rem, choice options at 16px instead of 20px, the whole lesson in the
// middle 40 percent of the wall. A child at the back of the room could not
// read it. The `projector` prop exists separately from `classMode` because
// classMode also swaps the finish for the family showcase that sells the
// schools tier, which a school standing inside that tier should never see.
// Behind the school code (proxy.ts). Teacher script panel available on every
// slide. The player gets completeEndpoint null because this app has no API
// surface and a code tells us the school, never the teacher, so there is
// nobody to record a completion against. That changes when the staffroom
// lands and a lesson is played inside a delivery.

export const revalidate = 3600

type SchoolLesson = {
  id: string
  module_id: string
  title: string
  key_stage: string
  year_band: string
  single_action_outcome: string
  character_cast: string | null
  slides: unknown
  // The named cycles (migration 268). The player derives which slide sits in
  // which cycle from the minutes, so nothing here needs tagging by hand.
  teacher_notes: { cycles?: LessonCycle[] } | null
}

export default async function TeachLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ module: string }>
  searchParams: Promise<{ slide?: string }>
}) {
  const { module: moduleId } = await params
  const { slide: slideParam } = await searchParams

  const { data } = await supabase
    .from('school_lessons')
    .select('id, module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as SchoolLesson | null
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides)
  if (!slides) notFound()

  // ?slide=N (1 based, from the run sheet) opens the player at that slide, so
  // a teacher can step out mid lesson and step back in where they were. A
  // value off either end clamps rather than 404s: the run sheet may be a
  // print out from last term while the deck has since grown or shrunk.
  const requested = Number(slideParam)
  const initialIndex = Number.isFinite(requested) && requested >= 1
    ? Math.min(Math.round(requested) - 1, slides.length - 1)
    : 0

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '28px clamp(20px, 4vw, 56px) 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          marginBottom: '8px',
        }}>
          {lesson.key_stage} · {lesson.year_band}{lesson.character_cast ? ` · ${lesson.character_cast}` : ''}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
          fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.01em', lineHeight: 1.2,
          marginBottom: '20px',
        }}>
          {lesson.title}
        </h1>
      </div>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 56px) 80px' }}>
        <LessonPlayer
          lessonId={lesson.id}
          lessonSource="school_lesson"
          slides={slides}
          backHref="/curriculum"
          teacherView
          projector
          completeEndpoint={null}
          initialIndex={initialIndex}
          cycles={lesson.teacher_notes?.cycles}
        />
      </div>
    </main>
  )
}
