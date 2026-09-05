'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

// The mobile bottom bar: Home, DiGi, Lessons, Quests, Scripts, Passport. The
// two most asked for destinations, Scripts and Quests, are real tabs rather
// than cards buried down Home. The Right Now help action lives on a floating
// button (rendered in the dashboard layout) so crisis words stay one tap away
// without taking a nav slot. Active is decided from the real route by longest
// matching prefix, so a script or quest sub page still lights its parent tab.
//
// Six, not five, since Lessons joined. Six across a 360px phone is genuinely
// tight, so it was measured rather than assumed: at 12px "Passport" is wider
// than a sixth of the bar, which pushes the row past the viewport and clips the
// last tab. The narrow screen rules in globals.css (search bottom-tab-bar) drop
// the label a size and let the items shrink. Checked at 360 and at 320.
//
// Readability first, the way the best parent apps do it: proper drawn icons
// rather than thin text glyphs, sentence case labels big enough to read at a
// glance, and an active tab that announces itself with its own coloured pill
// and a dark label, instead of pale butter text on white that nobody could see.

type Tab = {
  href: string
  label: string
  // Each tab owns a colour, so the bar reads as five clear places rather than
  // one undifferentiated row. Tint is the soft pill behind the active icon.
  colour: string
  tint: string
  icon: (active: boolean) => React.ReactNode
}

const S = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 2.1, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const NAV_TABS: Tab[] = [
  {
    href: '/dashboard', label: 'Home', colour: '#B8860B', tint: 'var(--terracotta-lt)',
    icon: a => (
      <svg {...S} stroke="currentColor">
        <path d="M3 10.2 12 3l9 7.2" />
        <path d="M5.5 9.2V20h13V9.2" />
        {a && <path d="M9.8 20v-5.4h4.4V20" fill="currentColor" stroke="none" />}
      </svg>
    ),
  },
  {
    href: '/dashboard/digi', label: 'DiGi', colour: '#2F8F6B', tint: 'var(--tint-green)',
    icon: a => (
      <svg {...S} stroke="currentColor">
        <path d="M20.5 11.6c0 4.1-3.8 7.4-8.5 7.4a9.9 9.9 0 0 1-2.6-.34L4.8 20.5l1.1-3.5A7 7 0 0 1 3.5 11.6c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4Z" fill={a ? 'currentColor' : 'none'} />
        {a
          ? <circle cx="12" cy="11.6" r="2.5" fill="#fff" stroke="none" />
          : <circle cx="12" cy="11.6" r="2.5" />}
      </svg>
    ),
  },
  {
    // A film in a frame, because that is what a lesson is here: five minutes to
    // watch together, then the stage moves on.
    href: '/dashboard/lessons', label: 'Lessons', colour: '#A8475C', tint: '#FBE7EC',
    icon: a => (
      <svg {...S} stroke="currentColor">
        <rect x="3" y="5" width="18" height="14" rx="3.2" fill={a ? 'currentColor' : 'none'} />
        <path d="M10.4 9.4 15 12l-4.6 2.6V9.4Z" fill={a ? '#fff' : 'currentColor'} stroke="none" />
      </svg>
    ),
  },
  {
    href: '/dashboard/quests', label: 'Quests', colour: '#C0603A', tint: '#FBEEDF',
    icon: a => (
      <svg {...S} stroke="currentColor">
        <path d="m12 3.6 2.6 5.3 5.9.85-4.25 4.14 1 5.86L12 16.98 6.75 19.75l1-5.86L3.5 9.75l5.9-.85L12 3.6Z" fill={a ? 'currentColor' : 'none'} />
      </svg>
    ),
  },
  {
    href: '/dashboard/scripts', label: 'Scripts', colour: '#2E6F8E', tint: 'var(--tint-blue)',
    icon: a => (
      <svg {...S} stroke="currentColor">
        <path d="M4 5.5h16v10.5H9.5L5 19.5v-3.5H4V5.5Z" fill={a ? 'currentColor' : 'none'} />
        {a
          ? <g stroke="#fff"><path d="M8 9.5h8" /><path d="M8 12.6h5" /></g>
          : <g><path d="M8 9.5h8" /><path d="M8 12.6h5" /></g>}
      </svg>
    ),
  },
  {
    href: '/dashboard/pathway', label: 'Passport', colour: '#7A5C1E', tint: 'var(--tint-amber)',
    icon: a => (
      <svg {...S} stroke="currentColor">
        <path d="M5 3.8h11.5a2.5 2.5 0 0 1 2.5 2.5v13.9H7.5A2.5 2.5 0 0 1 5 17.7V3.8Z" fill={a ? 'currentColor' : 'none'} />
        {a
          ? <circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none" />
          : <circle cx="12" cy="10" r="2.6" />}
        <path d="M5 17.4h14" stroke={a ? '#fff' : 'currentColor'} />
      </svg>
    ),
  },
]

