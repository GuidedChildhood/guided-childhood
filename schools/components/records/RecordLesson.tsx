'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import {
  canUndo, cleanGroups, JUDGEMENT_LABEL, JUDGEMENTS, levelsIn, shareAtFourOrAbove,
  type Delivery, type Descriptors, type Judgement, type LevelCount, type Subject,
} from '@gc/shared/lesson-records'
import { assessDelivery, lessonRecord, markDelivered, undoDelivery } from '@/app/records/actions'

// MARK LESSON DELIVERED: the one button, and what it asks afterwards
// (10 November 2026, plans/2026-11-10-lesson-run-and-records-plan.md).
//
// ONE TAP when the class is remembered. The class is the only thing asked,
// because it is the only thing the system cannot know, and it is remembered
// on this device so the second lesson of the day is a single tap.
//
// DELIVERED IS NEVER ASSESSED. The button records that the lesson was taught.
// What comes after is optional and says so: for French, how many pupils are at
// each level for the statements this lesson assesses; for the digital lessons,
// the teacher's judgement of the class. Skipping it leaves the record reading
// "not assessed", never a score.
//
// NOTHING HERE NAMES A SCHOOL. The actions read it from the signed cookie.
// This component only ever sends a lesson, a class and a count.
//
// The page it sits on is static, so it asks for this lesson's record when it
// appears and holds it in state; nothing about a school is baked into a page.

export type LevelStatement = { code: string; skill: string; pupil: string }

type Props = {
  subject: Subject
  lessonKey: string
  /** French: the statements to count pupils against after this lesson. */
  statements?: LevelStatement[]
  /** The three levels, in order, by the short name the scheme uses. */
  levelNames?: [string, string, string]
  /** One line saying what the three levels are, shown once under the question. */
  levelKey?: string
  /** Digital: the lesson's "I can" statements. */
  objectives?: string[]
  /** Digital: what each judgement looks like in THIS lesson, one line each,
   *  from the lesson row. Absent, the buttons stand alone as they always have. */
  descriptors?: Descriptors | null
  /** Where the whole record lives, for the link under a saved lesson. */
  recordHref?: string
}

const CLASS_KEY = (s: Subject) => `gc_records_class_${s}`

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

