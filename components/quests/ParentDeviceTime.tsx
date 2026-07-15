'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { DEVICES, type DeviceKey, minutesToStars, deviceLabel, deviceEmoji } from '@/lib/quests/device-time'

// The parent's screen time control, one card per child. When a child has time
// running it shows the same countdown the child sees, and warns the parent
// with an alarm and a plain line the moment it hits zero, straight into setting
// the next quests. When nothing is running the parent can grant time on any
// device, spending the child's earned stars by default, or a bonus for a treat.

type Session = { id: string; child_id: string; device: DeviceKey; minutes: number; stars: number; ends_at: string; started_at: string }
type Kid = { id: string; name: string; balance: number; session: Session | null }

const MINUTE_PRESETS = [15, 30, 45, 60]

function fmt(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function ParentDeviceTime() {
  const [kids, setKids] = useState<Kid[] | null>(null)
  const audioRef = useRef<AudioContext | null>(null)

  async function load() {
    try {
      const r = await fetch('/api/quests/time/active')
      const d = await r.json()
      setKids(d.children ?? [])
    } catch { setKids([]) }
  }
  useEffect(() => {
    load()
    const t = setInterval(load, 20000)
    return () => clearInterval(t)
  }, [])

  // The same rising alarm the child hears, best effort: browsers only allow it
  // once the parent has tapped something, so the push is the reliable warning
  // and this is the bonus when the board is already open and touched.
  function alarm() {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = audioRef.current ?? new AC()
      audioRef.current = ctx
      if (ctx.state === 'suspended') void ctx.resume()
      const now = ctx.currentTime
      ;[0, 0.5, 1].forEach((t, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain()
        osc.frequency.setValueAtTime(660 + i * 220, now + t)
        gain.gain.setValueAtTime(0.0001, now + t)
        gain.gain.exponentialRampToValueAtTime(0.3, now + t + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.42)
        osc.connect(gain).connect(ctx.destination)
        osc.start(now + t); osc.stop(now + t + 0.45)
      })
    } catch { /* no audio */ }
    try { navigator.vibrate?.([300, 120, 300]) } catch { /* no haptics */ }
  }

  if (kids === null || kids.length === 0) return null

  return (
    <div id="screen-time" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '20px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '4px' }}>
        <span style={{ fontSize: '1.1rem' }}>⏱️</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)' }}>Screen time</span>
      </div>
      <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>
        Set device time for each child. It spends their stars, or give a bonus for a treat. You both get the alarm when it is up.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {kids.map(k => (
          <ChildRow key={k.id} kid={k} onChange={load} onAlarm={alarm} />
        ))}
      </div>
    </div>
  )
}

function ChildRow({ kid, onChange, onAlarm }: { kid: Kid; onChange: () => void; onAlarm: () => void }) {
  const [device, setDevice] = useState<DeviceKey>('tablet')
  const [minutes, setMinutes] = useState(30)
  const [bonus, setBonus] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const firedRef = useRef(false)

  // Live countdown from the running session, ticking every second, alarming
  // once when it reaches zero.
  useEffect(() => {
    if (!kid.session) { setRemaining(null); setFinished(false); firedRef.current = false; return }
    const end = new Date(kid.session.ends_at).getTime()
    firedRef.current = false
    const tick = () => {
      const left = end - Date.now()
      setRemaining(left)
      if (left <= 0 && !firedRef.current) {
        firedRef.current = true
        setFinished(true)
        onAlarm()
        setTimeout(onChange, 1500)
      }
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [kid.session, onAlarm, onChange])

  const cost = bonus ? 0 : minutesToStars(minutes)
  const tooPoor = !bonus && kid.balance < cost

  async function start() {
    if (busy || tooPoor) return
    setBusy(true); setErr(null)
    try {
      const r = await fetch('/api/quests/time/parent-start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: kid.id, device, minutes, bonus }),
      })
      const d = await r.json()
      if (!r.ok) { setErr(d.error === 'not enough stars' ? 'Not enough stars for that' : 'Could not start, try again'); setBusy(false); return }
      onChange()
    } catch { setErr('Could not start, try again') }
    setBusy(false)
  }

  // Running: show the countdown, and the time up state with the next step.
  if (kid.session && remaining !== null && (remaining > 0 || finished)) {
    const total = kid.session.minutes * 60000
    const pct = Math.max(0, Math.min(100, ((total - Math.max(0, remaining)) / total) * 100))
    const up = remaining <= 0
    return (
      <div style={{ border: `1.5px solid ${up ? '#E5484D' : 'var(--terracotta)'}`, background: up ? '#FDECEC' : 'var(--terracotta-lt)', borderRadius: '16px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
            {deviceEmoji(kid.session.device)} {kid.name}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: up ? '15px' : '1.4rem', color: up ? '#B93B3F' : 'var(--ink)' }}>
            {up ? 'Time is up' : fmt(remaining)}
          </span>
        </div>
        {!up ? (
          <div style={{ height: '7px', borderRadius: '100px', background: 'rgba(26,26,46,0.10)', overflow: 'hidden', marginTop: '9px' }}>
            <div style={{ height: '100%', borderRadius: '100px', background: 'var(--terracotta)', width: `${pct}%`, transition: 'width 1s linear' }} />
          </div>
        ) : (
          <Link href="#quest-board" onClick={onChange} style={{ display: 'inline-block', marginTop: '9px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#B93B3F', textDecoration: 'none' }}>
            Set {kid.name}&apos;s next quests →
          </Link>
        )}
      </div>
    )
  }

  // Idle: the grant control.
  return (
    <div style={{ border: '1.5px solid var(--border)', borderRadius: '16px', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>{kid.name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>⭐ {kid.balance}</span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '9px' }}>
        {DEVICES.map(d => (
          <button key={d.key} onClick={() => setDevice(d.key)} aria-pressed={device === d.key} style={{
            flex: 1, padding: '8px 4px', borderRadius: '11px', cursor: 'pointer', fontSize: '17px',
            background: device === d.key ? 'var(--terracotta-lt)' : '#fff',
            border: device === d.key ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
          }}>{d.emoji}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        {MINUTE_PRESETS.map(m => (
          <button key={m} onClick={() => setMinutes(m)} aria-pressed={minutes === m} style={{
            flex: 1, padding: '8px 4px', borderRadius: '11px', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
            background: minutes === m ? 'var(--terracotta-lt)' : '#fff',
            color: minutes === m ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
            border: minutes === m ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
          }}>{m}m</button>
        ))}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '11px', cursor: 'pointer' }}>
        <input type="checkbox" checked={bonus} onChange={e => setBonus(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--terracotta)' }} />
        <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-soft)' }}>Give as a free bonus (no stars)</span>
      </label>

      {err && <p style={{ fontSize: '12px', color: '#B93B3F', margin: '0 0 8px' }}>{err}</p>}

      <button onClick={start} disabled={busy || tooPoor} style={{
        width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
        cursor: busy || tooPoor ? 'default' : 'pointer', opacity: tooPoor ? 0.55 : 1,
        background: 'var(--terracotta)', color: 'var(--ink)',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px',
        boxShadow: busy || tooPoor ? 'none' : '0 4px 0 var(--terracotta-dark)',
      }}>
        {busy ? 'Starting…'
          : tooPoor ? `Needs ${cost} stars`
          : bonus ? `Give ${minutes} min on the ${deviceLabel(device)} 🎁`
          : `Start ${minutes} min · ${cost} stars`}
      </button>
    </div>
  )
}
