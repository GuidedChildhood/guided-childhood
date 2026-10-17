'use client'

import { useEffect, useState } from 'react'
import { milestoneFor } from '@/lib/pathway/parent-milestones'
import Link from 'next/link'
import Celebration from '@/components/ui/Celebration'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'
import { openPopup, closePopup } from '@/lib/ui/popupQueue'
import { CRAYON, HAPPY } from '@gc/shared/happy-news'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

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
  /** How many steps the road had, for the "steps" tile. */
  stepsDone?: number
  /** Minutes spent today, for the "minutes" tile. */
  minutes?: number
  onClose: () => void
}

const NAME = 'dayflow'

export default function DayCompleteFlow({ childName, childId, streakCount, facts, quests, stepsDone, minutes, onClose }: Props) {
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

  // A milestone reached today is named, once, on the first beat: a perfect
  // week, a month, a hundred days (lib/pathway/parent-milestones.ts). The
  // parent earned a number and nothing was ever said about it.
  const milestone = milestoneFor(streakCount)
  const beats = [
    {
      icon: 'cheer' as HappyIconName,
      title: milestone ? milestone.title : 'Today is made',
      // ── WHAT THIS SCREEN IS CONGRATULATING (11 September 2026) ───────────
      //
      // It said "the one thing that matters today is done", which was true
      // when this fired on the lead rung alone. It fires on the WHOLE road
      // now, and congratulating a parent for one thing when they did five
      // reads as not having noticed.
      body: milestone
        ? milestone.line
        : streakCount >= 2
          ? `The whole road, walked, and that is ${streakCount} days in a row now. Small and daily beats big and rarely, every time.`
          : 'The whole road, walked. Small and daily beats big and rarely, every time.',
      action: null as null | { label: string; href: string },
      next: 'Keep going',
    },
    {
      icon: 'balance' as HappyIconName,
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
      icon: 'wins' as HappyIconName,
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
      icon: 'phonebed' as HappyIconName,
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
  // A Planet Friend cheers the finish, a different one as the streak grows,
  // the way Duolingo puts a character over "Lesson complete!".
  const cheer = STAGE_CHARACTERS[Math.max(0, streakCount) % STAGE_CHARACTERS.length]
  // The plate behind each beat's picture: one crayon each, so the four beats
  // read as four different things rather than one card four times.
  const PLATES = [CRAYON.pink, CRAYON.green, CRAYON.teal, CRAYON.sky]

  // ── THE THREE TILES, DUOLINGO'S "LESSON COMPLETE" (17 October 2026) ──────
  // mobbin.com/flows/40841c36-1296-4b96-95a1-1e1c60c64b83: a character, a
  // big headline, and three coloured tiles saying what was earned. Ours say
  // the streak, the steps and the minutes, which is the achievement Justin
  // asked for ("so parents don't think it's endless"), counted.
  const tiles = [
    { label: 'Streak', value: `${Math.max(1, streakCount)} ${Math.max(1, streakCount) === 1 ? 'day' : 'days'}`, tone: HAPPY.coral, text: 'var(--ink)', icon: 'flame' as HappyIconName },
    ...(stepsDone ? [{ label: 'Steps', value: `${stepsDone} of ${stepsDone}`, tone: HAPPY.green, text: 'var(--white)', icon: 'wins' as HappyIconName }] : []),
    ...(minutes ? [{ label: 'Minutes', value: `${minutes}`, tone: HAPPY.sky, text: 'var(--ink)', icon: 'time' as HappyIconName }] : []),
  ]

  return (
    // ── A WHOLE SCREEN, NOT A CARD ON A DARK SHEET ────────────────────────
    // The close used to be a small cream card on espresso. Duolingo's finish
    // is the whole screen, white, with the button in the thumb at the
    // bottom and a cross at the top, and it lands as a moment rather than a
    // dialog. Same four beats, same words, same once a day guard.
    <div
      role="dialog"
      aria-label="Day complete"
      style={{
        position: 'fixed', inset: 0, zIndex: 130,
        background: 'var(--white)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 20px calc(env(safe-area-inset-bottom, 0px) + 20px)',
        overflowY: 'auto',
      }}
    >
      {beat === 0 && <Celebration fire />}

      {/* The cross and the four dots, on one row */}
      <div style={{ width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 44, height: 44, flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink-muted)', lineHeight: 1,
          }}
        >
          ×
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 8, marginRight: 56 }} aria-hidden>
          {beats.map((_, i) => (
            <span key={i} style={{
              width: i === beat ? 22 : 8, height: 8, borderRadius: 'var(--radius-pill)',
              background: i <= beat ? HAPPY.green : 'var(--border)',
              transition: 'all 0.25s',
            }} />
          ))}
        </div>
      </div>

      <div style={{
        width: '100%', maxWidth: 440, flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '12px 0',
      }}>
        {/* The picture: the Friend cheering on the first beat, the beat's
            own drawing after, each on its Happy News plate. */}
        <div aria-hidden style={{
          width: 148, height: 148, borderRadius: '50%', background: PLATES[beat % PLATES.length],
          border: 'var(--edge)', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
        }}>
          {beat === 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cheer.cutout} alt="" width={124} height={124} style={{ display: 'block', width: 124, height: 124, objectFit: 'contain' }} />
          ) : (
            <HappyIcon name={b.icon} size={80} />
          )}
        </div>
        <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1, textWrap: 'balance' }}>
          {b.title}
        </h2>
        <p style={{ margin: '0 0 20px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, maxWidth: '34ch', textWrap: 'pretty' }}>
          {b.body}
        </p>

        {beat === 0 && (
          <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'center' }}>
            {tiles.map(t => (
              <div key={t.label} style={{
                flex: '1 1 0', minWidth: 0, maxWidth: 132, borderRadius: 16, border: `2.5px solid ${t.tone}`,
                background: t.tone, overflow: 'hidden', boxShadow: `0 4px 0 ${t.tone}`,
              }}>
                <div style={{ padding: '5px 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.text }}>
                  {/* Ink on coral and sky, white on green: each the pairing
                      that clears 4.5 to 1 at this size. */}
                  {t.label}
                </div>
                <div style={{
                  background: 'var(--white)', borderRadius: 13, padding: '12px 4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <span aria-hidden style={{ lineHeight: 0 }}><HappyIcon name={t.icon} size={22} /></span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{t.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The buttons, in the thumb */}
      <div style={{ width: '100%', maxWidth: 440 }}>
        {b.action && (
          <Link
            href={b.action.href}
            onClick={() => closePopup(NAME)}
            style={{
              display: 'block', textDecoration: 'none', marginBottom: 12, textAlign: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              color: 'var(--ink)', background: 'var(--white)',
              border: 'var(--edge)', borderRadius: 'var(--radius-btn)', padding: '13px 0',
              boxShadow: 'var(--lift)',
            }}
          >
            {b.action.label} ›
          </Link>
        )}

        <button
          onClick={() => (last ? onClose() : setBeat(beat + 1))}
          style={{
            display: 'block', width: '100%', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
            color: 'var(--ink)', background: 'var(--terracotta)',
            border: 'var(--edge)', borderRadius: 'var(--radius-btn)', padding: '15px 0',
            boxShadow: 'var(--lift)',
          }}
        >
          {b.next}
        </button>
      </div>
    </div>
  )
}
