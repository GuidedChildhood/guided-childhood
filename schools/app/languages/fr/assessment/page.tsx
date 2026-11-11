import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import PrintButton from '@/components/PrintButton'
import { eyebrow } from '@/components/ui'
import { assessedCodes, CODE_ORDER, FR_HANDBOOK, FR_PAGE, FRENCH_UNITS, FRENCH_YEARS, SKILL_LABEL } from '@/lib/languages/french'
import { body, Callout, card, Cards, Crumbs, langEyebrow, Part, small } from '../_ui'

// /languages/fr/assessment: HOW PROGRESS SHOWS FROM YEAR 3 TO YEAR 4 (11 November 2026).
//
// The scheme's author wrote this for a head who asked the obvious question:
// if Year 3 and Year 4 are assessed against the same statements, where is the
// progress? Her answer is the page: the statement stays, the French gets
// harder, and the same level asks for more. Every explanation on it is hers,
// synced from her own site (lib/languages/fr.json: page and handbook). The two
// tables are worked out from the units themselves, so they cannot drift from
// what the lessons assess.
//
// This is the explanation. The school's own numbers are on /languages/fr/progress.

export const metadata = { title: 'French: how progress is assessed' }

export default function FrenchAssessmentExplained() {
  const grow = FR_HANDBOOK.grow ?? {}
  const unitsOf = (y: number) => FRENCH_UNITS.filter(u => u.year === y)
  const has = (u: typeof FRENCH_UNITS[number], code: string) => assessedCodes(u).find(c => c.code === code)
  const all = FRENCH_UNITS.flatMap(u => assessedCodes(u))
  const codes = CODE_ORDER.filter(c => all.some(x => x.code === c))
  const wording = (code: string) => all.find(x => x.code === code)?.pupil ?? ''
  // The statements assessed in both years: those are the ones that can show growth.
  const [first, second] = [FRENCH_YEARS[0], FRENCH_YEARS[1]]
  const inBoth = codes.filter(c => unitsOf(first).some(u => has(u, c)) && second !== undefined && unitsOf(second).some(u => has(u, c)))

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Crumbs trail={[{ href: '/languages/fr/plan', label: 'Plan and assess' }, { label: 'How progress is assessed' }]} />
          <PrintButton label="Print this page" />
        </div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French · Assessment</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          Progress from Year {first} to Year {second ?? first}
        </h1>
        <p style={{ ...body, maxWidth: '680px' }}>
          Both years are assessed against the same national curriculum statements, because those describe skills
          for the whole of key stage 2. So where does the progress show? This page is the answer, in the words of
          the teacher who wrote the scheme.
        </p>
      </div>

      {FR_HANDBOOK.shortAnswer && <Callout>{FR_HANDBOOK.shortAnswer}</Callout>}

      <Part title="How progress shows">
        <Cards rows={FR_HANDBOOK.progressShows} />
      </Part>

      <Part title="When each statement is assessed">
        {FRENCH_YEARS.map(y => (
          <div key={y}>
            <h3 style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Year {y}</h3>
            <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
              <table className="gc-fr-ticks">
                <thead>
                  <tr>
                    <th scope="col">Statement</th>
                    {unitsOf(y).map(u => <th key={u.key} scope="col" className="gc-fr-tick"><span>HT{u.ht}</span><small lang="fr">{u.fr}</small></th>)}
                    <th scope="col" className="gc-fr-tick"><span>Times</span></th>
                  </tr>
                </thead>
                <tbody>
                  {codes.filter(c => unitsOf(y).some(u => has(u, c))).map(c => (
                    <tr key={c}>
                      <th scope="row"><span className="gc-fr-code">{c}</span>{wording(c)}</th>
                      {unitsOf(y).map(u => <td key={u.key} className="gc-fr-tick">{has(u, c) ? <span aria-label="assessed">✓</span> : null}</td>)}
                      <td className="gc-fr-tick"><b>{unitsOf(y).filter(u => has(u, c)).length}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </Part>

      <Part title="How it is recorded">
        <Cards rows={FR_PAGE.assessment} />
        <p style={{ ...small, margin: 0 }}>
          The letter in a code is the skill: {Object.entries(SKILL_LABEL).map(([k, v], i) => <span key={k}>{i > 0 && ', '}<b style={{ color: 'var(--ink)' }}>{k}</b> {v.toLowerCase()}</span>)}.{' '}
          On this site a teacher records the class count for each statement with one button at the end of the lesson, and{' '}
          <Link href="/languages/fr/progress" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the progress page</Link> adds it up.
        </p>
      </Part>

      {inBoth.length > 0 && second !== undefined && (
        <Part title="The same statement in both years: what SOLO 4 looks like each time">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {inBoth.map(c => (
              <article key={c} className="gc-fr-grow" style={card}>
                <p style={{ ...langEyebrow, margin: 0 }}>{c} · {SKILL_LABEL[c[0]] ?? 'Statement'}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, margin: 'var(--space-1) 0' }}>{wording(c)}</h3>
                {grow[c] && <p style={{ ...body, margin: '0 0 var(--space-3)', color: 'var(--ink)' }}><b>How it grows.</b> {grow[c]}</p>}
                <div className="gc-fr-grow-cols">
                  {[first, second].map(y => (
                    <div key={y}>
                      <span style={{ ...eyebrow, display: 'block', marginBottom: 'var(--space-1)' }}>Year {y}</span>
                      {unitsOf(y).filter(u => has(u, c)).map(u => (
                        <p key={u.key} style={{ ...small, margin: '0 0 var(--space-2)' }}>
                          <b style={{ color: 'var(--ink)' }}>HT{u.ht} · <span lang="fr">{u.fr}</span></b><br />{has(u, c)?.s4}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Part>
      )}

      <Part title="Checking progress in other ways">
        <Cards rows={FR_PAGE.impact} />
      </Part>

      <style>{`
        .gc-fr-ticks { border-collapse: collapse; width: 100%; min-width: 760px; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); }
        .gc-fr-ticks th, .gc-fr-ticks td { padding: var(--space-2) var(--space-3); border-top: 1px solid var(--border); text-align: left; font-weight: 400; line-height: 1.4; vertical-align: middle; }
        .gc-fr-ticks thead th { border-top: 0; vertical-align: bottom; }
        .gc-fr-ticks .gc-fr-tick { text-align: center; padding: var(--space-2) var(--space-1); color: var(--terracotta-dark); font-weight: 900; width: 76px; }
        .gc-fr-ticks thead .gc-fr-tick span { display: block; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; color: var(--ink); }
        .gc-fr-ticks thead .gc-fr-tick small { display: block; font-size: var(--text-xs); font-weight: 400; color: var(--ink-muted); line-height: 1.25; }
        .gc-fr-ticks td b { color: var(--ink); }
        .gc-fr-code { display: inline-block; min-width: 36px; font-family: var(--font-mono); font-weight: 600; font-size: var(--text-xs); color: var(--terracotta-dark); }
        .gc-fr-grow-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); border-top: 1px solid var(--border); padding-top: var(--space-3); }
        @media (max-width: 640px) { .gc-fr-grow-cols { grid-template-columns: 1fr; gap: var(--space-2); } }
        @media print { .gc-fr-grow { break-inside: avoid; box-shadow: none !important; } }
      `}</style>
    </div>
  )
}
