'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The school offer, shown while no school connection exists.
//
// ── IT LEADS WITH THE PHOTO NOW (17 September 2026) ─────────────────────────
//
// This card used to say "Give us a letterbox, not a key. Forward the school's
// emails to your own private address", and its button said "Set it up in one
// minute". Every word of that was true when it was written and none of it is
// the best thing to say any more: snap it needs no address, no forwarding and
// no setup at all, and it reaches the letter in the book bag, which no
// forwarding rule ever will. Offering the harder of two routes, and calling it
// a setup, was selling the work rather than the result.
//
// It matters more now that the card can take the top of Home on its day rather
// than waiting at the bottom of a scroll nobody finishes. Out of date copy in a
// place people actually look is worse than out of date copy nobody reads.
//
// ── THE NO TRAVELS WITH THE PERSON ──────────────────────────────────────────
//
// Dismissal was a localStorage key, which was right at the bottom of the page
// and is wrong at the top: decline on the phone on Sunday morning, open the
// laptop, meet it again. So "not now" writes to the account (migration 304) and
// the device key stays as the instant local answer, which also covers the
// window before that migration has been run by hand.

const STORAGE_KEY = 'gc-school-promo-dismissed'

export default function SchoolPromoCard({ dismissed = false }: { dismissed?: boolean }) {
  // Hidden until the device has been asked, so a card a parent dismissed does
  // not flash up before the answer arrives. The server's account level answer
  // arrives as a prop and is the one that matters; this only adds the local no.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (dismissed) { setVisible(false); return }
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== '1')
    } catch {
      // Private browsing, blocked storage: show it. A parent who has never said
      // no should see the offer, and the account level read already had its say.
      setVisible(true)
    }
  }, [dismissed])

  function notNow() {
    // Local first so the card goes immediately, then the account, which is the
    // one that stops it coming back on the laptop. A failed write costs the
    // cross device memory, never this tap.
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* nothing to remember locally */ }
    setVisible(false)
    void fetch('/api/school/promo-dismiss', { method: 'POST' }).catch(() => {})
  }

  if (!visible) return null

  return (
    <div style={{
      background: 'var(--tint-sage)', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-btn)', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        School · nothing to set up
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
        Never miss a PE kit day again
      </div>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
        Photograph the letter from the book bag, or a screenshot of the email. DiGi turns it into reminders, the night before and again in the morning.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link
          href="/dashboard/school"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--terracotta)', color: 'var(--ink)', border: 'var(--edge)',
            borderRadius: 'var(--radius-btn)', padding: '11px 20px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
            boxShadow: 'var(--lift)',
          }}
        >
          Try it on a letter
        </Link>
        <button
          onClick={notNow}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', padding: 0 }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
