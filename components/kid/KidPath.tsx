'use client'

import { useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { playKidSound } from '@/lib/sound/kidSounds'
import { PATH_CHARACTERS, challengeFor, type PathChallenge, type PathCharacter } from '@/lib/content/path-challenges'
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
  const [sheet, setSheet] = useState<Stone | null>(null)
  // The quiz run, living inside the character sheet.
  const [qIndex, setQIndex] = useState(0)
  const [qRight, setQRight] = useState(0)
  const [qPicked, setQPicked] = useState<number | null>(null)
  const [qDone, setQDone] = useState<'pass' | 'fail' | null>(null)

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

  // ── The chase maths: passes leap double, jobs and finds count single. ──
  const totalUnits = lessons.length * 2 + jobs.length + 2 // chest and quiz
  const doneUnits =
    lessons.filter(l => l.done).length * 2 +
    jobs.filter(j => j.state !== 'todo').length +
    (chestClaimed ? 1 : 0) + (quizClaimed ? 1 : 0)
  const childFrac = totalUnits > 0 ? Math.min(1, doneUnits / totalUnits) : 0
  const gremlinFrac = guideMinutes > 0 ? Math.min(0.96, Math.max(0.02, usedTodayMinutes / guideMinutes)) : 0.02
  const caught = guideMinutes > 0 && gremlinFrac >= childFrac && usedTodayMinutes > 0

  const nextLessonId = lessons.find(l => !l.done && !l.locked)?.id ?? null
  const jobsTicked = jobs.filter(j => j.state !== 'todo').length

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
        playKidSound('tap')
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
      if (r.ok) { setChestClaimed(true); playKidSound('tap'); say('+1 star in your bank ⭐') }
      else if (d?.needsMigration) say('The chest is still being built. Soon!')
      else if (/already/.test(String(d?.error))) setChestClaimed(true)
    } catch { /* stays shut */ } finally { setBusy(false) }
  }

  function openSheet(stone: Stone) {
    playKidSound('tap')
    setQIndex(0); setQRight(0); setQPicked(null); setQDone(null)
    setSheet(stone)
  }

  function answerQuiz(i: number) {
    if (qPicked != null || qDone) return
    setQPicked(i)
    const right = i === quiz.questions[qIndex].answer
    const newRight = qRight + (right ? 1 : 0)
    setQRight(newRight)
    setTimeout(() => {
      if (qIndex + 1 < quiz.questions.length) {
        setQIndex(qIndex + 1); setQPicked(null)
      } else {
        finishQuiz(newRight)
      }
    }, 750)
  }

  async function finishQuiz(right: number) {
    const passed = right / quiz.questions.length >= 0.8
    setQDone(passed ? 'pass' : 'fail')
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
  const drift = (i: number): 'flex-start' | 'center' | 'flex-end' =>
    (['center', 'flex-start', 'center', 'flex-end'] as const)[i % 4]

  const shell = (opts: { bg: string; border?: string; dim?: boolean; pulse?: boolean }): React.CSSProperties => ({
    width: 84, height: 84, borderRadius: '50%', flexShrink: 0,
    background: opts.bg, border: opts.border ?? 'none',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 6px 0 rgba(0,0,0,0.28)', cursor: 'pointer',
    opacity: opts.dim ? 0.78 : 1, position: 'relative', overflow: 'hidden',
    animation: opts.pulse ? 'gcPathPulse 1.8s ease-in-out infinite' : undefined,
    textDecoration: 'none', padding: 0,
  })
  const label: React.CSSProperties = {
    marginTop: 8, maxWidth: 150, textAlign: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5,
    color: '#F7F7F5', lineHeight: 1.25,
  }
  const sub: React.CSSProperties = {
    marginTop: 3, maxWidth: 150, textAlign: 'center',
    fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
  }
  const column: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'none' }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <style>{`
        @keyframes gcPathPulse {
          0%, 100% { box-shadow: 0 6px 0 rgba(0,0,0,0.28), 0 0 0 0 rgba(237,195,95,0.55); }
          50% { box-shadow: 0 6px 0 rgba(0,0,0,0.28), 0 0 0 14px rgba(237,195,95,0); }
        }
      `}</style>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
          <Link href={`/k/${token}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
            ← My quests
          </Link>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: '100px', padding: '5px 12px', boxShadow: '0 3px 0 rgba(0,0,0,0.2)' }}>
            ⭐ {balanceStars} in the bank
          </span>
        </div>

        {/* The stage banner. */}
        <div style={{ background: 'var(--cream)', borderRadius: '22px', padding: '16px 18px', marginBottom: '14px', boxShadow: '0 5px 0 rgba(0,0,0,0.22)' }}>
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
        </div>

        {/* The Scroll Gremlin chase. */}
        {guideMinutes > 0 && (
          <div style={{ background: 'var(--cream)', borderRadius: '18px', padding: '13px 16px 15px', marginBottom: '20px', boxShadow: '0 5px 0 rgba(0,0,0,0.22)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: 'var(--ink)' }}>
                {caught ? 'The Scroll Gremlin caught up! 👾' : 'Stay ahead of the Scroll Gremlin'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)' }}>
                {Math.max(0, Math.round(usedTodayMinutes))}/{guideMinutes} min
              </span>
            </div>
            <div style={{ position: 'relative', height: 30 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 7, borderRadius: 100, background: 'rgba(26,26,46,0.12)' }} />
              <div style={{ position: 'absolute', left: 0, top: 12, height: 7, borderRadius: 100, width: `${childFrac * 100}%`, background: 'var(--terracotta)' }} />
              <span aria-hidden style={{ position: 'absolute', top: -1, left: `calc(${gremlinFrac * 100}% - 11px)`, fontSize: 21 }}>👾</span>
              <span aria-hidden style={{ position: 'absolute', top: -3, left: `calc(${childFrac * 100}% - 12px)`, fontSize: 23, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.25))' }}>⭐</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '4px 0 0' }}>
              {caught
                ? 'Tick a job, pass a lesson or open the chest to leap ahead of it.'
                : 'Screen minutes move the Gremlin. Jobs, lessons and the finds move you.'}
            </p>
          </div>
        )}

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

            if (stone.type === 'job') {
              const j = stone.job
              const done = j.state !== 'todo'
              node = (
                <button onClick={() => tickJob(j)} disabled={done || busy} style={column}>
                  <span style={shell({ bg: j.state === 'done' ? 'var(--tint-sage)' : j.state === 'waiting' ? '#FFF7E0' : '#fff', border: j.state === 'waiting' ? '3px dashed var(--terracotta)' : undefined })}>
                    <span style={{ fontSize: 32, lineHeight: 1 }}>{j.state === 'done' ? '✓' : j.emoji}</span>
                    {j.state === 'waiting' && <span style={{ fontSize: 15, marginTop: 1 }}>⏳</span>}
                  </span>
                  <span style={label}>{j.title}</span>
                  <span style={sub}>
                    {j.state === 'done' ? 'Done! Stars landed' : j.state === 'waiting' ? 'With your grown up' : `Job · ${j.stars} star${j.stars === 1 ? '' : 's'} · tap when done`}
                  </span>
                </button>
              )
            } else if (stone.type === 'lesson') {
              const l = stone.lesson
              const isNext = l.id === nextLessonId
              node = (
                <Link href={`/k/${token}/lessons/${l.id}`} onClick={() => playKidSound('tap')} style={column}>
                  <span style={shell({ bg: l.done ? 'var(--terracotta)' : 'var(--cream)', dim: !l.done && !isNext, pulse: isNext })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{l.done ? '⭐' : l.locked ? '🔒' : l.emoji}</span>
                    {l.done && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>+2 ⚡ leap</span>}
                  </span>
                  <span style={label}>{l.title}</span>
                  <span style={sub}>
                    {l.done ? `Passed${l.score != null ? ` · ${l.score} right` : ''}` : l.locked ? 'Ask your grown up' : isNext ? '▶ Start here · pass to leap 2' : 'Lesson'}
                  </span>
                </Link>
              )
            } else if (stone.type === 'chest') {
              const openable = !chestClaimed && jobsTicked > 0 && !needsMigration
              node = (
                <button onClick={openChest} disabled={busy} style={column}>
                  <span style={shell({ bg: chestClaimed ? 'var(--tint-sage)' : openable ? 'var(--terracotta-lt)' : 'var(--cream)', border: openable ? '3px solid var(--terracotta)' : undefined, dim: !openable && !chestClaimed, pulse: openable })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{chestClaimed ? '✨' : '🎁'}</span>
                  </span>
                  <span style={label}>{chestClaimed ? 'Chest opened' : 'The daily chest'}</span>
                  <span style={sub}>{chestClaimed ? '+1 star banked' : openable ? 'Tap to open!' : 'Tick a job to open'}</span>
                </button>
              )
            } else if (stone.type === 'character') {
              const c = stone.character
              const found = stone.holdsQuiz && quizClaimed
              node = (
                <button onClick={() => openSheet(stone)} style={column}>
                  <span style={shell({ bg: '#fff', border: '3px solid var(--terracotta)', pulse: !found })}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                  <span style={label}>{c.name} has something for you</span>
                  <span style={sub}>{found ? 'Quiz passed today ⭐' : 'Tap to find out'}</span>
                </button>
              )
            } else if (stone.type === 'game') {
              node = (
                <a href={`/k/${token}?tab=games`} onClick={() => playKidSound('tap')} style={column}>
                  <span style={shell({ bg: 'var(--tint-blue, #E4ECF7)' })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{stone.game.emoji || '🎮'}</span>
                  </span>
                  <span style={label}>{stone.game.title}</span>
                  <span style={sub}>Learning game</span>
                </a>
              )
            } else if (stone.type === 'reading') {
              node = (
                <a href={`/k/${token}#my-todo`} onClick={() => playKidSound('tap')} style={column}>
                  <span style={shell({ bg: 'var(--cream)' })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>📚</span>
                  </span>
                  <span style={label}>Twenty minutes lost in a book</span>
                  <span style={sub}>A big star job</span>
                </a>
              )
            } else {
              const allDone = lessons.length > 0 && lessons.every(l => l.done)
              node = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={shell({ bg: allDone ? 'var(--terracotta)' : 'var(--cream)', dim: !allDone })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>🪪</span>
                  </span>
                  <span style={label}>The {stamp} stamp</span>
                  <span style={sub}>{allDone ? 'Earned! Your passport shines' : 'Waiting at the end of the path'}</span>
                </div>
              )
            }

            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: align, padding: '0 8%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{node}</div>
                </div>
                {i < stones.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                    <span aria-hidden style={{ height: 26, borderLeft: '4px dotted rgba(255,255,255,0.28)' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.16)', borderRadius: 18, padding: '14px 16px' }}>
          <DigiCharacter mood="wave" size={44} once />
          <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
            Every stone counts, {childName}. Tick jobs right here, pass the lesson check to leap two, and tap the friends you find. The road waits for you, the Gremlin does not.
          </p>
        </div>
      </div>

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
                  {qDone === 'pass' ? `${qRight} of ${quiz.questions.length}! Quiz passed` : `${qRight} of ${quiz.questions.length} this time`}
                </div>
                <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                  {qDone === 'pass' ? '2 bonus stars are in your bank ⭐' : 'So close. Have another go tomorrow, the quiz changes every day.'}
                </p>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 8 }}>
                  Question {qIndex + 1} of {quiz.questions.length} · pass 4 to bank 2 stars
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.35rem', color: 'var(--ink)', lineHeight: 1.25, marginBottom: 14 }}>
                  {quiz.questions[qIndex].q}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {quiz.questions[qIndex].options.map((opt, oi) => {
                    const picked = qPicked === oi
                    const isRight = oi === quiz.questions[qIndex].answer
                    const showState = qPicked != null
                    return (
                      <button
                        key={oi}
                        onClick={() => answerQuiz(oi)}
                        style={{
                          textAlign: 'left', padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
