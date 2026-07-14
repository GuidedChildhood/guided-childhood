'use client'

import { useEffect, useState } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, c => c.charCodeAt(0))
}
import { STAR_MINUTES, PLAY_PAYS_WHY_KID, KID_REQUEST_IDEAS } from '@/lib/quests/templates'
import { printablesForStage } from '@/lib/printables/registry'
import type { StarBank } from '@/lib/quests/bank'
import { lessonsForStage, type KidLesson } from '@/lib/quests/kid-lessons'
import { gamesForStage, type QuestGame } from '@/lib/quest-games/registry'
import QuestGamePlayer from '@/components/quest-games/QuestGamePlayer'
import DeviceTimeCard from '@/components/quests/DeviceTimeCard'
import type { ActiveSession } from '@/lib/quests/device-time'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

// The kid facing quest screen: joyful, huge tap targets, instant ticks,
// stars that count up, and a goal bar. Pending ticks show as "waiting
// for the grown up", approved ones celebrate. No navigation anywhere
// else: this screen is the whole world of the link.

type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; blocks_screens?: boolean }
type Tick = { quest_id: string; status: string }
type Goal = { title: string; stars_needed: number; daily_stars: number | null; achieved_at: string | null } | null
export type KidMission = { id: string; title: string; stars: number; status: string }
export type KidAdventure = { code: string; title: string; catchphrase: string; stageId: number; posterUrl?: string | null; done: boolean; timesCompleted: number }
export type KidAsk = { id: string; title: string; emoji: string; status: string }

