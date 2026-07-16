'use client'

import { useEffect, useState } from 'react'

// Things you need to know: the open school_actions DiGi extracted from
// forwarded school emails, plus anything the parent typed in by hand
// for the school that never emails. Done and dismiss post to
// /api/school/actions, adding posts there too, and Send sends the item
// straight to the child's own quest page so packing the kit becomes
// their job, not just something the parent remembers alone.
//
// Weekly routines (PE every Thursday, library books every Friday) are
// a separate, permanent list: they never get done or dismissed the
// way a one off does, they just come round again, and can be set to
// remind the child automatically every single week with no parent tap
// required.

export type SchoolAction = {
  id: string
  kind: string
  title: string
  detail: string | null
  due_date: string | null
  due_time?: string | null
  sent_to_child?: boolean
  recurs_weekday?: number | null
  auto_send_to_child?: boolean
}

const KIND_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  kit: { label: 'Kit', bg: 'var(--stage-1-bold)', color: 'var(--stage-1-text)' },
  payment: { label: 'Payment', bg: 'var(--stage-3-bold)', color: 'var(--stage-3-text)' },
  homework: { label: 'Homework', bg: 'var(--stage-2-bold)', color: 'var(--stage-2-text)' },
  event: { label: 'Event', bg: 'var(--stage-5-bold)', color: 'var(--stage-5-text)' },
  deadline: { label: 'Deadline', bg: 'var(--danger-bg)', color: 'var(--danger)' },
  notice: { label: 'Notice', bg: 'var(--border)', color: 'var(--ink-soft)' },
}

const KIND_OPTIONS = Object.entries(KIND_STYLE) as [string, { label: string; bg: string; color: string }][]
const WEEKDAYS = [
  { n: 1, label: 'Mon' }, { n: 2, label: 'Tue' }, { n: 3, label: 'Wed' }, { n: 4, label: 'Thu' },
  { n: 5, label: 'Fri' }, { n: 6, label: 'Sat' }, { n: 0, label: 'Sun' },
]
const WEEKDAY_NAME: Record<number, string> = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' }

// The routines parents forget the most, each a single tap that fills the
// name, picks a sensible day, and sets it to every week. The day is only a
// starting guess; the weekday picker below lets them change it.
const QUICK_ROUTINES: { label: string; emoji: string; kind: string; weekday: number }[] = [
  { label: 'PE kit', emoji: '👟', kind: 'kit', weekday: 4 },
  { label: 'Reading book', emoji: '📖', kind: 'homework', weekday: 5 },
  { label: 'Swimming kit', emoji: '🩱', kind: 'kit', weekday: 2 },
  { label: 'Spellings', emoji: '✏️', kind: 'homework', weekday: 1 },
  { label: 'Library books', emoji: '📚', kind: 'kit', weekday: 3 },
  { label: 'Show and tell', emoji: '🧸', kind: 'event', weekday: 5 },
]

type DueTone = 'overdue' | 'urgent' | 'today' | 'soon' | 'calm'

