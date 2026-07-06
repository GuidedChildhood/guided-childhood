'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import type { LessonSlide, ChoiceSlide, ScenarioSlide, DiagramSlide, DigiSlide } from '@/lib/content/lesson-slides'

// Duolingo mechanics, Guided Childhood skin: one slide at a time, a segmented
// progress bar, an answer that reacts, DiGi responding to how it goes, and a
// completion write so the pathway progress number moves the moment you finish.
//
// v2 (the proper lesson pass): objective and keywords slides, realistic
// scenario posts rendered on screen, animated flow diagrams, the DiGi
// speaking closing, and a teacher script panel under every slide that
// carries one.

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}

function ChoiceBlock({
  slide,
  onAnswered,
}: {
  slide: ChoiceSlide
  onAnswered: (correct: boolean) => void
}) {
  const [picked, setPicked] = useState<number | null>(null)

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    onAnswered(slide.options[i].correct)
  }

  return (
    <div>
      <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
        Quick check
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '20px' }}>
        {slide.question}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slide.options.map((opt, i) => {
          const isPicked = picked === i
          const revealed = picked !== null
          const border = isPicked
            ? opt.correct ? '2px solid var(--terracotta)' : '2px solid var(--stage-3-bold)'
            : revealed && opt.correct ? '2px solid var(--terracotta)' : '1.5px solid var(--border)'
          const bg = isPicked
            ? opt.correct ? 'var(--terracotta-lt)' : 'var(--stage-3)'
            : '#fff'
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                textAlign: 'left', background: bg, border, borderRadius: '16px',
                padding: '14px 16px', cursor: revealed ? 'default' : 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '14.5px', fontWeight: 600,
                color: 'var(--ink)', lineHeight: 1.5, transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {opt.text}
              {isPicked && (
                <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
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

// A realistic feed post, the evidence the class investigates. Phone card
// register: avatar, handle, meta line, body, a big emoji standing in for
// the image, engagement counts. Deliberately convincing, that is the point.
function ScenarioBlock({ slide }: { slide: ScenarioSlide }) {
  const isMessage = slide.platform === 'message'
  return (
    <div>
      <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
        {slide.label ?? 'Evidence'}
      </div>
      <div style={{
        maxWidth: '420px', margin: '0 auto',
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
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55, marginBottom: slide.image || slide.stats ? '12px' : 0 }}>
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
        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)',
          textAlign: 'center', lineHeight: 1.5, maxWidth: '400px', margin: '18px auto 0',
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
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '18px', textAlign: 'center' }}>
        {slide.heading}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, maxWidth: '440px', margin: '0 auto' }}>
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
              <div style={{ fontSize: '18px', color: 'var(--terracotta)', fontWeight: 900, padding: '6px 0' }}>↓</div>
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
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.6, maxWidth: '400px', margin: '16px auto 0' }}>
          {slide.caption}
        </p>
      )}
    </div>
  )
}

