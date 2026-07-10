import Link from 'next/link'
import SetupCompleteCard from './SetupCompleteCard'
import { STEPS, visibleSteps, type SetupFlags } from '@/lib/setup/steps'

// The setup path: one card that makes every service visible as a step
// with a tick, in the foundations first order (settings, agreement,
// quests, school, lesson, check ins). The proven adoption pattern:
// parents complete paths, they do not explore feature piles. Collapses
// to one quiet row once everything is done. The step list itself lives in
// lib/setup/steps.ts so the guided next step bar can share it.
export { STEPS, visibleSteps, type SetupFlags }

// One step at a time: the next undone step is the card, the rest wait as
// small chips so the parent always knows more is there without facing a
// wall of jobs on day one. Progressive, never overwhelming.
export default function SetupPath({ flags, phoneAge = false }: { flags: SetupFlags; phoneAge?: boolean }) {
  const steps = visibleSteps(phoneAge)
  const doneCount = steps.filter(s => flags[s.key]).length
  const current = steps.find(s => !flags[s.key])

  if (!current) return <SetupCompleteCard />

  const waiting = steps.filter(s => !flags[s.key] && s.key !== current.key)

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '20px', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Your next step
        </span>
        <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
          {steps.map(s => (
            <span key={s.key} style={{
              width: flags[s.key] ? 8 : s.key === current.key ? 18 : 8,
              height: 8, borderRadius: '8px',
              background: flags[s.key] ? 'var(--deep-teal)' : s.key === current.key ? 'var(--terracotta)' : 'var(--border)',
              transition: 'all 0.3s ease',
            }} />
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', marginLeft: '4px' }}>
            {doneCount}/{steps.length}
          </span>
        </span>
      </div>

      {/* The one step that matters right now */}
      <Link href={current.href} style={{ textDecoration: 'none' }}>
        <div style={{
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '16px', padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.25, marginBottom: '4px' }}>
              {current.title}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {current.what}
            </div>
          </div>
          <span style={{
            background: 'var(--terracotta)', color: 'var(--ink)', flexShrink: 0,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            borderRadius: '12px', padding: '10px 16px', boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}>
            Go
          </span>
        </div>
      </Link>

      {/* One step at a time. The rest are not listed here, they reveal one
          after another as each is done: finish this one and the next becomes
          the card, so a parent never faces the whole pile at once. A quiet
          count is all the reassurance they need that there is a sequence. */}
      {waiting.length > 0 && (
        <p style={{ margin: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.02em' }}>
          Then {waiting.length} more, one at a time.
        </p>
      )}
    </div>
  )
}
