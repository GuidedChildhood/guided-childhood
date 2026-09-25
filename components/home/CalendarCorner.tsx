'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'

// ── THE CALENDAR IN THE CORNER (25 September 2026) ─────────────────────────
//
// Justin, pointing at the top left of Home: "calendar should show on parents
// app top left corner here with notifications as this is important tasks, as
// well as link to set up school email, photo system."
//
// Two plates in front of the children's, drawn the same size and shape so the
// row reads as one thing:
//
//   Calendar  the school page, which is the calendar (every dated thing from a
//             forwarded email, a photographed letter or one typed in) AND the
//             place both are set up. The count is what is due this week.
//   Alerts    the notifications hub, with its count. Phones only: on a wide
//             screen the same bell already sits in the header, and two bells
//             on one page is one too many.

const PLATE: React.CSSProperties = {
  position: 'relative', flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
  background: '#fff', border: 'var(--edge)', boxShadow: '0 2px 0 var(--ink)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)',
  lineHeight: 1.15, color: 'var(--ink-muted)', textAlign: 'center',
}

function Count({ n, label }: { n: number; label: string }) {
  if (n <= 0) return null
  return (
    <span aria-label={label} style={{
      position: 'absolute', top: -6, right: -8, minWidth: 22, height: 22, padding: '0 5px', boxSizing: 'border-box',
      borderRadius: 11, background: 'var(--terracotta)', border: 'var(--edge)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xs)', color: 'var(--ink)',
    }}>{n > 9 ? '9+' : n}</span>
  )
}

export default function CalendarCorner({ dueThisWeek, hasSchoolSetup }: { dueThisWeek: number; hasSchoolSetup: boolean }) {
  const [alerts, setAlerts] = useState(0)

  useEffect(() => {
    let live = true
    const refresh = () => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(d => { if (live) setAlerts(d.count ?? 0) })
        .catch(() => {})
    }
    refresh()
    window.addEventListener(NOTIFS_CHANGED_EVENT, refresh)
    return () => { live = false; window.removeEventListener(NOTIFS_CHANGED_EVENT, refresh) }
  }, [])

  return (
    <div data-calendar-corner style={{ display: 'flex', gap: 2, flexShrink: 0, marginBottom: 12 }}>
      <Link
        href="/dashboard/school"
        aria-label={hasSchoolSetup ? `School calendar, ${dueThisWeek} due this week` : 'School calendar: set up school emails and letters'}
        style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 56, padding: '4px 2px 2px', textDecoration: 'none', borderRadius: 16 }}
      >
        <span aria-hidden style={PLATE}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="var(--terracotta-lt)" stroke="var(--ink)" strokeWidth="1.8" />
            <path d="M3.5 9.5h17" stroke="var(--ink)" strokeWidth="1.8" />
            <path d="M8 3v4M16 3v4" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="8.5" cy="13.5" r="1.2" fill="var(--ink)" /><circle cx="12" cy="13.5" r="1.2" fill="var(--ink)" /><circle cx="15.5" cy="13.5" r="1.2" fill="var(--ink)" />
          </svg>
          <Count n={dueThisWeek} label={`${dueThisWeek} due this week`} />
          {!hasSchoolSetup && (
            <span aria-hidden style={{
              position: 'absolute', top: -6, right: -8, width: 22, height: 22, borderRadius: 11,
              background: 'var(--terracotta)', border: 'var(--edge)', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)',
            }}>+</span>
          )}
        </span>
        <span style={LABEL}>Calendar</span>
        <span aria-hidden style={{ width: 22, height: 3, marginTop: -3 }} />
      </Link>

      <Link
        href="/dashboard/notifications"
        className="calendar-corner-bell"
        aria-label={alerts > 0 ? `Alerts, ${alerts} waiting` : 'Alerts'}
        style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 56, padding: '4px 2px 2px', textDecoration: 'none', borderRadius: 16 }}
      >
        <span aria-hidden style={PLATE}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" fill="var(--butter-lt)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M10 19.5a2 2 0 0 0 4 0" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <Count n={alerts} label={`${alerts} alerts waiting`} />
        </span>
        <span style={LABEL}>Alerts</span>
        <span aria-hidden style={{ width: 22, height: 3, marginTop: -3 }} />
      </Link>
      <style>{`@media (min-width: 768px) { .calendar-corner-bell { display: none !important; } }`}</style>
    </div>
  )
}
