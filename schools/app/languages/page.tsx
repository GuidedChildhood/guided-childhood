import { cookies } from 'next/headers'
import { LANGUAGES_COOKIE, languagesTokenAccess, type Lang } from '@/lib/languages-access'

// The languages home. The proxy has already checked the code, so this page
// only lists what the code opens. The lessons themselves arrive with the
// language tables (plans/2026-10-09-languages-plan.md, Phase 1).

const NAMES: Record<Lang, { name: string; hello: string }> = {
  es: { name: 'Spanish', hello: '¡Hola!' },
  fr: { name: 'French', hello: 'Bonjour !' },
}

export default async function LanguagesHome() {
  const access = await languagesTokenAccess((await cookies()).get(LANGUAGES_COOKIE)?.value)
  const langs = access?.langs ?? []
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '12px',
        }}>Years 3 to 6</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)' }}>
          French and Spanish
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: '8px' }}>
          Year 3, Unit 1 is being built first. Each lesson will open here with one button to teach and one to print.
        </p>
      </div>
      {langs.map(l => (
        <section key={l} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '24px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)' }}>
            {NAMES[l].name} <span style={{ color: 'var(--ink-muted)', fontWeight: 700 }}>{NAMES[l].hello}</span>
          </p>
        </section>
      ))}
    </div>
  )
}
