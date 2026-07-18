'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { Review } from '@/components/digi/WeeklyRoundup'

// The Sunday nudge on Home. The full round up is a page of its own now
// (/dashboard/week), so Home stays calm: one quiet card, on a Sunday only, that
// says the week just gone is ready to read, links straight to it, and closes
// with a cross once the parent has seen it. The rest of the week Home shows
// nothing of this at all. DiGi still keeps every week's data server side, so it
// can reflect on the week just gone when it shapes the next one.

export default function WeeklyReviewCard() {
  const [review, setReview] = useState<Review | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Sunday only. 0 is Sunday. Resolved once so the card never flips mid render.
  const isSunday = new Date().getDay() === 0
  const dayKey = `gc_week_nudge_dismissed_${new Date().toISOString().slice(0, 10)}`

  useEffect(() => {
    if (!isSunday) return
    if (localStorage.getItem(dayKey)) { setDismissed(true); return }
    fetch('/api/digi/weekly-review')
      .then(r => r.json())
      .then(d => { setReview(d.review ?? null); setLoaded(true) })
      .catch(() => setLoaded(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mark read once the parent has seen the nudge, so it does not keep nagging.
  useEffect(() => {
    if (review?.id) {
      fetch('/api/digi/weekly-review', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, status: 'read' }),
      }).catch(() => {})
    }
  }, [review])

  if (!isSunday || dismissed || !loaded) return null

  const close = () => {
    setDismissed(true)
    try { localStorage.setItem(dayKey, '1') } catch { /* private mode */ }
    if (review?.id) {
      fetch('/api/digi/weekly-review', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, status: 'dismissed' }),
      }).catch(() => {})
    }
  }

  return (
    <div style={{ position: 'relative', background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '13px', boxShadow: '0 4px 16px rgba(201,154,40,0.12)' }}>
      <button
        onClick={close}
        aria-label="Close"
        style={{ position: 'absolute', top: 8, right: 11, background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', lineHeight: 1, color: 'var(--ink-muted)', padding: '2px 4px' }}
      >
        ×
      </button>
      <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '13px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <DigiCharacter mood="happy" size={30} once />
      </span>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 14 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Sunday round up</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.15, marginTop: '2px' }}>The week just gone</div>
        <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '3px' }}>
          {review ? 'The balance, the wins, and one thing to try next.' : 'See how your family’s week balanced out.'}
        </div>
      </div>
      <Link href="/dashboard/week" style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', borderRadius: '12px', padding: '10px 15px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', boxShadow: '0 3px 0 var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
        See your week →
      </Link>
    </div>
  )
}
