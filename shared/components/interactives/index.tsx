'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import DigiCharacter from '../DigiCharacter'
import FriendPlate from '../FriendPlate'
import HappyIcon, { isHappyIconName } from '../HappyIcon'
import PassportPage from '../PassportPage'
import { PASSPORT_STAGES, type PassportStage } from '../../passport-stages'
import { isTaught, markTaught, readTaught, unmarkTaught } from '../../schools-taught'
import { isCharacterKey } from '../../intro-characters'
import type { Register } from '../../friend-register'
import { WALL } from '../../wall-scale'

// The interactive layer: the eighth slide type. A lesson row names a
// component by key and passes config; the code lives here so a new
// interaction in one module is instantly available to all 21 (rule 6:
// content in the database, code in the app). Every interaction is tap
// based (projector and touch friendly, no drag), GSAP only, and has a
// described paper twin in the teacher notes for the no device room.

// --terracotta is the butter FILL: it is right behind dark ink on a button and
// wrong as ink itself. This eyebrow names what the class is about to do
// ("Signal meter, tap what you would do") and it measured 1.57:1 on cream,
// which is not a low contrast label, it is a barely visible one. The dark
// accent is the token meant for text, and it is the one the classroom variant
// re-points, so this label follows the wall scale up as well.
const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

// Checked at animation time so a settings change is honoured immediately.
// Under reduced motion each interaction jumps to its finished state or
// paces itself with text instead of movement; the teaching point always
// still lands, because the words carry it, not the spin.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── verdict-sort ──────────────────────────────────────────────────────
// Post cards the class sorts into verdict piles. Tap the class verdict, the
// tally counts it and the card turns over to its answer, then Next card flies
// it to the pile. The core detective drill for module 12 and its cousins.
// A card may name a drawn Happy News icon in place of its emoji avatar, and the
// finish a drawn icon in place of its emoji (26 September 2026, the smart
// glasses lesson: "use Happy News style icons"). The icon wins; a name we do
// not draw falls back to the emoji, as on the slides.
//
// THE REVEAL (7 October 2026). Every card has always carried its answer and a
// why, and the scripts for 25 of the 26 sorts say "tap the class verdict, read
// the reason" or "then reveal". The sort never showed either. It counted the
// vote and flew the card away, so a teacher following the script read out a
// reason the wall did not have, and the finish told the class every card had
// got a reason. Now the card turns over once the class has voted, showing the
// marked answer and its why, and the teacher moves on with Next card. The
// tallies still count what the class said, not what was marked.
//
// `items` is the same list under the name four lessons were written with
// (ks2-26, ks3-27, ks4-28 and ks4-29). Read only as `posts`, their sorts opened
// on the finish with every tally at nought and a five minute activity gone.
// Those cards have no handle or avatar, so the header draws without them.
type SortPost = { handle?: string; avatar?: string; icon?: string; text: string; answer?: number; why?: string }
function VerdictSort({ config, kidMode = false }: {
  // One child alone in their own app (plan v10, item 1.4): no class tally of
  // one, nought and nought, and the card speaks to "you", not "the class".
  kidMode?: boolean
  config: {
    verdicts?: string[]
    posts?: SortPost[]
    items?: SortPost[]
    doneIcon?: string
    // The three labels were hardcoded for the teen misinformation module,
    // which meant a Reception class sorting real from made up was told it
    // was "sorting the feed" and congratulated as a detective. Same drill,
    // wrong words. They are config now, with the old text as the default,
    // so module 12 is untouched and every other age can speak its own
    // language.
    label?: string
    doneTitle?: string
    doneBody?: string
    doneEmoji?: string
  }
}) {
  const verdicts = config.verdicts ?? ['Believe', 'Pause', 'Do not share']
  const posts = config.posts ?? config.items ?? []
  const label = kidMode ? 'Your turn · tap your verdict' : (config.label ?? 'Sort the feed · tap a verdict')
  const doneTitle = config.doneTitle ?? 'Feed sorted!'
  const doneBody = config.doneBody ?? 'Every card got a verdict and a reason. That is the whole skill.'
  const doneEmoji = config.doneEmoji ?? '🕵️'
  const [index, setIndex] = useState(0)
  const [tallies, setTallies] = useState<number[]>(verdicts.map(() => 0))
  // The class verdict on the card in front of the room, held while its answer
  // shows. Null means the class has not voted on this card yet.
  const [picked, setPicked] = useState<number | null>(null)
  const [leaving, setLeaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  const post = posts[index]
  const done = index >= posts.length

  const pick = (v: number) => {
    if (picked !== null || !post) return
    setPicked(v)
    setTallies(t => t.map((n, i) => (i === v ? n + 1 : n)))
  }

  // The card flies toward the side of the verdict the class gave it.
  const next = () => {
    if (picked === null || leaving) return
    const dir = picked === 0 ? -1 : picked === verdicts.length - 1 ? 1 : 0
    if (cardRef.current && !prefersReducedMotion()) {
      setLeaving(true)
      if (revealRef.current) gsap.to(revealRef.current, { opacity: 0, duration: 0.3, ease: 'power1.in' })
      gsap.to(cardRef.current, {
        x: dir * 320, y: -40, rotate: dir * 12, opacity: 0, scale: 0.8,
        duration: 0.5, ease: 'power2.in',
        onComplete: () => { setLeaving(false); setPicked(null); setIndex(i => i + 1) },
      })
    } else {
      setPicked(null); setIndex(i => i + 1)
    }
  }

  // The same card element carries every post, so whatever the fly out left on
  // it is still there when the next post arrives. The entrance used to reset
  // only opacity, its rise and scale, and after a first or last verdict the next
  // card came in 320px to the side (times the wall zoom) and tilted 12 degrees,
  // off the edge of the projector in six of the seven sorts the pilot review
  // ran. Every property the fly out touches is reset here, with or without
  // motion.
  useEffect(() => {
    const el = cardRef.current
    if (!el || done) return
    if (prefersReducedMotion()) { gsap.set(el, { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }); return }
    gsap.fromTo(el,
      { x: 0, rotate: 0, opacity: 0, y: 20, scale: 0.94 },
      { x: 0, rotate: 0, opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' })
  }, [index, done])

  useEffect(() => {
    if (picked === null || !revealRef.current || prefersReducedMotion()) return
    gsap.fromTo(revealRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
  }, [picked])

  // THE CARD TURNS OVER. Once the class has voted, the back of the card shows
  // the marked verdict, what the class said where it differs, and the why, and
  // Next card takes the place of the verdicts. Green when the class matched,
  // amber when it did not, the same pair the quiz answers use.
  //
  // FRONT AND BACK SHARE ONE CELL, and so do the verdicts and Next card. On the
  // wall this widget is zoomed to fit the room (useFitZoom), and a card that
  // grew as it turned would shrink the whole sort at the moment the teacher
  // reads the reason. So each card is as tall as the taller of its two sides
  // from the start, the back sized for the longest thing the class could have
  // said, and nothing moves when it turns. The first version put the reason
  // under the card and kept room for the longest reason in the deck: ks1-03
  // went from a wall zoom of 1.91 to 1.09 and clipped 155px on a laptop.
  // Turning the card costs only the gap between a card's text and its reason.
  const answerOf = (p: SortPost) =>
    Number.isInteger(p.answer) && verdicts[p.answer as number] !== undefined ? p.answer as number : null
  // The longest wrong verdict, which is the longest the back's top line can be.
  const longestMiss = (p: SortPost) => {
    const ans = answerOf(p)
    let best = ans === 0 ? Math.min(1, verdicts.length - 1) : 0
    verdicts.forEach((v, i) => { if (i !== ans && v.length > verdicts[best].length) best = i })
    return best
  }
  // One line saying how the class did, then the answer in bold opening its
  // own reason. A separate line for the answer cost a line of wall on every
  // card, and the back's height is what sets the zoom.
  const backOf = (p: SortPost, said: number) => {
    const ans = answerOf(p)
    const right = ans !== null && said === ans
    return (
      <>
        {ans !== null && (
          <span style={{ ...eyebrow, display: 'block', color: right ? 'var(--retro-green-dark)' : 'var(--stage-1-text)', marginBottom: '6px' }}>
            {kidMode
              ? (right ? 'You got it' : `You said ${verdicts[said]}`)
              : (right ? 'The class got it' : `The class said ${verdicts[said]}`)}
          </span>
        )}
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5 }}>
          {ans !== null && <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{verdicts[ans]}.{' '}</strong>}
          {p.why}
        </span>
      </>
    )
  }
  const turned = picked !== null
  const agreed = turned && !!post && answerOf(post) === picked
  const nextLabel = `${index === posts.length - 1 ? 'Finish the sort' : 'Next card'} →`

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>{label}</div>
      {/* Tallies. Not for one child: a tally of one is a scoreboard of nobody. */}
      {!kidMode && <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
        {verdicts.map((v, i) => (
          <span key={v} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: 'var(--ink)', background: 'var(--stage-1)', border: '1.5px solid var(--stage-1-bold)',
            borderRadius: 'var(--radius-pill)', padding: '6px 14px',
          }}>
            {v} · {tallies[i]}
          </span>
        ))}
      </div>}

      {done ? (
        <div style={{ padding: '30px 0' }}>
          <div style={{ fontSize: 'var(--text-3xl)', marginBottom: '8px' }}>
            {isHappyIconName(config.doneIcon) ? <HappyIcon name={config.doneIcon} size="1.4em" /> : doneEmoji}
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '4px' }}>{doneTitle}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>{doneBody}</p>
        </div>
      ) : (
        <>
          <div ref={cardRef} style={{
            maxWidth: '460px', margin: '0 auto 18px',
            background: !turned ? '#fff' : agreed ? 'var(--tint-green)' : 'var(--tint-amber)',
            border: `1.5px solid ${!turned ? 'var(--border)' : agreed ? 'var(--retro-green-dark)' : 'var(--stage-1-text)'}`,
            borderRadius: 'var(--radius-card)', padding: '16px 18px',
            boxShadow: '0 6px 0 var(--border)', textAlign: 'left',
            transition: 'background 0.2s, border-color 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              {(isHappyIconName(post.icon) || post.avatar) && (
                <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--stage-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', flexShrink: 0 }}>{isHappyIconName(post.icon) ? <HappyIcon name={post.icon} size={28} /> : post.avatar}</span>
              )}
              {post.handle && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{post.handle}</span>}
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>{index + 1} of {posts.length}</span>
            </div>
            <div style={{ display: 'grid' }}>
              <p style={{ gridArea: '1 / 1', visibility: turned ? 'hidden' : 'visible', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }}>{post.text}</p>
              <div aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden' }}>{backOf(post, longestMiss(post))}</div>
              {turned && <div ref={revealRef} role="status" data-sort-back style={{ gridArea: '1 / 1', alignSelf: 'start' }}>{backOf(post, picked)}</div>}
            </div>
          </div>
          <div style={{ display: 'grid' }}>
            {/* Ink on butter, the house button. The first and last verdicts used
                --green-dark and --coral, which are both butter now, under white
                text: 1.67:1 on a projector, readable only because the tallies
                above repeat the words. */}
            <div style={{ gridArea: '1 / 1', alignSelf: 'start', visibility: turned ? 'hidden' : 'visible', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {verdicts.map((v, i) => (
                <button key={v} type="button" onClick={() => pick(i)} disabled={turned} style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer',
                  color: 'var(--ink)', background: 'var(--terracotta)',
                  border: 'none', borderRadius: 'var(--radius-tile)', padding: '12px 18px',
                  boxShadow: '0 4px 0 var(--terracotta-dark)',
                }}>
                  {v}
                </button>
              ))}
            </div>
            <div style={{ gridArea: '1 / 1', alignSelf: 'start', visibility: turned ? 'visible' : 'hidden' }}>
              <button type="button" onClick={next} disabled={!turned || leaving} style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer',
                color: 'var(--ink)', background: 'var(--terracotta)', border: 'none',
                borderRadius: 'var(--radius-tile)', padding: '12px 22px', boxShadow: '0 4px 0 var(--terracotta-dark)',
              }}>
                {nextLabel}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── signal-meter ──────────────────────────────────────────────────────
