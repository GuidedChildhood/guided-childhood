'use client'

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import KidHomeTiles, { type HomeTile } from '@/components/kid/KidHomeTiles'
import KidTabBar from '@/components/kid/KidTabBar'
import KidWeekMasthead from '@/components/kid/KidWeekMasthead'
import { resolveTheme, DEFAULT_ACCENT } from '@/lib/kid/theme'
import { Ribbon } from '@/components/kid/HappyNewsBits'
import KidAskBanner from '@/components/kid/KidAskBanner'
import StreakBar from '@/components/kid/StreakBar'
import { CRAYON } from '@/components/printables/drawn/HappyPaper'
import { TIMER_RULE } from '@/lib/quests/device-time'

// Dev only fixture: the child's home grid in the happy news finish, both
// states (nothing ready, time ready and unlocked). Never in production.

const noop = () => {}
const tiles: HomeTile[] = [
  { icon: 'wins', label: 'My wins', sub: 'Streaks and best runs', tint: CRAYON.sky, onClick: noop },
  { icon: 'passport', label: 'My passport', sub: '3 of 21 collected', tint: CRAYON.butter, onClick: noop },
  { icon: 'lessons', label: 'My lessons', sub: 'Learn it, pass it', tint: CRAYON.paper, onClick: noop },
  { icon: 'games', label: 'Games', sub: 'Play and learn', tint: CRAYON.sky, onClick: noop },
  { icon: 'friends', label: 'My planet', sub: 'Your Planet Friends', tint: CRAYON.green, onClick: noop },
  { icon: 'deal', label: 'Our deal', sub: 'How it works', tint: CRAYON.paper, onClick: noop },
  { icon: 'make', label: 'Make it mine', sub: 'Buddy, colour, new Friends', tint: CRAYON.green, onClick: noop },
  { icon: 'ask', label: 'Ask for a job', sub: 'Pitch your own idea', tint: CRAYON.butter, onClick: noop },
  { icon: 'print', label: 'Printables', sub: 'Colour and do', tint: CRAYON.coral, onClick: noop },
]

export default function KidHomeFixture() {
  // Read on the client after mount, the way the other fixtures do, so the
  // page still prerenders (useSearchParams would want a Suspense boundary).
  const [sp, setSp] = useState<{ today: string | null }>({ today: null })
  useEffect(() => { setSp({ today: new URLSearchParams(window.location.search).get('today') }) }, [])
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div style={{ minHeight: '100dvh', background: resolveTheme(DEFAULT_ACCENT).bg, padding: '16px 16px 40px' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        {/* The home masthead (14 September 2026): the week page's masthead
            with the greeting as its kicker and the sound switch in the corner. */}
        <KidWeekMasthead
          kicker="Good afternoon"
          title="Go Jonny!"
          sub="2 of your five to go."
          friend={{ name: 'Bloop', img: '/digi-squad/friends/bloop.png' }}
          corner={<button aria-label="Turn sounds off" style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 2px 0 var(--ink)', fontSize: 'var(--text-base)', lineHeight: 1 }}>🔊</button>}
        />
        {/* ?today=done|going|fresh: the Today entry's three states (14 September 2026). */}
        <KidTabBar current="quests" onSelect={noop} badges={{ lessons: 2, print: 0 }} onToday={noop}
          today={sp.today === 'done' ? { left: 0, total: 5, complete: true, opened: true } : sp.today === 'fresh' ? { left: 0, total: 0, complete: false, opened: false } : { left: 3, total: 5, complete: false, opened: true }} />
        <KidAskBanner ask={{ id: 'a', device: 'tv', minutes: 10, status: 'pending' }} blockingJobs={[]} nudges={[{ id: 'n', message: 'Nearly there. One more job and the TV is yours.' }]} hasSession={false} startBusy={false} onStart={noop} onDismissDeclined={noop} onDismissNudge={noop} />
        <KidAskBanner ask={{ id: 'b', device: 'tv', minutes: 30, status: 'approved' }} blockingJobs={[]} outstandingJobs={['Tidy my room']} nudges={[]} hasSession={false} startBusy={false} onStart={noop} onDismissDeclined={noop} onDismissNudge={noop} />
        <StreakBar completedStreaks={1} earnedStages={0} />
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', padding: '16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}><Ribbon>Your five for today</Ribbon><Ribbon tone="green">Today is done! 🎉</Ribbon></div>
        <KidHomeTiles minutesReady={0} unlocked={false} rule={TIMER_RULE} onUseTime={noop} tiles={tiles} onFriends={noop} tellHref="#" />
        <div style={{ height: 24 }} />
        <KidHomeTiles minutesReady={30} unlocked rule={TIMER_RULE} onUseTime={noop} tiles={tiles.slice(0, 4)} onFriends={noop} tellHref={null} />
      </div>
    </div>
  )
}
