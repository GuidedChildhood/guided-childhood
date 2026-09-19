'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  clearProgress, lessonState, readProgress, PROGRESS_EVENT, TAUGHT_NO_DATE,
  type LessonShape, type Progress,
} from '@gc/shared/schools-progress'
import { readTaught, TAUGHT_EVENT } from '@gc/shared/schools-taught'
import { RSHE_2026, requirementsFor, type Rshe2026Requirement } from '@gc/shared/schools-rshe-2026'

// THE ROLL UP: every lesson and its tick, on this screen.
//
// The pilot's two sit at the top under their own heading. Two green ticks are
// reachable in a term, and a pilot that feels finishable is the conversion
// argument; the rest of the scheme sits below as the full picture.
//
// PRINTS AS A COVERAGE SHEET, because the paper rule applies to records too.
// On screen it is a list a teacher scans; printed it is the subject lead's
// file and the inspection evidence, which is a selling point rather than a
// nicety. The dates are the ones the steps were recorded with.

export type Row = {
  moduleId: string
  // Where the lesson sits in its own key stage, which is the number on the
  // map and on the passport. The build number `n` is not shown here: this
  // list is read as a sequence and 09 followed by 23 followed by 25 is not
  // one (Justin, 18 September 2026).
  pos: number
  title: string
  keyStage: string
  shape: LessonShape
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}

const shortDate = (at: string | null) =>
  !at || at === TAUGHT_NO_DATE ? null : new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })

// THE STATUTORY HALF (19 September 2026).
//
// A tick used to mean a lesson was delivered and nothing more, which is a
// record of activity rather than of coverage. A deep dive does not ask how
// many lessons were taught. It asks which requirements were met, and until
// now the honest answer was on a different page that knew nothing about what
// this school had actually done.
//
// So each row now carries what it evidences, and the panel above counts it.
// The requirements come from shared/schools-rshe-2026.ts, which is the audited
// mapping, so a lesson can only claim what the audit found in its real slides.
// A requirement with no module against it is a gap and cannot be ticked into
// existence here: it simply never appears on any row.
//
// FULL ONLY, AND THE FIRST DRAFT OF THIS GOT IT WRONG. Counting every
// requirement that names a module gave 48, because PARTIAL and BY_DESIGN rows
// name modules too. Both would have been quiet overclaims of exactly the kind
// the audit was written to catch. PARTIAL means the lesson teaches SOME of the
// requirement, so a green tick does not evidence it. BY_DESIGN means the
// school's own scheme owns it and we deliberately do not. Neither belongs in a
// number a subject lead hands to an inspector, so the count is FULL and the
// mapping page carries the rest with its reasons.
const FULLY_TAUGHT = RSHE_2026.filter(r => r.verdict === 'FULL')
const CAN_EVIDENCE = FULLY_TAUGHT.length

/** What one lesson evidences outright, which is the only thing a tick proves. */
const fullFor = (moduleId: string) =>
  requirementsFor(moduleId).filter(r => r.verdict === 'FULL')

/** Every requirement any of these modules evidences, de duplicated. */
function evidencedBy(moduleIds: string[]): Rshe2026Requirement[] {
  const set = new Set(moduleIds)
  return FULLY_TAUGHT.filter(r => r.modules.some(m => set.has(m)))
}

function LessonRow({ row, progress, taught }: { row: Row; progress: Progress; taught: string[] }) {
  const s = lessonState(row.moduleId, row.shape, progress, taught)
  const done = s.complete
  const date = shortDate(s.completedAt)
  const reqs = fullFor(row.moduleId).length
  return (
    <Link
      href={`/lesson/${row.moduleId}/run`}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, minHeight: 56,
        padding: '10px 14px', textDecoration: 'none', color: 'var(--ink)',
        borderTop: '1px solid var(--border)', breakInside: 'avoid',
      }}
    >
      <span aria-hidden style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--retro-green)' : '#fff',
        border: `2px solid ${done ? 'var(--retro-green)' : 'var(--border)'}`,
        color: '#fff', fontSize: 14, fontWeight: 900,
      }}>{done ? '✓' : ''}</span>
      <span style={{ flex: '1 1 auto', minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.25 }}>
          {row.pos}. {row.title}
        </span>
        <span style={{ ...mono, display: 'block', fontSize: 10, color: 'var(--ink-muted)', marginTop: 2 }}>
          {row.keyStage}
          {done && date ? ` · taught ${date}` : ''}
          {!done && s.done > 0 ? ` · ${s.done} of ${s.total} done` : ''}
          {!done && s.done === 0 ? ' · not started' : ''}
          {reqs > 0 ? ` · ${done ? 'evidenced' : 'evidences'} ${reqs} statutory` : ''}
        </span>
      </span>
      <span aria-hidden style={{ ...mono, fontSize: 11, color: done ? 'var(--retro-green)' : 'var(--ink-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {done ? 'Done' : `${s.done}/${s.total}`}
      </span>
    </Link>
  )
}

function Block({ label, note, rows, progress, taught }: {
  label: string; note?: string; rows: Row[]; progress: Progress; taught: string[]
}) {
  if (rows.length === 0) return null
  const complete = rows.filter(r => lessonState(r.moduleId, r.shape, progress, taught).complete).length
  return (
    <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, marginBottom: 18, overflow: 'hidden' }}>
      <div style={{ padding: '16px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: 0 }}>{label}</h2>
          <span style={{ ...mono, color: complete === rows.length ? 'var(--retro-green)' : 'var(--ink-muted)' }}>
            {complete} of {rows.length} complete
          </span>
        </div>
        {note && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '6px 0 0' }}>{note}</p>}
      </div>
      {rows.map(r => <LessonRow key={r.moduleId} row={r} progress={progress} taught={taught} />)}
    </section>
  )
}

