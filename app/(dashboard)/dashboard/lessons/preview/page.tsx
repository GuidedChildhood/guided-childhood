import SlidePlayer from '@/components/lessons/SlidePlayer'
import { FLAGSHIP_LESSON } from '@/lib/lessons/flagship-misinfo'

// The flagship lesson preview: the first playable lesson in the slide
// format, proving the engine before the full build moves content into
// the database.

export default function LessonPreviewPage() {
  return <SlidePlayer lesson={FLAGSHIP_LESSON} />
}