// The reminder escalates as it nears. A dated task is calm days out, turns
// to Today, and if a written time is set it goes red in the last hour and
// overdue once it passes. This drives both the words and the colour so the
// card gets louder exactly when it matters, never before.
// nowMs is passed in, not read from the clock, so the same value is used on
// the server render and the first client render (no hydration mismatch). It
// is null until the component mounts, and while null the minute level urgency
// is held back to a stable Today at HH:MM, then it escalates live once the
// client ticks the clock in.
function dueInfo(dueDate: string | null, dueTime: string | null | undefined, nowMs: number | null): { text: string; tone: DueTone } | null {
  if (!dueDate) return null
  const today = new Date(nowMs ?? Date.parse(`${dueDate}T00:00:00`)); today.setHours(0, 0, 0, 0)
  const dueDay = new Date(`${dueDate}T00:00:00`)
  if (Number.isNaN(dueDay.getTime())) return null
  const days = Math.round((dueDay.getTime() - today.getTime()) / 86400000)
  const timeStr = dueTime ? dueTime.slice(0, 5) : null

  if (days > 1) return { text: `By ${dueDay.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}${timeStr ? `, ${timeStr}` : ''}`, tone: 'calm' }
  if (days === 1) return { text: `Tomorrow${timeStr ? ` at ${timeStr}` : ''}`, tone: 'soon' }

  // Today or past. Minute level urgency only once mounted (nowMs set).
  if (timeStr && nowMs != null) {
    const dueAt = new Date(`${dueDate}T${dueTime!.length === 5 ? `${dueTime}:00` : dueTime}`)
    if (!Number.isNaN(dueAt.getTime())) {
      const mins = Math.round((dueAt.getTime() - nowMs) / 60000)
      if (mins < 0) return { text: `Overdue · was ${timeStr}`, tone: 'overdue' }
      if (mins <= 60) return { text: mins <= 1 ? `Now · ${timeStr}` : `In ${mins} min · ${timeStr}`, tone: 'urgent' }
      if (days < 0) return { text: `Overdue · was ${timeStr}`, tone: 'overdue' }
      return { text: `Today at ${timeStr}`, tone: 'today' }
    }
  }
  if (timeStr) return { text: `Today at ${timeStr}`, tone: 'today' }
  if (days < 0) return { text: 'Overdue', tone: 'overdue' }
  return { text: 'Today', tone: 'today' }
}

