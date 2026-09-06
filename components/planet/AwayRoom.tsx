'use client'

import { useState } from 'react'
import type { AwayRoomKey, Friend, Mood, Outfit } from '@/lib/planet/logic'
import { isGrownUp, type FriendKey, type Self } from '@/lib/planet/logic'
import { AWAY_TITLES } from '@/lib/planet/universe'
import FriendFigure from './FriendFigure'
import SelfFigure from './SelfFigure'

// The first room of a planet away from home (slice 3b): Moonbase School's
// classroom and the Playground planet. Drawn whole from data here, the
// RoomScene manner but lighter: this slice has no thing placement away from
// home, so the room is a backdrop, its own fixed furniture that answers a
// tap with a wiggle, the visiting Friends, the child's own explorer beside
// them, and the rocket home. The pocket and the away spots arrive with 3c.

const INK = '#1A1A2E'
const W = 390
const H = 560
const FLOOR = 430

type Prop = { id: string; x: number; y: number; draw: React.ReactNode; label: string; hit: { x: number; y: number; w: number; h: number } }

/** The classroom: the board, DiGi's desk, two desks, the bookshelf. */
const SCHOOL_PROPS: Prop[] = [
  {
    id: 'board', x: 195, y: 150, label: 'The board', hit: { x: -92, y: -62, w: 184, h: 116 },
    draw: (
      <g>
        <rect x={-90} y={-60} width={180} height={110} rx={10} fill="#2F8F6B" stroke={INK} strokeWidth={2.5} />
        <path d="M-64 -26 q 10 -18 24 0 M-20 -22 h 52 M-64 4 h 40 M-8 6 q 8 -14 20 0" fill="none" stroke="#FFF6DD" strokeWidth={3} strokeLinecap="round" />
        <circle cx={54} cy={-30} r={9} fill="#F4C542" stroke="#FFF6DD" strokeWidth={2} />
      </g>
    ),
  },
  {
    id: 'digi_desk', x: 82, y: FLOOR - 6, label: 'DiGi teaches here', hit: { x: -50, y: -92, w: 100, h: 95 },
    draw: (
      <g>
        <rect x={-46} y={-46} width={92} height={14} rx={6} fill="#C97B54" stroke={INK} strokeWidth={2.2} />
        <rect x={-38} y={-32} width={10} height={32} fill="#A85E3D" stroke={INK} strokeWidth={1.8} />
        <rect x={28} y={-32} width={10} height={32} fill="#A85E3D" stroke={INK} strokeWidth={1.8} />
        <image href="/digi-squad/DiGi-star.svg" x={-20} y={-88} width={44} height={44} />
      </g>
    ),
  },
  {
    id: 'desk', x: 250, y: FLOOR - 4, label: 'A desk', hit: { x: -44, y: -54, w: 88, h: 58 },
    draw: (
      <g>
        <rect x={-40} y={-40} width={80} height={12} rx={5} fill="#E0AC69" stroke={INK} strokeWidth={2.2} />
        <rect x={-32} y={-28} width={8} height={28} fill="#C68642" stroke={INK} strokeWidth={1.6} />
        <rect x={24} y={-28} width={8} height={28} fill="#C68642" stroke={INK} strokeWidth={1.6} />
        <rect x={-18} y={-48} width={22} height={8} rx={2} fill="#8EC3F0" stroke={INK} strokeWidth={1.4} />
      </g>
    ),
  },
  {
    id: 'books', x: 340, y: FLOOR - 8, label: 'The books', hit: { x: -28, y: -86, w: 56, h: 88 },
    draw: (
      <g>
        <rect x={-26} y={-84} width={52} height={84} rx={6} fill="#F2A58F" stroke={INK} strokeWidth={2.2} />
        {[0, 1].map(row => (
          <g key={row}>
            {[0, 1, 2].map(i => <rect key={i} x={-19 + i * 13} y={-76 + row * 38} width={10} height={30} rx={2} fill={['#8EC3F0', '#F4C542', '#7CB342'][i]} stroke={INK} strokeWidth={1.3} />)}
          </g>
        ))}
      </g>
    ),
  },
]

