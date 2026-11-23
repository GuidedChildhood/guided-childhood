'use client'
import { useState } from 'react'

import { JOIN_FAQS as FAQS } from '@/lib/content/join-faqs'

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', overflow: 'hidden' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={{ background: '#fff', padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', fontFamily: 'var(--font-display)', fontSize: '.96rem', fontWeight: 700, color: open === i ? 'var(--terracotta)' : 'var(--ink)', border: 'none', width: '100%', textAlign: 'left', transition: 'color .15s' }}
          >
            {faq.q}
            <span style={{ fontSize: '.76rem', color: open === i ? 'var(--terracotta)' : 'var(--ink-muted)', transition: 'transform .25s', transform: open === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
          </button>
          {/* Every answer is in the HTML, hidden until opened, so a crawler
              that does not run JavaScript still reads all eight. */}
          <div hidden={open !== i} style={{ background: 'var(--cream)', padding: '14px 22px 18px', fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.78 }}>
            {faq.a}
          </div>
        </div>
      ))}
    </div>
  )
}
