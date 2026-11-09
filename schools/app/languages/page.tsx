import Link from 'next/link'
import { cookies } from 'next/headers'
import { PAGE } from '@gc/shared/page-scale'
import { LANGUAGES_COOKIE, languagesTokenAccess, type Lang } from '@/lib/languages-access'
import { FRENCH_UNITS } from '@/lib/languages/french'
import { body, card, langEyebrow, small } from './fr/_ui'

// The languages home. The proxy has already checked the code, so this page
// only lists what the code opens.
//
// 9 November 2026: French arrives, Years 3 and 4, read from the scheme's own
// data (lib/languages/french.ts). Spanish follows on the same shape
// (plans/2026-10-09-languages-plan.md) and says so until it does.

const NAMES: Record<Lang, { name: string; hello: string }> = {
  es: { name: 'Spanish', hello: '¡Hola!' },
  fr: { name: 'French', hello: 'Bonjour !' },
}

export default async function LanguagesHome() {
  const access = await languagesTokenAccess((await cookies()).get(LANGUAGES_COOKIE)?.value)
  const langs = access?.langs ?? []
  const frReady = FRENCH_UNITS.filter(u => u.ready).length
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Languages · Key stage 2</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          French and Spanish
        </h1>
        <p style={body}>
          A separate subject from the digital lessons, on the same pattern: open a lesson, teach it from the
          board, print the sheets.
        </p>
      </div>
      {langs.map(l => {
        const open = l === 'fr'
        const inner = (
          <>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 0 }}>
              {NAMES[l].name} <span lang={l} style={{ color: 'var(--ink-muted)', fontWeight: 700 }}>{NAMES[l].hello}</span>
            </p>
            <p style={{ ...small, margin: 'var(--space-1) 0 0' }}>
              {open ? `Years 3 and 4 · ${frReady} of ${FRENCH_UNITS.length} units ready to teach` : 'Being written. It opens here when the first unit is ready.'}
            </p>
          </>
        )
        return open ? (
          <Link key={l} href="/languages/fr" style={{ ...card, display: 'block', textDecoration: 'none', borderLeft: '4px solid var(--terracotta)' }}>{inner}</Link>
        ) : (
          <section key={l} style={{ ...card, background: 'var(--warm)', boxShadow: 'none' }}>{inner}</section>
        )
      })}
    </div>
  )
}
