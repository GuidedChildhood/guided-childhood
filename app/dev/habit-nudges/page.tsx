'use client'

import { useState } from 'react'
import { pickHabitNudge, snoozeDays, type NudgeFacts } from '@/lib/home/habit-nudges'

// The four habit nudges, all at once, which is the one thing a real family will
// never see.
//
// Justin, 10 August 2026: "little pop ups, not intrusive or annoying." The rule
// that makes that true is that only one ever shows, and only when it is true of
// this family, so the only way to look at all four side by side and judge the
// copy is a page like this.
//
// Rendered from the real rules rather than from copied strings, so a card that
// stops firing stops appearing here too.

export const dynamic = 'force-static'

const BASE: NudgeFacts = {
  activeQuests: 3,
  everTimed: true,
  screenDaysThisWeek: 5,
  waitingTicks: 0,
  waitingOldestDays: 0,
  bankedStars: 0,
  bankedIdleDays: 0,
  offlineDaysThisFortnight: 2,
}

const CASES: { label: string; note: string; facts: NudgeFacts }[] = [
  {
    label: 'A job ticked yesterday, no yes yet',
    note: 'The highest priority card, because a real child is in a queue behind a parent who does not know they are in it.',
    facts: { ...BASE, waitingTicks: 3, waitingOldestDays: 2 },
  },
  {
    label: 'Screens all week, timer never started',
    note: 'Only says this to a family with a board set up and screens actually happening. Otherwise it is advice about a situation they are not in.',
    facts: { ...BASE, everTimed: false, screenDaysThisWeek: 4 },
  },
  {
    label: 'A fortnight with nothing offline',
    note: 'Hands over something to do rather than a number to feel bad about. The offline half is a thing we owe them.',
    facts: { ...BASE, screenDaysThisWeek: 6, offlineDaysThisFortnight: 0 },
  },
  {
    label: 'Earned and never spent',
    note: 'The loop worked and went quiet at the last step, which is usually a child who does not know the minutes are there.',
    facts: { ...BASE, bankedStars: 9, bankedIdleDays: 6 },
  },
  {
    label: 'A family doing it well',
    note: 'Nothing. This is what most parents see most days, and it is the whole reason the cards keep meaning something.',
    facts: BASE,
  },
]

const CARD: React.CSSProperties = {
  background: 'var(--tint-sage)', border: '1.5px solid var(--border)',
  borderRadius: 18, padding: '15px 17px',
}

export default function HabitNudgesFixture() {
  const [suppressed, setSuppressed] = useState<Set<string>>(new Set())

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
          The habit nudges
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 8px' }}>
          One at a time in the real app, four here so the copy can be read together. Not now backs off: {[0, 1, 2, 3, 4].map(n => `${snoozeDays(n)}`).join(', ')} days.
        </p>
        <button
          type="button"
          onClick={() => setSuppressed(new Set())}
          style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 12, padding: '7px 13px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink)', marginBottom: 24 }}
        >
          Reset the snoozes
        </button>

        {CASES.map(c => {
          const nudge = pickHabitNudge(c.facts, suppressed)
          return (
            <section key={c.label} style={{ marginBottom: 30 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 2px' }}>{c.label}</h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 12px' }}>{c.note}</p>
              {nudge ? (
                <div style={CARD}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 5 }}>
                    {nudge.eyebrow}
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 6px' }}>{nudge.line}</p>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>{nudge.why}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 18px', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14, boxShadow: '0 4px 0 var(--terracotta-dark)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}>
                      {nudge.cta}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSuppressed(prev => new Set([...prev, nudge.key]))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}
                    >
                      Not now
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: 0 }}>
                  Nothing to say
                </p>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
