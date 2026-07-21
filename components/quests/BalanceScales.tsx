'use client'

// The balance made literal: a set of scales that actually tips. One pan holds
// the screen time used today, the other the real world time earned offline
// (jobs, printables, lessons, learning outside). The heavier pan dips, so a
// parent sees in one glance which way the day is leaning and what would set it
// right. Numbers sit in the pans so it is never vague. The whole point of the
// star economy, drawn as the oldest picture of fairness there is.

export default function BalanceScales({
  screenMins,
  realMins,
  earnedStars,
  screenFill,
  realFill = 'var(--deep-teal)',
}: {
  screenMins: number
  realMins: number
  earnedStars: number
  screenFill: string
  realFill?: string
}) {
  const total = screenMins + realMins
  // Which way, and how far. Screen heavier tips the beam so the screen pan
  // drops on the left; real life heavier drops the right. Capped so it always
  // reads as a scale, never a cliff.
  const ratio = total > 0 ? (screenMins - realMins) / total : 0
  const clamped = Math.max(-1, Math.min(1, ratio))
  const beamDeg = -clamped * 15 // screen heavier (ratio > 0) drops the left pan
  const screenHeavier = screenMins > realMins
  const realHeavier = realMins > screenMins

  const pan = (
    side: 'screen' | 'real',
    icon: string,
    big: string,
    small: string,
    fill: string,
    heavier: boolean,
  ) => (
    <div style={{ position: 'absolute', top: '50%', [side === 'screen' ? 'left' : 'right']: 0, width: 96, marginTop: -3, [side === 'screen' ? 'marginLeft' : 'marginRight']: -48, transform: `rotate(${-beamDeg}deg)`, transformOrigin: 'top center', transition: 'transform 0.7s ease' }}>
      {/* the two hanging strings */}
      <div style={{ position: 'relative', height: 20, marginLeft: 'auto', marginRight: 'auto', width: 62 }}>
        <span style={{ position: 'absolute', left: 4, top: 0, width: 1.5, height: 22, background: 'var(--border)', transform: 'rotate(11deg)', transformOrigin: 'top' }} />
        <span style={{ position: 'absolute', right: 4, top: 0, width: 1.5, height: 22, background: 'var(--border)', transform: 'rotate(-11deg)', transformOrigin: 'top' }} />
      </div>
      {/* the pan itself */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
        background: '#fff', border: `2px solid ${fill}`, borderRadius: '14px',
        padding: '8px 6px 9px', boxShadow: heavier ? `0 5px 0 ${fill}` : `0 3px 0 var(--border)`,
      }}>
        <span style={{ fontSize: '17px', lineHeight: 1 }} aria-hidden>{icon}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.05 }}>{big}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.2 }}>{small}</span>
      </div>
    </div>
  )

  return (
    <div style={{ position: 'relative', height: 128, margin: '4px auto 14px', maxWidth: 320 }}>
      {/* the beam, pivoting on the centre post */}
      <div style={{
        position: 'absolute', top: 30, left: '13%', right: '13%', height: 7,
        background: 'var(--ink)', borderRadius: '100px',
        transform: `rotate(${beamDeg}deg)`, transformOrigin: 'center', transition: 'transform 0.7s ease',
      }}>
        {/* centre knob on the beam */}
        <span style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, marginLeft: -6, marginTop: -6, borderRadius: '50%', background: 'var(--ink)' }} />
        {pan('screen', '📱', `${screenMins}`, 'min screen', screenFill, screenHeavier)}
        {pan('real', '⭐', `${earnedStars}`, `${realMins} min earned`, realFill, realHeavier)}
      </div>

      {/* the fulcrum: a post and a wide steady base */}
      <div style={{ position: 'absolute', top: 33, left: '50%', marginLeft: -9, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: '52px solid var(--ink)' }} />
      <div style={{ position: 'absolute', top: 84, left: '50%', marginLeft: -34, width: 68, height: 8, borderRadius: '100px', background: 'var(--ink)' }} />
      <div style={{ position: 'absolute', top: 90, left: '50%', marginLeft: -46, width: 92, height: 7, borderRadius: '100px', background: 'var(--border)' }} />

      {/* a tiny plain read of which way it leans, under the base */}
      <div style={{ position: 'absolute', top: 104, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        {total === 0 ? 'Level, the day is young'
          : screenHeavier ? 'Tipping to screen'
          : realHeavier ? 'Tipping to real life'
          : 'Perfectly level'}
      </div>
    </div>
  )
}
