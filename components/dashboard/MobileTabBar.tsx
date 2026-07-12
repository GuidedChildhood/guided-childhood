'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// The mobile bottom bar: Home, Scripts, DiGi, Quests, Progress. The two most
// asked for destinations, Scripts and Quests, are now real tabs rather than
// cards buried down Home. The Right Now help action moved to a floating button
// (rendered in the dashboard layout) so crisis words stay one tap away without
// taking a nav slot. Active is decided from the real route by longest matching
// prefix, so a script or quest sub page still lights its parent tab.

const NAV_TABS = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/dashboard/scripts', label: 'Scripts', icon: '❝' },
  { href: '/dashboard/digi', label: 'DiGi', icon: '◎' },
  { href: '/dashboard/quests', label: 'Quests', icon: '✦' },
  { href: '/dashboard/tracker', label: 'Progress', icon: '△' },
]

export default function MobileTabBar() {
  const pathname = usePathname()
  const active = NAV_TABS
    .filter(t => (t.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(t.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav className="bottom-tab-bar">
      {NAV_TABS.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`tab-item${tab.href === active ? ' active' : ''}`}
          style={{ textDecoration: 'none' }}
          aria-current={tab.href === active ? 'page' : undefined}
        >
          <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}
