import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import Reveal from '@/components/Reveal'
import { eyebrow } from '@/components/ui'
import { FRENCH_UNITS, FRENCH_YEARS, lessonsOf } from '@/lib/languages/french'
import { body, card, langEyebrow, small } from './_ui'

// /languages/fr: the year at a glance. Years 3 and 4, six half terms each,
// read from the scheme's own data (lib/languages/french.ts), so a unit that is
// finished on the author's site shows here as ready on the next sync.

export const metadata = { title: 'French' }

export default function FrenchHome() {
  const ready = FRENCH_UNITS.filter(u => u.ready).length
  const decks = FRENCH_UNITS.reduce((n, u) => n + (u.deck?.lessons.filter(l => l.slides).length ?? 0), 0)
  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French · Years 3 and 4</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          French, half term by half term
        </h1>
        <p style={{ ...body, maxWidth: '640px' }}>
          Every unit opens with one sound, a short list of words and the phrases to use them in. Each lesson has
          its slides to teach from the board, a song where there is one, and sheets in three versions: class,
          adapted and inclusion.
        </p>
        <p style={{ ...small, marginTop: 'var(--space-2)' }}>
          {ready} of {FRENCH_UNITS.length} units ready, {decks} lessons with interactive slides.
        </p>

      </div>

      {FRENCH_YEARS.map(year => (
        <section key={year} aria-labelledby={`y${year}`}>
          <h2 id={`y${year}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
            Year {year}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
            {FRENCH_UNITS.filter(u => u.year === year).map((u, i) => {
              const n = lessonsOf(u).length
              const inner = (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'baseline' }}>
                    <span style={eyebrow}>Half term {u.ht}</span>
                    <span style={{
                      ...eyebrow, color: u.deck ? 'var(--retro-green)' : u.ready ? 'var(--terracotta-dark)' : 'var(--ink-light)',
                    }}>
                      {u.deck ? 'Slides ready' : u.ready ? 'Planned' : 'Coming'}
                    </span>
                  </div>
                  <div lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, marginTop: 'var(--space-2)' }}>
                    {u.fr}
                  </div>
                  <div style={{ ...small, marginTop: 'var(--space-1)' }}>{u.en}</div>
                  {u.ready && (
                    <div style={{ ...small, marginTop: 'var(--space-3)' }}>
                      {n} lessons{u.plan.sound ? <> · sound <b lang="fr" style={{ color: 'var(--ink)' }}>{u.plan.sound}</b></> : null}
                    </div>
                  )}
                </>
              )
              return (
                <Reveal key={u.key} delay={i * 0.05} y={18}>
                  {u.ready ? (
                    <Link href={`/languages/fr/${u.key}`} className="gc-fr-unit" style={{ ...card, display: 'block', height: '100%', textDecoration: 'none' }}>
                      {inner}
                    </Link>
                  ) : (
                    <div style={{ ...card, height: '100%', background: 'var(--warm)', boxShadow: 'none' }}>{inner}</div>
                  )}
                </Reveal>
              )
            })}
          </div>
        </section>
      ))}
      <style>{`.gc-fr-unit { transition: transform .2s cubic-bezier(0.22,1,0.36,1), box-shadow .2s ease; } .gc-fr-unit:hover { transform: translateY(-3px); box-shadow: 0 1px 2px rgba(23,60,70,0.05), 0 20px 40px -20px rgba(23,60,70,0.4) !important; } .gc-fr-unit:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 3px; } @media (prefers-reduced-motion: reduce) { .gc-fr-unit { transition: none; } .gc-fr-unit:hover { transform: none; } }`}</style>
    </div>
  )
}
