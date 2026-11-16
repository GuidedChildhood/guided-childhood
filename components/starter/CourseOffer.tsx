'use client'

// The topic email course offer on the stage check result page (16 November
// 2026). One calm card for a child of the right age, one box, one button.
//
// Asking is the consent, so the button and the line under it say exactly what
// follows: seven emails, one a morning, then the odd note, every one with a
// stop link. There is no second box to tick because there is nothing else
// being given in exchange; the emails are the thing asked for (PECR, the same
// reasoning as the taster series in migration 396). No dashes in any copy.

import { useState } from 'react'
import type { Course } from '@/lib/courses/registry'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CourseOffer({ course, stageId, email: knownEmail, kid }: {
  course: Course
  stageId: number | string
  email?: string
  kid?: string
}) {
  const [email, setEmail] = useState(knownEmail ?? '')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const days = course.days.length
  const word = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][days] ?? String(days)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const clean = email.trim().toLowerCase()
    if (!EMAIL_RE.test(clean)) { setError('That email does not look right. Have another go.'); return }
    setError('')
    setState('sending')
    try {
      const res = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, slug: course.slug, stageId: String(stageId) }),
      })
      if (!res.ok) { setError('Something went wrong. Try again in a moment.'); setState('idle'); return }
      setState('done')
    } catch {
      setError('Something went wrong. Try again in a moment.')
      setState('idle')
    }
  }

  const box: React.CSSProperties = {
    background: 'var(--white)', border: 'var(--edge, 1.5px solid var(--border))',
    borderRadius: 'var(--radius-card)', padding: '24px 22px',
  }
  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 8,
  }
  const title: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
    letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 8px',
  }
  const body: React.CSSProperties = { fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }

  if (state === 'done') {
    return (
      <div style={box} role="status">
        <div style={eyebrow}>{course.title}</div>
        <p style={title}>Day 1 is on its way</p>
        <p style={body}>Look in your inbox in the next few minutes. Day 2 arrives tomorrow morning, and each one has one thing to do that evening.</p>
      </div>
    )
  }

  return (
    <div style={box}>
      <div style={eyebrow}>Free, by email</div>
      <p style={title}>{course.title}</p>
      <p style={{ ...body, marginBottom: 16 }}>
        For when the class WhatsApp group arrives{kid ? ` for ${kid}` : ''}. {course.offer} What to agree first, the words to say, and what to do when it goes wrong.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Your email"
          style={{
            flex: '1 1 200px', minWidth: 0, padding: '13px 16px', fontSize: 'var(--text-md)',
            fontFamily: 'var(--font-body, inherit)', color: 'var(--ink)',
            background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)', outline: 'none',
          }}
        />
        <button type="submit" disabled={state === 'sending'} className="btn btn-gold" style={{ padding: '13px 22px', fontSize: 'var(--text-md)', opacity: state === 'sending' ? 0.7 : 1 }}>
          {state === 'sending' ? 'Starting...' : `Start the ${word} emails`}
        </button>
      </form>
      {error && <p style={{ fontSize: 'var(--text-base)', color: 'var(--danger)', margin: '10px 0 0' }}>{error}</p>}
      <p style={{ fontSize: 'var(--text-sm, 0.9rem)', lineHeight: 1.5, color: 'var(--ink-muted)', margin: '12px 0 0' }}>
        {`${word[0].toUpperCase()}${word.slice(1)} emails from Justin, one a morning. After that, the odd note about your child’s stage. Every email has a stop link.`}
      </p>
    </div>
  )
}