export default function RecordLesson({ subject, lessonKey, statements = [], levelNames = ['Level 3', 'Level 4', 'Level 5'], levelKey, objectives = [], descriptors = null, recordHref }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [school, setSchool] = useState(true)
  const [failed, setFailed] = useState(false)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [klass, setKlass] = useState('')
  const [editingClass, setEditingClass] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [day, setDay] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const [pending, start] = useTransition()

  const load = useCallback(async () => {
    try {
      const r = await lessonRecord({ subject, lessonKey })
      setSchool(r.school); setFailed(r.failed); setDeliveries(r.deliveries)
    } catch { setFailed(true) }
    setLoaded(true)
  }, [subject, lessonKey])

  useEffect(() => {
    let remembered = ''
    try { remembered = window.localStorage.getItem(CLASS_KEY(subject)) ?? '' } catch { /* private window */ }
    setKlass(remembered)
    setEditingClass(!remembered)
    void load()
  }, [subject, load])

  // The undo link is offered for ten minutes, so the clock has to move.
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(t)
  }, [])

  const groups = useMemo(() => cleanGroups(klass), [klass])
  // The record this screen is looking at: the one just made, or this class's
  // latest for the lesson.
  const current = useMemo(() => {
    if (currentId) return deliveries.find(d => d.id === currentId) ?? null
    if (!groups) return null
    const mine = deliveries.filter(d => groups.every(g => d.groups.includes(g)))
    return mine[mine.length - 1] ?? null
  }, [currentId, deliveries, groups])
  const others = deliveries.filter(d => d.id !== current?.id)

  const remember = (value: string) => {
    try { window.localStorage.setItem(CLASS_KEY(subject), value) } catch { /* private window */ }
  }

  const mark = () => {
    setError(''); setSaved('')
    if (!groups) { setEditingClass(true); setError('Add the class first, such as 4B or Maple.'); return }
    start(async () => {
      const r = await markDelivered({ subject, lessonKey, groups, deliveredOn: day || undefined }).catch(() => null)
      if (!r) { setError('That did not go through. Check the connection and press again.'); return }
      if (!r.ok) { setError(r.error); return }
      remember(groups.join(', '))
      setKlass(groups.join(', '))
      setEditingClass(false)
      setDeliveries(ds => [...ds.filter(d => d.id !== r.delivery.id), r.delivery])
      setCurrentId(r.delivery.id)
    })
  }

  const undo = () => {
    if (!current) return
    setError(''); setSaved('')
    start(async () => {
      const r = await undoDelivery({ subject, id: current.id }).catch(() => null)
      if (!r) { setError('That did not go through. The record is still there.'); return }
      if (!r.ok) { setError(r.error); return }
      setDeliveries(ds => ds.filter(d => d.id !== current.id))
      setCurrentId(null)
    })
  }

  const assess = (payload: { judgement?: string; objectiveMarks?: unknown; levels?: unknown; note?: string }, done: string) => {
    if (!current) return
    setError(''); setSaved('')
    start(async () => {
      const r = await assessDelivery({ subject, id: current.id, ...payload }).catch(() => null)
      if (!r) { setError('That did not go through. Check the connection and press again.'); return }
      if (!r.ok) { setError(r.error); return }
      setDeliveries(ds => ds.map(d => (d.id === r.delivery.id ? r.delivery : d)))
      setSaved(done)
    })
  }

  if (!loaded) {
    return <div className="gc-rec"><p className="gc-rec-quiet" aria-live="polite">Checking your school&apos;s record.</p><RecordStyles /></div>
  }
  if (!school) {
    return (
      <div className="gc-rec">
        <p className="gc-rec-quiet">Recording a lesson needs your school code, so the record is saved for your school and nobody else.</p>
        <RecordStyles />
      </div>
    )
  }

  return (
    <div className="gc-rec">
      {failed && <p className="gc-rec-error" role="alert">Your school&apos;s record could not be read just now. You can still mark this lesson; nothing is lost.</p>}

      {!current ? (
        <>
          <div className="gc-rec-class">
            {editingClass ? (
              <label className="gc-rec-field">
                <span className="gc-rec-label">Which class?</span>
                <input
                  value={klass}
                  onChange={e => setKlass(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); mark() } }}
                  placeholder="4B"
                  maxLength={80}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="gc-rec-class-help"
                />
                <span id="gc-rec-class-help" className="gc-rec-help">A class name, never a person&apos;s name. For two classes together, put a comma between them.</span>
              </label>
            ) : (
              <p className="gc-rec-quiet" style={{ margin: 0 }}>
                Class <b>{groups?.join(', ')}</b>{' '}
                <button type="button" className="gc-rec-link" onClick={() => setEditingClass(true)}>Change</button>
              </p>
            )}
          </div>
          <button type="button" className="btn btn-gold gc-rec-main" onClick={mark} disabled={pending}>
            {pending ? 'Saving' : 'Mark lesson delivered'}
          </button>
          <details className="gc-rec-more">
            <summary>Taught it on another day?</summary>
            <label className="gc-rec-field">
              <span className="gc-rec-label">The day it was taught</span>
              <input type="date" value={day} max={new Date(now).toISOString().slice(0, 10)} onChange={e => setDay(e.target.value)} />
              <span className="gc-rec-help">Leave it empty for today.</span>
            </label>
          </details>
        </>
      ) : (
        <>
          <div className="gc-rec-done" role="status">
            <span aria-hidden className="gc-rec-tick">✓</span>
            <span>
              <b>Delivered to {current.groups.join(', ')}</b> on {longDate(current.deliveredOn)}. Saved for your school.
              {canUndo(current.createdAt, new Date(now)) && (
                <> <button type="button" className="gc-rec-link" onClick={undo} disabled={pending}>Undo</button></>
              )}
            </span>
          </div>

          {subject === 'fr' && statements.length > 0 && (
            <Levels key={current.id} statements={statements} levelNames={levelNames} levelKey={levelKey} delivery={current} pending={pending}
              onSave={levels => assess({ levels }, 'Levels saved.')} />
          )}
          {subject === 'fr' && statements.length === 0 && (
            <p className="gc-rec-quiet">Nothing to assess in this lesson. That is the whole record.</p>
          )}
          {subject === 'digital' && (
            <Judge key={current.id} objectives={objectives} descriptors={descriptors} delivery={current} pending={pending}
              onSave={(judgement, objectiveMarks, note) => assess({ judgement, objectiveMarks, note }, 'Saved.')} />
          )}

          {saved && <p className="gc-rec-saved" role="status">{saved}</p>}
          <p className="gc-rec-quiet" style={{ margin: 0 }}>
            <button type="button" className="gc-rec-link" onClick={() => { setCurrentId(null); setKlass(''); setEditingClass(true); setSaved('') }}>Record another class</button>
            {recordHref && <> · <a className="gc-rec-link" href={recordHref}>See the whole record</a></>}
          </p>
        </>
      )}

      {error && <p className="gc-rec-error" role="alert">{error}</p>}

      {others.length > 0 && (
        <p className="gc-rec-quiet" style={{ margin: 0 }}>
          Also delivered this year: {others.map(d => `${d.groups.join(', ')} on ${longDate(d.deliveredOn)}`).join(' · ')}
        </p>
      )}
      <RecordStyles />
    </div>
  )
}

