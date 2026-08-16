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
//
// It sits LAST, not first. It used to lead the list and render filled, because
// the state defaulted to auto, and Justin caught what that does to the step:
// "when in the day they need to know to click the button, be more intuitive."
// A chip that already looks chosen at the top of the list reads as a question
// already answered, so the parent hunts for a Next button that does not exist.
// The three real times lead, the fallback follows, and nothing on this step
// ever renders chosen, because choosing is the tap that adds the job.
const BANDS: { key: JobBand | 'auto'; label: string }[] = [
  { key: 'morning',      label: 'Before school' },
  { key: 'after_school', label: 'After school' },
  { key: 'evening',      label: 'Before bed' },
  { key: 'auto',         label: 'Work it out' },
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
  cursor: 'pointer', borderRadius: 100, padding: '11px 12px',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
  color: 'var(--ink)', textAlign: 'center',
}

// Two up, equal width, so the answers line up.
//
// These were a wrapping flex row, which sizes every chip to its own text, so
// "Every day" and "School days" set one edge and "Weekends" and "Just once"
// set another, and four answers to one question came out as a ragged little
// staircase. A question with four equal answers should look like four equal
// answers.
const CHIP_GRID: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 9, marginTop: 8,
}

// A pastel each, from the stage palette the rest of the product already uses.
//
// Justin: "make them pastel colours to add some intereses like stage colours".
// Every chip was white and only the chosen one turned gold, so a question
// looked like a form until it was answered. The tints do the work the gold was
// doing alone: four options that are visibly four different things.
//
// The bands used to carry a colour each, chosen by meaning: morning the warm
// yellow, after school the daylight blue, before bed the lavender. That table
// is gone. The idea was sound and the result was not, because five near white
// tints side by side do not read as a considered palette, they read as a screen
// that could not decide. The label already says which band it is.
const QUESTION: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
  color: 'var(--ink)', margin: '0 0 2px', lineHeight: 1.25,
}
const ASIDE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
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
  // There is deliberately no band state. The last question is answered by the
  // tap that adds the job, so a stored default would only exist to render one
  // chip pre filled, and a pre filled chip on that step is the exact bug this
  // replaced: it reads as already answered, and the parent hunts for a Next
  // button that does not exist.
  // The one just added, named back so a parent can see what landed before
  // deciding whether to add another.
  // The answers themselves, not a sentence about them, so the confirmation can
  // show them back in the colours they were chosen in.
  const [last, setLast] = useState<{ title: string; when: Schedule; band: JobBand | 'auto' } | null>(null)
  // True once anything has been added, so the repeat answer can be offered as
  // the same as last time rather than asked from cold.
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
    setLast({ title: t, when, band: chosenBand })
    setAddedBefore(true)
    setDraft('')
    setStep('added')
    // The schedule is not reset: a parent adding three school day jobs answers
    // How often once and taps straight past it after that. The band has no
    // memory to reset, because on that step the tap IS the answer.
  }

  // One accent, and it is the butter.
  //
  // Justin: "can we change these tab colours to match Good Inside as yellow,
  // the pastel does not go, and make the buttons more defined but professional
  // looking."
  //
  // The previous version gave every answer its own pastel and deepened that
  // pastel when chosen. The reasoning was that a single gold for every answer
  // would say WHICH ONE was picked and nothing about WHAT it was.
  //
  // That reasoning was wrong, and looking at four washed pastels next to Good
  // Inside makes it obvious why: the label already says what it is. "Before
  // school" is written on the button. The colour was carrying information the
  // words were already carrying, and paying for it with a screen that looks
  // uncertain, because five near white tints next to each other read as a
  // decision nobody could make rather than a palette.
  //
  // So: unchosen is white with a real border, which is what makes them read as
  // buttons rather than tinted areas. Chosen is the butter with the house
  // chunky shadow. One confident accent against clean neutrals, which is the
  // actual lesson from the Good Inside screen: their colour is saturated and
  // used sparingly, not spread thin across everything.
  const chip = (on: boolean): React.CSSProperties => ({
    ...CHIP_BASE,
    background: on ? 'var(--terracotta)' : '#fff',
    border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
    color: 'var(--ink)',
    // Chosen sits proud of the row. Unchosen keeps a hairline lift so the group
    // still reads as pressable before anything is picked, which the flat
    // version did not.
    boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : '0 1px 0 var(--border)',
    fontWeight: on ? 800 : 700,
  })

  // ── 1. What is it? ────────────────────────────────────────────
  if (step === 'what') {
    return (
      <>
        <p style={QUESTION}>What is the job?</p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 10px' }}>
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
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none',
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
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800,
              boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: ready ? 1 : 0.5,
            }}
          >
            Next
          </button>
        </div>
        {many && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', lineHeight: 1.45, margin: '9px 0 0', fontWeight: 600 }}>
            That is {countToday} jobs today. Plenty of families run three or four and
            find they get done. Add more if it suits you, this is only a nudge.
          </p>
        )}
        {help && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '9px 0 0' }}>
            {help}
          </p>
        )}
      </>
    )
  }

  // The job being built, kept on screen through both questions so nothing has
  // been decided behind a parent's back, and so the answer to "which job is
  // this about" is never more than a glance away.
  //
  // On the last question the How often answer joins it as a butter pill.
  // Justin, 16 August: "the add quest job page needs to be clearer when
  // selecting week or day". On When in the day the week choice was invisible:
  // a parent two taps in could see WHICH job but not WHEN it repeats, and the
  // one place that said the answer back was the confirmation after the fact.
  // The pill is the same butter the confirmation already uses to say answers
  // back, so the running answers and the final ones read as one language, and
  // each carries its own small Change back to its step.
  const changeLink = (label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        color: 'var(--terracotta)', letterSpacing: '0.04em',
      }}
    >
      {label}
    </button>
  )

  const heading = (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
      <span style={ASIDE}>Adding</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
        {draft}
      </span>
      {changeLink('Change', () => { setStep('what'); setTitle(draft); setDraft('') })}
      {step === 'when' && (
        <>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
            background: 'var(--terracotta)', color: 'var(--ink)',
            border: '1.5px solid var(--terracotta-dark)',
            borderRadius: 100, padding: '4px 11px',
          }}>
            {WHEN.find(x => x.key === when)?.label}
          </span>
          {changeLink('Change', () => setStep('often'))}
        </>
      )}
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
        <div style={CHIP_GRID}>
          {WHEN.map(w => (
            <button
              key={w.key}
              type="button"
              aria-pressed={w.key === when}
              onClick={() => { setWhen(w.key); setStep('when') }}
              style={chip(w.key === when)}
            >
              {w.label}
            </button>
          ))}
        </div>
      </>
    )
  }

  // ── 3. When in the day? ───────────────────────────────────────
  //
  // The tap that answers this question is the tap that adds the job, and the
  // step has to SAY so. It used to render Work it out pre filled (the state
  // defaulted to auto), which reads as a question already answered, so a
  // parent sat looking for the Next button while the actual next step was
  // tapping any chip. Nothing here renders chosen any more: four plain
  // buttons, a line that says the tap adds, and the fallback last with its own
  // one line explanation. The old "← How often" link went too, because the
  // Change beside the butter pill above is the same journey with a clearer
  // name.
  if (step === 'when') {
    return (
      <>
        {heading}
        <p style={QUESTION}>When in the day?</p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 8px' }}>
          This is when the reminder lands. Tap one and the job goes on the board.
        </p>
        <div style={CHIP_GRID}>
          {BANDS.map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => finish(b.key)}
              style={chip(false)}
            >
              {b.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '8px 0 0' }}>
          Work it out reads the time of day from the job&rsquo;s own words.
        </p>
      </>
    )
  }

  // ── 4. Added ──────────────────────────────────────────────────
  return (
    <>
      <div style={{ display: 'flex', gap: 9, alignItems: 'baseline', marginBottom: 12 }}>
        <span aria-hidden style={{ color: 'var(--green-dark)', fontWeight: 800, flexShrink: 0 }}>✓</span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
            {last?.title} is on the board
          </span>
          {/* The answers back in the colour they were chosen in.
              Justin, originally: "hard to see the text you selected, would be
              clearer in the colours of the button". It was one line of grey
              mono, the quietest type on the card, reporting the two decisions a
              parent had just made.
              That still holds. What changed is that there is now one chosen
              colour rather than five, so these come back in the butter they
              were tapped in and match the chips exactly. */}
          <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {(() => {
              const w = WHEN.find(x => x.key === last?.when)
              const b = last && last.band !== 'auto' ? BANDS.find(x => x.key === last.band) : null
              const pill = (text: string) => {
                return (
                  <span key={text} style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                    background: 'var(--terracotta)', color: 'var(--ink)',
                    border: '1.5px solid var(--terracotta-dark)',
                    borderRadius: 100, padding: '4px 11px',
                  }}>
                    {text}
                  </span>
                )
              }
              return (
                <>
                  {w && pill(w.label)}
                  {b && pill(b.label)}
                  {/* Left on work it out, so say what that means rather than
                      showing nothing where a second answer was given. */}
                  {last && last.band === 'auto' && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', alignSelf: 'center' }}>
                      time of day worked out from the words
                    </span>
                  )}
                </>
              )
            })()}
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
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800,
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
              cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700,
            }}
          >
            See waiting for you
          </button>
        )}
      </div>
      {many && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', lineHeight: 1.45, margin: '10px 0 0', fontWeight: 600 }}>
          That is {countToday} jobs today. Plenty of families run three or four and
          find they get done. Add more if it suits you, this is only a nudge.
        </p>
      )}
    </>
  )
}
