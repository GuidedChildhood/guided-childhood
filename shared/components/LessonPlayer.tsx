'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from './DigiCharacter'
import FriendPlate from './FriendPlate'
import PassportPage from './PassportPage'
import type { PassportPlacement } from '../passport-stages'
import { CHARACTERS, type CharacterKey } from '../schools-curriculum'
import { isCharacterKey } from '../intro-characters'
import type { Register } from '../friend-register'
import AnimatedIntro from './AnimatedIntro'
import { WALL, WALL_CONTRAST } from '../wall-scale'
import { ROSENSHINE_LABELS, PHASE_LABELS, PHASE_ORDER, type LessonPhase, type LessonSlide, type LessonCycle, type LessonTool, type ChoiceSlide, answerBeat, type ScenarioSlide, type DiagramSlide, type DigiSlide, type DiscussionSlide, type StatSlide, type VideoSlide } from '../lesson-slides'
import type { CurriculumBadges } from '../curriculum-badges'
import Interactive from './interactives'

// The cinematic player, v3. One player build lifts every lesson at once
// because slides are data: full bleed one idea slides on a cream stage,
// huge Nunito 900 headlines, GSAP slide transitions with staggered element
// reveals so a concept builds piece by piece, a thin butter progress bar,
// swipe and arrow key navigation, and DiGi popping in with his bubble.
// Rosenshine worn openly: a quiet mono phase label on every slide
// (RETRIEVAL / TEACH / PRACTISE / PROVE / CLOSE) and the retake framed as
// retrieval practice. The choice score and the 70 percent pass system are
// untouched from the v2 pass build.

// The one place the projector step up lives. Every slide block takes
// `projector` and sizes through this, so a new slide type cannot quietly ship
// at phone size on a classroom wall the way five of them did.
const room = (projector: boolean | undefined, big: string, small: string) =>
  projector ? big : small

// The wall scale lives in shared/wall-scale.ts, imported above.

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}

// The eyebrow is not decoration. It is the word that tells a class what KIND of
// slide this is before they read any of it: "Your turn", "The evidence", "Talk
// task", "Today's mission". At 12px on a classroom wall it may as well not be
// there, so on a projector it takes the wall scale like everything else.
const eyebrowOn = (projector?: boolean): React.CSSProperties =>
  projector ? { ...eyebrowStyle, fontSize: WALL.aside, letterSpacing: '0.1em' } : eyebrowStyle

// Checked at animation time, not render time, so a mid session settings
// change is honoured on the next slide. Every GSAP moment in this file runs
// through this gate: the reveals all animate FROM hidden TO the element's
// natural state, so skipping the tween simply leaves the slide readable,
// which is exactly what reduced motion asks for.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The two curriculum chips: Key Stage and the Education for a Connected
// World strand. Small, mono, honest. Shown on the intro slide.
function BadgeChips({ badges, projector }: { badges: CurriculumBadges; projector?: boolean }) {
  if (!badges.keyStage && !badges.strand) return null
  const chip: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, 'var(--text-xs)'), fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)',
    background: '#fff', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-pill)', padding: room(projector, '9px 22px', '5px 12px'), whiteSpace: 'nowrap',
  }
  return (
    <div data-reveal style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
      {badges.keyStage && <span style={chip}>{badges.keyStage}</span>}
      {badges.strand && <span style={chip}>EfCW: {badges.strand}</span>}
    </div>
  )
}

