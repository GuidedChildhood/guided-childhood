'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { SetupStep } from '@/lib/setup/steps'

// The guided rail. While setup is not finished, this floats a quiet Next step
// bar on any dashboard page that is not the step's own page, so a parent who
// has just finished one step is walked straight to the next instead of being
// left on a feature page wondering what to do. The home page already has the
// full setup card, so the bar stays out of its way there.
//
// It says each step once and then shuts up. See the seen list below.
export default function SetupNextBar() {
  const pathname = usePathname()
  const [next, setNext] = useState<SetupStep | null>(null)
  const [hidden, setHidden] = useState(false)

  // Once per step, for good.
  //
  // This used to allow two appearances per session, counted in sessionStorage,
  // which reset on every visit. So a parent who opened the app on Monday,
  // Tuesday and Wednesday got the same bar thrown at them three times, and it
  // stopped reading as a helpful rail and started reading as a nag.
  //
  // Now each step gets exactly one appearance, ever, remembered in
  // localStorage. Set up Family Quests says its piece once. If they do not act
  // on it, the home setup card and the passport still carry it, so nothing is
  // lost by the bar going quiet. A later step, when they get to it, gets its
  // own single nudge.
  const SEEN_KEY = 'gc_setupbar_seen'
  const [seen, setSeen] = useState<string[] | null>(null)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SEEN_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      setSeen(Array.isArray(parsed) ? parsed.filter(k => typeof k === 'string') : [])
    } catch { setSeen([]) /* private mode, or somebody edited the key by hand */ }
  }, [])
  const markSeen = useCallback((key: string) => {
    setSeen(prev => {
      const list = prev ?? []
      if (list.includes(key)) return list
      const next = [...list, key]
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(next)) } catch { /* private mode */ }
      return next
    })
  }, [])
  // The step the bar is showing right now. See the latch note below.
  const [showingKey, setShowingKey] = useState<string | null>(null)

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

  // Whether this place and moment could carry the bar at all. The home page
  // owns the full setup card, and the bar never points a parent at the page
  // they are already on, which now also covers the two steps whose work happens
  // on the setup page itself: their href is /dashboard/setup, so the bar simply
  // does not appear once a parent is standing there. seen is null until
  // localStorage has been read, which keeps the bar off the first paint rather
  // than flashing it at somebody who has already dismissed it.
  //
  // The daily practice used to be excluded by name here, because it was step
  // one and ran across several pages. It is not a setup step any more: it is
  // the daily loop. See lib/setup/steps.ts.
  // ── NOTHING FLOATS AT THEM ON THE FIRST DAY (15 August 2026) ─────────────
  //
  // Justin: "we don't also need pop ups on their first log in, they should only
  // come if not completed on first log in and later log ins, not to annoy, just
  // a prompt for what outstanding."
  //
  // On day one a parent is ALREADY being walked through setup. A floating bar
  // telling them to do the thing they are visibly in the middle of doing is the
  // app talking over itself, and it is the first impression. From the second
  // day it earns its place, because by then the setup page is somewhere they
  // have to choose to go back to.
  //
  // gc_app_first_seen is the same stamp InstallPrompt sets and reads, so the
  // two interruptions agree on what day one means rather than each keeping
  // their own clock. Written here too, because whichever of the two mounts
  // first should start it.
  const [firstSeen, setFirstSeen] = useState<number | null>(null)
  useEffect(() => {
    const KEY = 'gc_app_first_seen'
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) { setFirstSeen(Number(raw)); return }
      const now = Date.now()
      localStorage.setItem(KEY, String(now))
      setFirstSeen(now)
    } catch { setFirstSeen(0) /* private mode: treat as long ago, behave as before */ }
  }, [])
  const pastFirstDay = firstSeen !== null && (Date.now() - firstSeen) > 20 * 60 * 60 * 1000

  const base = next ? next.href.split('#')[0].split('?')[0] : ''
  const candidate =
    !!next && !hidden && seen !== null &&
    pastFirstDay &&
    pathname !== '/dashboard' &&
    pathname !== base

  // Showing it IS the one appearance, recorded the moment it lands rather than
  // when they act on it, so Not now, Go and simply walking away all cost the
  // same thing: the bar has said its piece about this step and will not say it
  // again.
  //
  // The latch matters. Writing to seen is what retires the step, so without
  // holding the key we are currently showing, that write would make the bar
  // ineligible in the same tick and it would vanish before it was read.
  useEffect(() => {
    if (!candidate || !next || !seen) { setShowingKey(null); return }
    if (showingKey === next.key) return
    if (seen.includes(next.key)) { setShowingKey(null); return }
    setShowingKey(next.key)
    markSeen(next.key)
  }, [candidate, next, seen, showingKey, markSeen])

  if (!candidate || !next || showingKey !== next.key) return null

  return (
    <div style={{
      position: 'fixed', left: '50%', transform: 'translateX(-50%)',
      // Sit clear above the Help now button, which floats at bottom 78px and
      // stands 60px tall on its right. Sharing that line hid the Go button
      // behind it, so the bar rides above the whole stack instead.
      bottom: 'calc(150px + env(safe-area-inset-bottom, 0px))',
      width: 'calc(100% - 24px)', maxWidth: '440px', zIndex: 60,
    }}>
      {/* Retro green, not espresso. --deep-teal is #2E2818, which is a warm
          brown on a big marketing panel but reads as a flat black brick in a
          small floating bar on a phone, and a black brick over a cream
          dashboard looks like a system alert rather than a friendly hand on the
          shoulder. --retro-green is in the tokens for exactly this, described
          there as the friendlier dark panel. */}
      <div style={{
        background: 'var(--retro-green)', borderRadius: '18px',
        boxShadow: '0 10px 26px rgba(35,111,82,0.28)', padding: '12px 12px 12px 18px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '2px' }}>
            Next step
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {next.title}
          </div>
        </div>
        <button
          onClick={() => setHidden(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.72)', padding: '6px 4px', flexShrink: 0 }}
        >
          Not now
        </button>
        <Link
          href={next.href}
          style={{
            flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '12px', padding: '11px 18px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          Go
        </Link>
      </div>
    </div>
  )
}
