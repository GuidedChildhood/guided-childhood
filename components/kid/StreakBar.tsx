'use client'

// The streak bar: a child sees how their jobs streaks are stacking up toward
// the next Planet Friend. A streak is a full run of jobs done on time (recorded
// by the jobs streak engine); every four streaks unlocks a Friend. Four dots
// fill as the streaks bank, the next Friend waits at the end, and a warm nudge
// says how close they are. Pure display: it reads the counts and invents
// nothing.

import { rungLength, streaksBankedTowardNext, streaksToNextFriend, nextFriendToEarn } from '@/lib/pathway/streak-unlock'

export default function StreakBar({ completedStreaks = 0, earnedStages = 0 }: { completedStreaks?: number; earnedStages?: number }) {
  const banked = streaksBankedTowardNext(completedStreaks)
  const toNext = streaksToNextFriend(completedStreaks)
  const next = nextFriendToEarn(earnedStages)

  // Whole family home: a gentle, complete state instead of a progress bar.
  const done = !next

  // A tidy little box, deliberately. Justin, 9 August 2026: "Streaks: keep
  // this small and compact, in a tidy little box. Don't let it dominate the
  // screen." One line of type, the dots beside it, the next Friend as a small
  // face on the end. Streaks show in other places, so the home strip only has
  // to say the number and the next prize.
  return (
    <div style={{
      background: 'var(--terracotta-lt)', border: '1.5px solid #F1E4BE', borderRadius: 14,
      padding: '8px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', flexShrink: 0 }}>
        🔥 {completedStreaks}
      </span>

      {done ? (
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
          The whole family is home. Superstar.
        </span>
      ) : (
        <>
          {/* One dot per streak in the rung being worked through. The rungs
              are uneven, so this is no longer a fixed four, and it is capped
              so the long run to Cosmo draws a bar rather than confetti. */}
          <span style={{ flex: 1, minWidth: 0, display: 'flex', gap: 4, alignItems: 'center' }}>
            {Array.from({ length: rungLength(completedStreaks) }).map((_, i) => (
              <span key={i} style={{
                flex: 1, height: 7, borderRadius: 100, maxWidth: 26,
                background: i < banked ? 'var(--terracotta)' : 'rgba(201,154,40,0.22)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </span>
          <span style={{ flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
            {toNext === 1 ? <><b>1</b> more for <b>{next!.name}</b>!</> : <><b>{toNext}</b> more for <b>{next!.name}</b></>}
          </span>
        </>
      )}

      {next && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={next.cutout} alt={next.name} width={34} height={34} style={{ objectFit: 'contain', flexShrink: 0, filter: 'grayscale(0.7) opacity(0.55) drop-shadow(0 3px 4px rgba(26,26,46,0.14))' }} />
      )}
    </div>
  )
}
