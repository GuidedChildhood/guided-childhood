'use client'

import { HAPPY, Sticker } from '@/components/kid/HappyNewsBits'
import { CRAYON } from '@/components/printables/drawn/HappyPaper'

// The child's home grid, in the happy news finish.
//
// Justin, 2 September 2026, with the grid on his phone: "without changing
// anything underneath, make the design of the child app home page more
// Apple level UX, happy news webpage style icons, to look as good as the
// printables page. Check Mobbin, super top level design for kids."
//
// The reference is Duolingo's Math Games screen on Mobbin: white tiles, one
// big drawn icon centred, the label under it, nothing else competing. What
// was here was phone emoji in pale squares with hairline borders, which is
// every admin panel's shortcut grid. These tiles wear the finish the
// printables and the balance card already wear: a 2px ink edge, a hard
// ledge, and a drawn icon in the printables' own crayon colours, centred,
// with the words underneath. Everything a tile does is handed in by the
// screen, so the taps are exactly what they were.

export type HappyIconName = 'time' | 'wins' | 'passport' | 'lessons' | 'deal' | 'make' | 'ask' | 'print' | 'games' | 'tell' | 'friends'

export type HomeTile = {
  icon: HappyIconName
  label: string
  sub: string
  /** The icon well's crayon colour. */
  tint: string
  onClick: () => void
}

const INK = HAPPY.ink

/** The drawn icons: ink lines, crayon fills, the printables' own hand. */
export function HappyIcon({ name, size = 40 }: { name: HappyIconName; size?: number }) {
  const s = { width: size, height: size, viewBox: '0 0 64 64', fill: 'none', stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'time':
      return (
        <svg {...s}>
          <circle cx="32" cy="34" r="22" fill={CRAYON.butter} />
          <path d="M26 8h12M32 8v4" />
          <path d="M27 24v20l16-10z" fill="#fff" />
        </svg>
      )
    case 'wins':
      return (
        <svg {...s}>
          <path d="M20 12h24v14a12 12 0 0 1-24 0z" fill={CRAYON.butter} />
          <path d="M20 16h-8v4a8 8 0 0 0 8 8M44 16h8v4a8 8 0 0 1-8 8" />
          <path d="M32 38v8M24 52h16M28 46h8v6h-8z" fill={CRAYON.butter} />
          <path d="M32 18l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5z" fill="#fff" strokeWidth="2" />
        </svg>
      )
    case 'passport':
      return (
        <svg {...s}>
          <rect x="14" y="8" width="36" height="48" rx="6" fill={CRAYON.sky} />
          <path d="M22 8v48" />
          <circle cx="36" cy="30" r="9" fill="#fff" />
          <path d="M36 24l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill={CRAYON.coral} strokeWidth="2" />
          <path d="M28 46h16" />
        </svg>
      )
    case 'lessons':
      return (
        <svg {...s}>
          <path d="M8 14q12-4 24 2v36q-12-6-24-2z" fill={CRAYON.green} />
          <path d="M56 14q-12-4-24 2v36q12-6 24-2z" fill="#fff" />
          <path d="M38 24h10M38 31h10M38 38h6" strokeWidth="2.5" />
          <path d="M14 26h10M14 33h10" stroke="#fff" strokeWidth="2.5" />
        </svg>
      )
    case 'deal':
      return (
        <svg {...s}>
          <rect x="14" y="8" width="30" height="42" rx="5" fill={CRAYON.paper} />
          <path d="M22 20h14M22 28h14M22 36h8" strokeWidth="2.5" />
          <circle cx="44" cy="44" r="11" fill={CRAYON.coral} />
          <circle cx="40" cy="42" r="1.4" fill={INK} stroke="none" /><circle cx="48" cy="42" r="1.4" fill={INK} stroke="none" />
          <path d="M39 47q5 4 10 0" strokeWidth="2.5" />
        </svg>
      )
    case 'make':
      return (
        <svg {...s}>
          <path d="M32 8c-14 0-24 10-24 22 0 9 6 14 12 14 5 0 6-4 10-4 3 0 5 2 5 5 0 5 4 9 9 6 8-5 12-14 12-21C56 18 46 8 32 8z" fill={CRAYON.paper} />
          <circle cx="20" cy="30" r="4" fill={CRAYON.coral} strokeWidth="2" />
          <circle cx="28" cy="19" r="4" fill={CRAYON.butter} strokeWidth="2" />
          <circle cx="41" cy="19" r="4" fill={CRAYON.green} strokeWidth="2" />
          <circle cx="48" cy="30" r="4" fill={CRAYON.sky} strokeWidth="2" />
        </svg>
      )
    case 'ask':
      return (
        <svg {...s}>
          <path d="M32 8a15 15 0 0 0-9 27v6h18v-6a15 15 0 0 0-9-27z" fill={CRAYON.butter} />
          <path d="M25 47h14M27 53h10" />
          <path d="M32 18v10M27 23h10" stroke="#fff" strokeWidth="3.5" />
          <path d="M52 8l1.5 3.5 3.5 1.5-3.5 1.5L52 18l-1.5-3.5L47 13l3.5-1.5z" fill={CRAYON.coral} strokeWidth="2" />
        </svg>
      )
    case 'print':
      return (
        <svg {...s}>
          <path d="M40 6l10 10-26 26-12 2 2-12z" fill={CRAYON.coral} />
          <path d="M34 12l10 10" />
          <path d="M12 54q8-8 14 0t14 0t12-4" strokeWidth="3.5" stroke={CRAYON.sky} />
          <path d="M12 54q8-8 14 0t14 0t12-4" strokeWidth="1.5" />
        </svg>
      )
    case 'games':
      return (
        <svg {...s}>
          <path d="M18 18h28a12 12 0 0 1 12 10l2 12a7 7 0 0 1-12.5 5L44 40H20l-3.5 5A7 7 0 0 1 4 40l2-12a12 12 0 0 1 12-10z" fill={CRAYON.sky} />
          <path d="M20 26v10M15 31h10" strokeWidth="3.5" />
          <circle cx="42" cy="28" r="3" fill={CRAYON.coral} strokeWidth="2" />
          <circle cx="48" cy="34" r="3" fill={CRAYON.butter} strokeWidth="2" />
        </svg>
      )
    case 'tell':
      return (
        <svg {...s}>
          <path d="M8 14h30a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H22l-9 8v-8H8a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" transform="translate(2 0)" fill={CRAYON.paper} />
          <path d="M40 26h12a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-2v7l-8-7h-2" fill={CRAYON.sky} />
          <path d="M25 33s-7-4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5-7 9-7 9z" fill={CRAYON.coral} strokeWidth="2" />
        </svg>
      )
    case 'friends':
      return (
        <svg {...s}>
          <circle cx="32" cy="34" r="16" fill={CRAYON.sky} />
          <path d="M8 40c6 8 40 8 48-6M12 30c8-8 34-8 44 0" strokeWidth="3.5" stroke={CRAYON.butter} />
          <path d="M8 40c6 8 40 8 48-6" strokeWidth="1.5" />
          <path d="M50 8l1.6 3.6 3.6 1.6-3.6 1.6L50 18.4l-1.6-3.6-3.6-1.6 3.6-1.6z" fill={CRAYON.butter} strokeWidth="2" />
          <circle cx="27" cy="31" r="1.6" fill={INK} stroke="none" /><circle cx="37" cy="31" r="1.6" fill={INK} stroke="none" />
          <path d="M27 38q5 4 10 0" strokeWidth="2.5" />
        </svg>
      )
  }
}

