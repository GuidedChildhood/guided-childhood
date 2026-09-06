'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { Friend, FriendKey, Home, Outfit, PlanetKey, Tier } from '@/lib/planet/logic'
import { PLANETS, PLANET_ORDER, isGrownUp, newPlanets, orbitAngle, planetOpen, whereIs, planetOf } from '@/lib/planet/logic'
import { PLANET_WORDS } from '@/lib/planet/world'
import { friendArt } from '@/lib/planet/registry'
import FriendFigure from './FriendFigure'
import PartArt from './PartArt'
import { SCENE_H, SCENE_W, sceneFromClient } from './scene'

// The star system map (slice 3b): DiGi is the star in the middle and the
// planets orbit. Tap a planet to look, drag a Friend from the tray onto a lit
// planet and the rocket flies them there, drag a planet along its orbit and
// it stays where the child left it. A planet not yet open is a pale outline
// with a book on it: a lesson opens it. No padlock, no countdown, no nag.

const INK = '#1A1A2E'
const CENTRE = { x: 195, y: 236 }
const ORBITS = [{ rx: 92, ry: 50 }, { rx: 140, ry: 82 }, { rx: 178, ry: 118 }]
const TRAY_Y = 468
const PLANET_R: Record<PlanetKey, number> = { home: 30, school: 24, park: 26 }

type Drag = { kind: 'friend' | 'planet'; id: string; x: number; y: number; startX: number; startY: number; moved: boolean }

/** Where a planet is drawn on its orbit. */
export function planetPos(home: Home, planet: PlanetKey): { x: number; y: number } {
  const o = ORBITS[PLANETS[planet].orbit]
  const a = (orbitAngle(home, planet) * Math.PI) / 180
  return { x: CENTRE.x + o.rx * Math.cos(a), y: CENTRE.y + o.ry * Math.sin(a) }
}
function angleAt(planet: PlanetKey, p: { x: number; y: number }): number {
  const o = ORBITS[PLANETS[planet].orbit]
  return (Math.atan2((p.y - CENTRE.y) / o.ry, (p.x - CENTRE.x) / o.rx) * 180) / Math.PI
}
function trayX(count: number): number[] {
  if (count <= 1) return [195]
  if (count === 2) return [140, 250]
  return [100, 195, 290]
}

export type Flight = { friend: FriendKey; to: PlanetKey }

