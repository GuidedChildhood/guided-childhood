'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  lessonState, markStep, readProgress, unmarkStep,
  PROGRESS_EVENT, TAUGHT_NO_DATE,
  type LessonShape, type Progress, type StepState,
} from '@gc/shared/schools-progress'
import { readTaught, TAUGHT_EVENT } from '@gc/shared/schools-taught'

// THE LESSON TRACKER PANEL.
//
// Justin, 16 September 2026, with a screenshot of Meta's "You're following
// best practices": like this, that auto ticks as they go.
//
// The anatomy is copied from that panel on purpose, because it is the right
// one: a filled green circle per row, a bold claim in the PAST TENSE stating
// the thing as done, a grey line underneath saying why it matters, and a
// heading that is a verdict about the teacher rather than a title.
//
// TWO PLACES IT DEPARTS FROM META, both deliberate.
//
// 1. ROWS THAT ARE NOT YET TRUE ARE SHOWN, not hidden. Meta omits what you
//    have not done; a teacher needs the list of what is left, so an undone
//    row sits in grey with an empty circle and keeps its running order.
// 2. TWO ROWS ARE THE TEACHER'S WORD. Meta never asks you to confirm
//    anything, which is exactly why its ticks are believable. We cannot see a
//    safeguarding lead being briefed or a note reaching a book bag, so those
//    two sit in their own block, drawn differently, and the panel says in one
//    line that they are a teacher's word rather than the product's.
//
// THE BIG TICK IS COMPUTED, never a button. It appears when every applicable
// row is green and goes again if one is untasked. A tick a teacher can award
// themselves proves nothing to a subject lead, which is the reason it exists.

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase',
}

const when = (at: string | null) =>
  !at || at === TAUGHT_NO_DATE ? null : new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function Tick({ done, faint }: { done: boolean; faint?: boolean }) {
  return (
    <span aria-hidden style={{
      width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: done ? 'var(--retro-green)' : '#fff',
      border: done ? '2px solid var(--retro-green)' : `2px solid ${faint ? 'var(--border)' : 'var(--ink-muted)'}`,
      color: '#fff', fontSize: 13, fontWeight: 900, lineHeight: 1,
    }}>{done ? '✓' : ''}</span>
  )
}

type StepAction = { href: string; label: string }

