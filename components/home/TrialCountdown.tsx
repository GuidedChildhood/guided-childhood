'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The trial's voice on Home, in its three honest registers.
//
// Justin, 8 August: four days free with the limits as before, "but a count
// down then", and the best techniques to land the founder rate at the end.
// The techniques used here are the honest ones, because the dishonest ones
// (fake scarcity, guilt copy, hidden endings) are exactly what this product
// exists to argue against:
//
//   1. THE COUNTDOWN IS REAL. Days while days are the truthful unit, then a
//      live hours and minutes clock inside the last day. It counts to the
//      actual trial_ends_at, never to midnight theatre.
//   2. THE EVIDENCE IS THEIRS. The strongest close is what their own four
//      days already built: jobs ticked, the streak. Numbers from their real
//      week, never invented, shown only when they are not zero.
//   3. THE SCARCITY IS TRUE. The founder rate genuinely stops at 50 families,
//      enforced in the Stripe checkout, and the upgrade page shows the live
//      seats count. This banner may say capped at 50; only the page with the
//      real count says how many are left.
//   4. THE ENDING IS SOFT AND SAYS SO. Nothing is deleted, the daily habit
//      stays free, and the copy says what stays as plainly as what pauses.

function pad(n: number): string { return String(n).padStart(2, '0') }

export default function TrialCountdown({
  trialEndsAt,
  ended,
  trialDays,
  jobsTicked = 0,
  streakCount = 0,
}: {
  /** ISO timestamp of the trial's real end. Null only when ended is true. */
  trialEndsAt: string | null
  /** The after state: trial over, no subscription. */
  ended: boolean
  /** TRIAL_DAYS from lib/access, so this copy can never disagree with the gate. */
  trialDays: number
  /** Their own numbers, for the honest close. Zero hides the line. */
  jobsTicked?: number
  streakCount?: number
}) {
  // Ticks once a minute inside the last day. null means more than a day out,
  // so the banner speaks in days and nothing re-renders on a clock.
  const [msLeft, setMsLeft] = useState<number | null>(null)

  useEffect(() => {
    if (ended || !trialEndsAt) return
    const target = new Date(trialEndsAt).getTime()
    const read = () => {
      const left = target - Date.now()
      setMsLeft(left <= 86_400_000 ? Math.max(0, left) : null)
    }
    read()
    const id = setInterval(read, 60_000)
    return () => clearInterval(id)
  }, [ended, trialEndsAt])

  const evidence = jobsTicked > 0 || streakCount > 1
    ? [
        jobsTicked > 0 ? `${jobsTicked} ${jobsTicked === 1 ? 'job' : 'jobs'} ticked` : null,
        streakCount > 1 ? `a ${streakCount} day streak` : null,
      ].filter(Boolean).join(' and ')
    : null

  if (ended) {
    return (
      <div style={{ background: 'var(--deep-teal)', borderRadius: '16px', padding: '16px 18px', marginBottom: '18px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: '#fff', marginBottom: '4px' }}>
          Your {trialDays} days of full access have finished
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: '0 0 12px' }}>
          {evidence
            ? `Your family has built ${evidence} since you joined. `
            : ''}
          Nothing is deleted: the daily habit, quests and your tracker stay free. The founder rate opens everything back up for £7.99 a month, held for life, and it stops at 50 families.
        </p>
        <Link href="/dashboard/upgrade" style={{ display: 'inline-flex', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px', padding: '10px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
          See the founder rate
        </Link>
      </div>
    )
  }

  // Inside the last day: the live clock. Hours and minutes, once a minute.
  if (msLeft !== null) {
    const h = Math.floor(msLeft / 3_600_000)
    const m = Math.floor((msLeft % 3_600_000) / 60_000)
    return (
      <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '14px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            ⏳ Full access ends in{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{h}:{pad(m)}</span>
          </span>
          <Link href="/dashboard/upgrade" style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px', padding: '9px 15px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
            Keep it all
          </Link>
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
          {evidence ? `${evidence[0].toUpperCase()}${evidence.slice(1)} so far. ` : ''}
          After today the daily habit stays free and the rest waits. The founder rate keeps everything open, £7.99 a month for life, capped at 50 families.
        </p>
      </div>
    )
  }

  // Days out: calm, warm, and counting.
  const daysLeft = trialEndsAt
    ? Math.max(1, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86_400_000))
    : trialDays
  return (
    <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '14px 18px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
          ✨ Full access · {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
        </span>
        <Link href="/dashboard/upgrade" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none', letterSpacing: '0.04em' }}>
          See membership →
        </Link>
      </div>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
        Everything is open while you settle in. Five to ten minutes a day, all the way to 16.
      </p>
    </div>
  )
}