/** French: pupils at each level, for each statement this lesson assesses. */
function Levels({ statements, levelNames, levelKey, delivery, pending, onSave }: {
  statements: LevelStatement[]; levelNames: [string, string, string]; levelKey?: string; delivery: Delivery; pending: boolean
  onSave: (levels: Record<string, { s3: string; s4: string; s5: string }>) => void
}) {
  const [open, setOpen] = useState(delivery.assessment === 'levels')
  const [rows, setRows] = useState<Record<string, { s3: string; s4: string; s5: string }>>(() => {
    const out: Record<string, { s3: string; s4: string; s5: string }> = {}
    for (const s of statements) {
      const had = levelsIn(delivery.marks, s.code)
      out[s.code] = had ? { s3: String(had.s3), s4: String(had.s4), s5: String(had.s5) } : { s3: '', s4: '', s5: '' }
    }
    return out
  })
  const set = (code: string, k: 's3' | 's4' | 's5', v: string) =>
    setRows(r => ({ ...r, [code]: { ...r[code], [k]: v.replace(/\D/g, '').slice(0, 3) } }))
  const count = (r: { s3: string; s4: string; s5: string }): LevelCount => ({ s3: Number(r.s3 || 0), s4: Number(r.s4 || 0), s5: Number(r.s5 || 0) })
  const filled = (r: { s3: string; s4: string; s5: string }) => r.s3 !== '' || r.s4 !== '' || r.s5 !== ''
  const send = () => {
    const out: Record<string, { s3: string; s4: string; s5: string }> = {}
    for (const s of statements) if (filled(rows[s.code])) out[s.code] = { s3: rows[s.code].s3 || '0', s4: rows[s.code].s4 || '0', s5: rows[s.code].s5 || '0' }
    onSave(out)
  }

  if (!open) {
    return (
      <div className="gc-rec-next">
        <p className="gc-rec-ask">How did the class do? <span>Optional</span></p>
        <p className="gc-rec-quiet" style={{ margin: 0 }}>
          This lesson assesses {statements.map(s => s.code).join(', ')}. Count how many pupils are at each level, from the What I can do sheet.
        </p>
        <div className="gc-rec-row">
          <button type="button" className="btn btn-outline" onClick={() => setOpen(true)}>Add the levels</button>
          <span className="gc-rec-quiet">or leave it. The lesson is recorded as delivered, not assessed.</span>
        </div>
      </div>
    )
  }
  return (
    <div className="gc-rec-next">
      <p className="gc-rec-ask">How many pupils at each level? <span>Optional</span></p>
      <p className="gc-rec-quiet" style={{ margin: 0 }}>A count, copied from the What I can do sheet. No names. Leave a statement empty if you did not assess it today.{levelKey ? ` ${levelKey}` : ''}</p>
      {statements.map(s => {
        const c = count(rows[s.code])
        const total = c.s3 + c.s4 + c.s5
        const share = shareAtFourOrAbove(c)
        return (
          <fieldset key={s.code} className="gc-rec-levels">
            <legend><span className="gc-rec-code">{s.code} · {s.skill}</span>{s.pupil}</legend>
            <div className="gc-rec-counts">
              {(['s3', 's4', 's5'] as const).map((k, i) => (
                <label key={k}>
                  <span className="gc-rec-label">{levelNames[i]}</span>
                  <input inputMode="numeric" pattern="[0-9]*" value={rows[s.code][k]} onChange={e => set(s.code, k, e.target.value)} placeholder="0" aria-label={`${s.code}, pupils at ${levelNames[i]}`} />
                </label>
              ))}
            </div>
            {total > 0 && share !== null && (
              <p className="gc-rec-quiet" style={{ margin: 0 }}>{total} pupils counted · <b>{share}%</b> at {levelNames[1]} or above · {c.s3} below</p>
            )}
          </fieldset>
        )
      })}
      <div className="gc-rec-row">
        <button type="button" className="btn btn-gold" onClick={send} disabled={pending}>{pending ? 'Saving' : 'Save the levels'}</button>
      </div>
    </div>
  )
}

