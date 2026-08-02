'use client'

import { useState, type ReactNode } from 'react'

// A section of Home folded to one line that still carries its answer.
//
// Justin: Home has "lots of great information" and "all really good", but it is
// "a massive long scroll". Both halves of that are true at once, which is what
// makes it hard: there is no bad card to delete. The page height is simply the
// sum of everything that happens to be true about a family today, and on a busy
// day that is four or five screens.
//
// Mobbin first, per CLAUDE.md. The pattern is Slopes, which collapses whole
// sections to "Rode With · 0 people", "Places · 1 resort", "Time · 8hr
// recorded", and Formula 1, which does "Netherlands · Total: -13 pts". The
// thing worth stealing from both is not the chevron. It is that THE COLLAPSED
// ROW STILL SHOWS THE NUMBER. You lose the detail, never the answer. That is
// the difference between summarising a section and hiding one, and it is why
// this does not cost the parent any information.
//
// It is also already the house rule. decisions.md, 31 July: "collapse what is
// finished to a single tappable line that says what was finished, and open it
// again on a tap. Never vanish it, because disappearing entirely reads as lost
// rather than done." This is that rule applied to the page rather than to three
// cards.
//
// Deliberately NOT a sticky summary strip, which was the obvious third idea.
// Home had one, a row of jump chips, and it was removed on 28 July with the
// reasoning that stands: "A screen that needs a table of contents is too long."
// The fix for a long page is a short page, not a better index of it.

export default function FoldSection({
  label,
  value,
  count = 0,
  alert = false,
  open: openByDefault = false,
  children,
}: {
  /** What the section is. Short, it shares a line with the value. */
  label: string
  /** The answer, so the fold costs no information. "3 of 5 stamped". */
  value?: string
  /** A number worth a badge. Zero renders nothing. */
  count?: number
  /** Red badge rather than grey: something is waiting on the parent. */
  alert?: boolean
  /** Start open. For a section that still needs attention today. */
  open?: boolean
  children: ReactNode
}) {
  // Not remembered across loads, on purpose, and for the same reason the day
  // fold is not: the point of folding is that the next visit leads with what is
  // still open, and a preference that survives would quietly undo that.
  const [open, setOpen] = useState(openByDefault)

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16,
      marginBottom: 12, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          padding: '14px 16px',
        }}
      >
        <span style={{
          flex: 1, minWidth: 0,
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
          color: 'var(--ink)', lineHeight: 1.3,
        }}>
          {label}
        </span>

        {/* The answer, on the collapsed row. Without this the fold is just a
            door with no sign on it, and a parent has to open every one to find
            out whether anything happened. */}
        {value && (
          <span style={{
            flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            fontWeight: 700, color: 'var(--ink-soft)',
          }}>
            {value}
          </span>
        )}

        {count > 0 && (
          <span style={{
            flexShrink: 0, minWidth: 22, textAlign: 'center', padding: '2px 7px', borderRadius: 100,
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            background: alert ? '#E5484D' : 'var(--border)',
            color: alert ? '#fff' : 'var(--ink-soft)',
          }}>
            {count}
          </span>
        )}

        <span
          aria-hidden
          style={{
            flexShrink: 0, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s ease',
            lineHeight: 1,
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}
