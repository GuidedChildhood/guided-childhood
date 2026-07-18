'use client'

// Once a row of three stat tiles, now just the streak celebration. The tiles
// duplicated the Family Quests card sitting right under them (same stars, same
// today count) and the header flame already carries the streak, so each number
// now lives in exactly one place. What remains here is the only thing the tiles
// had that nothing else did: the clear cheer every fifth day of jobs in a row,
// with the lifetime total alongside.

export default function HomeStats({ streakCount, streakTotal = 0 }: { streakCount: number; streakTotal?: number }) {
  const fiveInARow = streakCount > 0 && streakCount % 5 === 0
  if (!fiveInARow) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 14, padding: '11px 14px', marginBottom: '16px' }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>🔥</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ink)', lineHeight: 1.35 }}>
        {streakCount} days of jobs in a row, brilliant.{streakTotal > streakCount ? ` ${streakTotal} days in all and counting.` : ''}
      </span>
    </div>
  )
}
