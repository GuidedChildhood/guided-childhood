'use client'

// Error boundary for the educator workspace. Whatever throws below
// /educator, the teacher gets a readable card with the error digest
// instead of the platform wide dead error page, plus a retry.

export default function EducatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px',
        }}>
          Guided Childhood Schools
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
          fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)', margin: '0 0 12px',
        }}>
          Something broke on our side
        </h1>
        <div style={{
          background: 'var(--coral-lt)', border: '2px solid var(--coral)', borderRadius: '16px',
          padding: '14px 18px', marginBottom: '20px', fontFamily: 'var(--font-body)',
          fontSize: '14px', color: 'var(--coral-dark)', lineHeight: 1.6, overflowWrap: 'anywhere',
        }}>
          {error.message && error.message !== 'An error occurred in the Server Components render.'
            ? error.message
            : 'The server hit an error it could not recover from.'}
          {error.digest ? ` (reference ${error.digest})` : ''}
        </div>
        <button
          onClick={reset}
          style={{
            padding: '12px 22px', borderRadius: '16px', background: 'var(--gold)',
            color: 'var(--ink)', border: 'none', boxShadow: '0 5px 0 var(--gold-hover)',
            cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
          }}
        >
          Try again
        </button>
      </div>
    </main>
  )
}
