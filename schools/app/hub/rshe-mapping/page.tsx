import { Fragment } from 'react'
import { db as supabase } from '@/lib/supabase/server-db'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { CURRICULUM, KEY_STAGE_ORDER, positionCode, positionLabel, type KeyStage } from '@gc/shared/schools-curriculum'
import { RSHE_2026_COUNTS, RSHE_2026_SOURCE } from '@gc/shared/schools-rshe-2026'
import RequirementList from './RequirementList'
import { PAGE_SHELL } from '@gc/shared/page-scale'

export const metadata = { title: 'Statutory coverage, requirement by requirement' }

// THE RSHE 2025 MAPPING MATRIX: the document that survives the September 2026
// statutory switchover. Renders live from the curriculum manifest so it can
// never drift from what the modules actually teach.
//
// WHO READS IT AND WHAT THEY WANT. A PSHE lead opens this asking one question
// first: where are my gaps? An inspector opens it asking a second: show me
// where you teach X.
//
// Until 19 September 2026 neither question was answerable, because the page
// rendered a 25 by 10 grid of ticks against a list of ten themes someone had
// written, and the guidance has twenty eight strands and one hundred and
// ninety five numbered items. The grid could look like total coverage while
// nine requirements were not taught at all. A PSHE lead with the guidance open
// beside it would have found that in about ten minutes.
//
// The grid is gone. RequirementList prints each requirement in the guidance's
// own words and gives one of four answers, one of which is no. The data lives
// in shared/schools-rshe-2026.ts and scripts/check-rshe-coverage.mjs holds it
// to the live lessons, so this page cannot claim a lesson teaches something
// the slides do not say.

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
  background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
  padding: '22px 24px',
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
      borderRadius: 'var(--radius-pill)', lineHeight: 1.5,
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

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: PAGE_SHELL }}>
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
          Statutory coverage, requirement by requirement
        </h1>
        <p style={{ ...body, maxWidth: '640px', marginBottom: '6px' }}>
          The revised RSHE statutory guidance was published in July 2025 and comes into force on
          1 September 2026, a date confirmed by Keeping Children Safe in Education 2026, which calls it
          &ldquo;revised for introduction September 2026&rdquo; at paragraph 159. Below is every digital and
          online requirement it contains, in the guidance&rsquo;s own words, with what this scheme does
          about each one.
        </p>
        <p style={{ ...body, color: 'var(--ink-muted)', marginBottom: '24px', maxWidth: '640px' }}>
          Honesty note: a requirement is marked as taught only where a named module substantively teaches
          it, and every one of those claims is held to phrases that must appear in that module&rsquo;s slides.
          Where a requirement is part taught, the row names the clause still missing. Where it is not
          covered, the row says so. This scheme is a digital literacy and online safety programme designed
          to sit inside your wider PSHE provision, not to replace it.
        </p>
        <p style={{ ...mono, marginBottom: '24px', letterSpacing: '0.08em', textTransform: 'none' }}>
          Source: {RSHE_2026_SOURCE.title}, {RSHE_2026_SOURCE.publisher}, {RSHE_2026_SOURCE.published}
          {' '}· Coverage last reviewed {RSHE_2026_SOURCE.reviewed}
        </p>

        {/* THE REQUIREMENTS, ONE BY ONE.
            Was a 25 by 10 grid of ticks against a list of ten themes someone
            wrote. The guidance has twenty eight strands and one hundred and
            ninety five numbered items, so the grid could look like coverage
            without being it. This prints the requirement in the guidance's own
            words and gives one of four answers, one of which is no. The data
            and the counts come from shared/schools-rshe-2026.ts, which
            scripts/check-rshe-coverage.mjs holds to the live lessons. */}
        <section style={{ ...card, marginBottom: '26px' }} className="gc-avoid-break">
          <h2 style={h2}>What this scheme teaches, requirement by requirement</h2>
          <p style={{ ...body, color: 'var(--ink-soft)', marginBottom: '6px' }}>
            The {RSHE_2026_COUNTS.total} digital and online requirements of the statutory guidance, in its
            own words and its own order. {RSHE_2026_COUNTS.full} are taught, {RSHE_2026_COUNTS.partial} are
            part taught with the missing clause named, {RSHE_2026_COUNTS.gap} are not covered, and
            {' '}{RSHE_2026_COUNTS.byDesign} belong to your wider RSE rather than to a digital literacy spine.
          </p>
          <p style={{ ...body, color: 'var(--ink-muted)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
            The guidance as a whole runs to {RSHE_2026_SOURCE.itemsInGuidance} numbered items across
            {' '}{RSHE_2026_SOURCE.strandsInGuidance} strands. This scheme is the digital literacy and online
            safety spine and covers the online part of it, never all of it. Every row below was checked
            against the words that are really on the slides, not against a module title.
          </p>
        </section>

        <RequirementList />


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
          Keeping Children Safe in Education 2026 is in force from 1 September 2026. Its four areas of
          online risk are content, contact, conduct and commerce (paragraph 165), and generative AI,
          misinformation, disinformation and conspiracy theories are named inside them: contact now
          covers &ldquo;generative AI applications that simulate&rdquo; harmful interaction, and conduct now
          covers explicit images &ldquo;including those generated using AI&rdquo;. Deepfakes are named separately,
          in the definitions and at paragraph 160, which sets out what a preventative education
          programme will tackle.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: '34px' }}>
          {([
            { risk: 'Generative AI and AI chatbots', note: 'seeded in the early years, taught in full at KS3 and KS5', ns: [3, 9, 12, 20] },
            { risk: 'Deepfakes and AI generated images', note: 'real and made up from Reception, the full treatment at KS3', ns: [3, 12] },
            { risk: 'Misinformation and disinformation', note: 'foundations at KS1, taught substantively at KS3, applied to persuasion at KS4', ns: [3, 12, 15] },
            { risk: 'Conspiracy theories', note: 'not yet taught by name. The mechanism false things travel on is taught at KS3 and the communities that weaponise belief at KS4, and a conspiracy strand is being written into the KS3 module', ns: [12, 18] },
          ] as { risk: string; note: string; ns: number[] }[]).map(row => (
            <div key={row.risk} style={{ ...card, padding: '16px 18px' }} className="gc-avoid-break">
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                color: 'var(--ink)', margin: '0 0 8px',
              }}>
                {row.risk}
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: '8px' }}>
                {row.ns
                  .map(n => CURRICULUM.find(m => m.n === n))
                  .filter(Boolean)
                  .map(m => (
                    <Chip key={m!.moduleId}>{positionCode(m!.moduleId)} {m!.title}</Chip>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: '10px' }}>
          {modules.map(m => {
            const db = dbByModule.get(m.moduleId)
            const hooks: string[] = db?.statutory_hooks ?? []
            const strands: number[] = db?.efcw_strands ?? []
            return (
              <div key={m.moduleId} className="gc-avoid-break" style={{ padding: '11px 0', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'baseline', marginBottom: '7px', flexWrap: 'wrap' }}>
                  <span style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--ink-light)' }}>
                    {m.keyStage} · Lesson {positionLabel(m.moduleId)}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                    color: 'var(--ink)', lineHeight: 1.35,
                  }}>
                    {m.title}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {hooks.length > 0
                    ? hooks.map(h => <Chip key={h}>{h}</Chip>)
                    : <span style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
                        This module is not yet published.
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
