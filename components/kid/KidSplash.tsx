'use client'

import { useEffect, useState } from 'react'

// The Duolingo style launch splash: when the child opens their app, their own
// chosen buddy pops up big on their own colour, a warm hello before the day's
// quests. Once per browser session so it greets on a fresh open but never nags
// between screens. Fades itself away after a beat; a tap skips it.
export default function KidSplash({ buddyImg, buddyName, childName, bg, ink, buddyIsStar }: { buddyImg: string; buddyName: string; childName: string; bg: string; ink: string; buddyIsStar: boolean }) {
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gc_kid_splash')) return
      sessionStorage.setItem('gc_kid_splash', '1')
    } catch { /* still show once this mount */ }
    setShow(true)
    // A slower hello, so the child reads the welcome and the buddy has a
    // moment to land before the quests appear.
    const t1 = setTimeout(() => setLeaving(true), 2800)
    const t2 = setTimeout(() => setShow(false), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!show) return null

  return (
    <div
      onClick={() => { setLeaving(true); setTimeout(() => setShow(false), 380) }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, background: bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
        opacity: leaving ? 0 : 1, transition: 'opacity 0.4s ease',
      }}
    >
      <style>{`@keyframes gcSplashPop { 0% { transform: scale(0.5); opacity: 0 } 55% { transform: scale(1.08); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }`}</style>
      <span style={{
        width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        boxShadow: '0 12px 40px -8px rgba(26,26,46,0.35)', animation: 'gcSplashPop 0.6s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={buddyImg} alt="" style={buddyIsStar
          ? { width: 136, height: 136 }
          : { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: ink, letterSpacing: '-0.01em', textAlign: 'center', padding: '0 20px' }}>
        Welcome {childName}!
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.02rem', color: ink, opacity: 0.85, textAlign: 'center', padding: '0 28px', lineHeight: 1.4, marginTop: -8 }}>
        {buddyIsStar
          ? 'DiGi here to guide you. Have fun!'
          : `I'm ${buddyName}, here to guide you. Have fun!`}
      </span>
    </div>
  )
}
