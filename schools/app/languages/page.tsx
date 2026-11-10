import Link from 'next/link'
import { cookies } from 'next/headers'
import { PAGE } from '@gc/shared/page-scale'
import Reveal from '@/components/Reveal'
import { eyebrow } from '@/components/ui'
import { LANGUAGES_COOKIE, languagesTokenAccess, type Lang } from '@/lib/languages-access'
import { FRENCH_UNITS, lessonsOf } from '@/lib/languages/french'
import { body, card, langEyebrow, small } from './fr/_ui'

// The languages home. The proxy has already checked the code, so this page
// only lists what the code opens.
//
// 9 November 2026: French arrives, Years 3 and 4, read from the scheme's own
// data (lib/languages/french.ts). Spanish follows on the same shape
// (plans/2026-10-09-languages-plan.md) and says so until it does.
//
// 10 November 2026, the finish pass: this was one card on an empty page. It
// now does what a home page is for. The language, its three rooms, and the
// units a teacher can teach this afternoon, each one tap from its first
// lesson.

const NAMES: Record<Lang, { name: string; hello: string }> = {
  es: { name: 'Spanish', hello: '¡Hola!' },
  fr: { name: 'French', hello: 'Bonjour !' },
}

export default async function LanguagesHome() {
  const access = await languagesTokenAccess((await cookies()).get(LANGUAGES_COOKIE)?.value)
  const langs = access?.langs ?? []
  const frReady = FRENCH_UNITS.filter(u => u.ready).length
  const teachNow = FRENCH_UNITS.filter(u => u.deck)
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Languages · Key stage 2</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          French and Spanish
        </h1>
        <p style={{ ...body, maxWidth: '640px' }}>
          A separate subject from the digital lessons, on the same pattern: open a lesson, teach it from the
          board, print the sheets.
        </p>
      </div>

      {langs.includes('fr') && (
        <section style={{ ...card, borderLeft: '4px solid var(--terracotta)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: 0 }}>
                {NAMES.fr.name} <span lang="fr" style={{ color: 'var(--ink-muted)', fontWeight: 700 }}>{NAMES.fr.hello}</span>
              </h2>
              <p style={{ ...small, margin: 'var(--space-1) 0 0' }}>
                Years 3 and 4 · {frReady} of {FRENCH_UNITS.length} units ready to teach
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <Link href="/languages/fr" className="btn btn-gold">Open French</Link>
              <Link href="/languages/fr/print" className="btn btn-outline">Print room</Link>
            </div>
          </div>
        </section>
      )}

      {langs.includes('fr') && teachNow.length > 0 && (
        <section aria-labelledby="teach-now">
          <h2 id="teach-now" style={{ ...eyebrow, margin: 'var(--space-3) 0 var(--space-3)' }}>Ready to teach now, slides and sheets</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
            {teachNow.map((u, i) => (
              <Reveal key={u.key} delay={i * 0.06} y={18}>
                <Link href={`/languages/fr/${u.key}`} className="gc-lang-unit" style={{ ...card, display: 'block', height: '100%', textDecoration: 'none' }}>
                  <div style={langEyebrow}>Year {u.year} · Half term {u.ht}</div>
                  <div lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, marginTop: 'var(--space-2)' }}>{u.fr}</div>
                  <div style={small}>{u.en}</div>
                  <div style={{ ...small, marginTop: 'var(--space-3)', color: 'var(--ink)' }}>
                    {lessonsOf(u).length} lessons{u.plan.sound ? <> · sound <b lang="fr">{u.plan.sound}</b></> : null}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {langs.includes('es') && (
        <section style={{ ...card, background: 'var(--warm)', boxShadow: 'none' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 0 }}>
            {NAMES.es.name} <span lang="es" style={{ color: 'var(--ink-muted)', fontWeight: 700 }}>{NAMES.es.hello}</span>
          </h2>
          <p style={{ ...small, margin: 'var(--space-1) 0 0' }}>Being written. It opens here when the first unit is ready.</p>
        </section>
      )}
      <style>{`.gc-lang-unit { transition: transform .2s cubic-bezier(0.22,1,0.36,1); } .gc-lang-unit:hover { transform: translateY(-3px); } .gc-lang-unit:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { .gc-lang-unit { transition: none; } .gc-lang-unit:hover { transform: none; } }`}</style>
    </div>
  )
}
