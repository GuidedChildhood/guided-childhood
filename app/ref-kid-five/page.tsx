'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { STEPS, pickDay, type StepKey } from '@/lib/kid/five-a-day'
import KidStreakTakeover from '@/components/kid/KidStreakTakeover'

// Fixture reference page for the five a day card and the streak takeover, so
// both can be screenshotted without a database. Not linked from anywhere.
//
// ?view=part    a day partly done, which is the ordinary state
// ?view=done    every step ticked
// ?view=streak  the takeover at five days, the moment a friend is earned
//
// The card markup is duplicated here rather than importing KidFiveADay, because
// that component owns its own fetch and there is no API to answer it in a
// fixture. The rows are the part worth looking at and they are copied verbatim.

function Row({ k, done }: { k: StepKey; done: boolean }) {
  const def = STEPS[k]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
      background: done ? 'transparent' : 'var(--cream)',
      border: '1.5px solid ' + (done ? 'transparent' : 'rgba(26,26,46,0.07)'),
      borderRadius: '15px', padding: '10px 12px', opacity: done ? 0.72 : 1,
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', lineHeight: 1,
        background: done ? 'var(--tint-sage)' : 'var(--cream)',
        border: done ? '1.5px solid #2F8F6B' : '1.5px solid rgba(26,26,46,0.1)',
      }}>{done ? '✓' : def.emoji}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px',
          lineHeight: 1.25, color: done ? 'var(--ink-muted)' : 'var(--ink)',
          textDecoration: done ? 'line-through' : 'none',
        }}>{def.label}</span>
        {!done && (
          <span style={{ display: 'block', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.35, marginTop: '1px' }}>
            {def.hint}
          </span>
        )}
      </span>
      {!done && <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink-muted)' }}>›</span>}
    </div>
  )
}

function Fixture() {
  const view = useSearchParams().get('view') ?? 'part'
  const [open, setOpen] = useState(view === 'streak')
  const steps = pickDay('fixture-child', '2026-08-03')
  const done: StepKey[] = view === 'done' || view === 'streak' ? steps : steps.slice(0, 2)
  const complete = done.length === steps.length

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{
          background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '22px',
          padding: '16px 16px 12px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'var(--ink)', margin: 0, lineHeight: 1.15 }}>
              {complete ? 'Today is done! 🎉' : 'Your five for today'}
            </p>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>
              {done.length} of {steps.length}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'var(--cream)', overflow: 'hidden', margin: '8px 0 14px' }}>
            <div style={{ width: `${Math.round((done.length / steps.length) * 100)}%`, height: '100%', background: 'var(--terracotta)', borderRadius: 100 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {steps.map(k => <Row key={k} k={k} done={done.includes(k)} />)}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '12px 2px 2px', textAlign: 'center' }}>
            🔥 4 days in a row
          </p>
        </div>
      </div>
      {/* streak is the run of days, completedStreaks the cumulative count the
          Friends are bought with. Four of them lands one, so this fixture shows
          the friend earned state. */}
      {open && <KidStreakTakeover streak={5} completedStreaks={4} childName="Alfie" onClose={() => setOpen(false)} />}
    </div>
  )
}

export default function RefKidFive() {
  return <Suspense><Fixture /></Suspense>
}
