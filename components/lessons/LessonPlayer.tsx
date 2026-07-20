'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import AnimatedIntro from '@/components/lessons/AnimatedIntro'
import { ROSENSHINE_LABELS, type LessonSlide, type ChoiceSlide, type ScenarioSlide, type DiagramSlide, type DigiSlide, type DiscussionSlide, type StatSlide } from '@/lib/content/lesson-slides'
import type { CurriculumBadges } from '@/lib/content/curriculum-badges'
import Interactive from '@/components/lessons/interactives'

// The cinematic player, v3. One player build lifts every lesson at once
// because slides are data: full bleed one idea slides on a cream stage,
// huge Nunito 900 headlines, GSAP slide transitions with staggered element
// reveals so a concept builds piece by piece, a thin butter progress bar,
// swipe and arrow key navigation, and DiGi popping in with his bubble.
// Rosenshine worn openly: a quiet mono phase label on every slide
// (RETRIEVAL / TEACH / PRACTISE / PROVE / CLOSE) and the retake framed as
// retrieval practice. The choice score and the 70 percent pass system are
// untouched from the v2 pass build.

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}

// The two curriculum chips: Key Stage and the Education for a Connected
// World strand. Small, mono, honest. Shown on the intro slide.
function BadgeChips({ badges }: { badges: CurriculumBadges }) {
  if (!badges.keyStage && !badges.strand) return null
  const chip: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)',
    background: '#fff', border: '1.5px solid var(--border)',
    borderRadius: '100px', padding: '5px 12px', whiteSpace: 'nowrap',
  }
  return (
    <div data-reveal style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
      {badges.keyStage && <span style={chip}>{badges.keyStage}</span>}
      {badges.strand && <span style={chip}>EfCW: {badges.strand}</span>}
    </div>
  )
}

function ChoiceBlock({
  slide,
  onAnswered,
  projector = false,
}: {
  slide: ChoiceSlide
  onAnswered: (correct: boolean) => void
  projector?: boolean
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    onAnswered(slide.options[i].correct)
    // The tactile beat: the picked answer pops the moment it is tapped.
    const el = rootRef.current?.querySelector(`[data-choice-opt="${i}"]`)
    if (el) {
      gsap.fromTo(el, { scale: 0.97 }, {
        scale: 1, duration: 0.45,
        ease: slide.options[i].correct ? 'back.out(3)' : 'power2.out',
      })
    }
  }

  return (
    <div ref={rootRef}>
      <div data-reveal style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '14px', textAlign: 'center' }}>
        {projector ? 'Hands up, then tap the class answer' : 'Quick check'}
      </div>
      <h2 data-reveal style={{
        fontFamily: 'var(--font-display)', fontSize: projector ? 'clamp(1.8rem, 3.6vw, 2.6rem)' : 'clamp(1.45rem, 4.5vw, 1.9rem)',
        fontWeight: 900, color: 'var(--ink)', lineHeight: 1.22, letterSpacing: '-0.02em',
        marginBottom: '24px', textAlign: 'center', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto',
      }}>
        {slide.question}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: projector ? '760px' : '520px', margin: '0 auto' }}>
        {slide.options.map((opt, i) => {
          const isPicked = picked === i
          const revealed = picked !== null
          const showRight = revealed && opt.correct
          const border = isPicked
            ? opt.correct ? '2.5px solid var(--terracotta-dark)' : '2.5px solid var(--ink-muted)'
            : showRight ? '2.5px solid var(--terracotta-dark)' : '2px solid var(--border)'
          const bg = isPicked
            ? opt.correct ? 'var(--terracotta-lt)' : 'var(--cream)'
            : showRight ? 'var(--terracotta-lt)' : '#fff'
          const shadow = revealed
            ? isPicked || showRight ? '0 3px 0 var(--border)' : 'none'
            : '0 5px 0 var(--border)'
          return (
            <button
              key={i}
              data-choice-opt={i}
              data-reveal
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                textAlign: 'left', background: bg, border, borderRadius: '18px',
                padding: projector ? '20px 24px' : '17px 20px',
                cursor: revealed ? 'default' : 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: projector ? '20px' : '16px', fontWeight: 800,
                color: 'var(--ink)', lineHeight: 1.45,
                boxShadow: shadow,
                transform: revealed && (isPicked || showRight) ? 'translateY(2px)' : 'none',
                transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s',
              }}
            >
              {opt.text}
              {isPicked && (
                <span style={{
                  display: 'block', marginTop: '10px',
                  fontFamily: 'var(--font-body)', fontSize: projector ? '17px' : '14px',
                  fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.55,
                }}>
                  {opt.correct ? '✓ ' : ''}{opt.feedback}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// A timed talk task. The countdown runs in the player so the teacher never
// watches a clock: start it, circulate, the chime state shows when time is up.
function DiscussionBlock({ slide }: { slide: DiscussionSlide }) {
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
      <div data-reveal style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '14px' }}>
        Talk task · {modeLabel}
      </div>
      <h2 data-reveal style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.45rem, 3.6vw, 2rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.3, letterSpacing: '-0.02em', maxWidth: '560px', margin: '0 auto 26px' }}>
        {slide.prompt}
      </h2>
      <div data-reveal style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        background: done ? 'var(--stage-1)' : '#fff', border: `2px solid ${done ? 'var(--stage-1-bold)' : 'var(--border)'}`,
        borderRadius: '20px', padding: '18px 34px', boxShadow: '0 5px 0 var(--border)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '42px', color: done ? 'var(--stage-1-text)' : 'var(--ink)', lineHeight: 1 }}>
          {done ? 'Time!' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}
        </span>
        {!done && (
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
              background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
              borderRadius: '12px', padding: '9px 20px', cursor: 'pointer',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            {running ? 'Pause' : left === total ? 'Start the timer' : 'Keep going'}
          </button>
        )}
      </div>
      {done && slide.lookFor && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7, maxWidth: '460px', margin: '18px auto 0' }}>
          <strong>A good answer sounds like:</strong> {slide.lookFor}
        </p>
      )}
    </div>
  )
}

