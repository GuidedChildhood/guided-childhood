'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_TABS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/digi', label: 'DiGi' },
  { href: '/dashboard/pathway', label: 'Pathway' },
  { href: '/dashboard/quests', label: 'Quests' },
  { href: '/dashboard/scripts', label: 'Scripts' },
  { href: '/dashboard/lessons', label: 'Lessons' },
  { href: '/dashboard/tracker', label: 'Progress' },
]

// Segmented pill navigation: the active tab sits in a dark pill, hover
// gets a soft wash. Active is by longest matching prefix so nested pages
// (a script, a lesson) still light their parent tab.
export default function NavTabs() {
  const pathname = usePathname()
  const active = NAV_TABS
    .filter(t => (t.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(t.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav style={{ display: 'flex', gap: '2px', flex: 1, background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '3px', width: 'fit-content', flexGrow: 0 }}>
      {NAV_TABS.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`nav-pill${tab.href === active ? ' nav-pill-active' : ''}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
