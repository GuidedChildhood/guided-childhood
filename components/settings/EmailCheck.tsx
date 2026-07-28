'use client'

import { useState } from 'react'

// One tap, one plain answer: does the keepsake notification actually reach a
// person from THIS deployment?
//
// The signup form says "You are on the list" whenever the row saved or the
// email sent, whichever happened, so a working database and a dead mailer look
// identical from the outside. Answering that used to mean a browser console or
// a Vercel log filter, which is not a reasonable thing to ask of anyone. It is
// a button now, and the answer is a sentence.

type Result = {
  ok: boolean
  reason: string
  to: string
  from: string
  message: string
}

export default function EmailCheck() {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [result, setResult] = useState<Result | null>(null)
  const [failed, setFailed] = useState(false)

  async function run() {
    setState('sending')
    setFailed(false)
    try {
      const res = await fetch('/api/keepsakes/interest/test', { method: 'POST' })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data) { setFailed(true); setState('done'); return }
      setResult(data as Result)
    } catch {
      setFailed(true)
    }
    setState('done')
  }

  const good = result?.ok === true

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
      padding: '20px 22px', maxWidth: 640, margin: '0 auto',
    }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '0 0 6px' }}>Email check</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.15 }}>
        Does a keepsake signup reach you?
      </h2>
      <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
        Sends one real test email through the same path a coming soon signup uses, from this exact deployment, and says plainly what happened.
      </p>

      <button
        onClick={run}
        disabled={state === 'sending'}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 16,
          padding: '14px 24px', cursor: state === 'sending' ? 'wait' : 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17.5,
          boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: state === 'sending' ? 0.7 : 1,
        }}
      >
        {state === 'sending' ? 'Sending…' : state === 'done' ? 'Send another test' : 'Send a test now'}
      </button>

      {state === 'done' && failed && (
        <p role="alert" style={{ fontSize: 16, fontWeight: 700, color: 'var(--terracotta-dark)', margin: '16px 0 0', lineHeight: 1.5 }}>
          The check itself could not run. Make sure you are signed in on this deployment, then try again.
        </p>
      )}

      {state === 'done' && result && (
        <div style={{
          marginTop: 16, borderRadius: 16, padding: '14px 16px',
          background: good ? 'var(--tint-green)' : 'var(--terracotta-lt)',
          border: `1.5px solid ${good ? '#9CC3B4' : 'var(--terracotta)'}`,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)', marginBottom: 4 }}>
            {good ? 'Sent' : 'Not sent'}
          </div>
          <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 10px' }}>
            {result.message}
          </p>
          {/* The two addresses involved, because a notification going to the
              wrong inbox looks exactly like one that never sent. */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
            To: {result.to}<br />
            From: {result.from}
          </p>
        </div>
      )}
    </div>
  )
}
