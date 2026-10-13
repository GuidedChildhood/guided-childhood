'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// THE FIVE ARE DONE, AND THE WHOLE FAMILY COMES OUT TO SAY SO.
//
// Justin, 13 October 2026, with the rocket on Teo's phone: "can we build a
// better animation for when five are done? ... an animation introducing each
// family planet friend popping up one at a time doing a Michael Jackson
// moonwalk, each of them introducing five top tips for earning stars."
//
// So when the day lands, the stage goes dark, a spotlight comes up, and the
// five Planet Friends moonwalk on one at a time: in from the right, gliding
// BACKWARDS in four smooth steps while leaning back, a spin, up on the toes,
// and then the tip. One Friend, one tip, one tap to the next. The tips are all
// true of the app, because a tip a child acts on and finds does nothing is
// worse than no tip:
//
//   jobs are paid on the grown up's yes           (api/quests/approve)
//   jobs before screens                           (the chores gate)
//   a lesson pays, and 100% pays a bonus star     (the lessons tab)
//   a child can ask for a new job                 (/k/[token]/suggest)
//   full days in a row bring the next Friend home (lib/pathway/streak-unlock)
//
// Each tip is in the Friend's own register from digi-squad/README.md: Pebble
// bouncy, Bloop playful, Orbit level, Nova and Cosmo still.
//
// Every Friend moonwalks, earned or not, the same way the squad intro shows the
// whole family: seeing Cosmo dance on day one is the thing worth working for.
// Skip is in the corner the whole time and a tap anywhere moves on, because a
// celebration a child cannot get out of is a trap. Reduced motion gets the same
// Friends and the same tips with no dancing.

const TIPS: Record<string, string> = {
  pebble: 'Tick your job the moment it is done. When your grown up says yes, the stars are yours!',
  bloop: 'Jobs first, then screens. Same order every day and it gets really easy.',
  orbit: 'Lessons earn stars too. Get every answer right and you get a bonus star.',
  nova: 'Got an idea for a job? Ask your grown up for it. A new job means new stars.',
  cosmo: 'Do all five again tomorrow. Full days in a row bring the next Friend home.',
}

const AUTO_MS = 6500

