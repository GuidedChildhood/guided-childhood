'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { Friend, FriendKey, Self, Where } from '@/lib/planet/logic'
import { whereIs, type Home } from '@/lib/planet/logic'
import { friendArt } from '@/lib/planet/registry'
import { OPEN_SIGNS, UNIVERSE, UNIVERSE_LINES, isAwayKey, type PlanetLight, type UniverseKey, type UniversePlanet } from '@/lib/planet/universe'
import SelfFigure from './SelfFigure'

// The star system (design 7.1, slice 3b): DiGi the star in the middle, the
// planets on their orbit rings, the home planet bright at its growth stage,
// open planets lit and everything else a pale outline with the small honest
// sign of what opens it. No padlock, no countdown, no nag: a three year old
// sees a sky with bright planets and some faint ones, which is exactly
// right. Tap a bright planet and the rocket flies there, the child and
// their chosen Friend aboard. GSAP for the flight, the CSS float for the
// drift, and both bow out under reduced motion.

const INK = '#1A1A2E'
const W = 390
const H = 560

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The three orbit rings, ellipses around DiGi. */
const RINGS = [
  { cx: W / 2, cy: H / 2, rx: 92, ry: 64 },
  { cx: W / 2, cy: H / 2, rx: 152, ry: 118 },
  { cx: W / 2, cy: H / 2, rx: 196, ry: 182 },
]

/** Where a planet sits: its ring, walked around by `at`. */
function place(p: UniversePlanet): { x: number; y: number } {
  const ring = RINGS[p.ring]
  const a = p.at * Math.PI * 2 - Math.PI / 2
  return { x: ring.cx + Math.cos(a) * ring.rx, y: ring.cy + Math.sin(a) * ring.ry }
}

/** One motif per planet, a few primitives each, so a pale one still reads. */
function Motif({ p }: { p: UniversePlanet }) {
  const r = p.r
  const sw = Math.max(1.2, r * 0.05)
  switch (p.motif) {
    case 'grass':
      return <path d={`M${-r * 0.7} ${r * 0.25} q ${r * 0.35} ${-r * 0.3} ${r * 0.7} 0 q ${r * 0.35} ${-r * 0.25} ${r * 0.7} 0`} fill="none" stroke={p.edge} strokeWidth={sw * 1.4} strokeLinecap="round" />
    case 'book':
      return <g><rect x={-r * 0.42} y={-r * 0.3} width={r * 0.84} height={r * 0.6} rx={r * 0.08} fill="#FFF6DD" stroke={INK} strokeWidth={sw} /><path d={`M0 ${-r * 0.3} V${r * 0.3} M${-r * 0.28} ${-r * 0.1} h${r * 0.18} M${r * 0.1} ${-r * 0.1} h${r * 0.18}`} stroke={INK} strokeWidth={sw * 0.8} /></g>
    case 'slide':
      return <path d={`M${-r * 0.45} ${-r * 0.35} q ${r * 0.5} ${r * 0.1} ${r * 0.55} ${r * 0.6} h ${r * 0.3} M${-r * 0.45} ${-r * 0.35} v ${r * 0.6}`} fill="none" stroke={INK} strokeWidth={sw * 1.2} strokeLinecap="round" />
    case 'mug':
      return <g><rect x={-r * 0.3} y={-r * 0.25} width={r * 0.5} height={r * 0.5} rx={r * 0.1} fill="#FFF6DD" stroke={INK} strokeWidth={sw} /><path d={`M${r * 0.2} ${-r * 0.1} q ${r * 0.3} 0 0 ${r * 0.25}`} fill="none" stroke={INK} strokeWidth={sw} /><path d={`M${-r * 0.15} ${-r * 0.4} q ${r * 0.08} ${-r * 0.12} 0 ${-r * 0.2}`} fill="none" stroke={INK} strokeWidth={sw * 0.8} opacity={0.7} /></g>
    case 'rocket':
      return <g><path d={`M0 ${-r * 0.45} q ${r * 0.28} ${r * 0.3} 0 ${r * 0.8} q ${-r * 0.28} ${-r * 0.5} 0 ${-r * 0.8} z`} fill="#FFF6DD" stroke={INK} strokeWidth={sw} /><circle cx={0} cy={-r * 0.1} r={r * 0.09} fill="#8EC3F0" stroke={INK} strokeWidth={sw * 0.7} /></g>
    case 'tree':
      return <g><circle cx={0} cy={-r * 0.2} r={r * 0.28} fill={p.edge} stroke={INK} strokeWidth={sw * 0.8} /><rect x={-r * 0.05} y={0} width={r * 0.1} height={r * 0.3} fill={INK} /></g>
    case 'dome':
      return <g><path d={`M${-r * 0.4} ${r * 0.15} a ${r * 0.4} ${r * 0.4} 0 0 1 ${r * 0.8} 0 z`} fill="#FFF6DD" stroke={INK} strokeWidth={sw} /><path d={`M${r * 0.05} ${-r * 0.2} l ${r * 0.3} ${-r * 0.3}`} stroke={INK} strokeWidth={sw} /></g>
    case 'screen':
      return <g><rect x={-r * 0.35} y={-r * 0.28} width={r * 0.7} height={r * 0.5} rx={r * 0.08} fill="#FFF6DD" stroke={INK} strokeWidth={sw} /><path d={`M${-r * 0.18} ${r * 0.02} l ${r * 0.14} ${-r * 0.14} l ${r * 0.1} ${r * 0.08} l ${r * 0.12} ${-r * 0.12}`} fill="none" stroke={p.edge} strokeWidth={sw} strokeLinecap="round" /></g>
    case 'ice':
      return <path d={`M${-r * 0.5} ${r * 0.1} l ${r * 0.25} ${-r * 0.4} l ${r * 0.25} ${r * 0.4} z M0 ${r * 0.1} l ${r * 0.22} ${-r * 0.55} l ${r * 0.24} ${r * 0.55} z`} fill="#FFFFFF" stroke={INK} strokeWidth={sw * 0.8} strokeLinejoin="round" opacity={0.9} />
    case 'lava':
      return <path d={`M${-r * 0.45} ${r * 0.2} l ${r * 0.3} ${-r * 0.55} l ${r * 0.3} ${r * 0.55} z M${-r * 0.08} ${-r * 0.32} q ${r * 0.08} ${-r * 0.18} ${r * 0.16} 0`} fill={p.edge} stroke={INK} strokeWidth={sw * 0.8} strokeLinejoin="round" />
    case 'rainbow':
      return <g fill="none" strokeLinecap="round">{['#D95970', '#F4C542', '#7CB342'].map((c, i) => <path key={c} d={`M${-r * (0.45 - i * 0.1)} ${r * 0.2} a ${r * (0.45 - i * 0.1)} ${r * (0.45 - i * 0.1)} 0 0 1 ${r * (0.9 - i * 0.2)} 0`} stroke={c} strokeWidth={sw * 1.2} />)}</g>
  }
}

