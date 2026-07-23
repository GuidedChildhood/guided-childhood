'use client'

// The streak bar: a child sees how their jobs streaks are stacking up toward
// the next Planet Friend. A streak is a full run of jobs done on time (recorded
// by the jobs streak engine); every four streaks unlocks a Friend. Four dots
// fill as the streaks bank, the next Friend waits at the end, and a warm nudge
// says how close they are. Pure display: it reads the counts and invents
// nothing.

import { STREAKS_PER_FRIEND, streaksBankedTowardNext, streaksToNextFriend, nextFriendToEarn } from '@/lib/pathway/streak-unlock'

export default function StreakBar({ completedStreaks = 0, earnedStages = 0 }: { completedStreaks?: number; earnedStages?: number }) {
  const banked = streaksBankedTowardNext(completedStreaks)
  const toNext = streaksToNextFriend(completedStreaks)
  const next = nextFriendToEarn(earnedStages)

  // Whole family home: a gentle, complete state instead of a progress bar.
  const done = !next

  return (
    <div style={{
      background: 'var(--terracotta-lt)', border: '1.5px solid #F1E4BE', borderRadius: 18,
      padding: '13px 15px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            🔥 Streaks
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink-muted)' }}>
            {completedStreaks} earned
          </span>
        </div>

        {done ? (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
            The whole family is home. Keep your streaks going to stay a superstar.
          </div>
        ) : (
          <>
            {/* Four dots toward the next Friend */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              {Array.from({ length: STREAKS_PER_FRIEND }).map((_, i) => (
                <span key={i} style={{
                  flex: 1, height: 9, borderRadius: 100,
                  background: i < banked ? 'var(--terracotta)' : 'rgba(201,154,40,0.22)',
                  transition: 'background 0.3s ease',
                }} />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
              {toNext === 1
                ? <>One more streak unlocks <b>{next!.name}</b>. So close!</>
                : <><b>{toNext}</b> more streaks to unlock <b>{next!.name}</b>. Keep your jobs on time.</>}
            </div>
          </>
        )}
      </div>

      {next && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={next.cutout} alt={next.name} width={54} height={54} style={{ objectFit: 'contain', flexShrink: 0, filter: 'grayscale(0.7) opacity(0.55) drop-shadow(0 4px 5px rgba(26,26,46,0.14))' }} />
      )}
    </div>
  )
}
