'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import type { LessonSlide, ChoiceSlide } from '@/lib/content/lesson-slides'

// Duolingo mechanics, Guided Childhood skin: one slide at a time, a segmented
// progress bar, an answer that reacts, DiGi responding to how it goes, and a
// completion write so the pathway progress number moves the moment you finish.

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
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '12px' }}>
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

function SlideBody({ slide, onAnswered }: { slide: LessonSlide; onAnswered: (correct: boolean) => void }) {
  switch (slide.type) {
    case 'title':
      return (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          {slide.eyebrow && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '14px' }}>
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '12px' }}>
            {slide.label ?? 'Say this'}
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem, 2.4vw, 1.3rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, fontStyle: 'italic' }}>
            &ldquo;{slide.text}&rdquo;
          </p>
        </div>
      )
    case 'choice':
      return <ChoiceBlock slide={slide} onAnswered={onAnswered} />
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stage-1-text)', marginBottom: '12px' }}>
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
}: {
  lessonId: string
  lessonSource: 'lesson' | 'ai_lesson' | 'school_lesson'
  slides: LessonSlide[]
  backHref: string
  digiPrompt?: string
}) {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [digiMood, setDigiMood] = useState<DigiMood>('idle')
  const [finished, setFinished] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

  const slide = slides[index]
  const isChoice = slide?.type === 'choice'
  const isLast = index === slides.length - 1
  const canContinue = !isChoice || answered

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
    return (
      <div ref={slideRef} style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <DigiCharacter mood="happy" size={96} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.4vw, 1.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
          Lesson done
        </h2>
        <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 26px' }}>
          Counted towards your stage progress. The best next step is trying it at home tonight.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto' }}>
          {digiPrompt && (
            <Link href={`/dashboard/digi?q=${encodeURIComponent(digiPrompt)}`} className="btn btn-gold" style={{ justifyContent: 'center', fontSize: '13px' }}>
              Talk it through with DiGi
            </Link>
          )}
          <Link href={backHref} className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '13px' }}>
            Back to all lessons
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
      <div ref={slideRef} style={{ minHeight: '260px', marginBottom: '28px' }}>
        <SlideBody key={index} slide={slide} onAnswered={onAnswered} />
      </div>

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
