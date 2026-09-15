'use client'

import { useRouter } from 'next/navigation'
import KidTabBar, { type KidTab, type TodayTab } from './KidTabBar'
import { playKidSound } from '@/lib/sound/kidSounds'

// The three tabs, on a child screen that is not the home screen.
//
// Justin, 15 September 2026: "are you also building the tabs at bottom working
// for each page". The bar shipped that morning on the home screen and nowhere
// else, so a child on Jobs could go BACK (every screen has a back link) but
// never ACROSS: reaching Printables meant going home first and finding the tab.
//
// ── WHY THIS IS A WRAPPER AND NOT A LINE IN A LAYOUT ────────────────────────
//
// app/k/[token]/layout.tsx wraps every child route, which makes it the obvious
// place to mount a bar, and it is the wrong place. It cannot know which tab is
// current, and it cannot know whether the screen underneath is one a child is
// allowed to wander off. Half the child's screens are a lesson player, a quiz
// or a diary entry being typed, where a permanent row of tabs invites a child
// to leave a task with their answers half finished.
//
// So screens OPT IN. A screen that should not have tabs cannot acquire them by
// being added to a folder, which is the failure mode a layout would have.
//
// ── THE ZOOM, WHICH HAS BITTEN THREE TIMES NOW ──────────────────────────────
//
// shared/tokens.css zooms `body` by 1.07. On an iPhone, Safari positions a
// FIXED element inside a zoomed ancestor against the UNZOOMED viewport while
// laying it out in zoomed coordinates, so it creeps up the screen the further
// you scroll. It happened to the parent's bar twice in one morning
// (.bottom-tab-bar in app/globals.css) and to this bar before it was portalled.
//
// KidTabBar portals itself to document.body, so the cure is to leave body with
// no zoom while a screen with a bar is mounted, and zoom that screen instead.
// KidQuestScreen already does exactly this for the home screen; this is the
// same three lines, in the one place every other screen can share, rather than
// pasted into each of them.
//
// ── WHAT THIS DELIBERATELY DOES NOT DO ─────────────────────────────────────
//
// No badges. The red counts on Lessons and Printables are worked out inside
// KidQuestScreen by diffing the adventures, missions and printables lists
// against seen state held on the device. None of that exists on these routes,
// so the honest options were a real count (new reads on every screen) or none.
//
// It ships with none, because a badge that is merely stale is worse than no
// badge: it teaches a child the red numbers mean nothing. That is the exact bug
// fixed on the parent's Quests tab the same morning (scripts/check-badge-truth.mjs).
//
// The Today entry IS rendered, and it is the reason this is safe to put on the
// five screens that carried KidTodayReturn. That pill was a second fixed thing
// at the same zIndex as this bar, anchored to the same corner, and Justin
// photographed it sitting on top of a lesson title. The bar's own Today entry
// says the same thing in the same place and is anchored properly, so the pill
// goes rather than the two of them fighting over the floor.
//
// Its counts are cheap in a way the badges are not: readTodayState is two
// queries the screen can make on the server and it fails soft to an empty day.
//
// ── THE TAB IS CARRIED IN THE URL, WHICH ALREADY WORKED ────────────────────
//
// KidQuestScreen has read `?tab=` since the printables step was wired:
//
//   const [tab, setTab] = useState(() => {
//     const t = new URLSearchParams(window.location.search).get('tab')
//     return t === 'print' || t === 'lessons' ? t : 'quests'
//   })
//
// So a tab here is a plain navigation home carrying the tab to open. Nothing
// new had to be invented for it, and nothing on the home screen changes.
export default function KidScreenChrome({ token, current, today = null, children }: {
  token: string
  /** Which tab this screen belongs under, lit in the bar. */
  current: KidTab
  /**
   * What is left of the day, for the bar's Today entry. Null leaves the bar as
   * three tabs, which is right for a screen that cannot cheaply know the day.
   */
  today?: TodayTab | null
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="gc-kid-screen">
      {/* The zoom comes off body while a screen with a fixed bar is mounted,
          and this screen zooms itself instead, so the page looks exactly as it
          did while the bar has no zoomed ancestor to drift against. */}
      <style>{`
        body { zoom: 1; }
        .gc-kid-screen { zoom: 1.07; }
        [data-kid-tabs-fixed] .kid-tab-label { font-size: 0.78rem; }
      `}</style>

      {children}

      <KidTabBar
        current={current}
        onSelect={key => {
          playKidSound('tap')
          // Quests is the home screen's own default, so it needs no parameter:
          // a bare link keeps the URL a child might share or bookmark clean.
          router.push(key === 'quests' ? `/k/${token}` : `/k/${token}?tab=${key}`)
        }}
        badges={{ lessons: 0, print: 0 }}
        today={today}
        onToday={() => {
          playKidSound('tap')
          // Straight to the five a day itself, which is where the home screen's
          // own Today entry goes, rather than the top of the home screen.
          router.push(`/k/${token}#kid-five`)
        }}
      />
    </div>
  )
}
