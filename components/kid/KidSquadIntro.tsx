'use client'

import { useEffect, useRef, useState } from 'react'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { streaksToUnlockFriend } from '@/lib/pathway/streak-unlock'

// The welcome splash: a rich warm screen, big white words, and one character at
// a time floating and glowing in the middle.
//
// DiGi says hello first, always, then the WHOLE family one by one, in order, so
// a child meets every Planet Friend and knows who is out there to collect. Each
// one says plainly whether it is theirs yet, and if not, exactly how many
// streaks away it is. Seeing Cosmo on day one is the point: it is the thing
// worth working toward, and a locked one is a teaser, not a disappointment.
//
// Paced slowly on purpose. A child reads far slower than an adult skims, and
// this is the moment the whole collection is being taught.
//
// Which is exactly why it cannot run every open. Six cards at four and a half
// seconds is nearly half a minute of splash between a child and their jobs, and
// a thing that lovely stops being lovely the third time in a day. So it plays
// once a week: often enough that the family they are collecting stays in mind,
// rare enough that it is still a treat rather than a toll gate.

const SEEN_KEY = 'gc_kid_squad_intro_seen'
// When it last played, so the weekly gate survives a reload and a new tab.
const LAST_KEY = 'gc_kid_squad_intro_at'
// This open's answer, so every mount within one open agrees.
const OPEN_KEY = 'gc_kid_squad_intro_open'
const EVERY_MS = 7 * 24 * 60 * 60 * 1000
const AUTO_MS = 4600

export function squadIntroSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true }
}

// Is it due? Never played, or a week since it last did.
//
// The answer is worked out once per app open and then held in sessionStorage,
// which matters more than it looks. Playing the intro stamps the clock, so a
// second read of the raw timestamp during the same open would say "not due" and
// the intro would disappear from under the child. Anything that remounts the
// screen would do it: React strict mode in development does exactly this, and
// it is how the bug was caught. Deciding once per open makes the answer stable
// however many times the tree mounts.
//
// Private mode has no memory, so it falls back to not due: a splash on every
// single open is worse than a child who never gets one.
export function squadIntroDue(): boolean {
  try {
    const decided = sessionStorage.getItem(OPEN_KEY)
    if (decided !== null) return decided === '1'
    const last = Number(localStorage.getItem(LAST_KEY) ?? 0)
    const due = !last || Date.now() - last >= EVERY_MS
    sessionStorage.setItem(OPEN_KEY, due ? '1' : '0')
    return due
  } catch { return false }
}

// Stamped when it starts rather than when it ends, so a child who wanders off
// halfway through is not met by the whole thing again on the next open.
function markPlayed(): void {
  try {
    localStorage.setItem(LAST_KEY, String(Date.now()))
  } catch { /* private mode, squadIntroDue already says no */ }
}

// Done: settle this open's answer to no.
//
// This is the missing half of the sessionStorage cache above, and without it
// the intro looped. squadIntroDue writes '1' on the first read of an open and
// nothing ever wrote '0', so the answer stayed "due" for the whole session. The
// weekly gate held across DAYS and failed completely within a single visit: a
// child who opened their app, watched the intro, tapped into a lesson and then
// tapped Quests to come back got the whole thing again. And again.
//
// It has to be here, at the end, rather than in markPlayed at the start. The
// cache exists precisely so a remount mid play does not yank the intro out from
// under the child, and marking it done on the first frame would do exactly that.
// So: '1' while it is playing, '0' once it has finished.
export function squadIntroFinished(): void {
  try { sessionStorage.setItem(OPEN_KEY, '0') } catch { /* private mode */ }
}

type Card = { kind: 'digi' } | { kind: 'friend'; index: number }

