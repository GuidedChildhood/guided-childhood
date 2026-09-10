// THE BEAT BETWEEN GOOGLE AND THE PRODUCT.
//
// A parent who taps Continue with Google leaves the site, signs in, and comes
// back to a freshly mounted page while we check the session and write their
// answers through. Without this they would watch question one flash up at them,
// having just finished the quiz, which reads as the app having lost everything.
//
// It is its own component because it cannot be reached by walking the funnel:
// it needs a live session arriving from a provider, and a screen that can only
// be seen in production is a screen nobody has checked. /dev/starter-finishing
// renders it.
export default function SavingPathway({ childName }: { childName?: string }) {
  const name = (childName ?? '').trim()
  return (
    <div style={{
      minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '28px 20px', textAlign: 'center',
    }}>
      <img src="/digi-squad/DiGi-star.svg" alt="" width={72} height={72} style={{ animation: 'gentleFloat 2.5s ease-in-out infinite' }} />
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
        fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '18px 0 8px',
      }}>
        {name ? `Saving ${name}'s pathway` : 'Saving your pathway'}
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', lineHeight: 1.6, margin: 0, maxWidth: '340px' }}>
        One moment. We are putting everything in place.
      </p>
    </div>
  )
}
