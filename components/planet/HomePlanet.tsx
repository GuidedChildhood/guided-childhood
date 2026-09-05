'use client'

import { useRef, useState } from 'react'
import type { Friend, FriendKey, Mood, Outfit, PartKey, Placed, Tier } from '@/lib/planet/logic'
import { FRIEND_KEYS, PART_ZONE, SLOTS, isGrownUp } from '@/lib/planet/logic'
import { friendArt } from '@/lib/planet/registry'
import FriendFigure from './FriendFigure'
import PartArt from './PartArt'
import { PLANET, SCENE_H, SCENE_W, SLOT_POS, sceneFromClient, surfaceY } from './scene'

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

export { SCENE_W, SCENE_H, surfaceY } from './scene'
const POD = { x: 288, y: 236, w: 94, h: 104 }
const CATCHER = { x: 10, y: 222, w: 100, h: 116 }
const SHAKER_HOME = { x: 44, y: 420 }
const NURSERY = { x: 62, y: 84 }
const CHARGER = { x: 195, y: 470 }

/** What a Friend landed on: the pod, the sun catcher, or a part the child built with (slice 3). */
export type DropZone = 'pod' | 'catcher' | { part: PartKey }
/** Something carried from the parts box over the planet. */
export type Carry = { kind: 'part'; part: PartKey } | { kind: 'outfit'; outfit: Outfit }
export type Sky = 'day' | 'evening' | 'night'

type Drag = { kind: 'friend' | 'shaker' | 'part'; id: string; x: number; y: number; startX: number; startY: number; moved: boolean }

