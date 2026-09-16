'use client'

import HappyIcon from '@/components/kid/HappyIcon'
import { jobIconFor } from '@/lib/quests/job-icon'

// ── ONE JOB ON THE CHILD'S BOARD, IN THE HAPPY NEWS FINISH ─────────────────
//
// Justin, 16 September 2026, with the board open on his phone:
// "Tidy text up here and make look more happy need style Pages icons design."
//
// The text was not untidy by accident. The emoji, the title, the worth, Remind
// and Remove were all children of ONE flex row, and only the title carried
// flex: 1. On a 390px phone that left the title roughly 100px to live in, so
// "Phone charged outside the bedroom" wrapped to five lines while the worth and
// the two links sat vertically CENTRED across the middle of those lines. The
// result is words printed through words, which is exactly what the screenshot
// shows. No amount of spacing fixes that, because the cause is four things
// competing for one line's width.
//
// Mobbin first, per CLAUDE.md. Pulled and read in this session:
//   mobbin.com/screens/bf213a21-fcae-4e2e-a627-c76ba8b1fcef  Me+, manage tasks
//   mobbin.com/screens/710595fe-c1fb-4f5b-b098-5a1395dad32c  Todoist, inbox
//   mobbin.com/screens/e8a9e0be-a6da-4440-a21d-a5d9a980add3  Craft, tasks
//
// Me+ is the screen Justin is describing without having the words for it: every
// row is its own PASTEL CARD carrying a real icon, a small quiet meta line, and
// the title on its OWN FULL WIDTH LINE underneath. Nothing sits beside the
// title, so nothing can collide with it, and the colour is what makes a list of
// chores read as a happy thing rather than a spreadsheet. Todoist supplies the
// other half: the actions belong on a row BELOW the title as small chips, never
// squeezed in beside it.
//
// Translated into ours rather than copied. The pastel wears our own 2px ink
// edge and the hard 0 4px 0 ink shadow, which is the finish the tab bar, the
// calendar discs and the section tiles already wear, and the icon sits on the
// white circle plate used across the rest of the product. Nothing new enters
// the design system; this is the house language applied to a row that never
// got it.
//
// It lives in its own file so app/ref-job-board can mount the real thing. A
// fixture that reimplements the markup proves nothing about the screen a
// parent sees.

export type BoardJob = {
  id: string
  title: string
  emoji: string
  stars: number
  is_family_job?: boolean
  steps?: string[] | null
}

// The pastel a row is filled with. Green is deliberately NOT in the cycle: it
// is reserved for a family job below, so the one colour carrying a meaning
// keeps it. The rest rotate by position, which is what stops eight jobs reading
// as eight copies of one card.
const ROW_TINTS = ['var(--tint-butter)', 'var(--tint-blue)', 'var(--tint-rose)', 'var(--tint-amber)']
const FAMILY_TINT = 'var(--tint-green)'

// The white circle plate the job's icon sits on. It carries a DRAWN icon from
// the house set, never the phone emoji stored on the row.
//
// Justin, 16 September 2026, with The Happy Newspaper held up beside the
// board: "colours are right but the icons could be more happy news style like
// attached." The emoji was another company's artwork sitting inside our plate,
// in another company's style, drawn differently on every device a family owns.
// The stored emoji is still the key that picks the drawing (lib/quests/job-icon)
// so nothing in the database changes and nothing a family typed is lost.
const PLATE: React.CSSProperties = {
  width: 42, height: 42, borderRadius: '50%', background: '#fff', border: 'var(--edge)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '22px', lineHeight: 1, flexShrink: 0,
}

// What the job pays, said once, in its own pill above the title. A family job
// shows no number at all: contribution is belonging, and the bank pays it
// nothing.
const WORTH_PILL = (family: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  background: '#fff', border: `1.5px solid ${family ? '#2F8F6B' : 'var(--ink)'}`,
  borderRadius: 'var(--radius-pill)', padding: '3px 10px',
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.04em', color: family ? '#2F8F6B' : 'var(--ink)',
  lineHeight: 1.3, whiteSpace: 'nowrap', flexShrink: 0,
})

// The job title. Its own line, the full width of the card, and big enough to be
// the thing you read first. lineHeight sits at 1.25 because these wrap to two
// and three lines by design and a tighter one closes the descenders up.
//
// overflowWrap is load bearing rather than tidy. Justin has caught a word
// broken mid word once already, on the child's quest idea card ("footbal l").
// anywhere breaks a long word only when it genuinely cannot fit, where the
// break-all it replaces would chop ordinary words at the margin.
const JOB_TITLE: React.CSSProperties = {
  margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 800,
  fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25,
  letterSpacing: '-0.01em', overflowWrap: 'anywhere',
}

// ── THE TWO SETTINGS ON A JOB, AS BUTTONS ──────────────────────────────────
//
// Justin, 10 September 2026, with the jobs board: "steps need to have hover
// explanation and look better as actual buttons".
//
// "Make it a family job" and "Add steps" were bare mono text in ink-muted with
// no border and no background, sitting under the job title. They are the two
// most interesting things you can do to a job and they read as grey captions,
// which is why nobody presses them.
//
// They are pills now, and each carries a title so hovering says what it does.
// The words alone cannot: "family job" is our idea, not a phrase a parent
// arrives knowing, and "steps" says nothing about the child's card.
//
// on: this setting is applied, so the pill is filled in its own colour.
const CHIP_BTN = (on: boolean, tint: string, ink: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
  background: on ? tint : '#fff',
  border: `1.5px solid ${on ? ink : 'var(--border)'}`,
  borderRadius: 'var(--radius-pill)', padding: '5px 11px', cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.02em', color: on ? ink : 'var(--ink-soft)',
  lineHeight: 1.3, whiteSpace: 'nowrap',
})

