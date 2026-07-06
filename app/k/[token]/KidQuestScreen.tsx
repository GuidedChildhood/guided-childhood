'use client'

import { useState } from 'react'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The kid facing quest screen: joyful, huge tap targets, instant ticks,
// stars that count up, and a goal bar. Pending ticks show as "waiting
// for the grown up", approved ones celebrate. No navigation anywhere
// else: this screen is the whole world of the link.

type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string }
type Tick = { quest_id: string; status: string }
type Goal = { title: string; stars_needed: number; achieved_at: string | null } | null

export default function KidQuestScreen({
  token, childName, quests, todayTicks, weekStars, goal, streakDays = 0,
}: {
  token: string
  childName: string
  quests: Quest[]
  todayTicks: Tick[]
  weekStars: number
  goal: Goal
  streakDays?: number
}) {
  const [ticks, setTicks] = useState<Record<string, string>>(
    Object.fromEntries(todayTicks.map(t => [t.quest_id, t.status]))
  )
  const [burst, setBurst] = useState<string | null>(null)

  async function toggle(quest: Quest) {
    const current = ticks[quest.id]
    if (current === 'approved') return // done is done

    const untick = current === 'pending'
    // Optimistic
    setTicks(prev => {
      const next = { ...prev }
      if (untick) delete next[quest.id]
      else next[quest.id] = 'pending'
      return next
    })
    if (!untick) {
      setBurst(quest.id)
      setTimeout(() => setBurst(null), 900)
    }

    try {
      await fetch('/api/quests/tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, quest_id: quest.id, untick }),
      })
    } catch { /* optimistic state stands, the next load reconciles */ }
  }

  const doneCount = quests.filter(q => ticks[q.id]).length
  const allDone = quests.length > 0 && doneCount === quests.length
  const pendingStars = quests.filter(q => ticks[q.id] === 'pending').reduce((s, q) => s + q.stars, 0)

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--deep-teal)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '22px 16px 40px',
      fontFamily: 'var(--font-body)',
    }}>
      <style>{`
        @keyframes kid-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.25) rotate(-4deg); }
          100% { transform: scale(1); }
        }
        @keyframes kid-star-rise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-46px) scale(1.25); opacity: 0; }
        }
      `}</style>

      <div style={{ width: 'min(100%, 460px)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
            Today&apos;s quests
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.2rem)', color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Go {childName}!
          </h1>
        </div>

        {/* Star bank */}
        <div style={{
          background: 'var(--terracotta)', borderRadius: '20px', padding: '16px 20px',
          boxShadow: '0 5px 0 var(--terracotta-dark)', marginBottom: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.7, margin: '0 0 2px' }}>
              Star bank this week
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: 0 }}>
              ⭐ {weekStars}
              {pendingStars > 0 && (
                <span style={{ fontSize: '0.95rem', fontWeight: 700, opacity: 0.65 }}> +{pendingStars} waiting</span>
              )}
            </p>
            <p style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', opacity: 0.75, margin: '2px 0 0' }}>
              = {weekStars * STAR_MINUTES} minutes of screen time earned
            </p>
          </div>
          {streakDays > 0 && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>🔥</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)' }}>{streakDays}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.7 }}>day streak</div>
            </div>
          )}
        </div>

        {/* Goal bar */}
        {goal && (
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Saving for: {goal.title}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                {Math.min(weekStars, goal.stars_needed)}/{goal.stars_needed}
              </span>
            </div>
            <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '10px', background: 'var(--terracotta)',
                width: `${Math.min(100, (weekStars / Math.max(1, goal.stars_needed)) * 100)}%`,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )}

        {/* Quest list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quests.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.6 }}>
              No quests set for today yet. Ask your grown up to send some!
            </p>
          )}
          {quests.map(q => {
            const state = ticks[q.id]
            const done = Boolean(state)
            return (
              <button
                key={q.id}
                onClick={() => toggle(q)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: state === 'approved' ? 'var(--tint-sage)' : done ? '#FFF7E0' : '#fff',
                  border: 'none', borderRadius: '20px', padding: '16px 18px',
                  cursor: state === 'approved' ? 'default' : 'pointer', textAlign: 'left',
                  boxShadow: done ? '0 2px 0 rgba(0,0,0,0.12)' : '0 5px 0 rgba(0,0,0,0.18)',
                  transform: done ? 'translateY(3px)' : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  animation: burst === q.id ? 'kid-pop 0.5s ease' : undefined,
                }}
              >
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{q.emoji}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.25,
                    textDecoration: state === 'approved' ? 'line-through' : 'none',
                    opacity: state === 'approved' ? 0.6 : 1,
                  }}>
                    {q.title}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2 }}>
                    {state === 'approved' ? 'Done! Stars landed ⭐' : state === 'pending' ? 'Waiting for your grown up ✓' : `Worth ${q.stars} star${q.stars === 1 ? '' : 's'}`}
                  </span>
                </span>
                <span style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--terracotta)' : 'var(--cream)',
                  border: done ? 'none' : '2.5px dashed var(--ink-light)',
                  fontSize: '18px', position: 'relative',
                }}>
                  {done ? '✓' : ''}
                  {burst === q.id && (
                    <span style={{ position: 'absolute', animation: 'kid-star-rise 0.9s ease-out forwards', fontSize: '20px' }}>⭐</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {allDone && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: '#fff', margin: '0 0 4px' }}>
              All quests done! 🎉
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              Amazing work {childName}. Your grown up is approving your stars.
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginTop: '32px' }}>
          GUIDED CHILDHOOD QUESTS
        </p>
      </div>
    </div>
  )
}
