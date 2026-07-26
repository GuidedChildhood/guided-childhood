'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  eyebrow, sheet, sheetBand, dottedRule, sheetBody, stageAccent, stageCircle,
} from '@/components/scripts/card-system'

// The heart of a script: the line to say, made to feel like the single most
// important thing on the screen. A parent opens this in the heat of a hard
// moment, so the words they will actually say are set large and warm, and they
// can hear them read aloud first so the delivery lands calm, not clipped.
//
// It used to arrive as four separate white boxes, and four boxes read as four
// things to get through. It is one thing: the words for one moment. So it is
// one sheet now, butter, with the four steps as numbered blocks divided by a
// dotted rule, the way a good worksheet is laid out. Every supporting step is
// set at the same size, because none of them outranks the one beside it. Only
// the words to say are bigger, because they are the only part a parent is
// going to say out loud.

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
  const { speaking, supported, play } = useReadAloud(voiceUrl)
  const accent = stageAccent(stageId)

  // Every step opens the same way: the number circle and the mono label on one
  // baseline, so the eye walks the sequence 1 to 4 down one left edge.
  const head = (num: number, label: string, tone?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
      <span style={stageCircle(accent)}>{num}</span>
      <span style={{ ...eyebrow, color: tone ?? 'var(--terracotta-dark)' }}>{label}</span>
    </div>
  )

  return (
    <section style={sheet}>

      {/* The band, with the same convex arc the daily deck cards wear, so a
          script and a card read as one family. It names what the sheet is. */}
      <div style={sheetBand}>
        <div style={{ ...eyebrow, fontSize: 10, color: '#4A3410', opacity: 0.75 }}>
          The script
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17,
          color: '#3A2C0C', lineHeight: 1.2, letterSpacing: '-0.01em', marginTop: 2,
        }}>
          Four steps, in order
        </div>
      </div>

      <div style={{ padding: 'clamp(20px, 5vw, 26px)' }}>

        {/* ── 1 · Say this: the one thing on the page said out loud ─────── */}
        {head(1, 'Say this')}
        <blockquote style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(24px, 6.6vw, 30px)',
          lineHeight: 1.3,
          letterSpacing: '-0.015em',
          color: '#4A3410',
          textWrap: 'balance',
        }}>
          <span aria-hidden style={{ opacity: 0.35 }}>&ldquo;</span>{sayThis}<span aria-hidden style={{ opacity: 0.35 }}>&rdquo;</span>
        </blockquote>

        {supported && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            <button onClick={play} style={heroBtn(speaking)}>
              <SpeakerIcon speaking={speaking} />
              {speaking ? 'Stop' : 'Hear it aloud'}
            </button>
          </div>
        )}

        <div style={dottedRule} />

        {/* ── 2 · Not this ─────────────────────────────────────────────── */}
        {head(2, 'Not this', 'var(--danger)')}
        <p style={{ ...sheetBody, color: 'var(--danger)', fontStyle: 'italic' }}>
          <span aria-hidden style={{ opacity: 0.5 }}>&ldquo;</span>{notThis}<span aria-hidden style={{ opacity: 0.5 }}>&rdquo;</span>
        </p>

        <div style={dottedRule} />

        {/* ── 3 · Why it works (the evidence) ──────────────────────────── */}
        {head(3, 'Why it works')}
        <p style={sheetBody}>{whyItWorks}</p>

        <div style={dottedRule} />

        {/* ── 4 · Tonight (the one action) ─────────────────────────────── */}
        {head(4, 'Tonight')}
        <p style={{ ...sheetBody, fontWeight: 600 }}>{tonight}</p>
      </div>

      <style>{`
        @keyframes sr-bar { 0%,100% { transform: scaleY(0.4) } 50% { transform: scaleY(1) } }
      `}</style>
    </section>
  )
}

// The hero action: one chunky, tactile button, filled when active.
function heroBtn(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '11px 18px', borderRadius: 14, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5,
    background: active ? 'var(--terracotta)' : 'var(--terracotta-lt)',
    color: active ? '#fff' : '#4A3410',
    border: '1.5px solid rgba(201,154,40,0.35)',
    boxShadow: active ? 'none' : '0 3px 0 rgba(201,154,40,0.3)',
    transition: 'transform 0.12s, box-shadow 0.12s',
  }
}