// Tap an action, the signal bar grows by that action's weight. The point
// lands itself: watch time and rewatches dwarf a like. Feeds the algorithm
// literacy modules.
type SignalAction = { label: string; weight: number; emoji: string }
function SignalMeter({ config }: { config: { actions?: SignalAction[]; caption?: string } }) {
  const actions = config.actions ?? [
    { label: 'Like', weight: 1, emoji: '❤️' },
    { label: 'Comment', weight: 3, emoji: '💬' },
    { label: 'Watch to the end', weight: 8, emoji: '👀' },
    { label: 'Watch it again', weight: 12, emoji: '🔁' },
  ]
  const [signal, setSignal] = useState(0)
  const max = actions.reduce((s, a) => s + a.weight, 0) * 2
  const barRef = useRef<HTMLDivElement>(null)

  const tap = (w: number) => setSignal(s => Math.min(max, s + w))
  useEffect(() => {
    if (!barRef.current) return
    const width = `${Math.min(100, (signal / max) * 100)}%`
    if (prefersReducedMotion()) { barRef.current.style.width = width; return }
    gsap.to(barRef.current, { width, duration: 0.5, ease: 'power2.out' })
  }, [signal, max])

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>Signal meter · tap what you would do</div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.1rem, 2.6vw, 1.4rem)', color: 'var(--ink)', lineHeight: 1.35, maxWidth: '440px', margin: '0 auto 18px' }}>
        Every tap tells the feed &ldquo;more like this&rdquo;. Watch which taps shout loudest.
      </p>
      <div role="meter" aria-label="Signal strength" aria-valuemin={0} aria-valuemax={max} aria-valuenow={signal}
        style={{ height: '22px', borderRadius: 'var(--radius-pill)', background: 'var(--border)', overflow: 'hidden', maxWidth: '440px', margin: '0 auto 18px' }}>
        <div ref={barRef} style={{ height: '100%', width: '0%', borderRadius: 'var(--radius-pill)', background: 'linear-gradient(90deg, var(--terracotta), var(--coral, #D4600A))' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
        {actions.map(a => (
          <button key={a.label} onClick={() => tap(a.weight)} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
            color: 'var(--ink)', background: '#fff', border: '2px solid var(--border)', borderRadius: 'var(--radius-btn)',
            padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center',
          }}>
            <span style={{ fontSize: 'var(--text-xl)' }}>{a.emoji}</span>
            {a.label}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>+{a.weight} signal</span>
          </button>
        ))}
      </div>
      {config.caption && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '420px', margin: '18px auto 0' }}>{config.caption}</p>}
    </div>
  )
}

