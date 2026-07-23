'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_TABS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/digi', label: 'DiGi' },
  { href: '/dashboard/pathway', label: 'Pathway' },
  { href: '/dashboard/quests', label: 'Quests' },
  { href: '/dashboard/lessons', label: 'Lessons' },
  { href: '/dashboard/school', label: 'School' },
  { href: '/dashboard/scripts', label: 'Scripts' },
  { href: '/dashboard/tracker', label: 'Passport' },
]

// Segmented pill navigation: the active tab sits in a dark pill, hover
// gets a soft wash. Active is by longest matching prefix so nested pages
// (a script, a lesson) still light their parent tab. The Quests tab wears
// a red, gently rocking badge whenever a child is waiting on an answer.
export default function NavTabs({ pendingAsks = 0 }: { pendingAsks?: number }) {
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
            href={tab.href}
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
