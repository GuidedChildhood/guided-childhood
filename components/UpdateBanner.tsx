'use client'
import { useEffect, useRef, useState } from 'react'

// A phone left on the home screen app for days runs entirely on the JS
// it loaded at the last cold launch. Every soft navigation inside the
// app reuses that same in memory bundle, so a shipped fix can sit live
// in production and still never reach that device until it happens to
// fully close and reopen. This polls a tiny version fingerprint every
// few minutes, and the moment a new deploy shows up, offers one tap to
// pick it up, so "is it live yet" has a real answer instead of a guess.
const CHECK_MS = 4 * 60 * 1000

export default function UpdateBanner() {
  const [ready, setReady] = useState(false)
  const knownVersion = useRef<string | null>(null)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/version', { cache: 'no-store' })
        const data = await res.json()
        if (!knownVersion.current) {
          knownVersion.current = data.version
          return
        }
        if (data.version && data.version !== knownVersion.current) setReady(true)
      } catch { /* offline, next tick tries again */ }
    }
    check()
    const id = setInterval(() => { if (document.visibilityState === 'visible') check() }, CHECK_MS)
    document.addEventListener('visibilitychange', check)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', check) }
  }, [])

  if (!ready) return null

  return (
    <div style={{
      position: 'fixed', left: '50%', top: 'max(14px, env(safe-area-inset-top))',
      transform: 'translateX(-50%)', zIndex: 95, width: 'min(94vw, 420px)',
    }}>
      <button
        onClick={() => window.location.reload()}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
          width: '100%', background: 'var(--deep-teal)', color: '#fff', border: 'none',
          borderRadius: '18px', padding: '15px 18px', cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(23,60,70,0.10), 0 18px 42px -12px rgba(23,60,70,0.45)',
          fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 600,
        }}
      >
        <span>A newer version is ready</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, flexShrink: 0 }}>Refresh →</span>
      </button>
    </div>
  )
}
