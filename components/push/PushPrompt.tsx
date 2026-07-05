'use client'
import { useState, useEffect } from 'react'

interface Props {
  userId: string
  stage?: string
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, c => c.charCodeAt(0))
}

export default function PushPrompt({ userId, stage }: Props) {
  const [status, setStatus] = useState<'idle' | 'asking' | 'granted' | 'denied' | 'unsupported'>('idle')
  const [testResult, setTestResult] = useState<string | null>(null)

  async function sendTest() {
    setTestResult('Sending...')
    try {
      const res = await fetch('/api/push/test', { method: 'POST' })
      const data = await res.json()
      if (data.sent > 0) setTestResult('Sent. It should appear on this device within seconds.')
      else if (data.reason) setTestResult('No subscription found for this account on any device yet. Tap Turn on check ins first, inside the installed app.')
      else if (data.errors?.length) setTestResult(`The push service refused (code ${data.errors[0]}). Tell Claude this code.`)
      else setTestResult(data.error ?? 'Something went wrong, try again.')
    } catch {
      setTestResult('Could not reach the server, try again.')
    }
  }

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    const perm = Notification.permission
    if (perm === 'granted') setStatus('granted')
    else if (perm === 'denied') setStatus('denied')
  }, [])

  async function enable() {
    setStatus('asking')
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setStatus('denied'); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY!),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), userId, stage }),
      })

      setStatus('granted')
    } catch {
      setStatus('denied')
    }
  }

  if (status === 'granted') {
    return (
      <div style={{
        background: 'var(--stage-2)',
        borderRadius: '14px',
        padding: '14px 18px',
        fontSize: '.82rem',
        color: 'var(--ink-soft)',
        fontWeight: 600,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1rem' }}>✓</span>
          <span style={{ flex: 1, minWidth: '180px' }}>Check ins are on. We will nudge you at 7:30am, 3:30pm and 9pm.</span>
          <button
            onClick={sendTest}
            style={{
              background: 'none', border: '1.5px solid var(--border)', borderRadius: '10px',
              padding: '7px 14px', cursor: 'pointer', flexShrink: 0,
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)',
            }}
          >
            Send a test
          </button>
        </div>
        {testResult && (
          <p style={{ margin: '10px 0 0', fontSize: '.78rem', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {testResult}
          </p>
        )}
      </div>
    )
  }

  if (status === 'denied' || status === 'unsupported') return null

  return (
    <div style={{
      background: 'var(--stage-4)',
      borderRadius: '16px',
      padding: '20px 22px',
      border: '1px solid var(--border)',
    }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '.9rem',
        fontWeight: 700,
        color: 'var(--ink)',
        marginBottom: '6px',
      }}>
        Get your daily check ins
      </p>
      <p style={{
        fontSize: '.8rem',
        color: 'var(--ink-soft)',
        lineHeight: 1.6,
        marginBottom: '14px',
      }}>
        Three gentle nudges a day: morning, after school, bedtime. Same moments your child faces screens. You will be ready with the words.
      </p>
      <button
        onClick={enable}
        disabled={status === 'asking'}
        style={{
          background: 'var(--stage-4-bold)',
          color: 'var(--stage-4-text)',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '.78rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          cursor: status === 'asking' ? 'wait' : 'pointer',
          boxShadow: '0 3px 0 rgba(0,0,0,0.12)',
        }}
      >
        {status === 'asking' ? 'Turning on...' : 'Turn on check ins'}
      </button>
    </div>
  )
}
