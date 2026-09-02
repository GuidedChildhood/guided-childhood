'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import { streaksForFriend } from '@/lib/pathway/streak-unlock'
import type { StageCharacter } from '@/lib/content/stage-characters'

// A Planet Friend comes home.
//
// Justin, 6 August 2026: "Can we make even one is earn[ed] there is a big
// animated celebration ... a rocket goes into space, lands on Mars, picks up a
// relevant family planet friend and brings [it] home back down to earth and
// pops up filling their screen."
//
// Until now, earning one was a sentence. It appeared inside the streak takeover
// as "A new friend is on the way to your sticker book", under a fire emoji and a
// week of dots, and then the child had to go and find it. Fifty eight completed
// days at the top of the ladder, announced in body copy.
//
// MOBBIN FIRST
//
// search_screens on reward and collection moments: Discord, Finch, (Not Boring)
// Weather, (Not Boring) Vibes, Me+, Deepstash, Nibble, Duolingo. Every one of
// them is the same six parts, and this screen is those six parts in our colours:
//
//   1. A full screen takeover. No nav, no card, nothing else on screen.
//   2. The thing you won, huge and centred, about a third of the height.
//   3. Its name once, in display weight.
//   4. A line saying WHY it came. Deepstash: "Get to day 7 of your reading
//      streak". (Not Boring) Vibes: "you've released this spirit by reaching 1
//      hour of focus". Ours names the days, because the days are the promise.
//   5. Exactly one way out.
//   6. Short motion that lands, overshoots and settles. Confetti is never the
//      subject.
//
// The two closest to us are Discord's "You've collected DISXCORE Headset, added
// to your collection" and (Not Boring) Vibes, a dark takeover with a mono
// eyebrow and a ribbon naming what earned it. That is already the passport's
// language, so this screen is the passport at night.
//
// WHY THE ARRIVAL IS NOT PART OF ANY VIDEO
//
// The journey is generic and the arrival is real. The Friend who lands has to be
// the child's ACTUAL Friend in the same cutout art their sticker book uses, so
// the thing that filled the screen is the thing they then go and find. A
// pre rendered character would be a second copy of the art, and it would drift
// the first time a Friend is redrawn, which has already happened once to Nova.
//
// It is also why one journey covers all five rather than five clips covering one
// each, and why a sixth Friend would need no new footage.
//
// Pass `rocketVideo` and the flight beats become that file; the arrival beat is
// untouched either way.

type Beat = 'flight' | 'arrival'

