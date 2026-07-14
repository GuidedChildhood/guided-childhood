'use client'

import { useState } from 'react'

// The second action on a watch together card: hand this lesson to the
// child's own device. One press posts to the send API, then shows an
// inline confirmation with the link to tap open or copy, so the grown up
// can open it on the tablet in the next breath. When the child has no link
// yet, the API says so kindly and we show that instead.

type SendState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; url: string; pushed: boolean }
  | { kind: 'needs_link'; message: string }
  | { kind: 'error'; message: string }

export default function SendToChildButton({
  lessonCode,
  childId,
  childName,
}: {
  lessonCode: string
  childId: string | null
  childName: string | null
}) {
  const [state, setState] = useState<SendState>({ kind: 'idle' })
  const [copied, setCopied] = useState(false)

  const label = childName ? `Send to ${childName}` : 'Send to device'

  const send = async () => {
    if (!childId) {
      setState({ kind: 'needs_link', message: 'Add your child on the dashboard first, then send.' })
      return
    }
    setState({ kind: 'sending' })
    try {
      const res = await fetch('/api/parent-lessons/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_code: lessonCode, child_id: childId }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) {
        setState({ kind: 'error', message: 'That did not send. Please try again.' })
        return
      }
      if (data.needs_link || !data.kid_url) {
        setState({ kind: 'needs_link', message: data.message ?? 'Open your child link from the dashboard first, then send.' })
        return
      }
      setState({ kind: 'sent', url: data.kid_url, pushed: Boolean(data.pushed) })
    } catch {
      setState({ kind: 'error', message: 'That did not send. Please try again.' })
    }
  }

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard can be blocked, the link is still tap to open */ }
  }

  if (state.kind === 'sent') {
    const who = childName ?? 'your child'
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          background: '#EDF7F1', border: '1px solid #B7DEC9', borderRadius: '14px',
          padding: '12px 14px', fontSize: '13px', color: '#1F5138',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '6px' }}>
          Sent to {who}&rsquo;s device ⭐
        </div>
        <div style={{ marginBottom: '10px', color: '#2E6B4C' }}>
          Open the link on their tablet{state.pushed ? ', or tap the nudge that just landed there' : ''}.
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
            style={{ fontSize: '13px', padding: '10px 18px' }}
          >
            Open the lesson →
          </a>
          <button
            type="button"
            onClick={() => copy(state.url)}
            className="btn btn-outline"
            style={{ fontSize: '13px', padding: '9px 16px' }}
          >
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
        </div>
      </div>
    )
  }

  if (state.kind === 'needs_link') {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)', borderRadius: '14px',
          padding: '12px 14px', fontSize: '13px', color: 'var(--ink)',
        }}
      >
        {state.message}
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={send}
        disabled={state.kind === 'sending'}
        className="btn btn-outline"
        style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
      >
        {state.kind === 'sending' ? 'Sending…' : `${label} 📲`}
      </button>
      {state.kind === 'error' && (
        <div role="alert" style={{ marginTop: '8px', fontSize: '12px', color: 'var(--terracotta-dark)' }}>
          {state.message}
        </div>
      )}
    </div>
  )
}
