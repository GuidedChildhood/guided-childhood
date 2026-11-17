import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// THE PASSPORT COVER, AS THE APP DRAWS IT, IN ONE PLACE.
//
// Justin, 17 November 2026: the order card showed a yellow "Digital Literacy
// Passport" photograph, which is not the passport. The real one is the app's
// burgundy book: gold foil rules and crest, "Digital Childhood Passport", the
// child's name, and the five Planet Friends along the foot in foil. It was
// drawn inside the stage check (components/starter/InsideBlocks.tsx); it now
// lives here so the stage check, the order card and anything else that shows
// the passport show the same object.
//
// A friend whose page is stamped stands in full colour on the cover; the rest
// stay ghosted in foil, so the cover itself fills up as the stages do.

export default function PassportCover({
  kid, stamped = [], width = 214, tilt = -2,
}: {
  kid?: string | null
  /** Stage numbers 1 to 5 already stamped. */
  stamped?: number[]
  width?: number
  tilt?: number
}) {
  const scale = width / 214
  const dot = Math.round(24 * scale)
  // A thumbnail (the shop row) keeps the book, the crest and the friends and
  // drops the words, which would be unreadable at that size.
  const tiny = width < 100
  return (
    <div aria-hidden style={{
      width, minHeight: Math.round(290 * scale), boxSizing: 'border-box',
      background: 'linear-gradient(160deg, var(--passport-cover-hi) 0%, var(--passport-cover) 55%, var(--passport-cover-lo) 100%)',
      borderRadius: '12px 16px 16px 12px', padding: `${Math.round(24 * scale)}px ${Math.round(16 * scale)}px ${Math.round(18 * scale)}px`, textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: 'inset 0 0 0 2px var(--passport-foil-rule), inset 0 0 0 5px var(--passport-foil-line), inset 10px 0 20px rgba(0,0,0,0.25), 0 14px 30px rgba(26,26,46,0.18)',
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
    }}>
      <div>
        {!tiny && <div style={{ fontFamily: 'var(--font-mono)', fontSize: width < 180 ? 9 : 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
          Digital Childhood Passport
        </div>}
        <div style={{ width: 36 * scale, height: 1.5, background: 'var(--passport-foil-rule)', margin: '8px auto 0' }} />
      </div>
      <div>
        <div style={{
          width: 58 * scale, height: 58 * scale, borderRadius: '50%', margin: `0 auto ${12 * scale}px`,
          border: '2px solid var(--passport-foil)', boxShadow: 'inset 0 0 0 3px var(--passport-foil-wash)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 * scale, height: 24 * scale }}>
            {[5, 9, 14, 8].map((h, i) => (
              <div key={i} style={{ width: 4.5 * scale, height: (h / 14) * 24 * scale, background: 'var(--terracotta)', borderRadius: 2 }} />
            ))}
          </div>
        </div>
        {!tiny && <><div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: width < 180 ? 'var(--text-md)' : 'var(--text-lg)', color: 'var(--terracotta)', lineHeight: 1.15, letterSpacing: '0.02em', maxWidth: width - 34, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {kid || 'Our family'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: width < 180 ? 8 : 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--passport-foil-text)', marginTop: 6 }}>
          The journey to 16
        </div></>}
      </div>
      <div style={{ display: 'flex', gap: tiny ? 1 : Math.max(3, Math.round(5 * scale)), justifyContent: 'center' }}>
        {STAGE_CHARACTERS.map(c => {
          const on = stamped.includes(c.stageId)
          return (
            <span key={c.key} style={{
              width: dot, height: dot, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              background: on ? 'var(--cream)' : 'var(--passport-foil-fill)',
              border: tiny ? 'none' : on ? '1.5px solid var(--passport-foil)' : '1.5px solid var(--passport-foil-soft)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.cutout} alt="" width={dot} height={dot} style={{
                width: '100%', height: '100%', objectFit: 'contain',
                filter: on ? 'none' : 'grayscale(1) brightness(1.35) sepia(0.7) hue-rotate(-8deg) opacity(0.42)',
              }} />
            </span>
          )
        })}
      </div>
    </div>
  )
}