// One big number, always with its source. Evidence, never a scare tactic.
function StatBlock({ slide }: { slide: StatSlide }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <div data-reveal style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '18px' }}>The evidence</div>
      <div data-reveal style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(3.6rem, 11vw, 5.6rem)', color: 'var(--terracotta-dark)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        {slide.figure}
      </div>
      <p data-reveal style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 2.8vw, 1.5rem)', color: 'var(--ink)', lineHeight: 1.4, maxWidth: '480px', margin: '0 auto 14px' }}>
        {slide.claim}
      </p>
      <p data-reveal style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
        Source: {slide.source}
      </p>
    </div>
  )
}

// A realistic feed post, the evidence the class investigates. Phone card
// register: avatar, handle, meta line, body, a big emoji standing in for
// the image, engagement counts. Deliberately convincing, that is the point.
function ScenarioBlock({ slide }: { slide: ScenarioSlide }) {
  const isMessage = slide.platform === 'message'
  return (
    <div>
      <div data-reveal style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '14px', textAlign: 'center' }}>
        {slide.label ?? 'Evidence'}
      </div>
      <div data-reveal style={{
        maxWidth: '440px', margin: '0 auto',
        background: isMessage ? 'var(--stage-1)' : '#fff',
        border: '1.5px solid var(--border)', borderRadius: '22px',
        padding: '16px 18px', boxShadow: '0 6px 0 var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', background: 'var(--stage-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
          }}>
            {slide.avatar}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>{slide.handle}</div>
            {slide.meta && <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-muted)' }}>{slide.meta}</div>}
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16.5px', color: 'var(--ink)', lineHeight: 1.7, marginBottom: slide.image || slide.stats ? '12px' : 0 }}>
          {slide.text}
        </p>
        {slide.image && (
          <div style={{
            background: 'var(--stage-2)', borderRadius: '14px', padding: '26px 0',
            textAlign: 'center', fontSize: '52px', marginBottom: slide.stats ? '10px' : 0,
          }}>
            {slide.image}
          </div>
        )}
        {slide.stats && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
            {slide.stats}
          </div>
        )}
      </div>
      {slide.prompt && (
        <p data-reveal style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1rem, 2.4vw, 1.2rem)', color: 'var(--ink)',
          textAlign: 'center', lineHeight: 1.5, maxWidth: '440px', margin: '20px auto 0',
        }}>
          {slide.prompt}
        </p>
      )}
    </div>
  )
}

