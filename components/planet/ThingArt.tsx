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

export type FurnitureKind = 'fridge' | 'cooker' | 'table' | 'shelf' | 'window' | 'sofa' | 'bookshelf' | 'picture' | 'music_box' | 'bed' | 'wardrobe' | 'lamp' | 'toybox' | 'rug' | 'mobile' | 'door' | 'jars' | 'board' | 'desk' | 'digi_desk' | 'globe' | 'books' | 'slide' | 'swing' | 'sandpit' | 'bench' | 'tree' | 'sign' | 'launchpad' | 'porthole'
  // The far away planets (slice 3c): the launch pad, the forest, the dome, the cafe, the studio, the igloo field, the hot springs, the colour field.
  | 'gantry' | 'rover_garage' | 'fuel_pump' | 'tools' | 'big_tree' | 'pond' | 'burrow' | 'telescope' | 'star_map' | 'deckchair'
  | 'counter' | 'menu' | 'cafe_table' | 'cushions' | 'feed_wall' | 'dome_tool' | 'studio_desk' | 'ring_light'
  | 'igloo' | 'ice_slide' | 'snowman' | 'warm_hut' | 'volcano' | 'warm_pool' | 'stones' | 'lava_rock' | 'steam_vent'
  | 'rainbow_slide' | 'cloud_bed' | 'paint_pots' | 'sun_shower'

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
    // ── Moonbase School and the Playground planet (slice 3b) ──────────────
    case 'board':
      return (
        <g>
          <rect x={-70} y={-46} width={140} height={92} rx={6} fill="#2F5D50" stroke={INK} strokeWidth={2.5} />
          <rect x={-74} y={44} width={148} height={7} rx={3} fill="#D9A066" stroke={INK} strokeWidth={1.4} />
          <path d="M-52 -22 q10 -10 20 0 t20 0 t20 0" stroke="#FFF6DD" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.9} />
          <circle cx={-40} cy={10} r={9} fill="none" stroke="#FFF6DD" strokeWidth={2.2} />
          <ellipse cx={-40} cy={10} rx={14} ry={4} fill="none" stroke="#F4C542" strokeWidth={2} />
          <path d="M-10 4 h44 M-10 16 h30" stroke="#FFF6DD" strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
          {using && <path className="pl-sparkle" d="M20 -30 l4 -8 l4 8 l-8 -5 h8 z" fill="#FFF6DD" />}
        </g>
      )
    case 'desk':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={5} fill={INK} opacity={0.15} />
          <path d="M-30 -52 V0 M30 -52 V0" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <rect x={-40} y={-58} width={80} height={9} rx={4} fill="#D9A066" stroke={INK} strokeWidth={2} />
          <rect x={-34} y={-49} width={68} height={12} rx={3} fill="#B8763F" stroke={INK} strokeWidth={1.4} />
          <rect x={-14} y={-34} width={28} height={8} rx={3} fill="#F2957A" stroke={INK} strokeWidth={1.4} />
          <path d="M-14 -22 h28 v22 h-28 z" fill="none" stroke={INK} strokeWidth={1.6} opacity={0.4} />
        </g>
      )
    case 'digi_desk':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={48} ry={6} fill={INK} opacity={0.15} />
          <rect x={-46} y={-60} width={92} height={60} rx={8} fill="#FFF6DD" stroke={INK} strokeWidth={2} />
          <rect x={-40} y={-54} width={80} height={16} rx={4} fill={accent} stroke={INK} strokeWidth={1.4} opacity={0.9} />
          <text x={0} y={-42} textAnchor="middle" fontSize={10} fontFamily="var(--font-mono)" fontWeight={600} fill={INK} letterSpacing={1.5}>DIGI</text>
          <g className={using ? 'pl-wiggle' : 'pl-float'}>
            <image href="/digi-squad/DiGi-star.svg" x={-30} y={-124} width={60} height={60} />
          </g>
        </g>
      )
    case 'globe':
      return (
        <g className={using ? 'pl-swing' : undefined}>
          <path d="M0 0 v-8" stroke={INK} strokeWidth={2.5} />
          <ellipse cx={0} cy={0} rx={12} ry={4} fill="#D9A066" stroke={INK} strokeWidth={1.6} />
          <circle cx={0} cy={-26} r={18} fill="#8EC3F0" stroke={INK} strokeWidth={2} />
          <path d="M-12 -32 q8 -8 14 0 q4 6 -2 10 q-8 2 -12 -4 z" fill="#3E8F5A" />
          <path d="M4 -14 q6 -6 10 0 q-2 6 -8 4 z" fill="#3E8F5A" />
          <path d="M-18 -26 h36" stroke={INK} strokeWidth={1} opacity={0.4} />
          <path d="M-8 -46 l-6 -6" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>
      )
    case 'books':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={18} ry={3} fill={INK} opacity={0.15} />
          <rect x={-16} y={-8} width={32} height={8} rx={2} fill="#E85D4A" stroke={INK} strokeWidth={1.4} />
          <rect x={-13} y={-16} width={30} height={8} rx={2} fill="#F4C542" stroke={INK} strokeWidth={1.4} />
          <rect x={-15} y={-24} width={28} height={8} rx={2} fill="#3E8F5A" stroke={INK} strokeWidth={1.4} />
          {using && <text className="pl-sparkle" x={16} y={-28} fontSize={10} fill={INK} fontFamily="var(--font-display)" fontWeight={900}>A</text>}
        </g>
      )
    case 'slide':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={70} ry={7} fill={INK} opacity={0.15} />
          <path d="M-54 0 V-96 M-38 0 V-96" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          {[-80, -64, -48, -32, -16].map(y => <path key={y} d={`M-54 ${y} h16`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
          <path d="M-48 -100 h22 q10 0 16 10 L60 -8 q6 6 -2 8 H30 L-16 -84 h-32 z" fill={lit ? '#FFE9A8' : '#F4C542'} stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
          <path d="M-36 -92 L40 -12" stroke="#FFF6DD" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          <path d="M-10 0 V-40 M30 0 V-20" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </g>
      )
    case 'swing':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={56} ry={6} fill={INK} opacity={0.15} />
          <path d="M-56 0 L-40 -120 M-24 0 L-40 -120 M56 0 L40 -120 M24 0 L40 -120" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-44 -120 h88" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <g className={using ? 'pl-swing' : undefined} style={{ transformOrigin: '0px -120px' }}>
            <path d="M-14 -118 V-34 M14 -118 V-34" stroke={INK} strokeWidth={2} />
            <rect x={-20} y={-36} width={40} height={8} rx={3} fill={lit ? '#FFE9A8' : accent} stroke={edge} strokeWidth={edgeW} />
          </g>
        </g>
      )
    case 'sandpit':
      return (
        <g>
          <ellipse cx={0} cy={-4} rx={62} ry={20} fill="#D9A066" stroke={edge} strokeWidth={edgeW} />
          <ellipse cx={0} cy={-6} rx={52} ry={14} fill="#F4D9A6" />
          <path d="M-30 -10 q6 -6 12 0 M10 -4 q6 -6 12 0" stroke="#D9A066" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M30 -14 l4 -12 l4 12 z" fill="#E85D4A" stroke={INK} strokeWidth={1.2} />
          <rect x={-40} y={-20} width={10} height={10} rx={2} fill="#8EC3F0" stroke={INK} strokeWidth={1.2} />
          {using && [-16, 0, 16].map((dx, i) => <circle key={dx} className="pl-sparkle" cx={dx} cy={-26 - (i % 2) * 6} r={2.5} fill="#D9A066" />)}
        </g>
      )
    case 'bench':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={30} ry={4} fill={INK} opacity={0.15} />
          <path d="M-20 0 V-20 M20 0 V-20" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <rect x={-30} y={-24} width={60} height={7} rx={3} fill="#D9A066" stroke={edge} strokeWidth={edgeW} />
          <rect x={-28} y={-40} width={56} height={6} rx={3} fill="#D9A066" stroke={INK} strokeWidth={1.8} />
          <path d="M-24 -34 V-24 M24 -34 V-24" stroke={INK} strokeWidth={2} />
        </g>
      )
    case 'tree':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={30} ry={6} fill={INK} opacity={0.15} />
          <path d="M-8 0 V-60 M8 0 V-60" stroke="#B8763F" strokeWidth={0} />
          <path d="M-9 0 q2 -30 0 -60 h18 q-2 30 0 60 z" fill="#B8763F" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={-26} cy={-78} r={26} fill="#3E8F5A" stroke={INK} strokeWidth={2} />
          <circle cx={26} cy={-82} r={28} fill="#3E8F5A" stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={-106} r={30} fill="#4FA96C" stroke={INK} strokeWidth={2} className={using ? 'pl-wiggle' : undefined} />
          <circle cx={-10} cy={-96} r={3.5} fill="#E85D4A" stroke={INK} strokeWidth={1} />
          <circle cx={14} cy={-84} r={3.5} fill="#E85D4A" stroke={INK} strokeWidth={1} />
        </g>
      )
    case 'sign':
      return (
        <g>
          <path d="M0 0 V-56" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M-4 -58 h40 l8 8 l-8 8 h-40 z" fill="#FFF6DD" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          <text x={16} y={-46} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fontWeight={600} fill={INK} letterSpacing={1}>HOME</text>
        </g>
      )
    case 'launchpad':
      return (
        <g>
          <ellipse cx={0} cy={0} rx={44} ry={12} fill="#D8D2E8" stroke={edge} strokeWidth={edgeW} />
          <ellipse cx={0} cy={-2} rx={30} ry={7} fill="none" stroke={INK} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.6} />
          <path d="M-40 -10 v-40 M40 -10 v-40" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={-40} cy={-54} r={4} fill={lit ? '#F4C542' : '#E85D4A'} stroke={INK} strokeWidth={1.2} className={lit ? 'pl-target' : undefined} />
          <circle cx={40} cy={-54} r={4} fill={lit ? '#F4C542' : '#E85D4A'} stroke={INK} strokeWidth={1.2} className={lit ? 'pl-target' : undefined} />
        </g>
      )
    case 'porthole':
      return (
        <g>
          <circle cx={0} cy={0} r={42} fill={sky} stroke={INK} strokeWidth={3} />
          <circle cx={0} cy={0} r={36} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />
          <circle cx={-14} cy={-10} r={7} fill="#F4C542" opacity={0.9} />
          <circle cx={16} cy={12} r={9} fill="#8FD1B4" stroke={INK} strokeWidth={1} />
          {[-28, 0, 28].map(a => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 39} cy={Math.sin((a * Math.PI) / 180) * 39} r={2} fill={INK} opacity={0.6} />)}
        </g>
      )

    // ── The far away planets (slice 3c) ────────────────────────────────────
    case 'gantry':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={54} ry={7} fill={INK} opacity={0.15} />
          <path d="M-46 0 V-130 M-22 0 V-130" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          {[-116, -92, -68, -44, -20].map(y => <path key={y} d={`M-46 ${y} h24 M-46 ${y + 12} l24 -12`} stroke={INK} strokeWidth={2} strokeLinecap="round" />)}
          <path d="M-22 -110 h20" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <g className={using ? 'pl-launch' : undefined}>
            <path d="M18 0 l-8 -14 v-70 q0 -34 18 -48 q18 14 18 48 v70 l-8 14 z" fill="#FFF6DD" stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
            <path d="M10 -30 l-14 22 v10 l14 -6 z M46 -30 l14 22 v10 l-14 -6 z" fill="#E85D4A" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
            <circle cx={28} cy={-78} r={9} fill="#8EC3F0" stroke={INK} strokeWidth={1.8} />
            <path d="M14 -60 h28" stroke={accent} strokeWidth={4} />
            {using && <path className="pl-flicker" d="M20 2 q8 22 8 30 q0 -8 8 -30 z" fill="#F4C542" stroke="#E85D4A" strokeWidth={1.5} />}
          </g>
        </g>
      )
    case 'rover_garage':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={58} ry={7} fill={INK} opacity={0.15} />
          <path d="M-56 0 V-70 a56 40 0 0 1 112 0 V0 z" fill="#D8D2E8" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          <path d="M-42 0 V-58 a42 30 0 0 1 84 0 V0 z" fill="#2B3568" stroke={INK} strokeWidth={1.8} />
          <g className={using ? 'pl-wiggle' : undefined}>
            <rect x={-30} y={-36} width={60} height={22} rx={7} fill={accent} stroke={INK} strokeWidth={2} />
            <rect x={-18} y={-50} width={30} height={16} rx={5} fill="#8EC3F0" stroke={INK} strokeWidth={1.8} />
            <path d="M18 -50 v-16 l8 -4" stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none" />
            <circle cx={-18} cy={-12} r={9} fill={INK} /><circle cx={-18} cy={-12} r={4} fill="#FFF6DD" />
            <circle cx={18} cy={-12} r={9} fill={INK} /><circle cx={18} cy={-12} r={4} fill="#FFF6DD" />
          </g>
        </g>
      )
    case 'fuel_pump':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={26} ry={5} fill={INK} opacity={0.15} />
          <rect x={-22} y={-78} width={44} height={78} rx={8} fill="#8EC3F0" stroke={edge} strokeWidth={edgeW} />
          <rect x={-14} y={-68} width={28} height={20} rx={4} fill="#FFF6DD" stroke={INK} strokeWidth={1.5} />
          <path d="M-8 -58 l3 -6 l3 6 l-6 -4 h7 z" fill="#F4C542" />
          <path d="M22 -50 q22 0 22 20 v20" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
          <rect x={38} y={-12} width={12} height={16} rx={3} fill={INK} />
          {using && [0, 1, 2].map(i => <circle key={i} className="pl-sparkle" cx={44 + (i - 1) * 6} cy={8 - i * 4} r={2.5} fill="#F4C542" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </g>
      )
    case 'tools':
      return (
        <g className={using ? 'pl-wiggle' : undefined}>
          <rect x={-40} y={-26} width={80} height={52} rx={8} fill="#D9A066" stroke={INK} strokeWidth={2} />
          <path d="M-26 -14 v28 M-30 -14 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M-4 -12 v26 M-12 -14 h16 v6 h-16 z" stroke={INK} strokeWidth={2.5} fill="#8EC3F0" strokeLinejoin="round" />
          <path d="M20 -12 v26 M16 -16 h8 v8 h-8 z" stroke={INK} strokeWidth={2.5} fill="#E85D4A" strokeLinejoin="round" />
        </g>
      )
    case 'big_tree':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={7} fill={INK} opacity={0.15} />
          <path d="M-12 0 q3 -60 0 -130 h24 q-3 70 0 130 z" fill="#B8763F" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M8 -100 q40 -10 60 -30" stroke="#B8763F" strokeWidth={9} strokeLinecap="round" />
          <circle cx={-36} cy={-140} r={34} fill="#3E8F5A" stroke={INK} strokeWidth={2} />
          <circle cx={38} cy={-146} r={36} fill="#3E8F5A" stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={-176} r={40} fill="#4FA96C" stroke={INK} strokeWidth={2} />
          <g className={using ? 'pl-swing' : undefined} style={{ transformOrigin: '60px -126px' }}>
            <path d="M60 -126 V-40" stroke="#D9A066" strokeWidth={3} />
            <rect x={48} y={-42} width={24} height={8} rx={3} fill={lit ? '#FFE9A8' : '#D9A066'} stroke={edge} strokeWidth={edgeW} />
          </g>
        </g>
      )
    case 'pond':
      return (
        <g>
          <ellipse cx={0} cy={-4} rx={66} ry={22} fill="#4C9FD6" stroke={edge} strokeWidth={edgeW} />
          <ellipse cx={-10} cy={-8} rx={44} ry={12} fill="#8EC3F0" opacity={0.7} />
          <ellipse cx={30} cy={-6} rx={10} ry={5} fill="#3E8F5A" stroke={INK} strokeWidth={1.2} />
          <path d="M-60 -20 v-22 M-54 -18 v-28 M-48 -20 v-18" stroke="#3E8F5A" strokeWidth={3} strokeLinecap="round" />
          {using && <ellipse className="pl-puff" cx={-6} cy={-6} rx={14} ry={6} fill="none" stroke="#FFFFFF" strokeWidth={2} />}
        </g>
      )
    case 'burrow':
      return (
        <g>
          <path d="M-46 0 q10 -36 46 -36 q36 0 46 36 z" fill="#B8763F" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <ellipse cx={0} cy={-4} rx={20} ry={13} fill="#3A2A1E" stroke={INK} strokeWidth={1.5} />
          {using && (
            <g className="pl-sparkle">
              <path d="M-10 -10 l4 -14 l6 12 M10 -10 l-4 -14 l-6 12" stroke="#E0AC69" strokeWidth={4} strokeLinecap="round" fill="none" />
              <circle cx={-4} cy={-6} r={1.8} fill={INK} /><circle cx={4} cy={-6} r={1.8} fill={INK} />
            </g>
          )}
        </g>
      )
    case 'telescope':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={6} fill={INK} opacity={0.15} />
          <path d="M-30 0 L0 -70 L30 0 M0 -70 V-20" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(-35 0 -76)">
            <rect x={-50} y={-90} width={100} height={26} rx={9} fill="#FFF6DD" stroke={edge} strokeWidth={edgeW} />
            <rect x={-56} y={-93} width={14} height={32} rx={5} fill={INK} />
            <rect x={36} y={-86} width={18} height={18} rx={5} fill="#8EC3F0" stroke={INK} strokeWidth={1.5} />
          </g>
          {using && <path className="pl-sparkle" d="M70 -170 q-30 20 -60 30" stroke="#F4C542" strokeWidth={3} strokeLinecap="round" fill="none" />}
          {using && <circle className="pl-sparkle" cx={72} cy={-172} r={6} fill="#FFF6DD" stroke="#F4C542" strokeWidth={2} />}
        </g>
      )
    case 'star_map':
      return (
        <g>
          <rect x={-54} y={-40} width={108} height={80} rx={8} fill="#26305F" stroke={INK} strokeWidth={2} />
          <path d="M-36 -18 L-10 -26 L12 -8 L34 -20 M-30 14 L-8 6 L20 22" stroke="#FFF6DD" strokeWidth={1.2} fill="none" opacity={0.7} />
          {[[-36, -18], [-10, -26], [12, -8], [34, -20], [-30, 14], [-8, 6], [20, 22]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} fill="#FFF6DD" />)}
          <g className={using ? 'pl-star' : undefined}><path d="M30 6 l3 -8 l3 8 l-8 -5 h10 z" fill="#F4C542" /></g>
        </g>
      )
    case 'deckchair':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={30} ry={4} fill={INK} opacity={0.15} />
          <path d="M-28 0 L-10 -44 M28 0 L4 -30" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M-14 -46 L26 -32 L34 -8 L-2 -18 z" fill={lit ? '#FFE9A8' : '#FFF6DD'} stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
          <path d="M-8 -40 L22 -28 M-4 -30 L28 -18" stroke={accent} strokeWidth={4} strokeLinecap="round" />
        </g>
      )
    case 'counter':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={64} ry={7} fill={INK} opacity={0.15} />
          <rect x={-62} y={-54} width={124} height={54} rx={6} fill="#D9A066" stroke={INK} strokeWidth={2.2} />
          <rect x={-66} y={-62} width={132} height={12} rx={4} fill="#FFF6DD" stroke={INK} strokeWidth={2} />
          <rect x={-46} y={-100} width={40} height={40} rx={6} fill="#8EC3F0" stroke={INK} strokeWidth={2} />
          <rect x={-40} y={-94} width={12} height={8} rx={2} fill="#FFF6DD" />
          <path d="M14 -64 v-14 h20 v14 z M34 -74 q10 0 0 8" fill="#FFF6DD" stroke={INK} strokeWidth={1.8} />
          {using && [0, 1].map(i => <circle key={i} className="pl-sparkle" cx={24 + i * 6} cy={-84 - i * 6} r={3} fill="#FFFFFF" opacity={0.9} style={{ animationDelay: `${i * 0.2}s` }} />)}
        </g>
      )
    case 'menu':
      return (
        <g className={using ? 'pl-wiggle' : undefined}>
          <rect x={-40} y={-30} width={80} height={60} rx={6} fill="#2E2818" stroke={INK} strokeWidth={2} />
          <path d="M-26 -14 h36 M-26 -2 h44 M-26 10 h30" stroke="#FFF6DD" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M18 8 h10 v9 h-10 z M28 10 q6 0 0 5" fill="#FFF6DD" stroke="#FFF6DD" strokeWidth={1} />
        </g>
      )
    case 'cafe_table':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={34} ry={4} fill={INK} opacity={0.15} />
          <path d="M0 0 V-40 M-14 0 h28" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={0} cy={-44} rx={38} ry={10} fill={lit ? '#FFE9A8' : '#FFF6DD'} stroke={edge} strokeWidth={edgeW} />
          <path d="M-8 -52 h14 v8 h-14 z M6 -50 q6 0 0 5" fill="#E85D4A" stroke={INK} strokeWidth={1.4} />
        </g>
      )
    case 'cushions':
      return (
        <g>
          <ellipse cx={0} cy={2} rx={36} ry={5} fill={INK} opacity={0.15} />
          <rect x={-34} y={-14} width={68} height={16} rx={7} fill="#F2A58F" stroke={edge} strokeWidth={edgeW} />
          <rect x={-28} y={-28} width={56} height={16} rx={7} fill={accent} stroke={INK} strokeWidth={2} />
          <rect x={-22} y={-40} width={44} height={14} rx={7} fill="#8EC3F0" stroke={INK} strokeWidth={2} />
        </g>
      )
    case 'feed_wall':
      return (
        <g>
          <rect x={-90} y={-60} width={180} height={120} rx={12} fill="#FFF6DD" stroke={INK} strokeWidth={2.2} />
          {[-58, 0, 58].map((x, i) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <rect x={-24} y={-44} width={48} height={70} rx={6} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
              <circle cx={0} cy={-18} r={13} fill={['#8FD1B4', '#8EC3F0', '#F7A23B'][i]} stroke={INK} strokeWidth={1.2} />
              <path d="M-14 8 h28 M-14 16 h18" stroke={INK} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
              <path d="M-6 26 l6 -6 l6 6" stroke="#E85D4A" strokeWidth={2} fill="none" strokeLinecap="round" className={using && i === 1 ? 'pl-sparkle' : undefined} />
            </g>
          ))}
          {using && <path className="pl-sparkle" d="M0 -60 l3 -9 l3 9 l-9 -6 h12 z" fill="#F4C542" />}
        </g>
      )
    case 'dome_tool':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={36} ry={6} fill={INK} opacity={0.15} />
          <rect x={-30} y={-18} width={60} height={18} rx={5} fill="#D8D2E8" stroke={INK} strokeWidth={2} />
          <path d="M-32 -18 a32 32 0 0 1 64 0 z" fill="rgba(142,195,240,0.35)" stroke={edge} strokeWidth={edgeW} className={using ? 'pl-target' : undefined} />
          <path d="M-22 -30 q6 -12 16 -14" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.8} />
          <circle cx={0} cy={-28} r={6} fill={accent} stroke={INK} strokeWidth={1.4} />
        </g>
      )
    case 'studio_desk':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={48} ry={6} fill={INK} opacity={0.15} />
          <rect x={-44} y={-40} width={88} height={10} rx={4} fill="#FFF6DD" stroke={edge} strokeWidth={edgeW} />
          <path d="M-36 -30 V0 M36 -30 V0" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <rect x={-18} y={-64} width={36} height={24} rx={4} fill="#26305F" stroke={INK} strokeWidth={1.8} />
          <rect x={-12} y={-58} width={24} height={14} rx={2} fill="#8EC3F0" />
          <path d="M0 -40 v-4" stroke={INK} strokeWidth={2} />
        </g>
      )
    case 'ring_light':
      return (
        <g>
          <path d="M0 0 V-70 M-12 0 h24" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <circle cx={0} cy={-92} r={22} fill="none" stroke={using ? '#F4C542' : '#FFF6DD'} strokeWidth={7} className={using ? 'pl-target' : undefined} />
          <circle cx={0} cy={-92} r={22} fill="none" stroke={INK} strokeWidth={1.5} />
          <circle cx={0} cy={-92} r={13} fill="none" stroke={INK} strokeWidth={1.5} />
        </g>
      )
    case 'igloo':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={54} ry={7} fill={INK} opacity={0.15} />
          <path d="M-52 0 a52 46 0 0 1 104 0 z" fill="#FFFFFF" stroke={edge} strokeWidth={edgeW} />
          <path d="M-40 -14 h80 M-46 -28 h92 M-30 -40 h60" stroke="#CFE8F5" strokeWidth={2} />
          <path d="M-18 0 a18 16 0 0 1 36 0 z" fill="#26305F" stroke={INK} strokeWidth={1.8} />
          {using && [0, 1, 2].map(i => <circle key={i} className="pl-sparkle" cx={-20 + i * 20} cy={-56 - (i % 2) * 8} r={2.5} fill="#FFFFFF" />)}
        </g>
      )
    case 'ice_slide':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={70} ry={7} fill={INK} opacity={0.15} />
          <path d="M-54 0 V-96 M-38 0 V-96" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          {[-80, -64, -48, -32, -16].map(y => <path key={y} d={`M-54 ${y} h16`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
          <path d="M-48 -100 h22 q10 0 16 10 L60 -8 q6 6 -2 8 H30 L-16 -84 h-32 z" fill={lit ? '#FFE9A8' : '#CFE8F5'} stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
          <path d="M-36 -92 L40 -12" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          <path d="M-10 0 V-40 M30 0 V-20" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </g>
      )
    case 'snowman':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={30} ry={5} fill={INK} opacity={0.15} />
          <circle cx={0} cy={-26} r={28} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={-64} r={20} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={-94} r={15} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <path d="M-14 -80 q14 6 28 0" stroke={accent} strokeWidth={5} strokeLinecap="round" fill="none" />
          <circle cx={-5} cy={-97} r={1.8} fill={INK} /><circle cx={5} cy={-97} r={1.8} fill={INK} />
          <path d="M0 -93 l12 3 l-12 3 z" fill="#F7A23B" stroke={INK} strokeWidth={1} />
          <circle cx={0} cy={-66} r={2} fill={INK} /><circle cx={0} cy={-56} r={2} fill={INK} />
          <g className={using ? 'pl-wiggle' : undefined} style={{ transformOrigin: '0px -104px' }}>
            <rect x={-18} y={-110} width={36} height={5} rx={2} fill={INK} />
            <rect x={-11} y={-128} width={22} height={20} rx={3} fill={INK} />
          </g>
        </g>
      )
    case 'warm_hut':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={44} ry={6} fill={INK} opacity={0.15} />
          <rect x={-38} y={-52} width={76} height={52} rx={4} fill="#B8763F" stroke={INK} strokeWidth={2} />
          <path d="M-46 -50 L0 -86 L46 -50 z" fill="#E85D4A" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <rect x={16} y={-84} width={10} height={16} fill={INK} />
          <rect x={-12} y={-38} width={24} height={20} rx={3} fill="#F4C542" stroke={INK} strokeWidth={1.5} className={using ? 'pl-target' : undefined} />
          <rect x={-32} y={-26} width={14} height={26} rx={2} fill="#3A2A1E" stroke={INK} strokeWidth={1.4} />
          {using && [0, 1].map(i => <circle key={i} className="pl-sparkle" cx={22 + i * 5} cy={-92 - i * 7} r={4} fill="#FFFFFF" opacity={0.8} style={{ animationDelay: `${i * 0.2}s` }} />)}
        </g>
      )
    case 'volcano':
      return (
        <g>
          <path d="M-90 0 L-24 -96 h48 L90 0 z" fill="#7A4A2B" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          <path d="M-24 -96 h48 l-6 12 q-18 8 -36 0 z" fill="#E85D4A" stroke={INK} strokeWidth={1.6} />
          <path d="M-8 -84 q-14 20 -6 40 M6 -84 q16 24 4 46" stroke="#E85D4A" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.8} />
          <circle cx={0} cy={-112} r={9} fill="#D8D2E8" opacity={0.8} className={using ? 'pl-puff' : 'pl-float'} />
          <circle cx={12} cy={-126} r={6} fill="#D8D2E8" opacity={0.6} className="pl-float" />
        </g>
      )
    case 'warm_pool':
      return (
        <g>
          <ellipse cx={0} cy={-4} rx={58} ry={20} fill="#3A2A1E" stroke={INK} strokeWidth={2} />
          <ellipse cx={0} cy={-6} rx={48} ry={14} fill={lit ? '#FFE9A8' : '#8EC3F0'} stroke={edge} strokeWidth={edgeW} />
          <ellipse cx={-10} cy={-9} rx={26} ry={6} fill="#CFE8F5" opacity={0.7} />
          {[[-52, -14], [50, -10], [-30, 8], [36, 8]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={8} ry={5} fill="#7A4A2B" stroke={INK} strokeWidth={1.2} />)}
          {[0, 1, 2].map(i => <circle key={i} className={using ? 'pl-sparkle' : undefined} cx={-16 + i * 16} cy={-26 - (i % 2) * 6} r={4} fill="#FFFFFF" opacity={using ? 0.9 : 0.35} style={{ animationDelay: `${i * 0.2}s` }} />)}
        </g>
      )
    case 'stones':
      return (
        <g>
          {[-66, -22, 22, 66].map((x, i) => (
            <ellipse key={x} cx={x} cy={-2 + (i % 2) * 4} rx={20} ry={9} fill={lit ? '#FFE9A8' : '#B9C4D6'} stroke={edge} strokeWidth={edgeW} />
          ))}
        </g>
      )
    case 'lava_rock':
      return (
        <g className={using ? 'pl-flicker' : undefined}>
          <ellipse cx={0} cy={3} rx={34} ry={5} fill={INK} opacity={0.15} />
          <path d="M-32 0 q-6 -40 20 -52 q34 -4 38 30 q2 22 -26 22 z" fill="#3A2A1E" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          <path d="M-14 -36 l10 12 l-6 10 l12 8" stroke={using ? '#FFD166' : '#E85D4A'} strokeWidth={4} strokeLinecap="round" fill="none" />
          <circle cx={6} cy={-22} r={using ? 26 : 0} fill="#F4C542" opacity={0.18} />
        </g>
      )
    case 'steam_vent':
      return (
        <g>
          <path d="M-14 0 q14 -8 28 0" stroke={INK} strokeWidth={2.5} strokeLinecap="round" fill="none" />
          {[0, 1, 2].map(i => <circle key={i} className={using ? 'pl-puff' : undefined} cx={-6 + i * 6} cy={-10 - i * 9} r={4 + i} fill="#FFFFFF" opacity={using ? 0.85 : 0.3} style={{ animationDelay: `${i * 0.12}s` }} />)}
        </g>
      )
    case 'rainbow_slide':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={70} ry={7} fill={INK} opacity={0.15} />
          <path d="M-54 0 V-96 M-38 0 V-96" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          {[-80, -64, -48, -32, -16].map(y => <path key={y} d={`M-54 ${y} h16`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
          <path d="M-48 -100 h22 q10 0 16 10 L60 -8 q6 6 -2 8 H30 L-16 -84 h-32 z" fill={lit ? '#FFE9A8' : '#FFF6DD'} stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
          {['#E85D4A', '#F7A23B', '#F4C542', '#3E8F5A', '#4C9FD6'].map((c, i) => <path key={c} d={`M${-40 + i * 4} ${-94 + i * 3} L${34 + i * 4} ${-14 + i * 3}`} stroke={c} strokeWidth={3} strokeLinecap="round" />)}
          <path d="M-10 0 V-40 M30 0 V-20" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </g>
      )
    case 'cloud_bed':
      return (
        <g className={using ? 'pl-breathe' : undefined}>
          <ellipse cx={0} cy={2} rx={54} ry={6} fill={INK} opacity={0.12} />
          <path d="M-50 -6 a16 16 0 0 1 22 -20 a20 20 0 0 1 36 -8 a18 18 0 0 1 30 14 a14 14 0 0 1 12 14 z" fill={lit ? '#FFE9A8' : '#FFFFFF'} stroke={edge} strokeWidth={edgeW} strokeLinejoin="round" />
          <path d="M-30 -14 q8 -6 16 0 M6 -22 q8 -6 16 0" stroke="#CFE8F5" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      )
    case 'paint_pots':
      return (
        <g>
          <ellipse cx={0} cy={3} rx={40} ry={5} fill={INK} opacity={0.15} />
          {['#E85D4A', '#4C9FD6', '#F4C542'].map((c, i) => (
            <g key={c} transform={`translate(${(i - 1) * 26} 0)`}>
              <path d="M-11 0 l2 -24 h18 l2 24 z" fill="#FFF6DD" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
              <rect x={-10} y={-28} width={20} height={6} rx={2} fill={c} stroke={INK} strokeWidth={1.4} />
            </g>
          ))}
          <path d="M30 -2 l14 -40" stroke="#B8763F" strokeWidth={3} strokeLinecap="round" />
          <path d="M44 -42 l4 -10 l4 8 z" fill="#4C9FD6" stroke={INK} strokeWidth={1} />
          {using && <path className="pl-puff" d="M-50 -30 q6 -14 16 -6 q12 -10 16 4 q10 4 0 12 q-8 10 -16 2 q-12 6 -16 -4 q-8 -2 0 -8 z" fill="#4C9FD6" opacity={0.85} />}
        </g>
      )
    case 'sun_shower':
      return (
        <g>
          <circle cx={-28} cy={-10} r={22} fill="#F4C542" opacity={0.95} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d={`M${-28 + Math.cos((a * Math.PI) / 180) * 28} ${-10 + Math.sin((a * Math.PI) / 180) * 28} L${-28 + Math.cos((a * Math.PI) / 180) * 36} ${-10 + Math.sin((a * Math.PI) / 180) * 36}`} stroke="#F4C542" strokeWidth={3} strokeLinecap="round" />)}
          <path d="M6 12 a14 14 0 0 1 24 -8 a10 10 0 0 1 12 16 h-40 a8 8 0 0 1 4 -8 z" fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
          {[0, 1, 2].map(i => <path key={i} className={using ? 'pl-dust' : undefined} d={`M${12 + i * 12} 26 v8`} stroke="#4C9FD6" strokeWidth={2.5} strokeLinecap="round" opacity={using ? 0.9 : 0.35} style={{ animationDelay: `${i * 0.15}s` }} />)}
        </g>
      )
    default:
      return null
  }
}
