import { notFound } from 'next/navigation'
import { anon as supabase } from '@/lib/supabase/anon'
import { parseSlides } from '@gc/shared/lesson-slides'
import LessonPlayer from '@gc/shared/components/LessonPlayer'

// Whole class mode: the projector showcase, open to anyone with the link.
// In the parents repo this page rendered a FAMILY lesson as a taster; here
// it renders the real school curriculum row, because on the schools domain
// the curriculum is not the upsell, it is the product. Read only, no auth,
// no completion write. The teacher script channel still stays out: the
// scripts belong to the teach surface, not the projector.

export const revalidate = 3600
export const metadata = { title: 'Whole class lesson' }

export default async function ClassLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  if (!/^[0-9a-f-]{36}$/.test(lessonId)) notFound()

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('id, title, slides')
    .eq('id', lessonId)
    .maybeSingle()
  if (!lesson) notFound()

  const rawSlides = parseSlides(lesson.slides)
  if (!rawSlides) notFound()
  const slides = rawSlides.map(s => {
    const copy = { ...s }
    delete (copy as { script?: string }).script
    return copy
  })

  return (
    <LessonPlayer
      lessonId={lesson.id}
      lessonSource="school_lesson"
      slides={slides}
      backHref="/curriculum"
      completeEndpoint={null}
      classMode
      classCtaHref="/curriculum"
    />
  )
}
