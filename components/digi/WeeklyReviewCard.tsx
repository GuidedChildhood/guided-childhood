'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The Sunday DiGi weekly review, on the parent's home. A warm read of the
// family's own week, one gentle watch-for, and one thing to set up for next
// week. If none has been built yet the card offers a preview of the week so
// far, so a parent never has to wait for Sunday to see it.

type Review = {
  id: string
  week_start: string
  stats: { questsApproved: number; starsEarned: number; deviceMinutes: number; activeDays: number }
  summary: string
  watch_for: string | null
  suggestion: string | null
  suggestion_routine: string | null
}

const STAR_MINUTES = 5

export default function WeeklyReviewCard() {
  const [review, setReview] = useState<Review | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/digi/weekly-review')
      .then(r => r.json())
      .then(d => { setReview(d.review ?? null); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  // Mark read once the parent has seen it, so it does not keep nagging.
  useEffect(() => {
    if (review && review.id) {
      fetch('/api/digi/weekly-review', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, status: 'read' }),
      }).catch(() => {})
    }
  }, [review])

  const dismiss = async () => {
    if (!review) return
    const id = review.id
    setReview(null)
    await fetch('/api/digi/weekly-review', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'dismissed' }),
    }).catch(() => {})
  }

  const preview = async () => {
    setBusy(true)
    try {
      const r = await fetch('/api/digi/weekly-review', { method: 'POST' })
      const d = await r.json()
      if (d.review) setReview({ id: d.review.id ?? 'preview', ...d.review })
    } catch { /* non blocking */ } finally { setBusy(false) }
  }

  if (!loaded) return null

  // No review yet: a slim offer to preview the week so far.
  if (!review) {
    return (
      <div style={{ background: '#fff', border: '1.5px dashed var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '13px' }}>
        <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: '12px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood="idle" size={28} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>Your week with DiGi</div>
          <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>A warm read of your family&apos;s week, and one thing to set up next.</div>
        </div>
        <button onClick={preview} disabled={busy} style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px', padding: '9px 14px', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
          {busy ? 'Reading…' : 'See it'}
        </button>
      </div>
    )
  }

  const s = review.stats ?? { questsApproved: 0, starsEarned: 0, deviceMinutes: 0, activeDays: 0 }
  const routineHref = review.suggestion_routine ? `/dashboard/quests?routine=${review.suggestion_routine}` : '/dashboard/quests'

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '18px 20px 16px', marginBottom: '20px', boxShadow: '0 4px 18px rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood="happy" size={30} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Your week with DiGi</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.25, marginTop: '2px' }}>
            The week just gone
          </span>
        </span>
      </div>

      {/* Glanceable stats */}
      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '13px' }}>
        {[
          ['⭐', `${s.starsEarned} earned`],
          ['✅', `${s.questsApproved} quests`],
          ['📅', `${s.activeDays}/7 days`],
          ['📱', `${s.deviceMinutes} min screen`],
        ].map(([icon, label]) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '5px 11px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
            <span>{icon}</span>{label}
          </span>
        ))}
      </div>

      <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px' }}>{review.summary}</p>

      {review.watch_for && (
        <div style={{ background: 'var(--tint-sage)', borderRadius: '12px', padding: '11px 13px', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--deep-teal)' }}>Worth a glance</span>
          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '3px 0 0' }}>{review.watch_for}</p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href={routineHref} onClick={dismiss} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', borderRadius: '13px', padding: '10px 16px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
          {review.suggestion ? 'Set up next week' : 'Open Quests'}
          <span style={{ fontSize: '15px' }} aria-hidden>→</span>
        </Link>
        {review.suggestion && (
          <span style={{ flex: 1, minWidth: 140, fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.4 }}>{review.suggestion}</span>
        )}
        <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)' }}>Dismiss</button>
      </div>
    </div>
  )
}
