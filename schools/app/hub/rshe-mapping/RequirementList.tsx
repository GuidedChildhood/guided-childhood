'use client'

import { useEffect, useMemo, useState } from 'react'
import { RSHE_2026, type Rshe2026Requirement, type Rshe2026Verdict } from '@gc/shared/schools-rshe-2026'
import { CURRICULUM, positionCode } from '@gc/shared/schools-curriculum'

// THE REQUIREMENTS, ONE BY ONE, WITH THE GAPS IN THE SAME LIST.
//
// This replaced a 25 by 10 grid of ticks (19 September 2026). The grid looked
// like coverage and was not: its ten columns were themes someone wrote, and the
// guidance has twenty eight strands and one hundred and ninety five numbered
// items. So the page prints the requirement itself, in the guidance's own
// words, and says what we do about it. Four answers, and one of them is no.
//
//   TAUGHT        a named module teaches it, and the guard holds the module to
//                 phrases that must appear in its slides
//   IN PROGRESS   part of it is taught and a named clause is still missing
//   NOT COVERED   we do not teach it, and here is what it is
//   YOUR SCHEME   it belongs to your wider RSE, with what we teach towards it
//
// MADE FINDABLE (17 November 2026). Justin asked for the page to be obvious to
// a teacher arriving from the schools email. A primary teacher does not want
// to scroll past the secondary strands to find theirs, so the two phases are a
// segmented control, there is a search box, and each strand is a jump link.
// The status filter appears only when some requirement is not taught, because
// a filter whose every other option is empty is noise. Printing shows both
// phases and every row, whatever is selected on screen.
//
// Nothing is sorted by how well we do: the guidance's own order, always.

const VERDICT: Record<Rshe2026Verdict, { label: string; mark: string; fg: string; bg: string }> = {
  FULL:      { label: 'Taught',      mark: '✓', fg: 'var(--white)',            bg: 'var(--retro-green)' },
  PARTIAL:   { label: 'In progress', mark: '◐', fg: 'var(--terracotta-dark)', bg: 'var(--terracotta-lt)' },
  GAP:       { label: 'Not covered', mark: '○', fg: 'var(--ink-soft)',        bg: 'var(--white)' },
  BY_DESIGN: { label: 'Your scheme', mark: '→', fg: 'var(--ink-muted)',       bg: 'var(--cream)' },
}

const TITLE_OF = new Map(CURRICULUM.map(m => [m.moduleId, m.title]))
const KS_OF = new Map(CURRICULUM.map(m => [m.moduleId, m.keyStage]))

type Phase = 'primary' | 'secondary'
const PHASES: { key: Phase; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
]

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/ /g, '_')
}

function Row({ r }: { r: Rshe2026Requirement }) {
  const v = VERDICT[r.verdict]
  return (
    <li className="gc-req gc-avoid-break">
      <span aria-hidden className="gc-req-mark" style={{ background: v.bg, color: v.fg }}>{v.mark}</span>
      <div style={{ minWidth: 0, flex: '1 1 auto' }}>
        {/* Verbatim from the guidance. Its hyphens are the document's own and
            are deliberately left alone: editing a quotation to satisfy a house
            style rule would break the audit trail. */}
        <p className="gc-req-text">{r.text}</p>

        <div className="gc-req-meta">
          <span className="gc-sr">{v.label}.</span>
          {r.modules.length > 0 && <span className="gc-req-label">Taught in</span>}
          {r.modules.map(id => (
            <a key={id} href={`/curriculum#${(KS_OF.get(id) ?? '').toLowerCase()}`} className="gc-lesson-chip">
              {positionCode(id)} · {TITLE_OF.get(id) ?? id}
            </a>
          ))}
        </div>

        {r.note && (
          <p className="gc-req-note">
            {r.verdict === 'BY_DESIGN' ? 'Where it belongs: ' : 'Still to do: '}{r.note}
          </p>
        )}

        <p className="gc-req-ref">
          Guidance ref {r.id}{r.kcsie ? ` · KCSIE 2026 ${r.kcsie}` : ''}
        </p>
      </div>
    </li>
  )
}

