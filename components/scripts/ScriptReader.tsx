'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { card, cardPad, eyebrow, stepCircle } from '@/components/scripts/card-system'

// The heart of a script: the line to say, made to feel like the single
// most important thing on the screen. A parent opens this in the heat of a
// hard moment, so the words they will actually say are set large and warm,
// and they can hear them read aloud first so the delivery lands calm, not
// clipped. Everything else on the page supports this one card. The four
// steps share one card grammar: same radius, same border, same shallow
// ledge shadow, same 28px number circle on one left edge.

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

// Every step opens the same way: the number circle and the mono label on one
// baseline, so the eye can walk the sequence 1 to 4 down one left edge.
function StepHeader({ num, label, accent }: { num: number; label: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={stepCircle}>{num}</span>
      <span style={{ ...eyebrow, color: accent }}>{label}</span>
    </div>
  )
}

export default function ScriptReader({ sayThis, notThis, whyItWorks, tonight, stageId, voiceUrl }: Props) {
  const { speaking, supported, play } = useReadAloud(voiceUrl)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── 1 · Say this: the hero, the only butter card on the page ───── */}
      <section
        style={{
          ...card,
          padding: cardPad,
          background: 'linear-gradient(180deg, #FFF9EC 0%, #FCEFD2 100%)',
          border: '1.5px solid rgba(201,154,40,0.32)',
        }}
      >
        <StepHeader num={1} label="Say this" accent="var(--terracotta-dark)" />

        <blockquote style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.4rem, 5vw, 2.05rem)',
          lineHeight: 1.35,
          letterSpacing: '-0.015em',
          color: '#4A3410',
          textWrap: 'balance',
        }}>
          <span aria-hidden style={{ opacity: 0.4 }}>&ldquo;</span>{sayThis}<span aria-hidden style={{ opacity: 0.4 }}>&rdquo;</span>
        </blockquote>

        {supported && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
            <button onClick={play} style={heroBtn(speaking)}>
              <SpeakerIcon speaking={speaking} />
              {speaking ? 'Stop' : 'Hear it aloud'}
            </button>
          </div>
        )}
      </section>

      {/* ── 2 · Not this ──────────────────────────────────────────────── */}
      <div style={{ ...card, padding: cardPad }}>
        <StepHeader num={2} label="Not this" accent="var(--danger)" />
        <p style={{ fontSize: 16, color: 'var(--danger)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
          <span aria-hidden style={{ opacity: 0.5 }}>&ldquo;</span>{notThis}<span aria-hidden style={{ opacity: 0.5 }}>&rdquo;</span>
        </p>
      </div>

      {/* ── 3 · Why it works (the evidence) ───────────────────────────── */}
      <div style={{ ...card, padding: cardPad }}>
        <StepHeader num={3} label="Why it works" accent="var(--terracotta-dark)" />
        <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>
          {whyItWorks}
        </p>
      </div>

      {/* ── 4 · Tonight (the one action) ──────────────────────────────── */}
      <div style={{ ...card, padding: cardPad }}>
        <StepHeader num={4} label="Tonight" accent="var(--terracotta-dark)" />
        <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.65, fontWeight: 600, margin: 0 }}>
          {tonight}
        </p>
      </div>

      <style>{`
        @keyframes sr-bar { 0%,100% { transform: scaleY(0.4) } 50% { transform: scaleY(1) } }
      `}</style>
    </div>
  )
}

// The hero action: one chunky, tactile button, filled when active.
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
