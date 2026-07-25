'use client'

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The welcome at the very top of Home. A parent opening the app on a busy
// Tuesday has forgotten what all this is for, so this says it back to them in
// one big line at a time: the whole point is the journey from 4 to 16, built in
// order, grounded in the research, real world jobs balancing the screen, and a
// young person genuinely ready for social media by the time they get there.
//
// The captions rotate so a parent sees the whole mission across a few visits
// rather than a wall of it at once. Deliberately the largest type on the page,
// because this is the thing worth remembering.

const CAPTIONS = [
  'Every stage from 4 to 16, in order, so 16 lands as a gentle ramp and never a cliff edge.',
  'Built on the measured research, Orben and Odgers at Cambridge, never on scare stories.',
  'Real world jobs earn the screen time, so the balance looks after itself.',
  'The learning arrives at the age it actually lands, not years too early or too late.',
  'Ready for social media at 16 and beyond, because the judgement was built long before the account.',
  'You do not have to hold all of this. We drive it. You just do today.',
] as const

const ROTATE_MS = 6000

export default function MissionWelcome({ firstName }: { firstName?: string }) {
  // Start somewhere different each visit so the same parent is not always met
  // by the same line. Client only, so Date is fine.
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(true)

  useEffect(() => {
    setI(Math.floor(Date.now() / ROTATE_MS) % CAPTIONS.length)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      // Fade out, swap, fade back in, so the change is calm rather than a jump.
      setShown(false)
      setTimeout(() => {
        setI(n => (n + 1) % CAPTIONS.length)
        setShown(true)
      }, 320)
    }, ROTATE_MS)
    return () => clearInterval(t)
  }, [])

  const name = firstName && firstName.trim() ? firstName.trim() : null

  return (
    <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 16px' }}>
      <div style={{
        background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
        borderRadius: 20, padding: '18px 20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DigiCharacter size={29} mood="wave" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              The guided childhood
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 21, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {name ? `Welcome back, ${name}` : 'Welcome back'}
            </div>
          </div>
        </div>

        {/* The mission, one line at a time, the biggest type on the page. A fixed
            min height so the card never jumps as the lines change length. */}
        <p
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-body)', fontSize: 19, fontWeight: 600,
            color: 'var(--ink)', lineHeight: 1.5, margin: 0, minHeight: 86,
            opacity: shown ? 1 : 0, transition: 'opacity 0.3s ease',
          }}
        >
          {CAPTIONS[i]}
        </p>

        {/* Which of the mission lines they are on, so it reads as a set. */}
        <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
          {CAPTIONS.map((_, n) => (
            <span key={n} style={{
              width: n === i ? 18 : 6, height: 6, borderRadius: 100,
              background: n === i ? 'var(--terracotta-dark)' : 'rgba(0,0,0,0.13)',
              transition: 'width 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
