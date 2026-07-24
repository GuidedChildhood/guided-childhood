'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { DEVICES, type DeviceKey, minutesToStars, deviceLabel, deviceEmoji } from '@/lib/quests/device-time'
import { dailyGuide, wouldExceedGuide } from '@/lib/quests/daily-guide'
import { bandLabelFor } from '@/lib/quests/screen-balance'

// The parent's screen time control, one card per child. When a child has time
// running it shows the same countdown the child sees, and warns the parent
// with an alarm and a plain line the moment it hits zero, straight into setting
// the next quests. When nothing is running the parent can grant time on any
// device, spending the child's earned stars by default, or a bonus for a treat.

type Session = { id: string; child_id: string; device: DeviceKey; minutes: number; stars: number; ends_at: string; started_at: string }
type DeviceRequest = { id: string; device: DeviceKey; minutes: number }
type DeviceWeek = { device: DeviceKey; minutes: number; sessions: number }
type Kid = { id: string; name: string; balance: number; session: Session | null; trust: string; request: DeviceRequest | null; ageBand?: string | null; usedToday?: number; recommended?: number; week?: DeviceWeek[]; sessionsToday?: number; giftOwed?: number; agreedAt?: string | null }

// How a grant pays for itself: their earned stars (the default), a gift that
// jobs pay back later, or a free bonus with no strings at all.
const GRANT_MODES: { key: 'stars' | 'gift' | 'bonus'; label: string; hint: string }[] = [
  { key: 'stars', label: 'Spend their stars', hint: 'The default. Earned time, the deal as agreed.' },
  { key: 'gift', label: 'Gift it', hint: 'Starts now, no stars spent. Jobs pay it back later, framed as saying thanks.' },
  { key: 'bonus', label: 'Free bonus', hint: 'A treat with no strings. Spends nothing, owes nothing.' },
]

const TRUST_LEVELS: { key: string; label: string; hint: string }[] = [
  { key: 'ask', label: 'Ask first', hint: 'They ask with one tap, you get a ping, and your yes starts their timer. The default.' },
  { key: 'watch', label: 'They start, you watch', hint: 'They start it themselves, you get the ping and the live countdown.' },
  { key: 'trusted', label: 'Trusted', hint: 'They start it themselves, a lighter touch, no ping each time.' },
]

