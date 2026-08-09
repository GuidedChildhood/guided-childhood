import { anon as supabase } from '@/lib/supabase/anon'
import { notFound } from 'next/navigation'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides } from '@gc/shared/lesson-slides'

// The teach route: any live module, played full screen for the classroom,
// no login (the Oak model: an open catalogue a teacher can walk into and
// teach from today). Teacher script panel available on every slide. The
// player gets completeEndpoint null because this app has no API surface
// and an open lesson has nobody to record a completion for.

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
}

export default async function TeachLessonPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params

  const { data } = await supabase
    .from('school_lessons')
    .select('id, module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides')
    .eq('module_id', moduleId)
    .maybeSingle()

  const lesson = data as SchoolLesson | null
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides)
  if (!slides) notFound()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 20px 0' }}>
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
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 20px 80px' }}>
        <LessonPlayer
          lessonId={lesson.id}
          lessonSource="school_lesson"
          slides={slides}
          backHref="/curriculum"
          teacherView
          completeEndpoint={null}
        />
      </div>
    </main>
  )
}
