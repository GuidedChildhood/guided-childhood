'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEVICES, deviceEmoji, deviceLabel, type ActiveSession } from '@/lib/quests/device-time'
import { STAR_MINUTES } from '@/lib/quests/templates'
import Celebration from '@/components/ui/Celebration'

// The child's own device time timer. They have earned stars; here they turn
// some into minutes on an agreed device, on their own screen. The countdown
// runs from a fixed end time (so it survives a refresh and the parent sees
// the same number), and when it reaches zero the alarm sounds and it stops.
// Stopping early hands the unused minutes back to the bank.

function fmt(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function DeviceTimeCard({
  token, balanceStars, initialSession, usedTodayMinutes = 0, recommendedMinutes = 0,
}: {
  token: string
  balanceStars: number
  initialSession: ActiveSession | null
  usedTodayMinutes?: number
  recommendedMinutes?: number
}) {
  const router = useRouter()
  const [session, setSession] = useState<ActiveSession | null>(initialSession)
  const [phase, setPhase] = useState<'idle' | 'picking' | 'up'>(initialSession ? 'idle' : 'idle')
  const [device, setDevice] = useState<string>('tv')
  const [minutes, setMinutes] = useState<number>(Math.min(30, balanceStars * STAR_MINUTES))
  const [remaining, setRemaining] = useState<number>(0)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const audioRef = useRef<AudioContext | null>(null)

  const maxMinutes = Math.max(0, balanceStars * STAR_MINUTES)
  const costStars = Math.ceil(minutes / STAR_MINUTES)

  // A fun, unmistakable Duolingo style jingle: a bright bouncing arpeggio that
  // runs up and lands on a cheeky little "ta da", with a happy buzz on phones.
  // Warm triangle tones so it lifts rather than jars, the way a good app rewards
  // you rather than tells you off.
  const soundAlarm = useCallback(() => {
    try {
      const ctx = audioRef.current
      if (ctx) {
        const now = ctx.currentTime
        const beep = (freq: number, at: number, dur: number, peak = 0.26) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          const t0 = now + at
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, t0)
          gain.gain.setValueAtTime(0.0001, t0)
          gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
          osc.connect(gain).connect(ctx.destination)
          osc.start(t0)
          osc.stop(t0 + dur + 0.03)
        }
        // Bright ascending run: C5 E5 G5 C6, then a little bounce back up to
        // C6 for the "ta da". The whole phrase plays, so it is clearly the end.
        const melody: [number, number, number, number?][] = [
          [523, 0.00, 0.16],   // C5
          [659, 0.14, 0.16],   // E5
          [784, 0.28, 0.16],   // G5
          [1047, 0.44, 0.24],  // C6
          [784, 0.72, 0.14, 0.20],  // G5, quick dip
          [1047, 0.86, 0.42, 0.30], // C6, the landing
        ]
        melody.forEach(([f, at, dur, peak]) => beep(f, at, dur, peak))
      }
    } catch { /* audio best effort */ }
    // A cheerful little rhythm on phones, not one long angry buzz.
    try { navigator.vibrate?.([90, 70, 90, 70, 90, 90, 260]) } catch { /* no haptics */ }
  }, [])

  // Tick every second off the fixed end time. When it hits zero, sound the
  // alarm once and close the session on the server.
  useEffect(() => {
    if (!session) return
    const end = new Date(session.endsAt).getTime()
    let fired = false
    const tick = () => {
      const left = Math.round((end - Date.now()) / 1000)
      setRemaining(left)
      if (left <= 0 && !fired) {
        fired = true
        soundAlarm()
        setPhase('up')
        // Record the stop; the whole block was used, so nothing refunds.
        fetch('/api/quests/time/stop', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, session_id: session.id }),
        }).catch(() => {})
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [session, token, soundAlarm])

  async function start() {
    if (busy || minutes < STAR_MINUTES || minutes > maxMinutes) return
    setBusy(true)
    // Create the audio context on this tap (a user gesture) so the alarm is
    // allowed to sound later when the time is up.
    try {
      type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext }
      const Ctx = window.AudioContext || (window as WithWebkit).webkitAudioContext
      if (Ctx && !audioRef.current) audioRef.current = new Ctx()
      await audioRef.current?.resume()
    } catch { /* audio optional */ }
    try {
      const res = await fetch('/api/quests/time/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, device, minutes }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.pending) {
        // Ask first families: the grown up has to say yes. The child sees a
        // calm confirmation, not a timer, and the parent gets the ping.
        setNote('Asked your grown up! They will start your time when they say yes.')
        setPhase('idle')
      } else if (res.ok && data.session) {
        setNote(null)
        setSession({
          id: data.session.id, device: data.session.device, minutes: data.session.minutes,
          stars: data.session.stars, endsAt: data.session.ends_at, startedAt: data.session.started_at,
        })
        setPhase('idle')
        router.refresh()
      } else if (data.error === 'chores first') {
        setNote(`Finish first: ${(data.blocking ?? []).join(', ')}. Then your time can start.`)
      } else if (data.error === 'not enough stars') {
        setNote('Not quite enough stars yet. Earn a few more first.')
      } else {
        setNote('That did not start. Try again in a moment.')
      }
    } catch { setNote('That did not start. Try again in a moment.') }
    setBusy(false)
  }

  async function stop() {
    if (!session || busy) return
    setBusy(true)
    try {
      await fetch('/api/quests/time/stop', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, session_id: session.id }),
      })
    } catch { /* best effort */ }
    setSession(null)
    setPhase('idle')
    setBusy(false)
    router.refresh()
  }

  // ── Running: the live countdown ──
  if (session && phase !== 'up') {
    const total = session.minutes * 60
    const pct = Math.max(0, Math.min(100, (remaining / total) * 100))
    const low = remaining <= 60
    return (
      <div style={{ background: '#fff', borderRadius: '20px', padding: '18px 20px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(0,0,0,0.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>{deviceEmoji(session.device)}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {deviceLabel(session.device)} time
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.4rem', lineHeight: 1, color: low ? '#C0533E' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(remaining)}
            </div>
          </div>
        </div>
        <div style={{ height: '10px', borderRadius: '10px', background: 'var(--cream)', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ height: '100%', borderRadius: '10px', width: `${pct}%`, background: low ? '#C0533E' : 'var(--terracotta)', transition: 'width 1s linear' }} />
        </div>
        <button
          onClick={stop}
          disabled={busy}
          style={{ width: '100%', padding: '13px', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}
        >
          I&apos;m done, hand it back
        </button>
      </div>
    )
  }

  // ── Time's up ──
  if (phase === 'up') {
    return (
      <div style={{ position: 'relative', background: 'var(--terracotta)', borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: '0 5px 0 var(--terracotta-dark)', textAlign: 'center', overflow: 'hidden' }}>
        <Celebration fire />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.4rem', lineHeight: 1, marginBottom: '6px', display: 'inline-block', animation: 'gcAlarmBounce 0.7s ease-in-out 3' }}>⏰</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '4px' }}>Time is up!</div>
          <p style={{ fontSize: '14.5px', color: 'var(--ink)', opacity: 0.8, margin: '0 0 14px', lineHeight: 1.5 }}>
            Great play! Your {deviceLabel(session?.device ?? 'phone')} time is done. Earn more stars to unlock more.
          </p>
          <button
            onClick={() => { setSession(null); setPhase('idle'); router.refresh() }}
            style={{ padding: '11px 22px', borderRadius: '14px', border: 'none', background: 'var(--ink)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800 }}
          >
            OK
          </button>
        </div>
      </div>
    )
  }

  // ── Picking a device and minutes ──
  if (phase === 'picking') {
    return (
      <div style={{ background: '#fff', borderRadius: '20px', padding: '18px 20px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(0,0,0,0.14)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '12px' }}>
          What are you using?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {DEVICES.map(d => {
            const on = device === d.key
            return (
              <button
                key={d.key}
                onClick={() => setDevice(d.key)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '12px 4px', borderRadius: '14px', cursor: 'pointer',
                  border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                  background: on ? 'var(--terracotta-lt)' : 'var(--cream)',
                  fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, color: 'var(--ink)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{d.emoji}</span>
                {d.label}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>How long?</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>{costStars} of your {balanceStars} stars</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => setMinutes(m => Math.max(STAR_MINUTES, m - STAR_MINUTES))}
            style={{ width: 44, height: 44, borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontSize: '20px', fontWeight: 800, color: 'var(--ink)', flexShrink: 0 }}
          >−</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.9rem', lineHeight: 1, color: 'var(--ink)' }}>{minutes}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>minutes</div>
          </div>
          <button
            onClick={() => setMinutes(m => Math.min(maxMinutes, m + STAR_MINUTES))}
            disabled={minutes + STAR_MINUTES > maxMinutes}
            style={{ width: 44, height: 44, borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: minutes + STAR_MINUTES > maxMinutes ? 'default' : 'pointer', fontSize: '20px', fontWeight: 800, color: 'var(--ink)', opacity: minutes + STAR_MINUTES > maxMinutes ? 0.4 : 1, flexShrink: 0 }}
          >+</button>
        </div>
        {note && (
          <div style={{ background: '#FDECEC', border: '1.5px solid #E5484D', borderRadius: '12px', padding: '10px 13px', marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#B93B3F', lineHeight: 1.4 }}>
            {note}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPhase('idle')}
            style={{ padding: '13px 18px', borderRadius: '14px', border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--ink-soft)' }}
          >Back</button>
          <button
            onClick={start}
            disabled={busy || minutes < STAR_MINUTES}
            style={{ flex: 1, padding: '13px', borderRadius: '14px', border: 'none', background: 'var(--terracotta)', color: 'var(--ink)', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, boxShadow: '0 4px 0 var(--terracotta-dark)', opacity: busy ? 0.6 : 1 }}
          >
            {busy ? 'Starting...' : `Start ${minutes} min ⏱️`}
          </button>
        </div>
      </div>
    )
  }

  // ── Idle: the invite to spend, with today's healthy amount in view ──
  const canSpend = balanceStars > 0
  const recToday = Math.max(0, Math.round(recommendedMinutes))
  const usedToday = Math.max(0, Math.round(usedTodayMinutes))
  const guidePct = recToday > 0 ? Math.min(100, Math.round((usedToday / recToday) * 100)) : 0
  const reachedGuide = recToday > 0 && usedToday >= recToday

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Today's healthy amount: a small, calm bar of how much screen time has
          been had today against the guide for this age. Never a lock, just a
          gentle heads up so a child can see their own balance. */}
      {recToday > 0 && (
        <div style={{
          background: reachedGuide ? 'var(--tint-sage)' : '#fff',
          borderRadius: '14px', padding: '11px 15px', marginBottom: '10px',
          boxShadow: '0 3px 0 rgba(0,0,0,0.10)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>
              {reachedGuide ? 'You have had your screen time today 🌱' : "Today's screen time"}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
              {usedToday}/{recToday} min
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'rgba(26,26,46,0.10)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${guidePct}%`, borderRadius: 100, background: reachedGuide ? 'var(--retro-green)' : 'var(--terracotta)', transition: 'width 0.5s ease' }} />
          </div>
          {reachedGuide && (
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '7px 0 0' }}>
              That is the healthy amount for your age. Want more? Ask your grown up for a treat.
            </p>
          )}
        </div>
      )}

      <button
        onClick={() => canSpend && setPhase('picking')}
        disabled={!canSpend}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
          background: canSpend ? '#fff' : 'rgba(255,255,255,0.55)', border: 'none',
          borderRadius: '18px', padding: '15px 18px',
          cursor: canSpend ? 'pointer' : 'default',
          boxShadow: canSpend ? '0 5px 0 rgba(0,0,0,0.14)' : 'none',
        }}
      >
        <span style={{ fontSize: '1.7rem', flexShrink: 0 }}>⏱️</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2 }}>
            {canSpend ? (reachedGuide ? 'A treat, if a grown up says yes' : 'Use my device time') : 'No device time yet'}
          </span>
          <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: '2px' }}>
            {canSpend ? `You have ${balanceStars * STAR_MINUTES} minutes to use` : 'Earn stars to unlock screen time'}
          </span>
        </span>
        {canSpend && <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>▶</span>}
      </button>
    </div>
  )
}
