'use client'

import { useState } from 'react'

// Turn on quest reminders, asked where a child will actually see it.
//
// Justin: "I added Yuseuf child app to Home Screen but it's not asking me to set
// up notifications PWA?"
//
// It was asking. The offer was a quiet white button 2,150 lines down the longest
// screen in the product, under the printables, the later days, the coming up
// list and the lesson tabs. The state machine was right, the placement made it
// invisible, and nobody scrolls to the bottom of their own jobs list looking for
// a settings button.
//
// This matters more than an ordinary missed button. The timely job nudges built
// earlier today (three crons at morning, after school and evening) push to the
// CHILD's device and to nothing else, deliberately, because chasing a parent
// about their child's bed is the nagging this product replaces. So a child who
// never turned reminders on does not get a quieter version of the feature. They
// get none of it, and the crons run every day for them and send nothing.
//
// Which is why there is a Not now rather than a cross. Refusing is allowed, and
// it comes back in three days, because this is an offer whose refusal silently
// switches a feature off and "never ask again" would make that permanent on one
// mis-tap. Not a warning dressed as an offer, and not a nag either: three days
// is long enough to be a decision and short enough to be recoverable.

const LATER_KEY = 'gc_kid_reminders_later'
const LATER_DAYS = 3

/** Has a child said not now recently enough that we should stay quiet? */
export function remindersSnoozed(): boolean {
  try {
    const raw = localStorage.getItem(LATER_KEY)
    if (!raw) return false
    const at = Number(raw)
    // A legacy or corrupt value reads as expired rather than as silence forever,
    // the same rule as the parent side push prompt.
    if (!Number.isFinite(at)) return false
    return Date.now() - at < LATER_DAYS * 86400000
  } catch { return false }
}

/**
 * The house button shape, shared by both controls on this card.
 *
 * The design system: 16px radius (--radius-btn), a 2px ink edge, a hard
 * 0 5px 0 ink ledge. What was here before used --radius-tile (14px), no
 * border and a 0 4px 0 tint ledge, which is not a shape this product uses
 * anywhere else and is the reason neither control read as a button.
 */
const BTN = {
  padding: '14px 18px', minWidth: 0, boxSizing: 'border-box' as const, cursor: 'pointer',
  borderRadius: 'var(--radius-btn)', border: 'var(--edge)', color: 'var(--ink)',
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
  boxShadow: 'var(--lift-deep)',
}