/** The playground: the slide, the swings, the sandpit. */
const PLAYGROUND_PROPS: Prop[] = [
  {
    id: 'slide', x: 110, y: FLOOR, label: 'The slide', hit: { x: -76, y: -120, w: 152, h: 124 },
    draw: (
      <g>
        <path d="M-58 -110 h 26 v 14 l 52 82 h -22 l -50 -78 z" fill="#F4C542" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M-58 -96 l -14 96 h 12 l 12 -84" fill="#E0AC69" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </g>
    ),
  },
  {
    id: 'swings', x: 262, y: FLOOR, label: 'The swings', hit: { x: -72, y: -124, w: 144, h: 128 },
    draw: (
      <g>
        <path d="M-70 0 L-40 -118 h 80 L70 0" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M-40 -118 h 80" stroke={INK} strokeWidth={4} />
        <g className="pl-swing">
          <path d="M-18 -114 v 74 M18 -114 v 74" stroke={INK} strokeWidth={2} />
          <rect x={-24} y={-42} width={48} height={9} rx={4} fill="#F2957A" stroke={INK} strokeWidth={2} />
        </g>
      </g>
    ),
  },
  {
    id: 'sandpit', x: 195, y: FLOOR + 58, label: 'The sandpit', hit: { x: -94, y: -28, w: 188, h: 56 },
    draw: (
      <g>
        <ellipse rx={92} ry={26} fill="#F1C9A5" stroke={INK} strokeWidth={2.4} />
        <path d="M-30 -6 a 10 6 0 0 1 20 0 M14 2 a 8 5 0 0 1 16 0" fill="none" stroke="#C68642" strokeWidth={2} strokeLinecap="round" />
        <path d="M40 -8 l 5 -12 l 5 12 z" fill="#D95970" stroke={INK} strokeWidth={1.6} />
      </g>
    ),
  },
]

export default function AwayRoom({ away, friends, moods, childAge, wearing, self, wiggle, lines, onTapFriend, onTapProp, onRocket }: {
  away: AwayRoomKey
  friends: Friend[]
  moods: Record<string, Mood>
  childAge: number
  wearing: Partial<Record<FriendKey, Outfit>>
  self: Self | null
  wiggle: FriendKey | null
  /** One line per prop, from the registry: what the lead Friend says when it is tapped. */
  lines: Record<string, string>
  onTapFriend: (friend: FriendKey) => void
  onTapProp: (id: string, line: string) => void
  onRocket: () => void
}) {
  const [poked, setPoked] = useState<string | null>(null)
  const props = away === 'school' ? SCHOOL_PROPS : PLAYGROUND_PROPS
  const skyTop = away === 'school' ? '#26305F' : '#8EC3F0'
  const skyBottom = away === 'school' ? '#3A4780' : '#CFE8F5'
  const ground = away === 'school' ? '#B9C4D6' : '#F4C542'

  const poke = (p: Prop) => {
    setPoked(p.id)
    window.setTimeout(() => setPoked(cur => (cur === p.id ? null : cur)), 750)
    onTapProp(p.id, lines[p.id] ?? p.label)
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} role="img" aria-label={AWAY_TITLES[away]}>
      <defs>
        <linearGradient id={`away-sky-${away}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#away-sky-${away})`} />
      {away === 'school' && Array.from({ length: 18 }, (_, i) => (
        <circle key={i} cx={(i * 103) % W} cy={(i * 47 + 15) % (FLOOR - 60)} r={1 + (i % 3) / 2} fill="#FFF6DD" opacity={0.5} />
      ))}
      <path d={`M0 ${FLOOR} q ${W / 2} -34 ${W} 0 V${H} H0 z`} fill={ground} stroke={INK} strokeWidth={2.5} />

      {props.map(p => (
        <g key={p.id} transform={`translate(${p.x} ${p.y})`} onClick={() => poke(p)} style={{ cursor: 'pointer' }} role="button" aria-label={p.label}>
          {/* An invisible hit area sized to the prop, because a drawing of
              swings is mostly air and a small finger deserves the whole shape
              to count, and one prop's air must never cover another. */}
          <rect x={p.hit.x} y={p.hit.y} width={p.hit.w} height={p.hit.h} fill="transparent" />
          <g className={poked === p.id ? 'pl-wiggle' : undefined}>{p.draw}</g>
        </g>
      ))}

      {/* The child's own explorer, here with their Friends */}
      {self && (
        <g transform={`translate(${W / 2 - 60} ${FLOOR + 26})`}>
          <g className="pl-breathe"><SelfFigure self={self} size={92} /></g>
        </g>
      )}
      {friends.map((f, i) => (
        <g key={f.key} transform={`translate(${W / 2 + 10 + i * 74} ${FLOOR + 30})`} onClick={() => onTapFriend(f.key)} style={{ cursor: 'pointer' }}>
          <g className={wiggle === f.key ? 'pl-wiggle' : 'pl-breathe'}>
            <FriendFigure friend={f.key} mood={moods[f.key] ?? 'happy'} baby={!isGrownUp(f.key, childAge)} outfit={wearing[f.key] ?? null} size={104} />
          </g>
        </g>
      ))}

      {/* The rocket home, parked on the edge of the scene */}
      <g transform={`translate(${W - 46} ${H - 64})`} onClick={onRocket} style={{ cursor: 'pointer' }} role="button" aria-label="Fly back to the map">
        <g className="pl-float">
          <path d="M0 -34 q 17 18 0 50 q -17 -32 0 -50 z" fill="#FFF6DD" stroke={INK} strokeWidth={2.4} />
          <path d="M-8 8 l -9 12 l 11 -3 z M8 8 l 9 12 l -11 -3 z" fill="#F2957A" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <circle cx={0} cy={-13} r={7.5} fill="#8EC3F0" stroke={INK} strokeWidth={1.8} />
        </g>
      </g>
    </svg>
  )
}
