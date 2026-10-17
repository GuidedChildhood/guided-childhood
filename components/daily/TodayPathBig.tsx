'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'
import { TASK_MINUTES } from '@/lib/pathway/task-minutes'
import { nextHint } from '@/components/daily/TodayPathStrip'
import type { FriendOfTheDay } from '@/lib/pathway/friend-of-the-day'
import DayCompleteFlow, { type DayCloseFacts } from '@/components/daily/DayCompleteFlow'
import DayTickFlow, { type FirstMove } from '@/components/daily/DayTickFlow'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'
import { chunky } from '@/components/scripts/card-system'
import { CRAYON } from '@gc/shared/happy-news'

// ── THE THING IS CALLED TODAY ───────────────────────────────────────────────
//
// Justin, 13 August 2026: "can we have another name for that green trail, as I
// call it to do list but can be confusing?" He picked Today.
//
// The heading here has said "Today with Teo" for a while, so the name was
// already right on screen and simply written down nowhere, which is how it
// kept getting called the to do list in conversation. It is not a to do list:
// a to do list is a chores app, it is a thing you add to, and it makes a
// parent responsible for filling it. This is the opposite. It is one question,
// answered for them: what am I doing today.
//
// Today's loop as the BIG vertical winding path, Duolingo sized: the same
// engine as TodayPathStrip (same tasks, same minute budget, same copy), only
// rendered tall. Fat circular nodes with the pressed 3D edge, a gentle left
// and right meander, done nodes filled green with big ticks, the current node
// ringed and gently pulsing with DiGi sitting beside it, and the action
// callout riding right next to the current node with one big butter Go.

const NODE = 68
// The gentle meander, in pixels from the centre line, one offset per node in
// walking order. Small enough that a 390px phone never clips a node.
const MEANDER = [-58, 42, -48, 52, 0]
// The connector drawing space between rows: a fixed size SVG so the curve
// between two known offsets is exact on every screen width.
const GAP_W = 280
const GAP_H = 46

// The green of a done step: the win colour the approved sample used, with its
// darker shade carrying the pressed edge.
const GREEN = '#2F8F6B'
const GREEN_DARK = '#236F52'

// The drawn icon on each stone (the happy news finish, plans/
// week-of-2026-08-31-parent-happy-news-plan.md): a picture of the thing
// rather than a phone emoji, so the road reads the same on every device.
// The crayon plate each stone wears while it is the step up next: one colour
// per kind of step, so the road reads as a set of different things rather
// than one thing repeated, and never butter, which belongs to the Go.
const NODE_PLATE: Record<TodayLoopTask['key'], string> = {
  checkin: CRAYON.sky, setup: CRAYON.teal, tonight: CRAYON.sky, moment: CRAYON.coral, agreement: CRAYON.teal, script: CRAYON.pink, quests: CRAYON.teal, passport: CRAYON.coral, digi: CRAYON.sky, lesson: CRAYON.green, done: CRAYON.pink,
}

const NODE_ICON: Record<TodayLoopTask['key'], HappyIconName> = {
  checkin: 'cheer', setup: 'jobs', tonight: 'phonebed', moment: 'time', agreement: 'deal', script: 'tell', quests: 'jobs', passport: 'passport', digi: 'friends', lesson: 'lessons', done: 'wins',
}

function Connector({ fromX, toX, walked }: { fromX: number; toX: number; walked: boolean }) {
  const cx = GAP_W / 2
  const x1 = cx + fromX
  const x2 = cx + toX
  return (
    <div aria-hidden style={{ position: 'relative', height: GAP_H, overflow: 'visible', zIndex: 0 }}>
      <svg
        width={GAP_W}
        height={GAP_H}
        viewBox={`0 0 ${GAP_W} ${GAP_H}`}
        style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'block', overflow: 'visible' }}
      >
        {/* Dots, not a solid band (17 October 2026). The solid yellow
            line was the loudest gold on the card and read as a progress
            bar laid sideways. A dotted trail is the hand drawn map line the
            Happy News pages use, green where it has been walked. It starts
            and ends clear of the stones so no dot sits on an edge. */}
        <path
          d={`M ${x1} 10 C ${x1} ${GAP_H * 0.6}, ${x2} ${GAP_H * 0.4}, ${x2} ${GAP_H - 8}`}
          fill="none"
          stroke={walked ? GREEN : 'var(--ink-light)'}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray="0 14"
        />
      </svg>
    </div>
  )
}