export default function JobBoardRow({
  job, index, childName, hasApp, busy, pinged,
  stepsOpen, stepsDraft, setStepsOpen, setStepsDraft,
  onToggleFamily, onSaveSteps, onRemind, onRemove,
}: {
  job: BoardJob
  /** Position on the board, which is what picks the pastel. */
  index: number
  childName: string
  hasApp: boolean
  busy: boolean
  /** The title most recently buzzed, so this row can say Sent. */
  pinged: string | null
  stepsOpen: boolean
  stepsDraft: string
  setStepsOpen: (open: boolean) => void
  setStepsDraft: (v: string) => void
  onToggleFamily: () => void
  onSaveSteps: (steps: string[] | null) => void
  onRemind: () => void
  onRemove: () => void
}) {
  const family = !!job.is_family_job
  const stepCount = job.steps?.length ?? 0

  return (
    <div style={{
      background: family ? FAMILY_TINT : ROW_TINTS[index % ROW_TINTS.length],
      border: 'var(--edge)', borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--lift)', padding: '12px 13px 13px',
    }}>
      {/* The plate and the worth, small, ABOVE the title. Two short objects on
          a line of their own can never crowd anything, and the title below
          them gets the whole card to wrap in. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
        <span aria-hidden style={PLATE}><HappyIcon name={jobIconFor(job.emoji, job.title)} size={27} /></span>
        {/* A family job never shows a price: contribution is belonging, and
            the bank pays it nothing. */}
        <span style={WORTH_PILL(family)}>
          {family ? '❤️ No stars' : `⭐ ${job.stars}`}
        </span>
        {/* Removing is instant and there is no undo, so it lives up here in the
            spare space rather than down among the chips, where a thumb going
            for Remind is already travelling. It keeps its word too: a bare
            cross in the corner of a card this colourful is the easiest thing
            on the screen to hit by accident. */}
        <button
          onClick={onRemove}
          disabled={busy}
          title={`Take this off ${childName}'s board`}
          style={{ ...CHIP_BTN(false, '#fff', 'var(--ink-muted)'), marginLeft: 'auto', color: 'var(--ink-muted)' }}
        >
          Remove
        </button>
      </div>

      <p style={JOB_TITLE}>{job.title}</p>

      {/* The Dr Becky layer, quiet under each job. A family job is one everyone
          does because they belong here, no stars. Steps chunk a big job into
          little ticks on the child's card, and the stars stay on the whole job,
          never per step.
          Remind and Remove join them here rather than sitting up on the
          title's line, which is where they used to print through the words. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <button
          onClick={onToggleFamily}
          disabled={busy}
          aria-pressed={family}
          title={family
            ? `A family job. ${childName} does it because they live here, and it pays no stars. Tap to put the stars back.`
            : 'Some jobs are not for stars. A family job is one everybody does because they belong here, and it pays nothing.'}
          style={CHIP_BTN(family, 'var(--tint-green)', '#2F8F6B')}
        >
          {family ? '❤️ Family job, no stars' : '❤️ Make it a family job'}
        </button>
        <button
          onClick={() => {
            if (stepsOpen) { setStepsOpen(false); return }
            setStepsDraft((job.steps ?? []).join('\n'))
            setStepsOpen(true)
          }}
          disabled={busy}
          aria-expanded={stepsOpen}
          title={`Break a big job into little ticks on ${childName}'s own card. The stars stay on the whole job, never one per step.`}
          style={CHIP_BTN(stepCount > 0, 'var(--terracotta-lt)', 'var(--terracotta-dark)')}
        >
          {stepCount > 0 ? `✎ Steps · ${stepCount}` : '✎ Add steps'}
        </button>
        {/* Only when they have the app. Offering to buzz a phone that does not
            exist is a button that can only disappoint. */}
        {hasApp && (
          <button
            onClick={onRemind}
            disabled={busy}
            title={`Buzz ${childName}'s phone about this one`}
            style={CHIP_BTN(pinged === job.title, 'var(--tint-green)', '#2F8F6B')}
          >
            {pinged === job.title ? '✓ Sent' : '🔔 Remind'}
          </button>
        )}
      </div>

      {stepsOpen && (
        <div style={{ marginTop: 9 }}>
          <textarea
            value={stepsDraft}
            onChange={e => setStepsDraft(e.target.value)}
            rows={4}
            placeholder={'One step per line, up to five.\nClothes in the basket\nBooks on the shelf\nFloor clear'}
            style={{ width: '100%', borderRadius: 11, border: 'var(--edge)', padding: '8px 10px', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', color: 'var(--ink)', background: '#fff', resize: 'vertical' }}
          />
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, margin: '4px 0 6px' }}>
            Little ticks that chunk the job on their card. The stars stay on the whole job, never per step.
          </p>
          <button
            onClick={() => {
              const steps = stepsDraft.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 5)
              onSaveSteps(steps.length ? steps : null)
            }}
            disabled={busy}
            className="btn btn-gold"
            style={{ padding: '8px 14px', fontSize: 'var(--text-sm)' }}
          >
            Save steps
          </button>
        </div>
      )}
    </div>
  )
}
