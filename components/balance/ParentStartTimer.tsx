'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEVICES } from '@/lib/quests/device-time'

// Start screen time from the parent side, for a child who has no phone of their
// own. The parent picks the device and how long, and it starts the same shared
// countdown the timer uses and records the minutes to the week, so a phone free
// child's screen time still shows in the balance graph below. A gift by default
// (no stars spent), because this is about seeing the real picture, not gating.

const MINUTE_CHOICES = [15, 30, 45, 60, 90]

export default function ParentStartTimer({ childId, childName }: { childId: string; childName?: string | null }) {
  const router = useRouter()
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  const [device, setDevice] = useState<string>('tv')
  const [minutes, setMinutes] = useState<number>(30)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function start() {
    if (busy) return
    setBusy(true); setError(''); setDone(false)
    try {
      const res = await fetch('/api/quests/time/parent-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // bonus: no stars spent, since this is logging a phone free child's time
        body: JSON.stringify({ childId, device, minutes, bonus: true }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as { error?: string }))
        setError(data.error === 'bad device' ? 'Pick a device first.' : 'Could not start it, try again.')
        return
      }
      setDone(true)
      router.refresh()
      setTimeout(() => setDone(false), 4000)
    } catch {
      setError('Could not start it, try again.')
    } finally {
      setBusy(false)
    }
  }

  const chip = (active: boolean): React.CSSProperties => ({
    padding: '7px 12px', borderRadius: 100, cursor: 'pointer',
    border: `1.5px solid ${active ? 'var(--terracotta)' : 'var(--border)'}`,
    background: active ? 'var(--terracotta-lt)' : '#fff',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
    color: 'var(--ink)', flexShrink: 0,
  })

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, boxShadow: '0 4px 22px rgba(26,26,46,0.06)', padding: 18, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
        Start screen time
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
        No phone of their own? Start {name}&apos;s screen time here and it still counts in the balance below, on the same countdown you both watch.
      </p>

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        {DEVICES.map(d => (
          <button key={d.key} type="button" onClick={() => setDevice(d.key)} style={chip(device === d.key)}>
            {d.emoji} {d.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
        {MINUTE_CHOICES.map(m => (
          <button key={m} type="button" onClick={() => setMinutes(m)} style={chip(minutes === m)}>
            {m}m
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={start}
        disabled={busy}
        style={{
          width: '100%', padding: '11px', borderRadius: 12, border: 'none',
          cursor: busy ? 'default' : 'pointer', background: 'var(--terracotta)', color: 'var(--ink)',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
          boxShadow: busy ? 'none' : '0 3px 0 var(--terracotta-dark)',
        }}
      >
        {busy ? 'Starting…' : done ? 'Started ✓' : `Start ${minutes} minutes`}
      </button>
      {error && <p style={{ fontSize: 12, color: '#B93B3F', margin: '9px 0 0', fontWeight: 600 }}>{error}</p>}
      {done && <p style={{ fontSize: 12, color: 'var(--retro-green-dark, #2F8F6B)', margin: '9px 0 0', fontWeight: 600 }}>Counting down now. It will show in the week below.</p>}
    </div>
  )
}