export default function TodayPathBig({ tasks, dailyMinutes = 10, childName, streakCount = 0, streakAliveToday = false, bonus = null, childId = null, firstDay = null }: { tasks: TodayLoopTask[]; dailyMinutes?: number; childName?: string; streakCount?: number; /** Whether streakCount already includes today (lib/pathway/streak). */ streakAliveToday?: boolean; bonus?: FriendOfTheDay | null; childId?: string | null; /** The family's first ever day: the getting started close. See DayTickFlow. */ firstDay?: { moves: FirstMove[] } | null }) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  // ── THE PLANET FRIEND BESIDE THE ROAD ─────────────────────────────────────
  //
  // Justin, 13 August 2026: "we need actual Planet Friend characters to rotate
  // services and pop up on the daily pathway. Every 2 days we can have a new
  // one explaining why to click and do."
  //
  // It used to be a drawn sphere with a motif, which is a planet in the
  // astronomy sense and meant nothing. Now it is the cast the child already
  // knows by name from their own app, carrying one service and the reason to
  // open it. Picked on the server so the first paint matches, and picked
  // AGAINST the daily lead so the road and the coin never offer the same thing
  // on the same day. See lib/pathway/friend-of-the-day.
  const pathRef = useRef<HTMLDivElement>(null)
  // A step finished since the last look at Home gets its half second of
  // delight, exactly as the strip did: the node pops and DiGi says so.
  const [celebrating, setCelebrating] = useState<string | null>(null)

  // The parent's daily budget, same engine as the strip: the day is counted
  // done when the chosen minutes are spent, never when every step is ticked.
  const [minutes, setMinutes] = useState(dailyMinutes)
  // A parent who wants the finished path back opens it. Not remembered across
  // loads on purpose: the point of folding it is that the next visit leads
  // with what is still open.
  const [openAnyway, setOpenAnyway] = useState(false)

  // ── SETTLED IS NOT THE SAME AS DONE ───────────────────────────────────────
  //
  // A rung can be finished with nothing owed WITHOUT the parent having acted
  // today: Quests, when the jobs are set and the approval queue is empty. That
  // rung carries `clear` (see lib/pathway/daily-tasks.ts for why).
  //
  // The road's FLOW asks a different question from the road's TICK. For flow,
  // "is anything outstanding here", a clear rung is behind you: it must not
  // become the current step, must not hold the walked line back, and must not
  // stop the day completing, because an empty queue is not a failure and
  // should never cost a family their streak.
  //
  // For the tick, "did you do this", a clear rung is NOT done, and that is the
  // whole point. Only `task.done` paints the green tick.
  //
  // ── 17 OCTOBER 2026: THE GREEN CAME BACK ──────────────────────────────────
  //
  // Justin, on his own road reading "No jobs waiting" with fourteen jobs set
  // and nothing to approve: "check that is true and if so it should be
  // completed." The soft ring read as unfinished, so a day with nothing left
  // to do still looked like a day with something left. A clear rung now
  // paints green with the tick, on quests only (the deal keeps its ring, see
  // isDoneNode below). The words carry the honesty instead: the
  // rung says "Jobs all approved", which is what the green is for, and the
  // tick flow's list of what was done today still reads `done` alone.
  const settled = (t: TodayLoopTask) => t.done || !!t.clear
  const firstOpen = tasks.findIndex(t => !settled(t))
  const allDone = firstOpen === -1
  const currentIndex = allDone ? tasks.length - 1 : firstOpen
  const steps = tasks.filter(t => t.key !== 'done')
  const doneCount = steps.filter(settled).length
  const investedMinutes = steps.filter(settled).reduce((sum, t) => sum + (TASK_MINUTES[t.key] ?? 0), 0)
  // ── ONE TICK KEEPS THE STREAK, THE PATHWAY EARNS THE CELEBRATION ──────────
  //
  // Justin, 1 September 2026: "only have to click one tick per day but have
  // other recommended." The engine marks exactly one rung as the lead
  // (lib/pathway/daily-tasks.ts), and landing it is what keeps the flame lit.
  //
  // Justin, 11 September 2026, after a morning where he answered the check in
  // and was told the day was finished: "lets go with one tick keeps the
  // streak, the pathway earns the celebration."
  //
  // So one flag became two, and the difference is the whole point:
  //
  //   streakDone  the lead rung landed. Today counts. Quiet: the road stays
  //               open, because there is still road.
  //   pathDone    every rung is green. THAT is a finished day, and it is the
  //               only thing that folds the card away, says "Today is made",
  //               runs the close flow, or puts a tick by the child's name.
  //
  // Roads built before the rotation carry no lead flag, so they fall back to
  // the old reading for the streak half and are unaffected by the rest.
  const lead = steps.find(t => t.lead)
  const streakDone = lead
    ? lead.done
    : investedMinutes >= minutes || (steps.length > 0 && doneCount === steps.length)
  const pathDone = steps.length > 0 && doneCount === steps.length
  // The strong nudge (the Go callout on the current node) eases off once the
  // ONE tick has landed, exactly as it always did. That is the half of the old
  // behaviour that was right: a parent who has done their tick should not be
  // pushed, they should be invited. What changed is only what we CALL that
  // state, which used to be "done".
  const pressure = !streakDone && !allDone
  // Hang the Friend off a row that leans LEFT, so a coin at the right edge can
  // never touch a node that has already meandered that way.
  //
  // Never the FIRST row and never the last. The first carries the current node
  // and its Go callout, which is the one thing on this screen a parent must
  // not have to look past, and drawing a character beside it crowded exactly
  // that. The last is the finish flag and wants nothing beside it. The
  // references bear this out: Duolingo stands its characters against the
  // middle of the trail, never against the node you are about to tap.
  const bonusRow = tasks.findIndex((_, i) => i >= 1 && i < tasks.length - 1 && MEANDER[i % MEANDER.length] < 0)

  function pickMinutes(m: number) {
    setMinutes(m)
    fetch('/api/daily-minutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes: m }),
    }).catch(() => { /* the choice still holds for this view */ })
  }

  // The recorded day. When the lead rung lands, the day COUNTS and the
  // rotation may advance tomorrow, so it is written down: once, per child,
  // per day, idempotent on the server too. The moments deck records its own
  // finishes; this catches the days that complete on a lesson, a check in, a
  // DiGi question or a passport look.
  //
  // It no longer opens the close flow. That moved to the second post below,
  // and the split is Justin's rule: the streak is kept by one tick, the
  // celebration is earned by the whole road.
  const leadDone = !!lead?.done
  const leadKey = lead?.key
  const focusOf = (k?: string) => k === 'lesson' ? 'lesson' : k === 'digi' ? 'digi' : k === 'passport' ? 'passport' : 'connect'
  // The day's close: recorded, then walked through. The response carries what
  // the close screen says (tomorrow's focus, the balance guide for the age),
  // and the localStorage guard is what makes the flow a once a day moment
  // rather than a thing every visit replays.
  const [closeFacts, setCloseFacts] = useState<DayCloseFacts | null>(null)
  // The ten minutes, confirmed: DayTickFlow, on the visit where the day first
  // counted. Its facts are the same close facts this post has always returned
  // and nobody read. See components/daily/DayTickFlow for the Duolingo loop.
  const [tickFacts, setTickFacts] = useState<DayCloseFacts | null>(null)
  // Held in sessionStorage until it is closed. Home re renders this card (a
  // refresh after a tick, a version check), and a fresh copy starts with no
  // state and finds the day already posted, so without this the confirmation
  // flashed for a frame and was gone.
  const tickKey = `gc_daytick_${childId ?? 'family'}`
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(tickKey)
      if (!raw) return
      const held = JSON.parse(raw) as { day: string; facts: DayCloseFacts }
      if (held.day === new Date().toDateString()) setTickFacts(held.facts)
      else sessionStorage.removeItem(tickKey)
    } catch { /* nothing held */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const closeTick = () => {
    try { sessionStorage.removeItem(tickKey) } catch { /* fine */ }
    setTickFacts(null)
  }
  useEffect(() => {
    if (!leadDone || !leadKey) return
    const day = new Date().toDateString()
    const storageKey = `gc_daydone_${childId ?? 'family'}`
    try { if (localStorage.getItem(storageKey) === day) return } catch { /* still post; the server is idempotent */ }
    fetch('/api/daily/day-done', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: childId ?? undefined, focus: focusOf(leadKey) }),
    }).then(async r => {
      try { localStorage.setItem(storageKey, day) } catch { /* fine, the server dedupes */ }
      const facts = await r.json().catch(() => null)
      if (r.ok) {
        // The first day's getting started close is once per FAMILY. A parent
        // checking in three children on day one saw it three times, each one
        // saying the same four things. The first child gets it; the others
        // just keep their tick.
        if (firstDay) {
          const firstKey = 'gc_firstday_flow'
          try {
            if (localStorage.getItem(firstKey) === day) return
            localStorage.setItem(firstKey, day)
          } catch { /* show it; at worst it shows again */ }
        }
        const f = facts ?? {}
        try { sessionStorage.setItem(tickKey, JSON.stringify({ day, facts: f })) } catch { /* shown this once anyway */ }
        setTickFacts(f)
      }
    }).catch(() => { /* the next open retries */ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadDone, leadKey, childId])

  // ── THE FINISHED DAY ───────────────────────────────────────────────────────
  //
  // Every rung green. This is the post that stamps all_done_at (migration 287),
  // which is what puts the green tick by this child's name on the rail, and it
  // is the only thing that opens the close flow.
  //
  // Its own storage key, because the two facts happen on different days for
  // the same family: a parent can land the one tick on Monday and never finish
  // the road, then walk the whole thing on Tuesday. One key would have let
  // Monday's write suppress Tuesday's.
  useEffect(() => {
    if (!pathDone) return
    const day = new Date().toDateString()
    const storageKey = `gc_pathdone_${childId ?? 'family'}`
    try { if (localStorage.getItem(storageKey) === day) return } catch { /* still post; the server is idempotent */ }
    fetch('/api/daily/day-done', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: childId ?? undefined, focus: focusOf(leadKey), all_done: true }),
    }).then(async r => {
      try { localStorage.setItem(storageKey, day) } catch { /* fine, the server dedupes */ }
      const facts = await r.json().catch(() => null)
      setCloseFacts(facts ?? {})
    }).catch(() => { /* the next open retries */ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathDone, leadKey, childId])

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = el.querySelectorAll('[data-path-node]')
    const tween = gsap.fromTo(
      nodes,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out', delay: 0.15 }
    )
    return () => { tween.kill() }
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const doneKeys = tasks.filter(t => t.key !== 'done' && t.done).map(t => t.key)
    let seen: { date: string; keys: string[] } = { date: today, keys: [] }
    try {
      const raw = localStorage.getItem('gc_todaypath_seen')
      if (raw) seen = JSON.parse(raw)
    } catch { /* fresh start */ }
    const newly = seen.date === today ? doneKeys.filter(k => !seen.keys.includes(k)) : []
    localStorage.setItem('gc_todaypath_seen', JSON.stringify({ date: today, keys: doneKeys }))
    if (newly.length === 0) return

    const last = newly[newly.length - 1]
    const label = tasks.find(t => t.key === last)?.label ?? 'That'
    setCelebrating(label)
    const clear = setTimeout(() => setCelebrating(null), 2800)

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && pathRef.current) {
      const nodes = newly
        .map(k => pathRef.current!.querySelector(`[data-node-key="${k}"]`))
        .filter(Boolean)
      if (nodes.length) {
        gsap.fromTo(nodes, { scale: 1 }, { scale: 1.18, duration: 0.28, yoyo: true, repeat: 1, ease: 'back.out(2.4)', delay: 0.6, stagger: 0.1 })
      }
    }
    return () => clearTimeout(clear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A finished day folds to one line.
  //
  // Justin: "one pathway is done on paretns homepage can ti scroll away and
  // show these in order of doing next". Home already promotes the next real
  // thing above this card once the day is done. What it did not do was get
  // the finished thing out of the way: the full vertical path kept its whole
  // height, budget chips and all, so a parent who had done their day had to
  // scroll past a column of ticks to reach anything they could still act on.
  //
  // Done work is worth one line and a way back in, not the same room it took
  // while it still needed doing. It is not hidden: the line says what was
  // finished and opens the whole path again on a tap.
  // The walk through the close: balance, quests, see you tomorrow. Rendered
  // above whichever state the card itself is in, and only on the visit that
  // actually completed the day.
  const closeFlow = closeFacts && (
    <DayCompleteFlow
      childName={childName}
      childId={childId}
      streakCount={streakAliveToday ? Math.max(1, streakCount) : streakCount + 1}
      facts={closeFacts}
      quests={(() => { const q = tasks.find(t => t.key === 'quests'); return q ? { label: q.label, href: q.href, done: q.done } : null })()}
      onClose={() => setCloseFacts(null)}
    />
  )

  // Not on a day the whole path finished at once: the full close says all of
  // this and more, and two takeovers in a row is one too many.
  const todayStreak = streakAliveToday ? Math.max(1, streakCount) : streakCount + 1
  const nextOpen = steps.find(t => !settled(t)) ?? null
  const tickFlow = tickFacts && !pathDone && (
    <DayTickFlow
      firstDay={firstDay}
      childName={childName}
      minutes={minutes}
      minutesDone={steps.filter(t => t.done).reduce((sum, t) => sum + (TASK_MINUTES[t.key] ?? 0), 0)}
      streak={todayStreak}
      doneLabels={steps.filter(t => t.done).map(t => t.label)}
      left={steps.length - doneCount}
      next={nextOpen ? { label: nextOpen.label, href: nextOpen.href } : null}
      facts={tickFacts}
      onClose={closeTick}
    />
  )

  if (pathDone && !openAnyway) {
    return (
      <>
      {closeFlow}
      {/* ── THE FINISHED DAY, AS A BADGE (17 October 2026) ─────────────────
          Justin: "there needs to be an achievement each day so parents don't
          think it's endless." The folded day was a plain white row, which
          read as a list item rather than a thing won. Now it is the banner
          the open path wears, in the done green, with the trophy on a white
          plate: one look that says today is finished and there is nothing
          more to do until tomorrow. Still one tap to open the path again. */}
      <button
        onClick={() => setOpenAnyway(true)}
        aria-label={`Today is done, ${doneCount} of ${steps.length} steps. Show the path`}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          background: CRAYON.green, border: 'var(--edge)', borderRadius: 'var(--radius-card)',
          padding: '16px 16px', marginBottom: '20px', cursor: 'pointer', textAlign: 'left',
          font: 'inherit', boxShadow: 'var(--lift)',
        }}
      >
        <span aria-hidden style={{
          flexShrink: 0, width: 56, height: 56, borderRadius: '50%',
          background: 'var(--white)', border: 'var(--edge)', boxShadow: '0 3px 0 var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><HappyIcon name="wins" size={36} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 2 }}>
            {/* Short enough for one line at 390: the count is said by
                "every step" below, the eyebrow carries the streak alone. */}
            {streakCount > 0 ? `${streakCount} day streak` : 'Today'}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>
            Every step, done
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)', marginTop: 2, lineHeight: 1.35 }}>
            Readier than yesterday. See you tomorrow.
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)' }}>
          ›
        </span>
      </button>
      </>
    )
  }

  return (
    <>
    {closeFlow}
    {tickFlow}
    {/* No card around the path (17 October 2026). It was a white ink edged
        card holding a sky ink edged banner holding the steps, with a white
        ink edged callout inside that: three boxes deep. The design review
        named it the plainest tell that a screen was assembled rather than
        designed. Duolingo sets its stones straight on the page under the
        banner, and so does this. */}
    <div style={{ marginBottom: '24px' }}>
      <style>{`
        @keyframes todaypathbig-pulse {
          0%   { transform: scale(1);    opacity: 0.55; }
          70%  { transform: scale(1.35); opacity: 0;    }
          100% { transform: scale(1.35); opacity: 0;    }
        }
        .todaypathbig-pulse-ring { animation: todaypathbig-pulse 1.8s ease-out infinite; }
        @keyframes todaypathbig-throb {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .todaypathbig-throb { animation: todaypathbig-throb 1.4s ease-in-out infinite; }
        @keyframes todaypathbig-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        .todaypathbig-bounce { animation: todaypathbig-bounce 1.9s ease-in-out infinite; }
        @keyframes todaypathbig-twinkle {
          0%, 100% { opacity: 1;   transform: scale(1); }
          45%      { opacity: .35; transform: scale(.8); }
        }
        .todaypathbig-twinkle { animation: todaypathbig-twinkle 2.7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .todaypathbig-pulse-ring { animation: none; opacity: 0.35; }
          .todaypathbig-throb { animation: none; }
          .todaypathbig-bounce, .todaypathbig-twinkle { animation: none; }
        }
      `}</style>

      {/* ── THE BANNER (17 October 2026) ───────────────────────────────────
          Justin: "use less gold and make it more happy news, much more
          finished". Duolingo heads its path with one coloured banner that
          says what the path is for, and the stones sit under it on white
          (mobbin.com/screens/56f6a8cb-cd70-4bec-aab7-96ccbd976fdc). This is
          that banner in the Happy News crayon: sky while the day is open,
          green once it is done, ink edge and ledge like every card the child
          app wears. Butter is kept for the one thing to tap, the Go.

          It carries three things and no more: whose path, the promise that
          names the ONE tick (Justin's rule, 11 September: one tick keeps the
          streak, the pathway earns the celebration), and the finish line. */}
      <div style={{
        background: pathDone ? CRAYON.green : CRAYON.sky,
        border: 'var(--edge)', borderRadius: 'var(--radius-btn)', boxShadow: 'var(--lift)',
        padding: '14px 16px 16px', marginBottom: 14, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)' }}>
            {pathDone ? 'Today, done' : 'Today'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>
            {investedMinutes} of {minutes} min
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: 1.15, margin: '0 0 4px' }}>
          {/* ── THE NAME, SETTLED (19 August 2026) ─────────────────────────
              It is a PATH, each stop goes green, and with two children whose
              it is matters more than what day it is. "Today" stays in the
              eyebrow, where the day belongs. */}
          {`${kid.charAt(0).toUpperCase()}${kid.slice(1)}'s path`}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, margin: '0 0 12px' }}>
          {/* Three states, not two (11 September 2026): the one tick is named
              before it lands, acknowledged once it has, and the finished day
              says it is finished. */}
          {pathDone
            ? 'Today is done. Nothing more until tomorrow.'
            : streakDone
              ? `Today counts. You are readier for ${kid} than yesterday.`
              : lead
                ? `One tick makes today count: ${lead.label.toLowerCase()}.`
                : 'Understand one moment, and walk away with the exact words for it.'}
        </p>

        {/* ── THE FINISH LINE ───────────────────────────────────────────────
            Justin, 17 October: "there needs to be an achievement each day so
            parents don't think it's endless." One segment per step, filling
            green, ending at the trophy, with the count left beside it. Nothing
            after the trophy, which is the point. */}
        {steps.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              role="img"
              aria-label={`${doneCount} of ${steps.length} steps done today`}
              style={{ flex: 1, minWidth: 0, display: 'flex', gap: 4 }}
            >
              {/* Filled from the left by the count, not by which steps are
                  done: done steps in any order read as gaps, and gaps in a
                  progress bar read as a bug. */}
              {steps.map((t, i) => (
                <span key={t.key} style={{
                  flex: 1, height: 14, borderRadius: 'var(--radius-pill)',
                  background: i < doneCount ? GREEN : 'var(--white)',
                  border: '2px solid var(--ink)', boxSizing: 'border-box',
                  transition: 'background .3s',
                }} />
              ))}
            </div>
            <span style={{
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--white)', border: '2px solid var(--ink)', borderRadius: 'var(--radius-pill)',
              padding: '3px 10px 3px 4px',
            }}>
              <span aria-hidden style={{ lineHeight: 0 }}><HappyIcon name="wins" size={24} /></span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                {pathDone ? 'Done' : `${steps.length - doneCount} to go`}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* The big path itself: down the middle with a gentle meander */}
      <div ref={pathRef} style={{ position: 'relative', paddingTop: 10, maxWidth: 520, margin: '0 auto' }}>
        {tasks.map((task, i) => {
          const x = MEANDER[i % MEANDER.length]
          const isCurrent = i === currentIndex && !allDone
          // Settled with nothing owed paints green on QUESTS (see the note on
          // settled above). Not on the deal: its clear means "saved earlier
          // this week", and a green deal from a Friday save is the thing
          // Justin reported on 28 September. isClearNode still tells the
          // screen reader why.
          const isClearNode = !task.done && !!task.clear
          const isDoneNode = task.done || (isClearNode && task.key === 'quests')
          const showCallout = isCurrent && pressure
          // DiGi sits on whichever side of the current node has the room.
          const digiOnRight = x <= 0
          return (
            <div key={task.key}>
              {/* The seam between the day's one thing and the extras. One
                  quiet line, so the road reads as a small promise followed by
                  an open invitation rather than one long list of homework. */}
              {tasks.findIndex(t => t.lead) >= 0 && i === tasks.findIndex(t => t.lead) + 1 && (
                <div style={{ textAlign: 'center', margin: '14px 0 0', position: 'relative', zIndex: 2 }}>
                  {/* A pill, not bare text: the connector curve runs up behind
                      this line and the words have to sit on something. */}
                  <span style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: 'var(--radius-pill)',
                    background: 'var(--white)', border: 'var(--edge)',
                    fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 800,
                    color: 'var(--ink-soft)',
                  }}>
                    Also today, if you fancy it
                  </span>
                </div>
              )}
              {i > 0 && (
                <Connector
                  fromX={MEANDER[(i - 1) % MEANDER.length]}
                  toX={x}
                  walked={settled(tasks[i - 1])}
                />
              )}

              <div data-path-node style={{ position: 'relative', zIndex: 1 }}>
                {/* THE BONUS, BESIDE THE ROAD, DUOLINGO STYLE.
                    Justin, 12 August 2026: "can these go on the right of the
                    green line to do today, sparking and bouncing as a bonus
                    like Duolingo."
                    It hangs off a row whose node leans LEFT, which is why the
                    index is checked against MEANDER rather than picked by eye:
                    on a 390 wide phone a node offset to the right and a 60px
                    coin at the right edge would touch, and the whole point is
                    that the bonus never gets in the road's way.
                    It bounces rather than pulses. A pulse is the language the
                    CURRENT step uses, and two things pulsing on one path means
                    neither reads as the next thing to do. A bounce says "over
                    here" without ever saying "you are behind". */}
                {bonus && i === bonusRow && (
                  <Link
                    href={bonus.service.href}
                    aria-label={`${bonus.friend.name} says: ${bonus.service.title}`}
                    style={{
                      position: 'absolute', right: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      textDecoration: 'none', zIndex: 2, maxWidth: 96,
                    }}
                  >
                    {/* THE FRIEND STANDS BESIDE THE ROAD, which is where the
                        Duolingo references put their characters: off the path,
                        never a node on it, so nothing about them can be
                        mistaken for a step a parent has to take. */}
                    <span className="todaypathbig-bounce" style={{
                      position: 'relative',
                      width: 62, height: 62, borderRadius: 'var(--radius-pill)',
                      background: '#fff',
                      border: `2.5px solid ${bonus.friend.colour}`,
                      boxShadow: `0 4px 0 ${bonus.friend.colour}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      // NO overflow clip. It was here to crop the old art's
                      // cream square into the circle, and it took the shooting
                      // star with it, which sits proud of the top right corner
                      // on purpose. The art is cut out now, so there is
                      // nothing to crop and the star is visible again.
                    }}>
                      {/* THE REAL CHARACTER ART, shipped with the code rather
                          than fetched from the CDN. This is the face of the
                          product on the screen a parent opens every morning,
                          and an image one network hop away is an image that is
                          sometimes not there.

                          The art is cut out, so the Friend FLOATS on the
                          white disc rather than bringing a cream square with
                          it. Contained rather than cover, and inset a little,
                          so nothing is cropped at the edges: Orbit's antenna
                          and Pebble's stalk both reach the top of the frame
                          and a cover fit would behead them. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bonus.friend.cutout}
                        alt=""
                        aria-hidden="true"
                        width={54}
                        height={54}
                        style={{ display: 'block', width: 54, height: 54, objectFit: 'contain' }}
                      />
                      {/* THE SHOOTING STAR STAYS. Justin: "I like the shooting
                          star." One small star at the shoulder, twinkling out
                          of step with the bounce so the two never lock into
                          looking like a single mechanical loop. */}
                      <span aria-hidden className="todaypathbig-twinkle" style={{
                        position: 'absolute', top: -2, right: -1,
                        fontSize: '15px', lineHeight: 1,
                      }}>✨</span>
                    </span>
                    {/* WHO IT IS, then WHY TO TAP. The name earns the tap on
                        its own once a family knows the cast, and the line
                        under it is the service's own pitch rather than a
                        second one written here. */}
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                      letterSpacing: '.06em', textTransform: 'uppercase', color: bonus.friend.colour,
                      textAlign: 'center',
                    }}>
                      {bonus.friend.name}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: 'var(--text-xs)', color: 'var(--ink-soft)',
                      textAlign: 'center', lineHeight: 1.3,
                    }}>
                      {bonus.service.short}
                    </span>
                  </Link>
                )}
                <Link
                  href={task.href}
                  aria-label={isDoneNode ? `${task.label}, done` : isClearNode ? `${task.label}, nothing waiting` : isCurrent ? `${task.label}, up next` : task.label}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: 0, maxWidth: `calc(100% - ${2 * Math.abs(x)}px)`, overflowWrap: 'anywhere',
                    textDecoration: 'none', width: 'fit-content', margin: '0 auto',
                    transform: `translateX(${x}px)`, position: 'relative', zIndex: 1,
                  }}
                >
                  <div data-node-key={task.key} className={isCurrent ? 'todaypathbig-throb' : undefined} style={{ position: 'relative', width: NODE, height: NODE }}>
                    {isCurrent && (
                      <div
                        className="todaypathbig-pulse-ring"
                        style={{ position: 'absolute', inset: '-7px', borderRadius: '50%', border: `4px solid ${NODE_PLATE[task.key]}` }}
                      />
                    )}
                    <div
                      style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        // Three looks, the Duolingo set in our crayon: done is
                        // green with its own darker ledge, the step up next
                        // wears its crayon plate on an ink edge, and the road
                        // ahead is a white stone on a soft grey edge with its
                        // drawing still in colour: waiting, not broken. A
                        // fully greyed road lost the warmth the review asked
                        // to keep.
                        background: isDoneNode ? GREEN : isCurrent ? NODE_PLATE[task.key] : 'var(--white)',
                        border: isDoneNode || isCurrent ? '2.5px solid var(--ink)' : '2.5px solid var(--ink-light)',
                        boxShadow: isDoneNode
                          ? `0 5px 0 ${GREEN_DARK}`
                          : isCurrent ? 'var(--lift-deep)' : '0 5px 0 var(--ink-light)',
                        fontSize: 'var(--text-2xl)',
                      }}
                    >
                      {isDoneNode ? (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ lineHeight: 0, opacity: isCurrent ? 1 : 0.7 }}>
                          <HappyIcon name={NODE_ICON[task.key]} size={38} />
                        </span>
                      )}
                    </div>

                    {/* DiGi sits beside the current node, the guide on the road.
                        EXCEPT ON DIGI'S OWN DAY. DiGi is one of the rotating
                        cast as well as the guide, so once every twelve days it
                        is also the Friend standing further down the road, and
                        drawing it twice on one screen is the same thing said in
                        two places, which is the fault Justin catches within the
                        hour every time. The Friend further down wins, because
                        that one is carrying a message. */}
                    {isCurrent && bonus?.friend.key !== 'digi' && (
                      <div style={{
                        position: 'absolute', top: '50%',
                        [digiOnRight ? 'left' : 'right']: NODE + 8,
                        transform: 'translateY(-58%)', zIndex: 2, pointerEvents: 'none',
                      }}>
                        <DigiCharacter mood={celebrating || !pressure ? 'happy' : 'idle'} size={48} once={!pressure && !celebrating} />
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                    fontWeight: isCurrent ? 900 : 700,
                    color: isCurrent ? 'var(--ink)' : 'var(--ink-soft)',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {task.label}
                  </span>
                  {task.note && (
                    <span style={{
                      display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                      letterSpacing: '0.04em', color: 'var(--ink-muted)', textAlign: 'center', marginTop: 2,
                    }}>
                      {task.note}
                    </span>
                  )}
                </Link>

                {/* The celebration bubble, when a win just landed */}
                {isCurrent && celebrating && (
                  <span style={{
                    position: 'absolute', top: -12, left: '50%',
                    transform: `translateX(calc(-50% + ${x}px))`,
                    background: CRAYON.green, color: 'var(--ink)',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                    padding: '0.35em 0.8em', borderRadius: 'var(--radius-pill)',
                    // Wraps, and never wider than the phone. It was nowrap, and at
                    // Larger Text a centred chip that will not wrap runs off both
                    // sides at once.
                    maxWidth: 'calc(100vw - 32px)', textAlign: 'center', lineHeight: 1.25,
                    border: 'var(--edge)', boxShadow: 'var(--lift)', zIndex: 3,
                  }}>
                    {celebrating} done, lovely 🎉
                  </span>
                )}
              </div>

              {/* The action callout rides right next to the current node: the
                  exact next step, the honest minute line, and one big Go. */}
              {showCallout && (
                <div style={{ position: 'relative', margin: '22px auto 0', maxWidth: 420, zIndex: 2 }}>
                  <span aria-hidden style={{
                    position: 'absolute', top: -9, left: '50%',
                    transform: `translateX(calc(-50% + ${x}px)) rotate(45deg)`,
                    width: 16, height: 16, background: '#fff',
                    borderTop: 'var(--edge)', borderLeft: 'var(--edge)',
                  }} />
                  <div style={{
                    background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
                    padding: '14px 14px 14px', boxShadow: 'var(--lift)',
                  }}>
                    {/* One eyebrow, one title, one line, one button. The
                        minute budget used to ride on the title as a run on
                        sentence; the banner carries it now, so this says
                        only what the step is and how long it takes. */}
                    <p style={{ margin: '0 0 3px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                      Up next
                    </p>
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>
                      {tasks[currentIndex].label}
                    </p>
                    <p style={{ margin: '4px 0 14px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                      {nextHint(tasks[currentIndex].key)}
                    </p>
                    <Link
                      href={tasks[currentIndex].href}
                      style={{ ...chunky('butter', 'lg'), display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%', boxSizing: 'border-box' }}
                    >
                      Go
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* The two quieter endings, word for word from the strip: budget met but
          steps remain, and the full house. While a step is still due, the Go
          lives in the callout on the path above. */}
      {!pressure && !allDone ? (
        // ── THE COUNTED DAY, ONE BUTTON (17 October 2026) ─────────────────
        // It was a sage box repeating what the banner says (your minutes are
        // done, your streak is safe). The banner says it once now, so all
        // that is left here is the way on, as the quiet white button the
        // child app uses for a second choice. The Go stays the only butter.
        <Link
          href={tasks[currentIndex].href}
          style={{ ...chunky('white', 'md'), display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%', boxSizing: 'border-box', marginTop: 18 }}
        >
          Keep going: {tasks[currentIndex].label}
        </Link>
      ) : allDone ? (
        <Link
          href="/dashboard/pathway"
          style={{
            display: 'block', marginTop: '16px', textAlign: 'center', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
          }}
        >
          Day complete, streak safe. <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)' }}>See what it moved →</span>
        </Link>
      ) : null}

      {/* ── THE DAILY MINUTES, AS ONE SEGMENTED CONTROL ──────────────────────
          They were three tall butter and white tiles with an icon and a hint
          each, the loudest thing on the card for a setting a parent picks
          once. Now it is the iOS segmented control in our finish: a quiet
          track, the chosen value a white thumb with an ink edge. Same three
          choices, same save, a third of the height and no gold. It sits
          under the path, where settings live, and names what the choice
          means under it, which the old tiles did and the bare numbers lost. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, maxWidth: 520, margin: '26px auto 0', padding: '0 2px' }}>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
            Minutes a day
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
            {minutes === 5 ? 'A quick day' : minutes === 15 ? 'Room to go deep' : 'The usual'}
          </span>
        </span>
        <div role="radiogroup" aria-label="Your minutes a day" style={{
          display: 'flex', flexShrink: 0, gap: 2, padding: 3, borderRadius: 16,
          background: 'var(--app-bg)', border: '2px solid var(--ink-light)',
        }}>
          {[5, 10, 15].map(m => {
            const on = m === minutes
            return (
              <button
                key={m}
                role="radio"
                aria-checked={on}
                aria-label={`${m} minutes a day`}
                onClick={() => pickMinutes(m)}
                style={{
                  minWidth: 52, minHeight: 40, padding: '0 8px', borderRadius: 12, cursor: 'pointer', whiteSpace: 'nowrap',
                  border: on ? '2px solid var(--ink)' : '2px solid transparent',
                  background: on ? 'var(--white)' : 'transparent',
                  boxShadow: on ? '0 2px 0 var(--ink)' : 'none',
                  fontFamily: 'var(--font-display)', fontWeight: on ? 900 : 700, fontSize: 'var(--text-sm)',
                  color: on ? 'var(--ink)' : 'var(--ink-soft)',
                  transition: 'background .15s, box-shadow .15s',
                }}
              >
                {m}
              </button>
            )
          })}
        </div>
      </div>

    </div>
    </>
  )
}
