'use client'

// The star system at a glance, at the top of the Quests page. One calm panel,
// in the GoHenry and Greenlight spirit, that answers the whole thing in a
// glance: the rate (one star buys five minutes), how many stars and so how many
// minutes this child has, what is waiting on the parent's yes, what is still to
// do today, what they are saving towards, and whether a timer is running now.
// Big buttons drop the parent straight into the one thing to do next.

import { STAR_MINUTES } from '@/lib/quests/templates'

type Goal = { title: string; stars_needed: number } | null

export default function StarSummary({
  childName, balanceStars, weekStars, pending, todo, goal, timerRunning, onApprove, onScreenTime, onShare,
}: {
  childName: string
  balanceStars: number
  weekStars: number
  pending: number
  todo: number
  goal: Goal
  timerRunning: boolean
  onApprove: () => void
  onScreenTime: () => void
  onShare: () => void
}) {
  const minutes = balanceStars * STAR_MINUTES
  const goalPct = goal ? Math.min(100, Math.round((balanceStars / Math.max(1, goal.stars_needed)) * 100)) : 0

  const tile = (icon: string, big: string, label: string, hot?: boolean): React.ReactNode => (
    <div style={{ flex: 1, minWidth: 82, background: hot ? 'var(--danger-bg)' : 'var(--cream)', border: `1px solid ${hot ? 'var(--danger)' : 'var(--border)'}`, borderRadius: '13px', padding: '10px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: hot ? 'var(--danger)' : 'var(--ink)', marginTop: '3px' }}>{big}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '1px' }}>{label}</div>
    </div>
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
        ⭐ {weekStars} earned this week{timerRunning ? ' · ⏱️ timer running now' : ''}
      </div>

      <div style={{ display: 'flex', gap: '7px', marginBottom: goal ? '13px' : '14px' }}>
        {tile('⏳', String(pending), 'waiting your yes', pending > 0)}
        {tile('📋', String(todo), 'to do today')}
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
