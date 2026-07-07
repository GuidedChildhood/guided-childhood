'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { questDueToday } from '@/lib/quests/due'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The family quest board on Home: every child's day at a glance, big
// enough to matter. The approve queue leads (kid ticked, one tap lands
// the stars), then each child shows their quest dots, minutes earned
// and goal bar, and expands to today's list so a parent can tick any
// quest right here without leaving Home.

type Child = { id: string; name: string }
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; child_id: string | null }
type Tick = { id: string; quest_id: string; child_id: string | null; tick_date: string; status: string }
type Goal = { child_id: string; title: string; stars_needed: number; daily_stars: number | null }

export default function QuestBoard() {
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [ticks, setTicks] = useState<Tick[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openChild, setOpenChild] = useState<string | null>(null)

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

  async function tickQuest(questId: string, childId: string) {
    const today = new Date().toISOString().slice(0, 10)
    setTicks(prev => [...prev, {
      id: `local-${questId}`, quest_id: questId, child_id: childId,
      tick_date: today, status: 'approved',
    }])
    try {
      await fetch('/api/quests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: questId }),
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
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
          Family Quests
        </span>
        <Link href="/dashboard/quests" style={{
          fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800,
          color: 'var(--ink)', textDecoration: 'none',
          background: 'var(--terracotta)', borderRadius: '10px', padding: '7px 14px',
          boxShadow: '0 3px 0 var(--terracotta-dark)',
        }}>
          Manage
        </Link>
      </div>

      {/* Approve queue: the kid is waiting on you */}
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
                  <span style={{ color: 'var(--ink-muted)', fontWeight: 500 }}> · ⭐ {q.stars} = {q.stars * STAR_MINUTES} min</span>
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

      {/* Every child, big and glanceable, expandable to tick */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children.map(c => {
          const childQuests = quests.filter(q => q.child_id === c.id || q.child_id === null)
          if (childQuests.length === 0) return null
          const dueToday = childQuests.filter(q => questDueToday(q.schedule))
          const doneIds = new Set(
            ticks.filter(t => t.tick_date === today && t.status !== 'rejected' && (t.child_id === c.id || t.child_id === null)).map(t => t.quest_id)
          )
          const doneToday = dueToday.filter(q => doneIds.has(q.id)).length
          const weekStars = ticks
            .filter(t => t.status === 'approved' && (t.child_id === c.id || t.child_id === null))
            .reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)
          const goal = goals.find(g => g.child_id === c.id)
          const todayStars = ticks
            .filter(t => t.tick_date === today && t.status !== 'rejected' && (t.child_id === c.id || t.child_id === null))
            .reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)
          const dayGoalHit = !!goal?.daily_stars && todayStars >= goal.daily_stars
          const isOpen = openChild === c.id
          return (
            <div key={c.id} style={{
              borderRadius: '16px', background: 'var(--cream)', border: '1.5px solid var(--border)',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpenChild(isOpen ? null : c.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                      ⭐ {weekStars} = {weekStars * STAR_MINUTES} min this week
                    </span>
                  </span>
                  {/* Today's quest dots */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {dueToday.map(q => (
                      <span key={q.id} style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: doneIds.has(q.id) ? 'var(--terracotta)' : '#fff',
                        border: doneIds.has(q.id) ? 'none' : '2px solid var(--border)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '8px', color: '#fff',
                      }}>
                        {doneIds.has(q.id) ? '✓' : ''}
                      </span>
                    ))}
                    <span style={{ fontSize: '11.5px', color: 'var(--ink-muted)', marginLeft: '4px' }}>
                      {doneToday}/{dueToday.length} today
                    </span>
                    {goal?.daily_stars ? (
                      <span style={{
                        fontSize: '10px', fontWeight: 800, marginLeft: '4px',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                        color: dayGoalHit ? 'var(--ink)' : 'var(--ink-muted)',
                        background: dayGoalHit ? 'var(--terracotta)' : 'var(--cream)',
                        border: dayGoalHit ? 'none' : '1px solid var(--border)',
                        borderRadius: '100px', padding: '3px 8px',
                      }}>
                        {dayGoalHit ? 'Day goal hit 🎉' : `Day goal ⭐ ${Math.min(todayStars, goal.daily_stars)}/${goal.daily_stars}`}
                      </span>
                    ) : null}
                  </span>
                  {/* Goal bar */}
                  {goal && (
                    <span style={{ display: 'block', marginTop: '8px' }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--ink-muted)', marginBottom: '3px' }}>
                        <span>Saving for {goal.title}</span>
                        <span>{Math.min(weekStars, goal.stars_needed)}/{goal.stars_needed}</span>
                      </span>
                      <span style={{ display: 'block', height: '8px', borderRadius: '8px', background: 'var(--border)', overflow: 'hidden' }}>
                        <span style={{
                          display: 'block', height: '100%', borderRadius: '8px', background: 'var(--terracotta)',
                          width: `${Math.min(100, (weekStars / Math.max(1, goal.stars_needed)) * 100)}%`,
                          transition: 'width 0.5s ease',
                        }} />
                      </span>
                    </span>
                  )}
                </span>
                <span style={{ color: 'var(--ink-light)', fontSize: '14px', flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                  →
                </span>
              </button>

              {/* Expanded: tick today's quests right here */}
              {isOpen && (
                <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <Link href="/dashboard/quests" style={{
                    alignSelf: 'flex-end', fontSize: '11.5px', fontWeight: 700,
                    color: 'var(--terracotta-dark)', textDecoration: 'none',
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                  }}>
                    + Add a quest for {c.name}
                  </Link>
                  {dueToday.map(q => {
                    const done = doneIds.has(q.id)
                    return (
                      <button
                        key={q.id}
                        onClick={() => !done && tickQuest(q.id, c.id)}
                        disabled={done}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px', borderRadius: '11px',
                          background: done ? 'var(--tint-sage)' : '#fff',
                          border: '1px solid var(--border)', cursor: done ? 'default' : 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: '1.05rem' }}>{q.emoji}</span>
                        <span style={{
                          flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--ink)',
                          textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1,
                        }}>
                          {q.title}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: done ? 'var(--ink-muted)' : 'var(--terracotta-dark)', flexShrink: 0 }}>
                          {done ? 'Done ✓' : `Tick · ⭐${q.stars}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
