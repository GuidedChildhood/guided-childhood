'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CHARACTERS } from '@gc/shared/schools-curriculum'
import { LOUD_FRIEND, LOUD_NAME, QUIET_FRIEND, QUIET_NAME } from '@/lib/languages/fr-friends'

// WHISPER OR SHOUT (17 November 2026).
//
// In the scheme's classrooms the teacher holds up the shy toy and the class
// sings quietly, holds up the loud one and they sing loudly. On our pages the
// two parts are Nova and Bloop (fr-friends.ts), and this is the holding up:
// tap Whisper and Nova leans in, small and soft; tap Shout and Bloop bounces
// big. Tap again to put them both back.
//
// Two shapes:
//   card   the pair side by side, on the approach page and the lesson page
//   board  two small buttons for the teach bar; the chosen friend stands in
//          the corner of the board, big enough for the back row
//
// THE ART is the approved Planet Friend cutout and its approved happy still,
// unaltered (visual system, section 16). The French touch is the frame: a
// bleu, blanc, rouge ribbon in the house pastels and one word each. A friend
// in a beret or a striped top is new art and waits for Justin (plan).
//
// THE MOTION is GSAP only and runs FROM the resting pose, so under reduced
// motion the pose is set with no movement and the chosen friend is simply
// shown, the other dimmed.

type Voice = 'whisper' | 'shout' | null

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NOVA = CHARACTERS[QUIET_FRIEND]
const BLOOP = CHARACTERS[LOUD_FRIEND]

/** The art for each friend in each moment: Bloop throws both arms up to shout. */
const artFor = (who: 'quiet' | 'loud', voice: Voice) =>
  who === 'loud' ? (voice === 'shout' && BLOOP.moods ? BLOOP.moods.happy : BLOOP.img) : NOVA.img

function useVoiceMotion(voice: Voice, quiet: React.RefObject<HTMLDivElement | null>, loud: React.RefObject<HTMLDivElement | null>, rings: React.RefObject<HTMLDivElement | null>, burst: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const q = quiet.current, l = loud.current
    if (!q || !l) return
    const extras = [rings.current, burst.current].filter(Boolean) as HTMLDivElement[]
    gsap.killTweensOf([q, l, ...extras, ...extras.flatMap(e => Array.from(e.children))])
    const rest = { x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1 }
    const dim = { opacity: 0.4, scale: 0.9 }
    const still = reduced()

    if (voice === null) {
      if (still) { gsap.set([q, l], rest); gsap.set(extras, { opacity: 0 }); return }
      gsap.to([q, l], { ...rest, duration: 0.4, ease: 'power2.out' })
      gsap.to(extras, { opacity: 0, duration: 0.2 })
      return
    }

    const [on, off] = voice === 'whisper' ? [q, l] : [l, q]
    if (still) { gsap.set(on, rest); gsap.set(off, dim); gsap.set(extras, { opacity: 0 }); return }

    gsap.to(off, { ...dim, x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'power2.out' })
    const tl = gsap.timeline()
    if (voice === 'whisper') {
      // Nova leans in, small and soft, and holds there: the Still register,
      // one deliberate move, then stillness. Two soft rings, once.
      tl.to(q, { opacity: 1, scale: 0.92, rotation: -7, x: 6, y: 4, duration: 0.9, ease: 'sine.inOut' })
      const r = rings.current
      if (r) {
        gsap.set(r, { opacity: 1 })
        tl.fromTo(Array.from(r.children), { scale: 0.6, opacity: 0.55 }, { scale: 1.25, opacity: 0, duration: 1.6, ease: 'sine.out', stagger: 0.5 }, 0.3)
      }
    } else {
      // Bloop bounces big: squash, spring, land, twice, and the shout lines
      // flick out from the plate.
      tl.to(l, { opacity: 1, scaleX: 1.12, scaleY: 0.86, y: 6, duration: 0.12, ease: 'power2.in' })
        .to(l, { scaleX: 0.94, scaleY: 1.14, y: -34, rotation: 6, duration: 0.28, ease: 'power3.out' })
        .to(l, { scaleX: 1.08, scaleY: 0.92, y: 0, rotation: 0, duration: 0.24, ease: 'bounce.out' })
        .to(l, { scaleX: 0.97, scaleY: 1.05, y: -16, rotation: -4, duration: 0.2, ease: 'power2.out' })
        .to(l, { scaleX: 1, scaleY: 1, y: 0, rotation: 0, duration: 0.3, ease: 'bounce.out' })
      const b = burst.current
      if (b) {
        gsap.set(b, { opacity: 1 })
        tl.fromTo(Array.from(b.children), { scaleY: 0.2, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.18, ease: 'back.out(3)', stagger: 0.04 }, 0.3)
          .to(Array.from(b.children), { opacity: 0, duration: 0.5, ease: 'sine.in' }, '+=0.5')
      }
    }
    return () => { tl.kill() }
  }, [voice, quiet, loud, rings, burst])
}

