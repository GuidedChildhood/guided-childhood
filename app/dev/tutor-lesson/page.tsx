import { notFound } from 'next/navigation'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides } from '@gc/shared/lesson-slides'

// Dev only fixture: a tutor lesson deck in the child's player, without a kid
// link, a database, or a model call. The layout check at 390 and 1280 runs
// against this, so the shape of a generated deck can be looked at before one
// exists.
//
// The deck below is written by hand in exactly the shape /api/learning/lesson
// asks DiGi for: title, three concept slides that teach with real numbers, a
// tryit, three choice slides that get harder, a recap and DiGi to close. It is
// a Year 4 fractions lesson because that is the homework a parent is most
// likely to be looking at when they find the decoder, and because the equivalent
// fractions method is the one most adults were taught differently.

export const dynamic = 'force-dynamic'

const DECK = [
  { type: 'title', eyebrow: 'A lesson just for you', title: 'Fractions that look different but are twins' },
  {
    type: 'concept', phase: 'teach', emoji: '🍕',
    heading: 'Two fractions, one amount',
    body: 'Half a pizza and two quarters of a pizza are the same amount of pizza. The pieces are cut differently, that is all. So 1/2 and 2/4 are twins. We call them equivalent fractions.',
  },
  {
    type: 'concept', phase: 'teach', emoji: '✖️',
    heading: 'How to make a twin',
    body: 'Times the top and the bottom by the same number. Start with 1/2. Times both by 3 and you get 3/6. Times both by 5 and you get 5/10. All twins of a half, because you cut every piece the same number of times.',
  },
  {
    type: 'concept', phase: 'teach', emoji: '🔍',
    heading: 'Going the other way',
    body: 'You can divide instead. Take 6/8. Both 6 and 8 divide by 2, so 6/8 becomes 3/4. Same amount, fewer pieces. That is called simplifying, and it is the same trick backwards.',
  },
  {
    type: 'tryit', phase: 'practise',
    heading: 'Have a go, out loud',
    body: 'Say three twins of 1/3. Start by timesing the top and bottom by 2, then by 3, then by 4. Say each one out loud before you tap on.',
  },
  {
    type: 'choice', phase: 'prove',
    question: 'Which one is a twin of 1/2?',
    options: [
      { text: '4/8', correct: true, feedback: 'Yes. Times the top and bottom of 1/2 by 4 and you land on 4/8.' },
      { text: '2/5', correct: false, feedback: 'Have another look. 2 times 2 is 4, not 5, so the bottom is out.' },
      { text: '1/4', correct: false, feedback: 'Have another look. Only the bottom changed there, and both have to change together.' },
      { text: '3/5', correct: false, feedback: 'Have another look. Try timesing 1 and 2 by the same number and see what you get.' },
    ],
  },
  {
    type: 'choice', phase: 'prove',
    question: '6/9 simplifies to which one?',
    options: [
      { text: '2/3', correct: true, feedback: 'Yes. Both divide by 3, so 6 becomes 2 and 9 becomes 3.' },
      { text: '3/4', correct: false, feedback: 'Have another look. Find a number that goes into both 6 and 9.' },
      { text: '1/3', correct: false, feedback: 'Close. That divides the top by 6 and the bottom by 3, and they have to match.' },
      { text: '6/3', correct: false, feedback: 'Have another look. The bottom got smaller on its own there.' },
    ],
  },
  {
    type: 'choice', phase: 'prove',
    question: 'Ellie says 3/4 and 9/12 are the same amount. Is she right?',
    options: [
      { text: 'Yes, because 3 and 4 were both timesed by 3', correct: true, feedback: 'Exactly right, and that is the reason, not just the answer.' },
      { text: 'No, because 9 is bigger than 3', correct: false, feedback: 'Have another look. The bottom got bigger too, so the pieces got smaller.' },
      { text: 'Yes, because both have a 3 in them', correct: false, feedback: 'Not quite. Check what happened to the top and the bottom.' },
      { text: 'You cannot tell without drawing it', correct: false, feedback: 'You can. Look at what you would times 3 and 4 by to reach 9 and 12.' },
    ],
  },
  {
    type: 'recap', phase: 'close',
    heading: 'What you just learned',
    points: [
      'Equivalent fractions are the same amount cut into different pieces',
      'Times the top and the bottom by the same number to make a twin',
      'Divide the top and the bottom by the same number to simplify',
    ],
  },
  {
    type: 'digi', phase: 'close',
    heading: 'Nice one',
    lines: ['Fractions stop being scary the moment you spot the twins.', 'Next time you see one on a worksheet, try simplifying it first.'],
  },
]

export default function TutorLessonFixturePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  const slides = parseSlides(DECK)
  if (!slides) notFound()

  return (
    <div style={{ minHeight: '100dvh', background: '#173C46', padding: '20px 14px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)', margin: '0 0 6px' }}>
            A lesson just for Alfie
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 6vw, 1.7rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            📘 Fractions that look different but are twins
          </h1>
        </div>
        <div style={{ background: 'var(--cream)', borderRadius: 24, padding: 'clamp(18px, 4vw, 28px)', boxShadow: '0 6px 0 rgba(0,0,0,0.22)' }}>
          <LessonPlayer
            lessonId="fixture"
            lessonSource="lesson"
            slides={slides}
            backHref="/dev/tutor-lesson"
            homeHref="/dev/tutor-lesson"
            kidMode
            kidStars={3}
            completeEndpoint={null}
          />
        </div>
      </div>
    </div>
  )
}
