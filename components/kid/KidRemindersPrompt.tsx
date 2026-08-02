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

export default function KidRemindersPrompt({
  state,
  onEnable,
  childName,
}: {
  /** 'offer' can subscribe right now. 'ios' needs the Home Screen first. */
  state: 'offer' | 'ios'
  onEnable: () => void
  childName?: string
}) {
  const [steps, setSteps] = useState(false)
  const [gone, setGone] = useState(false)

  if (gone) return null

  const notNow = () => {
    try { localStorage.setItem(LATER_KEY, String(Date.now())) } catch { /* private mode */ }
    setGone(true)
  }

  return (
    <div style={{
      background: 'var(--butter, #FFE9A8)', border: '1.5px solid rgba(26,26,46,0.1)',
      borderRadius: '20px', padding: '16px 18px', marginBottom: '16px',
      boxShadow: '0 4px 0 rgba(26,26,46,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: 'var(--text-2xl)', flexShrink: 0, lineHeight: 1.1 }}>🔔</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 3px', lineHeight: 1.2 }}>
            Want a nudge about your jobs?
          </p>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            {state === 'offer'
              ? `A quick reminder before school and after school${childName ? `, ${childName}` : ''}, so nothing gets forgotten. Never at bedtime.`
              : 'Add me to your Home Screen first, then you can turn reminders on. It only takes a moment.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '9px', marginTop: '13px', flexWrap: 'wrap' }}>
        <button
          onClick={state === 'offer' ? onEnable : () => setSteps(v => !v)}
          style={{
            flex: '1 1 auto', padding: '13px 18px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            background: 'var(--terracotta)', color: 'var(--ink)',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          {state === 'offer' ? 'Yes please' : steps ? 'Hide the steps' : 'Show me how'}
        </button>
        <button
          onClick={notNow}
          style={{
            flexShrink: 0, padding: '13px 18px', borderRadius: '14px', cursor: 'pointer',
            background: 'transparent', border: '1.5px solid rgba(26,26,46,0.18)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink-soft)',
          }}
        >
          Not now
        </button>
      </div>

      {state === 'ios' && steps && (
        <div style={{ marginTop: '12px', background: '#fff', borderRadius: '16px', padding: '16px 18px' }}>
          {[
            <>Tap the <strong>Share</strong> button at the bottom of Safari, the square with the arrow pointing up.</>,
            <>Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</>,
            <>Open your quests from the <strong>new icon</strong> on your Home Screen.</>,
            <>Tap <strong>Yes please</strong> on this same message, and you are set.</>,
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < 3 ? '9px' : 0 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: 'var(--terracotta)', color: 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              }}>{i + 1}</span>
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
