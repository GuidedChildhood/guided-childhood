'use client'
import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// DiGi wondering: one gentle question, now and again, anywhere on the platform,
// never a nag. Capped to once every few days, and it never shows if there is
// already a reflection for today, so it never talks over the daily one or
// overwrites it. The answer feeds the same store the Sunday review reads, so a
// parent who rarely opens the chat still builds up the insight that shapes their
// week summary and what we learn to add.

const GAP_DAYS = 5
const KEY = 'gc_digi_wondering'

// A small rotating set of warm, open questions that build real insight, chosen
// by the day so it is steady, not random. No dashes, Justin's voice.
const QUESTIONS = [
  'What is the trickiest screen moment in your day right now?',
  'What has actually helped this week, however small?',
  'If one screen time rule could just work, which would you pick?',
  'What is the one thing you wish felt easier with devices right now?',
  'When did you feel most like the parent you want to be this week?',
  'What is the conversation about screens you are quietly dreading?',
  'What does a calm evening look like in your house right now?',
  'How are you holding up this week, honestly?',
  'What has taken the most out of you as a parent lately?',
  'When did you last get a moment that was just for you?',
]

export default function DigiWondering() {
  const [question, setQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    try {
      const last = localStorage.getItem(KEY)
      if (last && (Date.now() - Date.parse(last)) / 86_400_000 < GAP_DAYS) return
    } catch { return }
    // Never talk over or overwrite today's reflection.
    fetch('/api/digi/feedback')
      .then(r => r.json())
      .then(d => {
        if (d && d.question) return // a reflection already exists today
        // Check the gap again at show time: the device check in card stamps
        // this key when it renders, so DiGi never asks twice in one visit.
        try {
          const stamped = localStorage.getItem(KEY)
          if (stamped && (Date.now() - Date.parse(stamped)) / 86_400_000 < GAP_DAYS) return
        } catch { /* private mode */ }
        const day = Math.floor(Date.now() / 86_400_000)
        setQuestion(QUESTIONS[day % QUESTIONS.length])
      })
      .catch(() => { /* stay quiet on error */ })
  }, [])

  const send = async () => {
    if (!question || !answer.trim() || saving) return
    setSaving(true)
    try {
      await fetch('/api/digi/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, response: answer.trim() }),
      })
      try { localStorage.setItem(KEY, new Date().toISOString()) } catch { /* private mode */ }
      setDone(true)
    } catch { /* best effort */ } finally { setSaving(false) }
  }

  const skip = () => {
    try { localStorage.setItem(KEY, new Date().toISOString()) } catch { /* private mode */ }
    setQuestion(null)
  }

  if (!question) return null

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: done ? 0 : '12px' }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood={done ? 'happy' : 'idle'} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>DiGi is wondering</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.35 }}>
            {done ? 'Thank you. DiGi will fold this into your Sunday round up.' : question}
          </div>
        </div>
        {!done && (
          <button onClick={skip} aria-label="Not now" style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink-muted)', lineHeight: 1, padding: 4 }}>✕</button>
        )}
      </div>
      {!done && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="A sentence is plenty..."
            rows={2}
            style={{ flex: 1, minWidth: 0, padding: '11px 13px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', outline: 'none', resize: 'none', lineHeight: 1.5, boxSizing: 'border-box' }}
          />
          <button
            onClick={send}
            disabled={saving || !answer.trim()}
            style={{ flexShrink: 0, padding: '11px 17px', borderRadius: '12px', border: 'none', cursor: answer.trim() ? 'pointer' : 'default', background: answer.trim() ? 'var(--terracotta)' : 'var(--border)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', boxShadow: answer.trim() ? '0 3px 0 var(--terracotta-dark)' : 'none', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? '…' : 'Tell DiGi'}
          </button>
        </div>
      )}
    </div>
  )
}
