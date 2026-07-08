'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lesson, LessonSlide } from '@/lib/lessons/flagship-misinfo'

// The lesson slide player: full screen, deck card slides with the curved
// band, one idea per slide, tap to advance, an interactive check, and a
// close that points at the next lesson. The engine build moves lesson
// content into the database; this player is the format proof.

const BAND = '#2F8F6B'
const TINT = '#DEF0E7'

export default function SlidePlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [fading, setFading] = useState(false)

  const slide = lesson.slides[index]
  const isLast = index === lesson.slides.length - 1
  const canAdvance = slide.type !== 'check' || picked !== null

  function go(dir: 1 | -1) {
    const next = index + dir
    if (next < 0 || next >= lesson.slides.length) return
    setFading(true)
    setTimeout(() => {
      setIndex(next)
      setPicked(null)
      setFading(false)
    }, 180)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 120,
      background: 'var(--deep-teal)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: 'max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))',
    }}>
      <div style={{ width: 'min(100%, 540px)', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

        {/* Progress + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button
            onClick={() => router.push('/dashboard/lessons')}
            aria-label="Close lesson"
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              border: '1.5px solid rgba(255,255,255,0.5)', background: 'transparent',
              color: '#fff', fontSize: '15px', cursor: 'pointer',
            }}
          >
            ✕
          </button>
          <div style={{ flex: 1, height: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '8px', background: 'var(--terracotta)',
              width: `${((index + 1) / lesson.slides.length) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>
            {index + 1}/{lesson.slides.length}
          </span>
        </div>

        {/* Slide card */}
        <div style={{
          flex: 1, minHeight: 0, background: TINT, borderRadius: '26px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
          opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'none',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}>
          <div style={{
            background: BAND, padding: '16px 22px 22px',
            borderRadius: '0 0 50% 50% / 0 0 24px 24px', flexShrink: 0,
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              {lesson.title} · {lesson.minutes} minutes together
            </p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 20px' }}>
            <SlideBody slide={slide} picked={picked} onPick={setPicked} />
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          {index > 0 && (
            <button
              onClick={() => go(-1)}
              style={{
                padding: '15px 20px', background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '16px',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
                color: '#fff', cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => isLast ? router.push('/dashboard/lessons') : go(1)}
            disabled={!canAdvance}
            style={{
              flex: 1, padding: '15px 20px',
              background: canAdvance ? 'var(--terracotta)' : 'rgba(255,255,255,0.15)',
              border: 'none', borderRadius: '16px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
              color: canAdvance ? 'var(--ink)' : 'rgba(255,255,255,0.5)',
              cursor: canAdvance ? 'pointer' : 'not-allowed',
              boxShadow: canAdvance ? '0 5px 0 var(--terracotta-dark)' : 'none',
            }}
          >
            {isLast ? 'Finish the lesson' : slide.type === 'check' && picked === null ? 'Pick an answer first' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SlideBody({ slide, picked, onPick }: {
  slide: LessonSlide
  picked: number | null
  onPick: (i: number) => void
}) {
  const h = (text: string) => (
    <h2 style={{
      fontFamily: 'var(--font-display)', fontWeight: 900,
      fontSize: 'clamp(1.4rem, 6vw, 1.9rem)', color: 'var(--ink)',
      letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 14px',
    }}>
      {text}
    </h2>
  )
  const p = (text: string, size = 16) => (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: `${size}px`, color: 'var(--ink)', lineHeight: 1.65, margin: '0 0 14px', fontWeight: 500 }}>
      {text}
    </p>
  )
  const eyebrow = (text: string) => (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: BAND, margin: '0 0 8px' }}>
      {text}
    </p>
  )

  if (slide.type === 'title') return (
    <>
      {eyebrow(slide.eyebrow)}
      {h(slide.heading)}
      {p(slide.body, 17)}
    </>
  )

  if (slide.type === 'gate') return (
    <>
      {h(slide.heading)}
      {p(slide.body)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slide.checks.map((c, i) => (
          <div key={i} style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.65)', borderRadius: '14px', padding: '13px 15px',
          }}>
            <span style={{ color: BAND, fontWeight: 800, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55 }}>{c}</span>
          </div>
        ))}
      </div>
    </>
  )

  if (slide.type === 'teach') return (
    <>
      {eyebrow(slide.eyebrow)}
      {h(slide.heading)}
      {p(slide.body, 16)}
      {slide.example && (
        <div style={{ background: 'rgba(255,255,255,0.65)', borderRadius: '14px', padding: '14px 16px', borderLeft: `3px solid ${BAND}` }}>
          <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{slide.example}</p>
        </div>
      )}
    </>
  )

  if (slide.type === 'together') return (
    <>
      {eyebrow('Do this together')}
      {h(slide.heading)}
      {p(slide.body)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slide.steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
              background: BAND, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginTop: '1px',
            }}>{i + 1}</span>
            <span style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</span>
          </div>
        ))}
      </div>
    </>
  )

  if (slide.type === 'check') return (
    <>
      {eyebrow('Quick check, answer together')}
      {h(slide.question)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slide.options.map((o, i) => {
          const chosen = picked === i
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              style={{
                textAlign: 'left', padding: '14px 16px', borderRadius: '14px', cursor: 'pointer',
                border: chosen ? `2.5px solid ${o.correct ? BAND : 'var(--danger)'}` : '1.5px solid var(--border)',
                background: chosen ? (o.correct ? 'rgba(255,255,255,0.85)' : '#FBEAEA') : 'rgba(255,255,255,0.65)',
                fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5,
              }}
            >
              {o.label}
              {chosen && (
                <span style={{ display: 'block', marginTop: '8px', fontSize: '13.5px', fontWeight: 500, color: o.correct ? BAND : 'var(--danger)' }}>
                  {o.response}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      {eyebrow('Well done, both of you')}
      {h(slide.heading)}
      {p(slide.body)}
      <div style={{ background: BAND, borderRadius: '16px', padding: '16px 18px' }}>
        <p style={{ fontSize: '14.5px', color: '#fff', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{slide.takeaway}</p>
      </div>
    </>
  )
}
