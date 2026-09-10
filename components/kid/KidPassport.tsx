'use client'

import KidStickers, { type KidSticker } from '@/components/kid/KidStickers'
import PassportBook from '@/components/pathway/PassportBook'
import type { Stamp } from '@/components/pathway/PassportStamps'

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
  onClose, token, childName, stickers, celebrateStickers, passportCode = null, stageId = null,
  book = null,
}: {
  onClose: () => void
  token: string
  childName: string
  stickers: KidSticker[]
  celebrateStickers: string[]
  // The public passport number (migration 227), printed under the title the
  // way a real passport carries its number. Public by design; never the kid
  // link token.
  passportCode?: string | null
  /**
   * The child's stage, 1 to 5, so the book can lead with THEIR page: how many
   * lessons in, and that the big check finishes it. Justin, 2 September 2026:
   * "all works towards the stage for each age group." The stamp tile lower
   * down carries the same numbers; this is the sentence version, first.
   */
  stageId?: number | null
  /**
   * The real book, the one the grown ups keep, read only.
   *
   * Justin chose this on 10 September 2026 when he said the child's view should
   * come now. Until today the child had a sticker book and the parent had a
   * passport, and they were two different objects with the same name.
   *
   * ── WHAT A CHILD SEES, AND WHAT THEY DO NOT ────────────────────────────
   *
   * The slots draw a mark and one word each: Devices, Moments, Lessons, Jobs,
   * Balance. They never draw the DETAIL, so a child sees that the moments slot
   * is not filled in yet and never that their parent has logged two problems
   * about them, nor what those problems are.
   *
   * That line was worth drawing carefully. This product's whole position is
   * that nothing is kept secretly on a child, and the reveal page says so out
   * loud, so hiding the book entirely would have been the wrong answer. Showing
   * them a list of their parent's worries about them would have been a worse
   * one. The shape of the work, yes. The contents of an adult's notes, no.
   *
   * Null everywhere the book cannot be built, and the takeover is the sticker
   * book on its own, exactly as it was.
   */
  book?: { stamps: Stamp[]; currentStage: number | null } | null
}) {
  const page = stageId ? stickers.find(s => s.rule.kind === 'stamp' && s.rule.n === stageId) : null
  const pageName = page ? page.name.replace(/ Stamp$/, '') : null
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
        {passportCode && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.14em', color: 'var(--ink-muted)', margin: '0 0 8px',
          }}>
            № {passportCode}
          </p>
        )}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
          color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 14px',
        }}>
          Your own book. Every sticker says what it takes, so you always know what you are working on next.
        </p>

        {page && pageName && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16,
            padding: '12px 14px', margin: '0 0 14px',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
              }}>
                Your {pageName} page
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25, marginTop: 2 }}>
                {page.earned
                  ? 'Stamped. The whole page, done.'
                  : `${page.have ?? 0} of ${page.need ?? 0} lessons passed, then the big check`}
              </div>
              {!page.earned && (page.need ?? 0) > 0 && (
                <div style={{ height: 6, borderRadius: 100, background: 'var(--border)', overflow: 'hidden', marginTop: 8 }}>
                  <div style={{ height: '100%', width: `${Math.round(((page.have ?? 0) / (page.need ?? 1)) * 100)}%`, background: page.colour, borderRadius: 100 }} />
                </div>
              )}
            </div>
            <span aria-hidden style={{ fontSize: 'var(--text-2xl)', lineHeight: 1, flexShrink: 0 }}>🛂</span>
          </div>
        )}

        {/* THE BOOK ITSELF, read only. No links out to a grown up's device
            setup page, no send button, no page controls beyond the flip and the
            drag. See the readOnly prop on PassportBook. */}
        {book && book.stamps.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <PassportBook
              stamps={book.stamps}
              childName={childName}
              currentStage={book.currentStage}
              passportCode={passportCode}
              readOnly
            />
          </div>
        )}

        <KidStickers token={token} stickers={stickers} celebrate={celebrateStickers} />
      </div>
    </div>
  )
}