// The pending ask, answered in one tap: device and minutes named, yes or not
// yet. Shared by the screen time card and the locked banner on the quests
// page, so the answer is always one tap from wherever the parent is looking.
export function PendingAskBox({ childName, request, exceedsGuide, busy, onApprove, onDecline }: {
  childName: string
  request: { device: DeviceKey; minutes: number }
  exceedsGuide: boolean
  busy: boolean
  onApprove: () => void
  onDecline: () => void
}) {
  return (
    <div style={{ border: '1.5px solid var(--terracotta)', background: 'var(--terracotta-lt)', borderRadius: '13px', padding: '11px 13px', marginBottom: '11px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)', marginBottom: '2px' }}>
        {deviceEmoji(request.device)} {childName} is asking for {request.minutes} minutes
      </div>
      <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '9px' }}>
        That is {minutesToStars(request.minutes)} star{minutesToStars(request.minutes) === 1 ? '' : 's'} on the {deviceLabel(request.device)}. Your yes lets {childName} tap Start on their screen.
      </div>
      {/* Saying yes here past the day's guide is a treat, named warmly
          before the tap so the parent grants it knowingly. Never a block. */}
      {exceedsGuide && (
        <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 9px' }}>
          This takes {childName} past today&apos;s healthy amount for their age, so it goes down as a treat. Treats are fine, they are yours to give.
        </p>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onApprove} disabled={busy} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: busy ? 'default' : 'pointer', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>Yes, start it</button>
        <button onClick={onDecline} disabled={busy} style={{ flexShrink: 0, padding: '10px 15px', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff', cursor: busy ? 'default' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink-soft)' }}>Not yet</button>
      </div>
    </div>
  )
}

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
    // Poll often enough that a child stopping early clears the parent's live
    // timer within a few seconds, not up to twenty, so both sides agree.
    const t = setInterval(load, 8000)
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
      <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>
        Set device time for each child. It spends their stars, or give a bonus for a treat. You both get the alarm when it is up.
      </p>
      <details style={{ marginBottom: '16px' }}>
        <summary style={{ cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          How does screen time work? ›
        </summary>
        <ol style={{ margin: '10px 0 0', padding: '0 0 0 4px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            ['⭐', 'They earn stars by doing quests. One star is worth five minutes of screen time.'],
            ['⏱️', 'You pick a device and how long here, and it spends those stars. Or flip on bonus to gift free minutes.'],
            ['📱', 'The countdown runs on their phone and yours at the same time, so you both see it ticking down.'],
            ['⏰', 'When it reaches zero, both phones get the alarm. Then it is time to agree the next quests.'],
          ].map(([icon, text]) => (
            <li key={text} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </details>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* A child asking for time pops to the top, then a child with a timer
            running, so the thing that needs the parent is always first. */}
        {[...kids]
          .sort((a, b) => (b.request ? 2 : b.session ? 1 : 0) - (a.request ? 2 : a.session ? 1 : 0))
          .map(k => (
            <ChildRow key={k.id} kid={k} onChange={load} onAlarm={alarm} />
          ))}
      </div>
    </div>
  )
}

function ChildRow({ kid, onChange, onAlarm }: { kid: Kid; onChange: () => void; onAlarm: () => void }) {
  const [device, setDevice] = useState<DeviceKey>('tablet')
  const [minutes, setMinutes] = useState(30)
  const [mode, setMode] = useState<'stars' | 'gift' | 'bonus'>('stars')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const firedRef = useRef(false)
  // The last running session we were counting down, so when it vanishes from a
  // poll we can tell whether the child handed it back early or the clock simply
  // ran out.
  const lastRunRef = useRef<{ endsAt: number; startedAt: number; planned: number; device: DeviceKey } | null>(null)
  // A calm note when the child stopped early, shown on the open board so a
  // parent looking at it is told, not just the push when the app is closed.
  const [stoppedNote, setStoppedNote] = useState<{ mins: number; device: DeviceKey } | null>(null)

  // Live countdown from the running session, ticking every second, alarming
  // once when it reaches zero.
  useEffect(() => {
    if (!kid.session) {
      // A running timer just disappeared. If its planned end is still in the
      // future, the child stopped watching early, so surface it here too. When
      // the end has already passed the clock ran out and the time up flow and
      // the push have that covered.
      const last = lastRunRef.current
      if (last && Date.now() < last.endsAt - 1500) {
        const used = Math.max(1, Math.min(Math.round(last.planned), Math.ceil((Date.now() - last.startedAt) / 60000)))
        setStoppedNote({ mins: used, device: last.device })
      }
      lastRunRef.current = null
      setRemaining(null); setFinished(false); firedRef.current = false
      return
    }
    // A fresh timer is running: remember it and clear any old stopped note.
    lastRunRef.current = {
      endsAt: new Date(kid.session.ends_at).getTime(),
      startedAt: new Date(kid.session.started_at).getTime(),
      planned: kid.session.minutes,
      device: kid.session.device,
    }
    setStoppedNote(null)
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

  const cost = mode === 'stars' ? minutesToStars(minutes) : 0
  const tooPoor = mode === 'stars' && kid.balance < cost

  async function start() {
    if (busy || tooPoor) return
    setBusy(true); setErr(null)
    try {
      const r = await fetch('/api/quests/time/parent-start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: kid.id, device, minutes, bonus: mode === 'bonus', gift: mode === 'gift' }),
      })
      const d = await r.json()
      if (!r.ok) { setErr(d.error === 'not enough stars' ? 'Not enough stars for that' : 'Could not start, try again'); setBusy(false); return }
      onChange()
    } catch { setErr('Could not start, try again') }
    setBusy(false)
  }

  // Ask first: the yes marks the ask approved and pings the child, whose own
  // Start button begins the timer, so minutes never tick away on a screen
  // nobody is looking at. Not yet declines it warmly.
  const [answered, setAnswered] = useState<'yes' | null>(null)
  const [jobsLeftAfterYes, setJobsLeftAfterYes] = useState(0)
  async function approveRequest() {
    if (!kid.request || busy) return
    setBusy(true); setErr(null)
    try {
      const r = await fetch('/api/quests/time/request', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: kid.request.id, status: 'approved' }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setErr('Could not send the yes, try again'); setBusy(false); return }
      setJobsLeftAfterYes(Number(d.jobsLeft) || 0)
      setAnswered('yes')
      onChange()
    } catch { setErr('Could not send the yes, try again') }
    setBusy(false)
  }
  async function declineRequest() {
    if (!kid.request || busy) return
    setBusy(true)
    try {
      await fetch('/api/quests/time/request', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: kid.request.id, status: 'declined' }) })
      onChange()
    } catch { /* non blocking */ }
    setBusy(false)
  }
  async function setTrust(level: string) {
    try {
      await fetch('/api/quests/time/trust', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ childId: kid.id, trust: level }) })
      onChange()
    } catch { /* non blocking */ }
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

      {/* The child handed the device back before the time was up. Their timer
          stopped, and so did this one, so a parent watching the board is told
          the same thing the push says, with the minutes that were recorded. */}
      {stoppedNote && (
        <div style={{ border: '1.5px solid var(--terracotta)', background: 'var(--terracotta-lt)', borderRadius: '13px', padding: '11px 13px', marginBottom: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>
              ⏹️ {kid.name} has stopped watching
            </span>
            <button onClick={() => setStoppedNote(null)} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)' }}>
              OK
            </button>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
            {stoppedNote.mins} minute{stoppedNote.mins === 1 ? '' : 's'} on the {deviceLabel(stoppedNote.device)} recorded, on today&apos;s balance. The rest of the stars went back.
          </div>
        </div>
      )}

      {/* A gift still being paid back, quietly. A gift is a gift: this is a
          note of the thank you on its way, never a debt collector. */}
      {(kid.giftOwed ?? 0) > 0 && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)', margin: '0 0 9px' }}>
          💛 Gifted, {kid.giftOwed} star{kid.giftOwed === 1 ? '' : 's'} owed in jobs
        </p>
      )}

      {/* The timer rule this child agreed on their first run, locked in and
          visible on both sides. */}
      {kid.agreedAt && (
        <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', margin: '0 0 9px' }}>
          {kid.name} agreed the timer rule on {new Date(kid.agreedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.{' '}
          <Link href="/dashboard/agreement" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'none' }}>
            See the agreement →
          </Link>
        </p>
      )}

      {/* Today's guide: how much this child has already had against the age
          banded recommendation, so a grant is made with the day in view. A
          soft steer, never a block. */}
      <DailyGuideLine name={kid.name} usedToday={kid.usedToday ?? 0} recommended={kid.recommended ?? 0} ageBand={kid.ageBand ?? null} addingMinutes={minutes} sessionsToday={kid.sessionsToday ?? 0} />

      {/* Ask first: the child is waiting on a yes. */}
      {kid.request && (
        <PendingAskBox
          childName={kid.name}
          request={kid.request}
          exceedsGuide={wouldExceedGuide(kid.ageBand ?? null, kid.usedToday ?? 0, kid.request.minutes)}
          busy={busy}
          onApprove={approveRequest}
          onDecline={declineRequest}
        />
      )}
      {/* The yes is away: one calm line while the child taps Start. When jobs
          are still to do today, the same soft nudge the child gets shows here,
          so both sides are told to finish those first. Never a block. */}
      {!kid.request && answered === 'yes' && !kid.session && (
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-soft)', background: 'var(--tint-sage)', borderRadius: '11px', padding: '9px 12px', margin: '0 0 11px', lineHeight: 1.45 }}>
          {jobsLeftAfterYes > 0
            ? `✅ Yes sent. ${kid.name} still has ${jobsLeftAfterYes} job${jobsLeftAfterYes === 1 ? '' : 's'} to do today, so we have asked them to finish those first, then tap Start.`
            : `✅ Yes sent. ${kid.name} taps Start on their screen and the countdown shows here too.`}
        </p>
      )}

      {/* Who starts the timer: how much this child does alone, more as they
          grow. Easy to find, one plain line per option. */}
      <details style={{ marginBottom: '11px', background: 'var(--cream)', borderRadius: '12px', padding: '9px 12px' }}>
        <summary style={{ cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
          Who starts the timer? <span style={{ fontWeight: 700, color: 'var(--terracotta-dark)' }}>{TRUST_LEVELS.find(l => l.key === kid.trust)?.label ?? 'Ask first'} ›</span>
        </summary>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '9px' }}>
          {TRUST_LEVELS.map(l => (
            <button key={l.key} onClick={() => setTrust(l.key)} aria-pressed={kid.trust === l.key} style={{
              textAlign: 'left', padding: '8px 11px', borderRadius: '11px', cursor: 'pointer',
              background: kid.trust === l.key ? 'var(--terracotta-lt)' : '#fff',
              border: kid.trust === l.key ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
            }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>{l.label}</span>
              <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{l.hint}</span>
            </button>
          ))}
        </div>
      </details>

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

      {/* How this grant pays: stars, a gift with a pay back, or a free bonus. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '11px' }}>
        {GRANT_MODES.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} aria-pressed={mode === m.key} style={{
            textAlign: 'left', padding: '8px 11px', borderRadius: '11px', cursor: 'pointer',
            background: mode === m.key ? 'var(--terracotta-lt)' : '#fff',
            border: mode === m.key ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
          }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>{m.label}</span>
            <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{m.hint}</span>
          </button>
        ))}
      </div>

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
          : mode === 'gift' ? `Gift ${minutes} min on the ${deviceLabel(device)} 💛`
          : mode === 'bonus' ? `Give ${minutes} min on the ${deviceLabel(device)} 🎁`
          : `Start ${minutes} min · ${cost} stars`}
      </button>
      {mode === 'gift' && (
        <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '7px 0 0' }}>
          The gift starts now and {minutesToStars(minutes)} star{minutesToStars(minutes) === 1 ? '' : 's'} of jobs pay it back later. The next approved job settles it by itself.
        </p>
      )}

      <WhereTheTimeGoes name={kid.name} ageBand={kid.ageBand ?? null} week={kid.week ?? []} />
    </div>
  )
}

// The week's screen time by device, heaviest first, so a parent can see at a
// glance where the time actually goes. Under the heaviest device sits one age
// calibrated line in the balance philosophy: what screens displace matters
// more than the clock, and jobs on the quest board earn the time. One line,
// one link, never a lecture.
function WhereTheTimeGoes({ name, ageBand, week }: { name: string; ageBand: string | null; week: DeviceWeek[] }) {
  if (week.length === 0) return null
  const heaviest = week[0]
  const band = bandLabelFor(ageBand)
  const advice: Record<DeviceKey, string> = {
    console: `Gaming carries most of ${name}'s screen time. At age ${band} what the sessions displace matters more than the clock, so keep sleep, movement and real mates first, and let jobs on the quest board earn the play.`,
    tv: `TV carries most of ${name}'s screen time. At age ${band} what the watching displaces matters more than the clock, so keep play and sleep in first place, and let jobs on the quest board earn the sittings.`,
    phone: `The phone carries most of ${name}'s screen time. At age ${band} shorter sittings with real breaks work best, so let jobs on the quest board earn each one.`,
    tablet: `The tablet carries most of ${name}'s screen time. At age ${band} the balance matters more than the clock, so keep making and moving around it, and let jobs on the quest board earn the sittings.`,
  }
  return (
    <div style={{ marginTop: '12px', background: 'var(--cream)', borderRadius: '13px', padding: '11px 13px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '7px' }}>
        Where the time goes · last 7 days
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {week.map(w => (
          <div key={w.device} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', flexShrink: 0 }}>{deviceEmoji(w.device)}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', color: 'var(--ink)', flexShrink: 0 }}>{deviceLabel(w.device)}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', marginLeft: 'auto' }}>
              {w.minutes} min this week · {w.sessions} session{w.sessions === 1 ? '' : 's'}
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
        {advice[heaviest.device]}{' '}
        <Link href="/dashboard/lessons" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'none' }}>
          Healthy balance lessons →
        </Link>
      </p>
    </div>
  )
}

// The day's recommended viewing at a glance: a slim bar of used against the
// age banded guide, the day's sittings, one plain line, and a warm treat note
// when the minutes about to be granted would take the child past the guide for
// the day. Always a soft steer, never a limit that blocks the parent.
function DailyGuideLine({ name, usedToday, recommended, ageBand, addingMinutes, sessionsToday }: {
  name: string; usedToday: number; recommended: number; ageBand: string | null; addingMinutes: number; sessionsToday: number
}) {
  const g = dailyGuide(ageBand, usedToday)
  if (recommended <= 0) return null
  const willTreat = wouldExceedGuide(ageBand, usedToday, addingMinutes)
  const accent = g.status === 'over' ? '#C0533E' : g.status === 'reached' ? 'var(--terracotta-dark)' : 'var(--retro-green)'
  return (
    <div style={{ marginBottom: '11px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          Today, age {g.bandLabel}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: accent }}>
          {g.used} of ~{recommended} min
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 100, background: 'rgba(26,26,46,0.08)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${g.pct}%`, borderRadius: 100, background: accent, transition: 'width 0.4s ease' }} />
      </div>
      {sessionsToday > 0 && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '4px' }}>
          {sessionsToday} session{sessionsToday === 1 ? '' : 's'} today
        </div>
      )}
      {(g.status !== 'under' || willTreat) && (
        <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '6px 0 0' }}>
          {g.status === 'over'
            ? `That is ${g.overBy} min over today's guide. Anything more is a treat, your call.`
            : g.status === 'reached'
            ? `They have had their recommended time today. More is a treat, your call.`
            : `This takes ${name} past today's healthy amount for their age, so it goes down as a treat. Treats are fine, they are yours to give.`}
        </p>
      )}
    </div>
  )
}
