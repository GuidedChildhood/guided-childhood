'use client'

import { useEffect, useState } from 'react'

// The confirmation that follows you, instead of one you have to scroll back to.
//
// Justin: "the notification job sent should show where they are in screen as
// seems to flash up at top of screen."
//
// He is describing a real defect, not a preference. The manage page put its
// "Added X" pill directly above the text input, which is correct for the one
// case where you typed the job in that input. But the add controls carry on for
// several hundred pixels below it: the used before chips, the ideas list, the
// show all toggle. Tap an idea near the bottom of that and the confirmation
// fires somewhere off the top of the screen. You get no feedback at all, so you
// tap again, and now there are two.
//
// A confirmation has one job, which is to reach the person who just acted. It
// has to be anchored to the VIEWPORT, not to the form, because the form is not
// where they are.
//
// Bottom rather than top, which is what the references do: Notion, KakaoTalk
// and Todoist all float it just above the bottom bar. Two things follow from
// that. It is inside thumb reach on a phone, and it is nowhere near the notch,
// the back button or the system status bar, which is where a top toast fights
// for space and loses.
//
// It never covers the tab bar. Sitting ON the navigation is how a toast stops
// someone leaving the page, and a confirmation that blocks the exit is worse
// than no confirmation.

export default function SentToast({
  message,
  onDone,
  ms = 2600,
}: {
  /** Null hides it. Changing the string re-shows and restarts the timer. */
  message: string | null
  onDone: () => void
  ms?: number
}) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!message) { setShown(false); return }
    // Two frames, so the element is in the DOM at its start position before the
    // transition is asked for. One frame is not reliably enough and the toast
    // occasionally appears already settled, with no motion at all.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    const hide = setTimeout(() => setShown(false), ms)
    // Cleared a beat after it starts leaving, so the message is still there to
    // read while it animates out rather than vanishing mid slide.
    const clear = setTimeout(onDone, ms + 320)
    return () => { cancelAnimationFrame(raf); clearTimeout(hide); clearTimeout(clear) }
  }, [message, ms, onDone])

  if (!message) return null

  return (
    <div
      // Polite, not assertive: it is good news, and a screen reader should
      // finish the sentence it is on rather than being interrupted to hear it.
      role="status"
      aria-live="polite"
      className="no-print"
      style={{
        position: 'fixed',
        // Clear of the bottom tab bar on a phone, plus the home indicator.
        bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: `translateX(-50%) translateY(${shown ? '0' : '14px'})`,
        opacity: shown ? 1 : 0,
        transition: 'opacity 0.22s ease, transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)',
        zIndex: 60,
        // Never wider than the phone, never so wide on a desk that it drifts
        // away from where the eye already is.
        maxWidth: 'min(calc(100vw - 32px), 420px)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--ink)',
        color: '#fff',
        borderRadius: 16,
        padding: '13px 17px',
        boxShadow: '0 6px 22px rgba(26,26,46,0.28)',
        // The page underneath stays usable. A toast that swallows taps means a
        // parent adding three jobs in a row loses the second one.
        pointerEvents: 'none',
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: 999,
          background: 'var(--retro-green, #5C9433)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1,
        }}
      >
        ✓
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, lineHeight: 1.35 }}>
        {message}
      </span>
    </div>
  )
}
