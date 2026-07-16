'use client'

// DiGi's screen time balance insight on the Quests page. A calm, age aware
// read on how this child's screen time sits, and what a healthy balance looks
// like around it. Evidence led, never a hard limit, always a calibrated steer.
// The clock is read after mount so the evening wind down can kick in without a
// hydration mismatch on the server render.

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

  const accent = insight.tone === 'evening' ? 'var(--stage-5-bold)' : insight.tone === 'pace' ? 'var(--stage-1-bold)' : 'var(--tint-sage)'

  // The balance drawn as a slim bar, in the Greenlight split spirit: the age
  // guide's screen slice against the rest of a full day (real play, people,
  // sleep). Deliberately a shape, not a hard split, so it stays a calibrated
  // steer rather than a rule. Capped so a generous guide never fills the bar.
  const screenPct = Math.min(50, Math.round((insight.guideMins / WAKING_DAY_MINS) * 100))

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
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
          {insight.body}
        </p>

        {/* The balance, shown: screen is one slice of a full day. */}
        <div>
          <div style={{ display: 'flex', height: 10, borderRadius: '100px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <span style={{ width: `${screenPct}%`, background: 'var(--terracotta)' }} />
            <span style={{ flex: 1, background: 'var(--retro-green)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: '7px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-soft)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '2px', background: 'var(--terracotta)' }} />
              ≈{insight.guideMins} min screen
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-soft)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '2px', background: 'var(--retro-green)' }} />
              the rest for play, people and sleep
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
