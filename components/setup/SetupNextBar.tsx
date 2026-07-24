'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { SetupStep } from '@/lib/setup/steps'

// The guided rail. While setup is not finished, this floats a quiet Next step
// bar on any dashboard page that is not the step's own page, so a parent who
// has just finished one step is walked straight to the next instead of being
// left on a feature page wondering what to do. Not now hides it for this page,
// and it returns as they move on, so it guides without trapping. The home page
// already has the full setup card, so the bar stays out of its way there.
export default function SetupNextBar() {
  const pathname = usePathname()
  const [next, setNext] = useState<SetupStep | null>(null)
  const [hidden, setHidden] = useState(false)

  // Do not nag. The bar appears at most twice in a session, so a parent who
  // taps Not now sees it return just once more, then it leaves them alone.
  // Counted in sessionStorage, so it starts fresh on their next visit.
  const MAX_SHOWS = 2
  const SESSION_KEY = 'gc_setupbar_shows'
  const [showThis, setShowThis] = useState(false)
  const shownFlag = useRef(false)

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/setup/next', { cache: 'no-store' })
      if (!res.ok) { setNext(null); return }
      const data = await res.json()
      setNext(data.next ?? null)
    } catch { setNext(null) }
  }, [])

  // Refetch and un-hide whenever the route changes, so finishing a step and
  // moving on always brings the current next step back into view.
  useEffect(() => { setHidden(false); refetch() }, [pathname, refetch])

  // Catch in place completions (a step finished without a navigation) when the
  // tab regains focus.
  useEffect(() => {
    const onFocus = () => refetch()
    window.addEventListener('visibilitychange', onFocus)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('visibilitychange', onFocus)
      window.removeEventListener('focus', onFocus)
    }
  }, [refetch])

  // Whether this appearance is eligible at all. The first step, the daily
  // practice, is driven by the home card and runs across several pages, so the
  // bar never nags it. The home page owns the full setup card, and the bar
  // never points a parent at the page they are already on.
  const base = next ? next.href.split('#')[0].split('?')[0] : ''
  const eligible =
    !!next && !hidden &&
    next.key !== 'daily' &&
    pathname !== '/dashboard' &&
    pathname !== base

  // Count each fresh appearance and stop after two in a session, so the bar
  // guides without turning into a repeated reminder.
  useEffect(() => {
    if (eligible && !shownFlag.current) {
      shownFlag.current = true
      const n = typeof window !== 'undefined' ? Number(sessionStorage.getItem(SESSION_KEY) || '0') : MAX_SHOWS
      if (n < MAX_SHOWS) {
        try { sessionStorage.setItem(SESSION_KEY, String(n + 1)) } catch { /* private mode */ }
        setShowThis(true)
      } else {
        setShowThis(false)
      }
    } else if (!eligible) {
      shownFlag.current = false
      setShowThis(false)
    }
  }, [eligible])

  if (!eligible || !showThis) return null

  return (
    <div style={{
      position: 'fixed', left: '50%', transform: 'translateX(-50%)',
      // Sit clear above the Help now button, which floats at bottom 78px and
      // stands 60px tall on its right. Sharing that line hid the Go button
      // behind it, so the bar rides above the whole stack instead.
      bottom: 'calc(150px + env(safe-area-inset-bottom, 0px))',
      width: 'calc(100% - 24px)', maxWidth: '440px', zIndex: 60,
    }}>
      <div style={{
        background: 'var(--deep-teal)', borderRadius: '18px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.22)', padding: '12px 12px 12px 18px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '2px' }}>
            Next step
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {next.title}
          </div>
        </div>
        <button
          onClick={() => setHidden(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.6)', padding: '6px 4px', flexShrink: 0 }}
        >
          Not now
        </button>
        <Link
          href={next.href}
          style={{
            flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '12px', padding: '11px 18px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          Go
        </Link>
      </div>
    </div>
  )
}
