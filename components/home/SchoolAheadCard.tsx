'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// What is coming at school, four to six weeks out.
//
// The whole value is the lead time. A parent told about the tables check in the
// week of the tables check has been handed a worry. The same parent told six
// weeks out has been handed a head start, and six weeks is enough for the one
// thing on the card to actually work.
//
// One event, never a list. A card showing everything coming up this term is a
// term's worth of anxiety delivered in one go, and a parent reads none of it.
//
// Nothing here is about their child. It is what the year covers and when the
// country checks it, which is the same for every family in England. That is
// exactly why we can say it without an assessment, and why it can never sound
// like a verdict.

export type SchoolAhead = {
  eventKey: string
  title: string
  what: string
  doThis: string
  when: string
  ask: string
  // The academic year this instance belongs to, so a dismissal lasts for this
  // June and not for every June the child is ever in this school.
  academicYear: number
  thisWeek: boolean
}

export default function SchoolAheadCard({ ahead }: { ahead: SchoolAhead }) {
  // Dismissal is per event per year, on this device. It is a display
  // preference, so it stays out of the database, and the year in the key means
  // next year's tables check is a new card rather than a silenced one.
  const key = `gc-school-ahead-${ahead.eventKey}-${ahead.academicYear}`
  const [hidden, setHidden] = useState(true)
  useEffect(() => {
    try { setHidden(window.localStorage.getItem(key) === '1') } catch { setHidden(false) }
  }, [key])
  if (hidden) return null

  function dismiss() {
    try { window.localStorage.setItem(key, '1') } catch { /* private mode, back next load */ }
    setHidden(true)
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
      padding: '18px 20px', marginBottom: 18, position: 'relative',
      boxShadow: '0 2px 10px rgba(26,26,46,0.04)',
    }}>
      <button
        onClick={dismiss}
        aria-label="Not now"
        style={{
          position: 'absolute', top: 12, right: 12, width: 30, height: 30,
          borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--cream)',
          color: 'var(--ink-muted)', fontSize: 'var(--text-base)', lineHeight: 1, cursor: 'pointer',
        }}
      >
        ×
      </button>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 5, paddingRight: 34 }}>
        {ahead.thisWeek ? 'At school this week' : `Coming ${ahead.when}`}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.015em', marginBottom: 8, paddingRight: 34 }}>
        {ahead.title}
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
        {ahead.what}
      </p>

      {/* One thing, and only one. The card earns its place by being actionable
          rather than informative, and a second suggestion halves the odds of
          the first one happening. */}
      <div style={{ background: 'var(--tint-sage)', borderRadius: 14, padding: '11px 13px', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
          Worth doing
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
          {ahead.doThis}
        </p>
      </div>

      <Link
        href={`/dashboard/digi?q=${encodeURIComponent(ahead.ask)}`}
        style={{
          display: 'inline-flex', padding: '11px 17px', textDecoration: 'none',
          background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14,
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
          boxShadow: '0 3px 0 var(--terracotta-dark)',
        }}
      >
        Ask DiGi about it
      </Link>
    </div>
  )
}