/** The pastel tricolour ribbon across the foot of a plate: the French touch, in house tokens. */
function Ribbon() {
  return (
    <span aria-hidden className="gc-ff-ribbon">
      <span style={{ background: 'var(--stage-2-bold)' }} />
      <span style={{ background: 'var(--white)' }} />
      <span style={{ background: 'var(--stage-3-bold)' }} />
    </span>
  )
}

function Plate({ who, voice, size, artRef, fxRef }: {
  who: 'quiet' | 'loud'
  voice: Voice
  size: number
  artRef: React.RefObject<HTMLDivElement | null>
  fxRef: React.RefObject<HTMLDivElement | null>
}) {
  const c = who === 'quiet' ? NOVA : BLOOP
  return (
    <div className="gc-ff-plate" style={{ ['--ff-size' as string]: `${size}px`, background: c.soft, borderColor: c.accent, boxShadow: `0 5px 0 ${c.accent}` }}>
      {who === 'quiet' ? (
        <div ref={fxRef} aria-hidden className="gc-ff-rings" style={{ opacity: 0 }}>
          <span style={{ borderColor: c.accent }} /><span style={{ borderColor: c.accent }} />
        </div>
      ) : (
        <div ref={fxRef} aria-hidden className="gc-ff-burst" style={{ opacity: 0 }}>
          {[-50, -25, 0, 25, 50].map(a => <span key={a} style={{ background: c.accent, transform: `rotate(${a}deg)` }} />)}
        </div>
      )}
      <div ref={artRef} className="gc-ff-art">
        {/* The approved cutout, unaltered. A plain img: fixed size, one CDN family. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artFor(who, voice)} alt="" draggable={false} />
      </div>
      <Ribbon />
    </div>
  )
}

/** The pair, side by side, with the whisper and shout buttons under them. */
export function FrenchFriendsCard() {
  const [voice, setVoice] = useState<Voice>(null)
  const quiet = useRef<HTMLDivElement>(null)
  const loud = useRef<HTMLDivElement>(null)
  const rings = useRef<HTMLDivElement>(null)
  const burst = useRef<HTMLDivElement>(null)
  useVoiceMotion(voice, quiet, loud, rings, burst)
  const toggle = (v: Exclude<Voice, null>) => setVoice(cur => (cur === v ? null : v))

  return (
    <div className="gc-ff">
      <div className="gc-ff-pair">
        <figure className="gc-ff-friend">
          <Plate who="quiet" voice={voice} size={132} artRef={quiet} fxRef={rings} />
          <figcaption>
            <b>{QUIET_NAME}</b>
            <span lang="fr" className="gc-ff-word">chut</span>
            <span className="gc-ff-role">Shy and calm. The class whispers.</span>
          </figcaption>
          <button type="button" className="btn btn-outline gc-ff-btn" aria-pressed={voice === 'whisper'} onClick={() => toggle('whisper')}>
            {voice === 'whisper' ? 'Back to normal' : <>Whisper<span className="gc-ff-long"> with {QUIET_NAME}</span></>}
          </button>
        </figure>
        <figure className="gc-ff-friend">
          <Plate who="loud" voice={voice} size={132} artRef={loud} fxRef={burst} />
          <figcaption>
            <b>{LOUD_NAME}</b>
            <span lang="fr" className="gc-ff-word">fort !</span>
            <span className="gc-ff-role">Loud and cheeky. The class shouts.</span>
          </figcaption>
          <button type="button" className="btn btn-outline gc-ff-btn" aria-pressed={voice === 'shout'} onClick={() => toggle('shout')}>
            {voice === 'shout' ? 'Back to normal' : <>Shout<span className="gc-ff-long"> with {LOUD_NAME}</span></>}
          </button>
        </figure>
      </div>
      <p className="gc-ff-live" aria-live="polite">
        {voice === 'whisper' ? `${QUIET_NAME} is up. Everyone sings it quietly.`
          : voice === 'shout' ? `${LOUD_NAME} is up. Everyone sings it loudly.`
          : 'Hold one up before a song. The class matches the friend.'}
      </p>
      <FriendsStyles />
    </div>
  )
}

/** The teach bar's two buttons, and the chosen friend standing in the corner of the board. */
export function FrenchFriendsBoard() {
  const [voice, setVoice] = useState<Voice>(null)
  const quiet = useRef<HTMLDivElement>(null)
  const loud = useRef<HTMLDivElement>(null)
  const rings = useRef<HTMLDivElement>(null)
  const burst = useRef<HTMLDivElement>(null)
  useVoiceMotion(voice, quiet, loud, rings, burst)
  const toggle = (v: Exclude<Voice, null>) => setVoice(cur => (cur === v ? null : v))

  return (
    <>
      <span className="gc-ff-bar" role="group" aria-label="Whisper or shout">
        <button type="button" aria-label="Whisper" aria-pressed={voice === 'whisper'} onClick={() => toggle('whisper')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={NOVA.img} alt="" /><span className="gc-ff-bar-word">Whisper</span>
        </button>
        <button type="button" aria-label="Shout" aria-pressed={voice === 'shout'} onClick={() => toggle('shout')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BLOOP.img} alt="" /><span className="gc-ff-bar-word">Shout</span>
        </button>
      </span>
      {/* Both friends stay mounted so the motion has something to move; only
          the chosen one is shown on the board. */}
      <div className="gc-ff-stage" aria-hidden={voice === null} data-voice={voice ?? 'none'}>
        <div className="gc-ff-stage-q"><Plate who="quiet" voice={voice} size={180} artRef={quiet} fxRef={rings} /><span lang="fr">chut</span></div>
        <div className="gc-ff-stage-l"><Plate who="loud" voice={voice} size={180} artRef={loud} fxRef={burst} /><span lang="fr">fort !</span></div>
      </div>
      <FriendsStyles />
    </>
  )
}

function FriendsStyles() {
  return (
    <style>{`
      .gc-ff { display: flex; flex-direction: column; gap: var(--space-3); }
      .gc-ff-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); }
      .gc-ff-friend { margin: 0; display: flex; flex-direction: column; align-items: center; gap: var(--space-2); text-align: center; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-tile); padding: var(--space-4) var(--space-3); }
      .gc-ff-friend figcaption { display: flex; flex-direction: column; align-items: center; gap: 2px; }
      .gc-ff-friend b { font-family: var(--font-display); font-weight: 900; font-size: var(--text-lg); color: var(--ink); }
      .gc-ff-word { font-family: var(--font-mono); font-size: var(--text-xs); letter-spacing: .08em; text-transform: uppercase; color: var(--terracotta-dark); }
      .gc-ff-role { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-soft); line-height: 1.5; }
      .gc-ff-btn { min-height: 44px; width: 100%; max-width: 240px; }
      .gc-ff-btn[aria-pressed="true"] { background: var(--butter); border-color: var(--butter-dark); }
      .gc-ff-live { margin: 0; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-soft); text-align: center; }
      .gc-ff-plate { position: relative; flex: none; width: var(--ff-size); height: var(--ff-size); border-radius: 50%; border: 2px solid; overflow: visible; }
      .gc-ff-art { position: absolute; inset: 10%; transform-origin: 50% 85%; }
      .gc-ff-art img { width: 100%; height: 100%; object-fit: contain; display: block; user-select: none; }
      .gc-ff-ribbon { position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%); display: flex; height: 10px; width: 44%; border-radius: var(--radius-pill); overflow: hidden; border: 1.5px solid var(--ink); }
      .gc-ff-ribbon > span { flex: 1 1 0; }
      .gc-ff-rings, .gc-ff-burst { position: absolute; inset: 0; pointer-events: none; }
      .gc-ff-rings > span { position: absolute; inset: -8%; border-radius: 50%; border: 2px solid; }
      .gc-ff-burst > span { position: absolute; left: calc(50% - 3px); top: -26%; width: 6px; height: 22%; border-radius: var(--radius-pill); transform-origin: 50% 330%; }
      .gc-ff-bar { display: inline-flex; gap: var(--space-2); }
      .gc-ff-bar button { display: inline-flex; align-items: center; gap: var(--space-1); min-height: 40px; padding: 0 var(--space-3) 0 var(--space-1); border-radius: var(--radius-btn); border: 1px solid var(--ink-soft); background: transparent; color: var(--cream); font-family: var(--font-display); font-weight: 800; font-size: var(--text-sm); cursor: pointer; }
      .gc-ff-bar button img { width: 30px; height: 30px; object-fit: contain; }
      .gc-ff-bar button[aria-pressed="true"] { background: var(--butter); border-color: var(--butter); color: var(--ink); }
      .gc-ff-bar button:focus-visible, .gc-ff-btn:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
      .gc-ff-stage { position: absolute; right: var(--space-4); bottom: var(--space-4); z-index: 5; pointer-events: none; }
      .gc-ff-stage > div { display: none; flex-direction: column; align-items: center; gap: var(--space-2); }
      .gc-ff-stage > div > span { font-family: var(--font-display); font-weight: 900; font-size: var(--text-xl); color: var(--ink); background: var(--cream); border-radius: var(--radius-pill); padding: 0 var(--space-3); }
      .gc-ff-stage[data-voice="whisper"] .gc-ff-stage-q, .gc-ff-stage[data-voice="shout"] .gc-ff-stage-l { display: flex; }
      @media (max-width: 560px) {
        .gc-ff-pair { gap: var(--space-2); }
        .gc-ff-friend { padding: var(--space-4) var(--space-2) var(--space-3); }
        .gc-ff-friend .gc-ff-plate { --ff-size: 96px !important; }
        .gc-ff-long { display: none; }
        .gc-ff-bar button { padding: 0 var(--space-1); }
        .gc-ff-bar { margin-left: auto; }
        .gc-ff-bar-word { display: none; }
        .gc-ff-stage .gc-ff-plate { --ff-size: 120px !important; }
        .gc-fr-teach-title { display: none; }
      }
    `}</style>
  )
}
