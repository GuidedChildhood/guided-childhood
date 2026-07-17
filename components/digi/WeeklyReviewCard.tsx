'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import WriteIn from '@/components/ui/WriteIn'

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

// While DiGi reads the week (it takes a moment, it is really reading the
// family's own chats and quests), a warm little narrative of what it is doing,
// so the wait feels like DiGi working, not a stuck button.
const READING_STEPS = [
  'Just reading all our chats from this week...',
  'Got them. Pulling out what actually mattered...',
  'Here you go, shaping the plan for next week...',
]

export default function WeeklyReviewCard() {
  const [review, setReview] = useState<Review | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(0)

  // Walk the reading narrative forward while busy, holding on the last line
  // until the review lands.
  useEffect(() => {
    if (!busy) { setStep(0); return }
    const t = setInterval(() => setStep(s => Math.min(s + 1, READING_STEPS.length - 1)), 1600)
    return () => clearInterval(t)
  }, [busy])

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
          <DigiCharacter mood={busy ? 'thinking' : 'idle'} size={28} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>Your week with DiGi</div>
          <div style={{ fontSize: '12.5px', color: busy ? 'var(--terracotta-dark)' : 'var(--ink-soft)', lineHeight: 1.4, fontWeight: busy ? 700 : 400, transition: 'color 0.3s' }}>
            {busy ? READING_STEPS[step] : 'A warm read of your family’s week, and one thing to set up next.'}
          </div>
        </div>
        <button onClick={preview} disabled={busy} style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px', padding: '9px 14px', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: busy ? 0.85 : 1 }}>
          {busy ? 'Reading…' : 'See it'}
        </button>
      </div>
    )
  }

  const s = review.stats ?? { questsApproved: 0, starsEarned: 0, deviceMinutes: 0, activeDays: 0 }
  const routineHref = review.suggestion_routine ? `/dashboard/quests?routine=${review.suggestion_routine}` : '/dashboard/quests'

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '24px', padding: '24px 24px 22px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(26,26,46,0.03), 0 14px 36px -12px rgba(26,26,46,0.13)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '18px' }}>
        <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: '16px', background: 'var(--terracotta)', boxShadow: '0 5px 0 var(--terracotta-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter mood="happy" size={34} once />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Your week with DiGi</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', color: 'var(--ink)', lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: '4px' }}>
            The week just gone
          </span>
        </span>
      </div>

      {/* Glanceable stats */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {[
          ['⭐', `${s.starsEarned} earned`],
          ['✅', `${s.questsApproved} quests`],
          ['📅', `${s.activeDays}/7 days`],
          ['📱', `${s.deviceMinutes} min screen`],
        ].map(([icon, label]) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '6px 13px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)' }}>
            <span>{icon}</span>{label}
          </span>
        ))}
      </div>

      <p style={{ fontSize: '16px', color: 'var(--ink)', opacity: 0.86, lineHeight: 1.65, margin: '0 0 16px' }}>
        <WriteIn key={review.summary} text={review.summary} baseDelay={120} stepMs={16} />
      </p>

      {review.watch_for && (
        <div style={{ background: 'var(--tint-sage)', borderRadius: '14px', padding: '14px 16px', marginBottom: '15px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--deep-teal)' }}>Worth a glance</span>
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '5px 0 0' }}>{review.watch_for}</p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href={routineHref} onClick={dismiss} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', borderRadius: '15px', padding: '13px 20px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          {review.suggestion ? 'Set up next week' : 'Open Quests'}
          <span style={{ fontSize: '16px' }} aria-hidden>→</span>
        </Link>
        {review.suggestion && (
          <span style={{ flex: 1, minWidth: 150, fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{review.suggestion}</span>
        )}
        <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, color: 'var(--ink-muted)' }}>Dismiss</button>
      </div>
    </div>
  )
}
