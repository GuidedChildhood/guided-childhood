import type { MovementPoint } from '@/lib/working/movement'

// One concern's line, drawn small.
//
// A sparkline rather than a chart: no axes, no gridlines, no legend, no
// tooltip. The sentence beside it carries the numbers, so this only has to
// carry the SHAPE, and a parent reading five of these in a column needs them
// to be comparable at a glance rather than individually interrogable.
//
// The scale is fixed at 1 to 10 rather than fitted to the data, deliberately.
// An auto fitted line makes a wobble between 6 and 7 look identical to a climb
// from 2 to 9, which is the single most misleading thing a small chart can do,
// and this one sits next to a sentence claiming real progress.

export default function MovementLine({ points, tone }: {
  points: MovementPoint[]
  tone: 'up' | 'down' | 'flat'
}) {
  if (points.length < 2) return null

  const W = 96
  const H = 30
  const PAD = 3

  const x = (i: number) => PAD + (i / (points.length - 1)) * (W - PAD * 2)
  // 1 at the floor, 10 at the ceiling. Higher is better throughout this
  // product, so the line climbing means the week got better.
  const y = (s: number) => H - PAD - ((Math.min(10, Math.max(1, s)) - 1) / 9) * (H - PAD * 2)

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ')
  const stroke = tone === 'up' ? 'var(--retro-green)' : tone === 'down' ? 'var(--alert)' : 'var(--ink-muted)'
  const last = points[points.length - 1]

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden
      style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}
    >
      {/* The floor and ceiling, barely there, so the line has somewhere to be
          rather than floating in space. */}
      <line x1={PAD} y1={y(10)} x2={W - PAD} y2={y(10)} stroke="var(--border)" strokeWidth="1" />
      <line x1={PAD} y1={y(1)} x2={W - PAD} y2={y(1)} stroke="var(--border)" strokeWidth="1" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Where they are now, which is the one point worth marking. */}
      <circle cx={x(points.length - 1)} cy={y(last.score)} r="3.4" fill={stroke} />
    </svg>
  )
}
