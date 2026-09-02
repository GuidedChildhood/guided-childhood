import { PrintBrandHeader, PrintBrandFooter } from '@gc/shared/components/PrintBrand'

// The bucket list sheet: what prints.
//
// Lifted out of BucketBuilder so the child's print page (which opens in real
// Safari when the installed app cannot print) draws exactly the same paper
// as the builder's own print button. One sheet, two doors.
//
// The list lives INSIDE a big drawn bucket (original line art, drawn right
// here in SVG), so the print out is the bucket shaped page from the craft,
// with their own picks written on it. Everything uncoloured is theirs to
// colour: the bucket, the sun, and now the masthead ribbon and the smiley
// dots along the top, the happy news touch Justin asked for on 2 September.
//
// ONE PAGE, ALWAYS. Justin, 2 September 2026, with the iPhone print preview:
// "Bucket needs fixing as appears on several pages." The bucket was cut in
// half across page one and page two with the footer marooned on the second.
//
// WHY. The sheet was drawn in screen pixels and left to flow, and a phone
// does not lay a page out the way a desktop does: the print page's own
// margins shrank the width, the drawing kept its height, and the footer
// tipped onto a second side.
//
// SO ON PAPER THE SHEET IS A PIECE OF A4, the same construction as the
// Planet Friends poster, which prints on one side from Justin's iPhone
// (FriendsPoster.tsx, 12 August). The page is declared A4 with no margin,
// the sheet is 210mm wide and 285mm tall in real millimetres (12mm short of
// the paper, which covers the date and address line iOS draws on the page
// and every desktop browser's minimum margin), with its own margins as
// padding. Inside it the bucket is the part that flexes to fill whatever is
// left after the header, the ribbon and the footer, and everything drawn
// inside the bucket is sized against the bucket itself with container
// units. On screen nothing changes: the preview keeps its natural height.

export type BucketIdea = { emoji: string; text: string }

