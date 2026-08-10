'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@gc/shared/components/DigiCharacter'

// Year 6 into Year 7, on Home, for the months it is actually happening.
//
// This is the one card in the app that earns a place near the top without being
// asked for. Secondary transfer is when a child gets their first phone, it
// happens once, and the decisions taken in these few weeks set how the next
// five years go. A family that meets us in September of Year 7 has already had
// the conversation without us.
//
// Dismissal is per phase, not once. A parent who waves it away in May has said
// "not yet", not "never mention the phone again", and July is a different
// question from May. Three phases, three chances, then it is gone for good.

export type PhoneBridge = {
  phase: 'approaching' | 'imminent' | 'landed'
  headline: string
  line: string
  ask: string
  childName: string | null
}

export default function PhoneBridgeCard({ bridge }: { bridge: PhoneBridge }) {
  const key = `gc-phone-bridge-${bridge.phase}`
  const [hidden, setHidden] = useState(true)
  useEffect(() => {
    try { setHidden(window.localStorage.getItem(key) === '1') } catch { setHidden(false) }
  }, [key])
  if (hidden) return null

  function dismiss() {
    try { window.localStorage.setItem(key, '1') } catch { /* private mode, back next load */ }
    setHidden(true)
  }

  const name = bridge.childName && bridge.childName !== 'Your child' ? bridge.childName : 'your child'

  return (
    <div style={{
      background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
      borderRadius: 20, padding: '18px 20px', marginBottom: 18, position: 'relative',
    }}>
      <button
        onClick={dismiss}
        aria-label="Not now"
        style={{
          position: 'absolute', top: 12, right: 12, width: 30, height: 30,
          borderRadius: '50%', border: '1px solid var(--terracotta)', background: '#fff',
          color: 'var(--terracotta-dark)', fontSize: 'var(--text-base)', lineHeight: 1, cursor: 'pointer',
        }}
      >
        ×
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10, paddingRight: 34 }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood="speak" />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            Year 6 into Year 7
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.015em' }}>
            {bridge.headline}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 6px' }}>
        {bridge.line}
      </p>
      {/* Said plainly and early, because a parent seeing a phone card from an
          app about screens will reasonably assume it is about to tell them
          what to do. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
        We will not tell you whether {name} should have one. We will give you the order to do it in.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link
          href="/dashboard/secondary"
          style={{
            display: 'inline-flex', padding: '12px 18px', textDecoration: 'none',
            background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          See the five steps
        </Link>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(bridge.ask)}`}
          style={{
            display: 'inline-flex', padding: '12px 18px', textDecoration: 'none',
            background: '#fff', color: 'var(--ink)', borderRadius: 14,
            border: '1.5px solid var(--border)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
          }}
        >
          Ask DiGi
        </Link>
      </div>
    </div>
  )
}
