'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import StickerBadge from '@/components/pathway/StickerBadge'
import { stickerWhy } from '@/lib/stickers/catalog'
import { buddyFor } from '@/lib/kid/buddy'
import type { KidSticker } from '@/components/kid/KidStickers'

// A sticker lands in the passport.
//
// Justin, 14 September 2026: "big pop up passport animation of relevant Planet
// Friend and a visual sticker going in the passport, also big character
// sticker for lessons and doing printable tasks."
//
// ── WHY THIS EXISTS WHEN A STICKER POP ALREADY DID ──────────────────────────
//
// The pop in the sticker book fires only inside the passport modal, so a child
// who earned First Lesson on Tuesday met it on Saturday if they happened to
// open the book. The Planet Friends had their own full screen arrival; every
// other sticker, which is most of them, had nothing that could stop the page.
// This is the arrival for the rest: it mounts on the home screen the moment a
// sticker is owed, one at a time, oldest first.
//
// ── THE SHAPE ───────────────────────────────────────────────────────────────
//
// The child's own Planet Friend (the buddy they chose) holds up the sticker.
// The sticker is the subject, big, centred. One line says why it came, in the
// past tense, because it is about what they did and not about the rule. Then
// the sticker shrinks and flies down into a small passport at the foot of the
// screen, the passport gives a little jump, and a tick lands on it. One way
// out that matters: open my passport, so the thing that filled the screen is
// the thing they then go and find. Marked seen on show, not on dismiss, so a
// closed tab still spends it.

