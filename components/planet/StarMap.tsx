'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { Friend, FriendKey, Home, Outfit, PlanetKey, Self, Tier } from '@/lib/planet/logic'
import { SKY, isGrownUp, newPlanets, planetOpen, planetPlace, planetSign, shownPlanets, whereIs, planetOf } from '@/lib/planet/logic'
import { OPEN_SIGNS, PLANET_WORDS, SIGN_WORDS, type PlanetMotif } from '@/lib/planet/universe'
import { friendArt } from '@/lib/planet/registry'
import FriendFigure from './FriendFigure'
import SelfFigure from './SelfFigure'
import PartArt from './PartArt'
import { SCENE_H, SCENE_W, sceneFromClient } from './scene'

// The universe (slices 3b and 3c): DiGi is the star in the middle of a sky
// twice the size of the screen, and every planet of the catalogue floats in
// it with a slow drift. Drag the dark to look around, and the small star
// brings DiGi back to the middle. Tap a planet to look, drag a Friend from
// the tray onto a lit planet and the rocket flies them there, drag a planet
// anywhere and it stays where the child left it. A planet not yet open is
// a pale outline with the small honest sign of what opens it: a book for a
// lesson, a flag for a mission, a sprout for growing. No padlock, no
// countdown, no nag. The child's own explorer rides the rocket.

const INK = '#1A1A2E'
const TRAY_Y = 468
/** The window onto the sky: the screen above the tray. */
const WINDOW = { w: SCENE_W, h: TRAY_Y - 12 }
const DIGI = { x: SKY.cx, y: SKY.cy }
const RINGS = [{ rx: 184, ry: 100 }, { rx: 280, ry: 168 }, { rx: 352, ry: 244 }]

type Drag = { kind: 'friend' | 'planet' | 'pan'; id: string; x: number; y: number; startX: number; startY: number; moved: boolean; panX: number; panY: number }

const clampPan = (p: { x: number; y: number }) => ({
  x: Math.max(0, Math.min(SKY.w - WINDOW.w, p.x)),
  y: Math.max(0, Math.min(SKY.h - WINDOW.h, p.y)),
})
/** The pan that puts a point in the middle of the window. */
const centreOn = (p: { x: number; y: number }) => clampPan({ x: p.x - WINDOW.w / 2, y: p.y - WINDOW.h / 2 })

/** Fixed pinprick stars over the whole sky, seeded, so it is calm and the same every night. */
const STARS = Array.from({ length: 70 }, (_, i) => ({ x: (i * 97 + 13) % SKY.w, y: (i * 71 + 23) % SKY.h, r: i % 3 === 0 ? 1.8 : 1.2, o: 0.45 + ((i * 7) % 6) / 12 }))

