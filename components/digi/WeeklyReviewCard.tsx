'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { Review } from '@/components/digi/WeeklyRoundup'

// The round up nudge at the top of Home. The full round up is a page of its
// own (/dashboard/week); this is the quiet card that says one is waiting,
// links straight to it, and closes with a cross.
//
// It used to be Sunday only, and it used to be imported nowhere at all, which
// between them are the whole of "the weekly round up just disappears". The
// cron writes a round up on a Sunday night. This card, had anything rendered
// it, would have offered it for the remainder of that Sunday and then hidden
// it for the six days a parent is most likely to go looking. The only other
// door on Home was a row that carried the same Sunday gate, and a tile three
// taps into a grid of nineteen.
//
// So: it shows whenever there is a round up the parent has not put away,
// whatever day it is. A round up written on Sunday is still the week just
// gone on Wednesday, and it is still worth reading. Dismissing hides the card
// and nothing else, because /dashboard/week asks with any=1 and the round up
// row on Home is always there.

export default function WeeklyReviewCard() {
  const [review, setReview] = useState<Review | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/digi/weekly-review')
      .then(r => r.json())
      .then(d => { setReview(d.review ?? null); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  // Seen is not read. This used to PATCH read the moment the card appeared,
  // which spent the unread state on a parent scrolling past it. The round up
  // page marks it read, because that is where it actually gets read.
  if (!loaded || dismissed || !review) return null

  // Dismissed on the server, not in localStorage. The old day keyed local flag
  // put the card away on one device for one day; the parent's answer here is
  // about this round up, and it should hold on their phone and their laptop
  // and hold next Wednesday too.
  const close = () => {
    setDismissed(true)
    fetch('/api/digi/weekly-review', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: review.id, status: 'dismissed' }),
    }).catch(() => { /* it reappears next load, which is the safe way to fail */ })
  }

  return (
    <div style={{ position: 'relative', background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '13px', boxShadow: '0 4px 16px rgba(201,154,40,0.12)' }}>
      <button
        onClick={close}
        aria-label="Close"
        style={{ position: 'absolute', top: 8, right: 11, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-lg)', lineHeight: 1, color: 'var(--ink-muted)', padding: '2px 4px' }}
      >
        ×
      </button>
      <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '13px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <DigiCharacter mood="happy" size={30} once />
      </span>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 14 }}>
        {/* Weekly, not Sunday. It is written on a Sunday and it can now be
            read on a Thursday, and a card that says Sunday on a Thursday
            reads as something a parent has already missed. */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Weekly round up</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.15, marginTop: '2px' }}>The week just gone</div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '3px' }}>
          The balance, the wins, and one thing to try next.
        </div>
      </div>
      <Link href="/dashboard/week" style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', borderRadius: '12px', padding: '10px 15px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
        See your week →
      </Link>
    </div>
  )
}