export default function KidFriendArrival({
  friend,
  completedStreaks,
  childName,
  rocketVideo: rocketVideoProp,
  onClose,
  onOpenBook,
}: {
  friend: StageCharacter
  /** Completed days at the moment it was earned, for the line that says why. */
  completedStreaks: number
  childName?: string
  /** Optional MP4 for the four flight beats. Without one, the flight is drawn. */
  rocketVideo?: string
  onClose: () => void
  /** Offered as the way out, so the moment ends inside the book it belongs to. */
  onOpenBook?: () => void
}) {
  const [beat, setBeat] = useState<Beat>('flight')
  const stageRef = useRef<HTMLDivElement>(null)
  const skipped = useRef(false)

  // THE VIDEO GETS TWO SECONDS. Justin, 2 September 2026: "it does a
  // celebration but seemed to freeze." On a slow connection the ten second
  // clip was a dark sky with nothing moving until the net under it fired at
  // eleven seconds, which is what a freeze looks like. If the clip has not
  // started playing two seconds in, it is dropped and the drawn flight runs
  // instead, which needs no network at all. And a Skip sits in the corner
  // the whole time, because a tap anywhere already skipped and nobody knew.
  const [useVideo, setUseVideo] = useState(!!rocketVideoProp)
  const playing = useRef(false)
  const rocketVideo = useVideo ? rocketVideoProp : undefined
  useEffect(() => {
    if (!rocketVideoProp) return
    const t = window.setTimeout(() => { if (!playing.current) setUseVideo(false) }, 2000)
    return () => window.clearTimeout(t)
  }, [rocketVideoProp])

  // Reduced motion goes straight to the arrival. The flight is the decoration;
  // the Friend and the reason are the content, and a child who has asked their
  // phone for less movement should still get both.
  const [reduced] = useState(() => {
    if (typeof window === 'undefined') return false
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
  })

  // One way to reach the arrival, whether the timeline got there, a tap skipped
  // it, or reduced motion never started it. Guarded so a tap during the last
  // frames cannot fire the sound twice.
  const land = useRef(() => {})
  land.current = () => {
    if (skipped.current) return
    skipped.current = true
    setBeat('arrival')
    try { playKidSound('done') } catch { /* sound off */ }
    try { navigator.vibrate?.([18, 60, 34]) } catch { /* no haptics */ }
  }

  useEffect(() => {
    if (reduced) { land.current(); return }
    // The drawn flight is timed here. The video is timed by its own `onEnded`,
    // and this is only the net under it: longer than the ten second clip, so a
    // clip that plays normally is never cut short, and short enough that a
    // device which silently refuses to play it still reaches the Friend.
    const FLIGHT_MS = rocketVideo ? 11500 : 4300
    const t = window.setTimeout(() => land.current(), FLIGHT_MS)
    return () => window.clearTimeout(t)
  }, [reduced, rocketVideo])

  // Escape closes, the same as every other takeover in the child app. A full
  // screen with one exit is a trap on a device where the back gesture is not
  // obvious.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // The drawn flight: lift off, cross, collect, home. Four beats in four and a
  // bit seconds, which is about as long as a child will watch something they
  // cannot touch.
  useEffect(() => {
    if (beat !== 'flight' || reduced || rocketVideo || !stageRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.set('.gc-fa-rocket', { xPercent: -50, yPercent: -50 })
        // LIFT OFF. Off the little Earth, wobbling, gathering speed.
        .to('.gc-fa-rocket', { top: '58%', duration: 0.55, ease: 'power2.in' })
        .to('.gc-fa-rocket', { rotate: -8, duration: 0.3, ease: 'sine.inOut' }, '<')
        .to('.gc-fa-earth', { y: 90, opacity: 0.55, duration: 1.1, ease: 'power1.in' }, '<')
        // CROSS. Stars rush past, the planet grows in the Friend's own colour.
        .to('.gc-fa-star', { y: 240, duration: 1.1, ease: 'none', stagger: { each: 0.012, from: 'random' } }, '<0.2')
        .to('.gc-fa-rocket', { top: '30%', rotate: 6, duration: 0.85, ease: 'power1.inOut' })
        .to('.gc-fa-planet', { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)' }, '<')
        // COLLECT. It reaches the planet, the pod glows, the rocket turns over.
        .to('.gc-fa-rocket', { top: '23%', duration: 0.35, ease: 'power2.out' })
        .to('.gc-fa-glow', { opacity: 1, scale: 1.35, duration: 0.4, ease: 'power2.out' }, '<')
        .to('.gc-fa-rocket', { rotate: 186, duration: 0.5, ease: 'back.inOut(1.2)' })
        .to('.gc-fa-glow', { opacity: 0, scale: 0.5, duration: 0.3 }, '<')
        // HOME. Straight at the viewer, growing until it is the whole screen.
        .to('.gc-fa-planet', { scale: 0.5, opacity: 0, duration: 0.6, ease: 'power1.in' }, '<0.1')
        .to('.gc-fa-rocket', { top: '72%', scale: 3.4, duration: 0.75, ease: 'power3.in' })
        .to('.gc-fa-flash', { opacity: 1, duration: 0.28, ease: 'power2.in' }, '<0.42')
    }, stageRef)
    return () => ctx.revert()
  }, [beat, reduced, rocketVideo])

  // The arrival: the real Friend, overshooting in and settling.
  //
  // fromTo with an explicit finish and clearProps, not from. `from` leaves the
  // element carrying an inline opacity for the length of the tween, and the
  // cutout image failing to load re-renders this subtree partway through, which
  // stranded the button at opacity 0.34 and made the only way out of the
  // takeover invisible. Caught by screenshotting it rather than by reading it.
  // An explicit end state plus clearProps means the worst case is the text
  // appearing without its slide, never a control a child cannot see.
  useEffect(() => {
    if (beat !== 'arrival' || reduced || !stageRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.gc-fa-hero',
        { scale: 0.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)', clearProps: 'all' })
      // Opacity only. Each ray carries its own rotate in an inline transform,
      // and handing that same property to GSAP as well is how a fan of light
      // turns into twelve rays all pointing north.
      gsap.fromTo('.gc-fa-ray',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.025, delay: 0.1, clearProps: 'opacity' })
      gsap.fromTo('.gc-fa-say',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.09, delay: 0.42, clearProps: 'all' })
    }, stageRef)
    return () => ctx.revert()
  }, [beat, reduced])

  const days = streaksForFriend(friend.stageId)
  // Rays and stars are fixed rather than random, so the server and the browser
  // draw the same screen and React does not throw the whole takeover away on
  // hydration.
  const rays = Array.from({ length: 12 }, (_, i) => i * 30)
  const stars = STARS

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${friend.name} is home`}
      ref={stageRef}
      onClick={() => (beat === 'flight' ? land.current() : undefined)}
      style={{
        position: 'fixed', inset: 0, zIndex: 210, overflow: 'hidden',
        background: 'radial-gradient(120% 80% at 50% 12%, #23304A 0%, #161E30 46%, #0E1320 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 22px', textAlign: 'center',
        animation: 'gcFaIn 0.3s ease',
      }}
    >
      <style>{`
        @keyframes gcFaIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes gcFaBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes gcFaTwinkle { 0%,100% { opacity: 0.25 } 50% { opacity: 0.9 } }
        @media (prefers-reduced-motion: reduce) {
          .gc-fa-hero, .gc-fa-twinkle { animation: none !important }
        }
      `}</style>

      {beat === 'flight' && (
        <>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); land.current() }}
            style={{
              position: 'absolute', top: 'max(14px, env(safe-area-inset-top))', right: 14, zIndex: 3,
              background: 'rgba(255,255,255,0.14)', color: '#FFF6DE', border: '1.5px solid rgba(255,246,222,0.4)',
              borderRadius: 100, padding: '8px 14px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            Skip
          </button>
          {/* The night sky. Same stars either way, so the video and the drawn
              flight sit on one background and the cut between them is invisible. */}
          {stars.map((s, i) => (
            <span
              key={i}
              className={rocketVideo ? 'gc-fa-twinkle' : 'gc-fa-star gc-fa-twinkle'}
              style={{
                position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
                width: s.r, height: s.r, borderRadius: '50%', background: '#FFF6DE',
                animation: `gcFaTwinkle ${2 + (i % 5) * 0.4}s ease-in-out ${i * 0.11}s infinite`,
              }}
            />
          ))}

          {rocketVideo ? (
            // The Higgsfield journey, when there is one. Muted and inline so it
            // plays without a gesture on iOS, and it is decoration rather than
            // content, so a device that refuses it still lands on the arrival.
            <video
              src={rocketVideo}
              autoPlay muted playsInline
              onPlaying={() => { playing.current = true }}
              onError={() => setUseVideo(false)}
              onEnded={() => land.current()}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <>
              {/* The planet it is going to, in this Friend's own colour, so even
                  the journey belongs to them. */}
              <div className="gc-fa-planet" style={{
                position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%) scale(0.3)',
                width: 128, height: 128, borderRadius: '50%', opacity: 0,
                background: `radial-gradient(circle at 34% 30%, ${friend.colour} 0%, ${friend.colour} 52%, rgba(0,0,0,0.42) 100%)`,
                boxShadow: `0 0 54px ${friend.colour}70`,
              }}>
                <span style={{
                  position: 'absolute', top: '26%', left: '22%', width: 22, height: 16,
                  borderRadius: '50%', background: 'rgba(0,0,0,0.14)',
                }} />
                <span style={{
                  position: 'absolute', top: '56%', left: '54%', width: 30, height: 21,
                  borderRadius: '50%', background: 'rgba(0,0,0,0.12)',
                }} />
              </div>

              {/* The pod being collected. Deliberately a glow and not a
                  character: which Friend it is stays a secret until they land. */}
              <div className="gc-fa-glow" style={{
                position: 'absolute', top: '20%', left: '50%',
                transform: 'translate(-50%,-50%) scale(0.5)', opacity: 0,
                width: 96, height: 96, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,236,183,0.95) 0%, rgba(237,195,95,0.42) 46%, rgba(237,195,95,0) 72%)',
              }} />

              <Rocket />

              {/* Home, at the bottom, so the journey has somewhere to come back
                  to and the child can see it leave from a place. */}
              <div className="gc-fa-earth" style={{
                position: 'absolute', bottom: -108, left: '50%', transform: 'translateX(-50%)',
                width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 26%, #6FC2E8 0%, #3E8FC4 46%, #1E5C8C 100%)',
                boxShadow: '0 -14px 60px rgba(111,194,232,0.35)',
              }}>
                <span style={{
                  position: 'absolute', top: '22%', left: '18%', width: 96, height: 44,
                  borderRadius: '48% 52% 60% 40%', background: '#5FAE63',
                }} />
                <span style={{
                  position: 'absolute', top: '46%', left: '54%', width: 70, height: 52,
                  borderRadius: '54% 46% 40% 60%', background: '#6BBB6E',
                }} />
              </div>

              {/* The flash the arrival cuts out of. */}
              <div className="gc-fa-flash" style={{
                position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none',
                background: 'radial-gradient(circle at 50% 62%, #FFF3D2 0%, #FFE9A8 38%, rgba(255,233,168,0) 78%)',
              }} />
            </>
          )}

          {/* Tapping skips. A celebration a child cannot get out of is a
              cutscene, and the fourth time they see it they will want the
              Friend, not the trip. */}
          <span style={{
            // Above the safe area and clear of the Earth, which it was sitting
            // on top of and reading as a label for the planet.
            position: 'absolute', left: 0, right: 0,
            bottom: 'calc(20px + env(safe-area-inset-bottom))',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,246,222,0.62)',
            textShadow: '0 1px 6px rgba(14,19,32,0.9)',
          }}>
            Tap to skip
          </span>
        </>
      )}

      {beat === 'arrival' && (
        <>
          {/* Light behind them, the (Not Boring) Weather and Me+ move: the thing
              you won is lit from behind so it reads as arriving rather than
              sitting there.
              The rays live INSIDE the hero box rather than at a fixed 30% down
              the screen. Absolutely placed they were centred on nothing, so on a
              390 wide phone twelve of them fanned out past the Friend and ruled
              straight through the name and both lines of copy, which read as a
              compass rose rather than as light. Short, inside, and behind. */}
          <div style={{
            position: 'relative',
            width: 'min(62vw, 260px)', height: 'min(62vw, 260px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* The glow does most of the work, in the Friend's own colour. */}
            <div className="gc-fa-hero" style={{
              position: 'absolute', inset: '-18%', borderRadius: '50%', pointerEvents: 'none',
              background: `radial-gradient(circle, ${friend.colour}44 0%, ${friend.colour}1F 42%, rgba(0,0,0,0) 70%)`,
            }} />

            {/* Short strokes on a ring, not spokes from a point. Drawn from the
                centre outward they were 96px long inside a 260px character, so
                every one of them was either hidden behind the Friend or, on the
                frame before the art loads, converging into a twelve pointed
                asterisk that read as a compass. Pushed out past the silhouette
                they do what (Not Boring) Weather's do: sit around the thing you
                won and make it look lit. */}
            {rays.map(deg => (
              <span key={deg} className="gc-fa-ray" aria-hidden style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 3, height: 'min(6vw, 26px)', borderRadius: 3, pointerEvents: 'none',
                background: 'linear-gradient(to top, rgba(237,195,95,0.12) 0%, rgba(237,195,95,0.8) 100%)',
                transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(calc(min(30vw, 128px) * -1))`,
              }} />
            ))}

            {/* The circle plate (the Happy Newspaper pass): a pale disc in the
                friend's colour behind the cutout, inside the rays. */}
            <span aria-hidden style={{ position: 'absolute', inset: '9%', borderRadius: '50%', background: `color-mix(in srgb, ${friend.colour} 30%, #FEF7E0)`, border: '2px solid var(--ink)', boxSizing: 'border-box' }} />
            <div className="gc-fa-hero" style={{
              position: 'absolute', inset: 0,
              animation: 'gcFaBob 3.4s ease-in-out infinite',
            }}>
              <Image
                src={friend.cutout}
                alt={friend.name}
                fill
                sizes="260px"
                style={{ objectFit: 'contain', filter: `drop-shadow(0 18px 34px ${friend.colour}66)` }}
                priority
              />
            </div>
          </div>

          <span className="gc-fa-say" style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#EDC35F',
            marginTop: 18,
          }}>
            New Planet Friend
          </span>

          <h2 className="gc-fa-say" style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(2.4rem, 13vw, 3.6rem)', color: '#FFF6DE',
            lineHeight: 1, letterSpacing: '-0.03em', margin: '8px 0 0',
          }}>
            {friend.name}
          </h2>

          {/* The line that says WHY, which is the part every one of the Mobbin
              screens has and the part our old sentence was missing. The number
              is the promise, so the number is what gets said. */}
          <p className="gc-fa-say" style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-md)',
            color: '#FFE9A8', lineHeight: 1.45, margin: '12px 0 0', maxWidth: 330,
          }}>
            {days} full days{childName ? `, ${childName}` : ''}. You did every one of them.
          </p>

          <p className="gc-fa-say" style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)',
            color: 'rgba(255,246,222,0.72)', lineHeight: 1.5, margin: '8px 0 0', maxWidth: 330,
          }}>
            {friend.role
              ? `${friend.name} is here for ${friend.role}. Their sticker is in your book now.`
              : `Their sticker is in your book now.`}
          </p>

          {/* One way out, and it goes to the book rather than back to where they
              were. Discord's "Use Now": the collection moment should end inside
              the collection. */}
          <button
            className="gc-fa-say"
            onClick={() => { playKidSound('tap'); if (onOpenBook) onOpenBook(); else onClose() }}
            style={{
              marginTop: 26, padding: '15px 34px', borderRadius: 16, border: 'none',
              background: 'var(--terracotta, #EDC35F)', color: 'var(--ink, #1A1A2E)', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
              boxShadow: '0 5px 0 var(--terracotta-dark, #C99A28)',
            }}
          >
            {onOpenBook ? 'See them in my book' : 'Brilliant'}
          </button>

          {onOpenBook && (
            <button
              onClick={() => { playKidSound('tap'); onClose() }}
              style={{
                marginTop: 12, padding: '8px 14px', borderRadius: 12, border: 'none',
                background: 'transparent', color: 'rgba(255,246,222,0.6)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)',
              }}
            >
              Not now
            </button>
          )}
        </>
      )}
    </div>
  )
}

