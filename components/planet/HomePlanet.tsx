'use client'

import { useRef, useState } from 'react'
import type { Friend, FriendKey, Mood, Tier } from '@/lib/planet/logic'
import { FRIEND_KEYS, isGrownUp } from '@/lib/planet/logic'
import { friendArt } from '@/lib/planet/registry'
import FriendFigure from './FriendFigure'

// The HomePlanetNode (design section 2.1): the sandbox, drawn in one SVG so
// it is one screen at phone width and simply scales up on a tablet or
// desktop. Everything that looks liftable lifts. Nothing scores, nothing
// fails, and the only clock on screen is the star moving across the sky,
// which is the starlight component made visible.
//
// Drag is pointer events on the SVG, no physics engine. The scene knows
// where things are and what they landed on; what that MEANS (a nap, the
// sunshine mission) is the parent component's business, so this file has
// callbacks and no rules.
//
// On CSS transforms: the breathing and wiggle classes animate CSS
// transform, which REPLACES an SVG transform attribute on the same element.
// So an animated class always sits on an inner group and the position on
// the outer one. Folding them together makes a Friend jump to the origin
// the moment it breathes.

export const SCENE_W = 390
export const SCENE_H = 560
const PLANET = { cx: 195, cy: 700, r: 400 }
const POD = { x: 288, y: 236, w: 94, h: 104 }
const CATCHER = { x: 10, y: 222, w: 100, h: 116 }
const SHAKER_HOME = { x: 44, y: 420 }
const NURSERY = { x: 62, y: 84 }
const CHARGER = { x: 195, y: 470 }

export type DropZone = 'pod' | 'catcher'
export type Sky = 'day' | 'evening' | 'night'

type Drag = { kind: 'friend' | 'shaker'; id: string; x: number; y: number; startX: number; startY: number; moved: boolean }

/** The planet's surface height at x, so things stand on the curve. */
export function surfaceY(x: number): number {
  return PLANET.cy - Math.sqrt(PLANET.r * PLANET.r - (x - PLANET.cx) * (x - PLANET.cx))
}

function inRect(p: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h
}

const SKY: Record<Sky, { top: string; bottom: string; body: string; bodyDark: string }> = {
  day: { top: '#B9DDF5', bottom: '#E6F3FC', body: '#8FD1B4', bodyDark: '#6FB998' },
  evening: { top: '#F3B48E', bottom: '#FBDCC3', body: '#86BFA8', bodyDark: '#68A48C' },
  night: { top: '#141A3C', bottom: '#26305F', body: '#3E6A62', bodyDark: '#2E5149' },
}

/** Where the active Friends stand, centred by how many there are. */
export function standingX(count: number): number[] {
  if (count <= 1) return [195]
  if (count === 2) return [130, 260]
  return [95, 195, 295]
}

