// The streak flame badge for the dashboard header. Butter when today's
// practice is done, grey with a nudge when the streak stands from
// yesterday but has not been kept alive yet. Renders nothing while
// there is no streak to show. Server safe: no hooks, pure markup.

interface StreakFlameProps {
  count: number
  aliveToday: boolean
}

export default function StreakFlame({ count, aliveToday }: StreakFlameProps) {
  if (count <= 0) return null

  const flame = aliveToday ? 'var(--terracotta)' : 'var(--ink-light)'
  const flameCore = aliveToday ? 'var(--terracotta-lt)' : 'var(--cream)'

  return (
    <div
      aria-label={aliveToday ? `${count} day streak, alive today` : `${count} day streak, keep it alive today`}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
        background: aliveToday ? 'var(--terracotta-lt)' : 'var(--cream)',
        border: `1.5px solid ${aliveToday ? 'var(--terracotta)' : 'var(--border)'}`,
        borderRadius: '100px', padding: '7px 13px',
      }}
    >
      <svg width="15" height="19" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
        <path
          d="M12 1.6c.5 4.4 2.2 6.4 3.9 8.8 1.3 1.8 2.1 3.5 2.1 5.5 0 3.8-2.7 6.5-6 6.5s-6-2.7-6-6.5c0-2.7 1.5-4.7 3.1-6.6C10.5 7.6 11.7 5.6 12 1.6z"
          fill={flame}
        />
        <path
          d="M12 12.4c1.7 2 2.7 3.1 2.7 4.8 0 1.8-1.2 3.1-2.7 3.1s-2.7-1.3-2.7-3.1c0-1.7 1-2.8 2.7-4.8z"
          fill={flameCore}
        />
      </svg>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: aliveToday ? 'var(--terracotta-dark)' : 'var(--ink)', lineHeight: 1.1 }}>
          {count}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
          {aliveToday ? 'day streak' : 'keep it alive today'}
        </div>
      </div>
    </div>
  )
}
