'use client'

// The balance dial: how the day is sitting, off screen against screen, shown
// as one friendly gauge a child can read at a glance. The coloured arc is
// fixed (a green healthy zone, then amber), so the child learns where healthy
// ends; the needle moves with their real day. Screen time pushes it right,
// off screen wins (the stars they earn away from a screen) nudge it back left.
// Deterministic from the numbers, safe on the server, nothing to invent.

const GREEN = '#4C9F6B'
const AMBER = '#D98B45'
const INK = '#1A1A2E'

// Fraction 0 (far left, all off screen) to 1 (far right, screen heavy) where
// the green healthy zone ends. Kept in one place so the arc and the readout
// agree on what counts as healthy.
const GREEN_END = 0.66

function dayPosition(screenMins: number, healthyMins: number, offscreenStars: number): number {
  // How full the screen day is against the healthy level: 0 none, 1 at the
  // level, up to 1.5 well over.
  const load = healthyMins > 0 ? Math.min(screenMins / healthyMins, 1.5) : (screenMins > 0 ? 1 : 0)
  let pos = 0.12 + (load / 1.5) * 0.82
  // Off screen wins pull it back toward the green, up to a point.
  pos -= Math.min(offscreenStars, 6) / 6 * 0.16
  return Math.max(0.05, Math.min(0.95, pos))
}

function needlePoint(pos: number) {
  const cx = 110, cy = 112, L = 80
  const a = (180 - pos * 180) * (Math.PI / 180)
  return { x: cx + L * Math.cos(a), y: cy - L * Math.sin(a) }
}

export default function BalanceDial({
  screenMins = 0, healthyMins = 0, offscreenStars = 0,
}: {
  screenMins?: number
  healthyMins?: number
  offscreenStars?: number
}) {
  const pos = dayPosition(screenMins, healthyMins, offscreenStars)
  const n = needlePoint(pos)
  const inGreen = pos <= GREEN_END
  const nearEdge = pos > GREEN_END && pos <= GREEN_END + 0.12

  const headline = inGreen ? 'Lovely balance today' : nearEdge ? 'Nearly there' : 'A bit screen heavy'
  const sub = inGreen
    ? 'Plenty of off screen time in the mix. Keep it up.'
    : nearEdge
      ? 'One off screen win keeps the day in the green.'
      : 'Do a job, a printable or a lesson to tip it back.'
  const tone = inGreen ? GREEN : AMBER

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '12px 10px 12px',
      marginBottom: '14px', border: '1.5px solid rgba(26,26,46,0.06)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>
        Your balance today
      </div>

      <svg viewBox="0 0 220 130" width="200" height="118" aria-hidden="true">
        {/* the fixed zones: a green healthy arc, then amber */}
        <path d="M16 112 A94 94 0 0 1 158.4 33.4" fill="none" stroke={GREEN} strokeWidth="14" strokeLinecap="round" />
        <path d="M158.4 33.4 A94 94 0 0 1 204 112" fill="none" stroke={AMBER} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
        {/* the needle, moving with the day */}
        <line x1="110" y1="112" x2={n.x.toFixed(1)} y2={n.y.toFixed(1)} stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="110" cy="112" r="9" fill={INK} />
        <circle cx="110" cy="112" r="3.5" fill="#fff" />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '186px', marginTop: '-6px', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Off screen</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Screen</span>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', letterSpacing: '-0.02em', textAlign: 'center' }}>
        {headline}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.45, textAlign: 'center', margin: '3px 6px 0', maxWidth: 260 }}>
        {sub}
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: tone, background: inGreen ? '#E8F4EE' : '#FBEEDF', borderRadius: '100px', padding: '4px 11px', marginTop: '9px',
      }}>
        {inGreen ? 'In the green' : 'Tip it back'}
      </span>
    </div>
  )
}