// Ours, drawn, so there is no asset to load and it is the same rocket on every
// device. Chunky and round, the way the Friends are.
function Rocket() {
  return (
    <div className="gc-fa-rocket" style={{ position: 'absolute', top: '82%', left: '50%', width: 62 }}>
      <svg viewBox="0 0 62 104" width="62" height="104" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
        {/* the flame, under everything */}
        <ellipse cx="31" cy="93" rx="11" ry="17" fill="#F2994A" opacity="0.9" />
        <ellipse cx="31" cy="89" rx="6" ry="11" fill="#FFE9A8" />
        {/* fins */}
        <path d="M17 62 L5 84 L17 79 Z" fill="#C0392B" />
        <path d="M45 62 L57 84 L45 79 Z" fill="#C0392B" />
        {/* body */}
        <path d="M31 2 C44 16 47 38 47 58 L47 79 L15 79 L15 58 C15 38 18 16 31 2 Z" fill="#FFF6DE" />
        <path d="M31 2 C44 16 47 38 47 58 L47 79 L36 79 L36 6 Z" fill="#EFE3C6" />
        {/* nose */}
        <path d="M31 2 C37 9 41 18 43 27 L19 27 C21 18 25 9 31 2 Z" fill="#EDC35F" />
        {/* window */}
        <circle cx="31" cy="44" r="11" fill="#2E6F8E" />
        <circle cx="31" cy="44" r="8" fill="#7FC4E8" />
        <circle cx="27" cy="40" r="3" fill="#FFF6DE" opacity="0.85" />
      </svg>
    </div>
  )
}

