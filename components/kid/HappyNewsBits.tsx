// The happy news decoration kit for the child app.
//
// Justin, 2 September 2026, on the printables: "super fun and luxury... with
// happy news website type decoration", pointing at The Happy Newspaper.
//
// The rule from content/brand-story/visual-system.md holds here exactly as it
// does for the social cards: we take the ENERGY (vibrant colour blocking,
// smiley polka dots, sticker doodles, hand lettered warmth) and we draw our
// own. Nothing here is copied. Every shape is SVG in our own tokens: butter
// gold on cream, ink outlines, Nunito 900 for the words, the celebrate palette
// the child app already uses for confetti.
//
// Small pieces, composed by the screens. The dots, stickers and scatter never
// reach the parent dashboard, which keeps its calmer register. The FINISH
// does (ink edges, hard ink ledges, big Nunito, a colour band for a state):
// since 2 September 2026 the parent's script pages wear it in their own
// tokens, through components/scripts/card-system.ts.

import type { CSSProperties, ReactNode } from 'react'

// The four cheerful accents the child app already scatters as confetti in
// HappyScene, plus butter. One accent per sticker, rotated across a screen.
export const HAPPY = {
  butter: '#EDC35F',
  butterDark: '#C99A28',
  butterLt: '#FEF7E0',
  coral: '#E5734B',
  green: '#2E7D5A',
  sky: '#4B9CE5',
  ink: '#1A1A2E',
  cream: '#F9F8F6',
} as const

export type HappyAccent = 'butter' | 'coral' | 'green' | 'sky'

const ACCENT: Record<HappyAccent, string> = {
  butter: HAPPY.butter, coral: HAPPY.coral, green: HAPPY.green, sky: HAPPY.sky,
}

/** A smiling polka dot: the Happy Newspaper's signature, drawn our way. */
export function SmileyDot({ size = 18, color = HAPPY.butter, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ display: 'block', ...style }}>
      <circle cx="12" cy="12" r="11" fill={color} />
      <circle cx="8.6" cy="10" r="1.6" fill={HAPPY.ink} />
      <circle cx="15.4" cy="10" r="1.6" fill={HAPPY.ink} />
      <path d="M7.5 14.2 Q12 18.6 16.5 14.2" fill="none" stroke={HAPPY.ink} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