export default function KidSquadIntro({
  childName, earnedFriends = 0, completedStreaks = 0, onDone,
}: {
  childName: string
  currentStageId?: number
  earnedFriends?: number
  completedStreaks?: number
  onDone: () => void
}) {
  const name = childName && childName !== 'Your child' ? childName : 'friend'
  const earned = Math.max(0, Math.min(5, earnedFriends))

  // DiGi, then every Planet Friend in stage order. Always all of them.
  const cards: Card[] = [
    { kind: 'digi' },
    ...STAGE_CHARACTERS.map((_, i) => ({ kind: 'friend' as const, index: i })),
  ]
  const total = cards.length

  // A first meeting is tapped through at the child's own pace. Every open after
  // auto plays, tap anywhere to hurry it along.
  const [autoPlay] = useState(() => squadIntroSeen())
  const [step, setStep] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // The week starts the moment it appears.
  useEffect(() => { markPlayed() }, [])

  // Leaving the page counts as done too.
  //
  // Otherwise a child who taps away mid intro leaves this open still marked
  // due, and gets the whole squad again the moment they come back, which is
  // the same loop by a slightly different road. pagehide rather than unmount,
  // because a React remount is exactly the case the cache is protecting and
  // must not settle it.
  useEffect(() => {
    const settle = () => squadIntroFinished()
    window.addEventListener('pagehide', settle)
    return () => window.removeEventListener('pagehide', settle)
  }, [])

  function finish() {
    if (timer.current) clearTimeout(timer.current)
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    // Settle this open, so coming back to the home screen from a lesson does
    // not play the whole squad again. See squadIntroFinished.
    squadIntroFinished()
    onDone()
  }
  function advance() {
    if (step < total - 1) setStep(s => s + 1)
    else finish()
  }

  useEffect(() => {
    if (!autoPlay) return
    timer.current = setTimeout(advance, AUTO_MS)
    return () => { if (timer.current) clearTimeout(timer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, autoPlay])

  const card = cards[step]
  const friend = card.kind === 'friend' ? STAGE_CHARACTERS[card.index] : null
  // Theirs already, the very next one to chase, or further down the road.
  const isYours = !!friend && friend.stageId <= earned
  const isNext = !!friend && friend.stageId === earned + 1
  const streaksAway = friend ? streaksToUnlockFriend(friend.stageId, completedStreaks) : 0

  const white = '#FFFFFF'
  const soft = 'rgba(255,255,255,0.76)'
  const headline: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 900, color: white,
    letterSpacing: '-0.02em', lineHeight: 1.1, margin: '14px 0 4px',
    fontSize: 'clamp(1.8rem, 8.5vw, 2.4rem)',
  }
  const body: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: soft,
    lineHeight: 1.55, margin: 0, maxWidth: 340,
  }
  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)',
  }

  return (
    <div
      onClick={autoPlay ? advance : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'radial-gradient(circle at 50% 38%, #4A4029 0%, #2E2818 55%, #1E1A10 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 22px', textAlign: 'center', overflowY: 'auto',
        cursor: autoPlay ? 'pointer' : 'default',
      }}
    >
      {/* Justin, 9 August 2026: "can we make skip intro button bigger."
          It was 12px mono at 55 percent white, no background, tucked in the
          corner. That is the smallest control in the product and it is the
          very first thing a child ever touches, on the one screen standing
          between them and their jobs. A child who cannot find it sits through
          the whole intro every time, or taps around the edge of it and misses.
          Now a real chunky pill in the house style, 44px tall so it clears the
          minimum tap target, with a border so it reads as a button rather than
          as a label that happens to be tappable. */}
      <button
        onClick={(e) => { e.stopPropagation(); finish() }}
        style={{
          position: 'absolute', top: 14, right: 14,
          minHeight: 44, padding: '10px 20px',
          background: 'rgba(255,255,255,0.14)',
          border: '1.5px solid rgba(255,255,255,0.45)',
          borderRadius: 100, cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800,
          color: '#fff', letterSpacing: '0.01em',
        }}
      >
        Skip
      </button>

      <div key={step} style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 380 }}>

        {card.kind === 'digi' && (
          <>
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'gcFloat 3.2s ease-in-out infinite' }}>
              <span aria-hidden style={{ position: 'absolute', width: 210, height: 210, borderRadius: '50%', background: 'radial-gradient(circle, rgba(237,195,95,0.42) 0%, rgba(237,195,95,0) 68%)', animation: 'gcGlow 2.6s ease-in-out infinite' }} />
              <span style={{ position: 'relative', animation: 'gcFriendPop 0.65s cubic-bezier(0.34,1.56,0.64,1)' }}>
                <DigiCharacter mood="happy" size={140} />
              </span>
            </span>
            <div style={{ ...eyebrow, marginTop: 20 }}>Your guiding star</div>
            <div style={headline}>Hi {name}! I&apos;m DiGi</div>
            <p style={{ ...body, marginTop: 8 }}>
              I am with you every day. Now meet my family of Planet Friends. Do your jobs, earn your device time, and they come to join us one by one.
            </p>
          </>
        )}

        {friend && (
          <>
            <div style={eyebrow}>
              {isYours ? 'Already yours' : isNext ? 'Earn me next' : `Planet Friend ${friend.stageId} of 5`}
            </div>

            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12, animation: 'gcFloat 3.2s ease-in-out infinite' }}>
              <span aria-hidden style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: `radial-gradient(circle, ${friend.colour}${isYours || isNext ? '55' : '2E'} 0%, ${friend.colour}00 68%)`, animation: 'gcGlow 2.6s ease-in-out infinite' }} />
              {/* The circle plate under the friend (the Happy Newspaper
                  pass): a pale disc of the friend's own colour, so the cutout
                  reads as a page rather than a sticker on the dark. */}
              <span aria-hidden style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: `color-mix(in srgb, ${friend.colour} 28%, #FEF7E0)`, border: '2px solid var(--ink)', boxSizing: 'border-box' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={friend.cutout} alt={friend.name} width={196} height={196}
                style={{
                  position: 'relative', objectFit: 'contain',
                  // A friend still to come is dimmed, so the collection reads at
                  // a glance, but never so dark they cannot see who it is.
                  filter: isYours
                    ? 'drop-shadow(0 14px 16px rgba(0,0,0,0.45))'
                    : 'grayscale(0.55) brightness(0.92) drop-shadow(0 14px 16px rgba(0,0,0,0.45))',
                  animation: 'gcFriendPop 0.65s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            </span>

            <div style={headline}>{friend.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: friend.colour, marginBottom: 10 }}>
              {friend.action} · {friend.ages}
            </div>
            <p style={{ ...body, marginBottom: 14 }}>{friend.intro}</p>

            {/* The plain answer to how do I get this one. Never a bare padlock. */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: isYours ? 'rgba(47,143,107,0.22)' : 'rgba(255,255,255,0.1)',
              border: `1.5px solid ${isYours ? 'rgba(104,197,159,0.6)' : 'rgba(255,255,255,0.22)'}`,
              borderRadius: 100, padding: '9px 16px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              color: isYours ? '#9FE3C4' : white,
            }}>
              {isYours
                ? <>✓ {friend.name} is yours</>
                : streaksAway === 1
                ? <>🔥 One more streak</>
                : <>🔥 {streaksAway} streaks away</>}
            </div>
          </>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); advance() }}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '16px',
          padding: '16px 32px', cursor: 'pointer', minWidth: 210, marginTop: 26,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        {step < total - 1 ? 'Next ▶' : "Let's go! ⭐"}
      </button>

      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {cards.map((_, i) => (
          <span key={i} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 100, background: i === step ? 'var(--terracotta)' : 'rgba(255,255,255,0.25)', transition: 'width 0.25s ease' }} />
        ))}
      </div>

      <style>{`
        @keyframes gcIntroIn { from { opacity: 0; transform: translateY(10px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes gcFriendPop { 0% { opacity: 0; transform: scale(0.4) translateY(12px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
        @keyframes gcFloat { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes gcGlow { 0%, 100% { opacity: 0.55; transform: scale(0.94) } 50% { opacity: 1; transform: scale(1.06) } }
        @media (prefers-reduced-motion: reduce) {
          [style*="gcFloat"], [style*="gcGlow"] { animation: none !important }
        }
      `}</style>
    </div>
  )
}
