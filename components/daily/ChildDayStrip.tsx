import Link from 'next/link'
import type { TodayState } from '@/lib/kid/today-state'
import { leftTodayLine } from '@/lib/kid/today-state'

// What the CHILD has left today, on the parent's Home.
//
// Justin, 10 September 2026, having agreed the daily sticker: both Homes should
// then show what is left today.
//
// ── THE THING A PARENT COULD NOT SEE ────────────────────────────────────────
//
// The parent's Home has always shown the PARENT's day: their check in, their
// script, their lesson. The child's day lived only on the child's phone, so the
// one question a parent asks at six o'clock, has she done her stuff, could only
// be answered by picking up someone else's device or by asking and being told
// yes. That is the exact shape of the problem this product exists to remove.
//
// ── WHY IT NAMES WHAT IS LEFT, NOT JUST THE COUNT ───────────────────────────
//
// "2 left today" is a score. "2 left today: a lesson and time outside" is
// something a parent can act on in the four minutes they have, and it is the
// difference between a number that makes them anxious and a sentence that makes
// them useful. The labels come from the step definitions, so they are the same
// words the child is reading on their own screen.
//
// ── AND IT IS NEVER RED ─────────────────────────────────────────────────────
//
// A day with things left is the normal state of a day at four in the afternoon.
// Three states, none of them a warning: white before the child has opened it,
// butter while it is going, green when it lands. Never amber and never red,
// because the moment this strip starts looking like an alarm it becomes the
// sixth thing shouting on a parent's evening and they stop reading it.
//
// The first two used to be tint sage and tint green, which are #E8F0EE and
// #E8F4EE: four points apart in one channel, so "going" and "done" were the
// same colour on a phone in a kitchen. A state that cannot be told from another
// state is not a state.
//
// And the morning is drawn, not hidden. A strip that disappears when nothing
// has happened cannot tell a parent the difference between a day not started
// and a child without the app, and the not started day is the one where a word
// at teatime still changes the outcome.

export default function ChildDayStrip({
  state,
  childName,
  onApp,
}: {
  state: TodayState
  childName: string | null
  /** No app means no five a day to report on, and nothing honest to say. */
  onApp: boolean
}) {
  if (!onApp) return null

  const opened = state.steps.length > 0
  const done = state.steps.length - state.left
  const background = state.complete ? 'var(--tint-green)' : opened ? 'var(--tint-butter)' : '#fff'

  return (
    <Link
      href="/dashboard/quests?tab=theirs"
      style={{
        display: 'block', textDecoration: 'none', marginBottom: 14,
        background,
        border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
        borderRadius: 18, padding: '13px 15px',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        {/* The sticker, or the space it will fill. Drawn either way, because a
            slot that appears out of nowhere on the day it is earned is a
            surprise, and a slot a child's parent has been watching fill is a
            small anticipation. Same reasoning as the passport slots. */}
        <span aria-hidden style={{
          flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
          background: state.stickerToday ? 'var(--terracotta)' : '#fff',
          border: state.stickerToday ? '2.5px solid var(--ink)' : '2px dashed var(--ink)',
          boxSizing: 'border-box', opacity: state.stickerToday ? 1 : 0.4,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, lineHeight: 1,
          transform: state.stickerToday ? 'rotate(-8deg)' : 'none',
        }}>
          ⭐
        </span>

        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 2,
          }}>
            {opened ? `Their day · ${done} of ${state.steps.length}` : 'Their day'}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4 }}>
            {leftTodayLine(state, childName)}
          </span>
          {state.stickersEver > 0 && (
            <span style={{
              display: 'block', marginTop: 4,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              color: 'var(--terracotta-dark)',
            }}>
              {state.stickersEver} sticker{state.stickersEver === 1 ? '' : 's'} earned
            </span>
          )}
        </span>

        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta)' }}>
          ›
        </span>
      </span>
    </Link>
  )
}