export default function KidQuestScreen({
  token, childName, stageId = 2, quests, todayTicks, weekStars, goal, streakDays = 0, laterQuests = [], doneLessonKeys = [], missions = [],
  adventures = [], bank = null, usedWeekMinutes = 0, requests = [], printablesUnlocked = true, activeSession = null,
}: {
  token: string
  childName: string
  stageId?: number
  quests: Quest[]
  todayTicks: Tick[]
  weekStars: number
  goal: Goal
  streakDays?: number
  laterQuests?: { title: string; emoji: string; schedule: string }[]
  doneLessonKeys?: string[]
  missions?: KidMission[]
  adventures?: KidAdventure[]
  bank?: StarBank | null
  usedWeekMinutes?: number
  requests?: KidAsk[]
  printablesUnlocked?: boolean
  activeSession?: ActiveSession | null
}) {
  // Only the games, mini lessons and printables that suit this child's
  // stage, so a young child never meets an older child's content.
  const stageLessons = lessonsForStage(stageId)
  const stageGames = gamesForStage(stageId)
  const stagePrintables = printablesForStage(stageId)
  const [ticks, setTicks] = useState<Record<string, string>>(
    Object.fromEntries(todayTicks.map(t => [t.quest_id, t.status]))
  )
  const [burst, setBurst] = useState<string | null>(null)
  const [remindState, setRemindState] = useState<'hidden' | 'offer' | 'on' | 'ios'>('hidden')
  const [showIosSteps, setShowIosSteps] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [askedMore, setAskedMore] = useState(false)
  const [tab, setTab] = useState<'quests' | 'lessons'>('quests')
  const [doneLessons, setDoneLessons] = useState<Set<string>>(new Set(doneLessonKeys))
  const [activeLesson, setActiveLesson] = useState<KidLesson | null>(null)
  const [activeGame, setActiveGame] = useState<QuestGame | null>(null)
  const [doneGames, setDoneGames] = useState<Set<string>>(new Set())
  const [lessonCard, setLessonCard] = useState(0)
  const [qIndex, setQIndex] = useState(0)
  const [qAnswers, setQAnswers] = useState<number[]>([])
  const [qPicked, setQPicked] = useState<number | null>(null)
  const [asks, setAsks] = useState<KidAsk[]>(requests)
  const [askText, setAskText] = useState('')
  const [askBusy, setAskBusy] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('gc_kid_welcome') !== '1') setShowWelcome(true)
  }, [])

  function dismissWelcome() {
    localStorage.setItem('gc_kid_welcome', '1')
    setShowWelcome(false)
  }

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      // iPhone in plain Safari: Apple only allows reminders once the page
      // lives on the Home Screen, so show the how to instead of nothing.
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const standalone = window.matchMedia('(display-mode: standalone)').matches
        || (navigator as unknown as { standalone?: boolean }).standalone === true
      if (isIos && !standalone) setRemindState('ios')
      return
    }
    if (localStorage.getItem('gc_kid_reminders') === '1' || Notification.permission === 'granted') {
      setRemindState(Notification.permission === 'granted' ? 'on' : 'offer')
      return
    }
    if (Notification.permission !== 'denied') setRemindState('offer')
  }, [])

  // The child pitches their own quest: clean my room, wash the car. It
  // lands with the grown up as an ask, one tap turns it into the real
  // thing with stars attached.
  async function submitAsk(title: string, emoji: string) {
    const clean = title.replace(/\s+/g, ' ').trim().slice(0, 60)
    if (clean.length < 3 || askBusy) return
    if (asks.filter(a => a.status === 'pending').length >= 5) {
      setToast('Lots of ideas already waiting! Ask again once your grown up answers.')
      setTimeout(() => setToast(null), 3500)
      return
    }
    setAskBusy(true)
    setAskText('')
    setAsks(prev => [{ id: `local-${Date.now()}`, title: clean, emoji, status: 'pending' }, ...prev])
    setToast('Quest idea sent to your grown up! ⭐')
    setTimeout(() => setToast(null), 3500)
    try {
      await fetch('/api/quests/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, title: clean, emoji }),
      })
    } catch { /* best effort, the next load reconciles */ }
    setAskBusy(false)
  }

  async function askForMore() {
    setAskedMore(true)
    setToast('Asked! Your grown up just got a ping ⭐')
    setTimeout(() => setToast(null), 3500)
    try {
      await fetch('/api/quests/more', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    } catch { /* best effort */ }
  }

  function openLesson(lesson: KidLesson) {
    setActiveLesson(lesson)
    setLessonCard(0)
    setQIndex(0)
    setQAnswers([])
    setQPicked(null)
  }

  async function finishLesson(lesson: KidLesson, answers: number[]) {
    const correct = lesson.questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0)
    const perfect = correct === lesson.questions.length
    const stars = lesson.stars + (perfect ? lesson.bonusStars : 0)
    setDoneLessons(prev => new Set(prev).add(lesson.key))
    setActiveLesson(null)
    setToast(perfect
      ? `💯 Perfect! ${stars} stars sent, bonus TV time included ⭐`
      : `Lesson done! ⭐ ${stars} stars sent to your grown up.`)
    setTimeout(() => setToast(null), 3500)
    try {
      await fetch('/api/quests/lesson-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, lesson_key: lesson.key, answers }),
      })
    } catch { /* best effort, the next load reconciles */ }
  }

  // A quest game finished. Record the stars server side (fixed, from the
  // registry, never trusted here) while the celebration stays on screen.
  async function recordGame(game: QuestGame) {
    if (doneGames.has(game.key)) return
    setDoneGames(prev => new Set(prev).add(game.key))
    setToast(`${game.stars} stars sent to your grown up! ⭐`)
    setTimeout(() => setToast(null), 3500)
    try {
      await fetch('/api/quests/lesson-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, game_key: game.key }),
      })
    } catch { /* best effort, the next load reconciles */ }
  }

  async function enableReminders() {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setRemindState('hidden'); return }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
      await fetch('/api/quests/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, subscription: sub.toJSON() }),
      })
      localStorage.setItem('gc_kid_reminders', '1')
      setRemindState('on')
    } catch { setRemindState('hidden') }
  }

  async function toggle(quest: Quest) {
    const current = ticks[quest.id]
    if (current === 'approved') return // done is done

    const untick = current === 'pending'
    // Optimistic
    setTicks(prev => {
      const next = { ...prev }
      if (untick) delete next[quest.id]
      else next[quest.id] = 'pending'
      return next
    })
    if (!untick) {
      setBurst(quest.id)
      setTimeout(() => setBurst(null), 900)
      setToast('Sent to your grown up! ⭐ Stars land when they tap approve.')
      setTimeout(() => setToast(null), 3000)
    }

    try {
      await fetch('/api/quests/tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, quest_id: quest.id, untick }),
      })
    } catch { /* optimistic state stands, the next load reconciles */ }
  }

  const doneCount = quests.filter(q => ticks[q.id]).length
  const allDone = quests.length > 0 && doneCount === quests.length
  const pendingStars = quests.filter(q => ticks[q.id] === 'pending').reduce((s, q) => s + q.stars, 0)
  // The bank is what is really there to spend: earned ever, minus the
  // screen time already used. Falls back to the week count until the
  // family has run migration 047.
  const bankBalance = bank ? bank.balance : weekStars

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--deep-teal)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '22px 16px 40px',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Quest game overlay: the child plays, the stars record on finish
          through the same approve loop, the celebration stays until Done. */}
      {activeGame && (
        <QuestGamePlayer
          game={activeGame}
          onComplete={() => recordGame(activeGame)}
          onClose={() => setActiveGame(null)}
        />
      )}
      <style>{`
        @keyframes kid-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.25) rotate(-4deg); }
          100% { transform: scale(1); }
        }
        @keyframes kid-star-rise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-46px) scale(1.25); opacity: 0; }
        }
      `}</style>

      {/* The sent it toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 'max(16px, env(safe-area-inset-top))', left: '16px', right: '16px', zIndex: 50,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '14px', padding: '12px 18px', maxWidth: '420px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', textAlign: 'center',
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          }}>
            {toast}
          </div>
        </div>
      )}

      <div style={{ width: 'min(100%, 460px)' }}>
        {/* First visit: how this works, in kid language */}
        {showWelcome && (
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '18px 20px', marginBottom: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', margin: '0 0 10px' }}>
              Hi {childName}! This page is yours. 👋
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '14px' }}>
              {[
                'Do a quest in real life, then tap it here. Your grown up gets told straight away.',
                'When they tap approve, your stars land and count toward your prize.',
                'Make it one tap from your Home Screen: in Safari tap Share (the square with the arrow), then Add to Home Screen.',
                'Tap the 🔔 button below so I can remind you about your quests.',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--terracotta)', color: 'var(--ink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.55 }}>{step}</span>
                </div>
              ))}
            </div>
            <button
              onClick={dismissWelcome}
              style={{
                width: '100%', padding: '12px', background: 'var(--terracotta)', color: 'var(--ink)',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                boxShadow: '0 4px 0 var(--terracotta-dark)',
              }}
            >
              Got it, let me at my quests
            </button>
          </div>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
            Today&apos;s quests
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.2rem)', color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Go {childName}!
          </h1>
        </div>

        {/* Star bank */}
        <div style={{
          background: 'var(--terracotta)', borderRadius: '20px', padding: '16px 20px',
          boxShadow: '0 5px 0 var(--terracotta-dark)', marginBottom: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.7, margin: '0 0 2px' }}>
              My star bank
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: 0 }}>
              ⭐ {bankBalance}
              {pendingStars > 0 && (
                <span style={{ fontSize: '0.95rem', fontWeight: 700, opacity: 0.65 }}> +{pendingStars} waiting</span>
              )}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', opacity: 0.8, margin: '2px 0 0' }}>
              = {bankBalance * STAR_MINUTES} minutes of screen time to use
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink)', opacity: 0.65, margin: '4px 0 0' }}>
              +⭐ {weekStars} earned this week{usedWeekMinutes > 0 ? ` · ${usedWeekMinutes} min used` : ''}
            </p>
          </div>
          {streakDays > 0 && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>🔥</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)' }}>{streakDays}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.7 }}>day streak</div>
            </div>
          )}
        </div>

        {/* Device time: turn earned stars into minutes on an agreed device,
            with the countdown and the alarm when the time is up. */}
        <DeviceTimeCard token={token} balanceStars={bankBalance} initialSession={activeSession} />

        {/* Today's goal: enough stars in one day completes the day */}
        {goal?.daily_stars ? (() => {
          const todayStars = quests.reduce((sum, q) => {
            const st = ticks[q.id]
            return st && st !== 'rejected' ? sum + q.stars : sum
          }, 0)
          const target = goal.daily_stars as number
          const dayComplete = todayStars >= target
          return (
            <div style={{
              background: dayComplete ? 'var(--terracotta)' : 'rgba(255,255,255,0.12)',
              borderRadius: '16px', padding: '14px 18px', marginBottom: '12px',
              boxShadow: dayComplete ? '0 5px 0 var(--terracotta-dark)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: dayComplete ? 'var(--ink)' : '#fff' }}>
                  {dayComplete ? `Day complete! You hit today's goal 🎉` : `Today's goal`}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: dayComplete ? 'var(--ink)' : 'rgba(255,255,255,0.85)' }}>
                  ⭐ {Math.min(todayStars, target)}/{target}
                </span>
              </div>
              <div style={{ height: '10px', borderRadius: '10px', background: dayComplete ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '10px', background: dayComplete ? '#fff' : 'var(--terracotta)',
                  width: `${Math.min(100, (todayStars / Math.max(1, target)) * 100)}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          )
        })() : null}

        {/* Goal bar */}
        {goal && (
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Saving for: {goal.title}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                {Math.min(bankBalance, goal.stars_needed)}/{goal.stars_needed}
              </span>
            </div>
            <div style={{ height: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '10px', background: 'var(--terracotta)',
                width: `${Math.min(100, (bankBalance / Math.max(1, goal.stars_needed)) * 100)}%`,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )}

        {/* Tabs: quests and lessons, both earn stars */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {([['quests', '⭐ My quests'], ['lessons', '🧠 My lessons']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setActiveLesson(null) }}
              style={{
                flex: 1, padding: '13px 10px', borderRadius: '14px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
                background: tab === key ? 'var(--terracotta)' : 'rgba(255,255,255,0.12)',
                color: tab === key ? 'var(--ink)' : '#fff',
                border: tab === key ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                boxShadow: tab === key ? '0 4px 0 var(--terracotta-dark)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'quests' && (<>
        {/* Why outside pays best: the philosophy, in kid words */}
        <div style={{
          display: 'flex', gap: '12px', alignItems: 'flex-start',
          background: 'rgba(255,255,255,0.08)', borderRadius: '16px',
          padding: '13px 16px', marginBottom: '14px',
        }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>🌳</span>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, margin: 0 }}>
            {PLAY_PAYS_WHY_KID}
          </p>
        </div>

        {/* Screens wait: any quest flagged blocks_screens and not yet
            approved sits at the top of the list behind this banner. */}
        {quests.some(q => q.blocks_screens && ticks[q.id] !== 'approved') && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'center',
            background: 'var(--terracotta)', borderRadius: '14px',
            padding: '11px 15px', marginBottom: '12px',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}>
            <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>📵</span>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>
              These come first today. Screens after.
            </p>
          </div>
        )}

        {/* Quest list, screens wait quests first */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quests.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '16.5px', lineHeight: 1.6 }}>
              No quests set for today yet. Ask your grown up to send some!
            </p>
          )}
          {[...quests].sort((a, b) => Number(Boolean(b.blocks_screens)) - Number(Boolean(a.blocks_screens))).map(q => {
            const state = ticks[q.id]
            const done = Boolean(state)
            return (
              <button
                key={q.id}
                onClick={() => toggle(q)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: state === 'approved' ? 'var(--tint-sage)' : done ? '#FFF7E0' : '#fff',
                  border: 'none', borderRadius: '20px', padding: '16px 18px',
                  cursor: state === 'approved' ? 'default' : 'pointer', textAlign: 'left',
                  boxShadow: done ? '0 2px 0 rgba(0,0,0,0.12)' : '0 5px 0 rgba(0,0,0,0.18)',
                  transform: done ? 'translateY(3px)' : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  animation: burst === q.id ? 'kid-pop 0.5s ease' : undefined,
                }}
              >
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{q.emoji}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '1.15rem', color: 'var(--ink)', lineHeight: 1.3,
                    textDecoration: state === 'approved' ? 'line-through' : 'none',
                    opacity: state === 'approved' ? 0.6 : 1,
                  }}>
                    {q.title}
                  </span>
                  <span style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 2 }}>
                    {state === 'approved' ? 'Done! Stars landed ⭐' : state === 'pending' ? 'Waiting for your grown up ✓' : `Worth ${q.stars} star${q.stars === 1 ? '' : 's'}`}
                    {q.blocks_screens && state !== 'approved' && (
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
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--terracotta)' : 'var(--cream)',
                  border: done ? 'none' : '2.5px dashed var(--ink-light)',
                  fontSize: '18px', position: 'relative',
                }}>
                  {done ? '✓' : ''}
                  {burst === q.id && (
                    <span style={{ position: 'absolute', animation: 'kid-star-rise 0.9s ease-out forwards', fontSize: '20px' }}>⭐</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {allDone && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: '#fff', margin: '0 0 4px' }}>
              Today&apos;s list is done! 🎉
            </p>
            <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.85)', margin: '0 0 14px' }}>
              Amazing work {childName}. Your grown up is approving your stars.
            </p>
            <button
              onClick={askForMore}
              disabled={askedMore}
              style={{
                padding: '12px 22px', borderRadius: '14px', cursor: askedMore ? 'default' : 'pointer',
                background: askedMore ? 'rgba(255,255,255,0.12)' : 'var(--terracotta)',
                color: askedMore ? 'rgba(255,255,255,0.8)' : 'var(--ink)',
                border: askedMore ? '1.5px solid rgba(255,255,255,0.3)' : 'none',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                boxShadow: askedMore ? 'none' : '0 4px 0 var(--terracotta-dark)',
              }}
            >
              {askedMore ? 'Asked ✓ watch this space' : 'Ask for more quests ⭐'}
            </button>
          </div>
        )}

        {/* Pitch your own quest: the child's idea becomes a real quest the
            moment the grown up says yes */}
        <div style={{ marginTop: '18px', background: 'rgba(255,255,255,0.1)', borderRadius: '18px', padding: '16px 18px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: '#fff', margin: '0 0 4px' }}>
            Got a quest idea? 💡
          </p>
          <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: '0 0 12px' }}>
            Pitch it to your grown up. If they say yes it becomes a real quest with stars on it.
          </p>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {KID_REQUEST_IDEAS.filter(idea => !asks.some(a => a.title === idea.title)).slice(0, 4).map(idea => (
              <button
                key={idea.title}
                onClick={() => submitAsk(idea.title, idea.emoji)}
                style={{
                  padding: '9px 13px', borderRadius: '100px', cursor: 'pointer',
                  background: '#fff', border: 'none',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)',
                  boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
                }}
              >
                {idea.emoji} {idea.title}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={askText}
              onChange={e => setAskText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitAsk(askText, '⭐') }}
              placeholder="Or your own idea..."
              maxLength={60}
              style={{
                flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: '12px',
                border: 'none', background: '#fff',
                fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', outline: 'none',
              }}
            />
            <button
              onClick={() => submitAsk(askText, '⭐')}
              disabled={askText.trim().length < 3}
              style={{
                padding: '12px 18px', borderRadius: '12px', border: 'none', flexShrink: 0,
                cursor: askText.trim().length < 3 ? 'default' : 'pointer',
                background: 'var(--terracotta)', color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                boxShadow: '0 3px 0 var(--terracotta-dark)',
                opacity: askText.trim().length < 3 ? 0.55 : 1,
              }}
            >
              Pitch it
            </button>
          </div>
          {asks.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {asks.slice(0, 6).map(a => (
                <p key={a.id} style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                  {a.emoji} {a.title}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, marginLeft: '7px', color: a.status === 'added' ? 'var(--terracotta)' : a.status === 'declined' ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.7)' }}>
                    {a.status === 'added' ? 'IT IS ON ⭐' : a.status === 'declined' ? 'NOT THIS TIME' : 'WAITING...'}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Quests waiting on other days, so done today never reads as done forever */}
        {laterQuests.length > 0 && (
          <div style={{ marginTop: '22px', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 18px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 8px' }}>
              Coming up, not today
            </p>
            {laterQuests.map((q, i) => (
              <p key={i} style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.8)', margin: '0 0 4px', lineHeight: 1.5 }}>
                {q.emoji} {q.title}
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {' '}· {q.schedule === 'weekdays' ? 'school days' : q.schedule === 'weekend' ? 'weekends' : q.schedule === 'once' ? 'one time' : 'every day'}
                </span>
              </p>
            ))}
          </div>
        )}
        </>)}

        {/* Lessons: two minutes, real skills, stars through the same approve loop */}
        {tab === 'lessons' && (
          activeLesson ? (
            <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 6px 0 rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)' }}>
                  {activeLesson.emoji} {activeLesson.title}
                </span>
                <button
                  onClick={() => setActiveLesson(null)}
                  aria-label="Close lesson"
                  style={{ background: 'var(--cream)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '14px', cursor: 'pointer', color: 'var(--ink-soft)' }}
                >
                  ✕
                </button>
              </div>

              {/* Progress dots: cards then quiz questions */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                {[...activeLesson.cards, ...activeLesson.questions].map((_, i) => {
                  const progress = lessonCard < activeLesson.cards.length
                    ? lessonCard
                    : activeLesson.cards.length + Math.min(qIndex, activeLesson.questions.length - 1)
                  return (
                    <span key={i} style={{
                      flex: 1, height: '6px', borderRadius: '6px',
                      background: i <= progress ? 'var(--terracotta)' : 'var(--border)',
                    }} />
                  )
                })}
              </div>

              {lessonCard < activeLesson.cards.length ? (
                <>
                  <p style={{ fontSize: '17px', color: 'var(--ink)', lineHeight: 1.6, minHeight: '110px', margin: '0 0 18px', fontWeight: 500 }}>
                    {activeLesson.cards[lessonCard]}
                  </p>
                  <button
                    onClick={() => setLessonCard(c => c + 1)}
                    style={{
                      width: '100%', padding: '15px', background: 'var(--terracotta)', color: 'var(--ink)',
                      border: 'none', borderRadius: '14px', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
                      boxShadow: '0 4px 0 var(--terracotta-dark)',
                    }}
                  >
                    {lessonCard === activeLesson.cards.length - 1 ? 'Ready for the quiz' : 'Next'}
                  </button>
                </>
              ) : qIndex < activeLesson.questions.length ? (() => {
                const question = activeLesson.questions[qIndex]
                const answered = qPicked !== null
                return (
                  <>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>
                      Question {qIndex + 1} of {activeLesson.questions.length} · 100% earns the bonus ⭐
                    </p>
                    <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 14px' }}>
                      {question.q}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '14px' }}>
                      {question.options.map((opt, i) => {
                        const isRight = i === question.answer
                        const showState = answered && (i === qPicked || isRight)
                        return (
                          <button
                            key={i}
                            onClick={() => !answered && setQPicked(i)}
                            disabled={answered}
                            style={{
                              padding: '14px 16px', borderRadius: '14px', textAlign: 'left',
                              cursor: answered ? 'default' : 'pointer',
                              fontSize: '15.5px', fontWeight: 600, lineHeight: 1.45,
                              background: showState ? (isRight ? 'var(--tint-sage)' : '#F6DBD3') : 'var(--cream)',
                              border: showState ? '2px solid ' + (isRight ? 'var(--terracotta)' : 'var(--danger, #C0533E)') : '2px solid var(--border)',
                              color: 'var(--ink)', opacity: answered && !showState ? 0.55 : 1,
                            }}
                          >
                            {opt}{answered && isRight ? ' ✓' : ''}
                          </button>
                        )
                      })}
                    </div>
                    {answered && (
                      <>
                        <p style={{ fontSize: '15px', lineHeight: 1.5, margin: '0 0 14px', fontWeight: 700, color: 'var(--ink)' }}>
                          {qPicked === question.answer ? 'Right! ⭐' : 'Not that one, the green answer is the keeper.'}
                        </p>
                        <button
                          onClick={() => {
                            setQAnswers(prev => [...prev, qPicked as number])
                            setQPicked(null)
                            setQIndex(i => i + 1)
                          }}
                          style={{
                            width: '100%', padding: '15px', background: 'var(--terracotta)', color: 'var(--ink)',
                            border: 'none', borderRadius: '14px', cursor: 'pointer',
                            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
                            boxShadow: '0 4px 0 var(--terracotta-dark)',
                          }}
                        >
                          {qIndex === activeLesson.questions.length - 1 ? 'See my score' : 'Next question'}
                        </button>
                      </>
                    )}
                  </>
                )
              })() : (() => {
                const correct = activeLesson.questions.reduce((sum, q, i) => sum + (qAnswers[i] === q.answer ? 1 : 0), 0)
                const perfect = correct === activeLesson.questions.length
                const stars = activeLesson.stars + (perfect ? activeLesson.bonusStars : 0)
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '8px' }}>{perfect ? '💯' : '⭐'}</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--ink)', margin: '0 0 6px' }}>
                      {correct} out of {activeLesson.questions.length}!
                    </p>
                    <p style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
                      {perfect
                        ? `Perfect score! That earns the bonus star: ${stars} stars = ${stars * STAR_MINUTES} minutes of TV time once your grown up approves.`
                        : `You earned ${stars} stars = ${stars * STAR_MINUTES} minutes of screen time. A perfect score on the next lesson earns the bonus star!`}
                    </p>
                    <button
                      onClick={() => finishLesson(activeLesson, qAnswers)}
                      style={{
                        width: '100%', padding: '15px', background: 'var(--terracotta)', color: 'var(--ink)',
                        border: 'none', borderRadius: '14px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
                        boxShadow: '0 4px 0 var(--terracotta-dark)',
                      }}
                    >
                      Send my {stars} stars to my grown up ⭐
                    </button>
                  </div>
                )
              })()}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: '15.5px', lineHeight: 1.55, margin: '0 0 2px' }}>
                Two minute lessons with a quiz at the end. Get 100% and a bonus star lands, that is extra TV time!
              </p>

              {/* Watch together adventures: current stage first, earlier
                  stages below (catch up without ever calling it that). The
                  drawn film frame is the thumbnail. Redo earns 2 more. */}
              {adventures.length > 0 && (
                <>
                  <SectionHead icon="🎬">Watch with your grown up</SectionHead>
                  {adventures.filter(a => a.stageId === stageId).map(a => (
                    <AdventureCard key={a.code} adventure={a} token={token} />
                  ))}
                  {adventures.some(a => a.stageId < stageId) && (
                    <>
                      <SectionHead icon="🍿">Earlier adventures</SectionHead>
                      {adventures.filter(a => a.stageId < stageId).map(a => (
                        <AdventureCard key={a.code} adventure={a} token={token} />
                      ))}
                    </>
                  )}
                </>
              )}

              {missions.length > 0 && (
                <>
                  <SectionHead icon="⭐">Star lessons from your grown up</SectionHead>
                  {missions.map(m => {
                    const done = m.status === 'done'
                    return (
                      <a key={m.id} href={`/k/${token}/lesson/${m.id}`} style={bigCardShell(done)}>
                        <CardFace
                          seed={m.id} done={done}
                          emoji={done ? '🏆' : '🎬'}
                          title={m.title}
                          subtitle={done ? 'Done! Stars landed ⭐ Play again any time' : `The big one, with DiGi · worth ${m.stars} star${m.stars === 1 ? '' : 's'}`}
                          pill={`⭐ ${m.stars}`}
                          actionIcon="▶"
                        />
                      </a>
                    )
                  })}
                </>
              )}

              {stageLessons.length > 0 && <SectionHead icon="🧠">My lessons</SectionHead>}
              {stageLessons.map(lesson => {
                const done = doneLessons.has(lesson.key)
                return (
                  <button key={lesson.key} onClick={() => !done && openLesson(lesson)} disabled={done} style={bigCardShell(done)}>
                    <CardFace
                      seed={lesson.key} done={done}
                      emoji={lesson.emoji}
                      title={lesson.title}
                      subtitle={done ? 'Done! Stars with your grown up ⭐' : `Worth ${lesson.stars} stars, +${lesson.bonusStars} bonus at 100% · 2 minutes`}
                      pill={`⭐ ${lesson.stars}`}
                      actionIcon="▶"
                    />
                  </button>
                )
              })}

              {stageGames.length > 0 && <SectionHead icon="🎮">Games to play</SectionHead>}
              {stageGames.map(game => {
                const done = doneGames.has(game.key)
                return (
                  <button key={game.key} onClick={() => !done && setActiveGame(game)} disabled={done} style={bigCardShell(done)}>
                    <CardFace
                      seed={game.key} done={done}
                      emoji={game.emoji}
                      title={game.title}
                      subtitle={done ? 'Done! Stars with your grown up ⭐' : `A game, worth ${game.stars} stars`}
                      pill={`⭐ ${game.stars}`}
                      actionIcon="🎮"
                    />
                  </button>
                )
              })}

              {/* Printable adventures: the child browses their stage's sheets
                  and the ask rides the same pitch flow as quest ideas. The
                  real preview is the big thumbnail; the grown up prints it,
                  the finished page pays the stars. */}
              {printablesUnlocked && stagePrintables.length > 0 && (
                <>
                  <SectionHead icon="🖨️">Paper adventures</SectionHead>
                  {stagePrintables.map(p => {
                    const askedTitle = `Print the ${p.title} sheet`
                    const asked = asks.some(a => a.title === askedTitle)
                    return (
                      <div key={p.key} style={bigCardShell(false)}>
                        <div style={{ position: 'relative', height: '112px', background: '#EFE9DD', overflow: 'hidden' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', top: '9px', left: '11px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.85)', borderRadius: '100px', padding: '3px 9px' }}>
                            ⭐ {p.stars}
                          </span>
                        </div>
                        <div style={{ padding: '13px 16px 15px' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '3px' }}>
                            {p.emoji} {p.title}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.4, marginBottom: '11px' }}>
                            A colouring sheet, worth {p.stars} stars when the whole page is done
                          </div>
                          <button
                            onClick={() => submitAsk(askedTitle, '🖨️')}
                            disabled={asked}
                            style={{
                              width: '100%', padding: '13px', borderRadius: '14px', border: 'none',
                              cursor: asked ? 'default' : 'pointer',
                              background: asked ? 'var(--tint-sage)' : 'var(--terracotta)', color: 'var(--ink)',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
                              boxShadow: asked ? 'none' : '0 4px 0 var(--terracotta-dark)',
                            }}
                          >
                            {asked ? 'Asked your grown up ✓' : '🖨️ Ask for a print out'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}

              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.5, margin: '6px 0 0' }}>
                More lessons land here soon. Finished them all? Ask for more quests on the other tab!
              </p>
            </div>
          )
        )}

        {remindState === 'offer' && (
          <button
            onClick={enableReminders}
            style={{
              width: '100%', marginTop: '20px', padding: '13px 16px',
              background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.35)',
              borderRadius: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: '#fff',
            }}
          >
            🔔 Remind me about my quests
          </button>
        )}
        {remindState === 'on' && (
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.75)', marginTop: '18px' }}>
            🔔 Reminders on. Morning and after school nudges, never at bedtime.
          </p>
        )}
        {remindState === 'ios' && (
          <>
            <button
              onClick={() => setShowIosSteps(v => !v)}
              style={{
                width: '100%', marginTop: '20px', padding: '13px 16px',
                background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.35)',
                borderRadius: '14px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: '#fff',
              }}
            >
              🔔 Want quest reminders? Add me to your Home Screen
            </button>
            {showIosSteps && (
              <div style={{ marginTop: '10px', background: '#fff', borderRadius: '16px', padding: '16px 18px' }}>
                {[
                  <>Tap the <strong>Share</strong> button at the bottom of Safari, the square with the arrow pointing up.</>,
                  <>Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</>,
                  <>Open your quests from the <strong>new icon</strong> on your Home Screen.</>,
                  <>Tap the <strong>🔔 Remind me</strong> button that appears, and you are set.</>,
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < 3 ? '9px' : 0 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--terracotta)', color: 'var(--ink)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.55 }}>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <button
          onClick={() => { setShowWelcome(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            display: 'block', margin: '24px auto 0', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            color: 'rgba(255,255,255,0.65)', textDecoration: 'underline', fontFamily: 'var(--font-body)',
          }}
        >
          How does this page work?
        </button>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginTop: '14px' }}>
          GUIDED CHILDHOOD QUESTS
        </p>
      </div>
    </div>
  )
}

// A watch together adventure card: the big thumbnail film look, the drawn
// frame as its picture, snuggle up framing, and complete ones stay open
// because the redo IS the feature (2 more stars every rewatch).
function AdventureCard({ adventure, token }: { adventure: KidAdventure; token: string }) {
  const done = adventure.done
  return (
    <a href={`/k/${token}/adventures/${adventure.code}`} style={bigCardShell(done)}>
      <CardFace
        seed={adventure.code} done={done}
        image={adventure.posterUrl ?? undefined}
        emoji={done ? '🏆' : '🍿'}
        title={adventure.title}
        subtitle={done
          ? `Done${adventure.timesCompleted > 1 ? ` ×${adventure.timesCompleted}` : ''}! Watch again for 2 more stars ⭐`
          : 'Snuggle up with your grown up · worth 10 stars'}
        pill="⭐ 10"
        actionIcon={done ? '↻' : '▶'}
      />
    </a>
  )
}

// ── Big thumbnail cards ── the tidy, joyful look Justin asked for: one
// cheerful picture banner per card, then a bold title, a plain line and a
// round tap mark. A drawn image fills the banner when there is one, else a
// bright gradient carries a big emoji. Newsletter warm, kid huge.
const CARD_GRADIENTS = [
  'linear-gradient(140deg,#FFD86B,#FF9E7A)',
  'linear-gradient(140deg,#8FD3FF,#7EA6FF)',
  'linear-gradient(140deg,#FFB0C8,#FF8FA8)',
  'linear-gradient(140deg,#9EE6C4,#54C79A)',
  'linear-gradient(140deg,#C7B2FF,#9B8CFF)',
  'linear-gradient(140deg,#FFC97A,#FF9F5A)',
]
// A stable pick from a string, so a card keeps its colour across renders
// (no Math.random, which would reshuffle every paint).
function gradientFor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return CARD_GRADIENTS[h % CARD_GRADIENTS.length]
}

function bigCardShell(done: boolean): React.CSSProperties {
  return {
    display: 'block', width: '100%', textAlign: 'left', padding: 0,
    background: '#fff', border: 'none', borderRadius: '22px', overflow: 'hidden',
    textDecoration: 'none', cursor: done ? 'default' : 'pointer',
    boxShadow: done ? '0 2px 0 rgba(0,0,0,0.12)' : '0 6px 0 rgba(0,0,0,0.18)',
    transform: done ? 'translateY(3px)' : 'none',
  }
}

function SectionHead({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 1px' }}>
      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.01em' }}>
        {children}
      </span>
    </div>
  )
}

function CardFace({
  emoji, title, subtitle, seed, done, image, pill, actionIcon,
}: {
  emoji: string; title: string; subtitle: string; seed: string; done: boolean
  image?: string; pill?: string; actionIcon: string
}) {
  return (
    <>
      <div style={{ position: 'relative', height: '112px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: image ? '#EFE9DD' : gradientFor(seed) }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: done ? 0.85 : 1 }} />
        ) : (
          <span style={{ fontSize: '3.3rem', lineHeight: 1, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.18))', opacity: done ? 0.85 : 1 }}>{emoji}</span>
        )}
        {pill && (
          <span style={{ position: 'absolute', top: '9px', left: '11px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.85)', borderRadius: '100px', padding: '3px 9px' }}>
            {pill}
          </span>
        )}
        {done && (
          <span style={{ position: 'absolute', top: '9px', right: '10px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '3px 9px' }}>
            ✓ Done
          </span>
        )}
      </div>
      <div style={{ padding: '13px 16px 15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.1rem', color: 'var(--ink)', lineHeight: 1.25,
            textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1,
          }}>
            {title}
          </span>
          <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: '3px', lineHeight: 1.4 }}>
            {subtitle}
          </span>
        </span>
        <span style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: done ? 'var(--terracotta)' : 'var(--cream)',
          border: done ? 'none' : '2.5px dashed var(--ink-light)',
          fontSize: '18px',
        }}>
          {done ? '✓' : actionIcon}
        </span>
      </div>
    </>
  )
}
