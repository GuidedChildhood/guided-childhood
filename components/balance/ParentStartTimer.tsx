'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DEVICES, deviceEmoji, deviceLabel } from '@/lib/quests/device-time'
import DevicePickerChips, { pickedDeviceLabel, type DevicePick } from '@/components/devices/DevicePickerChips'
import { deviceIcon, type FamilyDevice } from '@/lib/devices/family'

// Start screen time from the parent side, for a child who has no phone of their
// own. The parent picks the device and how long, and it starts the same shared
// countdown the timer uses and records the minutes to the week, so a phone free
// child's screen time still shows in the balance graph below. A gift by default
// (no stars spent), because this is about seeing the real picture, not gating.
//
// It also has to know when a timer is ALREADY running. It used to flash Started
// for four seconds and then go back to asking for a device and a length, while
// the countdown it had just begun ticked away invisibly. A parent looking at
// this card had no way to tell whether their child had twenty minutes left or
// none, and the only thing on offer was to start another one on top. So the
// card now reads the same live session everything else reads, and while one is
// running the form is not the point: the countdown is.

type Live = { device: string; minutes: number; ends_at: string; family_device_id?: string | null }

function mmss(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const MINUTE_CHOICES = [15, 30, 45, 60, 90]

export default function ParentStartTimer({ childId, childName }: { childId: string; childName?: string | null }) {
  const router = useRouter()
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  const [pick, setPick] = useState<DevicePick>({ kind: 'tv', familyDeviceId: null })
  const [homeDevices, setHomeDevices] = useState<FamilyDevice[]>([])
  const [minutes, setMinutes] = useState<number>(30)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [live, setLive] = useState<Live | null>(null)
  const [now, setNow] = useState(() => Date.now())

  // The same feed the Home chip and the child app read, so all three agree
  // about whether time is running rather than each guessing.
  useEffect(() => {
    let on = true
    const load = () => {
      fetch('/api/quests/time/active')
        .then(r => r.json())
        .then(d => {
          if (!on) return
          const mine = (d.children ?? []).find((c: { id: string }) => c.id === childId)
          setLive(mine?.session ?? null)
        })
        .catch(() => {})
    }
    load()
    const id = setInterval(load, 20000)
    return () => { on = false; clearInterval(id) }
  }, [childId, done])

  // The screens in this house, so the picker offers Ella's iPad rather than the
  // word tablet, and the first one is chosen for them.
  useEffect(() => {
    let on = true
    fetch('/api/devices/family')
      .then(r => r.json())
      .then((d: { devices?: FamilyDevice[] }) => {
        if (!on) return
        const live = (d.devices ?? []).filter(x => !x.retiredAt)
        setHomeDevices(live)
        // Prefer the TV, which is what a parent starting time for a child
        // without a phone is almost always starting.
        const first = live.find(x => x.kind === 'tv') ?? live[0]
        if (first) setPick({ kind: first.kind, familyDeviceId: first.id })
      })
      .catch(() => {})
    return () => { on = false }
  }, [])

  // Ticks only while something is actually running.
  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [live])

  const left = live ? new Date(live.ends_at).getTime() - now : 0
  const running = !!live && left > 0
  const runningDevice = live?.family_device_id
    ? homeDevices.find(d => d.id === live.family_device_id) ?? null
    : null

  async function start() {
    if (busy) return
    setBusy(true); setError(''); setDone(false)
    try {
      const res = await fetch('/api/quests/time/parent-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // bonus: no stars spent, since this is logging a phone free child's time
        body: JSON.stringify({ childId, device: pick.kind, familyDeviceId: pick.familyDeviceId, minutes, bonus: true }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({} as { error?: string }))
        setError(data.error === 'bad device' ? 'Pick a device first.' : 'Could not start it, try again.')
        return
      }
      setDone(true)
      router.refresh()
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
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
    color: 'var(--ink)', flexShrink: 0,
  })

  // Time is running: the countdown IS the card. Nothing here asks for another
  // one, because starting a second timer over a live one is never the thing a
  // parent wanted, and the number they came to see is how long is left.
  if (running) {
    return (
      <div style={{ background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF', borderRadius: 20, boxShadow: '0 4px 22px rgba(26,26,46,0.06)', padding: 18, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--retro-green-dark, #236F52)', marginBottom: 8 }}>
          Screen time running
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span aria-hidden style={{ fontSize: 'var(--text-3xl)', lineHeight: 1, flexShrink: 0 }}>
            {runningDevice ? deviceIcon(runningDevice) : deviceEmoji(live!.device)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {mmss(left)}
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 3 }}>
              {/* Named when we know which one, so a house with two tablets is
                  told which tablet is counting down. */}
              left of {live!.minutes} minutes on {runningDevice ? runningDevice.label : `the ${deviceLabel(live!.device).toLowerCase()}`}. {name === 'your child' ? 'They are' : `${name} is`} watching the same countdown.
            </div>
          </div>
        </div>
        <Link
          href="/dashboard/quests"
          style={{
            display: 'block', textAlign: 'center', marginTop: 14,
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: 12,
            padding: '11px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
          }}
        >
          Open the timer
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, boxShadow: '0 4px 22px rgba(26,26,46,0.06)', padding: 18, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
        Start screen time
      </div>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
        No phone of their own? Start {name}&apos;s screen time here and it still counts in the balance below, on the same countdown you both watch.
      </p>

      <div style={{ marginBottom: 10 }}>
        <DevicePickerChips devices={homeDevices} fallback={DEVICES} value={pick} onChange={setPick} />
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
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
          boxShadow: busy ? 'none' : '0 3px 0 var(--terracotta-dark)',
        }}
      >
        {busy ? 'Starting…' : done ? 'Started ✓' : `Start ${minutes} minutes`}
      </button>
      {error && <p style={{ fontSize: 'var(--text-base)', color: '#B93B3F', margin: '9px 0 0', fontWeight: 600 }}>{error}</p>}
    </div>
  )
}
