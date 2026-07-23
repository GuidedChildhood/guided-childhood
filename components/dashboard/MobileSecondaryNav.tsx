'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

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
  { href: '/dashboard/tracker', label: 'Passport' },
]

export default function MobileSecondaryNav() {
  const pathname = usePathname()
  const rowRef = useRef<HTMLDivElement>(null)
  const active = TABS
    .filter(t => (t.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(t.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  // Bring the current tab into view so the strip never opens on a half cut
  // tab that reads as broken. Centres the active tab in the scroller.
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const el = row.querySelector('[aria-current="page"]') as HTMLElement | null
    if (el) row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2, behavior: 'auto' })
  }, [active])

  return (
    <nav className="mobile-secondary-nav" aria-label="Sections">
      <div className="msn-row" ref={rowRef}>
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
        /* Right edge fade: signals the strip scrolls, so a partly shown last
           tab reads as more to come, not as a clipped layout. */
        .mobile-secondary-nav::after {
          content: ''; position: absolute; top: 0; right: 0; bottom: 1px;
          width: 30px; pointer-events: none;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.96));
        }
        .msn-row {
          display: flex; gap: 7px; padding: 10px 16px;
          overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
        }
        .msn-row > a { scroll-snap-align: start; }
        .msn-row::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) { .mobile-secondary-nav { display: none; } }
      `}</style>
    </nav>
  )
}
