'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, c => c.charCodeAt(0))
}
import { STAR_MINUTES, KID_REQUEST_IDEAS } from '@/lib/quests/templates'
import { printablesForStage } from '@/lib/printables/registry'
import type { StarBank } from '@/lib/quests/bank'
import { lessonsForStage, type KidLesson } from '@/lib/quests/kid-lessons'
import { gamesForStage, type QuestGame } from '@/lib/quest-games/registry'
import QuestGamePlayer from '@/components/quest-games/QuestGamePlayer'
import DeviceTimeCard from '@/components/quests/DeviceTimeCard'
import type { ActiveSession } from '@/lib/quests/device-time'
import { playKidSound, soundEnabled, setSoundEnabled } from '@/lib/sound/kidSounds'
import HappyNews, { type HappyNewsItem, type CharacterKey } from '@/components/celebrate/HappyNews'
import HappyScene from '@/components/celebrate/HappyScene'
import BalanceInsight from '@/components/celebrate/BalanceInsight'
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
export type KidSchoolToday = { id: string; title: string; kind: string; time: string | null }

export default function KidQuestScreen({
  token, childName, stageId = 2, quests, todayTicks, weekStars, goal, streakDays = 0, laterQuests = [], doneLessonKeys = [], missions = [],
  adventures = [], bank = null, usedWeekMinutes = 0, usedTodayMinutes = 0, recommendedMinutes = 0, requests = [], printablesUnlocked = true, activeSession = null,
  weekChart = [], schoolToday = [],
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
  usedTodayMinutes?: number
  recommendedMinutes?: number
  requests?: KidAsk[]
  printablesUnlocked?: boolean
  activeSession?: ActiveSession | null
  weekChart?: { label: string; count: number; today: boolean }[]
  schoolToday?: KidSchoolToday[]
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
  const [tab, setTab] = useState<'quests' | 'lessons' | 'print'>('quests')
  const [doneLessons, setDoneLessons] = useState<Set<string>>(new Set(doneLessonKeys))
  const [activeLesson, setActiveLesson] = useState<KidLesson | null>(null)
  const [activeGame, setActiveGame] = useState<QuestGame | null>(null)
  const [doneGames, setDoneGames] = useState<Set<string>>(new Set())
  // Finished quests fold away into a quiet strip so the daily list stays the
  // things still to do, not a long wall of ticked off cards.
  const [showKidDone, setShowKidDone] = useState(false)
  const [lessonCard, setLessonCard] = useState(0)
  const [qIndex, setQIndex] = useState(0)
  const [qAnswers, setQAnswers] = useState<number[]>([])
  const [qPicked, setQPicked] = useState<number | null>(null)
  const [asks, setAsks] = useState<KidAsk[]>(requests)
  const [askText, setAskText] = useState('')
  const [askBusy, setAskBusy] = useState(false)
  // My lessons is split into sub-tabs (Watch, Learn, Games, Print) with a red
  // dot when a grown up has pinged something new. "New" means an item this
  // child has not opened yet, tracked in localStorage on their own device.
  const [lessonTab, setLessonTab] = useState<'watch' | 'learn' | 'games'>('watch')
  const [seenLessons, setSeenLessons] = useState<Set<string>>(new Set())
  const [soundOn, setSoundOn] = useState(true)
  const [happyNews, setHappyNews] = useState<HappyNewsItem | null>(null)
  const router = useRouter()
  const [goalRedeemed, setGoalRedeemed] = useState(Boolean(goal?.achieved_at))
  const [goalConfirm, setGoalConfirm] = useState(false)
  const [goalBusy, setGoalBusy] = useState(false)

  // Cash in the saved-for reward once the bank truly holds enough. Two taps so
  // it is never accidental: the first arms it, the second spends the stars.
  async function redeemGoal() {
    if (!goal || goalBusy || goalRedeemed) return
    setGoalBusy(true)
    try {
      const res = await fetch('/api/quests/goal/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setGoalRedeemed(true)
        setGoalConfirm(false)
        playKidSound('done')
        setHappyNews({ character: 'oliver', headline: 'You earned it! 🎉', sub: `Your grown up knows. Time to enjoy ${goal.title}!` })
        router.refresh()
      } else {
        setToast(data.error === 'not enough stars' ? 'Not quite enough stars yet.' : 'Could not redeem, try again.')
        setTimeout(() => setToast(null), 3000)
      }
    } catch { setToast('Could not redeem, try again.'); setTimeout(() => setToast(null), 3000) }
    setGoalBusy(false)
  }

  useEffect(() => {
    if (localStorage.getItem('gc_kid_welcome') !== '1') setShowWelcome(true)
    setSoundOn(soundEnabled())
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

  // Print it now: the child can send the sheet to a printer themselves, not
  // only ask a grown up. The sheet art is public on the CDN, so a small
  // print window shows just the page and prints it. If a popup is blocked,
  // opening the image straight is the fallback so the button never dead ends.
  function printSheet(sheetUrl: string, title: string) {
    const w = window.open('', '_blank')
    if (!w) { window.open(sheetUrl, '_blank'); return }
    w.document.write(
      `<!doctype html><html><head><title>${title}</title>` +
      `<style>@page{margin:8mm}html,body{margin:0;padding:0}img{width:100%;display:block}</style></head>` +
      `<body><img src="${sheetUrl}" alt="${title}" onload="setTimeout(function(){window.focus();window.print()},250)"></body></html>`
    )
    w.document.close()
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
      playKidSound('star')
      // A squad friend springs up with the good news, rotating so it is not
      // always the same face. The toast stays as the quiet backup line.
      const cast: CharacterKey[] = ['oliver', 'zara', 'digi']
      const who = cast[quest.title.length % cast.length]
      setHappyNews({
        character: who,
        headline: `${quest.stars} star${quest.stars === 1 ? '' : 's'} on the way!`,
        sub: 'Sent to your grown up. They tap approve and the stars are yours.',
      })
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

  // DiGi's line for the top bar: one short, clear, useful thing for the child
  // right now, read from their own numbers. Calm and encouraging, never a
  // telling off, and it always says something.
  const remainingToday = quests.length - doneCount
  const goalLeft = goal?.stars_needed ? goal.stars_needed - bankBalance : null
  const digiTip =
    (goalLeft != null && goalLeft > 0 && goalLeft <= 6) ? `Just ${goalLeft} more star${goalLeft === 1 ? '' : 's'} and you reach your prize!`
    : (quests.length > 0 && remainingToday === 0) ? 'Everything done today. You are a superstar!'
    : (pendingStars > 0) ? `${pendingStars} star${pendingStars === 1 ? '' : 's'} waiting for your grown up to say yes.`
    : (streakDays >= 1 && remainingToday > 0) ? `Do one quest today to keep your ${streakDays} day streak going.`
    : (remainingToday > 0) ? 'Tick a quest to earn stars for screen time.'
    : 'Nice work. Ask your grown up for more quests when you are ready.'

  // Welcome back celebrations: when the child opens their screen and something
  // grew while they were away, a squad friend springs up to mark it. Two
  // moments, each fired at most once per milestone so it is a treat, not a
  // nag: crossing a star bank milestone (their grown up approved stars up to a
  // round number), and being on a streak of three days or more. localStorage
  // on their own device remembers what has already been celebrated.
  useEffect(() => {
    const BANK_MILES = [10, 25, 50, 100, 200, 500]
    try {
      const seenBank = Number(localStorage.getItem('gc_kid_bank_mile') || '0')
      const hit = [...BANK_MILES].reverse().find(m => bankBalance >= m && m > seenBank)
      if (hit) {
        localStorage.setItem('gc_kid_bank_mile', String(hit))
        setHappyNews({ character: 'zara', headline: `${hit} stars in the bank!`, sub: `That is ${hit * STAR_MINUTES} minutes of screen time earned. Superstar.` })
        return
      }
      if (streakDays >= 3) {
        const key = `${new Date().toISOString().slice(0, 10)}:${streakDays}`
        if (localStorage.getItem('gc_kid_streak_seen') !== key) {
          localStorage.setItem('gc_kid_streak_seen', key)
          setHappyNews({ character: 'oliver', headline: `${streakDays} day streak!`, sub: 'You have shown up every day. That is how champions train. Keep it going!' })
          return
        }
      }
      // The daily hello: first open of the day, DiGi shows what is waiting so
      // the to-do is obvious the moment they land. Once per day.
      const today = new Date().toISOString().slice(0, 10)
      const remaining = quests.length - doneCount
      if (remaining > 0 && localStorage.getItem('gc_kid_today_seen') !== today) {
        localStorage.setItem('gc_kid_today_seen', today)
        setHappyNews({ character: 'digi', headline: `Hi ${childName}! ${remaining} thing${remaining === 1 ? '' : 's'} to do today`, sub: 'Tick each one as you go and watch your stars grow. You have got this!' })
      }
    } catch { /* localStorage off, skip the treat */ }
    // Runs once on open with the values the server rendered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── My lessons sub-tabs and the "something new" dots ──
  // Only grown up sent content counts as new (adventures, star lessons, and
  // unlocked printables); the games and mini lesson libraries are always
  // there, so they never flag as new.
  const watchIds = adventures.map(a => `adv:${a.code}`)
  const learnIds = missions.map(m => `mis:${m.id}`)
  // Printables have their own top level tab now, so their new count feeds that
  // tab's badge, not the lessons one. Shown to the child either way so the
  // ask-a-grown-up path always works; the paywall only gates printing.
  const printIds = stagePrintables.map(p => `prn:${p.key}`)
  const newWatch = watchIds.filter(id => !seenLessons.has(id)).length
  const newLearn = learnIds.filter(id => !seenLessons.has(id)).length
  const newPrint = printIds.filter(id => !seenLessons.has(id)).length
  const totalNewLessons = newWatch + newLearn

  const hasWatch = adventures.length > 0
  const hasLearn = missions.length > 0 || stageLessons.length > 0
  const hasGames = stageGames.length > 0
  const LESSON_TABS = [
    { key: 'watch' as const, label: 'Watch', icon: '📺', has: hasWatch, dot: newWatch },
    { key: 'learn' as const, label: 'Learn', icon: '🧠', has: hasLearn, dot: newLearn },
    { key: 'games' as const, label: 'Games', icon: '🎮', has: hasGames, dot: 0 },
  ]
  const availableLessonTabs = LESSON_TABS.filter(t => t.has)
  // Keep the sub-tab valid; if the current one has no content, fall to the
  // first that does (preferring one with something new to see).
  const activeLessonTab = availableLessonTabs.some(t => t.key === lessonTab)
    ? lessonTab
    : (availableLessonTabs.find(t => t.dot > 0)?.key ?? availableLessonTabs[0]?.key ?? 'watch')

  // Load what this child has already seen, once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gc_kid_seen_lessons')
      if (raw) setSeenLessons(new Set(JSON.parse(raw) as string[]))
    } catch { /* first visit, nothing seen */ }
  }, [])

  function markLessonsSeen(ids: string[]) {
    if (ids.length === 0) return
    setSeenLessons(prev => {
      if (ids.every(i => prev.has(i))) return prev
      const next = new Set(prev)
      ids.forEach(i => next.add(i))
      try { localStorage.setItem('gc_kid_seen_lessons', JSON.stringify([...next])) } catch { /* private mode */ }
      return next
    })
  }

  // When the child looks at a tab, its items are seen, so the dot clears.
  useEffect(() => {
    if (tab === 'print') { markLessonsSeen(printIds); return }
    if (tab !== 'lessons') return
    if (activeLessonTab === 'watch') markLessonsSeen(watchIds)
    else if (activeLessonTab === 'learn') markLessonsSeen(learnIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, activeLessonTab])

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

      {/* Happy news: a squad friend springs up with the good news */}
      <HappyNews item={happyNews} onClose={() => setHappyNews(null)} />

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

        {/* Header, with the little sound switch tucked in the corner so a
            child (or a grown up) can turn the sounds off any time. */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '18px' }}>
          <button
            onClick={() => { const next = !soundOn; setSoundOn(next); setSoundEnabled(next); if (next) playKidSound('tap') }}
            aria-label={soundOn ? 'Turn sounds off' : 'Turn sounds on'}
            style={{
              position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.28)',
              cursor: 'pointer', fontSize: '17px', lineHeight: 1, color: '#fff',
            }}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
            Today&apos;s quests
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.2rem)', color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Go {childName}!
          </h1>
        </div>

        {/* DiGi in the top bar: a small star friend with one clear insight for
            the child, read from their own numbers, always here and readable. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.22)', borderRadius: '16px', padding: '11px 14px', margin: '14px 0 4px' }}>
          <style>{`@keyframes gcTipBob {0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-4px) rotate(4deg)}}`}</style>
          <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: '#FFF7E8', border: '2px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'gcTipBob 3s ease-in-out infinite' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/digi-squad/DiGi-star.svg" alt="" style={{ width: 32, height: 32 }} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>DiGi says</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: '#fff', lineHeight: 1.3, marginTop: '1px' }}>{digiTip}</span>
          </span>
        </div>

        {/* From school today: the child sees the reminder their grown up sent
            through, and a timed one goes red as it nears, so it lands with
            them too, not only the parent. */}
        <KidSchoolBanner items={schoolToday} />

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

        {/* The obvious signpost: how many jobs are left today, tap to jump
            straight to the list. Loud when there is still something to do,
            quiet and green once the day is done. */}
        {tab === 'quests' && quests.length > 0 && doneCount < quests.length && (
          <button
            onClick={() => { document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }); playKidSound('tap') }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--terracotta)', border: 'none', borderRadius: '16px',
              padding: '14px 16px', marginBottom: '12px', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>📋</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)' }}>
                You have {quests.length - doneCount} thing{quests.length - doneCount === 1 ? '' : 's'} to do today
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)', marginTop: '1px' }}>
                Tap to see your to-do list ↓
              </span>
            </span>
          </button>
        )}

        {/* Device time: turn earned stars into minutes on an agreed device,
            with the countdown and the alarm when the time is up. */}
        <DeviceTimeCard token={token} balanceStars={bankBalance} initialSession={activeSession} usedTodayMinutes={usedTodayMinutes} recommendedMinutes={recommendedMinutes} />

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

        {/* Goal bar: saving for a reward, and once the bank holds enough it
            becomes a big tappable Redeem, two taps so it is never by accident. */}
        {goal && (() => {
          const ready = bankBalance >= goal.stars_needed && !goalRedeemed
          if (goalRedeemed) {
            return (
              <div style={{ background: 'var(--tint-sage)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: 'var(--ink)' }}>🎉 Redeemed: {goal.title}</span>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>Your grown up knows. Ask them to set a new goal!</span>
              </div>
            )
          }
          return (
            <div style={{ background: ready ? 'var(--terracotta)' : 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', boxShadow: ready ? '0 5px 0 var(--terracotta-dark)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: ready ? 'var(--ink)' : '#fff' }}>Saving for: {goal.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: ready ? 'var(--ink)' : 'rgba(255,255,255,0.85)' }}>
                  {Math.min(bankBalance, goal.stars_needed)}/{goal.stars_needed}
                </span>
              </div>
              <div style={{ height: '10px', borderRadius: '10px', background: ready ? 'rgba(26,26,46,0.15)' : 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '10px', background: ready ? 'var(--deep-teal)' : 'var(--terracotta)',
                  width: `${Math.min(100, (bankBalance / Math.max(1, goal.stars_needed)) * 100)}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              {ready && (
                goalConfirm ? (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 8px', textAlign: 'center' }}>
                      Cash in {goal.stars_needed} stars for {goal.title}?
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={redeemGoal} disabled={goalBusy} style={{ flex: 1, padding: '11px', borderRadius: '13px', border: 'none', cursor: goalBusy ? 'default' : 'pointer', background: 'var(--deep-teal)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', boxShadow: '0 4px 0 rgba(0,0,0,0.22)' }}>{goalBusy ? 'Redeeming…' : 'Yes, redeem it!'}</button>
                      <button onClick={() => setGoalConfirm(false)} disabled={goalBusy} style={{ flexShrink: 0, padding: '11px 16px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: '#fff', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}>Not yet</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setGoalConfirm(true)} style={{ width: '100%', marginTop: '12px', padding: '12px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: '#fff', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', boxShadow: '0 4px 0 rgba(0,0,0,0.18)' }}>
                    🎉 You saved enough! Redeem it
                  </button>
                )
              )}
            </div>
          )
        })()}

        {/* Tabs: quests, lessons and printables, all earn stars. Lessons and
            printables wear a red badge the moment a grown up pings something
            new, or a fresh printable is waiting to ask for. */}
        <div style={{ display: 'flex', gap: '7px', marginBottom: '16px' }}>
          {([['quests', '⭐ Quests', 0], ['lessons', '🧠 Lessons', totalNewLessons], ['print', '🖨️ Printables', newPrint]] as const).map(([key, label, dot]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setActiveLesson(null); playKidSound('tap') }}
              style={{
                position: 'relative',
                flex: 1, padding: '13px 6px', borderRadius: '14px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                background: tab === key ? 'var(--terracotta)' : 'rgba(255,255,255,0.12)',
                color: tab === key ? 'var(--ink)' : '#fff',
                border: tab === key ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                boxShadow: tab === key ? '0 4px 0 var(--terracotta-dark)' : 'none',
              }}
            >
              {label}
              {dot > 0 && (
                <span style={{
                  position: 'absolute', top: '-7px', right: '-6px', minWidth: 22, height: 22, padding: '0 5px',
                  borderRadius: '100px', background: '#E5484D', color: '#fff',
                  fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, lineHeight: '22px',
                  textAlign: 'center', boxShadow: '0 0 0 2px var(--deep-teal)',
                }}>
                  {dot > 9 ? '9+' : dot}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'quests' && (<>
        {/* The balance insight surface: a bigger, brighter, character led card
            that teaches why balance is worth it, rotating a fresh idea daily,
            grounded in the science bank. Replaces the old single tip line. */}
        <BalanceInsight stageId={stageId} />

        {/* My week: a simple bar per day of the last seven, taller the more
            quests the child ticked, and the plain sum of what that earned in
            minutes. A child can see their own effort turn into screen time. */}
        {weekChart.some(d => d.count > 0) && (
          <KidWeekChart data={weekChart} weekStars={weekStars} />
        )}

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

        {/* My to-do today: the obvious checklist, with how many are left. */}
        {quests.length > 0 && (
          <div id="my-todo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: '10px', scrollMarginTop: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>
              ✅ My to-do today
            </span>
            <span style={{
              flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700,
              padding: '5px 11px', borderRadius: '100px',
              background: doneCount < quests.length ? 'var(--terracotta)' : 'var(--tint-sage)',
              color: 'var(--ink)',
            }}>
              {doneCount < quests.length ? `${quests.length - doneCount} to do` : 'All done! 🎉'}
            </span>
          </div>
        )}

        {/* Quest list, screens wait quests first */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quests.length === 0 && (
            <HappyScene
              headline="All calm for now"
              sub="No quests today yet. Ask your grown up to send some and start earning stars!"
            />
          )}
          {(() => {
            const sorted = [...quests].sort((a, b) => Number(Boolean(b.blocks_screens)) - Number(Boolean(a.blocks_screens)))
            const openQ = sorted.filter(q => ticks[q.id] !== 'approved')
            const doneQ = sorted.filter(q => ticks[q.id] === 'approved')
            const card = (q: typeof quests[number]) => {
              const state = ticks[q.id]
              const done = Boolean(state)
              return (
                <button
                  key={q.id}
                  onClick={() => toggle(q)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: state === 'approved' ? 'var(--tint-sage)' : done ? '#FFF7E0' : '#fff',
                    border: 'none', borderRadius: '20px', padding: '16px 18px', width: '100%',
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
            }
            return (
              <>
                {openQ.map(card)}
                {doneQ.length > 0 && (
                  <>
                    {/* Done today folds away, so the list stays what is left */}
                    <button
                      onClick={() => setShowKidDone(s => !s)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        width: '100%', cursor: 'pointer', textAlign: 'left',
                        background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.28)',
                        borderRadius: '16px', padding: '13px 16px',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#fff',
                      }}
                    >
                      <span>✅ {doneQ.length} done today</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, opacity: 0.9 }}>
                        {showKidDone ? 'Hide ▲' : 'Show ▼'}
                      </span>
                    </button>
                    {showKidDone && doneQ.map(card)}
                  </>
                )}
              </>
            )
          })()}
        </div>

        {allDone && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <HappyScene
              character="oliver"
              headline="Today's list is done!"
              sub={`Amazing work ${childName}. Your grown up is approving your stars.`}
            />
            <button
              onClick={askForMore}
              disabled={askedMore}
              style={{
                marginTop: '14px',
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
              {/* Sub-tabs so the long list stops being a jumble: Watch, Learn,
                  Games, Print. Each wears a red dot the moment a grown up pings
                  something new into it. */}
              {availableLessonTabs.length > 1 && (
                <div style={{ display: 'flex', gap: '7px', marginBottom: '2px' }}>
                  {availableLessonTabs.map(t => {
                    const on = t.key === activeLessonTab
                    return (
                      <button key={t.key} onClick={() => setLessonTab(t.key)} style={{
                        position: 'relative', flex: 1, padding: '11px 6px', borderRadius: '13px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                        background: on ? '#fff' : 'rgba(255,255,255,0.12)',
                        color: on ? 'var(--ink)' : '#fff',
                        border: on ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                        boxShadow: on ? '0 3px 0 rgba(0,0,0,0.2)' : 'none',
                      }}>
                        {t.icon} {t.label}
                        {t.dot > 0 && (
                          <span style={{ position: 'absolute', top: '-6px', right: '-5px', minWidth: 18, height: 18, padding: '0 4px', borderRadius: '100px', background: '#E5484D', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, lineHeight: '18px', textAlign: 'center', boxShadow: '0 0 0 2px var(--deep-teal)' }}>{t.dot}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Watch together adventures: current stage first, earlier
                  stages below (catch up without ever calling it that). The
                  drawn film frame is the thumbnail. Redo earns 2 more. */}
              {activeLessonTab === 'watch' && adventures.length > 0 && (
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

              {activeLessonTab === 'learn' && missions.length > 0 && (
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

              {activeLessonTab === 'learn' && stageLessons.length > 0 && <SectionHead icon="🧠">Lessons for me</SectionHead>}
              {activeLessonTab === 'learn' && stageLessons.map(lesson => {
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

              {activeLessonTab === 'games' && stageGames.length > 0 && <SectionHead icon="🎮">Games to play</SectionHead>}
              {activeLessonTab === 'games' && stageGames.map(game => {
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
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.5, margin: '6px 0 0' }}>
                More lessons land here soon. Finished them all? Ask for more quests on the other tab!
              </p>
            </div>
          )
        )}

        {/* Printables: their own tab so the child always finds them and can ask
            a grown up. When unlocked they can print and finish for stars; when
            not, the ask still goes through so the grown up can sort it. */}
        {tab === 'print' && (
          <div>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.5, margin: '0 0 14px' }}>
              Colour a sheet away from the screen, then show your grown up for stars.
            </p>
            {stagePrintables.length === 0 ? (
              <HappyScene headline="More printables soon" sub="New colouring sheets land here. Check back soon!" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stagePrintables.map(p => {
                  const finishedTitle = `Finished the ${p.title} sheet`
                  const printTitle = `Print the ${p.title} sheet`
                  const wantTitle = `Please can I do the ${p.title} printable`
                  const finished = asks.some(a => a.title === finishedTitle)
                  const requested = asks.some(a => a.title === wantTitle)
                  return (
                    <div key={p.key} style={{ ...bigCardShell(false), padding: '11px 13px 13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '11px' }}>
                        <div style={{ position: 'relative', width: 76, height: 76, borderRadius: '15px', flexShrink: 0, overflow: 'hidden', background: '#EFE9DD' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', bottom: '5px', left: '5px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '2px 7px' }}>
                            ⭐ {p.stars}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.22 }}>
                            {p.emoji} {p.title}
                          </div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.35, marginTop: '2px' }}>
                            Colour the whole page for {p.stars} stars
                          </div>
                        </div>
                      </div>

                      {printablesUnlocked ? (
                        <>
                          <button
                            onClick={() => printSheet(p.sheetUrl, p.title)}
                            style={{
                              width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
                              cursor: 'pointer', marginBottom: '7px',
                              background: 'var(--terracotta)', color: 'var(--ink)',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
                              boxShadow: '0 4px 0 var(--terracotta-dark)',
                            }}
                          >
                            🖨️ Print it now
                          </button>
                          {/* The earn step, made plain: once it is coloured in, the
                              child shows their grown up, who approves the stars. */}
                          <button
                            onClick={() => {
                              submitAsk(finishedTitle, p.emoji)
                              setHappyNews({ character: 'sofia', headline: 'Beautiful work!', sub: `${p.stars} star${p.stars === 1 ? '' : 's'} on the way once your grown up sees it.` })
                            }}
                            disabled={finished}
                            style={{
                              width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
                              cursor: finished ? 'default' : 'pointer', marginBottom: '7px',
                              background: finished ? 'var(--tint-sage)' : 'var(--deep-teal)',
                              color: finished ? 'var(--ink)' : '#fff',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px',
                              boxShadow: finished ? 'none' : '0 4px 0 rgba(0,0,0,0.22)',
                            }}
                          >
                            {finished ? 'Shown to your grown up ✓ Stars on the way' : `I finished it! Show my grown up ⭐ ${p.stars}`}
                          </button>
                          <button
                            onClick={() => submitAsk(printTitle, '🖨️')}
                            style={{
                              width: '100%', padding: '9px', borderRadius: '12px',
                              border: 'none', cursor: 'pointer', background: 'none',
                              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12.5px',
                              color: 'var(--ink-muted)',
                            }}
                          >
                            No printer? Ask a grown up to print it
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              submitAsk(wantTitle, p.emoji)
                              setHappyNews({ character: 'sofia', headline: 'Asked your grown up!', sub: `They can set up ${p.title} for you to colour in.` })
                            }}
                            disabled={requested}
                            style={{
                              width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
                              cursor: requested ? 'default' : 'pointer',
                              background: requested ? 'var(--tint-sage)' : 'var(--deep-teal)',
                              color: requested ? 'var(--ink)' : '#fff',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px',
                              boxShadow: requested ? 'none' : '0 4px 0 rgba(0,0,0,0.22)',
                            }}
                          >
                            {requested ? 'Asked your grown up ✓' : 'Ask a grown up for this one ⭐'}
                          </button>
                          <p style={{ fontSize: '11.5px', color: 'var(--ink-muted)', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.4 }}>
                            Your grown up can set up printables for you.
                          </p>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
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

// My week: seven little bars, one per day, taller the more the child did,
// with today ringed in gold, and the plain line that turns the week's stars
// into minutes. Deliberately simple: a child reads their own effort at a
// glance and sees exactly what it is worth.
const SCHOOL_KIND_EMOJI: Record<string, string> = {
  kit: '🎒', payment: '💷', homework: '📖', event: '📅', deadline: '⏰', notice: '📌',
}

// The child's own school reminder banner. Calm and gold most of the day, and
// as a timed one nears (in the last hour, or once it is passed) it turns red
// and gives a soft pulse, so a dentist at nine reaches the child too. It
// re-checks the clock every half minute so the red arrives on its own.
function KidSchoolBanner({ items }: { items: KidSchoolToday[] }) {
  // null until mounted, so the first client render matches the server and the
  // red only arrives once the clock is ticking on the child's own device.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    if (!items.some(i => i.time)) return
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [items])

  if (!items.length) return null

  const today = new Date(now ?? Date.now()).toISOString().slice(0, 10)
  const urgentOf = (time: string | null): boolean => {
    if (!time || now == null) return false
    const at = new Date(`${today}T${time.length === 5 ? `${time}:00` : time}`).getTime()
    if (Number.isNaN(at)) return false
    const mins = (at - now) / 60000
    return mins <= 60 // in the last hour, or already passed
  }
  const anyUrgent = items.some(i => urgentOf(i.time))

  return (
    <div style={{
      background: '#fff', borderRadius: '18px', padding: '14px 16px', marginBottom: '16px',
      border: anyUrgent ? '2.5px solid #E5484D' : '2px solid var(--terracotta)',
      boxShadow: anyUrgent ? '0 5px 0 rgba(185,59,63,0.55)' : '0 5px 0 var(--terracotta-dark)',
      animation: anyUrgent ? 'gcKidSchoolPulse 1.3s ease-in-out infinite' : undefined,
    }}>
      <style>{`@keyframes gcKidSchoolPulse { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }`}</style>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: anyUrgent ? '#B93B3F' : 'var(--terracotta-dark)', marginBottom: '9px' }}>
        {anyUrgent ? '🔴 Don’t forget, it is nearly time' : '🏫 From school today'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map(i => {
          const hot = urgentOf(i.time)
          return (
            <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{SCHOOL_KIND_EMOJI[i.kind] ?? '📌'}</span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                {i.title}
              </span>
              {i.time && (
                <span style={{
                  flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                  padding: '3px 9px', borderRadius: '100px',
                  background: hot ? '#FDECEC' : 'var(--tint-sage)',
                  color: hot ? '#B93B3F' : 'var(--ink-soft)',
                }}>
                  {i.time}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KidWeekChart({ data, weekStars }: { data: { label: string; count: number; today: boolean }[]; weekStars: number }) {
  const max = Math.max(1, ...data.map(d => d.count))
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <div style={{ background: '#fff', borderRadius: '18px', padding: '15px 16px 13px', marginBottom: '14px', boxShadow: '0 4px 0 rgba(0,0,0,0.16)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1rem', color: 'var(--ink)' }}>My week 📊</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {total} done
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '7px', height: '70px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', height: '100%', justifyContent: 'flex-end' }}>
            {d.count > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink)' }}>{d.count}</span>
            )}
            <div style={{
              width: '100%', maxWidth: 26, borderRadius: '7px',
              height: `${Math.max(d.count > 0 ? 14 : 6, (d.count / max) * 52)}px`,
              background: d.count === 0 ? 'var(--cream)' : d.today ? 'var(--terracotta)' : 'var(--terracotta-lt)',
              border: d.today ? '2px solid var(--terracotta-dark)' : d.count === 0 ? '1.5px solid var(--border)' : '2px solid var(--terracotta)',
              transition: 'height 0.5s cubic-bezier(0.22,1,0.36,1)',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: d.today ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>{d.label}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '11px', textAlign: 'center', background: 'var(--tint-sage)', borderRadius: '11px', padding: '9px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>
          ⭐ {weekStars} stars this week = {weekStars * STAR_MINUTES} minutes earned
        </span>
      </div>
    </div>
  )
}

function bigCardShell(done: boolean): React.CSSProperties {
  return {
    display: 'block', width: '100%', textAlign: 'left', padding: 0,
    background: '#fff', border: 'none', borderRadius: '18px', overflow: 'hidden',
    textDecoration: 'none', cursor: done ? 'default' : 'pointer',
    boxShadow: done ? '0 2px 0 rgba(0,0,0,0.10)' : '0 5px 0 rgba(0,0,0,0.16)',
    transform: done ? 'translateY(3px)' : 'none',
  }
}

function SectionHead({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 3px' }}>
      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.01em' }}>
        {children}
      </span>
    </div>
  )
}

// A compact thumbnail row: the artwork small on the left, the words and the
// action on the right, so a whole tab of lessons scans like the quests list
// instead of a long stack of tall banners. Crisper, shorter, same pictures.
function CardFace({
  emoji, title, subtitle, seed, done, image, pill, actionIcon,
}: {
  emoji: string; title: string; subtitle: string; seed: string; done: boolean
  image?: string; pill?: string; actionIcon: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '13px', padding: '11px 13px' }}>
      <div style={{ position: 'relative', width: 76, height: 76, borderRadius: '15px', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: image ? '#EFE9DD' : gradientFor(seed) }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '2.3rem', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.18))' }}>{emoji}</span>
        )}
        {pill && (
          <span style={{ position: 'absolute', bottom: '5px', left: '5px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '2px 7px' }}>
            {pill}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {done && (
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px', marginBottom: '4px' }}>
            ✓ Done
          </span>
        )}
        <span style={{
          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.22,
        }}>
          {title}
        </span>
        <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: '2px', lineHeight: 1.35 }}>
          {subtitle}
        </span>
      </div>
      <span style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--terracotta)' : 'var(--cream)',
        border: done ? 'none' : '2.5px dashed var(--ink-light)',
        fontSize: '17px',
      }}>
        {done ? '✓' : actionIcon}
      </span>
    </div>
  )
}
