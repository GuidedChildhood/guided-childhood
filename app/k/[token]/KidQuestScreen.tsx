'use client'

import { useEffect, useRef, useState } from 'react'
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
import { TIMER_RULE, readTrust, type ActiveSession } from '@/lib/quests/device-time'
import { contractRule, type ContractLevel } from '@/lib/content/kid-contract'
import KidAskBanner, { type KidAskState, type KidNudge } from '@/components/kid/KidAskBanner'
import { playKidSound, soundEnabled, setSoundEnabled } from '@/lib/sound/kidSounds'
import HappyNews, { type HappyNewsItem, type CharacterKey } from '@/components/celebrate/HappyNews'
import HappyScene from '@/components/celebrate/HappyScene'
import BalanceInsight from '@/components/celebrate/BalanceInsight'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'
import KidIcon, { type KidIconName } from '@/components/kid/KidIcon'
import KidTodayList from '@/components/kid/KidTodayList'
import KidContract from '@/components/kid/KidContract'
import KidRoad from '@/components/kid/KidRoad'
import KidSplash from '@/components/kid/KidSplash'
import KidSquadIntro, { squadIntroSeen } from '@/components/kid/KidSquadIntro'
import StreakBar from '@/components/kid/StreakBar'
import Image from 'next/image'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

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
export type KidSchoolToday = { id: string; title: string; kind: string; time: string | null; when?: 'today' | 'tomorrow' }

