import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseSlides, autoSlidesFromLesson } from '@/lib/content/lesson-slides'
import { badgesFor } from '@/lib/content/curriculum-badges'
import LessonPlayer from '@/components/lessons/LessonPlayer'

// Whole class mode: the schools showcase. The same cinematic player at 16:9
// projector scale, read only, no auth, no completion write. The teacher
// advances with the arrow keys, choice slides show the answers big for a
// hands up vote, and the deck ends on the quiet truth: this is the family
// version, and the full school curriculum goes deeper. Same rows, bigger
// room; the family lesson is the reference point, never the school offer.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Whole class lesson — Guided Childhood' }

export default async function ClassLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  if (!/^[0-9a-f-]{36}$/.test(lessonId)) notFound()

  const supabase = createAdminClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, stage_id, category, title, the_idea, why_it_matters, try_this, key_message, status, audience, slides')
    .eq('id', lessonId)
    .maybeSingle()
  // Read only rendering of a live family lesson, nothing else.
  if (!lesson || lesson.audience !== 'parent' || lesson.status !== 'live') notFound()

  const rawSlides = parseSlides(lesson.slides) ?? autoSlidesFromLesson(lesson)
  if (!rawSlides) notFound()
  // The projector never carries the teacher script channel: this is the
  // showcase surface, and the scripted depth belongs to the school tier.
  const slides = rawSlides.map(s => {
    const copy = { ...s }
    delete (copy as { script?: string }).script
    return copy
  })

  return (
    <LessonPlayer
      lessonId={lesson.id}
      lessonSource="lesson"
      slides={slides}
      backHref="/schools"
      completeEndpoint={null}
      classMode
      badges={badgesFor(lesson.stage_id, lesson.category)}
    />
  )
}