export default function BucketSheet({ title, childName, picked, framed = true }: {
  title: string
  childName: string
  picked: BucketIdea[]
  /** The on screen frame. Off on the print page, where the paper is the page. */
  framed?: boolean
}) {
  const n = picked.length
  // Row type, as a share of the bucket's width, so it scales with the drawing
  // on every printer. At the 470px screen width these are the old 15, 13 and
  // 11.5 pixel sizes.
  const size = n <= 6 ? { text: 3.2, emoji: 3.8, circle: 4.3 } : n <= 9 ? { text: 2.8, emoji: 3.2, circle: 3.6 } : { text: 2.45, emoji: 2.8, circle: 3 }
  const heading = title.trim() || 'Our Bucket List'
  return (
    <div className="print-sheet bucket-paper" style={{
      background: '#fff',
      border: framed ? '1.5px solid var(--border)' : 'none',
      borderRadius: framed ? '18px' : 0,
      padding: '26px 26px 22px',
      boxShadow: framed ? '0 8px 30px rgba(26,26,46,0.10)' : 'none',
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          /* globals.css sets body { zoom: 1.07 } for the screen. On paper it
             turns 285mm into 305mm and spills onto a second side. */
          body { zoom: 1 !important; }
          .bucket-paper {
            /* A4 is 210mm by 297mm. 285mm leaves twelve millimetres for the
               browser's own page furniture, so the sheet is one side on
               every printer, phone or desktop. The margins are the sheet's
               own padding, because the page has none. */
            width: 210mm !important;
            height: 285mm !important;
            max-width: none !important;
            margin: 0 auto !important;
            padding: 10mm 12mm 8mm !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .bucket-stage { flex: 1 1 auto; min-height: 0; }
          .bucket-art {
            height: 100% !important;
            width: auto !important;
            max-width: 100% !important;
            margin: 0 auto;
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <PrintBrandHeader />

      {/* The masthead ribbon: the title on a wavy banner, with smiley dots to
          colour either side. Line art only, so it prints on any printer and
          every bit of it is a colouring job. Sized against the sheet's width
          with container units, so the title never climbs out of the ribbon. */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 470, margin: '6px auto 0', containerType: 'inline-size', flexShrink: 0 }}>
        <svg viewBox="0 0 400 74" style={{ width: '100%', display: 'block' }} aria-hidden>
          <path d="M 22 18 Q 200 2 378 18 L 370 58 Q 200 72 30 58 Z" fill="#fff" stroke="#1A1A2E" strokeWidth="4" strokeLinejoin="round" />
          <path d="M 22 18 L 8 30 L 30 58" fill="#fff" stroke="#1A1A2E" strokeWidth="4" strokeLinejoin="round" />
          <path d="M 378 18 L 392 30 L 370 58" fill="#fff" stroke="#1A1A2E" strokeWidth="4" strokeLinejoin="round" />
          {[52, 348].map(x => (
            <g key={x}>
              <circle cx={x} cy="38" r="12" fill="#fff" stroke="#1A1A2E" strokeWidth="3" />
              <circle cx={x - 4} cy="35" r="1.6" fill="#1A1A2E" />
              <circle cx={x + 4} cy="35" r="1.6" fill="#1A1A2E" />
              <path d={`M ${x - 5} 41 q 5 5 10 0`} fill="none" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
        </svg>
        <div style={{
          position: 'absolute', left: '18%', right: '18%', top: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.02em',
          // One line, always: the size steps down with the length and the
          // line never wraps, in units of the ribbon's own width.
          fontSize: heading.length > 16 ? '2.6cqw' : heading.length > 12 ? '3.2cqw' : '3.8cqw', color: '#1A1A2E', textAlign: 'center', lineHeight: 1,
          textTransform: 'uppercase', padding: '0 1cqw', whiteSpace: 'nowrap', overflow: 'hidden',
        }}>
          {heading}
        </div>
      </div>

      {/* The bucket. On paper this is the part that fills whatever height is
          left, so the sheet is always exactly one page. */}
      <div className="bucket-stage" style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <div className="bucket-art" style={{ position: 'relative', width: '100%', maxWidth: 470, aspectRatio: '400 / 508', containerType: 'size' }}>
          {/* The bucket: handle with ring ends, rim, tapered body */}
          <svg viewBox="0 0 400 508" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
            <path d="M 62 132 C 62 18, 338 18, 338 132" fill="none" stroke="#1A1A2E" strokeWidth="11" strokeLinecap="round" />
            <circle cx="62" cy="132" r="11" fill="#fff" stroke="#1A1A2E" strokeWidth="7" />
            <circle cx="338" cy="132" r="11" fill="#fff" stroke="#1A1A2E" strokeWidth="7" />
            <rect x="34" y="128" width="332" height="40" rx="20" fill="#fff" stroke="#1A1A2E" strokeWidth="8" />
            <path d="M 52 168 L 348 168 L 317 480 Q 315 500 295 500 L 105 500 Q 85 500 83 480 Z" fill="#fff" stroke="#1A1A2E" strokeWidth="8" strokeLinejoin="round" />
            {/* A little smiling sun on the rim corner, theirs to colour */}
            <circle cx="356" cy="112" r="17" fill="#fff" stroke="#1A1A2E" strokeWidth="5" />
            <path d="M 356 88 v-9 M 356 136 v9 M 332 112 h-9 M 380 112 h9 M 339 95 l-6 -6 M 373 95 l6 -6 M 339 129 l-6 6 M 373 129 l6 6" stroke="#1A1A2E" strokeWidth="4" strokeLinecap="round" />
            <circle cx="350" cy="108" r="1.8" fill="#1A1A2E" />
            <circle cx="362" cy="108" r="1.8" fill="#1A1A2E" />
            <path d="M 350 116 q 6 5 12 0" fill="none" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
            {/* Stars to colour, floating by the handle */}
            <path d="M 44 60 l 4 8 9 1 -6.5 6 1.5 9 -8 -4.5 -8 4.5 1.5 -9 -6.5 -6 9 -1 z" fill="#fff" stroke="#1A1A2E" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 300 44 l 3 6 7 1 -5 4.5 1 7 -6 -3.5 -6 3.5 1 -7 -5 -4.5 7 -1 z" fill="#fff" stroke="#1A1A2E" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>

          {/* The list, laid out inside the bucket body. Rows share the bucket's
              height evenly, like ruled lines, so any count from 1 to 12 always
              fits inside the drawing. Every size is a share of the bucket's own
              width (cqw), so the words scale with the drawing on any printer. */}
          <div style={{
            position: 'absolute', left: '17.5%', right: '17.5%', top: '35%', bottom: '4.5%',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '2.4cqw', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0.5cqw 0', lineHeight: 1.35 }}>
              {childName.trim() ? `${childName.trim()}'s list · ` : ''}Colour the circle when it is done
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {n === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '3.2cqw', color: 'var(--ink-muted)', margin: 'auto 0' }}>
                  Your picks appear in the bucket as you choose them.
                </p>
              ) : picked.map((idea, i) => (
                // The bucket tapers inward, so lower rows tuck in a touch
                // further to stay clear of the drawn wall.
                <div key={idea.text} style={{
                  flex: 1, minHeight: 0,
                  display: 'flex', alignItems: 'center', gap: '2cqw',
                  borderBottom: '0.3cqw solid var(--border)',
                  padding: `0 ${Math.max(0, ((i + 0.5) / n) * 7.7 - 2.2).toFixed(1)}%`,
                }}>
                  <span style={{ width: `${size.circle}cqw`, height: `${size.circle}cqw`, borderRadius: '50%', border: '0.55cqw solid var(--ink)', flexShrink: 0, boxSizing: 'border-box' }} />
                  <span style={{ fontSize: `max(${size.emoji}cqw, 11px)`, flexShrink: 0, lineHeight: 1 }}>{idea.emoji}</span>
                  <span style={{
                    // The floor is for a phone screen, where the preview bucket is
                    // small; on paper the share of the bucket's width wins.
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: `max(${size.text}cqw, 10px)`,
                    color: 'var(--ink)', lineHeight: 1.15, minWidth: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {idea.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--deep-teal)', borderRadius: '14px', padding: '11px 16px', marginTop: '12px', flexShrink: 0 }}>
        <span style={{ fontSize: 'var(--text-xl)' }}>⭐</span>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
          Whole list done? Hand this to your grown up. Worth 5 stars toward your screen time.
        </span>
      </div>
      <div style={{ flexShrink: 0 }}>
        <PrintBrandFooter />
      </div>
    </div>
  )
}