export default function RequirementList() {
  const [phase, setPhase] = useState<Phase>('primary')
  const [query, setQuery] = useState('')
  const [onlyOpen, setOnlyOpen] = useState(false)

  // Printing opens every fold on the page, so the copy in the inspection file
  // carries the KCSIE table and the lesson hooks as well as the list.
  useEffect(() => {
    const open = () => document.querySelectorAll('details').forEach(d => { d.open = true })
    window.addEventListener('beforeprint', open)
    return () => window.removeEventListener('beforeprint', open)
  }, [])

  const anyOpen = RSHE_2026.some(r => r.verdict !== 'FULL')
  const q = query.trim().toLowerCase()

  const groupsFor = useMemo(() => (p: Phase) => {
    const groups: { key: string; block: string; strand: string; rows: Rshe2026Requirement[] }[] = []
    for (const r of RSHE_2026) {
      if (r.phase !== p) continue
      const key = `${r.block}|${r.strand}`
      let g = groups.find(x => x.key === key)
      if (!g) { g = { key, block: r.block, strand: r.strand, rows: [] }; groups.push(g) }
      g.rows.push(r)
    }
    return groups
  }, [])

  const matches = (r: Rshe2026Requirement) =>
    (!onlyOpen || r.verdict !== 'FULL') &&
    (!q || r.text.toLowerCase().includes(q) || r.strand.toLowerCase().includes(q) ||
      r.modules.some(id => (TITLE_OF.get(id) ?? '').toLowerCase().includes(q)))

  const count = (p: Phase) => RSHE_2026.filter(r => r.phase === p).length

  return (
    <section id="requirements" aria-labelledby="req-title" style={{ marginBottom: 'var(--space-6)', scrollMarginTop: '80px' }}>
      <style>{`
        .gc-seg { display: inline-flex; padding: var(--space-1); gap: var(--space-1); background: var(--cream); border: 1px solid var(--border); border-radius: var(--radius-pill); }
        .gc-seg button { font-family: var(--font-body); font-size: var(--text-base); font-weight: 700; color: var(--ink-soft); background: transparent; border: 0; border-radius: var(--radius-pill); padding: var(--space-2) var(--space-4); min-height: 44px; cursor: pointer; }
        .gc-seg button[aria-pressed="true"] { background: var(--white); color: var(--ink); box-shadow: 0 1px 3px rgba(26,26,46,0.12); }
        .gc-seg button:focus-visible, .gc-search:focus-visible, .gc-jump a:focus-visible, .gc-lesson-chip:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-seg-n { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--ink-muted); margin-left: var(--space-2); }
        .gc-search { width: 100%; font-family: var(--font-body); font-size: var(--text-base); color: var(--ink); background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-tile); padding: var(--space-3) var(--space-4); min-height: 48px; }
        .gc-jump { display: flex; gap: var(--space-2); flex-wrap: wrap; list-style: none; padding: 0; margin: 0; }
        .gc-jump a { display: inline-flex; align-items: center; min-height: 36px; font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600; color: var(--ink-soft); text-decoration: none; background: var(--cream); border-radius: var(--radius-pill); padding: var(--space-1) var(--space-3); }
        .gc-jump a:hover { color: var(--ink); background: var(--border); }
        .gc-strand { margin-top: var(--space-5); scroll-margin-top: 80px; }
        .gc-strand-eyebrow { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); }
        .gc-strand h3 { font-family: var(--font-display); font-weight: 900; font-size: var(--text-xl); color: var(--ink); letter-spacing: -0.01em; margin: var(--space-1) 0 var(--space-2); }
        .gc-req { display: flex; gap: var(--space-3); align-items: flex-start; padding: var(--space-4) 0; border-top: 1px solid var(--border); }
        .gc-req-mark { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; flex-shrink: 0; border-radius: var(--radius-pill); font-size: var(--text-sm); font-weight: 800; line-height: 1; margin-top: 2px; }
        .gc-req-text { font-family: var(--font-body); font-size: var(--text-md); line-height: 1.6; color: var(--ink); margin: 0 0 var(--space-2); }
        .gc-req-meta { display: flex; gap: var(--space-2); flex-wrap: wrap; align-items: center; }
        .gc-req-label { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); }
        .gc-lesson-chip { display: inline-flex; align-items: center; min-height: 32px; font-family: var(--font-body); font-size: var(--text-sm); font-weight: 700; color: var(--retro-green-dark); text-decoration: none; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-pill); padding: var(--space-1) var(--space-3); }
        .gc-lesson-chip:hover { border-color: var(--retro-green); }
        .gc-req-note { font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.55; color: var(--ink-soft); margin: var(--space-2) 0 0; }
        .gc-req-ref { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--ink-light); margin: var(--space-2) 0 0; letter-spacing: 0.04em; }
        .gc-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        @media screen { .gc-phase[hidden] { display: none; } }
        @media print {
          .gc-req-controls { display: none !important; }
          .gc-phase[hidden] { display: block !important; }
          .gc-phase-title { display: block !important; }
          .gc-lesson-chip { border: 0; padding: 0; }
        }
      `}</style>

      <h2 id="req-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 var(--space-2)' }}>
        Find your requirement
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 var(--space-4)', maxWidth: '620px' }}>
        Each one is in the guidance&apos;s own words, with the lesson that teaches it.
      </p>

      <div className="gc-req-controls" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="gc-seg" role="group" aria-label="Phase">
            {PHASES.map(p => (
              <button key={p.key} type="button" aria-pressed={phase === p.key} onClick={() => setPhase(p.key)}>
                {p.label}<span className="gc-seg-n">{count(p.key)}</span>
              </button>
            ))}
          </div>
          {anyOpen && (
            <label style={{ display: 'inline-flex', gap: 'var(--space-2)', alignItems: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', minHeight: '44px' }}>
              <input type="checkbox" checked={onlyOpen} onChange={e => setOnlyOpen(e.target.checked)} />
              Only what is not fully taught
            </label>
          )}
        </div>
        <label>
          <span className="gc-sr">Search the requirements</span>
          <input
            className="gc-search"
            type="search"
            placeholder="Search, for example: privacy, gaming, deepfake"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
        {!q && (
          <ul className="gc-jump" aria-label="Jump to a strand">
            {groupsFor(phase).map(g => (
              <li key={g.key}><a href={`#${phase}_${slug(g.strand)}_${slug(g.block)}`}>{g.strand}</a></li>
            ))}
          </ul>
        )}
      </div>

      {PHASES.map(p => {
        const groups = groupsFor(p.key)
          .map(g => ({ ...g, shown: g.rows.filter(matches) }))
          .filter(g => g.shown.length > 0)
        return (
          <div key={p.key} className="gc-phase" hidden={phase !== p.key}>
            <h2 className="gc-phase-title" style={{ display: 'none', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', margin: 'var(--space-5) 0 0' }}>
              {p.label}
            </h2>
            {groups.length === 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', padding: 'var(--space-5) 0' }}>
                No {p.label.toLowerCase()} requirement matches &ldquo;{query}&rdquo;. Try a shorter word, or{' '}
                <button type="button" onClick={() => setQuery('')} style={{ font: 'inherit', color: 'var(--retro-green-dark)', fontWeight: 700, background: 'none', border: 0, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>
                  clear the search
                </button>.
              </p>
            )}
            {groups.map(g => (
              <div key={g.key} id={`${p.key}_${slug(g.strand)}_${slug(g.block)}`} className="gc-strand">
                <div className="gc-strand-eyebrow">{p.label} · {g.block}</div>
                <h3>{g.strand}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {g.shown.map(r => <Row key={r.id} r={r} />)}
                </ul>
              </div>
            ))}
          </div>
        )
      })}
    </section>
  )
}
