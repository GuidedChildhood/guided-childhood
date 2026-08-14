'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// The public nav: the whole product is an open catalogue, so the nav is
// four doors and no account button. Print hidden, like the educator nav
// it replaces.
const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/curriculum', label: 'Curriculum' },
  { href: '/print', label: 'Print room' },
  { href: '/hub', label: 'The Hub' },
  { href: '/pricing', label: 'Pricing' },
]

export default function SiteNav() {
  const pathname = usePathname()
  return (
    <nav
      className="no-print"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(249, 248, 246, 0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '18px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.01em', marginRight: 'auto' }}>
          Guided Childhood <span style={{ color: 'var(--terracotta-dark)' }}>Schools</span>
        </Link>
        {LINKS.map(l => {
          const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-display)', fontWeight: active ? 800 : 600,
                fontSize: '13.5px', textDecoration: 'none',
                color: active ? 'var(--ink)' : 'var(--ink-soft)',
                borderBottom: active ? '2px solid var(--terracotta)' : '2px solid transparent',
                paddingBottom: '2px',
              }}
            >
              {l.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