/** The free slot a part can go in, nearest to a point, within reach. */
export function nearestFreeSlot(part: PartKey, placed: Placed[], p: { x: number; y: number }, reach = 90): string | null {
  let best: string | null = null
  let bestD = reach
  for (const s of SLOTS) {
    if (s.zone !== PART_ZONE[part]) continue
    if (placed.some(x => x.slot === s.id && x.part !== part)) continue
    const pos = SLOT_POS[s.id]
    const d = s.zone === 'ring' ? Math.abs(p.y - pos.y) : Math.hypot(p.x - pos.x, p.y - (pos.y - (s.zone === 'sky' ? 0 : 24)))
    if (d < bestD) { bestD = d; best = s.id }
  }
  return best
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
  friends, moods, tier, childAge, sky, starEnergy, growthStage, placed = [], plots = 0, wearing = {}, carrying = null, using = null, accent, pyjamas, wiggle, sparkle, boopCrater,
  onDropFriend, onTickle, onSprinkle, onBoop, onCloud, onNursery, onInteract, onMovePart, onPartTap, onSvg,
}: {
  friends: Friend[]
  /** The parts on the planet, by slot (slice 3). */
  placed?: Placed[]
  /** How many parts the planet has room for right now. */
  plots?: number
  /** Who wears what. */
  wearing?: Partial<Record<FriendKey, Outfit>>
  /** Something being carried from the box: the places it can go light up. */
  carrying?: Carry | null
  /** A part a Friend is playing on right now. */
  using?: PartKey | null
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
  /** A placed part dragged to another slot, or off the bottom (null) back to the box. */
  onMovePart?: (part: PartKey, slot: string | null) => void
  onPartTap?: (part: PartKey) => void
  /** The scene's own svg, so the root can drop things from the box onto it. */
  onSvg?: (el: SVGSVGElement | null) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [sprinklingOn, setSprinklingOn] = useState<FriendKey | null>(null)
  const colours = SKY[sky]
  const xs = standingX(friends.length)
  const babies = FRIEND_KEYS.filter(k => !friends.some(f => f.key === k))
  void plots

  function toSvg(e: React.PointerEvent): { x: number; y: number } {
    const svg = svgRef.current
    return svg ? sceneFromClient(svg, e.clientX, e.clientY) : { x: 0, y: 0 }
  }

  function begin(e: React.PointerEvent, kind: 'friend' | 'shaker' | 'part', id: string) {
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
      else {
        // A part first (a Friend on the trampoline), then the pod and the catcher.
        const onPart = placed.find(x => { const z = PART_ZONE[x.part]; if (z === 'sky' || z === 'ring') return false; const pos = SLOT_POS[x.slot]; return pos && Math.hypot(p.x - pos.x, p.y - (pos.y - 24)) < 46 })
        onDropFriend(key, onPart ? { part: onPart.part } : inRect(p, POD) ? 'pod' : inRect(p, CATCHER) ? 'catcher' : null)
      }
    } else if (drag.kind === 'part') {
      const part = drag.id as PartKey
      if (!drag.moved) onPartTap?.(part)
      else if (p.y > SCENE_H + 6 || p.y < -6 || p.x < -6 || p.x > SCENE_W + 6) onMovePart?.(part, null)
      else { const slot = nearestFreeSlot(part, placed, p); if (slot && slot !== placed.find(x => x.part === part)?.slot) onMovePart?.(part, slot) }
    } else if (sprinklingOn) {
      onSprinkle(sprinklingOn)
    }
    setDrag(null)
    setSprinklingOn(null)
  }

  const draggingFriend = drag?.kind === 'friend'
  const night = sky !== 'day'
  const bySlot = (zone: 'sky' | 'horizon' | 'ground') => placed.filter(x => PART_ZONE[x.part] === zone && SLOT_POS[x.slot])
  /** A part in its slot: draggable, animated when a Friend is on it. */
  const partAt = (x: Placed) => {
    const pos = SLOT_POS[x.slot]
    const dragging = drag?.kind === 'part' && drag.id === x.part
    const at = dragging && drag ? { x: drag.x, y: drag.y + (PART_ZONE[x.part] === 'sky' ? 0 : 24) } : pos
    return (
      <g key={x.part} data-part={x.part} data-slot={x.slot} transform={`translate(${at.x} ${at.y})${dragging ? ' scale(1.08)' : ''}`}
        onPointerDown={e => { e.stopPropagation(); begin(e, 'part', x.part) }} style={{ cursor: 'grab', filter: dragging ? 'drop-shadow(0 8px 0 rgba(26,26,46,0.25))' : undefined }}>
        {/* a hit area, so a small finger grabs the whole part and not just its lines */}
        <circle cx={0} cy={PART_ZONE[x.part] === 'sky' ? 0 : -26} r={32} fill="transparent" />
        <PartArt part={x.part} accent={accent} night={night} using={using === x.part} />
      </g>
    )
  }
  /** The places a carried part can go, lit up. */
  const targets = carrying?.kind === 'part' ? SLOTS.filter(s => s.zone === PART_ZONE[carrying.part] && !placed.some(x => x.slot === s.id)) : []
  const starX = 80 + (1 - starEnergy) * 230
  const starY = 150 - Math.sin(Math.PI * (0.2 + 0.6 * (1 - starEnergy))) * 90
  const podY = surfaceY(POD.x + POD.w / 2)
  const catcherY = surfaceY(CATCHER.x + CATCHER.w / 2)

  return (
    <svg
      ref={el => { svgRef.current = el; onSvg?.(el) }}
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

      {/* what the child hung in the sky (slice 3) */}
      {bySlot('sky').map(partAt)}

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

      {/* the ring, when the child has put it on */}
      {placed.some(x => x.part === 'ring') && (
        <g data-part="ring" data-slot="ring" clipPath="url(#pl-body)" onPointerDown={e => { e.stopPropagation(); begin(e, 'part', 'ring') }} style={{ cursor: 'grab' }}>
          <ellipse cx={PLANET.cx} cy={445} rx={235} ry={26} fill="none" stroke="#F4C542" strokeWidth={10} opacity={0.85} />
          <ellipse cx={PLANET.cx} cy={445} rx={235} ry={26} fill="none" stroke="#1A1A2E" strokeWidth={1.5} opacity={0.5} />
        </g>
      )}
      {targets.map(t => {
        const pos = SLOT_POS[t.id]
        if (t.zone === 'ring') return <ellipse key={t.id} data-target={t.id} cx={PLANET.cx} cy={pos.y} rx={235} ry={26} fill="none" stroke="#F4C542" strokeWidth={6} strokeDasharray="10 8" clipPath="url(#pl-body)" className="pl-target" />
        return <circle key={t.id} data-target={t.id} cx={pos.x} cy={pos.y - (t.zone === 'sky' ? 0 : 24)} r={28} fill="rgba(255,255,255,0.35)" stroke="#F4C542" strokeWidth={4} strokeDasharray="8 7" className="pl-target" />
      })}
      {/* what the child built on the ground (slice 3) */}
      {bySlot('ground').map(partAt)}

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

      {/* what stands on the horizon, behind the Friends (slice 3) */}
      {bySlot('horizon').map(partAt)}

      {/* the Friends */}
      {friends.map((f, i) => {
        const mood = moods[f.key] ?? 'happy'
        const baby = !isGrownUp(f.key, childAge)
        const dragging = drag?.kind === 'friend' && drag.id === f.key
        if (dragging && drag) {
          return (
            <g key={f.key} transform={`translate(${drag.x} ${drag.y + 30}) scale(1.06)`} style={{ filter: 'drop-shadow(0 8px 0 rgba(26,26,46,0.25))' }}>
              <FriendFigure friend={f.key} mood={mood} baby={baby} pyjamas={pyjamas} outfit={wearing[f.key] ?? null} />
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
            {carrying?.kind === 'outfit' && !f.cooldown && <circle cx={0} cy={-70} r={70} fill="rgba(255,255,255,0.25)" stroke="#F4C542" strokeWidth={4} strokeDasharray="8 7" className="pl-target" data-target={`friend-${f.key}`} />}
            <g className={wiggle === f.key ? 'pl-wiggle' : undefined}>
              <FriendFigure friend={f.key} mood={mood} baby={baby} pyjamas={pyjamas} phone={mood === 'happy' && !baby ? 'hand' : 'none'} clock={f.cooldown?.reason === 'ambient'} outfit={wearing[f.key] ?? null} />
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
