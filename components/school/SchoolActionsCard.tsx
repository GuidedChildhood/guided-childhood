'use client'

import { useState } from 'react'

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

function dueLabel(dueDate: string | null): string | null {
  if (!dueDate) return null
  const due = new Date(`${dueDate}T00:00:00`)
  if (Number.isNaN(due.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round((due.getTime() - today.getTime()) / 86400000)
  if (days < 0) return 'Overdue'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `By ${due.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
}

export default function SchoolActionsCard({ actions: initial, childName }: { actions: SchoolAction[]; childName?: string | null }) {
  const [actions, setActions] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('notice')
  const [repeats, setRepeats] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [weekday, setWeekday] = useState(4) // Thursday, PE kit is the classic case
  const [autoSend, setAutoSend] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

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
          recurs_weekday: repeats ? weekday : null,
          auto_send_to_child: repeats ? autoSend : false,
        }),
      })
      const data = await res.json()
      if (data.action) {
        setActions(a => [...a, data.action].sort((x, y) => (x.due_date ?? '9999').localeCompare(y.due_date ?? '9999')))
        setTitle('')
        setDueDate('')
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
        setTestResult(
          data.childHasDevice
            ? `Sent. Check your phone, and ${childName ?? 'your child'}'s.`
            : 'Sent. It should reach your phone within seconds.'
        )
      } else if (data.reason) {
        setTestResult('Turn on notifications first. Open your home page, tap Turn on check ins, then come back and test again.')
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
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)' }}
              />
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
            const due = dueLabel(a.due_date)
            return (
              <div key={a.id} style={{
                padding: '12px 14px', borderRadius: '12px',
                background: 'var(--cream)', border: '1px solid var(--border)',
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
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                      color: due === 'Overdue' ? 'var(--danger)' : due === 'Today' ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
                    }}>
                      {due}
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
                    Done ✓
                  </button>
                  <button
                    onClick={() => settle(a.id, 'dismissed')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', padding: 0 }}
                  >
                    Dismiss
                  </button>
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
