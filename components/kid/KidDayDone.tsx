'use client'

import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import { buddyFor } from '@/lib/kid/buddy'
import { STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { isFriendMoment, streaksToNextFriend } from '@/lib/pathway/streak-unlock'
import Celebration from '@/components/ui/Celebration'

// All five done. The day's own moment.
//
// Justin, 2 September 2026: "When 5 in a row done it does a celebration but
// seemed to freeze. Check this is working well, make the best design relevant
// for the right Planet Friend, the best animation, relevant for encouraging
// offline activity and linked to safe device use and learning about social
// media. Best designs like Duolingo for inspiration."
//
// WHAT FROZE. Finishing the fifth step used to open nothing on most days (the
// streak screen is a weekly reminder) and, on the days a Planet Friend was
// earned, a ten second rocket video from a CDN. On a slow connection that is
// a dark sky with nothing moving for up to eleven seconds, which is what a
// freeze looks like. The rocket now gives up on the video after two seconds
// and draws the flight instead, and it has a Skip. This screen is what every
// finished day gets, and it never waits on anything: no video, no network,
// the button is there from the first frame.
//
// THE SHAPE. Duolingo's lesson complete screen, which is the proven one: the
// character up top, one big line, three coloured stat tiles, one button. The
// character is the child's OWN Planet Friend, the buddy they chose in Make it
// mine, because a celebration from a friend they picked lands harder than one
// from a mascot they did not. The Friend says one thing, in a speech bubble,
// and it is true about today: an offline thing they did, the timer rule for
// the screen they are about to go on, or the lesson they passed and what it
// is for. Which one is chosen from what they actually did, and it rotates so
// the same child does not hear the same sentence two days running.
//
// What is deliberately not here: nothing about a run being at risk, no
// share button, no timer. The ICO Children's Code position on engineered
// urgency, and simply how you talk to a child.

export type DayDoneInput = {
  /** The run ending today, in days. */
  streak: number
  /** Full days ever, the currency the Friends are bought with. */
  completedDays: number
  /** Today's five, in the order they were shown. */
  steps: StepKey[]
}

type Line = { kind: 'offline' | 'device' | 'learning'; text: string }

// The offline steps: things a child does away from a screen.
const OFFLINE: StepKey[] = ['move', 'reading', 'printable', 'kind', 'tidy', 'make', 'talk', 'grownup_break']

/** The one true thing the Friend says about today. */
export function linesForDay(steps: StepKey[], name: string | undefined, completedDays: number): Line[] {
  const did = new Set(steps)
  const out: Line[] = []

  const offline = OFFLINE.filter(k => did.has(k))
  if (offline.length > 0) {
    const label = STEPS[offline[completedDays % offline.length]].label.toLowerCase()
    out.push({
      kind: 'offline',
      text: `You did ${label} today, away from a screen. That is the bit that matters most, and you did it.`,
    })
  } else {
    out.push({
      kind: 'offline',
      text: 'Now go and do ten minutes with no screen at all. Your stars are safe in here.',
    })
  }

  if (did.has('balance')) {
    out.push({
      kind: 'device',
      text: 'Going on a screen next? Use your timer to ask your grown up for the time. That is how the minutes you earned get to you.',
    })
  }

  if (did.has('lesson') || did.has('quiz')) {
    out.push({
      kind: 'learning',
      text: `Every lesson you pass is how you get ready for your own phone one day${name ? `, ${name}` : ''}. Nobody hands you one. You earn it, and you are.`,
    })
  }

  return out
}

export default function KidDayDone({
  day,
  childName,
  buddy,
  weekStrip = false,
  onClose,
}: {
  day: DayDoneInput
  childName?: string
  /** The buddy the child chose in Make it mine, or null for DiGi. */
  buddy?: string | null
  /** The Monday to Sunday strip of ticks, once a week, folded in from the old streak screen. */
  weekStrip?: boolean
  onClose: () => void
}) {
  const friend = buddyFor(buddy)
  const stageRef = useRef<HTMLDivElement>(null)
  const name = childName?.trim() || undefined

  // The line for today, chosen from what they did and rotated by the day
  // count so it moves on. Memoised so a re-render cannot change the sentence
  // under the child's eyes.
  const line = useMemo(() => {
    const lines = linesForDay(day.steps, name, day.completedDays)
    return lines[day.completedDays % lines.length]
  }, [day.steps, day.completedDays, name])

  const toReward = streaksToNextFriend(day.completedDays)
  const earnedFriend = isFriendMoment(day.completedDays)

  // Escape closes, like every takeover in the child app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // The motion. The Friend bounces in and settles into a slow bob, the tiles
  // follow in a stagger, the bubble last, the way Duolingo's screen builds.
  // Reduced motion gets the whole screen at once and still.
  useEffect(() => {
    if (!stageRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.gc-dd-friend', { y: 60, scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })
      gsap.to('.gc-dd-friend', { y: -8, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.7 })
      gsap.from('.gc-dd-rise', { y: 22, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.09, delay: 0.25 })
      gsap.from('.gc-dd-tile', { y: 18, scale: 0.9, opacity: 0, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.1, delay: 0.55 })
      gsap.from('.gc-dd-bubble', { scale: 0.85, opacity: 0, duration: 0.45, ease: 'back.out(1.8)', delay: 0.95, transformOrigin: '50% 100%' })
    }, stageRef)
    return () => ctx.revert()
  }, [])

  // Monday to Sunday, the week a child actually keeps (Justin: "the days
  // should be m to s so Monday to Sunday").
  const today = new Date()
  const sinceMonday = (today.getDay() + 6) % 7
  const week = Array.from({ length: 7 }, (_, i) => {
    const offset = sinceMonday - i
    return { letter: 'MTWTFSS'[i], filled: offset >= 0 && offset < day.streak, isToday: offset === 0 }
  })

  const tile = (bg: string, border: string, eyebrow: string, big: string, small: string) => (
    <div className="gc-dd-tile" style={{
      flex: 1, minWidth: 0, background: '#fff', border: `2px solid ${border}`, borderRadius: 16,
      padding: '10px 8px 9px', textAlign: 'center', boxShadow: `0 4px 0 ${border}`,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: border, background: bg, borderRadius: 8, padding: '3px 4px', marginBottom: 6 }}>
        {eyebrow}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.2 }}>{small}</div>
    </div>
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Day done"
      ref={stageRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, overflowY: 'auto',
        background: 'var(--cream, #F9F8F6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 20px 24px', textAlign: 'center',
      }}
    >
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}><Celebration /></div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 28%, var(--terracotta-lt, #FEF7E0) 0%, rgba(254,247,224,0) 58%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {/* The Friend, big, with the bubble as its speech. */}
        <div className="gc-dd-bubble" style={{
          position: 'relative', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
          padding: '12px 16px', maxWidth: 340, boxShadow: '0 2px 12px rgba(26,26,46,0.07)',
        }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.4 }}>
            {line.text}
          </p>
          <span aria-hidden style={{
            position: 'absolute', left: '50%', bottom: -9, width: 16, height: 16, background: '#fff',
            borderRight: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />
        </div>

        <div className="gc-dd-friend" style={{ width: 168, height: 168, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={friend.img} alt={friend.name} width={160} height={160} style={{ width: 160, height: 160, objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 10px 18px rgba(26,26,46,0.18))' }} />
        </div>

        <div className="gc-dd-rise" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Day done
        </div>
        <h1 className="gc-dd-rise" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', color: 'var(--ink)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '-6px 0 0' }}>
          All five{name ? `, ${name}` : ''}!
        </h1>
        <p className="gc-dd-rise" style={{ margin: '-4px 0 0', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.45, fontWeight: 600 }}>
          {earnedFriend
            ? `That is ${day.completedDays} full days. A new Friend is on the way.`
            : toReward === 1
              ? 'One more full day and a new Friend comes home.'
              : `${toReward} more full days and a new Friend comes home.`}
        </p>

        {/* Three tiles, Duolingo's row: the run, the full days, the next Friend. */}
        <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 4 }}>
          {tile('#FEF7E0', '#C99A28', 'Run', `${day.streak}`, day.streak === 1 ? 'day in a row' : 'days in a row')}
          {tile('#E8F0EE', '#2F8F6B', 'Days', `${day.completedDays}`, 'full days done')}
          {tile('#F0F9FF', '#2E6F8E', 'Friend', earnedFriend ? 'Now' : `${toReward}`, earnedFriend ? 'on the way' : toReward === 1 ? 'day to go' : 'days to go')}
        </div>

        {weekStrip && (
          <div className="gc-dd-rise" style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {week.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>{d.letter}</span>
                <span style={{
                  width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-base)', fontWeight: 800, color: d.filled ? '#fff' : 'var(--ink-light)',
                  background: d.filled ? 'var(--retro-green)' : '#fff',
                  border: d.isToday ? '2px solid var(--terracotta)' : '2px solid var(--border)',
                }}>
                  {d.filled ? '✓' : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => { try { playKidSound('tap') } catch { /* sound off */ } onClose() }}
          className="gc-dd-rise"
          style={{
            marginTop: 10, width: '100%', padding: '16px 28px', borderRadius: 16, border: 'none',
            background: 'var(--terracotta)', color: 'var(--ink)', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
