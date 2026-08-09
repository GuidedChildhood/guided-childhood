// Where the "would you use this?" buttons land.
//
// A one tap answer still deserves a page that says something. Redirecting to
// the home page would leave a parent wondering whether the tap registered at
// all, which is how you teach people not to bother next time.
//
// It reads the answer back so the words match what they actually pressed. Yes
// and no get different copy, because thanking somebody for a no in the same
// breath as a yes reads as though nobody was listening.

const FEATURES: Record<string, string> = {
  'school-alerts': 'school reminders',
}

export const metadata = { title: 'Thank you' }

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string; a?: string }>
}) {
  const { f, a } = await searchParams
  const feature = FEATURES[f ?? ''] ?? 'that one'
  const yes = a === 'yes'

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '64px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '2.6rem', marginBottom: 14 }}>{yes ? '💛' : '👍'}</div>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: 10 }}>
        Answer counted
      </p>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', letterSpacing: '-0.02em',
        lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 12px',
      }}>
        {yes ? 'Noted, thank you' : 'Good to know, thank you'}
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
        {yes
          ? `You are on the list for ${feature}, and you will be the first to hear when it lands.`
          : `We will not build ${feature} just because it sounded clever. That is exactly why we asked.`}
      </p>
    </div>
  )
}
