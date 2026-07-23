'use client'

import { useState } from 'react'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// Keepsakes: the real world reward at the end of the digital journey. When a
// child earns the whole family, celebrate it for real with a professionally
// printed copy of their passport and a set of the five Planet Friend charms.
// Print on demand is not wired yet, so this registers interest and confirms
// warmly; nothing here pretends to take an order or a payment.

type Item = 'printed_passport' | 'charm_set' | 'both'

export default function Keepsakes({ email = '', childName = null }: { email?: string; childName?: string | null }) {
  const [item, setItem] = useState<Item>('both')
  const [value, setValue] = useState(email)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  async function register() {
    if (state === 'sending' || state === 'done') return
    const clean = value.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return
    setState('sending')
    try {
      await fetch('/api/keepsakes/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, item, childName }),
      })
    } catch { /* best effort */ }
    setState('done')
  }

  const card: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
    boxShadow: '0 4px 22px rgba(26,26,46,0.06)', padding: 20, marginBottom: 16,
  }
  const chip = (on: boolean): React.CSSProperties => ({
    flex: 1, textAlign: 'center', padding: '11px 10px', borderRadius: 12, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5,
    background: on ? 'var(--terracotta)' : '#fff', color: 'var(--ink)',
    border: on ? '1.5px solid var(--terracotta-dark)' : '1.5px solid var(--border)',
    boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
  })

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: 8 }}>Keepsakes</p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 10 }}>
        Make the journey real
      </h1>
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 24, maxWidth: 520 }}>
        The passport and the Planet Friends live on the screen, but the proudest moments deserve something you can hold. Two keepsakes for when your child earns the family.
      </p>

      {/* Printed passport */}
      <div style={card}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 40, lineHeight: 1 }} aria-hidden>🛂</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              The printed passport
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '5px 0 0' }}>
              A professionally printed, keepsake quality copy of {childName ? `${childName}'s` : 'your child’s'} digital passport: every stage stamped, every Planet Friend earned, ready for the shelf.
            </p>
          </div>
        </div>
      </div>

      {/* Charm set */}
      <div style={card}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: 40, lineHeight: 1 }} aria-hidden>🧷</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              The Planet Friend charm set
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '5px 0 0' }}>
              All five Planet Friends as chunky charms for shoes, bags or a keyring. One earned, one collected, the set completed as the whole family comes home.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {STAGE_CHARACTERS.map(c => (
            <span key={c.key} style={{ width: 58, height: 58, borderRadius: '50%', background: 'var(--cream)', border: `2px solid ${c.colour}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.cutout} alt={c.name} width={48} height={48} style={{ objectFit: 'contain' }} />
            </span>
          ))}
        </div>
      </div>

      {/* Register interest */}
      <div style={{ ...card, background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF', marginBottom: 0 }}>
        {state === 'done' ? (
          <div style={{ textAlign: 'center', padding: '8px 4px' }}>
            <div style={{ fontSize: 34, marginBottom: 6 }}>💛</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)' }}>You are on the list</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '6px auto 0', maxWidth: 380 }}>
              We will let you know the moment keepsakes are ready to order. Thank you for building the journey with us.
            </p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', marginBottom: 4 }}>
              Register your interest
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
              Keepsakes are coming soon. Tell us which you would like and we will be in touch when they land. No payment now.
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={() => setItem('printed_passport')} style={chip(item === 'printed_passport')}>Passport</button>
              <button onClick={() => setItem('charm_set')} style={chip(item === 'charm_set')}>Charms</button>
              <button onClick={() => setItem('both')} style={chip(item === 'both')}>Both</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="email" value={value} onChange={e => setValue(e.target.value)} placeholder="Your email"
                style={{ flex: 1, minWidth: 180, padding: '13px 15px', borderRadius: 12, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 15, background: '#fff' }}
              />
              <button
                onClick={register} disabled={state === 'sending'}
                style={{ background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 12, padding: '13px 22px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, boxShadow: '0 4px 0 var(--terracotta-dark)' }}
              >
                {state === 'sending' ? 'Sending…' : 'Notify me'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
