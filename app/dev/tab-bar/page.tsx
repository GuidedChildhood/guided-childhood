'use client'

import { useEffect, useState } from 'react'
import MobileTabBar from '@/components/dashboard/MobileTabBar'
import OpenAtTheTop from '@/components/dashboard/OpenAtTheTop'

// Dev harness for the dashboard shell: the bottom tab bar and the come back
// in at the top rule. It exists because of a bug class the ref-* fixtures
// structurally could not catch.
//
// Justin, 8 August 2026, on the parent app: "is it strange that you can shift
// all app left and right, is this normal practice for an app as seems a bit
// annoying." It is not normal. It means something is wider than the phone.
//
// Every ref-* page renders its component on a bare page OUTSIDE the dashboard
// layout, so not one of them has ever had the tab bar on it. Twenty six
// fixtures, all clean at 390 and 360, and the widest thing in the app was in
// none of them.
//
// Two things squeeze this row and neither is visible in the markup:
//
//   body { zoom: 1.07 } in globals.css means a 390px phone has 364px of CSS
//   room, so the row is 26px tighter than the number anyone designs against.
//
//   html { font: -apple-system-body } means the root size follows the iOS text
//   size dial, so a parent who has nudged their text up makes every label wider
//   on a row that is already tight.
//
// The text scale slider below reproduces the second one, which is why the bug
// shows on a real phone and not in a browser at defaults.

export default function TabBarHarness() {
  const [scale, setScale] = useState(100)
  const [report, setReport] = useState('')

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`
    return () => { document.documentElement.style.fontSize = '' }
  }, [scale])

  useEffect(() => {
    const measure = () => {
      const bar = document.querySelector('.bottom-tab-bar') as HTMLElement | null
      const doc = document.documentElement
      const items = [...document.querySelectorAll('.tab-item')] as HTMLElement[]
      const widest = items.reduce((w, el) => Math.max(w, el.scrollWidth), 0)
      setReport([
        `viewport ${window.innerWidth}`,
        `document scrollWidth ${doc.scrollWidth}`,
        `page scrolls sideways: ${doc.scrollWidth > window.innerWidth + 1 ? 'YES' : 'no'}`,
        `bar clientWidth ${bar?.clientWidth ?? 0}, scrollWidth ${bar?.scrollWidth ?? 0}`,
        `bar overflows: ${bar && bar.scrollWidth > bar.clientWidth + 1 ? 'YES' : 'no'}`,
        `widest tab needs ${widest}, six of it needs ${widest * 6}`,
      ].join('\n'))
    }
    const t = setTimeout(measure, 120)
    return () => clearTimeout(t)
  }, [scale])

  return (
    // The same shell as the dashboard layout: a flex column at least a screen
    // tall, the page in a main that grows, the bar the last thing in the
    // column, and the layout's zoom block, which takes the zoom off body and
    // puts it on each child of the shell so the fixed bar sits under no
    // zoomed ancestor (see globals.css). Measured here at three scroll
    // positions by the tab bar check in the scratch tests.
    <div className="gc-shell" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' }}>
    <style>{`
      body { zoom: 1; }
      body > * { zoom: 1.07; }
      body > .gc-shell { zoom: 1; }
      .gc-shell > * { zoom: 1.07; }
    `}</style>
    <main style={{ flex: 1, minHeight: '200vh', padding: '20px 16px calc(88px + env(safe-area-inset-bottom))' }}>
      <p className="eyebrow" style={{ marginBottom: 10 }}>Bottom tab bar</p>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 14 }}>
        Drag the text size the way a parent does in iOS Settings. The row has to
        hold six tabs inside a phone that body zoom has already made narrower
        than it looks.
      </p>

      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 6 }}>
        Text size {scale} percent
      </label>
      <input
        type="range" min={90} max={140} step={5} value={scale}
        onChange={e => setScale(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 16 }}
      />

      <pre style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap',
        background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 12,
      }}>{report}</pre>

      {/* The other half of the shell: coming back in starts at the top. Mounted
          here because this harness is the only place the dashboard chrome can
          be driven without a login, and because the behaviour is impossible to
          check by reading it. */}
      <OpenAtTheTop />
    </main>

      <MobileTabBar pendingAsks={2} />
    </div>
  )
}
