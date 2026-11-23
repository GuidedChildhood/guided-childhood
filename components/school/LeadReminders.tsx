'use client'

import { useState } from 'react'
import { LEAD_KINDS, LEAD_CHOICES, leadDays, daysBetween } from '@/lib/school/lead-up'

// The early reminder chips under a homework or deadline item, the way Apple
// Reminders offers "Early reminder" beside the due date.
//
// Justin, 19 November 2026, after snapping the Anderson shelter project, due
// 1 December: "offer reminders leading up to the date required ... easily
// demonstrated in best Apple UX". Three chips and nothing to set up: the plan
// is already chosen from how far away the date is (lib/school/lead-up.ts), so
// most parents only glance at it. The night before is always on and shown
// as a plain line, because it is the one reminder nobody should be able to
// lose, so it is not offered as a switch. A chip
// for a day already passed is not offered.

type Item = { id: string; kind: string; due_date: string | null; created_at?: string | null; remind_days?: number[] | null; remind_ready?: boolean }

const LABEL: Record<number, string> = { 7: 'A week', 3: '3 days' }

export default function LeadReminders({ item, todayIso }: { item: Item; todayIso: string }) {
  const [chosen, setChosen] = useState<number[]>(() => leadDays(item, todayIso))
  const [note, setNote] = useState<string | null>(null)
  if (!LEAD_KINDS.has(item.kind) || !item.due_date || !todayIso) return null
  const left = daysBetween(todayIso, item.due_date)
  if (left < 2) return null
  const offered = LEAD_CHOICES.filter(d => left > d)

  const toggle = async (d: number) => {
    const before = chosen
    const next = chosen.includes(d) ? chosen.filter(x => x !== d) : [...chosen, d].sort((a, b) => b - a)
    setChosen(next)
    setNote(null)
    try {
      const res = await fetch('/api/school/actions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, remind_days: next }),
      })
      if (!res.ok) { setChosen(before); setNote('Choosing these is switched on very soon. The plan shown still runs.') }
    } catch { setChosen(before); setNote('That did not save. Try again in a moment.') }
  }

  const chip = (on: boolean): React.CSSProperties => ({
    minHeight: 44, display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '0 12px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)',
    border: 'var(--edge)',
    background: on ? 'var(--butter)' : 'var(--white)',
    color: on ? 'var(--ink)' : 'var(--ink-soft)',
    boxShadow: on ? 'var(--lift)' : 'none',
  })

  return (
    <div style={{ margin: '2px 0 10px' }} aria-label="Reminders">
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Remind me before
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {offered.map(d => {
          const on = chosen.includes(d)
          return (
            <button key={d} type="button" aria-pressed={on} onClick={() => toggle(d)} style={chip(on)}>
              <span aria-hidden>{on ? '✓' : '+'}</span>{LABEL[d]}
            </button>
          )
        })}
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '6px 0 0' }}>
        {offered.length ? 'And always at 4pm the day before.' : 'We remind you at 4pm the day before.'}
      </p>
      {note && <p role="status" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '6px 0 0' }}>{note}</p>}
    </div>
  )
}
