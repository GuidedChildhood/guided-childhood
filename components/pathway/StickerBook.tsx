import Link from 'next/link'
import { stickerArt, type Sticker } from '@/lib/stickers/catalog'
import type { StickerState, StickerBook as Book } from '@/lib/stickers/book'
import StickerBadge from './StickerBadge'

// The sticker book on the Passport. Earned stickers show in full colour, the
// Planet Friend art or a badge on its own coloured ring; locked ones are a soft
// grey outline with how to earn, and a small count for the milestone ones so a
// child can see how close they are. Display only, the earning happens server
// side. No dashes in any copy.

function Tile({ s }: { s: StickerState }) {
  const art = stickerArt(s)
  const showCount = !s.earned && (s.rule.kind === 'credits' || s.rule.kind === 'sheets' || s.rule.kind === 'streak')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textAlign: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 64, height: 64, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          // A badge draws its own ring, so the tile does not add a second one
          // around it. Only the character art needs the frame.
          background: art ? (s.earned ? '#fff' : 'var(--cream)') : 'transparent',
          border: art ? (s.earned ? `2.5px solid ${s.colour}` : '2px dashed var(--border)') : 'none',
          boxShadow: art && s.earned ? `0 3px 0 ${s.colour}` : 'none',
          overflow: 'hidden',
        }}
      >
        {art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={art}
            alt={s.name}
            width={54} height={54}
            style={{ width: 54, height: 54, objectFit: 'contain', filter: s.earned ? 'none' : 'grayscale(1)', opacity: s.earned ? 1 : 0.35 }}
          />
        ) : (
          <StickerBadge s={s} size={54} />
        )}
        {s.earned && (
          <span
            aria-hidden
            style={{
              position: 'absolute', right: -2, bottom: -2, width: 20, height: 20, borderRadius: '50%',
              background: 'var(--retro-green, #2F8F6B)', color: '#fff', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 900,
            }}
          >
            ✓
          </span>
        )}
      </div>
      <span style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: s.earned ? 'var(--ink)' : 'var(--ink-muted)', lineHeight: 1.15 }}>
        {s.name}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.02em', color: 'var(--ink-light)', lineHeight: 1.2 }}>
        {s.earned ? 'Earned' : showCount ? `${s.have} of ${s.need}` : s.earn}
      </span>
    </div>
  )
}

export default function StickerBook({ book, childName }: { book: Book; childName?: string }) {
  const { stickers, earnedCount, total } = book
  const pct = total > 0 ? Math.round((earnedCount / total) * 100) : 0
  return (
    <section
      style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
        padding: '18px 18px 20px', boxShadow: '0 4px 24px rgba(28,28,42,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Sticker book
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
          {earnedCount} of {total}
        </span>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 12px' }}>
        {childName ? `${childName}'s stickers` : 'Your stickers'}
      </h2>

      {/* The collection so far */}
      <div style={{ height: 8, borderRadius: 100, background: 'var(--cream)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--terracotta)', borderRadius: 100 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '14px 8px' }}>
        {stickers.map(s => <Tile key={s.key} s={s} />)}
      </div>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '16px 0 0' }}>
        Stickers are earned from real stars, finished printables and growing through the stages. Once earned they are kept for good.
      </p>

      {/* The obvious next question, answered on the same card: yes, you can
          have these as real ones. The shop sheet is DiGi and all five Friends
          plus the stage stamps, so what is on screen and what goes on the
          bedroom door are the same set. */}
      {/* Free first, posted second: a parent who wants stickers tonight should
          not have to wait on the post to get any. */}
      <Link
        href="/dashboard/printables/star-chart"
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px',
          background: 'var(--cream)', border: '1.5px solid var(--border)',
          borderRadius: '16px', padding: '13px 15px', textDecoration: 'none',
        }}
      >
        <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0 }}>🖨️</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            Print stars at home tonight
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
            A whole sheet of cut out stars in the Starter Pack, free, sized to fit the chart.
          </span>
        </span>
        <span aria-hidden style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>›</span>
      </Link>
      <Link
        href="/dashboard/passport?tab=shop#p-sticker_sheet"
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px',
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '16px', padding: '13px 15px', textDecoration: 'none',
        }}
      >
        <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0 }}>✨</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            Get these as real stickers
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
            One printed sheet, DiGi and all five Planet Friends plus the five stage stamps, for the fridge or the bedroom door. Four pounds.
          </span>
        </span>
        <span aria-hidden style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--terracotta-dark)' }}>›</span>
      </Link>
    </section>
  )
}

// Re-export the sticker type for consumers that only need the shape.
export type { Sticker }
