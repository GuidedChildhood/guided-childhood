'use client'

import { useEffect } from 'react'

// Last resort boundary for the whole app: catches a failure in the root
// layout or anything no nested error.tsx handled, so the worst case is a
// friendly reload screen, never a blank frozen page. It must render its own
// html and body because it replaces the root layout when it fires.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error boundary:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#F7F3EE', color: '#26263A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: '32px 24px',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 10px' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 15, color: '#55516A', lineHeight: 1.6, maxWidth: 360, margin: '0 0 24px' }}>
            Nothing is lost. This is usually an old version held in the browser. Reload to pull the latest.
          </p>
          <button
            onClick={() => { window.location.reload() }}
            style={{
              background: '#DC5832', color: '#fff', border: 'none',
              borderRadius: 14, padding: '14px 28px', fontSize: 14, fontWeight: 700,
              boxShadow: '0 5px 0 #B8451F', cursor: 'pointer',
            }}
          >
            Reload the page
          </button>
          {error.digest && (
            <p style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#8A8598', marginTop: 20 }}>
              Reference {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
