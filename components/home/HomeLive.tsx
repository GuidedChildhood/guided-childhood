'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import LiveTimerChip from '@/components/home/LiveTimerChip'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'

// The Now slot: the one place on Home where somebody is waiting on you.
//
// Phase 3 of the type plan, the pattern Justin approved from the mock: one
// way to say "this needs you", at three volumes. This is volume one. A single
// butter row at the top of Home, a pulse dot, a sentence naming who is
// waiting, one tap. Nothing else in the app may use this treatment, and there
// is only ever one: if two things qualify, the second waits its turn.
//
// WHAT EARNS A NOW. A person waiting on the parent right now. Two things
// qualify today, in this order:
//
//   1. Approvals. A child has done jobs and is stood there waiting for the
//      stars. The longest standing wait in the product and the reason the
//      slot exists.
//   2. The daily concern check in, when it is due. The streak of the whole
//      concern loop depends on it, and the child on the other end of the
//      concern is the person waiting, even if they do not know it.
//
// A feature being new or unread never qualifies. Unread notifications that
// are not approvals (ideas, DiGi) are a Today row, not a Now.
//
// WHY THE SLOT DOES NOT DISAPPEAR. A slot that vanishes teaches a parent
// nothing, because the absence of a card is indistinguishable from a card
// that failed to load. Deel's Upcoming actions and Airwallex's My tasks both
// keep the place and write the calm state, so the quiet day is a sentence,
// not a gap. Nothing is ever invented here: if there is genuinely nothing
// waiting, this says so in grey and takes one line.
//
// Buttons and links carry an explicit ink colour throughout. iOS Safari
// paints button text in Apple link blue otherwise, the lesson from the mock
// review on Justin's phone.

export default function HomeLive({
  checkinDue = false,
  childName = null,
}: {
  // Whether the daily concern check in is still waiting today, resolved by
  // the server from the same reading the path uses, so the two can never
  // disagree about whether the day still needs it.
  checkinDue?: boolean
  childName?: string | null
}) {
  // The approvals count, read here on the same cadence and the same wake ups
  // the notifications bell uses. null means not answered yet.
  const [urgent, setUrgent] = useState<number | null>(null)

  useEffect(() => {
    let live = true
    const refresh = () => {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(d => {
          if (!live) return
          const items = (d.items ?? []) as { urgent?: boolean }[]
          setUrgent(items.filter(i => i.urgent).length)
        })
        .catch(() => { if (live) setUrgent(0) })
    }
    refresh()
    const id = setInterval(refresh, 15000)
    const onVis = () => { if (!document.hidden) refresh() }
    window.addEventListener(NOTIFS_CHANGED_EVENT, refresh)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      live = false
      clearInterval(id)
      window.removeEventListener(NOTIFS_CHANGED_EVENT, refresh)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const name = childName && childName !== 'Your child' ? childName : null

  // The one Now, or nothing. Approvals outrank the check in because the
  // child is literally stood there; the check in takes the slot the moment
  // the approvals clear.
  const now =
    urgent !== null && urgent > 0
      ? {
          href: '/dashboard/notifications',
          title: `${urgent} ${urgent === 1 ? 'thing' : 'things'} to approve`,
          line: name ? `${name} is waiting on you` : 'Your child is waiting on you',
        }
      : checkinDue
        ? {
            href: '/dashboard/daily#checkin',
            title: 'Today’s check in is waiting',
            line: 'One tap, how is it going',
          }
        : null

  // First paint, before the approvals read has answered: hold the height of
  // the calm line so the page does not jump, and say nothing while unsure.
  if (urgent === null && !checkinDue) return <div style={{ height: 46, marginBottom: 14 }} aria-hidden />

  return (
    <>
      <style>{`
        @keyframes now-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(0.6); opacity: 0.55; }
        }
        .now-pulse { animation: now-pulse 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .now-pulse { animation: none; } }
      `}</style>
      <LiveTimerChip />
      {now ? (
        <Link href={now.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: 16, padding: '14px 16px',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}>
            <span aria-hidden className="now-pulse" style={{ flexShrink: 0, width: 10, height: 10, borderRadius: '50%', background: 'var(--ink)' }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
                {now.title}
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'rgba(26,26,46,0.72)', lineHeight: 1.3 }}>
                {now.line}
              </span>
            </span>
            <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
              →
            </span>
          </div>
        </Link>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16,
          padding: '13px 16px', marginBottom: 14,
        }}>
          <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: '#2F8F6B' }}>✓</span>
          <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
            Nothing waiting on you right now.
          </span>
        </div>
      )}
    </>
  )
}
