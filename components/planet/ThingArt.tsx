import type { Outfit, ThingKey } from '@/lib/planet/logic'

// The Den, drawn (slice 3a): the things that move (food, toys, the MoonPhone)
// and the furniture that stays. Ink lines, flat fills, the same ledge as the
// rest of the toy. A thing that stands on a spot has its feet at (0, 0) and
// grows upward; a thing that hangs on a wall is centred on (0, 0).

const INK = '#1A1A2E'

/** The outfits in the wardrobe, as a glyph a child can spot. */
export const OUTFIT_ICON: Record<Outfit, string> = { party_hat: '🎉', glasses: '🕶️', helmet: '🪖', cape: '🦸', crown: '👑' }

export function ThingArt({ thing, small = false }: { thing: ThingKey; small?: boolean }) {
  const s = small ? 0.7 : 1
  return (
    <g transform={`scale(${s})`}>
      {thing === 'apple' && (
        <g>
          <ellipse cx={0} cy={1} rx={11} ry={3} fill={INK} opacity={0.15} />
          <path d="M-11 -12 a11 11 0 1 1 22 0 q0 12 -11 12 q-11 0 -11 -12 z" fill="#E85D4A" stroke={INK} strokeWidth={1.8} />
          <path d="M0 -22 q2 -6 6 -8" stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <path d="M1 -25 q6 -4 8 2 q-6 3 -8 -2 z" fill="#3E8F5A" stroke={INK} strokeWidth={1.2} />
          <circle cx={-4} cy={-14} r={2} fill="#FFFFFF" opacity={0.7} />
        </g>
      )}
      {thing === 'toast' && (
        <g>
          <ellipse cx={0} cy={1} rx={13} ry={3} fill={INK} opacity={0.15} />
          <path d="M-12 0 V-16 a6 6 0 0 1 6 -6 h12 a6 6 0 0 1 6 6 V0 z" fill="#E9B872" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M-8 -4 V-14 a3 3 0 0 1 3 -3 h10 a3 3 0 0 1 3 3 V-4 z" fill="#F7DFA8" opacity={0.9} />
          <path d="M-3 -9 q3 -3 6 0" stroke="#F4C542" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      )}
      {thing === 'juice' && (
        <g>
          <ellipse cx={0} cy={1} rx={10} ry={3} fill={INK} opacity={0.15} />
          <path d="M-9 0 l-2 -26 h22 l-2 26 z" fill="#FFFFFF" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M-8 -2 l-1 -14 h18 l-1 14 z" fill="#F7A23B" />
          <path d="M3 -26 l6 -10" stroke="#8EC3F0" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      {thing === 'cake' && (
        <g>
          <ellipse cx={0} cy={1} rx={13} ry={3} fill={INK} opacity={0.15} />
          <path d="M-13 0 V-12 L13 -20 V0 z" fill="#F2957A" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M-13 -6 L13 -14" stroke="#FFF6DD" strokeWidth={2.5} />
          <path d="M-13 -12 L13 -20 L0 -26 z" fill="#FFD7CF" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
          <circle cx={2} cy={-26} r={3} fill="#E85D4A" stroke={INK} strokeWidth={1} />
        </g>
      )}
      {thing === 'teddy' && (
        <g>
          <ellipse cx={0} cy={1} rx={13} ry={3} fill={INK} opacity={0.15} />
          <circle cx={-10} cy={-6} r={5} fill="#C48A5A" stroke={INK} strokeWidth={1.4} />
          <circle cx={10} cy={-6} r={5} fill="#C48A5A" stroke={INK} strokeWidth={1.4} />
          <ellipse cx={0} cy={-10} rx={11} ry={11} fill="#D9A066" stroke={INK} strokeWidth={1.8} />
          <circle cx={-9} cy={-27} r={5} fill="#D9A066" stroke={INK} strokeWidth={1.4} />
          <circle cx={9} cy={-27} r={5} fill="#D9A066" stroke={INK} strokeWidth={1.4} />
          <circle cx={0} cy={-24} r={9} fill="#D9A066" stroke={INK} strokeWidth={1.8} />
          <circle cx={-3} cy={-25} r={1.3} fill={INK} /><circle cx={3} cy={-25} r={1.3} fill={INK} />
          <ellipse cx={0} cy={-21} rx={2.5} ry={1.6} fill={INK} />
        </g>
      )}
      {thing === 'ball' && (
        <g>
          <ellipse cx={0} cy={1} rx={12} ry={3} fill={INK} opacity={0.15} />
          <circle cx={0} cy={-13} r={13} fill="#8EC3F0" stroke={INK} strokeWidth={1.8} />
          <path d="M-13 -13 a13 13 0 0 0 26 0" fill="#F4C542" stroke={INK} strokeWidth={1.4} />
          <path d="M-13 -13 h26" stroke={INK} strokeWidth={1.4} />
          <circle cx={-5} cy={-19} r={2.5} fill="#FFFFFF" opacity={0.8} />
        </g>
      )}
      {thing === 'book' && (
        <g>
          <ellipse cx={0} cy={1} rx={14} ry={3} fill={INK} opacity={0.15} />
          <path d="M-14 0 V-20 h28 V0 z" fill="#3E8F5A" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M-10 -20 V0" stroke="#FFF6DD" strokeWidth={2} opacity={0.7} />
          <circle cx={4} cy={-10} r={4} fill="#F4C542" stroke={INK} strokeWidth={1.2} />
        </g>
      )}
    </g>
  )
}

/** The MoonPhone. Standing on its feet at (0, 0). The screen dims as the battery runs down, never a bar. */
export function PhoneArt({ colour, battery, charging = false, glow = false, tilt = 0 }: { colour: string; battery: number; charging?: boolean; glow?: boolean; tilt?: number }) {
  const bright = Math.max(0.12, Math.min(1, battery / 100))
  return (
    <g transform={`rotate(${tilt})`}>
      {glow && <circle cx={0} cy={-16} r={26} fill="url(#pl-glow)" />}
      <rect x={-8} y={-30} width={16} height={30} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={1.8} />
      <rect x={-5.5} y={-26} width={11} height={19} rx={2} fill={colour} opacity={bright} />
      <rect x={-5.5} y={-26} width={11} height={19} rx={2} fill={INK} opacity={0.55 * (1 - bright)} />
      <circle cx={0} cy={-3.5} r={1.4} fill={INK} opacity={0.5} />
      {charging && <path d="M1.5 -22 l-4.5 6 h3.5 l-1.5 5 l5 -7 h-3.5 z" fill="#F4C542" stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />}
      {battery <= 0 && !charging && <path d="M-3 -17 h6" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" />}
    </g>
  )
}

export type FurnitureKind = 'fridge' | 'cooker' | 'table' | 'shelf' | 'window' | 'sofa' | 'bookshelf' | 'picture' | 'music_box' | 'bed' | 'wardrobe' | 'lamp' | 'toybox' | 'rug' | 'mobile' | 'door' | 'jars'

/**
 * A piece of furniture, drawn with its feet at (0, 0) (floor pieces) or
 * centred on (0, 0) (wall pieces). `open` swings a door, `on` lights a lamp,
 * `using` plays the piece's one animation, `glow` is the shelf at night.
 */
export function Furniture({ kind, open = false, on = false, using = false, glow = false, sky = '#B9DDF5', accent = '#F4C542', side = 'left', lit = false }: {
  kind: FurnitureKind
  open?: boolean
  on?: boolean
  using?: boolean
  glow?: boolean
  sky?: string
  accent?: string
  side?: 'left' | 'right'
  /** A drop target is over it. */
  lit?: boolean
}) {
  const edge = lit ? '#F4C542' : INK
  const edgeW = lit ? 4 : 2
  switch (kind) {
    case 'fridge':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={6} fill={INK} opacity={0.15} />
          <rect x={-35} y={-190} width={70} height={190} rx={10} fill="#F4F1EA" stroke={edge} strokeWidth={edgeW} />
          <rect x={-29} y={-182} width={58} height={176} rx={6} fill="#DDE8EE" stroke={INK} strokeWidth={1} opacity={0.9} />
          {/* the door: on its hinge at the left, swung open to show what is inside */}
          {open ? (
            <g>
              <rect x={-29} y={-182} width={58} height={176} rx={6} fill="#EAF3F7" stroke={INK} strokeWidth={1} />
              <path d="M-29 -176 h58 M-29 -140 h58 M-29 -100 h58 M-29 -58 h58" stroke={INK} strokeWidth={1.2} opacity={0.35} />
              <path d="M-35 -190 l-30 -10 v196 l30 14 z" fill="#F4F1EA" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
              <rect x={-60} y={-120} width={4} height={30} rx={2} fill={INK} />
            </g>
          ) : (
            <g>
              <path d="M-35 -120 h70" stroke={INK} strokeWidth={2} />
              <rect x={22} y={-170} width={5} height={36} rx={2.5} fill={INK} />
              <rect x={22} y={-108} width={5} height={60} rx={2.5} fill={INK} />
              <circle cx={-14} cy={-150} r={9} fill={accent} stroke={INK} strokeWidth={1.4} />
            </g>
          )}
        </g>
      )
    case 'cooker':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={6} fill={INK} opacity={0.15} />
          <rect x={-35} y={-90} width={70} height={90} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <rect x={-31} y={-86} width={62} height={10} rx={4} fill="#D8D2E8" stroke={INK} strokeWidth={1.2} />
          {[-16, 16].map(dx => <circle key={dx} cx={dx} cy={-81} r={6} fill={using ? '#E85D4A' : '#3B3B52'} stroke={INK} strokeWidth={1.2} />)}
          <rect x={-27} y={-64} width={54} height={40} rx={5} fill="#DDE8EE" stroke={INK} strokeWidth={1.4} />
          <rect x={-20} y={-56} width={40} height={20} rx={3} fill="#1A1A2E" opacity={0.65} />
          <rect x={-27} y={-16} width={54} height={4} rx={2} fill={INK} opacity={0.5} />
          {using && [-16, 16].map((dx, i) => <path key={dx} className="pl-dust" d={`M${dx} -90 q3 -8 0 -16 q-3 -8 0 -16`} stroke="#FFFFFF" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.9 - i * 0.2} />)}
        </g>
      )
    case 'jars':
      return (
        <g>
          <rect x={-40} y={-4} width={80} height={6} rx={3} fill="#D9A066" stroke={INK} strokeWidth={1.4} />
          {[-24, -4, 16].map((dx, i) => (
            <g key={dx}>
              <rect x={dx} y={-26} width={14} height={22} rx={3} fill={['#F4C542', '#F2957A', '#8EC3F0'][i]} stroke={INK} strokeWidth={1.2} />
              <rect x={dx + 2} y={-30} width={10} height={5} rx={2} fill="#FFFFFF" stroke={INK} strokeWidth={1} />
            </g>
          ))}
        </g>
      )
    case 'table':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={62} ry={6} fill={INK} opacity={0.15} />
          <path d="M-48 -78 V0 M48 -78 V0" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <rect x={-60} y={-84} width={120} height={9} rx={4} fill="#D9A066" stroke={INK} strokeWidth={2} />
          <path d="M-52 -75 h104" stroke="#B8763F" strokeWidth={2} opacity={0.6} />
        </g>
      )
    case 'shelf':
      return (
        <g>
          {glow && <ellipse cx={0} cy={-14} rx={70} ry={30} fill="url(#pl-glow)" />}
          <path d="M-52 0 l-8 12 M52 0 l8 12" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <rect x={-60} y={-4} width={120} height={8} rx={4} fill="#D9A066" stroke={edge} strokeWidth={edgeW} />
          {/* the plug on the wall, the one that makes it a charging shelf */}
          <rect x={44} y={-30} width={16} height={16} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={1.4} />
          <circle cx={49} cy={-22} r={1.5} fill={INK} /><circle cx={55} cy={-22} r={1.5} fill={INK} />
          <path d="M52 -14 v10" stroke={INK} strokeWidth={1.5} />
          <path d="M-30 -8 h60" stroke={accent} strokeWidth={2} strokeDasharray="2 4" opacity={lit ? 1 : 0} />
        </g>
      )
    case 'window':
      return (
        <g>
          <rect x={-46} y={-44} width={92} height={88} rx={8} fill={sky} stroke={INK} strokeWidth={2.5} />
          <path d="M0 -44 V44 M-46 0 H46" stroke={INK} strokeWidth={2} />
          <circle cx={-22} cy={-22} r={7} fill="#F4C542" opacity={0.9} />
          <path d="M8 18 a8 8 0 0 1 14 -4 a6 6 0 0 1 6 10 h-24 a5 5 0 0 1 4 -6 z" fill="#FFFFFF" opacity={0.9} />
          <rect x={-52} y={44} width={104} height={8} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={1.6} />
        </g>
      )
    case 'sofa':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={74} ry={7} fill={INK} opacity={0.15} />
          <rect x={-70} y={-70} width={140} height={44} rx={14} fill={accent} stroke={INK} strokeWidth={2} />
          <rect x={-62} y={-48} width={124} height={34} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <rect x={-72} y={-52} width={18} height={44} rx={8} fill={accent} stroke={INK} strokeWidth={2} />
          <rect x={54} y={-52} width={18} height={44} rx={8} fill={accent} stroke={INK} strokeWidth={2} />
          <path d="M-56 0 v-8 M56 0 v-8" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <circle cx={-30} cy={-58} r={4} fill="#FFFFFF" opacity={0.7} /><circle cx={30} cy={-58} r={4} fill="#FFFFFF" opacity={0.7} />
        </g>
      )
    case 'bookshelf':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={6} fill={INK} opacity={0.15} />
          <rect x={-36} y={-220} width={72} height={220} rx={6} fill="#D9A066" stroke={INK} strokeWidth={2} />
          {[-160, -100, -40].map(y => <rect key={y} x={-30} y={y} width={60} height={4} fill="#B8763F" />)}
          {[[-28, -212, '#E85D4A'], [-18, -208, '#8EC3F0'], [-8, -214, '#3E8F5A'], [4, -210, '#F4C542'], [16, -212, '#F2957A'],
            [-28, -152, '#3E8F5A'], [-16, -156, '#F4C542'], [-4, -150, '#8EC3F0'], [10, -154, '#E85D4A'],
            [-26, -92, '#8EC3F0'], [-14, -96, '#F2957A'], [0, -90, '#3E8F5A'], [14, -94, '#F4C542']].map(([x, y, c], i) => (
            <rect key={i} x={Number(x)} y={Number(y)} width={9} height={52 - (Number(y) % 8)} rx={1.5} fill={String(c)} stroke={INK} strokeWidth={1} className={using && i === 3 ? 'pl-wiggle' : undefined} />
          ))}
        </g>
      )
    case 'picture':
      return (
        <g className={using ? 'pl-swing' : undefined}>
          <rect x={-30} y={-23} width={60} height={46} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={2.2} />
          <rect x={-25} y={-18} width={50} height={36} rx={2} fill="#B9DDF5" />
          <circle cx={4} cy={2} r={10} fill="#8FD1B4" stroke={INK} strokeWidth={1.2} />
          <ellipse cx={4} cy={2} rx={15} ry={4} fill="none" stroke="#F4C542" strokeWidth={2} />
          <circle cx={-14} cy={-8} r={2} fill="#F4C542" />
        </g>
      )
    case 'music_box':
      return (
        <g>
          <rect x={-14} y={-14} width={28} height={14} rx={3} fill="#F2957A" stroke={INK} strokeWidth={1.6} />
          <rect x={-14} y={-20} width={28} height={6} rx={2} fill="#FFFFFF" stroke={INK} strokeWidth={1.4} />
          <circle cx={0} cy={-24} r={3} fill="#F4C542" stroke={INK} strokeWidth={1} className={using ? 'pl-float' : undefined} />
          {using && [-12, 0, 12].map((dx, i) => <text key={dx} className="pl-sparkle" x={dx} y={-34 - i * 4} fontSize={10} fill={INK} fontFamily="var(--font-display)" fontWeight={900}>♪</text>)}
        </g>
      )
    case 'bed':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={58} ry={6} fill={INK} opacity={0.15} />
          <rect x={-52} y={-124} width={104} height={54} rx={12} fill="#D9A066" stroke={INK} strokeWidth={2} />
          <rect x={-56} y={-70} width={112} height={26} rx={8} fill="#FFFFFF" stroke={edge} strokeWidth={edgeW} />
          <rect x={-56} y={-50} width={112} height={26} rx={8} fill={accent} stroke={INK} strokeWidth={2} />
          <rect x={-44} y={-82} width={36} height={16} rx={6} fill="#FFF6DD" stroke={INK} strokeWidth={1.4} />
          <path d="M-50 0 v-24 M50 0 v-24" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      )
    case 'wardrobe':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={46} ry={6} fill={INK} opacity={0.15} />
          <rect x={-40} y={-230} width={80} height={230} rx={8} fill="#D9A066" stroke={INK} strokeWidth={2} />
          {open ? (
            <g>
              <rect x={-34} y={-222} width={68} height={214} rx={4} fill="#B8763F" />
              <path d="M-30 -200 h60" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
              <path d="M-40 -230 l-26 -8 v240 l26 6 z" fill="#D9A066" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
              <path d="M40 -230 l26 -8 v240 l-26 6 z" fill="#D9A066" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            </g>
          ) : (
            <g>
              <path d="M0 -226 V-6" stroke={INK} strokeWidth={2} />
              <rect x={-9} y={-130} width={4} height={22} rx={2} fill={INK} />
              <rect x={5} y={-130} width={4} height={22} rx={2} fill={INK} />
              <path d="M-30 -210 h20 M10 -210 h20" stroke="#B8763F" strokeWidth={3} strokeLinecap="round" />
            </g>
          )}
        </g>
      )
    case 'lamp':
      return (
        <g>
          {on && <circle cx={0} cy={-6} r={30} fill="url(#pl-glow)" />}
          <path d="M-14 4 h28 l-4 -20 h-20 z" fill={on ? '#FFF3B0' : '#FFFFFF'} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M0 4 v10" stroke={INK} strokeWidth={2.5} />
          <rect x={-8} y={14} width={16} height={5} rx={2.5} fill={INK} />
        </g>
      )
    case 'toybox':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={6} fill={INK} opacity={0.15} />
          <rect x={-35} y={-40} width={70} height={40} rx={6} fill="#8EC3F0" stroke={edge} strokeWidth={edgeW} />
          <path d="M-35 -26 h70" stroke={INK} strokeWidth={1.5} opacity={0.5} />
          {open ? (
            <path d="M-35 -40 l10 -26 h70 l-10 26 z" fill="#8EC3F0" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          ) : (
            <rect x={-37} y={-48} width={74} height={10} rx={4} fill="#8EC3F0" stroke={INK} strokeWidth={2} />
          )}
          <circle cx={0} cy={-14} r={4} fill="#F4C542" stroke={INK} strokeWidth={1.2} />
        </g>
      )
    case 'rug':
      return (
        <g>
          <ellipse cx={0} cy={0} rx={120} ry={22} fill={accent} opacity={0.35} stroke={INK} strokeWidth={1.5} />
          <ellipse cx={0} cy={0} rx={90} ry={15} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.6} />
        </g>
      )
    case 'mobile':
      return (
        <g className="pl-float">
          <path d="M0 -60 V-30" stroke={INK} strokeWidth={1.5} />
          <path d="M-30 -30 H30" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          {[-26, 0, 26].map((dx, i) => (
            <g key={dx}>
              <path d={`M${dx} -30 v${14 + i * 6}`} stroke={INK} strokeWidth={1.2} />
              {i === 1 ? <circle cx={dx} cy={-4} r={7} fill="#E4E1EE" stroke={INK} strokeWidth={1.4} /> :
                <path d={`M${dx} ${-16 - i * 6 + 6} l2.5 6 l6 1 l-4.5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-4.5 -4 l6 -1 z`} fill="#F4C542" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />}
            </g>
          ))}
        </g>
      )
    case 'door': {
      const dir = side === 'left' ? -1 : 1
      return (
        <g>
          <path d="M-24 0 V-110 a24 24 0 0 1 48 0 V0 z" fill={lit ? '#FFF3B0' : '#FFF6DD'} stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
          <path d="M-16 0 V-104 a16 16 0 0 1 32 0 V0 z" fill={lit ? '#F4C542' : '#D9A066'} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" opacity={0.9} />
          <circle cx={dir * -8} cy={-52} r={3} fill="#F4C542" stroke={INK} strokeWidth={1} />
          <path d={`M${dir * -8} -74 l${dir * 12} 0 m${dir * -5} -5 l${dir * 5} 5 l${dir * -5} 5`} stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )
    }
    default:
      return null
  }
}
