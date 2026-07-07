'use client'

import { useState } from 'react'

// Things you need to know: the open school_actions DiGi extracted from
// forwarded school emails, plus anything the parent typed in by hand
// for the school that never emails. Done and dismiss post to
// /api/school/actions, adding posts there too, and Send sends the item
// straight to the child's own quest page so packing the kit becomes
// their job, not just something the parent remembers alone.

export type SchoolAction = {
  id: string
  kind: string
  title: string
  detail: string | null
  due_date: string | null
  sent_to_child?: boolean
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
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)

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
        body: JSON.stringify({ title: title.trim(), kind, due_date: dueDate || null }),
      })
      const data = await res.json()
      if (data.action) {
        setActions(a => [...a, data.action].sort((x, y) => (x.due_date ?? '9999').localeCompare(y.due_date ?? '9999')))
        setTitle('')
        setDueDate('')
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

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '16px', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          From school
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}
        >
          {showAdd ? 'Cancel' : '+ Add a reminder'}
        </button>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
        Things you need to know
      </div>

      {showAdd && (
        <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '10px' }}>
            School does not email you, or this one is off your own radar? Add it here, it works exactly the same either way.
          </p>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Reading record due, non uniform day, swimming kit..."
            style={{
              width: '100%', padding: '11px 14px', borderRadius: '12px', marginBottom: '8px',
              border: '1.5px solid var(--border)', background: '#fff',
              fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', outline: 'none',
            }}
            maxLength={140}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={kind}
              onChange={e => setKind(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)' }}
            >
              {KIND_OPTIONS.map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)' }}
            />
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

      {actions.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
          Nothing open right now. Forward a school email, or add a reminder by hand above.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {actions.map(a => {
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
