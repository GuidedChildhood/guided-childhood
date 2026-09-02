'use client'

// The streak bar: a child sees how their jobs streaks are stacking up toward
// the next Planet Friend. A streak is a full run of jobs done on time (recorded
// by the jobs streak engine); every four streaks unlocks a Friend. Four dots
// fill as the streaks bank, the next Friend waits at the end, and a warm nudge
// says how close they are. Pure display: it reads the counts and invents
// nothing.

import { rungLength, streaksBankedTowardNext, streaksToNextFriend, nextFriendToEarn } from '@/lib/pathway/streak-unlock'
import HappyIcon from '@/components/kid/HappyIcon'

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
      background: '#fff', border: '2px solid var(--ink)', borderRadius: 16,
      padding: '7px 12px 7px 8px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 0 var(--ink)',
    }}>
      {/* The flame, drawn (the Happy Newspaper pass), and the count beside it. */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <HappyIcon name="flame" size={26} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--ink)' }}>{completedStreaks}</span>
      </span>

      {done ? (
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
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
                flex: 1, height: 10, borderRadius: 100, maxWidth: 26, boxSizing: 'border-box',
                background: i < banked ? 'var(--terracotta)' : '#fff',
                border: '2px solid var(--ink)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </span>
          <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
            {toNext === 1 ? <><b>1</b> more for <b>{next!.name}</b>!</> : <><b>{toNext}</b> more for <b>{next!.name}</b></>}
          </span>
        </>
      )}

      {next && (
        // eslint-disable-next-line @next/next/no-img-element
        <span style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box', background: '#FEF7E0', border: '2px solid var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={next.cutout} alt={next.name} width={30} height={30} style={{ objectFit: 'contain', filter: 'grayscale(0.6) opacity(0.7)' }} />
        </span>
      )}
    </div>
  )
}
