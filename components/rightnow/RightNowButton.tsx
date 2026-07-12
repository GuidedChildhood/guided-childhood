'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOMENT_PHOTOS } from '@/lib/content/moment-photos'
import { scriptVoiceUrl } from '@/lib/content/script-voice'

// The Right Now button: the emergency entry point in the centre of the
// mobile tab bar. A child is crying because the TV went off and the parent
// needs words this second. One tap opens the sheet, one tap picks the
// situation, and the calm script card is on screen. Under five seconds
// from tap to words, so the fetch fires immediately on pick and the card
// renders optimistically with a soft pulse while the words arrive.

// The real photo tiles, the same warm no people set the moment cards use, so
// this sheet matches the rest of the app instead of the older line drawings.
const SITUATIONS = [
  { key: 'wont-get-up',    label: 'Will not get up, late night before', image: MOMENT_PHOTOS.bed_morning,  emoji: '😴', slot: 'morning' },
  { key: 'morning-tv',     label: 'Morning TV, will not get ready', image: MOMENT_PHOTOS.tv_remote,    emoji: '🌅', slot: 'morning' },
  { key: 'tv-off',         label: 'TV or screen turned off',        image: MOMENT_PHOTOS.tablet_sofa,  emoji: '📺', slot: 'any' },
  { key: 'phone-handover', label: 'Phone handover fight',           image: MOMENT_PHOTOS.phone_table,  emoji: '📱', slot: 'any' },
  { key: 'bedtime',        label: 'Bedtime battle',                 image: MOMENT_PHOTOS.bedtime_lamp, emoji: '🌙', slot: 'evening' },
  { key: 'sibling-fight',  label: 'Sibling fight over device',      image: MOMENT_PHOTOS.gaming,       emoji: '⚡', slot: 'any' },
  { key: 'homework',       label: 'Homework refusal',               image: MOMENT_PHOTOS.homework,     emoji: '✏️', slot: 'afternoon' },
  { key: 'something-else', label: 'Something else',                 image: null,                       emoji: '✨', slot: 'any' },
] as const

type SituationKey = (typeof SITUATIONS)[number]['key']

// The situation most likely happening right now leads the grid: morning
// puts the get ready battle first, after school leads with homework,
// evening leads with bedtime. Something else always closes the list.
function orderedSituations() {
  const hour = new Date().getHours()
  const lead = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const rest = SITUATIONS.filter(s => s.key !== 'something-else')
  return [
    ...rest.filter(s => s.slot === lead),
    ...rest.filter(s => s.slot !== lead),
    SITUATIONS[SITUATIONS.length - 1],
  ]
}

