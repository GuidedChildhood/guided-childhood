'use client'

import KidStickers, { type KidSticker } from '@/components/kid/KidStickers'

// The passport, on its own.
//
// Justin, 6 August 2026, on the book being buried inside My wins: "yes next".
//
// The sticker book was living at the bottom of the wins panel, under four
// stat tiles and a row of faces, which is the wrong place for the thing a
// child is collecting. A wins panel is a scoreboard you glance at. A passport
// is an object you open, and it should be reached on purpose rather than found
// by scrolling past something else.
//
// So the book gets its own tile on the quest screen and its own takeover, and
// My wins keeps what it is actually for: the four numbers and how close the
// next Friend is.
//
// The takeover is deliberately thin. Everything inside it, the burgundy book,
// the three pages, the once only celebration pop, already belongs to
// KidStickers, and splitting that in two would have given the celebration two
// places to live.

export default function KidPassport({
  onClose, token, childName, stickers, celebrateStickers,
}: {
  onClose: () => void
  token: string
  childName: string
  stickers: KidSticker[]
  celebrateStickers: string[]
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(26,26,46,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420, maxHeight: '86vh', overflowY: 'auto',
          background: 'var(--cream)', borderRadius: 24, padding: '22px 20px',
          boxShadow: '0 20px 50px -16px rgba(26,26,46,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
            color: 'var(--ink)', letterSpacing: '-0.01em',
          }}>
            🛂 {childName}&rsquo;s passport
          </span>
          <button onClick={onClose} aria-label="Close" style={{
            width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff',
            cursor: 'pointer', fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', flexShrink: 0,
          }}>✕</button>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
          color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 14px',
        }}>
          Your own book. Every sticker says what it takes, so you always know what you are working on next.
        </p>

        <KidStickers token={token} stickers={stickers} celebrate={celebrateStickers} />
      </div>
    </div>
  )
}