// Animated flow diagram: steps drop in one by one with connectors, verdict
// chips pop at the end. Built from data, no images, photocopies cleanly.
function DiagramBlock({ slide }: { slide: DiagramSlide }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const steps = ref.current.querySelectorAll('[data-diagram-step]')
    const chips = ref.current.querySelectorAll('[data-diagram-chip]')
    const tl = gsap.timeline()
    tl.fromTo(steps, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.35, ease: 'power2.out' })
    if (chips.length) tl.fromTo(chips, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.12, ease: 'back.out(2)' }, '+=0.1')
    return () => { tl.kill() }
  }, [])

  return (
    <div ref={ref}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.45rem, 3.6vw, 2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '20px', textAlign: 'center' }}>
        {slide.heading}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, maxWidth: '460px', margin: '0 auto' }}>
        {slide.steps.map((step, i) => (
          <div key={i} data-diagram-step style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '100%', display: 'flex', gap: '14px', alignItems: 'center',
              background: '#fff', border: '2px solid var(--terracotta)', borderRadius: '18px',
              padding: '14px 18px', boxShadow: '0 5px 0 var(--terracotta-lt)',
            }}>
              <span style={{ fontSize: '30px', flexShrink: 0 }}>{step.emoji}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>{step.title}</div>
                {step.text && <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{step.text}</div>}
              </div>
            </div>
            {i < slide.steps.length - 1 && (
              <div style={{ fontSize: '18px', color: 'var(--terracotta-dark)', fontWeight: 900, padding: '6px 0' }}>↓</div>
            )}
          </div>
        ))}
        {slide.verdicts && slide.verdicts.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
            {slide.verdicts.map((v, i) => (
              <span key={i} data-diagram-chip style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                background: 'var(--stage-1)', border: '2px solid var(--stage-1-bold)',
                color: 'var(--stage-1-text)', borderRadius: '100px', padding: '8px 16px',
              }}>
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
      {slide.caption && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.6, maxWidth: '420px', margin: '16px auto 0' }}>
          {slide.caption}
        </p>
      )}
    </div>
  )
}

