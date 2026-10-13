'use client'

import { useEffect, useState } from 'react'

// "Teo read it ✓" beside a Remind (13 October 2026).
//
// Justin approved the parent side of the child's home: a reminder used to end
// at "Nudged.", a tap into silence. The child's home marks a nudge seen when
// they tap it away or tick the job it was about (app/api/kid/nudges,
// app/api/quests/tick), so the parent can be told. This reads the latest one
// from the last day (GET /api/quests/nudge) and, while it is unread, looks
// again every twenty seconds for up to ten minutes, the span in which a
// parent is likely still on the page. Nothing sent, nothing drawn.

export default function NudgeReceipt({ childId, name, questId, sentAt }: {
  childId: string
  name: string
  questId?: string
  /** Bumped when this screen sends one, so the receipt reads it at once. */
  sentAt?: number
}) {
  const [nudge, setNudge] = useState<{ seen: boolean; at: string } | null>(null)

  useEffect(() => {
    let live = true
    let tries = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    const look = async () => {
      try {
        const qs = new URLSearchParams({ childId, ...(questId ? { questId } : {}) })
        const res = await fetch(`/api/quests/nudge?${qs}`)
        if (!res.ok || !live) return
        const d = await res.json() as { nudge: { seen: boolean; at: string } | null }
        setNudge(d.nudge)
        if (d.nudge && !d.nudge.seen && tries++ < 30) timer = setTimeout(look, 20000)
      } catch { /* the receipt is a nicety, never an error */ }
    }
    look()
    return () => { live = false; if (timer) clearTimeout(timer) }
  }, [childId, questId, sentAt])

  if (!nudge) return null
  const time = new Date(nudge.at).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })
  return (
    <span
      data-nudge-receipt={nudge.seen ? 'read' : 'sent'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em',
        color: nudge.seen ? 'var(--retro-green-dark, #2E7D5B)' : 'var(--ink-muted)',
      }}
    >
      {nudge.seen ? `${name} read it ✓` : `Sent ${time}, not read yet`}
    </span>
  )
}
