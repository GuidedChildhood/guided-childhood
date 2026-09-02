'use client'

import type { Mood, Plant } from '@/lib/planter/logic'
import { PYJAMAS, SPECIES } from '@/lib/planter/registry'

// One Planter Friend, drawn in SVG from its state. The pot is the body, the
// stem grows with the growth stage (seed, sprout, leaf, bud, bloom,
// seedhead), and the face carries the mood: happy, sleepy, tired, asleep,
// sunbathing, resting. At bedtime it wears a nightcap and a blanket. Every
// colour is from the species registry so a new plant is a data entry.
//
// Origin is the centre of the pot's base. Everything grows upward in
// negative y, so a figure can be placed with one translate.

const STEM = [6, 34, 58, 78, 96, 112]

function Face({ x, y, mood, ink, small }: { x: number; y: number; mood: Mood; ink: string; small: boolean }) {
  const e = small ? 3.6 : 5
  const r = small ? 1.7 : 2.2
  const closed = mood === 'asleep' || mood === 'resting' || mood === 'sunbathing' || mood === 'tired'
  return (
    <g>
      {closed ? (
        <>
          <path d={`M${x - e - r} ${y - 1} q ${r} ${r * 1.4} ${r * 2} 0`} stroke={ink} strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <path d={`M${x + e - r} ${y - 1} q ${r} ${r * 1.4} ${r * 2} 0`} stroke={ink} strokeWidth={1.4} fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sleepy' ? (
        <>
          <rect x={x - e - r} y={y - 1.2} width={r * 2} height={1.6} rx={0.8} fill={ink} />
          <rect x={x + e - r} y={y - 1.2} width={r * 2} height={1.6} rx={0.8} fill={ink} />
        </>
      ) : (
        <>
          <circle cx={x - e} cy={y} r={r} fill={ink} />
          <circle cx={x + e} cy={y} r={r} fill={ink} />
        </>
      )}
      {mood === 'happy' || mood === 'sunbathing' ? (
        <path d={`M${x - e} ${y + 4} q ${e} ${small ? 4 : 6} ${e * 2} 0`} stroke={ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      ) : mood === 'sleepy' ? (
        <circle cx={x} cy={y + 5} r={small ? 1.5 : 2} fill={ink} />
      ) : mood === 'tired' ? (
        <path d={`M${x - e + 1} ${y + 5} h ${e * 2 - 2}`} stroke={ink} strokeWidth={1.6} strokeLinecap="round" />
      ) : (
        <path d={`M${x - e + 1} ${y + 5} q ${e - 1} ${small ? 2 : 3} ${e * 2 - 2} 0`} stroke={ink} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

export default function PlantFigure({ plant, mood, pyjamas = false, blanket = false, className, transform, clock }: {
  plant: Plant
  mood: Mood
  /** Nightcap on, for bedtime. */
  pyjamas?: boolean
  /** A blanket over the pot, for the bed. */
  blanket?: boolean
  className?: string
  transform?: string
  /** A little clock badge, for a plant resting by itself. */
  clock?: boolean
}) {
  const sp = SPECIES[plant.species]
  const stage = Math.max(0, Math.min(5, plant.growthStage))
  const h = STEM[stage]
  const top = -40 - h
  const droop = mood === 'tired' ? -12 : mood === 'sleepy' ? -6 : 0
  const bloom = stage >= 4
  const headR = stage >= 5 ? 19 : stage >= 4 ? 15 : stage >= 3 ? 10 : stage >= 2 ? 12 : 10
  const faceInk = bloom && plant.species === 'sunny' ? '#FFF6DD' : '#1A1A2E'
  const pj = PYJAMAS[plant.species]

  return (
    <g className={className} transform={transform}>
      <path d="M-30 -36 L-24 4 L24 4 L30 -36 Z" fill="#D98B5B" />
      <rect x={-33} y={-45} width={66} height={11} rx={3} fill="#B8703F" />
      <ellipse cx={0} cy={-40} rx={27} ry={5} fill="#5B3F2E" />

      <g transform={`rotate(${droop} 0 -40)`}>
        <path d={`M0 -40 Q ${stage >= 3 ? 5 : 1} ${-40 - h / 2} 0 ${top}`} stroke={sp.leaf} strokeWidth={bloom ? 5 : 4} fill="none" strokeLinecap="round" />
        {stage >= 1 && (
          <>
            <ellipse cx={-11} cy={-40 - h * 0.5} rx={11} ry={5} fill={sp.leaf} transform={`rotate(-28 -11 ${-40 - h * 0.5})`} />
            <ellipse cx={11} cy={-40 - h * 0.58} rx={11} ry={5} fill={sp.leaf} transform={`rotate(28 11 ${-40 - h * 0.58})`} />
          </>
        )}
        {stage >= 2 && (
          <>
            <ellipse cx={-13} cy={-40 - h * 0.26} rx={13} ry={6} fill={sp.leaf} transform={`rotate(-24 -13 ${-40 - h * 0.26})`} />
            <ellipse cx={13} cy={-40 - h * 0.32} rx={13} ry={6} fill={sp.leaf} transform={`rotate(24 13 ${-40 - h * 0.32})`} />
          </>
        )}

        {stage <= 2 ? (
          <ellipse cx={0} cy={top} rx={headR} ry={headR * 0.8} fill={sp.leaf} />
        ) : stage === 3 ? (
          <ellipse cx={0} cy={top} rx={9} ry={13} fill={sp.petal} stroke={sp.leaf} strokeWidth={2} />
        ) : (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={i}
                cx={0} cy={top - headR - 6}
                rx={stage >= 5 ? 6 : 5} ry={stage >= 5 ? 13 : 11}
                fill={sp.petal} stroke={plant.species === 'daisy' ? '#E5E5E5' : 'none'}
                transform={`rotate(${i * 30} 0 ${top})`}
              />
            ))}
            <circle cx={0} cy={top} r={headR} fill={sp.centre} />
          </>
        )}

        <Face x={0} y={top - (stage === 3 ? 2 : 1)} mood={mood} ink={faceInk} small={stage <= 3} />

        {mood === 'asleep' && (
          <text x={16} y={top - 16} fontSize={11} fontFamily="var(--font-display)" fontWeight={900} fill="#1A1A2E" opacity={0.75}>z z</text>
        )}

        {pyjamas && (
          <g>
            <path d={`M${-headR - 2} ${top - headR * 0.5} L${headR + 2} ${top - headR * 0.5} L${headR * 0.4} ${top - headR - 22} Z`} fill={pj.cap} />
            <circle cx={headR * 0.4} cy={top - headR - 22} r={4.5} fill="#FFF6DD" />
          </g>
        )}
      </g>

      {blanket && (
        <g>
          <rect x={-34} y={-50} width={68} height={24} rx={9} fill={pj.blanket} stroke="#1A1A2E" strokeWidth={1.2} />
          <path d="M-26 -42 h52 M-26 -35 h52" stroke={pj.cap} strokeWidth={2} opacity={0.8} />
        </g>
      )}

      {clock && (
        <g transform="translate(30 -60)">
          <circle r={9} fill="#FFFFFF" stroke="#1A1A2E" strokeWidth={1.4} />
          <path d="M0 -5 V0 H4" stroke="#1A1A2E" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}
