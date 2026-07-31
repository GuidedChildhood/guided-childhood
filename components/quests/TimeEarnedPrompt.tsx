'use client'

import Link from 'next/link'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The moment straight after a grown up says yes.
//
// Justin: "once click it adds timer time, maybe flashes up start timer now."
//
// The minutes already landed the instant the tick was approved, and the child's
// own phone already hears about it: the approve route pushes "that is 10
// minutes of device time to use. Nice one!" So the thing that was missing was
// never the reward, it was the parent's side of the same second. A child stands
// next to you having just been told they have earned ten minutes, and the app
// that told them said nothing at all to the person holding the phone.
//
// So this names what just landed and offers the one thing a parent is about to
// go looking for anyway. It is an offer and not a demand: earned minutes keep
// perfectly well, plenty of jobs get confirmed at the kitchen table hours
// before anyone watches anything, and a card that insisted on starting a timer
// would turn saying yes into a commitment to screen time. Hence a dismiss that
// costs nothing and no countdown on the card itself.
//
// One component, used by the approve queue on the board and by the agree tab on
// the add a job page. Both places do the same thing at the same moment, and
// this product has already learned what happens when that gets built twice.

export default function TimeEarnedPrompt({
  earned, onDismiss,
}: {
  /** What was just confirmed, or null when nothing has been. */
  earned: { childName: string; stars: number } | null
  onDismiss: () => void
}) {
  if (!earned) return null
  const minutes = earned.stars * STAR_MINUTES
  const who = earned.childName && earned.childName !== 'Your child' ? earned.childName : 'They'

  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        background: 'var(--tint-sage)', border: '1.5px solid var(--retro-green, #2F8F6B)',
        borderRadius: 16, padding: '13px 15px', marginBottom: 14,
        animation: 'gcEarnedIn 0.3s ease both',
      }}
    >
      <span aria-hidden style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>⭐</span>
      <span style={{ flex: 1, minWidth: 170, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.45 }}>
        <strong>{minutes} minutes</strong> landed for {who === 'They' ? 'them' : who}, from {earned.stars} star{earned.stars === 1 ? '' : 's'}.
      </span>
      <Link
        href="/dashboard/quests/timer"
        style={{
          flexShrink: 0, textDecoration: 'none', borderRadius: 12,
          padding: '10px 15px', background: 'var(--terracotta)', color: 'var(--ink)',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
          boxShadow: '0 3px 0 var(--terracotta-dark)',
        }}
      >
        Start the timer
      </Link>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Not now"
        title="Not now"
        style={{
          flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 6px', fontSize: 17, lineHeight: 1, color: 'var(--ink-muted)',
        }}
      >
        ✕
      </button>
      <style>{`
        @keyframes gcEarnedIn {
          0% { opacity: 0; transform: translateY(-4px) }
          100% { opacity: 1; transform: none }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes gcEarnedIn { 0%, 100% { opacity: 1; transform: none } }
        }
      `}</style>
    </div>
  )
}
