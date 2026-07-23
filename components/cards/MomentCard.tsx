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
  const [questBusy, setQuestBusy] = useState(false)
  // The deck: which card the parent is on, and whether they saved this one.
  const [card, setCard] = useState(0)
  const [saved, setSaved] = useState(false)

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
    setCard(0)
    onFlip?.(moment.id)
    if (!digiResponse) fetchDigiMoment()
    // Reading a moment is doing today's moment: record it so the daily pathway
    // ticks the Moment step. Best effort, never blocks the card.
    fetch('/api/moments/complete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ momentId: moment.id }),
    }).catch(() => { /* the card still opens */ })
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

      {/* ── Full screen card DECK, Good Inside pattern in our green and Nunito:
          a progress bar, a coloured band with bookmark and share, big type, one
          idea per card, tap to advance, previous card below, and a final card
          that hands off to the relevant scripts. ── */}
      {open && (() => {
        const scriptsHref = `/dashboard/scripts?topic=${encodeURIComponent(moment.category)}`
        // Build the deck from what DiGi returned, one clear idea per card, and
        // a scripts hand off as the last card. Falls back to the static fields
        // while DiGi is still gathering, so the deck is never empty.
        type Deck = { eyebrow: string; heading: string; render: () => React.ReactNode }
        const deck: Deck[] = []
        deck.push({
          eyebrow: 'The moment', heading: moment.title,
          render: () => (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 4 }}>
              <DigiCharacter mood={digiMood} size={46} />
              <p style={cardBody}>
                {loading && !digiResponse ? 'One moment, I am pulling the evidence and the exact words together for you.' : (digiResponse?.digiQuestion ?? moment.digi_opener)}
              </p>
            </div>
          ),
        })
        deck.push({
          eyebrow: 'Why this happens', heading: 'This is normal, and there is a reason',
          render: () => <p style={cardBody}>{digiResponse?.science ?? moment.science_brief}</p>,
        })
        if (digiResponse?.technique) {
          const t = digiResponse.technique
          deck.push({
            eyebrow: 'The technique', heading: t.name,
            render: () => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {t.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={stepNum}>{i + 1}</span>
                    <p style={{ ...cardBody, margin: 0 }}>{step}</p>
                  </div>
                ))}
                {t.why && <p style={{ ...cardBody, fontStyle: 'italic', opacity: 0.85, fontSize: '1rem' }}>Why it works: {t.why}</p>}
              </div>
            ),
          })
        }
        if (digiResponse?.solutions && digiResponse.solutions.length > 0) {
          deck.push({
            eyebrow: 'Try this', heading: 'Three things that help',
            render: () => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {digiResponse.solutions.slice(0, 3).map((sol, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={stepNum}>{i + 1}</span>
                    <p style={{ ...cardBody, margin: 0 }}>{sol}</p>
                  </div>
                ))}
              </div>
            ),
          })
        }
        if (digiResponse?.script) {
          deck.push({
            eyebrow: 'Say this tonight', heading: 'The words, ready to use',
            render: () => <p style={{ ...cardBody, fontStyle: 'italic' }}>&ldquo;{digiResponse.script}&rdquo;</p>,
          })
        }
        // The last card: hand off to the relevant scripts, the clear next step.
        deck.push({
          eyebrow: 'The scripts', heading: 'Want the words for this, ready to read?',
          render: () => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
              <p style={cardBody}>The scripts give you exactly what to say, word for word, for {moment.title.toLowerCase()}.</p>
              <a
                href={scriptsHref}
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: look.band, color: '#fff', borderRadius: '16px', padding: '16px 22px',
                  textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '1.05rem', boxShadow: '0 5px 0 rgba(0,0,0,0.18)',
                }}
              >
                Take me to relevant scripts →
              </a>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 2 }}>
                <a href={`/dashboard/digi?q=${encodeURIComponent(moment.title)}`} onClick={e => e.stopPropagation()} style={lesserLink}>Ask DiGi more →</a>
                <button
                  onClick={async e => {
                    e.stopPropagation()
                    if (questMade || questBusy) return
                    setQuestBusy(true)
                    try {
                      const res = await fetch('/api/moments/make-quest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ momentId: moment.id }) })
                      if (res.ok) setQuestMade(true)
                    } catch { /* leave as is */ } finally { setQuestBusy(false) }
                  }}
                  style={{ ...lesserLink, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  {questMade ? `Sent to ${childName && childName !== 'Your child' ? childName : 'them'} ✓` : questBusy ? 'Making...' : 'Make it a quest →'}
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span aria-hidden>🗓️</span> DiGi will check how this one went in your Sunday catch up.
              </p>
            </div>
          ),
        })

        const total = deck.length
        const idx = Math.min(card, total - 1)
        const current = deck[idx]
        const isLast = idx === total - 1
        const next = () => setCard(c => Math.min(c + 1, total - 1))
        const prev = () => setCard(c => Math.max(c - 1, 0))

        return (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 120,
              background: 'var(--deep-teal)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: 'max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))',
            }}
          >
            {/* Progress bar, one segment per card */}
            <div style={{ width: 'min(100%, 520px)', display: 'flex', gap: 5, marginBottom: 12, flexShrink: 0 }}>
              {deck.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 5, borderRadius: 100, background: i <= idx ? '#fff' : 'rgba(255,255,255,0.28)', transition: 'background 0.25s ease' }} />
              ))}
            </div>

            {/* The card. Tapping it advances, like flicking through a deck. */}
            <div
              onClick={() => { if (!isLast) next() }}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'Enter') next(); if (e.key === 'ArrowLeft') prev() }}
              style={{
                width: 'min(100%, 520px)', flex: 1, minHeight: 0,
                background: look.tint, borderRadius: '26px',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
                cursor: isLast ? 'default' : 'pointer', WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Coloured band: down chevron to close, eyebrow and topic, then
                  bookmark and share, exactly the Good Inside header shape. */}
              <div style={{
                background: look.band, padding: '16px 20px 26px',
                borderRadius: '0 0 50% 50% / 0 0 30px 30px',
                display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0,
              }}>
                <button onClick={e => { e.stopPropagation(); setOpen(false) }} aria-label="Close" style={roundIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', margin: '2px 0 3px' }}>
                    Moment
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: '#fff', lineHeight: 1.15, margin: 0 }}>
                    {moment.category}
                  </p>
                </div>
                <button onClick={e => { e.stopPropagation(); setSaved(s => !s) }} aria-label="Save this card" style={roundIcon}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? '#fff' : 'none'} aria-hidden><path d="M6 3h12v18l-6-4-6 4V3z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>
                </button>
                <button onClick={e => { e.stopPropagation(); handleShare() }} aria-label="Share this card" style={roundIcon}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 3v12M12 3l-4.5 4.5M12 3l4.5 4.5M5 13v6h14v-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>

              {/* One idea, big. Scrolls only if a card runs long. */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: look.band, margin: 0 }}>
                  {current.eyebrow}
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 6.5vw, 2.2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.12, margin: 0 }}>
                  {current.heading}
                </h2>
                {current.render()}
                {shared && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: look.band, margin: '4px 0 0' }}>Link copied, paste it anywhere ✓</p>
                )}
              </div>

              {/* The quiet see scripts link, on every card, small at the bottom. */}
              {!isLast && (
                <div style={{ padding: '0 24px 16px', flexShrink: 0 }}>
                  <a href={scriptsHref} onClick={e => e.stopPropagation()} style={lesserLink}>See the scripts for this →</a>
                </div>
              )}
            </div>

            {/* Previous card, below the deck, from the second card on. */}
            <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {idx > 0 && (
                <button onClick={prev} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 14L4 9l5-5M4 9h11a5 5 0 015 5v1" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Previous card</span>
                </button>
              )}
            </div>
          </div>
        )
      })()}
    </>
  )
}

// Shared card styles, kept out of the render so the deck reads cleanly.
const cardBody: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'clamp(1.12rem, 4.4vw, 1.35rem)',
  fontWeight: 500, color: 'var(--ink)', lineHeight: 1.42, letterSpacing: '-0.005em', margin: 0,
}
const stepNum: React.CSSProperties = {
  width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 2,
  background: 'rgba(0,0,0,0.10)', color: 'var(--ink)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700,
}
const roundIcon: React.CSSProperties = {
  width: 38, height: 38, borderRadius: '50%',
  border: '1.5px solid rgba(255,255,255,0.7)', background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
const lesserLink: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em',
  color: 'var(--ink-soft)', textDecoration: 'none',
}
