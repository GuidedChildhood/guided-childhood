'use client'

import { useEffect, useState } from 'react'
import { BAND_LABEL, type JobBand } from '@/lib/quests/job-time'

// Write your own job, one question at a time.
//
// This existed twice in QuestManager with identical behaviour, read and wrote
// the SAME state on the parent, and any change to what a written job lands as
// had to be made in both. It is one component now, on both pages, and what a
// written job becomes lives here: a job worth one star, repeating as chosen.
//
// The four the API already accepts. Nothing new is invented here: schedule has
// always been on family_quests and the composer simply never asked.
export type Schedule = 'daily' | 'weekdays' | 'weekend' | 'once'

const WHEN: { key: Schedule; label: string }[] = [
  { key: 'daily',    label: 'Every day' },
  { key: 'weekdays', label: 'School days' },
  { key: 'weekend',  label: 'Weekends' },
  { key: 'once',     label: 'Just once' },
]

// When in the day, in the child's words rather than a clock.
//
// Not a time picker, on purpose. A job due at four o'clock is late at 4:01, and
// a child nagged by a clock learns the app is a nag. Families do not run on
// clocks, they run on before school, after school and before bed, which is
// exactly what the three reminder crons already fire on.
//
// Work it out means what has always happened: the band is read from the words
// in the title. A parent only overrides it when the guess is wrong for their
// house.
const BANDS: { key: JobBand | 'auto'; label: string }[] = [
  { key: 'auto',         label: 'Work it out' },
  { key: 'morning',      label: 'Before school' },
  { key: 'after_school', label: 'After school' },
  { key: 'evening',      label: 'Before bed' },
]

// One question at a time.
//
// Justin, 31 July: "it should be first select the job or type which you have,
// but then ask the question with options ... every week day, full week, once,
// weekend, all as questions to user to select, then next question ... before
// school after school before bed as all questions, then it shows added and
// asks add more or click to see waiting for you."
//
// Everything the wizard asks was already on the screen. The problem was that
// it was ALL on the screen: a text box, four repeat chips and four band chips,
// eight tappable things at once, none of them explaining which mattered or in
// what order. A parent who only wanted to add "feed the cat" had to decide two
// things they had no opinion about before the button meant anything.
//
// Asked in turn, each question is one decision with an obvious next step, and
// the answer to the previous one stays visible above it so nothing has been
// silently decided. Same three values, same API call, same defaults. Only the
// order is new.
type Step = 'what' | 'often' | 'when' | 'added'

const CHIP_BASE: React.CSSProperties = {
  cursor: 'pointer', borderRadius: 100, padding: '9px 15px',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
  color: 'var(--ink)',
}
const QUESTION: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17,
  color: 'var(--ink)', margin: '0 0 2px', lineHeight: 1.25,
}
const ASIDE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

