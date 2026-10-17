import Link from 'next/link'

// THE PASSPORT, AS A PICTURE, FIRST (Justin's brief on PR 1312, 16 October 2026).
//
// Holding the Passport tab on his phone, it read "To stamp this page, 4 steps,
// 4 things left on Stage 3, Explorer", and his words were: "way too
// complicated ... a neat image of the passport with clear planet turned
// stamps filling up near completion ... super image driven but clear."
//
// So the top of the page is the passport itself: an open booklet on the
// butter cover, five Planet Friend stamps inked on its pages. An earned stamp
// is the friend in full colour on its stage pastel, ringed in ink. A page not
// yet earned is the friend in grey, and the page being worked on fills with
// colour from the bottom up as it nears done, so "nearly full" reads before a
// word does (Duolingo's monthly badges, colour against grey). Each stamp is a
// link that opens its page below, so the picture is also the way into the
// book, which is what "see the book" was failing to be.
//
// The friend art is the existing cutouts in public/digi-squad/friends, never
// generated. Grey for not yet earned is on the parent's page only; the child's
// own screens never dim a friend.

export type PictureStamp = {
  n: number
  page: string
  friend: string
  img: string
  status: 'earned' | 'current' | 'catchup' | 'upcoming'
  /** 0 to 1, how full the page is, for the colour fill. */
  fill: number
  /** Under the stamp, one short line: "Stamped", "7 of 12", "Earlier", "Year 10". */
  caption: string
  href: string
}

const TILT = [-7, 5, -3, 6, -5]

export default function PassportPicture({
  kid, stamps, selected, stampedCount,
}: {
  kid: string
  stamps: PictureStamp[]
  selected: number | null
  stampedCount: number
}) {
  return (
    <section data-block="picture" aria-label={`${kid}'s passport: ${stampedCount} of 5 pages stamped`} style={{ margin: '4px 0 22px' }}>
      <style>{`
        .gc-pp-stamp { transition: transform .28s var(--ease); }
        .gc-pp-stamp:hover { transform: rotate(0deg) scale(1.04) !important; }
        .gc-pp-stamp:focus-visible { outline: var(--focus-ring); outline-offset: 4px; border-radius: 50%; }
        @media (prefers-reduced-motion: reduce) { .gc-pp-stamp { transition: none; } }
      `}</style>
      {/* The butter cover peeking behind the open pages, like the printed booklet. */}
      <div style={{
        background: 'var(--terracotta)', borderRadius: 18, padding: 7,
        border: 'var(--edge)', boxShadow: 'var(--lift-deep)',
      }}>
        <div style={{
          position: 'relative', background: '#FFFCF3', borderRadius: 12,
          border: '1.5px solid rgba(26,26,46,0.18)',
          padding: '16px 10px 14px',
          backgroundImage: 'linear-gradient(90deg, transparent calc(50% - 1px), rgba(26,26,46,0.10) calc(50% - 1px), rgba(26,26,46,0.10) calc(50% + 1px), transparent calc(50% + 1px))',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8,
            padding: '0 6px 10px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          }}>
            <span>Digital passport</span>
            <span style={{ color: 'var(--ink)' }}>{stampedCount} of 5 stamped</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', rowGap: 14, columnGap: 4,
            justifyItems: 'center',
          }}>
            {stamps.map((s, i) => (
              // Three on the top row, two centred under them.
              <div key={s.n} style={{ gridColumn: i < 3 ? `${i * 2 + 1} / span 2` : `${(i - 3) * 2 + 2} / span 2` }}>
                <StampLink stamp={s} tilt={TILT[i] ?? 0} selected={selected === s.n} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StampLink({ stamp: s, tilt, selected }: { stamp: PictureStamp; tilt: number; selected: boolean }) {
  const earned = s.status === 'earned'
  const size = 'clamp(72px, 22vw, 96px)'
  const pct = Math.round(Math.max(0, Math.min(1, s.fill)) * 100)
  const ring = earned ? `3px solid var(--stage-${s.n}-text)` : `2px dashed ${selected ? 'var(--ink)' : '#B9B9C8'}`
  return (
    <Link
      href={s.href}
      scroll={false}
      className="gc-pp-stamp"
      aria-current={selected ? 'page' : undefined}
      aria-label={`${s.page}, ${s.friend}'s page: ${s.caption}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        textDecoration: 'none', transform: `rotate(${tilt}deg)`, minWidth: 44,
      }}
    >
      <span style={{
        position: 'relative', width: size, height: size, borderRadius: '50%',
        background: earned ? `var(--stage-${s.n}-bold)` : '#F1F1F4',
        border: ring, boxSizing: 'border-box', overflow: 'hidden',
        boxShadow: selected ? '0 0 0 4px var(--terracotta)' : 'none',
        display: 'block',
      }}>
        {/* Not yet earned: the friend in grey. */}
        {!earned && (
          <img src={s.img} alt="" aria-hidden width={96} height={96} style={{
            position: 'absolute', inset: '8%', width: '84%', height: '84%', objectFit: 'contain',
            filter: 'grayscale(1)', opacity: 0.45,
          }} />
        )}
        {/* Earned, or filling: the friend in full colour, clipped from the
            bottom up to how full the page is. */}
        {(earned || pct > 0) && (
          <span aria-hidden style={{
            position: 'absolute', inset: 0,
            clipPath: earned ? 'none' : `inset(${100 - pct}% 0 0 0)`,
            background: earned ? 'transparent' : `var(--stage-${s.n}-bold)`,
          }}>
            <img src={s.img} alt="" width={96} height={96} style={{
              position: 'absolute', inset: '8%', width: '84%', height: '84%', objectFit: 'contain',
            }} />
          </span>
        )}
        {earned && (
          <span aria-hidden style={{
            position: 'absolute', right: '6%', bottom: '6%', width: '26%', height: '26%', borderRadius: '50%',
            background: `var(--stage-${s.n}-text)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(11px, 3vw, 14px)', fontWeight: 900, border: '2px solid #FFFCF3',
          }}>✓</span>
        )}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)',
        lineHeight: 1.15, textAlign: 'center', maxWidth: 110,
      }}>{s.page}</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: earned ? `var(--stage-${s.n}-text)` : 'var(--ink-muted)',
        marginTop: -3, whiteSpace: 'nowrap',
      }}>{s.caption}</span>
    </Link>
  )
}
