'use client'

import { SELF_HAIR_COLOURS, SELF_HAIRS, SELF_SKINS, SELF_SUITS, type Self } from '@/lib/planet/logic'

// The child's own explorer (slice 3b): drawn whole in SVG in the
// FriendFigure idiom, feet origin, ink outlines, so it stands on the planet
// and rides the rocket with one translate. The suit is the same drawing for
// everyone; the child chooses the skin, the hair and the suit colour, and
// the face stays a simple happy face on purpose, the way the whole cast
// keeps one expression: the posture carries the feeling, never the face.

const INK = '#1A1A2E'

/** The hair, drawn behind and over the helmet glass line. cy is the head centre. */
function Hair({ style, colour, s, cy }: { style: (typeof SELF_HAIRS)[number]; colour: string; s: number; cy: number }) {
  const r = s * 0.19
  const stroke = { stroke: INK, strokeWidth: s * 0.018, strokeLinejoin: 'round' as const }
  switch (style) {
    case 'curls':
      return (
        <g fill={colour} {...stroke}>
          {[-0.14, 0, 0.14].map(dx => <circle key={dx} cx={s * dx} cy={cy - r * 0.92} r={r * 0.42} />)}
          {[-0.2, 0.2].map(dx => <circle key={dx} cx={s * dx} cy={cy - r * 0.55} r={r * 0.34} />)}
        </g>
      )
    case 'afro':
      return <circle cx={0} cy={cy - r * 0.62} r={r * 0.95} fill={colour} {...stroke} />
    case 'braids':
      return (
        <g fill={colour} {...stroke}>
          <path d={`M${-r * 0.9} ${cy - r * 0.5} q ${r * 0.9} ${-r * 1.4} ${r * 1.8} 0 q ${-r * 0.9} ${-r * 0.7} ${-r * 1.8} 0 z`} />
          <rect x={-r * 1.05} y={cy - r * 0.45} width={r * 0.3} height={r * 1.15} rx={r * 0.15} />
          <rect x={r * 0.75} y={cy - r * 0.45} width={r * 0.3} height={r * 1.15} rx={r * 0.15} />
          <circle cx={-r * 0.9} cy={cy + r * 0.75} r={r * 0.16} fill="#F4C542" />
          <circle cx={r * 0.9} cy={cy + r * 0.75} r={r * 0.16} fill="#F4C542" />
        </g>
      )
    case 'bun':
      return (
        <g fill={colour} {...stroke}>
          <path d={`M${-r * 0.85} ${cy - r * 0.45} q ${r * 0.85} ${-r * 1.25} ${r * 1.7} 0 q ${-r * 0.85} ${-r * 0.6} ${-r * 1.7} 0 z`} />
          <circle cx={0} cy={cy - r * 1.28} r={r * 0.34} />
        </g>
      )
    case 'swoop':
      return <path d={`M${-r * 0.95} ${cy - r * 0.3} q ${-r * 0.1} ${-r * 1.5} ${r * 1.4} ${-r * 0.95} q ${r * 0.55} ${r * 0.2} ${r * 0.5} ${r * 0.75} q ${-r * 0.7} ${-r * 0.75} ${-r * 1.9} ${r * 0.2} z`} fill={colour} {...stroke} />
    case 'spikes':
      return (
        <g fill={colour} {...stroke}>
          {[-0.16, -0.05, 0.06, 0.17].map((dx, i) => (
            <path key={dx} d={`M${s * dx - r * 0.16} ${cy - r * 0.55} l ${r * 0.16} ${-r * (0.6 + (i % 2) * 0.2)} l ${r * 0.16} ${r * 0.6} z`} />
          ))}
        </g>
      )
  }
}

