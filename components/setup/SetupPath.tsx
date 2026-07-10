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

      {/* The rest wait as a clear numbered list, so a parent reads them as an
          ordered set of steps and every one is an obvious tap, not a vague
          chip that looks like it might do nothing. */}
      {waiting.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: '10px' }}>
            Then, in order
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {waiting.map((s, i) => (
              <Link key={s.key} href={s.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'var(--cream)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '11px 14px',
                }}>
                  <span style={{
                    flexShrink: 0, width: 26, height: 26, borderRadius: '8px',
                    background: '#fff', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--terracotta-dark)',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: '1px' }}>
                      Step {i + 1}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                      {s.title}
                    </span>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: '16px', color: 'var(--ink-light)' }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
