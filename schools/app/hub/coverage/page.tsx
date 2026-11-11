import Link from 'next/link'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import {
  academicYear, classesIn, cleanGroup, cleanYear, forClass, yearLabel, type Delivery,
} from '@gc/shared/lesson-records'
import { COMPUTING_POS, type ComputingKeyStage } from '@gc/shared/schools-computing-pos'
import { CURRICULUM } from '@gc/shared/schools-curriculum'
import { RSHE_2026, RSHE_2026_SOURCE } from '@gc/shared/schools-rshe-2026'
import PrintButton from '@/components/PrintButton'
import { readDeliveries, recordYears } from '@/lib/records'

// /hub/coverage: THE RECORD, AGAINST THE STATUTORY CONTENT (11 November 2026,
// the progression review, amendment 6; in the approved spec of 9 November).
//
// Two pages already existed and neither answered a subject lead's question.
// The mapping matrix says which lessons teach which requirement. Class
// progress says which lessons a class has had. The question is the join:
// "which of the requirements has Year 6 actually been taught this year?"
//
// So this page is that join and nothing else. Each requirement the scheme
// covers, the lessons that teach it (shared/schools-rshe-2026.ts and
// shared/schools-computing-pos.ts, the same data the matrix prints), and
// beside each lesson whether this school has recorded it as delivered, to
// whom and when (schools.lesson_records).
//
// WHAT IT NEVER SAYS.
//   - "Covered" or "met". A requirement with three lessons and one of them
//     delivered is STARTED, and reads that way. Only when every lesson mapped
//     to it has been delivered does it read as all delivered.
//   - Anything about pupils. Delivered is a fact about a lesson and a class.
//   - That an inspector needs it. It is a working document for the lead.
//
// Nothing is typed in here and nothing new is stored.

export const metadata = { title: 'Coverage against the statutory content' }
export const dynamic = 'force-dynamic'

type Phase = 'primary' | 'secondary'
const PHASE_STAGES: Record<Phase, string[]> = { primary: ['EYFS', 'KS1', 'KS2'], secondary: ['KS3', 'KS4', 'KS5'] }
const PHASE_COMPUTING: Record<Phase, ComputingKeyStage[]> = { primary: ['KS1', 'KS2'], secondary: ['KS3', 'KS4'] }

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const bodyText: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65 }
const smallText: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55 }
const panel: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)' }

const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const titleOf = new Map(CURRICULUM.map(m => [m.moduleId, m.title]))
const stageOf = new Map(CURRICULUM.map(m => [m.moduleId, m.keyStage as string]))

type Status = 'all' | 'started' | 'none'
const STATUS_LABEL: Record<Status, string> = { all: 'All its lessons delivered', started: 'Started', none: 'Not started' }

