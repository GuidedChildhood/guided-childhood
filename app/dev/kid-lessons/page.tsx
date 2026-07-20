import { notFound } from 'next/navigation'
import KidLessonList from '@/components/kid/KidLessonList'

// Dev only fixture: the child's My lessons list with sample data, so the
// kid surface can be checked without a kid link or a database. Never
// reachable in production.

export const dynamic = 'force-dynamic'

export default function KidLessonsFixturePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <KidLessonList
      backHref="/dev/kid-lessons"
      childName="Alfie"
      stageName="Explorer"
      ages="Ages 11 to 13"
      items={[
        { id: 'fx-1', title: 'How the feed decides what you see', emoji: '🔍', keyMessage: 'The feed is a machine guessing what holds you. Watch with your eyes open.', done: true, score: 3, locked: false },
        { id: 'fx-2', title: 'Group chats and the kind exit', emoji: '💛', keyMessage: 'You can leave a chat that feels bad, and telling is always safe.', done: false, score: null, locked: false },
        { id: 'fx-3', title: 'Is that picture real?', emoji: '🤖', keyMessage: 'Three checks before you believe or share anything surprising.', done: false, score: null, locked: false },
      ]}
      hrefFor={() => '#'}
    />
  )
}
