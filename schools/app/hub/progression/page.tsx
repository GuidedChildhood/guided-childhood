import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { AREA_ORDER, AREAS, areaOf } from '@gc/shared/passport-areas'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import { CURRICULUM, KEY_STAGE_META, KEY_STAGE_ORDER, positionOf } from '@gc/shared/schools-curriculum'
import { buildsOn, leadsTo, lessonsForYear, suggestedYear, yearName, YEARS_OF } from '@gc/shared/schools-progression'

// /hub/progression: WHAT EACH YEAR TEACHES, AND WHAT IT BUILDS ON
// (11 November 2026, the progression review, amendment 3).
//
// The question a subject lead asks first is "what does Year 4 teach, and what
// did they need from Year 3?". The scheme answered by key stage and no finer,
// so nine KS2 lessons across four years was left for every school to work out.
//
// This page answers it twice, from one file (shared/schools-progression.ts):
//
//   YEAR BY YEAR   each year group's lessons, what each one builds on and what
//                  it leads to, so a teacher sees the lesson before and after
//                  their own
//   THREAD BY THREAD  the four things the passport records, each followed from
//                  Reception to Year 13, so a lead can see a strand grow
//
// A SUGGESTION, AND IT SAYS SO. Every lesson stands alone. The years are ours,
// chosen so nothing is placed before what it builds on
// (scripts/check-progression.mjs holds that), and a school will move them.
//
// Nothing is read from the database: the map is the manifest, so it is true
// for a visitor with no code and it prints the same for everyone.

export const metadata = { title: 'The progression map' }

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const bodyText: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65 }
const smallText: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55 }

const where = (moduleId: string) => {
  const y = suggestedYear(moduleId)
  return y === null ? '' : yearName(y)
}

