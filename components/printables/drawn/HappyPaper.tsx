import { PrintBrandHeader, PrintBrandFooter } from '@gc/shared/components/PrintBrand'

// The paper every drawn happy news sheet is printed on.
//
// Justin, 2 September 2026: "add more happy news style printables just as
// other ones like this", with The Happy Newspaper's Feel Your Happy book and
// School of Kindness postcards as the references. The bucket list is the
// model: drawn in code, every line a colouring job, a wavy masthead ribbon
// with smiley dots, one plain positive sentence, a star strip at the foot.
//
// ONE SIDE OF A4, FROM ANY PHONE. The sheet is a fixed piece of paper, 794 by
// 1077 CSS pixels, which is exactly 210 by 285 millimetres at the browser's
// 96 pixels an inch. On paper it is declared in millimetres against a page
// with no margin, the construction the Planet Friends poster proved on
// Justin's iPhone and the bucket list moved onto in PR 954: 285mm rather
// than 297mm leaves twelve millimetres for the date and address line iOS
// draws on the page and for every desktop browser's minimum margin. On
// screen it is the same box at its natural size, and DrawnPaper scales it to
// whatever is looking at it, so the preview a child taps IS the print.
//
// Everything inside is sized in plain pixels against that one width. No
// container units, no viewport units, no zoom: the paper never changes
// size, so nothing on it has to flex.

export const PAPER_W = 794
export const PAPER_H = 1077

export const INK = '#1A1A2E'
export const INK_MUTED = '#8888A0'
export const RULE = '#B9B9CC'
export const DEEP = 'var(--deep-teal)'

export function HappyPaper({ title, kicker, stars, deal, children }: {
  /** The words on the ribbon. Kept short: three or four words print biggest. */
  title: string
  /** The mono line under the ribbon: whose sheet, what to do. */
  kicker?: string
  /** What the finished sheet is worth, from the registry. */
  stars: number
  /** The sentence on the star strip at the foot, after "Worth n stars". */
  deal: string
  children: React.ReactNode
}) {
  return (
    <div className="happy-paper" style={{
      width: PAPER_W, height: PAPER_H, boxSizing: 'border-box',
      padding: '38px 45px 30px', background: '#fff', color: INK,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    }}>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          /* globals.css sets body { zoom: 1.07 } for the screen. On paper it
             turns 285mm into 305mm and spills onto a second side. */
          body { zoom: 1 !important; }
          .happy-paper {
            width: 210mm !important;
            height: 285mm !important;
            padding: 10mm 12mm 8mm !important;
            margin: 0 auto !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <PrintBrandHeader />
      <HappyRibbon title={title} />
      {kicker && (
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_MUTED, margin: '8px 0 0', lineHeight: 1.4 }}>
          {kicker}
        </div>
      )}

      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', marginTop: 10 }}>
        {children}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: DEEP, borderRadius: 14, padding: '10px 16px', marginTop: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>⭐</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
          {deal} Worth {stars} {stars === 1 ? 'star' : 'stars'} toward your screen time.
        </span>
      </div>
      <div style={{ flexShrink: 0 }}>
        <PrintBrandFooter />
      </div>
    </div>
  )
}

/**
 * The masthead ribbon from the bucket list: a wavy banner with a smiley dot
 * to colour at each end and the title across it, one line, sized to fit.
 */
export function HappyRibbon({ title }: { title: string }) {
  const heading = title.trim().toUpperCase()
  const size = heading.length > 22 ? 22 : heading.length > 16 ? 26 : 32
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 560, margin: '4px auto 0', flexShrink: 0 }}>
      <svg viewBox="0 0 400 74" style={{ width: '100%', display: 'block' }} aria-hidden>
        <path d="M 22 18 Q 200 2 378 18 L 370 58 Q 200 72 30 58 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M 22 18 L 8 30 L 30 58" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M 378 18 L 392 30 L 370 58" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        {[52, 348].map(x => (
          <g key={x}>
            <circle cx={x} cy="38" r="12" fill="#fff" stroke={INK} strokeWidth="3" />
            <circle cx={x - 4} cy="35" r="1.6" fill={INK} />
            <circle cx={x + 4} cy="35" r="1.6" fill={INK} />
            <path d={`M ${x - 5} 41 q 5 5 10 0`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </svg>
      <div style={{
        position: 'absolute', left: '18%', right: '18%', top: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.02em',
        fontSize: size, color: INK, textAlign: 'center', lineHeight: 1,
        whiteSpace: 'nowrap', overflow: 'hidden',
      }}>
        {heading}
      </div>
    </div>
  )
}