// ── star-breath ───────────────────────────────────────────────────────
// DiGi Junior, the golden star, breathing on a 4 second cycle. The calm
// pause companion, usable in every module. Since 13 September 2026 the
// module's own friend can lead it: a config that names a character breathes
// as that friend in the lesson's register, with the half time words under
// it, which is how every lesson got a pause beat without a film.
const REGISTERS: Register[] = ['bouncy', 'playful', 'level', 'still']
function StarBreath({ config, kidMode = false }: { kidMode?: boolean; config: { seconds?: number; character?: string; register?: string; heading?: string; prompt?: string } }) {
  const dur = config.seconds ?? 4
  const who = isCharacterKey(config.character) && config.character !== 'digi' ? config.character : null
  const register = REGISTERS.includes(config.register as Register) ? (config.register as Register) : 'playful'
  const starRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState('Breathe in')

  useEffect(() => {
    if (!starRef.current) return
    if (prefersReducedMotion()) {
      // The star holds still and the words keep the class breathing in time.
      const timer = setInterval(() => {
        setPhase(p => (p === 'Breathe in' ? 'Breathe out' : 'Breathe in'))
      }, dur * 1000)
      return () => { clearInterval(timer) }
    }
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(starRef.current, { scale: 1.35, duration: dur, ease: 'sine.inOut', onStart: () => setPhase('Breathe in') })
      .to(starRef.current, { scale: 1, duration: dur, ease: 'sine.inOut', onStart: () => setPhase('Breathe out') })
    return () => { tl.kill() }
  }, [dur])

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ ...eyebrow, marginBottom: '20px' }}>
        {kidMode
          // A child alone is not "everyone together", whatever the deck says.
          ? (config.heading ?? 'Star breath').replace(/\s*[!·]?\s*everyone together\s*$/i, '').trim() || 'Star breath'
          : (config.heading ?? 'Star breath · everyone together')}
      </div>
      <div ref={starRef} style={{ display: 'inline-flex', margin: '10px 0 24px', transformOrigin: 'center' }}>
        {who ? <FriendPlate character={who} register={register} mood="idle" size={130} /> : <DigiCharacter mood="idle" size={110} />}
      </div>
      {/* "Breathe in" / "Breathe out": the one word the room is following, so
          it takes the accent meant for text rather than the button fill. */}
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 3.4vw, 1.8rem)', color: 'var(--terracotta-dark)', letterSpacing: '-0.01em' }}>
        {phase}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '6px' }}>
        {config.prompt ?? 'Follow the star. In as it grows, out as it shrinks.'}
      </p>
    </div>
  )
}