/** A twelve point burst, the sticker behind a number or a word. */
export function Burst({ size = 64, color = HAPPY.butter, children, textColor = HAPPY.ink, style }: {
  size?: number; color?: string; children?: ReactNode; textColor?: string; style?: CSSProperties
}) {
  // Twelve points, alternating outer and inner radius, drawn once.
  const pts: string[] = []
  for (let i = 0; i < 24; i++) {
    const r = i % 2 === 0 ? 50 : 40
    const a = (Math.PI * 2 * i) / 24 - Math.PI / 2
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`)
  }
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0, ...style }} aria-hidden>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <polygon points={pts.join(' ')} fill={color} stroke={HAPPY.ink} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <span style={{
        position: 'relative', fontFamily: 'var(--font-display)', fontWeight: 900, color: textColor,
        fontSize: size * 0.3, lineHeight: 1, textAlign: 'center', letterSpacing: '-0.02em',
      }}>
        {children}
      </span>
    </span>
  )
}

/**
 * A sticker: a rotated pill with an ink edge and a hard shadow, the thing a
 * child would peel off a sheet. One word or a star count on it.
 */
export function Sticker({ children, accent = 'butter', rotate = -6, size = 'md', style }: {
  children: ReactNode; accent?: HappyAccent | 'white' | 'ink'; rotate?: number; size?: 'sm' | 'md' | 'lg'; style?: CSSProperties
}) {
  const bg = accent === 'white' ? '#fff' : accent === 'ink' ? HAPPY.ink : ACCENT[accent]
  const fg = accent === 'ink' || accent === 'green' || accent === 'sky' || accent === 'coral' ? '#fff' : HAPPY.ink
  const pad = size === 'sm' ? '3px 8px' : size === 'lg' ? '8px 14px' : '5px 11px'
  const fs = size === 'sm' ? 'var(--text-xs)' : size === 'lg' ? 'var(--text-md)' : 'var(--text-sm)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, color: fg, border: `2px solid ${HAPPY.ink}`, borderRadius: 100,
      padding: pad, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: fs,
      letterSpacing: '0.02em', lineHeight: 1.1, whiteSpace: 'nowrap',
      transform: `rotate(${rotate}deg)`, boxShadow: `2px 3px 0 ${HAPPY.ink}`,
      ...style,
    }}>
      {children}
    </span>
  )
}

/** A wavy rule, the newsprint divider. */
export function WavyRule({ color = HAPPY.ink, style }: { color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden style={{ display: 'block', width: '100%', height: 10, ...style }}>
      <path d="M0 6 Q 12.5 0 25 6 T 50 6 T 75 6 T 100 6 T 125 6 T 150 6 T 175 6 T 200 6" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** A soft rainbow arc, four bands, for behind a friend or a headline. */
export function RainbowArc({ width = 160, style }: { width?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 100" width={width} height={width / 2} aria-hidden style={{ display: 'block', ...style }}>
      {[HAPPY.coral, HAPPY.butter, HAPPY.green, HAPPY.sky].map((c, i) => (
        <path key={c} d={`M ${20 + i * 11} 100 A ${80 - i * 11} ${80 - i * 11} 0 0 1 ${180 - i * 11} 100`} fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" />
      ))}
    </svg>
  )
}

/** A scatter of smiley dots and stars, positioned by the caller's box. */
export function HappyScatter({ seed = 0, dim = false }: { seed?: number; dim?: boolean }) {
  const spots: { x: number; y: number; kind: 'dot' | 'star'; c: string; s: number; r: number }[] = [
    { x: 4, y: 14, kind: 'dot', c: HAPPY.coral, s: 16, r: -12 },
    { x: 92, y: 10, kind: 'star', c: HAPPY.sky, s: 18, r: 14 },
    { x: 86, y: 74, kind: 'dot', c: HAPPY.green, s: 14, r: 8 },
    { x: 10, y: 78, kind: 'star', c: HAPPY.butterDark, s: 14, r: -18 },
    { x: 50, y: 4, kind: 'dot', c: HAPPY.sky, s: 10, r: 0 },
  ]
  return (
    <span aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: dim ? 0.55 : 1 }}>
      {spots.map((p, i) => {
        const k = (i + seed) % spots.length
        const q = spots[k]
        return (
          <span key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: `rotate(${q.r}deg)`, display: 'block' }}>
            {q.kind === 'dot'
              ? <SmileyDot size={q.s} color={q.c} />
              : <StarShape size={q.s} color={q.c} />}
          </span>
        )
      })}
    </span>
  )
}

/** A five point star, filled, ink edged. */
export function StarShape({ size = 16, color = HAPPY.butter, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ display: 'block', ...style }}>
      <path d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z" fill={color} stroke={HAPPY.ink} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * The masthead: a butter block with the newspaper name treatment, a kicker
 * above, the headline in Nunito 900, and a scatter of smiley dots. The
 * right hand slot takes a Burst or a Sticker (the tally, the star count).
 */
export function HappyMasthead({ kicker, title, sub, right, style }: {
  kicker?: string; title: string; sub?: string; right?: ReactNode; style?: CSSProperties
}) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: HAPPY.butter, border: `2.5px solid ${HAPPY.ink}`, borderRadius: 22,
      padding: '16px 16px 15px', boxShadow: `0 5px 0 ${HAPPY.ink}`, color: HAPPY.ink,
      ...style,
    }}>
      <HappyScatter dim />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {kicker && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 4 }}>
              {kicker}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.55rem, 7vw, 2rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {title}
          </div>
          {sub && (
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', lineHeight: 1.35, marginTop: 6, maxWidth: 260 }}>
              {sub}
            </div>
          )}
        </div>
        {right && <div style={{ flexShrink: 0 }}>{right}</div>}
      </div>
    </div>
  )
}

/** The round close cross every child takeover wears, top right. */
export function CloseCross({ size = 40, color = HAPPY.ink }: { size?: number; color?: string }) {
  return (
    <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" aria-hidden style={{ display: 'block' }}>
      <path d="M6 6 L18 18 M18 6 L6 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
