'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// The heart of a script: the line to say, made to feel like the single
// most important thing on the screen. A parent opens this in the heat of a
// hard moment, so the words they will actually say are set large and warm,
// they can pull them full screen to read while looking at their child, and
// they can hear them read aloud first so the delivery lands calm, not
// clipped. Everything else on the page supports this one card.

type Props = {
  sayThis: string
  notThis: string
  whyItWorks: string
  tonight: string
  stageId: string
  // The Skye recording for this script. Skye or silence: no recording
  // means the hear it button stays hidden, never a device voice.
  voiceUrl?: string | null
}

function useReadAloud(voiceUrl?: string | null) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // One voice across the platform: a script speaks in Skye or not at all.
  // The old browser speech fallback grabbed whatever voice the device had
  // (Mabel, Daniel, luck of the draw), which broke the one voice rule the
  // moment a script had no recording. No recording now means no button.
  useEffect(() => {
    if (!voiceUrl) setSupported(false)
  }, [voiceUrl])

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
    setSpeaking(false)
  }, [])

  const play = useCallback(() => {
    if (speaking) { stop(); return }
    if (!voiceUrl) return
    const el = audioRef.current ?? new Audio(voiceUrl)
    audioRef.current = el
    el.onended = () => setSpeaking(false)
    el.onerror = () => setSpeaking(false)
    el.currentTime = 0
    el.play().then(() => setSpeaking(true)).catch(() => setSpeaking(false))
  }, [speaking, stop, voiceUrl])

  // Never leave a voice talking after the parent navigates away.
  useEffect(() => () => stop(), [stop])

  return { speaking, supported, play, stop }
}