// The child's own choices: a squad buddy who greets them, and an accent colour.
// Small, known sets, so the app stays on brand whatever they pick.
// DiGi the guide, then the five Planet Friends, one per stage. A child only
// ever chooses from the Friends they have earned; DiGi is always theirs.
const BUDDY_MAP: Record<string, { name: string; img: string; stageId?: number }> = {
  digi: { name: 'DiGi', img: '/digi-squad/DiGi-star.svg' },
  ...Object.fromEntries(STAGE_CHARACTERS.map(c => [c.key, { name: c.name, img: c.cutout, stageId: c.stageId }])),
}
// Make it mine now recolours the whole screen, not just the ring. Each theme is
// the full background the child lives in, plus the ink that reads on top of it
// and the accent used on their rings and cards. The default is a premium dark
// anthracite, and the colour bar lets them own it. Ids stay the same as before
// so a child who already picked one keeps it.
// Graphite is a lighter, premium anthracite that keeps white text. Every colour
// is a soft pastel wash with dark readable ink, all built the same gentle way so
// none looks heavier than the others. The accent stays a deeper tone so rings
// and card edges still read on white.
const ACCENT_MAP: Record<string, { name: string; hex: string; bg: string; ink: string; inkSoft: string }> = {
  graphite: { name: 'Graphite', hex: '#E7A33E', bg: 'linear-gradient(180deg, #4C5057 0%, #34373D 100%)', ink: '#F7F7F5', inkSoft: 'rgba(255,255,255,0.74)' },
  ocean:    { name: 'Ocean',    hex: '#2E8B9E', bg: 'linear-gradient(180deg, #DCEEF6 0%, #C6E0EE 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  grass:    { name: 'Grass',    hex: '#57A06A', bg: 'linear-gradient(180deg, #E1F1E6 0%, #CBE7D4 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  sunshine: { name: 'Sunshine', hex: '#E19A2E', bg: 'linear-gradient(180deg, #FBEFCF 0%, #F6E3AE 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  coral:    { name: 'Coral',    hex: '#E56B57', bg: 'linear-gradient(180deg, #FBE3DB 0%, #F6D0C4 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  berry:    { name: 'Berry',    hex: '#C65B8E', bg: 'linear-gradient(180deg, #F8E2EC 0%, #F1CEDE 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  sky:      { name: 'Sky',      hex: '#4C9FD6', bg: 'linear-gradient(180deg, #E4F1FB 0%, #CFE6F7 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  mint:     { name: 'Mint',     hex: '#3FA98A', bg: 'linear-gradient(180deg, #E0F4EC 0%, #C9ECDD 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  lavender: { name: 'Lavender', hex: '#8A72C9', bg: 'linear-gradient(180deg, #EEE9FA 0%, #E0D6F3 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  peach:    { name: 'Peach',    hex: '#E58A4E', bg: 'linear-gradient(180deg, #FCECDC 0%, #F8DBC2 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  bubblegum:{ name: 'Bubblegum',hex: '#DD6BA6', bg: 'linear-gradient(180deg, #FBE6F1 0%, #F6D2E5 100%)', ink: 'var(--ink)', inkSoft: 'rgba(26,26,46,0.60)' },
  midnight: { name: 'Midnight', hex: '#6FA8DC', bg: 'linear-gradient(180deg, #2C3A57 0%, #202B40 100%)', ink: '#F7F7F5', inkSoft: 'rgba(255,255,255,0.74)' },
}
const DEFAULT_BUDDY = 'digi'
const DEFAULT_ACCENT = 'graphite'

// The eight the picker offers: one clean choice from each part of the
// spectrum plus a dark, so the row is a proper rainbow with no two the same
// family. The other named colours stay in ACCENT_MAP so a child who already
// picked one keeps it, they are just no longer offered as fresh duplicates.
const PICKER_ACCENTS = ['coral', 'peach', 'sunshine', 'mint', 'sky', 'lavender', 'bubblegum', 'midnight']

// A mixed colour: the child slides the hue wheel and gets their own soft pastel
// wash, built the exact gentle way as the named ones (light background, dark
// readable ink, a deeper accent for rings and edges), so any colour they land
// on still looks on brand and never heavier than the others. Stored as h<hue>.
function hueWash(h: number): { name: string; hex: string; bg: string; ink: string; inkSoft: string } {
  return {
    name: 'Mine',
    hex: `hsl(${h}, 52%, 45%)`,
    bg: `linear-gradient(180deg, hsl(${h}, 60%, 93%) 0%, hsl(${h}, 54%, 87%) 100%)`,
    ink: 'var(--ink)',
    inkSoft: 'rgba(26,26,46,0.60)',
  }
}
// Resolve whatever is saved into a full theme: a named colour, a mixed hue, or
// the default if it is neither.
function resolveTheme(accent: string): { name: string; hex: string; bg: string; ink: string; inkSoft: string } {
  if (ACCENT_MAP[accent]) return ACCENT_MAP[accent]
  const m = /^h(\d{1,3})$/.exec(accent)
  if (m) return hueWash(Math.max(0, Math.min(360, Number(m[1]))))
  return ACCENT_MAP[DEFAULT_ACCENT]
}
// Is this a saved accent we recognise (named or mixed hue)?
function knownAccent(a: string | null | undefined): a is string {
  return typeof a === 'string' && (Boolean(ACCENT_MAP[a]) || /^h\d{1,3}$/.test(a))
}

export default function KidQuestScreen({
  token, childName, buddy = null, accent = null, stageId = 2, quests, todayTicks, weekStars, goal, streakDays = 0, laterQuests = [], doneLessonKeys = [], missions = [],
  adventures = [], bank = null, usedWeekMinutes = 0, usedTodayMinutes = 0, recommendedMinutes = 0, requests = [], printablesUnlocked = true, activeSession = null,
  weekChart = [], schoolToday = [], notes = [], agreementItems = [], agreementSigned = false,
  contractLevel = '11plus', contractAgreedAt = null, contractReady = false, giftStarsOwed = 0,
  deviceTrust = 'ask', initialAsk = null, initialNudges = [],
  stageLessonsPassed = null, stageLessonsTotal = null, focusLesson = null, assignedPrintable = null,
  earnedStages = 0, completedStreaks = 0,
}: {
  token: string
  childName: string
  // How many Planet Friends this child has earned, the further of the passport
  // stages and the streak unlock, so the picker only offers earned Friends.
  earnedStages?: number
  // Completed jobs streaks so far, driving the streak bar and the next unlock.
  completedStreaks?: number
  agreementItems?: { title: string; body: string }[]
  agreementSigned?: boolean
  // The age based timer contract: which wording fits this child, whether the
  // database can hold the acceptance yet (migration 080), and when it was
  // agreed. Null agreed_at with a ready database means the first run gate
  // shows before the board.
  contractLevel?: ContractLevel
  contractAgreedAt?: string | null
  contractReady?: boolean
  // Stars still owed in jobs from gifted screen time, summed over the open
  // gift debts. Zero hides the owed row entirely.
  giftStarsOwed?: number
  // Who starts the timer for this child: ask (the default), watch or
  // trusted. Drives the card's wording, the ask flow and the contract rule.
  deviceTrust?: string
  // The latest ask and unread nudges, server rendered so the banner is right
  // on first paint; the poll keeps them live after that.
  initialAsk?: KidAskState | null
  initialNudges?: KidNudge[]
  buddy?: string | null
  accent?: string | null
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
  notes?: { id: string; kind: string; title: string; body: string; read: boolean }[]
  // The stage library lesson passes, the same count the parent's progress
  // report uses, for the road's proof chip. Nulls fall back to the old count.
  stageLessonsPassed?: number | null
  stageLessonsTotal?: number | null
  // The child's focus lesson: the next real Rosenshine library lesson for
  // this stage they have not passed yet. When present this is what the Today
  // "Learn" headline points at, opening the real lesson player (which writes
  // the pass and ticks the parent's progress report). Null falls back to the
  // mini lessons, so nothing regresses before the library is seeded.
  focusLesson?: { id: string; title: string; emoji: string; stars: number } | null
  // A printable a grown up sent to this child, shown at the top of the to do:
  // print it, do it, then send it to be confirmed like any printable.
  assignedPrintable?: { key: string; title: string; emoji: string; stars: number; sheetUrl: string; previewUrl: string } | null
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
  // How a done lesson went, remembered on this device so a less than perfect
  // one can invite a retry for 100% and a perfect one can stop asking. Keys
  // not in here are historical passes we simply leave be, never nagging.
  const [lessonScore, setLessonScore] = useState<Record<string, 'perfect' | 'tryagain'>>({})
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gc_kid_lesson_score')
      if (raw) setLessonScore(JSON.parse(raw))
    } catch { /* fresh device */ }
  }, [])
  // The printable a grown up sent, shown at the top of the to do until the
  // child sends it to be confirmed (which also clears the assignment).
  const [assignedSent, setAssignedSent] = useState(false)
  async function sendAssignedPrintable() {
    if (!assignedPrintable || assignedSent) return
    setAssignedSent(true)
    try {
      await fetch('/api/kid/printable-done', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, printable_key: assignedPrintable.key }),
      })
      setToast('Sent to your grown up to check ⭐')
      setTimeout(() => setToast(null), 3500)
    } catch { setAssignedSent(false) }
  }
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
  // The screen time ask and the grown up's nudges, live on the poll. A
  // declined ask the child has tapped away stays away (their own device
  // remembers which one), and a started ask hands over to the countdown.
  const trust = readTrust(deviceTrust)
  const [screenAsk, setScreenAsk] = useState<KidAskState | null>(initialAsk)
  const [kidNudges, setKidNudges] = useState<KidNudge[]>(initialNudges)
  const [askStartBusy, setAskStartBusy] = useState(false)
  const [liveSession, setLiveSession] = useState<ActiveSession | null>(activeSession)
  // A running timer always surfaces: on load with a live session, and the
  // moment a new one appears (including one the grown up started from their
  // side), the device section opens and the app carries the child straight to
  // the countdown, so a live timer is never buried down the page.
  const surfacedSessionRef = useRef<string | null>(null)
  useEffect(() => {
    if (!liveSession) { surfacedSessionRef.current = null; return }
    if (surfacedSessionRef.current === liveSession.id) return
    surfacedSessionRef.current = liveSession.id
    setDeviceOpen(true)
    setTimeout(() => {
      try { document.getElementById('my-timer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch { /* no target yet */ }
    }, 300)
  }, [liveSession])
  const dismissedAskRef = useRef<string | null>(null)
  useEffect(() => {
    try { dismissedAskRef.current = localStorage.getItem('gc_kid_ask_dismissed') } catch { /* fine */ }
    // Re-check the initial ask against the remembered dismissal.
    setScreenAsk(a => (a && a.status === 'declined' && a.id && a.id === dismissedAskRef.current) ? null : a)
  }, [])
  // Gentle presence nudge. The app itself is always free, it never uses
  // minutes, but parked in here for twenty minutes straight with no timer
  // running earns a warm nudge toward a job or the timer, and at thirty a
  // single quiet line reaches the grown up, at most once a day. Never a
  // charge, never a lock. Leaving for five minutes resets the count, and a
  // running timer means fun screens are already metered, so no counting.
  const [presenceNudge, setPresenceNudge] = useState(false)
  const presenceMinsRef = useRef(0)
  const presenceHiddenAtRef = useRef<number | null>(null)
  const liveSessionRef = useRef<ActiveSession | null>(activeSession)
  useEffect(() => { liveSessionRef.current = liveSession }, [liveSession])
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') presenceHiddenAtRef.current = Date.now()
      else if (presenceHiddenAtRef.current && Date.now() - presenceHiddenAtRef.current > 5 * 60000) presenceMinsRef.current = 0
    }
    document.addEventListener('visibilitychange', onVis)
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      if (liveSessionRef.current) { presenceMinsRef.current = 0; return }
      presenceMinsRef.current += 1
      if (presenceMinsRef.current === 20) setPresenceNudge(true)
      if (presenceMinsRef.current === 30) {
        try {
          const key = `gc_presence_alert_${new Date().toISOString().slice(0, 10)}`
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, '1')
            fetch('/api/kid/presence-alert', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            }).catch(() => { /* best effort */ })
          }
        } catch { /* best effort */ }
      }
    }, 60000)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // My lessons is split into sub-tabs (Watch, Learn, Games, Print) with a red
  // dot when a grown up has pinged something new. "New" means an item this
  // child has not opened yet, tracked in localStorage on their own device.
  const [lessonTab, setLessonTab] = useState<'watch' | 'learn' | 'games'>('watch')
  // Deep link from the path page: a game stone lands straight on the Games
  // sub tab rather than leaving the child to hunt for it.
  useEffect(() => {
    try {
      const deep = new URLSearchParams(window.location.search).get('tab')
      if (deep === 'games') {
        setTab('lessons'); setLessonTab('games')
        setTimeout(() => document.getElementById('kid-tabs')?.scrollIntoView({ behavior: 'smooth' }), 300)
      } else if (deep === 'print') {
        setTab('print')
        setTimeout(() => document.getElementById('kid-tabs')?.scrollIntoView({ behavior: 'smooth' }), 300)
      }
    } catch { /* fine */ }
  }, [])
  const [seenLessons, setSeenLessons] = useState<Set<string>>(new Set())
  const [soundOn, setSoundOn] = useState(true)
  const [happyNews, setHappyNews] = useState<HappyNewsItem | null>(null)
  const router = useRouter()
  const [goalRedeemed, setGoalRedeemed] = useState(Boolean(goal?.achieved_at))
  const [goalConfirm, setGoalConfirm] = useState(false)
  const [goalBusy, setGoalBusy] = useState(false)
  // Once a reward is redeemed the child can tick it off and it drops away, so
  // the list never keeps an old, finished goal sitting there. Remembered on
  // their own device so it stays gone.
  const [goalDone, setGoalDone] = useState(false)
  // No id on the goal, so key the dismissal by its title and size, stable enough
  // to remember this exact reward as ticked off across reloads.
  const goalKey = goal ? `gc_goal_done_${goal.title}_${goal.stars_needed}` : ''
  useEffect(() => {
    if (goalKey && typeof window !== 'undefined' && localStorage.getItem(goalKey) === '1') setGoalDone(true)
  }, [goalKey])
  // The family deal popup: the child can pop it up any time to keep an eye on
  // how the deal works and what they are saving for.
  const [dealOpen, setDealOpen] = useState(false)
  // My road, the child's own view of the road to 16, now opened from its own
  // tile in the grid below the Today list.
  const [roadOpen, setRoadOpen] = useState(false)
  // The age based contract gate. Locked in on the server when the database
  // has migration 080; this device also remembers the agree in localStorage
  // so the child is never asked twice while the columns are still landing.
  // null until mounted, so the board never flashes before the gate decides.
  const [contractDone, setContractDone] = useState<boolean | null>(
    contractAgreedAt || !contractReady ? true : null
  )
  useEffect(() => {
    if (contractAgreedAt || !contractReady) return
    try { setContractDone(localStorage.getItem('gc_kid_contract') === '1') }
    catch { setContractDone(false) }
  }, [contractAgreedAt, contractReady])
  function agreeContract() {
    try { localStorage.setItem('gc_kid_contract', '1') } catch { /* the server keeps it */ }
    setContractDone(true)
    fetch('/api/kid/agree', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, level: contractLevel }),
    }).catch(() => { /* this device remembers until the server can */ })
  }
  // The screen time section stays folded away so the home is calm, and opens on
  // a tap. It starts open only when a timer is already running, so a live
  // countdown is never hidden.
  const [deviceOpen, setDeviceOpen] = useState(Boolean(activeSession))
  // When the child taps the big Use my time button we want the timer open on the
  // set and start screen straight away, not the calm balance view. This flag
  // lands them right there; browsing the balance card leaves it false.
  const [pickNow, setPickNow] = useState(false)
  // The child's own buddy and accent. Starts from what the grown up account has
  // saved, changes instantly when they pick, and saves back to their record.
  const [chosenBuddy, setChosenBuddy] = useState(buddy && BUDDY_MAP[buddy] ? buddy : DEFAULT_BUDDY)
  const [chosenAccent, setChosenAccent] = useState(knownAccent(accent) ? accent : DEFAULT_ACCENT)
  const [makeMineOpen, setMakeMineOpen] = useState(false)
  // The one time squad welcome: DiGi's Sparks introduced one at a time on the
  // very first open, then never again.
  const [showIntro, setShowIntro] = useState(false)
  useEffect(() => { if (!squadIntroSeen()) setShowIntro(true) }, [])

  // A new Planet Friend just unlocked: celebrate it once. The first ever load
  // records the baseline quietly so already earned Friends are not celebrated
  // on install; after that, any rise means a fresh unlock worth a burst.
  useEffect(() => {
    const KEY = 'gc_kid_friends_earned'
    let stored: string | null = null
    try { stored = localStorage.getItem(KEY) } catch { return }
    if (stored === null) {
      try { localStorage.setItem(KEY, String(earnedStages)) } catch { /* private mode */ }
      return
    }
    const last = parseInt(stored, 10) || 0
    if (earnedStages > last) {
      const friend = STAGE_CHARACTERS.find(c => c.stageId === earnedStages)
      if (friend) {
        playKidSound('star')
        setHappyNews({ character: friend.key as CharacterKey, headline: `You unlocked ${friend.name}! 🎉`, sub: friend.unlockLine })
      }
      try { localStorage.setItem(KEY, String(earnedStages)) } catch { /* private mode */ }
    }
  }, [earnedStages])
  const theme = resolveTheme(chosenAccent)
  function saveMine(next: { buddy?: string; accent?: string }) {
    if (next.buddy) setChosenBuddy(next.buddy)
    if (next.accent) setChosenAccent(next.accent)
    playKidSound('tap')
    fetch('/api/kid/buddy', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...next }),
    }).catch(() => { /* best effort, their choice still shows */ })
  }

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
        setHappyNews({ character: 'orbit', headline: 'You earned it! 🎉', sub: `Your grown up knows. Time to enjoy ${goal.title}!` })
        router.refresh()
      } else {
        setToast(data.error === 'not enough stars' ? 'Not quite enough stars yet.' : 'Could not redeem, try again.')
        setTimeout(() => setToast(null), 3000)
      }
    } catch { setToast('Could not redeem, try again.'); setTimeout(() => setToast(null), 3000) }
    setGoalBusy(false)
  }

  useEffect(() => {
    // Show the welcome once, ever. We mark it seen the moment it shows, not only
    // when they tap the button, so it never greets them again on a later login
    // even if they just scrolled past it the first time.
    if (localStorage.getItem('gc_kid_welcome') !== '1') {
      setShowWelcome(true)
      localStorage.setItem('gc_kid_welcome', '1')
    }
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
    const wasReplay = doneLessons.has(lesson.key)
    const wasPerfect = lessonScore[lesson.key] === 'perfect'
    setDoneLessons(prev => new Set(prev).add(lesson.key))
    // Remember how it went so the tab can invite a retry, or stop once aced.
    setLessonScore(prev => {
      const next = { ...prev, [lesson.key]: (perfect ? 'perfect' : 'tryagain') as 'perfect' | 'tryagain' }
      try { localStorage.setItem('gc_kid_lesson_score', JSON.stringify(next)) } catch { /* still holds this session */ }
      return next
    })
    setActiveLesson(null)
    const improved = perfect && wasReplay && !wasPerfect
    setToast(improved
      ? `💯 You did it! 100% this time. The bonus star is on its way ⭐`
      : perfect
      ? `💯 Perfect! ${stars} stars sent, bonus TV time included ⭐`
      : wasReplay
      ? `Good try! ${correct} of ${lesson.questions.length}. I reckon you can get them all, have another go any time ⭐`
      : `Lesson done! ⭐ ${stars} stars sent to your grown up.`)
    setTimeout(() => setToast(null), 3500)
    // A first pass always sends. A replay only needs the server when it newly
    // reaches 100% (to claim the one time bonus); a non improving replay is
    // just practice and sends nothing, so nothing can be farmed.
    if (!wasReplay || (perfect && !wasPerfect)) {
      try {
        await fetch('/api/quests/lesson-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, lesson_key: lesson.key, answers }),
        })
      } catch { /* best effort, the next load reconciles */ }
    }
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
      const cast: CharacterKey[] = ['orbit', 'nova', 'digi']
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

  // Watch for the grown up's yes landing while the child has the page open, so
  // a Waiting quest flips to Done live and a squad friend springs up to say so,
  // no refresh needed. Polls gently, and the moment the tab comes back.
  const seenApprovedRef = useRef<Set<string>>(new Set(todayTicks.filter(t => t.status === 'approved').map(t => t.quest_id)))
  useEffect(() => {
    let live = true
    const poll = async () => {
      try {
        const res = await fetch(`/api/quests/tick?token=${token}`)
        if (!res.ok || !live) return
        const d = await res.json()
        const fresh = d.ticks as Record<string, string> | undefined
        if (!fresh) return
        // A pending quest that has just turned approved: celebrate it once.
        const justApproved = Object.keys(fresh).find(qid => fresh[qid] === 'approved' && !seenApprovedRef.current.has(qid))
        if (justApproved) {
          Object.keys(fresh).forEach(qid => { if (fresh[qid] === 'approved') seenApprovedRef.current.add(qid) })
          const q = quests.find(x => x.id === justApproved)
          if (q) setHappyNews({
            character: 'digi',
            headline: 'Your grown up said yes! ⭐',
            sub: `${q.title} is done. That is ${q.stars * STAR_MINUTES} minutes of screen time earned. Superstar!`,
          })
          playKidSound('star')
        }
        setTicks(fresh)
      } catch { /* offline, the next poll tries again */ }
      // The ask's fate and the grown up's nudges ride the same poll, so the
      // yes lands live without a refresh and no second timer is invented.
      try {
        const res = await fetch(`/api/quests/time/status?token=${token}`)
        if (!res.ok || !live) return
        const d = await res.json() as {
          ask?: { id: string; device: string; minutes: number; status: string } | null
          session?: ActiveSession | null
          nudges?: KidNudge[]
        }
        setLiveSession(d.session ?? null)
        setKidNudges(d.nudges ?? [])
        const a = d.ask
        if (!a || a.status === 'started' || (a.status === 'declined' && a.id === dismissedAskRef.current)) {
          setScreenAsk(null)
        } else {
          setScreenAsk(prev => {
            if (a.status === 'approved' && prev?.status === 'pending') playKidSound('star')
            return { id: a.id, device: a.device, minutes: a.minutes, status: a.status as KidAskState['status'] }
          })
        }
      } catch { /* offline, the next poll tries again */ }
    }
    const id = setInterval(poll, 12000)
    const onVis = () => { if (!document.hidden) poll() }
    document.addEventListener('visibilitychange', onVis)
    return () => { live = false; clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const doneCount = quests.filter(q => ticks[q.id]).length
  const allDone = quests.length > 0 && doneCount === quests.length
  const pendingStars = quests.filter(q => ticks[q.id] === 'pending').reduce((s, q) => s + q.stars, 0)
  // The bank is what is really there to spend: earned ever, minus the
  // screen time already used. Falls back to the week count until the
  // family has run migration 047.
  const bankBalance = bank ? bank.balance : weekStars

  // ── The Daily Three ── the home habit at the top of the screen: Learn (the
  // next lesson for this stage), Do (the next job due today) and Move (a real
  // world thing, ticked locally). All read from data already on this screen.
  const nextLesson = stageLessons.find(l => !doneLessons.has(l.key)) ?? null
  // A Stage 1 child has no reading quizzes, so their Learn is the next watch
  // together adventure instead; nothing new gets invented for the tile.
  const nextAdventure = adventures.find(a => a.stageId === stageId && !a.done) ?? null
  // The Today "Learn" headline. The real Rosenshine library lesson comes
  // first when the child has one to pass, so the curriculum is put in front
  // of them one at a time; tapping opens the real player, which writes the
  // pass and ticks the parent's report. It only falls back to the mini
  // lessons (then the next adventure) when the library has nothing left.
  const learnTile: { title: string; emoji: string; stars: number; href?: string } | null =
    focusLesson
      ? { title: focusLesson.title, emoji: focusLesson.emoji, stars: focusLesson.stars, href: `/k/${token}/lessons/${focusLesson.id}` }
      : nextLesson
        ? { title: nextLesson.title, emoji: nextLesson.emoji, stars: nextLesson.stars }
        : (stageLessons.length === 0 && nextAdventure)
          ? { title: nextAdventure.title, emoji: '🍿', stars: 10 }
          : null
  const learnTarget = learnTile
  // A mini lesson passed this session flips the tile locally; a library
  // lesson is a full navigation, so on return focusLesson has already
  // advanced to the next one. Either way the tile reflects real state.
  const learnedThisSession = !focusLesson && doneLessons.size > doneLessonKeys.length
  const dailyLearnDone = learnedThisSession || !learnTarget


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
        setHappyNews({ character: 'nova', headline: `${hit} stars in the bank!`, sub: `That is ${hit * STAR_MINUTES} minutes of screen time earned. Superstar.` })
        return
      }
      if (streakDays >= 3) {
        const key = `${new Date().toISOString().slice(0, 10)}:${streakDays}`
        if (localStorage.getItem('gc_kid_streak_seen') !== key) {
          localStorage.setItem('gc_kid_streak_seen', key)
          // Every fifth day of jobs in a row is a big, clear celebration. The
          // in between days get the gentler cheer.
          const fiveInARow = streakDays % 5 === 0
          setHappyNews(fiveInARow
            ? { character: 'orbit', headline: `${streakDays} days of jobs in a row! 🔥`, sub: 'That is a proper streak. Champions show up like this. Keep the run going!' }
            : { character: 'orbit', headline: `${streakDays} day streak!`, sub: 'You have shown up every day. That is how champions train. Keep it going!' })
          return
        }
      }
      // Nothing else pops on open. The daily hello and the wisdom pop used to
      // spring a character up every single login, which read as flicker and
      // clutter. What to do is already right there on the screen, so the home
      // stays calm and only a real, rare win (a bank milestone or a streak)
      // ever brings a friend up to celebrate.
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

  // First run: the age based contract comes before the board ever shows.
  // While the gate decides (one mount tick) the background holds the screen
  // so nothing flashes underneath.
  if (contractDone === null) {
    return <div style={{ minHeight: '100dvh', background: theme.bg }} />
  }
  if (!contractDone) {
    return <KidContract childName={childName} level={contractLevel} trust={trust} onAgree={agreeContract} />
  }

  return (
    <div style={{
      minHeight: '100dvh', background: theme.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '22px 16px 40px',
      fontFamily: 'var(--font-body)',
    }}>
      {/* First open ever: meet the Planet Friend for this child's stage, then
          the whole family they can earn. Overlays the app until they tap through. */}
      {showIntro && <KidSquadIntro childName={childName} currentStageId={stageId} onDone={() => setShowIntro(false)} />}

      {/* Their own buddy says hello when the app opens, the Duolingo front
          door, once per session on their own colour. */}
      <KidSplash
        buddyImg={BUDDY_MAP[chosenBuddy].img}
        buddyName={BUDDY_MAP[chosenBuddy].name}
        childName={childName}
        buddyIsStar={chosenBuddy === 'digi'}
        bg={theme.bg}
        ink={theme.ink}
      />
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
        @keyframes kid-done-leave {
          0% { opacity: 1; transform: scale(1); }
          12% { transform: scale(1.03); }
          75% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.96); }
        }
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
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', textAlign: 'center',
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
                    fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: '17px', color: 'var(--ink)', lineHeight: 1.55 }}>{step}</span>
                </div>
              ))}
            </div>
            <button
              onClick={dismissWelcome}
              style={{
                width: '100%', padding: '12px', background: 'var(--terracotta)', color: 'var(--ink)',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
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
              background: '#fff', border: '1.5px solid rgba(26,26,46,0.1)',
              cursor: 'pointer', fontSize: '19px', lineHeight: 1, color: 'var(--ink)',
            }}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 6 }}>
            Today&apos;s quests
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.2rem)', color: theme.ink, letterSpacing: '-0.02em', margin: 0 }}>
            Go {childName}!
          </h1>
          {/* Make it mine now lives as its own tile in the grid below, with
              everything else that is not a to do. */}
        </div>

        {/* The fate of their screen time ask, right under the greeting so it
            is never hunted for: asked, the yes with one big Start, a warm
            not right now, or the chores that come first. Nudges land here. */}
        <KidAskBanner
          ask={screenAsk}
          blockingJobs={[...new Set(quests.filter(q => q.blocks_screens && !ticks[q.id]).map(q => q.title))]}
          nudges={kidNudges}
          hasSession={Boolean(liveSession)}
          startBusy={askStartBusy}
          onStart={async () => {
            if (askStartBusy || !screenAsk?.id) return
            setAskStartBusy(true)
            try {
              const res = await fetch('/api/quests/time/start', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, requestId: screenAsk.id }),
              })
              const d = await res.json().catch(() => ({}))
              if (res.ok && d.session) {
                playKidSound('done')
                setScreenAsk(null)
                setLiveSession({
                  id: d.session.id, device: d.session.device, minutes: d.session.minutes,
                  stars: d.session.stars, endsAt: d.session.ends_at, startedAt: d.session.started_at,
                  treat: Boolean(d.session.treat),
                })
                setDeviceOpen(true)
                router.refresh()
                setTimeout(() => document.getElementById('my-timer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250)
              } else {
                setToast(d.error === 'chores first' ? 'Do your before screens job first, then it starts.' : 'That did not start. Try again in a moment.')
                setTimeout(() => setToast(null), 3000)
              }
            } catch {
              setToast('That did not start. Try again in a moment.')
              setTimeout(() => setToast(null), 3000)
            }
            setAskStartBusy(false)
          }}
          onDismissDeclined={() => {
            if (screenAsk?.id) {
              dismissedAskRef.current = screenAsk.id
              try { localStorage.setItem('gc_kid_ask_dismissed', screenAsk.id) } catch { /* fine */ }
            }
            setScreenAsk(null)
            playKidSound('tap')
          }}
          onDismissNudge={id => {
            setKidNudges(ns => ns.filter(n => n.id !== id))
            playKidSound('tap')
            fetch('/api/kid/nudges', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, ids: [id] }),
            }).catch(() => { /* it is gone locally either way */ })
          }}
        />

        {/* From school today: the child sees the reminder their grown up sent
            through, and a timed one goes red as it nears, so it lands with
            them too, not only the parent. */}
        <KidSchoolBanner items={schoolToday} />

        {/* A printable a grown up sent lands right at the top of the to do:
            print it, do it, then send it to be confirmed like any printable. */}
        {assignedPrintable && !assignedSent && (
          <div style={{ background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 18, padding: '14px 16px', marginBottom: 16, boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
            {/* The real product cover, so the child sees exactly what is coming. */}
            <div style={{ position: 'relative', width: '100%', height: 132, borderRadius: 12, overflow: 'hidden', marginBottom: 10, background: 'var(--cream)', border: '1.5px solid var(--border)' }}>
              <Image src={assignedPrintable.previewUrl} alt="" fill sizes="(max-width: 480px) 100vw, 420px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 30, lineHeight: 1 }}>{assignedPrintable.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Your grown up sent you this</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', lineHeight: 1.2 }}>{assignedPrintable.title}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
              Print it and do it away from the screen. Then show your grown up for {assignedPrintable.stars} stars.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={assignedPrintable.sheetUrl} target="_blank" rel="noopener noreferrer" onClick={() => playKidSound('tap')}
                style={{ flex: 1, textAlign: 'center', background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '12px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, boxSizing: 'border-box' }}>
                🖨️ Print it
              </a>
              <button onClick={sendAssignedPrintable}
                style={{ flex: 1, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 14, padding: '12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
                I did it ⭐{assignedPrintable.stars}
              </button>
            </div>
          </div>
        )}

        {/* The ONE Today list: every job due today, plus Learn and Move, each
            with its stars, ticked in one flow. The buddy's line sits above it
            and the quiet device rule sits under it. When gifted screen time
            is still owed, the warm pay back row shows here too. */}
        <KidTodayList
          childName={childName}
          stageId={stageId}
          buddyName={BUDDY_MAP[chosenBuddy].name}
          buddyImg={BUDDY_MAP[chosenBuddy].img}
          buddyIsStar={chosenBuddy === 'digi'}
          learnTitle={learnTile ? learnTile.title : null}
          learnEmoji={learnTile ? learnTile.emoji : null}
          learnStars={learnTile ? learnTile.stars : null}
          learnDoneLive={dailyLearnDone}
          allLessonsDone={!learnTarget}
          quests={quests}
          ticks={ticks}
          onToggleQuest={q => toggle(q as Quest)}
          burstQuestId={burst}
          giftStarsOwed={giftStarsOwed}
          inkSoft={theme.inkSoft}
          onLearnTap={() => {
            playKidSound('tap')
            // A real library lesson opens its own player; the mini lessons
            // stay in the Learn tab as before.
            if (learnTile?.href) {
              window.location.assign(learnTile.href)
              return
            }
            setTab('lessons')
            setActiveLesson(null)
            setLessonTab(nextLesson || stageLessons.length > 0 ? 'learn' : 'watch')
            setTimeout(() => document.getElementById('kid-tabs')?.scrollIntoView({ behavior: 'smooth' }), 80)
          }}
          onCelebrate={() => {
            playKidSound('done')
            setHappyNews({
              character: chosenBuddy as CharacterKey,
              headline: 'Today is done! 🎉',
              sub: `Every job, plus Learn and Move. Amazing work ${childName}!`,
            })
          }}
        />

        {/* The tile grid keeps only what is NOT a to do. Use my time leads,
            full width, carrying the device rule so a child reads it right
            where they would reach for a screen. Then My road, Our deal,
            Make it mine and New job. */}
        {(() => {
          const tiles: { icon?: KidIconName; emoji?: string; iconColor?: string; label: string; sub: string; tint: string; onClick: () => void }[] = [
            { emoji: '🗺️', label: 'My path', sub: 'Play the road to 16', tint: 'var(--tint-blue, #E4ECF7)', onClick: () => { playKidSound('tap'); window.location.assign(`/k/${token}/path`) } },
            // The stage lessons, taken by the child themselves: a pass here
            // lights the same tick their grown up sees on the pathway.
            { emoji: '📚', label: 'My lessons', sub: 'Learn it, pass it', tint: 'var(--terracotta-lt)', onClick: () => { playKidSound('tap'); window.location.href = `/k/${token}/lessons` } },
            { icon: 'deal', iconColor: 'var(--terracotta-dark)', label: 'Our deal', sub: 'How it works', tint: 'var(--cream)', onClick: () => { setDealOpen(true); playKidSound('tap') } },
            { emoji: '🎨', label: 'Make it mine', sub: 'Buddy and colour', tint: 'var(--terracotta-lt)', onClick: () => { setMakeMineOpen(true); playKidSound('tap') } },
            { icon: 'newjob', iconColor: '#3D739A', label: askedMore ? 'Asked' : 'New job', sub: askedMore ? 'Grown up knows' : 'Ask a grown up', tint: askedMore ? 'var(--tint-sage)' : 'var(--tint-blue, #E4ECF7)', onClick: () => { if (!askedMore) { askForMore(); playKidSound('tap') } } },
            // Printables fills the last grid slot: a tap opens the printables
            // tab, where the child does the ones sent to them and asks for more.
            { emoji: '🖍️', label: 'Printables', sub: 'Colour and do', tint: 'var(--tint-sage)', onClick: () => { setTab('print'); setActiveLesson(null); playKidSound('tap'); setTimeout(() => document.getElementById('kid-tabs')?.scrollIntoView({ behavior: 'smooth' }), 120) } },
          ]
          return (
            <div style={{ marginBottom: '18px' }}>
              <button
                onClick={() => { setDeviceOpen(true); setPickNow(bankBalance > 0); playKidSound('tap'); setTimeout(() => document.getElementById('my-timer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 160) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '13px', width: '100%', cursor: 'pointer',
                  background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '20px', padding: '15px 16px', textAlign: 'left',
                  boxShadow: '0 4px 0 rgba(26,26,46,0.08)', marginBottom: '12px',
                }}
              >
                <span style={{ width: 48, height: 48, borderRadius: '14px', background: 'var(--tint-sage)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><KidIcon name="time" size={26} color="#2F8F6B" /></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--ink)', lineHeight: 1.1 }}>
                    Use my time <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--ink-muted)' }}>· {bankBalance * STAR_MINUTES} min ready</span>
                  </span>
                  {/* All jobs done today unlocks the ask: a warm line so the
                      child sees the door open, still an ask, never an auto start. */}
                  {allDone && bankBalance > 0 && (
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: '#2F8F6B', marginTop: '3px' }}>
                      🔓 All your jobs are done, screen time is unlocked
                    </span>
                  )}
                  {/* The device rule, right where the screen would start. */}
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '16px', color: 'var(--ink-muted)', marginTop: '3px', lineHeight: 1.45 }}>
                    {TIMER_RULE}
                  </span>
                </span>
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {tiles.map((t, i) => (
                  <button key={i} onClick={t.onClick} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', cursor: 'pointer',
                    background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '20px', padding: '16px', textAlign: 'left',
                    boxShadow: '0 4px 0 rgba(26,26,46,0.08)',
                  }}>
                    <span style={{ width: 48, height: 48, borderRadius: '14px', background: t.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      {t.icon ? <KidIcon name={t.icon} size={26} color={t.iconColor ?? 'var(--ink)'} /> : t.emoji}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)', lineHeight: 1.1 }}>{t.label}</span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: 'var(--ink-muted)', marginTop: '2px' }}>{t.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
              {/* Reopen the meet the Planet Friends intro any time: who they can
                  earn and how, so it is never a one time thing they miss. */}
              <button
                onClick={() => { setShowIntro(true); playKidSound('tap') }}
                style={{
                  width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                  background: 'var(--tint-blue, #E4ECF7)', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '18px', padding: '13px 16px',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--ink)',
                  boxShadow: '0 4px 0 rgba(26,26,46,0.08)',
                }}
              >
                <span aria-hidden>⭐</span> Meet the Planet Friends
              </button>
            </div>
          )
        })()}

        {/* One clear balance card. The thing we celebrate is the healthy balance
            of jobs done against screen used, and the streak of jobs, not the
            screen time itself. Stars and minutes are here, but the hero line is
            the balance: a warm well done when it is healthy, a gentle Duolingo
            style nudge to do a job when screen has run ahead. Tap to open and
            actually use the time. */}
        {(() => {
          const earnedWeekMins = weekStars * STAR_MINUTES
          const healthy = usedWeekMinutes <= earnedWeekMins || usedWeekMinutes === 0
          const balanceMsg = streakDays >= 2
            ? `${streakDays} day streak of jobs, amazing! ${healthy ? 'And a lovely balance too.' : 'Do one job to keep your balance healthy.'}`
            : healthy
              ? 'Lovely balance. You have earned more than you have watched.'
              : 'Screen has run a little ahead. Do a job to bring your balance back.'
          return (
        <div id="my-device-time" style={{ scrollMarginTop: '80px', marginBottom: '16px', background: '#fff', borderRadius: '20px', border: '1.5px solid rgba(26,26,46,0.08)', boxShadow: '0 4px 0 rgba(26,26,46,0.08)', overflow: 'hidden' }}>
          <button onClick={() => { setDeviceOpen(o => !o); setPickNow(false); playKidSound('tap') }} aria-expanded={deviceOpen} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: '14px', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><KidIcon name="star" size={28} color="var(--terracotta-dark)" /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>My balance</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.55rem', color: 'var(--ink)', lineHeight: 1.05 }}>
                  {bankBalance} <span style={{ fontSize: '1rem' }}>stars</span>
                  {pendingStars > 0 && <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--terracotta-dark)' }}> +{pendingStars}</span>}
                </span>
                <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 700, color: 'var(--ink-soft)', marginTop: '1px' }}>{bankBalance * STAR_MINUTES} minutes ready to use</span>
              </span>
              {streakDays > 0 && (
                <span style={{ flexShrink: 0, textAlign: 'center', background: 'var(--terracotta-lt)', borderRadius: '14px', padding: '8px 11px' }}>
                  <span style={{ display: 'flex', justifyContent: 'center', lineHeight: 1 }}><KidIcon name="flame" size={20} color="var(--terracotta-dark)" /></span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1rem', color: 'var(--terracotta-dark)' }}>{streakDays}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>day streak</span>
                </span>
              )}
              <span aria-hidden style={{ flexShrink: 0, fontSize: 20, color: 'var(--ink-muted)', transform: deviceOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>›</span>
            </div>
            {/* The hero: the balance we celebrate, or the gentle nudge to a job. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: healthy ? 'var(--tint-sage)' : 'var(--terracotta-lt)', borderRadius: '13px', padding: '11px 13px' }}>
              <span style={{ fontSize: 19, flexShrink: 0 }}>{healthy ? '🌱' : '💪'}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.35 }}>{balanceMsg}</span>
            </div>
          </button>
          {deviceOpen && (
            <div id="my-timer" style={{ padding: '0 18px 18px', scrollMarginTop: '72px' }}>
              <DeviceTimeCard
                key={`${activeSession?.id ?? 'idle'}-${pickNow ? 'pick' : 'view'}`}
                startPicking={pickNow}
                token={token} balanceStars={bankBalance} initialSession={activeSession}
                usedTodayMinutes={usedTodayMinutes} recommendedMinutes={recommendedMinutes}
                ageBand={(['4-7', '8-10', '11-13', '13-15', '16+'] as const)[Math.min(4, Math.max(0, stageId - 1))]}
                deviceTrust={trust}
                onAsked={a => {
                  setScreenAsk({ id: a.id, device: a.device, minutes: a.minutes, status: 'pending' })
                  playKidSound('tap')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                // The offline ideas row's doorways: printables live on their own
                // tab and the learning games on the lessons Games sub tab, so a
                // tap switches there and scrolls the tabs into view. Games only
                // when this stage actually has some.
                onPrintables={() => {
                  setTab('print'); setActiveLesson(null); playKidSound('tap')
                  setTimeout(() => document.getElementById('kid-tabs')?.scrollIntoView({ behavior: 'smooth' }), 120)
                }}
                onGames={hasGames ? () => {
                  setTab('lessons'); setLessonTab('games'); setActiveLesson(null); playKidSound('tap')
                  setTimeout(() => document.getElementById('kid-tabs')?.scrollIntoView({ behavior: 'smooth' }), 120)
                } : undefined}
              />
              {weekChart.some(d => d.count > 0) && (
                <div style={{ marginTop: '12px' }}>
                  <KidWeekChart data={weekChart} weekStars={weekStars} />
                </div>
              )}
            </div>
          )}
        </div>
          )
        })()}

        {dealOpen && (
          <FamilyDeal
            onClose={() => setDealOpen(false)}
            recommendedMinutes={recommendedMinutes}
            goal={goal}
            bankBalance={bankBalance}
            goalRedeemed={goalRedeemed}
            agreementItems={agreementItems}
            agreementSigned={agreementSigned}
            contractRule={contractRule(contractLevel, trust)}
            contractAgreedAt={contractAgreedAt}
          />
        )}

        {roadOpen && (
          <KidRoad
            stageId={stageId}
            childName={childName}
            buddyName={BUDDY_MAP[chosenBuddy].name}
            buddyImg={BUDDY_MAP[chosenBuddy].img}
            buddyIsStar={chosenBuddy === 'digi'}
            lessonsDoneCount={doneLessons.size}
            starsBanked={bankBalance}
            dailyGuideMinutes={recommendedMinutes}
            usedTodayMinutes={usedTodayMinutes}
            stageLessonsPassed={stageLessonsPassed}
            stageLessonsTotal={stageLessonsTotal}
            lessonsHref={`/k/${token}/lessons`}
            onClose={() => setRoadOpen(false)}
          />
        )}

        {makeMineOpen && (
          <MakeItMine
            onClose={() => setMakeMineOpen(false)}
            chosenBuddy={chosenBuddy}
            chosenAccent={chosenAccent}
            earnedStages={earnedStages}
            onPick={saveMine}
          />
        )}

        {/* The presence nudge: been in here a while with no timer running, so
            a warm toast points at a job or the timer. Free to wave away. */}
        {presenceNudge && (
          <div style={{ position: 'fixed', left: '50%', bottom: 'calc(18px + env(safe-area-inset-bottom))', transform: 'translateX(-50%)', zIndex: 125, width: 'min(94vw, 420px)' }}>
            <div style={{ background: 'var(--cream)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.55)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: 'var(--ink)', margin: '0 0 4px' }}>
                Been in here a while 👀
              </p>
              <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
                This app is always free, it never uses your minutes. If it is screen time you are after, start the timer. Or grab a quick job and earn while you are here.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    setPresenceNudge(false); presenceMinsRef.current = 0; playKidSound('tap')
                    try { document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }) } catch { /* no target */ }
                  }}
                  style={{ flex: 1, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 13, padding: '12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, boxShadow: '0 4px 0 var(--terracotta-dark)' }}
                >
                  Do a job ⭐
                </button>
                <button
                  onClick={() => { setPresenceNudge(false); presenceMinsRef.current = 0; playKidSound('tap') }}
                  style={{ background: '#fff', color: 'var(--ink-soft)', border: '1.5px solid var(--border)', borderRadius: 13, padding: '12px 18px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* A note from a grown up: shared straight to this app, kept to read
            again, never a text message. */}
        <NotesFromGrownUp token={token} notes={notes} />

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
              background: dayComplete ? 'var(--terracotta)' : 'var(--cream)',
              borderRadius: '16px', padding: '14px 18px', marginBottom: '12px',
              boxShadow: dayComplete ? '0 5px 0 var(--terracotta-dark)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: dayComplete ? 'var(--ink)' : 'var(--ink-soft)' }}>
                  {dayComplete ? `Day complete! You hit today's goal 🎉` : `Today's goal`}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: dayComplete ? 'var(--ink)' : 'var(--ink-soft)' }}>
                  ⭐ {Math.min(todayStars, target)}/{target}
                </span>
              </div>
              <div style={{ height: '10px', borderRadius: '10px', background: dayComplete ? 'rgba(0,0,0,0.15)' : 'rgba(26,26,46,0.1)', overflow: 'hidden' }}>
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
            // Finished and ticked off: it drops away so the list stays fresh.
            if (goalDone) return null
            return (
              <div style={{ background: 'var(--tint-sage)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)' }}>🎉 Redeemed: {goal.title}</span>
                <span style={{ display: 'block', fontSize: '15px', color: 'var(--ink-soft)', margin: '2px 0 10px' }}>Your grown up knows. Ask them to set a new goal!</span>
                <button
                  onClick={() => {
                    if (goalKey) localStorage.setItem(goalKey, '1')
                    setGoalDone(true)
                    playKidSound('tap')
                    // Clear it on the server too, so a redeemed reward never
                    // comes back on the next open or on another device.
                    fetch('/api/quests/goal/clear', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token }),
                    }).catch(() => { /* localStorage still hides it here */ })
                  }}
                  style={{ background: 'var(--retro-green)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}
                >
                  Got it, tick it off ✓
                </button>
              </div>
            )
          }
          return (
            <div style={{ background: ready ? 'var(--terracotta)' : 'var(--cream)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', boxShadow: ready ? '0 5px 0 var(--terracotta-dark)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: ready ? 'var(--ink)' : 'var(--ink-soft)' }}>Saving for: {goal.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: ready ? 'var(--ink)' : 'var(--ink-soft)' }}>
                  {Math.min(bankBalance, goal.stars_needed)}/{goal.stars_needed}
                </span>
              </div>
              <div style={{ height: '10px', borderRadius: '10px', background: ready ? 'rgba(26,26,46,0.15)' : 'rgba(26,26,46,0.1)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '10px', background: ready ? 'var(--deep-teal)' : 'var(--terracotta)',
                  width: `${Math.min(100, (bankBalance / Math.max(1, goal.stars_needed)) * 100)}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              {ready && (
                goalConfirm ? (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 8px', textAlign: 'center' }}>
                      Cash in {goal.stars_needed} stars for {goal.title}?
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={redeemGoal} disabled={goalBusy} style={{ flex: 1, padding: '11px', borderRadius: '13px', border: 'none', cursor: goalBusy ? 'default' : 'pointer', background: 'var(--deep-teal)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', boxShadow: '0 4px 0 rgba(0,0,0,0.22)' }}>{goalBusy ? 'Redeeming…' : 'Yes, redeem it!'}</button>
                      <button onClick={() => setGoalConfirm(false)} disabled={goalBusy} style={{ flexShrink: 0, padding: '11px 16px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: '#fff', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>Not yet</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setGoalConfirm(true)} style={{ width: '100%', marginTop: '12px', padding: '12px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: '#fff', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', boxShadow: '0 4px 0 rgba(0,0,0,0.18)' }}>
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
        {/* A clean segmented control, Greenlight style: one soft pill holding
            three segments, the chosen one filled butter with the chunky shadow,
            each with its own drawn icon so a young child reads it at a glance.
            The id lets the wisdom pop's See a fun sheet action scroll here. */}
        <div id="kid-tabs" style={{ display: 'flex', gap: '4px', background: 'var(--cream)', border: '1.5px solid rgba(26,26,46,0.1)', borderRadius: '18px', padding: '4px', marginBottom: '16px', scrollMarginTop: '12px' }}>
          {([['quests', 'Quests', 'star', 0], ['lessons', 'Lessons', 'lessons', totalNewLessons], ['print', 'Printables', 'printables', newPrint]] as const).map(([key, label, icon, dot]) => {
            const on = tab === key
            return (
              <button
                key={key}
                onClick={() => { setTab(key); setActiveLesson(null); playKidSound('tap') }}
                style={{
                  position: 'relative',
                  flex: 1, padding: '10px 4px', borderRadius: '14px', cursor: 'pointer', border: 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
                  background: on ? 'var(--terracotta)' : 'transparent',
                  color: on ? 'var(--ink)' : 'var(--ink-soft)',
                  boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  transition: 'background 0.15s',
                }}
              >
                <KidIcon name={icon as KidIconName} size={21} color={on ? 'var(--ink)' : 'var(--ink-soft)'} />
                {label}
                {dot > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '-2px', minWidth: 20, height: 20, padding: '0 5px',
                    borderRadius: '100px', background: '#E5484D', color: '#fff',
                    fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, lineHeight: '20px',
                    textAlign: 'center', boxShadow: '0 0 0 2px var(--cream)',
                  }}>
                    {dot > 9 ? '9+' : dot}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {tab === 'quests' && (<>
        {/* The balance insight surface: a bigger, brighter, character led card
            that teaches why balance is worth it, rotating a fresh idea daily,
            grounded in the science bank. Replaces the old single tip line. */}
        <StreakBar completedStreaks={completedStreaks} earnedStages={earnedStages} />

        <BalanceInsight stageId={stageId} usedTodayMinutes={usedTodayMinutes} recommendedMinutes={recommendedMinutes} balanceStars={bankBalance} streakDays={streakDays} />

        {/* The jobs themselves live in the ONE Today list above, ticked in one
            flow with Learn and Move, so nothing about today repeats down here.
            This tab keeps what is around the jobs: the balance insight, asking
            for a fresh quest when everything is done, pitching an idea, and
            what is coming on later days. */}
        {quests.length === 0 && (
          <HappyScene
            headline="All calm for now"
            sub="No quests today yet. Ask your grown up to send some and start earning stars!"
          />
        )}

        {allDone && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button
              onClick={askForMore}
              disabled={askedMore}
              style={{
                padding: '12px 22px', borderRadius: '14px', cursor: askedMore ? 'default' : 'pointer',
                background: askedMore ? 'var(--cream)' : 'var(--terracotta)',
                color: askedMore ? 'var(--ink-soft)' : 'var(--ink)',
                border: askedMore ? '1.5px solid rgba(26,26,46,0.1)' : 'none',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
                boxShadow: askedMore ? 'none' : '0 4px 0 var(--terracotta-dark)',
              }}
            >
              {askedMore ? 'Asked ✓ watch this space' : 'Ask for more quests ⭐'}
            </button>
          </div>
        )}

        {/* Pitch your own quest: tap an example or write your own, and it goes
            to the grown up to say yes. Big, clear, tappable, all the same size,
            so a young child can pick or type easily. */}
        <div style={{ marginTop: '18px', background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '20px', padding: '16px 18px', boxShadow: '0 4px 0 rgba(26,26,46,0.08)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', margin: '0 0 4px' }}>
            Got a quest idea? 💡
          </p>
          <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
            Tap one, or write your own. Your grown up says yes to turn it into a real quest with stars.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '14px' }}>
            {KID_REQUEST_IDEAS.filter(idea => !asks.some(a => a.title === idea.title)).map(idea => (
              <button
                key={idea.title}
                onClick={() => { submitAsk(idea.title, idea.emoji); playKidSound('tap') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'left', cursor: 'pointer',
                  padding: '13px 14px', borderRadius: '14px',
                  background: 'var(--cream)', border: '1.5px solid rgba(26,26,46,0.08)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.25,
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{idea.emoji}</span>
                <span style={{ minWidth: 0 }}>{idea.title}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            <input
              value={askText}
              onChange={e => setAskText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitAsk(askText, '⭐') }}
              placeholder="Write your own idea..."
              maxLength={60}
              style={{
                flex: 1, minWidth: 0, padding: '13px 14px', borderRadius: '14px',
                border: '1.5px solid rgba(26,26,46,0.12)', background: 'var(--cream)',
                fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--ink)', outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(26,26,46,0.12)' }}
            />
            <button
              onClick={() => submitAsk(askText, '⭐')}
              disabled={askText.trim().length < 3}
              style={{
                padding: '13px 20px', borderRadius: '14px', border: 'none', flexShrink: 0,
                cursor: askText.trim().length < 3 ? 'default' : 'pointer',
                background: 'var(--terracotta)', color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px',
                boxShadow: askText.trim().length < 3 ? 'none' : '0 4px 0 var(--terracotta-dark)',
                opacity: askText.trim().length < 3 ? 0.55 : 1,
              }}
            >
              Pitch it
            </button>
          </div>
          {asks.length > 0 && (
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {asks.slice(0, 6).map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cream)', borderRadius: '12px', padding: '9px 12px' }}>
                  <span style={{ fontSize: '17px', flexShrink: 0 }}>{a.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0, fontSize: '16px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{a.title}</span>
                  <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, color: a.status === 'added' ? 'var(--retro-green-dark, var(--deep-teal))' : 'var(--ink-muted)' }}>
                    {a.status === 'added' ? 'IT IS ON ⭐' : a.status === 'declined' ? 'NOT THIS TIME' : 'WAITING'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quests waiting on other days, so done today never reads as done forever */}
        {laterQuests.length > 0 && (
          <div style={{ marginTop: '22px', background: 'var(--cream)', borderRadius: '16px', padding: '14px 18px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px' }}>
              Coming up, not today
            </p>
            {laterQuests.map((q, i) => (
              <p key={i} style={{ fontSize: '16.5px', color: 'var(--ink-soft)', margin: '0 0 4px', lineHeight: 1.5 }}>
                {q.emoji} {q.title}
                <span style={{ color: 'var(--ink-light)' }}>
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
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)' }}>
                  {activeLesson.emoji} {activeLesson.title}
                </span>
                <button
                  onClick={() => setActiveLesson(null)}
                  aria-label="Close lesson"
                  style={{ background: 'var(--cream)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', color: 'var(--ink-soft)' }}
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
                  <p style={{ fontSize: '19px', color: 'var(--ink)', lineHeight: 1.6, minHeight: '110px', margin: '0 0 18px', fontWeight: 500 }}>
                    {activeLesson.cards[lessonCard]}
                  </p>
                  <button
                    onClick={() => setLessonCard(c => c + 1)}
                    style={{
                      width: '100%', padding: '15px', background: 'var(--terracotta)', color: 'var(--ink)',
                      border: 'none', borderRadius: '14px', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px',
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
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>
                      Question {qIndex + 1} of {activeLesson.questions.length} · 100% earns the bonus ⭐
                    </p>
                    <p style={{ fontSize: '19px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 14px' }}>
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
                              fontSize: '17.5px', fontWeight: 600, lineHeight: 1.45,
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
                        <p style={{ fontSize: '17px', lineHeight: 1.5, margin: '0 0 14px', fontWeight: 700, color: 'var(--ink)' }}>
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
                            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px',
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
                    <p style={{ fontSize: '17.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
                      {perfect
                        ? `Perfect score! That earns the bonus star: ${stars} stars = ${stars * STAR_MINUTES} minutes of TV time once your grown up approves.`
                        : `You earned ${stars} stars = ${stars * STAR_MINUTES} minutes of screen time. A perfect score on the next lesson earns the bonus star!`}
                    </p>
                    <button
                      onClick={() => finishLesson(activeLesson, qAnswers)}
                      style={{
                        width: '100%', padding: '15px', background: 'var(--terracotta)', color: 'var(--ink)',
                        border: 'none', borderRadius: '14px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px',
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
                <div style={{ display: 'flex', gap: '4px', background: 'var(--cream)', border: '1.5px solid rgba(26,26,46,0.1)', borderRadius: '16px', padding: '4px', marginBottom: '2px' }}>
                  {availableLessonTabs.map(t => {
                    const on = t.key === activeLessonTab
                    const subIcon: KidIconName = t.key === 'watch' ? 'watch' : t.key === 'games' ? 'games' : 'lessons'
                    return (
                      <button key={t.key} onClick={() => setLessonTab(t.key)} style={{
                        position: 'relative', flex: 1, padding: '9px 4px', borderRadius: '12px', cursor: 'pointer', border: 'none',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px',
                        background: on ? 'var(--terracotta)' : 'transparent',
                        color: on ? 'var(--ink)' : 'var(--ink-soft)',
                        boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
                        transition: 'background 0.15s',
                      }}>
                        <KidIcon name={subIcon} size={19} color={on ? 'var(--ink)' : 'var(--ink-soft)'} />
                        {t.label}
                        {t.dot > 0 && (
                          <span style={{ position: 'absolute', top: '-5px', right: '-2px', minWidth: 18, height: 18, padding: '0 4px', borderRadius: '100px', background: '#E5484D', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, lineHeight: '18px', textAlign: 'center', boxShadow: '0 0 0 2px var(--cream)' }}>{t.dot}</span>
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
                  <SectionHead kidIcon="watch">Watch with your grown up</SectionHead>
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
                  <SectionHead kidIcon="star">Star lessons from your grown up</SectionHead>
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

              {activeLessonTab === 'learn' && stageLessons.length > 0 && <SectionHead kidIcon="lessons">Lessons for me</SectionHead>}
              {activeLessonTab === 'learn' && stageLessons.map(lesson => {
                const done = doneLessons.has(lesson.key)
                // A done lesson that was not aced invites a retry for 100%, so
                // it stays tappable and wears an encouraging line instead of a
                // flat "done". A perfect one, or a historical pass we have no
                // record of, simply reads as done.
                const tryAgain = done && lessonScore[lesson.key] === 'tryagain'
                const aced = done && lessonScore[lesson.key] === 'perfect'
                return (
                  <button key={lesson.key} onClick={() => (!done || tryAgain) && openLesson(lesson)} disabled={done && !tryAgain} style={bigCardShell(done && !tryAgain)}>
                    <CardFace
                      seed={lesson.key} done={done && !tryAgain}
                      emoji={lesson.emoji}
                      title={lesson.title}
                      subtitle={tryAgain
                        ? 'You did well! I reckon you can get 100%. Tap to try again 💯'
                        : aced
                        ? 'Nailed it! 100% ⭐'
                        : done
                        ? 'Done! Stars with your grown up ⭐'
                        : `Worth ${lesson.stars} stars, +${lesson.bonusStars} bonus at 100% · 2 minutes`}
                      pill={tryAgain ? 'Try for 💯' : `⭐ ${lesson.stars}`}
                      actionIcon={tryAgain ? '↻' : '▶'}
                    />
                  </button>
                )
              })}

              {activeLessonTab === 'games' && stageGames.length > 0 && <SectionHead kidIcon="games">Games to play</SectionHead>}
              {activeLessonTab === 'games' && stageGames.map(game => {
                const done = doneGames.has(game.key)
                return (
                  <button key={game.key} onClick={() => !done && setActiveGame(game)} disabled={done} style={bigCardShell(done)}>
                    <CardFace
                      seed={game.key} done={done}
                      emoji={game.emoji}
                      image={game.thumb}
                      isNew={Boolean(game.isNew) && !done}
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
              <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '15px', lineHeight: 1.5, margin: '6px 0 0' }}>
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
            <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '16px', lineHeight: 1.5, margin: '0 0 14px' }}>
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
                          <Image src={p.previewUrl} alt="" fill sizes="76px" style={{ objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', bottom: '5px', left: '5px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '2px 7px' }}>
                            ⭐ {p.stars}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.22 }}>
                            {p.emoji} {p.title}
                          </div>
                          <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.35, marginTop: '2px' }}>
                            Colour the whole page for {p.stars} stars
                          </div>
                        </div>
                      </div>

                      {printablesUnlocked ? (
                        <>
                          <button
                            onClick={() => { if (p.pdfColourIn) { playKidSound('tap'); window.open(p.pdfColourIn, '_blank') } else { printSheet(p.sheetUrl, p.title) } }}
                            style={{
                              width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
                              cursor: 'pointer', marginBottom: '7px',
                              background: 'var(--terracotta)', color: 'var(--ink)',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px',
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
                              setHappyNews({ character: 'bloop', headline: 'Beautiful work!', sub: `${p.stars} star${p.stars === 1 ? '' : 's'} on the way once your grown up sees it.` })
                            }}
                            disabled={finished}
                            style={{
                              width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
                              cursor: finished ? 'default' : 'pointer', marginBottom: '7px',
                              background: finished ? 'var(--tint-sage)' : 'var(--deep-teal)',
                              color: finished ? 'var(--ink)' : '#fff',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px',
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
                              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14.5px',
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
                              setHappyNews({ character: 'bloop', headline: 'Asked your grown up!', sub: `They can set up ${p.title} for you to colour in.` })
                            }}
                            disabled={requested}
                            style={{
                              width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
                              cursor: requested ? 'default' : 'pointer',
                              background: requested ? 'var(--tint-sage)' : 'var(--deep-teal)',
                              color: requested ? 'var(--ink)' : '#fff',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px',
                              boxShadow: requested ? 'none' : '0 4px 0 rgba(0,0,0,0.22)',
                            }}
                          >
                            {requested ? 'Asked your grown up ✓' : 'Ask a grown up for this one ⭐'}
                          </button>
                          <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.4 }}>
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
              background: '#fff', border: '1.5px solid rgba(26,26,46,0.1)',
              borderRadius: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)',
            }}
          >
            🔔 Remind me about my quests
          </button>
        )}
        {remindState === 'on' && (
          <p style={{ textAlign: 'center', fontSize: '16px', color: 'var(--ink-soft)', marginTop: '18px' }}>
            🔔 Reminders on. Morning and after school nudges, never at bedtime.
          </p>
        )}
        {remindState === 'ios' && (
          <>
            <button
              onClick={() => setShowIosSteps(v => !v)}
              style={{
                width: '100%', marginTop: '20px', padding: '13px 16px',
                background: '#fff', border: '1.5px solid rgba(26,26,46,0.1)',
                borderRadius: '14px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)',
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
                      fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '17px', color: 'var(--ink)', lineHeight: 1.55 }}>{step}</span>
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
            cursor: 'pointer', fontSize: '16px', fontWeight: 600,
            color: 'var(--ink-muted)', textDecoration: 'underline', fontFamily: 'var(--font-body)',
          }}
        >
          How does this page work?
        </button>

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11.5px', letterSpacing: '0.08em', color: 'var(--ink-light)', marginTop: '14px' }}>
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

// Our family deal: a simple, warm popup that lays out the deal the child lives
// by, in their own words. How it works, the exchange rate, a good amount of
// screen a day, and what they are saving for right now. No dashes, no rules
// shouted, just the deal they can keep an eye on any time.
function FamilyDeal({ onClose, recommendedMinutes, goal, bankBalance, goalRedeemed, agreementItems = [], agreementSigned = false, contractRule, contractAgreedAt = null }: {
  onClose: () => void
  recommendedMinutes: number
  goal: { title?: string; stars_needed?: number; achieved_at?: string | null } | null
  bankBalance: number
  goalRedeemed: boolean
  agreementItems?: { title: string; body: string }[]
  agreementSigned?: boolean
  // The timer rule this child agreed on their first run, read only here once
  // it is locked in. The child never edits it from their side.
  contractRule?: string
  contractAgreedAt?: string | null
}) {
  // Which agreed promise is open to read. One at a time keeps the deal tidy.
  const [openPromise, setOpenPromise] = useState<number | null>(null)
  const rows: { icon: KidIconName; iconColor: string; tint: string; title: string; body: string }[] = [
    { icon: 'jobs', iconColor: 'var(--terracotta-dark)', tint: 'var(--terracotta-lt)', title: 'You do jobs', body: 'Real world jobs and quests your grown up sets, like tidying up or reading.' },
    { icon: 'star', iconColor: 'var(--terracotta-dark)', tint: 'var(--terracotta-lt)', title: 'Jobs earn stars', body: `Every quest gives you stars. One star is worth ${STAR_MINUTES} minutes of screen time.` },
    { icon: 'time', iconColor: '#2F8F6B', tint: 'var(--tint-sage)', title: 'Stars buy screen time', body: `You choose when to use them. A good amount of screen a day is about ${recommendedMinutes} minutes.` },
  ]
  if (goal?.title && !goalRedeemed) {
    rows.push({ icon: 'deal', iconColor: '#3D739A', tint: 'var(--tint-blue, #E4ECF7)', title: `Saving for ${goal.title}`, body: `You have ${bankBalance} of ${goal.stars_needed} stars so far. Keep going!` })
  }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(26,26,46,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, maxHeight: '86vh', overflowY: 'auto', background: 'var(--cream)', borderRadius: '24px', padding: '22px 20px', boxShadow: '0 20px 50px -16px rgba(26,26,46,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            <KidIcon name="deal" size={24} color="var(--terracotta-dark)" /> Our family deal
          </span>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '18px', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '13px', alignItems: 'center', background: '#fff', borderRadius: '16px', padding: '13px 15px' }}>
              <span style={{ width: 42, height: 42, borderRadius: '12px', background: r.tint, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><KidIcon name={r.icon} size={23} color={r.iconColor} /></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)' }}>{r.title}</div>
                <div style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>{r.body}</div>
              </div>
            </div>
          ))}
        </div>
        {/* The timer rule the child agreed on their first run: locked in, read
            only, with the date it was agreed together. Both sides see the
            same rule, and the child never edits it from here. */}
        {contractRule && (
          <div style={{ marginTop: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
              My timer rule
            </div>
            <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '14px', padding: '13px 15px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', lineHeight: 1.45, margin: 0 }}>
                {contractRule}
              </p>
              {contractAgreedAt && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--terracotta-dark)', margin: '8px 0 0' }}>
                  ✓ Agreed together on {new Date(contractAgreedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* The real contract: what this family actually agreed and signed
            together. Each promise is a tappable card the child can open to
            read, so the deal they made is always here in their own app. */}
        {agreementItems.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              What we agreed together
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {agreementItems.map((it, i) => {
                const open = openPromise === i
                return (
                  <div key={i} style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenPromise(open ? null : i)}
                      aria-expanded={open}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 15px', textAlign: 'left' }}
                    >
                      <span style={{ width: 34, height: 34, borderRadius: '10px', background: 'var(--terracotta-lt)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><KidIcon name="deal" size={18} color="var(--terracotta-dark)" /></span>
                      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)' }}>{it.title}</span>
                      <span aria-hidden style={{ flexShrink: 0, fontSize: 17, color: 'var(--ink-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
                    </button>
                    {open && (
                      <div style={{ padding: '0 15px 14px 59px', fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                        {it.body}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {agreementSigned && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--retro-green-dark, var(--deep-teal))', margin: '10px 2px 0', textAlign: 'center' }}>
                ✓ You and your grown up agreed this together
              </p>
            )}
          </div>
        )}

        <button onClick={onClose} style={{ width: '100%', marginTop: '16px', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '15px', padding: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          Got it!
        </button>
      </div>
    </div>
  )
}

// Make it mine: the child picks their buddy and their colour. Their choice, not
// an assumption about them. Saves instantly and the whole app takes the accent.
function MakeItMine({ onClose, chosenBuddy, chosenAccent, earnedStages = 0, onPick }: {
  onClose: () => void
  chosenBuddy: string
  chosenAccent: string
  earnedStages?: number
  onPick: (next: { buddy?: string; accent?: string }) => void
}) {
  // A mixed colour reads back as h<hue>; the slider starts from it, or from a
  // pleasant blue if the child is on a named colour.
  const isCustom = /^h\d{1,3}$/.test(chosenAccent)
  const [hue, setHue] = useState(isCustom ? Number(chosenAccent.slice(1)) : 210)
  const preview = resolveTheme(chosenAccent)
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(26,26,46,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, maxHeight: '86vh', overflowY: 'auto', background: 'var(--cream)', borderRadius: '24px', padding: '22px 20px', boxShadow: '0 20px 50px -16px rgba(26,26,46,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            <KidIcon name="star" size={22} color="var(--terracotta-dark)" /> Make it mine
          </span>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '18px', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>Pick your buddy</div>
        {/* DiGi is always yours; a Planet Friend can only be chosen once its
            stage has been earned. Locked Friends still show, greyed with a
            lock, so a child can see who is coming and keep going for them. */}
        <div style={{ display: 'flex', gap: '9px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {Object.entries(BUDDY_MAP).map(([id, b]) => {
            const locked = typeof b.stageId === 'number' && b.stageId > earnedStages
            const on = chosenBuddy === id
            return (
              <button
                key={id}
                onClick={() => { if (!locked) onPick({ buddy: id }) }}
                aria-pressed={on}
                aria-disabled={locked}
                title={locked ? `Earn ${b.name} at Stage ${b.stageId}` : b.name}
                style={{ flex: '1 0 26%', minWidth: 72, cursor: locked ? 'not-allowed' : 'pointer', background: '#fff', border: on ? '3px solid var(--ink)' : '2px solid transparent', borderRadius: '16px', padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', opacity: locked ? 0.55 : 1, position: 'relative' }}
              >
                <span style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: '#FFF7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: locked ? 'grayscale(1)' : 'none' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {id === 'digi'
                    ? <img src={b.img} alt="" style={{ width: 40, height: 40 }} />
                    : <img src={b.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>
                  {locked ? `🔒 ${b.name}` : b.name}
                </span>
              </button>
            )
          })}
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>Pick your background</div>
        {/* The colour bar: each swatch is the real background it sets, so the
            child picks the whole screen, not a ring. A live preview strip sits
            above it so the change is obvious before they even close. */}
        <div style={{ height: 54, borderRadius: '14px', background: preview.bg, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(26,26,46,0.12)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px', color: preview.ink }}>My app</span>
        </div>
        <div style={{ display: 'flex', gap: '9px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {PICKER_ACCENTS.map(id => {
            const a = ACCENT_MAP[id]
            const on = chosenAccent === id
            return (
              <button key={id} onClick={() => onPick({ accent: id })} aria-label={a.name} aria-pressed={on} style={{ flexShrink: 0, cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 50, height: 50, borderRadius: '14px', background: a.bg, boxShadow: on ? '0 0 0 3px #fff, 0 0 0 6px var(--ink)' : 'inset 0 0 0 1.5px rgba(26,26,46,0.12)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: on ? 'var(--ink)' : 'var(--ink-soft)' }}>{a.name}</span>
              </button>
            )
          })}
        </div>

        {/* Mix your own: slide to any colour and it becomes a soft wash the
            same gentle way as the set ones. The knob wears the colour it will
            set, and the swatch to the right sits in the same language as the six
            pastels, so the mixed one reads as one more choice, not a gadget. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Or mix your own</span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <span aria-hidden style={{ width: 46, height: 46, borderRadius: '14px', background: hueWash(hue).bg, boxShadow: isCustom ? '0 0 0 3px var(--cream), 0 0 0 6px var(--ink)' : 'inset 0 0 0 1.5px rgba(26,26,46,0.12)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: isCustom ? 'var(--ink)' : 'var(--ink-soft)' }}>Mine</span>
          </span>
        </div>
        <input
          className="mine-hue"
          type="range" min={0} max={360} value={hue} aria-label="Mix your own colour"
          onChange={e => { const h = Number(e.target.value); setHue(h); onPick({ accent: `h${h}` }) }}
          style={{ ['--thumb' as unknown as string]: hueWash(hue).hex, width: '100%', marginBottom: '4px' }}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-light)', textAlign: 'center', marginBottom: '18px' }}>
          Slide to find your colour
        </div>
        <style>{`
          .mine-hue { -webkit-appearance: none; appearance: none; width: 100%; height: 30px; background: transparent; cursor: pointer; outline: none; }
          .mine-hue::-webkit-slider-runnable-track { height: 16px; border-radius: 100px; border: 1.5px solid rgba(26,26,46,0.14); box-shadow: inset 0 1px 3px rgba(26,26,46,0.18);
            background: linear-gradient(90deg, hsl(0,72%,62%), hsl(45,78%,60%), hsl(95,52%,54%), hsl(150,48%,52%), hsl(195,60%,56%), hsl(235,62%,64%), hsl(285,58%,64%), hsl(335,66%,63%), hsl(360,72%,62%)); }
          .mine-hue::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 30px; height: 30px; border-radius: 50%; background: #fff; border: 5px solid var(--thumb); box-shadow: 0 3px 0 rgba(26,26,46,0.22); margin-top: -8px; cursor: grab; transition: border-color 0.1s; }
          .mine-hue:active::-webkit-slider-thumb { cursor: grabbing; box-shadow: 0 2px 0 rgba(26,26,46,0.22); }
          .mine-hue::-moz-range-track { height: 16px; border-radius: 100px; border: 1.5px solid rgba(26,26,46,0.14);
            background: linear-gradient(90deg, hsl(0,72%,62%), hsl(45,78%,60%), hsl(95,52%,54%), hsl(150,48%,52%), hsl(195,60%,56%), hsl(235,62%,64%), hsl(285,58%,64%), hsl(335,66%,63%), hsl(360,72%,62%)); }
          .mine-hue::-moz-range-thumb { width: 30px; height: 30px; border-radius: 50%; background: #fff; border: 5px solid var(--thumb); box-shadow: 0 3px 0 rgba(26,26,46,0.22); cursor: grab; }
        `}</style>

        <button onClick={onClose} style={{ width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '15px', padding: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          That&apos;s mine!
        </button>
      </div>
    </div>
  )
}

function NotesFromGrownUp({ token, notes }: {
  token: string
  notes: { id: string; kind: string; title: string; body: string; read: boolean }[]
}) {
  // Already read notes fold away, so the card only ever shows what is new to
  // read. Tapping Got it marks it read on the server and tucks it away, but it
  // still lives in their app history for the grown up.
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set(notes.filter(n => n.read).map(n => n.id)))
  const visible = notes.filter(n => !dismissed.has(n.id))
  if (visible.length === 0) return null

  const gotIt = (id: string) => {
    setDismissed(prev => { const next = new Set(prev); next.add(id); return next })
    fetch('/api/child-share', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, id }),
    }).catch(() => { /* it still shows read on next open */ })
  }

  return (
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {visible.map(n => (
        <div key={n.id} style={{ background: '#fff', borderRadius: '18px', padding: '16px 18px', boxShadow: '0 5px 0 rgba(0,0,0,0.14)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>💛</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              A note for you
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17.5px', color: 'var(--ink)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 14px' }}>
            {n.body}
          </p>
          <button
            onClick={() => gotIt(n.id)}
            style={{
              width: '100%', padding: '12px', borderRadius: '14px', border: 'none', cursor: 'pointer',
              background: 'var(--terracotta)', color: 'var(--ink)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            Got it, thank you 💛
          </button>
        </div>
      ))}
    </div>
  )
}

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
  // Tomorrow's items sit in their own calm heads up so the child can get
  // ready the night before, the same nudge their grown up gets. Today's
  // items lead and can go red as a timed one nears.
  const todayItems = items.filter(i => (i.when ?? 'today') === 'today')
  const tomorrowItems = items.filter(i => i.when === 'tomorrow')
  const anyUrgent = todayItems.some(i => urgentOf(i.time))

  const row = (i: KidSchoolToday, hot: boolean) => (
    <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{SCHOOL_KIND_EMOJI[i.kind] ?? '📌'}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)' }}>
        {i.title}
      </span>
      {i.time && (
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
          padding: '3px 9px', borderRadius: '100px',
          background: hot ? '#FDECEC' : 'var(--tint-sage)',
          color: hot ? '#B93B3F' : 'var(--ink-soft)',
        }}>
          {i.time}
        </span>
      )}
    </div>
  )

  return (
    <div style={{
      background: '#fff', borderRadius: '18px', padding: '14px 16px', marginBottom: '16px',
      border: anyUrgent ? '2.5px solid #E5484D' : '2px solid var(--terracotta)',
      boxShadow: anyUrgent ? '0 5px 0 rgba(185,59,63,0.55)' : '0 5px 0 var(--terracotta-dark)',
      animation: anyUrgent ? 'gcKidSchoolPulse 1.3s ease-in-out infinite' : undefined,
    }}>
      <style>{`@keyframes gcKidSchoolPulse { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }`}</style>

      {todayItems.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: anyUrgent ? '#B93B3F' : 'var(--terracotta-dark)', marginBottom: '9px' }}>
            {anyUrgent ? '🔴 Don’t forget, it is nearly time' : '🏫 From school today'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayItems.map(i => row(i, urgentOf(i.time)))}
          </div>
        </>
      )}

      {tomorrowItems.length > 0 && (
        <div style={{ marginTop: todayItems.length > 0 ? '12px' : 0, paddingTop: todayItems.length > 0 ? '12px' : 0, borderTop: todayItems.length > 0 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '9px' }}>
            🎒 Tomorrow, get it ready tonight
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tomorrowItems.map(i => row(i, false))}
          </div>
        </div>
      )}
    </div>
  )
}

function KidWeekChart({ data, weekStars }: { data: { label: string; count: number; today: boolean }[]; weekStars: number }) {
  // A child reads a week best as a simple row of days they showed up on, the
  // Duolingo and Finch way: a filled gold star for every day with a quest, an
  // empty circle for a quiet day, today ringed. No bar heights to decode, no
  // floating numbers. The framing is days shown up, never a day missed, so it
  // celebrates the habit and never nags.
  const activeDays = data.filter(d => d.count > 0).length
  const headline =
    activeDays === 0 ? 'A fresh week, let us go!'
    : activeDays >= 6 ? `Amazing, ${activeDays} days this week!`
    : activeDays >= 3 ? `Great going, ${activeDays} days this week`
    : `${activeDays} day${activeDays === 1 ? '' : 's'} this week, keep it up`
  return (
    <div style={{ background: '#fff', borderRadius: '18px', padding: '15px 16px 13px', marginBottom: '14px', boxShadow: '0 4px 0 rgba(0,0,0,0.16)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '12px' }}>
        {headline}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
        {data.map((d, i) => {
          const active = d.count > 0
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px',
                background: active ? 'var(--terracotta)' : 'var(--cream)',
                border: active ? 'none' : '2px dashed var(--ink-light)',
                boxShadow: d.today ? '0 0 0 3px var(--terracotta-lt)' : 'none',
                color: '#fff', fontWeight: 800,
              }}>
                {active ? '⭐' : ''}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, color: d.today ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>{d.label}</span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: '13px', textAlign: 'center', background: 'var(--tint-sage)', borderRadius: '11px', padding: '10px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>
          ⭐ {weekStars} stars earned = {weekStars * STAR_MINUTES} minutes of screen time
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

function SectionHead({ icon, kidIcon, children }: { icon?: string; kidIcon?: KidIconName; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 3px' }}>
      {kidIcon
        ? <span style={{ display: 'flex', lineHeight: 1 }}><KidIcon name={kidIcon} size={20} color="var(--ink)" /></span>
        : <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</span>}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
        {children}
      </span>
    </div>
  )
}

// A compact thumbnail row: the artwork small on the left, the words and the
// action on the right, so a whole tab of lessons scans like the quests list
// instead of a long stack of tall banners. Crisper, shorter, same pictures.
function CardFace({
  emoji, title, subtitle, seed, done, image, pill, actionIcon, isNew,
}: {
  emoji: string; title: string; subtitle: string; seed: string; done: boolean
  image?: string; pill?: string; actionIcon: string; isNew?: boolean
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
          <span style={{ position: 'absolute', bottom: '5px', left: '5px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '2px 7px' }}>
            {pill}
          </span>
        )}
        {isNew && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: '#fff', background: 'var(--coral, #D4600A)', borderRadius: '100px', padding: '2px 6px', letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            New
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {done && (
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px', marginBottom: '4px' }}>
            ✓ Done
          </span>
        )}
        <span style={{
          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.22,
        }}>
          {title}
        </span>
        <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-muted)', marginTop: '2px', lineHeight: 1.35 }}>
          {subtitle}
        </span>
      </div>
      <span style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--terracotta)' : 'var(--cream)',
        border: done ? 'none' : '2.5px dashed var(--ink-light)',
        fontSize: '19px',
      }}>
        {done ? '✓' : actionIcon}
      </span>
    </div>
  )
}
