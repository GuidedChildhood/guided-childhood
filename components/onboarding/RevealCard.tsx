'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { Reveal } from '@/lib/onboarding/reveal'

// The DiGi New card: it announces one newly unlocked feature to a parent in
// their first fortnight, once. It shows the newest eligible reveal they have not
// met yet (seen tracked in localStorage), so the platform opens up one calm step
// at a time. Dismiss or tap to meet it, and it is marked seen for good. Silent
// for an established account, where everything is already revealed.

export default function RevealCard({ reveals }: { reveals: Reveal[] }) {
  const [show, setShow] = useState<Reveal | null>(null)

  useEffect(() => {
    // The newest eligible reveal not yet seen. Newest first so a returning parent
    // meets the latest unlock, not an old one.
    const next = [...reveals].reverse().find(r => {
      try { return localStorage.getItem(`gc_reveal_seen_${r.key}`) !== '1' } catch { return false }
    })
    if (next) setShow(next)
  }, [reveals])

  if (!show) return null

  const seen = () => {
    try { localStorage.setItem(`gc_reveal_seen_${show.key}`, '1') } catch { /* private mode */ }
    setShow(null)
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '20px', padding: '18px 20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(26,26,46,0.03), 0 12px 30px -14px rgba(26,26,46,0.16)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '13px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood="happy" size={30} once />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>New from DiGi</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.2, marginTop: '2px' }}>
            <span style={{ marginRight: '6px' }}>{show.emoji}</span>{show.title}
          </div>
        </div>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>{show.body}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link href={show.href} onClick={seen} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', borderRadius: '14px', padding: '12px 18px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
          Have a look <span aria-hidden>→</span>
        </Link>
        <button onClick={seen} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, color: 'var(--ink-muted)' }}>Got it</button>
      </div>
    </div>
  )
}
