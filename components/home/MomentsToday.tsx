'use client'

import { useState } from 'react'
import MomentTimeline from '@/components/daily/MomentTimeline'

// ── THE DAY ITSELF, ON THE PAGE PARENTS ACTUALLY OPEN ───────────────────────
//
// Justin, 13 August 2026: "moments and check in are two different things, and
// one feeds the other... the timeline is orphaned."
//
// He is right, and it was never lost, only one screen away. MomentTimeline was
// mounted in exactly one place, at the very END of the daily deck, plus a dev
// fixture. So a parent met the day timeline only after finishing the deck, on
// a page they visit occasionally, which is why it felt missing.
//
// ── WHAT THIS IS NOT ────────────────────────────────────────────────────────
//
// It is not a check in and it must never read like one. The two are separate
// halves of one chain and merging them was the mistake this fixes:
//
//   MOMENTS CREATE.  Tap a moment and /api/daily/feedback opens a concerns
//                    ledger row for it, or bumps one that already exists, or
//                    reopens one the family had resolved.
//   THE CHECK IN     scores those concerns in five words. It measures what
//   MEASURES.        the timeline created, and it cannot measure anything on
//                    a family that has never named a thing.
//   MOMENT CARDS     are the reply, what comes back once a moment is being
//   ANSWER.          worked on. Never the way one is added.
//
// So this asks what happened. It never asks how it is going.
//
// ── NOTHING HERE IS REDRAWN ─────────────────────────────────────────────────
//
// The tiles, the day groups, the spine, the tints and the selection animation
// are MomentTimeline's, untouched. This is the mount and the save, which is
// all that was missing. The save is the same POST the deck sends, so one
// endpoint keeps writing the ledger and the two surfaces cannot drift.

export default function MomentsToday({ savedToday = [] }: { savedToday?: string[] }) {
  const [selected, setSelected] = useState<string[]>(savedToday)
  // Saved already today, from the deck or from here. Either way the day has
  // been answered and the card should not ask twice.
  const [saved, setSaved] = useState(savedToday.length > 0)
  const [open, setOpen] = useState(false)

  function toggle(key: string) {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function save() {
    setSaved(true)
    setOpen(false)
    fetch('/api/daily/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moments: selected }),
    }).catch(() => { /* the day still reads as answered */ })
  }

  // Answered, so it collapses to one quiet line rather than a second ask.
  // Reopenable, because something else always happens after tea.
  if (saved && !open) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'var(--stage-2)', border: '1.5px solid var(--border)',
        borderRadius: '16px', padding: '13px 16px', marginBottom: '16px',
      }}>
        <span aria-hidden="true">✓</span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
          {selected.length > 0
            ? `${selected.length} moment${selected.length > 1 ? 's' : ''} noted today. We will bring the words for ${selected.length > 1 ? 'them' : 'it'}.`
            : 'Nothing flagged today.'}
        </span>
        <button
          onClick={() => setOpen(true)}
          style={{
            flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
          }}
        >
          Add more
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '20px', padding: '20px', marginBottom: '16px',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stage-2-text)', marginBottom: '8px' }}>
        What came up today?
      </div>
      {/* Says what a tap DOES, because the honest answer is the sell: this is
          how the app learns what to help with, and it is the only way a
          concern gets onto the list in the first place. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        Tap anything that was hard. Each one joins your list, and we bring you the words for it.
      </p>
      <div style={{ marginBottom: '16px' }}>
        <MomentTimeline selected={selected} onToggle={toggle} />
      </div>
      <button
        onClick={save}
        style={{
          width: '100%', padding: '13px',
          background: selected.length > 0 ? 'var(--terracotta)' : 'var(--cream)',
          border: selected.length > 0 ? 'none' : '1.5px solid var(--border)',
          borderRadius: '14px',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
          letterSpacing: '.08em', textTransform: 'uppercase',
          color: 'var(--ink)',
          boxShadow: selected.length > 0 ? '0 4px 0 var(--terracotta-dark)' : 'none',
          cursor: 'pointer',
        }}
      >
        {selected.length === 0 ? 'Nothing to flag today' : `Save ${selected.length} moment${selected.length > 1 ? 's' : ''}`}
      </button>
    </div>
  )
}
