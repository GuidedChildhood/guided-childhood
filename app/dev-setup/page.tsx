import Link from 'next/link'

const STEP_ICON: Record<string, string> = { daily: '🌅', push: '🔔', quests: '⭐', school: '🏫', childLink: '📲', agreement: '🤝' }
const shortWhat: Record<string, string> = {
  daily: 'Two minutes: the moment, the words, the check in.',
  push: 'Three gentle nudges a day, at screen time moments.',
  quests: 'Jobs earn stars, stars buy the screen time you agree.',
  school: 'PE kit, library day, clubs. Reminds you both weekly.',
  childLink: 'Their own private link, opens like an app on their phone.',
  agreement: 'Decided together, signed. It powers what stars buy.',
}
const todo = [
  { key: 'quests', title: 'Set up Family Quests' },
  { key: 'school', title: 'Set up school routines' },
  { key: 'childLink', title: 'Send your child their phone link' },
  { key: 'agreement', title: 'Build your family agreement' },
]
const done = [
  { key: 'daily', title: 'Do your first daily practice' },
  { key: 'push', title: 'Turn on check ins' },
]

export default function DevSetup() {
  const doneCount = 2, total = 6
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 48px', background: 'var(--cream)', minHeight: '100dvh' }}>
      <p className="eyebrow" style={{ marginBottom: 4 }}>One time setup</p>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 8 }}>Set up</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <div style={{ flex: 1, height: 10, borderRadius: 100, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ width: `${Math.round((doneCount / total) * 100)}%`, height: '100%', borderRadius: 100, background: 'var(--terracotta)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>{doneCount}/{total}</span>
      </div>
      <p className="eyebrow" style={{ marginBottom: 10 }}>To do</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
        {todo.map((s, i) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: i === 0 ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)', borderRadius: 16, padding: '16px 18px', boxShadow: i === 0 ? '0 4px 16px rgba(201,154,40,0.14)' : '0 2px 10px rgba(26,26,46,0.04)' }}>
            <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{STEP_ICON[s.key]}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--ink)', lineHeight: 1.25 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>{shortWhat[s.key]}</div>
            </div>
            <Link href="#" style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, borderRadius: 12, padding: '10px 18px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>{i === 0 ? 'Start' : 'Set up'}</Link>
          </div>
        ))}
      </div>
      <p className="eyebrow" style={{ marginBottom: 10 }}>Done</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {done.map(s => (
          <Link key={s.key} href="#" style={{ display: 'flex', alignItems: 'center', gap: 13, textDecoration: 'none', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 14, padding: '13px 16px' }}>
            <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{STEP_ICON[s.key]}</span>
            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{s.title}</span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1F7A54', background: '#D4EDDF', borderRadius: 100, padding: '3px 9px' }}>✓ Done</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