export default function KidStickerLand({ token, stickers, buddy, onClose, onOpenBook }: {
  token: string
  stickers: KidSticker[]
  buddy: string | null
  onClose: () => void
  onOpenBook: () => void
}) {
  const [i, setI] = useState(0)
  const [landed, setLanded] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const sent = useRef(false)
  const friend = buddyFor(buddy)
  const s = stickers[i]

  // Spend the whole queue up front, the same rule the Friend arrival and the
  // wins queue follow: shown is spent.
  useEffect(() => {
    if (stickers.length === 0 || sent.current) return
    sent.current = true
    try {
      fetch('/api/kid/stickers/seen', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, keys: stickers.map(x => x.key) }),
      }).catch(() => {})
    } catch { /* best effort */ }
  }, [stickers, token])

  useEffect(() => {
    if (!s || !rootRef.current) return
    setLanded(false)
    try { playKidSound('star') } catch { /* sound off */ }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setLanded(true); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLanded(true) })
      tl.from('.gc-land-friend', { y: 40, opacity: 0, duration: 0.5, ease: 'back.out(1.6)' })
        .from('.gc-land-sticker', { scale: 0, rotate: -25, duration: 0.65, ease: 'back.out(2.2)' }, '-=0.2')
        .from('.gc-land-spark', { scale: 0, opacity: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.04 }, '-=0.4')
        .from('.gc-land-words', { y: 14, opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.2')
        // The flight: hold, then down into the passport at the foot.
        .to('.gc-land-sticker', { delay: 0.9, y: 250, scale: 0.28, rotate: 8, duration: 0.7, ease: 'power2.in' })
        .to('.gc-land-book', { y: -10, scaleX: 1.06, scaleY: 0.94, duration: 0.14, ease: 'power1.out' }, '-=0.08')
        .to('.gc-land-book', { y: 0, scaleX: 1, scaleY: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
        .set('.gc-land-sticker', { opacity: 0 })
        .from('.gc-land-tick', { scale: 0, duration: 0.4, ease: 'back.out(2.5)' }, '-=0.3')
    }, rootRef)
    return () => ctx.revert()
  }, [s])

  if (!s) return null
  const last = i >= stickers.length - 1
  const why = stickerWhy({ rule: s.rule, name: s.name, earn: s.earn ?? '' }, 'child')
  const next = () => {
    if (last) onClose()
    else setI(v => v + 1)
  }

  return (
    <div ref={rootRef} data-sticker-land style={{
      position: 'fixed', inset: 0, zIndex: 135, background: 'var(--cream)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
      padding: 'calc(28px + env(safe-area-inset-top)) 22px calc(20px + env(safe-area-inset-bottom))',
      textAlign: 'center', overflow: 'hidden',
    }}>
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <p className="gc-land-words" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: 0 }}>
          {stickers.length > 1 ? `New sticker ${i + 1} of ${stickers.length}` : 'New sticker'}
        </p>

        {/* The Friend and the sticker. The sticker sits in front, big, because
            it is the thing that is about to go somewhere. */}
        <div style={{ position: 'relative', width: 260, height: 250, marginTop: 6 }}>
          {['✨', '⭐', '✨', '⭐', '✨', '⭐'].map((e, k) => (
            <span key={k} className="gc-land-spark" aria-hidden style={{
              position: 'absolute', fontSize: 'var(--text-xl)',
              top: `${8 + (k % 3) * 22}%`, left: k < 3 ? `${2 + k * 4}%` : undefined, right: k >= 3 ? `${2 + (k - 3) * 4}%` : undefined,
            }}>{e}</span>
          ))}
          <div className="gc-land-friend" style={{ position: 'absolute', left: '34%', top: 0, transform: 'translateX(-50%)', width: 180, height: 180 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={friend.img} alt={friend.name} width={180} height={180} style={{ width: 180, height: 180, objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 10px 18px rgba(26,26,46,0.18))' }} />
          </div>
          <div className="gc-land-sticker" style={{
            position: 'absolute', left: '66%', top: 100, transform: 'translateX(-50%)',
            width: 146, height: 146, borderRadius: '50%', background: '#fff',
            border: `5px solid ${s.colour}`, boxShadow: `0 8px 0 ${s.colour}, 0 18px 40px -12px rgba(26,26,46,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            {s.art
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.art} alt={s.name} width={126} height={126} style={{ width: 126, height: 126, objectFit: 'contain' }} />
              : <StickerBadge s={s} size={122} />}
          </div>
        </div>

        <h1 className="gc-land-words" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', color: 'var(--ink)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '4px 0 0' }}>
          {s.rule.kind === 'sorted' ? `${s.name}: sorted` : s.name}
        </h1>
        <p className="gc-land-words" style={{ margin: 0, fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45, fontWeight: 600, maxWidth: '30ch' }}>
          {why}
        </p>
      </div>

      {/* The passport it lands in, then the way out. */}
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div className="gc-land-book" style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
          borderRadius: '10px 14px 14px 10px', padding: '12px 16px',
          boxShadow: 'inset 0 0 0 2px rgba(237,195,95,0.5), 0 8px 22px rgba(0,0,0,0.25)',
        }}>
          <span aria-hidden style={{ fontSize: 'var(--text-xl)' }}>🛂</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#EDC35F' }}>
            My passport
          </span>
          <span className="gc-land-tick" aria-hidden style={{
            position: 'absolute', top: -12, right: -12, width: 30, height: 30, borderRadius: '50%',
            background: 'var(--retro-green)', color: '#fff', border: '2.5px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 'var(--text-md)',
          }}>✓</span>
        </div>
        <p className="gc-land-words" data-landed={landed ? '1' : '0'} style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', minHeight: 16 }}>
          {landed ? 'In your passport' : 'Going in'}
        </p>
        <button
          type="button"
          onClick={() => { try { playKidSound('tap') } catch { /* sound off */ } if (last) onOpenBook(); else next() }}
          style={{
            width: '100%', padding: '16px 28px', borderRadius: 'var(--radius-btn)', border: 'none',
            background: 'var(--terracotta)', color: 'var(--ink)', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          {last ? 'Open my passport' : 'Next sticker'}
        </button>
        <button type="button" onClick={next} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink-muted)', padding: 6 }}>
          {last ? 'Later' : 'Skip'}
        </button>
      </div>
    </div>
  )
}
