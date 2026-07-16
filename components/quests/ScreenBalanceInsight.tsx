'use client'

// DiGi's screen time balance insight on the Quests page. A calm, age aware
// read on how this child's screen time sits, and what a healthy balance looks
// like around it. Evidence led, never a hard limit, always a calibrated steer.
// The clock is read after mount so the evening wind down can kick in without a
// hydration mismatch on the server render.

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { screenBalanceInsight } from '@/lib/quests/screen-balance'

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

  const accent = insight.tone === 'evening' ? 'var(--stage-5-bold)' : insight.tone === 'pace' ? 'var(--stage-1-bold)' : 'var(--tint-sage)'

  return (
    <div style={{
      display: 'flex', gap: '13px', alignItems: 'flex-start',
      background: '#fff', border: '1.5px solid var(--border)', borderLeft: `5px solid ${accent}`,
      borderRadius: '16px', padding: '15px 17px', marginBottom: '18px',
    }}>
      <span style={{
        flexShrink: 0, width: 46, height: 46, borderRadius: '14px', background: 'var(--terracotta-lt)',
        border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <DigiCharacter mood="speak" size={32} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
          DiGi on balance
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.25, marginBottom: '5px' }}>
          {insight.headline}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          {insight.body}
        </p>
      </div>
    </div>
  )
}
