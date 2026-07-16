'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The bell in the header: one red count for everything that has popped up,
// the school app pattern. Tapping opens the notifications hub. The red dot
// only shows when something actually needs the parent.

// Anything that clears a notification dispatches this so the bell re-counts
// straight away, instead of the red number sitting stale until a reload.
export const NOTIFS_CHANGED_EVENT = 'gc:notifs-changed'

export default function NotificationsBell() {
  const [count, setCount] = useState(0)
  const [urgent, setUrgent] = useState(0)

  useEffect(() => {
    let live = true
    const refresh = () => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(d => { if (live) { setCount(d.count ?? 0); setUrgent(d.urgentCount ?? 0) } })
        .catch(() => {})
    }
    refresh()
    // Re-count when a notification is cleared, when the tab comes back into
    // view, and on focus, so the number is never stale.
    const onVisible = () => { if (!document.hidden) refresh() }
    window.addEventListener(NOTIFS_CHANGED_EVENT, refresh)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      live = false
      window.removeEventListener(NOTIFS_CHANGED_EVENT, refresh)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={count > 0 ? `${count} notifications` : 'Notifications'}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '11px', textDecoration: 'none', color: 'var(--ink-soft)', fontSize: '18px' }}
    >
      🔔
      {count > 0 && (
        <span style={{
          position: 'absolute', top: 2, right: 0, minWidth: 17, height: 17, padding: '0 4px',
          borderRadius: '100px', background: urgent > 0 ? '#E5484D' : 'var(--ink-muted)', color: '#fff',
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, lineHeight: '17px',
          textAlign: 'center', boxShadow: '0 0 0 2px rgba(255,255,255,0.96)',
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
