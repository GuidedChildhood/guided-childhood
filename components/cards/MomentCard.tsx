'use client'
import { useState, useRef, useEffect } from 'react'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'

export interface Moment {
  id: string
  title: string
  category: string
  age_bands: string[]
  icon: string
  science_brief: string
  digi_opener: string
}

interface MomentCardProps {
  moment: Moment
  childName?: string
  ageBand?: string
  onFlip?: (momentId: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  Morning:     'var(--stage-1)',
  Digital:     'var(--stage-2)',
  School:      'var(--stage-3)',
  Food:        'var(--stage-4)',
  Evening:     'var(--stage-5)',
  Transitions: '#EDE8F5',
  Emotions:    '#F5E8EE',
}

export default function MomentCard({ moment, childName, ageBand, onFlip }: MomentCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [digiVisible, setDigiVisible] = useState(false)
  const [digiMood, setDigiMood] = useState<DigiMood>('idle')
  const [digiResponse, setDigiResponse] = useState<{ digiQuestion: string; science: string; solutions: string[]; script: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const flipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const accentColor = CATEGORY_COLORS[moment.category] ?? 'var(--stage-1)'

  function handleFlip() {
    if (flipped) {
      setFlipped(false)
      setDigiVisible(false)
      setDigiMood('idle')
      return
    }

    setFlipped(true)
    onFlip?.(moment.id)

    // DiGi animates in after flip completes
    flipTimeout.current = setTimeout(() => {
      setDigiVisible(true)
      setDigiMood('speak')
    }, 420)

    // Fetch DiGi response if not cached
    if (!digiResponse) {
      fetchDigiMoment()
    }
  }

  async function fetchDigiMoment() {
    setLoading(true)
    try {
      const res = await fetch('/api/digi/moment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ momentId: moment.id, childName, ageBand }),
      })
      if (res.ok) {
        const data = await res.json()
        setDigiResponse(data)
        setDigiMood('happy')
        setTimeout(() => setDigiMood('speak'), 1200)
      }
    } catch {
      // fail silently — static content still shows
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => () => { if (flipTimeout.current) clearTimeout(flipTimeout.current) }, [])

  return (
    <div
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleFlip()}
      style={{
        perspective: '1000px',
        cursor: 'pointer',
        width: '100%',
        aspectRatio: '3 / 4',
        position: 'relative',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
      }}
      aria-label={`${moment.title} — tap to flip`}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>

        {/* ── FRONT ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '20px',
          background: 'var(--white)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Category stripe */}
          <div style={{ height: '6px', background: accentColor, flexShrink: 0 }} />

          {/* Icon area */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px 16px',
            gap: 12,
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              background: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              flexShrink: 0,
            }}>
              {moment.icon}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.3, marginBottom: 6 }}>
                {moment.title}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                {moment.category}
              </p>
            </div>
          </div>

          {/* Age tags */}
          <div style={{ padding: '0 16px 14px', display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {moment.age_bands.map(band => (
              <span key={band} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--ink-soft)',
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                padding: '2px 8px',
              }}>
                {band}
              </span>
            ))}
          </div>

          {/* Flip hint */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'var(--cream)',
          }}>
            <span style={{ fontSize: '0.7rem' }}>✨</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 500 }}>
              Flip for DiGi
            </span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '20px',
          background: 'var(--white)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(61,115,154,0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Accent stripe */}
          <div style={{ height: '6px', background: 'var(--terracotta)', flexShrink: 0 }} />

          {/* DiGi section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 16px 10px',
            background: 'var(--terracotta-lt)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <div style={{
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              opacity: digiVisible ? 1 : 0,
              transform: digiVisible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(10px)',
            }}>
              <DigiCharacter mood={digiMood} size={72} />
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink)',
              textAlign: 'center',
              lineHeight: 1.5,
              marginTop: 8,
              fontWeight: 500,
              minHeight: '2.5em',
            }}>
              {loading
                ? 'DiGi is thinking...'
                : digiResponse?.digiQuestion ?? moment.digi_opener}
            </p>
          </div>

          {/* Science brief */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              background: 'var(--cream)',
              borderRadius: '12px',
              padding: '10px 12px',
              borderLeft: '3px solid var(--terracotta)',
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 4 }}>
                The science
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.55 }}>
                {digiResponse?.science ?? moment.science_brief}
              </p>
            </div>

            {digiResponse?.solutions && digiResponse.solutions.length > 0 && (
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
                  Try this
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {digiResponse.solutions.slice(0, 3).map((sol, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.5 }}>{sol}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {digiResponse?.script && (
              <div style={{ background: 'var(--stage-2)', borderRadius: '10px', padding: '10px 12px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 4 }}>
                  Say tonight
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.55, fontStyle: 'italic' }}>
                  &ldquo;{digiResponse.script}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Ask DiGi link */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 8,
          }}>
            <a
              href={`/dashboard/digi?q=${encodeURIComponent(moment.title)}`}
              onClick={e => e.stopPropagation()}
              style={{
                flex: 1,
                padding: '9px 12px',
                background: 'var(--terracotta)',
                color: '#fff',
                borderRadius: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Ask DiGi more
            </a>
            <button
              onClick={e => { e.stopPropagation(); handleFlip() }}
              style={{
                padding: '9px 12px',
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--ink-muted)',
                cursor: 'pointer',
              }}
            >
              Flip back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
