import MovementLine from '@/components/working/MovementLine'
import { movementSentence, spanWords, usedWords, type Movement } from '@/lib/working/movement'

// Dev harness for What is working.
//
// The real page reads concern_events behind auth, and a family needs weeks of
// check ins before it says anything at all, so this hands it the shape it will
// have after two months: one thing that climbed, one that slipped, one holding
// and one still waiting on a second number. That fourth case is the one worth
// having a fixture for, because it is the state most families are in for their
// first fortnight and it is the easiest to get wrong.
//
// The rendering below is a copy of the page's list, not the page itself: the
// page is a server component that queries Supabase, and the container blocks
// supabase.co outright. What is being checked here is the line, the sentence
// and the row at 390 and 1280.

const FIXTURES: Movement[] = [
  {
    concernId: '1', label: 'Bedtime', status: 'improving', childName: 'Teo',
    points: [
      { at: '2026-06-30T20:00:00Z', score: 5 },
      { at: '2026-07-07T20:00:00Z', score: 4 },
      { at: '2026-07-14T20:00:00Z', score: 6 },
      { at: '2026-07-21T20:00:00Z', score: 7 },
      { at: '2026-08-04T20:00:00Z', score: 7 },
      { at: '2026-08-11T20:00:00Z', score: 8 },
    ],
    startScore: 5, endScore: 8, weeks: 6, observed: true, recurrences: 0,
    used: [{ type: 'script', count: 4 }, { type: 'digi', count: 1 }],
  },
  {
    concernId: '2', label: 'Gaming on school nights', status: 'open', childName: 'Olga',
    points: [
      { at: '2026-07-07T20:00:00Z', score: 7 },
      { at: '2026-07-21T20:00:00Z', score: 6 },
      { at: '2026-08-11T20:00:00Z', score: 4 },
    ],
    startScore: 7, endScore: 4, weeks: 5, observed: true, recurrences: 1,
    used: [{ type: 'rightnow', count: 2 }],
  },
  {
    concernId: '3', label: 'Handing the phone over', status: 'resolved', childName: 'Teo',
    points: [
      { at: '2026-06-16T20:00:00Z', score: 6 },
      { at: '2026-07-14T20:00:00Z', score: 6 },
      { at: '2026-08-11T20:00:00Z', score: 6 },
    ],
    startScore: 6, endScore: 6, weeks: 8, observed: true, recurrences: 0,
    used: [{ type: 'lesson', count: 3 }],
  },
]

const WAITING = ['Group chats']

export default function WhatIsWorkingFixture() {
  const withMovement = FIXTURES
  const climbed = withMovement.filter(m => (m.endScore as number) > (m.startScore as number))
  const slipped = withMovement.filter(m => (m.endScore as number) < (m.startScore as number))
  const lead = climbed[0] ?? withMovement[0]

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
          What is working
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.12, margin: '0 0 10px' }}>
          Here is what has actually moved
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.4, margin: '0 0 6px' }}>
          {movementSentence(lead)}
        </p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 22px' }}>
          Each worry keeps its own line. Nothing here is added together, because a family carrying three things and a family carrying nine do not share a scale, and an average would drop the moment you told us about something new.
        </p>

        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '6px 18px 14px', marginBottom: '18px' }}>
          {withMovement.map((m, i) => {
            const start = m.startScore as number
            const end = m.endScore as number
            const tone = end > start ? 'up' : end < start ? 'down' : 'flat'
            return (
              <div key={m.concernId} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '3px' }}>
                    {start} to {end}
                    {m.observed && m.weeks >= 1 ? ` ${spanWords(m.weeks)}` : ''}
                    {m.status === 'resolved' ? ' · sorted' : ''}
                    {m.recurrences > 0 ? ` · back ${m.recurrences}x` : ''}
                  </div>
                  {m.used.length > 0 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      alongside {usedWords(m.used[0].type)}
                    </div>
                  )}
                </div>
                <MovementLine points={m.points} tone={tone} />
              </div>
            )
          })}
        </div>

        {slipped.length > 0 && (
          <div style={{ background: 'var(--stage-1)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '15px 17px', marginBottom: '18px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '4px' }}>
              {slipped[0].label} has gone the other way
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
              A dip is information, not a verdict. It usually means something changed at home rather than that anything failed, and it is the most useful thing to bring to DiGi.
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', background: 'var(--terracotta)', color: 'var(--ink)',
              borderRadius: '14px', padding: '11px 18px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}>
              Talk it through with DiGi
            </span>
          </div>
        )}

        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 18px' }}>
          1 of these came back after being sorted. That is normal, and it is worth knowing rather than hiding: the ones that keep returning are the ones to build a proper plan around.
        </p>

        <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '15px 17px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            Waiting on a second check in
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            {WAITING.join(', ')}. One number is a day. Two is a direction, and that is when it appears above.
          </p>
        </div>
      </div>
    </div>
  )
}
