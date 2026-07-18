'use client'

// DiGi's screen time balance for this child, a real, moving level rather than
// a fixed age guide. The two sides are the star economy's own exchange rate
// made visible: screen minutes actually USED today against the minutes EARNED
// through real world jobs today (stars earned times the family rate). When real
// life is ahead the level sits green and calm; when screen pulls ahead it tips
// and DiGi nudges one real world win to balance it back. Always a calibrated
// steer, never a hard limit. The clock is read after mount so the evening wind
// down can kick in without a hydration mismatch.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { screenBalanceInsight } from '@/lib/quests/screen-balance'

export default function ScreenBalanceInsight({
  childName, ageBand, balanceStars, weekStars, timerRunning, usedTodayMinutes = 0, earnedTodayStars = 0,
}: {
  childName: string
  ageBand: string | null
  balanceStars: number
  weekStars: number
  timerRunning: boolean
  usedTodayMinutes?: number
  earnedTodayStars?: number
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

  // The real balance, today: screen used against real world minutes earned.
  const screenMins = Math.max(0, Math.round(usedTodayMinutes))
  const realMins = Math.max(0, Math.round(earnedTodayStars * STAR_MINUTES))
  const total = screenMins + realMins
  // Where the level tips right now. 50 is even, higher tips to real life, lower
  // to screen. A calm midpoint when the day is still empty.
  const screenPct = total > 0 ? Math.round((screenMins / total) * 100) : 50

  // The healthy daily amount for this age is the line that matters most. When
  // screen crosses it the bar goes red and DiGi steps in with a gentle steer;
  // nearing it is an amber heads up. Otherwise the calm real life vs screen read.
  const guide = insight.guideMins
  const overGuide = guide > 0 && screenMins >= guide
  const nearingGuide = !overGuide && guide > 0 && screenMins >= Math.round(guide * 0.8)

  type Tone = 'over' | 'nearing' | 'good' | 'even' | 'pace' | 'empty'
  const tone: Tone =
    overGuide ? 'over'
    : nearingGuide ? 'nearing'
    : total === 0 ? 'empty'
    : realMins > screenMins ? 'good'
    : realMins === screenMins ? 'even'
    : 'pace'

  const accent =
    tone === 'over' ? 'var(--danger)'
    : tone === 'nearing' ? 'var(--stage-1-bold)'
    : tone === 'good' ? 'var(--retro-green)'
    : tone === 'pace' ? 'var(--stage-1-bold)'
    : 'var(--deep-teal)'

  // The screen side of the level carries the warning colour, so the bar itself
  // reads at a glance: red over the healthy amount, amber nearing it.
  const screenFill = tone === 'over' ? 'var(--danger)' : tone === 'nearing' ? 'var(--stage-1-bold)' : 'var(--terracotta)'
  const digiStepsIn = tone === 'over' || tone === 'nearing'

  const headline =
    tone === 'over' ? `${childName} has had plenty of screen today`
    : tone === 'nearing' ? `${childName} is near a healthy amount for today`
    : tone === 'empty' ? `${childName}'s day is just getting going`
    : tone === 'good' ? 'More real life than screen today'
    : tone === 'even' ? 'Screen and real life are level today'
    : 'Screen is ahead of real life today'

  const line =
    tone === 'over' ? `That is more than the ${guide} min that sits well for age ${insight.bandLabel}. A real world job would balance it, and it is a kind moment to help ${childName} switch off. Never a hard stop, just a gentle steer.`
    : tone === 'nearing' ? `${childName} is coming up to about ${guide} min, the amount that sits well for their age. One real world job now keeps the day in balance.`
    : tone === 'empty' ? `Every quest ${childName} does tips this towards real life, and screen time is earned from it, so the balance builds itself.`
    : tone === 'good' ? `${childName} has earned more real world time than screen used today, which is the balance doing its job. Lovely.`
    : tone === 'even' ? 'Neatly even so far. One more quest and real life edges ahead.'
    : `A quest or a real world job would tip it back. For age ${insight.bandLabel}, around ${guide} min of screen a day sits comfortably.`

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderLeft: `6px solid ${accent}`,
      borderRadius: '18px', padding: '18px 20px', marginBottom: '18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <span style={{
          flexShrink: 0, width: 50, height: 50, borderRadius: '15px', background: 'var(--terracotta-lt)',
          border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DigiCharacter mood="speak" size={34} once />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: digiStepsIn ? accent : 'var(--terracotta-dark)', marginBottom: '3px' }}>
            {digiStepsIn ? 'DiGi says' : "Today's balance"}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)', lineHeight: 1.2 }}>
            {headline}
          </div>
        </div>
      </div>

      {/* The level: a bold bar that moves with the real minutes used and earned.
          The screen side turns amber then red as it passes the healthy amount. */}
      <div style={{ position: 'relative', height: 22, borderRadius: '100px', overflow: 'hidden', border: '1.5px solid var(--border)', display: 'flex', marginBottom: '10px', boxShadow: 'inset 0 1px 3px rgba(26,26,46,0.10)' }}>
        <span style={{ width: `${screenPct}%`, background: screenFill, transition: 'width 0.6s ease, background 0.4s ease' }} />
        <span style={{ flex: 1, background: 'var(--retro-green)' }} />
        {/* The needle sits where the balance tips right now. */}
        <span style={{
          position: 'absolute', top: -2, bottom: -2, left: `${screenPct}%`, width: 3, marginLeft: -1.5,
          background: 'var(--ink)', borderRadius: '2px', transition: 'left 0.6s ease',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: '12px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '3px', background: 'var(--terracotta)', flexShrink: 0 }} />
          {screenMins} min screen
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>
          {realMins} min earned real life
          <span style={{ width: 10, height: 10, borderRadius: '3px', background: 'var(--retro-green)', flexShrink: 0 }} />
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 8px' }}>
        {line}
      </p>
      {digiStepsIn && (
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(`${childName} has had a good amount of screen time today. What is a warm way to help them wind down and switch off without a fight?`)}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '10px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px',
            color: '#fff', background: accent, borderRadius: '11px', padding: '8px 14px', textDecoration: 'none',
          }}
        >
          Ask DiGi how to wind down →
        </Link>
      )}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-muted)' }}>
        Guide for age {insight.bandLabel}: about {insight.guideMins} min screen a day · ⭐ {earnedTodayStars} earned today
      </div>
    </div>
  )
}
