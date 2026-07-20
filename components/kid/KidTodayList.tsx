'use client'

import { useEffect, useState } from 'react'
import KidTickBurst from './KidTickBurst'
import { playKidSound } from '@/lib/sound/kidSounds'
import { TIMER_RULE } from '@/lib/quests/device-time'

// The ONE Today list: everything a child must do today, in one place, ticked
// in one flow. The family jobs due today (quest_ticks underneath, exactly as
// before), the Learn item (the next lesson for their stage) and the Move item
// (a real world thing, ticked on this device in localStorage), each with its
// stars. When a gift of screen time is still owed, one warm row asks for a
// job to say thanks, never a telling off. Under the list sits the quiet
// device rule, so the child always knows what using any screen means here.
//
// This replaces the old three surfaces (the Daily Three, the My jobs tile
// and the separate My to do today list) as presentation only: the engines
// (the localStorage day record and quest_ticks) are untouched.

// The Move ideas, banded by stage so a five year old and a fifteen year old
// each get something that fits. One idea a day, rotating through the list.
const MOVE_IDEAS: Record<number, { emoji: string; title: string }[]> = {
  1: [
    { emoji: '🌳', title: '20 minutes outside' },
    { emoji: '💧', title: 'Drink a big glass of water' },
    { emoji: '🕺', title: 'Dance to one whole song' },
    { emoji: '🧱', title: 'Build something with your hands' },
    { emoji: '⭐', title: 'Do ten big star jumps' },
    { emoji: '🍽️', title: 'Help set the table' },
  ],
  2: [
    { emoji: '🌳', title: '20 minutes outside' },
    { emoji: '💧', title: 'Drink a big glass of water' },
    { emoji: '🚲', title: 'Ride, scoot or run round the block' },
    { emoji: '🤸', title: 'Stretch tall, then touch your toes ten times' },
    { emoji: '📚', title: 'Read a real book for ten minutes' },
    { emoji: '🐕', title: 'Play outside with a pet or a friend' },
  ],
  3: [
    { emoji: '🌳', title: '20 minutes outside' },
    { emoji: '💧', title: 'Drink a big glass of water' },
    { emoji: '🏃', title: 'A quick run or a fast walk' },
    { emoji: '🤸', title: 'A five minute stretch break' },
    { emoji: '🎧', title: 'One song, eyes closed, just listening' },
    { emoji: '🥪', title: 'Make your own snack from scratch' },
  ],
  4: [
    { emoji: '🌳', title: '20 minutes outside, no phone' },
    { emoji: '💧', title: 'Drink a big glass of water' },
    { emoji: '🏋️', title: 'Ten minutes of proper exercise' },
    { emoji: '🧘', title: 'Five slow breaths, shoulders down' },
    { emoji: '🍳', title: 'Cook or prep one real thing' },
    { emoji: '🚶', title: 'Walk somewhere you usually get a lift' },
  ],
  5: [
    { emoji: '🌳', title: '20 minutes outside, no phone' },
    { emoji: '💧', title: 'Drink a big glass of water' },
    { emoji: '🏋️', title: 'A real workout, your choice' },
    { emoji: '🧘', title: 'Ten minutes fully offline, on purpose' },
    { emoji: '🍳', title: 'Cook something proper' },
    { emoji: '😴', title: 'Screens away an hour before bed tonight' },
  ],
}

// The same day record the Daily Three kept, so nothing a child already
// ticked is ever lost by this rework.
const DAY_STORE_KEY = 'gc_kid_daily3'

type DayRecord = { date: string; move: boolean; learn: boolean; celebrated: boolean }

function localDateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function loadDay(dateKey: string): DayRecord {
  const empty: DayRecord = { date: dateKey, move: false, learn: false, celebrated: false }
  try {
    const raw = localStorage.getItem(DAY_STORE_KEY)
    if (!raw) return empty
    const rec = JSON.parse(raw) as DayRecord
    return rec.date === dateKey ? rec : empty
  } catch { return empty }
}

