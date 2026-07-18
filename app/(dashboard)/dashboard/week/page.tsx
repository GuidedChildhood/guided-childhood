'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import WeeklyRoundup, { type Review } from '@/components/digi/WeeklyRoundup'

// The week just gone, on its own page. This is where the whole week's data is
// gathered and read back to the parent: the balance, the wins, the one thing to
// try next. Home only carries a quiet Sunday nudge that links here, so the
// dynamic round up never crowds the daily screen. DiGi keeps every week server
// side, so the week just gone is what it reflects on when it shapes the next one.

const READING_STEPS = [
  'Just reading all our chats from this week...',
  'Got them. Pulling out what actually mattered...',
  'Here you go, shaping the plan for next week...',
]

export default function WeekPage() {
  const [review, setReview] = useState<Review | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(0)

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

  // Mark read once seen, so the Sunday nudge on Home settles.
  useEffect(() => {
    if (review?.id) {
      fetch('/api/digi/weekly-review', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, status: 'read' }),
      }).catch(() => {})
    }
  }, [review])

  const build = async () => {
    setBusy(true)
    try {
      const r = await fetch('/api/digi/weekly-review', { method: 'POST' })
      const d = await r.json()
      if (d.review) setReview({ id: d.review.id ?? 'preview', ...d.review })
    } catch { /* non blocking */ } finally { setBusy(false) }
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: '18px' }}>
        ← Home
      </Link>

      {!loaded ? null : review ? (
        <WeeklyRoundup review={review} />
      ) : (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '24px', padding: '28px 24px', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: '18px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <DigiCharacter mood={busy ? 'thinking' : 'idle'} size={40} />
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', color: 'var(--ink)', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Your week with DiGi
          </h1>
          <p style={{ fontSize: '14.5px', color: busy ? 'var(--terracotta-dark)' : 'var(--ink-soft)', lineHeight: 1.55, fontWeight: busy ? 700 : 400, margin: '0 auto 20px', maxWidth: '380px', transition: 'color 0.3s' }}>
            {busy ? READING_STEPS[step] : 'A clear read of your family’s week, the balance, the wins, and one thing to try next. Nothing compared to anyone else, never a report card on your child.'}
          </p>
          <button onClick={build} disabled={busy} style={{ background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '14px', padding: '13px 24px', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: busy ? 0.85 : 1 }}>
            {busy ? 'Reading your week…' : 'Read my week'}
          </button>
        </div>
      )}
    </div>
  )
}
