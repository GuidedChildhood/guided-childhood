import { RSHE_2026, RSHE_2026_COUNTS, type Rshe2026Requirement, type Rshe2026Verdict } from '@gc/shared/schools-rshe-2026'
import { CURRICULUM, positionCode } from '@gc/shared/schools-curriculum'

// THE REQUIREMENTS, ONE BY ONE, WITH THE GAPS IN THE SAME LIST.
//
// This replaced a 25 by 10 grid of ticks. The grid looked like coverage and
// was not: its ten columns were themes someone wrote, and the guidance has
// twenty eight strands and one hundred and ninety five numbered items. A PSHE
// lead who opened the guidance next to that grid would have found the mismatch
// in about ten minutes, which is the worst possible moment to find it.
//
// So the page now prints the requirement itself, in the guidance's own words,
// and says what we do about it. Four answers, and one of them is no.
//
//   TAUGHT        a named module teaches it, and the guard holds the module to
//                 phrases that must appear in its slides
//   IN PROGRESS   part of it is taught and a named clause is still missing
//   NOT COVERED   we do not teach it, and here is what it is
//   YOUR SCHEME   it belongs to your wider RSE, with what we teach towards it
//
// A scheme that names what it does not cover is more credible than one that
// implies it covers everything, and it is the only version that is true.

const VERDICT: Record<Rshe2026Verdict, { label: string; mark: string; fg: string; bg: string }> = {
  FULL:      { label: 'Taught',      mark: '✓', fg: 'var(--green-dark)',      bg: 'var(--green-lt)' },
  PARTIAL:   { label: 'In progress', mark: '◐', fg: 'var(--terracotta-dark)', bg: 'var(--terracotta-lt)' },
  GAP:       { label: 'Not covered', mark: '○', fg: 'var(--ink-soft)',        bg: '#fff' },
  BY_DESIGN: { label: 'Your scheme', mark: '→', fg: 'var(--ink-muted)',       bg: 'var(--butter-lt)' },
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

const TITLE_OF = new Map(CURRICULUM.map(m => [m.moduleId, m.title]))

function Mark({ verdict }: { verdict: Rshe2026Verdict }) {
  const v = VERDICT[verdict]
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '26px', height: '26px', flexShrink: 0, borderRadius: '9px',
        background: v.bg, color: v.fg, border: '1px solid var(--border)',
        fontSize: 'var(--text-sm)', fontWeight: 700, lineHeight: 1,
      }}
    >
      {v.mark}
    </span>
  )
}

function Row({ r }: { r: Rshe2026Requirement }) {
  const v = VERDICT[r.verdict]
  return (
    <li
      className="gc-avoid-break"
      style={{
        display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
        padding: 'var(--space-3) 0', borderTop: '1px solid var(--border)',
      }}
    >
      <Mark verdict={r.verdict} />
      <div style={{ minWidth: 0, flex: '1 1 auto' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '5px' }}>
          <span style={{ ...mono, color: v.fg }}>{v.label}</span>
          <span style={{ ...mono, color: 'var(--ink-light)', letterSpacing: '0.08em' }}>{r.id}</span>
        </div>

        {/* Verbatim from the guidance. Its hyphens are the document's own and
            are deliberately left alone: editing a quotation to satisfy a house
            style rule would break the audit trail. */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 1.6,
          color: 'var(--ink)', margin: '0 0 8px',
        }}>
          {r.text}
        </p>

        {r.modules.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: r.note ? '8px' : 0 }}>
            {r.modules.map(id => (
              <span key={id} style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
                padding: '4px 11px', borderRadius: 'var(--radius-pill)', lineHeight: 1.5,
                border: '1px solid var(--border)', background: '#fff', color: 'var(--ink-soft)',
              }}>
                {positionCode(id)} {TITLE_OF.get(id) ?? id}
              </span>
            ))}
          </div>
        )}

        {r.note && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.55,
            color: 'var(--ink-muted)', margin: 0,
          }}>
            {r.verdict === 'BY_DESIGN' ? 'Where it belongs: ' : 'Still to do: '}{r.note}
          </p>
        )}

        {r.kcsie && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 1.5,
            color: 'var(--ink-light)', margin: '8px 0 0',
          }}>
            KCSIE 2026 {r.kcsie}
          </p>
        )}
      </div>
    </li>
  )
}

function Count({ n, label, verdict }: { n: number; label: string; verdict: Rshe2026Verdict }) {
  const v = VERDICT[verdict]
  return (
    <div style={{
      flex: '1 1 130px', background: v.bg, border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)', padding: 'var(--space-3) var(--space-4)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
        color: v.fg, lineHeight: 1,
      }}>
        {n}
      </div>
      <div style={{ ...mono, marginTop: '6px', color: 'var(--ink-soft)' }}>{label}</div>
    </div>
  )
}

export default function RequirementList() {
  // Grouped in the guidance's own order: primary before secondary, and inside
  // each phase the strands in the order the document prints them. Nothing is
  // sorted by how well we do, because a page that led with its best column
  // would be doing the thing this page exists to stop.
  const groups: { key: string; phase: string; block: string; strand: string; rows: Rshe2026Requirement[] }[] = []
  for (const r of RSHE_2026) {
    const key = `${r.phase}|${r.block}|${r.strand}`
    let g = groups.find(x => x.key === key)
    if (!g) { g = { key, phase: r.phase, block: r.block, strand: r.strand, rows: [] }; groups.push(g) }
    g.rows.push(r)
  }

  return (
    <section style={{ marginBottom: '34px' }}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        <Count n={RSHE_2026_COUNTS.full} label="Taught" verdict="FULL" />
        <Count n={RSHE_2026_COUNTS.partial} label="In progress" verdict="PARTIAL" />
        <Count n={RSHE_2026_COUNTS.gap} label="Not covered" verdict="GAP" />
        <Count n={RSHE_2026_COUNTS.byDesign} label="Your scheme" verdict="BY_DESIGN" />
      </div>

      {groups.map(g => (
        <div key={g.key} style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ ...mono, marginBottom: '2px' }}>
            {g.phase === 'primary' ? 'Primary' : 'Secondary'} · {g.block}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
            color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 4px',
          }}>
            {g.strand}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {g.rows.map(r => <Row key={r.id} r={r} />)}
          </ul>
        </div>
      ))}
    </section>
  )
}