// The order the options are shown in, for one choice slide in one run. The
// decks are authored with the right answer wherever it reads best, which on
// most of them is the middle line, and a child learns that in two lessons.
// A seeded shuffle hides the pattern; seeding from the run salt plus the
// slide index means Back then Next shows the same order, and Run it again
// deals a fresh one.
function optionOrder(count: number, seed: number): number[] {
  const idx = Array.from({ length: count }, (_, i) => i)
  let s = (seed % 2147483647) || 1
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

const freshSalt = () => Math.floor(Math.random() * 2147483646) + 1

// THE TOOL, ON THE SLIDE THAT NEEDS IT.
//
// Every module carries one tool in teacher_notes: the three checks, the friend
// check, the shield. It is on the overview page, the poster and the organiser,
// and it was never inside the player. That is how ks3-12 came to ask "which
// check does that feeling trigger?" with options reading "Check three" and
// "Check one only" while the checks themselves sat nine slides back, off
// screen. A class that cannot see the list is being asked to remember it,
// which is not the thinking the question is for.
//
// Quiet on purpose. The question is the loudest thing on the wall and this
// sits under it as a reference line, numbered so an option saying "check one"
// has something to point at. Off by default and opted into per slide, because
// a strip on every choice slide is wallpaper by the third one.
function ToolStrip({ tool, projector }: { tool: LessonTool; projector?: boolean }) {
  return (
    <div data-reveal style={{
      maxWidth: room(projector, WALL.column, '520px'), margin: `0 auto ${room(projector, '28px', '20px')}`,
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)',
      padding: room(projector, '16px 20px', '12px 16px'),
    }}>
      <div style={{
        ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '8px',
        fontSize: room(projector, WALL.aside, 'var(--text-xs)'),
      }}>
        {tool.heading ?? 'Your tool'}
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {tool.lines.map((line, i) => (
          <li key={i} style={{
            fontSize: room(projector, WALL.body, 'var(--text-base)'),
            color: 'var(--ink)', lineHeight: 1.5, display: 'flex', gap: '10px',
          }}>
            <span style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// THE ANSWER BEAT: RIGHT, WRONG, AND THE SECOND GO IN BETWEEN.
//
// It used to lock on the first tap and light the correct answer immediately,
// which quietly ended the thinking. A class that guessed wrong saw the answer
// before anybody had to reconsider, and a class that guessed right never heard
// why the other two failed.
//
// So: a wrong first pick says why THAT one fails and nothing else. The answer
// stays hidden, the other options stay live, and the class gets one more go.
// This is the bit that teaches on a projector, because the retry is thirty
// children arguing before the teacher taps again.
//
// The second pick settles it either way, and settling ALWAYS reveals the
// correct option with its reasoning, whether they found it or not. Nobody
// leaves the slide without hearing the why.
//
// SCORING USES THE FIRST ATTEMPT ONLY. onAnswered fires once, on the first
// tap, because that is the honest measure of what the class knew. A retry is
// for learning, not for marking.
//
// Green for right and amber for wrong, from the real tokens rather than the
// butter accent that used to carry both. Nothing auto advances: the teacher
// moves on, always.
function ChoiceBlock({
  slide,
  onAnswered,
  onSettled,
  projector = false,
  seed = 0,
  tool,
}: {
  slide: ChoiceSlide
  onAnswered: (correct: boolean, chosen: string) => void
  // Fired once, the moment the slide settles. The player gates Continue on
  // THIS rather than on onAnswered, because a wrong first pick answers the
  // slide without settling it, and letting the class move on there would
  // walk them past the right answer they were about to be shown.
  onSettled?: () => void
  projector?: boolean
  seed?: number
  tool?: LessonTool
}) {
  // Picked indices in the order they were tapped. One wrong entry means the
  // retry is live; two entries, or one correct entry, means settled.
  const [tries, setTries] = useState<number[]>([])
  // Fixed for the life of this slide's mount, so a later salt change can
  // never move an answer out from under a pick.
  const [order] = useState(() => optionOrder(slide.options.length, seed))
  const rootRef = useRef<HTMLDivElement>(null)

  const optionAt = (i: number) => slide.options[order[i]]
  // The display index of the right answer, after the shuffle.
  const correctIndex = order.findIndex(oi => slide.options[oi].correct)
  const { settled, retrying, states } = answerBeat(correctIndex, order.length, tries)

  const pick = (i: number) => {
    if (settled || tries.includes(i)) return
    const opt = optionAt(i)
    // The first tap is the one that counts. A second tap after a wrong guess
    // is the class thinking again, which is the point, and scoring it would
    // turn every retry into a free mark.
    if (tries.length === 0) onAnswered(opt.correct, opt.text)
    const next = [...tries, i]
    setTries(next)
    if (answerBeat(correctIndex, order.length, next).settled) onSettled?.()
    // The tactile beat: the picked answer pops the moment it is tapped.
    const el = rootRef.current?.querySelector(`[data-choice-opt="${i}"]`)
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(el, { scale: 0.97 }, {
        scale: 1, duration: 0.45,
        ease: opt.correct ? 'back.out(3)' : 'power2.out',
      })
    }
  }

  // Number keys pick an option, 1 to 4, the way Duolingo and Uxcel let a
  // keyboard answer without the mouse. A teacher at a laptop with a class to
  // watch takes the class answer with one key, and the keycap on each option
  // tells the room which key that is. No dependency list on purpose: pick
  // closes over this slide's tries, so the listener is renewed each render.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (!Number.isInteger(n) || n < 1 || n > order.length) return
      e.preventDefault()
      pick(n - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div ref={rootRef}>
      <div data-reveal style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: room(projector, 'clamp(8px, 1.4vh, 14px)', '14px'), textAlign: 'center' }}>
        {projector ? 'Hands up, then tap the class answer' : 'Quick check'}
      </div>
      <h2 data-reveal style={{
        fontFamily: 'var(--font-display)', fontSize: room(projector, WALL.question, 'clamp(1.45rem, 4.5vw, 1.9rem)'),
        fontWeight: 900, color: 'var(--ink)', lineHeight: 1.22, letterSpacing: '-0.02em',
        marginBottom: room(projector, 'clamp(16px, 3vh, 34px)', '24px'), textAlign: 'center',
        maxWidth: room(projector, WALL.column, '620px'), marginLeft: 'auto', marginRight: 'auto',
      }}>
        {slide.question}
      </h2>

      {slide.toolStrip && tool?.lines?.length ? <ToolStrip tool={tool} projector={projector} /> : null}

      {/* The invitation to think again, said plainly and warmly. It sits above
          the options because that is where a room is already looking. */}
      {retrying && (
        <div style={{
          maxWidth: room(projector, WALL.column, '520px'), margin: `0 auto ${room(projector, '20px', '14px')}`,
          background: 'var(--tint-amber)', borderRadius: 'var(--radius-tile)',
          padding: room(projector, '14px 20px', '11px 16px'), textAlign: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: room(projector, WALL.body, 'var(--text-base)'), color: 'var(--stage-1-text)',
        }}>
          Not that one. Have another think, then try again.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: room(projector, 'clamp(10px, 1.6vh, 18px)', '12px'), maxWidth: room(projector, WALL.column, '520px'), margin: '0 auto' }}>
        {order.map((optIndex, i) => {
          const opt = slide.options[optIndex]
          const isTried = tries.includes(i)
          // The right answer shows itself only once the slide has settled, so
          // a wrong first pick does not hand the class the answer.
          const showRight = states[i] === 'right'
          const showWrong = states[i] === 'wrong'
          const dead = states[i] === 'dead'

          const border = showRight ? '2.5px solid var(--retro-green-dark)'
            : showWrong ? '2.5px solid var(--stage-1-text)'
            : '2px solid var(--border)'
          const bg = showRight ? 'var(--tint-green)'
            : showWrong ? 'var(--tint-amber)'
            : '#fff'
          const shadow = showRight || showWrong ? '0 3px 0 var(--border)'
            : dead ? 'none'
            : '0 5px 0 var(--border)'

          // Feedback appears on anything the class tapped, and on the right
          // answer once settled, so the why is always heard.
          const feedback = showWrong || showRight

          return (
            <button
              key={i}
              data-choice-opt={i}
              data-reveal
              onClick={() => pick(i)}
              disabled={settled || isTried}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: room(projector, '22px', '12px'),
                textAlign: 'left', background: bg, border, borderRadius: 'var(--radius-card)',
                padding: room(projector, 'clamp(14px, 2vh, 22px) 28px', '15px 18px'),
                cursor: settled || isTried ? 'default' : 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: room(projector, WALL.body, '16px'), fontWeight: 800,
                color: 'var(--ink)', lineHeight: 1.45,
                opacity: dead ? 0.55 : 1,
                boxShadow: shadow,
                transform: showRight || showWrong ? 'translateY(2px)' : 'none',
                transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s, opacity 0.15s',
              }}
            >
              {/* The keycap: which number key picks this one. Sized in em so
                  it sits on the option's own first line at every scale. */}
              <span aria-hidden style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                width: '1.5em', height: '1.5em', borderRadius: '0.4em',
                fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, '13px'), fontWeight: 700,
                lineHeight: 1, color: 'var(--ink-soft)', background: 'var(--cream)',
                border: '1.5px solid var(--border)', boxShadow: '0 2px 0 var(--border)',
                marginTop: '0.05em',
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                {opt.text}
                {feedback && (
                  <span style={{
                    display: 'block', marginTop: '10px',
                    fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.body, '14px'),
                    fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.55,
                  }}>
                    <strong style={{ color: showRight ? 'var(--retro-green-dark)' : 'var(--stage-1-text)' }}>
                      {showRight ? '✓ ' : '✕ '}
                    </strong>
                    {opt.feedback}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// A timed talk task. The countdown runs in the player so the teacher never
// watches a clock: start it, circulate, the chime state shows when time is up.
function DiscussionBlock({ slide, projector }: { slide: DiscussionSlide; projector?: boolean }) {
  const total = slide.seconds ?? 60
  const [left, setLeft] = useState(total)
  const [running, setRunning] = useState(false)
  const done = left === 0

  useEffect(() => {
    if (!running || left === 0) return
    const t = setTimeout(() => setLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [running, left])

  const modeLabel = slide.mode === 'groups' ? 'In your groups' : slide.mode === 'class' ? 'Whole class' : 'Talk to your partner'

  return (
    <div style={{ textAlign: 'center' }}>
      <div data-reveal style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '14px' }}>
        Talk task · {modeLabel}
      </div>
      <h2 data-reveal style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
        fontSize: room(projector, WALL.question, 'clamp(1.45rem, 3.6vw, 2rem)'),
        lineHeight: 1.3, letterSpacing: '-0.02em',
        maxWidth: room(projector, WALL.column, '560px'), margin: '0 auto 26px',
      }}>
        {slide.prompt}
      </h2>
      <div data-reveal style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        background: done ? 'var(--stage-1)' : '#fff', border: `2px solid ${done ? 'var(--stage-1-bold)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-card)', padding: '18px 34px', boxShadow: '0 5px 0 var(--border)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: room(projector, '72px', '42px'), color: done ? 'var(--stage-1-text)' : 'var(--ink)', lineHeight: 1 }}>
          {done ? 'Time!' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}
        </span>
        {!done && (
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: room(projector, WALL.aside, 'var(--text-base)'),
              background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
              borderRadius: 'var(--radius-tile)', padding: room(projector, '14px 28px', '9px 20px'), cursor: 'pointer',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            {running ? 'Pause' : left === total ? 'Start the timer' : 'Keep going'}
          </button>
        )}
      </div>
      {done && slide.lookFor && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.body, 'var(--text-lg)'), color: 'var(--ink)', lineHeight: 1.7, maxWidth: room(projector, WALL.column, '460px'), margin: '18px auto 0' }}>
          <strong>A good answer sounds like:</strong> {slide.lookFor}
        </p>
      )}
    </div>
  )
}

// One big number, always with its source. Evidence, never a scare tactic.
function StatBlock({ slide, projector }: { slide: StatSlide; projector?: boolean }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <div data-reveal style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '18px' }}>The evidence</div>
      <div data-reveal style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: room(projector, WALL.figure, 'clamp(3.6rem, 11vw, 5.6rem)'), color: 'var(--terracotta-dark)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        {slide.figure}
      </div>
      <p data-reveal style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: room(projector, WALL.display, 'clamp(1.15rem, 2.8vw, 1.5rem)'), color: 'var(--ink)', lineHeight: 1.4, maxWidth: room(projector, WALL.column, '480px'), margin: '0 auto 14px' }}>
        {slide.claim}
      </p>
      <p data-reveal style={{ fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, 'var(--text-sm)'), fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
        Source: {slide.source}
      </p>
    </div>
  )
}

// A realistic feed post, the evidence the class investigates. Phone card
// register: avatar, handle, meta line, body, a big emoji standing in for
// the image, engagement counts. Deliberately convincing, that is the point.
function ScenarioBlock({ slide, projector }: { slide: ScenarioSlide; projector?: boolean }) {
  const isMessage = slide.platform === 'message'
  return (
    <div>
      <div data-reveal style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '14px', textAlign: 'center' }}>
        {slide.label ?? 'Evidence'}
      </div>
      <div data-reveal style={{
        maxWidth: room(projector, 'min(1000px, 70vw)', '440px'), margin: '0 auto',
        background: isMessage ? 'var(--stage-1)' : '#fff',
        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)',
        padding: room(projector, 'clamp(12px, 1.8vh, 18px) 22px', '16px 18px'), boxShadow: '0 6px 0 var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', background: 'var(--stage-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: room(projector, WALL.emojiSmall, 'var(--text-xl)'), flexShrink: 0,
          }}>
            {slide.avatar}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: room(projector, WALL.title, 'var(--text-md)'), color: 'var(--ink)' }}>{slide.handle}</div>
            {slide.meta && <div style={{ fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.aside, 'var(--text-base)'), color: 'var(--ink-muted)' }}>{slide.meta}</div>}
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.body, 'var(--text-lg)'), color: 'var(--ink)', lineHeight: projector ? 1.45 : 1.7, marginBottom: slide.image || slide.stats ? '12px' : 0 }}>
          {slide.text}
        </p>
        {slide.image && (
          <div style={{
            background: 'var(--stage-2)', borderRadius: 'var(--radius-tile)', padding: room(projector, 'clamp(10px, 2vh, 26px) 0', '26px 0'),
            textAlign: 'center', fontSize: room(projector, WALL.emoji, '52px'), marginBottom: slide.stats ? '10px' : 0,
          }}>
            {slide.image}
          </div>
        )}
        {slide.stats && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, 'var(--text-sm)'), fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
            {slide.stats}
          </div>
        )}
      </div>
      {slide.prompt && (
        <p data-reveal style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: room(projector, WALL.title, 'clamp(1rem, 2.4vw, 1.2rem)'), color: 'var(--ink)',
          textAlign: 'center', lineHeight: 1.35, maxWidth: room(projector, WALL.column, '440px'), margin: `${room(projector, 'clamp(10px, 1.8vh, 20px)', '20px')} auto 0`,
        }}>
          {slide.prompt}
        </p>
      )}
    </div>
  )
}

// Animated flow diagram: steps drop in one by one with connectors, verdict
// chips pop at the end. Built from data, no images, photocopies cleanly.
function DiagramBlock({ slide, projector }: { slide: DiagramSlide; projector?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    const steps = ref.current.querySelectorAll('[data-diagram-step]')
    const chips = ref.current.querySelectorAll('[data-diagram-chip]')
    const tl = gsap.timeline()
    tl.fromTo(steps, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.35, ease: 'power2.out' })
    if (chips.length) tl.fromTo(chips, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.12, ease: 'back.out(2)' }, '+=0.1')
    return () => { tl.kill() }
  }, [])

  return (
    <div ref={ref}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
        fontSize: room(projector, WALL.display, 'clamp(1.45rem, 3.6vw, 2rem)'),
        letterSpacing: '-0.02em', marginBottom: room(projector, '26px', '20px'), textAlign: 'center',
      }}>
        {slide.heading}
      </h2>
      {/* A numbered rail, not a stack of identical boxes with an arrow floating
          between them. Three steps have to READ as three ordered things from
          the back of a room: the rail carries the eye, the number says where
          you are in the sequence, and the step that is being talked about is
          the one with the number beside it.

          ACROSS THE WALL, DOWN A PHONE. Stacked, three steps of forty pixel
          text stood 540px past the bottom of a 1080 wall (the Apple bar pass,
          13 September 2026), and a stack of boxes is the PowerPoint SmartArt
          look in any case. On the wall the steps sit side by side with the
          rail running across the top, left to right, the way a process is
          read. A phone keeps the rail down the side. */}
      {(() => {
        const dot = room(projector, 'clamp(46px, 6.4vh, 70px)', '34px')
        const dotStyle: React.CSSProperties = {
          width: dot, height: dot, borderRadius: 'var(--radius-pill)', flexShrink: 0,
          background: 'var(--terracotta)', color: 'var(--ink)',
          border: '2px solid var(--terracotta-dark)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: room(projector, WALL.title, '16px'), lineHeight: 1,
        }
        const card: React.CSSProperties = {
          background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 'var(--radius-card)',
          boxShadow: '0 5px 0 var(--terracotta-lt)',
        }
        if (projector) return (
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${slide.steps.length}, minmax(0, 1fr))`,
            gap: 'clamp(14px, 1.6vw, 28px)', maxWidth: WALL.column, margin: '0 auto',
          }}>
            {slide.steps.map((step, i) => {
              const last = i === slide.steps.length - 1
              return (
                <div key={i} data-diagram-step style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'clamp(8px, 1.4vh, 14px)' }}>
                    <span style={dotStyle}>{i + 1}</span>
                    {!last && <span aria-hidden style={{ flex: 1, height: '3px', background: 'var(--terracotta-lt)', borderRadius: 'var(--radius-pill)', marginLeft: '10px' }} />}
                  </div>
                  <div style={{ ...card, flex: 1, padding: 'clamp(12px, 2vh, 22px) clamp(16px, 1.4vw, 26px)' }}>
                    {step.emoji && <div style={{ fontSize: WALL.emojiSmall, lineHeight: 1, marginBottom: 'clamp(6px, 1.2vh, 12px)' }}>{step.emoji}</div>}
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: room(projector, WALL.title, 'var(--text-md)'), color: 'var(--ink)', lineHeight: 1.2 }}>{step.title}</div>
                    {step.text && <div style={{ fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.body, 'var(--text-base)'), color: 'var(--ink-soft)', lineHeight: 1.3, marginTop: '6px' }}>{step.text}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: '460px', margin: '0 auto' }}>
            {slide.steps.map((step, i) => {
              const last = i === slide.steps.length - 1
              return (
                <div key={i} data-diagram-step style={{ display: 'flex', gap: '14px', alignItems: 'stretch' }}>
                  {/* The rail: number, then the line down to the next step. */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <span style={dotStyle}>{i + 1}</span>
                    {!last && <span aria-hidden style={{ flex: 1, width: '3px', background: 'var(--terracotta-lt)', borderRadius: 'var(--radius-pill)', marginTop: '4px' }} />}
                  </div>
                  <div style={{ ...card, flex: 1, display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 18px', marginBottom: last ? 0 : '12px' }}>
                    {step.emoji && <span style={{ fontSize: 'var(--text-2xl)', flexShrink: 0, lineHeight: 1 }}>{step.emoji}</span>}
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>{step.title}</div>
                      {step.text && <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>{step.text}</div>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}
      {slide.verdicts && slide.verdicts.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: room(projector, 'clamp(10px, 1.8vh, 18px)', '16px') }}>
          {slide.verdicts.map((v, i) => (
            <span key={i} data-diagram-chip style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: room(projector, WALL.title, 'var(--text-base)'),
              background: 'var(--stage-1)', border: '2px solid var(--stage-1-bold)',
              color: 'var(--stage-1-text)', borderRadius: 'var(--radius-pill)', padding: room(projector, '6px 18px', '8px 16px'),
            }}>
              {v}
            </span>
          ))}
        </div>
      )}
      {slide.caption && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.body, 'var(--text-base)'), color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.6, maxWidth: room(projector, WALL.column, '420px'), margin: `${room(projector, 'clamp(8px, 1.4vh, 16px)', '16px')} auto 0` }}>
          {slide.caption}
        </p>
      )}
    </div>
  )
}

