import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { CURRICULUM, positionCode } from '@gc/shared/schools-curriculum'
import { COMPUTING_POS, COMPUTING_POS_COUNTS, COMPUTING_POS_SOURCE, COMPUTING_KEY_STAGES, type ComputingStatement, type ComputingVerdict } from '@gc/shared/schools-computing-pos'
import { PAGE_SHELL } from '@gc/shared/page-scale'

export const metadata = { title: 'The computing curriculum, and what this scheme teaches of it' }

// THE COMPUTING MAP. The national curriculum for computing has a safety and
// digital literacy strand at every key stage, and a computing lead asked to
// buy this scheme will want to know which of those statements it evidences
// and which it does not. This page prints every statement of the programme
// of study's subject content, in its own words, and gives one of three
// answers, one of which is "your computing scheme". The data lives in
// shared/schools-computing-pos.ts and scripts/check-computing-coverage.mjs
// holds every taught claim to phrases that must be in the named lessons.
//
// Justin supplied the programme of study text on 20 September 2026; the
// map was written the same evening with every phrase checked on production.

const VERDICT: Record<ComputingVerdict, { label: string; mark: string; fg: string; bg: string }> = {
  FULL:        { label: 'Taught',               mark: '✓', fg: 'var(--green-dark)',      bg: 'var(--green-lt)' },
  PARTIAL:     { label: 'In progress',          mark: '◐', fg: 'var(--terracotta-dark)', bg: 'var(--terracotta-lt)' },
  YOUR_SCHEME: { label: 'Your computing scheme', mark: '→', fg: 'var(--ink-muted)',       bg: 'var(--butter-lt)' },
}

const KS_LABEL: Record<string, string> = { KS1: 'Key stage 1', KS2: 'Key stage 2', KS3: 'Key stage 3', KS4: 'Key stage 4' }

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
const card: React.CSSProperties = {
  background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
  padding: '22px 24px',
}

const TITLE_OF = new Map(CURRICULUM.map(m => [m.moduleId, m.title]))

function Mark({ verdict }: { verdict: ComputingVerdict }) {
  const v = VERDICT[verdict]
  return (
    <span aria-hidden style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '26px', height: '26px', flexShrink: 0, borderRadius: '9px',
      background: v.bg, color: v.fg, border: '1px solid var(--border)',
      fontSize: 'var(--text-sm)', fontWeight: 700, lineHeight: 1,
    }}>
      {v.mark}
    </span>
  )
}

function Row({ s }: { s: ComputingStatement }) {
  const v = VERDICT[s.verdict]
  return (
    <li className="gc-avoid-break" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', padding: 'var(--space-3) 0', borderTop: '1px solid var(--border)' }}>
      <Mark verdict={s.verdict} />
      <div style={{ minWidth: 0, flex: '1 1 auto' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '5px' }}>
          <span style={{ ...mono, color: v.fg }}>{v.label}</span>
          <span style={{ ...mono, color: 'var(--ink-light)', letterSpacing: '0.08em' }}>{s.id}</span>
        </div>
        {/* Verbatim from the programme of study, hyphens and bracketed
            examples included. Editing a quotation to satisfy a house style
            rule would break the audit trail. */}
        <p style={{ ...body, margin: '0 0 8px' }}>{s.text}</p>
        {s.modules.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: s.note ? '8px' : 0 }}>
            {s.modules.map(id => (
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
        {s.note && <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: 0 }}>{s.note}</p>}
      </div>
    </li>
  )
}

export default function ComputingMappingPage() {
  const c = COMPUTING_POS_COUNTS
  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: PAGE_SHELL }}>
      <style>{`@media print { .gc-avoid-break { break-inside: avoid; } }`}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>The computing curriculum · for the computing lead and the inspection file</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px', letterSpacing: '-0.02em' }}>
          The computing curriculum, and what this scheme teaches of it
        </h1>
        <p style={{ ...body, maxWidth: '640px', marginBottom: '6px' }}>
          The national curriculum for computing has a safety and digital literacy statement at every key
          stage, sitting beside the programming, networks and data statements that belong to a computing
          scheme. Below is every statement of its subject content, in the document&rsquo;s own words, with
          what this scheme does about each one.
        </p>
        <p style={{ ...body, color: 'var(--ink-muted)', marginBottom: '24px', maxWidth: '640px' }}>
          Honesty note: this is a digital literacy and online safety scheme, not a computing scheme. A
          statement is marked as taught only where a named lesson substantively teaches it, and every one of
          those claims is held to phrases that must appear in that lesson&rsquo;s slides. Where a statement is
          part taught, the row names the clause still missing. Everything else is your computing
          scheme&rsquo;s, and where one of our lessons touches it the row says so and claims no more.
        </p>
        <p style={{ ...mono, marginBottom: '24px', letterSpacing: '0.08em', textTransform: 'none' }}>
          Source: {COMPUTING_POS_SOURCE.title}, {COMPUTING_POS_SOURCE.publisher}, {COMPUTING_POS_SOURCE.published}
          {' '}· {COMPUTING_POS_SOURCE.supplied} · Coverage last reviewed {COMPUTING_POS_SOURCE.reviewed}
        </p>

        <section style={{ ...card, marginBottom: '26px' }} className="gc-avoid-break">
          <h2 style={h2}>The {c.total} statements, in one line</h2>
          <p style={{ ...body, color: 'var(--ink-soft)', marginBottom: '6px' }}>
            {c.full} are taught in full, {c.partial} are part taught with the missing clause named, and{' '}
            {c.yourScheme} belong to your computing scheme. The taught ones are the safety, respect,
            privacy, reporting and discernment statements: the strand a digital literacy scheme exists for.
          </p>
          <p style={{ ...body, color: 'var(--ink-muted)', marginBottom: 0, fontSize: 'var(--text-sm)' }}>
            The programme of study&rsquo;s purpose of study says computing &ldquo;also ensures that pupils become
            digitally literate&rdquo;, and its fourth aim is that all pupils &ldquo;are responsible, competent, confident
            and creative users of information and communication technology&rdquo;. That aim is the one this
            scheme serves. The document says schools are not required by law to teach the example content in
            square brackets.
          </p>
        </section>

        {COMPUTING_KEY_STAGES.map(ks => (
          <section key={ks} style={{ marginBottom: '30px' }}>
            <h2 style={{ ...h2, fontSize: 'var(--text-xl)', marginBottom: '2px' }}>{KS_LABEL[ks]}</h2>
            <p style={{ ...mono, marginBottom: '6px' }}>
              {ks === 'KS4' ? 'All pupils should be taught to' : 'Pupils should be taught to'}
            </p>
            {ks === 'KS4' && (
              <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '0 0 10px' }}>
                {COMPUTING_POS_SOURCE.ks4Preamble}
              </p>
            )}
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {COMPUTING_POS.filter(s => s.keyStage === ks).map(s => <Row key={s.id} s={s} />)}
            </ol>
          </section>
        ))}

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', maxWidth: '640px' }}>
          Every taught row above is checked by a guard in the build and by a query against the live lessons,
          so this page cannot claim a lesson teaches something its slides do not say. The statutory RSHE map,
          which is the scheme&rsquo;s main compliance document, is at{' '}
          <Link href="/hub/rshe-mapping" style={{ color: 'var(--ink)' }}>Statutory coverage, requirement by requirement</Link>.
        </p>
      </div>
    </main>
  )
}
