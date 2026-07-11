'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import RightNowButton from '@/components/rightnow/RightNowButton'

// The mobile bottom bar: Home, DiGi, [Now], Progress. One nav, not two: the
// old scrollable strip above the page was removed, so the bottom bar is the
// single place to move around, in the thumb zone, which is the mobile
// standard. Four anchors and the centre Right Now action, everything else
// (Scripts, Lessons, Quests, School, Pathway) lives on Home. Active is
// decided from the real route by longest matching prefix, same rule the
// desktop pill nav uses, so a script or lesson page still lights its parent.

const NAV_TABS_LEFT = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/dashboard/digi', label: 'DiGi', icon: '◎' },
]
const NAV_TABS_RIGHT = [
  { href: '/dashboard/tracker', label: 'Progress', icon: '△' },
]
const ALL_TABS = [...NAV_TABS_LEFT, ...NAV_TABS_RIGHT]

export default function MobileTabBar() {
  const pathname = usePathname()
  const active = ALL_TABS
    .filter(t => (t.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(t.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav className="bottom-tab-bar">
      {NAV_TABS_LEFT.map(tab => (
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
      <RightNowButton />
      {NAV_TABS_RIGHT.map(tab => (
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
