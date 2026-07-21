'use client'

import Link from 'next/link'

// The route level error boundary. global-error.tsx only catches a crash in the
// root layout itself; this catches an error inside any normal page and shows a
// calm, branded recovery instead of a white screen. Try again re-renders the
// segment, so a transient blip clears without a full reload.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: '72dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '12px' }}>
        Something went wrong
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px', color: 'var(--ink)' }}>
        A hiccup on our side
      </h1>
      <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '460px', marginBottom: '28px' }}>
        That one is on us, not you. Try again, and if it keeps happening, email us at hello@guidedchildhood.com and we will sort it.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} style={{ background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', cursor: 'pointer', borderRadius: '16px', padding: '13px 22px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          Try again
        </button>
        <Link href="/dashboard" style={{ background: '#fff', color: 'var(--ink)', textDecoration: 'none', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '13px 22px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>
          Back to my dashboard
        </Link>
      </div>
    </div>
  )
}
