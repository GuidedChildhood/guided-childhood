'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import StickerBadge from '@/components/pathway/StickerBadge'
import type { StickerRule } from '@/lib/stickers/catalog'

// The child's own sticker book, at the foot of their path. The collection fills
// up as they earn stars, finish printables and grow, earned bright and locked
// as a soft mystery. The first time a sticker unlocks, it pops in with a bounce
// and the star sound, then is marked seen so the moment fires once. House
// motion rule: GSAP, and it stays quiet for reduced motion.

export type KidSticker = {
  key: string
  name: string
  emoji?: string
  art?: string | null
  colour: string
  earned: boolean
  // What the badge draws. The parent book stopped using emoji for these and the
  // child book did not, so the person the stickers are actually FOR was the one
  // still getting them.
  rule: StickerRule
}

function Tile({ s }: { s: KidSticker }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center', width: 82 }}>
      <div style={{
        position: 'relative', width: 72, height: 72, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        background: s.earned ? '#fff' : 'rgba(26,26,46,0.05)',
        border: s.earned ? `3px solid ${s.colour}` : '2.5px dashed rgba(26,26,46,0.18)',
        boxShadow: s.earned ? `0 4px 0 ${s.colour}` : 'none',
      }}>
        {s.earned && s.art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.art} alt={s.name} width={60} height={60} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        ) : s.art ? (
          // A locked Planet Friend keeps its shape, greyed, so a child can see
          // WHO is waiting for them rather than a question mark that could be
          // anybody. The mystery was hiding the reason to carry on.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.art} alt="" aria-hidden width={60} height={60} style={{ width: 60, height: 60, objectFit: 'contain', filter: 'grayscale(1)', opacity: 0.35 }} />
        ) : (
          <StickerBadge s={s} size={56} />
        )}
      </div>
      <span style={{ fontSize: '13px', fontWeight: 800, color: s.earned ? 'var(--ink)' : 'var(--ink-muted)', lineHeight: 1.1 }}>
        {s.earned ? s.name : 'Locked'}
      </span>
    </div>
  )
}

export default function KidStickers({ token, stickers, celebrate }: {
  token: string
  stickers: KidSticker[]
  celebrate: string[]
}) {
  // The new stickers to celebrate this visit, held so a dismiss cannot lose
  // them before they are marked seen.
  const [toCheer] = useState(() => stickers.filter(s => celebrate.includes(s.key) && s.earned))
  const [showCheer, setShowCheer] = useState(toCheer.length > 0)
  const popRef = useRef<HTMLDivElement>(null)
  const seenSent = useRef(false)

  // Mark them seen straight away so the moment never repeats, even if the child
  // taps through fast or closes the tab. Fire and forget.
  useEffect(() => {
    if (toCheer.length === 0 || seenSent.current) return
    seenSent.current = true
    try {
      fetch('/api/kid/stickers/seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, keys: toCheer.map(s => s.key) }),
      }).catch(() => {})
    } catch { /* best effort */ }
    try { playKidSound('star') } catch { /* sound off */ }
  }, [toCheer, token])

  // The pop, unless reduced motion is asked for.
  useEffect(() => {
    if (!showCheer || !popRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.gc-cheer-pop', { scale: 0.3, opacity: 0, y: 20, duration: 0.5, ease: 'back.out(1.9)', stagger: 0.12 })
      gsap.from('.gc-cheer-spark', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.04, delay: 0.1 })
    }, popRef)
    return () => ctx.revert()
  }, [showCheer])

  const earnedCount = stickers.filter(s => s.earned).length

  return (
    <div style={{ margin: '10px 2px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)' }}>
          My stickers
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>
          {earnedCount} of {stickers.length}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))', gap: '16px 6px', justifyItems: 'center' }}>
        {stickers.map(s => <Tile key={s.key} s={s} />)}
      </div>

      {showCheer && (
        <div
          onClick={() => setShowCheer(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(26,26,46,0.62)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <div ref={popRef} onClick={e => e.stopPropagation()} style={{
            position: 'relative', width: '100%', maxWidth: 380, background: 'var(--cream)', borderRadius: 28,
            padding: '34px 24px 26px', boxShadow: '0 24px 60px -16px rgba(0,0,0,0.55)', textAlign: 'center', overflow: 'hidden',
          }}>
            {/* A little burst behind the sticker */}
            {['✨', '⭐', '🎉', '✨', '⭐', '🎉'].map((e, i) => (
              <span key={i} className="gc-cheer-spark" aria-hidden style={{
                position: 'absolute', top: `${12 + (i % 3) * 12}%`, left: i < 3 ? `${8 + i * 6}%` : undefined,
                right: i >= 3 ? `${8 + (i - 3) * 6}%` : undefined, fontSize: '22px',
              }}>{e}</span>
            ))}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 12px' }}>
              {toCheer.length > 1 ? `${toCheer.length} new stickers` : 'New sticker'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
              {toCheer.map(s => (
                <div key={s.key} className="gc-cheer-pop" style={{
                  width: 96, height: 96, borderRadius: '50%', background: '#fff',
                  border: `4px solid ${s.colour}`, boxShadow: `0 6px 0 ${s.colour}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {s.art
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={s.art} alt={s.name} width={82} height={82} style={{ width: 82, height: 82, objectFit: 'contain' }} />
                    : <span aria-hidden style={{ fontSize: '46px', lineHeight: 1 }}>{s.emoji}</span>}
                </div>
              ))}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {toCheer.length > 1 ? 'You earned new stickers' : `You earned ${toCheer[0]?.name}`}
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Straight into your sticker book. Keep going for more.
            </p>
            <button onClick={() => setShowCheer(false)} style={{
              width: '100%', padding: '14px', borderRadius: 16, border: 'none', cursor: 'pointer',
              background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: '17px', boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}>
              Yay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
