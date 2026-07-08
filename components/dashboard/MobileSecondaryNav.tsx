'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// The mobile top tab strip. The bottom bar only holds five, so Lessons,
// Quests and School had no tab on a phone, only a Home card. This scrolls
// horizontally under the header and gives every section a real tab on
// mobile. Hidden on desktop, where the pill nav in the header already
// carries these. Active is by longest matching prefix, same rule as the
// other navs, so a nested page still lights its parent tab.

const TABS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/pathway', label: 'Pathway' },
  { href: '/dashboard/quests', label: 'Quests' },
  { href: '/dashboard/lessons', label: 'Lessons' },
  { href: '/dashboard/school', label: 'School' },
  { href: '/dashboard/scripts', label: 'Scripts' },
  { href: '/dashboard/tracker', label: 'Progress' },
]

export default function MobileSecondaryNav() {
  const pathname = usePathname()
  const active = TABS
    .filter(t => (t.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(t.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav className="mobile-secondary-nav" aria-label="Sections">
      <div className="msn-row">
        {TABS.map(tab => {
          const on = tab.href === active
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={on ? 'page' : undefined}
              style={{
                flexShrink: 0, textDecoration: 'none',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
                padding: '8px 15px', borderRadius: '100px', whiteSpace: 'nowrap',
                background: on ? 'var(--deep-teal)' : 'var(--cream)',
                color: on ? '#fff' : 'var(--ink-soft)',
                border: `1px solid ${on ? 'var(--deep-teal)' : 'var(--border)'}`,
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
      <style>{`
        .mobile-secondary-nav {
          position: sticky; top: 0; z-index: 40;
          background: rgba(255,255,255,0.96); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .msn-row {
          display: flex; gap: 7px; padding: 10px 16px;
          overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
        }
        .msn-row::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) { .mobile-secondary-nav { display: none; } }
      `}</style>
    </nav>
  )
}
