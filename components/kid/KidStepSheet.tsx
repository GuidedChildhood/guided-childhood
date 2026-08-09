'use client'

import { useEffect, useState } from 'react'
import { STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { ideasFor } from '@/lib/kid/step-ideas'
import { playKidSound } from '@/lib/sound/kidSounds'
import type { KidTheme } from '@/lib/kid/theme'

// The sheet a self tick step opens, instead of ticking itself.
//
// Justin, 9 August 2026: "something kind just flashed off as soon as clicked so
// we need to make this really work and add a reminder somewhere and track if
// done somehow."
//
// He tapped Something kind and it was gone. Not a glitch, the whole behaviour: a
// step with no href ran mark() straight from onClick, which pushed the key into
// done on the same tick, so the row left the live slot and came back as a struck
// through line before his finger was off the glass.
//
// Three things wrong with that, in order of how much they matter.
//
//   The row LOOKED like a link. Same chevron, same shape as the steps that
//   really do open a page. A child taps expecting to go somewhere and instead
//   silently marks off a thing they have not done.
//
//   "Something kind" is a lovely row and a useless instruction. A child who
//   WANTS to do it still has to think of one, standing in a kitchen, at the
//   moment their attention is worst. Nothing helped them.
//
//   And a day that can be cleared by five taps in five seconds pays out real
//   screen time through grantDayMinutes. A list that can be finished without
//   doing anything teaches a child the list is pretend, which costs more than
//   any single step is worth.
//
// So the tap opens this. Ideas first, because that is the help. The confirm sits
// under them and is the ONLY thing that marks anything. Not yet closes and
// leaves the step exactly where it was, which is the option that has to exist
// for the confirm to mean anything at all.
//
// What the child taps is remembered and sent with the tick, so a grown up can
// see that Alma made someone a drink rather than only that a box went green.
// That is the "track if done somehow" half.

export default function KidStepSheet({
  step,
  childName,
  readingMinutes,
  theme,
  busy = false,
  onConfirm,
  onClose,
}: {
  step: StepKey
  childName?: string
  /** Reading states its own number, which changes with the child's age. */
  readingMinutes?: number
  theme: KidTheme
  busy?: boolean
  /** Confirmed, with what they said they did when they picked one. */
  onConfirm: (note: string | null) => void
  onClose: () => void
}) {
  const def = STEPS[step]
  const ideas = ideasFor(step)
  const [picked, setPicked] = useState<string | null>(null)

  // Escape closes it, like every other sheet in the app. A child who opened
  // this by accident should not have to hunt for the way out.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const title = step === 'reading' && readingMinutes ? `${readingMinutes} minutes reading` : def.label

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(26,26,46,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560, maxHeight: '88dvh', overflowY: 'auto',
          background: '#fff', borderRadius: '24px 24px 0 0',
          padding: '20px 18px calc(20px + env(safe-area-inset-bottom, 0px))',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span aria-hidden style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-xl)', lineHeight: 1,
            background: 'var(--cream)', border: `1.5px solid ${theme.hex}`,
          }}>
            {def.emoji}
          </span>
          <h2 style={{
            flex: 1, minWidth: 0, margin: 0,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
            color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em',
          }}>
            {title}
          </h2>
        </div>

        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>
          {ideas?.ask ?? def.hint}
        </p>

        {ideas && (
          <>
            {/* Tapping one is a hint to themselves, not a contract. Nothing here
                is required, and a child who had their own idea can confirm
                without touching any of them. */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {ideas.ideas.map(idea => {
                const on = picked === idea
                return (
                  <button
                    key={idea}
                    onClick={() => { playKidSound('tap'); setPicked(on ? null : idea) }}
                    aria-pressed={on}
                    style={{
                      cursor: 'pointer', textAlign: 'left',
                      padding: '11px 13px', borderRadius: 14,
                      background: on ? theme.hex : 'var(--cream)',
                      color: on ? theme.onAccent : 'var(--ink)',
                      border: on ? `1.5px solid ${theme.hex}` : '1.5px solid rgba(26,26,46,0.1)',
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 'var(--text-base)', lineHeight: 1.25,
                    }}
                  >
                    {idea}
                  </button>
                )
              })}
            </div>
          </>
        )}

        <button
          onClick={() => { if (!busy) { playKidSound('star'); onConfirm(picked) } }}
          disabled={busy}
          style={{
            width: '100%', padding: '15px', borderRadius: 16, border: 'none',
            cursor: busy ? 'default' : 'pointer', marginBottom: 9,
            background: theme.hex, color: theme.onAccent,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Saving...' : `${ideas?.confirm ?? 'I did it'} ⭐`}
        </button>

        {/* The way out has to be as easy as the way in, or the confirm above is
            just a slower version of the tap that caused this. */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '13px', borderRadius: 16, border: 'none',
            cursor: 'pointer', background: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-md)',
            color: 'var(--ink-muted)',
          }}
        >
          Not yet
        </button>

        {childName && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '8px 2px 0', textAlign: 'center' }}>
            Only tap it once you have really done it, {childName}.
          </p>
        )}
      </div>
    </div>
  )
}
