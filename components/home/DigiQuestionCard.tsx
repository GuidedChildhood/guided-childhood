'use client'

import { useState } from 'react'
import HappyIcon from '@/components/kid/HappyIcon'

// One question from DiGi, once a day, on Home.
//
// Until 13 September 2026 the reflective question landed under every DiGi
// reply, twenty two seconds after the answer, with its own textarea, Send and
// Skip. It is the learning loop (what the parent tells us here is what makes
// tomorrow's answer theirs), and it was also the biggest piece of clutter
// under an answer. Justin, on the recommendation to move it: "Go with
// recommendations."
//
// So the route stores the first question of the day, the thread never shows
// it, and this card asks it here, once, in one line. The answer goes to the
// same feedback route as before, so the insight the parent sees tomorrow is
// unchanged.

export default function DigiQuestionCard({ question, childId }: { question: string; childId: string | null }) {
  const [text, setText] = useState('')
  const [state, setState] = useState<'ask' | 'saving' | 'done' | 'gone'>('ask')
  const [insight, setInsight] = useState<string | null>(null)

  async function send(answer: string) {
    setState('saving')
    try {
      const res = await fetch('/api/digi/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, response: answer, child_id: childId }),
      })
      const data = await res.json().catch(() => null)
      setInsight(typeof data?.insight === 'string' && data.insight.trim() ? data.insight.trim() : null)
      setState(answer ? 'done' : 'gone')
    } catch {
      setState('ask')
    }
  }

  if (state === 'gone') return null

  return (
    <section aria-label="One question from DiGi" style={{
      background: 'var(--terracotta-lt)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)',
      padding: '14px 16px 16px', marginBottom: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span aria-hidden style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: '#fff', border: 'var(--edge)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <HappyIcon name="ask" size={26} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
            One question from DiGi
          </span>
          {state === 'done' ? (
            <p style={{ margin: 0, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5 }}>
              {insight ?? 'Thank you. DiGi will use that tomorrow.'}
            </p>
          ) : (
            <>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.35 }}>
                {question}
              </p>
              <form onSubmit={e => { e.preventDefault(); if (text.trim()) send(text.trim()) }} style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="One sentence is plenty"
                  aria-label="Your answer"
                  style={{ flex: '1 1 180px', minWidth: 0, minHeight: 44, padding: '8px 12px', borderRadius: 'var(--radius-tile)', border: 'var(--edge)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="submit" disabled={state === 'saving' || !text.trim()} style={{
                  minHeight: 44, padding: '8px 16px', borderRadius: 'var(--radius-tile)', border: 'var(--edge)', cursor: text.trim() ? 'pointer' : 'not-allowed',
                  background: text.trim() ? 'var(--terracotta)' : '#fff', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                  boxShadow: text.trim() ? '0 3px 0 var(--terracotta-dark)' : 'none',
                }}>
                  {state === 'saving' ? 'Saving' : 'Send'}
                </button>
                <button type="button" onClick={() => send('')} style={{ minHeight: 44, padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
                  Not today
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
