'use client'

import { useEffect, useState } from 'react'
import { HAPPY, Plate } from '@/components/kid/HappyNewsBits'
import { resolveTheme, DEFAULT_ACCENT } from '@/lib/kid/theme'

// The child's own recovery screen.
//
// Justin, 14 September 2026, sending a screenshot from his phone: "clicked use
// device time in child's app and error." The crash itself is fixed in
// lib/devices/ask-devices.ts. This is the other half of what that screenshot
// showed.
//
// A child hit a crash and was handed the PARENT's error screen: our apology in
// grown up words, an email address to write to, and a button reading "Back to
// my dashboard" pointing at /dashboard. A child has no dashboard, cannot log
// in to one, and would land on a sign in wall. The one control offered to them
// led further away from the only place they can go.
//
// app/error.tsx catches anything without a closer boundary, and there was no
// boundary anywhere under app/k. So every child crash, on any of their
// screens, fell all the way through to the grown up's page.
//
// This one says the same true thing in their language, offers the same two
// real choices (have another go, or go home to their own front page), and
// keeps them inside their app. No email address: a child cannot action it, and
// it is the grown up's to deal with. The Friend is here for the same reason
// the rest of the app has one, so a thing going wrong is not frightening.
//
// The ground is the paper page rather than the theme they chose, because the
// boundary renders when something has already gone wrong and asking the server
// for their colour is one more thing that can fail.

/** The child's token out of the path they are standing on, or null. */
export function tokenFromPath(pathname: string): string | null {
  const m = /^\/k\/([0-9a-f]{18})(?:\/|$)/.exec(pathname)
  return m ? m[1] : null
}

export default function KidError({ reset, pathname }: {
  error: Error & { digest?: string }
  reset: () => void
  /** Only the dev fixture passes this. Next hands a boundary error and reset. */
  pathname?: string
}) {
  // The way home, read off the address bar rather than asked of the router.
  // This renders because something already went wrong, so it leans on the one
  // thing that cannot have failed: the URL the child is standing on. Read
  // after mount, because the server has no location.
  const [token, setToken] = useState<string | null>(pathname ? tokenFromPath(pathname) : null)
  useEffect(() => {
    if (pathname) return
    setToken(tokenFromPath(window.location.pathname))
  }, [pathname])
  const theme = resolveTheme(DEFAULT_ACCENT)

  const btn = (filled: boolean) => ({
    width: '100%', maxWidth: 320, boxSizing: 'border-box' as const,
    display: 'block', textAlign: 'center' as const, textDecoration: 'none',
    padding: '16px 20px', borderRadius: 'var(--radius-btn)',
    border: `2px solid ${HAPPY.ink}`, background: filled ? HAPPY.butter : '#fff',
    color: HAPPY.ink, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
    boxShadow: `0 5px 0 ${HAPPY.ink}`,
  })

  return (
    <div
      data-kid-error
      style={{
        minHeight: '100dvh', background: theme.bg, fontFamily: 'var(--font-body)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', gap: 14,
        padding: 'calc(28px + env(safe-area-inset-top)) 20px calc(40px + env(safe-area-inset-bottom))',
      }}
    >
      <Plate size={92} tint={HAPPY.butterLt}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/digi-squad/DiGi-star.svg" alt="" aria-hidden width={62} height={66} style={{ display: 'block' }} />
      </Plate>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 7vw, 2.2rem)',
        letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, color: HAPPY.ink,
      }}>
        Oops, that did not open
      </h1>

      <p style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)',
        lineHeight: 1.45, color: theme.inkSoft, margin: 0, maxWidth: 340,
      }}>
        That one is our fault, not yours. Nothing you did is lost. Have another go, or go back to your page.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 6, width: '100%' }}>
        <button onClick={reset} style={btn(true)}>Try again</button>
        {token && <a href={`/k/${token}`} style={btn(false)}>Go to my page</a>}
      </div>

      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.inkMuted, margin: '10px 0 0',
      }}>
        Tell your grown up if it keeps happening
      </p>
    </div>
  )
}
