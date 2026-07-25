'use client'

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The welcome intro when the app opens. A parent opening it on a busy Tuesday
// has forgotten what all this is for, so this says it back to them in one big
// line at a time: the whole point is the journey from 4 to 16, built in order,
// grounded in the research, real world jobs balancing the screen, and a young
// person genuinely ready for social media by the time they get there.
//
// It greets the open, then steps back. Once a parent is in and moving around,
// Home belongs to today's actual work, so this shows on the first Home view of
// an app open and not again until the next one. The captions rotate so the
// whole mission lands across a few opens rather than a wall of it at once.
// Deliberately the largest type on the page, because it is worth remembering.

const CAPTIONS = [
  'Every stage from 4 to 16, in order, so 16 lands as a gentle ramp and never a cliff edge.',
  'Built on the measured research, Orben and Odgers at Cambridge, never on scare stories.',
  'Real world jobs earn the screen time, so the balance looks after itself.',
  'The learning arrives at the age it actually lands, not years too early or too late.',
  'Ready for social media at 16 and beyond, because the judgement was built long before the account.',
  'You do not have to hold all of this. We drive it. You just do today.',
] as const

const ROTATE_MS = 6000

// One app open is exactly a session: a fresh launch or a new tab greets them
// again, moving around inside the app does not.
const OPEN_KEY = 'gc_mission_welcome_open'

export default function MissionWelcome({ firstName }: { firstName?: string }) {
  // Start somewhere different each open so the same parent is not always met
  // by the same line. Client only, so Date is fine.
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(true)
  // Hidden until the client has checked whether this open has been greeted, so
  // a parent already moving around never sees it flash back in.
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let greeted = false
    try { greeted = sessionStorage.getItem(OPEN_KEY) === '1' } catch { /* private mode, greet them */ }
    if (greeted) return
    try { sessionStorage.setItem(OPEN_KEY, '1') } catch { /* private mode, greeted every Home view */ }
    setI(Math.floor(Date.now() / ROTATE_MS) % CAPTIONS.length)
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const t = setInterval(() => {
      // Fade out, swap, fade back in, so the change is calm rather than a jump.
      setShown(false)
      setTimeout(() => {
        setI(n => (n + 1) % CAPTIONS.length)
        setShown(true)
      }, 320)
    }, ROTATE_MS)
    return () => clearInterval(t)
  }, [open])

  const name = firstName && firstName.trim() ? firstName.trim() : null

  // Already greeted this open: Home is theirs now.
  if (!open) return null

  return (
    <div
      onClick={() => setOpen(false)}
      role="dialog"
      aria-label="Welcome"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,26,46,0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'gc-welcome-in 0.3s ease',
      }}
    >
      <style>{`
        @keyframes gc-welcome-in { from { opacity: 0 } to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) { [data-gc-welcome] { animation: none !important } }
      `}</style>
      <div
        data-gc-welcome
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460,
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: 24, padding: '22px 22px 24px',
          boxShadow: '0 24px 60px -18px rgba(26,26,46,0.5)',
        }}
      >
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

        {/* One way out, plus tapping anywhere off the card. An overlay a parent
            cannot dismiss on a busy morning is worse than no overlay. */}
        <button
          onClick={() => setOpen(false)}
          style={{
            width: '100%', marginTop: 16, padding: '14px', cursor: 'pointer',
            background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
            borderRadius: 16, fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 16, boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          Start today
        </button>

        {/* Which of the mission lines they are on, so it reads as a set. */}
        <div style={{ display: 'flex', gap: 5, marginTop: 14, justifyContent: 'center' }}>
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
