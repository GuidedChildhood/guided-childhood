'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { playKidSound } from '@/lib/sound/kidSounds'
import { PATH_CHARACTERS, challengeFor, type PathChallenge, type PathCharacter } from '@/lib/content/path-challenges'
import { STAR_MINUTES } from '@/lib/quests/templates'
import type { SchoolQuiz } from '@/lib/content/school-quizzes'

// The child's pathway, the full Duolingo grammar in our butter and ink: one
// winding trail where TODAY lives as stones. The parent's set jobs are steps
// the child ticks right on the trail, the stage lessons follow in their
// designed order with the next one pulsing, characters hide along the way
// with surprise star earners behind them, one character keeps the school
// quiz matched to the child's real curriculum, the daily chest pays for a
// job done, and the stage stamp waits at the end. Above it all the Scroll
// Gremlin chase turns balance into a game. Warm, never a lock.

export type PathLesson = { id: string; title: string; emoji: string; done: boolean; score: number | null; locked: boolean }
export type PathGame = { key: string; title: string; emoji: string }
export type PathJob = { id: string; title: string; emoji: string; stars: number; state: 'todo' | 'waiting' | 'done' }

type Stone =
  | { type: 'job'; job: PathJob }
  | { type: 'lesson'; lesson: PathLesson }
  | { type: 'chest' }
  | { type: 'game'; game: PathGame }
  | { type: 'reading' }
  | { type: 'character'; character: PathCharacter; holdsQuiz: boolean; challenge: PathChallenge }
  | { type: 'finish' }