// ── feed-loop ─────────────────────────────────────────────────────────
// The feedback loop drawn live: watch, signal, more of the same, watch
// more. Each lap runs faster, and after four laps the bubble closes
// around the loop. The algorithm literacy centrepiece.
function FeedLoop({ config }: { config: { laps?: number } }) {
  const laps = config.laps ?? 4
  const [running, setRunning] = useState(false)
  const [lap, setLap] = useState(0)
  const [bubbled, setBubbled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const NODES = [
    { emoji: '👀', label: 'You watch', top: '0%', left: '50%' },
    { emoji: '📡', label: 'The feed learns', top: '50%', left: '100%' },
    { emoji: '📦', label: 'More of the same', top: '100%', left: '50%' },
    { emoji: '🔁', label: 'You watch more', top: '50%', left: '0%' },
  ]

  const start = () => {
    if (running || bubbled || !dotRef.current) return
    if (prefersReducedMotion()) {
      // No spinning dot: jump straight to the closed bubble, the words
      // underneath explain the four laps that just happened.
      setLap(laps)
      setBubbled(true)
      if (ringRef.current) gsap.set(ringRef.current, { scale: 1, opacity: 1 })
      return
    }
    setRunning(true)
    const R = 110
    const tl = gsap.timeline({
      onComplete: () => {
        setRunning(false)
        setBubbled(true)
        if (ringRef.current) {
          gsap.fromTo(ringRef.current, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' })
        }
      },
    })
    for (let i = 0; i < laps; i++) {
      const dur = Math.max(0.5, 2.2 - i * 0.55) // each lap faster
      tl.to(dotRef.current, {
        motionPath: undefined, // keep dependency free: rotate a wrapper instead
        duration: 0,
      })
      tl.to(wrapRef.current, {
        rotation: `+=360`, duration: dur, ease: 'none',
        onStart: () => setLap(i + 1),
      })
    }
  }

  const reset = () => {
    setBubbled(false); setLap(0)
    if (ringRef.current) gsap.set(ringRef.current, { opacity: 0 })
    if (wrapRef.current) gsap.set(wrapRef.current, { rotation: 0 })
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>The feed loop · watch it close</div>
      {/* The node cards hang half outside the circle (translate -50%), so the
          box needs real margin above and below or the bottom card sits on
          top of the start button and eats its taps. Found the day feed-loop
          finally entered a lesson (migration 259). */}
      <div style={{ position: 'relative', width: '260px', height: '260px', margin: '40px auto 52px' }}>
        {/* Bubble ring, appears at the end */}
        <div ref={ringRef} style={{
          position: 'absolute', inset: '-16px', borderRadius: '50%',
          border: '3px solid var(--coral, #D4600A)', opacity: 0, pointerEvents: 'none',
        }} />
        {/* Track */}
        <div style={{ position: 'absolute', inset: '18px', borderRadius: '50%', border: '2px dashed var(--border)' }} />
        {/* Rotating dot */}
        <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
          <div ref={dotRef} style={{
            position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'var(--terracotta)', boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
          }} />
        </div>
        {/* Nodes */}
        {NODES.map(n => (
          <div key={n.label} style={{
            position: 'absolute', top: n.top, left: n.left, transform: 'translate(-50%, -50%)',
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)',
            padding: '8px 10px', width: '108px',
          }}>
            <div style={{ fontSize: 'var(--text-lg)' }}>{n.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.25 }}>{n.label}</div>
          </div>
        ))}
      </div>
      {bubbled ? (
        <>
          {/* --coral is the butter fill now, and butter on cream measured about
              1.6:1 on the pilot's ks2-06 wall. Amber ink keeps the warning warm. */}
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--stage-1-text)', marginBottom: '4px' }}>
            The bubble just closed.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', maxWidth: '380px', margin: '0 auto 14px', lineHeight: 1.6 }}>
            Four laps, each faster than the last, and now the feed only shows more of the same. Knowing the recipe is how you open it back up.
          </p>
          <button onClick={reset} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer', color: 'var(--ink)', background: '#fff', border: '2px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '11px 20px' }}>
            Run it again
          </button>
        </>
      ) : (
        <button onClick={start} disabled={running} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer',
          color: 'var(--ink)', background: 'var(--terracotta)', border: 'none', borderRadius: 'var(--radius-tile)',
          padding: '12px 24px', boxShadow: '0 4px 0 var(--terracotta-dark, #C99A28)', opacity: running ? 0.6 : 1,
        }}>
          {running ? `Lap ${lap} of ${laps}...` : 'Start watching'}
        </button>
      )}
    </div>
  )
}