/** One motif per planet, a few primitives each, so even a small one reads. */
function Motif({ motif, r, edge, accent }: { motif: PlanetMotif; r: number; edge: string; accent: string }) {
  const sw = Math.max(1.2, r * 0.06)
  const k = r / 26
  switch (motif) {
    case 'grass':
      return (
        <g transform={`scale(${k})`}>
          <ellipse cx={-8} cy={6} rx={7} ry={3.5} fill="#6FB998" />
          <ellipse cx={10} cy={-6} rx={5} ry={2.5} fill="#6FB998" />
          <path d="M4 -24 V-8 M5 -24 h10 l-3 4 l3 4 h-10 z" stroke={INK} strokeWidth={1.4} fill={accent} strokeLinejoin="round" />
        </g>
      )
    case 'book':
      return (
        <g transform={`scale(${k})`}>
          <path d="M-14 6 a14 14 0 0 1 28 0 z" fill="#FFFFFF" stroke={INK} strokeWidth={1.4} />
          <rect x={-16} y={6} width={32} height={5} rx={2} fill="#D8D2E8" stroke={INK} strokeWidth={1.2} />
          <circle cx={0} cy={0} r={3} fill="#8EC3F0" stroke={INK} strokeWidth={1} />
        </g>
      )
    case 'slide':
      return (
        <g transform={`scale(${k})`}>
          <path d="M-16 8 h10 l-2 -16 h-6 z" fill="#F4C542" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M-6 -8 L16 8" stroke="#F4C542" strokeWidth={4} strokeLinecap="round" />
          <circle cx={6} cy={-14} r={7} fill="#3E8F5A" stroke={INK} strokeWidth={1.2} />
        </g>
      )
    case 'mug':
      return (
        <g>
          <rect x={-r * 0.3} y={-r * 0.25} width={r * 0.5} height={r * 0.5} rx={r * 0.1} fill="#FFF6DD" stroke={INK} strokeWidth={sw} />
          <path d={`M${r * 0.2} ${-r * 0.1} q ${r * 0.3} 0 0 ${r * 0.25}`} fill="none" stroke={INK} strokeWidth={sw} />
          <path d={`M${-r * 0.15} ${-r * 0.4} q ${r * 0.08} ${-r * 0.12} 0 ${-r * 0.2}`} fill="none" stroke={INK} strokeWidth={sw * 0.8} opacity={0.7} />
        </g>
      )
    case 'rocket':
      return (
        <g>
          <path d={`M0 ${-r * 0.45} q ${r * 0.28} ${r * 0.3} 0 ${r * 0.8} q ${-r * 0.28} ${-r * 0.5} 0 ${-r * 0.8} z`} fill="#FFF6DD" stroke={INK} strokeWidth={sw} />
          <circle cx={0} cy={-r * 0.1} r={r * 0.09} fill="#8EC3F0" stroke={INK} strokeWidth={sw * 0.7} />
        </g>
      )
    case 'tree':
      return (
        <g>
          <circle cx={0} cy={-r * 0.2} r={r * 0.28} fill={edge} stroke={INK} strokeWidth={sw * 0.8} />
          <rect x={-r * 0.05} y={0} width={r * 0.1} height={r * 0.3} fill={INK} />
        </g>
      )
    case 'dome':
      return (
        <g>
          <path d={`M${-r * 0.4} ${r * 0.15} a ${r * 0.4} ${r * 0.4} 0 0 1 ${r * 0.8} 0 z`} fill="#FFF6DD" stroke={INK} strokeWidth={sw} />
          <path d={`M${r * 0.05} ${-r * 0.2} l ${r * 0.3} ${-r * 0.3}`} stroke={INK} strokeWidth={sw} />
        </g>
      )
    case 'screen':
      return (
        <g>
          <rect x={-r * 0.35} y={-r * 0.28} width={r * 0.7} height={r * 0.5} rx={r * 0.08} fill="#FFF6DD" stroke={INK} strokeWidth={sw} />
          <path d={`M${-r * 0.18} ${r * 0.02} l ${r * 0.14} ${-r * 0.14} l ${r * 0.1} ${r * 0.08} l ${r * 0.12} ${-r * 0.12}`} fill="none" stroke={edge} strokeWidth={sw} strokeLinecap="round" />
        </g>
      )
    case 'ice':
      return <path d={`M${-r * 0.5} ${r * 0.1} l ${r * 0.25} ${-r * 0.4} l ${r * 0.25} ${r * 0.4} z M0 ${r * 0.1} l ${r * 0.22} ${-r * 0.55} l ${r * 0.24} ${r * 0.55} z`} fill="#FFFFFF" stroke={INK} strokeWidth={sw * 0.8} strokeLinejoin="round" opacity={0.9} />
    case 'lava':
      return <path d={`M${-r * 0.45} ${r * 0.2} l ${r * 0.3} ${-r * 0.55} l ${r * 0.3} ${r * 0.55} z M${-r * 0.08} ${-r * 0.32} q ${r * 0.08} ${-r * 0.18} ${r * 0.16} 0`} fill={edge} stroke={INK} strokeWidth={sw * 0.8} strokeLinejoin="round" />
    case 'rainbow':
      return (
        <g fill="none" strokeLinecap="round">
          {['#D95970', '#F4C542', '#7CB342'].map((c, i) => (
            <path key={c} d={`M${-r * (0.45 - i * 0.1)} ${r * 0.2} a ${r * (0.45 - i * 0.1)} ${r * (0.45 - i * 0.1)} 0 0 1 ${r * (0.9 - i * 0.2)} 0`} stroke={c} strokeWidth={sw * 1.2} />
          ))}
        </g>
      )
  }
}

