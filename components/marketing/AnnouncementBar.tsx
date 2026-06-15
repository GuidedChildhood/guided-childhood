'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div style={{ background: '#EFE9DF', borderBottom: '1px solid var(--border)', padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '.75rem', fontWeight: 600, color: 'var(--ink-soft)', flex: 1, minWidth: 0 }}>
        Under-16 social media law in effect. <strong style={{ color: 'var(--ink)' }}>Get your child ready.</strong>
      </span>
      <Link href="/starter-pack" style={{ background: 'var(--coral)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.72rem', padding: '6px 14px', borderRadius: '100px', whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0 }}>
        Start here
      </Link>
      <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: 'var(--ink-muted)', padding: '0 2px', flexShrink: 0, lineHeight: 1 }} aria-label="Dismiss">&#215;</button>
    </div>
  )
}
