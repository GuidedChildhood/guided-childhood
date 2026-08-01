'use client'

import { useEffect } from 'react'
import { STREAKS_PER_FRIEND, streaksToNextFriend } from '@/lib/pathway/streak-unlock'

// All five done. The full screen moment.
//
// Justin: "once the system knows they sent a job, from this point a big
// celebration animation and 1 streak achieved."
//
// Modelled on Duolingo's streak screen, which is the proven shape: a takeover, a
// huge number, and a week strip of ticks so a child sees the RUN rather than a
// bare count. The number alone means little to a seven year old; seven circles
// with five filled is instantly readable.
//
// What is deliberately left out, because this is a child and the ICO Children's
// Code is explicit about engineered pressure:
//
//   Nothing about the streak being at risk. Duolingo's version leans on loss and
//   then sells a freeze. A missed day here starts the run again and everything
//   earned stays, so there is nothing to warn about and nothing to sell.
//
//   No share button. A child's streak is not marketing.

export default function KidStreakTakeover({
  streak,
  completedStreaks,
  childName,
  onClose,
}: {
  /** The run ending today, for the week of dots. Resets on a missed day. */
  streak: number
  /**
   * The cumulative count the Friends are actually bought with, which only ever
   * goes up. The Friend line has to come from THIS and not from the run.
   *
   * It used to read the run against STREAKS_PER_REWARD, a five from the star
   * week rules, while the unlock has always granted a Friend every four. So the
   * takeover promised a friend on a number that was not the unlocking number,
   * and promised it off a count that resets. A child who missed a Tuesday was
   * being told, in the middle of a celebration, that the family had moved
   * further away. Nothing about a missed day takes anything away, and this is
   * the one screen where saying otherwise would land hardest.
   */
  completedStreaks: number
  childName?: string
  onClose: () => void
}) {
  // Escape closes it, because a takeover with one way out is a trap on a device
  // where the back gesture may not be obvious.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // The last seven days ending today, so the run reads left to right into today.
  const today = new Date()
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return {
      letter: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()],
      // Filled from the right: a run of `streak` days ending today.
      filled: 6 - i < streak,
      isToday: i === 6,
    }
  })

  const toReward = streaksToNextFriend(completedStreaks)
  const earnedFriend = completedStreaks > 0 && completedStreaks % STREAKS_PER_FRIEND === 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${streak} day streak`}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'var(--butter, #FFE9A8)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 22px', textAlign: 'center',
        animation: 'gcFadeIn 0.25s ease',
      }}
    >
      <style>{`
        @keyframes gcFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes gcPop { 0% { transform: scale(0.6); opacity: 0 } 60% { transform: scale(1.08) } 100% { transform: scale(1); opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          [data-gc-pop] { animation: none !important }
        }
      `}</style>

      <div data-gc-pop style={{ animation: 'gcPop 0.5s ease both', marginBottom: '4px' }}>
        <div style={{ fontSize: '64px', lineHeight: 1 }}>🔥</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(4rem, 22vw, 7rem)', color: 'var(--ink)',
          lineHeight: 1, letterSpacing: '-0.04em', marginTop: '6px',
        }}>
          {streak}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--terracotta-dark)', marginTop: '2px' }}>
          {streak === 1 ? 'day streak' : 'day streak'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '9px', margin: '22px 0 18px' }}>
        {week.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'rgba(26,26,46,0.5)' }}>
              {d.letter}
            </span>
            <span style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-base)', fontWeight: 800, color: d.filled ? 'var(--ink)' : 'rgba(26,26,46,0.25)',
              background: d.filled ? '#fff' : 'rgba(26,26,46,0.07)',
              border: d.isToday ? '2px solid var(--terracotta)' : '2px solid transparent',
            }}>
              {d.filled ? '✓' : ''}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 6px', maxWidth: '340px', fontWeight: 600 }}>
        {earnedFriend
          ? `That is ${STREAKS_PER_FRIEND} streaks${childName ? `, ${childName}` : ''}. A new friend is on the way to your sticker book.`
          : `All five done${childName ? `, ${childName}` : ''}. Every one of them.`}
      </p>
      {!earnedFriend && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, maxWidth: '340px' }}>
          {toReward === 1
            ? 'One more day and you get a new friend for your sticker book.'
            : `${toReward} more days and you get a new friend for your sticker book.`}
        </p>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: '26px', padding: '14px 34px', borderRadius: '16px', border: 'none',
          background: 'var(--terracotta)', color: 'var(--ink)', cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        Brilliant
      </button>
    </div>
  )
}