// Carries the chosen child, same as the desktop tabs. A nav link that drops
// ?child= sends the parent back to the primary child on the next tap, which
// would make the switcher a lie: pick Alma, tap Lessons, quietly read Teo.
function MobileTabBarInner({ pendingAsks = 0, childId = null }: { pendingAsks?: number; childId?: string | null }) {
  const pathname = usePathname()
  // usePathname only updates once a navigation has fully resolved, so on a
  // heavier page the highlight lagged the tap and the bar felt slow. We track
  // the tapped tab optimistically and light it the instant a finger lifts,
  // then hand back to the real route once it catches up.
  const [pending, setPending] = useState<string | null>(null)
  const routeActive = NAV_TABS
    .filter(t => (t.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(t.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href
  useEffect(() => { setPending(null) }, [pathname])
  const active = pending ?? routeActive

  return (
    <nav className="bottom-tab-bar">
      {NAV_TABS.map(tab => {
        const isActive = tab.href === active
        const showBadge = tab.href === '/dashboard/quests' && pendingAsks > 0
        return (
          <Link
            key={tab.href}
            href={childId ? `${tab.href}?child=${childId}` : tab.href}
            prefetch
            onClick={e => {
              // Tapping the tab you are already on scrolls back to the top,
              // the way every app with a tab bar behaves. Next does nothing at
              // all for a link to the current route, so Home was a dead tap
              // once a parent had scrolled down, which is exactly when they
              // reach for it.
              if (tab.href === active) {
                e.preventDefault()
                const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
                window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
                return
              }
              setPending(tab.href)
            }}
            className={`tab-item${isActive ? ' active' : ''}`}
            style={{ textDecoration: 'none' }}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* The icon sits in its own pill. Active fills the pill with the
                tab's tint and colours the icon, so which tab you are on is
                obvious at arm's length. */}
            <span
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 46, height: 30, borderRadius: 100, boxSizing: 'border-box',
                background: isActive ? 'var(--terracotta)' : 'transparent',
                border: isActive ? '2px solid var(--ink)' : '2px solid transparent',
                color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {tab.icon(isActive)}
              {showBadge && (
                <span className="ask-badge" aria-label={`${pendingAsks} waiting`}>
                  {pendingAsks > 9 ? '9+' : pendingAsks}
                </span>
              )}
            </span>
            <span style={{ color: isActive ? 'var(--ink)' : 'var(--ink-soft)' }}>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

// ── WHY THIS IS WRAPPED IN SUSPENSE, AND WHY THE FALLBACK IS THE SAME BAR ───
//
// useSearchParams forces a client bailout, so any page that STATICALLY
// prerenders a component using it fails the build outright. The dashboard
// layout already provides a boundary, but /dev/tab-bar renders the bar on its
// own and that is a prerendered page, so the build broke there rather than
// anywhere a parent would ever look. Vercel found it; a typecheck never would.
//
// The boundary lives HERE rather than at each call site so no future page has
// to know. And the fallback renders the identical bar with no child, instead of
// null, because a nav that blinks out and back in on every load would be a real
// regression for a cosmetic reason. A prerendered page has no query string to
// read anyway, so the fallback is the correct answer there, not a placeholder.
function MobileTabBarWithChild({ pendingAsks }: { pendingAsks?: number }) {
  return <MobileTabBarInner pendingAsks={pendingAsks} childId={useSearchParams().get('child')} />
}

export default function MobileTabBar({ pendingAsks = 0 }: { pendingAsks?: number }) {
  return (
    <Suspense fallback={<MobileTabBarInner pendingAsks={pendingAsks} childId={null} />}>
      <MobileTabBarWithChild pendingAsks={pendingAsks} />
    </Suspense>
  )
}
