import LanguagesUnlockForm from './LanguagesUnlockForm'

// The languages door. Unlinked from everywhere on purpose while
// LANGUAGES_LIVE is off; a pilot school is sent the address with its code.

function safeNext(raw: string | undefined): string {
  if (!raw || !raw.startsWith('/languages') || raw.startsWith('//')) return '/languages'
  return raw
}

export default async function LanguagesUnlockPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  return (
    <div style={{ maxWidth: '460px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '12px',
        }}>French and Spanish</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', marginBottom: 'var(--space-3)' }}>
          Your languages code opens the lessons.
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          One code for the whole staff room. It opens French, Spanish or both.
        </p>
      </div>
      <LanguagesUnlockForm next={safeNext(next)} />
    </div>
  )
}
