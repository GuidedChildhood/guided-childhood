'use client'

import { useEffect } from 'react'

// Route level safety net. Without this, a crash in any dashboard page (a
// throwing server query, a client component that fails to hydrate) unmounts
// the whole tree to a blank, stuck screen with no way back. This catches it,
// keeps the parent oriented, and gives a real way out: try again, or a hard
// reload that also clears a stale cached build.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surfaced in the browser console and Vercel logs so the real cause is
    // never invisible again.
    console.error('Dashboard error boundary:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '32px 24px', maxWidth: 440, margin: '0 auto',
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 10 }}>
        That did not load right
      </h1>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 24 }}>
        Nothing is lost. This is almost always an old version held in the browser. Try again, and if it sticks, tap reload to pull the latest.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 260 }}>
        <button
          onClick={() => reset()}
          className="btn btn-gold"
          style={{ justifyContent: 'center', width: '100%' }}
        >
          Try again
        </button>
        <button
          onClick={() => { window.location.reload() }}
          className="btn btn-outline"
          style={{ justifyContent: 'center', width: '100%' }}
        >
          Reload the page
        </button>
      </div>
      {error.digest && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-muted)', marginTop: 20, letterSpacing: '0.04em' }}>
          Reference {error.digest}
        </p>
      )}
    </div>
  )
}
