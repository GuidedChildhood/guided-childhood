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

const STEPS: {
  key: keyof SetupFlags | 'settings'
  title: string
  what: string
  href: string
}[] = [
  { key: 'settings',  title: 'Set the device settings',   what: 'The age right settings remove half the arguments before they happen.', href: '/dashboard/pathway' },
  { key: 'agreement', title: 'Build your family agreement', what: 'Decided together and signed, it makes every boundary something you both chose.', href: '/dashboard/agreement' },
  { key: 'quests',    title: 'Set up Family Quests',       what: 'Their everyday jobs earn stars, stars buy the screen time you agreed. They tick, you approve.', href: '/dashboard/quests' },
  { key: 'school',    title: 'Catch the school emails',    what: 'Forward school emails to your private address and PE kit days land as reminders.', href: '/dashboard/school' },
  { key: 'daily',     title: 'Do your first daily practice', what: 'Two minutes a day: the moment, the words, the check in. This is the habit.', href: '/dashboard/daily' },
  { key: 'push',      title: 'Turn on check ins',          what: 'Three gentle nudges a day at the moments your child faces screens.', href: '/dashboard' },
]

export default function SetupPath({ flags }: { flags: SetupFlags }) {
  const doneFor = (key: string) => key === 'settings' ? null : flags[key as keyof SetupFlags]
  const knowable = STEPS.filter(s => s.key !== 'settings')
  const doneCount = knowable.filter(s => flags[s.key as keyof SetupFlags]).length
  const allDone = doneCount === knowable.length

  if (allDone) {
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

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '20px', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Set up your family
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)' }}>
          {doneCount} of {knowable.length} done
        </span>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
        Six steps, in the order that makes everything easy. Each one unlocks the next part of how this all works together.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {STEPS.map((step, i) => {
          const done = doneFor(step.key) === true
          return (
            <Link key={step.key} href={step.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '11px 13px', borderRadius: '13px',
                background: done ? 'var(--tint-sage)' : 'var(--cream)',
                border: '1px solid var(--border)',
                opacity: done ? 0.75 : 1,
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                  background: done ? 'var(--deep-teal)' : '#fff',
                  border: done ? 'none' : '2px solid var(--border)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>
                  {done ? '✓' : <span style={{ color: 'var(--ink-muted)' }}>{i + 1}</span>}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '14px', color: 'var(--ink)', lineHeight: 1.3,
                    textDecoration: done ? 'line-through' : 'none',
                  }}>
                    {step.title}
                  </span>
                  {!done && (
                    <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>
                      {step.what}
                    </span>
                  )}
                </span>
                {!done && <span style={{ color: 'var(--terracotta-dark)', fontWeight: 700, flexShrink: 0 }}>→</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
