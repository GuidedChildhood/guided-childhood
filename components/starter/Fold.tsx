'use client'

import { useState } from 'react'

// The detail, one tap away.
//
// Justin, 10 September 2026, of the starter pack reveal: "can we really reduce
// the text on this page ... the actual written text with it can be folded away
// ... so we can shrink the scroll and too much text."
//
// ── WHY FOLD RATHER THAN CUT ────────────────────────────────────────────────
//
// The prose on this page is not padding. It is the reasoning a careful parent
// wants before they hand over a card: why a chart can be the wrong idea for a
// low mood, what the evidence actually says about an hour a day, what happens
// on day five. Deleting it would make the page shorter and the product less
// trustworthy.
//
// The trouble is that it is all printed at once, so a parent who was sold on
// screen three still has nine screens between them and the button. Canva,
// foodpanda, KOHO and Rocket Money all solve this the same way: one line
// visible, a chevron, the rest behind it. Rocket Money puts fifteen features on
// one screen because each is one line, which is the whole lesson. Length is not
// the problem. Line count is.
//
// So nothing here is deleted. It is one press away instead of in the way.

export default function Fold({
  label,
  children,
  tone = 'quiet',
}: {
  /** What is behind it, in the parent's words. Never "Read more". */
  label: string
  children: React.ReactNode
  /** 'quiet' sits inside a section; 'card' stands on its own. */
  tone?: 'quiet' | 'card'
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={tone === 'card' ? {
      background: '#fff', border: '2px solid var(--ink)', borderRadius: 16,
      boxShadow: open ? 'none' : '0 4px 0 var(--ink)', padding: '4px 14px 4px', marginTop: 12,
    } : { marginTop: 10 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          background: 'none', border: 'none', padding: tone === 'card' ? '11px 0' : '7px 0',
          cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
          color: 'var(--ink)',
        }}
      >
        <span style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>{label}</span>
        <span aria-hidden style={{
          flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
          border: '1.5px solid var(--border)', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--terracotta-dark)', fontSize: 11, fontWeight: 900,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease',
        }}>▾</span>
      </button>
      {open && <div style={{ paddingBottom: tone === 'card' ? 12 : 4 }}>{children}</div>}
    </div>
  )
}