// THE CHARACTER BEAT: a friend on its plate, speaking one bubble at a time.
//
// This began as DiGi's closing block, the app greeting treatment: the golden
// star lands in his circle, then speaks the lesson home. Since 13 September
// 2026 it is every friend's beat. A digi slide that names a character is an
// arrival, an explain or a mission in that friend's own plate and register,
// and one that names nobody is DiGi closing, exactly as before. No render
// pipeline, no credits, always available, and the same code plays every one
// of the twenty five lessons, which is what makes it a series rather than
// twenty five one offs.
function CharacterBeat({ slide, projector, register = 'playful' }: { slide: DigiSlide; projector?: boolean; register?: Register }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mood, setMood] = useState<DigiMood>('wave')
  // The slide's own friend, or DiGi. DiGi closes every lesson whoever hosts
  // it, and that is the line this keeps.
  const who: CharacterKey = isCharacterKey(slide.character) ? slide.character : 'digi'
  const c = CHARACTERS[who]
  // A beat that names its character, DiGi included, moves in the lesson's
  // register, so the DiGi arrival on a KS4 lesson holds still with no plate.
  // The close that names nobody keeps the pop it always had, in both apps.
  const reg: Register = slide.character ? register : 'playful'

  useEffect(() => {
    if (!ref.current) return
    const bubbles = ref.current.querySelectorAll('[data-digi-line]')
    // Every line is authored at opacity 0 for the animation to fade up from.
    // Under reduced motion the animation never runs, so set the natural state
    // outright: reduced motion means no movement, not no content.
    if (prefersReducedMotion()) {
      gsap.set(bubbles, { opacity: 1, y: 0, scale: 1 })
      setMood('happy')
      return
    }
    // The friend lands first (FriendPlate plays the arrival), then speaks.
    const tl = gsap.timeline({ delay: 0.55 })
    tl.fromTo(bubbles, { opacity: 0, y: 14, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 1.0, ease: 'back.out(1.6)',
      onComplete: () => setMood('happy'),
    })
    return () => { tl.kill() }
  }, [])

  const plate = projector ? 150 : 64
  return (
    <div ref={ref}>
      {slide.heading && (
        <div style={{ ...eyebrowOn(projector), color: c.ink, marginBottom: '18px', textAlign: 'center' }}>{slide.heading}</div>
      )}
      {/* The friend sits beside its words wherever the row is wide enough and
          wraps above them where it is not. Width decides, not the projector
          flag: the teach route is always the wall, and a teacher still opens
          it on a phone, where a 150px plate beside a three line mission left
          the words two thirds of a 390px screen wide and nine lines deep. The
          words claim 240px before they drop under the plate, which then
          centres on its own line. DiGi's close in the parent app, a 64px
          plate beside a 12px gap, still fits a phone as a row. */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start',
        columnGap: room(projector, '24px', '12px'), rowGap: '6px',
        maxWidth: room(projector, WALL.column, '460px'), margin: '0 auto',
      }}>
        <FriendPlate character={who} register={reg} mood={mood} size={plate} arrive />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '1 1 240px', paddingTop: room(projector, '18px', '4px') }}>
          {slide.lines.map((line, i) => (
            <div key={i} data-digi-line style={{
              opacity: 0, background: '#fff',
              // The friend's accent frames the friend's words; DiGi keeps the
              // quiet border the close has always had.
              border: `1.5px solid ${who === 'digi' ? 'var(--border)' : c.accent}`,
              borderRadius: i === 0 ? '4px 18px 18px 18px' : '18px', padding: '13px 18px', textAlign: 'left',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: room(projector, WALL.body, 'var(--text-lg)'),
              color: 'var(--ink)', lineHeight: 1.55, boxShadow: '0 3px 0 rgba(26,26,46,0.06)',
            }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// THE VIDEO BEAT AND ITS WAY IN FOR EVERYONE ELSE.
//
// Oak puts a transcript and a sign language option beside their lesson
// video. We had neither, which meant a deaf pupil sat through a beat with
// no route into it and a teacher with broken speakers had to skip it.
//
// The fix is a disclosure under the clip rather than a separate page,
// because the moment a pupil needs the words is the moment the clip is on
// screen, not three clicks away in a teacher document they cannot open.
// It is a native <details>, so it is keyboard operable and announced as a
// disclosure without a line of our own JavaScript, and it survives a
// failed hydration: the words are in the HTML either way.
//
// Closed by default on purpose. On a projector an open panel would cover
// the wall with text nobody asked for; the pupil who needs it opens it,
// and so does the teacher reading it aloud to a silent room.
function VideoBlock({ slide, projector }: { slide: VideoSlide; projector?: boolean }) {
  const alt = slide.alternative
  const silent = alt !== undefined && alt.spoken.length === 0

  return (
    <div style={{ maxWidth: room(projector, WALL.wide, '640px'), margin: '0 auto' }}>
      <video
        src={slide.src}
        poster={slide.poster}
        controls
        playsInline
        // Without this the control is announced as bare "video". The caption
        // is the only human name the beat has, so it is the one to use.
        aria-label={slide.caption ?? 'Lesson video'}
        style={{ width: '100%', borderRadius: 'var(--radius-card)', background: 'var(--ink)', display: 'block' }}
      />

      {slide.caption && (
        <p style={{
          fontSize: room(projector, WALL.body, 'var(--text-base)'),
          color: 'var(--ink-muted)', marginTop: '10px', textAlign: 'center',
        }}>
          {slide.caption}
        </p>
      )}

      {alt && (
        <details style={{
          marginTop: '12px', background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-btn)', padding: '2px 18px',
        }}>
          <summary style={{
            ...eyebrowOn(projector), color: 'var(--terracotta-dark)', cursor: 'pointer',
            padding: '12px 0', fontSize: room(projector, WALL.aside, 'var(--text-xs)'),
          }}>
            {silent ? 'What happens in this clip' : 'The words in this clip'}
          </summary>

          <div style={{ paddingBottom: '16px' }}>
            {/* Said before anything else, because a teacher whose room has
                gone quiet needs to know whether the clip is silent or the
                speakers are. Four of our eight beats have no dialogue. */}
            {silent && (
              <p style={{
                fontSize: room(projector, WALL.body, 'var(--text-base)'),
                color: 'var(--ink-muted)', lineHeight: 1.6, margin: '0 0 12px',
              }}>
                Nobody speaks in this clip. Nothing is missing from your sound.
              </p>
            )}

            {alt.spoken.map((line, i) => (
              <p key={i} style={{
                fontSize: room(projector, WALL.body, 'var(--text-md)'),
                color: 'var(--ink)', lineHeight: 1.65, margin: '0 0 10px',
              }}>
                &ldquo;{line}&rdquo;
              </p>
            ))}

            <p style={{
              fontSize: room(projector, WALL.body, 'var(--text-base)'),
              color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0,
            }}>
              <strong style={{ color: 'var(--ink)' }}>On screen. </strong>
              {alt.described}
            </p>

            {/* The board behind the character is content, and it is pixels.
                Nothing but this line puts it where a screen reader goes. */}
            {alt.onScreen && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, 'var(--text-xs)'), fontWeight: 700,
                letterSpacing: '0.1em', color: 'var(--ink-muted)', marginTop: '10px',
              }}>
                THE BOARD READS: {alt.onScreen}
              </p>
            )}
          </div>
        </details>
      )}
    </div>
  )
}