export default function KidRemindersPrompt({
  state,
  onEnable,
  childName,
  error = null,
}: {
  /** 'offer' can subscribe right now. 'ios' needs the Home Screen first. */
  state: 'offer' | 'ios'
  onEnable: () => void
  childName?: string
  /**
   * What went wrong last time they tapped, in words a child can read.
   *
   * Before this the whole enable path ended in `catch { setRemindState
   * ('hidden') }`: every failure took the card off the screen, so tapping Yes
   * please and nothing happening was indistinguishable from tapping Yes please
   * and it working. A child cannot tell an adult what went wrong if the app
   * never says.
   */
  error?: string | null
}) {
  const [steps, setSteps] = useState(false)
  const [gone, setGone] = useState(false)

  if (gone) return null

  const notNow = () => {
    try { localStorage.setItem(LATER_KEY, String(Date.now())) } catch { /* private mode */ }
    setGone(true)
  }

  return (
    <div data-reminders-card style={{
      // WHITE GROUND, NOT A SLAB OF BUTTER.
      //
      // Justin, 15 September 2026, from his phone: "this page on child app needs
      // up as button not clear and a bit too yellow, use our design system to
      // make it easier to read and clearer."
      //
      // --butter IS --terracotta (shared/tokens.css line 122), so this card's
      // ground and its primary button were painting the SAME #EDC35F. The
      // button had no border and only a 0 4px 0 #C99A28 ledge under it, so on a
      // gold card it read as a heading with a faint line under it, not as
      // something to press. That is the "not clear" in his message, and it is
      // why a child could sit on this card and never tap the thing that opens
      // the steps.
      //
      // And directly under this card on the same screen sits the butter "Got a
      // quest idea?" card. Two full width gold slabs stacked. That is the "bit
      // too yellow".
      //
      // So the card takes the house finish the rest of the child app already
      // wears: white ground, a 2px ink edge, a hard ink ledge. Butter stays,
      // but as an ACCENT with an ink edge around it (the bell's disc, the
      // primary button, the step numbers), which is how the calendar and the
      // sticker book use it. Colour that marks one thing reads; colour that
      // covers everything stops meaning anything.
      background: '#fff', border: 'var(--edge)',
      borderRadius: 'var(--radius-card)', padding: '16px 18px', marginBottom: '16px',
      boxShadow: 'var(--lift)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span aria-hidden style={{
          width: 44, height: 44, flexShrink: 0, borderRadius: '50%', boxSizing: 'border-box',
          background: 'var(--butter)', border: 'var(--edge)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'var(--text-xl)', lineHeight: 1,
        }}>🔔</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.2 }}>
            Want a nudge about your jobs?
          </p>
          {/* Ink, not --ink-soft. This is the sentence that tells a child what
              to do next, and a muted grey is for things that can be skimmed. */}
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: 0, overflowWrap: 'anywhere' }}>
            {state === 'offer'
              ? `A quick reminder before school and after school${childName ? `, ${childName}` : ''}, so nothing gets forgotten. Never at bedtime.`
              : 'Add me to your Home Screen first, then you can turn reminders on. It only takes a moment.'}
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" style={{
          margin: '13px 0 0', padding: '11px 13px', boxSizing: 'border-box',
          background: '#FDE8E0', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)',
          color: 'var(--ink)', lineHeight: 1.45, overflowWrap: 'anywhere',
        }}>
          {error}
        </p>
      )}

      {/* Two real buttons. Both wear the house shape (16px, a 2px ink edge, a
          0 5px 0 ink ledge), so Not now is a choice a child can see and take
          rather than a ghost outline they cannot read. Refusing is allowed
          here, which only works if refusing is visible.

          A flex BASIS rather than 1 1 auto, so the row never squeezes one of
          them to a sliver. body carries zoom 1.07 (shared/tokens.css), so a
          360px phone has about 267 layout px of card inside the padding and
          150 + 110 + 10 does not fit: at 360 they stack, full width each, and
          from 390 up they share the row. Both shapes are deliberate. Measured
          at 360, 390, 430 and at 125 percent text. */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={state === 'offer' ? onEnable : () => setSteps(v => !v)}
          style={{ ...BTN, flex: '1 1 150px', background: 'var(--butter)' }}
        >
          {state === 'offer' ? 'Yes please' : steps ? 'Hide the steps' : 'Show me how'}
        </button>
        <button onClick={notNow} style={{ ...BTN, flex: '1 1 110px', background: '#fff' }}>
          Not now
        </button>
      </div>

      {state === 'ios' && steps && (
        // Butter light rather than white, because the card is white now and a
        // white panel on a white card is not a panel. An ink edge holds it.
        <div style={{
          marginTop: '14px', background: 'var(--butter-lt)', border: 'var(--edge)',
          borderRadius: 'var(--radius-btn)', padding: '16px 18px',
        }}>
          {[
            <>Tap the <strong>Share</strong> button at the bottom of Safari, the square with the arrow pointing up.</>,
            <>Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</>,
            <>Open your quests from the <strong>new icon</strong> on your Home Screen.</>,
            <>Tap <strong>Yes please</strong> on this same message, and you are set.</>,
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', marginBottom: i < 3 ? '11px' : 0 }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
                background: 'var(--butter)', color: 'var(--ink)', border: 'var(--edge)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              }}>{i + 1}</span>
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, overflowWrap: 'anywhere' }}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
