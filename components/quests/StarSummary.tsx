'use client'

// The star system at a glance, the control centre at the top of the Quests
// page. One calm panel, in the GoHenry and Greenlight spirit, that answers the
// whole thing in a glance: the rate (one star buys five minutes), how many
// stars and so how many minutes this child has, what is waiting on the
// parent's yes, what is still to do today, what they are saving towards, and a
// live countdown when the child is on their screen time right now. The three
// tiles are tappable, each dropping the parent straight onto the list it
// counts, and the big buttons drop them into the next thing to do.

import { useEffect, useState } from 'react'
import { STAR_MINUTES } from '@/lib/quests/templates'

type Goal = { title: string; stars_needed: number } | null

function fmt(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export default function StarSummary({
  childName, balanceStars, weekStars, pending, todo, goal, timerRunning,
  sessionEndsAt, onApprove, onTodo, onScreenTime, onShare,
}: {
  childName: string
  balanceStars: number
  weekStars: number
  pending: number
  todo: number
  goal: Goal
  timerRunning: boolean
  sessionEndsAt?: string | null
  onApprove: () => void
  onTodo: () => void
  onScreenTime: () => void
  onShare: () => void
}) {
  const minutes = balanceStars * STAR_MINUTES
  const goalPct = goal ? Math.min(100, Math.round((balanceStars / Math.max(1, goal.stars_needed)) * 100)) : 0

  // The live clock, held null until mounted so the server and first client
  // render agree, then it ticks the countdown the child is watching too.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    if (!sessionEndsAt) return
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [sessionEndsAt])
  const remainingMs = sessionEndsAt && now ? Math.max(0, new Date(sessionEndsAt).getTime() - now) : null

  // A tile reads as tappable only when it says so: a Greenlight style chevron
  // sits in the corner of an interactive tile, and the static one (this week)
  // stays visibly calmer, so a parent knows at a glance which ones act.
  const tile = (
    icon: string, big: string, label: string, onClick?: () => void, hot?: boolean,
  ): React.ReactNode => (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        position: 'relative', flex: 1, minWidth: 82, textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        background: hot ? 'var(--danger-bg)' : onClick ? '#fff' : 'var(--cream)',
        border: `1.5px solid ${hot ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: '14px', padding: '11px 8px',
        boxShadow: onClick ? '0 2px 0 var(--border)' : 'none',
        opacity: onClick || hot ? 1 : 0.82,
      }}
    >
      {onClick && (
        <span aria-hidden style={{ position: 'absolute', top: 6, right: 9, fontSize: '13px', fontWeight: 800, color: hot ? 'var(--danger)' : 'var(--ink-light)' }}>›</span>
      )}
      <div style={{ fontSize: '1.2rem', lineHeight: 1 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: hot ? 'var(--danger)' : 'var(--ink)', marginTop: '3px' }}>{big}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '2px' }}>{label}</div>
    </button>
  )

  const bigBtn = (label: string, onClick: () => void, primary?: boolean): React.ReactNode => (
    <button onClick={onClick} style={{
      flex: 1, minWidth: 92, padding: '11px 8px', borderRadius: '13px', cursor: 'pointer',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
      background: primary ? 'var(--terracotta)' : '#fff', color: 'var(--ink)',
      boxShadow: primary ? '0 4px 0 var(--terracotta-dark)' : 'none',
      border: primary ? 'none' : '1.5px solid var(--border)',
    }}>{label}</button>
  )

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          {childName}&apos;s stars
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px 11px' }}>
          1 ⭐ = {STAR_MINUTES} min
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', color: 'var(--ink)' }}>⭐ {balanceStars}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink-soft)' }}>= {minutes} minutes ready</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '13px' }}>
        ⭐ {weekStars} earned this week
      </div>

      {/* Live device time: the same countdown the child is watching, so the
          parent can police it from here (and, once the app exists, their PWA). */}
      {timerRunning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '13px',
          background: 'var(--tint-sage)', border: '1.5px solid var(--deep-teal)',
          borderRadius: '13px', padding: '11px 14px',
        }}>
          <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>⏱️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>
              {childName} is on screen time now
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
              {remainingMs != null ? `${fmt(remainingMs)} left on the clock` : 'timer running'}
            </div>
          </div>
          {remainingMs != null && (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--deep-teal)', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(remainingMs)}
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '7px', marginBottom: goal ? '13px' : '14px' }}>
        {tile('🙋', String(pending), 'waiting your yes', pending > 0 ? onApprove : undefined, pending > 0)}
        {tile('📋', String(todo), 'to do today', todo > 0 ? onTodo : undefined)}
        {tile('⭐', String(weekStars), 'this week')}
      </div>

      {goal && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '13px', padding: '10px 12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>🎯 Saving for: {goal.title}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>{Math.min(balanceStars, goal.stars_needed)}/{goal.stars_needed}</span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'rgba(26,26,46,0.1)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${goalPct}%`, borderRadius: 100, background: 'var(--terracotta)' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
        {bigBtn(pending > 0 ? `Approve ${pending} ⭐` : 'Set tasks', onApprove, pending > 0)}
        {bigBtn('Screen time', onScreenTime)}
        {bigBtn('Share app', onShare)}
      </div>
    </div>
  )
}
