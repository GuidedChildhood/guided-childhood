import StickerBadge from '@/components/pathway/StickerBadge'
import type { StickerState } from '@/lib/stickers/book'

// Layout harness for the badge stickers. No auth.
//
// Earned and locked side by side, and at print size as well as book size,
// because these are meant to be cut out and stuck on a chart. A sticker that
// looks right at 54px and muddy at 150 is not a printable.
const mk = (n: number, colour: string, earned: boolean) =>
  ({ earned, colour, rule: { n } } as unknown as StickerState)

const EARNED = [mk(1, '#E8B54B', true), mk(10, '#E8B54B', true), mk(25, '#D9A22E', true), mk(50, '#D9A22E', true), mk(100, '#D8622E', true)]
const LOCKED = [mk(1, '#7FB3C8', false), mk(5, '#7FB3C8', false), mk(7, '#D8955E', false)]

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
  textTransform: 'uppercase', opacity: 0.7, marginTop: 24,
}

export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <p style={label}>Earned, book size</p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {EARNED.map((s, i) => <StickerBadge key={i} s={s} />)}
      </div>
      <p style={label}>Locked, book size</p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {LOCKED.map((s, i) => <StickerBadge key={i} s={s} />)}
      </div>
      <p style={label}>Earned, print size</p>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
        {EARNED.map((s, i) => <StickerBadge key={i} s={s} size={150} />)}
      </div>
    </main>
  )
}