export default async function Coverage({ searchParams }: { searchParams: Promise<{ class?: string; year?: string; phase?: string }> }) {
  const sp = await searchParams
  const thisYear = academicYear(new Date())
  const years = await recordYears('digital', thisYear)
  const year = cleanYear(sp.year, years) ?? thisYear
  const { school, deliveries, failed } = await readDeliveries('digital', year)
  const classes = classesIn(deliveries)
  const asked = cleanGroup(sp.class)
  const group = asked && classes.includes(asked) ? asked : null
  const rows = forClass(deliveries, group)

  // The first delivery of each lesson, and every class that has had it.
  const taught = new Map<string, { first: string; groups: string[] }>()
  for (const d of rows as Delivery[]) {
    const had = taught.get(d.lessonKey) ?? { first: d.deliveredOn, groups: [] }
    if (d.deliveredOn < had.first) had.first = d.deliveredOn
    for (const g of d.groups) if (!had.groups.includes(g)) had.groups.push(g)
    taught.set(d.lessonKey, had)
  }

  // Which phase to open on: the one asked for, or the one the record is in.
  const inSecondary = [...taught.keys()].some(k => PHASE_STAGES.secondary.includes(stageOf.get(k) ?? ''))
  const inPrimary = [...taught.keys()].some(k => PHASE_STAGES.primary.includes(stageOf.get(k) ?? ''))
  const phase: Phase = sp.phase === 'secondary' || sp.phase === 'primary' ? sp.phase : inSecondary && !inPrimary ? 'secondary' : 'primary'

  const statusOf = (modules: string[]): Status => {
    const done = modules.filter(m => taught.has(m)).length
    return done === 0 ? 'none' : done === modules.length ? 'all' : 'started'
  }
  const rshe = RSHE_2026.filter(r => r.phase === phase && r.modules.length > 0)
  const computing = COMPUTING_POS.filter(c => PHASE_COMPUTING[phase].includes(c.keyStage) && c.modules.length > 0)
  const yours = COMPUTING_POS.filter(c => PHASE_COMPUTING[phase].includes(c.keyStage) && c.modules.length === 0).length
  const count = (list: { modules: string[] }[]) => ({
    all: list.filter(r => statusOf(r.modules) === 'all').length,
    started: list.filter(r => statusOf(r.modules) === 'started').length,
    none: list.filter(r => statusOf(r.modules) === 'none').length,
  })
  const rsheCount = count(rshe)
  const strands = [...new Set(rshe.map(r => r.strand))]

  const here = (to: { class?: string; phase?: Phase; year?: string }) => {
    const q = new URLSearchParams()
    const c = to.class ?? group ?? ''
    const y = to.year ?? year
    q.set('phase', to.phase ?? phase)
    if (c) q.set('class', c)
    if (y !== thisYear) q.set('year', y)
    return `/hub/coverage?${q.toString()}`
  }
  const chip = (on: boolean): React.CSSProperties => ({
    ...mono, display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 var(--space-3)',
    borderRadius: 'var(--radius-tile)', textDecoration: 'none',
    border: `1.5px solid ${on ? 'var(--green-dark)' : 'var(--border)'}`,
    background: on ? 'var(--butter-lt)' : 'var(--white)', color: on ? 'var(--ink)' : 'var(--ink-muted)',
  })

  const Lessons = ({ modules }: { modules: string[] }) => (
    <ul className="gc-cov-lessons">
      {modules.map(m => {
        const t = taught.get(m)
        return (
          <li key={m} data-on={t ? '' : undefined}>
            <span aria-hidden className="gc-cov-dot">{t ? '✓' : ''}</span>
            <span>
              <Link href={`/lesson/${m}`}>{titleOf.get(m) ?? m}</Link>
              <small>{t ? `Delivered ${shortDate(t.first)}${group ? '' : ` to ${t.groups.join(', ')}`}` : 'Not delivered yet'}</small>
            </span>
          </li>
        )
      })}
    </ul>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <style>{`@media print { @page { size: A4 portrait; margin: 12mm; } body { background: var(--white) !important; } .no-print { display: none !important; } }`}</style>
      <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>← The Hub</Link>
          <PrintButton label="Print this page" />
        </div>

        <header>
          <div style={{ ...mono, color: 'var(--green-dark)', marginBottom: 'var(--space-1)' }}>Your school&apos;s record · {yearLabel(year)}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
            {group ? `What ${group} has been taught, against the statutory content` : 'What has been taught, against the statutory content'}
          </h1>
          <p style={{ ...bodyText, maxWidth: '680px', margin: 0 }}>
            Each requirement this scheme teaches, the lessons that teach it, and whether your school has recorded
            each lesson as delivered. It joins the mapping to the Mark lesson delivered button, so nothing is typed here.
          </p>
        </header>

        <nav aria-label="Phase" className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <Link href={here({ phase: 'primary' })} style={chip(phase === 'primary')} aria-current={phase === 'primary' ? 'true' : undefined}>Primary</Link>
          <Link href={here({ phase: 'secondary' })} style={chip(phase === 'secondary')} aria-current={phase === 'secondary' ? 'true' : undefined}>Secondary</Link>
          {years.length > 1 && years.map(y => (
            <Link key={y} href={here({ year: y, class: '' })} style={chip(year === y)} aria-current={year === y ? 'true' : undefined}>{yearLabel(y)}</Link>
          ))}
        </nav>
        {classes.length > 0 && (
          <nav aria-label="Class" className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Link href={`/hub/coverage?phase=${phase}${year !== thisYear ? `&year=${year}` : ''}`} style={chip(!group)} aria-current={!group ? 'true' : undefined}>Every class</Link>
            {classes.map(c => <Link key={c} href={here({ class: c })} style={chip(group === c)} aria-current={group === c ? 'true' : undefined}>{c}</Link>)}
          </nav>
        )}

        {!school && <section style={panel}><p style={{ ...bodyText, margin: 0 }}>Your school&apos;s record opens with your school code.</p></section>}
        {failed && <section style={panel}><p style={{ ...bodyText, margin: 0, color: 'var(--ink)' }}>The record could not be read just now. Nothing is lost. Try again in a minute.</p></section>}

        {school && !failed && (
          <section aria-label="Summary" style={panel}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
              A lesson delivered for {rsheCount.all + rsheCount.started} of the {rshe.length} {phase} requirements
            </h2>
            <div className="gc-cov-sum">
              <div><b>{rsheCount.all}</b><span>all their lessons delivered</span></div>
              <div><b>{rsheCount.started}</b><span>started: some of their lessons delivered</span></div>
              <div><b>{rsheCount.none}</b><span>not started this year</span></div>
            </div>
            <p style={{ ...smallText, margin: 'var(--space-3) 0 0' }}>
              A requirement is often taught across more than one lesson and more than one year, so not started this
              year is not a gap in the scheme. The <Link href="/hub/progression" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>progression map</Link> shows
              which year each lesson is suggested for.
            </p>
          </section>
        )}

        {school && !failed && strands.map(strand => (
          <section key={strand} aria-label={strand}>
            <h2 style={{ ...mono, margin: '0 0 var(--space-2)' }}>RSHE · {strand}</h2>
            <div className="gc-cov-list">
              {rshe.filter(r => r.strand === strand).map(r => {
                const st = statusOf(r.modules)
                return (
                  <article key={r.id} className="gc-cov-row">
                    <div>
                      <p className="gc-cov-text">{r.text}</p>
                      <span className="gc-cov-st" data-st={st}>{STATUS_LABEL[st]}</span>
                    </div>
                    <Lessons modules={r.modules} />
                  </article>
                )
              })}
            </div>
          </section>
        ))}

        {school && !failed && computing.length > 0 && (
          <section aria-label="Computing">
            <h2 style={{ ...mono, margin: '0 0 var(--space-2)' }}>Computing · the statements this scheme teaches</h2>
            <div className="gc-cov-list">
              {computing.map(c => {
                const st = statusOf(c.modules)
                return (
                  <article key={c.id} className="gc-cov-row">
                    <div>
                      <p className="gc-cov-text"><b>{c.keyStage}.</b> {c.text}</p>
                      <span className="gc-cov-st" data-st={st}>{STATUS_LABEL[st]}</span>
                    </div>
                    <Lessons modules={c.modules} />
                  </article>
                )
              })}
            </div>
            <p style={{ ...smallText, margin: 'var(--space-2) 0 0' }}>
              {yours} other computing statements at this phase belong to your computing scheme and are not taught here.
              They are listed on <Link href="/hub/computing-mapping" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the computing curriculum map</Link>.
            </p>
          </section>
        )}

        <p style={{ ...smallText, margin: 0 }}>
          The requirements are quoted from {RSHE_2026_SOURCE.title} ({RSHE_2026_SOURCE.publisher}, {RSHE_2026_SOURCE.published}),
          in force from {RSHE_2026_SOURCE.inForce}. Which lesson teaches which requirement is on{' '}
          <Link href="/hub/rshe-mapping" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the mapping matrix</Link>.
          This page records lessons delivered to a class. It is a working document for your subject lead. It does not
          measure what any pupil learned, and no pupil is named.
        </p>
      </div>

      <style>{`
        .gc-cov-sum { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); }
        .gc-cov-sum > div { background: var(--cream); border: 1px solid var(--border); border-radius: var(--radius-tile); padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-1); }
        .gc-cov-sum b { font-family: var(--font-display); font-weight: 900; font-size: var(--text-2xl); color: var(--ink); line-height: 1.1; }
        .gc-cov-sum span { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); line-height: 1.45; }
        .gc-cov-list { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; }
        .gc-cov-row { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: var(--space-4); padding: var(--space-3) var(--space-4); }
        .gc-cov-row + .gc-cov-row { border-top: 1px solid var(--border); }
        .gc-cov-text { margin: 0 0 var(--space-2); font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); line-height: 1.55; }
        .gc-cov-st { display: inline-block; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: var(--space-1) var(--space-2); border-radius: var(--radius-tile); border: 1px solid var(--border); color: var(--ink); }
        .gc-cov-st[data-st="all"] { background: var(--terracotta); border-color: var(--terracotta); }
        .gc-cov-st[data-st="started"] { background: var(--butter-lt); }
        .gc-cov-st[data-st="none"] { color: var(--ink-muted); border-style: dashed; }
        .gc-cov-lessons { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2); }
        .gc-cov-lessons li { display: flex; gap: var(--space-2); align-items: flex-start; }
        .gc-cov-dot { flex: none; width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--warm); display: inline-flex; align-items: center; justify-content: center; font-weight: 900; font-size: var(--text-xs); color: var(--white); }
        .gc-cov-lessons li[data-on] .gc-cov-dot { background: var(--green-dark); border-color: var(--green-dark); }
        .gc-cov-lessons a { font-family: var(--font-display); font-weight: 800; font-size: var(--text-sm); color: var(--ink); text-decoration: none; line-height: 1.3; }
        .gc-cov-lessons a:hover, .gc-cov-lessons a:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
        .gc-cov-lessons a:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-cov-lessons small { display: block; font-family: var(--font-body); font-size: var(--text-xs); color: var(--ink-muted); line-height: 1.45; }
        @media (max-width: 720px) { .gc-cov-row { grid-template-columns: minmax(0, 1fr); gap: var(--space-2); } .gc-cov-sum { grid-template-columns: minmax(0, 1fr); } }
        @media print { .gc-cov-row { break-inside: avoid; } .gc-cov-st, .gc-cov-dot { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      `}</style>
    </main>
  )
}