export default function KidPath({
  token, childName, stageId, stageName, ages, stamp,
  jobs: jobsInitial, lessons, games, quiz, dayIndex,
  chestClaimed: chestClaimedInitial, quizClaimed: quizClaimedInitial,
  usedTodayMinutes, guideMinutes, balanceStars, needsMigration = false,
}: {
  token: string
  childName: string
  stageId: number
  stageName: string
  ages: string
  stamp: string
  jobs: PathJob[]
  lessons: PathLesson[]
  games: PathGame[]
  quiz: SchoolQuiz
  dayIndex: number
  chestClaimed: boolean
  quizClaimed: boolean
  usedTodayMinutes: number
  guideMinutes: number
  balanceStars: number
  needsMigration?: boolean
}) {
  const [jobs, setJobs] = useState(jobsInitial)
  const [chestClaimed, setChestClaimed] = useState(chestClaimedInitial)
  const [quizClaimed, setQuizClaimed] = useState(quizClaimedInitial)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  // The chest lottery: opening always banks the star, and the celebration
  // uncovers a bonus direction, the school quiz, a printable to do and show,
  // or pure sparkle. Which one is the day's luck.
  const [chestReveal, setChestReveal] = useState<'quiz' | 'printable' | 'star' | null>(null)
  const [sheet, setSheet] = useState<Stone | null>(null)
  // The quiz run, living inside the character sheet. Each run samples five
  // questions from the band's pool and shuffles every question's answer
  // positions, so replays differ and there is never a positional pattern to
  // spot (the middle one is not always right, as one sharp tester found).
  const [runQs, setRunQs] = useState<{ q: string; options: string[]; answer: number; why: string }[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [qRight, setQRight] = useState(0)
  const [qPicked, setQPicked] = useState<number | null>(null)
  const [qDone, setQDone] = useState<'pass' | 'fail' | null>(null)

  function dealQuiz() {
    const pool = [...quiz.pool]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, 5).map(question => {
      const order = question.options.map((_, i) => i)
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]
      }
      return {
        q: question.q, why: question.why,
        options: order.map(i => question.options[i]),
        answer: order.indexOf(question.answer),
      }
    })
  }

  function say(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }

  // ── Build the trail: jobs first (today's steps), then the lessons in
  // their designed order, with the chest, the characters, a game and the
  // reading stone woven between, and the stamp at the end. ──
  const baseStones: Stone[] = [
    ...jobs.map(job => ({ type: 'job' as const, job })),
    ...lessons.map(lesson => ({ type: 'lesson' as const, lesson })),
  ]
  // Which character holds the quiz rotates with the day.
  const quizCharIdx = dayIndex % PATH_CHARACTERS.length
  const stones: Stone[] = []
  let charIdx = 0
  let gameIdx = 0
  let readingPlaced = false
  baseStones.forEach((s, i) => {
    stones.push(s)
    if (i === 0) stones.push({ type: 'chest' })
    if ((i + 1) % 3 === 0 && charIdx < PATH_CHARACTERS.length) {
      stones.push({
        type: 'character',
        character: PATH_CHARACTERS[charIdx],
        holdsQuiz: charIdx === quizCharIdx,
        challenge: challengeFor(dayIndex, charIdx),
      })
      charIdx++
    }
    if ((i + 1) % 4 === 0 && gameIdx < games.length) {
      stones.push({ type: 'game', game: games[gameIdx++] })
    }
    if (!readingPlaced && i === Math.min(5, baseStones.length - 1)) {
      stones.push({ type: 'reading' })
      readingPlaced = true
    }
  })
  // A short trail still gets its finds.
  while (charIdx < Math.min(2, PATH_CHARACTERS.length)) {
    stones.push({
      type: 'character',
      character: PATH_CHARACTERS[charIdx],
      holdsQuiz: charIdx === quizCharIdx,
      challenge: challengeFor(dayIndex, charIdx),
    })
    charIdx++
  }
  if (!readingPlaced) stones.push({ type: 'reading' })
  stones.push({ type: 'finish' })


  const nextLessonId = lessons.find(l => !l.done && !l.locked)?.id ?? null
  const jobsTicked = jobs.filter(j => j.state !== 'todo').length

  // One glowing stone at a time. Every stone counts as done for today
  // somehow: jobs tick, the chest opens, lessons pass (locked ones step
  // aside), and the friends, the game and the reading stone count as found
  // once tapped, remembered on this device for the day. The first stone not
  // yet done wears the glow and the Start bubble, and when every stone is
  // done the whole path pays a bonus.
  const [foundMarks, setFoundMarks] = useState<Record<string, boolean>>({})
  const [pathComplete, setPathComplete] = useState(false)
  const dayKey = () => new Date().toISOString().slice(0, 10)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`gc_path_found_${dayKey()}`)
      if (raw) setFoundMarks(JSON.parse(raw))
    } catch { /* fresh day */ }
  }, [])
  function markFound(key: string) {
    setFoundMarks(f => {
      const next = { ...f, [key]: true }
      try { localStorage.setItem(`gc_path_found_${dayKey()}`, JSON.stringify(next)) } catch { /* still counts this visit */ }
      return next
    })
  }
  function stoneDone(s: Stone): boolean {
    if (s.type === 'job') return s.job.state !== 'todo'
    if (s.type === 'lesson') return s.lesson.done || s.lesson.locked
    if (s.type === 'chest') return chestClaimed
    if (s.type === 'character') return s.holdsQuiz ? (quizClaimed || Boolean(foundMarks['quiz'])) : Boolean(foundMarks[`char_${s.character.key}`])
    if (s.type === 'game') return Boolean(foundMarks[`game_${s.game.key}`])
    if (s.type === 'reading') return Boolean(foundMarks['reading'])
    return true
  }
  const currentIndex = stones.findIndex(s => s.type !== 'finish' && !stoneDone(s))
  const allPathDone = currentIndex === -1 && stones.length > 1

  // Trail progress counts every stone the same way the glow does, passes
  // leaping double, so the bar and the path can never disagree.
  const unitOf = (s: Stone) => s.type === 'finish' ? 0 : s.type === 'lesson' ? (s.lesson.locked ? 0 : 2) : 1
  const totalUnits = stones.reduce((sum, s) => sum + unitOf(s), 0)
  const doneUnits = stones.reduce((sum, s) => sum + (stoneDone(s) ? unitOf(s) : 0), 0)
  const childFrac = totalUnits > 0 ? Math.min(1, doneUnits / totalUnits) : 0

  // The whole path done pays, once a day: a big celebration and three bonus
  // stars, checked server side against the jobs and the chest so it stays a
  // game and never a loophole.
  useEffect(() => {
    if (!allPathDone) return
    try {
      const k = `gc_path_complete_${dayKey()}`
      if (localStorage.getItem(k)) return
      localStorage.setItem(k, '1')
    } catch { /* celebrate anyway, the server dedupes */ }
    playKidSound('done')
    setPathComplete(true)
    fetch('/api/kid/path-complete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => { /* the celebration stands */ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPathDone])

  // ── Actions ──
  async function tickJob(job: PathJob) {
    if (job.state !== 'todo' || busy) return
    setBusy(true)
    try {
      const r = await fetch('/api/quests/tick', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, quest_id: job.id }),
      })
      if (r.ok) {
        setJobs(js => js.map(j => j.id === job.id ? { ...j, state: 'waiting' } : j))
        playKidSound('star')
        say(`Sent to your grown up ⭐ ${job.stars} star${job.stars === 1 ? '' : 's'} on the way`)
      }
    } catch { /* tap again */ } finally { setBusy(false) }
  }

  async function openChest() {
    if (busy || chestClaimed) return
    if (jobsTicked < 1) {
      playKidSound('tap')
      say('The chest opens on a day you tick a job. Tap a job stone first!')
      return
    }
    setBusy(true)
    try {
      const r = await fetch('/api/kid/chest-claim', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok) {
        setChestClaimed(true)
        playKidSound('done')
        const finds: ('quiz' | 'printable' | 'star')[] = quizClaimed ? ['printable', 'star'] : ['quiz', 'printable', 'star']
        setChestReveal(finds[Math.floor(Math.random() * finds.length)])
      }
      else if (d?.needsMigration) say('The chest is still being built. Soon!')
      else if (/already/.test(String(d?.error))) setChestClaimed(true)
    } catch { /* stays shut */ } finally { setBusy(false) }
  }

  function openSheet(stone: Stone) {
    playKidSound('tap')
    // A challenge friend counts as found the moment they are met; the quiz
    // friend counts once the quiz run is finished, win or brave try.
    if (stone.type === 'character' && !stone.holdsQuiz) markFound(`char_${stone.character.key}`)
    setRunQs(dealQuiz())
    setQIndex(0); setQRight(0); setQPicked(null); setQDone(null)
    setSheet(stone)
  }

  function answerQuiz(i: number) {
    if (qPicked != null || qDone || !runQs[qIndex]) return
    setQPicked(i)
    const right = i === runQs[qIndex].answer
    playKidSound(right ? 'star' : 'tap')
    if (right) setQRight(r => r + 1)
    // No auto advance: the why line sits with the answer until the child
    // taps Continue, the Duolingo rhythm, so every question teaches.
  }

  function continueQuiz() {
    playKidSound('tap')
    if (qIndex + 1 < runQs.length) {
      setQIndex(qIndex + 1); setQPicked(null)
    } else {
      finishQuiz(qRight)
    }
  }

  async function finishQuiz(right: number) {
    const passed = runQs.length > 0 && right / runQs.length >= 0.8
    setQDone(passed ? 'pass' : 'fail')
    markFound('quiz')
    if (passed) playKidSound('done')
    if (!passed || quizClaimed) return
    try {
      const r = await fetch('/api/kid/quiz-claim', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, quizKey: quiz.key, correct: right }),
      })
      if (r.ok) { setQuizClaimed(true); say('+2 stars in your bank ⭐') }
    } catch { /* the pass still shows */ }
  }

  // ── Stone styling ──
  // The serpentine: stones swing out and back like the Duolingo trail, a
  // smooth left right wave rather than a straight ladder.
  const SERPENTINE = [0, -72, -104, -72, 0, 72, 104, 72]
  const drift = (i: number): number => SERPENTINE[i % SERPENTINE.length]

  const shell = (opts: { bg: string; border?: string; dim?: boolean; pulse?: boolean }): React.CSSProperties => ({
    width: 84, height: 84, borderRadius: '50%', flexShrink: 0,
    background: opts.bg, border: opts.border ?? 'none',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 6px 0 rgba(26,26,46,0.16)', cursor: 'pointer',
    opacity: opts.dim ? 0.78 : 1, position: 'relative', overflow: 'hidden',
    animation: opts.pulse ? 'gcPathPulse 1.8s ease-in-out infinite' : undefined,
    textDecoration: 'none', padding: 0,
  })
  const label: React.CSSProperties = {
    marginTop: 8, maxWidth: 150, textAlign: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5,
    color: 'var(--ink)', lineHeight: 1.25,
  }
  const sub: React.CSSProperties = {
    marginTop: 3, maxWidth: 150, textAlign: 'center',
    fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)',
  }
  const column: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'none' }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--warm-bg, #F7F3EE)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <style>{`
        @keyframes gcPathPulse {
          0%, 100% { box-shadow: 0 6px 0 rgba(26,26,46,0.16), 0 0 0 0 rgba(237,195,95,0.6); }
          50% { box-shadow: 0 6px 0 rgba(26,26,46,0.16), 0 0 0 14px rgba(237,195,95,0); }
        }
        @keyframes gcStartBob {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -6px); }
        }
        @keyframes gcChestPop {
          0% { transform: scale(0.3) rotate(-8deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
          <Link href={`/k/${token}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink-soft)', textDecoration: 'none' }}>
            ← My quests
          </Link>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: '100px', padding: '5px 12px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
            ⭐ {balanceStars} in the bank
          </span>
        </div>

        {/* The stage banner. */}
        <div style={{ background: '#fff', borderRadius: '22px', padding: '16px 18px', marginBottom: '14px', boxShadow: '0 5px 0 rgba(26,26,46,0.12)', border: '1.5px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '3px' }}>
            Stage {stageId} of 5 · ages {ages}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {stageName} path
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)', borderRadius: 100, padding: '4px 12px' }}>
            <span aria-hidden style={{ fontSize: 14 }}>🪪</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
              Stamp at the end: {stamp}
            </span>
          </div>
          {/* The trail progress, the Duolingo way: one bar filling toward the
              stamp as jobs, passes and finds land. */}
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 10, borderRadius: 100, background: 'rgba(26,26,46,0.10)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.round(childFrac * 100)}%`, borderRadius: 100, background: 'var(--terracotta)', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-muted)', marginTop: 5 }}>
              {doneUnits} of {totalUnits} along the path
            </div>
          </div>
        </div>

        {toast && (
          <div style={{ position: 'sticky', top: 10, zIndex: 20, background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14, padding: '11px 15px', marginBottom: 14, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, textAlign: 'center', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
            {toast}
          </div>
        )}

        {/* The trail. */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {stones.map((stone, i) => {
            const align = drift(i)
            let node: React.ReactNode = null

            const isCurrent = i === currentIndex
            if (stone.type === 'job') {
              const j = stone.job
              const done = j.state !== 'todo'
              node = (
                <button onClick={() => tickJob(j)} disabled={done || busy} style={column}>
                  <span style={shell({ bg: j.state === 'done' ? 'var(--tint-sage)' : j.state === 'waiting' ? '#FFF7E0' : '#fff', dim: done, pulse: isCurrent })}>
                    <span style={{ fontSize: 32, lineHeight: 1 }}>{j.state === 'done' ? '✓' : j.emoji}</span>
                    {j.state === 'waiting' && <span style={{ fontSize: 15, marginTop: 1 }}>⏳</span>}
                  </span>
                  <span style={label}>{j.title}</span>
                  <span style={sub}>
                    {j.state === 'done' ? 'Done! Stars landed' : j.state === 'waiting' ? 'With your grown up ✓' : `Job · ${j.stars} star${j.stars === 1 ? '' : 's'} · tap when done`}
                  </span>
                </button>
              )
            } else if (stone.type === 'lesson') {
              const l = stone.lesson
              const isNext = l.id === nextLessonId
              node = (
                <Link href={`/k/${token}/lessons/${l.id}`} onClick={() => playKidSound('tap')} style={column}>
                  <span style={shell({ bg: l.done ? 'var(--terracotta)' : 'var(--cream)', dim: !l.done && !isCurrent, pulse: isCurrent })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{l.done ? '⭐' : l.locked ? '🔒' : l.emoji}</span>
                    {l.done && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>+2 ⚡ leap</span>}
                  </span>
                  <span style={label}>{l.title}</span>
                  <span style={sub}>
                    {l.done ? `Passed${l.score != null ? ` · ${l.score} right` : ''}` : l.locked ? 'Ask your grown up' : isNext ? 'Pass to leap 2' : 'Lesson'}
                  </span>
                </Link>
              )
            } else if (stone.type === 'chest') {
              const openable = !chestClaimed && jobsTicked > 0 && !needsMigration
              node = (
                <button onClick={openChest} disabled={busy} style={column}>
                  <span style={shell({ bg: chestClaimed ? 'var(--tint-sage)' : openable ? 'var(--terracotta-lt)' : 'var(--cream)', border: openable ? '3px solid var(--terracotta)' : undefined, dim: chestClaimed, pulse: isCurrent })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{chestClaimed ? '✨' : '🎁'}</span>
                  </span>
                  <span style={label}>{chestClaimed ? 'Chest opened' : 'The daily chest'}</span>
                  <span style={sub}>{chestClaimed ? '+1 star banked' : openable ? 'Tap to open!' : 'Tick a job to open'}</span>
                </button>
              )
            } else if (stone.type === 'character') {
              const c = stone.character
              const charDone = stoneDone(stone)
              node = (
                <button onClick={() => openSheet(stone)} style={column}>
                  <span style={shell({ bg: '#fff', border: '3px solid var(--terracotta)', dim: charDone, pulse: isCurrent })}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                  <span style={label}>{c.name} has something for you</span>
                  <span style={sub}>
                    {charDone ? (stone.holdsQuiz ? (quizClaimed ? 'Quiz passed today ⭐' : 'Brave try today ✓') : 'Found today ✓') : 'Tap to find out'}
                  </span>
                </button>
              )
            } else if (stone.type === 'game') {
              const gameDone = stoneDone(stone)
              node = (
                <a href={`/k/${token}?tab=games`} onClick={() => { markFound(`game_${stone.game.key}`); playKidSound('tap') }} style={column}>
                  <span style={shell({ bg: 'var(--tint-blue, #E4ECF7)', dim: gameDone, pulse: isCurrent })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{stone.game.emoji || '🎮'}</span>
                  </span>
                  <span style={label}>{stone.game.title}</span>
                  <span style={sub}>{gameDone ? 'Played today ✓' : 'Learning game'}</span>
                </a>
              )
            } else if (stone.type === 'reading') {
              const readDone = stoneDone(stone)
              node = (
                <a href={`/k/${token}#my-todo`} onClick={() => { markFound('reading'); playKidSound('tap') }} style={column}>
                  <span style={shell({ bg: 'var(--cream)', dim: readDone, pulse: isCurrent })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>📚</span>
                  </span>
                  <span style={label}>Twenty minutes lost in a book</span>
                  <span style={sub}>{readDone ? 'On it today ✓' : 'A big star job'}</span>
                </a>
              )
            } else {
              node = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={shell({ bg: allPathDone ? 'var(--terracotta)' : 'var(--cream)', dim: !allPathDone, pulse: allPathDone })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>🪪</span>
                  </span>
                  <span style={label}>The {stamp} stamp</span>
                  <span style={sub}>{allPathDone ? 'Path complete today! ⭐' : 'Waiting at the end of the path'}</span>
                </div>
              )
            }

            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateX(${align}px)`, position: 'relative', paddingTop: isCurrent ? 34 : 0 }}>
                    {/* The Start bubble rides whichever stone is next, the one
                        glowing thing on the whole trail. */}
                    {isCurrent && (
                      <span style={{
                        position: 'absolute', top: 0, left: '50%',
                        animation: 'gcStartBob 1.4s ease-in-out infinite',
                        background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 12,
                        padding: '5px 13px', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
                        boxShadow: '0 3px 0 rgba(26,26,46,0.12)', whiteSpace: 'nowrap', zIndex: 2,
                      }}>
                        Start
                      </span>
                    )}
                    {node}
                  </div>
                </div>
                {i < stones.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                    <span aria-hidden style={{ height: 26, borderLeft: '4px dotted rgba(26,26,46,0.22)', transform: `translateX(${(drift(i) + drift(i + 1)) / 2}px)` }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: '14px 16px', boxShadow: '0 4px 0 rgba(26,26,46,0.10)' }}>
          <DigiCharacter mood="wave" size={44} once />
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Every stone counts, {childName}. Tick jobs right here, pass the lesson check to leap two, and tap the friends you find. The road waits for you.
          </p>
        </div>
      </div>

      {/* The whole path done: the big one. Three bonus stars, a quarter hour
          when they want it, and the stamp stone glowing gold behind it. */}
      {pathComplete && (
        <div onClick={() => setPathComplete(false)} style={{ position: 'fixed', inset: 0, zIndex: 135, background: 'rgba(26,26,46,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, background: 'var(--cream)', borderRadius: 26, padding: '30px 24px', boxShadow: '0 24px 60px -16px rgba(0,0,0,0.55)', textAlign: 'center' }}>
            <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 10, display: 'inline-block', animation: 'gcChestPop 0.7s ease-out' }}>🏁</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
              Path complete, {childName}!
            </div>
            <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
              Every stone on today&apos;s path, done. 3 bonus stars are landing in your bank, that is {3 * STAR_MINUTES} more minutes of screen time whenever you want them. Same again tomorrow?
            </p>
            <button
              onClick={() => { setPathComplete(false); playKidSound('tap') }}
              style={{ width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 16, padding: '15px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, boxShadow: '0 5px 0 var(--terracotta-dark)' }}
            >
              Brilliant ⭐
            </button>
          </div>
        </div>
      )}

      {/* The chest reveal: the mini celebration and the day's lottery. The
          star is always banked; what it uncovers points somewhere good. */}
      {chestReveal && (
        <div onClick={() => setChestReveal(null)} style={{ position: 'fixed', inset: 0, zIndex: 132, background: 'rgba(26,26,46,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: 'var(--cream)', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: '24px 22px calc(28px + env(safe-area-inset-bottom))', boxShadow: '0 -18px 50px -16px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 8, display: 'inline-block', animation: 'gcChestPop 0.6s ease-out' }}>
              {chestReveal === 'quiz' ? '🎓' : chestReveal === 'printable' ? '🖍️' : '✨'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--ink)', marginBottom: 4 }}>
              Chest opened! +1 star banked ⭐
            </div>
            <p style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
              {chestReveal === 'quiz' && 'And inside: the school quiz! Pass it and 2 more stars are yours.'}
              {chestReveal === 'printable' && 'And inside: a printable! Print it, do it, and show your grown up. Finished sheets can pay stars as a quest.'}
              {chestReveal === 'star' && 'Pure sparkle today. Spend it well on the timer, or save it up for something bigger.'}
            </p>
            {chestReveal === 'quiz' && (
              <button
                onClick={() => {
                  const quizStone = stones.find(s => s.type === 'character' && s.holdsQuiz)
                  setChestReveal(null)
                  if (quizStone) openSheet(quizStone)
                }}
                style={{ width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 14, padding: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15.5, boxShadow: '0 5px 0 var(--terracotta-dark)' }}
              >
                Take the quiz, 2 more stars →
              </button>
            )}
            {chestReveal === 'printable' && (
              <a
                href={`/k/${token}?tab=print`}
                onClick={() => playKidSound('tap')}
                style={{ display: 'block', width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14, padding: '14px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15.5, boxShadow: '0 5px 0 var(--terracotta-dark)', boxSizing: 'border-box' }}
              >
                See the printables →
              </a>
            )}
            <button onClick={() => setChestReveal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '14px auto 0', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Back to the path
            </button>
          </div>
        </div>
      )}

      {/* The character sheet: the surprise behind the friend. A challenge for
          extra stars, or the school quiz matched to their curriculum. */}
      {sheet && sheet.type === 'character' && (
        <div onClick={() => setSheet(null)} style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(26,26,46,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, maxHeight: '80vh', overflowY: 'auto', background: 'var(--cream)', borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: '20px 22px calc(26px + env(safe-area-inset-bottom))', boxShadow: '0 -18px 50px -16px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2.5px solid var(--terracotta)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sheet.character.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', lineHeight: 1.15 }}>
                  {sheet.holdsQuiz ? `${sheet.character.name}'s school quiz` : `${sheet.character.name}'s secret challenge`}
                </div>
                {sheet.holdsQuiz && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: 2 }}>
                    {quiz.title} · {quiz.yearNote}
                  </div>
                )}
              </div>
              <button onClick={() => setSheet(null)} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: 16, color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
            </div>

            {!sheet.holdsQuiz ? (
              <>
                <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 8 }}>{sheet.challenge.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: 6 }}>
                  {sheet.challenge.title}
                </div>
                <p style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
                  {sheet.challenge.body}
                </p>
                <a
                  href={`/k/${token}#my-todo`}
                  onClick={() => playKidSound('tap')}
                  style={{ display: 'block', textAlign: 'center', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14, padding: '14px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15.5, boxShadow: '0 5px 0 var(--terracotta-dark)' }}
                >
                  {sheet.challenge.cta} →
                </a>
              </>
            ) : quizClaimed && !qDone ? (
              <p style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
                You already passed today&apos;s quiz and banked the stars. {sheet.character.name} will have a fresh one tomorrow ⭐
              </p>
            ) : qDone ? (
              <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
                <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 8 }}>{qDone === 'pass' ? '🏆' : '💪'}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: 6 }}>
                  {qDone === 'pass' ? `${qRight} of ${runQs.length}! Quiz passed` : `${qRight} of ${runQs.length} this time`}
                </div>
                <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                  {qDone === 'pass' ? '2 bonus stars are in your bank ⭐' : 'So close. Have another go tomorrow, the questions change every time.'}
                </p>
              </div>
            ) : runQs[qIndex] ? (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 8 }}>
                  Question {qIndex + 1} of {runQs.length} · pass 4 to bank 2 stars
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.35rem', color: 'var(--ink)', lineHeight: 1.25, marginBottom: 14 }}>
                  {runQs[qIndex].q}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {runQs[qIndex].options.map((opt, oi) => {
                    const picked = qPicked === oi
                    const isRight = oi === runQs[qIndex].answer
                    const showState = qPicked != null
                    return (
                      <button
                        key={oi}
                        onClick={() => answerQuiz(oi)}
                        style={{
                          textAlign: 'left', padding: '14px 16px', borderRadius: 14, cursor: qPicked == null ? 'pointer' : 'default',
                          border: `2px solid ${showState && isRight ? '#2F8F6B' : picked ? '#C0533E' : 'var(--border)'}`,
                          background: showState && isRight ? '#DEF0E7' : picked ? '#FDECEC' : '#fff',
                          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--ink)',
                        }}
                      >
                        {opt}{showState && isRight ? '  ✓' : picked ? '  ✕' : ''}
                      </button>
                    )
                  })}
                </div>
                {/* The teach beat, the Duolingo rhythm: the answer lands, the
                    why sits with it, and the child moves on when ready. */}
                {qPicked != null && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{
                      background: qPicked === runQs[qIndex].answer ? '#DEF0E7' : '#FDECEC',
                      border: `1.5px solid ${qPicked === runQs[qIndex].answer ? '#2F8F6B' : '#C0533E'}`,
                      borderRadius: 12, padding: '11px 14px', marginBottom: 10,
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14.5, color: qPicked === runQs[qIndex].answer ? '#1F7A54' : '#B93B3F', marginBottom: 3 }}>
                        {qPicked === runQs[qIndex].answer ? 'Correct!' : 'Not quite'}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.5 }}>
                        {runQs[qIndex].why}
                      </div>
                    </div>
                    <button
                      onClick={continueQuiz}
                      style={{ width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 14, padding: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15.5, boxShadow: '0 5px 0 var(--terracotta-dark)' }}
                    >
                      {qIndex + 1 < runQs.length ? 'Continue →' : 'See my score →'}
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