function saveDay(rec: DayRecord) {
  try { localStorage.setItem(DAY_STORE_KEY, JSON.stringify(rec)) } catch { /* private mode, the tick still shows now */ }
}

export type TodayQuest = { id: string; title: string; emoji: string; stars: number; blocks_screens?: boolean }

export default function KidTodayList({
  childName, stageId, buddyName, buddyImg, buddyIsStar,
  learnTitle, learnEmoji, learnStars, learnDoneLive, allLessonsDone, onLearnTap,
  quests, ticks, onToggleQuest, burstQuestId,
  giftStarsOwed = 0,
  inkSoft,
  onCelebrate,
}: {
  childName: string
  stageId: number
  buddyName: string
  buddyImg: string
  buddyIsStar: boolean
  learnTitle: string | null
  learnEmoji: string | null
  learnStars: number | null
  learnDoneLive: boolean
  allLessonsDone: boolean
  onLearnTap: () => void
  quests: TodayQuest[]
  ticks: Record<string, string>
  onToggleQuest: (quest: TodayQuest) => void
  burstQuestId: string | null
  giftStarsOwed?: number
  inkSoft: string
  onCelebrate: () => void
}) {
  // null until mounted so the first client paint matches the server; the
  // date driven bits settle right after, same pattern as the school banner.
  const [now, setNow] = useState<Date | null>(null)
  const [moveDone, setMoveDone] = useState(false)
  const [learnStored, setLearnStored] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const [moveBurst, setMoveBurst] = useState(false)

  useEffect(() => {
    const d = new Date()
    setNow(d)
    const rec = loadDay(localDateKey(d))
    setMoveDone(rec.move)
    setLearnStored(rec.learn)
    setCelebrated(rec.celebrated)
  }, [])

  const learnDone = learnDoneLive || learnStored

  // A lesson finished in this session sticks to today, so a refresh keeps
  // the Learn row ticked even though the server only knows lessons ever done.
  useEffect(() => {
    if (!now || !learnDoneLive || learnStored) return
    const rec = loadDay(localDateKey(now))
    saveDay({ ...rec, learn: true })
    setLearnStored(true)
  }, [now, learnDoneLive, learnStored])

  const jobsTicked = quests.filter(q => ticks[q.id]).length
  const jobsAllDone = quests.every(q => ticks[q.id])
  const allDone = jobsAllDone && learnDone && moveDone
  const total = quests.length + 2
  const doneCount = jobsTicked + Number(learnDone) + Number(moveDone)

  // The one big celebration, once per day, when the last row lands.
  useEffect(() => {
    if (!now || !allDone || celebrated) return
    const rec = loadDay(localDateKey(now))
    saveDay({ ...rec, learn: rec.learn || learnDone, move: rec.move || moveDone, celebrated: true })
    setCelebrated(true)
    onCelebrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, allDone, celebrated])

  function tickMove() {
    if (moveDone || !now) return
    setMoveDone(true)
    const rec = loadDay(localDateKey(now))
    saveDay({ ...rec, move: true })
    playKidSound('star')
    setMoveBurst(true)
    setTimeout(() => setMoveBurst(false), 900)
  }

  // The buddy's one line: time of day aware, moving along with the list.
  const hour = now ? now.getHours() : null
  const tod = hour === null ? 'Hi' : hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'
  const left = total - doneCount
  const line =
    allDone ? 'All done. Superstar.'
    : doneCount === 0 ? 'One thing at a time.'
    : left === 1 ? 'Nearly there. One to go.'
    : `${doneCount} done. ${left} to go.`

  // Today's Move idea rotates by the day of the year, banded by stage.
  const band = Math.min(5, Math.max(1, stageId))
  const ideas = MOVE_IDEAS[band]
  const dayOfYear = now ? Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000) : 0
  const moveIdea = ideas[dayOfYear % ideas.length]

  const buddyFace = (size: number) => (
    <span style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#FFF7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 0 rgba(26,26,46,0.15)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {buddyIsStar
        ? <img src={buddyImg} alt="" style={{ width: Math.round(size * 0.68), height: Math.round(size * 0.68) }} />
        : <img src={buddyImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />}
    </span>
  )

  // One row shape for everything: a small mono eyebrow saying what kind of
  // thing it is, the big title, the stars, and the round tick mark that shows
  // its state. Jobs tick straight into quest_ticks through onToggleQuest,
  // Learn opens the lesson, Move ticks locally.
  type Row = {
    key: string
    kind: string
    emoji: string
    title: string
    sub: string
    state: 'todo' | 'waiting' | 'done'
    tappable: boolean
    burst: boolean
    beforeScreens: boolean
    onTap: () => void
  }

  // Once the grown up gives the final approval the job leaves the list for
  // good: the child gets the celebration pop and the stars land in the bank,
  // and the list stays only the things still to do or waiting. The done count
  // above still includes them, so progress never looks like it went backwards.
  const jobRows: Row[] = [...quests]
    .filter(q => ticks[q.id] !== 'approved')
    .sort((a, b) => Number(Boolean(b.blocks_screens)) - Number(Boolean(a.blocks_screens)))
    .map(q => {
      const st = ticks[q.id]
      const state: Row['state'] = st === 'approved' ? 'done' : st === 'pending' ? 'waiting' : 'todo'
      return {
        key: q.id,
        kind: 'Job',
        emoji: q.emoji,
        title: q.title,
        sub: state === 'done' ? 'Done! Stars landed ⭐'
          : state === 'waiting' ? 'With your grown up now, nothing to do'
          : `Worth ${q.stars} star${q.stars === 1 ? '' : 's'}`,
        state,
        tappable: state !== 'done',
        burst: burstQuestId === q.id,
        beforeScreens: Boolean(q.blocks_screens) && state !== 'done',
        onTap: () => onToggleQuest(q),
      }
    })

  const learnRow: Row = {
    key: 'learn',
    kind: 'Learn',
    emoji: learnDone ? '🏆' : (learnEmoji ?? '🧠'),
    title: learnDone
      ? (allLessonsDone && !learnDoneLive ? 'Every lesson done' : 'Lesson done')
      : (learnTitle ?? 'A lesson for you'),
    sub: learnDone
      ? 'Big brain. Stars with your grown up ⭐'
      : learnStars ? `2 minutes · worth ${learnStars} star${learnStars === 1 ? '' : 's'}` : '2 minutes of clever',
    state: learnDone ? 'done' : 'todo',
    tappable: !learnDone,
    burst: false,
    beforeScreens: false,
    onTap: onLearnTap,
  }

  const moveRow: Row = {
    key: 'move',
    kind: 'Move',
    emoji: moveDone ? '🌟' : moveIdea.emoji,
    title: moveDone ? 'Moved and done' : moveIdea.title,
    sub: moveDone ? 'Your body says thank you.' : 'Away from the screen, then tap it done',
    state: moveDone ? 'done' : 'todo',
    tappable: !moveDone,
    burst: moveBurst,
    beforeScreens: false,
    onTap: tickMove,
  }

  const rows = [...jobRows, learnRow, moveRow]

  const rowCard = (r: Row) => {
    const done = r.state === 'done'
    const waiting = r.state === 'waiting'
    return (
      <button
        key={r.key}
        onClick={r.onTap}
        disabled={!r.tappable}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
          background: done ? 'var(--tint-sage)' : waiting ? '#FFF7E0' : '#fff',
          border: waiting ? '1.5px dashed var(--terracotta)' : 'none',
          borderRadius: '20px', padding: '15px 17px',
          cursor: r.tappable ? 'pointer' : 'default',
          boxShadow: done ? '0 2px 0 rgba(0,0,0,0.10)' : waiting ? 'none' : '0 5px 0 rgba(0,0,0,0.18)',
          transform: done ? 'translateY(3px)' : 'none',
          transition: 'all 0.15s ease',
          animation: r.burst ? 'kid-pop 0.5s ease' : undefined,
        }}
      >
        <span style={{ fontSize: '1.7rem', flexShrink: 0, opacity: waiting ? 0.85 : 1 }}>{r.emoji}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: done ? 'var(--ink-muted)' : 'var(--terracotta-dark)' }}>
            {r.kind}
          </span>
          <span style={{
            display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.12rem', color: 'var(--ink)', lineHeight: 1.25, marginTop: 1,
            textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1,
          }}>
            {r.title}
          </span>
          <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: waiting ? 'var(--terracotta-dark)' : 'var(--ink-muted)', marginTop: 2, lineHeight: 1.3 }}>
            {r.sub}
            {r.beforeScreens && (
              <span style={{
                display: 'inline-block', marginLeft: 8, verticalAlign: 'middle',
                fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'var(--terracotta-lt)', color: 'var(--terracotta-dark)',
                border: '1px solid var(--terracotta)', borderRadius: '100px', padding: '2px 8px',
              }}>
                📵 Before screens
              </span>
            )}
          </span>
        </span>
        <span style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: done ? 'var(--terracotta)' : waiting ? 'var(--terracotta-lt)' : 'var(--cream)',
          border: done ? 'none' : waiting ? '1.5px solid var(--terracotta)' : '2.5px dashed var(--ink-light)',
          fontSize: '18px',
        }}>
          {done ? '✓' : waiting ? '⏳' : ''}
          {r.burst && <KidTickBurst />}
        </span>
      </button>
    )
  }

  return (
    <div id="my-todo" style={{ marginBottom: '18px', scrollMarginTop: '12px' }}>
      {/* The buddy's one line above the list. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        {buddyFace(38)}
        <div style={{
          background: '#fff', borderRadius: '4px 16px 16px 16px', padding: '9px 14px',
          border: '1.5px solid rgba(26,26,46,0.08)', boxShadow: '0 3px 0 rgba(26,26,46,0.08)',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.35 }}>
            {tod} {childName}. {line}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: inkSoft }}>
          Today
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: inkSoft }}>
          {doneCount} of {total}
        </span>
      </div>

      {/* A gift of screen time was given ahead of the jobs. One warm row while
          any of it is still owed: a gift is a gift, the pay back is a thank
          you, and the next approved job settles it by itself. */}
      {giftStarsOwed > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '20px', padding: '13px 17px', marginBottom: '12px',
        }}>
          <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>💛</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.25 }}>
              Pay back the gift
            </span>
            <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-soft)', marginTop: 2 }}>
              do a job to say thanks · {giftStarsOwed} star{giftStarsOwed === 1 ? '' : 's'} of gifted time
            </span>
          </span>
        </div>
      )}

      {allDone ? (
        // The proud strip: the day is done, the list gets out of the way.
        <div style={{
          display: 'flex', alignItems: 'center', gap: 13,
          background: 'var(--tint-sage)', borderRadius: '20px', padding: '15px 18px',
          border: '1.5px solid rgba(26,26,46,0.08)', boxShadow: '0 5px 0 rgba(26,26,46,0.12)',
        }}>
          <span style={{ fontSize: '1.9rem', lineHeight: 1, flexShrink: 0 }}>🏅</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', lineHeight: 1.15 }}>
              Today is done
            </span>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', marginTop: 2 }}>
              Every job, plus Learn and Move. Amazing work {childName}!
            </span>
          </span>
          {buddyFace(40)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {rows.map(rowCard)}
        </div>
      )}

      {/* The device rule, quiet but always here: what using any screen means. */}
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.03em', color: inkSoft, lineHeight: 1.6, margin: '12px 6px 0' }}>
        {TIMER_RULE}
      </p>
    </div>
  )
}
