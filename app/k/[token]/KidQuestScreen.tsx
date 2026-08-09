'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import KidPrivacyNote from '@/components/kid/KidPrivacyNote'
import { useRouter } from 'next/navigation'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, c => c.charCodeAt(0))
}
import { STAR_MINUTES } from '@/lib/quests/templates'
import { printablesForStage } from '@/lib/printables/registry'
import type { StarBank } from '@/lib/quests/bank'
import { lessonsForStage, type KidLesson } from '@/lib/quests/kid-lessons'
import { gamesForStage, type QuestGame } from '@/lib/quest-games/registry'
import QuestGamePlayer from '@/components/quest-games/QuestGamePlayer'
import DeviceTimeCard from '@/components/quests/DeviceTimeCard'
import type { FamilyDevice } from '@/lib/devices/family'
import { TIMER_RULE, readTrust, type ActiveSession } from '@/lib/quests/device-time'
import { contractRule, type ContractLevel } from '@/lib/content/kid-contract'
import KidAskBanner, { type KidAskState, type KidNudge } from '@/components/kid/KidAskBanner'
import { playKidSound, soundEnabled, setSoundEnabled } from '@/lib/sound/kidSounds'
import { getDeviceId } from '@/lib/push/device-id'
import HappyNews, { type HappyNewsItem, type CharacterKey } from '@/components/celebrate/HappyNews'
import HappyScene from '@/components/celebrate/HappyScene'
import BalanceInsight from '@/components/celebrate/BalanceInsight'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'
import KidIcon, { type KidIconName } from '@/components/kid/KidIcon'
import KidRemindersPrompt, { remindersSnoozed } from '@/components/kid/KidRemindersPrompt'
import KidFiveADay from '@/components/kid/KidFiveADay'
import { isMoveJob, readingMinutesFor } from '@/lib/kid/five-a-day'
import KidStreakTakeover from '@/components/kid/KidStreakTakeover'
import KidContract from '@/components/kid/KidContract'
import KidRoad from '@/components/kid/KidRoad'
import KidSplash from '@/components/kid/KidSplash'
import KidSquadIntro, { squadIntroSeen, squadIntroDue } from '@/components/kid/KidSquadIntro'
import StreakBar from '@/components/kid/StreakBar'
import KidWins, { type WinRecord } from '@/components/kid/KidWins'
import KidPassport from '@/components/kid/KidPassport'
import KidFriendArrival from '@/components/kid/KidFriendArrival'
import { FRIEND_ARRIVAL_VIDEO } from '@/lib/content/celebration-media'
import KidWinPop, { type Win } from '@/components/kid/KidWinPop'
import type { KidSticker } from '@/components/kid/KidStickers'
import { friendsFromStreaks, isFriendMoment, streakCurrency, streaksToUnlockFriend } from '@/lib/pathway/streak-unlock'
import { startErrorMessage, START_RETRY } from '@/lib/quests/start-errors'
import Image from 'next/image'
import { STAGE_CHARACTERS, characterForStage, type StageCharacter } from '@/lib/content/stage-characters'

// The kid facing quest screen: joyful, huge tap targets, instant ticks,
// stars that count up, and a goal bar. Pending ticks show as "waiting
// for the grown up", approved ones celebrate. No navigation anywhere
// else: this screen is the whole world of the link.

type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; blocks_screens?: boolean; created_at?: string | null }
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
// The map itself lives in lib/kid/buddy now, shared with the jobs page.
import { BUDDY_MAP, DEFAULT_BUDDY } from '@/lib/kid/buddy'
// Make it mine recolours the whole screen, not just the ring, and now it
// recolours every OTHER screen the child can reach too. The map, the picker set
// and the resolver moved to lib/kid/theme on 9 August 2026 because they were
// private to this file, which is why Telling a grown up and Ask for a job stayed
// anthracite while the home screen went the colour the child picked. Same
// reasoning as lib/kid/buddy: one answer to what colour the child is.
import { resolveTheme, knownAccent, DEFAULT_ACCENT, PICKER_ACCENTS } from '@/lib/kid/theme'
// Print it now. Lifted to lib/kid/print-sheet on 9 August 2026 so the window it
// writes could be driven in a test: it needs a live link token to reach from
// here, so nothing had ever opened it except a child.
import { printSheet } from '@/lib/kid/print-sheet'

