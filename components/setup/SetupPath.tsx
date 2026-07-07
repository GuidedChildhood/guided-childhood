import Link from 'next/link'

// The setup path: one card that makes every service visible as a step
// with a tick, in the foundations first order (settings, agreement,
// quests, school, lesson, check ins). The proven adoption pattern:
// parents complete paths, they do not explore feature piles. Collapses
// to one quiet row once everything is done.

export type SetupFlags = {
  agreement: boolean
  quests: boolean
  school: boolean
  push: boolean
  daily: boolean
}

// Ordered for flow: fastest value and least effort first, so the parent
// gets a win before the heavier multi step asks. Daily practice is the
// two minute core habit, notifications make sure the nudges reach them,
// then quests, then the heavier school routines, then the agreement they
// build together when ready.
export const STEPS: {
  key: keyof SetupFlags
  title: string
  what: string
  href: string
}[] = [
  { key: 'daily',     title: 'Do your first daily practice', what: 'Two minutes: the moment, the words, the check in. This is the habit everything else hangs on.', href: '/dashboard/daily' },
  { key: 'push',      title: 'Turn on check ins',          what: 'Three gentle nudges a day at the moments your child faces screens.', href: '/dashboard' },
  { key: 'quests',    title: 'Set up Family Quests',       what: 'Their everyday jobs earn stars, stars buy the screen time you agree. They tick, you approve. Two minutes to set up, and the kids love it.', href: '/dashboard/quests' },
  { key: 'school',    title: 'Set up school routines',      what: 'Add PE kit, library day or a Saturday activity by hand, once, and it reminds you and your child every week from then on. Forwarding school email is there too if you want it.', href: '/dashboard#school-actions' },
  { key: 'agreement', title: 'Build your family agreement', what: 'When you are ready: decided together and signed, it makes every boundary something you both chose, and it powers what the stars buy.', href: '/dashboard/agreement' },
]

// One step at a time: the next undone step is the card, the rest wait as
// small chips so the parent always knows more is there without facing a
// wall of jobs on day one. Progressive, never overwhelming.
export default function SetupPath({ flags }: { flags: SetupFlags }) {
  const doneCount = STEPS.filter(s => flags[s.key]).length
  const current = STEPS.find(s => !flags[s.key])

  if (!current) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'var(--tint-sage)', borderRadius: '14px',
        padding: '12px 16px', marginBottom: '20px',
      }}>
        <span>✓</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>
          Your family setup is complete. Everything now works together.
        </span>
      </div>
    )
  }

  const waiting = STEPS.filter(s => !flags[s.key] && s.key !== current.key)

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
          {STEPS.map(s => (
            <span key={s.key} style={{
              width: flags[s.key] ? 8 : s.key === current.key ? 18 : 8,
              height: 8, borderRadius: '8px',
              background: flags[s.key] ? 'var(--deep-teal)' : s.key === current.key ? 'var(--terracotta)' : 'var(--border)',
              transition: 'all 0.3s ease',
            }} />
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)', marginLeft: '4px' }}>
            {doneCount}/{STEPS.length}
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

      {/* The rest wait quietly, visible but never a wall */}
      {waiting.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--ink-muted)', alignSelf: 'center' }}>Then:</span>
          {waiting.map(s => (
            <Link key={s.key} href={s.href} style={{ textDecoration: 'none' }}>
              <span style={{
                display: 'inline-block', padding: '6px 12px', borderRadius: '100px',
                background: 'var(--cream)', border: '1px solid var(--border)',
                fontFamily: 'var(--font-body)', fontSize: '11.5px', fontWeight: 600, color: 'var(--ink-soft)',
              }}>
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
