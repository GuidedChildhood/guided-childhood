'use client'

// DiGi's screen time balance read, written as a warm note to the parent, in
// the Good Inside welcome sheet look: the butter mark, a big bold Nunito
// heading, and a generous body at a comfortable reading size, on a clean card.
// This is the platform type and spacing system applied: mono eyebrow, big
// heading, roomy body. Evidence led, never a hard limit, always a calibrated
// steer. The clock is read after mount so the evening wind down can kick in
// without a hydration mismatch on the server render.

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { screenBalanceInsight, WAKING_DAY_MINS } from '@/lib/quests/screen-balance'

export default function ScreenBalanceInsight({
  childName, ageBand, balanceStars, weekStars, timerRunning,
}: {
  childName: string
  ageBand: string | null
  balanceStars: number
  weekStars: number
  timerRunning: boolean
}) {
  const [hour, setHour] = useState<number | null>(null)
  useEffect(() => { setHour(new Date().getHours()) }, [])

  const insight = screenBalanceInsight({
    childName,
    ageBand,
    minutesReady: balanceStars * STAR_MINUTES,
    weekStars,
    timerRunning,
    hour,
  })

  // Screen as one slice of a full waking day. A shape, not a hard split; capped
  // so a generous guide never fills the bar.
  const screenPct = Math.min(50, Math.round((insight.guideMins / WAKING_DAY_MINS) * 100))

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '22px', padding: '24px 24px 22px', marginBottom: '18px',
    }}>
      {/* The mark and who is speaking, welcome sheet style */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '18px' }}>
        <span style={{
          flexShrink: 0, width: 52, height: 52, borderRadius: '16px', background: 'var(--terracotta)',
          boxShadow: '0 4px 0 var(--terracotta-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DigiCharacter mood="speak" size={34} />
        </span>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          DiGi on balance
        </div>
      </div>

      {/* Big bold heading, the note it opens with */}
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'clamp(1.4rem, 5.5vw, 1.7rem)', color: 'var(--ink)',
        lineHeight: 1.12, letterSpacing: '-0.03em', margin: '0 0 12px',
      }}>
        {insight.headline}
      </h3>

      {/* Generous body, DiGi writing to you */}
      <p style={{
        fontFamily: 'var(--font-body)', fontWeight: 500,
        fontSize: '17px', color: 'var(--ink)', opacity: 0.9,
        lineHeight: 1.62, margin: '0 0 20px',
      }}>
        {insight.body}
      </p>

      {/* The balance, shown: screen is one slice of a full day */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', height: 12, borderRadius: '100px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <span style={{ width: `${screenPct}%`, background: 'var(--terracotta)' }} />
          <span style={{ flex: 1, background: 'var(--retro-green)' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '3px', background: 'var(--terracotta)' }} />
            ≈{insight.guideMins} min screen
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '3px', background: 'var(--retro-green)' }} />
            the rest for play, people and sleep
          </span>
        </div>
      </div>
    </div>
  )
}
