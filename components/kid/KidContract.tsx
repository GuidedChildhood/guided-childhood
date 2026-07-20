'use client'

import { useState } from 'react'
import { contractRule, contractPromises, type ContractLevel } from '@/lib/content/kid-contract'
import { playKidSound } from '@/lib/sound/kidSounds'

// The one screen contract moment, before the board ever shows. Age based:
// the rule reads differently for an under 8, an 8 to 10 and an 11 plus,
// and the supporting promises come from the family agreement clauses. One
// big I agree, then it locks in on kid_links and both sides can see it.

export default function KidContract({ childName, level, trust, onAgree }: {
  childName: string
  level: ContractLevel
  // The trust setting shapes the rule: with ask first (the default) even an
  // 11 plus reads "I ask first with one tap, then my timer starts".
  trust?: string | null
  onAgree: () => void
}) {
  const [busy, setBusy] = useState(false)
  const rule = contractRule(level, trust)
  const promises = contractPromises(level)

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #4C5057 0%, #34373D 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '28px 16px 40px', fontFamily: 'var(--font-body)',
    }}>
      <div style={{ width: 'min(100%, 440px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/digi-squad/DiGi-star.svg" alt="" style={{ width: 64, height: 64, marginBottom: 10 }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)', margin: '0 0 6px' }}>
            My screen deal
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 7.5vw, 2rem)', color: '#F7F7F5', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>
            One deal before we start, {childName}
          </h1>
        </div>

        {/* The rule itself, big and warm, in the child's own words. */}
        <div style={{
          background: 'var(--terracotta)', borderRadius: '20px', padding: '18px 20px',
          boxShadow: '0 5px 0 var(--terracotta-dark)', marginBottom: '14px',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--ink)', lineHeight: 1.35, margin: 0 }}>
            {rule}
          </p>
        </div>

        {/* The promises around it, from the family agreement clauses. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '18px' }}>
          {promises.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', borderRadius: '16px', padding: '13px 15px' }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{p.emoji}</span>
              <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.45 }}>{p.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (busy) return
            setBusy(true)
            playKidSound('done')
            onAgree()
          }}
          disabled={busy}
          style={{
            width: '100%', padding: '17px', background: 'var(--terracotta)', color: 'var(--ink)',
            border: 'none', borderRadius: '16px', cursor: busy ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px',
            boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? 'Locking it in…' : 'I agree ⭐'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '12.5px', color: 'rgba(255,255,255,0.66)', lineHeight: 1.5, margin: '12px 4px 0' }}>
          Your grown up can see this deal too. It lives in Our deal on your page.
        </p>
      </div>
    </div>
  )
}