export type Flight = { friend: FriendKey; to: PlanetKey }

/** The planet's size on the map: the home planet is the big one. */
const radiusOf = (k: PlanetKey): number => PLANET_WORDS[k].r * 1.5

export default function StarMap({ home, friends, tier, childAge, wearing, accent, self = null, flight, onTapPlanet, onFly, onMove, onRecentre, onTapDigi, onInteract, onFlightDone, onSvg }: {
  home: Home
  /** The awake Friends, who can fly. */
  friends: Friend[]
  tier: Tier
  childAge: number
  wearing: Partial<Record<FriendKey, Outfit>>
  accent: string
  /** The child's own explorer, who rides the rocket. */
  self?: Self | null
  /** A rocket in the air right now. */
  flight: Flight | null
  onTapPlanet: (planet: PlanetKey) => void
  /** A Friend dropped on a planet. The root decides whether it is open. */
  onFly: (friend: FriendKey, planet: PlanetKey) => void
  /** A planet dragged somewhere in the sky. */
  onMove: (planet: PlanetKey, x: number, y: number) => void
  /** The small star brought DiGi back to the middle. */
  onRecentre: () => void
  onTapDigi: () => void
  onInteract: () => void
  onFlightDone: (flight: Flight) => void
  onSvg?: (el: SVGSVGElement | null) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rocketRef = useRef<SVGGElement>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [moving, setMoving] = useState<{ planet: PlanetKey; x: number; y: number } | null>(null)
  const fresh = newPlanets(home)
  const shown = shownPlanets(home)
  const words = tier >= 2
  // The window opens on the newest planet when there is one, otherwise on DiGi.
  const [pan, setPan] = useState(() => centreOn(fresh.length > 0 ? planetPlace(home, fresh[0]) : DIGI))
  const centred = Math.abs(pan.x - centreOn(DIGI).x) < 8 && Math.abs(pan.y - centreOn(DIGI).y) < 8

  function toView(e: React.PointerEvent): { x: number; y: number } {
    const svg = svgRef.current
    return svg ? sceneFromClient(svg, e.clientX, e.clientY) : { x: 0, y: 0 }
  }
  const toSky = (p: { x: number; y: number }) => ({ x: p.x + pan.x, y: p.y + pan.y })
  function begin(e: React.PointerEvent, kind: Drag['kind'], id: string) {
    if (kind !== 'pan') e.stopPropagation()
    onInteract()
    const p = toView(e)
    try { svgRef.current?.setPointerCapture(e.pointerId) } catch { /* not all browsers */ }
    setDrag({ kind, id, x: p.x, y: p.y, startX: p.x, startY: p.y, moved: false, panX: pan.x, panY: pan.y })
  }
  function move(e: React.PointerEvent) {
    if (!drag) return
    const p = toView(e)
    const moved = drag.moved || Math.hypot(p.x - drag.startX, p.y - drag.startY) > 6
    setDrag({ ...drag, x: p.x, y: p.y, moved })
    if (drag.kind === 'pan' && moved) setPan(clampPan({ x: drag.panX - (p.x - drag.startX), y: drag.panY - (p.y - drag.startY) }))
    if (drag.kind === 'planet' && moved) setMoving({ planet: drag.id as PlanetKey, ...toSky(p) })
  }
  /** The planet a point in the window is over, if any. */
  function planetAt(p: { x: number; y: number }): PlanetKey | null {
    let best: PlanetKey | null = null
    let bestD = Infinity
    for (const k of shown) {
      const pos = livePos(k)
      const d = Math.hypot(p.x + pan.x - pos.x, p.y + pan.y - pos.y)
      if (d < radiusOf(k) + 26 && d < bestD) { bestD = d; best = k }
    }
    return best
  }
  function end() {
    if (!drag) return
    const p = { x: drag.x, y: drag.y }
    if (drag.kind === 'planet') {
      const planet = drag.id as PlanetKey
      if (!drag.moved) onTapPlanet(planet)
      else { const at = toSky(p); onMove(planet, at.x, at.y) }
      setMoving(null)
    } else if (drag.kind === 'friend') {
      const friend = drag.id as FriendKey
      const over = drag.moved ? planetAt(p) : null
      if (over) onFly(friend, over)
    }
    setDrag(null)
  }
  const livePos = (planet: PlanetKey): { x: number; y: number } => (moving && moving.planet === planet ? { x: moving.x, y: moving.y } : planetPlace(home, planet))
  const recentre = (e: React.PointerEvent) => { e.stopPropagation(); onInteract(); setPan(centreOn(DIGI)); onRecentre() }

  // The flight: the window moves to show both ends, and the rocket goes from the Friend's planet to the new one, then lands.
  useEffect(() => {
    if (!flight || !rocketRef.current) return
    const from = planetPlace(home, planetOf(whereIs(home, flight.friend)))
    const to = planetPlace(home, flight.to)
    setPan(centreOn({ x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }))
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.fromTo(rocketRef.current, { x: from.x, y: from.y - 30 }, { x: to.x, y: to.y - 30, duration: reduce ? 0.01 : 1.3, ease: 'power2.inOut', onComplete: () => onFlightDone(flight) })
    return () => { tween.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight])

  const xs = friends.length <= 1 ? [195] : friends.length === 2 ? [140, 250] : [100, 195, 290]
  const draggingFriend = drag?.kind === 'friend'

  return (
    <svg
      ref={el => { svgRef.current = el; onSvg?.(el) }}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      width="100%"
      style={{ display: 'block', touchAction: 'none', userSelect: 'none', borderRadius: 24 }}
      onPointerDown={e => begin(e, 'pan', 'sky')}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      data-pan={`${Math.round(pan.x)},${Math.round(pan.y)}`}
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
        {/* the sky stops at the tray, so no planet ever hides under it */}
        <clipPath id="pl-window"><rect x={0} y={0} width={SCENE_W} height={WINDOW.h} /></clipPath>
      </defs>
      <rect x={0} y={0} width={SCENE_W} height={SCENE_H} fill="url(#pl-space)" />

      <g clipPath="url(#pl-window)">
        <g transform={`translate(${-pan.x} ${-pan.y})`}>
          {STARS.map((st, i) => <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#FFFFFF" opacity={st.o} />)}

          {/* the rings, for the eye: a planet can float anywhere */}
          {RINGS.map((o, i) => <ellipse key={i} cx={DIGI.x} cy={DIGI.y} rx={o.rx} ry={o.ry} fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeDasharray="4 6" opacity={0.28} />)}

          {/* DiGi, the star in the middle */}
          <g data-digi-star transform={`translate(${DIGI.x} ${DIGI.y})`} onPointerDown={e => { e.stopPropagation(); onInteract(); onTapDigi() }} style={{ cursor: 'pointer' }}>
            <circle cx={0} cy={0} r={78} fill="url(#pl-glow)" />
            <g className="pl-float"><image href="/digi-squad/DiGi-star.svg" x={-40} y={-40} width={80} height={80} /></g>
          </g>

          {/* the planets of this tier, far ones first so a near one draws over them */}
          {[...shown].sort((a, b) => livePos(a).y - livePos(b).y).map((k, idx) => {
            const pos = livePos(k)
            const open = planetOpen(home, k)
            const isNew = fresh.includes(k)
            const w = PLANET_WORDS[k]
            const r = radiusOf(k)
            const sign = planetSign(k)
            const dragging = drag?.kind === 'planet' && drag.id === k
            const lit = draggingFriend && open
            return (
              <g key={k} data-planet={k} data-open={open ? '1' : '0'} data-sign={open ? undefined : sign} transform={`translate(${pos.x} ${pos.y})${dragging ? ' scale(1.06)' : ''}`}
                onPointerDown={e => begin(e, 'planet', k)} style={{ cursor: 'grab' }} aria-label={open ? w.title : `${w.title}, not open yet`}>
                <circle cx={0} cy={0} r={r + 22} fill="transparent" />
                <g className={dragging ? undefined : 'pl-drift'} style={{ animationDelay: `${(idx % 5) * -1.7}s`, animationDuration: `${8 + (idx % 4)}s` }}>
                  {lit && <circle cx={0} cy={0} r={r + 14} fill="rgba(255,255,255,0.2)" stroke="#F4C542" strokeWidth={4} strokeDasharray="8 7" className="pl-target" />}
                  {open ? (
                    <g>
                      <circle cx={0} cy={0} r={r} fill={w.colour} stroke={INK} strokeWidth={2.5} />
                      <path d={`M${-r} 0 a ${r} ${r} 0 0 0 ${r * 2} 0 a ${r * 1.15} ${r * 0.5} 0 0 1 ${-r * 2} 0`} fill={w.edge} opacity={0.3} />
                      <Motif motif={w.motif} r={r} edge={w.edge} accent={accent} />
                      {isNew && (
                        <g className="pl-sparkle-loop">
                          {[-1, 0, 1].map(i => <path key={i} d={`M${i * 22} ${-r - 18 - (i % 2) * 6} l3 -8 l3 8 l-8 -5 h10 z`} fill="#F4C542" />)}
                        </g>
                      )}
                    </g>
                  ) : (
                    <g opacity={0.8}>
                      <circle cx={0} cy={0} r={r} fill="rgba(255,255,255,0.08)" stroke="#FFFFFF" strokeWidth={2} strokeDasharray="6 6" />
                      <text x={0} y={r * 0.34} textAnchor="middle" fontSize={r * 0.9}>{OPEN_SIGNS[sign]}</text>
                    </g>
                  )}
                  {words && (
                    <text x={0} y={r + 19} textAnchor="middle" fontSize={12.5} fontFamily="var(--font-display)" fontWeight={800} fill="#FFFFFF" opacity={open ? 1 : 0.75}>{w.title}</text>
                  )}
                  {words && !open && (
                    <text x={0} y={r + 33} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="#FFFFFF" opacity={0.7} letterSpacing={0.5}>{SIGN_WORDS[sign]}</text>
                  )}
                  {words && isNew && (
                    <text x={0} y={-r - 28} textAnchor="middle" fontSize={13} fontFamily="var(--font-display)" fontWeight={900} fill="#F4C542">New!</text>
                  )}
                </g>
              </g>
            )
          })}

          {/* the rocket in the air, the Friend and the child's explorer aboard */}
          {flight && (
            <g ref={rocketRef} data-flight={flight.friend} style={{ pointerEvents: 'none' }}>
              <g transform="rotate(30) scale(0.8)"><PartArt part="rocket" accent={accent} night={false} using /></g>
              {self && <g transform="translate(-24 -40) scale(0.32)"><SelfFigure self={self} size={100} /></g>}
              <g transform="translate(2 -50) scale(0.32)"><FriendFigure friend={flight.friend} mood="happy" baby={!isGrownUp(flight.friend, childAge)} outfit={wearing[flight.friend] ?? null} /></g>
            </g>
          )}
        </g>
      </g>

      {/* the small star: back to DiGi in the middle */}
      {!centred && (
        <g data-recentre role="button" aria-label="Back to DiGi" transform="translate(34 34)" onPointerDown={recentre} style={{ cursor: 'pointer' }}>
          <circle cx={0} cy={0} r={22} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={3} r={22} fill="none" stroke={INK} strokeWidth={2} opacity={0.5} />
          <image href="/digi-squad/DiGi-star.svg" x={-14} y={-14} width={28} height={28} />
        </g>
      )}

      {/* the tray: who is flying */}
      <rect x={14} y={TRAY_Y - 12} width={SCENE_W - 28} height={SCENE_H - TRAY_Y} rx={18} fill="rgba(20,26,60,0.92)" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.95} onPointerDown={e => e.stopPropagation()} />
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