export default function KidQuestScreen({
  token, childName, buddy = null, accent = null, stageId = 2, quests, todayTicks, weekStars, goal, streakDays = 0, laterQuests = [], doneLessonKeys = [], missions = [], weekMission = null,
  adventures = [], bank = null, holidayLine = null, holidayMinutes = 0, holidaySpendable = false,
  usedWeekMinutes = 0, usedTodayMinutes = 0, recommendedMinutes = 0, requests = [], printablesUnlocked = true, activeSession = null,
  weekChart = [], schoolToday = [], schoolWeekCount = 0, notes = [], agreementItems = [], agreementSigned = false,
  contractLevel = '11plus', contractAgreedAt = null, contractReady = false, giftStarsOwed = 0,
  deviceTrust = 'ask', initialAsk = null, initialNudges = [],
  stageLessonsPassed = null, stageLessonsTotal = null, focusLesson = null, assignedPrintable = null,
  earnedStages = 0, completedStreaks = 0, jobStreaks = 0, completedDays = 0, sheetsDone = 0, sheetStars = 0, familyDevices = [],
  stickers = [], celebrateStickers = [], celebratedStickers = [], streakWeekSeen = null, starWeek = '',
  fiveADayInitial = null,
}: {
  token: string
  childName: string
  // How many Planet Friends this child has earned, the further of the passport
  // stages and the streak unlock, so the picker only offers earned Friends.
  earnedStages?: number
  // Completed jobs streaks so far, driving the streak bar and the next unlock.
  completedStreaks?: number
  // Sheets finished away from a screen and confirmed, and the stars they paid.
  // The same numbers the parent's off screen total is built from.
  sheetsDone?: number
  sheetStars?: number
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
  /** This week's school objective as one calm card, null in the holidays. */
  weekMission?: { line: string; second: string | null; state: 'open' | 'pending' | 'done' } | null
  adventures?: KidAdventure[]
  bank?: StarBank | null
  // The holiday bank, already put into words on the server so the copy has one
  // home. Null means there is nothing worth saying: no minutes saved and no
  // holiday running, which is most children most of the year.
  holidayLine?: { title: string; body: string } | null
  holidayMinutes?: number
  holidaySpendable?: boolean
  usedWeekMinutes?: number
  usedTodayMinutes?: number
  recommendedMinutes?: number
  requests?: KidAsk[]
  printablesUnlocked?: boolean
  activeSession?: ActiveSession | null
  // The screens this family owns, so the timer picker names one instead of
  // offering four categories. Read on the server, since the child app is token
  // authed and cannot ask for them itself.
  familyDevices?: FamilyDevice[]
  weekChart?: { label: string; count: number; today: boolean }[]
  schoolToday?: KidSchoolToday[]
  /** How many school reminders this child has at all, so the week link only
   *  appears when there is a week to look at. */
  schoolWeekCount?: number
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
  // The sticker book, which used to live at the foot of the road. It moved here
  // with the road itself, because migration 109's once only pop is the only
  // server side celebration the child app has ever had and it must not go down
  // with the page it happened to be rendered on.
  stickers?: KidSticker[]
  /** Earned but not yet seen, so the book can pop the new ones exactly once. */
  celebrateStickers?: string[]
  /** The two raw counters behind completedStreaks, needed to move it honestly. */
  jobStreaks?: number
  completedDays?: number
  /** Sticker keys this child has ALREADY been shown. Never shown again. */
  celebratedStickers?: string[]
  /** The star week this child last saw the streak screen in, or null. */
  streakWeekSeen?: string | null
  /** The star week we are in now, stamped on the server. */
  starWeek?: string
  /** Fixture only: a ready made five a day, so ref-kid-home can render this
   *  whole screen without the API. Production never passes it. */
  fiveADayInitial?: import('@/components/kid/KidFiveADay').DayState | null
}) {
  // Only the games, mini lessons and printables that suit this child's
  // stage, so a young child never meets an older child's content.
  const stageLessons = lessonsForStage(stageId)
  const stageGames = gamesForStage(stageId)
  const stagePrintables = printablesForStage(stageId)
  const [ticks, setTicks] = useState<Record<string, string>>(
    Object.fromEntries(todayTicks.map(t => [t.quest_id, t.status]))
  )
  const [remindState, setRemindState] = useState<'hidden' | 'offer' | 'on' | 'ios'>('hidden')
  const [showWelcome, setShowWelcome] = useState(false)
  // The welcome greets by the child's clock. Null until mounted so the server
  // render and the first client render agree, then the real hour arrives.
  const [greetHour, setGreetHour] = useState<number | null>(null)
  useEffect(() => { setGreetHour(new Date().getHours()) }, [])
  const [toast, setToast] = useState<string | null>(null)
  const [askedMore, setAskedMore] = useState(false)
  // Opens on quests, unless a link said otherwise.
  //
  // The five a day's printable step used to link to `/k/{token}`, which is the
  // page the child is already on, so tapping it navigated to itself and nothing
  // happened. Justin: "it's not clicking anywhere". Printables live in a tab on
  // this same page, so the link needs to say WHICH tab rather than which page.
  //
  // Read from the URL rather than held in the parent, because the step is a
  // plain link in a list of five and turning that one row into a callback would
  // mean threading state through the whole day screen for a single tap.
  const [tab, setTab] = useState<'quests' | 'lessons' | 'print'>(() => {
    if (typeof window === 'undefined') return 'quests'
    const t = new URLSearchParams(window.location.search).get('tab')
    return t === 'print' || t === 'lessons' ? t : 'quests'
  })
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
  // Coming back in starts at the top. Justin: "when go back in it should
  // start at top." Two ways back exist: a fresh navigation (this mount) and
  // the PWA resuming from the background, which does not remount, so the
  // visibility change covers it. The five minute floor is what stops a child
  // mid scroll being yanked to the top just for switching apps for a moment:
  // only a real absence resets the screen to its start.
  useEffect(() => {
    window.scrollTo(0, 0)
    let hiddenAt: number | null = null
    const onVis = () => {
      if (document.hidden) { hiddenAt = Date.now(); return }
      if (hiddenAt !== null && Date.now() - hiddenAt > 5 * 60_000) window.scrollTo(0, 0)
      hiddenAt = null
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
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
  // The school week card's claim state, optimistic on tap.
  const [weekState, setWeekState] = useState<'open' | 'pending' | 'done'>(weekMission?.state ?? 'open')
  const [lessonCard, setLessonCard] = useState(0)
  const [qIndex, setQIndex] = useState(0)
  const [qAnswers, setQAnswers] = useState<number[]>([])
  const [qPicked, setQPicked] = useState<number | null>(null)
  const [asks, setAsks] = useState<KidAsk[]>(requests)
  // Shown on the Ask for a job tile, so a child can see an idea is still with a
  // grown up without opening the page to find out.
  const pendingAsks = asks.filter(a => a.status === 'pending').length
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
  const [seenHydrated, setSeenHydrated] = useState(false)
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
  const [winsOpen, setWinsOpen] = useState(false)
  // The sticker book, opened on purpose from its own tile rather than found
  // by scrolling past the wins panel.
  const [passportOpen, setPassportOpen] = useState(false)

  // A PLANET FRIEND CAME HOME.
  //
  // Justin, 6 August 2026: "Can we make even one is earn[ed] there is a big
  // animated celebration."
  //
  // Earning one used to be a sentence inside the streak takeover, and then the
  // child had to go and find it. This is the moment itself, and it is the only
  // thing on the screen while it plays.
  //
  // Two ways in, because a Friend can be earned in front of the child or while
  // they were away:
  //
  //   LIVE    they finish their fifth job and that day is the day. The streak
  //           takeover runs first, then this, because the streak is the thing
  //           they just did and the Friend is what it bought.
  //   WAITING it happened on a device they have since closed, so the sticker is
  //           sitting in earned_stickers unseen and the arrival plays on open.
  //
  // The highest Friend wins if two are waiting: a child who has been away long
  // enough to earn two should be shown the bigger one.
  const [arrival, setArrival] = useState<StageCharacter | null>(() => {
    const keys = new Set(celebrateStickers)
    return STAGE_CHARACTERS
      .filter(c => keys.has(`friend-${c.key}`))
      .sort((a, b) => b.stageId - a.stageId)[0] ?? null
  })

  // THE LIVE COUNT.
  //
  // completedStreaks is read on the server when the page loads, and a child who
  // finishes their day has just made it one higher. The streak takeover was
  // being handed the stale number, so on the exact day a Friend was earned it
  // computed isFriendMoment against the day before and told the child "one more
  // day and you get a new friend", seconds after they had got one. The one
  // screen where being a day behind lands hardest.
  //
  // A completed day is one more row in kid_days, so the live count is simply one
  // more. The server read still wins on the next load.
  const [liveStreaks, setLiveStreaks] = useState(completedStreaks)
  const [liveDays, setLiveDays] = useState(completedDays)

  // FINISHING A DAY DOES NOT ALWAYS ADD ONE.
  //
  // Justin, 8 August 2026, looking at Ada: "why only one more streak to get
  // character, I'm not sure she has actually done enough ... please check
  // wiring is all correct." He was right, and this was the fault.
  //
  // completedStreaks is a MAX of two counters, not a total: rows in job_streaks
  // and completed days in kid_days, combined that way on purpose so overlapping
  // work is not counted twice. Completing a day raises only the second one. So
  // when job_streaks is the counter currently winning the max, a finished day
  // moves the real number by NOTHING, and the old optimistic `+1` invented a
  // streak that did not exist.
  //
  // Ada is the exact case: 1 job streak, 0 completed days, so 1. She finished
  // her first day, the client made it 2, and 2 is the rung that brings Pebble
  // home. The server still said 1 the whole time.
  //
  // It recomputes through the same function the server uses instead, so the two
  // cannot disagree by construction.
  const bumpDay = useCallback(() => {
    const days = liveDays + 1
    setLiveDays(days)
    const next = streakCurrency(jobStreaks, days)
    setLiveStreaks(next)
    return next
  }, [liveDays, jobStreaks])

  // THE STREAK SCREEN IS A WEEKLY REMINDER, NOT A DAILY ONE.
  //
  // Justin, 8 August 2026: "only ever once for both, as would be annoying if
  // every time they go in ... then the streaks achieved come up once per week so
  // reminds them once per week what they have achieved, as we show streaks in
  // other places."
  //
  // It fired on every completed day, which for a child doing their five a day
  // is every single day: the same flame, the same week dots and the same
  // sentence, over a number already on their home screen. That is how a
  // celebration becomes a dialog you learn to dismiss without reading.
  //
  // The star week is the unit rather than a rolling seven days, because it is
  // the Monday to Monday London week their earned minutes already reset on. And
  // it is remembered on the child, not in localStorage, which is what it used
  // before and which meant once per DEVICE, twice for a child with a tablet and
  // a phone, and never again once an in app browser cleared its storage.
  const [weekSeen, setWeekSeen] = useState<string | null>(streakWeekSeen)
  const streakDueThisWeek = starWeek !== '' && weekSeen !== starWeek

  const markStreakWeekSeen = useCallback(() => {
    if (starWeek === '') return
    setWeekSeen(starWeek)
    try {
      fetch('/api/kid/streak-week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).catch(() => {})
    } catch { /* best effort, the local note holds for this visit */ }
  }, [starWeek, token])

  // The Friend arrival does NOT ride on the streak screen closing any more.
  //
  // It used to, and once the streak screen started skipping most days that
  // would have taken the rarest moment in the whole app down with it: a child
  // earns a Planet Friend about five times in a childhood, and it cannot depend
  // on a weekly reminder happening to be due the same day.
  const openArrivalIfEarned = useCallback((streaks: number) => {
    if (!isFriendMoment(streaks)) return
    const f = characterForStage(friendsFromStreaks(streaks))
    // Once ever, and the server is what says so. A Friend already celebrated on
    // a tablet must not arrive again on a phone, and the localStorage note
    // below cannot know about the tablet.
    if (f && !celebratedStickers.includes(`friend-${f.key}`)) setArrival(f)
  }, [celebratedStickers])

  // Mark the Friend seen as soon as the takeover opens, not when it is
  // dismissed. A child who closes the tab mid flight has still had the moment,
  // and sitting through the same rocket twice for a Friend they already have is
  // worse than missing the end of it once.
  //
  // Two records, because neither is enough alone. The server call is the real
  // one and it is what the book reads, but on the LIVE path the earned_stickers
  // row does not exist yet: it is written by the reconcile on the next read, so
  // there is nothing to mark and the arrival would replay tomorrow. The local
  // note covers that gap on this device. Both are best effort and idempotent.
  const markArrivalSeen = useCallback((friend: StageCharacter) => {
    try { localStorage.setItem(`gc_friend_home_${friend.key}`, '1') } catch { /* private mode */ }
    try {
      fetch('/api/kid/stickers/seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, keys: [`friend-${friend.key}`] }),
      }).catch(() => {})
    } catch { /* best effort */ }
  }, [token])

  const arrivalSeen = useRef<string | null>(null)
  useEffect(() => {
    if (!arrival || arrivalSeen.current === arrival.key) return
    // Already had this one on this device, so do not make them watch it again.
    let had = false
    try { had = localStorage.getItem(`gc_friend_home_${arrival.key}`) === '1' } catch { had = false }
    if (had) { setArrival(null); return }
    arrivalSeen.current = arrival.key
    markArrivalSeen(arrival)
  }, [arrival, markArrivalSeen])
  // The child's own record and anything earned while they were away. Both come
  // from /api/kid/celebrations, which is also what writes the milestone rows.
  const [winRecord, setWinRecord] = useState<WinRecord | null>(null)
  const [pendingWins, setPendingWins] = useState<Win[]>([])
  // Which kind of printable is showing. The whole library on one scroll was a
  // long way to the sheet you wanted, so it filters by the kind already in the
  // registry rather than a new grouping invented for the child app.
  const [printKind, setPrintKind] = useState<string>('all')
  // The squad welcome: DiGi and the Planet Friends introduced one at a time.
  // Once a week, not every open. Six cards is nearly half a minute of splash
  // standing between a child and their jobs, and however lovely it is, the
  // third time in a day it is just in the way. The first meeting is a gentle
  // tap through; the weekly replay auto plays like a short splash, and
  // squadIntroSeen still marks the first open so the component knows which.
  // Jobs added since this child last opened their app.
  //
  // Worked out ONCE on mount and held in state, then the clock is stamped
  // immediately. That order matters: stamping first would clear the answer
  // before it was rendered, and holding without stamping would show the same
  // "new" badge for ever. Same latch as the setup bar, and the same lesson as
  // the squad intro that looped, which is that a stored decision needs a writer
  // for both answers.
  //
  // localStorage rather than the database on purpose: "new since YOU last
  // looked" is a fact about this device, and it is the child's own phone.
  // First ever open records the clock and shows nothing, because everything is
  // new on day one and a banner saying seven new jobs is just the list again.
  const [newQuestCount, setNewQuestCount] = useState(0)
  useEffect(() => {
    const KEY = 'gc_kid_jobs_seen_at'
    try {
      const seen = localStorage.getItem(KEY)
      const newest = quests.reduce((max, q) => {
        const t = q.created_at ? Date.parse(q.created_at) : 0
        return Number.isFinite(t) && t > max ? t : max
      }, 0)
      if (seen !== null) {
        const since = Number(seen) || 0
        setNewQuestCount(quests.filter(q => {
          const t = q.created_at ? Date.parse(q.created_at) : 0
          return Number.isFinite(t) && t > since
        }).length)
      }
      if (newest > 0) localStorage.setItem(KEY, String(newest))
      else if (seen === null) localStorage.setItem(KEY, String(Date.now()))
    } catch { /* private mode, no badge rather than a wrong one */ }
  }, [])

  const [showIntro, setShowIntro] = useState(false)
  useEffect(() => { if (squadIntroDue()) setShowIntro(true) }, [])

  // What grew while they were away, and their own record.
  //
  // Justin: "when streaks are achieved... are real celebrations and can pop up
  // then on next login so you can see the family growing."
  //
  // This replaces three localStorage keys (gc_kid_friends_earned,
  // gc_kid_bank_mile, gc_kid_streak_seen). Every one of them celebrated a win
  // once per BROWSER: twice for a child with a tablet and a phone, never again
  // on a cleared one, and never at all on a new phone. The server now holds it
  // (migration 155), which is the same thing migration 109 already does for
  // stickers, so the moment is once per CHILD and the record survives it.
  //
  // Fails soft in every direction: an error, an empty queue or a missing table
  // simply means no pop, exactly as if nothing had been earned.
  useEffect(() => {
    let live = true
    fetch(`/api/kid/celebrations?token=${encodeURIComponent(token)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!live || !d) return
        if (d.record) setWinRecord(d.record as WinRecord)
        if (Array.isArray(d.pending) && d.pending.length > 0) setPendingWins(d.pending as Win[])
      })
      .catch(() => { /* no pop, no record card. Nothing else changes. */ })
    return () => { live = false }
  }, [token])
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
      if (isIos && !standalone && !remindersSnoozed()) setRemindState('ios')
      return
    }
    if (localStorage.getItem('gc_kid_reminders') === '1' || Notification.permission === 'granted') {
      setRemindState(Notification.permission === 'granted' ? 'on' : 'offer')
      return
    }
    // A recent Not now keeps us quiet for three days. Checked here rather than
    // inside the prompt so the offer never flashes up and vanish on load.
    if (Notification.permission !== 'denied' && !remindersSnoozed()) setRemindState('offer')
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
    const localId = `local-${Date.now()}`
    setAsks(prev => [{ id: localId, title: clean, emoji, status: 'pending' }, ...prev])
    setToast('Quest idea sent to your grown up! ⭐')
    setTimeout(() => setToast(null), 3500)
    try {
      const res = await fetch('/api/quests/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, title: clean, emoji }),
      })
      // The optimistic row is a promise to the child that it landed, so a
      // refusal has to take it back. Without this the daily cap would be the
      // worst kind of bug: the child is told it was sent, sees it in the list,
      // and it is simply not there tomorrow.
      if (!res.ok) {
        setAsks(prev => prev.filter(a => a.id !== localId))
        const d = await res.json().catch(() => null)
        setToast(d?.reason === 'daily_limit'
          ? 'That is plenty of ideas for today. Have another think tomorrow!'
          : 'That one did not send. Try again in a minute.')
        setTimeout(() => setToast(null), 3500)
      }
    } catch {
      // Offline or a dropped connection. Same rule: do not leave a row the
      // child believes in when nothing was saved.
      setAsks(prev => prev.filter(a => a.id !== localId))
      setToast('That one did not send. Try again in a minute.')
      setTimeout(() => setToast(null), 3500)
    }
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

  // This week's school mission claimed: one tap, one pending tick, stars
  // when the grown up approves. Optimistic to pending; the server recomputes
  // the objective itself and dedupes per week.
  async function recordSchoolWeek() {
    if (weekState !== 'open') return
    setWeekState('pending')
    setToast('3 stars sent to your grown up! ⭐')
    setTimeout(() => setToast(null), 3500)
    try {
      await fetch('/api/quests/lesson-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, school_week: true }),
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
        // deviceId so this phone keeps ONE row instead of gaining another every
        // time the push service rotates its endpoint. Teo had five, and four of
        // them still delivered, which is why every reminder arrived four times.
        // See migration 166.
        body: JSON.stringify({ token, subscription: sub.toJSON(), deviceId: getDeviceId() }),
      })
      localStorage.setItem('gc_kid_reminders', '1')
      setRemindState('on')
    } catch { setRemindState('hidden') }
  }

  // Ticking a job moved to the jobs page (KidJobsScreen) with the list
  // itself. This screen keeps only the read side of ticks: the five a day's
  // jobs step and the ask banner still need to know what is done.

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

  // WHERE A TAB TAKES YOU.
  //
  // Justin: "when you click quests from this button it does not take you to
  // quests."
  //
  // He is right, and the reason is a layout decision nobody had followed
  // through. The tab row is sticky and setting the tab only swapped what is
  // BELOW it, so a child tapping Quests halfway down the page stayed halfway
  // down the page. Two of the three tabs were already scrolled into view when
  // something else selected them, from the five a day row and the shortcut
  // tiles, so the buttons themselves were the only way in that did nothing.
  //
  // And Quests does not go to the tab row anyway. The jobs live in the ONE
  // Today list ABOVE the tabs, and the Quests tab holds what sits around them,
  // so scrolling to the tab row would land a child on the balance gauge with
  // their jobs off the top of the screen. Which is exactly what the screenshot
  // shows. Quests goes to the jobs; the other two go to the tabs.
  const goToTab = useCallback((key: 'quests' | 'lessons' | 'print') => {
    // Quests goes to the five a day, which is the day itself now the separate
    // Today list has folded into the jobs page.
    const id = key === 'quests' ? 'kid-five' : 'kid-tabs'
    // Next frame, so the tab's content has rendered and the anchor is where it
    // will actually be rather than where it was a moment ago.
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  // The child's band, from their stage. Derived once because two places want it
  // now: the quiz below, and the reading row, which states its own number of
  // minutes and gets that number from the band.
  const ageBand = (['4-7', '8-10', '11-13', '13-15', '16+'] as const)[Math.min(4, Math.max(0, stageId - 1))]

  // The jobs on today's board that ARE moving about, so the five a day's Move
  // row can point at them instead of asking for a second tick of the same hour
  // outside. Null when there are none, which keeps Move a plain self tick for a
  // child whose board has nothing physical on it today.
  const moveQuests = quests.filter(q => isMoveJob(q.title))
  const moveJobs = moveQuests.length > 0
    ? { total: moveQuests.length, done: moveQuests.every(q => !!ticks[q.id]) }
    : null
  // The five a day streak takeover, shown once when the fifth step lands.
  const [streakWon, setStreakWon] = useState<number | null>(null)
  const pendingStars = quests.filter(q => ticks[q.id] === 'pending').reduce((s, q) => s + q.stars, 0)
  // The bank is what is really there to spend: earned ever, minus the
  // screen time already used. Falls back to the week count until the
  // family has run migration 047.
  // bank.balance is the SPENDABLE weekly figure now (lib/quests/bank.ts), so this
  // line is correct without change. Worth knowing it was the load bearing one:
  // while balance meant lifetime, this screen promised Yusuf "1,710 minutes ready
  // to use" while the server refused every spend against the week, which is worse
  // than the old number because the child is told they have it and then blocked.
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


  // Nothing else pops on open. The daily hello and the wisdom pop used to spring
  // a character up every single login, which read as flicker and clutter. What
  // to do is already right there on the screen, so the home stays calm and only
  // a real, rare win ever stops it, which is now KidWinPop's job above.
  //
  // The bank milestone and the day run that used to live here have not gone
  // away: they are two of the three ladders in lib/kid/milestones, written down
  // as rows instead of browser keys, so the same wins now also reach the record
  // card and the grown up.

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

  // WHERE THE APP PUTS A CHILD WHO COMES BACK LATER THE SAME DAY.
  //
  // Justin: "I've gone back into the child's app after 5 jobs are done and it
  // arrives mid screen. Can this go to the next relevant section if they go in
  // another time the same day?"
  //
  // Mid screen was the browser being helpful: it restores the scroll position
  // from last time, which is right for an article and wrong for a board whose
  // whole job is to say what to do next. A child reopening after tea got put
  // back exactly where they left off in the morning, staring at the middle of a
  // card about something they have already done.
  //
  // So the landing is chosen rather than remembered:
  //
  //   jobs still to do          the Today list, because that IS the next thing
  //   all done, new lessons     the Lessons tab, opened
  //   all done, new printables  the Printables tab, opened
  //   nothing outstanding       the top, which is the celebration and the
  //                             balance, and is the honest answer to a child
  //                             who has finished: there is nothing you must do
  //
  // Once per mount only, and a deep link always wins, because a child who
  // followed a link to the games was told where they were going.
  const landedRef = useRef(false)
  useEffect(() => {
    if (landedRef.current) return
    // Waits on seenHydrated, not on the quests, which are a server prop and so
    // are correct on the very first paint. What is NOT correct on first paint
    // is what this child has already seen, which lives in localStorage.
    if (!seenHydrated) return
    landedRef.current = true

    // A deep link named the destination; that effect already handled it.
    try {
      const deep = new URLSearchParams(window.location.search).get('tab')
      if (deep === 'games' || deep === 'print') return
    } catch { /* fine */ }

    // Stop the browser putting them back where they were, which would otherwise
    // land after this and undo it.
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual' } catch { /* fine */ }

    const settle = () => {
      if (!allDone) { document.getElementById('kid-today')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
      if (totalNewLessons > 0) { setTab('lessons'); goToTab('lessons'); return }
      if (newPrint > 0) { setTab('print'); goToTab('print'); return }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // Two frames, so the restored scroll has already happened and the list has
    // laid out. Racing it means landing on an anchor that then moves.
    requestAnimationFrame(() => requestAnimationFrame(settle))
  }, [seenHydrated, allDone, totalNewLessons, newPrint, goToTab])

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
  //
  // seenHydrated exists because until this has run, seenLessons is empty and
  // EVERYTHING counts as new. The landing effect reads those counts to decide
  // where to put a child, so acting a frame early would send every one of them
  // to Lessons whether or not there was anything there.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gc_kid_seen_lessons')
      if (raw) setSeenLessons(new Set(JSON.parse(raw) as string[]))
    } catch { /* first visit, nothing seen */ }
    setSeenHydrated(true)
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
      {showIntro && <KidSquadIntro childName={childName} earnedFriends={earnedStages} completedStreaks={completedStreaks} onDone={() => {
        setShowIntro(false)
        // Justin, 9 August 2026: "it then takes you to halfway down scrolled
        // page, it should be the top." The intro is a fixed overlay, so the
        // page underneath keeps whatever scroll position it had, and on a
        // reopen that is wherever the child left off. Closing the intro is the
        // start of a visit, so it starts at the top. Instant, not smooth,
        // because html has scroll-behavior smooth and a child should not watch
        // the page fly upward after tapping Skip.
        try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) }
        catch { window.scrollTo(0, 0) }
      }} />}

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
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', textAlign: 'center',
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
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 10px' }}>
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
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }}>{step}</span>
                </div>
              ))}
            </div>
            <button
              onClick={dismissWelcome}
              style={{
                width: '100%', padding: '12px', background: 'var(--terracotta)', color: 'var(--ink)',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                boxShadow: '0 4px 0 var(--terracotta-dark)',
              }}
            >
              Got it, let me at my quests
            </button>
          </div>
        )}

        {/* THE ORDER IS JUSTIN'S, 9 August 2026: school diary first, the
            morning welcome second, streaks small third, the five a day
            fourth, use my time after it. "we have way too much on Home
            Screen so let's organise better." */}

        {/* 1. THE SCHOOL DIARY, the first thing on the page: what school
            needs today and tomorrow, the way into the whole week, and since
            step 1 of this reorder, the place the child adds their own
            entries. */}
        <KidSchoolBanner items={schoolToday} token={token} weekCount={schoolWeekCount} />

        {/* 2. THE MORNING WELCOME, with the little sound switch tucked in
            the corner so a child (or a grown up) can turn the sounds off any
            time. The eyebrow greets by the child's own clock, mounted after
            first paint so the server and the first client render agree. */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '18px' }}>
          <button
            onClick={() => { const next = !soundOn; setSoundOn(next); setSoundEnabled(next); if (next) playKidSound('tap') }}
            aria-label={soundOn ? 'Turn sounds off' : 'Turn sounds on'}
            style={{
              position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderRadius: '50%',
              background: '#fff', border: '1.5px solid rgba(26,26,46,0.1)',
              cursor: 'pointer', fontSize: 'var(--text-lg)', lineHeight: 1, color: 'var(--ink)',
            }}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.inkSoft, marginBottom: 6 }}>
            {greetHour === null ? 'Hello' : greetHour < 12 ? 'Good morning' : greetHour < 18 ? 'Good afternoon' : 'Good evening'}
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
          outstandingJobs={[...new Set(quests.filter(q => !ticks[q.id]).map(q => q.title))]}
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
                // Every refusal says which one it was. This used to name
                // "chores first" and shrug at the other eight, so a child whose
                // yes had already been spent was told to try again in a moment,
                // for ever. See lib/quests/start-errors.
                setToast(startErrorMessage(d.error))
                // A real reason is worth reading twice. The generic shrug got
                // three seconds because there was nothing in it.
                setTimeout(() => setToast(null), 5000)
                // The ask is gone or spent, so take the card down with it rather
                // than leaving a Start that will refuse again.
                if (d.error === 'ask not approved') { setScreenAsk(null); router.refresh() }
              }
            } catch {
              setToast(START_RETRY)
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

        {/* A printable a grown up sent lands right at the top of the to do:
            print it, do it, then send it to be confirmed like any printable. */}
        {assignedPrintable && !assignedSent && (
          <div style={{ background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 18, padding: '14px 16px', marginBottom: 16, boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
            {/* The real product cover, so the child sees exactly what is coming. */}
            <div style={{ position: 'relative', width: '100%', height: 132, borderRadius: 12, overflow: 'hidden', marginBottom: 10, background: 'var(--cream)', border: '1.5px solid var(--border)' }}>
              <Image src={assignedPrintable.previewUrl} alt="" fill sizes="(max-width: 480px) 100vw, 420px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }}>{assignedPrintable.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Your grown up sent you this</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>{assignedPrintable.title}</div>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
              Print it and do it away from the screen. Then show your grown up for {assignedPrintable.stars} stars.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={assignedPrintable.sheetUrl} target="_blank" rel="noopener noreferrer" onClick={() => playKidSound('tap')}
                style={{ flex: 1, textAlign: 'center', background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '12px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxSizing: 'border-box' }}>
                🖨️ Print it
              </a>
              <button onClick={sendAssignedPrintable}
                style={{ flex: 1, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 14, padding: '12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
                I did it ⭐{assignedPrintable.stars}
              </button>
            </div>
          </div>
        )}

        {/* The five a day, first on the screen.
            Justin: "make it 5 steps per day ... once the system knows they sent
            a job, a big celebration animation and 1 streak achieved."
            Above everything, because it IS the day: one card, five one line
            rows, no scrolling. The list below is still the detail for step one,
            which is why Your jobs scrolls to it rather than navigating away. */}
        {/* The run, above everything, including the day that feeds it.
            Justin: "streak count needs to be at very top."

            It used to render three times, once inside each of the Quests,
            Lessons and Printables tabs, so that it stayed visible whichever tab
            a child was on. Above the tabs it is visible on all three by simply
            being there, which is what the three copies were working around. One
            bar, one number, and it now counts completed days rather than only
            the jobs run, so the five a day directly under it is visibly what
            moves it. */}
        <StreakBar completedStreaks={completedStreaks} earnedStages={earnedStages} />

        <div id="kid-five" style={{ scrollMarginTop: 96 }} />
        <KidFiveADay
          token={token}
          childName={childName}
          jobsAllDone={allDone}
          jobsProgress={{ done: doneCount, total: quests.length }}
          newQuestCount={newQuestCount}
          readingMinutes={readingMinutesFor(ageBand)}
          moveJobs={moveJobs}
          initialState={fiveADayInitial}
          onOpenJobs={() => { window.location.assign(`/k/${token}/jobs`) }}
          onDayComplete={n => {
            playKidSound('done')
            const next = bumpDay()
            // The weekly reminder, if it is owed. When it is not, the day still
            // completes and the Friend still arrives: only the reminder is
            // skipped.
            if (streakDueThisWeek) { setStreakWon(n); markStreakWeekSeen() }
            else openArrivalIfEarned(next)
          }}
        />

        {/* Reminders, asked ABOVE the jobs rather than below everything. This
            used to sit at the very bottom of the screen, which is why a child
            could add the app to their Home Screen and never be asked: the offer
            was there and nobody scrolls that far. The job nudges push to the
            child's device and nowhere else, so an unanswered offer here is the
            difference between the feature working and not existing. */}
        {(remindState === 'offer' || remindState === 'ios') && (
          <KidRemindersPrompt
            state={remindState}
            onEnable={() => { playKidSound('tap'); enableReminders() }}
            childName={childName}
          />
        )}

        {/* The ONE Today list is gone from this screen. It repeated the five
            a day's jobs, lesson and move as a second section directly under
            it, which is Justin's row 5: "delete as a separate section, it
            duplicates the five a day". The jobs themselves live on the jobs
            page now (/k/[token]/jobs, the real KidTodayList in its jobs only
            shape), which the five a day's jobs step opens. */}

        {/* The tile grid keeps only what is NOT a to do. Use my time leads,
            full width, carrying the device rule so a child reads it right
            where they would reach for a screen. Then My road, Our deal,
            Make it mine and New job. */}
        {(() => {
          const tiles: { icon?: KidIconName; emoji?: string; iconColor?: string; label: string; sub: string; tint: string; onClick: () => void }[] = [
            // My wins, where My path used to be.
            //
            // Justin: "yes lets lose the pathway as advised for children only
            // NOT parents." The road was a second copy of this screen's five a
            // day, with the same lessons, printables and jobs on it, so a child
            // finished their day in one place and it still looked unfinished in
            // the other. The parent's passport at /dashboard/pathway is
            // untouched: that is the ramp to 16 and it is for the grown up.
            //
            // The slot goes to the thing the road was actually good at, which is
            // showing a child how far they have come.
            { emoji: '🏆', label: 'My wins', sub: 'Streaks and best runs', tint: 'var(--tint-blue, #E4ECF7)', onClick: () => { playKidSound('tap'); setWinsOpen(true) } },
            // The sticker book, on its own. It used to sit at the foot of the
            // wins panel, under four stat tiles and a row of faces, which is
            // the wrong place for the thing a child is collecting. A wins
            // panel is a scoreboard you glance at; a passport is an object you
            // open. The sub line counts anything earned and not yet seen, so a
            // new sticker still pulls them in now the book is behind a tap.
            { emoji: '🛂', label: 'My passport', sub: celebrateStickers.length > 0 ? `${celebrateStickers.length} new sticker${celebrateStickers.length > 1 ? 's' : ''}` : `${stickers.filter(s => s.earned).length} of ${stickers.length} collected`, tint: 'var(--terracotta-lt)', onClick: () => { playKidSound('tap'); setPassportOpen(true) } },
            // The stage lessons, taken by the child themselves: a pass here
            // lights the same tick their grown up sees on the pathway.
            { emoji: '📚', label: 'My lessons', sub: 'Learn it, pass it', tint: 'var(--terracotta-lt)', onClick: () => { playKidSound('tap'); window.location.href = `/k/${token}/lessons` } },
            { icon: 'deal', iconColor: 'var(--terracotta-dark)', label: 'Our deal', sub: 'How it works', tint: 'var(--cream)', onClick: () => { setDealOpen(true); playKidSound('tap') } },
            { emoji: '🎨', label: 'Make it mine', sub: 'Buddy, colour, new Friends', tint: 'var(--terracotta-lt)', onClick: () => { setMakeMineOpen(true); playKidSound('tap') } },
            // Opens the ask page, always, in both states. It used to fire a bare
            // "wants more quests" ping that could not say WHAT the child had in
            // mind, and then flip to "Asked, grown up knows" and do nothing at
            // all, so the one tile a child would press became a dead end.
            {
              icon: 'newjob', iconColor: '#3D739A',
              label: 'Ask for a job',
              sub: pendingAsks > 0 ? `${pendingAsks} waiting on a yes` : 'Pitch your own idea',
              tint: pendingAsks > 0 ? 'var(--tint-sage)' : 'var(--tint-blue, #E4ECF7)',
              onClick: () => { playKidSound('tap'); window.location.assign(`/k/${token}/suggest`) },
            },
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
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.1 }}>
                    Use my time <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)' }}>· {bankBalance * STAR_MINUTES} min ready</span>
                  </span>
                  {/* All jobs done today unlocks the ask: a warm line so the
                      child sees the door open, still an ask, never an auto start. */}
                  {allDone && bankBalance > 0 && (
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: '#2F8F6B', marginTop: '3px' }}>
                      🔓 All your jobs are done, screen time is unlocked
                    </span>
                  )}
                  {/* The device rule, right where the screen would start. */}
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginTop: '3px', lineHeight: 1.45 }}>
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
                    <span style={{ width: 48, height: 48, borderRadius: '14px', background: t.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>
                      {t.icon ? <KidIcon name={t.icon} size={26} color={t.iconColor ?? 'var(--ink)'} /> : t.emoji}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.1 }}>{t.label}</span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '2px' }}>{t.sub}</span>
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
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
                  boxShadow: '0 4px 0 rgba(26,26,46,0.08)',
                }}
              >
                <span aria-hidden>⭐</span> Meet the Planet Friends
              </button>
              {/* Telling a grown up.

                  Full width and on its own rather than a seventh tile in the
                  grid, for two reasons. Seven into a two column grid leaves an
                  orphan, and more to the point this is not the same kind of
                  thing as Make it mine. A child looking for it is usually
                  looking for it at a bad moment, so it does not compete for
                  attention with the playful tiles, it sits under them with room
                  around it.
                  A plain link, not a button with a handler: no sound, and it
                  works if the JavaScript has not arrived. */}
              {token && (
                <a
                  href={`/k/${token}/tell`}
                  style={{
                    width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '18px', padding: '14px 16px',
                    textDecoration: 'none', boxShadow: '0 4px 0 rgba(26,26,46,0.08)',
                  }}
                >
                  <span aria-hidden style={{ width: 44, height: 44, borderRadius: '13px', background: 'var(--terracotta-lt)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>💬</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.1 }}>
                      Telling a grown up
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                      Hard things to say, and what happens after
                    </span>
                  </span>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>›</span>
                </a>
              )}
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
          // Healthy means "you still have time you earned", not "this week's
          // watching is under this week's earning".
          //
          // The old rule compared usedWeekMinutes against weekStars, and it
          // contradicted the number printed directly above it. Justin's screen
          // showed "16 stars, 80 minutes ready to use" and, one line below,
          // "Screen has run a little ahead, do a job to bring your balance
          // back". Both came from the same card.
          //
          // Two reasons it was wrong. The obvious one: a child spends from a
          // BANK, so earning on Monday and spending on Wednesday is using what
          // they earned, not running ahead. The comparison only makes sense if
          // earning and spending have to balance inside one window, which is
          // not what a bank is.
          //
          // The quieter one: the two sides were not even the same week.
          // weekStars is a rolling last seven days, computed on the page, while
          // bank.balance is the star week, Monday to Monday in London. So the
          // ratio could tip purely because the two windows disagreed.
          //
          // balance already has spending taken off it, so it answers the
          // question on its own: minutes left means fine, none left and screen
          // used means do a job. One number, no contradiction possible.
          const healthy = bankBalance > 0 || usedWeekMinutes === 0
          const balanceMsg = streakDays >= 2
            ? `${streakDays} day streak of jobs, amazing! ${healthy ? 'And a lovely balance too.' : 'Do a job or make something to keep your balance healthy.'}`
            : healthy
              ? 'Lovely balance. You have earned more than you have watched.'
              : 'Screen has run a little ahead. Do a job or make something to bring your balance back.'
          return (
        <div id="my-device-time" style={{ scrollMarginTop: '80px', marginBottom: '16px', background: '#fff', borderRadius: '20px', border: '1.5px solid rgba(26,26,46,0.08)', boxShadow: '0 4px 0 rgba(26,26,46,0.08)', overflow: 'hidden' }}>
          <button onClick={() => { setDeviceOpen(o => !o); setPickNow(false); playKidSound('tap') }} aria-expanded={deviceOpen} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: '14px', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><KidIcon name="star" size={28} color="var(--terracotta-dark)" /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>My balance</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.05 }}>
                  {bankBalance} <span style={{ fontSize: 'var(--text-md)' }}>stars</span>
                  {pendingStars > 0 && <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--terracotta-dark)' }}> +{pendingStars}</span>}
                </span>
                <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink-soft)', marginTop: '1px' }}>{bankBalance * STAR_MINUTES} minutes ready to use</span>
              </span>
              {streakDays > 0 && (
                <span style={{ flexShrink: 0, textAlign: 'center', background: 'var(--terracotta-lt)', borderRadius: '14px', padding: '8px 11px' }}>
                  <span style={{ display: 'flex', justifyContent: 'center', lineHeight: 1 }}><KidIcon name="flame" size={20} color="var(--terracotta-dark)" /></span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)' }}>{streakDays}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>day streak</span>
                </span>
              )}
              <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', transform: deviceOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>›</span>
            </div>
            {/* The hero: the balance we celebrate, or the gentle nudge to a job. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: healthy ? 'var(--tint-sage)' : 'var(--terracotta-lt)', borderRadius: '13px', padding: '11px 13px' }}>
              <span style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>{healthy ? '🌱' : '💪'}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.35 }}>{balanceMsg}</span>
            </div>
          </button>
          {deviceOpen && (
            <div id="my-timer" style={{ padding: '0 18px 18px', scrollMarginTop: '72px' }}>
              {/* Driven by the live session, not the one the page happened to
                  load with. Keyed and seeded on a snapshot from page load, this
                  card could not see a block that started or ended anywhere
                  else: a grown up starting time from their side left it sitting
                  idle, and the rest of the screen went on believing a stopped
                  clock was still running. onSessionChange closes the other half
                  of that, telling the screen the instant a block starts or
                  stops rather than leaving it to the next poll. */}
              <DeviceTimeCard
                key={`${liveSession?.id ?? 'idle'}-${pickNow ? 'pick' : 'view'}`}
                startPicking={pickNow}
                token={token} balanceStars={bankBalance} initialSession={liveSession}
                holidayMinutes={holidayMinutes} holidaySpendable={holidaySpendable}
                onSessionChange={setLiveSession}
                familyDevices={familyDevices}
                outstandingJobs={[...new Set(quests.filter(q => !ticks[q.id]).map(q => q.title))]}
                outstandingMinutes={quests.filter(q => !ticks[q.id]).reduce((n, q) => n + q.stars * STAR_MINUTES, 0)}
                usedTodayMinutes={usedTodayMinutes} recommendedMinutes={recommendedMinutes}
                ageBand={ageBand}
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

        {/* Holiday minutes. Sits under the balance rather than inside it, on
            purpose: the balance card is this week's money, and this is savings.
            Putting the two numbers in one card would invite a child to add them
            up and try to spend the lot on a Tuesday in November.

            The server sends null whenever there is nothing to say, so a child
            with an empty bank in term time never meets a card explaining a
            thing that has not happened to them. A holiday running is enough on
            its own, empty bank or not, because that is the moment the whole
            idea is easiest to understand. */}
        {holidayLine && (
          <div style={{ marginBottom: '16px', background: '#fff', borderRadius: '20px', border: '1.5px solid rgba(26,26,46,0.08)', boxShadow: '0 4px 0 rgba(26,26,46,0.08)', padding: '15px 17px', display: 'flex', alignItems: 'flex-start', gap: 13 }}>
            <span aria-hidden style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '13px', background: 'var(--tint-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>🌞</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                {holidaySpendable ? 'Holiday time' : 'Saving up'}
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2, marginTop: '2px' }}>{holidayLine.title}</span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '5px' }}>{holidayLine.body}</span>
              {/* Only while it can actually be spent. In term time the number is
                  the point and the maths is noise; in a holiday it is the
                  opposite, because minutes are what the timer takes. */}
              {holidaySpendable && holidayMinutes > 0 && (
                <span style={{ display: 'inline-block', marginTop: '9px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gold-dark)', background: 'var(--tint-amber)', borderRadius: '9px', padding: '5px 9px' }}>
                  {holidayMinutes} min on top of your stars
                </span>
              )}
            </span>
          </div>
        )}

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
            token={token}
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
            completedStreaks={completedStreaks}
            onPick={saveMine}
          />
        )}

        {winsOpen && (
          <KidWins
            onClose={() => setWinsOpen(false)}
            childName={childName}
            record={winRecord}
          />
        )}

        {passportOpen && (
          <KidPassport
            onClose={() => setPassportOpen(false)}
            token={token}
            childName={childName}
            stickers={stickers}
            celebrateStickers={celebrateStickers}
          />
        )}

        {/* The rocket, the planet, and the Friend filling the screen. Above the
            passport and above the streak takeover, because if a child finishes
            their fifth day and that day is the day Bloop arrives, the arrival is
            the bigger of the two and should be the last thing standing. */}
        {arrival && (
          <KidFriendArrival
            friend={arrival}
            completedStreaks={liveStreaks}
            childName={childName}
            rocketVideo={FRIEND_ARRIVAL_VIDEO}
            onClose={() => setArrival(null)}
            onOpenBook={() => { setArrival(null); setPassportOpen(true) }}
          />
        )}

        {/* Anything earned while they were away, one at a time, oldest first.
            Above everything else on the screen because that is the point of it:
            a Planet Friend joining the family happens about five times in a
            childhood and is allowed to stop the page. */}
        {pendingWins.length > 0 && (
          <KidWinPop
            token={token}
            wins={pendingWins}
            onDone={() => { setPendingWins([]); setWinsOpen(true) }}
          />
        )}

        {/* The presence nudge: been in here a while with no timer running, so
            a warm toast points at a job or the timer. Free to wave away. */}
        {presenceNudge && (
          <div style={{ position: 'fixed', left: '50%', bottom: 'calc(18px + env(safe-area-inset-bottom))', transform: 'translateX(-50%)', zIndex: 125, width: 'min(94vw, 420px)' }}>
            <div style={{ background: 'var(--cream)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.55)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 4px' }}>
                Been in here a while 👀
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
                This app is always free, it never uses your minutes. If it is screen time you are after, start the timer. Or grab a quick job and earn while you are here.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    setPresenceNudge(false); presenceMinsRef.current = 0; playKidSound('tap')
                    try { document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }) } catch { /* no target */ }
                  }}
                  style={{ flex: 1, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 13, padding: '12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', boxShadow: '0 4px 0 var(--terracotta-dark)' }}
                >
                  Do a job ⭐
                </button>
                <button
                  onClick={() => { setPresenceNudge(false); presenceMinsRef.current = 0; playKidSound('tap') }}
                  style={{ background: '#fff', color: 'var(--ink-soft)', border: '1.5px solid var(--border)', borderRadius: 13, padding: '12px 18px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}
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
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: dayComplete ? 'var(--ink)' : 'var(--ink-soft)' }}>
                  {dayComplete ? `Day complete! You hit today's goal 🎉` : `Today's goal`}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: dayComplete ? 'var(--ink)' : 'var(--ink-soft)' }}>
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
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>🎉 Redeemed: {goal.title}</span>
                <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '2px 0 10px' }}>Your grown up knows. Ask them to set a new goal!</span>
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
                  style={{ background: 'var(--retro-green)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}
                >
                  Got it, tick it off ✓
                </button>
              </div>
            )
          }
          return (
            <div style={{ background: ready ? 'var(--terracotta)' : 'var(--cream)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', boxShadow: ready ? '0 5px 0 var(--terracotta-dark)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: ready ? 'var(--ink)' : 'var(--ink-soft)' }}>Saving for: {goal.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: ready ? 'var(--ink)' : 'var(--ink-soft)' }}>
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
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', margin: '0 0 8px', textAlign: 'center' }}>
                      Cash in {goal.stars_needed} stars for {goal.title}?
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={redeemGoal} disabled={goalBusy} style={{ flex: 1, padding: '11px', borderRadius: '13px', border: 'none', cursor: goalBusy ? 'default' : 'pointer', background: 'var(--deep-teal)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', boxShadow: '0 4px 0 rgba(0,0,0,0.22)' }}>{goalBusy ? 'Redeeming…' : 'Yes, redeem it!'}</button>
                      <button onClick={() => setGoalConfirm(false)} disabled={goalBusy} style={{ flexShrink: 0, padding: '11px 16px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: '#fff', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)' }}>Not yet</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setGoalConfirm(true)} style={{ width: '100%', marginTop: '12px', padding: '12px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: '#fff', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', boxShadow: '0 4px 0 rgba(0,0,0,0.18)' }}>
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
        {/* Pinned to the top of the viewport, not sat in the scroll.
            Justin: "if we have these tabs here at top we don't need them
            scrolled down."
            The tabs already existed. They were 1,570 lines into the page, which
            is why SIX different places called scrollIntoView on this element to
            drag a child back up to them. Six workarounds for one placement
            problem, and each one moved the page under a child's thumb to reach a
            control that should never have been out of reach. Sticky removes the
            cause rather than adding a seventh.
            Opaque background, because a translucent strip over moving content is
            unreadable, and a shadow so it reads as floating above the list. */}
        {/* MORE VISIBLE, per the reorder brief: "Make the tabs more
            visible." A solid white bar with a real border and a deeper
            shadow instead of a cream strip that melted into the page, the
            labels a size up in full ink, the icons bigger, the tap targets
            taller. Same three tabs, same sticky behaviour. */}
        <div
          id="kid-tabs"
          style={{
            position: 'sticky', top: 0, zIndex: 30,
            display: 'flex', gap: '4px', background: '#fff',
            border: '2px solid rgba(26,26,46,0.16)', borderRadius: '18px',
            padding: '5px', marginBottom: '16px', scrollMarginTop: '12px',
            boxShadow: '0 5px 0 rgba(26,26,46,0.12), 0 10px 24px rgba(26,26,46,0.16)',
          }}
        >
          {([['quests', 'Quests', 'star', 0], ['lessons', 'Lessons', 'lessons', totalNewLessons], ['print', 'Printables', 'printables', newPrint]] as const).map(([key, label, icon, dot]) => {
            const on = tab === key
            return (
              <button
                key={key}
                onClick={() => { setTab(key); setActiveLesson(null); playKidSound('tap'); goToTab(key) }}
                style={{
                  position: 'relative',
                  flex: 1, padding: '12px 4px', borderRadius: '14px', cursor: 'pointer', border: 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                  background: on ? 'var(--terracotta)' : 'transparent',
                  color: 'var(--ink)',
                  boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  transition: 'background 0.15s',
                }}
              >
                <KidIcon name={icon as KidIconName} size={24} color={on ? 'var(--ink)' : 'var(--ink-soft)'} />
                {label}
                {dot > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '-2px', minWidth: 20, height: 20, padding: '0 5px',
                    borderRadius: '100px', background: '#E5484D', color: '#fff',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, lineHeight: '20px',
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
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                boxShadow: askedMore ? 'none' : '0 4px 0 var(--terracotta-dark)',
              }}
            >
              {askedMore ? 'Asked ✓ watch this space' : 'Ask for more quests ⭐'}
            </button>
          </div>
        )}

        {/* Leads to the ask page rather than holding the whole flow here. The
            ideas grid, the free text box and the list of what happened next all
            used to live inline at this point, two thirds of the way down the
            longest screen in the product, which is a fine place for a child who
            has already scrolled and no place at all for one looking for it. One
            implementation, on its own page, reached from here and from the tile. */}
        <button
          onClick={() => { playKidSound('tap'); window.location.assign(`/k/${token}/suggest`) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '13px', width: '100%', textAlign: 'left', cursor: 'pointer',
            marginTop: '18px', background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)',
            borderRadius: '20px', padding: '16px 18px', boxShadow: '0 4px 0 rgba(26,26,46,0.08)',
          }}
        >
          <span style={{ fontSize: 'var(--text-2xl)', flexShrink: 0 }}>💡</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>
              Got a quest idea?
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
              {pendingAsks > 0
                ? `${pendingAsks === 1 ? 'One idea is' : `${pendingAsks} ideas are`} waiting on your grown up. Tap to see.`
                : 'Pitch your own and earn stars for it.'}
            </span>
          </span>
          <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>›</span>
        </button>

        {/* Quests waiting on other days, so done today never reads as done forever */}
        {laterQuests.length > 0 && (
          <div style={{ marginTop: '22px', background: 'var(--cream)', borderRadius: '16px', padding: '14px 18px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px' }}>
              Coming up, not today
            </p>
            {laterQuests.map((q, i) => (
              <p key={i} style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', margin: '0 0 4px', lineHeight: 1.5 }}>
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
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
                  {activeLesson.emoji} {activeLesson.title}
                </span>
                <button
                  onClick={() => setActiveLesson(null)}
                  aria-label="Close lesson"
                  style={{ background: 'var(--cream)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: 'var(--text-md)', cursor: 'pointer', color: 'var(--ink-soft)' }}
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
                  <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.6, minHeight: '110px', margin: '0 0 18px', fontWeight: 500 }}>
                    {activeLesson.cards[lessonCard]}
                  </p>
                  <button
                    onClick={() => setLessonCard(c => c + 1)}
                    style={{
                      width: '100%', padding: '15px', background: 'var(--terracotta)', color: 'var(--ink)',
                      border: 'none', borderRadius: '14px', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
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
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>
                      Question {qIndex + 1} of {activeLesson.questions.length} · 100% earns the bonus ⭐
                    </p>
                    <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 14px' }}>
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
                              fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.45,
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
                        <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, margin: '0 0 14px', fontWeight: 700, color: 'var(--ink)' }}>
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
                            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
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
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
                      {correct} out of {activeLesson.questions.length}!
                    </p>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
                      {perfect
                        ? `Perfect score! That earns the bonus star: ${stars} stars = ${stars * STAR_MINUTES} minutes of TV time once your grown up approves.`
                        : `You earned ${stars} stars = ${stars * STAR_MINUTES} minutes of screen time. A perfect score on the next lesson earns the bonus star!`}
                    </p>
                    <button
                      onClick={() => finishLesson(activeLesson, qAnswers)}
                      style={{
                        width: '100%', padding: '15px', background: 'var(--terracotta)', color: 'var(--ink)',
                        border: 'none', borderRadius: '14px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
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
              {/* The next Friend rides along here too, so the one they are
                  working toward keeps showing up across the app rather than
                  living on a single tab. Hidden while a lesson is open, so it
                  never competes with the thing they are actually doing. */}
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
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                        background: on ? 'var(--terracotta)' : 'transparent',
                        color: on ? 'var(--ink)' : 'var(--ink-soft)',
                        boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
                        transition: 'background 0.15s',
                      }}>
                        <KidIcon name={subIcon} size={19} color={on ? 'var(--ink)' : 'var(--ink-soft)'} />
                        {t.label}
                        {t.dot > 0 && (
                          <span style={{ position: 'absolute', top: '-5px', right: '-2px', minWidth: 18, height: 18, padding: '0 4px', borderRadius: '100px', background: '#E5484D', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, lineHeight: '18px', textAlign: 'center', boxShadow: '0 0 0 2px var(--cream)' }}>{t.dot}</span>
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

              {/* This week at school: one calm card a week, never a feed.
                  The same objective the grown up sees on their Home, worded
                  for the child, paying stars through the normal approve
                  loop. Absent entirely in the school holidays. */}
              {activeLessonTab === 'learn' && weekMission && (
                <>
                  <SectionHead kidIcon="star">From school this week</SectionHead>
                  <button
                    onClick={recordSchoolWeek}
                    disabled={weekState !== 'open'}
                    style={bigCardShell(weekState !== 'open')}
                  >
                    <CardFace
                      seed="school-week"
                      done={weekState === 'done'}
                      emoji={weekState === 'done' ? '🏆' : '📘'}
                      title={weekMission.line}
                      subtitle={
                        weekState === 'done' ? 'Approved! Stars landed ⭐'
                        : weekState === 'pending' ? 'Waiting for your grown up to tick it ⭐'
                        : weekMission.second
                          ? `Your class is also on: ${weekMission.second}. Practised the big one? Tap here!`
                          : 'Practised it at home? Tap here and your grown up gets the tick!'
                      }
                      pill="⭐ 3"
                      actionIcon={weekState === 'open' ? '✓' : ''}
                    />
                  </button>
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
              <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5, margin: '6px 0 0' }}>
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
            {/* The next Friend rides along on this screen too, so the one they
                are working toward keeps showing up rather than living on one
                tab. Seeing who is close is what keeps the streak going. */}

            {/* Their own off screen tally. The grown up's stats already count
                every confirmed sheet into the off screen total, and this is the
                same number said back to the child, in the place they earned it,
                so the work away from a screen is visible on both sides. */}
            {sheetsDone > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'var(--tint-sage)', border: '1.5px solid #CFE3D9', borderRadius: 16, padding: '12px 14px', marginBottom: 12 }}>
                <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0 }}>🖍️</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
                    {sheetsDone} {sheetsDone === 1 ? 'sheet' : 'sheets'} done away from a screen
                  </div>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
                    That is {sheetStars} {sheetStars === 1 ? 'star' : 'stars'} earned with a pencil, not a screen.
                  </div>
                </div>
              </div>
            )}
            <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 'var(--text-md)', lineHeight: 1.5, margin: '0 0 14px' }}>
              Colour a sheet away from the screen, then show your grown up for stars.
            </p>
            {stagePrintables.length === 0 ? (
              <HappyScene headline="More printables soon" sub="New colouring sheets land here. Check back soon!" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Sections, so the whole library is not one long scroll. The
                    groups are the kinds the registry already carries, so nothing
                    here invents a second way of sorting the same sheets. Only
                    kinds that actually have a sheet for this age show up. */}
                {(() => {
                  const KINDS: { key: string; label: string; emoji: string }[] = [
                    { key: 'all', label: 'All', emoji: '📚' },
                    { key: 'craft', label: 'Colour', emoji: '🎨' },
                    { key: 'bucket', label: 'Lists', emoji: '📋' },
                    { key: 'brain', label: 'Learn', emoji: '🧠' },
                    { key: 'challenge', label: 'Dares', emoji: '🏆' },
                    { key: 'hunt', label: 'Hunts', emoji: '🔍' },
                  ]
                  const live = KINDS.filter(k => k.key === 'all' || stagePrintables.some(p => p.kind === k.key))
                  if (live.length <= 2) return null
                  return (
                    <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '2px', marginBottom: '2px' }}>
                      {live.map(k => {
                        const on = k.key === printKind
                        return (
                          <button
                            key={k.key}
                            onClick={() => { setPrintKind(k.key); playKidSound('tap') }}
                            style={{
                              flexShrink: 0, padding: '9px 14px', borderRadius: '13px', cursor: 'pointer',
                              border: on ? 'none' : '1.5px solid rgba(26,26,46,0.12)',
                              background: on ? 'var(--terracotta)' : 'var(--cream)',
                              color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                              boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
                            }}
                          >
                            <span aria-hidden>{k.emoji}</span>{k.label}
                          </button>
                        )
                      })}
                    </div>
                  )
                })()}
                {/* Anything a grown up has already said yes to comes first. A
                    yes buried eight cards down is a yes the child never acts
                    on, and this tab is long. */}
                {[...stagePrintables].filter(p => printKind === 'all' || p.kind === printKind).sort((a, b) => {
                  const yes = (x: typeof a) => asks.find(k => k.title === `Please can I do the ${x.title} printable`)?.status === 'added' ? 0 : 1
                  return yes(a) - yes(b)
                }).map(p => {
                  const finishedTitle = `Finished the ${p.title} sheet`
                  const printTitle = `Print the ${p.title} sheet`
                  const wantTitle = `Please can I do the ${p.title} printable`
                  const finished = asks.some(a => a.title === finishedTitle)
                  // The ask and, crucially, its ANSWER. Reading only that an ask
                  // exists meant a child who had been told yes saw exactly the
                  // same card as a child still waiting, so the yes only ever
                  // arrived as a notification they might never have seen.
                  const ask = asks.find(a => a.title === wantTitle)
                  const requested = !!ask
                  const saidYes = ask?.status === 'added'
                  const saidNo = ask?.status === 'declined'
                  return (
                    <div key={p.key} style={{ ...bigCardShell(false), padding: '11px 13px 13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '11px' }}>
                        <div style={{ position: 'relative', width: 76, height: 76, borderRadius: '15px', flexShrink: 0, overflow: 'hidden', background: '#EFE9DD' }}>
                          <Image src={p.previewUrl} alt="" fill sizes="76px" style={{ objectFit: 'cover' }} />
                          <span style={{ position: 'absolute', bottom: '5px', left: '5px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '2px 7px' }}>
                            ⭐ {p.stars}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.22 }}>
                            {p.emoji} {p.title}
                          </div>
                          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.35, marginTop: '2px' }}>
                            Colour the whole page for {p.stars} stars
                          </div>
                        </div>
                      </div>

                      {/* Either the family is unlocked, or this sheet is one of
                          the free ones, or a grown up said yes to THIS sheet. A
                          yes is permission for the sheet it was given for, so it
                          has to open the same door: saying yes and then leaving
                          the child with nothing to tap is worse than never
                          having asked. */}
                      {(printablesUnlocked || p.free || saidYes) ? (
                        <>
                          {saidYes && !printablesUnlocked && !p.free && (
                            <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--retro-green-dark, var(--deep-teal))', textAlign: 'center', margin: '0 0 8px', lineHeight: 1.4 }}>
                              Your grown up said yes to this one ⭐
                            </p>
                          )}
                          <button
                            onClick={() => { if (p.pdfColourIn) { playKidSound('tap'); window.open(p.pdfColourIn, '_blank') } else { printSheet(p.sheetUrl, p.title) } }}
                            style={{
                              width: '100%', padding: '12px', borderRadius: '13px', border: 'none',
                              cursor: 'pointer', marginBottom: '7px',
                              background: 'var(--terracotta)', color: 'var(--ink)',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
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
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
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
                              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)',
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
                              // A no is quiet, still waiting is the calm sage it
                              // always was. A yes never lands here now, it opens
                              // the print actions above instead.
                              background: requested ? 'var(--tint-sage)' : 'var(--deep-teal)',
                              color: requested ? 'var(--ink)' : '#fff',
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                              boxShadow: requested ? 'none' : '0 4px 0 rgba(0,0,0,0.22)',
                            }}
                          >
                            {saidNo ? 'Not this one for now' : requested ? 'Asked your grown up ✓' : 'Ask a grown up for this one ⭐'}
                          </button>
                          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.4 }}>
                            {saidNo
                              ? 'Maybe another time. Plenty more to colour.'
                              : 'Your grown up can set up printables for you.'}
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

        {/* The offer and the iOS how to both moved to the top of the screen, in
            KidRemindersPrompt. Only the quiet confirmation stays down here,
            because it is reassurance rather than something to act on. */}
        {remindState === 'on' && (
          <p style={{ textAlign: 'center', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', marginTop: '18px' }}>
            🔔 Reminders on. Morning and after school nudges, never at bedtime.
          </p>
        )}

        <button
          onClick={() => { setShowWelcome(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{
            display: 'block', margin: '24px auto 0', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 'var(--text-md)', fontWeight: 600,
            color: 'var(--ink-muted)', textDecoration: 'underline', fontFamily: 'var(--font-body)',
          }}
        >
          How does this page work?
        </button>

        {/* Always here, never dismissed. The welcome shows once and is gone for
            good, so it cannot be the only place a child is told what their
            grown up can see. */}
        <KidPrivacyNote />

        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', color: 'var(--ink-light)', marginTop: '14px' }}>
          GUIDED CHILDHOOD QUESTS
        </p>
      </div>

      {/* All five done. Fires once on the transition, never on a refresh of an
          already finished day, because the API only reports justCompleted when
          completed_at was previously null. */}
      {streakWon !== null && (
        <KidStreakTakeover
          streak={streakWon}
          completedStreaks={liveStreaks}
          childName={childName}
          onClose={() => {
            setStreakWon(null)
            // If today was the day, the rocket goes up the moment they close
            // the streak screen. Two takeovers back to back is the right order
            // rather than one too many: the streak is what they did, the Friend
            // is what it bought, and the second one is the rarer of the two.
            openArrivalIfEarned(liveStreaks)
          }}
        />
      )}
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
function FamilyDeal({ onClose, recommendedMinutes, goal, bankBalance, goalRedeemed, agreementItems = [], agreementSigned = false, contractRule, contractAgreedAt = null, token }: {
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
  // The child's own link, so the fridge print is one tap from here.
  token?: string
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            <KidIcon name="deal" size={24} color="var(--terracotta-dark)" /> Our family deal
          </span>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '13px', alignItems: 'center', background: '#fff', borderRadius: '16px', padding: '13px 15px' }}>
              <span style={{ width: 42, height: 42, borderRadius: '12px', background: r.tint, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><KidIcon name={r.icon} size={23} color={r.iconColor} /></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{r.title}</div>
                <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>{r.body}</div>
              </div>
            </div>
          ))}
        </div>
        {/* The timer rule the child agreed on their first run: locked in, read
            only, with the date it was agreed together. Both sides see the
            same rule, and the child never edits it from here. */}
        {contractRule && (
          <div style={{ marginTop: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
              My timer rule
            </div>
            <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '14px', padding: '13px 15px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45, margin: 0 }}>
                {contractRule}
              </p>
              {contractAgreedAt && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', margin: '8px 0 0' }}>
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
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
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
                      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{it.title}</span>
                      <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: 'var(--ink-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
                    </button>
                    {open && (
                      <div style={{ padding: '0 15px 14px 59px', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                        {it.body}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {agreementSigned && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--retro-green-dark, var(--deep-teal))', margin: '10px 2px 0', textAlign: 'center' }}>
                ✓ You and your grown up agreed this together
              </p>
            )}
          </div>
        )}

        {/* The deal on the fridge, printed from the child's own side. They
            should not have to ask a grown up to log in to get it on the wall. */}
        {token && (
          <a
            href={`/k/${token}/deal`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: '14px', background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: '15px', padding: '13px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)' }}
          >
            🖨️ Print it for the fridge
          </a>
        )}

        <button onClick={onClose} style={{ width: '100%', marginTop: '10px', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '15px', padding: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          Got it!
        </button>
      </div>
    </div>
  )
}

// Make it mine: the child picks their buddy and their colour. Their choice, not
// an assumption about them. Saves instantly and the whole app takes the accent.
function MakeItMine({ onClose, chosenBuddy, chosenAccent, earnedStages = 0, completedStreaks = 0, onPick }: {
  onClose: () => void
  chosenBuddy: string
  chosenAccent: string
  earnedStages?: number
  completedStreaks?: number
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            <KidIcon name="star" size={22} color="var(--terracotta-dark)" /> Make it mine
          </span>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>Pick your buddy</div>
        {/* How a child gets a new Friend, said plainly right where they ask it.
            A padlock on its own only raises the question, so the answer sits
            above the row and the streak bar underneath shows exactly how close
            the next Friend is. */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 10px' }}>
          DiGi is always yours. You earn a new Planet Friend every time you keep your jobs going, so the locked ones join you as you go.
        </p>
        <div style={{ display: 'flex', gap: '9px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {Object.entries(BUDDY_MAP).map(([id, b]) => {
            const locked = typeof b.stageId === 'number' && b.stageId > earnedStages
            const on = chosenBuddy === id
            return (
              <button
                key={id}
                onClick={() => { if (!locked) onPick({ buddy: id }) }}
                aria-pressed={on}
                aria-disabled={locked}
                aria-label={locked ? `${b.name}, not earned yet` : b.name}
                style={{ flex: '1 0 26%', minWidth: 72, cursor: locked ? 'not-allowed' : 'pointer', background: '#fff', border: on ? '3px solid var(--ink)' : '2px solid transparent', borderRadius: '16px', padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: locked ? 0.7 : 1, position: 'relative' }}
              >
                <span style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: '#FFF7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: locked ? 'grayscale(1)' : 'none' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {id === 'digi'
                    ? <img src={b.img} alt="" style={{ width: 40, height: 40 }} />
                    : <img src={b.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                  {locked ? `🔒 ${b.name}` : b.name}
                </span>
                {/* The visible unlock line: a tooltip never shows on a phone, so
                    the one who needs it most could not read it. Each locked
                    Friend says exactly what IT costs, not a vague keep going, so
                    a child can see that Pebble is close and Cosmo is a way off. */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: locked ? 'var(--terracotta-dark)' : '#2F8F6B', textAlign: 'center', lineHeight: 1.2 }}>
                  {locked
                    ? (() => {
                        const away = streaksToUnlockFriend(b.stageId ?? 0, completedStreaks)
                        return away === 1 ? '1 streak away' : `${away} streaks away`
                      })()
                    : id === 'digi' ? 'Always yours' : 'Yours ✓'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Exactly how close the next Friend is, in the child's own numbers.
            This copy stays. The three inside the tabs went to a single bar above
            them, which covers every tab by sitting over all of them, but this is
            a modal drawn on top of the screen and nothing behind it shows
            through. It is also the one place the bar is most earned: a child
            reading what each locked Friend costs is exactly who wants to know
            how close the next one is. */}
        <div style={{ marginBottom: '18px' }}>
          <StreakBar completedStreaks={completedStreaks} earnedStages={earnedStages} />
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>Pick your background</div>
        {/* The colour bar: each swatch is the real background it sets, so the
            child picks the whole screen, not a ring. A live preview strip sits
            above it so the change is obvious before they even close. */}
        <div style={{ height: 54, borderRadius: '14px', background: preview.bg, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(26,26,46,0.12)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: preview.ink }}>My app</span>
        </div>
        <div style={{ display: 'flex', gap: '9px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {PICKER_ACCENTS.map(id => {
            const a = resolveTheme(id)
            const on = chosenAccent === id
            return (
              <button key={id} onClick={() => onPick({ accent: id })} aria-label={a.name} aria-pressed={on} style={{ flexShrink: 0, cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 50, height: 50, borderRadius: '14px', background: a.bg, boxShadow: on ? '0 0 0 3px #fff, 0 0 0 6px var(--ink)' : 'inset 0 0 0 1.5px rgba(26,26,46,0.12)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: on ? 'var(--ink)' : 'var(--ink-soft)' }}>{a.name}</span>
              </button>
            )
          })}
        </div>

        {/* Mix your own: slide to any colour and it becomes a soft wash the
            same gentle way as the set ones. The knob wears the colour it will
            set, and the swatch to the right sits in the same language as the six
            pastels, so the mixed one reads as one more choice, not a gadget. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Or mix your own</span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <span aria-hidden style={{ width: 46, height: 46, borderRadius: '14px', background: resolveTheme(`h${hue}`).bg, boxShadow: isCustom ? '0 0 0 3px var(--cream), 0 0 0 6px var(--ink)' : 'inset 0 0 0 1.5px rgba(26,26,46,0.12)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: isCustom ? 'var(--ink)' : 'var(--ink-soft)' }}>Mine</span>
          </span>
        </div>
        <input
          className="mine-hue"
          type="range" min={0} max={360} value={hue} aria-label="Mix your own colour"
          onChange={e => { const h = Number(e.target.value); setHue(h); onPick({ accent: `h${h}` }) }}
          style={{ ['--thumb' as unknown as string]: resolveTheme(`h${hue}`).hex, width: '100%', marginBottom: '4px' }}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-light)', textAlign: 'center', marginBottom: '18px' }}>
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

        <button onClick={onClose} style={{ width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '15px', padding: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
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
            <span style={{ fontSize: 'var(--text-xl)', lineHeight: 1 }}>💛</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              A note for you
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 14px' }}>
            {n.body}
          </p>
          <button
            onClick={() => gotIt(n.id)}
            style={{
              width: '100%', padding: '12px', borderRadius: '14px', border: 'none', cursor: 'pointer',
              background: 'var(--terracotta)', color: 'var(--ink)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
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

// Exported so ref-kid-week can render it. Neither of its two shapes is
// reachable by clicking: one needs a school reminder due today on a real kid
// link, the other needs a week with something on it and nothing today.
export function KidSchoolBanner({ items, token, weekCount }: { items: KidSchoolToday[]; token: string; weekCount: number }) {
  // null until mounted, so the first client render matches the server and the
  // red only arrives once the clock is ticking on the child's own device.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    if (!items.some(i => i.time)) return
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [items])

  // Nothing today or tomorrow. Still a door, never null: since the reorder
  // made the diary the first thing on the page and the child can add their
  // own entries, an absent block would hide the way in on exactly the quiet
  // day a child has something to put on it. A slim door rather than a card
  // announcing an absence, and when the whole diary is empty the door says
  // what adding is for.
  //
  // Justin, 8 August 2026: "we could build same viewer on child's phone so
  // they can see their week." The week is the answer to "is Cubs Thursday or
  // Friday", which is asked on a day when nothing is due, so the way in
  // cannot depend on something being due.
  if (!items.length) {
    return (
      <a
        href={`/k/${token}/week`}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
          background: '#fff', border: '2px solid var(--border)', borderRadius: 18,
          boxShadow: '0 4px 0 var(--border)', padding: '12px 14px', marginBottom: 16,
        }}
      >
        <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1 }}>🗓️</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            My school diary
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-muted)', marginTop: 1 }}>
            {weekCount === 0 ? 'Nothing on it yet. Add PE kit, clubs and homework' : 'Nothing due today. See the week, add your own'}
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)' }}>→</span>
      </a>
    )
  }

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
      <span style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>{SCHOOL_KIND_EMOJI[i.kind] ?? '📌'}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
        {i.title}
      </span>
      {i.time && (
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: anyUrgent ? '#B93B3F' : 'var(--terracotta-dark)', marginBottom: '9px' }}>
            {anyUrgent ? '🔴 Don’t forget, it is nearly time' : '🏫 From school today'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayItems.map(i => row(i, urgentOf(i.time)))}
          </div>
        </>
      )}

      {tomorrowItems.length > 0 && (
        <div style={{ marginTop: todayItems.length > 0 ? '12px' : 0, paddingTop: todayItems.length > 0 ? '12px' : 0, borderTop: todayItems.length > 0 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '9px' }}>
            🎒 Tomorrow, get it ready tonight
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tomorrowItems.map(i => row(i, false))}
          </div>
        </div>
      )}

      {/* And the rest of the week, one tap away. Under the two days that
          actually matter, never above them: today is the thing a child needs
          and the week is the thing they occasionally want. */}
      <a
        href={`/k/${token}/week`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: '12px',
          textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)',
        }}
      >
        See my school diary →
      </a>
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
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '12px' }}>
        {headline}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
        {data.map((d, i) => {
          const active = d.count > 0
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)',
                background: active ? 'var(--terracotta)' : 'var(--cream)',
                border: active ? 'none' : '2px dashed var(--ink-light)',
                boxShadow: d.today ? '0 0 0 3px var(--terracotta-lt)' : 'none',
                color: '#fff', fontWeight: 800,
              }}>
                {active ? '⭐' : ''}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: d.today ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>{d.label}</span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: '13px', textAlign: 'center', background: 'var(--tint-sage)', borderRadius: '11px', padding: '10px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
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
        : <span style={{ fontSize: 'var(--text-lg)', lineHeight: 1 }}>{icon}</span>}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
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
          <span style={{ fontSize: 'var(--text-3xl)', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.18))' }}>{emoji}</span>
        )}
        {pill && (
          <span style={{ position: 'absolute', bottom: '5px', left: '5px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.9)', borderRadius: '100px', padding: '2px 7px' }}>
            {pill}
          </span>
        )}
        {isNew && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: '#fff', background: 'var(--coral, #D4600A)', borderRadius: '100px', padding: '2px 6px', letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            New
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {done && (
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px', marginBottom: '4px' }}>
            ✓ Done
          </span>
        )}
        <span style={{
          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.22,
        }}>
          {title}
        </span>
        <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-muted)', marginTop: '2px', lineHeight: 1.35 }}>
          {subtitle}
        </span>
      </div>
      <span style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? 'var(--terracotta)' : 'var(--cream)',
        border: done ? 'none' : '2.5px dashed var(--ink-light)',
        fontSize: 'var(--text-lg)',
      }}>
        {done ? '✓' : actionIcon}
      </span>
    </div>
  )
}
