'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import { momentImageForTitle } from '@/lib/content/moment-images'
import { momentPhotoForTitle } from '@/lib/content/moment-photos'
import { momentLook } from '@/lib/content/moment-look'

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
  const [digiResponse, setDigiResponse] = useState<{
    digiQuestion: string
    science: string
    technique?: { name: string; steps: string[]; why: string | null } | null
    solutions: string[]
    script: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)
  const [questMade, setQuestMade] = useState(false)

  const accentColor = CATEGORY_COLORS[moment.category] ?? 'var(--stage-1)'
  // Real photo first (covers every card), the older tile as a fallback.
  const imageSrc = momentPhotoForTitle(moment.title) ?? momentImageForTitle(moment.title)
  const look = momentLook(moment.category)

  async function handleShare() {
    const url = `${window.location.origin}/m/${moment.id}`
    const payload = { title: moment.title, text: moment.science_brief.slice(0, 140), url }
    try {
      if (navigator.share) {
        await navigator.share(payload)
      } else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch { /* user cancelled the share sheet */ }
  }

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

      {/* ── Full screen deck card: tinted backdrop, curved band header ── */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 120,
            background: 'var(--deep-teal)',
            display: 'flex', alignItems: 'stretch', justifyContent: 'center',
            padding: 'max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))',
          }}
        >
          <div
            style={{
              width: 'min(100%, 520px)',
              background: look.tint,
              borderRadius: '26px',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
            }}
          >
            {/* Curved band header */}
            <div style={{
              background: look.band,
              padding: '18px 20px 26px',
              borderRadius: '0 0 50% 50% / 0 0 26px 26px',
              display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>
                  Moment
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#fff', lineHeight: 1.2, margin: 0 }}>
                  {moment.category}
                </p>
              </div>
              <button
                onClick={handleShare}
                aria-label="Share this card"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,0.7)', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v12M12 3l-4.5 4.5M12 3l4.5 4.5M5 13v6h14v-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,0.7)', background: 'transparent',
                  cursor: 'pointer', fontSize: '16px', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {shared && (
              <div style={{ padding: '8px 20px 0', flexShrink: 0 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: look.band, margin: 0 }}>
                  Link copied, paste it anywhere ✓
                </p>
              </div>
            )}

            {/* Body: big display type, deck style */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(1.5rem, 6.5vw, 2rem)', color: 'var(--ink)',
                letterSpacing: '-0.02em', lineHeight: 1.12, margin: 0,
              }}>
                {moment.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <DigiCharacter mood={digiMood} size={44} />
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)',
                  lineHeight: 1.55, fontWeight: 500, margin: 0, flex: 1,
                }}>
                  {loading ? 'DiGi is thinking...' : digiResponse?.digiQuestion ?? moment.digi_opener}
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.65)', borderRadius: '14px', padding: '14px 16px',
                borderLeft: `3px solid ${look.band}`,
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: look.band, marginBottom: 6 }}>
                  The science
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                  {digiResponse?.science ?? moment.science_brief}
                </p>
              </div>

              {digiResponse?.technique && (
                <div style={{
                  background: look.band, borderRadius: '16px', padding: '16px 18px',
                }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
                    The technique
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#fff', lineHeight: 1.25, marginBottom: 10 }}>
                    {digiResponse.technique.name}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {digiResponse.technique.steps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          background: 'rgba(255,255,255,0.25)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginTop: 1,
                        }}>{i + 1}</span>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#fff', lineHeight: 1.5, margin: 0 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                  {digiResponse.technique.why && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, margin: '10px 0 0', fontStyle: 'italic' }}>
                      Why it works: {digiResponse.technique.why}
                    </p>
                  )}
                </div>
              )}

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
                <div style={{ background: 'rgba(255,255,255,0.65)', borderRadius: '14px', padding: '14px 16px' }}>
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
              borderTop: '1px solid rgba(26,26,46,0.08)',
              display: 'flex', gap: 10, flexShrink: 0,
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
                onClick={async () => {
                  if (questMade) return
                  try {
                    await fetch('/api/quests', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: moment.title, emoji: '⭐', stars: 2, schedule: 'daily' }),
                    })
                    setQuestMade(true)
                  } catch { /* leave the button as is */ }
                }}
                style={{
                  padding: '12px 14px', background: questMade ? 'var(--tint-sage)' : '#fff',
                  border: `1.5px solid ${questMade ? look.band : 'var(--border)'}`, borderRadius: '14px',
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                  color: 'var(--ink)', cursor: questMade ? 'default' : 'pointer',
                }}
              >
                {questMade ? 'Quest made ✓' : 'Make it a quest'}
              </button>
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
