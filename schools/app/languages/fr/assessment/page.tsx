import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import PrintButton from '@/components/PrintButton'
import { eyebrow } from '@/components/ui'
import { ANNUAL_L2, assessedCodes, CODE_ORDER, FR_HANDBOOK, FR_PAGE, formalTasks, FRENCH_UNITS, FRENCH_YEARS, PHONICS_CHECKS, SKILL_LABEL, soloName } from '@/lib/languages/french'
import { body, Callout, card, Cards, Crumbs, InShort, langEyebrow, Part, small } from '../_ui'

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
// 13 November 2026: SHE SETTLED THE MODEL, SO THE PAGE FOLLOWS IT. Each code
// now gets one formal judgement a year, in a named half term, on a named task,
// with three descriptors written for that task. That replaced two things here:
// the tick tables that counted how often a unit touched a code (which read as
// "assessed six times", the opposite of her point), and the "how it grows"
// notes, which are now simply the two years' SOLO 4 descriptors side by side.
// The page opens with her five line summary, because that is the part a
// teacher uses.
//
// This is the explanation. The school's own numbers are on /languages/fr/progress.

export const metadata = { title: 'French: how progress is assessed' }

export default function FrenchAssessmentExplained() {
  const [first, second] = [FRENCH_YEARS[0], FRENCH_YEARS[1]]
  const years = FRENCH_YEARS.map(y => ({ y, tasks: formalTasks(y) })).filter(x => x.tasks.length > 0)
  const all = FRENCH_UNITS.flatMap(u => assessedCodes(u))
  const wording = (code: string) => all.find(x => x.code === code)?.pupil ?? ''
  const codes = CODE_ORDER.filter(c => years.some(x => x.tasks.some(t => t.code === c)))
  const checkpoints = [...new Set(years.flatMap(x => x.tasks.map(t => t.checkpoint)))].sort()
  const at = (y: number, code: string) => years.find(x => x.y === y)?.tasks.find(t => t.code === code) ?? null
  const perYear = years[0]?.tasks.length ?? 0

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Crumbs trail={[{ href: '/languages/fr/plan', label: 'Plan and assess' }, { label: 'How progress is assessed' }]} />
          <PrintButton label="Print this page" />
        </div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French · Assessment</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          What is assessed, and when
        </h1>
        <p style={{ ...body, maxWidth: '680px' }}>
          Each assessment code gets one formal judgement a year, at a planned checkpoint, on a task chosen for it.
          The codes (L1 to G1) are the scheme&apos;s own shorthand for the key stage 2 languages programme of study.
        </p>
      </div>

      {years.length > 0 && (
        <InShort points={[
          <>{perYear} codes, each judged <b>once a year</b>, at one of {checkpoints.length} checkpoints ({checkpoints.join(', ')}).</>,
          <>The judgement happens in a <b>normal lesson</b>, during the task in the map below.</>,
          <>Use the task&apos;s own descriptors. Most pupils are at SOLO 3, 4 or 5, and <b>SOLO 4 is the expected standard</b>.</>,
          <>Speaking and listening are <b>observed</b>. Reading, writing and grammar come from the written task.</>,
          <>Everything else is <b>formative</b>: it shapes teaching and is not recorded as a judgement.</>,
        ]} />
      )}

      {years.map(({ y, tasks }) => (
        <Part key={y} id={`year-${y}`} title={`Year ${y}: the checkpoint map`}>
          <p style={{ ...small, margin: 0 }}>{tasks.length} formal tasks. Open a task to see what SOLO 3, 4 and 5 look like for it.</p>
          <div className="gc-fr-cp" style={{ ...card, padding: 0 }}>
            {tasks.map((t, i) => (
              <details key={t.code} className="gc-fr-cp-row">
                <summary>
                  <span className="gc-fr-cp-when">{(i === 0 || tasks[i - 1].checkpoint !== t.checkpoint) ? t.checkpoint : ''}</span>
                  <span className="gc-fr-code">{t.code}</span>
                  <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <span style={{ ...small, display: 'block', color: 'var(--ink-muted)' }}>{SKILL_LABEL[t.code[0]] ?? 'Statement'}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45 }}>{t.task}</span>
                  </span>
                  <span aria-hidden className="gc-fr-cp-chev">›</span>
                </summary>
                {t.descriptor ? (
                  <dl className="gc-fr-cp-levels">
                    {([3, 4, 5] as const).map(n => (
                      <div key={n} data-expected={n === 4 ? '' : undefined}>
                        <dt style={eyebrow}>{soloName(n)}{n === 4 ? ' · expected' : ''}</dt>
                        <dd style={{ ...small, margin: 0, color: 'var(--ink-soft)' }}>{t.descriptor![`solo${n}`]}</dd>
                      </div>
                    ))}
                  </dl>
                ) : <p style={{ ...small, margin: 0, padding: '0 var(--space-4) var(--space-3)' }}>The descriptors for this task are still to come.</p>}
              </details>
            ))}
          </div>
        </Part>
      ))}

      {years.length > 1 && (
        <Part title="When each code is assessed">
          <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
            <table className="gc-fr-ticks">
              <thead>
                <tr>
                  <th scope="col">Checkpoint</th>
                  {years.map(x => <th key={x.y} scope="col">Year {x.y}</th>)}
                </tr>
              </thead>
              <tbody>
                {checkpoints.map(cp => (
                  <tr key={cp}>
                    <th scope="row"><span className="gc-fr-code">{cp}</span></th>
                    {years.map(x => <td key={x.y}>{x.tasks.filter(t => t.checkpoint === cp).map(t => t.code).join(' · ')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Part>
      )}

      <Part title={`Progress from Year ${first} to Year ${second ?? first}`}>
        <p style={{ ...body, margin: 0, maxWidth: '680px' }}>
          Both years are assessed against the same codes, because those describe skills for the whole of key
          stage 2. So where does the progress show?
        </p>
        {FR_HANDBOOK.shortAnswer && <Callout>{FR_HANDBOOK.shortAnswer}</Callout>}
        <Cards rows={FR_HANDBOOK.progressShows} />
      </Part>

      {years.length > 1 && second !== undefined && (
        <Part title="End of year statements: the expected standard for each code">
          <p style={{ ...small, margin: 0 }}>
            This is the SOLO 4 descriptor for each code&apos;s checkpoint task. Pupils at SOLO 5 go beyond it, and pupils below SOLO 4 are working towards it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {codes.map(c => (
              <article key={c} className="gc-fr-grow" style={card}>
                <p style={{ ...langEyebrow, margin: 0 }}>{c} · {SKILL_LABEL[c[0]] ?? 'Statement'}</p>
                {wording(c) && <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, margin: 'var(--space-1) 0 var(--space-3)' }}>{wording(c)}</h3>}
                <div className="gc-fr-grow-cols">
                  {[first, second].map(y => (
                    <div key={y}>
                      <span style={{ ...eyebrow, display: 'block', marginBottom: 'var(--space-1)' }}>Year {y}{at(y, c) ? ` · ${at(y, c)!.checkpoint}` : ''}</span>
                      <p style={{ ...small, margin: 0, color: 'var(--ink-soft)' }}>{at(y, c)?.descriptor?.solo4 ?? 'Not formally judged this year.'}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Part>
      )}

      {(PHONICS_CHECKS.length > 0 || ANNUAL_L2.length > 0) && (
        <Part title="Phonics: three progress checks, one judgement a year">
          <p style={{ ...body, margin: 0, maxWidth: '680px' }}>
            The progress checks show how pupils&apos; phonics is developing. They are not extra judgements: L2 is still
            judged once a year.
          </p>
          <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
            <table className="gc-fr-ticks">
              <tbody>
                {PHONICS_CHECKS.map((c, i) => (
                  <tr key={`c${i}`}><th scope="row"><span className="gc-fr-code">Y{c.year} {c.timing}</span></th><td>{c.purpose}</td></tr>
                ))}
                {ANNUAL_L2.map((c, i) => (
                  <tr key={`l${i}`}><th scope="row"><span className="gc-fr-code">Y{c.year} {c.timing}</span></th><td><b>The judgement.</b> {c.purpose}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Part>
      )}

      <Part title="How it is recorded">
        <Cards rows={FR_PAGE.assessment} />
        <p style={{ ...small, margin: 0 }}>
          The letter in a code is the skill: {Object.entries(SKILL_LABEL).map(([k, v], i) => <span key={k}>{i > 0 && ', '}<b style={{ color: 'var(--ink)' }}>{k}</b> {v.toLowerCase()}</span>)}.{' '}
          On this site a teacher records the class count for each code with one button at the end of the lesson, and{' '}
          <Link href="/languages/fr/progress" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the progress page</Link> adds it up.
        </p>
      </Part>

      <Part title="Checking progress in other ways">
        <Cards rows={FR_PAGE.impact} />
      </Part>

      <style>{`
        .gc-fr-ticks { border-collapse: collapse; width: 100%; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); }
        .gc-fr-ticks th, .gc-fr-ticks td { padding: var(--space-2) var(--space-3); border-top: 1px solid var(--border); text-align: left; font-weight: 400; line-height: 1.5; vertical-align: top; }
        .gc-fr-ticks thead th { border-top: 0; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }
        .gc-fr-ticks tbody tr:first-child th, .gc-fr-ticks tbody tr:first-child td { border-top: 0; }
        .gc-fr-ticks thead + tbody tr:first-child th, .gc-fr-ticks thead + tbody tr:first-child td { border-top: 1px solid var(--border); }
        .gc-fr-ticks td b { color: var(--ink); }
        .gc-fr-code { display: inline-block; min-width: 36px; font-family: var(--font-mono); font-weight: 600; font-size: var(--text-xs); color: var(--terracotta-dark); white-space: nowrap; }
        .gc-fr-cp { overflow: hidden; }
        .gc-fr-cp-row + .gc-fr-cp-row { border-top: 1px solid var(--border); }
        .gc-fr-cp-row > summary { display: flex; align-items: center; gap: var(--space-3); min-height: 60px; padding: var(--space-2) var(--space-4); cursor: pointer; list-style: none; }
        .gc-fr-cp-row > summary::-webkit-details-marker { display: none; }
        .gc-fr-cp-row > summary:hover, .gc-fr-cp-row[open] > summary { background: var(--warm); }
        .gc-fr-cp-row > summary:focus-visible { outline: none; box-shadow: inset 0 0 0 3px var(--terracotta); }
        .gc-fr-cp-when { flex: none; width: 40px; font-family: var(--font-mono); font-weight: 600; font-size: var(--text-xs); letter-spacing: 0.08em; color: var(--ink); }
        .gc-fr-cp-chev { flex: none; font-family: var(--font-display); font-weight: 800; font-size: var(--text-xl); line-height: 1; color: var(--ink-light); transition: transform .2s ease; }
        .gc-fr-cp-row[open] .gc-fr-cp-chev { transform: rotate(90deg); color: var(--terracotta-dark); }
        .gc-fr-cp-levels { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); margin: 0; padding: var(--space-3) var(--space-4) var(--space-4); }
        .gc-fr-cp-levels > div { border: 1px solid var(--border); border-radius: var(--radius-tile); padding: var(--space-3); background: var(--white); }
        .gc-fr-cp-levels > div[data-expected] { background: var(--butter-lt); border-color: var(--terracotta); }
        .gc-fr-grow-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); border-top: 1px solid var(--border); padding-top: var(--space-3); }
        @media (max-width: 640px) {
          .gc-fr-grow-cols, .gc-fr-cp-levels { grid-template-columns: 1fr; gap: var(--space-2); }
          .gc-fr-cp-row > summary { padding: var(--space-2) var(--space-3); gap: var(--space-2); }
          .gc-fr-cp-levels { padding: var(--space-2) var(--space-3) var(--space-3); }
        }
        @media (prefers-reduced-motion: reduce) { .gc-fr-cp-chev { transition: none; } }
        @media print { .gc-fr-grow, .gc-fr-cp-row { break-inside: avoid; box-shadow: none !important; } .gc-fr-cp-row > .gc-fr-cp-levels { display: grid !important; } }
      `}</style>
    </div>
  )
}
