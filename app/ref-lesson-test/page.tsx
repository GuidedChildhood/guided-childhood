'use client'

// REFERENCE ONLY, never linked from the app. The REAL LessonPlayer running a
// small fixture deck in the Rosenshine arc shape, so the end of lesson check
// and its results moment can be reviewed and screenshotted without a database
// or a login. completeEndpoint is null so no completion write is attempted.
// Delete this route once the lesson test build is approved.

import LessonPlayer from '@/components/lessons/LessonPlayer'
import type { LessonSlide } from '@/lib/content/lesson-slides'

const choice = (n: number, question: string): LessonSlide => ({
  type: 'choice',
  phase: 'prove',
  question,
  options: [
    { text: `Right answer ${n}`, correct: true, feedback: 'Spot on. That is exactly the habit.' },
    { text: `Wrong answer ${n}`, correct: false, feedback: 'Not quite. Think back to the checking step.' },
  ],
})

const SLIDES: LessonSlide[] = [
  { type: 'title', phase: 'starter', eyebrow: 'Builder · Ages 8 to 10', title: 'Is that really true?', body: 'The checking habit for anything the internet tells you.' },
  { type: 'concept', phase: 'teach', heading: 'Stop before you share', emoji: '🔍', body: 'Anyone can post anything. The habit is one pause and one check before believing or passing it on.' },
  choice(1, 'A post says a famous footballer has quit. What comes first?'),
  choice(2, 'The photo looks amazing. Does that make it true?'),
  choice(3, 'Who is a trustworthy place to double check?'),
  choice(4, 'A friend shared it, so it must be right?'),
  choice(5, 'You cannot tell if it is true. What do you do?'),
  { type: 'digi', phase: 'close', heading: 'DiGi says', lines: ['Pause, check, then decide.', 'That habit will outlast every app.'] },
]

export default function RefLessonTest() {
  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <LessonPlayer
        lessonId="ref-fixture"
        lessonSource="lesson"
        slides={SLIDES}
        backHref="/dashboard/lessons"
        digiPrompt="How do I help my child build the checking habit?"
        completeEndpoint={null}
      />
    </div>
  )
}