/** Digital: the teacher's judgement of the class, and by objective if wanted. */
function Judge({ objectives, descriptors, delivery, pending, onSave }: {
  objectives: string[]; descriptors: Descriptors | null; delivery: Delivery; pending: boolean
  onSave: (judgement: string | undefined, objectiveMarks: Record<string, Judgement>, note: string) => void
}) {
  const start = (JUDGEMENTS as string[]).includes(delivery.assessment) ? delivery.assessment as Judgement : null
  const [judgement, setJudgement] = useState<Judgement | null>(start)
  const [marks, setMarks] = useState<Record<string, Judgement>>(() => {
    const out: Record<string, Judgement> = {}
    for (const [k, v] of Object.entries(delivery.marks)) if (typeof v === 'string' && (JUDGEMENTS as string[]).includes(v)) out[k] = v as Judgement
    return out
  })
  const [note, setNote] = useState(delivery.note ?? '')
  const pick = (j: Judgement) => { setJudgement(j); onSave(j, marks, note) }
  const pickMark = (i: number, j: Judgement) => {
    const next = { ...marks, [String(i)]: j }
    setMarks(next)
    onSave(judgement ?? undefined, next, note)
  }
  return (
    <div className="gc-rec-next">
      <p className="gc-rec-ask">How did the class do? <span>Optional</span></p>
      {/* WHAT EACH ONE LOOKS LIKE, ON THE BUTTON (11 November 2026). Three
          words with nothing under them ask a teacher to guess where the line
          is, and two teachers guess differently. Each button now carries what
          that judgement looks like in this lesson, in the lesson's own words. */}
      <div className="gc-rec-judge" role="group" aria-label="How the class did" data-described={descriptors ? '' : undefined}>
        {JUDGEMENTS.map(j => (
          <button key={j} type="button" className="gc-rec-choice" aria-pressed={judgement === j} onClick={() => pick(j)} disabled={pending}>
            <span className="gc-rec-choice-name">{JUDGEMENT_LABEL[j]}</span>
            {descriptors && <span className="gc-rec-desc">{descriptors[j]}</span>}
          </button>
        ))}
      </div>
      <p className="gc-rec-quiet" style={{ margin: 0 }}>
        {descriptors ? 'Pick the one most of the class matched. ' : 'Your judgement of the class as a whole. '}
        Leave it and the lesson reads as delivered, not assessed.
      </p>

      {objectives.length > 0 && (
        <details className="gc-rec-more">
          <summary>By objective instead</summary>
          {objectives.map((o, i) => (
            <div key={i} className="gc-rec-objective">
              <p>{o}</p>
              <div className="gc-rec-judge" role="group" aria-label={o}>
                {JUDGEMENTS.map(j => (
                  <button key={j} type="button" className="gc-rec-choice gc-rec-choice-sm" aria-pressed={marks[String(i)] === j} onClick={() => pickMark(i, j)} disabled={pending}>{JUDGEMENT_LABEL[j]}</button>
                ))}
              </div>
            </div>
          ))}
        </details>
      )}

      <details className="gc-rec-more">
        <summary>Add a note</summary>
        <label className="gc-rec-field">
          <textarea value={note} onChange={e => setNote(e.target.value.slice(0, 280))} rows={3} maxLength={280} aria-describedby="gc-rec-note-help" />
          <span id="gc-rec-note-help" className="gc-rec-help">For your own record. No pupil names. {280 - note.length} characters left.</span>
        </label>
        <div className="gc-rec-row">
          <button type="button" className="btn btn-outline" onClick={() => onSave(judgement ?? undefined, marks, note)} disabled={pending}>Save the note</button>
        </div>
      </details>
    </div>
  )
}

