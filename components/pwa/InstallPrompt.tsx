'use client'

import { useEffect, useState } from 'react'

// The install prompt, done properly for both worlds. Android and desktop
// Chrome give us a real install event we can trigger on tap. iPhone gives
// us nothing (Apple allows no automatic prompt), so we guide the two taps
// with the actual icons a parent must look for. Snoozes for three days on
// dismiss, gone forever once installed or marked done.

const SNOOZE_KEY = 'gc_install_snooze'
const DONE_KEY = 'gc_install_done'
const FIRST_SEEN_KEY = 'gc_app_first_seen'
const SNOOZE_DAYS = 3

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

function ShareGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'inline', verticalAlign: '-4px' }}>
      <path d="M12 3v11M12 3l-4 4M12 3l4 4" stroke="#0B84FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" stroke="#0B84FE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function InstallPrompt() {
  const [mode, setMode] = useState<'hidden' | 'banner' | 'ios-sheet'>('hidden')
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios')
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean }
    const standalone = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
    if (standalone) { localStorage.setItem(DONE_KEY, '1'); return }
    if (localStorage.getItem(DONE_KEY) === '1') return
    const snooze = Number(localStorage.getItem(SNOOZE_KEY) ?? 0)
    if (snooze && Date.now() - snooze < SNOOZE_DAYS * 86400000) return
    // Never on the very first visit. Let the parent land and do their first
    // setup step before we ask them to install, so nothing competes on day one.
    if (!localStorage.getItem(FIRST_SEEN_KEY)) { localStorage.setItem(FIRST_SEEN_KEY, String(Date.now())); return }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setPlatform(isIos ? 'ios' : 'android')

    if (!isIos) {
      const onPrompt = (e: Event) => {
        e.preventDefault()
        setInstallEvent(e as BeforeInstallPromptEvent)
        setMode('banner')
      }
      window.addEventListener('beforeinstallprompt', onPrompt)
      return () => window.removeEventListener('beforeinstallprompt', onPrompt)
    }

    const id = setTimeout(() => setMode('banner'), 2500)
    return () => clearTimeout(id)
  }, [])

  function snooze() {
    localStorage.setItem(SNOOZE_KEY, String(Date.now()))
    setMode('hidden')
  }

  function markDone() {
    localStorage.setItem(DONE_KEY, '1')
    setMode('hidden')
  }

  async function androidInstall() {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === 'accepted') markDone()
    else snooze()
  }

  if (mode === 'hidden') return null

  if (mode === 'banner') {
    return (
      <div style={{
        position: 'fixed', left: '14px', right: '14px', bottom: '86px', zIndex: 80,
        background: 'var(--deep-teal)', borderRadius: '18px', padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 10px 34px rgba(23,60,70,0.45)',
      }}>
        <span style={{
          width: 42, height: 42, borderRadius: '12px', background: 'var(--terracotta)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 0 var(--terracotta-dark)',
        }}>
          <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
            {[4, 8, 12, 7].map((h, i) => (
              <span key={i} style={{ width: '2.5px', height: `${h}px`, background: '#fff', borderRadius: '1px' }} />
            ))}
          </span>
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: '#fff', lineHeight: 1.25 }}>
            Put Guided Childhood on your Home Screen
          </span>
          <span style={{ display: 'block', fontSize: '11.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, marginTop: '2px' }}>
            Full screen, one tap away, and check ins can reach you.
          </span>
        </span>
        <button
          onClick={() => platform === 'ios' ? setMode('ios-sheet') : androidInstall()}
          style={{
            background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px',
            padding: '10px 14px', cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          {platform === 'ios' ? 'Show me' : 'Install'}
        </button>
        <button
          onClick={snooze}
          aria-label="Not now"
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '15px', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
        >
          ✕
        </button>
      </div>
    )
  }

  // The iOS walkthrough sheet: the two taps, with the real icons
  return (
    <div
      onClick={snooze}
      style={{
        position: 'fixed', inset: 0, zIndex: 130,
        background: 'rgba(26,26,46,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(100%, 480px)', background: '#fff',
          borderRadius: '24px 24px 0 0', padding: '24px 22px calc(20px + env(safe-area-inset-bottom))',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          Two taps and it is an app
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
          Apple does not let websites do this automatically, so here is exactly where to tap in Safari:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--cream)', borderRadius: '14px', padding: '14px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: 'var(--terracotta-dark)', flexShrink: 0 }}>1</span>
            <span style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55 }}>
              Tap the <strong>Share</strong> button <ShareGlyph /> in the bar at the bottom of Safari (the square with the arrow pointing up).
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--cream)', borderRadius: '14px', padding: '14px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: 'var(--terracotta-dark)', flexShrink: 0 }}>2</span>
            <span style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55 }}>
              Scroll down the list and tap <strong>Add to Home Screen</strong> <span style={{ fontWeight: 700 }}>⊞</span>, then <strong>Add</strong>.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--tint-sage)', borderRadius: '14px', padding: '14px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: 'var(--terracotta-dark)', flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55 }}>
              Open it from your Home Screen and turn on check ins when it asks. That is the whole setup.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={markDone}
            style={{
              flex: 1, padding: '14px', background: 'var(--terracotta)', color: 'var(--ink)',
              border: 'none', borderRadius: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            Done, it is on my Home Screen
          </button>
          <button
            onClick={snooze}
            style={{
              padding: '14px 16px', background: 'none', border: '1.5px solid var(--border)',
              borderRadius: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: '13px', color: 'var(--ink-muted)',
            }}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}
