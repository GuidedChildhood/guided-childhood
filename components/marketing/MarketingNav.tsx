'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// Log in lives in the header actions, not here, so it is always visible
// even when this section nav collapses to the menu button on mobile.
const LINKS = [
  { label: 'How It Works', href: '#how-it-works', section: 'how-it-works' },
  { label: 'Find Your Stage', href: '#stages', section: 'stages' },
  { label: 'About', href: '#about', section: 'about' },
  { label: 'FAQs', href: '#faqs', section: 'faqs' },
  { label: 'For Schools', href: 'https://www.guidedchildhood.com/schools', section: null },
  { label: 'Pricing', href: '#pricing', section: 'pricing' },
]

// Marketing header nav in the same segmented pill language as the
// dashboard: soft pill container, white wash on hover, and the section
// currently in view fills the espresso pill so the nav doubles as a
// scroll position indicator. Under 721px the pills give way to a menu
// button opening a dropdown sheet, so the tabs exist on phones too.
export default function MarketingNav() {
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

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
    <>
      <nav className="nav-links-desktop" aria-label="Page sections">
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

      <button
        type="button"
        className="nav-burger"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>

      {open && (
        <nav className="nav-sheet" aria-label="Page sections">
          {LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
