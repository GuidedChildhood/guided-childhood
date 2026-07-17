'use client'

import { useState } from 'react'
import { WHY_IT_WORKS, OUR_STANCE } from '@/lib/content/readiness'

// The evidence and the stance, folded into one calm card that opens on demand.
// They matter, but they do not need to shout on every visit, so the pathway stays
// a next step, not a research brochure. Collapsed by default, one tap to read.

export default function PathwayEvidence() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '11px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
      >
        <span style={{ fontSize: '18px', flexShrink: 0 }}>🔬</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>Why this works, and our stance</span>
          <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '1px' }}>The measured evidence, and where we stand on kids and phones</span>
        </span>
        <span style={{ flexShrink: 0, fontSize: '14px', color: 'var(--ink-light)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>→</span>
      </button>

      {open && (
        <div style={{ marginTop: '15px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)', marginBottom: '6px' }}>{WHY_IT_WORKS.eyebrow}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '8px' }}>{WHY_IT_WORKS.headline}</div>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>{WHY_IT_WORKS.body}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {WHY_IT_WORKS.points.map(p => (
              <div key={p.title} style={{ display: 'flex', gap: '11px', background: 'var(--cream)', borderRadius: '13px', padding: '12px 14px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1.2 }}>{p.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)' }}>{p.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '14px 0 16px' }}>{WHY_IT_WORKS.sources}</p>

          <div style={{ background: 'var(--deep-teal)', borderRadius: '16px', padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px', color: '#fff', lineHeight: 1.25, marginBottom: '7px' }}>{OUR_STANCE.headline}</div>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>{OUR_STANCE.body}</p>
          </div>
        </div>
      )}
    </div>
  )
}