// The animated closing: DiGi the golden star bounces in and speaks the
// lesson home one bubble at a time. No render pipeline, always available.
function DigiClosingBlock({ slide }: { slide: DigiSlide }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mood, setMood] = useState<DigiMood>('wave')

  useEffect(() => {
    if (!ref.current) return
    const bubbles = ref.current.querySelectorAll('[data-digi-line]')
    const tl = gsap.timeline()
    tl.fromTo(bubbles, { opacity: 0, y: 14, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 1.1, ease: 'back.out(1.6)',
      onComplete: () => setMood('happy'),
    })
    return () => { tl.kill() }
  }, [])

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      {slide.heading && (
        <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '14px' }}>{slide.heading}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
        <DigiCharacter mood={mood} size={104} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
        {slide.lines.map((line, i) => (
          <div key={i} data-digi-line style={{
            opacity: 0, background: '#fff', border: '2px solid var(--gold, #F2C94C)',
            borderRadius: '18px', padding: '13px 18px', textAlign: 'left',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14.5px',
            color: 'var(--ink)', lineHeight: 1.55, boxShadow: '0 4px 0 var(--border)',
          }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideBody({ slide, onAnswered }: { slide: LessonSlide; onAnswered: (correct: boolean) => void }) {
  switch (slide.type) {
    case 'title':
      return (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          {slide.eyebrow && (
            <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '14px' }}>
              {slide.eyebrow}
            </div>
          )}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '14px' }}>
            {slide.title}
          </h1>
          {slide.body && (
            <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>
              {slide.body}
            </p>
          )}
        </div>
      )
    case 'objective':
      return (
        <div>
          <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
            Today&rsquo;s mission
          </div>
          <div style={{
            background: 'var(--stage-2)', border: '2px solid var(--terracotta)',
            borderRadius: '20px', padding: 'clamp(18px, 3.5vw, 26px)', marginBottom: '16px',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.15rem, 2.8vw, 1.45rem)', color: 'var(--ink)', lineHeight: 1.35, letterSpacing: '-0.02em' }}>
              {slide.outcome}
            </p>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '16px' }}>{slide.why}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {slide.gains.map((g, i) => (
              <div key={i} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '11px 14px' }}>
                <span style={{ color: 'var(--terracotta)', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55 }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'keywords':
      return (
        <div>
          <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
            {slide.heading ?? 'Detective words'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {slide.words.map((w, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '13px 16px' }}>
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
      return (
        <div>
          {slide.emoji && <div style={{ fontSize: '34px', marginBottom: '14px' }}>{slide.emoji}</div>}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '14px' }}>
            {slide.heading}
          </h2>
          <p style={{ fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.75 }}>{slide.body}</p>
        </div>
      )
    case 'quote':
      return (
        <div style={{ background: 'var(--stage-2)', borderRadius: '20px', padding: 'clamp(22px, 4vw, 30px)', borderLeft: '3px solid var(--terracotta)' }}>
          <div style={{ ...eyebrowStyle, color: 'var(--terracotta)', marginBottom: '12px' }}>
            {slide.label ?? 'Say this'}
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem, 2.4vw, 1.3rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, fontStyle: 'italic' }}>
            &ldquo;{slide.text}&rdquo;
          </p>
        </div>
      )
    case 'choice':
      return <ChoiceBlock slide={slide} onAnswered={onAnswered} />
    case 'scenario':
      return <ScenarioBlock slide={slide} />
    case 'diagram':
      return <DiagramBlock slide={slide} />
    case 'digi':
      return <DigiClosingBlock slide={slide} />
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
        <div style={{ background: 'var(--stage-1)', borderRadius: '20px', padding: 'clamp(22px, 4vw, 30px)', border: '1.5px solid var(--stage-1-bold)' }}>
          <div style={{ ...eyebrowStyle, color: 'var(--stage-1-text)', marginBottom: '12px' }}>
            Try it tonight
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.6vw, 1.4rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            {slide.heading}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7 }}>{slide.body}</p>
        </div>
      )
    case 'recap':
      return (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '18px' }}>
            {slide.heading}
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            {slide.points.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '13px 16px' }}>
                <span style={{ color: 'var(--terracotta)', fontWeight: 900, flexShrink: 0 }}>✓</span>
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
}: {
  lessonId: string
  lessonSource: 'lesson' | 'ai_lesson' | 'school_lesson'
  slides: LessonSlide[]
  backHref: string
  digiPrompt?: string
  teacherView?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [digiMood, setDigiMood] = useState<DigiMood>('idle')
  const [finished, setFinished] = useState(false)
  const [scriptOpen, setScriptOpen] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

  const slide = slides[index]
  const isChoice = slide?.type === 'choice'
  const isLast = index === slides.length - 1
  const canContinue = !isChoice || answered
  const hasScripts = teacherView && slides.some(s => s.script)

  useEffect(() => {
    if (!slideRef.current) return
    gsap.fromTo(slideRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
  }, [index, finished])

  useEffect(() => {
    if (slide?.type === 'choice' && !answered) setDigiMood('thinking')
    else if (slide?.type === 'recap') setDigiMood('wave')
    else if (!finished) setDigiMood('idle')
  }, [index, slide?.type, answered, finished])

  const onAnswered = (correct: boolean) => {
    setAnswered(true)
    setDigiMood(correct ? 'happy' : 'speak')
  }

  const advance = async () => {
    if (isLast) {
      setFinished(true)
      setDigiMood('happy')
      try {
        await fetch('/api/lessons/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson_id: lessonId, lesson_source: lessonSource }),
        })
      } catch { /* non-blocking */ }
      return
    }
    setAnswered(false)
    setIndex(i => i + 1)
  }

  if (finished) {
    const isSchool = lessonSource === 'school_lesson'
    return (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <DigiCharacter mood="happy" size={96} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.4vw, 1.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          Lesson done
        </h2>
        <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 26px' }}>
          {isSchool
            ? 'Now the worksheet verdicts and the named exit quizzes. Then one tap on the register records the delivery.'
            : 'Counted towards your stage progress. The best next step is trying it at home tonight.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          {digiPrompt && (
            <Link href={`/dashboard/digi?q=${encodeURIComponent(digiPrompt)}`} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '13px' }}>
              Talk it through with DiGi
            </Link>
          )}
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
            {isSchool ? 'Back to the lesson hub' : 'Back to all lessons'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Segmented progress bar */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '28px' }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '7px', borderRadius: '100px',
            background: i <= index ? 'var(--terracotta)' : 'var(--border)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      {/* DiGi reacting */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px', minHeight: '48px' }}>
        <DigiCharacter mood={digiMood} size={44} />
      </div>

      {/* Slide */}
      <div ref={slideRef} style={{ minHeight: '260px', marginBottom: '20px' }}>
        <SlideBody key={index} slide={slide} onAnswered={onAnswered} />
      </div>

      {/* Teacher script panel: word for word, teacher screen only by intent.
          The toggle persists across slides so it stays open while teaching. */}
      {hasScripts && (
        <div style={{ marginBottom: '20px' }}>
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
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {index > 0 && (
          <button
            onClick={() => { setAnswered(true); setIndex(i => i - 1) }}
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
          style={{ flex: 1, justifyContent: 'center', fontSize: '14px', padding: '14px 20px', opacity: canContinue ? 1 : 0.45 }}
        >
          {isLast ? 'Finish lesson' : isChoice && !answered ? 'Pick an answer to continue' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
