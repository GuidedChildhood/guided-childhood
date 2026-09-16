'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  clearProgress, lessonState, readProgress, PROGRESS_EVENT, TAUGHT_NO_DATE,
  type LessonShape, type Progress,
} from '@gc/shared/schools-progress'
import { readTaught, TAUGHT_EVENT } from '@gc/shared/schools-taught'

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
  n: number
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

function LessonRow({ row, progress, taught }: { row: Row; progress: Progress; taught: string[] }) {
  const s = lessonState(row.moduleId, row.shape, progress, taught)
  const done = s.complete
  const date = shortDate(s.completedAt)
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
          {row.n}. {row.title}
        </span>
        <span style={{ ...mono, display: 'block', fontSize: 10, color: 'var(--ink-muted)', marginTop: 2 }}>
          {row.keyStage}
          {done && date ? ` · taught ${date}` : ''}
          {!done && s.done > 0 ? ` · ${s.done} of ${s.total} done` : ''}
          {!done && s.done === 0 ? ' · not started' : ''}
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
  const complete = all.filter(r => lessonState(r.moduleId, r.shape, p, taught).complete).length
  const started = all.filter(r => lessonState(r.moduleId, r.shape, p, taught).done > 0).length

  const forget = () => {
    if (started === 0) return
    if (window.confirm('Forget what this screen has recorded about every lesson? The passports at home are not touched.')) clearProgress()
  }

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)' }}>{complete}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
          lesson{complete === 1 ? '' : 's'} complete, {started} started, out of {all.length}
        </span>
      </div>

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
