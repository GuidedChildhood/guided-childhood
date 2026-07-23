'use client'

// The balance made literal: a proper set of hanging scales that actually tips.
// One pan holds the screen time used today, the other the real world time
// earned offline (jobs, printables, lessons, learning outside). The heavier pan
// sinks on its chains, so a parent or child sees in one glance which way the
// day is leaning. The figures sit right in the pans. Modelled on the old scales
// of justice: a central column, a pivoting beam, two dishes on chains.

export default function BalanceScales({
  screenMins,
  realMins,
  earnedStars,
  screenFill,
  realFill = 'var(--deep-teal)',
  compact = false,
}: {
  screenMins: number
  realMins: number
  earnedStars: number
  screenFill: string
  realFill?: string
  compact?: boolean
}) {
  const total = screenMins + realMins
  const ratio = total > 0 ? (screenMins - realMins) / total : 0
  const clamped = Math.max(-1, Math.min(1, ratio))
  const beamDeg = -clamped * 14 // screen heavier (ratio > 0) sinks the left pan
  const screenHeavier = screenMins > realMins
  const realHeavier = realMins > screenMins

  const H = compact ? 170 : 190
  const chainH = 34 // how far the dishes hang below the beam ends

  const pan = (side: 'screen' | 'real', icon: string, big: string, small: string, fill: string, heavier: boolean) => (
    <div style={{
      position: 'absolute', top: 3, [side === 'screen' ? 'left' : 'right']: -52, width: 104,
      // The whole dish and its chains hang straight down and stay upright while
      // the beam tilts, by cancelling the beam's rotation.
      transform: `rotate(${-beamDeg}deg)`, transformOrigin: 'top center', transition: 'transform 0.7s ease',
    }}>
      {/* two chains from the beam end down to the dish rim */}
      <div style={{ position: 'relative', height: chainH, width: 70, margin: '0 auto' }}>
        <span style={{ position: 'absolute', left: 6, top: 0, width: 2, height: chainH + 4, background: 'repeating-linear-gradient(var(--ink-light) 0 3px, transparent 3px 5px)', transform: 'rotate(9deg)', transformOrigin: 'top' }} />
        <span style={{ position: 'absolute', right: 6, top: 0, width: 2, height: chainH + 4, background: 'repeating-linear-gradient(var(--ink-light) 0 3px, transparent 3px 5px)', transform: 'rotate(-9deg)', transformOrigin: 'top' }} />
      </div>
      {/* the dish, a shallow bowl carrying the figure */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        background: '#fff', border: `2.5px solid ${fill}`,
        borderRadius: '10px 10px 46px 46px',
        padding: compact ? '6px 6px 12px' : '8px 6px 15px',
        boxShadow: heavier ? `0 6px 0 ${fill}` : `0 3px 0 var(--border)`,
      }}>
        <span style={{ fontSize: compact ? '15px' : '17px', lineHeight: 1 }} aria-hidden>{icon}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: compact ? '15px' : '18px', color: 'var(--ink)', lineHeight: 1.05 }}>{big}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.15 }}>{small}</span>
      </div>
    </div>
  )

  return (
    <div style={{ position: 'relative', height: H, margin: '4px auto 12px', maxWidth: 320 }}>
      {/* the finial on top of the column, the pivot the beam swings on */}
      <span style={{ position: 'absolute', top: 24, left: '50%', width: 13, height: 13, marginLeft: -6.5, borderRadius: '50%', background: 'var(--ink)', zIndex: 3 }} />

      {/* the beam, pivoting on the finial */}
      <div style={{
        position: 'absolute', top: 34, left: '11%', right: '11%', height: 6,
        background: 'var(--ink)', borderRadius: '100px',
        transform: `rotate(${beamDeg}deg)`, transformOrigin: 'center', transition: 'transform 0.7s ease', zIndex: 2,
      }}>
        {pan('screen', '📱', `${screenMins}`, 'min screen', screenFill, screenHeavier)}
        {pan('real', '⭐', `${earnedStars}`, `${realMins} min earned`, realFill, realHeavier)}
      </div>

      {/* the central column and a steady, weighted base */}
      <div style={{ position: 'absolute', top: 30, bottom: 26, left: '50%', width: 8, marginLeft: -4, background: 'var(--ink)', borderRadius: '3px' }} />
      <div style={{ position: 'absolute', bottom: 18, left: '50%', width: 54, height: 9, marginLeft: -27, borderRadius: '100px', background: 'var(--ink)' }} />
      <div style={{ position: 'absolute', bottom: 10, left: '50%', width: 84, height: 10, marginLeft: -42, borderRadius: '100px', background: 'var(--ink)' }} />

      {/* a plain read of which way it leans, so the tilt is never ambiguous */}
      <div style={{ position: 'absolute', bottom: -8, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: screenHeavier ? screenFill : realHeavier ? realFill : 'var(--ink-muted)' }}>
        {total === 0 ? 'Level, the day is young'
          : screenHeavier ? '▼ Tipping to screen'
          : realHeavier ? 'Tipping to real life ▼'
          : 'Perfectly level'}
      </div>
    </div>
  )
}
