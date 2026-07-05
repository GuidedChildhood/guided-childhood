'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

// The Right Now button: the emergency entry point in the centre of the
// mobile tab bar. A child is crying because the TV went off and the parent
// needs words this second. One tap opens the sheet, one tap picks the
// situation, and the calm script card is on screen. Under five seconds
// from tap to words, so the fetch fires immediately on pick and the card
// renders optimistically with a soft pulse while the words arrive.

const SITUATIONS = [
  { key: 'tv-off',         label: 'TV or screen turned off' },
  { key: 'phone-handover', label: 'Phone handover fight' },
  { key: 'bedtime',        label: 'Bedtime battle' },
  { key: 'sibling-fight',  label: 'Sibling fight over device' },
  { key: 'homework',       label: 'Homework refusal' },
  { key: 'something-else', label: 'Something else' },
] as const

type SituationKey = (typeof SITUATIONS)[number]['key']

type ScriptResult = {
  title: string
  say_this: string
  not_this: string
  sort_order: number
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

export default function RightNowButton() {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [picked, setPicked] = useState<SituationKey | null>(null)
  const [pickedLabel, setPickedLabel] = useState('')
  const [script, setScript] = useState<ScriptResult | null>(null)
  const [failed, setFailed] = useState(false)

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

  function openSheet() {
    dismissHint()
    setPicked(null)
    setPickedLabel('')
    setScript(null)
    setFailed(false)
    setOpen(true)
  }

  function closeSheet() {
    setEntered(false)
    setTimeout(() => setOpen(false), 500)
  }

  function pick(key: SituationKey, label: string) {
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
          onClick={dismissHint}
          style={{
            position: 'fixed', bottom: '92px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 90, width: 'min(86vw, 300px)',
            background: 'var(--deep-teal)', color: '#fff',
            borderRadius: '16px', padding: '14px 16px', cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(23,60,70,0.4)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', margin: '0 0 4px' }}>
            Mid meltdown? This button.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', lineHeight: 1.5, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            When a hard moment is happening, tap Now, pick the situation, and the calm words appear. Two taps, no searching.
          </p>
          <div style={{
            position: 'absolute', bottom: '-7px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: '14px', height: '14px', background: 'var(--deep-teal)',
          }} />
        </div>,
        document.body
      )}

      {/* The raised butter circle in the centre of the tab bar */}
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

      {/* Full screen sheet, portalled to body: the tab bar's backdrop filter
          would otherwise trap this fixed sheet inside the 64px bar */}
      {open && createPortal(
        <div
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SITUATIONS.map(s => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => pick(s.key, s.label)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'var(--white)', border: '1.5px solid var(--border)',
                        borderRadius: '16px', padding: '18px 20px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px',
                        color: 'var(--ink)', textAlign: 'left',
                        boxShadow: '0 3px 0 var(--border)',
                      }}
                    >
                      {s.label}
                      <span aria-hidden="true" style={{ color: 'var(--ink-light)', fontSize: '18px' }}>→</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: '8px' }}>
                  {pickedLabel}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--ink)', letterSpacing: '-.02em', margin: '6px 0 16px' }}>
                  {script ? script.title : failed ? 'The words are with DiGi' : 'Getting your words'}
                </h2>

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
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px' }}>
                        Say this
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.45, color: 'var(--ink)', minHeight: script ? undefined : '86px' }}>
                        {script?.say_this ?? ''}
                      </p>
                    </div>

                    {/* NOT THIS */}
                    <div style={{
                      background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
                      borderRadius: '16px', padding: '18px 20px', marginBottom: '20px',
                      animation: script ? undefined : 'rightnow-pulse 1.2s ease-in-out infinite',
                    }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--danger)', marginBottom: '8px' }}>
                        Not this
                      </div>
                      <p style={{ fontSize: '15px', lineHeight: 1.55, color: 'var(--danger)', minHeight: script ? undefined : '44px' }}>
                        {script?.not_this ?? ''}
                      </p>
                    </div>
                  </>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px' }}>
                  <Link
                    href={digiHref}
                    onClick={() => setOpen(false)}
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
          `}</style>
        </div>,
        document.body
      )}
    </>
  )
}
