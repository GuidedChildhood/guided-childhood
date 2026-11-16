'use client'

import { useMemo, useState } from 'react'
import {
  suggestedSlots, whenLabel, clockLabel, londonToUtc, calendarFile, MAX_DAYS_AHEAD,
} from '@/lib/lessons/watch-bookings'
import { londonNow } from '@/lib/time/london'

// Book a time to watch this film together (migration 400). One panel under the
// film, on the parent's side only. Three suggested times and "another time"
// (Justin's answer 1), a tick for the child's buzz that starts on (answer 5),
// and once booked: the time, Add to my calendar (answer 4), Change and Cancel.
//
// The film itself is untouched by any of this: it plays before, during and
// after the booked time exactly as it always has.

type Booking = { id: string; starts_at: string; buzz_child: boolean }

const panel: React.CSSProperties = {
  background: 'var(--cream)', border: 'var(--edge)', boxShadow: 'var(--lift)',
  borderRadius: 'var(--radius-tile)', padding: '16px 18px', marginBottom: '20px',
}
const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px',
}
const choice = (on: boolean): React.CSSProperties => ({
  display: 'block', width: '100%', textAlign: 'left', minHeight: '48px', padding: '12px 14px',
  borderRadius: 'var(--radius-btn)', cursor: 'pointer', marginBottom: '8px',
  fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
  background: on ? 'var(--terracotta-lt)' : 'var(--white)',
  border: on ? '2px solid var(--terracotta)' : 'var(--edge)',
})
const select: React.CSSProperties = {
  minHeight: '48px', padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: 'var(--edge)',
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', background: 'var(--white)', color: 'var(--ink)', flex: 1,
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dayOptions(now: Date): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = []
  for (let i = 0; i <= MAX_DAYS_AHEAD; i++) {
    const ln = londonNow(new Date(now.getTime() + i * 86400000))
    out.push({ value: ln.dateStr, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${DAY_NAMES[ln.weekday]} ${ln.day}` })
  }
  return out
}

// 07:00 to 21:45 in quarter hours. Evenings are allowed (answer 3): after
// 19:00 the film waits silently on the child's page.
const TIMES = Array.from({ length: 60 }, (_, i) => { const m = 7 * 60 + i * 15; return { h: Math.floor(m / 60), m: m % 60 } })

export default function WatchBookingPanel({
  childId, childName, lessonCode, title, initial, filmUrl,
}: {
  childId: string
  childName: string | null
  lessonCode: string
  title: string
  initial: Booking | null
  /** The page address, for the calendar entry. */
  filmUrl: string
}) {
  const name = childName ?? 'your child'
  const [booking, setBooking] = useState<Booking | null>(initial)
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [other, setOther] = useState(false)
  const [day, setDay] = useState<string>('')
  const [time, setTime] = useState<string>('17:00')
  const [buzz, setBuzz] = useState<boolean>(initial?.buzz_child ?? true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const now = useMemo(() => new Date(), [open])
  const slots = useMemo(() => suggestedSlots(now), [now])
  const days = useMemo(() => dayOptions(now), [now])

  const otherIso = useMemo(() => {
    if (!other || !day) return null
    const [h, m] = time.split(':').map(Number)
    return londonToUtc(day, h, m).toISOString()
  }, [other, day, time])
  const chosen = other ? otherIso : picked
  const evening = chosen ? londonNow(new Date(chosen)).hour >= 19 : false

  async function save() {
    if (!chosen || busy) return
    setBusy(true); setError(null)
    try {
      const res = booking
        ? await fetch('/api/watch-bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: booking.id, starts_at: chosen, buzz_child: buzz }) })
        : await fetch('/api/watch-bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ child_id: childId, lesson_code: lessonCode, starts_at: chosen, buzz_child: buzz }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data?.error ?? 'That did not save. Try again in a moment.'); return }
      setBooking(data.booking as Booking)
      setOpen(false); setPicked(null); setOther(false)
    } catch { setError('That did not save. Try again in a moment.') }
    finally { setBusy(false) }
  }

  async function cancel() {
    if (!booking || busy) return
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/watch-bookings', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: booking.id }) })
      if (res.ok) { setBooking(null); setOpen(false) } else setError('That did not cancel. Try again in a moment.')
    } catch { setError('That did not cancel. Try again in a moment.') }
    finally { setBusy(false) }
  }

  function addToCalendar() {
    if (!booking) return
    const ics = calendarFile({ title, startsAt: booking.starts_at, uid: booking.id, url: filmUrl })
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'watch-together.ics'
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }

  // ── Booked, and not changing it ──
  if (booking && !open) {
    return (
      <div style={panel}>
        <div style={eyebrow}>Watch together time</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--ink)', margin: '0 0 4px' }}>
          Booked for {whenLabel(booking.starts_at)}
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
          At {clockLabel(booking.starts_at)} it leads {name}&rsquo;s page, and you get a reminder fifteen minutes before.
          {londonNow(new Date(booking.starts_at)).hour >= 19
            ? ' After 7pm their phone stays quiet; it just waits for them.'
            : booking.buzz_child ? ` ${name}’s phone gets one buzz at the time.` : ''}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button onClick={addToCalendar} className="btn btn-gold" style={{ minHeight: '48px', fontSize: 'var(--text-sm)' }}>Add to my calendar</button>
          <button onClick={() => { setOpen(true); setBuzz(booking.buzz_child) }} className="btn btn-outline" style={{ minHeight: '48px', fontSize: 'var(--text-sm)' }}>Change time</button>
          <button onClick={cancel} disabled={busy} className="btn btn-outline" style={{ minHeight: '48px', fontSize: 'var(--text-sm)' }}>Cancel</button>
        </div>
        {error && <p role="alert" style={{ fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', margin: '10px 0 0' }}>{error}</p>}
      </div>
    )
  }

  // ── Nothing booked, closed ──
  if (!open) {
    return (
      <div style={panel}>
        <div style={eyebrow}>Watch it together later</div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
          Pick a time and it will be waiting on {name}&rsquo;s page then, with a reminder for you.
        </p>
        <button onClick={() => setOpen(true)} className="btn btn-gold" style={{ minHeight: '48px', fontSize: 'var(--text-base)', width: '100%', justifyContent: 'center' }}>
          Book a time
        </button>
      </div>
    )
  }

  // ── Picking a time ──
  return (
    <div style={panel}>
      <div style={eyebrow}>{booking ? 'Change the time' : 'Book a time'}</div>
      {slots.map(s => (
        <button key={s.key} onClick={() => { setPicked(s.startsAt); setOther(false) }} aria-pressed={!other && picked === s.startsAt} style={choice(!other && picked === s.startsAt)}>
          {s.label}
        </button>
      ))}
      <button onClick={() => { setOther(true); setPicked(null); if (!day) setDay(days[0].value) }} aria-pressed={other} style={choice(other)}>
        Another time
      </button>
      {other && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <select aria-label="Day" value={day} onChange={e => setDay(e.target.value)} style={select}>
            {days.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select aria-label="Time" value={time} onChange={e => setTime(e.target.value)} style={select}>
            {TIMES.map(t => {
              const v = `${String(t.h).padStart(2, '0')}:${String(t.m).padStart(2, '0')}`
              const h12 = t.h % 12 === 0 ? 12 : t.h % 12
              return <option key={v} value={v}>{t.m === 0 ? `${h12}${t.h < 12 ? 'am' : 'pm'}` : `${h12}:${String(t.m).padStart(2, '0')}${t.h < 12 ? 'am' : 'pm'}`}</option>
            })}
          </select>
        </div>
      )}
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '48px', fontSize: 'var(--text-sm)', color: 'var(--ink)', cursor: 'pointer' }}>
        <input type="checkbox" checked={buzz} onChange={e => setBuzz(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--terracotta)' }} />
        Buzz {name}&rsquo;s phone at the time (never after 7pm)
      </label>
      {evening && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 8px' }}>
          After 7pm nothing buzzes a child&rsquo;s phone, so the film will just be waiting on their page.
        </p>
      )}
      {error && <p role="alert" style={{ fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
        <button onClick={save} disabled={!chosen || busy} className="btn btn-gold" style={{ minHeight: '48px', flex: 1, justifyContent: 'center', fontSize: 'var(--text-base)', opacity: chosen ? 1 : 0.6 }}>
          {busy ? 'Saving...' : chosen ? `Book ${whenLabel(chosen)}` : 'Pick a time'}
        </button>
        <button onClick={() => { setOpen(false); setError(null) }} className="btn btn-outline" style={{ minHeight: '48px', fontSize: 'var(--text-base)' }}>
          Not now
        </button>
      </div>
    </div>
  )
}
