'use client'

// DiGi's screen time balance for this child, a real, moving level rather than
// a fixed age guide. The two sides are the star economy's own exchange rate
// made visible: screen minutes actually USED today against the minutes EARNED
// through real world jobs today (stars earned times the family rate). When real
// life is ahead the level sits a healthy green and calm; when screen pulls
// ahead it warms to amber then red and DiGi nudges one real world win to
// balance it back. Always a calibrated steer, never a hard limit. The clock is
// read after mount so the evening wind down can kick in without a hydration
// mismatch. Once the evening lands, the card turns into a warm end of day
// moment: a small celebration and the three things a parent can send or print
// for tomorrow (a lesson to share, a device time quest, a printable).

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { screenBalanceInsight } from '@/lib/quests/screen-balance'

// The three things a parent can hand to their child to keep the balance
// healthy: a lesson to do together, a quest that earns device time, and a
// printable to send to their phone or print out. Shown both when DiGi steps in
// mid day and as the end of day recommendation.
const HANDOFFS = [
  { icon: '📚', label: 'Lessons to share', href: '/dashboard/lessons/together' },
  { icon: '✅', label: 'Device time quests', href: '/dashboard/quests?tab=manage' },
  { icon: '🖨️', label: 'Printables to send', href: '/dashboard/printables' },
]

