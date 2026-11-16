'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ASK_QUESTIONS, LEAD_ASK_QUESTIONS } from '@/lib/asks/stalled'

// One tap first, words second. Each answer saves on its own the moment it is
// given (a tap, or leaving a box), so a parent who answers one question and
// closes the tab has still told us something. Nothing here needs a Send
// button to count, and the button at the end only says thank you.

type Saved = Record<string, 'saving' | 'saved' | 'failed'>

export default function TellUsForm({ who, k }: { who: { u: string } | { l: string }; k: string }) {
  // A lead (no account) gets its own shorter list and is sent back to the
  // stage check, not into an app it has no account for.
  const isLead = 'l' in who
  const questions = isLead ? LEAD_ASK_QUESTIONS : ASK_QUESTIONS
  const [picked, setPicked] = useState<string | null>(null)
  const [text, setText] = useState<Record<string, string>>({})
  const [state, setState] = useState<Saved>({})
  const [done, setDone] = useState(false)

  async function save(question: string, answer: string) {
    const clean = answer.trim()
    if (!clean) return
    setState(s => ({ ...s, [question]: 'saving' }))
    try {
      const res = await fetch('/api/asks/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...who, k, question, answer: clean }),
      })
      setState(s => ({ ...s, [question]: res.ok ? 'saved' : 'failed' }))
    } catch {
      setState(s => ({ ...s, [question]: 'failed' }))
    }
  }

  const [first, ...rest] = questions
  const note = (q: string) => state[q] === 'saved' ? 'Saved, thank you' : state[q] === 'failed' ? 'That did not save. Tap or type again.' : state[q] === 'saving' ? 'Saving' : ''

  if (done) {
    return (
      <div>
        <h1 style={H1}>Thank you. Justin has it.</h1>
        <p style={LEAD}>Every answer goes straight to him, and it shapes what we build next.</p>
        <Link href={isLead ? '/starter-pack' : '/dashboard'} className="btn btn-gold" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>{isLead ? 'Back to the stage check' : 'Open Guided Childhood'}</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 style={H1}>{first.label}</h1>
      <p style={LEAD}>One tap is enough. It goes straight to Justin.</p>
      <div role="group" aria-label={first.label} style={{ display: 'grid', gap: 10, margin: '0 0 8px' }}>
        {first.options!.map(o => {
          const on = picked === o
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => { setPicked(o); save(first.key, o) }}
              style={{
                minHeight: 52, padding: '12px 16px', textAlign: 'left', font: 'inherit', fontSize: 'var(--text-md)', fontWeight: 700,
                color: 'var(--ink)', background: on ? 'var(--butter)' : 'var(--white)', border: 'var(--edge)',
                borderRadius: 'var(--radius-btn)', boxShadow: on ? '0 5px 0 var(--ink)' : 'var(--lift)', cursor: 'pointer',
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
      <p aria-live="polite" style={NOTE}>{note(first.key)}</p>

      {picked && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
            Got a minute more?
          </h2>
          <p style={{ ...LEAD, marginBottom: 18 }}>Answer any of these, in a line each. Skip the rest.</p>
          {rest.map(q => (
            <label key={q.key} style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.35 }}>{q.label}</span>
              <textarea
                rows={2}
                maxLength={2000}
                placeholder={q.placeholder}
                value={text[q.key] ?? ''}
                onChange={e => setText(t => ({ ...t, [q.key]: e.target.value }))}
                onBlur={e => save(q.key, e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '12px 14px', font: 'inherit', fontSize: 'var(--text-md)',
                  color: 'var(--ink)', background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-btn)', resize: 'vertical',
                }}
              />
              <span aria-live="polite" style={NOTE}>{note(q.key)}</span>
            </label>
          ))}
          <button type="button" className="btn btn-gold" onClick={() => setDone(true)} style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            Done
          </button>
        </div>
      )}
    </div>
  )
}

const H1: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 10px' }
const LEAD: React.CSSProperties = { fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 20px' }
const NOTE: React.CSSProperties = { display: 'block', minHeight: 20, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 4 }
