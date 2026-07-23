'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// The reward moment. A child kept every job on time for five days running, so
// here is the parent's one warm tap to mark it: a bit of device time straight
// into their bank, or a printable or a lesson to send. Sending clears it from
// the queue and the child hears the good news on their own app. This is the
// tangible end of the streak the passport has already stamped.

export interface StreakReward {
  id: string
  childName: string
  streakDays: number
}

const REWARDS = [
  { kind: 'device_time', emoji: '⏱️', label: 'Device time', sub: 'Bonus stars to spend', go: null },
  { kind: 'printable', emoji: '🖨️', label: 'A printable', sub: 'Choose one to send', go: '/dashboard/printables' },
  { kind: 'lesson', emoji: '📚', label: 'A lesson', sub: 'Pick one together', go: '/dashboard/lessons' },
] as const

export default function StreakRewards({ streaks }: { streaks: StreakReward[] }) {
  const router = useRouter()
  const [queue, setQueue] = useState<StreakReward[]>(streaks)
  const [busy, setBusy] = useState<string | null>(null)

  if (queue.length === 0) return null

  async function send(streak: StreakReward, kind: string, go: string | null) {
    if (busy) return
    setBusy(streak.id)
    try {
      await fetch('/api/quests/streak-reward', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streak_id: streak.id, kind }),
      })
    } catch { /* the streak stays in the queue to try again */ }
    setBusy(null)
    setQueue(q => q.filter(s => s.id !== streak.id))
    // A printable or a lesson is chosen on its own page; device time is done.
    if (go) router.push(go)
    else router.refresh()
  }

  return (
    <div style={{ marginBottom: '18px' }}>
      {queue.map(streak => (
        <div key={streak.id} style={{
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '18px', padding: '17px 18px', marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '12px' }}>
            <span aria-hidden style={{ width: 46, height: 46, borderRadius: '13px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🌟</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
                Streak complete
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', lineHeight: 1.15 }}>
                {streak.childName} kept a {streak.streakDays} day jobs streak
              </span>
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 13px' }}>
            Every job done on time for {streak.streakDays} days running. It is already stamped on their passport. Send a little reward to mark it.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '9px' }}>
            {REWARDS.map(r => (
              <button
                key={r.kind}
                onClick={() => send(streak, r.kind, r.go)}
                disabled={busy === streak.id}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px',
                  padding: '12px 8px', cursor: busy === streak.id ? 'default' : 'pointer',
                  boxShadow: '0 3px 0 rgba(26,26,46,0.10)', opacity: busy === streak.id ? 0.6 : 1,
                  textAlign: 'center',
                }}
              >
                <span aria-hidden style={{ fontSize: '1.4rem', lineHeight: 1 }}>{r.emoji}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.15 }}>{r.label}</span>
                <span style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.3 }}>{r.sub}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
