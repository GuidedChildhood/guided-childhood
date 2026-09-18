import { monthlyBalanceEmail, type MonthlyChild } from '@/lib/email/templates'
import { buildMonthPace } from '@/lib/balance/pace'

// The monthly review, rendered, at the three shapes that matter.
//
// Justin, 18 September 2026: the review should show the worries "have all
// progressed" and summarise the child's and passport progress, by email and
// PWA. The hard cases are not the happy one:
//
//   1. a child with minutes AND progress, the full block
//   2. a child with NO timer ever run but real progress, which used to be
//      dropped from the email entirely and is the common case
//   3. a child with worries that have not moved yet, which must not be
//      dressed up as good news
const pace = (used: number, prev: number | null) => buildMonthPace({
  usedThisMonth: used, dailyGuide: 90, days: 30,
  usedPreviousMonth: prev, previousDays: prev == null ? null : 31,
})

const CHILDREN: MonthlyChild[] = [
  {
    childLabel: 'Timbotee',
    pace: pace(2400, 3100),
    heaviest: { label: 'the tablet', minutes: 1400 },
    progress: {
      tracked: 4, moved: 3, rested: 2,
      biggestMover: { label: 'Bedtime screens', from: 2, to: 4 },
      lessonsPassed: 3, stagesAwarded: 1,
    },
  },
  {
    childLabel: 'Olga',
    pace: null,
    heaviest: null,
    progress: {
      tracked: 5, moved: 1, rested: 0,
      biggestMover: { label: 'Coming off screens', from: 1, to: 3 },
      lessonsPassed: 0, stagesAwarded: 0,
    },
  },
  {
    childLabel: 'Teo',
    pace: pace(1800, null),
    heaviest: null,
    progress: {
      tracked: 6, moved: 0, rested: 0,
      biggestMover: null, lessonsPassed: 1, stagesAwarded: 0,
    },
  },
]

export default function RefEmailMonthly() {
  const many = monthlyBalanceEmail({ children: CHILDREN, monthLabel: 'August', unsubscribe: '#' })
  const one = monthlyBalanceEmail({ children: [CHILDREN[1]], monthLabel: 'August', unsubscribe: '#' })
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '20px 16px 60px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <p className="eyebrow" style={{ margin: '0 0 6px' }}>Three children, one email</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', margin: '0 0 12px' }}>
          Subject: {many.subject}
        </p>
        <div style={{ border: 'var(--edge)', borderRadius: 14, overflow: 'hidden', marginBottom: 32, background: '#fff' }}
             dangerouslySetInnerHTML={{ __html: many.html }} />
        <p className="eyebrow" style={{ margin: '0 0 6px' }}>One child, no timer ever run</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', margin: '0 0 12px' }}>
          Subject: {one.subject}
        </p>
        <div style={{ border: 'var(--edge)', borderRadius: 14, overflow: 'hidden', background: '#fff' }}
             dangerouslySetInnerHTML={{ __html: one.html }} />
      </div>
    </div>
  )
}
