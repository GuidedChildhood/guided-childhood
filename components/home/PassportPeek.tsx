'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import type { PassportAttention } from '@/lib/pathway/passport-attention'

// The passport, flipping in on Today when it wants a look.
//
// Justin, 13 September 2026: the passport should flip "in and out when we feel
// a passport attention is needed". Until now the only door from Today was
// "Open the passport" as one of nine rotating suggestions, with no reason on
// it, so it showed on days nothing had moved and was missing on the day a page
// was ready for its check.
//
// ── HOW IT DECIDES ─────────────────────────────────────────────────────────
//
// It does not. lib/pathway/passport-attention.ts does, on the server, from the
// same two halves the stamp reads, and it answers with ONE reason or nothing.
// This asks after Today has painted (so Today's own load pays nothing), stays
// out when the answer is nothing, and flips in when it is something.
//
// ── HOW IT MOVES ───────────────────────────────────────────────────────────
//
// A small book turning in from the right on its spine, GSAP, half a second,
// then still. Not now turns it back out and keeps it out for the rest of the
// day on this device; the reason is checked fresh tomorrow. Reduced motion
// shows and hides it plainly. Mobbin: Asana's "A task is due in 3 days" card
// on Home, one line, one button, a dismiss; ours in butter and ink.

const KEY = (childId: string | null) => `gc_passport_peek_${childId ?? 'family'}`

function today(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
}

function reduceMotion(): boolean {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
}

export default function PassportPeek({ childId, preview = null }: {
  childId: string | null
  /** A fixed reason, for the dev fixture only. Production never passes one. */
  preview?: PassportAttention | null
}) {
  const [att, setAtt] = useState<PassportAttention | null>(null)
  const [shown, setShown] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (preview) { setAtt(preview); setShown(true); return }
    let cancelled = false
    const q = childId ? `?child=${encodeURIComponent(childId)}` : ''
    fetch(`/api/pathway/attention${q}`)
      .then(r => r.ok ? r.json() : null)
      .then((j: { attention?: PassportAttention | null } | null) => {
        if (cancelled || !j?.attention) return
        const a = j.attention
        // Not now, said today, holds for today.
        let dismissed = ''
        try { dismissed = localStorage.getItem(KEY(childId)) ?? '' } catch { dismissed = '' }
        if (dismissed === `${a.kind}:${a.stageId}:${today()}`) return
        setAtt(a)
        setShown(true)
      })
      .catch(() => { /* a quiet day */ })
    return () => { cancelled = true }
  }, [childId, preview])

  // Flip in, once the card is in the DOM.
  useEffect(() => {
    const el = cardRef.current
    if (!shown || !el || reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(el, { rotateY: 70, x: 48, opacity: 0, transformOrigin: 'left center', duration: 0.6, ease: 'back.out(1.4)' })
      gsap.from('.gc-peek-book', { rotate: -12, y: 6, duration: 0.7, ease: 'back.out(2)', delay: 0.25 })
    }, el)
    return () => ctx.revert()
  }, [shown])

  function notNow() {
    if (!att) return
    try { localStorage.setItem(KEY(childId), `${att.kind}:${att.stageId}:${today()}`) } catch { /* private mode */ }
    const el = cardRef.current
    if (!el || reduceMotion()) { setShown(false); return }
    gsap.to(el, { rotateY: -70, x: -32, opacity: 0, transformOrigin: 'left center', duration: 0.32, ease: 'power2.in', onComplete: () => setShown(false) })
  }

  if (!att || !shown) return null
  const href = `/dashboard/pathway?open=${att.stageId}&from=today${childId ? `&child=${encodeURIComponent(childId)}` : ''}`

  return (
    <div style={{ perspective: '1200px', marginBottom: 22 }}>
      <div
        ref={cardRef}
        role="status"
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 14,
          background: 'linear-gradient(135deg, #FFF7EA 0%, #FCEAC0 100%)',
          border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)',
          padding: '16px 18px',
        }}
      >
        {/* The little book: the real cover's burgundy and foil, at thumb size. */}
        <span aria-hidden className="gc-peek-book" style={{
          flexShrink: 0, width: 52, height: 68, borderRadius: '6px 9px 9px 6px',
          background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
          boxShadow: 'inset 0 0 0 1.5px rgba(237,195,95,0.55), 0 4px 0 #3E1220',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(237,195,95,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 10 }}>
              {[4, 7, 10, 6].map((h, i) => <span key={i} style={{ width: 2, height: h, background: 'var(--terracotta)', borderRadius: 1 }} />)}
            </span>
          </span>
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: 4 }}>
            Your passport
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            {att.title}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.4 }}>
            {att.line}
          </span>
          <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <Link href={href} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', minHeight: 44,
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
              background: 'var(--gold)', borderRadius: 'var(--radius-tile)', padding: '9px 18px', boxShadow: '0 4px 0 var(--gold-dark)',
            }}>
              Open the page <span aria-hidden>→</span>
            </Link>
            <button type="button" onClick={notNow} style={{
              background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: '0 6px',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--ink-muted)',
            }}>
              Not now
            </button>
          </span>
        </span>
      </div>
    </div>
  )
}
