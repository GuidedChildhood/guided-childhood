'use client'

import { useEffect, useState } from 'react'
import {
  REASON_MAX, WISH_MAX, answerLineForChild, type DealChangeAsk,
} from '@/lib/deal/change-requests'

// Ask to change something, inside Our family deal (migration 381).
//
// Justin, 16 October 2026: the child can ask to change a promise in the deal
// from their own app, with a reason, and their grown up decides. Until now the
// child agreed and the deal was then only the grown up's to change.
//
// Three small steps in the popup the child already knows, never a new screen:
// which promise, what instead, and why. The why is required on purpose. It is
// the habit the whole product teaches, making the case calmly rather than
// arguing, so the box asks for it every time.
//
// Once sent, the same spot shows where the ask stands, and the grown up's
// answer when it comes, for a fortnight. One open ask at a time, enforced on
// the server, so the button simply does not show while one is waiting.

type Step = 'idle' | 'pick' | 'wish' | 'why'

const BOX: React.CSSProperties = {
  marginTop: '12px', background: 'var(--white)', border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-tile)', padding: '13px 15px',
}
const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
  color: 'var(--ink)', lineHeight: 1.4, margin: 0,
}
const PRIMARY: React.CSSProperties = {
  width: '100%', marginTop: '10px', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
  borderRadius: '15px', padding: '13px', cursor: 'pointer', fontFamily: 'var(--font-display)',
  fontWeight: 900, fontSize: 'var(--text-md)', boxShadow: '0 5px 0 var(--terracotta-dark)',
}
const QUIET: React.CSSProperties = {
  background: 'none', border: 'none', padding: '8px 2px 0', cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)',
}
const FIELD: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', marginTop: '10px', minHeight: 84, resize: 'vertical',
  border: '1.5px solid var(--border)', borderRadius: '12px', padding: '11px 12px',
  fontFamily: 'var(--font-body, inherit)', fontSize: 'var(--text-md)', color: 'var(--ink)', background: 'var(--cream)',
}

const LIMIT_LINES: Record<string, string> = {
  open_ask: 'You already have an ask waiting. Your grown up will look at that one first.',
  weekly_limit: 'That is three asks this week. Have a think, and ask again next week.',
  too_short: 'Say a little more, so your grown up really gets it.',
  unknown_promise: 'That promise has just changed. Close the deal and open it again.',
}

export default function KidDealChangeAsk({ token, promises }: { token: string; promises: { title: string; emoji?: string }[] }) {
  const [ask, setAsk] = useState<DealChangeAsk | null>(null)
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState<Step>('idle')
  const [promise, setPromise] = useState<string | null>(null)
  const [wish, setWish] = useState('')
  const [reason, setReason] = useState('')
  const [sending, setSending] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    fetch(`/api/kid/deal-change?token=${token}`)
      .then(r => r.json())
      .then(d => { if (live) { setAsk(d?.ask ?? null); setReady(d?.ready !== false) } })
      .catch(() => { if (live) setReady(false) })
    return () => { live = false }
  }, [token])

  const reset = () => { setStep('idle'); setPromise(null); setWish(''); setReason(''); setProblem(null) }

  const send = async () => {
    if (sending || !promise) return
    setSending(true)
    setProblem(null)
    try {
      const res = await fetch('/api/kid/deal-change', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, promise, wish, reason }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        setProblem(LIMIT_LINES[data?.reason as string] ?? 'That did not send. Have another go in a moment.')
        return
      }
      setAsk(data.ask as DealChangeAsk)
      setStep('idle')
    } catch {
      setProblem('That did not send. Have another go in a moment.')
    } finally {
      setSending(false)
    }
  }

  // Before migration 381 is live there is nowhere to keep an ask, so the
  // button stays away rather than promising something that cannot save.
  if (!ready || promises.length === 0) return null

  // An ask in flight, or answered in the last fortnight: show where it stands.
  if (ask) {
    return (
      <div data-deal-change-status style={{ ...BOX, background: 'var(--tint-sage)', borderColor: 'var(--retro-green-dark, var(--deep-teal))' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0 }}>
          You asked about
        </p>
        <p style={{ ...LABEL, marginTop: 4 }}>{ask.promise_title}</p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
          {answerLineForChild(ask.status)}
        </p>
        {ask.parent_reply && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '8px 0 0', fontStyle: 'italic' }}>
            &ldquo;{ask.parent_reply}&rdquo;
          </p>
        )}
      </div>
    )
  }

  if (step === 'idle') {
    return (
      <button
        type="button"
        data-deal-change-open
        onClick={() => setStep('pick')}
        style={{ ...PRIMARY, background: 'var(--white)', boxShadow: 'none', border: '1.5px solid var(--border)', fontWeight: 800 }}
      >
        🙋 Ask to change something
      </button>
    )
  }

  return (
    <div data-deal-change-form style={BOX}>
      {step === 'pick' && (
        <>
          <p style={LABEL}>Which promise would you like to change?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {promises.map(p => (
              <button
                key={p.title}
                type="button"
                onClick={() => { setPromise(p.title); setStep('wish') }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '11px 12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}
              >
                <span aria-hidden>{p.emoji ?? '🤝'}</span> {p.title}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'wish' && (
        <>
          <p style={LABEL}>What would you like instead?</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '4px 0 0' }}>About: {promise}</p>
          <textarea
            value={wish}
            onChange={e => setWish(e.target.value.slice(0, WISH_MAX))}
            maxLength={WISH_MAX}
            placeholder="Screen time after homework, not after tea"
            aria-label="What you would like instead"
            style={FIELD}
          />
          <button type="button" disabled={wish.trim().length < 3} onClick={() => setStep('why')} style={{ ...PRIMARY, opacity: wish.trim().length < 3 ? 0.5 : 1 }}>
            Next
          </button>
        </>
      )}

      {step === 'why' && (
        <>
          <p style={LABEL}>Why? Tell your grown up your reason.</p>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value.slice(0, REASON_MAX))}
            maxLength={REASON_MAX}
            placeholder="Football is on Tuesdays, so I miss my time"
            aria-label="Your reason"
            style={FIELD}
          />
          <button type="button" disabled={sending || reason.trim().length < 3} onClick={send} style={{ ...PRIMARY, opacity: reason.trim().length < 3 ? 0.5 : 1 }}>
            {sending ? 'Sending' : 'Send to my grown up'}
          </button>
        </>
      )}

      {problem && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', margin: '8px 0 0', lineHeight: 1.45 }}>{problem}</p>
      )}
      <button type="button" onClick={reset} style={QUIET}>Not now</button>
    </div>
  )
}
