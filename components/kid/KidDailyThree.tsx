'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import KidTickBurst from './KidTickBurst'
import KidRoad from './KidRoad'
import { playKidSound } from '@/lib/sound/kidSounds'

// The Daily Three: the child's home habit. Exactly three big tiles at the top
// of the kid screen, Learn, Do, Move, finishable in about fifteen minutes.
// Learn is the next lesson for their stage, Do is the next job due today, and
// Move is a real world thing away from any screen. Above them the chosen buddy
// says one line, and it changes as tiles finish. When all three are done the
// zone folds into a proud strip and the buddy celebrates. Behind it all sits
// My road, the child's own view of the road to 16.
//
// Move ticks live on this device only, in localStorage keyed by the date, so
// no table anywhere had to change. Learn done today is remembered the same way
// so a page refresh keeps the tile ticked.

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

export default function KidDailyThree({
  childName, stageId, buddyName, buddyImg, buddyIsStar,
  learnTitle, learnEmoji, learnStars, learnDoneLive, allLessonsDone,
  doTitle, doEmoji, doStars, doDone, jobsLeft,
  lessonsDoneCount, starsBanked,
  inkSoft,
  onLearnTap, onDoTap, onCelebrate,
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
  doTitle: string | null
  doEmoji: string | null
  doStars: number | null
  doDone: boolean
  jobsLeft: number
  lessonsDoneCount: number
  starsBanked: number
  inkSoft: string
  onLearnTap: () => void
  onDoTap: () => void
  onCelebrate: () => void
}) {
  // null until mounted so the first client paint matches the server, the same
  // pattern the school banner uses. Date driven bits settle right after.
  const [now, setNow] = useState<Date | null>(null)
  const [moveDone, setMoveDone] = useState(false)
  const [learnStored, setLearnStored] = useState(false)
  const [celebrated, setCelebrated] = useState(false)
  const [moveBurst, setMoveBurst] = useState(false)
  const [roadOpen, setRoadOpen] = useState(false)
  const moveTileRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const d = new Date()
    setNow(d)
    const rec = loadDay(localDateKey(d))
    setMoveDone(rec.move)
    setLearnStored(rec.learn)
    setCelebrated(rec.celebrated)
  }, [])

  const learnDone = learnDoneLive || learnStored

  // A lesson finished in this session sticks to today, so a refresh keeps the
  // Learn tile ticked even though the server only knows lessons ever done.
  useEffect(() => {
    if (!now || !learnDoneLive || learnStored) return
    const rec = loadDay(localDateKey(now))
    saveDay({ ...rec, learn: true })
    setLearnStored(true)
  }, [now, learnDoneLive, learnStored])

  const allThreeDone = learnDone && doDone && moveDone

  // The one big celebration, once per day, when the third tile lands.
  useEffect(() => {
    if (!now || !allThreeDone || celebrated) return
    const rec = loadDay(localDateKey(now))
    saveDay({ ...rec, learn: rec.learn || learnDone, move: rec.move || moveDone, celebrated: true })
    setCelebrated(true)
    onCelebrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, allThreeDone, celebrated])

  function tickMove() {
    if (moveDone || !now) return
    setMoveDone(true)
    const rec = loadDay(localDateKey(now))
    saveDay({ ...rec, move: true })
    playKidSound('star')
    setMoveBurst(true)
    setTimeout(() => setMoveBurst(false), 900)
    const el = moveTileRef.current
    if (el && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(el, { scale: 1, rotate: 0 }, { scale: 1.06, rotate: -2, duration: 0.18, ease: 'back.out(3)', yoyo: true, repeat: 1 })
    }
  }

  // The buddy's one line: time of day aware, and it moves along with the tiles.
  const doneOfThree = Number(learnDone) + Number(doDone) + Number(moveDone)
  const hour = now ? now.getHours() : null
  const tod = hour === null ? 'Hi' : hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'
  const line =
    doneOfThree === 0 ? 'One thing at a time.'
    : doneOfThree === 1 ? 'One done. Two to go.'
    : doneOfThree === 2 ? 'Two done. One to go.'
    : 'All three done. Superstar.'

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

  type Tile = {
    key: 'learn' | 'do' | 'move'
    eyebrow: string
    emoji: string
    title: string
    sub: string
    tint: string
    done: boolean
    onTap: () => void
  }
  const tiles: Tile[] = [
    {
      key: 'learn', eyebrow: 'Learn', tint: 'var(--tint-blue, #E4ECF7)',
      emoji: learnDone ? '🏆' : (learnEmoji ?? '🧠'),
      title: learnDone
        ? (allLessonsDone && !learnDoneLive ? 'Every lesson done' : 'Lesson done')
        : (learnTitle ?? 'A lesson for you'),
      sub: learnDone
        ? 'Big brain. Stars with your grown up ⭐'
        : learnStars ? `2 minutes · worth ${learnStars} star${learnStars === 1 ? '' : 's'}` : '2 minutes of clever',
      done: learnDone,
      onTap: onLearnTap,
    },
    {
      key: 'do', eyebrow: 'Do', tint: 'var(--terracotta-lt)',
      emoji: doDone ? '✅' : (doEmoji ?? '⭐'),
      title: doDone
        ? (doTitle ? 'Jobs all done' : 'No jobs today')
        : (doTitle ?? 'A job for you'),
      sub: doDone
        ? (doTitle ? 'Every job ticked. Nice one.' : 'All calm. Ask for one if you fancy it.')
        : jobsLeft > 1
          ? `${doStars ?? 1} star${(doStars ?? 1) === 1 ? '' : 's'} · ${jobsLeft} jobs waiting`
          : `Worth ${doStars ?? 1} star${(doStars ?? 1) === 1 ? '' : 's'}`,
      done: doDone,
      onTap: onDoTap,
    },
    {
      key: 'move', eyebrow: 'Move', tint: 'var(--tint-sage)',
      emoji: moveDone ? '🌟' : moveIdea.emoji,
      title: moveDone ? 'Moved and done' : moveIdea.title,
      sub: moveDone ? 'Your body says thank you.' : 'Away from the screen, then tap it done',
      done: moveDone,
      onTap: tickMove,
    },
  ]

  return (
    <div style={{ marginBottom: '18px' }}>
      {/* The buddy's one line above the three, Concept E's voice. */}
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

      {allThreeDone ? (
        // The proud strip: the day is done, the zone gets out of the way.
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
              Learn, Do and Move, all three. See you tomorrow!
            </span>
          </span>
          {buddyFace(40)}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: inkSoft }}>
              Today
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: inkSoft }}>
              {doneOfThree} of 3
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tiles.map(t => (
              <button
                key={t.key}
                ref={t.key === 'move' ? moveTileRef : undefined}
                onClick={t.onTap}
                disabled={t.done}
                style={{
                  display: 'flex', alignItems: 'center', gap: 15, width: '100%', textAlign: 'left',
                  background: t.done ? 'var(--tint-sage)' : '#fff', border: 'none',
                  borderRadius: '22px', padding: '17px 18px',
                  cursor: t.done ? 'default' : 'pointer',
                  boxShadow: t.done ? '0 2px 0 rgba(0,0,0,0.10)' : '0 6px 0 rgba(0,0,0,0.18)',
                  transform: t.done ? 'translateY(4px)' : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
              >
                <span style={{
                  width: 58, height: 58, borderRadius: '17px', flexShrink: 0,
                  background: t.done ? 'rgba(255,255,255,0.7)' : t.tint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', lineHeight: 1,
                }}>
                  {t.emoji}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.done ? 'var(--ink-muted)' : 'var(--terracotta-dark)' }}>
                    {t.eyebrow}
                  </span>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: '1.18rem', color: 'var(--ink)', lineHeight: 1.2, marginTop: 2,
                    textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.65 : 1,
                  }}>
                    {t.title}
                  </span>
                  <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2, lineHeight: 1.3 }}>
                    {t.sub}
                  </span>
                </span>
                <span style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0, position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: t.done ? 'var(--terracotta)' : 'var(--cream)',
                  border: t.done ? 'none' : '2.5px dashed var(--ink-light)',
                  fontSize: '18px',
                }}>
                  {t.done ? '✓' : t.key === 'move' ? '' : '›'}
                  {t.key === 'move' && moveBurst && <KidTickBurst />}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* The road behind the habit, Concept A one tap away. */}
      <button
        onClick={() => { setRoadOpen(true); playKidSound('tap') }}
        style={{
          display: 'block', margin: '12px auto 0', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
          letterSpacing: '0.04em', color: inkSoft, textDecoration: 'underline', textUnderlineOffset: '3px',
        }}
      >
        🗺️ My road →
      </button>

      {roadOpen && (
        <KidRoad
          stageId={stageId}
          childName={childName}
          buddyName={buddyName}
          buddyImg={buddyImg}
          buddyIsStar={buddyIsStar}
          lessonsDoneCount={lessonsDoneCount}
          starsBanked={starsBanked}
          onClose={() => setRoadOpen(false)}
        />
      )}
    </div>
  )
}