function RecordStyles() {
  return (
    <style>{`
      .gc-rec { display: flex; flex-direction: column; gap: var(--space-3); }
      .gc-rec-quiet { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); line-height: 1.55; margin: 0; }
      .gc-rec-quiet b { color: var(--ink); }
      .gc-rec-main { min-height: 56px; align-self: flex-start; }
      .gc-rec-field { display: flex; flex-direction: column; gap: var(--space-1); max-width: 360px; }
      .gc-rec-label { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); }
      .gc-rec-help { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); line-height: 1.5; }
      .gc-rec input, .gc-rec textarea {
        min-height: 48px; padding: var(--space-2) var(--space-3); background: var(--white); color: var(--ink);
        border: 1.5px solid var(--border); border-radius: var(--radius-tile);
        font-family: var(--font-display); font-weight: 800; font-size: var(--text-lg); width: 100%; box-sizing: border-box;
      }
      .gc-rec textarea { font-family: var(--font-body); font-weight: 400; font-size: var(--text-base); line-height: 1.5; resize: vertical; }
      .gc-rec input:focus-visible, .gc-rec textarea:focus-visible, .gc-rec-link:focus-visible, .gc-rec-choice:focus-visible, .gc-rec-more > summary:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
      .gc-rec-link { background: none; border: 0; padding: 0; min-height: 44px; cursor: pointer; font: inherit; font-weight: 700; color: var(--terracotta-dark); text-decoration: underline; text-underline-offset: 3px; display: inline-flex; align-items: center; }
      .gc-rec-done { display: flex; gap: var(--space-3); align-items: center; padding: var(--space-3) var(--space-4); background: var(--butter-lt); border-radius: var(--radius-tile); font-family: var(--font-body); font-size: var(--text-base); color: var(--ink); line-height: 1.5; animation: gc-rec-in .35s cubic-bezier(0.22,1,0.36,1); }
      .gc-rec-tick { flex: none; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--ink); color: var(--white); font-weight: 900; }
      .gc-rec-next { display: flex; flex-direction: column; gap: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--border); }
      .gc-rec-ask { margin: 0; font-family: var(--font-display); font-weight: 900; font-size: var(--text-lg); color: var(--ink); }
      .gc-rec-ask span { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); margin-left: var(--space-2); }
      .gc-rec-row { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; }
      .gc-rec-levels { border: 1px solid var(--border); border-radius: var(--radius-tile); padding: var(--space-3); margin: 0; display: flex; flex-direction: column; gap: var(--space-2); min-width: 0; }
      .gc-rec-levels legend { padding: 0 var(--space-1); font-family: var(--font-body); font-weight: 700; font-size: var(--text-base); color: var(--ink); line-height: 1.4; }
      .gc-rec-code { display: block; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--terracotta-dark); }
      .gc-rec-counts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-2); }
      .gc-rec-counts label { display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
      .gc-rec-counts input { text-align: center; }
      .gc-rec-judge { display: flex; flex-wrap: wrap; gap: var(--space-2); }
      .gc-rec-choice { min-height: 56px; padding: 0 var(--space-4); cursor: pointer; background: var(--white); color: var(--ink); border: 1.5px solid var(--border); border-radius: var(--radius-btn); font-family: var(--font-display); font-weight: 800; font-size: var(--text-base); transition: background-color .15s ease, border-color .15s ease; }
      .gc-rec-judge[data-described] { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; }
      .gc-rec-judge[data-described] .gc-rec-choice { display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: var(--space-1); padding: var(--space-3); text-align: left; }
      .gc-rec-desc { font-family: var(--font-body); font-weight: 400; font-size: var(--text-sm); line-height: 1.45; color: var(--ink-muted); }
      .gc-rec-choice[aria-pressed="true"] .gc-rec-desc { color: var(--white); }
      .gc-rec-choice-sm { min-height: 44px; padding: 0 var(--space-3); font-size: var(--text-sm); }
      .gc-rec-choice:hover { border-color: var(--terracotta); }
      .gc-rec-choice[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--white); }
      .gc-rec-more > summary { cursor: pointer; min-height: 44px; display: inline-flex; align-items: center; font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--terracotta-dark); }
      .gc-rec-more[open] { display: flex; flex-direction: column; gap: var(--space-3); }
      .gc-rec-objective { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-2) 0; border-top: 1px solid var(--border); }
      .gc-rec-objective p { margin: 0; font-family: var(--font-body); font-size: var(--text-base); color: var(--ink); line-height: 1.5; }
      .gc-rec-error { margin: 0; font-family: var(--font-body); font-weight: 600; font-size: var(--text-sm); color: var(--ink); background: var(--warm); border-left: 4px solid var(--terracotta-dark); padding: var(--space-2) var(--space-3); border-radius: var(--radius-tile); }
      .gc-rec-saved { margin: 0; font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--ink); }
      @keyframes gc-rec-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      @media (max-width: 720px) { .gc-rec-judge[data-described] { grid-template-columns: minmax(0, 1fr); } }
      @media (max-width: 560px) { .gc-rec-main { align-self: stretch; } .gc-rec-choice { flex: 1 1 100%; } .gc-rec-choice-sm { flex: 1 1 0; padding: 0 var(--space-1); } .gc-rec-done { padding: var(--space-3); } }
      @media (prefers-reduced-motion: reduce) { .gc-rec-done { animation: none; } .gc-rec-choice { transition: none; } }
      @media print { .gc-rec { display: none !important; } }
    `}</style>
  )
}
