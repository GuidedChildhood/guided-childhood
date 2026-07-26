import { stickerArt, type Sticker } from '@/lib/stickers/catalog'
import type { StickerState, StickerBook as Book } from '@/lib/stickers/book'

// The sticker book on the Passport. Earned stickers show in full colour, the
// Planet Friend art or a badge on its own coloured ring; locked ones are a soft
// grey outline with how to earn, and a small count for the milestone ones so a
// child can see how close they are. Display only, the earning happens server
// side. No dashes in any copy.

function Tile({ s }: { s: StickerState }) {
  const art = stickerArt(s)
  const showCount = !s.earned && (s.rule.kind === 'stars' || s.rule.kind === 'sheets' || s.rule.kind === 'streak')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textAlign: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: 64, height: 64, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: s.earned ? '#fff' : 'var(--cream)',
          border: s.earned ? `2.5px solid ${s.colour}` : '2px dashed var(--border)',
          boxShadow: s.earned ? `0 3px 0 ${s.colour}` : 'none',
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
          <span aria-hidden style={{ fontSize: '30px', lineHeight: 1, filter: s.earned ? 'none' : 'grayscale(1)', opacity: s.earned ? 1 : 0.32 }}>
            {s.emoji}
          </span>
        )}
        {s.earned && (
          <span
            aria-hidden
            style={{
              position: 'absolute', right: -2, bottom: -2, width: 20, height: 20, borderRadius: '50%',
              background: 'var(--retro-green, #2F8F6B)', color: '#fff', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900,
            }}
          >
            ✓
          </span>
        )}
      </div>
      <span style={{ fontSize: '13px', fontWeight: 800, color: s.earned ? 'var(--ink)' : 'var(--ink-muted)', lineHeight: 1.15 }}>
        {s.name}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.02em', color: 'var(--ink-light)', lineHeight: 1 }}>
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Sticker book
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>
          {earnedCount} of {total}
        </span>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--ink)', margin: '0 0 12px' }}>
        {childName ? `${childName}'s stickers` : 'Your stickers'}
      </h2>

      {/* The collection so far */}
      <div style={{ height: 8, borderRadius: 100, background: 'var(--cream)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--terracotta)', borderRadius: 100 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '14px 8px' }}>
        {stickers.map(s => <Tile key={s.key} s={s} />)}
      </div>

      <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '16px 0 0' }}>
        Stickers are earned from real stars, finished printables and growing through the stages. Once earned they are kept for good.
      </p>
    </section>
  )
}

// Re-export the sticker type for consumers that only need the shape.
export type { Sticker }
