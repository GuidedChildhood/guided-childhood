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

export type BucketIdea = { emoji: string; text: string }

export default function BucketSheet({ title, childName, picked, framed = true }: {
  title: string
  childName: string
  picked: BucketIdea[]
  /** The on screen frame. Off on the print page, where the paper is the page. */
  framed?: boolean
}) {
  const n = picked.length
  const size = n <= 6 ? { text: 15, emoji: 18, circle: 20 } : n <= 9 ? { text: 13, emoji: 15, circle: 17 } : { text: 11.5, emoji: 13, circle: 14 }
  const heading = title.trim() || 'Our Bucket List'
  return (
    <div className="print-sheet" style={{
      background: '#fff',
      border: framed ? '1.5px solid var(--border)' : 'none',
      borderRadius: framed ? '18px' : 0,
      padding: '26px 26px 22px',
      boxShadow: framed ? '0 8px 30px rgba(26,26,46,0.10)' : 'none',
    }}>
      <PrintBrandHeader />

      {/* The masthead ribbon: the title on a wavy banner, with smiley dots to
          colour either side. Line art only, so it prints on any printer and
          every bit of it is a colouring job. */}
      <div style={{ position: 'relative', maxWidth: 470, margin: '6px auto 0' }}>
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
          fontSize: heading.length > 18 ? 13 : heading.length > 12 ? 16 : 19, color: '#1A1A2E', textAlign: 'center', lineHeight: 1.05,
          textTransform: 'uppercase', padding: '0 4px',
        }}>
          {heading}
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: '470px', margin: '4px auto 0', aspectRatio: '400 / 508' }}>
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
            fits inside the drawing. */}
        <div style={{
          position: 'absolute', left: '17.5%', right: '17.5%', top: '35%', bottom: '4.5%',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '2px 0 2px' }}>
            {childName.trim() ? `${childName.trim()}'s list · ` : ''}Colour the circle when it is done
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {n === 0 ? (
              <p style={{ textAlign: 'center', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', margin: 'auto 0' }}>
                Your picks appear in the bucket as you choose them.
              </p>
            ) : picked.map((idea, i) => (
              // The bucket tapers inward, so lower rows tuck in a touch
              // further to stay clear of the drawn wall.
              <div key={idea.text} style={{
                flex: 1, minHeight: 0,
                display: 'flex', alignItems: 'center', gap: '9px',
                borderBottom: '1.5px solid var(--border)',
                padding: `0 ${Math.max(0, ((i + 0.5) / n) * 7.7 - 2.2).toFixed(1)}%`,
              }}>
                <span style={{ width: size.circle, height: size.circle, borderRadius: '50%', border: '2.5px solid var(--ink)', flexShrink: 0 }} />
                <span style={{ fontSize: `${size.emoji}px`, flexShrink: 0, lineHeight: 1 }}>{idea.emoji}</span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: `${size.text}px`,
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--deep-teal)', borderRadius: '14px', padding: '13px 18px', marginTop: '14px' }}>
        <span style={{ fontSize: 'var(--text-xl)' }}>⭐</span>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: '#fff', lineHeight: 1.45 }}>
          Whole list done? Hand this to your grown up. Worth 5 stars toward your screen time.
        </span>
      </div>
      <PrintBrandFooter />
    </div>
  )
}
