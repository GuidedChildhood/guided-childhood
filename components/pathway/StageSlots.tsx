'use client'

import Link from 'next/link'
import type { ChecklistSection } from './PassportStamps'

// The five stamp slots on a passport page.
//
// Justin, 10 September 2026, with five photos of a real Kings Fitness and
// Leisure Junior Active Passport: make the stage pages "very easy to read",
// "simple", "seeing it fill up on passport", "super fun for kids view of it".
//
// ── WHY SLOTS AND NOT A CHECKLIST ───────────────────────────────────────────
//
// The same five things were a list of five link rows, each with a tick box, a
// label, a percentage and, on the next open one, two lines of help. Everything
// a parent needed was in it and none of it looked like a passport. A list gets
// longer as you do it; a passport gets fuller.
//
// The move comes from Me+, whose unearned badges are drawn as embossed ghosts
// at full size in the exact slot they will fill. You can see the shape of the
// whole set on day one. That is the difference between something that GROWS and
// something that FILLS, and filling is what Justin asked for. Withings lays
// them out as a collection rather than a list, and Skillshare puts a progress
// reading on a badge that is still locked, which is what stops a ghost being a
// flat no.
//
// So all five are always drawn, always in the same order, always the same size.
// An empty stage shows five ghosts, which says what this stage is going to ask
// of you before you have done any of it. A stamped stage shows five solid
// marks in its own ink.
//
// ── THE TWO THAT NEVER TICK OFF ─────────────────────────────────────────────
//
// Jobs and screen balance are judged across the whole stage: they go green by
// keeping something up, and they can go amber again. That has always been in
// the data as `ongoing` and it only ever appeared as a chip of words on one
// row. Here it is a different MARK: a ring rather than a filled stamp. A
// parent scanning the five can see at a glance which two are habits and which
// three are jobs that finish, without reading anything.

const R = 20
const C = 2 * Math.PI * R

// One word under each slot. The full labels ("Moments to resolve", "Jobs and
// routines") are right in a list and impossible across five columns on a 340
// wide page: five wrapped two line labels is the wall the slots exist to
// avoid. The full label is still what the open row underneath says.
const SHORT: Record<string, string> = {
  devices: 'Devices',
  moments: 'Moments',
  lessons: 'Lessons',
  jobs: 'Jobs',
  balance: 'Balance',
}

export default function StageSlots({
  sections,
  ink,
  tint,
  interactive = true,
}: {
  sections: ChecklistSection[]
  /** The stage's own text colour. Every mark on the page is pressed in it. */
  ink: string
  /** The stage's own pastel, which is what a filled slot is filled with. */
  tint: string
  /**
   * Links out, or just a picture?
   *
   * The child's read only view of the book renders the same five slots and must
   * not offer a tap through to the parent's device setup page. Off, the slots
   * are spans and nothing navigates.
   */
  interactive?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
      {sections.map(sec => {
        const done = sec.pct >= 100
        const ongoing = !!sec.ongoing
        // A ghost with nothing behind it sits quieter than one already moving,
        // so a stage with three things started does not read the same as a
        // stage nobody has touched.
        const started = sec.pct > 0 && !done
        const inner = (
          <>
            <span style={{ position: 'relative', width: 48, height: 48, display: 'block', margin: '0 auto' }}>
              {/* The mark itself. Filled for a job that finishes, a ring for a
                  habit that is kept up, a dashed ghost for anything not there
                  yet. */}
              <span
                aria-hidden
                style={{
                  position: 'absolute', inset: 3, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 19, lineHeight: 1,
                  background: done && !ongoing ? tint : '#fff',
                  border: done ? `2.5px solid ${ink}` : `2px dashed ${ink}`,
                  // A DOUBLE RING for a habit that is being kept up.
                  //
                  // The first version filled a finished slot with the stage
                  // pastel and gave an ongoing one an inset ring in the same
                  // pastel. On stage 2, whose tint is very nearly white, that
                  // made all five marks identical: filled, unfilled and habit
                  // all read as a white circle with a dark edge. The ring is in
                  // the stage INK now, with a white gap inside the border, so
                  // it reads as a ring at a glance on all five pages.
                  boxShadow: done && ongoing ? `inset 0 0 0 2px #fff, inset 0 0 0 4px ${ink}` : 'none',
                  opacity: done ? 1 : started ? 0.55 : 0.3,
                  transform: done && !ongoing ? 'rotate(-8deg)' : 'none',
                  transition: 'opacity 0.4s ease',
                }}
              >
                {sec.emoji}
              </span>
              {/* The tick, on a job that FINISHES. Its absence is what says
                  the two habit slots are a different kind of thing, alongside
                  the ring. Two signals rather than one, because on a pale stage
                  the fill alone carried none. */}
              {done && !ongoing && (
                <span aria-hidden style={{
                  position: 'absolute', right: 0, bottom: 2, width: 16, height: 16, borderRadius: '50%',
                  background: ink, border: '1.5px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                </span>
              )}
              {/* Skillshare's idea: a slot that is not earned still says how
                  close it is. Without it a ghost is a flat no, and four of the
                  five rows spend most of a stage part way. */}
              {started && (
                <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="24" cy="24" r={R} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C - (C * Math.min(100, sec.pct)) / 100}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                </svg>
              )}
            </span>
            <span style={{
              display: 'block', textAlign: 'center', marginTop: 5,
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: ink, opacity: done ? 1 : 0.78, lineHeight: 1.2,
            }}>
              {SHORT[sec.key] ?? sec.label}
            </span>
          </>
        )
        const common = { flex: '1 1 0', minWidth: 0, textDecoration: 'none' } as const
        const label = done
          ? `${sec.label}, ${ongoing ? 'being kept up' : 'done'}`
          : `${sec.label}, ${sec.detail}`
        return interactive ? (
          <Link key={sec.key} href={sec.href} aria-label={label} style={common}>{inner}</Link>
        ) : (
          <span key={sec.key} role="img" aria-label={label} style={{ ...common, display: 'block' }}>{inner}</span>
        )
      })}
    </div>
  )
}
