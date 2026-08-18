'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// One nav, phone and laptop the same: the six core destinations in one order,
// so the app never reads differently on a bigger screen. School reaches from
// Home and the Passport rather than a top level tab, and the old Pathway tab
// folded into the Passport (it is the same journey now).
//
// Lessons sits before Quests because it is the thing the quests are for. It had
// no desktop tab at all until now, only a chip in the mobile secondary strip,
// which meant the one part of the product that actually teaches a child was the
// one part with no way in on a laptop.
const NAV_TABS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/digi', label: 'DiGi' },
  { href: '/dashboard/lessons', label: 'Lessons' },
  { href: '/dashboard/quests', label: 'Quests' },
  { href: '/dashboard/scripts', label: 'Scripts' },
  { href: '/dashboard/pathway', label: 'Passport' },
]

// Segmented pill navigation: the active tab sits in a dark pill, hover
// gets a soft wash. Active is by longest matching prefix so nested pages
// (a script, a lesson) still light their parent tab. The Quests tab wears
// a red, gently rocking badge whenever a child is waiting on an answer.

// ── AND IT CARRIES THE CHILD ────────────────────────────────────────────────
//
// The switcher writes ?child= into the URL, and a nav link that drops it sends
// the parent back to the primary child on the very next tap. That would make
// the rail a lie: pick Alma, tap Lessons, and quietly be reading about Teo.
//
// So every tab appends the current child when there is one. Nothing changes for
// a family with one child, because the param is never there to carry.
function NavTabsInner({ pendingAsks = 0, childId = null }: { pendingAsks?: number; childId?: string | null }) {
  const pathname = usePathname()
  const active = NAV_TABS
    .filter(t => (t.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(t.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav style={{ display: 'flex', gap: '3px', flex: 1, background: 'rgba(247,244,238,0.7)', border: '1px solid rgba(26,26,46,0.06)', borderRadius: '100px', padding: '4px', width: 'fit-content', flexGrow: 0, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: 'inset 0 1px 2px rgba(26,26,46,0.03)' }}>
      {NAV_TABS.map(tab => {
        const showBadge = tab.href === '/dashboard/quests' && pendingAsks > 0
        return (
          <Link
            key={tab.href}
            href={childId ? `${tab.href}?child=${childId}` : tab.href}
            className={`nav-pill${tab.href === active ? ' nav-pill-active' : ''}`}
            style={{ position: 'relative' }}
          >
            {tab.label}
            {showBadge && (
              <span className="ask-badge" aria-label={`${pendingAsks} waiting`}>
                {pendingAsks > 9 ? '9+' : pendingAsks}
              </span>
            )}
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
function NavTabsWithChild({ pendingAsks }: { pendingAsks?: number }) {
  return <NavTabsInner pendingAsks={pendingAsks} childId={useSearchParams().get('child')} />
}

export default function NavTabs({ pendingAsks = 0 }: { pendingAsks?: number }) {
  return (
    <Suspense fallback={<NavTabsInner pendingAsks={pendingAsks} childId={null} />}>
      <NavTabsWithChild pendingAsks={pendingAsks} />
    </Suspense>
  )
}
