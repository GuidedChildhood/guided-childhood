'use client'

import { useEffect } from 'react'

// The badge count on the Home Screen icon itself, the "something is
// waiting, no need to even open it" signal Duolingo and every proper
// chat app use. Counts quests a kid has ticked and is waiting on
// approval, the single most concrete "come back" reason a parent has.
// Feature detected: silently does nothing where the Badging API is not
// supported (most desktop browsers not installed as an app, some
// Android browsers), never an error either way.

export default function AppBadge() {
  useEffect(() => {
    if (!('setAppBadge' in navigator)) return

    let cancelled = false
    async function updateBadge() {
      try {
        const res = await fetch('/api/quests')
        if (!res.ok) return
        const data = await res.json()
        const pending = (data.ticks ?? []).filter((t: { status: string }) => t.status === 'pending').length
        if (cancelled) return
        if (pending > 0) await (navigator as unknown as { setAppBadge: (n: number) => Promise<void> }).setAppBadge(pending)
        else await (navigator as unknown as { clearAppBadge: () => Promise<void> }).clearAppBadge()
      } catch { /* best effort, never blocks the app */ }
    }

    updateBadge()
    document.addEventListener('visibilitychange', () => { if (!document.hidden) updateBadge() })
    return () => { cancelled = true }
  }, [])

  return null
}