export default function StarMap({ home, friends, tier, childAge, wearing, accent, flight, onTapPlanet, onFly, onOrbit, onTapDigi, onInteract, onFlightDone, onSvg }: {
  home: Home
  /** The awake Friends, who can fly. */
  friends: Friend[]
  tier: Tier
  childAge: number
  wearing: Partial<Record<FriendKey, Outfit>>
  accent: string
  /** A rocket in the air right now. */
  flight: Flight | null
  onTapPlanet: (planet: PlanetKey) => void
  /** A Friend dropped on a planet. The root decides whether it is open. */
  onFly: (friend: FriendKey, planet: PlanetKey) => void
  onOrbit: (planet: PlanetKey, angle: number) => void
  onTapDigi: () => void
  onInteract: () => void
  onFlightDone: (flight: Flight) => void
  onSvg?: (el: SVGSVGElement | null) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rocketRef = useRef<SVGGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [orbitLive, setOrbitLive] = useState<{ planet: PlanetKey; angle: number } | null>(null)
  const fresh = newPlanets(home)
  const words = tier >= 2

  function toSvg(e: React.PointerEvent): { x: number; y: number } {
    const svg = svgRef.current
    return svg ? sceneFromClient(svg, e.clientX, e.clientY) : { x: 0, y: 0 }
  }
  function begin(e: React.PointerEvent, kind: Drag['kind'], id: string) {
    e.stopPropagation()
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
    if (drag.kind === 'planet' && moved) setOrbitLive({ planet: drag.id as PlanetKey, angle: angleAt(drag.id as PlanetKey, p) })
  }
  function planetAt(p: { x: number; y: number }): PlanetKey | null {
    let best: PlanetKey | null = null
    let bestD = 58
    for (const k of PLANET_ORDER) {
      const pos = livePos(k)
      const d = Math.hypot(p.x - pos.x, p.y - pos.y)
      if (d < bestD) { bestD = d; best = k }
    }
    return best
  }
  function end() {
    if (!drag) return
    const p = { x: drag.x, y: drag.y }
    if (drag.kind === 'planet') {
      const planet = drag.id as PlanetKey
      if (!drag.moved) onTapPlanet(planet)
      else onOrbit(planet, angleAt(planet, p))
      setOrbitLive(null)
    } else {
      const friend = drag.id as FriendKey
      const over = drag.moved ? planetAt(p) : null
      if (over) onFly(friend, over)
    }
    setDrag(null)
  }
  const livePos = (planet: PlanetKey): { x: number; y: number } => {
    if (orbitLive && orbitLive.planet === planet) {
      const o = ORBITS[PLANETS[planet].orbit]
      const a = (orbitLive.angle * Math.PI) / 180
      return { x: CENTRE.x + o.rx * Math.cos(a), y: CENTRE.y + o.ry * Math.sin(a) }
    }
    return planetPos(home, planet)
  }

  // The flight: the rocket goes from the Friend's planet to the new one, then lands.
  useEffect(() => {
    if (!flight || !rocketRef.current) return
    const from = planetPos(home, planetOf(whereIs(home, flight.friend)))
    const to = planetPos(home, flight.to)
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.fromTo(rocketRef.current, { x: from.x, y: from.y - 30 }, { x: to.x, y: to.y - 30, duration: reduce ? 0.01 : 1.3, ease: 'power2.inOut', onComplete: () => onFlightDone(flight) })
    return () => { tween.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight])

  const xs = trayX(friends.length)
  const draggingFriend = drag?.kind === 'friend'

  return (
    <svg
      ref={el => { svgRef.current = el; onSvg?.(el) }}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      width="100%"
      style={{ display: 'block', touchAction: 'none', userSelect: 'none', borderRadius: 24 }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="My star system"
      role="img"
    >
      <defs>
        <radialGradient id="pl-glow">
          <stop offset="0" stopColor="#FFF3B0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFF3B0" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="pl-space" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141A3C" />
          <stop offset="1" stopColor="#26305F" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={SCENE_W} height={SCENE_H} fill="url(#pl-space)" />
      {[[24, 40], [80, 120], [150, 30], [250, 60], [330, 100], [370, 200], [20, 300], [360, 330], [60, 420], [300, 440], [200, 400], [120, 380]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.2} fill="#FFFFFF" opacity={0.85} />
      ))}

      {/* the orbits */}
      {ORBITS.map((o, i) => <ellipse key={i} cx={CENTRE.x} cy={CENTRE.y} rx={o.rx} ry={o.ry} fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeDasharray="4 6" opacity={0.35} />)}

      {/* DiGi, the star in the middle */}
      <g data-digi-star transform={`translate(${CENTRE.x} ${CENTRE.y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onTapDigi() }} style={{ cursor: 'pointer' }}>
        <circle cx={0} cy={0} r={52} fill="url(#pl-glow)" />
        <g className="pl-float"><image href="/digi-squad/DiGi-star.svg" x={-28} y={-28} width={56} height={56} /></g>
      </g>

      {/* the planets, far ones first so a near one draws over them */}
      {[...PLANET_ORDER].sort((a, b) => livePos(a).y - livePos(b).y).map(k => {
        const pos = livePos(k)
        const open = planetOpen(home, k)
        const isNew = fresh.includes(k)
        const r = PLANET_R[k]
        const w = PLANET_WORDS[k]
        const dragging = drag?.kind === 'planet' && drag.id === k
        const lit = draggingFriend && open
        return (
          <g key={k} data-planet={k} data-open={open ? '1' : '0'} transform={`translate(${pos.x} ${pos.y})${dragging ? ' scale(1.08)' : ''}`}
            onPointerDown={e => begin(e, 'planet', k)} style={{ cursor: 'grab' }} aria-label={open ? w.title : `${w.title}, not open yet`}>
            <circle cx={0} cy={0} r={r + 24} fill="transparent" />
            {lit && <circle cx={0} cy={0} r={r + 14} fill="rgba(255,255,255,0.2)" stroke="#F4C542" strokeWidth={4} strokeDasharray="8 7" className="pl-target" />}
            {open ? (
              <g>
                <circle cx={0} cy={0} r={r} fill={w.colour} stroke={INK} strokeWidth={2.5} />
                {k === 'home' && (
                  <g>
                    <ellipse cx={-8} cy={6} rx={7} ry={3.5} fill="#6FB998" />
                    <ellipse cx={10} cy={-6} rx={5} ry={2.5} fill="#6FB998" />
                    <path d="M4 -24 V-8 M5 -24 h10 l-3 4 l3 4 h-10 z" stroke={INK} strokeWidth={1.4} fill={accent} strokeLinejoin="round" />
                  </g>
                )}
                {k === 'school' && (
                  <g>
                    <path d="M-14 6 a14 14 0 0 1 28 0 z" fill="#FFFFFF" stroke={INK} strokeWidth={1.4} />
                    <rect x={-16} y={6} width={32} height={5} rx={2} fill="#D8D2E8" stroke={INK} strokeWidth={1.2} />
                    <circle cx={0} cy={0} r={3} fill="#8EC3F0" stroke={INK} strokeWidth={1} />
                  </g>
                )}
                {k === 'park' && (
                  <g>
                    <path d="M-16 8 h10 l-2 -16 h-6 z" fill="#F4C542" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
                    <path d="M-6 -8 L16 8" stroke="#F4C542" strokeWidth={4} strokeLinecap="round" />
                    <circle cx={6} cy={-14} r={7} fill="#3E8F5A" stroke={INK} strokeWidth={1.2} />
                  </g>
                )}
                {isNew && (
                  <g className="pl-sparkle-loop">
                    {[-1, 0, 1].map(i => <path key={i} d={`M${i * 18} ${-r - 16 - (i % 2) * 6} l3 -7 l3 7 l-7 -4 h8 z`} fill="#F4C542" />)}
                  </g>
                )}
              </g>
            ) : (
              <g opacity={0.75}>
                <circle cx={0} cy={0} r={r} fill="rgba(255,255,255,0.06)" stroke="#FFFFFF" strokeWidth={2} strokeDasharray="5 5" />
                <text x={0} y={7} textAnchor="middle" fontSize={20}>📚</text>
              </g>
            )}
            {words && (
              <text x={0} y={r + 18} textAnchor="middle" fontSize={11} fontFamily="var(--font-display)" fontWeight={800} fill="#FFFFFF" opacity={open ? 1 : 0.7}>{w.title}</text>
            )}
            {words && !open && (
              <text x={0} y={r + 32} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#FFFFFF" opacity={0.7} letterSpacing={0.5}>PASS A LESSON</text>
            )}
            {words && isNew && (
              <text x={0} y={-r - 24} textAnchor="middle" fontSize={11} fontFamily="var(--font-display)" fontWeight={900} fill="#F4C542">New!</text>
            )}
          </g>
        )
      })}

      {/* the rocket in the air */}
      {flight && (
        <g ref={rocketRef} data-flight={flight.friend} style={{ pointerEvents: 'none' }}>
          <g transform="rotate(30) scale(0.7)"><PartArt part="rocket" accent={accent} night={false} using /></g>
          <g transform="translate(0 -46) scale(0.3)"><FriendFigure friend={flight.friend} mood="happy" baby={!isGrownUp(flight.friend, childAge)} outfit={wearing[flight.friend] ?? null} /></g>
        </g>
      )}

      {/* the tray: who is flying */}
      <rect x={14} y={TRAY_Y - 12} width={SCENE_W - 28} height={SCENE_H - TRAY_Y} rx={18} fill="rgba(255,255,255,0.1)" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.9} />
      {words && <text x={195} y={TRAY_Y + 4} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fill="#FFFFFF" opacity={0.75} letterSpacing={1.5}>WHO IS FLYING?</text>}
      {friends.map((f, i) => {
        const dragging = drag?.kind === 'friend' && drag.id === f.key
        const at = dragging && drag ? { x: drag.x, y: drag.y + 20 } : { x: xs[i], y: TRAY_Y + 84 }
        const here = planetOf(whereIs(home, f.key))
        return (
          <g key={f.key} data-tray-friend={f.key} transform={`translate(${at.x} ${at.y}) scale(${dragging ? 0.62 : 0.56})`}
            onPointerDown={e => begin(e, 'friend', f.key)} style={{ cursor: 'grab', filter: dragging ? 'drop-shadow(0 8px 0 rgba(26,26,46,0.35))' : undefined }} aria-label={`${friendArt(f.key).name}, on ${PLANET_WORDS[here].title}`}>
            <circle cx={0} cy={-56} r={64} fill="transparent" />
            <FriendFigure friend={f.key} mood="happy" baby={!isGrownUp(f.key, childAge)} outfit={wearing[f.key] ?? null} />
            {!dragging && <circle cx={44} cy={-100} r={9} fill={PLANET_WORDS[here].colour} stroke={INK} strokeWidth={1.5} />}
          </g>
        )
      })}
    </svg>
  )
}