type ScriptResult = {
  title: string
  say_this: string
  not_this: string
  sort_order?: number
  custom?: boolean
  crisis?: boolean
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <path
        d="M13 2 L5 13.5 h5.5 L9.5 22 L19 10.5 h-5.5 Z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function RightNowButton({ variant = 'tab' }: { variant?: 'tab' | 'fab' } = {}) {
  const pathname = usePathname()
  // On the DiGi chat the page has its own bottom compose bar, so the floating
  // action would sit on top of the Send button. Hide it there: the parent is
  // already talking to DiGi.
  const hideFab = pathname?.startsWith('/dashboard/digi')
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [picked, setPicked] = useState<SituationKey | null>(null)
  const [pickedLabel, setPickedLabel] = useState('')
  const [script, setScript] = useState<ScriptResult | null>(null)
  const [failed, setFailed] = useState(false)
  // Something else: the parent types one line and DiGi writes the words on
  // the spot, instead of being dumped into the library mid meltdown.
  const [customMode, setCustomMode] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [speaking, setSpeaking] = useState(false)

  // Lock body scroll while the sheet is up.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  // Let the sheet mount off screen, then slide it up.
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(id)
    }
    setEntered(false)
  }, [open])

  useEffect(() => { setMounted(true) }, [])

  // One time coach mark: explain the button before its first ever use.
  useEffect(() => {
    if (localStorage.getItem('gc_now_hint_seen') !== '1') {
      const id = setTimeout(() => setShowHint(true), 1200)
      return () => clearTimeout(id)
    }
  }, [])

  function dismissHint() {
    localStorage.setItem('gc_now_hint_seen', '1')
    setShowHint(false)
  }

  function stopVoice() {
    audioRef.current?.pause()
    audioRef.current = null
    setSpeaking(false)
  }

  function openSheet() {
    dismissHint()
    setPicked(null)
    setPickedLabel('')
    setScript(null)
    setFailed(false)
    setCustomMode(false)
    setCustomInput('')
    setOpen(true)
  }

  function closeSheet() {
    stopVoice()
    setEntered(false)
    setTimeout(() => setOpen(false), 500)
  }

  function pick(key: SituationKey, label: string) {
    // Something else used to close the sheet and dump the parent into the
    // script library to browse, mid meltdown. Now it asks for one line and
    // DiGi writes the words on the spot.
    if (key === 'something-else') {
      setPicked(key)
      setPickedLabel('Something else')
      setScript(null)
      setFailed(false)
      setCustomMode(true)
      return
    }

    // Optimistic: flip to the card view immediately, words pulse in.
    setPicked(key)
    setPickedLabel(label)
    setScript(null)
    setFailed(false)

    fetch('/api/rightnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situation: key }),
    })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad status'))))
      .then((data: ScriptResult) => setScript(data))
      .catch(() => setFailed(true))
  }

  function submitCustom() {
    const detail = customInput.trim()
    if (!detail) return
    setCustomMode(false)
    setPickedLabel(detail.length > 60 ? detail.slice(0, 57) + '...' : detail)
    setScript(null)
    setFailed(false)

    fetch('/api/rightnow/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ detail }),
    })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad status'))))
      .then((data: ScriptResult) => setScript(data))
      .catch(() => setFailed(true))
  }

  function playVoice(url: string) {
    if (speaking) { stopVoice(); return }
    const audio = new Audio(url)
    audioRef.current = audio
    setSpeaking(true)
    audio.onended = () => setSpeaking(false)
    audio.onerror = () => setSpeaking(false)
    audio.play().catch(() => setSpeaking(false))
  }

  const digiHref = `/dashboard/digi?q=${encodeURIComponent(
    script
      ? `Happening right now: ${pickedLabel.toLowerCase()}. I just used the script ${script.title}. Talk me through what comes next.`
      : `Happening right now: ${pickedLabel.toLowerCase()}. Talk me through it.`
  )}`

  return (
    <>
      {/* One time coach mark above the button */}
      {showHint && createPortal(
        <div
          className="rightnow-hint"
          style={{
            position: 'fixed', zIndex: 90, width: 'min(86vw, 310px)',
            ...(variant === 'fab'
              ? { bottom: '150px', right: '14px' }
              : { bottom: '92px', left: '50%', transform: 'translateX(-50%)' }),
            // Warm brand espresso with a soft gold glow and a faint gold
            // hairline, so it reads as a crafted tip, not a stark black box.
            background: 'radial-gradient(130% 120% at 88% -20%, rgba(237,195,95,0.26), transparent 55%), linear-gradient(155deg, #4B3F29 0%, #3C3221 100%)',
            color: '#FFF8EC',
            border: '1px solid rgba(237,195,95,0.22)',
            borderRadius: '18px', padding: '15px 40px 15px 17px',
            boxShadow: 'inset 0 1px 0 rgba(255,248,236,0.10), 0 14px 34px -12px rgba(40,28,8,0.6)',
          }}
        >
          {/* An obvious way out: a real close control, not click the bubble */}
          <button
            type="button"
            onClick={dismissHint}
            aria-label="Dismiss tip"
            style={{
              position: 'absolute', top: '9px', right: '9px',
              width: '26px', height: '26px', borderRadius: '50%',
              background: 'rgba(255,248,236,0.12)', border: '1px solid rgba(255,248,236,0.18)',
              color: '#FFF8EC', fontSize: '14px', lineHeight: 1, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', margin: '0 0 5px', letterSpacing: '-0.01em' }}>
            Mid meltdown? This button.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', lineHeight: 1.55, margin: 0, color: 'rgba(255,251,244,0.90)' }}>
            When a hard moment is happening, tap Now, pick the situation, and the calm words appear. Two taps, no searching.
          </p>
          <div className="rightnow-hint-arrow" style={{
            position: 'absolute', bottom: '-7px', width: '14px', height: '14px', background: '#3C3221',
            ...(variant === 'fab'
              ? { right: '28px', transform: 'rotate(45deg)' }
              : { left: '50%', transform: 'translateX(-50%) rotate(45deg)' }),
          }} />
        </div>,
        document.body
      )}

      {/* Desktop trigger: the tab bar is hidden above 768px, so the same
          sheet opens from a floating pill portalled to body */}
      {mounted && createPortal(
        <button type="button" onClick={openSheet} aria-label="Right now help" className="rightnow-desktop no-print">
          <BoltIcon />
          Help now
        </button>,
        document.body
      )}

      {/* The raised butter circle in the centre of the tab bar (legacy tab
          placement, kept for any caller still asking for it) */}
      {variant === 'tab' && (
        <button
          type="button"
          onClick={openSheet}
          aria-label="Right now help"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            flex: 1,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            marginTop: '-26px',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--terracotta)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
            border: '3px solid var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BoltIcon />
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '.05em',
            textTransform: 'uppercase',
            color: 'var(--terracotta-dark)',
          }}>
            Help now
          </span>
        </button>
      )}

      {/* Floating action, mobile: now that the bottom bar carries five real
          tabs, Help now lives as a thumb reachable button just above the bar.
          One tap to the same sheet. Hidden on desktop, which uses the pill. */}
      {variant === 'fab' && mounted && !hideFab && createPortal(
        <button
          type="button"
          onClick={openSheet}
          aria-label="Right now help"
          className="rightnow-fab no-print"
        >
          <BoltIcon />
          <span>Now</span>
        </button>,
        document.body,
      )}

      {/* Full screen sheet, portalled to body: the tab bar's backdrop filter
          would otherwise trap this fixed sheet inside the 64px bar */}
      {open && createPortal(
        <div
          className="rightnow-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Right now"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'var(--cream)',
            display: 'flex',
            flexDirection: 'column',
            transform: entered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
            overflowY: 'auto',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close"
                style={{
                  background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '50%',
                  width: '38px', height: '38px', fontSize: '16px', color: 'var(--ink-soft)',
                  cursor: 'pointer', lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {!picked ? (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: '8px' }}>
                  Right now
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', color: 'var(--ink)', letterSpacing: '-.02em', margin: '6px 0 4px' }}>
                  What is happening right now?
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Pick the moment and the calm words appear: what to say, what not to say. It gets remembered too, so tomorrow we ask how it went and DiGi knows the story.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {orderedSituations().map(s => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => pick(s.key, s.label)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                        background: 'var(--white)', border: '1.5px solid var(--border)',
                        borderRadius: '18px', padding: '16px 12px 14px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px',
                        color: 'var(--ink)', textAlign: 'center', lineHeight: 1.3,
                        boxShadow: '0 3px 0 var(--border)',
                      }}
                    >
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt="" width={64} height={64} style={{ borderRadius: '14px', display: 'block' }} />
                      ) : (
                        <span style={{
                          width: 64, height: 64, borderRadius: '14px', background: 'var(--cream)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                        }}>{s.emoji}</span>
                      )}
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            ) : customMode ? (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: '8px' }}>
                  Right now
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '24px', color: 'var(--ink)', letterSpacing: '-.02em', margin: '6px 0 4px' }}>
                  Tell me what is happening
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '16px' }}>
                  One line is enough. DiGi writes the calm words for this exact moment, for your child&rsquo;s age.
                </p>
                <textarea
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitCustom() } }}
                  autoFocus
                  rows={3}
                  maxLength={280}
                  placeholder="She is screaming because I took the iPad at dinner..."
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '16px',
                    border: '1.5px solid var(--border)', background: 'var(--white, #fff)',
                    fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)',
                    lineHeight: 1.5, resize: 'none', outline: 'none', marginBottom: '12px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={submitCustom}
                  disabled={!customInput.trim()}
                  style={{
                    width: '100%', background: 'var(--terracotta)', color: 'var(--ink)',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
                    border: 'none', borderRadius: '16px', padding: '16px 20px',
                    cursor: 'pointer', boxShadow: '0 5px 0 var(--terracotta-dark)',
                    opacity: customInput.trim() ? 1 : 0.55, marginBottom: '10px',
                  }}
                >
                  Get the words
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomMode(false); setPicked(null) }}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                    color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '10px 0',
                  }}
                >
                  ← Pick a moment instead
                </button>
              </>
            ) : (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: '8px' }}>
                  {pickedLabel}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--ink)', letterSpacing: '-.02em', margin: '6px 0 16px' }}>
                  {script ? script.title : failed ? 'The words are with DiGi' : 'Getting your words'}
                </h2>
                {!script && !failed && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.04em', margin: '-8px 0 14px' }}>
                    While the words come, breathe out slowly once. You first, then them.
                  </p>
                )}

                {failed ? (
                  <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                      We could not load the script just now. DiGi can talk you through this exact moment instead, and it already knows what is happening.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* SAY THIS */}
                    <div style={{
                      background: 'var(--tint-sage)', borderRadius: '16px', padding: '20px',
                      marginBottom: '12px',
                      animation: script ? undefined : 'rightnow-pulse 1.2s ease-in-out infinite',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                          Say this
                        </div>
                        {script?.sort_order != null && scriptVoiceUrl(script.sort_order) && (
                          <button
                            type="button"
                            onClick={() => playVoice(scriptVoiceUrl(script.sort_order!)!)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              background: 'var(--white, #fff)', border: '1.5px solid var(--border)',
                              borderRadius: '100px', padding: '6px 12px', cursor: 'pointer',
                              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                              letterSpacing: '0.06em', color: 'var(--ink)',
                            }}
                          >
                            {speaking ? '◼ Stop' : '▶ Hear it'}
                          </button>
                        )}
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.45, color: 'var(--ink)', minHeight: script ? undefined : '86px' }}>
                        {script?.say_this ?? ''}
                      </p>
                    </div>

                    {/* NOT THIS, or in a crisis the human beside you */}
                    <div style={{
                      background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
                      borderRadius: '16px', padding: '18px 20px', marginBottom: '20px',
                      animation: script ? undefined : 'rightnow-pulse 1.2s ease-in-out infinite',
                    }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--danger)', marginBottom: '8px' }}>
                        {script?.crisis ? 'A human, right now' : 'Not this'}
                      </div>
                      <p style={{ fontSize: '15px', lineHeight: 1.55, color: 'var(--danger)', minHeight: script ? undefined : '44px' }}>
                        {script?.not_this ?? ''}
                      </p>
                    </div>
                  </>
                )}

                <div className="no-print" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px' }}>
                  {script && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={async () => {
                          const text = `${script.title}\n\n"${script.say_this}"\n\nFrom our family pathway on Guided Childhood.`
                          try {
                            if (navigator.share) await navigator.share({ title: script.title, text })
                            else await navigator.clipboard.writeText(text)
                          } catch { /* cancelled */ }
                        }}
                        style={{
                          flex: 1, background: 'var(--white)', border: '1.5px solid var(--border)',
                          color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700,
                          fontSize: '13px', borderRadius: '14px', padding: '12px 10px',
                          cursor: 'pointer', boxShadow: '0 3px 0 var(--border)',
                        }}
                      >
                        Share with your child
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        style={{
                          flex: 1, background: 'var(--white)', border: '1.5px solid var(--border)',
                          color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700,
                          fontSize: '13px', borderRadius: '14px', padding: '12px 10px',
                          cursor: 'pointer', boxShadow: '0 3px 0 var(--border)',
                        }}
                      >
                        Print the card
                      </button>
                    </div>
                  )}
                  <Link
                    href={digiHref}
                    onClick={() => { stopVoice(); setOpen(false) }}
                    style={{
                      display: 'block', textAlign: 'center', textDecoration: 'none',
                      background: 'var(--terracotta)', color: 'var(--ink)',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
                      borderRadius: '16px', padding: '16px 20px',
                      boxShadow: '0 5px 0 var(--terracotta-dark)',
                    }}
                  >
                    Talk it through with DiGi
                  </Link>
                  <button
                    type="button"
                    onClick={closeSheet}
                    style={{
                      background: 'var(--white)', border: '1.5px solid var(--border)',
                      color: 'var(--ink-soft)', fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: '15px', borderRadius: '16px', padding: '15px 20px',
                      cursor: 'pointer', boxShadow: '0 3px 0 var(--border)',
                    }}
                  >
                    Done, back to my day
                  </button>
                </div>
              </>
            )}
          </div>

          <style>{`
            @keyframes rightnow-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.55; }
            }
            @media print {
              body * { visibility: hidden; }
              .rightnow-sheet, .rightnow-sheet * { visibility: visible; }
              .rightnow-sheet { position: absolute !important; inset: 0 !important; }
              .rightnow-sheet .no-print { display: none !important; }
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  )
}