export default function HomePlanet({
  friends, moods, tier, childAge, sky, starEnergy, growthStage, accent, pyjamas, wiggle, sparkle, boopCrater,
  onDropFriend, onTickle, onSprinkle, onBoop, onCloud, onNursery, onInteract,
}: {
  friends: Friend[]
  moods: Record<string, Mood>
  tier: Tier
  childAge: number
  sky: Sky
  /** 0 to 1, the average starlight of the awake Friends. Drives the star. */
  starEnergy: number
  growthStage: number
  /** The child's own theme colour, for the flag. */
  accent: string
  pyjamas: boolean
  wiggle: FriendKey | null
  sparkle: FriendKey | null
  boopCrater: number | null
  onDropFriend: (friend: FriendKey, zone: DropZone | null) => void
  onTickle: (friend: FriendKey) => void
  onSprinkle: (friend: FriendKey) => void
  onBoop: (crater: number) => void
  onCloud: (friend: FriendKey, on: boolean) => void
  onNursery: () => void
  onInteract: () => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [sprinklingOn, setSprinklingOn] = useState<FriendKey | null>(null)
  const colours = SKY[sky]
  const xs = standingX(friends.length)
  const babies = FRIEND_KEYS.filter(k => !friends.some(f => f.key === k))

  function toSvg(e: React.PointerEvent): { x: number; y: number } {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: 0, y: 0 }
    const p = pt.matrixTransform(ctm.inverse())
    return { x: p.x, y: p.y }
  }

  function begin(e: React.PointerEvent, kind: 'friend' | 'shaker', id: string) {
    onInteract()
    const p = toSvg(e)
    try { svgRef.current?.setPointerCapture(e.pointerId) } catch { /* not all browsers */ }
    setDrag({ kind, id, x: p.x, y: p.y, startX: p.x, startY: p.y, moved: false })
  }

  function move(e: React.PointerEvent) {
    if (!drag) return
    const p = toSvg(e)
    const moved = drag.moved || Math.hypot(p.x - drag.startX, p.y - drag.startY) > 6
    setDrag({ ...drag, x: p.x, y: p.y, moved })
    if (drag.kind === 'shaker') {
      const over = friends.find((f, i) => !f.cooldown && Math.hypot(p.x - xs[i], p.y - (surfaceY(xs[i]) - 60)) < 64)
      setSprinklingOn(over ? over.key : null)
    }
  }

  function end() {
    if (!drag) return
    const p = { x: drag.x, y: drag.y }
    if (drag.kind === 'friend') {
      const key = drag.id as FriendKey
      if (!drag.moved) onTickle(key)
      else onDropFriend(key, inRect(p, POD) ? 'pod' : inRect(p, CATCHER) ? 'catcher' : null)
    } else if (sprinklingOn) {
      onSprinkle(sprinklingOn)
    }
    setDrag(null)
    setSprinklingOn(null)
  }

  const draggingFriend = drag?.kind === 'friend'
  const starX = 80 + (1 - starEnergy) * 230
  const starY = 150 - Math.sin(Math.PI * (0.2 + 0.6 * (1 - starEnergy))) * 90
  const podY = surfaceY(POD.x + POD.w / 2)
  const catcherY = surfaceY(CATCHER.x + CATCHER.w / 2)

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      width="100%"
      style={{ display: 'block', touchAction: 'none', userSelect: 'none', borderRadius: 24 }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="The home planet"
      role="img"
    >
      <defs>
        <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colours.top} />
          <stop offset="1" stopColor={colours.bottom} />
        </linearGradient>
        <radialGradient id="pl-glow">
          <stop offset="0" stopColor="#FFF3B0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFF3B0" stopOpacity={0} />
        </radialGradient>
        <clipPath id="pl-body"><circle cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} /></clipPath>
      </defs>

      {/* the sky, the stars, the star that is the Friends' starlight */}
      <rect x={0} y={0} width={SCENE_W} height={SCENE_H} fill="url(#pl-sky)" />
      {[24, 150, 250, 330, 372, 200, 300].map((x, i) => (
        <circle key={x} cx={x} cy={20 + (i * 37) % 120} r={sky === 'night' ? 1.8 : 1.2} fill="#FFFFFF" opacity={sky === 'night' ? 0.95 : 0.55} />
      ))}
      {sky === 'night' ? (
        <g>
          <circle cx={310} cy={72} r={24} fill="#FFF3C4" />
          <circle cx={300} cy={66} r={21} fill={colours.top} />
        </g>
      ) : (
        <g className="pl-star" style={{ transformOrigin: `${starX}px ${starY}px` }}>
          <circle cx={starX} cy={starY} r={56} fill="url(#pl-glow)" />
          <circle cx={starX} cy={starY} r={23} fill="#F4C542" />
        </g>
      )}
      {growthStage >= 5 && sky !== 'night' && (
        <g>
          <circle cx={330} cy={64} r={16} fill="#E4E1EE" stroke="#1A1A2E" strokeWidth={2} />
          <circle cx={324} cy={60} r={3} fill="#C9C5D8" />
          <circle cx={335} cy={70} r={2.2} fill="#C9C5D8" />
        </g>
      )}

      {/* the nursery, in orbit: the babies who have not grown up yet */}
      <g transform={`translate(${NURSERY.x} ${NURSERY.y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onNursery() }} style={{ cursor: 'pointer' }}>
       <g className="pl-float">
        <path d={`M0 30 V60`} stroke="#1A1A2E" strokeWidth={1.5} strokeDasharray="3 4" opacity={0.5} />
        <ellipse cx={0} cy={32} rx={44} ry={12} fill="#1A1A2E" opacity={0.15} />
        <path d="M-40 26 a40 34 0 0 1 80 0 z" fill="rgba(255,255,255,0.55)" stroke="#1A1A2E" strokeWidth={2.2} />
        <rect x={-46} y={24} width={92} height={10} rx={5} fill="#D8D2E8" stroke="#1A1A2E" strokeWidth={2} />
        {babies.slice(0, 4).map((k, i) => (
          <g key={k} transform={`translate(${-27 + i * 18} 24) scale(0.34)`}>
            <FriendFigure friend={k} mood="asleep" baby size={100} />
          </g>
        ))}
       </g>
      </g>

      {/* the planet body and what has grown on it */}
      <circle cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} fill={colours.body} stroke="#1A1A2E" strokeWidth={3} />
      <g clipPath="url(#pl-body)">
        {[{ x: 150, y: 400, r: 16 }, { x: 250, y: 430, r: 12 }, { x: 95, y: 470, r: 14 }].map((c, i) => (
          <g key={i} onPointerDown={e => { e.stopPropagation(); onInteract(); onBoop(i) }} style={{ cursor: 'pointer' }}>
            <ellipse cx={c.x} cy={c.y} rx={c.r} ry={c.r * 0.55} fill={colours.bodyDark} stroke="#1A1A2E" strokeWidth={1.5} />
            {boopCrater === i && <circle className="pl-puff" cx={c.x} cy={c.y - 6} r={10} fill="#FFFFFF" opacity={0.7} />}
          </g>
        ))}
        {growthStage >= 4 && (
          <ellipse cx={PLANET.cx} cy={505} rx={250} ry={34} fill="none" stroke="#FFF6DD" strokeWidth={14} opacity={0.75} />
        )}
        {growthStage >= 4 && (
          <ellipse cx={PLANET.cx} cy={505} rx={250} ry={34} fill="none" stroke="#1A1A2E" strokeWidth={2} opacity={0.5} />
        )}
      </g>
      {growthStage >= 1 && [40, 170, 236, 350].map(x => (
        <path key={x} d={`M${x - 6} ${surfaceY(x) + 2} q 3 -12 6 0 q 3 -12 6 0`} stroke="#3E8F5A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      ))}
      {growthStage >= 2 && (
        <g transform={`translate(160 ${surfaceY(160)})`}>
          <path d="M0 2 V-44" stroke="#1A1A2E" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M1 -44 h24 l-6 8 l6 8 h-24 z" fill={accent} stroke="#1A1A2E" strokeWidth={1.8} strokeLinejoin="round" />
        </g>
      )}
      {growthStage >= 3 && (
        <g transform={`translate(236 ${surfaceY(236)})`}>
          <path d="M-22 2 V-18 a22 22 0 0 1 44 0 V2 z" fill="#FFF6DD" stroke="#1A1A2E" strokeWidth={2} />
          <rect x={-6} y={-16} width={12} height={18} rx={3} fill={accent} stroke="#1A1A2E" strokeWidth={1.5} />
          <circle cx={12} cy={-20} r={4} fill="#BFE3F7" stroke="#1A1A2E" strokeWidth={1.2} />
        </g>
      )}

      {/* the MoonPhone charger pad, where phones go when the star goes down */}
      <g transform={`translate(${CHARGER.x} ${CHARGER.y})`}>
        <rect x={-34} y={-8} width={68} height={16} rx={8} fill="#FFFFFF" stroke="#1A1A2E" strokeWidth={2} />
        <path d="M2 -5 l-5 6 h4 l-2 5 l6 -7 h-4 z" fill="#F4C542" stroke="#1A1A2E" strokeWidth={1} strokeLinejoin="round" />
        {friends.filter(f => moods[f.key] !== 'happy').map((f, i) => (
          <g key={f.key} transform={`translate(${-22 + i * 16} -16)`}>
            <rect x={-5} y={-9} width={10} height={18} rx={2.5} fill="#FFFFFF" stroke="#1A1A2E" strokeWidth={1.3} />
            <circle cx={0} cy={-2} r={2.2} fill={friendArt(f.key).colour} />
          </g>
        ))}
      </g>

      {/* the sun catcher, the offline transition zone for real sunshine */}
      <g transform={`translate(${CATCHER.x + CATCHER.w / 2} ${catcherY})`}>
        <path d="M-16 0 L-4 -30 M16 0 L4 -30 M0 -2 V-30" stroke="#1A1A2E" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M-30 -46 a30 20 0 0 0 60 0 z" fill={draggingFriend ? '#F4C542' : '#FFFFFF'} stroke="#1A1A2E" strokeWidth={draggingFriend ? 4 : 2.5} strokeLinejoin="round" />
        <path d="M0 -46 V-62" stroke="#1A1A2E" strokeWidth={2} strokeLinecap="round" />
        <circle cx={0} cy={-66} r={5} fill="#F4C542" stroke="#1A1A2E" strokeWidth={1.5} />
        {draggingFriend && [-1, 0, 1].map(k => <path key={k} d={`M${k * 18} -78 v-12`} stroke="#F4C542" strokeWidth={3} strokeLinecap="round" />)}
      </g>

      {/* the sleep pod, the nap area */}
      <g transform={`translate(${POD.x + POD.w / 2} ${podY})`}>
        <ellipse cx={0} cy={4} rx={44} ry={8} fill="#1A1A2E" opacity={0.15} />
        <rect x={-42} y={-16} width={84} height={20} rx={8} fill="#D8D2E8" stroke={draggingFriend ? '#F4C542' : '#1A1A2E'} strokeWidth={draggingFriend ? 4 : 2.5} />
        <path d="M-38 -16 a38 40 0 0 1 76 0 z" fill="rgba(255,255,255,0.5)" stroke={draggingFriend ? '#F4C542' : '#1A1A2E'} strokeWidth={draggingFriend ? 4 : 2.5} />
        <rect x={-30} y={-24} width={60} height={12} rx={6} fill="#FFF6DD" stroke="#1A1A2E" strokeWidth={1.5} />
      </g>

      {/* the clouds, Tier 2 only: a little shade over a Friend */}
      {tier >= 2 && friends.map((f, i) => (
        <g key={`cloud-${f.key}`} transform={`translate(${xs[i]} ${surfaceY(xs[i]) - 176})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onCloud(f.key, !f.cloud) }} style={{ cursor: 'pointer' }}>
          <path d="M-26 8 a12 12 0 0 1 8 -22 a16 16 0 0 1 30 -4 a12 12 0 0 1 14 20 z" fill={f.cloud ? '#FFFFFF' : 'rgba(255,255,255,0.45)'} stroke="#1A1A2E" strokeWidth={2} strokeLinejoin="round" opacity={f.cloud ? 1 : 0.7} />
        </g>
      ))}

      {/* the Friends */}
      {friends.map((f, i) => {
        const mood = moods[f.key] ?? 'happy'
        const baby = !isGrownUp(f.key, childAge)
        const dragging = drag?.kind === 'friend' && drag.id === f.key
        if (dragging && drag) {
          return (
            <g key={f.key} transform={`translate(${drag.x} ${drag.y + 30}) scale(1.06)`} style={{ filter: 'drop-shadow(0 8px 0 rgba(26,26,46,0.25))' }}>
              <FriendFigure friend={f.key} mood={mood} baby={baby} pyjamas={pyjamas} />
            </g>
          )
        }
        if (f.cooldown?.reason === 'nap') {
          return (
            <g key={f.key} transform={`translate(${POD.x + POD.w / 2} ${podY - 14}) scale(0.62)`}>
              <g className="pl-breathe"><FriendFigure friend={f.key} mood="asleep" baby={baby} pyjamas={pyjamas} blanket /></g>
            </g>
          )
        }
        if (f.cooldown?.reason === 'sunlight') {
          return (
            <g key={f.key} transform={`translate(${CATCHER.x + CATCHER.w / 2} ${catcherY - 6}) scale(0.6)`}>
              <g className="pl-breathe"><FriendFigure friend={f.key} mood="sunbathing" baby={baby} /></g>
            </g>
          )
        }
        const x = xs[i]
        return (
          <g
            key={f.key}
            transform={`translate(${x} ${surfaceY(x)})`}
            onPointerDown={e => { if (f.cooldown) { onInteract(); return } e.stopPropagation(); begin(e, 'friend', f.key) }}
            style={{ cursor: f.cooldown ? 'default' : 'grab' }}
          >
            <g className={wiggle === f.key ? 'pl-wiggle' : undefined}>
              <FriendFigure friend={f.key} mood={mood} baby={baby} pyjamas={pyjamas} phone={mood === 'happy' && !baby ? 'hand' : 'none'} clock={f.cooldown?.reason === 'ambient'} />
            </g>
            {sparkle === f.key && (
              <g className="pl-sparkle">
                {[-30, 0, 30].map((dx, k) => <circle key={k} cx={dx} cy={-130 - (k % 2) * 16} r={4.5} fill="#F4C542" />)}
              </g>
            )}
            {sprinklingOn === f.key && (
              <g className="pl-dust">
                {[-10, 0, 10].map((dx, k) => <circle key={k} cx={dx} cy={-125 + k * 9} r={3} fill="#FFF3B0" stroke="#F4C542" strokeWidth={1} />)}
              </g>
            )}
          </g>
        )
      })}

      {/* the stardust shaker, on its hook or in the hand */}
      <g
        transform={drag?.kind === 'shaker' ? `translate(${drag.x} ${drag.y}) rotate(-30) scale(1.1)` : `translate(${SHAKER_HOME.x} ${SHAKER_HOME.y})`}
        onPointerDown={e => { e.stopPropagation(); begin(e, 'shaker', 'shaker') }}
        style={{ cursor: 'grab' }}
      >
        <path d="M-13 -14 h26 v30 q0 6 -6 6 h-14 q-6 0 -6 -6 z" fill="#FFFFFF" stroke="#1A1A2E" strokeWidth={2.5} strokeLinejoin="round" />
        <rect x={-15} y={-22} width={30} height={10} rx={4} fill="#F4C542" stroke="#1A1A2E" strokeWidth={2} />
        {[-6, 0, 6].map(dx => <circle key={dx} cx={dx} cy={-17} r={1.4} fill="#1A1A2E" />)}
        <path d="M-6 4 l2 -5 l2 5 l-5 -3 h6 z" fill="#F4C542" />
        <path d="M5 12 l2 -5 l2 5 l-5 -3 h6 z" fill="#F4C542" />
      </g>
    </svg>
  )
}
