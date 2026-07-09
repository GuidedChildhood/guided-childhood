'use client'
import { useState, useEffect } from 'react'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

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
  const [resetting, setResetting] = useState(false)
  const [enableError, setEnableError] = useState<string | null>(null)

  async function sendTest() {
    setTestResult('Sending...')
    try {
      const res = await fetch('/api/push/test', { method: 'POST' })
      const data = await res.json()
      if (data.sent > 0) setTestResult('Sent. It should appear on this device within seconds.')
      else if (data.reason) setTestResult('No subscription found for this account on any device yet. Tap Turn on check ins first, inside the installed app.')
      else if (data.errors?.length) setTestResult(`The push service refused (code ${data.errors[0]})${data.details?.[0] ? `: ${data.details[0]}` : ''}. Tell Claude this whole message.`)
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
    setEnableError(null)
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setStatus('unsupported')
        return
      }

      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        setStatus('denied')
        setEnableError('Notifications are blocked for this app. Open your phone settings for Guided Childhood and allow notifications, then try again.')
        return
      }

      // A stale or missing service worker registration is the most common
      // reason subscribe throws. ready can hang if the worker never
      // registered, so nudge a registration first.
      if (!(await navigator.serviceWorker.getRegistration())) {
        try { await navigator.serviceWorker.register('/sw.js') } catch { /* the ready below will surface it */ }
      }
      const reg = await navigator.serviceWorker.ready

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), userId, stage }),
      })
      if (!res.ok) {
        setStatus('idle')
        setEnableError('Turned on here, but saving it to your account failed. Try once more.')
        return
      }

      setStatus('granted')
    } catch (err) {
      // Never die silently: show what actually went wrong so it is fixable
      // rather than a dead button.
      setStatus('idle')
      const msg = err instanceof Error ? err.message : String(err)
      setEnableError(`Could not turn on notifications: ${msg.slice(0, 160)}. On iPhone this needs the app added to your home screen first.`)
    }
  }

  // The browser can say permission is granted while the actual
  // registration underneath has gone stale (a reinstall, a cleared
  // cache, an old service worker). This says on but nothing ever
  // arrives is exactly that state, and there was no way to fix it
  // short of digging into phone settings. Reset clears the old
  // registration and creates a brand new one in two taps.
  async function resetAndRetest() {
    setResetting(true)
    setTestResult(null)
    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      if (existing) {
        try {
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ endpoint: existing.endpoint }),
          })
        } catch { /* best effort */ }
        await existing.unsubscribe()
      }
      await enable()
      setTimeout(sendTest, 600)
    } catch {
      setStatus('denied')
    } finally {
      setResetting(false)
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
        <button
          onClick={resetAndRetest}
          disabled={resetting}
          style={{
            background: 'none', border: 'none', cursor: resetting ? 'wait' : 'pointer', padding: 0, marginTop: '10px',
            fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
            color: 'var(--ink-muted)', textDecoration: 'underline',
          }}
        >
          {resetting ? 'Resetting...' : 'Test not arriving? Reset and try again'}
        </button>
      </div>
    )
  }

  // When blocked or unsupported, stay quiet unless we captured a reason
  // worth showing so the parent knows why the button did nothing.
  if ((status === 'denied' || status === 'unsupported') && !enableError) return null
  if (status === 'denied' || status === 'unsupported') {
    return (
      <div style={{
        background: 'var(--stage-4)', borderRadius: '16px', padding: '16px 20px',
        border: '1px solid var(--border)',
      }}>
        <p style={{ margin: 0, fontSize: '.8rem', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          {enableError}
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--stage-4)',
      borderRadius: '16px',
      padding: '20px 22px',
      border: '2px solid var(--terracotta)',
      boxShadow: '0 6px 20px rgba(224,122,63,0.16)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
        Important step
      </div>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontWeight: 800,
        color: 'var(--ink)',
        marginBottom: '6px',
      }}>
        Turn on your daily check ins
      </p>
      <p style={{
        fontSize: '.8rem',
        color: 'var(--ink-soft)',
        lineHeight: 1.6,
        marginBottom: '10px',
      }}>
        Three gentle nudges a day: morning, after school, bedtime. The moments your child faces screens, so you are ready with the words. This is the thing that keeps the habit alive.
      </p>
      <p style={{
        fontSize: '.72rem',
        color: 'var(--ink-muted)',
        lineHeight: 1.5,
        marginBottom: '14px',
        fontFamily: 'var(--font-mono)',
      }}>
        On iPhone, add the app to your Home Screen first (tap Share, then Add to Home Screen), then open it from there and turn these on.
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
      {enableError && (
        <p style={{ margin: '12px 0 0', fontSize: '.76rem', fontWeight: 600, color: 'var(--terracotta-dark, #a44)', lineHeight: 1.5 }}>
          {enableError}
        </p>
      )}
    </div>
  )
}
