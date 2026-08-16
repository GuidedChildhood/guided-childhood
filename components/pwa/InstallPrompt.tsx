'use client'

import { useEffect, useState } from 'react'

// The install prompt, done properly for both worlds. Android and desktop
// Chrome give us a real install event we can trigger on tap. iPhone gives
// us nothing (Apple allows no automatic prompt), so we guide the two taps
// with the actual icons a parent must look for.
//
// ASKED ONCE, AND THEN NOT AGAIN. Justin: "on laptop it keeps asking me to
// install the app but we have already done it. I open from the browser, so
// maybe that is confusing it, but it is annoying. Can we just ask once?"
//
// Both halves of that were real.
//
// ONE. Installed is only detected by display-mode: standalone, which is true
// inside the installed window and FALSE in a browser tab. Justin installed it
// and then carried on browsing in a tab, so from here he looked like somebody
// who never installed anything. getInstalledRelatedApps closes that gap where
// the browser supports it, and it needs the manifest to point back at itself,
// which is why related_applications exists in public/manifest.json.
//
// TWO, and this is the part that actually annoyed him: dismissing set a THREE
// DAY snooze. So the honest reading of a parent closing the banner was "ask me
// again on Thursday", forever, with no end. That is not a snooze, it is a
// recurring interruption with a polite name.
//
// Closing an install banner IS an answer. It now means no, permanently. If they
// change their mind the app is still installable from the browser's own menu,
// which is where somebody who wants to install an app goes anyway.

