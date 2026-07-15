'use client'

import { useEffect } from 'react'

// The badge count on the Home Screen icon itself, the "something is
// waiting, no need to even open it" signal Duolingo and every proper
// chat app use. Counts quests a kid has ticked and is waiting on
// approval, plus school reminders that have reached their day (due today
// or overdue), so a dentist at nine or a kit for this morning puts the
// red number on the icon exactly when it matters. Feature detected:
// silently does nothing where the Badging API is not supported (most
// desktop browsers not installed as an app, some Android browsers),
// never an error either way.

export default function AppBadge() {
  useEffect(() => {
    if (!('setAppBadge' in navigator)) return

    let cancelled = false
    async function updateBadge() {
      try {
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const [questsRes, schoolRes] = await Promise.all([
          fetch('/api/quests'),
          fetch('/api/school/actions'),
        ])
        let count = 0
        if (questsRes.ok) {
          const data = await questsRes.json()
          count += (data.ticks ?? []).filter((t: { status: string }) => t.status === 'pending').length
        }
        if (schoolRes.ok) {
          const data = await schoolRes.json()
          // One off actions that have reached their day. Weekly routines and
          // undated notices never badge, they are not time critical.
          count += (data.actions ?? []).filter((a: { due_date: string | null; recurs_weekday?: number | null }) => {
            if (a.recurs_weekday != null || !a.due_date) return false
            const due = new Date(`${a.due_date}T00:00:00`)
            return !Number.isNaN(due.getTime()) && due.getTime() <= today.getTime()
          }).length
        }
        if (cancelled) return
        if (count > 0) await (navigator as unknown as { setAppBadge: (n: number) => Promise<void> }).setAppBadge(count)
        else await (navigator as unknown as { clearAppBadge: () => Promise<void> }).clearAppBadge()
      } catch { /* best effort, never blocks the app */ }
    }

    updateBadge()
    document.addEventListener('visibilitychange', () => { if (!document.hidden) updateBadge() })
    return () => { cancelled = true }
  }, [])

  return null
}
