'use client'

import { useRef, useState } from 'react'
import type { Mood, Plant, Tier } from '@/lib/planter/logic'
import PlantFigure from './PlantFigure'

// The GreenhouseHomeNode (design section 2.1): the sandbox scene, drawn in
// one SVG so it is one screen at phone width and simply scales up on a
// tablet or desktop. Everything that looks liftable lifts. Nothing scores,
// nothing fails, and the only clock on screen is the sun moving across the
// roof, which is the energy component made visible.
//
// Drag is pointer events on the SVG, no physics engine. The scene knows
// where things are and what they landed on; what that MEANS (a nap, the
// sunlight mission) is the parent component's business, so this file has
// callbacks and no rules.

export const SCENE_W = 390
export const SCENE_H = 560
export const POTS = [{ x: 88, y: 402 }, { x: 195, y: 402 }, { x: 302, y: 402 }]
const BED = { x: 284, y: 448, w: 100, h: 96 }
const WINDOW = { x: 8, y: 146, w: 76, h: 118 }
const CAN_HOME = { x: 46, y: 336 }

export type DropZone = 'bed' | 'window'
export type Sky = 'day' | 'evening' | 'night'

type Drag = { kind: 'plant' | 'can'; id: string; x: number; y: number; startX: number; startY: number; moved: boolean }

function inRect(p: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h
}

const SKY: Record<Sky, { top: string; bottom: string; wall: string; glass: string }> = {
  day: { top: '#BFE3F7', bottom: '#EAF6FD', wall: '#F6EFDF', glass: 'rgba(255,255,255,0.35)' },
  evening: { top: '#F7B98A', bottom: '#FBE0C3', wall: '#EBDCC4', glass: 'rgba(255,240,220,0.35)' },
  night: { top: '#1B2350', bottom: '#2C3568', wall: '#3A3550', glass: 'rgba(200,210,255,0.12)' },
}