function HandoffRow({ heading }: { heading: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '7px' }}>
        {heading}
      </div>
      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
        {HANDOFFS.map(o => (
          <Link key={o.label} href={o.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '11px',
            padding: '8px 12px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', color: 'var(--ink)',
          }}>
            <span aria-hidden>{o.icon}</span>{o.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

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

  // Once it is evening the card becomes an end of day moment: a small
  // celebration when the day sat well, a gentle reset when screen ran ahead,
  // and always the three things to send or print for tomorrow.
  const dayDone = hour != null && hour >= 19
  const healthyDay = tone === 'good' || tone === 'even' || tone === 'empty' || tone === 'pace'
  const celebrating = dayDone && healthyDay

  // Healthy real life is the calm retro green; the screen side warms from butter
  // to amber to red as it passes the age guide. Never black, always a colour
  // that reads at a glance.
  const realFill = 'linear-gradient(180deg, #3AA57C 0%, var(--retro-green) 100%)'
  const screenFill =
    tone === 'over' ? 'linear-gradient(180deg, #B22222 0%, var(--danger) 100%)'
    : tone === 'nearing' ? 'linear-gradient(180deg, #E8A23D 0%, #D98A22 100%)'
    : 'linear-gradient(180deg, #F1D07A 0%, var(--terracotta) 100%)'

  const accent =
    tone === 'over' ? 'var(--danger)'
    : tone === 'nearing' ? '#D98A22'
    : celebrating ? 'var(--retro-green)'
    : tone === 'good' ? 'var(--retro-green)'
    : tone === 'pace' ? '#D98A22'
    : 'var(--retro-green)'

  // The healthy screen guide as a fraction of the day's total so far. The needle
  // (at screenPct) and this marker share the same denominator, so the needle
  // passing the marker means screen has passed the age guide, whatever the mix.
  const guideMarkerPct = total > 0 && guide > 0 ? Math.min(97, (guide / total) * 100) : null

  const digiStepsIn = tone === 'over' || tone === 'nearing'

  const headline =
    celebrating ? `What a lovely day, ${childName}`
    : dayDone ? `A fresh start tomorrow`
    : tone === 'over' ? `${childName} has had plenty of screen today`
    : tone === 'nearing' ? `${childName} is near a healthy amount for today`
    : tone === 'empty' ? `${childName}'s day is just getting going`
    : tone === 'good' ? 'More real life than screen today'
    : tone === 'even' ? 'Screen and real life are level today'
    : 'Screen is ahead of real life today'

  const line =
    celebrating ? `Screens sat as one part of a full day for ${childName}, which is the balance doing its job. A lovely note to end on. Here is something to send or print for tomorrow.`
    : dayDone ? `Today ran a little screen heavy, and that is completely fine. Tomorrow is a clean page, so here is something calm to line up for the morning.`
    : tone === 'over' ? `That is more than the ${guide} min that sits well for age ${insight.bandLabel}. A real world job would balance it, and it is a kind moment to help ${childName} switch off. Never a hard stop, just a gentle steer.`
    : tone === 'nearing' ? `${childName} is coming up to about ${guide} min, the amount that sits well for their age. One real world job now keeps the day in balance.`
    : tone === 'empty' ? `Every quest ${childName} does tips this towards real life, and screen time is earned from it, so the balance builds itself.`
    : tone === 'good' ? `${childName} has earned more real world time than screen used today, which is the balance doing its job. Lovely.`
    : tone === 'even' ? 'Neatly even so far. One more quest and real life edges ahead.'
    : `A quest or a real world job would tip it back. For age ${insight.bandLabel}, around ${guide} min of screen a day sits comfortably.`

  const eyebrow =
    celebrating ? 'Day well balanced'
    : dayDone ? 'Winding down'
    : digiStepsIn ? 'DiGi says'
    : "Today's balance"

  const eyebrowColor = digiStepsIn ? accent : celebrating ? 'var(--retro-green-dark)' : 'var(--terracotta-dark)'

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderLeft: `6px solid ${accent}`,
      borderRadius: '18px', padding: '18px 20px', marginBottom: '18px',
    }}>
      {/* The end of day celebration ribbon: a soft green wash when the day sat
          well, so the moment reads as a warm win rather than another chart. */}
      {celebrating && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          background: 'var(--tint-green)', border: '1.5px solid #BFE0CF',
          borderRadius: '13px', padding: '9px 13px', marginBottom: '14px',
        }}>
          <span aria-hidden style={{ fontSize: '1.15rem', lineHeight: 1, flexShrink: 0 }}>🌟</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', color: 'var(--retro-green-dark)', lineHeight: 1.4 }}>
            Real life came out ahead today
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <span style={{
          flexShrink: 0, width: 50, height: 50, borderRadius: '15px',
          background: celebrating ? 'var(--tint-green)' : 'var(--terracotta-lt)',
          border: `1.5px solid ${celebrating ? '#BFE0CF' : 'var(--terracotta)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DigiCharacter mood="speak" size={34} once />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: eyebrowColor, marginBottom: '3px' }}>
            {eyebrow}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)', lineHeight: 1.2 }}>
            {headline}
          </div>
        </div>
      </div>

      {/* The level: a bold bar that moves with the real minutes used and earned.
          Real life sits green, the screen side warms amber then red as it passes
          the healthy amount. A dashed marker shows where the age screen guide
          falls, so the needle passing it reads at a glance as screen going over. */}
      <div style={{ position: 'relative', height: 24, borderRadius: '100px', overflow: 'hidden', border: '1.5px solid var(--border)', display: 'flex', marginBottom: '8px', boxShadow: 'inset 0 1px 3px rgba(26,26,46,0.10)' }}>
        <span style={{ width: `${screenPct}%`, background: screenFill, transition: 'width 0.6s ease, background 0.4s ease' }} />
        <span style={{ flex: 1, background: realFill }} />
        {/* A soft top gloss so the bar reads as a rounded, tactile level. */}
        <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0))', pointerEvents: 'none' }} />
        {/* The age guide marker: a dashed line the screen side should stay under. */}
        {guideMarkerPct != null && (
          <span aria-hidden style={{
            position: 'absolute', top: -1, bottom: -1, left: `${guideMarkerPct}%`, width: 0, marginLeft: -1,
            borderLeft: '2px dashed rgba(255,255,255,0.92)', zIndex: 1,
          }} />
        )}
        {/* The needle sits where the balance tips right now. */}
        <span style={{
          position: 'absolute', top: -2, bottom: -2, left: `${screenPct}%`, width: 3, marginLeft: -1.5,
          background: 'var(--ink)', borderRadius: '2px', transition: 'left 0.6s ease', zIndex: 2,
        }} />
      </div>

      {guideMarkerPct != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span aria-hidden style={{ width: 14, height: 0, borderTop: '2px dashed var(--ink-light)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.02em' }}>
            Healthy screen guide for their age, about {guide} min
          </span>
        </div>
      )}

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
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '12px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px',
            color: '#fff', background: accent, borderRadius: '11px', padding: '8px 14px', textDecoration: 'none',
          }}
        >
          Ask DiGi how to wind down →
        </Link>
      )}

      {/* The three handoffs: shown as the end of day recommendation, or as the
          good things to do instead when DiGi steps in mid day. */}
      {(celebrating || dayDone) ? (
        <HandoffRow heading="Send or print for tomorrow" />
      ) : digiStepsIn ? (
        <HandoffRow heading="Good things to do instead" />
      ) : null}

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-muted)' }}>
        Guide for age {insight.bandLabel}: about {insight.guideMins} min screen a day · ⭐ {earnedTodayStars} earned today
      </div>
    </div>
  )
}