export default function ProgressionMap() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <style>{`@media print { @page { size: A4 portrait; margin: 12mm; } body { background: var(--white) !important; } .no-print { display: none !important; } }`}</style>
      <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>← The Hub</Link>
          <PrintButton label="Print the map" />
        </div>

        <header>
          <div style={{ ...mono, color: 'var(--green-dark)', marginBottom: 'var(--space-1)' }}>Progression · suggested years, teach in the order you need</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
            What each year teaches, and what it builds on
          </h1>
          <p style={{ ...bodyText, maxWidth: '680px', margin: 0 }}>
            Every lesson from Reception to Year 13, with a suggested year, the earlier lessons it builds on
            and the later ones it leads to. The years are a suggestion. Every lesson stands alone, so a mixed age
            class or a rolling programme can move them. What moves with them is the starter, which looks back
            at the lesson named here.
          </p>
        </header>

        <nav aria-label="Key stage" className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {KEY_STAGE_ORDER.map(ks => (
            <a key={ks} href={`#${ks}`} className="gc-pm-jump">{KEY_STAGE_META[ks].label}</a>
          ))}
          <a href="#threads" className="gc-pm-jump">The four threads</a>
        </nav>

        {KEY_STAGE_ORDER.map(ks => (
          <section key={ks} id={ks} aria-labelledby={`h-${ks}`} style={{ scrollMarginTop: 'var(--space-4)' }}>
            <h2 id={`h-${ks}`} style={{ ...mono, margin: '0 0 var(--space-1)' }}>{KEY_STAGE_META[ks].label} · {KEY_STAGE_META[ks].years}</h2>
            <p style={{ ...smallText, margin: '0 0 var(--space-3)' }}>{KEY_STAGE_META[ks].strapline}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {YEARS_OF[ks].map(year => {
                const lessons = lessonsForYear(year)
                return (
                  <div key={year} className="gc-pm-year">
                    <div className="gc-pm-yearname">
                      <span>{yearName(year)}</span>
                      <small>{lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}</small>
                      <Link href={`/print/look-back?y=${year}`} className="gc-pm-quiz no-print">Look back quiz</Link>
                    </div>
                    <ol className="gc-pm-lessons">
                      {lessons.map(m => {
                        const before = buildsOn(m.moduleId)
                        const after = leadsTo(m.moduleId)
                        const area = areaOf(m.moduleId)
                        return (
                          <li key={m.moduleId} value={positionOf(m.moduleId)?.index}>
                            <div className="gc-pm-top">
                              <Link href={`/lesson/${m.moduleId}`} className="gc-pm-title">{m.title}</Link>
                              {area && <span className="gc-pm-area">{AREAS[area].name}</span>}
                            </div>
                            <p className="gc-pm-outcome">{m.outcome}</p>
                            <dl className="gc-pm-links">
                              <div>
                                <dt>Builds on</dt>
                                <dd>
                                  {before.length === 0
                                    ? 'Starts a thread. Nothing earlier is needed.'
                                    : before.map((b, i) => (
                                      <span key={b.moduleId}>{i > 0 && ' · '}<Link href={`/lesson/${b.moduleId}`}>{b.title}</Link> ({where(b.moduleId)})</span>
                                    ))}
                                </dd>
                              </div>
                              {after.length > 0 && (
                                <div>
                                  <dt>Leads to</dt>
                                  <dd>
                                    {after.map((a, i) => (
                                      <span key={a.moduleId}>{i > 0 && ' · '}<Link href={`/lesson/${a.moduleId}`}>{a.title}</Link> ({where(a.moduleId)})</span>
                                    ))}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        <section id="threads" aria-labelledby="h-threads" style={{ scrollMarginTop: 'var(--space-4)' }}>
          <h2 id="h-threads" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-1)' }}>The four threads, from Reception to Year 13</h2>
          <p style={{ ...smallText, margin: '0 0 var(--space-3)', maxWidth: '680px' }}>
            The same four things the passport records at home. Read across a row to see one strand grow.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {AREA_ORDER.map(a => {
              const list = CURRICULUM.filter(m => areaOf(m.moduleId) === a)
              return (
                <div key={a} className="gc-pm-thread">
                  <h3>{AREAS[a].name} <small>{list.length} lessons</small></h3>
                  <ol>
                    {list.map(m => (
                      <li key={m.moduleId}>
                        <span className="gc-pm-when">{where(m.moduleId)}</span>
                        <Link href={`/lesson/${m.moduleId}`}>{m.title}</Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )
            })}
          </div>
        </section>

        <p style={{ ...smallText, margin: 0 }}>
          The years are our suggestion and are not set by any guidance. They keep the scheme&apos;s own order inside each
          key stage and place no lesson before one it builds on. For the terms, see{' '}
          <Link href="/hub/year-plan" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the year at a glance</Link>.
        </p>
      </div>

      <style>{`
        .gc-pm-jump { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-muted); text-decoration: none; display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-3); border: 1.5px solid var(--border); border-radius: var(--radius-tile); background: var(--white); }
        .gc-pm-jump:hover, .gc-pm-jump:focus-visible { border-color: var(--green-dark); color: var(--ink); }
        .gc-pm-year { display: grid; grid-template-columns: 132px minmax(0, 1fr); background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; }
        .gc-pm-yearname { background: var(--butter-lt); padding: var(--space-4) var(--space-3); display: flex; flex-direction: column; gap: var(--space-1); border-right: 1px solid var(--border); }
        .gc-pm-yearname span { font-family: var(--font-display); font-weight: 900; font-size: var(--text-xl); color: var(--ink); line-height: 1.1; }
        .gc-pm-yearname small { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }
        .gc-pm-quiz { font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--ink); text-underline-offset: 3px; min-height: 44px; display: inline-flex; align-items: center; }
        .gc-pm-quiz:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-pm-lessons { list-style: none; margin: 0; padding: 0; }
        .gc-pm-lessons > li { padding: var(--space-3) var(--space-4); }
        .gc-pm-lessons > li + li { border-top: 1px solid var(--border); }
        .gc-pm-top { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap; }
        .gc-pm-title { font-family: var(--font-display); font-weight: 800; font-size: var(--text-lg); color: var(--ink); text-decoration: none; line-height: 1.25; }
        .gc-pm-title:hover, .gc-pm-title:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
        .gc-pm-area { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); background: var(--warm); border: 1px solid var(--border); border-radius: var(--radius-tile); padding: var(--space-1) var(--space-2); white-space: nowrap; }
        .gc-pm-outcome { margin: var(--space-1) 0 var(--space-2); font-family: var(--font-body); font-size: var(--text-base); color: var(--ink-soft); line-height: 1.5; }
        .gc-pm-links { margin: 0; display: flex; flex-direction: column; gap: var(--space-1); }
        .gc-pm-links > div { display: grid; grid-template-columns: 84px minmax(0, 1fr); gap: var(--space-2); align-items: baseline; }
        .gc-pm-links dt { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }
        .gc-pm-links dd { margin: 0; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); line-height: 1.55; }
        .gc-pm-links a { color: var(--ink); font-weight: 700; text-underline-offset: 3px; }
        .gc-pm-thread { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); padding: var(--space-4); }
        .gc-pm-thread h3 { margin: 0 0 var(--space-2); font-family: var(--font-display); font-weight: 900; font-size: var(--text-lg); color: var(--ink); }
        .gc-pm-thread h3 small { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); margin-left: var(--space-2); }
        .gc-pm-thread ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-2) var(--space-4); }
        .gc-pm-thread li { display: grid; grid-template-columns: 84px minmax(0, 1fr); gap: var(--space-2); align-items: baseline; font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.45; }
        .gc-pm-thread a { color: var(--ink); font-weight: 700; text-decoration: none; }
        .gc-pm-thread a:hover, .gc-pm-thread a:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
        .gc-pm-when { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted); }
        .gc-pm-jump:focus-visible, .gc-pm-title:focus-visible, .gc-pm-links a:focus-visible, .gc-pm-thread a:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        @media (max-width: 640px) {
          .gc-pm-year { grid-template-columns: minmax(0, 1fr); }
          .gc-pm-yearname { flex-direction: row; align-items: baseline; justify-content: space-between; border-right: 0; border-bottom: 1px solid var(--border); padding: var(--space-3) var(--space-4); }
          .gc-pm-links > div { grid-template-columns: minmax(0, 1fr); gap: 0; }
        }
        @media print { .gc-pm-year, .gc-pm-thread { break-inside: avoid; } .gc-pm-yearname, .gc-pm-area { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      `}</style>
    </main>
  )
}
