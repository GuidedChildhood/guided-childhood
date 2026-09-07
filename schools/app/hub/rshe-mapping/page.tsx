import { Fragment } from 'react'
import { anon as supabase } from '@/lib/supabase/anon'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { CURRICULUM, RSHE_2025_TOPICS, KEY_STAGE_ORDER, type KeyStage } from '@gc/shared/schools-curriculum'

// THE RSHE 2025 MAPPING MATRIX: the document that survives the September 2026
// statutory switchover. Renders live from the curriculum manifest so it can
// never drift from what the modules actually teach.
//
// WHO READS IT AND WHAT THEY WANT. A PSHE lead opens this asking one question
// first: where are my gaps? An inspector opens it asking a second: show me
// where you teach X. Neither question was answerable from the old page, which
// was a bare 21 by 10 grid and then two walls of run on prose. You could only
// answer either by reading 210 cells and counting.
//
// So the page now opens with the answer. "Coverage at a glance" lists every
// named topic with the number of modules that teach it and the key stages it
// lands in, which is the gap answer AND the where do you teach X answer, in
// the same block, before the grid.
//
// THE COLUMN HEADINGS WERE THE WORST OF IT. Ten headings like "Misogynistic
// online cultures and incel groups" wrapped to five lines, collided with
// their neighbours, and scrolled away entirely by row six, so two thirds of
// the matrix was a field of ticks under no headings at all. The columns are
// now numbered, the coverage list above IS the legend for those numbers, and
// the header row sticks. Numbering also lets the grid fit a laptop without a
// sideways scroll, which is what made sticky possible: `overflow-x: auto`
// computes `overflow-y` to auto as well, and that scroll container was
// swallowing any `position: sticky` on the header.
//
// A BLANK CELL USED TO MEAN TWO THINGS. Nothing was drawn where a module does
// not teach a topic, which reads as missing data rather than as a claim we
// deliberately did not make. Every cell now carries a mark: a tick on butter
// for taught, a quiet dot for not taught. The honesty note explains the rule;
// the grid should show that the rule was applied everywhere.

// SiteNav is sticky at top 0 and 59px tall on this breakpoint, so a matrix
// header pinned to 0 slides underneath it and the column numbers disappear
// exactly when they are needed. Below 780 the nav wraps to two lines and the
// matrix turns into a sideways scroller, so sticky is switched off there
// rather than pinned to a number that is wrong.
// Pinned a little UNDER the nav's lower edge rather than flush against it.
// Flush left a few pixels of gap in which the row scrolling past showed
// through above the column numbers, which reads as a rendering fault. The
// header's own top padding takes the overlap, so no content is lost and the
// nav's translucency blurs the seam.
const NAV_HEIGHT = 49

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6,
}
const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
  color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 6px',
}
// The standard visually hidden rule. It needs a positioned ancestor, which
// every cell using it sets, or an absolutely positioned span resolves against
// the page itself and drags the document wider than the viewport.
const srOnly: React.CSSProperties = {
  position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px',
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
}
const card: React.CSSProperties = {
  background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px',
  padding: '22px 24px',
}

// The number badge that ties a matrix column to its entry in the legend.
function TopicNumber({ n, strong = false }: { n: number; strong?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '24px', height: '24px', flexShrink: 0, borderRadius: '8px',
      fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
      background: strong ? 'var(--terracotta)' : 'var(--terracotta-lt)',
      color: strong ? 'var(--ink)' : 'var(--terracotta-dark)',
    }}>
      {n}
    </span>
  )
}

// Two chips, one shape. `label` is the mono uppercase stamp, right for a key
// stage or a count. `name` is the default, because a full module title or a
// framework hook set in uppercase mono reads as shouting and is slower than
// the sentence it came from.
function Chip({ children, tone = 'name' }: { children: React.ReactNode; tone?: 'name' | 'label' }) {
  const label = tone === 'label'
  return (
    <span style={{
      fontFamily: label ? 'var(--font-mono)' : 'var(--font-body)',
      fontSize: label ? '10px' : 'var(--text-sm)',
      fontWeight: label ? 700 : 600,
      letterSpacing: label ? '0.1em' : 'normal',
      textTransform: label ? 'uppercase' : 'none',
      padding: label ? '4px 9px' : '4px 11px',
      borderRadius: '100px', lineHeight: 1.5,
      border: '1px solid var(--border)', background: '#fff', color: 'var(--ink-soft)',
    }}>
      {children}
    </span>
  )
}

