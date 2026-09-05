'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Celebration from '@/components/ui/Celebration'
import { openPopup, closePopup } from '@/lib/ui/popupQueue'

// The close of the day, as a proper moment rather than a folded card.
//
// Justin, 1 September 2026: "once they have done the ticks for the day it
// takes them to advise what to set to stay simple and balance device use and
// explains device settings and child app checks the balance and encourages
// offline use ... then quests then see you tomorrow."
//
// Four beats, one screen each, tap to move on, in the order he named:
//
//   1. DONE     the tick landed, confetti, the streak.
//   2. BALANCE  the healthy guide for this child's age, what to set (with
//               the settings sweep when one is due), how the child app keeps
//               the balance with them, and the offline nudge.
//   3. QUESTS   say yes to what is waiting, or set the first job.
//   4. TOMORROW tomorrow's focus named, so the loop hooks like Duolingo:
//               a parent leaves knowing exactly what one thing comes next.
//
// Shown once per day (the opener guards that), through the popup queue so it
// never lands on top of another sheet.

export type DayCloseFacts = {
  next_line?: string | null
  guide_mins?: number | null
  band_label?: string | null
}

type QuestBeat = { label: string; href: string; done: boolean }

type Props = {
  childName?: string
  childId?: string | null
  streakCount: number
  facts: DayCloseFacts | null
  quests: QuestBeat | null
  onClose: () => void
}

const NAME = 'dayflow'

export default function DayCompleteFlow({ childName, childId, streakCount, facts, quests, onClose }: Props) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const [beat, setBeat] = useState(0)
  const [sweepDue, setSweepDue] = useState(false)

  useEffect(() => {
    openPopup(NAME)
    return () => closePopup(NAME)
  }, [])

  // Whether a settings sweep is due, so the balance beat can carry the real
  // next action rather than a generic settings link. Failing quiet: the beat
  // reads fine without it.
  useEffect(() => {
    const qs = childId ? `?child=${childId}` : ''
    fetch(`/api/devices/sweep${qs}`)
      .then(r => r.json())
      .then(j => { if (j?.due) setSweepDue(true) })
      .catch(() => { /* the card stands on its own */ })
  }, [childId])

  const withChild = (href: string) =>
    childId ? `${href}${href.includes('?') ? '&' : '?'}child=${childId}` : href

  const beats = [
    {
      emoji: '🎉',
      title: 'Today is made',
      body: streakCount >= 2
        ? `The one thing that matters today is done, and that is ${streakCount} days in a row now. Small and daily beats big and rarely, every time.`
        : 'The one thing that matters today is done. Small and daily beats big and rarely, every time.',
      action: null as null | { label: string; href: string },
      next: 'Keep going',
    },
    {
      emoji: '⚖️',
      title: 'The balance, kept simple',
      body: facts?.guide_mins
        ? `For ages ${facts.band_label}, around ${facts.guide_mins} minutes of fun screen a day is a healthy guide. ${kid}'s app checks this balance with them, so the settings do the holding, not you. The best trade is always the offline one: a kickabout, a board game, anything together.`
        : `${kid}'s app checks the screen balance with them, so the settings do the holding, not you. The best trade is always the offline one: a kickabout, a board game, anything together.`,
      action: sweepDue
        ? { label: 'A quick settings check is due', href: withChild('/dashboard/devices') }
        : { label: 'What to set for their age', href: withChild('/dashboard/devices') },
      next: 'Next',
    },
    {
      emoji: '⭐',
      title: quests
        ? quests.label === 'Approve'
          ? `${kid} is waiting on a yes`
          : quests.label === 'First job'
            ? 'One job starts the stars'
            : 'The jobs are ticking along'
        : 'The jobs are ticking along',
      body: quests
        ? quests.label === 'Approve'
          ? 'Something has been ticked and a real person is waiting on you. A quick yes tonight lands better than a long chat tomorrow.'
          : quests.label === 'First job'
            ? 'Real world jobs earn the stars that buy screen time. Setting the first one takes a minute and starts the whole loop.'
            : 'Nothing is waiting on you. The stars are doing their quiet work.'
        : 'Nothing is waiting on you tonight.',
      action: quests && !quests.done ? { label: quests.label === 'Approve' ? 'Say yes' : 'Set the first job', href: quests.href } : null,
      next: 'Next',
    },
    {
      emoji: '🌙',
      title: 'See you tomorrow',
      body: facts?.next_line
        ? `${facts.next_line}. That is the whole of tomorrow: one tick, a few minutes, and the road waits if life gets in the way.`
        : 'Tomorrow is one tick and a few minutes, and the road waits if life gets in the way.',
      action: null,
      next: 'Goodnight',
    },
  ]

  const b = beats[beat]
  const last = beat === beats.length - 1

  return (
    <div
      role="dialog"
      aria-label="Day complete"
      style={{
        position: 'fixed', inset: 0, zIndex: 130,
        background: 'var(--deep-teal)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 20px calc(env(safe-area-inset-bottom, 0px) + 20px)',
      }}
    >
      {beat === 0 && <Celebration fire />}

      {/* The four dots, so the parent knows this is a short walk, not a wall */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }} aria-hidden>
        {beats.map((_, i) => (
          <span key={i} style={{
            width: i === beat ? 22 : 8, height: 8, borderRadius: 100,
            background: i <= beat ? 'var(--terracotta)' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.25s',
          }} />
        ))}
      </div>

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--cream)', borderRadius: 24,
        border: '2px solid var(--ink)', boxShadow: '0 6px 0 var(--ink)',
        padding: '28px 24px 22px', textAlign: 'center',
      }}>
        <div aria-hidden style={{ fontSize: 46, lineHeight: 1, marginBottom: 12 }}>{b.emoji}</div>
        <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
          {b.title}
        </h2>
        <p style={{ margin: '0 0 18px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          {b.body}
        </p>

        {b.action && (
          <Link
            href={b.action.href}
            onClick={() => closePopup(NAME)}
            style={{
              display: 'block', textDecoration: 'none', marginBottom: 12,
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              color: 'var(--ink)', background: '#fff',
              border: '2px solid var(--ink)', borderRadius: 16, padding: '13px 0',
              boxShadow: '0 4px 0 var(--ink)',
            }}
          >
            {b.action.label} ›
          </Link>
        )}

        <button
          onClick={() => (last ? onClose() : setBeat(beat + 1))}
          style={{
            display: 'block', width: '100%', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
            color: 'var(--ink)', background: 'var(--terracotta)',
            border: '2px solid var(--ink)', borderRadius: 16, padding: '15px 0',
            boxShadow: '0 4px 0 var(--ink)',
          }}
        >
          {b.next}
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.06em', color: 'var(--ink-muted)',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