/** A dotted line to write on, with an optional small label before it. */
export function WriteLine({ label, width = '100%', height = 30, size = 14, value }: {
  label?: string
  width?: number | string
  height?: number
  size?: number
  /** Something the app already knows, printed on the line in the child's own hand. */
  value?: string | null
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, width, height, minWidth: 0, flex: width === '100%' ? '1 1 0%' : '0 0 auto' }}>
      {label && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size, color: INK, paddingBottom: 3, whiteSpace: 'nowrap' }}>{label}</span>}
      <span style={{ flex: 1, minWidth: 0, borderBottom: `2.5px dotted ${RULE}`, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {value && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size + 2, color: INK, paddingBottom: 3 }}>{value}</span>}
      </span>
    </div>
  )
}

/** A circle to colour in when something is done. */
export function TickCircle({ size = 26, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
      border: `3px solid ${INK}`, background: filled ? INK : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {filled && <span style={{ color: '#fff', fontSize: size * 0.55, fontWeight: 900, lineHeight: 1 }}>✓</span>}
    </span>
  )
}

/** The one plain sentence under a drawing, Justin's voice. */
export function Caption({ children, size = 15, top = 10 }: { children: React.ReactNode; size?: number; top?: number }) {
  return (
    <p style={{ margin: `${top}px auto 0`, maxWidth: 600, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size, lineHeight: 1.4, color: INK }}>
      {children}
    </p>
  )
}

/* Little line drawings to colour, shared across the sheets. All ink only. */

export function Sun({ size = 60 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <circle cx="50" cy="50" r="19" fill="#fff" stroke={INK} strokeWidth="5" />
      <path d="M50 8v14M50 78v14M8 50h14M78 50h14M20 20l10 10M70 70l10 10M20 80l10-10M70 30l10-10" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="44" cy="47" r="2" fill={INK} /><circle cx="56" cy="47" r="2" fill={INK} />
      <path d="M43 55q7 6 14 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Moon({ size = 60 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <path d="M62 12a38 38 0 1 0 26 66 30 30 0 0 1-26-66z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="48" cy="46" r="2.2" fill={INK} />
      <path d="M44 56q6 4 12 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Star({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <path d="M50 8l12 26 28 3-21 19 6 28-25-14-25 14 6-28L10 37l28-3z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </svg>
  )
}

export function Heart({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <path d="M50 88S12 62 12 36a20 20 0 0 1 38-8 20 20 0 0 1 38 8c0 26-38 52-38 52z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </svg>
  )
}

export function Phone({ size = 60, face = 'sleepy' }: { size?: number; face?: 'sleepy' | 'happy' | 'none' }) {
  return (
    <svg viewBox="0 0 60 100" width={size * 0.6} height={size} aria-hidden>
      <rect x="6" y="4" width="48" height="92" rx="10" fill="#fff" stroke={INK} strokeWidth="5" />
      <rect x="14" y="16" width="32" height="60" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="30" cy="86" r="3.5" fill={INK} />
      {face === 'sleepy' && (
        <>
          <path d="M20 40q5-4 10 0M30 40q5-4 10 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M25 56q5 4 10 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {face === 'happy' && (
        <>
          <circle cx="24" cy="40" r="2" fill={INK} /><circle cx="36" cy="40" r="2" fill={INK} />
          <path d="M23 52q7 7 14 0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export function Rainbow({ width = 120 }: { width?: number }) {
  return (
    <svg viewBox="0 0 120 64" width={width} height={width * 0.53} aria-hidden>
      <path d="M6 60A54 54 0 0 1 114 60" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M20 60A40 40 0 0 1 100 60" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M34 60A26 26 0 0 1 86 60" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M48 60A12 12 0 0 1 72 60" fill="none" stroke={INK} strokeWidth="4" />
    </svg>
  )
}
