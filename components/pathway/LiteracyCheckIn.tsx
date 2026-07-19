'use client'

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'

// DiGi asks, the answer is graded, the tick learns. One short question a week
// under the four strands on the Progress page: safe online always, social
// media from 13. The parent answers in a sentence, DiGi grades it warmly on
// the spot, and the strand reading folds it in from then on.

export default function LiteracyCheckIn({ stageId }: { stageId: number }) {
  const [q, setQ] = useState<{ strand: 'safe' | 'social'; question: string } | null>(null)
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ grade: 'green' | 'red'; note: string } | null>(null)

  useEffect(() => {
    fetch(`/api/digi/literacy-checkin?stage=${stageId}`)
      .then(r => r.json())
      .then(d => { if (d.question) setQ({ strand: d.strand, question: d.question }) })
      .catch(() => {})
  }, [stageId])

  if (!q) return null

  async function send() {
    if (!answer.trim() || busy || !q) return
    setBusy(true)
    try {
      const r = await fetch('/api/digi/literacy-checkin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strand: q.strand, question: q.question, answer: answer.trim() }),
      })
      const d = await r.json()
      if (d.grade) setResult({ grade: d.grade, note: d.note })
    } catch { /* stays open to try again */ } finally { setBusy(false) }
  }

  return (
    <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 20px' }}>
      <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <DigiCharacter mood="speak" size={30} once />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            DiGi asks · {q.strand === 'safe' ? 'Safe online' : 'Social media ready'}
          </span>
        </div>

        {result ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span aria-hidden style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: result.grade === 'green' ? 'var(--retro-green, #2F8F6B)' : '#C0533E', color: '#fff', fontSize: 17, fontWeight: 900 }}>
              {result.grade === 'green' ? '✓' : '✕'}
            </span>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
              {result.note} <span style={{ color: 'var(--ink-muted)' }}>This now counts toward the {q.strand === 'safe' ? 'Safe online' : 'Social media ready'} reading above.</span>
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.4, margin: '0 0 12px' }}>
              {q.question}
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="A sentence or two is plenty"
                rows={2}
                style={{ flex: 1, padding: '11px 14px', borderRadius: 12, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', resize: 'none', outline: 'none', lineHeight: 1.5 }}
              />
              <button
                onClick={send}
                disabled={busy || !answer.trim()}
                style={{ flexShrink: 0, background: answer.trim() ? 'var(--terracotta)' : 'var(--border)', color: 'var(--ink)', border: 'none', borderRadius: 12, padding: '11px 18px', cursor: answer.trim() ? 'pointer' : 'default', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', boxShadow: answer.trim() ? '0 3px 0 var(--terracotta-dark)' : 'none' }}
              >
                {busy ? 'DiGi is reading…' : 'Send to DiGi'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
