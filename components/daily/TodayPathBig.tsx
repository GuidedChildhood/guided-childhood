'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'
import { TASK_MINUTES } from '@/lib/pathway/task-minutes'
import { nextHint } from '@/components/daily/TodayPathStrip'
import type { FriendOfTheDay } from '@/lib/pathway/friend-of-the-day'

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

const NODE_ICON: Record<TodayLoopTask['key'], string> = {
  checkin: '✦', setup: '🧰', moment: '☀️', agreement: '🤝', script: '💬', quests: '⭐', passport: '🛂', digi: '✦', done: '🏁',
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
        <path
          d={`M ${x1} ${-NODE / 2} C ${x1} ${GAP_H * 0.7}, ${x2} ${GAP_H * 0.3}, ${x2} ${GAP_H + NODE / 2}`}
          fill="none"
          stroke={walked ? 'var(--stage-1-bold)' : 'var(--border)'}
          strokeWidth={10}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default function TodayPathBig({ tasks, dailyMinutes = 10, childName, streakCount = 0, bonus = null }: { tasks: TodayLoopTask[]; dailyMinutes?: number; childName?: string; streakCount?: number; bonus?: FriendOfTheDay | null }) {
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

  const firstOpen = tasks.findIndex(t => !t.done)
  const allDone = firstOpen === -1
  const currentIndex = allDone ? tasks.length - 1 : firstOpen
  const steps = tasks.filter(t => t.key !== 'done')
  const doneCount = steps.filter(t => t.done).length
  const investedMinutes = steps.filter(t => t.done).reduce((sum, t) => sum + (TASK_MINUTES[t.key] ?? 0), 0)
  const dayDone = investedMinutes >= minutes || (steps.length > 0 && doneCount === steps.length)
  const toBudgetMin = Math.max(0, minutes - investedMinutes)
  const nextWeight = TASK_MINUTES[tasks[currentIndex].key] ?? 0
  const pressure = !dayDone && !allDone
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

  // The exact minute line the strip's Go banner carried, unchanged.
  const minuteLine = investedMinutes + nextWeight >= minutes
    ? `last of your ${minutes} min`
    : investedMinutes > 0
      ? `${investedMinutes} min done today, about ${toBudgetMin} more to your ${minutes}`
      : `about ${toBudgetMin} min to your ${minutes} min`

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
  if (dayDone && !openAnyway) {
    return (
      <button
        onClick={() => setOpenAnyway(true)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
          padding: '14px 16px', marginBottom: '20px', cursor: 'pointer', textAlign: 'left',
          font: 'inherit',
        }}
      >
        <span aria-hidden style={{
          flexShrink: 0, width: 38, height: 38, borderRadius: '12px',
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)',
        }}>✓</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
            Today, sorted
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginTop: '2px' }}>
            {doneCount} of {steps.length} done{streakCount > 0 ? ` · ${streakCount} day streak` : ''}
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-muted)' }}>
          Show ›
        </span>
      </button>
    )
  }

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '20px',
      padding: '18px 16px 18px',
      marginBottom: '20px',
    }}>
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

      {/* The point of the day, one line, same words as ever */}
      <div style={{ padding: '0 4px', marginBottom: '12px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.2, margin: '0 0 3px' }}>
          {dayDone ? 'Today, sorted' : `Today with ${kid}`}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
          {dayDone
            ? 'You understood a moment and you have the words. That is the day.'
            : 'Understand one moment, and walk away with the exact words for it.'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {dayDone ? 'Today' : 'Today · do this next'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: dayDone ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
          {dayDone ? 'All done ✓' : `${investedMinutes} of ${minutes} min`}
        </span>
      </div>

      {/* The budget, now as big friendly icon chips: the same three choices,
          the same promise (a five minute day still keeps the streak), just a
          proper thumb sized tap. */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
        {([[5, '⚡', 'A quick day'], [10, '☀️', 'The usual'], [15, '🌙', 'Room to go deep']] as const).map(([m, icon, hint]) => {
          const on = m === minutes
          return (
            <button
              key={m}
              onClick={() => pickMinutes(m)}
              aria-pressed={on}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                padding: '10px 6px 9px', borderRadius: '14px', cursor: 'pointer',
                border: on ? '2px solid var(--terracotta)' : '2px solid var(--border)',
                background: on ? 'var(--terracotta-lt)' : '#fff',
                boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : '0 3px 0 var(--border)',
                transition: 'all 0.15s',
              }}
            >
              <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1, filter: on ? 'none' : 'grayscale(1) opacity(0.6)' }}>{icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: on ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
                {m} min
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.1 }}>{hint}</span>
            </button>
          )
        })}
      </div>

      {/* The big path itself: down the middle with a gentle meander */}
      <div ref={pathRef} style={{ position: 'relative', paddingTop: 14 }}>
        {tasks.map((task, i) => {
          const x = MEANDER[i % MEANDER.length]
          const isCurrent = i === currentIndex && !allDone
          const isDoneNode = task.done
          const showCallout = isCurrent && pressure
          // DiGi sits on whichever side of the current node has the room.
          const digiOnRight = x <= 0
          return (
            <div key={task.key}>
              {i > 0 && (
                <Connector
                  fromX={MEANDER[(i - 1) % MEANDER.length]}
                  toX={x}
                  walked={tasks[i - 1].done}
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
                      width: 62, height: 62, borderRadius: '100px',
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
                  aria-label={isDoneNode ? `${task.label}, done` : isCurrent ? `${task.label}, up next` : task.label}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    textDecoration: 'none', width: 'fit-content', margin: '0 auto',
                    transform: `translateX(${x}px)`, position: 'relative', zIndex: 1,
                  }}
                >
                  <div data-node-key={task.key} className={isCurrent ? 'todaypathbig-throb' : undefined} style={{ position: 'relative', width: NODE, height: NODE }}>
                    {isCurrent && (
                      <div
                        className="todaypathbig-pulse-ring"
                        style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '4px solid var(--terracotta)' }}
                      />
                    )}
                    <div
                      style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDoneNode ? GREEN : isCurrent ? '#fff' : 'var(--cream)',
                        border: isDoneNode ? 'none' : isCurrent ? '3px solid var(--terracotta)' : '2.5px solid var(--border)',
                        boxShadow: isDoneNode
                          ? `0 5px 0 ${GREEN_DARK}`
                          : isCurrent
                            ? '0 5px 0 var(--terracotta-dark), 0 0 0 6px var(--terracotta-lt)'
                            : '0 5px 0 var(--border)',
                        fontSize: 'var(--text-2xl)',
                        filter: !isDoneNode && !isCurrent ? 'grayscale(1) opacity(0.5)' : 'none',
                      }}
                    >
                      {isDoneNode ? (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span aria-hidden="true" style={task.key === 'digi' ? { color: 'var(--terracotta)', fontWeight: 800 } : undefined}>
                          {NODE_ICON[task.key]}
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
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    fontWeight: isCurrent ? 700 : 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: isCurrent ? 'var(--ink)' : isDoneNode ? 'var(--ink-soft)' : 'var(--ink-muted)',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {task.label}
                  </span>
                </Link>

                {/* The celebration bubble, when a win just landed */}
                {isCurrent && celebrating && (
                  <span style={{
                    position: 'absolute', top: -12, left: '50%',
                    transform: `translateX(calc(-50% + ${x}px))`,
                    background: 'var(--terracotta)', color: 'var(--ink)',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                    padding: '5px 11px', borderRadius: '100px', whiteSpace: 'nowrap',
                    boxShadow: '0 3px 10px rgba(237,195,95,0.4)', zIndex: 3,
                  }}>
                    {celebrating} done, lovely 🎉
                  </span>
                )}
              </div>

              {/* The action callout rides right next to the current node: the
                  exact next step, the honest minute line, and one big Go. */}
              {showCallout && (
                <div style={{ position: 'relative', marginTop: 14, zIndex: 2 }}>
                  <span aria-hidden style={{
                    position: 'absolute', top: -9, left: '50%',
                    transform: `translateX(calc(-50% + ${x}px)) rotate(45deg)`,
                    width: 16, height: 16, background: '#fff',
                    borderTop: '2px solid var(--terracotta)', borderLeft: '2px solid var(--terracotta)',
                  }} />
                  <div style={{
                    background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 16,
                    padding: '14px 14px 14px', boxShadow: '0 5px 0 rgba(201,154,40,0.25)',
                  }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>
                      Next: {tasks[currentIndex].label}
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', fontWeight: 500 }}>
                        {' '}· {minuteLine}
                      </span>
                    </p>
                    <p style={{ margin: '4px 0 12px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                      {nextHint(tasks[currentIndex].key)}
                    </p>
                    <Link
                      href={tasks[currentIndex].href}
                      style={{
                        display: 'block', textAlign: 'center', textDecoration: 'none',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
                        color: 'var(--ink)', background: 'var(--terracotta)',
                        border: 'none', borderRadius: 16, padding: '14px 0',
                        boxShadow: '0 5px 0 var(--terracotta-dark)',
                      }}
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
        <div style={{
          marginTop: '16px', padding: '13px 15px',
          background: 'var(--tint-sage)', borderRadius: '14px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
            That is your {minutes} minutes, day done 🎉
          </div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>
            You are readier for {kid} today than yesterday.{streakCount >= 2 ? ` ${streakCount} days in a row now.` : ''} Streak safe, the rest waits for tomorrow. Got a spare minute?
          </div>
          <Link
            href={tasks[currentIndex].href}
            style={{
              display: 'inline-block', marginTop: '9px',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              color: 'var(--terracotta-dark)', textDecoration: 'none',
            }}
          >
            Keep going: {tasks[currentIndex].label} →
          </Link>
        </div>
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
    </div>
  )
}