export default function HubTracker({ pilot, rest, pilotPhase }: {
  pilot: Row[]
  rest: Row[]
  pilotPhase: string | null
}) {
  const [progress, setProgress] = useState<Progress | null>(null)
  const [taught, setTaught] = useState<string[]>([])
  useEffect(() => {
    const sync = () => { setProgress(readProgress()); setTaught(readTaught()) }
    sync()
    window.addEventListener(PROGRESS_EVENT, sync)
    window.addEventListener(TAUGHT_EVENT, sync)
    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync)
      window.removeEventListener(TAUGHT_EVENT, sync)
    }
  }, [])
  const p = progress ?? {}
  const all = [...pilot, ...rest]
  const doneRows = all.filter(r => lessonState(r.moduleId, r.shape, p, taught).complete)
  const complete = doneRows.length
  const started = all.filter(r => lessonState(r.moduleId, r.shape, p, taught).done > 0).length
  const met = evidencedBy(doneRows.map(r => r.moduleId))
  const pct = CAN_EVIDENCE === 0 ? 0 : Math.round((met.length / CAN_EVIDENCE) * 100)
  // Only the TICKED lessons, so the appendix credits a requirement to the
  // lesson this school actually taught rather than to every lesson that could
  // have taught it.
  const titleById = new Map(doneRows.map(r => [r.moduleId, `${r.keyStage} ${r.pos}. ${r.title}`]))

  const forget = () => {
    if (started === 0) return
    if (window.confirm('Forget what this screen has recorded about every lesson? The passports at home are not touched.')) clearProgress()
  }

  return (
    <div>
      {/* The mirror of .no-print, which the page already defines. */}
      <style>{`.gc-print-only { display: none } @media print { .gc-print-only { display: block } }`}</style>

      <div className="no-print" style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)' }}>{complete}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
          lesson{complete === 1 ? '' : 's'} complete, {started} started, out of {all.length}
        </span>
      </div>

      {/* WHAT THE TICKS ADD UP TO IN THE ONLY CURRENCY A DEEP DIVE USES.
          Justin, 19 September 2026: wire the tracker to the requirements, so
          ticking a lesson shows what it evidenced. The count is deliberately
          against what the SCHEME can evidence rather than against all 57,
          because the difference between those two numbers is the honest part
          and it belongs on the mapping page with its reasons, not hidden
          inside a denominator here. */}
      <section className="gc-avoid-break" style={{
        background: '#fff', border: '1px solid var(--border)', borderLeft: '4px solid var(--green-dark)',
        borderRadius: 20, padding: 'var(--space-3) var(--space-4)', marginBottom: 18,
      }}>
        <div style={{ ...mono, color: 'var(--green-dark)', marginBottom: 6 }}>Statutory coverage</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)' }}>
            {met.length}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            of the {CAN_EVIDENCE} statutory requirements this scheme teaches in full are evidenced by the lessons you have ticked.
          </span>
        </div>
        <div aria-hidden style={{ height: 8, borderRadius: 999, background: 'var(--butter-lt)', marginTop: 12, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--retro-green)' }} />
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55, margin: '10px 0 0' }}>
          Nothing here is typed in. A requirement counts when a lesson that the audit found teaching it in full
          goes green on this screen. Partly covered requirements are not counted here and neither are the ones
          your own scheme owns. The mapping page has all {RSHE_2026.length}, which lesson covers each one, and
          what is still yours to teach.
        </p>
        <Link className="no-print" href="/hub/rshe-mapping" style={{ ...mono, color: 'var(--green-dark)', textDecoration: 'none', display: 'inline-block', marginTop: 10 }}>
          See the full mapping →
        </Link>
      </section>

      <Block
        label={pilotPhase ? 'Your pilot' : 'Start here'}
        note={pilot.length > 0
          ? 'The lessons your code opens. Two green ticks in a term is a finished pilot.'
          : undefined}
        rows={pilot} progress={p} taught={taught}
      />
      <Block
        label={pilot.length > 0 ? 'The rest of the scheme' : 'Every lesson'}
        note={pilot.length > 0 ? 'Open to read, and yours to teach the day the licence starts.' : undefined}
        rows={rest} progress={p} taught={taught}
      />

      {/* THE APPENDIX THAT MAKES THE PRINTOUT EVIDENCE RATHER THAN A LIST.
          On screen this would be forty paragraphs of statute nobody reads. On
          paper it is the thing a subject lead is actually asked for: the
          requirement in its own words, and the lesson that met it, with the
          lesson's own date already in the list above. It prints only what has
          genuinely been ticked, so an empty term prints nothing and cannot be
          mistaken for coverage. */}
      {met.length > 0 && (
        <section className="gc-print-only" style={{ marginTop: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px' }}>
            What these lessons evidenced
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            The {met.length} statutory requirements met by the lessons ticked above, in the wording of the
            guidance. Dates are in the list on the previous pages.
          </p>
          {met.map(r => (
            <div key={r.id} className="gc-avoid-break" style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
              <div style={{ ...mono, color: 'var(--green-dark)' }}>{r.id} · {r.strand}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.5, margin: '4px 0' }}>
                {r.text}
              </p>
              <div style={{ ...mono, color: 'var(--ink-muted)' }}>
                Taught in {r.modules.filter(m => titleById.has(m)).map(m => titleById.get(m)).join(', ')}
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginTop: 24 }}>
        <button type="button" onClick={forget} className="btn btn-outline" disabled={started === 0} style={{ fontSize: 'var(--text-base)' }}>
          Forget this screen&rsquo;s record
        </button>
        <span style={{ ...mono, color: 'var(--ink-muted)' }}>
          {started} of {all.length} lessons touched on this screen
        </span>
      </div>
    </div>
  )
}
