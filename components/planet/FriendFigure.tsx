'use client'

import type { FriendKey, Mood } from '@/lib/planet/logic'
import { BLANKETS, friendArt } from '@/lib/planet/registry'

// One Planet Friend, drawn from the real cast art (lib/content/stage-
// characters, the cut out PNGs) with what the toy adds on top in SVG: a
// bonnet and a bib while the Friend is still a baby, a nightcap at bedtime,
// a blanket in the pod, the z z, the little MoonPhone in hand or on charge,
// and the posture that carries the mood, because the face in the art cannot
// change and does not need to. Origin is the centre of the feet, so a figure
// is placed with one translate and grows upward in negative y.

export default function FriendFigure({ friend, mood, baby = false, pyjamas = false, blanket = false, phone = 'none', size = 120, clock = false, className }: {
  friend: FriendKey
  mood: Mood
  baby?: boolean
  pyjamas?: boolean
  blanket?: boolean
  /** Where the Friend's MoonPhone is: in hand while playing, none when it is on the charger. */
  phone?: 'hand' | 'none'
  size?: number
  /** A little clock badge, for a Friend resting by itself. */
  clock?: boolean
  className?: string
}) {
  const art = friendArt(friend)
  const s = baby ? size * 0.62 : size
  const posture =
    mood === 'tired' ? `rotate(-10 0 0) scale(1 0.94)` :
    mood === 'sleepy' ? `rotate(-5 0 0)` :
    mood === 'sunbathing' ? `rotate(4 0 0)` :
    mood === 'asleep' ? `scale(0.92)` : ''

  return (
    <g className={className}>
      <ellipse cx={0} cy={2} rx={s * 0.34} ry={s * 0.07} fill="#1A1A2E" opacity={0.18} />
      <g transform={posture}>
        <image href={art.img} x={-s / 2} y={-s} width={s} height={s} preserveAspectRatio="xMidYMax meet" />

        {baby && (
          <g>
            <path d={`M${-s * 0.34} ${-s * 0.72} q ${s * 0.34} ${-s * 0.42} ${s * 0.68} 0 l ${-s * 0.06} ${s * 0.06} q ${-s * 0.28} ${-s * 0.3} ${-s * 0.56} 0 z`} fill={art.colour} stroke="#1A1A2E" strokeWidth={1.4} strokeLinejoin="round" />
            {[-0.24, -0.08, 0.08, 0.24].map(dx => <circle key={dx} cx={s * dx} cy={-s * 0.9 + Math.abs(dx) * s * 0.3} r={s * 0.035} fill="#FFF6DD" stroke="#1A1A2E" strokeWidth={1} />)}
            <path d={`M${-s * 0.16} ${-s * 0.5} q ${s * 0.16} ${s * 0.22} ${s * 0.32} 0 q ${-s * 0.16} ${s * 0.1} ${-s * 0.32} 0 z`} fill="#FFF6DD" stroke="#1A1A2E" strokeWidth={1.2} />
            <circle cx={0} cy={-s * 0.42} r={s * 0.03} fill={art.colour} />
          </g>
        )}

        {pyjamas && !baby && (
          <g>
            <path d={`M${-s * 0.3} ${-s * 0.9} L${s * 0.3} ${-s * 0.9} L${s * 0.14} ${-s * 1.14} Z`} fill={art.colour} stroke="#1A1A2E" strokeWidth={1.4} strokeLinejoin="round" />
            <circle cx={s * 0.14} cy={-s * 1.14} r={s * 0.045} fill="#FFF6DD" stroke="#1A1A2E" strokeWidth={1} />
          </g>
        )}

        {phone === 'hand' && (
          <g transform={`translate(${s * 0.4} ${-s * 0.36})`}>
            <rect x={-6} y={-11} width={12} height={22} rx={3} fill="#FFFFFF" stroke="#1A1A2E" strokeWidth={1.4} />
            <path d="M-2 -4 a3 3 0 1 0 4 3 a2.2 2.2 0 1 1 -4 -3 z" fill={art.colour} />
          </g>
        )}
      </g>

      {blanket && (
        <g>
          <rect x={-s * 0.42} y={-s * 0.46} width={s * 0.84} height={s * 0.46} rx={s * 0.1} fill={BLANKETS[friend]} stroke="#1A1A2E" strokeWidth={1.2} />
          <path d={`M${-s * 0.32} ${-s * 0.32} h${s * 0.64} M${-s * 0.32} ${-s * 0.18} h${s * 0.64}`} stroke={art.colour} strokeWidth={2} opacity={0.75} />
        </g>
      )}

      {mood === 'asleep' && (
        <text x={s * 0.34} y={-s * 0.98} fontSize={s * 0.11} fontFamily="var(--font-display)" fontWeight={900} fill="#1A1A2E" opacity={0.75}>z z</text>
      )}
      {mood === 'sleepy' && (
        <g transform={`translate(${s * 0.36} ${-s * 0.95})`}>
          <circle r={s * 0.07} fill="#FFFFFF" stroke="#1A1A2E" strokeWidth={1.2} />
          <text x={0} y={s * 0.03} textAnchor="middle" fontSize={s * 0.08} fontFamily="var(--font-display)" fontWeight={900} fill="#1A1A2E">o</text>
        </g>
      )}
      {mood === 'sunbathing' && (
        <g>
          {[-0.35, 0, 0.35].map((dx, i) => <circle key={i} cx={s * dx} cy={-s * (1.05 + (i % 2) * 0.08)} r={s * 0.035} fill="#F4C542" />)}
        </g>
      )}
      {clock && (
        <g transform={`translate(${s * 0.42} ${-s * 0.95})`}>
          <circle r={s * 0.08} fill="#FFFFFF" stroke="#1A1A2E" strokeWidth={1.4} />
          <path d={`M0 ${-s * 0.045} V0 H${s * 0.035}`} stroke="#1A1A2E" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}
