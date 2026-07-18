'use client'

import { useEffect, useState } from 'react'
import { questDueToday } from '@/lib/quests/due'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The glanceable stat row at the top of Home: streak, stars in the bank, and
// today's quests at a glance. The streak comes from the server (already
// computed there); the bank and today's progress come from the same quests
// feed the board uses, so the three numbers agree with the rest of the page.
// Renders just the streak on its own until a child and quests exist.

type Quest = { id: string; schedule: string; schedule_days?: number[] | null; child_id: string | null }
type Tick = { quest_id: string; child_id: string | null; tick_date: string; status: string }
type Bank = { child_id: string; balance: number }

function Tile({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '13px 12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(26,26,46,0.04)' }}>
      <div style={{ fontSize: '1.1rem', lineHeight: 1, marginBottom: '5px' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.35rem', color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '3px' }}>{label}</div>
    </div>
  )
}

export default function HomeStats({ streakCount, streakTotal = 0 }: { streakCount: number; streakTotal?: number }) {
  const [bankStars, setBankStars] = useState<number | null>(null)
  const [today, setToday] = useState<{ done: number; total: number } | null>(null)

  useEffect(() => {
    let live = true
    fetch('/api/quests')
      .then(r => r.json())
      .then(data => {
        if (!live) return
        const children: { id: string }[] = data.children ?? []
        const child = children[0]
        if (!child) return
        const quests: Quest[] = data.quests ?? []
        const ticks: Tick[] = data.ticks ?? []
        const banks: Bank[] = data.banks ?? []
        const bank = banks.find(b => b.child_id === child.id)
        if (bank) setBankStars(bank.balance)
        const todayStr = new Date().toISOString().slice(0, 10)
        const due = quests.filter(q => (q.child_id === child.id || q.child_id === null) && questDueToday(q.schedule, q.schedule_days))
        const doneIds = new Set(ticks.filter(t => t.tick_date === todayStr && t.status !== 'rejected' && (t.child_id === child.id || t.child_id === null)).map(t => t.quest_id))
        if (due.length > 0) setToday({ done: due.filter(q => doneIds.has(q.id)).length, total: due.length })
      })
      .catch(() => {})
    return () => { live = false }
  }, [])

  // A clear celebration every fifth day of jobs in a row, and the longer
  // lifetime streak always ticks up alongside, never reset by a missed day.
  const fiveInARow = streakCount > 0 && streakCount % 5 === 0
  return (
    <div style={{ marginBottom: '20px' }}>
      {fiveInARow && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 14, padding: '11px 14px', marginBottom: 10 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔥</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ink)', lineHeight: 1.35 }}>
            {streakCount} days of jobs in a row, brilliant.{streakTotal > streakCount ? ` ${streakTotal} days in all and counting.` : ''}
          </span>
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Tile icon="🔥" value={String(streakCount)} label={streakTotal > 0 ? `${streakTotal} days in all` : 'Day streak'} />
        <Tile icon="⭐" value={bankStars === null ? '—' : String(bankStars)} label={bankStars === null ? 'In the bank' : `= ${bankStars * STAR_MINUTES} min`} />
        <Tile icon="✅" value={today === null ? '—' : `${today.done}/${today.total}`} label="Today" />
      </div>
    </div>
  )
}
