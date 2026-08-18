'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

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
// ── ONCE, THEN ONCE A WEEK, UNTIL IT IS ACTUALLY INSTALLED ─────────────────
//
// Justin, 16 August 2026, with a screenshot of the banner over the agreement
// wizard: "please just flash this up once then once per week until done."
//
// DONE_KEY only ever recorded a DISMISSAL, so a parent who simply navigated on
// met the banner again on the next page, and the one after that. On Android and
// desktop Chrome beforeinstallprompt fires on every load until the app is
// installed, so the component remounting on each route change was enough to
// bring it straight back. It was not nagging by design, it was nagging by
// omission.
//
// A week in localStorage, not a session in sessionStorage. Once a session
// sounds restrained and is not: a parent who opens the app twice a day meets it
// fourteen times a week. Once a week is the honest reading of "flash it up once,
// then once a week", and it is the same clock the setup next step bar keeps, so
// the two interruptions in this product behave alike.
//
// Stamped when it is SHOWN rather than when it is acted on, so dismissing,
// installing and ignoring it all cost the same week. DONE_KEY still exists and
// still means the permanent no: this is only about how often the question comes
// back to somebody who has not answered it.
const LAST_SHOWN_KEY = 'gc_install_last_shown'
// ── AND ONCE PER SESSION, WHICH IS THE GUARD THAT CANNOT BE DEFEATED ───────
//
// Justin, 17 August 2026: "every time I click a button this pops up, it can not
// do that. Once skip is clicked it should not pop up again on this session and
// only once per week."
//
// The weekly clock above is right and was already shipped, and it still was not
// enough. It lives in localStorage, which is scoped to an ORIGIN, and every
// Vercel preview deploy gets its own hostname, so testing on a preview starts
// with an empty store every single time. beforeinstallprompt then fires on each
// page load and the banner returns.
//
// A session key is the belt to that pair of braces. It costs nothing when the
// weekly clock is working and it saves the case where the clock has been reset
// underneath us, which is exactly what a parent sees as "it keeps popping up".
// Both are written the moment the banner is SHOWN, so dismissing, skipping,
// installing and ignoring all cost the same session and the same week.
const SESSION_KEY = 'gc_install_asked_session'
const ASK_AGAIN_AFTER_MS = 7 * 24 * 60 * 60 * 1000

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
  // ── NEVER ON THE PAGE THAT ALREADY ASKS THIS ─────────────────────────────
  //
  // Justin, 16 August 2026, with a screenshot of the banner sitting on top of
  // Setup Quest step two, which reads "Put us on your home screen, and turn on
  // reminders": "every screen is asking for this."
  //
  // Two different surfaces asking the same thing, and the banner was covering
  // the considered version with the interrupting one. The setup step explains
  // it, walks both platforms through it and ticks itself when it is genuinely
  // done; the banner is the drive by. On that page the step wins, always, and
  // not on a timer.
  //
  // Suppressed rather than delayed, because a delay would only mean it lands
  // while they are following the instructions underneath it.
  const pathname = usePathname()
  const onSetup = pathname?.startsWith('/dashboard/setup') ?? false

  const [mode, setMode] = useState<'hidden' | 'banner' | 'ios-sheet'>('hidden')
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios')
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (onSetup) return
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

    // Already asked this visit, whatever the weekly clock says.
    try { if (sessionStorage.getItem(SESSION_KEY) === '1') return } catch { /* private mode */ }

    // Asked within the last week. Say nothing.
    try {
      const last = Number(localStorage.getItem(LAST_SHOWN_KEY) ?? 0)
      if (last && Date.now() - last < ASK_AGAIN_AFTER_MS) return
    } catch { /* private mode: behave as though it has never asked */ }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setPlatform(isIos ? 'ios' : 'android')

    if (!isIos) {
      const onPrompt = (e: Event) => {
        e.preventDefault()
        setInstallEvent(e as BeforeInstallPromptEvent)
        try {
          localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()))
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch { /* private mode */ }
        setMode('banner')
      }
      window.addEventListener('beforeinstallprompt', onPrompt)
      return () => { cancelled = true; window.removeEventListener('beforeinstallprompt', onPrompt) }
    }

    const id = setTimeout(() => {
      try {
        localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()))
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch { /* private mode */ }
      setMode('banner')
    }, 2500)
    return () => { cancelled = true; clearTimeout(id) }
  }, [onSetup])

  /**
   * Closing the banner starts the week, it does not end the conversation.
   *
   * This has now been all three things. A three day snooze first, which Justin
   * called annoying and was: "ask me again on Thursday", for ever. Then a
   * permanent no, on his "can we just ask once?". Now once a week until it is
   * genuinely installed, on his "flash this up once then once per week until
   * done", and the three are not contradictory. The first was too often, the
   * second too final, and a parent who meant to install it and got interrupted
   * had no way back to the offer except the browser's own menu.
   *
   * So DONE_KEY is no longer written here. It is written by the standalone
   * check at the top, which is the browser telling us the app IS on a home
   * screen, and by getInstalledRelatedApps. Those are facts. A dismissal is not
   * a fact about installation, it is "not now", and the week is what makes
   * "not now" mean something without meaning never.
   *
   * The week itself is already stamped at the moment the banner was shown, so
   * there is nothing to write here beyond hiding it: closing it, tapping
   * Install and walking away all cost the same seven days.
   */
  function markDone() {
    setMode('hidden')
  }

  async function androidInstall() {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    // Accepted or declined, they have now been asked and have answered.
    markDone()
  }

  if (onSetup || mode === 'hidden') return null

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
            It is how the check in reminders reach you. Without it they cannot.
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
          {/* ── A REAL SKIP, AND THE LAPTOP CASE ──────────────────────────
              Justin, 16 August 2026: "needs to have option for laptop and there
              needs to be a skip button, but say that adding to home screen means
              you can get vital notifications. It cannot keep coming up again and
              again."
              The only way out used to be the small grey cross in the corner,
              which is a close control rather than an answer, so a parent who did
              not want it had to dismiss the same banner rather than decline it
              once. Skip says the same thing in a word they can actually find.
              And the laptop line matters because this is genuinely different
              there: a desktop browser installs to the dock or the taskbar rather
              than a home screen, and a parent reading "home screen" on a laptop
              reasonably concludes it is not for them. */}
          <button
            onClick={markDone}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'inline-block', marginTop: '9px', marginLeft: '14px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              color: 'rgba(255,255,255,0.72)', padding: '9px 4px',
            }}
          >
            Skip
          </button>
          <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.45, marginTop: '7px' }}>
            On a laptop it installs to your dock instead, and works the same.
          </span>
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
