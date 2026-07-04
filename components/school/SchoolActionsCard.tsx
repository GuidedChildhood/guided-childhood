'use client'

import { useState } from 'react'

// Things you need to know: the open school_actions DiGi extracted from
// forwarded school emails. Server rendered data comes in as props; done and
// dismiss post to /api/school/actions and update optimistically.

export type SchoolAction = {
  id: string
  kind: string
  title: string
  detail: string | null
  due_date: string | null
}

const KIND_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  kit: { label: 'Kit', bg: 'var(--stage-1-bold)', color: 'var(--stage-1-text)' },
  payment: { label: 'Payment', bg: 'var(--stage-3-bold)', color: 'var(--stage-3-text)' },
  homework: { label: 'Homework', bg: 'var(--stage-2-bold)', color: 'var(--stage-2-text)' },
  event: { label: 'Event', bg: 'var(--stage-5-bold)', color: 'var(--stage-5-text)' },
  deadline: { label: 'Deadline', bg: 'var(--danger-bg)', color: 'var(--danger)' },
  notice: { label: 'Notice', bg: 'var(--border)', color: 'var(--ink-soft)' },
}

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

export default function SchoolActionsCard({ actions: initial }: { actions: SchoolAction[] }) {
  const [actions, setActions] = useState(initial)

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

  if (actions.length === 0) return null

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '16px', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
        From school
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '14px' }}>
        Things you need to know
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {actions.map(a => {
          const kind = KIND_STYLE[a.kind] ?? KIND_STYLE.notice
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
                  background: kind.bg, color: kind.color,
                  padding: '2px 8px', borderRadius: '100px',
                }}>
                  {kind.label}
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
              <div style={{ display: 'flex', gap: '14px' }}>
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