// DiGi popping in with his bubble: the app greeting treatment. The golden
// star lands in his butter circle, then speaks the lesson home one white
// bubble at a time. No render pipeline, always available.
function DigiClosingBlock({ slide }: { slide: DigiSlide }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mood, setMood] = useState<DigiMood>('wave')

  useEffect(() => {
    if (!ref.current) return
    const avatar = ref.current.querySelector('[data-digi-avatar]')
    const bubbles = ref.current.querySelectorAll('[data-digi-line]')
    const tl = gsap.timeline()
    if (avatar) tl.fromTo(avatar, { opacity: 0, scale: 0.4, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)' })
    tl.fromTo(bubbles, { opacity: 0, y: 14, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 1.0, ease: 'back.out(1.6)',
      onComplete: () => setMood('happy'),
    }, '-=0.1')
    return () => { tl.kill() }
  }, [])

  return (
    <div ref={ref}>
      {slide.heading && (
        <div style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '18px', textAlign: 'center' }}>{slide.heading}</div>
      )}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '460px', margin: '0 auto' }}>
        <span data-digi-avatar style={{
          opacity: 0, width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
          background: 'var(--terracotta)', border: '2px solid var(--terracotta-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 0 var(--terracotta-dark)',
        }}>
          <DigiCharacter mood={mood} size={38} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, paddingTop: '4px' }}>
          {slide.lines.map((line, i) => (
            <div key={i} data-digi-line style={{
              opacity: 0, background: '#fff', border: '1.5px solid var(--border)',
              borderRadius: i === 0 ? '4px 18px 18px 18px' : '18px', padding: '13px 18px', textAlign: 'left',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15.5px',
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

function SlideBody({
  slide, onAnswered, projector,
}: {
  slide: LessonSlide
  onAnswered: (correct: boolean) => void
  projector?: boolean
}) {
  switch (slide.type) {
    case 'title':
      return (
        <div style={{ padding: '4px 0' }}>
          {/* The animated character intro is the opener: DiGi the star kicks
              off, the title reveals, far cleaner than a busy stock scene. */}
          <AnimatedIntro eyebrow={slide.eyebrow} title={slide.title} character={slide.character} />
          {slide.body && (
            <p data-reveal style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '420px', margin: '18px auto 0', textAlign: 'center' }}>
              {slide.body}
            </p>
          )}
        </div>
      )
    case 'objective':
      return (
        <div>
          <div data-reveal style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '14px' }}>
            Today&rsquo;s mission
          </div>
          <div data-reveal style={{
            background: 'var(--stage-2)', border: '2px solid var(--terracotta)',
            borderRadius: '20px', padding: 'clamp(20px, 4vw, 30px)', marginBottom: '18px',
            boxShadow: '0 5px 0 var(--terracotta-lt)',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 3.2vw, 1.7rem)', color: 'var(--ink)', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              {slide.outcome}
            </p>
          </div>
          <p data-reveal style={{ fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '16px' }}>{slide.why}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {slide.gains.map((g, i) => (
              <div key={i} data-reveal style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '12px 15px' }}>
                <span style={{ color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55 }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'keywords':
      return (
        <div>
          <div data-reveal style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '14px' }}>
            {slide.heading ?? 'Detective words'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {slide.words.map((w, i) => (
              <div key={i} data-reveal style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '13px 16px' }}>
                <span style={{
                  display: 'inline-block', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px',
                  color: 'var(--stage-1-text)', background: 'var(--stage-1)', border: '1.5px solid var(--stage-1-bold)',
                  borderRadius: '8px', padding: '3px 10px', marginBottom: '7px',
                }}>
                  {w.word}
                </span>
                <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>{w.meaning}</p>
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
          {slide.emoji && <div data-reveal style={{ fontSize: 'clamp(2.6rem, 6vw, 3.4rem)', marginBottom: '16px', lineHeight: 1 }}>{slide.emoji}</div>}
          <h2 data-reveal style={{
            fontFamily: 'var(--font-display)', fontSize: projector ? 'clamp(2.2rem, 4.5vw, 3.2rem)' : 'clamp(1.7rem, 5.5vw, 2.4rem)',
            fontWeight: 900, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: '18px',
            maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            {slide.heading}
          </h2>
          <p data-reveal style={{
            fontSize: projector ? 'clamp(1.1rem, 2vw, 1.35rem)' : 'clamp(1rem, 2.4vw, 1.1rem)',
            color: 'var(--ink)', lineHeight: 1.75, maxWidth: '540px', margin: '0 auto', textAlign: 'left',
          }}>
            {slide.body}
          </p>
        </div>
      )
    case 'quote':
      return (
        <div data-reveal style={{ background: 'var(--stage-2)', borderRadius: '20px', padding: 'clamp(24px, 4.5vw, 34px)', borderLeft: '3px solid var(--terracotta)', maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
            {slide.label ?? 'Say this'}
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.8vw, 1.45rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, fontStyle: 'italic' }}>
            &ldquo;{slide.text}&rdquo;
          </p>
        </div>
      )
    case 'choice':
      return <ChoiceBlock slide={slide} onAnswered={onAnswered} projector={projector} />
    case 'discussion':
      return <DiscussionBlock slide={slide} />
    case 'stat':
      return <StatBlock slide={slide} />
    case 'scenario':
      return <ScenarioBlock slide={slide} />
    case 'diagram':
      return <DiagramBlock slide={slide} />
    case 'digi':
      return <DigiClosingBlock slide={slide} />
    case 'interactive':
      return <Interactive component={slide.component} config={slide.config} caption={slide.caption} />
    case 'video':
      return (
        <div>
          <video
            src={slide.src}
            poster={slide.poster}
            controls
            playsInline
            style={{ width: '100%', borderRadius: '20px', background: 'var(--ink)', display: 'block' }}
          />
          {slide.caption && (
            <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '10px', textAlign: 'center' }}>
              {slide.caption}
            </p>
          )}
        </div>
      )
    case 'tryit':
      return (
        <div data-reveal style={{ background: 'var(--stage-1)', borderRadius: '20px', padding: 'clamp(24px, 4.5vw, 34px)', border: '1.5px solid var(--stage-1-bold)', maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ ...eyebrowStyle, color: 'var(--stage-1-text)', marginBottom: '12px' }}>
            Try it tonight
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            {slide.heading}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7 }}>{slide.body}</p>
        </div>
      )
    case 'recap':
      return (
        <div>
          <h2 data-reveal style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.45rem, 3.6vw, 2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '18px', textAlign: 'center' }}>
            {slide.heading}
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, maxWidth: '520px', margin: '0 auto' }}>
            {slide.points.map((p, i) => (
              <li key={i} data-reveal style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '13px 16px' }}>
                <span style={{ color: 'var(--terracotta-dark)', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.6 }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )
  }
}

export default function LessonPlayer({
  lessonId,
  lessonSource,
  slides,
  backHref,
  digiPrompt,
  teacherView = false,
  kidMode = false,
  kidStars,
  completeEndpoint,
  completeBody,
  badges,
  classMode = false,
  initialIndex = 0,
}: {
  lessonId: string
  lessonSource: 'lesson' | 'ai_lesson' | 'school_lesson'
  slides: LessonSlide[]
  backHref: string
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
  // Whole class projector mode: everything bigger, arrow keys advance, and
  // the finish is the quiet signpost to the school curriculum tier.
  classMode?: boolean
  // Open at a given slide (dev fixtures and deep links).
  initialIndex?: number
}) {
  const projector = classMode
  const [index, setIndex] = useState(() => Math.min(Math.max(initialIndex, 0), Math.max(slides.length - 1, 0)))
  const [answered, setAnswered] = useState(false)
  const [digiMood, setDigiMood] = useState<DigiMood>('idle')
  const [finished, setFinished] = useState(false)
  const [scriptOpen, setScriptOpen] = useState(false)
  // Per choice slide result, keyed by slide index so revisits do not double count.
  const answersRef = useRef<Record<number, boolean>>({})
  const slideRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  // Which way the deck is moving, so the slide transition matches the gesture.
  const dirRef = useRef(1)
  const touchStartX = useRef<number | null>(null)

  const slide = slides[index]
  const isChoice = slide?.type === 'choice'
  const isLast = index === slides.length - 1
  const canContinue = !isChoice || answered
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
    const el = slideRef.current
    const reveals = el.querySelectorAll('[data-reveal]')
    const tl = gsap.timeline()
    tl.fromTo(el, { opacity: 0, x: 36 * dirRef.current }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' })
    if (reveals.length) {
      tl.fromTo(reveals, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: 'power2.out' }, '-=0.2')
    }
    stageRef.current?.scrollTo({ top: 0 })
    return () => { tl.kill() }
  }, [index, finished])

  // The thin butter progress bar breathes forward with every slide.
  useEffect(() => {
    if (!barRef.current) return
    const pct = finished ? 100 : ((index + 1) / Math.max(slides.length, 1)) * 100
    gsap.to(barRef.current, { width: `${pct}%`, duration: 0.5, ease: 'power2.out' })
  }, [index, finished, slides.length])

  useEffect(() => {
    if (slide?.type === 'choice' && !answered) setDigiMood('thinking')
    else if (slide?.type === 'recap') setDigiMood('wave')
    else if (!finished) setDigiMood('idle')
  }, [index, slide?.type, answered, finished])

  const onAnswered = (correct: boolean) => {
    setAnswered(true)
    answersRef.current[index] = correct
    setDigiMood(correct ? 'happy' : 'speak')
  }

  const advance = useCallback(async () => {
    dirRef.current = 1
    if (isLast) {
      setFinished(true)
      setDigiMood(passed ? 'happy' : 'speak')
      if (completeEndpoint === null) return
      // A failed run still writes the completion, with passed false, so the
      // record is honest and the retake can upgrade it to a pass.
      try {
        await fetch(completeEndpoint ?? '/api/lessons/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: lessonId,
            lesson_source: lessonSource,
            correct: Object.values(answersRef.current).filter(Boolean).length,
            total: choiceCount,
            ...completeBody,
          }),
        })
      } catch { /* non-blocking */ }
      return
    }
    setAnswered(false)
    setIndex(i => i + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLast, passed, completeEndpoint, lessonId, lessonSource, choiceCount, completeBody])

  const goBack = useCallback(() => {
    if (index === 0) return
    dirRef.current = -1
    setAnswered(true)
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
    dirRef.current = 1
    setAnswered(false)
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
    setFinished(false)
    setIndex(firstWrong > 0 ? firstWrong - 1 : 0)
    setDigiMood('idle')
  }

  // ── The takeover shell ── every state below renders inside this full
  // bleed cream stage: thin butter bar on top, quiet header, slide centre,
  // controls at the bottom.
  const phaseLabel = slide?.phase ? ROSENSHINE_LABELS[slide.phase] : null

  let body: React.ReactNode

  if (finished && classMode) {
    // The quiet end slide of the whole class showcase: honest about what
    // this is, pointing at the deeper tier schools actually buy.
    body = (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <DigiCharacter mood="wave" size={110} />
        </div>
        <div style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '14px' }}>For schools</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: '14px' }}>
          This is the family version.
        </h2>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 28px' }}>
          The full school curriculum goes deeper: complete schemes of work by key stage, teacher scripts, assessment and progress evidence for every child.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '340px', margin: '0 auto' }}>
          <Link href="/schools" className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '15px' }}>
            See the school curriculum
          </Link>
          <button onClick={runAgain} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
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
        <div style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Retrieval practice</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Nearly!
        </h2>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '8px' }}>
          You got {correctCount} of {choiceCount} right.
        </p>
        <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '340px', margin: '0 auto 24px' }}>
          Going over it again is how it sticks. The tricky bit comes round first, then the questions.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          <button onClick={tryAgain} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '14px' }}>
            Have another go
          </button>
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
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
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '6px' }}>
            You got {correct} of {results.length} questions right.
          </p>
        )}
        {typeof kidStars === 'number' && (
          <div style={{
            display: 'inline-block', background: 'var(--terracotta-lt, #FBEEC9)',
            border: '2px solid var(--terracotta)', borderRadius: '100px',
            padding: '10px 22px', margin: '10px 0 12px',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)',
          }}>
            ⭐ {kidStars} star{kidStars === 1 ? '' : 's'} in your bank!
          </div>
        )}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 20px' }}>
          {lessonSource === 'lesson'
            ? 'That is a pass, and your grown up just got the good news. One more step down your road to 16.'
            : 'Your grown up just got the good news. Stars mean screen time, and you earned it the smart way.'}
        </p>
        <div style={{ maxWidth: '300px', margin: '0 auto' }}>
          <Link href={backHref} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '14px', width: '100%' }}>
            {lessonSource === 'lesson' ? 'Back to my road ⭐' : 'Back to my quests'}
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
        <div style={{ ...eyebrowStyle, color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Retrieval practice</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.4vw, 1.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          Nearly
        </h2>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '8px' }}>
          {correctCount} of {choiceCount} right this time.
        </p>
        <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 26px' }}>
          Going back over it is exactly how learning sticks. It picks up just before the tricky bit, so the idea comes first and the questions come round fresh.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          <button onClick={tryAgain} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '14px' }}>
            Go back over it
          </button>
          {digiPrompt && (
            <Link href={`/dashboard/digi?q=${encodeURIComponent(digiPrompt)}`} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
              Talk it through with DiGi
            </Link>
          )}
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
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
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '8px' }}>
            {correctCount} of {choiceCount} right, that is a pass 🌱
          </p>
        )}
        <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 26px' }}>
          {isSchool
            ? 'Now the worksheet verdicts and the named exit quizzes. Then one tap on the register records the delivery.'
            : 'Counted towards your stage progress. The best next step is trying it at home tonight, and you can run it again any time.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          {digiPrompt && (
            <Link href={`/dashboard/digi?q=${encodeURIComponent(digiPrompt)}`} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '13px' }}>
              Talk it through with DiGi
            </Link>
          )}
          {!isSchool && (
            <Link href="/dashboard/tracker" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
              See your passport fill →
            </Link>
          )}
          {!isSchool && (
            <button onClick={runAgain} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
              Run it again ↻
            </button>
          )}
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
            {isSchool ? 'Back to the lesson hub' : 'Back to all lessons'}
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
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            paddingTop: '18px', paddingBottom: '24px',
          }}
        >
          <SlideBody key={index} slide={slide} onAnswered={onAnswered} projector={projector} />
          {index === 0 && badges && <BadgeChips badges={badges} />}
        </div>

        {/* Teacher script panel: word for word, teacher screen only by intent.
            The toggle persists across slides so it stays open while teaching. */}
        {hasScripts && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setScriptOpen(o => !o)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginBottom: '8px',
              }}
            >
              {scriptOpen ? '▾ Teacher script' : '▸ Teacher script'}
            </button>
            {scriptOpen && (
              <div style={{
                background: 'var(--stage-2)', borderLeft: '3px solid var(--terracotta)',
                borderRadius: '12px', padding: '13px 16px',
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.65 }}>
                  {slide.script ?? 'No script for this slide. Let it land, then continue.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: 'max(18px, env(safe-area-inset-bottom))' }}>
          {index > 0 && (
            <button
              onClick={goBack}
              className="btn btn-outline"
              style={{ fontSize: '13px', padding: '13px 18px', flexShrink: 0 }}
            >
              Back
            </button>
          )}
          <button
            onClick={advance}
            disabled={!canContinue}
            className="btn btn-gold"
            style={{ flex: 1, justifyContent: 'center', fontSize: projector ? '16px' : '14px', padding: '14px 20px', opacity: canContinue ? 1 : 0.45 }}
          >
            {isLast ? 'Finish lesson' : isChoice && !answered ? 'Pick an answer to continue' : 'Continue'}
          </button>
        </div>
      </>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60, background: 'var(--cream)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* The thin butter progress bar, edge to edge */}
      <div style={{ height: '5px', background: 'var(--border)', flexShrink: 0 }}>
        <div ref={barRef} style={{ height: '100%', width: 0, background: 'var(--terracotta)', borderRadius: '0 100px 100px 0' }} />
      </div>

      {/* Quiet header: exit, the Rosenshine phase label, DiGi keeping watch */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
        padding: '10px clamp(16px, 4vw, 28px)',
      }}>
        <Link href={backHref} aria-label="Leave the lesson" style={{
          fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
          color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '0.06em',
          padding: '6px 8px', marginLeft: '-8px',
        }}>
          ✕
        </Link>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: projector ? '13px' : '10.5px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        }}>
          {finished
            ? classMode ? 'The showcase' : 'The finish'
            : `${phaseLabel ? `${phaseLabel} · ` : ''}${index + 1} of ${slides.length}${!projector && slide?.minutes ? ` · ~${slide.minutes} min` : ''}`}
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          {kidMode && typeof kidStars === 'number' && !finished && (
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '12.5px',
              color: 'var(--ink)', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
              borderRadius: '100px', padding: '4px 11px',
            }}>
              ⭐ {kidStars}
            </span>
          )}
          {!finished && <DigiCharacter mood={digiMood} size={projector ? 52 : 38} />}
        </span>
      </div>

      {/* The stage: scrolls when a slide runs tall, centres when it does not */}
      <div ref={stageRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          width: '100%', maxWidth: projector ? '980px' : '640px',
          margin: '0 auto', padding: '0 clamp(16px, 4vw, 28px)',
        }}>
          {body}
        </div>
      </div>
    </div>
  )
}
