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
//   4. THE ENDING IS SAID PLAINLY. Nothing is deleted and the copy says so,
//      but it no longer says the daily habit stays free, because it does not.
//      Migration 187 closed the free tier and the middleware locks the whole
//      dashboard on day five. Promising a soft landing the product does not
//      give is worse than the news it was trying to soften.
//
// ── AND IT SPEAKS TO THE PATH THEY TOOK ─────────────────────────────────────
//
// Justin, 14 August 2026: the founder rate is claimed at sign up, with a card,
// and the no card path holds no place. So this banner cannot go on offering
// founder places to somebody who declined one four days ago. planChoice is why
// it knows.

function pad(n: number): string { return String(n).padStart(2, '0') }

export default function TrialCountdown({
  trialEndsAt,
  ended,
  trialDays,
  planChoice = null,
  jobsTicked = 0,
  streakCount = 0,
}: {
  /** ISO timestamp of the trial's real end. Null only when ended is true. */
  trialEndsAt: string | null
  /** The after state: trial over, no subscription. */
  ended: boolean
  /** TRIAL_DAYS from lib/access, so this copy can never disagree with the gate. */
  trialDays: number
  /**
   * Which of the two paths they took at sign up: 'founder', 'free', or null
   * while the choice is still owed. It decides whether the founder rate is
   * mentioned at all, because on the no card path there is no place to hold.
   */
  planChoice?: string | null
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

  // A card is on file and a place is held, so this banner is a reassurance
  // rather than an offer. Nothing here asks them to buy something they have
  // already bought, and nothing offers a founder place to the parent who
  // declined one at sign up.
  const isFounderPath = planChoice === 'founder'

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
          {/* Justin, 8 August 2026: "should it be has?"
              No, and the reason his ear snagged is worth keeping. The subject
              is "days", which is plural, so "have" is the correct agreement
              and "has" would be wrong. What is actually off is the verb: a
              stretch of time does not finish, it ends. People finish things.
              So "have finished" reads stilted, and a stilted sentence is the
              kind you reread wondering if it is broken. "Are over" is plain,
              it is what anybody would say out loud, and it matches "Full
              access ends in" on the card this one replaces. */}
          Your {trialDays} days of full access are over
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: '0 0 12px' }}>
          {evidence
            ? `Your family has built ${evidence} since you joined. `
            : ''}
          Nothing is deleted. Everything your family has done is saved and comes straight back the moment you join{isFounderPath ? ', at your founder rate of £7.99 a month, held for life' : ': £12.99 a month or £99 a year'}.
        </p>
        <Link href="/dashboard/upgrade" style={{ display: 'inline-flex', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px', padding: '10px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
          {isFounderPath ? 'See the founder rate' : 'See the plans'}
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
            ⏳ Free days end in{' '}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{h}:{pad(m)}</span>
          </span>
          {!isFounderPath && (
            <Link href="/dashboard/upgrade" style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px', padding: '9px 15px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
              Keep it all
            </Link>
          )}
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
          {evidence ? `${evidence[0].toUpperCase()}${evidence.slice(1)} so far. ` : ''}
          {isFounderPath
            ? 'After today your founder rate of £7.99 a month starts and everything opens up: unlimited DiGi and every script. Nothing to do, and cancelling before then still costs nothing.'
            : 'After today the app waits until you join. £12.99 a month or £99 a year, and everything you have done is saved.'}
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
          ✨ Free {daysLeft === 1 ? 'day' : 'days'} · {daysLeft} left
        </span>
        {/* A REAL BUTTON, NOT A MONO TEXT LINK, and Justin found this by
            trying to buy his own product: "I signed up again but there is no
            clear way to sign up and pay."
            The route existed. It was "See membership" set in the mono label
            face at the smallest size in the system, sitting where an eyebrow
            usually goes, which is the styling this app uses for captions a
            parent is meant to skim past. So the one control on Home that takes
            money was drawn to be ignored, and it worked.
            The last day branch above already uses a proper chunky button. This
            is the same offer four days earlier, and there is no argument for
            making it harder to accept while somebody is still keen. */}
        {!isFounderPath && (
          <Link href="/dashboard/upgrade" style={{ flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px', padding: '9px 15px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
            See the plans
          </Link>
        )}
      </div>
      {/* The price and the cap belong here rather than only at the end. A
          parent deciding on day one cannot decide on nothing, and the founder
          rate is the one offer in the product with a real deadline attached to
          it: fifty families, enforced in checkout, gone for ever after that. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
        {isFounderPath
          ? `Your founder place is held. DiGi has a daily limit and a starter set of scripts for these ${trialDays} days, then £7.99 a month starts and everything opens up. Cancel any time before and pay nothing.`
          : `DiGi has a daily limit and a starter set of scripts for these ${trialDays} days. When they end the app waits until you join, at £12.99 a month or £99 a year.`}
      </p>
    </div>
  )
}
