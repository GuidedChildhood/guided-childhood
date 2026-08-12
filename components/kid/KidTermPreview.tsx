'use client'

import { useState } from 'react'
import type { TermPreview } from '@/lib/learning/term-preview'

// What is coming at school, on the child's own week.
//
// Justin, 10 August 2026: "could we add a diary entry to give a preview note for
// term what's coming up and what the child could be learning?"
//
// The same three subjects the parent's card shows, in the child's register. It
// sits at the top of their week rather than inside a day, because it is not a
// thing happening on a date: it is the shape of the next few months, and putting
// it on a Tuesday would be a lie about when it starts.
//
// ── Behind a door, not on the table ──────────────────────────────────────────
//
// Justin, 12 August 2026, with the full card filling Teo's screen above the
// week itself: "This should all hide behind a button saying want to see what
// next term covers? Not prominent." The week page's job is this week; a
// syllabus is the thing a child occasionally wonders about, not the thing
// they came for. So the card starts as one slim line and opens on a tap.
// When it appears at all is already gated tight in buildTermPreview: only
// around a term boundary, only with a birthday to pin the year group.
//
// ── Not a job, and not a warning ─────────────────────────────────────────────
//
// Nothing to tick, nothing to do, no stars. A child who is told what is coming
// is being let in on it, not set homework about it, and the moment this grows a
// tick box it becomes another thing they are behind on during their holiday.
//
// It also says nothing about how they are doing. We hold no performance data on
// any child, and a preview is exactly where a product would be tempted to imply
// some.

export default function KidTermPreview({
  preview,
  childName,
}: {
  preview: TermPreview
  childName?: string | null
}) {
  const [open, setOpen] = useState(false)
  const name = childName && childName !== 'Your child' ? childName : null

  // The slim door, the same shape as the empty diary's: a line, not a card.
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
          background: '#fff', border: '1.5px solid rgba(26,26,46,0.10)', borderRadius: 16,
          boxShadow: '0 3px 0 rgba(26,26,46,0.08)', padding: '11px 14px', marginBottom: 16,
          cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}
      >
        <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1 }}>🔭</span>
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
          Want to see what {preview.inHoliday ? 'next term' : 'this term'} covers?
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>→</span>
      </button>
    )
  }

  return (
    <section style={{
      background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 20,
      padding: '16px 18px', marginBottom: 16, boxShadow: '0 4px 0 rgba(26,26,46,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            marginBottom: 4,
          }}>
            {preview.inHoliday ? 'When you go back' : 'This term'}
          </div>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
            color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.2,
          }}>
            Some of what is coming up 🔭
          </p>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close" style={{
          width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'var(--cream)',
          cursor: 'pointer', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', flexShrink: 0,
        }}>✕</button>
      </div>

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
        You will meet all of this{name ? `, ${name}` : ''}. Nobody expects you to know it yet.
      </p>

      {/* The same caveat as the parent's card, in the child's register. A child
          who is told "you will do fractions in the spring" and then does not is
          being told the app was wrong, and the app was not: their school simply
          ordered the year differently, which schools are entitled to do. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
        Every school does these in its own order, so yours might do them at a different time.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {preview.subjects.map(s => (
          <div key={s.label} style={{
            background: 'var(--cream)', borderRadius: 14, padding: '11px 13px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              color: 'var(--ink)', lineHeight: 1.25,
            }}>
              {s.label}
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
              {s.line}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