const EDGE: React.CSSProperties = { background: '#fff', border: `2px solid ${INK}`, borderRadius: 20, boxShadow: `0 4px 0 ${INK}` }

function Well({ tint, children, size = 76 }: { tint: string; children: React.ReactNode; size?: number }) {
  return (
    <span aria-hidden style={{ width: size, height: size, borderRadius: '50%', background: tint, border: `2px solid ${INK}`, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </span>
  )
}

export default function KidHomeTiles({ minutesReady, unlocked, rule, onUseTime, tiles, onFriends, tellHref }: {
  minutesReady: number
  /** All jobs done and stars in the bank: the door is open, still an ask. */
  unlocked: boolean
  rule: string
  onUseTime: () => void
  tiles: HomeTile[]
  onFriends: () => void
  tellHref?: string | null
}) {
  return (
    <div style={{ marginBottom: 18, fontFamily: 'var(--font-body)' }}>
      <style>{`
        .kid-tile { transition: transform 0.08s ease, box-shadow 0.08s ease; }
        .kid-tile:active { transform: translateY(3px); box-shadow: 0 1px 0 ${INK} !important; }
      `}</style>

      {/* Use my time: full width, the minutes on a sticker, the rule under it. */}
      <button className="kid-tile" onClick={onUseTime} style={{ ...EDGE, display: 'flex', alignItems: 'center', gap: 14, width: '100%', cursor: 'pointer', padding: '14px 16px', textAlign: 'left', marginBottom: 12, color: INK }}>
        <Well tint={CRAYON.butter} size={64}><HappyIcon name="time" size={40} /></Well>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>Use my time</span>
            <Sticker accent={minutesReady > 0 ? 'butter' : 'white'} rotate={-4} size="sm">{minutesReady} min ready</Sticker>
          </span>
          {unlocked && (
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: HAPPY.green, marginTop: 5 }}>
              🔓 All your jobs are done, screen time is unlocked
            </span>
          )}
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: 5, lineHeight: 1.4 }}>
            {rule}
          </span>
        </span>
      </button>

      {/* The grid: picture first, words under, the Math Games shape. */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {tiles.map(t => (
          <button key={t.label} className="kid-tile" onClick={t.onClick} style={{ ...EDGE, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '18px 12px 16px', textAlign: 'center', color: INK }}>
            <Well tint={t.tint}><HappyIcon name={t.icon} size={46} /></Well>
            <span style={{ minWidth: 0, maxWidth: '100%' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{t.label}</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.3 }}>{t.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Meet the Planet Friends, any time. */}
      <button className="kid-tile" onClick={onFriends} style={{ ...EDGE, background: CRAYON.butter, width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: INK }}>
        <HappyIcon name="friends" size={30} /> Meet the Planet Friends
      </button>

      {/* Telling a grown up: on its own, under the playful tiles, with room. */}
      {tellHref && (
        <a className="kid-tile" href={tellHref} style={{ ...EDGE, width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', textDecoration: 'none', color: INK, boxSizing: 'border-box' }}>
          <Well tint={CRAYON.paper} size={56}><HappyIcon name="tell" size={34} /></Well>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.1 }}>Telling a grown up</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.35 }}>Hard things to say, and what happens after</span>
          </span>
          <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>›</span>
        </a>
      )}
    </div>
  )
}
