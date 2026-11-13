import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import PrintButton from '@/components/PrintButton'
import { eyebrow } from '@/components/ui'
import { assessedCodes, checkpointTasks, flowSteps, HAS_CHECKPOINTS, FR_HANDBOOK, FR_PAGE, FRENCH_UNITS, FRENCH_YEARS } from '@/lib/languages/french'
import { body, Callout, card, Cards, Crumbs, Flow, langEyebrow, Part, small } from '../_ui'

// /languages/fr/curriculum: THE TWO YEAR CURRICULUM ON ONE PAGE (11 November 2026).
//
// The page a head or a subject lead reads before a deep dive, and the one the
// scheme's author added to her own site this week: what the curriculum is for,
// the long term plan for each year, and how phonics, grammar, audience and
// vocabulary build across the two. All of it is her text and her plan, synced
// (lib/languages/fr.json), so an edit on her site arrives here on the next
// sync and nothing is retyped.

export const metadata = { title: 'French: the curriculum' }

const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: 'var(--space-3)', padding: 'var(--space-1) 0' }

export default function FrenchCurriculum() {
  const P = FR_PAGE
  const yk = (y: number) => `y${y}` as 'y3' | 'y4'
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Crumbs trail={[{ href: '/languages/fr/plan', label: 'Plan and assess' }, { label: 'The curriculum' }]} />
          <PrintButton label="Print this page" />
        </div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French · Years {FRENCH_YEARS.join(' and ')}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          The two year curriculum
        </h1>
        {P.intro && <p style={{ ...body, maxWidth: '680px' }}>{P.intro}</p>}
      </div>

      {FR_HANDBOOK.believe && <Callout>{FR_HANDBOOK.believe}</Callout>}

      {P.intent && <Part title="What we want for pupils"><Cards rows={P.intent} /></Part>}
      {P.pillars && <Part title="Three strands"><p style={{ ...body, margin: 0 }}>{P.pillars}</p></Part>}

      {FRENCH_YEARS.map(y => {
        const culture = Object.fromEntries(P.culture?.[yk(y)] ?? [])
        const phonics = Object.fromEntries((P.phonics?.[yk(y)] ?? []).map(r => [r[0], r[1]]))
        return (
          <Part key={y} id={`year-${y}`} title={`Year ${y}: the long term plan`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {FRENCH_UNITS.filter(u => u.year === y).map(u => {
                const p = u.plan
                const vocab = (p.vocab ?? []).map(v => v[0]).slice(0, 14).join(', ')
                const checkpoint = /^Checkpoint/.test(phonics[`HT${u.ht}`] ?? '')
                // The formal checkpoint codes where the scheme has its map; before that, what the unit touches.
                const codes = (HAS_CHECKPOINTS ? checkpointTasks(u).map(t => t.code) : assessedCodes(u).map(c => c.code)).join(' · ')
                return (
                  <article key={u.key} className="gc-fr-ltp" style={{ ...card, background: u.ready ? 'var(--white)' : 'transparent', boxShadow: u.ready ? card.boxShadow : 'none', borderStyle: u.ready ? 'solid' : 'dashed' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                      <div>
                        <span style={{ ...eyebrow, display: 'block' }}>Half term {u.ht}</span>
                        <span lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{u.fr}</span>{' '}
                        <span style={small}>{u.en}</span>
                      </div>
                      {u.ready
                        ? <Link href={`/languages/fr/${u.key}`} className="no-print" style={{ ...small, color: 'var(--terracotta-dark)', fontWeight: 700, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Open the unit ›</Link>
                        : <span style={{ ...eyebrow, color: 'var(--ink-light)' }}>Being written</span>}
                    </div>
                    <dl style={{ margin: 0 }} className="gc-fr-ltp-rows">
                      {vocab && <div style={row}><dt style={eyebrow}>Vocabulary</dt><dd lang="fr" style={{ ...small, margin: 0, color: 'var(--ink)' }}>{vocab}</dd></div>}
                      {p.grammar && <div style={row}><dt style={eyebrow}>Grammar</dt><dd style={{ ...small, margin: 0, color: 'var(--ink)' }}>{p.grammar}</dd></div>}
                      {(p.sound || checkpoint) && <div style={row}><dt style={eyebrow}>Sound</dt><dd style={{ ...small, margin: 0, color: 'var(--ink)' }}>{checkpoint ? 'Phonics checkpoint' : <><b lang="fr">{p.sound}</b> {p.soundHint}</>}</dd></div>}
                      {culture[`HT${u.ht}`] && <div style={row}><dt style={eyebrow}>Culture</dt><dd style={{ ...small, margin: 0, color: 'var(--ink)' }}>{culture[`HT${u.ht}`]}</dd></div>}
                      {codes && <div style={row}><dt style={eyebrow}>{HAS_CHECKPOINTS ? 'Formal assessment' : 'Assessed'}</dt><dd style={{ ...small, margin: 0, color: 'var(--ink)' }}>{codes}</dd></div>}
                      {p.ican && p.ican.length > 0 && <div style={row}><dt style={eyebrow}>By the end</dt><dd style={{ ...small, margin: 0, color: 'var(--ink)' }}>{p.ican.join(' ')}</dd></div>}
                    </dl>
                  </article>
                )
              })}
            </div>
          </Part>
        )
      })}

      <Part id="progression" title="How learning builds across the two years">
        {P.audience && (
          <div>
            <h3 style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>A growing audience</h3>
            <Flow steps={flowSteps(P.audience)} />
          </div>
        )}
        {FRENCH_YEARS.map(y => (P.grammar?.[yk(y)] ? (
          <div key={`g${y}`}>
            <h3 style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Grammar, Year {y}</h3>
            <Flow steps={flowSteps(P.grammar[yk(y)])} />
          </div>
        ) : null))}
        {FRENCH_YEARS.map(y => ((P.phonics?.[yk(y)] ?? []).length > 0 ? (
          <div key={`p${y}`}>
            <h3 style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Phonics, Year {y}</h3>
            <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
              <table className="gc-fr-ph">
                <thead><tr><th scope="col">Half term</th><th scope="col">Sound</th><th scope="col">Transcription</th></tr></thead>
                <tbody>
                  {(P.phonics?.[yk(y)] ?? []).map(r => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        ) : null))}
        {P.phonics?.note && <p style={{ ...small, margin: 0 }}>{P.phonics.note}</p>}
        {P.vocabulary && (
          <div>
            <h3 style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Vocabulary</h3>
            <Cards rows={P.vocabulary} />
          </div>
        )}
        {P.books && (
          <div>
            <h3 style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Picture books</h3>
            <p style={{ ...body, margin: 0 }}>{P.books}</p>
          </div>
        )}
      </Part>

      <style>{`
        .gc-fr-ph { border-collapse: collapse; width: 100%; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); }
        .gc-fr-ph th, .gc-fr-ph td { padding: var(--space-2) var(--space-3); border-top: 1px solid var(--border); text-align: left; line-height: 1.45; }
        .gc-fr-ph thead th { border-top: 0; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }
        .gc-fr-ph tbody th { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; color: var(--terracotta-dark); white-space: nowrap; }
        @media (max-width: 560px) { .gc-fr-ltp-rows > div { grid-template-columns: 1fr !important; gap: 0 !important; } }
        @media print { .gc-fr-ltp { break-inside: avoid; box-shadow: none !important; } }
      `}</style>
    </div>
  )
}
