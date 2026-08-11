import Link from 'next/link'
import LearningSheet from '@/components/learning/LearningSheet'

// The subject tabs on the learning sheet, which is where the sheets got mixed
// up with each other.
//
// Justin, 11 August 2026, with a screenshot of the Reading tab: "we did the
// maths as tricky and it confirmed, and reading??? So they need to be separate."
//
// ── WHY THIS FIXTURE EXISTS AND ref-learning-sheet DOES NOT COVER IT ─────────
//
// ref-learning-sheet renders ONE sheet with no tabs, so it can show the sheet
// and can never show the bug, which only happens on the way from one subject to
// the next. The subject tabs are links, so switching them is a Next navigation,
// but LearningSheet lands back in the same position in the same tree and React
// keeps its state. That state, which objectives were ticked as tricky and
// whether the sheet is finished, is only ever true of one subject.
//
// So finishing maths and tapping Reading carried the finished card straight
// over, and then made it worse than a stale card: the tick list still held maths
// objective ids while the objectives had become the reading ones, nothing
// matched, and the card told a parent their child had not flagged anything as
// tricky minutes after they flagged something as tricky.
//
// ?bug=1 DROPS THE KEY, on purpose, so the check can prove it detects the fault
// as well as prove the fix. A test that only ever sees the fixed code cannot
// tell you it is testing anything.

export const dynamic = 'force-dynamic'

const SUBJECTS = ['maths', 'english', 'reading'] as const
type Subject = typeof SUBJECTS[number]

// Genuine objectives, one small set per subject, so the ids differ between
// tabs exactly as they do in the real table. That difference IS the bug.
const BY_SUBJECT: Record<Subject, { id: string; strand: string; objective: string }[]> = {
  maths: [
    { id: 'm-1', strand: 'Number and place value', objective: 'count in multiples of 6, 7, 9, 25 and 1000' },
    { id: 'm-2', strand: 'Number and place value', objective: 'find 1000 more or less than a given number' },
    { id: 'm-3', strand: 'Addition and subtraction', objective: 'add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction where appropriate' },
  ],
  english: [
    { id: 'e-1', strand: 'Writing transcription (spelling)', objective: 'spell further homophones' },
    { id: 'e-2', strand: 'Spoken language', objective: 'listen and respond appropriately to adults and their peers' },
  ],
  reading: [
    { id: 'r-1', strand: 'Reading word reading', objective: 'read further exception words, noting the unusual correspondences between spelling and sound' },
    { id: 'r-2', strand: 'Reading comprehension', objective: 'retrieve and record information from non-fiction' },
  ],
}

export default async function LearningSheetTabsFixture({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; bug?: string }>
}) {
  const { subject: raw, bug } = await searchParams
  const subject: Subject = SUBJECTS.includes(raw as Subject) ? (raw as Subject) : 'maths'
  const broken = bug === '1'
  const objectives = BY_SUBJECT[subject]

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Reference · the subject tabs {broken ? '· KEY REMOVED, showing the bug' : ''}
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 18px' }}>
        Where they are at school
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {SUBJECTS.map(s => (
          <Link
            key={s}
            href={`/dev/learning-sheet-tabs?subject=${s}${broken ? '&bug=1' : ''}`}
            data-subject={s}
            style={{
              padding: '11px 18px', borderRadius: 14, textDecoration: 'none',
              border: `1.5px solid ${s === subject ? 'var(--terracotta)' : 'var(--border)'}`,
              background: s === subject ? 'var(--terracotta)' : '#fff',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
            }}
          >
            {s[0].toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </div>

      <LearningSheet
        {...(broken ? {} : { key: `child:${subject}` })}
        childId="00000000-0000-0000-0000-0000000000ff"
        childName="Teo"
        yearGroup={4}
        subject={subject}
        term="autumn"
        label="Year 4, Autumn term"
        objectives={objectives}
      />
    </div>
  )
}
