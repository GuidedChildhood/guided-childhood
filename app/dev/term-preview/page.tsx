import TermPreviewCard from '@/components/home/TermPreviewCard'
import KidTermPreview from '@/components/kid/KidTermPreview'
import { previewWindow, type TermPreview } from '@/lib/learning/term-preview'

// Both term preview cards side by side.
//
// They exist because the real ones are invisible for most of the year: the card
// only renders in a school holiday or the first week back, which is the whole
// point of it and also means that without this page nobody could look at it in,
// say, November without changing the system clock.
//
// The subjects here are real Year 4 Spring strands, so the line lengths are the
// ones a family would actually see rather than short made up ones that make the
// layout look better than it is.

export const dynamic = 'force-dynamic'

const PREVIEW: TermPreview = {
  label: 'Year 4, Spring term',
  yearGroup: 4,
  inHoliday: true,
  subjects: [
    {
      label: 'Maths',
      line: 'Number and place value, Addition and subtraction, Multiplication and division',
      tryThis: 'Count something real together. Change, ingredients, or the minutes until tea.',
    },
    {
      label: 'English',
      line: 'Reading comprehension, Writing composition, Vocabulary, grammar and punctuation',
      tryThis: 'Read the same book they are reading and ask them what they think happens next.',
    },
    {
      label: 'Science',
      line: 'States of matter',
      tryThis: 'Ask them to explain one thing they saw today. Explaining it is the learning.',
    },
  ],
}

export default function TermPreviewFixture() {
  const today = previewWindow(new Date())
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '26px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 4px',
        }}>
          Reference · the term preview
        </p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '0 0 22px', lineHeight: 1.5 }}>
          Today the window is {today.show ? `OPEN (${today.inHoliday ? 'in a holiday' : 'first week back'})` : 'CLOSED, so neither card would render in the real app'}.
        </p>

        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 10px' }}>
          Parent, on the dashboard
        </p>
        <TermPreviewCard preview={PREVIEW} childName="Alma" />

        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '24px 0 10px' }}>
          Child, on their own week
        </p>
        <KidTermPreview preview={PREVIEW} childName="Alma" />

        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '24px 0 10px' }}>
          First week back, not a holiday
        </p>
        <KidTermPreview preview={{ ...PREVIEW, inHoliday: false }} childName="Alma" />
      </div>
    </div>
  )
}