// THE ROW LEADS, AS WELL AS RECORDS (7 October 2026). A row still to do
// carries the tap that does it, under its grey line, and the first of them in
// running order is drawn as the button: the one next thing, the way a setup
// checklist (Shopify's, Cleo's) puts each step one tap from being done and
// makes the next one the obvious one. A done row keeps its date and loses the
// link, because there is nothing left to do there.
function Row({ step, onToggle, action, next }: { step: StepState; onToggle?: () => void; action?: StepAction; next?: boolean }) {
  const done = !!step.doneAt
  const date = when(step.doneAt)
  const inner = (
    <>
      <Tick done={done} faint={!onToggle} />
      <span style={{ minWidth: 0, textAlign: 'left' }}>
        <span style={{
          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'var(--text-base)', lineHeight: 1.3,
          color: done ? 'var(--ink)' : 'var(--ink-soft)',
        }}>
          {step.claim}{date ? <span style={{ ...mono, fontWeight: 600, fontSize: 10, color: 'var(--ink-muted)', marginLeft: 8, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{date}</span> : null}
        </span>
        <span style={{
          display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--ink-muted)', lineHeight: 1.45, marginTop: 2,
        }}>{step.why}</span>
      </span>
    </>
  )
  const frame: React.CSSProperties = {
    display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%',
    padding: '10px 0', minHeight: 44,
  }
  const head = onToggle
    ? <button type="button" onClick={onToggle} aria-pressed={done} style={{ ...frame, background: 'none', border: 'none', cursor: 'pointer' }}>{inner}</button>
    : <div style={frame}>{inner}</div>
  // Outside the toggle on purpose: a link inside a button is neither, to a
  // keyboard or a screen reader. Indented to sit under the words, not the tick.
  const doIt = !done && action
    ? next
      ? <Link href={action.href} className="btn" style={{ fontSize: 'var(--text-sm)', padding: '9px 18px', margin: '0 0 10px 36px' }}>{action.label} →</Link>
      : <Link href={action.href} style={{ display: 'inline-block', margin: '0 0 10px 36px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', lineHeight: 1.4 }}>{action.label} →</Link>
    : null
  return <div>{head}{doIt}</div>
}

export default function TrackerPanel({ moduleId, shape, runHref, actions, hubOpen = true }: {
  moduleId: string
  shape: LessonShape
  /** The fuller thing, at the foot, the way the pattern does it. */
  runHref?: string
  /** The tap that does each step (lib/tracker.ts trackerActions). */
  actions?: Partial<Record<StepState['id'], StepAction>>
  /** Whether this visitor can open the Hub's tracker. A free sample visitor
   *  with no code cannot, and a link to the code page is a dead end there. */
  hubOpen?: boolean
}) {
  // Read after mount so the server paint and the first client paint agree,
  // then follow both memories as they change.
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

  const state = lessonState(moduleId, shape, progress ?? {}, taught)
  // The one next thing: the first row in running order still to do that has
  // a tap to do it. Nothing is next until the memory has been read, so the
  // server paint never draws a button the browser then moves.
  const nextId = progress ? state.steps.find(s => !s.doneAt && actions?.[s.id])?.id : undefined
  const toggle = (id: StepState['id']) => {
    const s = state.steps.find(x => x.id === id)
    if (s?.doneAt) unmarkStep(moduleId, id); else markStep(moduleId, id)
  }

  return (
    // Never on the paper. The printed run sheet carries empty boxes for a
    // clipboard, and a panel of ticks from one browser is not what a teacher
    // wants photocopied.
    <section className="no-print" style={{
      background: '#fff', border: `2px solid ${state.complete ? 'var(--retro-green)' : 'var(--border)'}`,
      borderRadius: 20, padding: '20px 22px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ ...mono, color: state.complete ? 'var(--retro-green)' : 'var(--ink-muted)', marginBottom: 4 }}>
            {state.complete ? 'This lesson is done' : 'Getting ready'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
            color: 'var(--ink)', letterSpacing: '-0.01em', margin: 0, lineHeight: 1.2,
          }}>
            {state.complete ? 'You have taught this lesson' : 'You are getting ready to teach this'}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {state.complete
            ? <span aria-hidden style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--retro-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900 }}>✓</span>
            : <span style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{state.done} of {state.total}</span>}
        </div>
      </div>

      <div style={{ marginTop: 10, borderTop: '1px solid var(--border)' }}>
        {state.auto.map(s => <Row key={s.id} step={s} action={actions?.[s.id]} next={s.id === nextId} />)}
      </div>

      {state.yours.length > 0 && (
        <>
          <div style={{ ...mono, color: 'var(--ink-muted)', margin: '14px 0 0' }}>Yours to tick</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '4px 0 0' }}>
            {state.yours.length === 1 ? 'This one is' : 'These are'} your word rather than ours. We cannot see {state.yours.length === 1 ? 'it' : 'them'} happen, so {state.yours.length === 1 ? 'it does' : 'they do'} not tick {state.yours.length === 1 ? 'itself' : 'themselves'}.
          </p>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 6 }}>
            {state.yours.map(s => <Row key={s.id} step={s} onToggle={() => toggle(s.id)} action={actions?.[s.id]} next={s.id === nextId} />)}
          </div>
        </>
      )}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '14px 0 0' }}>
        Counted on this screen only, in this browser. It names no child and it is never sent anywhere,
        so a different laptop shows nothing and a shared classroom machine shows the last teacher&rsquo;s.
        {hubOpen ? <>{' '}<Link href="/hub/tracker" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Every lesson and its tick</Link>{runHref ? <>, or <Link href={runHref} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the run sheet for this one</Link></> : null}.</> : null}
        {!hubOpen && runHref ? <>{' '}<Link href={runHref} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>The run sheet for this one</Link>.</> : null}
      </p>
    </section>
  )
}
