'use client'

import Link from 'next/link'
import { playKidSound } from '@/lib/sound/kidSounds'

// The screen only chrome above the child's star chart: the way back, the
// print button, and one line saying how the paper week works. Everything
// here hides on print, so what comes out of the printer is only the sheet.
//
// The print is in place (window.print on this page), never a popup: the
// image printer helper in lib/kid/print-sheet cannot carry an HTML table,
// and a popup can be blocked, which on a child's locked down phone it often
// is. Printing the page they are already on has nothing to block.

export default function KidChartToolbar({ token, weekStart, hasJobs }: {
  token: string
  weekStart: string
  hasJobs: boolean
}) {
  return (
    <div className="no-print" style={{ marginBottom: 16 }}>
      <style>{`@media print { .no-print, header, .bottom-tab-bar { display: none !important; } }`}</style>

      <Link
        href={`/k/${token}?tab=print`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.04em',
          color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: 14,
        }}
      >
        ← My quests
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 7vw, 2rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 6px', color: 'var(--ink)' }}>
        My star chart
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px', maxWidth: 560 }}>
        {hasJobs
          ? 'Print it for the fridge and do your jobs on paper all week. At the end of the week your grown up puts your stars in the app and they land in your bank.'
          : 'No jobs on your board yet, so the rows print blank. Write them on with a pen, or ask your grown up to add them in the app, then print again.'}
      </p>

      <button
        // Record the print, then print. Fire and forget, never awaited: the
        // chart has to open the dialog whether or not the write lands, the
        // same promise the parent's builder keeps.
        onClick={() => {
          playKidSound('tap')
          fetch('/api/kid/star-chart-print', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, weekStart }),
          }).catch(() => { /* the chart still prints */ })
          window.print()
        }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', cursor: 'pointer', padding: '15px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          color: 'var(--ink)', background: 'var(--terracotta)',
          border: 'none', borderRadius: 16,
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        🖨️ Print my chart and the gold stars
      </button>
    </div>
  )
}
