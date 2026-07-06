import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import LessonPlayer from '@/components/lessons/LessonPlayer'
import { parseSlides } from '@/lib/content/lesson-slides'

// Phase 1 of the schools build: the reference lesson, playable end to end.
// This is the approval surface for JP before the full 21 module build
// (plans/schools-lesson-build-spec.md, section 16.2, Phase 1 gate).
// The teacher workspace proper (Plan / Prepare / Teach / Mark / Record /
// Report) replaces this page in Phase 2.

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

export default async function EducatorPreviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('school_lessons')
    .select('id, module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides')
    .eq('module_id', 'ks3-12-misinfo-deepfakes')
    .single()

  const lesson = data as SchoolLesson | null
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides)
  if (!slides) notFound()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          marginBottom: '8px',
        }}>
          Schools preview · {lesson.key_stage} · {lesson.year_band}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
          fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.01em', lineHeight: 1.2,
          marginBottom: '6px',
        }}>
          {lesson.title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)',
          lineHeight: 1.6, marginBottom: '20px',
        }}>
          Action outcome: {lesson.single_action_outcome}
          {lesson.character_cast ? ` · Character: ${lesson.character_cast}` : ''}
        </p>
      </div>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 20px 80px' }}>
        <LessonPlayer
          lessonId={lesson.id}
          lessonSource="school_lesson"
          slides={slides}
          backHref="/educator/preview"
          teacherView
        />
      </div>
    </main>
  )
}