export const revalidate = 3600

export default async function RsheMappingPage() {

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, statutory_hooks, efcw_strands')

  const dbByModule = new Map((lessons ?? []).map(l => [l.module_id, l]))

  // Modules in teaching order, which is what the matrix and the legend both
  // count over, so the two can never disagree about what is in the scheme.
  const modules = KEY_STAGE_ORDER.flatMap(ks => CURRICULUM.filter(m => m.keyStage === ks))

  // Counted, never asserted. If a topic loses its last module this block says
  // so on the next deploy rather than continuing to claim full coverage.
  const coverage = RSHE_2025_TOPICS.map((t, i) => {
    const taught = modules.filter(m => m.rshe?.includes(t.key))
    return {
      n: i + 1,
      key: t.key,
      label: t.label,
      count: taught.length,
      stages: KEY_STAGE_ORDER.filter(ks => taught.some(m => m.keyStage === ks)),
    }
  })
  const covered = coverage.filter(c => c.count > 0).length

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <style>{`
        /* The grid fits a laptop unscrolled, so sticky works there. Below
           that it becomes a sideways scroller, and sticky is switched off
           rather than left to fail quietly inside the scroll container. */
        @media (max-width: 780px) {
          .gc-matrix-scroll { overflow-x: auto; }
          .gc-matrix-head th { position: static !important; }
        }
        .gc-matrix tbody tr:nth-of-type(even) td,
        .gc-matrix tbody tr:nth-of-type(even) th { background: var(--cream); }
        .gc-matrix tbody tr:hover td,
        .gc-matrix tbody tr:hover th { background: var(--stage-1); }
        @media print {
          .gc-matrix-head th { position: static !important; }
          .gc-matrix tbody tr:hover td,
          .gc-matrix tbody tr:hover th { background: transparent; }
          .gc-avoid-break { break-inside: avoid; }
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>Statutory coverage · for the PSHE lead, SLT and inspection file</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px', letterSpacing: '-0.02em' }}>
          RSHE 2025 mapping matrix
        </h1>
        <p style={{ ...body, maxWidth: '640px', marginBottom: '6px' }}>
          The revised RSHE statutory guidance was published on 15 July 2025 and becomes compulsory on
          1 September 2026. The matrix below maps every Guided Childhood module to the guidance topics
          it substantively teaches, including the newly named content: harms of pornography, misogynistic
          online cultures and incel groups, deepfakes, online gambling, and illegal online behaviours.
        </p>
        <p style={{ ...body, color: 'var(--ink-muted)', marginBottom: '24px', maxWidth: '640px' }}>
          Honesty note: a module is marked only where it substantively teaches the topic. This scheme is a
          digital literacy and online safety programme designed to sit inside your wider PSHE provision,
          not to replace it. Each lesson additionally carries its KCSIE hooks and Education for a
          Connected World strands, shown beneath the matrix.
        </p>

        {/* COVERAGE AT A GLANCE. The first question a PSHE lead has, answered
            before the grid rather than buried inside it, and doubling as the
            legend for the numbered columns below. The counts are computed
            from the same manifest the grid draws, so the two cannot drift. */}
        <section style={{ ...card, marginBottom: '26px' }} className="gc-avoid-break">
          <h2 style={h2}>Coverage at a glance</h2>
          <p style={{ ...body, color: 'var(--ink-soft)', marginBottom: '16px' }}>
            {covered} of {RSHE_2025_TOPICS.length} named topics are taught across {modules.length} modules,
            Reception to Year 13. The numbers here are the column numbers in the matrix below.
          </p>

          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {coverage.map(c => (
              <li key={c.key} style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start',
                padding: '10px 0', borderTop: '1px solid var(--border)',
              }}>
                <span style={{ paddingTop: '2px' }}><TopicNumber n={c.n} /></span>
                <div style={{
                  flex: 1, display: 'flex', gap: '6px 14px', alignItems: 'baseline',
                  justifyContent: 'space-between', flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                    color: 'var(--ink)', lineHeight: 1.4,
                  }}>
                    {c.label}
                  </span>
                  <span style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip tone="label">{c.count} module{c.count === 1 ? '' : 's'}</Chip>
                    {c.stages.map(s => <Chip key={s} tone="label">{s}</Chip>)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <h2 id="gc-matrix-heading" style={{ ...h2, fontSize: 'var(--text-xl)', marginBottom: '4px' }}>The matrix</h2>
        <p style={{ ...body, color: 'var(--ink-muted)', marginBottom: '14px' }}>
          A tick means the module substantively teaches that topic. A dot means it does not, which is a
          judgement we made rather than a blank we left.
        </p>

        <div className="gc-matrix-scroll" style={{ marginBottom: '34px' }}>
          <table className="gc-matrix" aria-labelledby="gc-matrix-heading" style={{
            borderCollapse: 'collapse', width: '100%', minWidth: '660px',
            fontFamily: 'var(--font-body)',
          }}>
            <thead className="gc-matrix-head">
              <tr>
                <th scope="col" style={{
                  textAlign: 'left', padding: '10px 10px 10px 8px', background: '#fff',
                  borderBottom: '2px solid var(--ink)', borderRight: '1px solid var(--border)',
                  position: 'sticky', top: NAV_HEIGHT, zIndex: 2,
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
                }}>
                  Module
                </th>
                {RSHE_2025_TOPICS.map((t, i) => (
                  // The full label rides along as the accessible name and the
                  // hover title, so numbering the column costs a sighted
                  // reader a glance upward and costs a screen reader nothing.
                  <th
                    key={t.key}
                    scope="col"
                    title={t.label}
                    aria-label={`${i + 1}. ${t.label}`}
                    style={{
                      padding: '10px 0', width: '40px', background: '#fff',
                      borderBottom: '2px solid var(--ink)', position: 'sticky', top: NAV_HEIGHT, zIndex: 2,
                    }}
                  >
                    <TopicNumber n={i + 1} strong />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KEY_STAGE_ORDER.map(ks => {
                const rows = CURRICULUM.filter(m => m.keyStage === ks)
                if (!rows.length) return null
                return (
                  <Fragment key={ks}>
                    {/* The band that makes twenty one rows read as six key
                        stages, which is how a PSHE lead thinks about them. */}
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={RSHE_2025_TOPICS.length + 1}
                        style={{
                          textAlign: 'left', padding: '16px 10px 6px 0',
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
                        }}
                      >
                        {ks === 'EYFS' ? 'Early years' : `Key stage ${ks.replace('KS', '')}`}
                        <span style={{ color: 'var(--ink-light)' }}> · {rows.length} module{rows.length === 1 ? '' : 's'}</span>
                      </th>
                    </tr>
                    {rows.map(m => (
                      <tr key={m.moduleId}>
                        <th scope="row" style={{
                          textAlign: 'left', padding: '9px 14px 9px 8px',
                          borderBottom: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)', fontWeight: 700,
                          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
                          color: 'var(--ink)', lineHeight: 1.35,
                        }}>
                          <span style={{ ...mono, fontSize: '10px', color: 'var(--ink-light)', marginRight: '8px' }}>
                            M{String(m.n).padStart(2, '0')}
                          </span>
                          {m.title}
                        </th>
                        {RSHE_2025_TOPICS.map(t => {
                          const on = m.rshe?.includes(t.key)
                          return (
                            <td
                              key={t.key}
                              style={{
                                textAlign: 'center', padding: 0, position: 'relative',
                                borderBottom: '1px solid var(--border)',
                              }}
                            >
                              <span
                                aria-hidden="true"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  width: '28px', height: '28px', borderRadius: '9px',
                                  background: on ? 'var(--terracotta-lt)' : 'transparent',
                                  color: on ? 'var(--terracotta-dark)' : 'var(--ink-light)',
                                  fontWeight: 900, fontSize: on ? '15px' : '11px',
                                }}
                              >
                                {on ? '✓' : '·'}
                              </span>
                              {/* The mark is a glyph, so the meaning is
                                  carried in words for anyone not seeing it. */}
                              <span style={srOnly}>{on ? 'Taught' : 'Not taught'}</span>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* KCSIE 2026, in force 1 September 2026, names four additions a DSL
            will be asked about this term. Each row resolves its modules from
            the live manifest, so a renamed module can never leave this table
            pointing at a title that no longer exists. The wording stays
            honest: where coverage is a foundation rather than the full
            treatment, the row says so. */}
        <h2 style={{ ...h2, fontSize: 'var(--text-xl)', marginBottom: '4px' }}>
          KCSIE 2026, and where this scheme teaches it
        </h2>
        <p style={{ ...body, color: 'var(--ink-muted)', maxWidth: '640px', marginBottom: '14px' }}>
          Keeping Children Safe in Education 2026 is in force from 1 September 2026. Alongside the four
          Cs of online risk it now names generative AI, deepfakes, misinformation, disinformation and
          conspiracy theories.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '34px' }}>
          {([
            { risk: 'Generative AI and AI chatbots', note: 'seeded in the early years, taught in full at KS3 and KS5', ns: [3, 9, 12, 20] },
            { risk: 'Deepfakes and AI generated images', note: 'real and made up from Reception, the full treatment at KS3', ns: [3, 12] },
            { risk: 'Misinformation and disinformation', note: 'foundations at KS1, taught substantively at KS3, applied to persuasion at KS4', ns: [3, 12, 15] },
            { risk: 'Conspiracy theories', note: 'how false things spread at KS3, the communities that weaponise them at KS4', ns: [12, 18] },
          ] as { risk: string; note: string; ns: number[] }[]).map(row => (
            <div key={row.risk} style={{ ...card, padding: '16px 18px' }} className="gc-avoid-break">
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                color: 'var(--ink)', margin: '0 0 8px',
              }}>
                {row.risk}
              </h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {row.ns
                  .map(n => CURRICULUM.find(m => m.n === n))
                  .filter(Boolean)
                  .map(m => (
                    <Chip key={m!.moduleId}>M{String(m!.n).padStart(2, '0')} {m!.title}</Chip>
                  ))}
              </div>
              <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: 0 }}>
                {row.note}
              </p>
            </div>
          ))}
        </div>

        {/* Was twenty one run on paragraphs, each one a title, a colon and a
            string of hooks joined by dots, which is unreadable at speed and
            is exactly the thing an inspector reads at speed. One row per
            module, hooks as chips, so a hook can be found by shape. */}
        <h2 style={{ ...h2, fontSize: 'var(--text-xl)', marginBottom: '4px' }}>
          Per module statutory hooks
        </h2>
        <p style={{ ...body, color: 'var(--ink-muted)', maxWidth: '640px', marginBottom: '14px' }}>
          The KCSIE and framework anchors each lesson carries, with its Education for a Connected World
          strands.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '10px' }}>
          {modules.map(m => {
            const db = dbByModule.get(m.moduleId)
            const hooks: string[] = db?.statutory_hooks ?? []
            const strands: number[] = db?.efcw_strands ?? []
            return (
              <div key={m.moduleId} className="gc-avoid-break" style={{ padding: '11px 0', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '7px', flexWrap: 'wrap' }}>
                  <span style={{ ...mono, fontSize: '10px', color: 'var(--ink-light)' }}>
                    {m.keyStage} · M{String(m.n).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                    color: 'var(--ink)', lineHeight: 1.35,
                  }}>
                    {m.title}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {hooks.length > 0
                    ? hooks.map(h => <Chip key={h}>{h}</Chip>)
                    : <span style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
                        Statutory hooks load when the module row is live.
                      </span>}
                  {strands.length > 0 && (
                    <Chip tone="label">EfCW strand{strands.length === 1 ? '' : 's'} {strands.join(', ')}</Chip>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          Generated live from the curriculum data on {new Date().toLocaleDateString('en-GB')}. This document
          regenerates automatically whenever a module changes, so the printed copy in your file is always
          reproducible from the page.
        </p>
      </div>
    </main>
  )
}