// ── spread-race ───────────────────────────────────────────────────────
// Two posts race across the screen, the outrage one pulling ahead. Then
// the class calms the reactions and re runs it: the race tightens. The
// point about engineered outrage, made kinetic.
function SpreadRace({ config }: { config: { calm?: boolean } }) {
  const [phase, setPhase] = useState<'ready' | 'racing' | 'done' | 'calmDone'>('ready')
  const [shares, setShares] = useState({ outrage: 0, honest: 0 })
  const outrageRef = useRef<HTMLDivElement>(null)
  const honestRef = useRef<HTMLDivElement>(null)
  const dampened = phase === 'calmDone'

  const run = (calm: boolean) => {
    if (!outrageRef.current || !honestRef.current) return
    const outrageEnd = calm ? 235 : 240
    const honestEnd = calm ? 210 : 110
    const dur = 3
    const counters = { o: 0, h: 0 }
    const oTarget = calm ? 3100 : 9600
    const hTarget = calm ? 2600 : 1400
    if (prefersReducedMotion()) {
      // The finish line photograph instead of the race: same gap, no motion.
      gsap.set(outrageRef.current, { x: outrageEnd })
      gsap.set(honestRef.current, { x: honestEnd })
      setShares({ outrage: oTarget, honest: hTarget })
      setPhase(calm ? 'calmDone' : 'done')
      return
    }
    setPhase('racing')
    setShares({ outrage: 0, honest: 0 })
    gsap.set([outrageRef.current, honestRef.current], { x: 0 })
    gsap.to(counters, {
      o: oTarget, h: hTarget, duration: dur, ease: 'power1.in',
      onUpdate: () => setShares({ outrage: Math.round(counters.o), honest: Math.round(counters.h) }),
    })
    gsap.to(outrageRef.current, { x: outrageEnd, duration: dur, ease: calm ? 'power1.inOut' : 'power2.in' })
    gsap.to(honestRef.current, {
      x: honestEnd, duration: dur, ease: 'power1.inOut',
      onComplete: () => setPhase(calm ? 'calmDone' : 'done'),
    })
  }

  const lane: React.CSSProperties = { position: 'relative', height: '64px', background: 'var(--warm, #fff)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', marginBottom: '10px', overflow: 'hidden' }
  const racer: React.CSSProperties = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '8px', display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '7px 10px', width: '170px' }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>The spread race · same day, two posts</div>
      <div style={{ maxWidth: '460px', margin: '0 auto 14px', textAlign: 'left' }}>
        <div style={lane}>
          <div ref={outrageRef} style={racer}>
            <span style={{ fontSize: 'var(--text-xl)' }}>😡</span>
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>THEY are lying to you!!</span>
              {/* THE SHARE COUNTS, which are the whole point of the race and
                  were the two least readable things in the deck. The palette
                  consolidation aliased --coral-dark to the amber accent and
                  --green-dark to the butter FILL, so the outrage count read
                  2.58:1 and the honest count 1.67:1 on white, and the two
                  sides had quietly become the same colour anyway. Amber and
                  the deep sky ink are both already in the system, both clear
                  AAA on white, and they give the race back its two sides.
                  Named directly rather than through the aliases: an alias
                  resolves at :root, so the classroom variant cannot reach it. */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', fontWeight: 700 }}>↻ {shares.outrage.toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div style={lane}>
          <div ref={honestRef} style={racer}>
            <span style={{ fontSize: 'var(--text-xl)' }}>📰</span>
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>Careful, sourced report</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--stage-2-text)', fontWeight: 700 }}>↻ {shares.honest.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>
      {phase === 'ready' && (
        <button onClick={() => run(false)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer', color: 'var(--ink)', background: 'var(--terracotta)', border: 'none', borderRadius: 'var(--radius-tile)', padding: '12px 24px', boxShadow: '0 4px 0 var(--terracotta-dark, #C99A28)' }}>
          Run the race
        </button>
      )}
      {phase === 'done' && (
        <>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', maxWidth: '400px', margin: '0 auto 12px', lineHeight: 1.6 }}>
            <strong>The outrage post wins by miles.</strong> Not because it is true, because reactions are the fuel. Now calm the reactions: what if people paused instead of raging?
          </p>
          {/* Ink on butter like Run the race above it. --green-dark is butter
              now, so this was white on butter on the free sample's wall. */}
          <button onClick={() => run(true)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer', color: 'var(--ink)', background: 'var(--terracotta)', border: 'none', borderRadius: 'var(--radius-tile)', padding: '12px 24px', boxShadow: '0 4px 0 var(--terracotta-dark, #C99A28)' }}>
            Calm the reactions, race again
          </button>
        </>
      )}
      {dampened && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
          <strong>Look at the race now.</strong> When people pause instead of react, the fake loses its engine. Your pause is not nothing, it is the brake.
        </p>
      )}
    </div>
  )
}

// ── class-tally ───────────────────────────────────────────────────────
// The whole class check for no device rooms: the teacher taps hands
// counted per option and the bars animate. Works in every module.
function ClassTally({ config, kidMode = false }: { kidMode?: boolean; config: { question?: string; options?: string[] } }) {
  const question = config.question ?? 'What does the class think?'
  const options = config.options ?? ['Yes', 'Not sure', 'No']
  const [counts, setCounts] = useState<number[]>(options.map(() => 0))
  const total = counts.reduce((a, b) => a + b, 0)
  const [mine, setMine] = useState<number | null>(null)

  const bump = (i: number, d: number) =>
    setCounts(c => c.map((n, j) => (j === i ? Math.max(0, n + d) : n)))

  // One child alone: the tally becomes one tap on their own answer. A bar
  // chart of one hand is not a class picture, it is a child being counted.
  if (kidMode) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...eyebrow, marginBottom: '10px' }}>Your turn · tap your answer</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 2.8vw, 1.45rem)', color: 'var(--ink)', lineHeight: 1.35, maxWidth: '460px', margin: '0 auto 20px' }}>
          {question}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              aria-pressed={mine === i}
              onClick={() => setMine(i)}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
                background: mine === i ? 'var(--terracotta)' : '#fff',
                border: `1.5px solid ${mine === i ? 'var(--terracotta-dark)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-tile)', padding: '12px 16px', cursor: 'pointer',
                boxShadow: mine === i ? '0 4px 0 var(--terracotta-dark)' : '0 3px 0 var(--border)',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        {mine !== null && (
          <p role="status" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '14px', lineHeight: 1.5 }}>
            That is yours. There is no wrong answer here, only your reason.
          </p>
        )}
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>Class tally · hands up, teacher taps</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 2.8vw, 1.45rem)', color: 'var(--ink)', lineHeight: 1.35, maxWidth: '460px', margin: '0 auto 20px' }}>
        {question}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
        {options.map((opt, i) => {
          const pct = total > 0 ? (counts[i] / total) * 100 : 0
          return (
            <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => bump(i, -1)} aria-label={`One fewer for ${opt}`} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontWeight: 900, fontSize: 'var(--text-lg)', cursor: 'pointer', color: 'var(--ink-muted)', flexShrink: 0 }}>−</button>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{opt}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)' }}>{counts[i]}</span>
                </div>
                <div style={{ height: '12px', borderRadius: 'var(--radius-pill)', background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-pill)', background: 'linear-gradient(90deg, var(--terracotta), var(--coral, #D4600A))', transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1)' }} />
                </div>
              </div>
              <button onClick={() => bump(i, 1)} aria-label={`One more for ${opt}`} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-tile)', border: 'none', background: 'var(--terracotta)', fontWeight: 900, fontSize: 'var(--text-xl)', cursor: 'pointer', color: 'var(--ink)', boxShadow: '0 3px 0 var(--terracotta-dark, #C99A28)', flexShrink: 0 }}>+</button>
            </div>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '14px' }}>
        {total} hand{total === 1 ? '' : 's'} counted
      </p>
    </div>
  )
}


// THE PASSPORT BEAT: the class fills the page.
//
// Justin, 13 September 2026: the passport theme "carries through and updates
// for progression, fills up, makes sense, matches the other platform
// passport." Until this beat only lesson 1 mentioned the passport, as a digi
// slide the class watched. Every lesson with a page now ends on this: the
// page as it stands, one tap that fills today in, the ring and the area bar
// moving by one, and the room saying the word stamp.
//
// An interactive is an action under the council's four minute rule, so the
// closing stretch of watching gets shorter with this beat in it, never longer.
//
// The tap writes the device memory (shared/schools-taught): this screen, not
// a child. Tapping again unfills, so a preview the night before can be put
// back. What it never does is stamp: the seal stays ghosted because the stamp
// is the stage's, earned at home when the page is full and the big check is
// passed.
const isStage = (v: unknown): v is PassportStage => typeof v === 'string' && v in PASSPORT_STAGES

function PassportBeat({ config }: { config: { placement?: string; moduleId?: string; register?: string; heading?: string; prompt?: string; after?: string; button?: string } }) {
  const placement = isStage(config.placement) ? config.placement : null
  const moduleId = typeof config.moduleId === 'string' ? config.moduleId : ''
  const register = REGISTERS.includes(config.register as Register) ? (config.register as Register) : 'playful'
  const [taught, setTaught] = useState<string[]>([])
  const [filled, setFilled] = useState(false)
  const [live, setLive] = useState(false)
  // Width decides the layout, not the projector flag: a teacher previews the
  // wall on a phone, and a phone gets the tall page.
  const [wide, setWide] = useState(false)

  // The memory is read after mount so the server and the first client paint
  // agree, then the page draws whatever this screen already holds.
  useEffect(() => {
    setTaught(readTaught())
    setFilled(isTaught(moduleId))
    const mq = window.matchMedia('(min-width: 900px)')
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [moduleId])

  if (!placement) {
    // Never reached by a deck the migration wrote, but a hand edited slide
    // should say something true rather than nothing.
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', textAlign: 'center', padding: '20px' }}>
        No passport page today. The passport is the journey to sixteen, and this year group is past it.
      </p>
    )
  }

  const tap = () => {
    if (filled) { unmarkTaught(moduleId); setFilled(false); setLive(false) }
    else { markTaught(moduleId); setFilled(true); setLive(true) }
    setTaught(readTaught())
  }

  return (
    <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
      <div style={{ ...eyebrow, marginBottom: '14px' }}>{config.heading ?? 'The passport'}</div>
      <PassportPage placement={placement} moduleId={moduleId} taught={taught} filled={filled} animate={live} register={register} wide={wide} />
      <button
        type="button"
        onClick={tap}
        className="btn btn-gold"
        aria-pressed={filled}
        style={{ justifyContent: 'center', fontSize: 'var(--text-md)', minWidth: 220, margin: '16px auto 0' }}
      >
        {filled ? 'Filled in ✓' : (config.button ?? 'Fill the page')}
      </button>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: 400, margin: '12px auto 0' }}>
        {filled
          ? (config.after ?? 'A full page brings the big check, and the big check earns the stamp.')
          : (config.prompt ?? 'Today filled a little of this page. Tap to fill it in.')}
      </p>
      {filled && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: 6 }}>
          Tap again to undo
        </p>
      )}
    </div>
  )
}

// The registry: lesson rows name a component by key.
// `kidMode` rides through the registry so a widget can speak to one child
// rather than a room (plan v10, item 1.4). A widget that ignores it renders
// exactly as it always has.
type WidgetProps = { config: Record<string, unknown>; kidMode?: boolean }
const INTERACTIVES: Record<string, React.ComponentType<WidgetProps>> = {
  'verdict-sort': VerdictSort as React.ComponentType<WidgetProps>,
  'signal-meter': SignalMeter as React.ComponentType<WidgetProps>,
  'star-breath': StarBreath as React.ComponentType<WidgetProps>,
  'feed-loop': FeedLoop as React.ComponentType<WidgetProps>,
  'spread-race': SpreadRace as React.ComponentType<WidgetProps>,
  'class-tally': ClassTally as React.ComponentType<WidgetProps>,
  'passport-page': PassportBeat as React.ComponentType<WidgetProps>,
}

// PROJECTOR, THE SECOND ATTEMPT, and the first one is worth recording because
// it looked right and was not.
//
// Every widget sizes its TYPE from the design tokens, so the wall version was
// one override of those tokens on this wrapper: 41 font sizes fixed at once,
// no hand edits, and each widget keeping the type ratios its layout depends
// on. That much was true. What it missed is that the widgets size their BOXES
// in pixels, because they were drawn for a phone. Multiplying the text by 2.5
// and leaving a 170px card at 170px does not make a big card, it makes a card
// with the words falling out of it. On a 1920 wall the signal meter pushed its
// fourth option off the bottom of the screen and the spread race clipped both
// posts mid word. Neither could fail a typecheck and neither showed up in a
// contrast reading, because the colours were perfect. Only a screenshot found
// them.
//
// So the wall version zooms the whole widget instead. zoom scales the layout
// AND the space it takes, so every proportion the designer chose survives
// exactly and there is nothing per widget to keep in sync. The factor is the
// same 2.5 the token override used, chosen so the body text lands on the 40px
// ISO 9241 floor (shared/wall-scale.ts).
//
// The token override is gone rather than kept alongside: with zoom the text
// would scale twice.
// 2.5 is the factor that lands the widget's body text on the 40px ISO 9241
// floor. It is a CEILING, not a setting, because measuring the six widgets at
// a flat 2.5 showed three of them running past the bottom of a 1920x1080 wall
// and all six past a 1366x768 laptop, which is half the teacher laptops in the
// country. A slide the class has to scroll is a slide that stops.
const WALL_ZOOM_MAX = 2.5

// FIT THE ROOM, then be as large as the room allows.
//
// These widgets are drawn as tall phone layouts, so the honest answer on a wall
// is not one number. It is: measure the space this slide actually has, measure
// what the widget naturally needs, and take the largest zoom that still fits.
//
// GETTING THE BUDGET, which took three wrong attempts to measure.
//
//   - The stage's scrollHeight does NOT give the content height. The column
//     inside it is flex:1 with justifyContent center, so it stretches to the
//     full stage whatever it holds: scrollHeight reads exactly clientHeight and
//     the first version of this solved for a zoom of 1.00 every time.
//   - offsetHeight ignores zoom entirely. It read 429px at 1.0, at 1.5 and at
//     2.5, so any arithmetic mixing it with a painted height is wrong.
//   - getBoundingClientRect() is the painted height, and scrollHeight does tell
//     the truth once the content actually overflows.
//
// So: probe at the ceiling. If the widget fits there, take the ceiling. If it
// overflows, the overflow says exactly how tall the rest of the slide is, and
// the rest is fixed, so one division gives the zoom that lands flush.
function useFitZoom(enabled: boolean) {
  const box = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  useLayoutEffect(() => {
    if (!enabled) { setZoom(1); return }
    const el = box.current
    if (!el) return
    let measuring = false

    // Measuring means writing zoom, so the DOM is left wherever the last probe
    // put it. Every exit writes the answer to the element as well as to state:
    // when the computed zoom matches the state React does not re-render, and
    // the element would otherwise keep the probe's value. That is exactly how
    // this first shipped stuck at the ceiling with the widget hanging off the
    // bottom of the wall.
    const apply = (z: number) => {
      el.style.zoom = String(z)
      setZoom(z)
    }

    const fit = () => {
      if (measuring) return
      measuring = true
      try {
        let stage: HTMLElement | null = el.parentElement
        while (stage && !['auto', 'scroll'].includes(getComputedStyle(stage).overflowY)) {
          stage = stage.parentElement
        }
        if (!stage) { apply(WALL_ZOOM_MAX); return }

        const paintedAt = (z: number) => {
          el.style.zoom = String(z)
          return el.getBoundingClientRect().height
        }
        const spill = () => stage.scrollHeight - stage.clientHeight

        // Start at the ceiling and come down until it fits. Everything else on
        // the slide keeps its height whatever the zoom, so a spill of o painted
        // pixels means the widget has to lose exactly o: that is one division,
        // and it would be the whole answer if the widgets did not reflow. They
        // do (a card that fits on one line at 1.7 wraps to two at 2.5), so this
        // refines instead of trusting the first division, and it lands within a
        // pixel or two in three passes.
        let z = WALL_ZOOM_MAX
        for (let pass = 0; pass < 4; pass++) {
          const painted = paintedAt(z)
          const over = spill()
          if (over <= 0 || painted <= 0) break
          // 2px of slack so it lands just under rather than just over.
          const next = z * ((painted - over - 2) / painted)
          if (!Number.isFinite(next) || next >= z) break
          z = Math.max(1, next)
          if (z <= 1) break
        }
        apply(Math.max(1, Math.min(WALL_ZOOM_MAX, z)))
      } finally {
        measuring = false
      }
    }

    fit()
    // Content can arrive late (a webfont, an emoji, a widget's own state), and
    // a budget measured before it lands is the wrong budget.
    const ro = new ResizeObserver(() => { if (!measuring) fit() })
    ro.observe(el)
    if (el.parentElement) ro.observe(el.parentElement)
    window.addEventListener('resize', fit)
    return () => { ro.disconnect(); window.removeEventListener('resize', fit) }
  }, [enabled])

  return { box, zoom }
}

export default function Interactive({ component, config, caption, projector, kidMode = false }: { component: string; config?: Record<string, unknown>; caption?: string; projector?: boolean; kidMode?: boolean }) {
  const Comp = INTERACTIVES[component]
  const { box, zoom } = useFitZoom(!!projector)
  // The zoom rides on the wrapper, so it reaches the fallback path too. A
  // widget key that arrives ahead of a deploy degrades to its caption, and
  // that caption is on the same wall as everything else.
  const wall: React.CSSProperties | undefined = projector ? { zoom } : undefined

  if (!Comp) {
    // Unknown key: degrade to the caption so an ahead of deploy database never breaks a lesson.
    return caption
      ? <p style={{ ...wall, fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', textAlign: 'center', padding: '20px' }}>{caption}</p>
      : null
  }
  return (
    <div>
      <div ref={box} style={wall}><Comp config={config ?? {}} kidMode={kidMode} /></div>
      {/* The caption stays outside the zoom and takes the player's own wall
          scale: it is the teacher's instruction to the room, not part of the
          widget, and it should match every other line of prose on the wall. */}
      {/* Never for one child: the caption is the teacher's instruction to the
          room ("Sort the six cases together before the sheet"). */}
      {caption && !kidMode && <p style={{ fontFamily: 'var(--font-body)', fontSize: projector ? WALL.body : 'var(--text-base)', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.6, maxWidth: projector ? WALL.column : '420px', margin: '18px auto 0' }}>{caption}</p>}
    </div>
  )
}
