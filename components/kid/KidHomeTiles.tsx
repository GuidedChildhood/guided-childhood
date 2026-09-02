'use client'

import { HAPPY, Sticker } from '@/components/kid/HappyNewsBits'
import { CRAYON } from '@/components/printables/drawn/HappyPaper'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'

export { HappyIcon, type HappyIconName }

export type HomeTile = {
  icon: HappyIconName
  label: string
  sub: string
  /** The icon well's crayon colour. */
  tint: string
  onClick: () => void
}

const INK = HAPPY.ink

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