const DONE_KEY = 'gc_install_done'
const FIRST_SEEN_KEY = 'gc_app_first_seen'
/** The server has been told this browser runs standalone. See the ping below. */
const TOLD_KEY = 'gc_home_screen_told'
// ── ONCE A SESSION, NOT ONCE A PAGE ────────────────────────────────────────
//
// Justin, 16 August 2026, with a screenshot of the banner over the agreement:
// "need to stop this repeatedly flashing up, just once per session until
// installed."
//
// DONE_KEY only ever recorded a DISMISSAL, so a parent who simply navigated on
// met the banner again on the next page, and again on the one after. On Android
// and desktop Chrome beforeinstallprompt fires on every load until the app is
// installed, so the component remounting on each route change was enough to
// bring it back. It was not nagging by design, it was nagging by omission.
//
// sessionStorage is exactly the right lifetime: it says its piece once per
// visit, and it is gone when they close the tab, so tomorrow it may ask again
// until the app is actually installed. Separate from DONE_KEY, which stays the
// permanent no.
const SESSION_KEY = 'gc_install_seen_session'

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
    const nav = navigator as Navigator & {
      standalone?: boolean
      getInstalledRelatedApps?: () => Promise<unknown[]>
    }
    const standalone = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
    if (standalone) {
      localStorage.setItem(DONE_KEY, '1')
      // AND TELL THE SERVER, ONCE PER BROWSER.
      //
      // Standalone is the browser saying the app is on a home screen and was
      // launched from there, which is the only honest proof we can get that the
      // third Setup Quest step actually happened. localStorage cannot carry it:
      // a flag has to be readable on the server, has to survive a cleared
      // browser, and has to be the same answer on the phone and the laptop.
      //
      // Guarded by its own key rather than DONE_KEY, because DONE_KEY also
      // means "they dismissed the banner", and dismissing is not installing.
      // Fire and forget: the route is idempotent, and a failed ping costs a
      // tick that the reminders half of the step will earn anyway.
      if (localStorage.getItem(TOLD_KEY) !== '1') {
        localStorage.setItem(TOLD_KEY, '1')
        fetch('/api/setup/home-screen', { method: 'POST' }).catch(() => { /* next open */ })
      }
      return
    }
    if (localStorage.getItem(DONE_KEY) === '1') return

    // Already installed, but being read in a browser tab. Chrome only. Fires
    // and forgets: if it resolves to an install we mark done and the banner
    // never shows again, and if the browser does not support it we simply carry
    // on with the rules below.
    let cancelled = false
    nav.getInstalledRelatedApps?.().then(apps => {
      if (!cancelled && apps.length > 0) {
        localStorage.setItem(DONE_KEY, '1')
        setMode('hidden')
      }
    }).catch(() => { /* unsupported, no worse than before */ })
    // Never on the very first visit. Let the parent land and do their first
    // setup step before we ask them to install, so nothing competes on day one.
    if (!localStorage.getItem(FIRST_SEEN_KEY)) { localStorage.setItem(FIRST_SEEN_KEY, String(Date.now())); return }

    // Already said its piece this visit.
    try { if (sessionStorage.getItem(SESSION_KEY) === '1') return } catch { /* private mode */ }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setPlatform(isIos ? 'ios' : 'android')

    if (!isIos) {
      const onPrompt = (e: Event) => {
        e.preventDefault()
        setInstallEvent(e as BeforeInstallPromptEvent)
        try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* private mode */ }
        setMode('banner')
      }
      window.addEventListener('beforeinstallprompt', onPrompt)
      return () => { cancelled = true; window.removeEventListener('beforeinstallprompt', onPrompt) }
    }

    const id = setTimeout(() => {
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* private mode */ }
      setMode('banner')
    }, 2500)
    return () => { cancelled = true; clearTimeout(id) }
  }, [])

  /**
   * Closing the banner is an answer, not a postponement.
   *
   * This used to write a three day snooze, which meant a parent who said no was
   * asked again on Thursday, and the Thursday after that, indefinitely. Asked
   * once is what was wanted and it is also the right default: an install banner
   * that returns after being dismissed reads as nagging, and the browser's own
   * menu is still there for anyone who changes their mind.
   */
  function markDone() {
    localStorage.setItem(DONE_KEY, '1')
    setMode('hidden')
  }

  async function androidInstall() {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    // Accepted or declined, they have now been asked and have answered.
    markDone()
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
        {/* Button under the words, not beside them: as a third column it
            squeezed the title one word a line at larger text sizes. */}
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: '#fff', lineHeight: 1.25 }}>
            Put Guided Childhood on your Home Screen
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, marginTop: '2px' }}>
            Full screen, one tap away, and check ins can reach you.
          </span>
          <button
            onClick={() => platform === 'ios' ? setMode('ios-sheet') : androidInstall()}
            style={{
              background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px',
              padding: '9px 14px', cursor: 'pointer', display: 'inline-block', marginTop: '9px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              boxShadow: '0 3px 0 var(--terracotta-dark)',
            }}
          >
            {platform === 'ios' ? 'Show me' : 'Install'}
          </button>
        </span>
        <button
          onClick={markDone}
          aria-label="Not now"
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-md)', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
        >
          ✕
        </button>
      </div>
    )
  }

  // The iOS walkthrough sheet: the two taps, with the real icons
  return (
    <div
      onClick={markDone}
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
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          Two taps and it is an app
        </h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
          Apple does not let websites do this automatically, so here is exactly where to tap in Safari:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--cream)', borderRadius: '14px', padding: '14px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', flexShrink: 0 }}>1</span>
            <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }}>
              Tap the <strong>Share</strong> button <ShareGlyph /> in the bar at the bottom of Safari (the square with the arrow pointing up).
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--cream)', borderRadius: '14px', padding: '14px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', flexShrink: 0 }}>2</span>
            <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }}>
              Scroll down the list and tap <strong>Add to Home Screen</strong> <span style={{ fontWeight: 700 }}>⊞</span>, then <strong>Add</strong>.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--tint-sage)', borderRadius: '14px', padding: '14px 16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }}>
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
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            Done, it is on my Home Screen
          </button>
          <button
            onClick={markDone}
            style={{
              padding: '14px 16px', background: 'none', border: '1.5px solid var(--border)',
              borderRadius: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)', color: 'var(--ink-muted)',
            }}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}
