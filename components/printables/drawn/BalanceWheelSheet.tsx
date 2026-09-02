import { HappyPaper, Caption, INK } from './HappyPaper'

// My Balance Wheel, ages 4 to 10 (stages 1 and 2).
//
// The device balance idea for the youngest: a good day has lots of colours,
// and the screen is one slice of the wheel, not the whole wheel. Eight
// slices, each with a small drawing to colour: colour a slice every time
// you do that thing today. Nothing is banned and nothing is scored; the
// picture does the teaching, the way the Feel Your Happy book turns a
// feeling into a thing to do.

const SLICES: { label: string; icon: string }[] = [
  { label: 'Outside', icon: 'M0,-20 L16,4 L-16,4 Z M-3,4 h6 v14 h-6 z' },
  { label: 'Make', icon: 'M-13,9 L7,-11 L15,-3 L-5,17 Z M-13,9 L-16,20 L-5,17 M4,-8 L12,0' },
  { label: 'Read', icon: 'M-18,-10 Q-9,-15 0,-8 Q9,-15 18,-10 V12 Q9,7 0,14 Q-9,7 -18,12 Z M0,-8 V14' },
  { label: 'Move', icon: 'M0,0 m-16,0 a16,16 0 1,0 32,0 a16,16 0 1,0 -32,0 M-15,-5 Q0,4 15,-5 M-11,10 Q0,2 11,10' },
  { label: 'Help', icon: 'M0,16 S-17,4 -17,-6 a9,9 0 0,1 17,-4 a9,9 0 0,1 17,4 c0,10 -17,22 -17,22 z' },
  { label: 'Family', icon: 'M-18,2 L0,-16 L18,2 V18 H-18 Z M-5,18 V6 H5 V18' },
  { label: 'Rest', icon: 'M6,-18 a18,18 0 1,0 12,30 a14,14 0 0,1 -12,-30 z' },
  { label: 'Screen', icon: 'M-14,-18 h28 v36 h-28 z M-9,-13 h18 v24 h-18 z M-2,14 h4' },
]

export default function BalanceWheelSheet({ childName, stars }: { childName: string; stars: number }) {
  const R = 250
  const C = 280
  const n = SLICES.length
  return (
    <HappyPaper
      title="My balance wheel"
      kicker={`${childName ? `${childName}'s day` : 'My day'} · colour a slice every time you do it`}
      stars={stars}
      deal="Five colours or more today? Show your grown up."
    >
      <div style={{ display: 'flex', justifyContent: 'center', flex: '1 1 auto', minHeight: 0 }}>
        <svg viewBox="0 0 560 560" style={{ height: '100%', maxHeight: 580, width: 'auto', maxWidth: '100%' }} aria-hidden>
          {/* The wheel */}
          <circle cx={C} cy={C} r={R} fill="#fff" stroke={INK} strokeWidth="6" />
          {SLICES.map((_, i) => {
            const a = ((-90 + i * (360 / n)) * Math.PI) / 180
            return <line key={i} x1={C} y1={C} x2={C + R * Math.cos(a)} y2={C + R * Math.sin(a)} stroke={INK} strokeWidth="4" />
          })}
          {/* The icons and their names, one per slice */}
          {SLICES.map((s, i) => {
            const a = ((-90 + (i + 0.5) * (360 / n)) * Math.PI) / 180
            const ix = C + 150 * Math.cos(a)
            const iy = C + 150 * Math.sin(a)
            const tx = C + 212 * Math.cos(a)
            const ty = C + 212 * Math.sin(a)
            return (
              <g key={s.label}>
                <g transform={`translate(${ix} ${iy}) scale(1.6)`}>
                  <path d={s.icon} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                </g>
                <text x={tx} y={ty + 5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700" letterSpacing="1.5" fill={INK}>
                  {s.label.toUpperCase()}
                </text>
              </g>
            )
          })}
          {/* The hub: a smiley to colour */}
          <circle cx={C} cy={C} r="44" fill="#fff" stroke={INK} strokeWidth="6" />
          <circle cx={C - 14} cy={C - 8} r="4" fill={INK} />
          <circle cx={C + 14} cy={C - 8} r="4" fill={INK} />
          <path d={`M ${C - 18} ${C + 10} q 18 16 36 0`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          {/* A few stars round the edge, theirs to colour */}
          <path d="M40 60l5 10 11 1-8 8 2 11-10-6-10 6 2-11-8-8 11-1z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M520 500l5 10 11 1-8 8 2 11-10-6-10 6 2-11-8-8 11-1z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M515 45l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
      <Caption size={16}>
        A good day has lots of colours. Screen is one slice, not the whole wheel.
      </Caption>
    </HappyPaper>
  )
}
