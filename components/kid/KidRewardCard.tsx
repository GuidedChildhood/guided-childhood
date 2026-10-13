'use client'

import type { ReactNode } from 'react'
import HappyIcon from '@/components/kid/HappyIcon'
import { HAPPY, Sticker } from '@/components/kid/HappyNewsBits'
import { CRAYON } from '@/components/printables/drawn/crayon'

// ── ONE REWARD CARD, NEVER LOCKED (13 October 2026) ─────────────────────────
//
// The home used to carry two cards for one idea: a Use my time tile with the
// minutes on a sticker, and a separate My balance card with the stars, the
// minutes again and the timer, which only appeared once the five a day was
// done. A child met the same number twice, in two places, one of them hidden.
//
// Justin chose "one reward card, never locked". The minutes a child earned are
// theirs: hiding or dimming them until the day's five are done would turn the
// stars into a punishment and teach a child that what they earned can be taken
// back. So the card is always here. What finishing the five adds is said on
// it as a line, a reason to keep going, never a gate.
//
// The Start goes where Use my time always went (the ask page, or the live
// timer while one runs). The timer, the week chart and the device rules open
// in place underneath, exactly as the balance card's did.

export default function KidRewardCard({
  minutesReady, stars, pendingMinutes, grownUp, healthy, balanceMsg, rule, dayLine, unlocked, live,
  open, onUse, onToggle, children,
}: {
  minutesReady: number
  stars: number
  /** Minutes still waiting on a yes. */
  pendingMinutes: number
  grownUp: string
  healthy: boolean
  balanceMsg: string
  rule: string
  /** What finishing today's five adds, while it is not finished. */
  dayLine: string | null
  /** All jobs done and stars in the bank. */
  unlocked: boolean
  /** A timer is running right now. */
  live: boolean
  open: boolean
  onUse: () => void
  onToggle: () => void
  children?: ReactNode
}) {
  return (
    <section
      id="my-device-time"
      data-reward-card
      style={{
        scrollMarginTop: 80, marginBottom: 16, background: '#fff',
        border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)',
        boxShadow: `0 5px 0 ${HAPPY.ink}`, overflow: 'hidden',
      }}
    >
      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span aria-hidden style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
            background: CRAYON.butter, border: 'var(--edge)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HappyIcon name="time" size={40} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1.1, letterSpacing: '-0.01em', color: HAPPY.ink }}>
                My time
              </span>
              <Sticker accent={minutesReady > 0 ? 'butter' : 'white'} rotate={-4} size="sm">{minutesReady} min ready</Sticker>
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: 5, lineHeight: 1.35 }}>
              {stars} {stars === 1 ? 'star' : 'stars'} in your bank
            </span>
          </span>
        </div>

        {/* The parent link, on the money: what is still with the grown up. */}
        {pendingMinutes > 0 && (
          <p data-reward-pending style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', margin: '10px 0 0', lineHeight: 1.35 }}>
            +{pendingMinutes} min more when {grownUp} says yes
          </p>
        )}

        {unlocked ? (
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: HAPPY.green, margin: '8px 0 0', lineHeight: 1.35 }}>
            🔓 All your jobs are done, screen time is unlocked
          </p>
        ) : dayLine ? (
          <p data-reward-dayline style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '8px 0 0', lineHeight: 1.35 }}>
            {dayLine}
          </p>
        ) : null}

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            onClick={onUse}
            style={{
              flex: 1, padding: '13px 12px', background: HAPPY.butter, color: HAPPY.ink,
              border: `2px solid ${HAPPY.ink}`, borderRadius: 16, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
              boxShadow: `0 5px 0 ${HAPPY.ink}`,
            }}
          >
            {live ? 'Back to my timer' : 'Use my time'}
          </button>
          <button
            onClick={onToggle}
            aria-expanded={open}
            style={{
              flexShrink: 0, padding: '13px 14px', background: '#fff', color: HAPPY.ink,
              border: `2px solid ${HAPPY.ink}`, borderRadius: 16, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              boxShadow: `0 5px 0 ${HAPPY.ink}`,
            }}
          >
            {open ? 'Close' : 'My balance'}
          </button>
        </div>

        {open && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: healthy ? 'var(--tint-sage)' : 'var(--terracotta-lt)', borderRadius: 'var(--radius-tile)', padding: '11px 13px', marginTop: 16 }}>
              <span aria-hidden style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>{healthy ? '🌱' : '💪'}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.35 }}>{balanceMsg}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '10px 2px 0', lineHeight: 1.4 }}>
              {rule}
            </p>
          </>
        )}
      </div>
      {open && children}
    </section>
  )
}
