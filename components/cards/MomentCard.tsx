'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import { momentImageForTitle } from '@/lib/content/moment-images'

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

// The card front stays small in the grid; DiGi's answer opens as a full
// sheet so it is never squeezed into a tiny flipped card (the cut off
// reply from the 5 July red pen).
export default function MomentCard({ moment, childName, ageBand, onFlip }: MomentCardProps) {
  const [open, setOpen] = useState(false)
  const [digiMood, setDigiMood] = useState<DigiMood>('speak')
  const [digiResponse, setDigiResponse] = useState<{ digiQuestion: string; science: string; solutions: string[]; script: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const accentColor = CATEGORY_COLORS[moment.category] ?? 'var(--stage-1)'
  const imageSrc = momentImageForTitle(moment.title)

  function handleOpen() {
    setOpen(true)
    onFlip?.(moment.id)
    if (!digiResponse) fetchDigiMoment()
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

  // Lock page scroll while the sheet is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <>
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleOpen()}
        aria-label={`${moment.title} — tap for DiGi`}
        style={{
          cursor: 'pointer',
          width: '100%',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          borderRadius: '20px',
          background: 'var(--white)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Category stripe */}
        <div style={{ height: '6px', background: accentColor, flexShrink: 0 }} />

        {/* Tile art (Higgsfield) with emoji fallback */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '18px 14px 12px', gap: 10,
        }}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              width={84}
              height={84}
              style={{ borderRadius: '18px', display: 'block' }}
            />
          ) : (
            <div style={{
              width: 84, height: 84, borderRadius: '18px',
              background: accentColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', flexShrink: 0,
            }}>
              {moment.icon}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.92rem', color: 'var(--ink)', lineHeight: 1.3,
              marginBottom: 4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {moment.title}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {moment.category}
            </p>
          </div>
        </div>

        {/* Hint */}
        <div style={{
          padding: '9px 12px', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'var(--cream)', marginTop: 'auto',
        }}>
          <span style={{ fontSize: '0.7rem' }}>✨</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 500 }}>
            Tap for DiGi
          </span>
        </div>
      </div>

      {/* ── DiGi sheet: full size, readable, never cut off ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 120,
            background: 'rgba(26,26,46,0.45)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(100%, 480px)',
              maxHeight: '86dvh',
              background: 'var(--white)',
              borderRadius: '24px 24px 0 0',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 -8px 40px rgba(26,26,46,0.25)',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'var(--terracotta-lt)',
              padding: '16px 20px 14px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
            }}>
              <DigiCharacter mood={digiMood} size={54} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 3 }}>
                  {moment.category} moment
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.25, margin: 0 }}>
                  {moment.title}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)',
                  background: '#fff', cursor: 'pointer', fontSize: '15px', color: 'var(--ink-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)',
                lineHeight: 1.6, fontWeight: 500, margin: 0,
              }}>
                {loading ? 'DiGi is thinking...' : digiResponse?.digiQuestion ?? moment.digi_opener}
              </p>

              <div style={{
                background: 'var(--cream)', borderRadius: '14px', padding: '14px 16px',
                borderLeft: '3px solid var(--terracotta)',
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 6 }}>
                  The science
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                  {digiResponse?.science ?? moment.science_brief}
                </p>
              </div>

              {digiResponse?.solutions && digiResponse.solutions.length > 0 && (
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>
                    Try this
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {digiResponse.solutions.slice(0, 3).map((sol, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700, color: 'var(--terracotta)', flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{sol}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {digiResponse?.script && (
                <div style={{ background: 'var(--stage-2)', borderRadius: '14px', padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>
                    Say tonight
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                    &ldquo;{digiResponse.script}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 20px calc(12px + env(safe-area-inset-bottom))',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: 10, flexShrink: 0, background: '#fff',
            }}>
              <a
                href={`/dashboard/digi?q=${encodeURIComponent(moment.title)}`}
                style={{
                  flex: 1, padding: '12px 14px',
                  background: 'var(--terracotta)', color: 'var(--ink)',
                  borderRadius: '14px', fontFamily: 'var(--font-display)',
                  fontSize: '14px', fontWeight: 800, textAlign: 'center',
                  textDecoration: 'none', display: 'block',
                  boxShadow: '0 3px 0 var(--terracotta-dark)',
                }}
              >
                Ask DiGi more
              </a>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '12px 16px', background: 'none',
                  border: '1.5px solid var(--border)', borderRadius: '14px',
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  color: 'var(--ink-muted)', cursor: 'pointer',
                }}
              >
                Back to moments
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
