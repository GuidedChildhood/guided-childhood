'use client'

// Dev harness for the Next step bar (components/setup/SetupNextBar.tsx).
//
// The real bar only renders behind auth, on a dashboard page, with setup part
// finished, and now only once per step ever, which makes it awkward to look at
// on purpose. This renders the same markup over the same cream background so
// the colour can be checked at phone width, with the old espresso next to it
// for comparison.

const TITLES = ['Set up Family Quests', 'Add your child to the app', 'Print the star chart']

function Bar({ title, background, shadow }: { title: string; background: string; shadow: string }) {
  return (
    <div style={{ width: 'calc(100% - 24px)', maxWidth: 440, margin: '0 auto 16px' }}>
      <div style={{
        background, borderRadius: 18, boxShadow: shadow,
        padding: '12px 12px 12px 18px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 2 }}>
            Next step
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.72)', padding: '6px 4px', flexShrink: 0 }}>
          Not now
        </button>
        <span style={{
          flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)',
          borderRadius: 12, padding: '11px 18px', fontFamily: 'var(--font-display)',
          fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)',
        }}>
          Go
        </span>
      </div>
    </div>
  )
}

export default function SetupBarHarness() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 0 60px' }}>
      <p className="eyebrow" style={{ textAlign: 'center', color: 'var(--terracotta-dark)', marginBottom: 14 }}>New, retro green</p>
      {TITLES.map(t => (
        <Bar key={t} title={t} background="var(--retro-green)" shadow="0 10px 26px rgba(35,111,82,0.28)" />
      ))}

      <p className="eyebrow" style={{ textAlign: 'center', color: 'var(--ink-muted)', margin: '30px 0 14px' }}>Old, espresso</p>
      {TITLES.map(t => (
        <Bar key={t} title={t} background="var(--deep-teal)" shadow="0 12px 32px rgba(0,0,0,0.22)" />
      ))}
    </main>
  )
}
