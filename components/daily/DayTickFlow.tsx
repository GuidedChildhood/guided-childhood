'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Celebration from '@/components/ui/Celebration'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'
import { milestoneFor } from '@/lib/pathway/parent-milestones'
import { openPopup, closePopup } from '@/lib/ui/popupQueue'
import type { DayCloseFacts } from '@/components/daily/DayCompleteFlow'

// ── THE TEN MINUTES, CONFIRMED (25 September 2026) ─────────────────────────
//
// Justin: "on parents app, clear confirmation they have done their 10 mins
// and confirming what happens next, refer to Duolingo on how to achieve this
// loop."
//
// Until now the moment the day COUNTED (the lead rung landing, which is what
// keeps the streak) said so in a small box at the foot of a long card, under
// the whole path. Only walking every rung opened a proper close
// (DayCompleteFlow). So the thing a parent does every day was the one thing
// never clearly confirmed.
//
// Duolingo's loop is three screens after a lesson, each one tap: the lesson
// is complete with what you earned, the streak grows with the flame, then
// what is next (a daily quest, or tomorrow). This is that loop in our words:
//
//   1. DONE      your minutes are done, today counts, and what you did.
//   2. STREAK    the run, named, and what tomorrow makes it.
//   3. NEXT      tomorrow's one thing, and what is left today if there is
//                time, which is an invitation, never a to do.
//
// Once a day, on the visit where the tick landed (the caller guards that), and
// never on a day the whole path finished at once, because the full close says
// all of this and more.

type Props = {
  childName?: string
  minutes: number
  /** Consecutive days INCLUDING today. */
  streak: number
  doneLabels: string[]
  left: number
  next: { label: string; href: string } | null
  facts: DayCloseFacts | null
  onClose: () => void
}

const NAME = 'daytick'

export default function DayTickFlow({ childName, minutes, streak, doneLabels, left, next, facts, onClose }: Props) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    openPopup(NAME)
    return () => closePopup(NAME)
  }, [])

  const milestone = milestoneFor(streak)
  const did = doneLabels.length > 0 ? doneLabels.join(', ') : null

  const beats: { icon: HappyIconName; title: string; body: string; chips?: string[] }[] = [
    {
      icon: 'cheer',
      title: `Your ${minutes} minutes, done`,
      body: `Today counts for ${kid}.${did ? ` You did: ${did}.` : ''}`,
      chips: [`🔥 ${streak} day${streak === 1 ? '' : 's'}`, `✓ ${doneLabels.length} done`],
    },
    {
      icon: 'wins',
      title: milestone ? milestone.title : `${streak} day streak`,
      body: milestone
        ? milestone.line
        : streak === 1
          ? 'Day one. Come back tomorrow and it becomes two. Small and daily beats big and rarely.'
          : `${streak} days in a row. Tomorrow makes it ${streak + 1}.`,
    },
    {
      icon: 'phonebed',
      title: 'What happens next',
      body: [
        // focusLine reads "A lesson day: the next one ...", so it joins as
        // "Tomorrow is a lesson day: ..." rather than stacking two colons.
        facts?.next_line
          ? `Tomorrow is ${facts.next_line.charAt(0).toLowerCase()}${facts.next_line.slice(1)}.`
          : 'Tomorrow is one tick and a few minutes.',
        left > 0
          ? `${left} more on today's path, only if you have the time. Your streak is already safe.`
          : 'Nothing else is waiting on you today.',
      ].join(' '),
    },
  ]

  const b = beats[beat]
  const last = beat === beats.length - 1

  return (
    <div
      role="dialog"
      aria-label="Today's minutes done"
      data-day-tick-flow
      style={{
        position: 'fixed', inset: 0, zIndex: 130,
        background: 'var(--deep-teal)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 20px calc(env(safe-area-inset-bottom, 0px) + 20px)',
      }}
    >
      {beat === 0 && <Celebration fire />}

      {/* Three dots: a short walk, not a wall. */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }} aria-hidden>
        {beats.map((_, i) => (
          <span key={i} style={{
            width: i === beat ? 22 : 8, height: 8, borderRadius: 'var(--radius-pill)',
            background: i <= beat ? 'var(--terracotta)' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.25s',
          }} />
        ))}
      </div>

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--cream)', borderRadius: 'var(--radius-card)',
        border: 'var(--edge)', boxShadow: '0 6px 0 var(--ink)',
        padding: '28px 24px 22px', textAlign: 'center',
      }}>
        {beat === 1 ? (
          // The streak beat wears the flame, big, the way Duolingo's does.
          <div aria-hidden style={{ fontSize: 64, lineHeight: 1, margin: '0 auto 10px' }}>🔥</div>
        ) : (
          <div aria-hidden style={{
            width: 64, height: 64, borderRadius: '50%', background: '#fff', border: 'var(--edge)', boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}><HappyIcon name={b.icon} size={40} /></div>
        )}
        <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
          {b.title}
        </h2>
        {b.chips && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '0 0 12px' }}>
            {b.chips.map(c => (
              <span key={c} style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)',
                background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-pill)', padding: '6px 12px',
              }}>{c}</span>
            ))}
          </div>
        )}
        <p style={{ margin: '0 0 18px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          {b.body}
        </p>

        {last && left > 0 && next && (
          <Link
            href={next.href}
            onClick={() => { closePopup(NAME); onClose() }}
            style={{
              display: 'block', textDecoration: 'none', marginBottom: 12,
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              color: 'var(--ink)', background: '#fff',
              border: 'var(--edge)', borderRadius: 16, padding: '13px 0',
              boxShadow: '0 5px 0 var(--ink)',
            }}
          >
            Keep going: {next.label} ›
          </Link>
        )}

        <button
          onClick={() => (last ? onClose() : setBeat(beat + 1))}
          style={{
            display: 'block', width: '100%', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
            color: 'var(--ink)', background: 'var(--terracotta)',
            border: 'var(--edge)', borderRadius: 16, padding: '15px 0',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          {last ? 'Done for today' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
