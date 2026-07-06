'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { questDueToday } from '@/lib/quests/due'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The family progress board on dashboard home: the approve queue first
// (kid ticked, one tap lands the stars), then each child's week at a
// glance. Renders nothing until the family has quests, so it never
// clutters a home screen before the feature is in use.

type Child = { id: string; name: string }
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; child_id: string | null }
type Tick = { id: string; quest_id: string; child_id: string | null; tick_date: string; status: string }
type Goal = { child_id: string; title: string; stars_needed: number }

export default function QuestBoard() {
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [ticks, setTicks] = useState<Tick[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/quests')
      const data = await res.json()
      setChildren(data.children ?? [])
      setQuests(data.quests ?? [])
      setTicks(data.ticks ?? [])
      setGoals(data.goals ?? [])
    } catch { /* stays hidden */ } finally { setLoaded(true) }
  }, [])

  useEffect(() => { load() }, [load])

  async function decide(tickId: string, decision: 'approve' | 'reject') {
    setTicks(prev => prev.map(t => t.id === tickId ? { ...t, status: decision === 'approve' ? 'approved' : 'rejected' } : t))
    try {
      await fetch('/api/quests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tick_id: tickId, decision }),
      })
    } catch { load() }
  }

  if (!loaded || quests.length === 0) return null

  const questById = new Map(quests.map(q => [q.id, q]))
  const pending = ticks.filter(t => t.status === 'pending')
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '20px', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          Family quests
        </span>
        <Link href="/dashboard/quests" style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--terracotta)', textDecoration: 'none', fontWeight: 600 }}>
          Manage →
        </Link>
      </div>

      {/* Approve queue */}
      {pending.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {pending.map(t => {
            const q = questById.get(t.quest_id)
            const childName = children.find(c => c.id === t.child_id)?.name ?? 'Your child'
            if (!q) return null
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
                borderRadius: '14px', padding: '11px 14px',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{q.emoji}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35 }}>
                  {childName} ticked <strong>{q.title}</strong>
                  <span style={{ color: 'var(--ink-muted)', fontWeight: 500 }}> · ⭐ {q.stars}</span>
                </span>
                <button
                  onClick={() => decide(t.id, 'approve')}
                  style={{
                    background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
                    borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800,
                    boxShadow: '0 3px 0 var(--terracotta-dark)', flexShrink: 0,
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => decide(t.id, 'reject')}
                  aria-label="Not done yet"
                  style={{
                    background: 'none', border: '1px solid var(--border)', borderRadius: '10px',
                    padding: '8px 10px', cursor: 'pointer', fontSize: '12px', color: 'var(--ink-muted)', flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Per child week summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children.map(c => {
          const childQuests = quests.filter(q => q.child_id === c.id || q.child_id === null)
          if (childQuests.length === 0) return null
          const dueToday = childQuests.filter(q => questDueToday(q.schedule))
          const doneToday = ticks.filter(t =>
            t.tick_date === today && t.status !== 'rejected' &&
            dueToday.some(q => q.id === t.quest_id) &&
            (t.child_id === c.id || t.child_id === null)
          ).length
          const weekStars = ticks
            .filter(t => t.status === 'approved' && (t.child_id === c.id || t.child_id === null))
            .reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)
          const goal = goals.find(g => g.child_id === c.id)
          return (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '12px', background: 'var(--cream)', border: '1px solid var(--border)',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', flexShrink: 0 }}>
                {c.name}
              </span>
              <span style={{ flex: 1, fontSize: '12px', color: 'var(--ink-muted)' }}>
                {doneToday}/{dueToday.length} today · ⭐ {weekStars} = {weekStars * STAR_MINUTES} min earned
                {goal && <span> · saving for {goal.title}</span>}
              </span>
              {goal && (
                <span style={{ width: '64px', height: '7px', borderRadius: '7px', background: 'var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                  <span style={{
                    display: 'block', height: '100%', borderRadius: '7px', background: 'var(--terracotta)',
                    width: `${Math.min(100, (weekStars / Math.max(1, goal.stars_needed)) * 100)}%`,
                  }} />
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
