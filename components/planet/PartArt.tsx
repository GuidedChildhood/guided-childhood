import type { PartKey } from '@/lib/planet/logic'

// The parts, drawn (slice 3). Every part is a small ink and crayon drawing in
// its own frame: ground and horizon parts stand on (0, 0), sky parts are
// centred on it. Same ledge, same ink as everything else on the planet.

const INK = '#1A1A2E'

export default function PartArt({ part, accent, night, using }: {
  part: PartKey
  /** The child's own theme colour, for the flag and a few trims. */
  accent: string
  /** Lamps, fires and lights glow after the star goes down. */
  night: boolean
  /** A Friend is playing on it right now. */
  using?: boolean
}) {
  const glow = night ? <circle cx={0} cy={-34} r={26} fill="url(#pl-glow)" /> : null
  switch (part) {
    case 'flag':
      return (
        <g>
          <path d="M0 2 V-52" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M1 -52 h26 l-6 8 l6 8 h-26 z" fill={accent} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" className={using ? 'pl-wiggle' : undefined} />
          <ellipse cx={0} cy={2} rx={9} ry={3} fill={INK} opacity={0.15} />
        </g>
      )
    case 'bench':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={26} ry={4} fill={INK} opacity={0.15} />
          <path d="M-18 0 V-18 M18 0 V-18" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <rect x={-26} y={-22} width={52} height={7} rx={3} fill="#D9A066" stroke={INK} strokeWidth={1.8} />
          <rect x={-24} y={-36} width={48} height={6} rx={3} fill="#D9A066" stroke={INK} strokeWidth={1.8} />
          <path d="M-20 -30 V-22 M20 -30 V-22" stroke={INK} strokeWidth={2} />
        </g>
      )
    case 'lamp':
      return (
        <g>
          {glow}
          <ellipse cx={0} cy={2} rx={9} ry={3} fill={INK} opacity={0.15} />
          <path d="M0 2 V-40" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M-9 -40 h18 l-3 -12 h-12 z" fill={night ? '#FFF3B0' : '#FFFFFF'} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        </g>
      )
    case 'rocket':
      return (
        <g className={using ? 'pl-launch' : undefined}>
          <ellipse cx={0} cy={2} rx={16} ry={4} fill={INK} opacity={0.15} />
          {using && <path d="M-6 0 q6 22 12 0 z" fill="#F4C542" stroke="#E8873C" strokeWidth={1.5} />}
          <path d="M-12 -4 l-8 8 h8 z M12 -4 l8 8 h-8 z" fill={accent} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M-12 -2 V-40 q0 -22 12 -30 q12 8 12 30 V-2 z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={0} cy={-36} r={6} fill="#8EC3F0" stroke={INK} strokeWidth={1.8} />
          <path d="M-12 -10 h24" stroke={INK} strokeWidth={1.5} />
        </g>
      )
    case 'telescope':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={14} ry={3} fill={INK} opacity={0.15} />
          <path d="M0 0 L-12 -34 M0 0 L12 -34 M0 0 V-34" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
          <g transform="rotate(-35 0 -36)" className={using ? 'pl-wiggle' : undefined}>
            <rect x={-6} y={-60} width={12} height={30} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
            <rect x={-8} y={-66} width={16} height={8} rx={3} fill={accent} stroke={INK} strokeWidth={1.8} />
          </g>
        </g>
      )
    case 'trampoline':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={28} ry={4} fill={INK} opacity={0.15} />
          <path d="M-22 0 V-14 M22 0 V-14 M-8 0 V-12 M8 0 V-12" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
          <ellipse cx={0} cy={-16} rx={30} ry={7} fill="#8EC3F0" stroke={INK} strokeWidth={2} className={using ? 'pl-bounce' : undefined} />
          <path d="M-30 -16 a30 7 0 0 0 60 0" fill="none" stroke={INK} strokeWidth={1.2} strokeDasharray="3 3" />
        </g>
      )
    case 'rover':
      return (
        <g className={using ? 'pl-wiggle' : undefined}>
          <ellipse cx={0} cy={2} rx={26} ry={4} fill={INK} opacity={0.15} />
          <rect x={-22} y={-24} width={44} height={16} rx={5} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <rect x={-10} y={-32} width={16} height={9} rx={3} fill={accent} stroke={INK} strokeWidth={1.8} />
          <path d="M14 -32 V-44" stroke={INK} strokeWidth={1.8} /><circle cx={14} cy={-46} r={2.5} fill="#F4C542" stroke={INK} strokeWidth={1} />
          {[-15, -5, 5, 15].map(x => <circle key={x} cx={x} cy={-6} r={5} fill={INK} />)}
          {[-15, -5, 5, 15].map(x => <circle key={x} cx={x} cy={-6} r={2} fill="#FFFFFF" />)}
        </g>
      )
    case 'swing':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={26} ry={4} fill={INK} opacity={0.15} />
          <path d="M-24 0 L-10 -56 M24 0 L10 -56 M-14 -56 h28" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <g className={using ? 'pl-swing' : undefined} style={{ transformOrigin: '0px -56px' }}>
            <path d="M-8 -56 V-22 M8 -56 V-22" stroke={INK} strokeWidth={1.6} />
            <rect x={-12} y={-24} width={24} height={5} rx={2} fill={accent} stroke={INK} strokeWidth={1.6} />
          </g>
        </g>
      )
    case 'tent':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={30} ry={4} fill={INK} opacity={0.15} />
          <path d="M-30 0 L0 -44 L30 0 z" fill="#F2957A" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-9 0 L0 -20 L9 0 z" fill="#FFF6DD" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
          <path d="M-4 -34 l2 4 l4 0 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 0 z" fill="#F4C542" />
          {night && <circle cx={0} cy={-8} r={14} fill="url(#pl-glow)" />}
        </g>
      )
    case 'campfire':
      return (
        <g>
          {night && <circle cx={0} cy={-14} r={30} fill="url(#pl-glow)" />}
          <ellipse cx={0} cy={2} rx={20} ry={4} fill={INK} opacity={0.15} />
          <path d="M-18 -2 l36 -8 M-18 -10 l36 8" stroke="#8B5A2B" strokeWidth={5} strokeLinecap="round" />
          <g className="pl-flicker">
            <path d="M0 -10 q-14 -12 -4 -30 q2 8 8 10 q4 -8 2 -16 q14 14 -6 36 z" fill="#F4C542" stroke="#E8873C" strokeWidth={1.5} strokeLinejoin="round" />
            <path d="M0 -12 q-6 -8 -1 -18 q3 6 5 4 q4 6 -4 14 z" fill="#FFF3B0" />
          </g>
        </g>
      )
    case 'dish':
      return (
        <g className={using ? 'pl-wiggle' : undefined}>
          <ellipse cx={0} cy={2} rx={12} ry={3} fill={INK} opacity={0.15} />
          <path d="M0 0 V-30" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M-22 -30 a22 16 0 0 1 44 0 z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" transform="rotate(-25 0 -30)" />
          <path d="M0 -30 l6 -14" stroke={INK} strokeWidth={1.8} /><circle cx={6} cy={-46} r={3} fill={accent} stroke={INK} strokeWidth={1.2} />
        </g>
      )
    case 'night_light':
      return (
        <g>
          {glow}
          <ellipse cx={0} cy={2} rx={14} ry={3} fill={INK} opacity={0.15} />
          <rect x={-12} y={-8} width={24} height={8} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={1.8} />
          <path d="M-12 -8 a12 12 0 0 1 24 0 z" fill={night ? '#FFF3B0' : '#E9E2F7'} stroke={INK} strokeWidth={1.8} />
          <path d="M-3 -14 q2 -4 6 -2 q-4 0 -6 2 z" fill={INK} opacity={0.6} />
        </g>
      )
    case 'moon':
      return (
        <g>
          <circle cx={0} cy={0} r={15} fill="#EDE9F5" stroke={INK} strokeWidth={1.8} />
          <circle cx={-5} cy={-4} r={3} fill="#CFC9DE" />
          <circle cx={5} cy={5} r={2} fill="#CFC9DE" />
        </g>
      )
    case 'comet':
      return (
        <g className="pl-float">
          <path d="M-6 6 L-58 30 M-2 12 L-44 40 M4 14 L-30 44" stroke="#FFF3B0" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          <path d="M-6 6 L-58 30 M-2 12 L-44 40 M4 14 L-30 44" stroke={INK} strokeWidth={1} strokeLinecap="round" opacity={0.35} />
          <circle cx={4} cy={4} r={11} fill="#F4C542" stroke={INK} strokeWidth={1.8} />
        </g>
      )
    case 'star':
      return (
        <path d="M0 -18 l5 12 l13 1 l-10 8 l3 13 l-11 -7 l-11 7 l3 -13 l-10 -8 l13 -1 z" fill="#FFF3B0" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" className="pl-float" />
      )
    case 'robot':
      return (
        <g className={using ? 'pl-wiggle' : undefined}>
          <ellipse cx={0} cy={2} rx={16} ry={4} fill={INK} opacity={0.15} />
          <path d="M-8 0 V-8 M8 0 V-8" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <rect x={-14} y={-30} width={28} height={22} rx={5} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <rect x={-10} y={-46} width={20} height={16} rx={5} fill={accent} stroke={INK} strokeWidth={2} />
          <circle cx={-4} cy={-38} r={2.2} fill={INK} /><circle cx={4} cy={-38} r={2.2} fill={INK} />
          <path d="M0 -46 V-52" stroke={INK} strokeWidth={1.8} /><circle cx={0} cy={-54} r={2.5} fill="#F4C542" stroke={INK} strokeWidth={1} />
          <path d="M-22 -22 h8 M14 -22 h8" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )
    case 'ring':
      // Drawn by the scene itself, around the planet.
      return null
  }
}
