'use client'

import { useEffect, useState } from 'react'
import Celebration from '@/components/ui/Celebration'

// The setup finished card. It replaces the quiet one line row with a proper
// arrival: a warm card and a single confetti burst the first time the parent
// lands with everything done, then never again (one browser flag), so it
// stays a moment and not a repeating gimmick. Reduced motion drops the
// confetti and keeps the words, which do the work anyway.
const CELEBRATED_KEY = 'gc_setup_celebrated'

export default function SetupCompleteCard() {
  const [fire, setFire] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(CELEBRATED_KEY)) {
        setFire(true)
        localStorage.setItem(CELEBRATED_KEY, '1')
      }
    } catch { /* private mode, no celebration, no harm */ }
  }, [])

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--tint-sage)', border: '1.5px solid var(--tint-sage)',
      borderRadius: '18px', padding: '18px 20px', marginBottom: '20px',
    }}>
      {fire && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <Celebration />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#2D5016" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Your family setup is complete
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>
            The daily practice, the check ins, quests, school and your agreement all work together now. From here it is just showing up.
          </div>
        </div>
      </div>
    </div>
  )
}