// Fixed positions, not random. This component server renders, and a star field
// that differs between the server and the browser makes React discard the whole
// takeover on hydration, which is the one screen where a flicker is expensive.
const STARS: { x: number; y: number; r: number }[] = [
  { x: 8, y: 12, r: 3 }, { x: 22, y: 6, r: 2 }, { x: 37, y: 17, r: 2 }, { x: 54, y: 8, r: 3 },
  { x: 68, y: 14, r: 2 }, { x: 83, y: 5, r: 3 }, { x: 92, y: 19, r: 2 }, { x: 14, y: 27, r: 2 },
  { x: 29, y: 34, r: 3 }, { x: 46, y: 28, r: 2 }, { x: 61, y: 36, r: 2 }, { x: 77, y: 30, r: 3 },
  { x: 90, y: 41, r: 2 }, { x: 5, y: 45, r: 2 }, { x: 19, y: 52, r: 3 }, { x: 34, y: 47, r: 2 },
  { x: 52, y: 55, r: 2 }, { x: 66, y: 49, r: 3 }, { x: 81, y: 58, r: 2 }, { x: 95, y: 52, r: 2 },
  { x: 11, y: 64, r: 3 }, { x: 26, y: 71, r: 2 }, { x: 43, y: 66, r: 2 }, { x: 58, y: 74, r: 3 },
  { x: 72, y: 68, r: 2 }, { x: 87, y: 76, r: 2 }, { x: 3, y: 80, r: 2 }, { x: 40, y: 85, r: 3 },
]