export default function SelfFigure({ self, size = 120, wave = false, className }: {
  self: Self
  size?: number
  /** A raised arm, for the map and the hello moments. */
  wave?: boolean
  className?: string
}) {
  const s = size
  const skin = SELF_SKINS[self.skin] ?? SELF_SKINS[2]
  const hairColour = SELF_HAIR_COLOURS[self.hairColour] ?? SELF_HAIR_COLOURS[0]
  const hairStyle = SELF_HAIRS[self.hair] ?? SELF_HAIRS[0]
  const suit = SELF_SUITS[self.suit] ?? SELF_SUITS[0]
  const headCy = -s * 0.66
  const lw = Math.max(1.2, s * 0.016)

  return (
    <g className={className}>
      <ellipse cx={0} cy={2} rx={s * 0.3} ry={s * 0.06} fill={INK} opacity={0.18} />
      {/* Boots */}
      <rect x={-s * 0.2} y={-s * 0.1} width={s * 0.16} height={s * 0.1} rx={s * 0.045} fill="#FFFFFF" stroke={INK} strokeWidth={lw} />
      <rect x={s * 0.04} y={-s * 0.1} width={s * 0.16} height={s * 0.1} rx={s * 0.045} fill="#FFFFFF" stroke={INK} strokeWidth={lw} />
      {/* Legs */}
      <rect x={-s * 0.17} y={-s * 0.3} width={s * 0.12} height={s * 0.24} rx={s * 0.05} fill={suit} stroke={INK} strokeWidth={lw} />
      <rect x={s * 0.05} y={-s * 0.3} width={s * 0.12} height={s * 0.24} rx={s * 0.05} fill={suit} stroke={INK} strokeWidth={lw} />
      {/* Arms: one down, one waving when asked */}
      <rect x={-s * 0.34} y={-s * 0.48} width={s * 0.11} height={s * 0.24} rx={s * 0.05} fill={suit} stroke={INK} strokeWidth={lw} />
      {wave ? (
        <g transform={`rotate(-135 ${s * 0.285} ${-s * 0.46})`}>
          <rect x={s * 0.23} y={-s * 0.48} width={s * 0.11} height={s * 0.24} rx={s * 0.05} fill={suit} stroke={INK} strokeWidth={lw} />
        </g>
      ) : (
        <rect x={s * 0.23} y={-s * 0.48} width={s * 0.11} height={s * 0.24} rx={s * 0.05} fill={suit} stroke={INK} strokeWidth={lw} />
      )}
      {/* Gloves */}
      <circle cx={-s * 0.285} cy={-s * 0.22} r={s * 0.05} fill="#FFFFFF" stroke={INK} strokeWidth={lw} />
      {!wave && <circle cx={s * 0.285} cy={-s * 0.22} r={s * 0.05} fill="#FFFFFF" stroke={INK} strokeWidth={lw} />}
      {wave && <circle cx={s * 0.16} cy={-s * 0.62} r={s * 0.05} fill="#FFFFFF" stroke={INK} strokeWidth={lw} />}
      {/* The suit body and its chest star */}
      <rect x={-s * 0.24} y={-s * 0.54} width={s * 0.48} height={s * 0.32} rx={s * 0.12} fill={suit} stroke={INK} strokeWidth={lw} />
      <path d={`M0 ${-s * 0.47} l ${s * 0.024} ${s * 0.05} l ${s * 0.055} 0 l ${-s * 0.044} ${s * 0.034} l ${s * 0.017} ${s * 0.053} l ${-s * 0.052} ${-s * 0.032} l ${-s * 0.052} ${s * 0.032} l ${s * 0.017} ${-s * 0.053} l ${-s * 0.044} ${-s * 0.034} l ${s * 0.055} 0 z`} fill="#FFF6DD" stroke={INK} strokeWidth={lw * 0.7} />
      {/* The head inside the helmet: skin, hair, a happy face */}
      <circle cx={0} cy={headCy} r={s * 0.19} fill={skin} stroke={INK} strokeWidth={lw} />
      <Hair style={hairStyle} colour={hairColour} s={s} cy={headCy} />
      <circle cx={-s * 0.065} cy={headCy - s * 0.01} r={s * 0.02} fill={INK} />
      <circle cx={s * 0.065} cy={headCy - s * 0.01} r={s * 0.02} fill={INK} />
      <path d={`M${-s * 0.05} ${headCy + s * 0.06} q ${s * 0.05} ${s * 0.05} ${s * 0.1} 0`} fill="none" stroke={INK} strokeWidth={lw} strokeLinecap="round" />
      {/* The helmet glass, over everything, with its shine */}
      <circle cx={0} cy={headCy} r={s * 0.27} fill="rgba(200,230,255,0.22)" stroke={INK} strokeWidth={lw * 1.1} />
      <path d={`M${-s * 0.2} ${headCy - s * 0.08} q ${s * 0.08} ${-s * 0.16} ${s * 0.24} ${-s * 0.14}`} fill="none" stroke="#FFFFFF" strokeWidth={lw * 1.4} strokeLinecap="round" opacity={0.8} />
      {/* The collar joining helmet to suit */}
      <rect x={-s * 0.13} y={-s * 0.585} width={s * 0.26} height={s * 0.05} rx={s * 0.025} fill="#FFFFFF" stroke={INK} strokeWidth={lw * 0.8} />
    </g>
  )
}