/** Fixed pinprick stars, seeded, so the sky is calm and the same every night. */
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: ((i * 97) % W), y: ((i * 71 + 23) % H), r: 0.7 + ((i * 13) % 10) / 9, o: 0.35 + ((i * 7) % 6) / 10,
}))

export default function StarSystem({ home, planets, self, travellerKey, onLand, onSay, onClose, onTap }: {
  home: Home
  planets: PlanetLight[]
  self: Self | null
  /** The Friend who rides the rocket, or null when everyone is resting. */
  travellerKey: FriendKey | null
  /** Land somewhere: 'outdoors' for home, or an away room. */
  onLand: (where: Where, line: string) => void
  onSay: (line: string) => void
  onClose: () => void
  onTap: () => void
}) {
  const [flying, setFlying] = useState(false)
  const rocketRef = useRef<SVGGElement | null>(null)
  const lightOf = (key: UniverseKey) => planets.find(p => p.key === key)
  const homePos = place(UNIVERSE.find(p => p.key === 'home')!)

  function fly(p: UniversePlanet) {
    const light = lightOf(p.key)
    if (!light) return
    onTap()
    if (p.key === 'home') { onLand('outdoors', UNIVERSE_LINES.homeAgain); return }
    if (!light.open) { onSay(light.hint ? `${UNIVERSE_LINES.paler} ${light.hint}.` : UNIVERSE_LINES.paler); return }
    if (!light.landable || !isAwayKey(p.key)) { onSay(light.hint ? `${UNIVERSE_LINES.paler} ${light.hint}.` : UNIVERSE_LINES.paler); return }
    if (!travellerKey) { onSay(UNIVERSE_LINES.needFriend); return }
    const dest = p.key
    const line = dest === 'school' ? UNIVERSE_LINES.schoolEnter : UNIVERSE_LINES.playgroundEnter
    const target = place(p)
    if (flying) return
    if (reduced() || !rocketRef.current) { onLand(dest, line); return }
    setFlying(true)
    onSay(UNIVERSE_LINES.fly(p.title))
    const dx = target.x - homePos.x
    const dy = target.y - homePos.y
    gsap.to(rocketRef.current, {
      x: dx, y: dy, rotation: (Math.atan2(dy, dx) * 180) / Math.PI + 90, duration: 1.1, ease: 'power2.inOut',
      transformOrigin: '50% 50%',
      onComplete: () => { setFlying(false); onLand(dest, line) },
    })
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 6, borderRadius: 22, overflow: 'hidden', background: '#141A3C' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label={UNIVERSE_LINES.map}>
        <defs>
          <radialGradient id="sky-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#26305F" />
            <stop offset="100%" stopColor="#141A3C" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sky-glow)" />
        {STARS.map((st, i) => <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#FFF6DD" opacity={st.o} />)}
        {RINGS.map((rg, i) => <ellipse key={i} cx={rg.cx} cy={rg.cy} rx={rg.rx} ry={rg.ry} fill="none" stroke="#FFF6DD" strokeWidth={1} strokeDasharray="2 7" opacity={0.35} />)}

        {/* DiGi, the star in the middle */}
        <g className="pl-star">
          <circle cx={W / 2} cy={H / 2} r={30} fill="#F4C542" opacity={0.18} />
          <image href="/digi-squad/DiGi-star.svg" x={W / 2 - 22} y={H / 2 - 22} width={44} height={44} />
        </g>

        {/* The planets, brightest truth first: open shines, waiting is pale */}
        {UNIVERSE.filter(p => p.tiers.includes(home.tier)).map((p, i) => {
          const light = lightOf(p.key)
          const open = p.key === 'home' || !!light?.open
          const pos = place(p)
          const visitors = home.friends.filter(f => whereIs(home, f.key) === p.key)
          return (
            <g key={p.key} transform={`translate(${pos.x} ${pos.y})`} onClick={() => fly(p)} style={{ cursor: 'pointer' }} role="button" aria-label={`${p.title}${open ? '' : ', still waking up'}`}>
              <g className="pl-float" style={{ animationDelay: `${(i % 5) * 0.8}s` }}>
                <g opacity={open ? 1 : 0.32}>
                  <circle r={p.r} fill={p.colour} stroke={open ? INK : '#FFF6DD'} strokeWidth={open ? 2 : 1.4} />
                  <path d={`M${-p.r} 0 a ${p.r} ${p.r} 0 0 0 ${p.r * 2} 0 a ${p.r * 1.15} ${p.r * 0.5} 0 0 1 ${-p.r * 2} 0`} fill={p.edge} opacity={0.45} />
                  <Motif p={p} />
                  {p.key === 'home' && home.growthStage >= 4 && (
                    <ellipse rx={p.r * 1.45} ry={p.r * 0.4} fill="none" stroke="#FFF6DD" strokeWidth={2} opacity={0.8} transform="rotate(-18)" />
                  )}
                </g>
                {!open && OPEN_SIGNS[UNIVERSE.find(u => u.key === p.key)!.opens.kind] && (
                  <text y={-p.r - 6} textAnchor="middle" fontSize={13} aria-hidden>{OPEN_SIGNS[p.opens.kind]}</text>
                )}
                {visitors.slice(0, 3).map((f, vi) => (
                  <image key={f.key} href={friendArt(f.key).img} x={-p.r * 0.5 + vi * 16 - 8} y={-p.r - 20} width={18} height={18} aria-hidden />
                ))}
                {open && (
                  <text y={p.r + 15} textAnchor="middle" fontFamily="var(--font-display)" fontWeight={900} fontSize={11.5} fill="#FFF6DD">{p.title}</text>
                )}
              </g>
            </g>
          )
        })}

        {/* The rocket, the child and their Friend aboard, parked by home */}
        <g ref={rocketRef} transform={`translate(${homePos.x + 40} ${homePos.y - 34})`} aria-hidden>
          <g className="pl-float">
            <path d="M0 -26 q 13 14 0 38 q -13 -24 0 -38 z" fill="#FFF6DD" stroke={INK} strokeWidth={2} />
            <path d="M-6 6 l -7 9 l 8 -2 z M6 6 l 7 9 l -8 -2 z" fill="#F2957A" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
            <circle cx={0} cy={-10} r={6} fill="#8EC3F0" stroke={INK} strokeWidth={1.6} />
            {self && <g transform="translate(-1 -4) scale(0.16)"><SelfFigure self={self} size={100} /></g>}
            {travellerKey && <image href={friendArt(travellerKey).img} x={-7} y={2} width={14} height={14} />}
          </g>
        </g>
      </svg>

      <button
        onClick={() => { onTap(); onClose() }}
        style={{
          position: 'absolute', left: 12, bottom: 12, padding: '12px 18px', borderRadius: 16, cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
          background: '#fff', color: INK, border: `2px solid ${INK}`, boxShadow: `0 4px 0 ${INK}`,
        }}
      >
        🪐 {UNIVERSE.find(p => p.key === 'home')!.title}
      </button>
    </div>
  )
}