// A small speaker glyph that animates its bars while speaking.
function SpeakerIcon({ speaking }: { speaking: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 16 }} aria-hidden>
      {speaking ? (
        [0, 1, 2].map(i => (
          <span key={i} style={{
            width: 3, borderRadius: 2, background: 'currentColor',
            height: 14, transformOrigin: 'center',
            animation: `sr-bar 0.9s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )}
    </span>
  )
}

export default function ScriptReader({ sayThis, notThis, whyItWorks, tonight, stageId, voiceUrl }: Props) {
  const [focus, setFocus] = useState(false)
  const { speaking, supported, play, stop } = useReadAloud(voiceUrl)

  // Escape closes the focus reader; lock body scroll while it is open.
  useEffect(() => {
    if (!focus) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFocus(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [focus])

  const closeFocus = () => { stop(); setFocus(false) }

  return (
    <>
      {/* ── The hero: the line to say ─────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          borderRadius: 24,
          padding: 'clamp(24px, 6vw, 40px)',
          marginBottom: 18,
          overflow: 'hidden',
          background:
            'radial-gradient(120% 90% at 12% -10%, rgba(237,195,95,0.22), transparent 55%),' +
            'linear-gradient(160deg, #FFF9EC 0%, #FEF3D8 55%, #FBE9C4 100%)',
          border: '1.5px solid rgba(201,154,40,0.28)',
          boxShadow: '0 18px 40px -22px rgba(140,100,20,0.5)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: 'var(--terracotta)', color: '#3A2C0C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
            boxShadow: '0 2px 0 var(--terracotta-dark)',
          }}>1</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
          }}>
            Say this
          </span>
        </div>

        <blockquote style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 5.4vw, 2.4rem)',
          lineHeight: 1.28,
          letterSpacing: '-0.015em',
          color: '#4A3410',
          textWrap: 'balance',
        }}>
          <span aria-hidden style={{ opacity: 0.35 }}>&ldquo;</span>{sayThis}<span aria-hidden style={{ opacity: 0.35 }}>&rdquo;</span>
        </blockquote>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
          <button
            onClick={() => setFocus(true)}
            style={heroBtn(false)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
            </svg>
            Read it big
          </button>
          {supported && (
            <button onClick={play} style={heroBtn(speaking)}>
              <SpeakerIcon speaking={speaking} />
              {speaking ? 'Stop' : 'Hear it aloud'}
            </button>
          )}
        </div>
      </section>

      {/* ── Not this ──────────────────────────────────────────────────── */}
      <SupportCard
        num={2}
        label="Not this"
        accent="var(--danger)"
        bg="var(--danger-bg)"
        border="var(--danger-border)"
      >
        <p style={{ fontSize: 16, color: 'var(--danger)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
          &ldquo;{notThis}&rdquo;
        </p>
      </SupportCard>

      {/* ── Why it works (the evidence) ───────────────────────────────── */}
      <SupportCard
        num={3}
        label="Why it works"
        accent="var(--terracotta-dark)"
        bg="var(--tint-sage)"
        border="rgba(46,40,24,0.12)"
      >
        <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
          {whyItWorks}
        </p>
      </SupportCard>

      {/* ── Tonight (the one action) ──────────────────────────────────── */}
      <div style={{
        position: 'relative',
        borderRadius: 20,
        padding: 'clamp(20px, 5vw, 28px)',
        marginBottom: 18,
        background: 'linear-gradient(160deg, #22505C 0%, #173C46 100%)',
        boxShadow: '0 14px 34px -20px rgba(23,60,70,0.7)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: 'var(--butter, #EDC35F)', color: '#173C46',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
          }}>4</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--butter, #EDC35F)',
          }}>
            Tonight
          </span>
        </div>
        <p style={{ fontSize: 17, color: '#fff', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
          {tonight}
        </p>
      </div>

      {/* ── Full screen focus reader ──────────────────────────────────── */}
      {focus && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeFocus}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            // Warm brand cocoa espresso with a soft gold glow, matching the
            // passport card and the Right Now tip, never a stark black wall.
            background:
              'radial-gradient(120% 80% at 50% -6%, rgba(237,195,95,0.22), transparent 55%),' +
              'linear-gradient(170deg, #4B3F29 0%, #3C3221 55%, #322818 100%)',
            display: 'flex', flexDirection: 'column',
            padding: 'clamp(24px, 7vw, 64px)',
            animation: 'sr-fade 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.85)',
            }}>
              Say this
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); closeFocus() }}
              aria-label="Close"
              style={{
                width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
                background: 'rgba(255,248,236,0.12)', border: '1px solid rgba(255,248,236,0.22)',
                color: '#FFF8EC', fontSize: 20, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(2rem, 8vw, 4rem)', lineHeight: 1.24,
              letterSpacing: '-0.02em', color: '#FFF6E4', textAlign: 'center',
              textWrap: 'balance', maxWidth: 900,
            }}>
              &ldquo;{sayThis}&rdquo;
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexShrink: 0 }}>
            {supported && (
              <button
                onClick={(e) => { e.stopPropagation(); play() }}
                style={{
                  ...heroBtn(speaking),
                  background: speaking ? 'rgba(255,255,255,0.16)' : 'var(--butter, #EDC35F)',
                  color: speaking ? '#fff' : '#3A2C0C',
                  borderColor: 'transparent',
                }}
              >
                <SpeakerIcon speaking={speaking} />
                {speaking ? 'Stop' : 'Hear it aloud'}
              </button>
            )}
            <span style={{ alignSelf: 'center', fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}>
              Tap anywhere to close
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sr-bar { 0%,100% { transform: scaleY(0.4) } 50% { transform: scaleY(1) } }
        @keyframes sr-fade { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  )
}

// The two hero actions share one chunky, tactile button so they read as a
// pair, filled when active.
function heroBtn(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '11px 18px', borderRadius: 14, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5,
    background: active ? 'var(--terracotta)' : 'rgba(255,255,255,0.72)',
    color: active ? '#fff' : '#4A3410',
    border: '1.5px solid rgba(201,154,40,0.35)',
    boxShadow: active ? 'none' : '0 3px 0 rgba(201,154,40,0.3)',
    transition: 'transform 0.12s, box-shadow 0.12s',
  }
}

function SupportCard({
  num, label, accent, bg, border, children,
}: {
  num: number; label: string; accent: string; bg: string; border: string; children: React.ReactNode
}) {
  return (
    <div style={{
      background: bg, border: `1.5px solid ${border}`, borderRadius: 18,
      padding: 22, marginBottom: 14, display: 'flex', gap: 16,
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: num === 2 ? 'var(--danger)' : 'var(--terracotta)',
        color: num === 2 ? '#fff' : '#3A2C0C',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
      }}>{num}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 10,
        }}>
          {label}
        </div>
        {children}
      </div>
    </div>
  )
}