function SlideBody({
  slide, onAnswered, onSettled, projector, seed, tool, register,
}: {
  slide: LessonSlide
  onAnswered: (correct: boolean, chosen: string) => void
  onSettled?: () => void
  projector?: boolean
  seed?: number
  tool?: LessonTool
  // The lesson's treatment register, for the character beats.
  register?: Register
}) {
  switch (slide.type) {
    case 'title':
      return (
        <div style={{ padding: '4px 0' }}>
          {/* The animated character intro is the opener: DiGi the star kicks
              off, the title reveals, far cleaner than a busy stock scene. */}
          <AnimatedIntro eyebrow={slide.eyebrow} title={slide.title} character={slide.character} line={slide.line} projector={projector} />
          {slide.body && (
            <p data-reveal style={{ fontSize: room(projector, WALL.body, 'var(--text-lg)'), color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: room(projector, WALL.column, '420px'), margin: '18px auto 0', textAlign: 'center' }}>
              {slide.body}
            </p>
          )}
        </div>
      )
    case 'objective':
      // In the wall's column, like every other slide. It used to stretch to the
      // wide edge, so a left aligned mission started at the far left of a
      // 1920 wall and the gains ran a metre and a half long.
      return (
        <div style={{ maxWidth: room(projector, WALL.column, 'none'), margin: '0 auto', width: '100%' }}>
          <div data-reveal style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: room(projector, 'clamp(6px, 1.2vh, 14px)', '14px') }}>
            Today&rsquo;s mission
          </div>
          <div data-reveal style={{
            background: 'var(--stage-2)', border: '2px solid var(--terracotta)',
            borderRadius: 'var(--radius-card)', padding: projector ? 'clamp(14px, 2.4vh, 28px) clamp(20px, 2vw, 30px)' : 'clamp(20px, 4vw, 30px)', marginBottom: room(projector, 'clamp(10px, 1.8vh, 18px)', '18px'),
            boxShadow: '0 5px 0 var(--terracotta-lt)',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: room(projector, WALL.display, 'clamp(1.3rem, 3.2vw, 1.7rem)'), color: 'var(--ink)', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              {slide.outcome}
            </p>
          </div>
          <p data-reveal style={{ fontSize: room(projector, WALL.body, 'var(--text-lg)'), color: 'var(--ink)', lineHeight: projector ? 1.5 : 1.7, marginBottom: room(projector, 'clamp(10px, 1.6vh, 16px)', '16px') }}>{slide.why}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: room(projector, 'clamp(6px, 1vh, 10px)', '9px') }}>
            {slide.gains.map((g, i) => (
              <div key={i} data-reveal style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: room(projector, 'clamp(8px, 1.4vh, 14px) 16px', '12px 15px') }}>
                <span style={{ fontSize: room(projector, WALL.body, 'inherit'), color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0, lineHeight: 1.55 }}>✓</span>
                <span style={{ fontSize: room(projector, WALL.body, 'var(--text-md)'), color: 'var(--ink)', lineHeight: projector ? 1.4 : 1.55 }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'keywords':
      return (
        <div style={{ maxWidth: room(projector, WALL.column, 'none'), margin: '0 auto', width: '100%' }}>
          <div data-reveal style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '14px' }}>
            {slide.heading ?? 'Detective words'}
          </div>
          <div style={projector && slide.words.length >= 3
            // Two columns on the wall: four words in one column stood 720px
            // tall and scrolled on a 1080 screen. Side by side they read as a
            // glossary and fit.
            ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'clamp(10px, 1.6vh, 16px) 18px' }
            : { display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {slide.words.map((w, i) => (
              <div key={i} data-reveal style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: room(projector, 'clamp(10px, 1.6vh, 16px) 18px', '13px 16px') }}>
                <span style={{
                  display: 'inline-block', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: room(projector, WALL.title, 'var(--text-sm)'),
                  color: 'var(--stage-1-text)', background: 'var(--stage-1)', border: '1.5px solid var(--stage-1-bold)',
                  borderRadius: '8px', padding: '3px 10px', marginBottom: '7px',
                }}>
                  {w.word}
                </span>
                <p style={{ fontSize: room(projector, WALL.body, 'var(--text-md)'), color: 'var(--ink)', lineHeight: 1.6 }}>{w.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case 'concept':
      // The full bleed one idea slide: the emoji lands, the huge headline
      // follows, the body settles last. Each piece staggers in.
      return (
        <div style={{ textAlign: 'center' }}>
          {slide.emoji && <div data-reveal style={{ fontSize: room(projector, WALL.emoji, 'clamp(2.6rem, 6vw, 3.4rem)'), marginBottom: room(projector, 'clamp(10px, 2vh, 22px)', '16px'), lineHeight: 1 }}>{slide.emoji}</div>}
          <h2 data-reveal style={{
            fontFamily: 'var(--font-display)', fontSize: room(projector, WALL.display, 'clamp(1.7rem, 5.5vw, 2.4rem)'),
            fontWeight: 900, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: room(projector, '24px', '18px'),
            maxWidth: room(projector, WALL.column, '640px'), marginLeft: 'auto', marginRight: 'auto',
          }}>
            {slide.heading}
          </h2>
          <p data-reveal style={{
            fontSize: room(projector, WALL.body, 'clamp(1rem, 2.4vw, 1.1rem)'),
            color: 'var(--ink)', lineHeight: projector ? 1.55 : 1.75, maxWidth: room(projector, WALL.column, '540px'), margin: '0 auto', textAlign: 'left',
          }}>
            {slide.body}
          </p>
        </div>
      )
    case 'quote':
      return (
        <div data-reveal style={{ background: 'var(--stage-2)', borderRadius: 'var(--radius-card)', padding: 'clamp(24px, 4.5vw, 34px)', borderLeft: '3px solid var(--terracotta)', maxWidth: room(projector, WALL.column, '560px'), margin: '0 auto' }}>
          <div style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
            {slide.label ?? 'Say this'}
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: room(projector, WALL.display, 'clamp(1.15rem, 2.8vw, 1.45rem)'), fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, fontStyle: 'italic' }}>
            &ldquo;{slide.text}&rdquo;
          </p>
        </div>
      )
    case 'choice':
      return <ChoiceBlock slide={slide} onAnswered={onAnswered} onSettled={onSettled} projector={projector} seed={seed} tool={tool} />
    case 'discussion':
      return <DiscussionBlock slide={slide} projector={projector} />
    case 'stat':
      return <StatBlock slide={slide} projector={projector} />
    case 'scenario':
      return <ScenarioBlock slide={slide} projector={projector} />
    case 'diagram':
      return <DiagramBlock slide={slide} projector={projector} />
    case 'digi':
      return <CharacterBeat slide={slide} projector={projector} register={register} />
    case 'interactive':
      return <Interactive component={slide.component} config={slide.config} caption={slide.caption} projector={projector} />
    case 'video':
      return <VideoBlock slide={slide} projector={projector} />
    case 'tryit':
      return (
        <div data-reveal style={{ background: 'var(--stage-1)', borderRadius: 'var(--radius-card)', padding: 'clamp(24px, 4.5vw, 34px)', border: '1.5px solid var(--stage-1-bold)', maxWidth: room(projector, WALL.column, '560px'), margin: '0 auto' }}>
          <div style={{ ...eyebrowOn(projector), color: 'var(--stage-1-text)', marginBottom: '12px' }}>
            {slide.label ?? 'Try it tonight'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: room(projector, WALL.display, 'clamp(1.3rem, 3vw, 1.6rem)'), fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            {slide.heading}
          </h2>
          <p style={{ fontSize: room(projector, WALL.body, 'var(--text-md)'), color: 'var(--ink)', lineHeight: 1.7 }}>{slide.body}</p>
        </div>
      )
    case 'recap':
      return (
        <div>
          <h2 data-reveal style={{ fontFamily: 'var(--font-display)', fontSize: room(projector, WALL.display, 'clamp(1.45rem, 3.6vw, 2rem)'), fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '18px', textAlign: 'center' }}>
            {slide.heading}
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, maxWidth: room(projector, WALL.column, '520px'), margin: '0 auto' }}>
            {slide.points.map((p, i) => (
              <li key={i} data-reveal style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '13px 16px' }}>
                <span style={{ fontSize: room(projector, WALL.body, 'inherit'), color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0, lineHeight: 1.6 }}>✓</span>
                <span style={{ fontSize: room(projector, WALL.body, 'var(--text-md)'), color: 'var(--ink)', lineHeight: 1.6 }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )
  }
}

// Ignored when matching a cycle title against a slide heading, so "The three
// checks" still matches a slide headed "The three checks" and is not dragged
// off by an article both happen to share.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'of', 'is', 'it', 'to', 'in', 'you', 'your',
  'not', 'that', 'on', 'for',
])