export default function SchoolActionsCard({ actions: initial, childName }: { actions: SchoolAction[]; childName?: string | null }) {
  const [actions, setActions] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('notice')
  const [repeats, setRepeats] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [weekday, setWeekday] = useState(4) // Thursday, PE kit is the classic case
  const [autoSend, setAutoSend] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  // Held null through the first render so server and client agree, then the
  // clock ticks in and the timed cards escalate on their own.
  const [nowMs, setNowMs] = useState<number | null>(null)
  useEffect(() => {
    setNowMs(Date.now())
    const t = setInterval(() => setNowMs(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  const recurring = actions.filter(a => a.recurs_weekday != null)
  const oneOff = actions.filter(a => a.recurs_weekday == null)

  const settle = async (id: string, status: 'done' | 'dismissed') => {
    setActions(a => a.filter(x => x.id !== id))
    try {
      await fetch('/api/school/actions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
    } catch { /* non blocking */ }
  }

  const addReminder = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/school/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(), kind,
          due_date: repeats ? null : (dueDate || null),
          due_time: repeats ? null : (dueDate && dueTime ? dueTime : null),
          recurs_weekday: repeats ? weekday : null,
          auto_send_to_child: repeats ? autoSend : false,
        }),
      })
      const data = await res.json()
      if (data.action) {
        setActions(a => [...a, data.action].sort((x, y) => (x.due_date ?? '9999').localeCompare(y.due_date ?? '9999')))
        setTitle('')
        setDueDate('')
        setDueTime('')
        setRepeats(false)
        setAutoSend(false)
        setShowAdd(false)
      }
    } catch { /* non blocking */ } finally { setSaving(false) }
  }

  const sendToChild = async (id: string) => {
    setSendingId(id)
    try {
      const res = await fetch('/api/school/actions/send-to-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.ok) {
        setActions(a => a.map(x => x.id === id ? { ...x, sent_to_child: true } : x))
      }
    } catch { /* non blocking */ } finally { setSendingId(null) }
  }

  const sendTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/school/remind/test', { method: 'POST' })
      const data = await res.json()
      if (data.sent > 0) {
        // Push is per device, so say plainly where it actually landed. If no
        // phone (Apple push) is subscribed, the ping went to another device
        // like the laptop you set it up on, and the phone in your hand needs
        // turning on before it will ever buzz.
        const where = (data.platforms ?? []).join(' and ')
        const landed = where ? `Sent to ${where}.` : 'Sent.'
        const childLine = data.childHasDevice ? ` ${childName ?? 'Your child'}'s phone got theirs too.` : ''
        const phoneHint = data.hasApple
          ? ''
          : ' If the phone in your hand stayed quiet, that phone is not turned on yet. Open this page on the phone itself, tap Turn on check ins, and on iPhone add it to your home screen first, then test again.'
        setTestResult(landed + childLine + phoneHint)
      } else if (data.reason) {
        setTestResult('No device is set up to get these yet. On the phone you want the reminders on, open this page, tap Turn on check ins, then test again. On iPhone, add the app to your home screen first, then turn them on.')
      } else {
        setTestResult(data.error ?? 'Something went wrong, try again.')
      }
    } catch {
      setTestResult('Could not reach the server, try again.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '16px', padding: '20px 22px', marginBottom: '20px',
    }}>
      {/* A calm pulse, only ever on the last hour and overdue cards, so the
          card gets your eye exactly when the time is close. */}
      <style>{`@keyframes gcSchoolPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(229,72,77,0.0) } 50% { box-shadow: 0 0 0 4px rgba(229,72,77,0.12) } }`}</style>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
          From school
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Things you need to know
        </div>
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          Kit days, payments and deadlines DiGi pulls from your forwarded school emails, plus anything you add. They show here every time you open the app, and as a reminder on your phone if notifications are on.
        </p>
      </div>
      {/* Actions row: wraps cleanly on a phone and a laptop. */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <button
          onClick={() => setShowAdd(v => !v)}
          style={{
            background: showAdd ? 'var(--cream)' : 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '100px', padding: '8px 16px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, color: 'var(--terracotta-dark)',
          }}
        >
          {showAdd ? 'Cancel' : '+ Add reminder'}
        </button>
        <button
          onClick={sendTest}
          disabled={testing}
          style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '100px',
            padding: '8px 16px', cursor: testing ? 'wait' : 'pointer',
            fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, color: 'var(--ink-soft)',
          }}
        >
          {testing ? 'Sending...' : 'Send a test'}
        </button>
      </div>
      {testResult && (
        <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '-8px 0 14px' }}>
          {testResult}
        </p>
      )}

      {showAdd && (
        <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '10px' }}>
            School does not email you, or this one is off your own radar? Add it here, it works exactly the same either way.
          </p>

          {/* One tap routines: the classics parents forget. Tapping fills the
              name and sets it to every week, so a PE kit reminder is two taps. */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '7px' }}>
              Quick add a weekly routine
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {QUICK_ROUTINES.map(r => (
                <button
                  key={r.label}
                  onClick={() => { setTitle(r.label); setKind(r.kind); setRepeats(true); setWeekday(r.weekday) }}
                  style={{
                    padding: '7px 12px', borderRadius: '100px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px',
                    background: title === r.label ? 'var(--terracotta)' : '#fff', color: 'var(--ink)',
                    border: title === r.label ? 'none' : '1.5px solid var(--border)',
                  }}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="PE kit, reading record due, swimming kit..."
            style={{
              width: '100%', padding: '11px 14px', borderRadius: '12px', marginBottom: '8px',
              border: '1.5px solid var(--border)', background: '#fff',
              fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', outline: 'none',
            }}
            maxLength={140}
          />

          {/* One time or every week */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {[['One time', false], ['Every week', true]].map(([label, val]) => (
              <button
                key={label as string}
                onClick={() => setRepeats(val as boolean)}
                style={{
                  padding: '8px 14px', borderRadius: '100px', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12.5px',
                  background: repeats === val ? 'var(--terracotta)' : '#fff',
                  color: 'var(--ink)', border: repeats === val ? 'none' : '1.5px solid var(--border)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {repeats ? (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {WEEKDAYS.map(d => (
                  <button
                    key={d.n}
                    onClick={() => setWeekday(d.n)}
                    style={{
                      padding: '7px 11px', borderRadius: '10px', cursor: 'pointer',
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px',
                      background: weekday === d.n ? 'var(--deep-teal)' : '#fff',
                      color: weekday === d.n ? '#fff' : 'var(--ink-soft)',
                      border: weekday === d.n ? 'none' : '1.5px solid var(--border)',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setAutoSend(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0, textAlign: 'left',
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '6px', flexShrink: 0,
                  background: autoSend ? 'var(--terracotta)' : '#fff',
                  border: autoSend ? 'none' : '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff',
                }}>
                  {autoSend ? '✓' : ''}
                </span>
                <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                  Also remind {childName ?? 'them'} automatically, every week
                </span>
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)' }}
                />
                <input
                  type="time"
                  value={dueTime}
                  onChange={e => setDueTime(e.target.value)}
                  disabled={!dueDate}
                  title="Optional. A time makes it go red as it nears, like a dentist at 09:00."
                  style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: dueDate ? '#fff' : 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', opacity: dueDate ? 1 : 0.5 }}
                />
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '6px 0 0' }}>
                Add a time for a set appointment (dentist, assembly). It turns red as it nears. Leave it off for a seen by today reminder.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={kind}
              onChange={e => setKind(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)' }}
            >
              {KIND_OPTIONS.map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
            </select>
            <button
              onClick={addReminder}
              disabled={saving || !title.trim()}
              style={{
                marginLeft: 'auto', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
                borderRadius: '10px', padding: '10px 18px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Weekly routines: permanent, never done or dismissed the way a one off is */}
      {recurring.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            Every week
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recurring.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '12px', background: 'var(--tint-sage)', border: '1px solid var(--border)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '3px 9px', flexShrink: 0,
                }}>
                  {WEEKDAY_NAME[a.recurs_weekday ?? 0]}
                </span>
                <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                  {a.title}
                </span>
                {a.auto_send_to_child && (
                  <span style={{ fontSize: '10.5px', color: 'var(--ink-soft)', flexShrink: 0 }}>
                    → {childName ?? 'them'} weekly
                  </span>
                )}
                <button
                  onClick={() => settle(a.id, 'dismissed')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--ink-muted)', flexShrink: 0 }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {oneOff.length === 0 ? (
        recurring.length === 0 && (
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            Nothing open right now. Forward a school email, or add a reminder by hand above.
          </p>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {oneOff.map(a => {
            const kindMeta = KIND_STYLE[a.kind] ?? KIND_STYLE.notice
            const due = dueInfo(a.due_date, a.due_time, nowMs)
            const hot = due?.tone === 'urgent' || due?.tone === 'overdue'
            const dueColor = due?.tone === 'overdue' || due?.tone === 'urgent' ? 'var(--danger)'
              : due?.tone === 'today' ? 'var(--terracotta-dark)' : 'var(--ink-muted)'
            return (
              <div key={a.id} style={{
                padding: '12px 14px', borderRadius: '12px',
                background: hot ? 'var(--danger-bg)' : 'var(--cream)',
                border: hot ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                animation: hot ? 'gcSchoolPulse 1.6s ease-in-out infinite' : undefined,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: kindMeta.bg, color: kindMeta.color,
                    padding: '2px 8px', borderRadius: '100px',
                  }}>
                    {kindMeta.label}
                  </span>
                  {due && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: dueColor,
                    }}>
                      {hot && <span style={{ width: 6, height: 6, borderRadius: '100px', background: 'var(--danger)', display: 'inline-block' }} />}
                      {due.text}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', marginBottom: a.detail ? '3px' : '8px' }}>
                  {a.title}
                </div>
                {a.detail && (
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '8px' }}>
                    {a.detail}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => settle(a.id, 'done')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)', padding: 0 }}
                  >
                    Got it, clear ✓
                  </button>
                  <button
                    onClick={() => settle(a.id, 'dismissed')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', padding: 0 }}
                  >
                    Dismiss
                  </button>
                  <a
                    href={`/api/school/${a.id}/ics`}
                    title="Add this to your phone calendar"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', textDecoration: 'none' }}
                  >
                    📅 Calendar
                  </a>
                  {a.sent_to_child ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', marginLeft: 'auto' }}>
                      Sent to {childName ?? 'them'} ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => sendToChild(a.id)}
                      disabled={sendingId === a.id}
                      style={{
                        marginLeft: 'auto', background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)',
                        borderRadius: '100px', padding: '5px 12px', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)',
                      }}
                    >
                      {sendingId === a.id ? 'Sending...' : `Send to ${childName ?? 'them'} ⭐`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
