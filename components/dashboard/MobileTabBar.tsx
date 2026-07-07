'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import RightNowButton from '@/components/rightnow/RightNowButton'

// The mobile bottom bar: Home, DiGi, [Now], Scripts, Progress. The tab
// bar previously had no idea which page it was on, so a leftover touch
// hover state could leave Home looking highlighted while the parent was
// three pages away on Scripts, exactly the "which tab am I on" confusion
// that made getting back to Home feel broken. Active is now decided from
// the real route by longest matching prefix, same rule the desktop pill
// nav uses, so a script or lesson page still lights its parent tab.

const NAV_TABS_LEFT = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/dashboard/digi', label: 'DiGi', icon: '◎' },
]
const NAV_TABS_RIGHT = [
  { href: '/dashboard/scripts', label: 'Scripts', icon: '◻' },
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
