import { weeklyReviewEmail } from '@/lib/email/templates'

// Harness for the Sunday weekly review email, and specifically for the What
// has moved block added on 13 August 2026.
//
// This email only exists inside a cron that needs a real family with a real
// week behind it, so the only way to look at it has been to wait until Sunday
// and read somebody's inbox. It renders the REAL template through an iframe,
// so what is checked is what lands.
//
// The fixture deliberately carries one climb, one slide and one holding, since
// the three take three different colours and the slide is the one that must
// not read as an alarm.
//
// 404s in production via the dev layout.

export const dynamic = 'force-dynamic'

export default function DevWeeklyReviewEmail() {
  const content = weeklyReviewEmail({
    parentName: 'Justin',
    childLabel: 'Olga',
    unsubscribe: 'https://www.guidedchildhood.com/dashboard/email-check',
    review: {
      week_start: '2026-08-10',
      summary: 'Olga had a strong week. Six jobs done without a reminder, and the bedtime handover went without a row four nights out of seven.',
      watch_for: 'Two of the late finishes were on gaming nights, which is the pattern worth watching rather than the total.',
      suggestion: 'Try moving the timer warning to ten minutes rather than five. It gives her the ending rather than you having to announce it.',
      suggestion_routine: null,
      stats: {
        children: ['Olga'],
        ageBands: ['11-13'],
        questsApproved: 6,
        starsEarned: 14,
        starsSpent: 8,
        deviceMinutes: 410,
        activeDays: 5,
        topQuest: 'Reading before screens',
        schoolOpen: 0,
        momentsDone: 2,
        momentsList: ['The calm minute'],
        lessonsDone: ['What an algorithm wants'],
        scriptsTried: ['Handing the phone over'],
        ratingShift: null,
      },
    },
    movement: [
      { label: 'Bedtime', from: 5, to: 8, span: 'over 6 weeks' },
      { label: 'Gaming on school nights', from: 7, to: 4, span: 'over 5 weeks' },
      { label: 'Handing the phone over', from: 6, to: 6, span: 'over 8 weeks' },
    ],
  })

  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100dvh', padding: '20px' }}>
      <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Dev · the Sunday weekly review
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 14px' }}>
        Subject: {content.subject}
      </p>
      <iframe
        title="Weekly review email"
        srcDoc={content.html}
        style={{ width: '100%', maxWidth: 620, height: '200vh', border: '1.5px solid var(--border)', borderRadius: 16, background: '#fff' }}
      />
    </main>
  )
}
