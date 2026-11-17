import type { StageSticker as Sticker } from '@/lib/pathway/stage-stickers'

// ONE PLANET FRIEND STICKER (17 November 2026).
//
// The sticker that goes in the paper passport when a stage is done in the app.
// Drawn rather than photographed, so the screen, the order card and the A4
// print are the same object: a passport stamp roundel in the stage's colour,
// the Planet Friend from public/digi-squad/friends inside it (never a
// regenerated character), the stage page underneath, and, when asked for, the
// one line that says what was learnt.
//
// Earned is full colour. Not yet is a dashed outline with the friend ghosted,
// so a sheet can show the whole set without handing out a sticker the app has
// not given.

export default function StageSticker({
  s, earned, size = 96, showLine = false, showName = true,
}: {
  s: Sticker
  earned: boolean
  size?: number
  showLine?: boolean
  showName?: boolean
}) {
  const ring = Math.max(3, Math.round(size * 0.05))
  return (
    <figure data-sticker={s.friendKey} data-earned={earned ? '1' : '0'} style={{
      margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', minWidth: 0, flexShrink: 0,
    }}>
      <span style={{
        position: 'relative', width: size, height: size, borderRadius: '50%', boxSizing: 'border-box',
        background: earned ? 'var(--white)' : 'transparent',
        border: earned ? `${ring}px solid ${s.colour}` : `2px dashed var(--ink-muted)`,
        boxShadow: earned ? `0 ${Math.round(size * 0.05)}px 0 ${s.colour}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* The inner stamp rule, the line that makes a circle read as a passport stamp. */}
        <span aria-hidden style={{
          position: 'absolute', inset: Math.round(size * 0.06), borderRadius: '50%',
          border: earned ? `1.5px dashed ${s.colour}` : 'none', opacity: 0.6,
        }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.img} alt={earned ? `${s.friend} sticker` : `${s.friend}, not earned yet`} width={size} height={size} style={{
          width: '78%', height: '78%', objectFit: 'contain', position: 'relative',
          filter: earned ? 'none' : 'grayscale(1)', opacity: earned ? 1 : 0.35,
        }} />
      </span>
      {showName && (
        <figcaption style={{ marginTop: Math.round(size * 0.1), minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: size >= 90 ? 'var(--text-md)' : 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.15 }}>
            {s.friend}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 2, lineHeight: 1.3 }}>
            {earned ? s.page : 'Not yet'}
          </span>
          {showLine && (
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 6, maxWidth: Math.max(size * 1.6, 150) }}>
              {s.learnt}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
