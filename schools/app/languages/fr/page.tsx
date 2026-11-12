import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import Reveal from '@/components/Reveal'
import { eyebrow } from '@/components/ui'
import { cultureLessons, FRENCH_UNITS, FRENCH_YEARS, teachingLessons } from '@/lib/languages/french'
import { body, langEyebrow, LessonRow, LessonRowStyles, small } from './_ui'

// /languages/fr: TEACH. One question, then the next.
//
// 10 November 2026, Justin: "really simplify the flow so it is easy to flow
// through". This page was twelve cards across two years, half of them
// reading "Coming". A teacher teaches one year, so it now asks which, and
// shows that year alone as what it is: six half terms in order. A unit that
// is ready is one tap; one still being written says so quietly and takes up
// one line. The year is a link (?year=4), so it needs no script and a Year 4
// teacher can bookmark their own page.
//
// Culture lessons sit under the year they belong to, marked with a star, as
// the scheme has them: taught, but outside the units and not assessed.

export const metadata = { title: 'French' }

export default async function FrenchHome({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const asked = Number((await searchParams).year)
  const year = FRENCH_YEARS.includes(asked) ? asked : FRENCH_YEARS[0]
  const units = FRENCH_UNITS.filter(u => u.year === year)
  const culture = units.flatMap(u => cultureLessons(u).map(l => ({ u, l })))

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          Which year are you teaching?
        </h1>
        <p style={{ ...body, maxWidth: '560px' }}>
          Six half terms, in order. Open one, press play on a lesson, and it is on the board.
        </p>
      </div>

      <nav aria-label="Year" className="gc-fr-years">
        {FRENCH_YEARS.map(y => (
          <Link key={y} href={y === FRENCH_YEARS[0] ? '/languages/fr' : `/languages/fr?year=${y}`} className="gc-fr-year" aria-current={y === year ? 'true' : undefined}>
            Year {y}
          </Link>
        ))}
      </nav>

      <ol className="gc-fr-path" aria-label={`Year ${year}, half term by half term`}>
        {units.map((u, i) => {
          const n = teachingLessons(u).length
          const inner = (
            <>
              <span aria-hidden className="gc-fr-ht" data-ready={u.ready || undefined}>{u.ht}</span>
              <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                <span style={{ ...eyebrow, display: 'block' }}>Half term {u.ht}</span>
                <span lang="fr" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: u.ready ? 'var(--ink)' : 'var(--ink-muted)', lineHeight: 1.25 }}>{u.fr}</span>
                <span style={{ ...small, display: 'block' }}>
                  {u.en}
                  {u.ready ? ` · ${n} lessons` : ''}
                  {/* PLAN ONLY, SAID PLAINLY (11 November 2026). "Slides on the way"
                      read like a date. These units are the author's plan, a title and
                      a line per lesson, with no slides or sheets yet. */}
                  {u.ready && !u.deck ? ' · plan only, no slides yet' : ''}
                </span>
              </span>
              {u.ready
                ? <span aria-hidden className="gc-fr-go">›</span>
                : <span style={{ ...eyebrow, color: 'var(--ink-light)', whiteSpace: 'nowrap' }}>Being written</span>}
            </>
          )
          return (
            <Reveal as="li" key={u.key} delay={i * 0.04} y={14}>
              {u.ready
                ? <Link href={`/languages/fr/${u.key}`} className="gc-fr-step">{inner}</Link>
                : <div className="gc-fr-step gc-fr-step-wait">{inner}</div>}
            </Reveal>
          )
        })}
      </ol>

      {culture.length > 0 && (
        <section aria-labelledby="culture" style={{ marginTop: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
            <h2 id="culture" style={{ ...eyebrow, margin: 0 }}>Culture lessons for Year {year}</h2>
            <Link href="/languages/fr/culture" style={{ ...small, color: 'var(--terracotta-dark)', fontWeight: 700 }}>All culture lessons</Link>
          </div>
          <ul className="gc-fr-list">
            {culture.map(({ u, l }) => (
              <LessonRow key={`${u.key}-${l.n}`} unitKey={u.key} n={l.n} mark="★" title={l.title} detail={`${l.culture} · goes with ${u.fr}`} hasSlides={!!l.deck?.slides} />
            ))}
          </ul>
        </section>
      )}

      <LessonRowStyles />
      <style>{`
        .gc-fr-years { display: inline-flex; align-self: flex-start; padding: var(--space-1); gap: var(--space-1); background: var(--warm); border: 1px solid var(--border); border-radius: var(--radius-btn); }
        .gc-fr-year {
          display: inline-flex; align-items: center; justify-content: center; min-height: 44px; min-width: 96px; padding: 0 var(--space-4);
          font-family: var(--font-display); font-weight: 700; font-size: var(--text-base); color: var(--ink-soft);
          text-decoration: none; border-radius: var(--radius-tile); transition: background-color .18s ease, color .18s ease, box-shadow .18s ease;
        }
        .gc-fr-year[aria-current="true"] { background: var(--white); color: var(--ink); font-weight: 900; box-shadow: 0 1px 2px rgba(23,60,70,0.08), 0 4px 12px -6px rgba(23,60,70,0.25); }
        .gc-fr-year:focus-visible, .gc-fr-step:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-fr-path { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2); }
        .gc-fr-step {
          display: flex; align-items: center; gap: var(--space-3); min-height: 76px; padding: var(--space-3) var(--space-4);
          background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); text-decoration: none;
          box-shadow: 0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28);
          transition: transform .2s cubic-bezier(0.22,1,0.36,1), border-color .15s ease;
        }
        a.gc-fr-step:hover { transform: translateY(-2px); border-color: var(--terracotta); }
        a.gc-fr-step:hover .gc-fr-go { transform: translateX(3px); color: var(--terracotta-dark); }
        .gc-fr-step-wait { background: transparent; box-shadow: none; border-style: dashed; min-height: 60px; }
        .gc-fr-ht {
          flex: none; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 900; font-size: var(--text-base); color: var(--ink-muted);
          background: var(--warm); border: 1px solid var(--border);
        }
        .gc-fr-ht[data-ready] { background: var(--terracotta); border-color: var(--terracotta); color: var(--ink); }
        .gc-fr-go { flex: none; font-family: var(--font-display); font-weight: 800; font-size: var(--text-xl); line-height: 1; color: var(--ink-light); transition: transform .2s ease, color .15s ease; }
        @media (max-width: 560px) { .gc-fr-years { align-self: stretch; } .gc-fr-year { flex: 1 1 0; } .gc-fr-step { padding: var(--space-3); } }
        @media (prefers-reduced-motion: reduce) { .gc-fr-step, .gc-fr-go, .gc-fr-year { transition: none; } a.gc-fr-step:hover, a.gc-fr-step:hover .gc-fr-go { transform: none; } }
      `}</style>
    </div>
  )
}