export default function KidFriendsParade({
  childName,
  onClose,
}: {
  childName?: string
  onClose: () => void
}) {
  const friends = STAGE_CHARACTERS
  const [i, setI] = useState(0)
  const done = i >= friends.length
  const stageRef = useRef<HTMLDivElement>(null)

  const [reduced] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
  })

  const next = () => {
    try { playKidSound('tap') } catch { /* sound off */ }
    setI(n => Math.min(n + 1, friends.length))
  }

  // Escape closes, like every takeover in the child app.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Each Friend waits long enough to read the tip aloud, then the next one
  // comes on. A tap gets there sooner.
  useEffect(() => {
    if (done) return
    const t = window.setTimeout(() => setI(n => n + 1), AUTO_MS)
    return () => window.clearTimeout(t)
  }, [i, done])

  // THE MOONWALK. The dancer starts off stage right and travels left while
  // leaning back, in four glides: each one a slow push and a quick settle, so
  // it reads as sliding backwards rather than walking. Then a spin (scaleX
  // through zero and back, which a flat cutout can do), up on the toes, and
  // the bubble pops. fromTo with clearProps on the bubble, the lesson from
  // KidFriendArrival: the words must never be stranded invisible. Only the
  // animated properties are cleared: clearProps 'all' wipes the whole inline
  // style, which took the bubble's cream card with it and left dark words on
  // the night sky (caught on the first screenshot).
  useEffect(() => {
    if (done || !stageRef.current) return
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.gc-fp-dancer', { x: 0, rotate: 0, scaleX: 1, y: 0 })
        gsap.fromTo('.gc-fp-bubble', { opacity: 0 }, { opacity: 1, duration: 0.3, clearProps: 'opacity' })
        return
      }
      const tl = gsap.timeline()
      tl.set('.gc-fp-dancer', { x: '70vw', rotate: -9, y: 0, scaleX: 1, opacity: 1 })
        .set('.gc-fp-bubble', { opacity: 0, scale: 0.6, y: 10 })
      for (let s = 0; s < 4; s++) {
        tl.to('.gc-fp-dancer', { x: `${52 - s * 17.5}vw`, duration: 0.42, ease: 'power2.out' })
          .to('.gc-fp-dancer', { y: -6, duration: 0.14, ease: 'sine.out' }, '<')
          .to('.gc-fp-dancer', { y: 0, duration: 0.14, ease: 'sine.in' }, '>')
      }
      tl.to('.gc-fp-dancer', { x: 0, rotate: 0, duration: 0.3, ease: 'power2.out' })
        .to('.gc-fp-dancer', { scaleX: -1, duration: 0.16, ease: 'sine.in' })
        .to('.gc-fp-dancer', { scaleX: 1, duration: 0.16, ease: 'sine.out' })
        .to('.gc-fp-dancer', { y: -16, duration: 0.18, ease: 'power2.out' })
        .to('.gc-fp-dancer', { y: 0, duration: 0.3, ease: 'bounce.out' })
        .fromTo('.gc-fp-bubble', { opacity: 0, scale: 0.6, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.8)', clearProps: 'opacity,transform' }, '<0.05')
      tl.call(() => { try { playKidSound('star') } catch { /* sound off */ } }, [], '<')
    }, stageRef)
    return () => ctx.revert()
  }, [i, done, reduced])

  const f = friends[Math.min(i, friends.length - 1)]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Planet Friends have tips for you"
      ref={stageRef}
      onClick={() => (done ? undefined : next())}
      style={{
        position: 'fixed', inset: 0, zIndex: 205, overflow: 'hidden',
        background: 'radial-gradient(120% 80% at 50% 12%, #23304A 0%, #161E30 46%, #0E1320 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 22px calc(28px + env(safe-area-inset-bottom, 0px))', textAlign: 'center',
        animation: 'gcFpIn 0.3s ease', cursor: done ? 'default' : 'pointer',
      }}
    >
      <style>{`
        @keyframes gcFpIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes gcFpTwinkle { 0%,100% { opacity: 0.25 } 50% { opacity: 0.9 } }
        @media (prefers-reduced-motion: reduce) { .gc-fp-twinkle { animation: none !important } }
      `}</style>

      {STARS.map((s, k) => (
        <span key={k} aria-hidden className="gc-fp-twinkle" style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, borderRadius: '50%',
          background: '#FFF6DE', animation: `gcFpTwinkle ${2.2 + (k % 5) * 0.4}s ease-in-out ${(k % 7) * 0.3}s infinite`,
        }} />
      ))}

      {!done && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onClose() }}
          style={{
            position: 'absolute', top: 'max(14px, env(safe-area-inset-top))', right: 14, zIndex: 3,
            background: 'rgba(255,255,255,0.14)', color: '#FFF6DE', border: '1.5px solid rgba(255,246,222,0.4)',
            borderRadius: 'var(--radius-pill)', padding: '8px 14px', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}
        >
          Skip
        </button>
      )}

      {done ? (
        // The curtain call: all five together, and one way out.
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 360 }}>
          <div aria-hidden style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            {friends.map((fr, k) => (
              <div key={fr.key} style={{ position: 'relative', width: 64, height: 64, margin: '0 -4px', transform: `translateY(${k % 2 ? -8 : 0}px)` }}>
                <Image src={fr.cutout} alt="" fill sizes="64px" style={{ objectFit: 'contain' }} />
              </div>
            ))}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 9vw, 2.6rem)',
            color: '#FFF6DE', lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0,
          }}>
            All five done{childName ? `, ${childName}` : ''}!
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-md)', color: '#FFE9A8', lineHeight: 1.45, margin: '10px 0 22px' }}>
            The whole family is proud of you. See you tomorrow.
          </p>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); try { playKidSound('done') } catch { /* sound off */ } onClose() }}
            style={{
              width: '100%', padding: '15px 18px', borderRadius: 'var(--radius-btn)', border: 'var(--edge)',
              background: '#EDC35F', color: 'var(--ink)', cursor: 'pointer', boxShadow: '0 5px 0 #B98E2A',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            }}
          >
            Brilliant ⭐
          </button>
        </div>
      ) : (
        <div key={f.key} style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#EDC35F', marginBottom: 6,
          }}>
            Top tip {i + 1} of {friends.length}
          </span>

          {/* The spotlight and the floor it lands on. */}
          <div style={{ position: 'relative', width: 'min(62vw, 240px)', height: 'min(62vw, 240px)' }}>
            <span aria-hidden style={{
              position: 'absolute', left: '50%', bottom: -6, transform: 'translateX(-50%)',
              width: '120%', height: 26, borderRadius: '50%',
              background: `radial-gradient(ellipse, ${f.colour}66 0%, rgba(0,0,0,0) 70%)`,
            }} />
            <span aria-hidden style={{
              position: 'absolute', inset: '-30% -20% 0', pointerEvents: 'none',
              background: `radial-gradient(60% 70% at 50% 60%, ${f.colour}33 0%, rgba(0,0,0,0) 70%)`,
            }} />
            <div className="gc-fp-dancer" style={{ position: 'absolute', inset: 0, transformOrigin: '50% 100%' }}>
              <Image
                src={f.cutout}
                alt={f.name}
                fill
                sizes="240px"
                style={{ objectFit: 'contain', filter: `drop-shadow(0 14px 26px ${f.colour}66)` }}
                priority
              />
            </div>
          </div>

          {/* The tip, in the Friend's voice and the Friend's colour. */}
          <div className="gc-fp-bubble" style={{
            marginTop: 18, background: '#FFF6DE', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
            boxShadow: `0 5px 0 ${f.colour}`, padding: '14px 16px', textAlign: 'left', width: '100%', boxSizing: 'border-box',
          }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: 4 }}>
              {f.name}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4 }}>
              {TIPS[f.key]}
            </span>
          </div>

          {/* Where they are: five dots, the current one in its Friend's colour. */}
          <div aria-hidden style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            {friends.map((fr, k) => (
              <span key={fr.key} style={{
                width: k === i ? 22 : 9, height: 9, borderRadius: 9, transition: 'width 0.2s',
                background: k <= i ? fr.colour : 'rgba(255,246,222,0.25)',
              }} />
            ))}
          </div>

          <button
            type="button"
            onClick={e => { e.stopPropagation(); next() }}
            style={{
              marginTop: 18, padding: '13px 30px', borderRadius: 'var(--radius-btn)', border: 'var(--edge)',
              background: '#EDC35F', color: 'var(--ink)', cursor: 'pointer', boxShadow: '0 5px 0 #B98E2A',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            }}
          >
            {i === friends.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </div>
  )
}

// Fixed, not random, so the server and the browser draw the same sky.
const STARS: { x: number; y: number; r: number }[] = [
  { x: 8, y: 12, r: 3 }, { x: 22, y: 6, r: 2 }, { x: 37, y: 17, r: 2 }, { x: 54, y: 8, r: 3 },
  { x: 68, y: 14, r: 2 }, { x: 83, y: 5, r: 3 }, { x: 92, y: 19, r: 2 }, { x: 14, y: 27, r: 2 },
  { x: 29, y: 34, r: 3 }, { x: 77, y: 30, r: 3 }, { x: 90, y: 41, r: 2 }, { x: 5, y: 45, r: 2 },
  { x: 95, y: 52, r: 2 }, { x: 11, y: 64, r: 3 }, { x: 88, y: 70, r: 2 }, { x: 6, y: 84, r: 2 },
  { x: 93, y: 88, r: 3 }, { x: 20, y: 92, r: 2 },
]