export default function JobComposer({
  onAdd,
  placeholder = 'Make your bed, feed the cat...',
  tone = 'white',
  autoFocus = false,
  help,
  countToday,
  pendingTitle = null,
  onPendingUsed,
  onSeeWaiting,
  onStep,
}: {
  /**
   * Given the trimmed title and how often it should repeat. The caller still
   * owns everything else a job becomes, the stars and the emoji.
   */
  onAdd: (title: string, schedule: Schedule, band: JobBand | null) => void
  placeholder?: string
  /** The input sits on white cards in the add panel and on cream further down. */
  tone?: 'white' | 'cream'
  autoFocus?: boolean
  help?: string
  /**
   * How many jobs this child already has today, so the composer can say when
   * the list has got long.
   *
   * A guide, never a cap. A parent who wants eight jobs can have eight jobs;
   * they know their family and we do not. But a child who opens the app to a
   * wall of them does fewer, not more, and the moment to mention that is while
   * the ninth is being typed rather than in a help page nobody opens.
   */
  countToday?: number
  /**
   * A title chosen outside this component, which starts the same questions.
   *
   * Tapping a suggestion used to add a job outright, so the ideas skipped every
   * question the typed path asks and landed on whatever the template said. Two
   * ways to add one job, and the quicker one asked nothing. A chip sets this
   * instead and joins the queue at question two.
   */
  pendingTitle?: string | null
  /** Called once the pending title has been taken, so the caller can clear it. */
  onPendingUsed?: () => void
  /** Offered after an add, when the caller has somewhere to send them. */
  onSeeWaiting?: () => void
  /**
   * Which question is on screen, so the caller can get out of the way.
   *
   * The ideas grid lives outside this component, and it sat under every step:
   * a parent halfway through saying how often "feed the cat" repeats had a
   * wall of other jobs to tap underneath the question. Tapping one mid answer
   * would swap the job out from under them. The caller hides it while a
   * question is open and brings it back for what and added, where it is the
   * point.
   */
  onStep?: (step: Step) => void
}) {
  const [step, setStep] = useState<Step>('what')
  const [title, setTitle] = useState('')
  const [draft, setDraft] = useState('')
  const [when, setWhen] = useState<Schedule>('daily')
  const [band, setBand] = useState<JobBand | 'auto'>('auto')
  // The one just added, named back so a parent can see what landed before
  // deciding whether to add another.
  const [last, setLast] = useState<{ title: string; note: string } | null>(null)
  // True once anything has been added, so the repeat and band answers can be
  // offered as the same as last time rather than asked from cold.
  const [addedBefore, setAddedBefore] = useState(false)

  // Tell the caller which question is showing, so it can hide the ideas grid
  // while one is open. In an effect rather than at each setStep, because the
  // step changes from five places and one of them is the pending title effect
  // below, and a caller told from only four of them is a caller told wrong.
  useEffect(() => { onStep?.(step) }, [step, onStep])

  // A suggestion tapped outside joins at question two.
  useEffect(() => {
    const t = (pendingTitle ?? '').trim()
    if (!t) return
    setDraft(t)
    setTitle('')
    setStep('often')
    onPendingUsed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTitle])

  const ready = title.trim().length > 0

  // Five is where a child's list stops reading as a plan and starts reading
  // as a chore chart. Said once, gently, and never enforced.
  const COMFORTABLE = 5
  const many = typeof countToday === 'number' && countToday >= COMFORTABLE

  function startWith(t: string) {
    setDraft(t)
    setTitle('')
    setStep('often')
  }

  function finish(chosenBand: JobBand | 'auto') {
    const t = draft.trim()
    if (!t) { setStep('what'); return }
    onAdd(t, when, chosenBand === 'auto' ? null : chosenBand)
    setLast({
      title: t,
      note: `${WHEN.find(w => w.key === when)?.label ?? ''}${chosenBand === 'auto' ? '' : ` · ${BAND_LABEL[chosenBand]}`}`,
    })
    setAddedBefore(true)
    setDraft('')
    setStep('added')
    // Neither the schedule nor the band is reset. A parent adding three school
    // day morning jobs answers both once and taps straight past them after
    // that, which is the whole reason adding several in a row feels like one
    // action rather than three.
  }

  const chip = (on: boolean, accent: 'terracotta' | 'gold'): React.CSSProperties => ({
    ...CHIP_BASE,
    background: on ? `var(--${accent})` : '#fff',
    border: `1.5px solid ${on ? `var(--${accent})` : 'var(--border)'}`,
    boxShadow: on ? `0 3px 0 var(--${accent}-dark)` : 'none',
  })

  // ── 1. What is it? ────────────────────────────────────────────
  if (step === 'what') {
    return (
      <>
        <p style={QUESTION}>What is the job?</p>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 10px' }}>
          Type it, or tap one of the ideas below.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            autoFocus={autoFocus}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && ready) startWith(title.trim()) }}
            placeholder={placeholder}
            // minWidth 0 so a long placeholder cannot push the button off a
            // phone screen.
            style={{
              flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
              border: '1.5px solid var(--border)',
              background: tone === 'cream' ? 'var(--cream)' : '#fff',
              fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--ink)', outline: 'none',
            }}
            maxLength={120}
          />
          <button
            onClick={() => ready && startWith(title.trim())}
            disabled={!ready}
            style={{
              flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
              borderRadius: '12px', padding: '12px 20px',
              cursor: ready ? 'pointer' : 'default',
              fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
              boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: ready ? 1 : 0.5,
            }}
          >
            Next
          </button>
        </div>
        {many && (
          <p style={{ fontSize: '14px', color: 'var(--terracotta-dark)', lineHeight: 1.45, margin: '9px 0 0', fontWeight: 600 }}>
            That is {countToday} jobs today. Plenty of families run three or four and
            find they get done. Add more if it suits you, this is only a nudge.
          </p>
        )}
        {help && (
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '9px 0 0' }}>
            {help}
          </p>
        )}
      </>
    )
  }

  // The job being built, kept on screen through both questions so nothing has
  // been decided behind a parent's back, and so the answer to "which job is
  // this about" is never more than a glance away.
  const heading = (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
      <span style={ASIDE}>Adding</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>
        {draft}
      </span>
      <button
        type="button"
        onClick={() => { setStep('what'); setTitle(draft); setDraft('') }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
          color: 'var(--terracotta)', letterSpacing: '0.04em',
        }}
      >
        Change
      </button>
    </div>
  )

  // ── 2. How often? ─────────────────────────────────────────────
  if (step === 'often') {
    return (
      <>
        {heading}
        <p style={QUESTION}>How often?</p>
        {addedBefore && (
          <p style={{ ...ASIDE, margin: '0 0 8px' }}>Same as last time is already picked</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
          {WHEN.map(w => (
            <button
              key={w.key}
              type="button"
              aria-pressed={w.key === when}
              onClick={() => { setWhen(w.key); setStep('when') }}
              style={chip(w.key === when, 'terracotta')}
            >
              {w.label}
            </button>
          ))}
        </div>
      </>
    )
  }

  // ── 3. When in the day? ───────────────────────────────────────
  if (step === 'when') {
    return (
      <>
        {heading}
        <p style={QUESTION}>When in the day?</p>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 8px' }}>
          This is when the reminder lands. Work it out reads it from the words.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {BANDS.map(b => (
            <button
              key={b.key}
              type="button"
              aria-pressed={b.key === band}
              onClick={() => { setBand(b.key); finish(b.key) }}
              style={chip(b.key === band, 'gold')}
            >
              {b.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStep('often')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', marginTop: 10, padding: '4px 2px',
            fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700,
            color: 'var(--ink-muted)', letterSpacing: '0.04em',
          }}
        >
          ← How often
        </button>
      </>
    )
  }

  // ── 4. Added ──────────────────────────────────────────────────
  return (
    <>
      <div style={{ display: 'flex', gap: 9, alignItems: 'baseline', marginBottom: 12 }}>
        <span aria-hidden style={{ color: 'var(--green-dark)', fontWeight: 800, flexShrink: 0 }}>✓</span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', lineHeight: 1.25 }}>
            {last?.title} is on the board
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-muted)', marginTop: 2 }}>
            {last?.note}
          </span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => { setStep('what'); setTitle('') }}
          style={{
            flex: 1, minWidth: 130, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
            borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800,
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          Add another
        </button>
        {onSeeWaiting && (
          <button
            type="button"
            onClick={onSeeWaiting}
            style={{
              flex: 1, minWidth: 130, background: '#fff', color: 'var(--ink)',
              border: '1.5px solid var(--border)', borderRadius: 12, padding: '12px 16px',
              cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
            }}
          >
            See waiting for you
          </button>
        )}
      </div>
      {many && (
        <p style={{ fontSize: '14px', color: 'var(--terracotta-dark)', lineHeight: 1.45, margin: '10px 0 0', fontWeight: 600 }}>
          That is {countToday} jobs today. Plenty of families run three or four and
          find they get done. Add more if it suits you, this is only a nudge.
        </p>
      )}
    </>
  )
}
