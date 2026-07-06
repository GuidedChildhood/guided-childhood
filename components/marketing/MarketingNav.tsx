'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Find Your Stage', href: '#stages', section: 'stages' },
  { label: 'How It Works', href: '#how-it-works', section: 'how-it-works' },
  { label: 'For Schools', href: '/schools', section: null },
  { label: 'Pricing', href: '#pricing', section: 'pricing' },
  { label: 'Log in', href: '/login', section: null },
]

// Marketing header nav in the same segmented pill language as the
// dashboard: soft pill container, white wash on hover, and the section
// currently in view fills the espresso pill so the nav doubles as a
// scroll position indicator.
export default function MarketingNav() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const ids = LINKS.map(l => l.section).filter(Boolean) as string[]
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="nav-links-desktop" style={{ display: 'flex', gap: '2px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '3px' }}>
      {LINKS.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`nav-pill${link.section && active === link.section ? ' nav-pill-active' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