export default function Greenhouse({
  plants, moods, tier, sky, sunEnergy, pyjamas, wiggleId, sparkleId, dugPatch,
  onDropPlant, onTickle, onWater, onDig, onShade, onInteract,
}: {
  plants: Plant[]
  moods: Record<string, Mood>
  tier: Tier
  sky: Sky
  /** 0 to 1, the average energy of the awake plants. Drives the sun. */
  sunEnergy: number
  pyjamas: boolean
  wiggleId: string | null
  sparkleId: string | null
  dugPatch: number | null
  onDropPlant: (plantId: string, zone: DropZone | null) => void
  onTickle: (plantId: string) => void
  onWater: (plantId: string) => void
  onDig: (patch: number) => void
  onShade: (plantId: string, on: boolean) => void
  onInteract: () => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [pouringOn, setPouringOn] = useState<string | null>(null)
  const colours = SKY[sky]

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

  function potOf(id: string): { x: number; y: number } {
    const i = plants.findIndex(p => p.id === id)
    return POTS[Math.max(0, i)] ?? POTS[0]
  }

  function begin(e: React.PointerEvent, kind: 'plant' | 'can', id: string) {
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
    if (drag.kind === 'can') {
      const over = plants.find((pl, i) => !pl.cooldown && Math.hypot(p.x - POTS[i].x, p.y - (POTS[i].y - 60)) < 60)
      setPouringOn(over ? over.id : null)
    }
  }

  function end() {
    if (!drag) return
    const p = { x: drag.x, y: drag.y }
    if (drag.kind === 'plant') {
      if (!drag.moved) onTickle(drag.id)
      else onDropPlant(drag.id, inRect(p, BED) ? 'bed' : inRect(p, WINDOW) ? 'window' : null)
    } else if (pouringOn) {
      onWater(pouringOn)
    }
    setDrag(null)
    setPouringOn(null)
  }

  const draggingPlant = drag?.kind === 'plant'
  const sunX = 70 + (1 - sunEnergy) * 250
  const sunY = 118 - Math.sin(Math.PI * (0.2 + 0.6 * (1 - sunEnergy))) * 78

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      width="100%"
      style={{ display: 'block', touchAction: 'none', userSelect: 'none', borderRadius: 24 }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="The greenhouse"
      role="img"
    >
      <defs>
        <linearGradient id="pf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colours.top} />
          <stop offset="1" stopColor={colours.bottom} />
        </linearGradient>
        <radialGradient id="pf-glow">
          <stop offset="0" stopColor="#FFF3B0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFF3B0" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* sky and roof */}
      <rect x={0} y={0} width={SCENE_W} height={SCENE_H} fill="url(#pf-sky)" />
      {sky === 'night' ? (
        <g>
          <circle cx={300} cy={70} r={22} fill="#FFF3C4" />
          <circle cx={291} cy={64} r={19} fill={colours.top} />
          {[30, 90, 150, 210, 340, 370].map((x, i) => <circle key={x} cx={x} cy={30 + (i * 23) % 60} r={1.6} fill="#FFF6DD" />)}
        </g>
      ) : (
        <g className="pf-sun" style={{ transformOrigin: `${sunX}px ${sunY}px` }}>
          <circle cx={sunX} cy={sunY} r={54} fill="url(#pf-glow)" />
          <circle cx={sunX} cy={sunY} r={22} fill="#F4C542" />
        </g>
      )}
      <polygon points={`0,128 195,22 390,128`} fill={colours.glass} stroke="#1A1A2E" strokeWidth={3} strokeLinejoin="round" />
      <path d="M195 22 V128 M98 75 V128 M292 75 V128" stroke="#1A1A2E" strokeWidth={2} opacity={0.5} />

      {/* back wall and bench */}
      <rect x={0} y={128} width={SCENE_W} height={280} fill={colours.wall} />
      <rect x={0} y={128} width={SCENE_W} height={4} fill="#1A1A2E" opacity={0.25} />
      <rect x={0} y={404} width={SCENE_W} height={18} fill="#A9743F" />
      <rect x={0} y={422} width={SCENE_W} height={138} fill={sky === 'night' ? '#2A2A38' : '#E7DCC6'} />
      <rect x={34} y={422} width={12} height={40} fill="#8C5E30" />
      <rect x={344} y={422} width={12} height={40} fill="#8C5E30" />

      {/* the sunny window, the offline transition zone for sunlight */}
      <g>
        <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx={10} fill={sky === 'night' ? '#141A3A' : '#FFF6C9'} stroke={draggingPlant ? '#F4C542' : '#1A1A2E'} strokeWidth={draggingPlant ? 5 : 3} />
        <path d={`M${WINDOW.x + WINDOW.w / 2} ${WINDOW.y} V${WINDOW.y + WINDOW.h} M${WINDOW.x} ${WINDOW.y + WINDOW.h / 2} H${WINDOW.x + WINDOW.w}`} stroke="#1A1A2E" strokeWidth={2} opacity={0.6} />
        {sky !== 'night' && <circle cx={WINDOW.x + 24} cy={WINDOW.y + 30} r={12} fill="#F4C542" opacity={0.9} />}
        <rect x={WINDOW.x - 4} y={WINDOW.y + WINDOW.h} width={WINDOW.w + 8} height={10} rx={3} fill="#B8703F" />
      </g>

      {/* the bed, the nap area */}
      <g>
        <rect x={BED.x} y={BED.y + 30} width={BED.w} height={BED.h - 30} rx={12} fill="#C98F5A" stroke={draggingPlant ? '#F4C542' : '#1A1A2E'} strokeWidth={draggingPlant ? 5 : 3} />
        <rect x={BED.x + 8} y={BED.y + 10} width={BED.w - 16} height={30} rx={10} fill="#FFF6DD" stroke="#1A1A2E" strokeWidth={2} />
        <rect x={BED.x + 8} y={BED.y + 44} width={BED.w - 16} height={40} rx={8} fill="#9BC9A8" opacity={0.9} />
        <path d={`M${BED.x + 20} ${BED.y + 54} q 8 -8 16 0 t 16 0 t 16 0 t 16 0`} stroke="#1A1A2E" strokeWidth={1.5} fill="none" opacity={0.5} />
      </g>

      {/* the shade awnings, Tier 2 only */}
      {tier >= 2 && plants.map((pl, i) => (
        <g key={`shade-${pl.id}`} onPointerDown={e => { e.stopPropagation(); onInteract(); onShade(pl.id, !pl.shade) }} style={{ cursor: 'pointer' }}>
          <rect x={POTS[i].x - 40} y={196} width={80} height={12} rx={6} fill="#1A1A2E" />
          {pl.shade ? (
            <path d={`M${POTS[i].x - 44} 208 h88 l-6 34 q-38 12 -76 0 z`} fill="#F28C6A" stroke="#1A1A2E" strokeWidth={2} />
          ) : (
            <rect x={POTS[i].x - 44} y={206} width={88} height={12} rx={6} fill="#F28C6A" stroke="#1A1A2E" strokeWidth={2} />
          )}
        </g>
      ))}

      {/* the pots, empty soil where nothing grows yet */}
      {POTS.map((pot, i) => {
        const pl = plants[i]
        if (pl) return null
        return (
          <g key={`patch-${i}`} transform={`translate(${pot.x} ${pot.y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onDig(i) }} style={{ cursor: 'pointer' }}>
            <path d="M-30 -36 L-24 4 L24 4 L30 -36 Z" fill="#D98B5B" />
            <rect x={-33} y={-45} width={66} height={11} rx={3} fill="#B8703F" />
            <ellipse cx={0} cy={-40} rx={27} ry={5} fill="#5B3F2E" />
            {dugPatch === i && <circle className="pf-puff" cx={0} cy={-46} r={10} fill="#8C6A4E" opacity={0.6} />}
          </g>
        )
      })}

      {/* the plants. The breathing and wiggle classes animate CSS transform,
          which REPLACES an SVG transform attribute on the same element, so the
          animated class always sits on an inner group and the position on
          the outer one. Folding them together makes a plant jump to the
          origin the moment it breathes. */}
      {plants.map((pl, i) => {
        const mood = moods[pl.id] ?? 'happy'
        const dragging = drag?.kind === 'plant' && drag.id === pl.id
        if (dragging && drag) {
          return (
            <g key={pl.id} transform={`translate(${drag.x} ${drag.y + 24}) scale(1.06)`} style={{ filter: 'drop-shadow(0 8px 0 rgba(26,26,46,0.25))' }}>
              <PlantFigure plant={pl} mood={mood} pyjamas={pyjamas} />
            </g>
          )
        }
        if (pl.cooldown?.reason === 'nap') {
          return (
            <g key={pl.id} transform={`translate(${BED.x + BED.w / 2} ${BED.y + BED.h - 12}) scale(0.72)`}>
              <g className="pf-breathe"><PlantFigure plant={pl} mood="asleep" pyjamas={pyjamas} blanket /></g>
            </g>
          )
        }
        if (pl.cooldown?.reason === 'sunlight') {
          return (
            <g key={pl.id} transform={`translate(${WINDOW.x + WINDOW.w / 2} ${WINDOW.y + WINDOW.h + 8}) scale(0.62)`}>
              <g className="pf-breathe"><PlantFigure plant={pl} mood="sunbathing" /></g>
            </g>
          )
        }
        const pot = POTS[i]
        return (
          <g
            key={pl.id}
            transform={`translate(${pot.x} ${pot.y})`}
            onPointerDown={e => { if (pl.cooldown) { onInteract(); return } e.stopPropagation(); begin(e, 'plant', pl.id) }}
            style={{ cursor: pl.cooldown ? 'default' : 'grab' }}
          >
            <g className={wiggleId === pl.id ? 'pf-wiggle' : undefined}>
              <PlantFigure plant={pl} mood={mood} pyjamas={pyjamas} clock={pl.cooldown?.reason === 'ambient'} />
            </g>
            {sparkleId === pl.id && (
              <g className="pf-sparkle">
                {[-22, 0, 22].map((dx, k) => <circle key={k} cx={dx} cy={-150 - (k % 2) * 14} r={4} fill="#F4C542" />)}
              </g>
            )}
            {pouringOn === pl.id && (
              <g className="pf-drops">
                {[-8, 0, 8].map((dx, k) => <ellipse key={k} cx={dx} cy={-120 + k * 10} rx={3} ry={5} fill="#5FA8E8" />)}
              </g>
            )}
          </g>
        )
      })}

      {/* the watering can, on its hook or in the hand */}
      <g
        transform={drag?.kind === 'can' ? `translate(${drag.x} ${drag.y}) rotate(-25) scale(1.1)` : `translate(${CAN_HOME.x} ${CAN_HOME.y})`}
        onPointerDown={e => { e.stopPropagation(); begin(e, 'can', 'can') }}
        style={{ cursor: 'grab' }}
      >
        {drag?.kind !== 'can' && <circle cx={0} cy={-34} r={4} fill="#1A1A2E" />}
        <path d="M-18 -18 h30 v26 q0 6 -6 6 h-18 q-6 0 -6 -6 z" fill="#5FA8E8" stroke="#1A1A2E" strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M12 -8 l18 -12" stroke="#1A1A2E" strokeWidth={5} strokeLinecap="round" />
        <path d="M12 -8 l18 -12" stroke="#5FA8E8" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M-18 -8 q-12 0 -12 12 q0 8 8 8" stroke="#1A1A2E" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <rect x={-10} y={-24} width={14} height={7} rx={3} fill="#5FA8E8" stroke="#1A1A2E" strokeWidth={2} />
      </g>
    </svg>
  )
}