export default function LessonPlayer({
  lessonId,
  lessonSource,
  slides,
  backHref,
  homeHref,
  digiPrompt,
  teacherView = false,
  kidMode = false,
  kidStars,
  completeEndpoint,
  completeBody,
  badges,
  notice,
  classMode = false,
  classCtaHref,
  initialIndex = 0,
  cycles,
  tool,
  projector: projectorProp,
  character,
  register = 'playful',
  passport = null,
  onFinish,
}: {
  lessonId: string
  lessonSource: 'lesson' | 'ai_lesson' | 'school_lesson'
  slides: LessonSlide[]
  backHref: string
  // The child's way straight back to their quests home, shown as a big
  // obvious button in kid mode instead of a tiny cross.
  homeHref?: string
  digiPrompt?: string
  teacherView?: boolean
  // Kid mission mode: celebration finish, stars earned, quiz score sent
  // to a token authenticated endpoint instead of the parent session one.
  kidMode?: boolean
  kidStars?: number
  // null skips the completion write entirely: a lesson DiGi wrote on the fly
  // has no database row to complete against.
  completeEndpoint?: string | null
  completeBody?: Record<string, unknown>
  // Key Stage and Education for a Connected World chips on the intro slide.
  badges?: CurriculumBadges
  // The module's one tool, from teacher_notes.tool. Shown under the question
  // on any choice slide that sets toolStrip, so options naming "check one"
  // have the list to point at. Absent on the parent app lessons, which carry
  // no teacher notes, and the strip simply does not render.
  tool?: LessonTool
  // A block shown on the first slide only, under the header, INSIDE the
  // player. Added 10 September 2026 for the reading ahead notice on the
  // parent app: a lesson above this child's stage has to say so, and it
  // cannot say it from the page around the player.
  //
  // The player is position fixed inset 0 at zIndex 110 and owns the whole
  // screen, so anything the page renders above it is in the HTML and invisible.
  // The first version of that notice was exactly that: present in the markup,
  // passing any check that reads the DOM, and not on screen for any parent.
  // Passing it in is the only honest way to put something in front of someone
  // who is about to play a lesson.
  notice?: React.ReactNode
  // The free whole class showcase: everything bigger, AND the finish is the
  // quiet signpost to the school curriculum tier. Two different things wearing
  // one flag, which is why `projector` below exists.
  classMode?: boolean
  // Where the classMode finish sends people. The player is shared by both
  // products, so the destination belongs to the caller: the schools showcase
  // passes its curriculum page, and once the products live on separate
  // domains it becomes an absolute URL. No href, no CTA.
  classCtaHref?: string
  // Open at a given slide (dev fixtures and deep links).
  initialIndex?: number
  // Size everything for a room rather than a hand, WITHOUT the showcase
  // finish. The schools teach route is the case that needs this: a school
  // that has already paid should not reach the end of its own lesson and be
  // sold the tier it is standing in. Defaults to classMode so every existing
  // caller keeps the behaviour it had.
  projector?: boolean
  // The lesson's named learning cycles, when the caller has them. Omit and
  // the player behaves exactly as it did: no map, no cycle in the chrome.
  cycles?: LessonCycle[]
  // The Planet Friend who hosts this lesson, read off the row's cast line by
  // the caller (friend-register.ts). Sets the accent the chrome wears and
  // puts the friend in the header beside DiGi. Absent on the parent app
  // lessons, which then look exactly as they did.
  character?: CharacterKey
  // How that friend moves: the treatment ladder, chosen by key stage.
  register?: Register
  // The page this school lesson fills and the home code that carries it home,
  // read off the row by the teach route. The Completed screen draws the page
  // as this screen now holds it (shared/schools-taught) and prints the code.
  // Absent on the parent app, where the passport is the child's own book.
  passport?: { placement: PassportPlacement | null; moduleId: string; homeCode?: string | null } | null
  /**
   * Called once when the deck reaches its finish.
   *
   * THE SCHOOLS TRACKER'S ONE HONEST SIGNAL FOR "YOU TAUGHT IT". This app
   * passes `completeEndpoint` null because a school code tells us the school
   * and never the teacher, so there is nobody to write a completion against,
   * and the early return above means nothing at all was observable. The
   * parents app does not pass this and keeps writing its completion the way
   * it always has.
   *
   * Fired before that return, so it runs whether or not a completion is
   * posted, and wrapped by the caller rather than here: the player should not
   * know what a tracker is.
   */
  onFinish?: () => void
}) {
  const projector = projectorProp ?? classMode
  // The friend's tokens, or the terracotta the player has always worn. Text
  // on the current pill and the cycle map uses the friend's ink on the soft
  // band, the pairing the school cards already use, so the contrast holds.
  const friend = character ? CHARACTERS[character] : null
  const accent = friend ? friend.accent : 'var(--terracotta)'
  const soft = friend ? friend.soft : 'var(--terracotta-lt)'
  const inkOn = friend ? friend.ink : 'var(--terracotta-dark)'
  const [index, setIndex] = useState(() => Math.min(Math.max(initialIndex, 0), Math.max(slides.length - 1, 0)))
  const [answered, setAnswered] = useState(false)
  // Answered and settled were the same instant until the retry landed: the
  // first tap ended the question. Now a wrong first pick answers the slide
  // and leaves it live, so Continue has to wait for the settle instead.
  const [settled, setSettled] = useState(false)
  const [digiMood, setDigiMood] = useState<DigiMood>('idle')
  const [finished, setFinished] = useState(false)
  // A pass on the child link can open a planet on their star system (Planet
  // Friends slice 3b). The complete route says so; the pass screen shows it.
  const [planetOpened, setPlanetOpened] = useState<{ title: string; href: string } | null>(null)
  // Open by default: the teacher test says the words to say live on the slide,
  // and a first time teacher opening the board found them behind a small grey
  // toggle (the schools review, 13 September 2026). The toggle still folds it.
  const [scriptOpen, setScriptOpen] = useState(true)
  // The run salt behind the option shuffle. It lands after mount rather than
  // in the initial state so the server and the first client render agree.
  const [runSalt, setRunSalt] = useState(0)
  useEffect(() => { setRunSalt(freshSalt()) }, [])
  // Per choice slide result, keyed by slide index so revisits do not double count.
  const answersRef = useRef<Record<number, boolean>>({})
  // What was actually picked, question by question (migration 239): the
  // completion write carries these so the stage check can put this child's
  // missed questions first. Keyed by slide index like answersRef, so a
  // retake's fresh answer replaces the old one rather than doubling it.
  const answerDetailRef = useRef<Record<number, { question: string; chosen: string; correct: boolean }>>({})
  const slideRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  // Which way the deck is moving, so the slide transition matches the gesture.
  const dirRef = useRef(1)
  const touchStartX = useRef<number | null>(null)

  const slide = slides[index]
  const isChoice = slide?.type === 'choice'
  const isLast = index === slides.length - 1
  const canContinue = !isChoice || settled
  const hasScripts = teacherView && slides.some(s => s.script)

  // The end of lesson check: every choice slide counts towards the score and
  // the pass mark is 70 percent. A deck with no choice slides passes on
  // finishing, so the older text built lessons keep working exactly as before.
  const choiceCount = slides.filter(s => s.type === 'choice').length
  const correctCount = Object.values(answersRef.current).filter(Boolean).length
  const passed = choiceCount === 0 || correctCount / choiceCount >= 0.7

  // The cinematic transition: the slide glides in from the direction of
  // travel, then its pieces build one by one via the data-reveal marks.
  useEffect(() => {
    if (!slideRef.current) return
    stageRef.current?.scrollTo({ top: 0 })
    if (prefersReducedMotion()) return
    const el = slideRef.current
    const reveals = el.querySelectorAll('[data-reveal]')
    const tl = gsap.timeline()
    tl.fromTo(el, { opacity: 0, x: 36 * dirRef.current }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' })
    if (reveals.length) {
      tl.fromTo(reveals, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: 'power2.out' }, '-=0.2')
    }
    return () => { tl.kill() }
  }, [index, finished])

  // The thin butter progress bar breathes forward with every slide.
  useEffect(() => {
    if (!barRef.current) return
    const pct = finished ? 100 : ((index + 1) / Math.max(slides.length, 1)) * 100
    if (prefersReducedMotion()) { barRef.current.style.width = `${pct}%`; return }
    gsap.to(barRef.current, { width: `${pct}%`, duration: 0.5, ease: 'power2.out' })
  }, [index, finished, slides.length])

  // ── Phase choreography ── the star acts the lesson's shape.
  //
  // The slide type rules below came first and still win (a choice slide is
  // always a thinking moment, whatever phase it sits in). What changed: when
  // a slide CROSSES into a new phase, the star takes the new phase's stance
  // instead of dropping back to idle, and the strip's current pill takes one
  // small pulse. One beat per phase, six beats per lesson, so the moment
  // stays meaningful; a pop on every slide would be wallpaper by slide four.
  const PHASE_MOOD: Record<string, DigiMood> = {
    connect: 'wave', starter: 'thinking', teach: 'speak',
    practise: 'happy', prove: 'thinking', close: 'wave',
  }
  const prevPhaseRef = useRef<string | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  // Where each segment of the arc rail was on the last slide, so the fill can
  // tween from there rather than jump. Filled on first paint, so the very first
  // render sets the widths outright and nothing moves before the teacher does.
  const railPrev = useRef<Record<string, number>>({})
  // A slide taller than the stage scrolls, and on a wall a teacher should be
  // able to SEE that from across the room rather than find out by accident:
  // a soft cream fade sits at the foot of the stage while there is more
  // below, and goes when the bottom is reached. Projector only; on a phone
  // the controls are inside the stage and are the thing you scroll to.
  const [moreBelow, setMoreBelow] = useState(false)
  useEffect(() => {
    const el = stageRef.current
    if (!el || !projector) return
    const check = () => setMoreBelow(el.scrollHeight - el.clientHeight - el.scrollTop > 8)
    check()
    el.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null
    ro?.observe(el)
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); ro?.disconnect() }
  }, [index, finished, scriptOpen, projector])
  useEffect(() => {
    const root = stripRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-rail-fill]').forEach(f => {
      const key = f.dataset.railFill ?? ''
      const to = Number(f.dataset.fill ?? 0)
      const from = railPrev.current[key]
      railPrev.current[key] = to
      if (from === undefined || from === to || prefersReducedMotion()) return
      gsap.fromTo(f, { width: `${from}%` }, { width: `${to}%`, duration: 0.5, ease: 'power2.out' })
    })
  }, [index, finished])
  useEffect(() => {
    const phase = slide?.phase ?? null
    const phaseChanged = phase !== null && phase !== prevPhaseRef.current
    prevPhaseRef.current = phase

    if (slide?.type === 'choice' && !answered) setDigiMood('thinking')
    else if (slide?.type === 'recap') setDigiMood('wave')
    else if (phaseChanged && PHASE_MOOD[phase]) setDigiMood(PHASE_MOOD[phase])
    else if (!finished) setDigiMood('idle')

    if (phaseChanged && stripRef.current &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const pill = stripRef.current.querySelector('[aria-current="step"] [data-rail-label]')
      if (pill) {
        gsap.fromTo(pill, { scale: 1 }, {
          scale: 1.12, duration: 0.18, ease: 'power2.out',
          yoyo: true, repeat: 1, clearProps: 'scale',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slide?.type, answered, finished])

  const onAnswered = (correct: boolean, chosen: string) => {
    setAnswered(true)
    answersRef.current[index] = correct
    if (slide?.type === 'choice') {
      answerDetailRef.current[index] = { question: slide.question, chosen, correct }
    }
    setDigiMood(correct ? 'happy' : 'speak')
  }

  const advance = useCallback(async () => {
    dirRef.current = 1
    if (isLast) {
      setFinished(true)
      setDigiMood(passed ? 'happy' : 'speak')
      // Before the early return, so a school that records no completion still
      // gets the one signal its tracker can honestly claim.
      try { onFinish?.() } catch { /* a tracker must never break a lesson */ }
      if (completeEndpoint === null) return
      // A failed run still writes the completion, with passed false, so the
      // record is honest and the retake can upgrade it to a pass.
      try {
        const r = await fetch(completeEndpoint ?? '/api/lessons/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: lessonId,
            lesson_source: lessonSource,
            correct: Object.values(answersRef.current).filter(Boolean).length,
            total: choiceCount,
            answers: Object.values(answerDetailRef.current),
            ...completeBody,
          }),
        })
        const d = await r.json().catch(() => null) as { planetOpened?: string | null; planetHref?: string | null } | null
        if (d?.planetOpened && d?.planetHref) setPlanetOpened({ title: d.planetOpened, href: d.planetHref })
      } catch { /* non-blocking */ }
      return
    }
    setAnswered(false)
    setSettled(false)
    setIndex(i => i + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLast, passed, completeEndpoint, lessonId, lessonSource, choiceCount, completeBody, onFinish])

  const goBack = useCallback(() => {
    if (index === 0) return
    dirRef.current = -1
    setAnswered(true)
    // A slide already behind us is settled by definition, so stepping back
    // never re-locks the way forward.
    setSettled(true)
    setIndex(i => i - 1)
  }, [index])

  // Arrow keys drive the deck: the teacher at the projector, the parent on
  // a laptop. Right or Enter continues once a choice is answered, left goes
  // back. Touch gets the same via swipe on the slide stage.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) return
      if (e.key === 'ArrowRight') { if (canContinue) { e.preventDefault(); advance() } }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goBack() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finished, canContinue, advance, goBack])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0]?.clientX ?? null }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || finished) return
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current
    touchStartX.current = null
    if (dx < -56 && canContinue) advance()
    else if (dx > 56) goBack()
  }

  // A lesson is never one and done. Replaying keeps the completion on record
  // and just runs the deck again from the top.
  const runAgain = () => {
    answersRef.current = {}
    answerDetailRef.current = {}
    setRunSalt(freshSalt())
    dirRef.current = 1
    setAnswered(false)
    setSettled(false)
    setFinished(false)
    setIndex(0)
    setDigiMood('idle')
  }

  // The retake, worn openly as retrieval practice: jump back to just before
  // the first question that went wrong, so the tricky bit gets taught again
  // and the wrong questions come round first. Earlier right answers stay
  // banked; every question from here on is answered fresh and overwrites
  // its old result.
  const tryAgain = () => {
    const firstWrong = slides.findIndex((s, i) => s.type === 'choice' && answersRef.current[i] === false)
    dirRef.current = -1
    setAnswered(false)
    setSettled(false)
    setFinished(false)
    setIndex(firstWrong > 0 ? firstWrong - 1 : 0)
    setDigiMood('idle')
  }

  // ── The takeover shell ── every state below renders inside this full
  // bleed cream stage: thin butter bar on top, quiet header, slide centre,
  // controls at the bottom.
  const phaseLabel = slide?.phase ? ROSENSHINE_LABELS[slide.phase] : null

  // ── The phase strip ── the lesson's shape, made visible.
  //
  // Derived entirely from the `phase` already on every slide, never hand
  // authored, so a deck cannot claim a shape it does not have. Only the
  // phases this deck actually uses are shown: a 12 slide Reception lesson
  // that never reaches Prove should not display an empty Prove pill.
  //
  // Teacher view only. A child working alone through a quest does not need
  // to be told the pedagogical structure of what they are doing, but the
  // deputy head who walks into the back of the classroom very much does,
  // and this is the fastest way to answer them without saying a word.
  const deckPhases = PHASE_ORDER.filter(p => slides.some(s => s.phase === p))
  const lastIndexOfPhase = (p: LessonPhase) => {
    for (let i = slides.length - 1; i >= 0; i--) if (slides[i].phase === p) return i
    return -1
  }

  // ── The cycle map ── which named cycle each slide sits in.
  //
  // Derived, never authored. The cycles carry the same minute budgets the
  // lesson's timing string already states, and every teach slide already
  // carries its own minutes, so walking the teach phase and spending the
  // budget in order tells us where each slide belongs. Nothing has to be
  // tagged by hand, which means a slide added to a deck lands in the right
  // cycle on its own and the map can never drift from the deck.
  //
  // Only the teach phase is mapped. The starter, the practice and the close
  // are the lesson's own arc and they sit outside the cycles by design, which
  // is how the timing string has always described them.
  const cycleOfSlide = useMemo(() => {
    const map: (number | null)[] = new Array(slides.length).fill(null)
    if (!cycles?.length) return map

    const teach: number[] = []
    for (let i = 0; i < slides.length; i++) if (slides[i].phase === 'teach') teach.push(i)
    if (!teach.length) return map

    // A cycle is named after a slide, so it starts at that slide. Migration
    // 270 made that true of all 62 cycles in the scheme by retitling the seven
    // that named nothing in their own deck.
    //
    // The earlier rule spent each cycle's stated minutes against the minutes
    // the slides carry, and moved on when the budget ran out. It read well and
    // it was wrong: budgets are approximations, so boundaries landed a slide
    // early or late and a cycle opened on the slide it names only 28 times out
    // of 61 across the real decks. A pupil on "The three checks" was told they
    // were in "Content can be manufactured".
    const norm = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
        .filter(w => w && !STOPWORDS.has(w))
    const anchorFor = (title: string, from: number) => {
      const tw = norm(title)
      if (!tw.length) return -1
      let best = -1, bestScore = 0
      for (let t = from; t < teach.length; t++) {
        const h = (slides[teach[t]] as { heading?: string }).heading
        if (!h) continue
        const hw = new Set(norm(h))
        const score = tw.filter(w => hw.has(w)).length / tw.length
        if (score > bestScore) { bestScore = score; best = t }
      }
      return bestScore >= 0.5 ? best : -1
    }

    // Cycle one always opens the teach phase. Each later cycle starts at its
    // own slide, and must start after the one before it.
    const starts = [0]
    for (let c = 1; c < cycles.length; c++) {
      const at = anchorFor(cycles[c].title, starts[c - 1] + 1)
      // A title that anchors nowhere leaves this deck unmapped rather than
      // guessed at: a wrong cycle name on screen is worse than none, and the
      // migration's guard exists so this branch stays unreachable in practice.
      if (at < 0) return map
      starts.push(at)
    }

    let ci = 0
    for (let t = 0; t < teach.length; t++) {
      while (ci + 1 < starts.length && t >= starts[ci + 1]) ci++
      map[teach[t]] = ci
    }
    return map
  }, [slides, cycles])

  const cycleIndex = cycleOfSlide[index] ?? null
  const cycle = cycleIndex === null ? null : cycles?.[cycleIndex] ?? null

  // ── The arc rail ── the progress bar and the phase strip as one object.
  //
  // It used to be two rows: a mono status line, then five bordered pills, and
  // together they took 155px of a 900px screen before the slide began (the
  // schools review, 13 September 2026). Now: one segment per phase in the
  // deck, the phase named under it, the current segment in the friend's
  // accent and filling as the slides advance, done segments in soft ink. The
  // segments are equal rather than proportional so the five labels always
  // have room, and the counter beside it carries the exact position.
  // Rosenshine worn openly, in one line. Teacher view only, as the pills were.
  const rail = teacherView && !finished && deckPhases.length > 1 ? (
    <div
      ref={stripRef}
      className="gc-rail"
      aria-label="Lesson phases"
      style={{
        display: 'flex', gap: room(projector, '8px', '5px'), minWidth: 0,
        ...(projector ? { flex: '0 1 clamp(420px, 46vw, 960px)' } : { width: '100%' }),
      }}
    >
      {deckPhases.map(p => {
        const first = slides.findIndex(sl => sl.phase === p)
        const count = slides.filter(sl => sl.phase === p).length
        const isNow = slide?.phase === p
        const isDone = !isNow && lastIndexOfPhase(p) < index
        const fill = isDone ? 100 : isNow ? Math.round(((index - first + 1) / count) * 100) : 0
        return (
          <div key={p} aria-current={isNow ? 'step' : undefined} style={{ flex: 1, minWidth: 0 }}>
            <div style={{ height: room(projector, '7px', '5px'), borderRadius: 'var(--radius-pill)', background: 'var(--border)', overflow: 'hidden' }}>
              <div
                data-rail-fill={p}
                data-fill={fill}
                style={{ height: '100%', width: `${fill}%`, borderRadius: 'var(--radius-pill)', background: isNow ? accent : 'var(--ink-soft)' }}
              />
            </div>
            <div
              data-rail-label
              className="gc-rail-label"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, '10px'), fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: room(projector, '6px', '4px'),
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transformOrigin: 'left center',
                // The current label wears the friend's ink; a DiGi lesson wears
                // ink itself, because butter text on cream does not read.
                color: isNow ? (friend ? inkOn : 'var(--ink)') : isDone ? 'var(--ink-soft)' : 'var(--ink-muted)',
              }}
            >
              {PHASE_LABELS[p]}
            </div>
          </div>
        )
      })}
    </div>
  ) : null

  // The status line. Beside the rail it is the counter, the minutes and the
  // cycle we are in, with the phase left to the rail. Without a rail (the
  // parent app, the child app, the showcase) it reads exactly as it always
  // did: the phase, then the counter.
  const counter = `${index + 1} of ${slides.length}`
  const minutesLine = slide?.minutes ? `~${slide.minutes} min` : ''
  const status = finished
    ? classMode ? 'The showcase' : 'The finish'
    : rail
      ? [counter, minutesLine, cycle ? `${cycle.verb}: ${cycle.title}` : ''].filter(Boolean).join(' · ')
      : `${cycle ? `${cycle.verb}: ${cycle.title} · ` : phaseLabel ? `${phaseLabel} · ` : ''}${counter}${minutesLine ? ` · ${minutesLine}` : ''}`
  // The map is shown at each boundary rather than on every slide: it does its
  // work when a pupil arrives somewhere new, and becomes wallpaper if it never
  // goes away. Oak's deck repeats its cycle map slide at exactly these points.
  const atCycleStart = cycleIndex !== null && (index === 0 || cycleOfSlide[index - 1] !== cycleIndex)

  // ── Back and Continue ── built once, placed by the instrument. On the wall
  // they live in the presenter bar at the bottom of the screen, compact and
  // right aligned, the same place on every slide, so a teacher's hand learns
  // where Continue is. A full width butter bar across a 1920 wall was the
  // PowerPoint tell the review named. On a phone they stay under the slide,
  // full width, exactly as the parent app has always had them.
  const continueLabel = isLast ? 'Finish lesson'
    : isChoice && !answered ? 'Pick an answer to continue'
    : isChoice && !settled ? 'Have another go to continue'
    : 'Continue'
  const controls = (
    <div className="gc-controls" style={{
      display: 'flex', gap: '10px', alignItems: 'center',
      ...(projector ? { flexShrink: 0, marginLeft: 'auto' } : { paddingBottom: 'max(18px, env(safe-area-inset-bottom))' }),
    }}>
      {index > 0 && (
        <button
          onClick={goBack}
          className="btn btn-outline"
          style={{ fontSize: room(projector, WALL.aside, 'var(--text-base)'), padding: room(projector, '16px 26px', '13px 18px'), flexShrink: 0, whiteSpace: projector ? 'nowrap' : undefined }}
        >
          Back
        </button>
      )}
      <button
        onClick={advance}
        disabled={!canContinue}
        className="btn btn-gold"
        // 0.45 fades the text AND the butter together, which on a wall
        // measured 2.31:1 for "Pick an answer to continue". That is an
        // instruction to the whole class, not decoration, so on a
        // projector it fades to 0.75 (5.2:1) and still reads as waiting.
        style={{
          ...(projector ? { minWidth: 'clamp(240px, 18vw, 380px)', whiteSpace: 'nowrap' as const } : { flex: 1 }),
          justifyContent: 'center', fontSize: room(projector, WALL.aside, '16px'),
          padding: room(projector, '16px 30px', '14px 20px'), opacity: canContinue ? 1 : projector ? 0.75 : 0.45,
        }}
      >
        {continueLabel}
      </button>
    </div>
  )

  let body: React.ReactNode

  if (finished && classMode) {
    // The quiet end slide of the whole class showcase: honest about what
    // this is, pointing at the deeper tier schools actually buy.
    body = (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <DigiCharacter mood="wave" size={110} />
        </div>
        <div style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '14px' }}>For schools</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '14px' }}>
          This is the family version.
        </h2>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 28px' }}>
          The full school curriculum goes deeper: complete schemes of work by key stage, word for word teacher scripts, worksheets with answer keys and a printed learning record for every child.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '340px', margin: '0 auto' }}>
          {classCtaHref && (
            <Link href={classCtaHref} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: 'var(--text-md)' }}>
              See the school curriculum
            </Link>
          )}
          <button onClick={runAgain} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
            Play it again ↻
          </button>
        </div>
      </div>
    )
  } else if (finished && kidMode && !passed && lessonSource === 'lesson') {
    // The kid near miss, in kid words: warm, one more go, never shame.
    body = (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <DigiCharacter mood="speak" size={100} />
        </div>
        <div style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Retrieval practice</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Nearly!
        </h2>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '8px' }}>
          You got {correctCount} of {choiceCount} right.
        </p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '340px', margin: '0 auto 24px' }}>
          Going over it again is how it sticks. The tricky bit comes round first, then the questions.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          <button onClick={tryAgain} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: 'var(--text-md)' }}>
            Have another go
          </button>
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
            Back to my lessons
          </Link>
        </div>
      </div>
    )
  } else if (finished && kidMode) {
    const results = Object.values(answersRef.current)
    const correct = results.filter(Boolean).length
    body = (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <DigiCharacter mood="happy" size={110} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          You did it! 🎉
        </h2>
        {results.length > 0 && (
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '6px' }}>
            You got {correct} of {results.length} questions right.
          </p>
        )}
        {typeof kidStars === 'number' && (
          <div style={{
            display: 'inline-block', background: 'var(--terracotta-lt, #FBEEC9)',
            border: '2px solid var(--terracotta)', borderRadius: 'var(--radius-pill)',
            padding: '10px 22px', margin: '10px 0 12px',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)',
          }}>
            ⭐ {kidStars} star{kidStars === 1 ? '' : 's'} in your bank!
          </div>
        )}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 20px' }}>
          {lessonSource === 'lesson'
            ? 'That is a pass, and your grown up just got the good news. One more step down your road to 16.'
            : 'Your grown up just got the good news. Stars mean screen time, and you earned it the smart way.'}
        </p>
        {planetOpened && (
          <div data-planet-opened style={{ maxWidth: '340px', margin: '0 auto 16px', background: '#FFF6DD', border: 'var(--edge)', borderRadius: 'var(--radius-btn)', boxShadow: 'var(--lift)', padding: '12px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.8rem', lineHeight: 1 }} aria-hidden>🚀</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3 }}>
              A new planet is waiting on your map. {planetOpened.title} is open.
            </span>
            <Link href={planetOpened.href} className="btn btn-outline" style={{ fontSize: 'var(--text-sm)', padding: '8px 12px', whiteSpace: 'nowrap' }}>Fly there</Link>
          </div>
        )}
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          {/* Back to the five a day, not to the shelf of lessons.
              A child who came from the lesson row has four other steps waiting
              and the row is now ticked, so the list is the one place they do
              not need to be. homeHref is only set on the child routes, so the
              parent player keeps landing exactly where it always did. */}
          <Link href={homeHref ?? backHref} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: 'var(--text-md)', width: '100%' }}>
            {lessonSource === 'lesson' ? 'Back to my day ⭐' : 'Back to my quests'}
          </Link>
        </div>
      </div>
    )
  } else if (finished && !passed && lessonSource !== 'school_lesson') {
    // The near miss screen, worn openly as retrieval practice: warm, one
    // retry line, never shame. The completion is already saved with passed
    // false; another go can turn it into a pass.
    body = (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <DigiCharacter mood="speak" size={96} />
        </div>
        <div style={{ ...eyebrowOn(projector), color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Retrieval practice</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.4vw, 1.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          Nearly
        </h2>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '8px' }}>
          {correctCount} of {choiceCount} right this time.
        </p>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 26px' }}>
          Going back over it is exactly how learning sticks. It picks up just before the tricky bit, so the idea comes first and the questions come round fresh.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          <button onClick={tryAgain} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: 'var(--text-md)' }}>
            Go back over it
          </button>
          {digiPrompt && (
            <Link href={`/dashboard/digi?q=${encodeURIComponent(digiPrompt)}`} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
              Talk it through with DiGi
            </Link>
          )}
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
            Back to all lessons
          </Link>
        </div>
      </div>
    )
  } else if (finished) {
    const isSchool = lessonSource === 'school_lesson'
    const hasScore = !isSchool && choiceCount > 0
    body = (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <DigiCharacter mood="happy" size={96} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.4vw, 1.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          {hasScore ? 'Passed' : 'Completed'}
        </h2>
        {hasScore && (
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '8px' }}>
            {correctCount} of {choiceCount} right, that is a pass 🌱
          </p>
        )}
        {/* THE PASSPORT, AS IT NOW STANDS. A school lesson ends on the page it
            filled, in the same colours and shape as the child's book at home,
            and the home code that puts today into that book. The count is this
            screen's memory (shared/schools-taught), never a child's record. */}
        {isSchool && passport && passport.placement && passport.placement !== 'after' && (
          <div style={{ margin: '0 auto 18px', maxWidth: 400 }}>
            <PassportPage
              placement={passport.placement}
              moduleId={passport.moduleId}
              fromDevice
              register={register}
              compact
              note="Counted on this screen only. The passport itself is the child's own, kept at home."
            />
          </div>
        )}
        {isSchool && passport && passport.placement === 'after' && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 14px' }}>
            No passport page today. The passport is the journey to sixteen, and this year group is past it.
          </p>
        )}
        {isSchool && passport?.homeCode && (
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto 14px' }}>
            Home code{' '}
            <strong style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginRight: '0.35em' }}>{passport.homeCode.replace(/-/g, ' ')}</strong>
            is on the parent note. Entered at home, it records today in the child&rsquo;s own passport.
          </p>
        )}
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 26px' }}>
          {isSchool
            ? 'Now the worksheet verdicts and the exit cards from the printed pack. The answer key is page four, and the learning record goes in their books.'
            : 'Counted towards your stage progress. The best next step is trying it at home tonight, and you can run it again any time.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          {digiPrompt && (
            <Link href={`/dashboard/digi?q=${encodeURIComponent(digiPrompt)}`} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
              Talk it through with DiGi
            </Link>
          )}
          {!isSchool && (
            <Link href="/dashboard/pathway" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
              See your passport fill →
            </Link>
          )}
          {!isSchool && (
            <button onClick={runAgain} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
              Run it again ↻
            </button>
          )}
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}>
            {isSchool ? 'Back to the curriculum' : 'Back to all lessons'}
          </Link>
        </div>
      </div>
    )
  } else {
    body = (
      <>
        {/* The slide, one idea, centre stage */}
        <div
          ref={slideRef}
          data-slide-type={slide?.type}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            paddingTop: '18px', paddingBottom: '24px',
          }}
        >
          <SlideBody key={index} slide={slide} onAnswered={onAnswered} onSettled={() => setSettled(true)} projector={projector} seed={runSalt + index * 101} tool={tool} register={register} />
          {index === 0 && badges && <BadgeChips badges={badges} projector={projector} />}
        </div>

        {/* Teacher script panel: word for word, teacher screen only by intent.
            The toggle persists across slides so it stays open while teaching. */}
        {hasScripts && !projector && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setScriptOpen(o => !o)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, 'var(--text-xs)'), fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginBottom: '8px',
              }}
            >
              {scriptOpen ? '▾ Teacher script' : '▸ Teacher script'}
            </button>
            {scriptOpen && (
              <div style={{
                background: 'var(--stage-2)', borderLeft: '3px solid var(--terracotta)',
                borderRadius: 'var(--radius-tile)', padding: '13px 16px',
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.aside, 'var(--text-base)'), color: 'var(--ink)', lineHeight: 1.5 }}>
                  {slide.script ?? 'No script for this slide. Let it land, then continue.'}
                </p>
              </div>
            )}
          </div>
        )}

        {!projector && controls}
      </>
    )
  }

  return (
    <div style={{
      // Above the app chrome, because this is a takeover and was not behaving
      // like one.
      //
      // Justin, on a phone mid lesson: "Lessons hsve no way on phone app if
      // seeing how ti goto next page". There has always been a Continue
      // button. It was underneath the tab bar.
      //
      // The player is fixed inset 0 and clearly means to own the screen, but
      // it sat at 60 while the bottom tab bar sits at 100 and the Right Now
      // button at 95. So the tab bar covered the bottom 72px of the deck,
      // which is exactly where the Back and Continue controls live, and the
      // only ways left to advance were a swipe nobody had been told about and
      // an arrow key no phone has.
      //
      // 110 puts the deck above both. The tabs going away for the length of a
      // lesson is right rather than a cost: the header carries its own ×, and
      // a five minute lesson is the one place in this app that should not be
      // competing with six other destinations.
      position: 'fixed', inset: 0, zIndex: 110, background: 'var(--cream)',
      display: 'flex', flexDirection: 'column',
      // The classroom contrast variant re-points two tokens for the whole
      // player (wall-scale.ts). It goes on the root, not on the slide shell,
      // because the header phase line, the phase pills and the cycle map all
      // sit ABOVE the shell and they are the labels the muted ink carries.
      ...(projector ? (WALL_CONTRAST as React.CSSProperties) : {}),
    }} className="gc-lesson-player">
      {/* Authored focus ring: every control in the deck is keyboard reachable,
          and a reachable control with no visible focus is reachable in name
          only. Scoped to the player so neither app's chrome changes. */}
      <style>{`
        .gc-lesson-player a:focus-visible,
        .gc-lesson-player button:focus-visible {
          outline: 3px solid var(--terracotta);
          outline-offset: 2px;
          border-radius: 10px;
        }
        /* The wall's chrome on a narrow screen. The teach route is always the
           wall's instrument (projector sizing) and a teacher still opens it on
           a phone, where a one line chrome and a side by side presenter bar do
           not fit: the rail drops to its own row under the header, its labels
           take a phone size, and the bar stacks the script above full width
           controls. Media queries rather than a width state, so the server and
           the first client paint agree. The important flags override the
           inline wall sizes, which is the one place that is allowed. */
        @media (max-width: 700px) {
          .gc-lesson-player .gc-chrome { flex-wrap: wrap; row-gap: 8px; column-gap: 10px !important; }
          .gc-lesson-player .gc-rail { order: 5; flex: 1 1 100% !important; }
          .gc-lesson-player .gc-rail-label { font-size: 10px !important; letter-spacing: 0.04em !important; margin-top: 4px !important; }
          .gc-lesson-player .gc-status { text-align: left !important; }
          .gc-lesson-player .gc-presenter { flex-direction: column; align-items: stretch; gap: 10px !important; }
          .gc-lesson-player .gc-presenter .gc-controls { margin-left: 0 !important; }
          .gc-lesson-player .gc-presenter .gc-controls > button { flex: 1; min-width: 0 !important; white-space: normal !important; }
          .gc-lesson-player .gc-script { max-height: 12vh !important; }
        }
      `}</style>
      {/* The screen reader's phase label: announces each slide change
          politely, mirroring the visual header line. Visually hidden with
          the clip pattern rather than display none, which silences it. */}
      <div aria-live="polite" style={{
        position: 'absolute', width: '1px', height: '1px', overflow: 'hidden',
        clipPath: 'inset(50%)', whiteSpace: 'nowrap',
      }}>
        {finished
          ? 'Lesson finished'
          : `Slide ${index + 1} of ${slides.length}${phaseLabel ? `, ${phaseLabel}` : ''}`}
      </div>
      {/* The thin butter progress bar, edge to edge. The arc rail carries
          progress in teacher view, so it only draws where there is no rail,
          and it stays away at the finish too rather than appearing there. */}
      {!(teacherView && deckPhases.length > 1) && (
        <div style={{ height: '5px', background: 'var(--border)', flexShrink: 0 }}>
          <div ref={barRef} style={{ height: '100%', width: 0, background: accent, borderRadius: '0 100px 100px 0' }} />
        </div>
      )}

      {/* The reading ahead notice, first slide only. Inside the player because
          the player owns the screen: see the notice prop above. It sits under
          the progress bar and above the header so it is the first thing read,
          and it goes away once the parent is into the deck rather than riding
          every slide. */}
      {notice && index === 0 && !finished && (
        <div style={{ flexShrink: 0, padding: '10px clamp(16px, 4vw, 28px) 0' }}>
          {notice}
        </div>
      )}

      {/* ── The chrome ── one line on the wall: exit, the arc rail, the
          status, the friend and DiGi. On a phone the rail drops under this
          row and the status keeps its old place in the middle. */}
      <div className="gc-chrome" style={{
        display: 'flex', alignItems: 'center', gap: room(projector, '22px', '12px'), flexShrink: 0,
        padding: room(projector, '14px clamp(24px, 4vw, 56px) 10px', '10px clamp(16px, 4vw, 28px)'),
      }}>
        {kidMode ? (
          // A big, obvious way home for a child: never leave them hunting for
          // a tiny cross to get back to their quests.
          <Link href={homeHref ?? backHref} aria-label="Back to my quests" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800,
            color: 'var(--ink)', textDecoration: 'none',
            background: '#fff', border: '2px solid var(--border)', borderRadius: 'var(--radius-pill)',
            padding: '8px 15px', boxShadow: '0 3px 0 var(--border)',
          }}>
            ◀ Quests
          </Link>
        ) : (
          <Link href={backHref} aria-label="Leave the lesson" style={{
            fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, 'var(--text-sm)'), fontWeight: 700,
            color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '0.06em',
            padding: '6px 8px', marginLeft: '-8px',
          }}>
            ✕
          </Link>
        )}
        {projector && rail}
        <span className="gc-status" style={{
          fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, '10.5px'), fontWeight: 700,
          letterSpacing: room(projector, '0.06em', '0.14em'), textTransform: 'uppercase', color: 'var(--ink-muted)',
          // The label gives way, never the star: on a narrow phone a long
          // phase line was crowding DiGi and the star chip to the edge. On the
          // wall it sits right aligned between the rail and the characters.
          flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          textAlign: projector && rail ? 'right' : 'left',
        }}>
          {status}
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          {kidMode && typeof kidStars === 'number' && !finished && (
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
              color: 'var(--ink)', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
              borderRadius: 'var(--radius-pill)', padding: '4px 11px',
            }}>
              ⭐ {kidStars}
            </span>
          )}
          {/* The module's friend keeps watch beside DiGi and shares his mood:
              thinking on a question, a hop on a right answer. DiGi is the
              star; the friend is the host. */}
          {!finished && character && character !== 'digi' && (
            <FriendPlate character={character} register={register} mood={digiMood} size={projector ? 56 : 40} />
          )}
          {!finished && <DigiCharacter mood={digiMood} size={projector ? 48 : 38} />}
        </span>
      </div>

      {/* The rail on a phone: its own row under the header, five equal
          segments with their labels, where five wrapping pills used to be. */}
      {!projector && rail && (
        <div style={{ flexShrink: 0, padding: '0 clamp(16px, 4vw, 28px) 10px' }}>
          {rail}
        </div>
      )}

      {/* The stage: scrolls when a slide runs tall, centres when it does not */}
      <div ref={stageRef} data-stage style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          // Centred in the room rather than pinned to the top. A slide sat at
          // the top of a 1080 projector left a third of the wall empty under
          // it and the content reading as an afterthought. When a slide runs
          // taller than the stage this collapses to the top and the stage
          // scrolls, which is the parent it belongs to doing its job.
          justifyContent: 'center',
          width: '100%',
          maxWidth: room(projector, WALL.wide, '640px'),
          margin: '0 auto',
          padding: projector ? '0 clamp(24px, 4vw, 56px) 12px' : '0 clamp(16px, 4vw, 28px)',
        }}>
          {/* The cycle map, at the boundary. Every cycle listed, the one we
              are entering marked, so a pupil can see the shape of the middle
              of the lesson and where in it they have arrived. */}
          {!finished && atCycleStart && cycles && cycles.length > 1 && (
            <div aria-label="Learning cycles" style={{
              // One line on the wall, a column on a phone. Three stacked rows
              // of 18px type at a cycle boundary was neither readable from
              // the back nor small enough to leave the slide its room.
              display: 'flex', flexDirection: projector ? 'row' : 'column', flexWrap: 'wrap',
              alignItems: projector ? 'baseline' : 'stretch',
              gap: projector ? '6px 28px' : '6px',
              margin: '4px 0 18px', padding: projector ? '12px 22px' : '12px 14px',
              background: soft, border: `1.5px solid ${accent}`,
              borderRadius: 'var(--radius-btn)',
            }}>
              {cycles.map((c, i) => {
                const isNow = i === cycleIndex
                const isDone = i < (cycleIndex ?? 0)
                return (
                  <span
                    key={i}
                    aria-current={isNow ? 'step' : undefined}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: '8px',
                      fontFamily: 'var(--font-display)',
                      fontWeight: isNow ? 900 : 700,
                      fontSize: room(projector, WALL.aside, 'var(--text-base)'),
                      color: isNow ? 'var(--ink)' : 'var(--ink-muted)',
                      // A done cycle recedes, it does not disappear. 0.6 on a
                      // wall measured 2.80:1; 0.82 is 4.5:1 and still visibly
                      // behind the cycle we are in.
                      opacity: isDone ? (projector ? 0.82 : 0.6) : 1,
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, '10px'),
                      fontWeight: 700, letterSpacing: '0.12em',
                      color: isNow ? inkOn : 'var(--ink-muted)',
                    }}>
                      {isDone ? '✓' : i + 1}
                    </span>
                    <span>
                      {c.verb}: {c.title}
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.aside, '10px'),
                        fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ink-muted)',
                        marginLeft: '8px',
                      }}>
                        {c.minutes} MIN
                      </span>
                    </span>
                  </span>
                )
              })}
              {cycle && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.aside, 'var(--text-sm)'),
                  color: 'var(--ink-soft)', lineHeight: 1.5, margin: projector ? 0 : '4px 0 0',
                  flexBasis: projector ? '100%' : undefined,
                }}>
                  {cycle.outcome}
                </p>
              )}
            </div>
          )}
          {body}
        </div>
        {projector && moreBelow && (
          <div aria-hidden data-more-below style={{
            position: 'sticky', bottom: 0, flexShrink: 0, height: '48px', marginTop: '-48px', pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(249, 248, 246, 0), var(--cream) 80%)',
          }} />
        )}
      </div>

      {/* ── The presenter bar ── the teacher's strip under the class's slide.
          Keynote puts the presenter's notes under the slide on the presenter
          display; a classroom has one screen, so the words to say sit here
          at the aside size, on white so they read as the teacher's and not
          the wall's, and Back and Continue keep to the right of them on
          every slide. Outside the scrolling stage on purpose: a slide that
          runs tall scrolls above it and the controls never move. */}
      {projector && !finished && (
        <div
          data-presenter-bar
          className="gc-presenter"
          style={{
            flexShrink: 0, background: '#fff', borderTop: '1.5px solid var(--border)',
            padding: 'clamp(12px, 1.6vh, 18px) clamp(24px, 4vw, 56px) max(clamp(12px, 1.6vh, 18px), env(safe-area-inset-bottom))',
            display: 'flex', alignItems: 'center', gap: '28px',
          }}
        >
          {hasScripts ? (
            <div style={{ flex: 1, minWidth: 0 }}>
              <button
                onClick={() => setScriptOpen(o => !o)}
                aria-expanded={scriptOpen}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: room(projector, WALL.script, 'var(--text-xs)'), fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginBottom: scriptOpen ? '4px' : 0,
                }}
              >
                {scriptOpen ? '▾ Teacher script' : '▸ Teacher script'}
              </button>
              {scriptOpen && (
                <p className="gc-script" style={{
                  fontFamily: 'var(--font-body)', fontSize: room(projector, WALL.script, 'var(--text-base)'),
                  color: 'var(--ink)', lineHeight: 1.4, margin: 0, maxHeight: '24vh', overflowY: 'auto',
                }}>
                  {slide?.script ?? 'No script for this slide. Let it land, then continue.'}
                </p>
              )}
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}
          {controls}
        </div>
      )}
    </div>
  )
}
