'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { questDueToday } from '@/lib/quests/due'
import { STAR_MINUTES } from '@/lib/quests/templates'
import Button, { ButtonLink } from '@/components/ui/Button'

// The family quest board on Home: every child's day at a glance, big
// enough to matter. The approve queue leads (kid ticked, one tap lands
// the stars), then each child shows their quest dots, minutes earned
// and goal bar, and expands to today's list so a parent can tick any
// quest right here without leaving Home.

type Child = { id: string; name: string }
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; schedule_days?: number[] | null; child_id: string | null }
type Tick = { id: string; quest_id: string; child_id: string | null; tick_date: string; status: string }
type Goal = { child_id: string; title: string; stars_needed: number; daily_stars: number | null }
type Ask = { id: string; child_id: string; title: string; emoji: string; status: string }
type Bank = { child_id: string; earned: number; spent: number; balance: number; minutes: number }

export default function QuestBoard() {
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [ticks, setTicks] = useState<Tick[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [asks, setAsks] = useState<Ask[]>([])
  const [banks, setBanks] = useState<Bank[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openChild, setOpenChild] = useState<string | null>(null)
  const [spendNote, setSpendNote] = useState<string | null>(null)
  const [showDone, setShowDone] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/quests')
      const data = await res.json()
      setChildren(data.children ?? [])
      setQuests(data.quests ?? [])
      setTicks(data.ticks ?? [])
      setGoals(data.goals ?? [])
      setAsks(data.requests ?? [])
      setBanks(data.banks ?? [])
    } catch { /* stays hidden */ } finally { setLoaded(true) }
  }, [])

  // Keep the board live: a child ticking a quest lands as a pending approval
  // the parent should see without a refresh. Poll gently, and refetch the
  // moment the tab is looked at again, so Waiting on you is never stale.
  useEffect(() => {
    load()
    const id = setInterval(load, 15000)
    const onVis = () => { if (!document.hidden) load() }
    window.addEventListener('focus', load)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', load)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [load])

  // The child asked for this quest. Yes makes it real (2 stars, one off,
  // adjustable any time in Manage), no closes it kindly.
  async function decideAsk(askId: string, decision: 'added' | 'declined') {
    setAsks(prev => prev.map(a => a.id === askId ? { ...a, status: decision } : a))
    try {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_decide', request_id: askId, decision, stars: 2, schedule: 'once' }),
      })
      if (decision === 'added') load()
    } catch { load() }
  }

  // Screen time was used: the stars come off the bank right here.
  async function spend(childId: string, minutes: number) {
    try {
      const res = await fetch('/api/quests/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, minutes }),
      })
      const data = await res.json()
      if (data.ok) {
        setBanks(prev => prev.map(b => b.child_id === childId
          ? { ...b, spent: b.spent + data.spent_stars, balance: data.balance, minutes: data.balance_minutes }
          : b))
        setSpendNote(`${data.spent_minutes} minutes marked as used, ⭐ ${data.balance} left in the bank`)
      } else {
        setSpendNote(data.error ?? 'Could not mark that just now')
      }
      setTimeout(() => setSpendNote(null), 3500)
    } catch { /* next load reconciles */ }
  }

  async function decide(tickId: string, decision: 'approve' | 'reject') {
    setTicks(prev => prev.map(t => t.id === tickId ? { ...t, status: decision === 'approve' ? 'approved' : 'rejected' } : t))
    try {
      await fetch('/api/quests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tick_id: tickId, decision }),
      })
      // Drop the bell and the Waiting on you banner at once, and the child's
      // own app hears the yes on its next poll.
      try { window.dispatchEvent(new Event('gc:notifs-changed')) } catch { /* SSR */ }
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

  const pendingAsks = asks.filter(a => a.status === 'pending')
  if (!loaded || (quests.length === 0 && pendingAsks.length === 0)) return null

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
        <ButtonLink href="/dashboard/quests" variant="primary" size="sm">Manage</ButtonLink>
      </div>

      {/* The kids' own quest ideas: one tap makes it real */}
      {pendingAsks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {pendingAsks.map(a => {
            const childName = children.find(c => c.id === a.child_id)?.name ?? 'Your child'
            return (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--tint-blue)', border: '1.5px solid var(--border)',
                borderRadius: '14px', padding: '11px 14px',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{a.emoji}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
                  {childName} pitched a quest: <strong>{a.title}</strong>
                  <span style={{ color: 'var(--ink-muted)', fontWeight: 500 }}> · their idea</span>
                </span>
                <Button variant="primary" size="sm" onClick={() => decideAsk(a.id, 'added')} style={{ flexShrink: 0 }}>
                  Add it ⭐2
                </Button>
                <button
                  onClick={() => decideAsk(a.id, 'declined')}
                  aria-label="Not this time"
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
                <span style={{ flex: 1, minWidth: 0, fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>
                  {childName} ticked <strong>{q.title}</strong>
                  <span style={{ color: 'var(--ink-muted)', fontWeight: 500 }}> · ⭐ {q.stars} = {q.stars * STAR_MINUTES} min</span>
                </span>
                <Button variant="primary" size="sm" onClick={() => decide(t.id, 'approve')} style={{ flexShrink: 0 }}>
                  Approve
                </Button>
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
          const dueToday = childQuests.filter(q => questDueToday(q.schedule, q.schedule_days))
          const doneIds = new Set(
            ticks.filter(t => t.tick_date === today && t.status !== 'rejected' && (t.child_id === c.id || t.child_id === null)).map(t => t.quest_id)
          )
          const doneToday = dueToday.filter(q => doneIds.has(q.id)).length
          const weekStars = ticks
            .filter(t => t.status === 'approved' && (t.child_id === c.id || t.child_id === null))
            .reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)
          const bank = banks.find(b => b.child_id === c.id)
          const balance = bank ? bank.balance : weekStars
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
                onClick={() => { setShowDone(false); setOpenChild(isOpen ? null : c.id) }}
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
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                      ⭐ {balance} = {balance * STAR_MINUTES} min of screen time left
                    </span>
                  </span>
                  {/* Today's quest dots */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink-soft)' }}>
                      {doneToday} of {dueToday.length} done today · tap to see the tasks, agree the waiting ones and send more
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
                  {goal && balance < goal.stars_needed && (
                    <span style={{ display: 'block', marginTop: '8px' }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--ink-muted)', marginBottom: '3px' }}>
                        <span>Saving for {goal.title}</span>
                        <span>{Math.min(balance, goal.stars_needed)}/{goal.stars_needed}</span>
                      </span>
                      <span style={{ display: 'block', height: '8px', borderRadius: '8px', background: 'var(--border)', overflow: 'hidden' }}>
                        <span style={{
                          display: 'block', height: '100%', borderRadius: '8px', background: 'var(--terracotta)',
                          width: `${Math.min(100, (balance / Math.max(1, goal.stars_needed)) * 100)}%`,
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
                  {/* Screen time used comes straight off the bank */}
                  {balance > 0 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
                      background: '#fff', border: '1px solid var(--border)', borderRadius: '11px',
                      padding: '10px 12px',
                    }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-soft)' }}>
                        Screen time used:
                      </span>
                      {[15, 30, 60].map(m => (
                        <button
                          key={m}
                          onClick={() => spend(c.id, m)}
                          disabled={balance * STAR_MINUTES < STAR_MINUTES}
                          style={{
                            background: 'var(--cream)', border: '1.5px solid var(--border)',
                            borderRadius: '100px', padding: '6px 12px', cursor: 'pointer',
                            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink)',
                          }}
                        >
                          {m} min
                        </button>
                      ))}
                    </div>
                  )}
                  {spendNote && (
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--terracotta-dark)', margin: 0 }}>
                      {spendNote}
                    </p>
                  )}
                  <Link href="/dashboard/quests" style={{
                    alignSelf: 'flex-end', fontSize: '11.5px', fontWeight: 700,
                    color: 'var(--terracotta-dark)', textDecoration: 'none',
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                  }}>
                    + Add a quest for {c.name}
                  </Link>
                  {/* What is still to do stays up top, big and tappable. */}
                  {(() => {
                    const todo = dueToday.filter(q => !doneIds.has(q.id))
                    const done = dueToday.filter(q => doneIds.has(q.id))
                    return (
                      <>
                        {todo.length === 0 && done.length > 0 && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '11px 13px', borderRadius: '11px',
                            background: 'var(--tint-sage)', border: '1px solid var(--border)',
                          }}>
                            <span style={{ fontSize: '1.05rem' }}>🎉</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                              All done for today
                            </span>
                          </div>
                        )}
                        {todo.map(q => (
                          <button
                            key={q.id}
                            onClick={() => tickQuest(q.id, c.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 12px', borderRadius: '11px',
                              background: '#fff', border: '1px solid var(--border)', cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <span style={{ fontSize: '1.05rem' }}>{q.emoji}</span>
                            <span style={{ flex: 1, fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>
                              {q.title}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)', flexShrink: 0 }}>
                              Tick · ⭐{q.stars}
                            </span>
                          </button>
                        ))}
                        {/* The agreed ones drop off into a quiet, foldable line so the
                            list never grows into a pile of Done rows. */}
                        {done.length > 0 && (
                          <div>
                            <button
                              onClick={() => setShowDone(s => !s)}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 12px', borderRadius: '11px', background: 'none',
                                border: '1px dashed var(--border)', cursor: 'pointer', textAlign: 'left',
                              }}
                            >
                              <span style={{ fontSize: '13px' }}>✓</span>
                              <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: 'var(--ink-muted)' }}>
                                {done.length} done today
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--ink-light)', transform: showDone ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                                →
                              </span>
                            </button>
                            {showDone && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                                {done.map(q => (
                                  <div key={q.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '9px 12px', borderRadius: '11px',
                                    background: 'var(--tint-sage)', border: '1px solid var(--border)',
                                  }}>
                                    <span style={{ fontSize: '1.05rem', opacity: 0.7 }}>{q.emoji}</span>
                                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: 'var(--ink)', textDecoration: 'line-through', opacity: 0.6 }}>
                                      {q.title}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>
                                      Done ✓
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
