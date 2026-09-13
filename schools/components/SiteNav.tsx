'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PILOT_ENQUIRY } from '@/lib/links'

// ONE HEADER. The site had three: the home page's own, the philosophy page's
// single link, and this one on the rest, and this one showed Print room and
// The Hub to strangers, who bounced off /unlock (the schools review, 13
// September 2026). Now every page carries this bar, a stranger sees the four
// open doors plus the school code door and the pilot button, and a licensed
// school sees its two rooms in the same row. Nobody is signed in AS anyone:
// a school code is a door, not an identity, so there is no account menu.
//
// On a phone the links become one scrolling row of 44px targets under the
// brand, instead of wrapping onto two lines of 28px ones.
const OPEN = [
  { href: '/', label: 'Home' },
  { href: '/curriculum', label: 'Curriculum' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/pricing', label: 'Pricing' },
]
const LICENSED = [
  { href: '/print', label: 'Print room' },
  { href: '/hub', label: 'The Hub' },
]

export default function SiteNav({ licensed = false }: { licensed?: boolean }) {
  const pathname = usePathname()
  const links = licensed ? [OPEN[0], OPEN[1], ...LICENSED, OPEN[2], OPEN[3]] : OPEN
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  return (
    <nav className="no-print gc-nav" aria-label="Site">
      <div className="gc-nav-inner">
        <Link href="/" className="gc-nav-brand">
          ⭐ Guided Childhood <span>Schools</span>
        </Link>
        <div className="gc-nav-links">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="gc-nav-link" aria-current={isActive(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
          {!licensed && (
            <Link href="/unlock" className="gc-nav-link gc-nav-code-inline" aria-current={pathname.startsWith('/unlock') ? 'page' : undefined}>
              School code
            </Link>
          )}
        </div>
        <div className="gc-nav-side">
          {licensed ? (
            <span className="gc-nav-licensed">Licensed<span className="gc-nav-licensed-long"> school</span></span>
          ) : (
            <>
              <Link href="/unlock" className="gc-nav-code">I have a school code</Link>
              <a href={PILOT_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold gc-nav-pilot">Request a pilot</a>
            </>
          )}
        </div>
      </div>
      <style>{`
        .gc-nav {
          position: sticky; top: 0; z-index: 300;
          /* The links row bleeds into the side padding on a phone; clip the
             bleed so it never scrolls the page sideways. */
          overflow-x: clip;
          background: rgba(249, 248, 246, 0.86);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .gc-nav-inner {
          max-width: 1160px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px);
          min-height: 64px; display: grid; grid-template-columns: auto 1fr auto;
          align-items: center; column-gap: 18px;
        }
        .gc-nav-brand {
          font-family: var(--font-display); font-weight: 900; font-size: 16px;
          letter-spacing: -0.02em; color: var(--ink); text-decoration: none; white-space: nowrap;
        }
        .gc-nav-brand span { color: var(--terracotta-dark); }
        .gc-nav-links {
          display: flex; align-items: center; justify-content: center; gap: 2px;
          min-width: 0; overflow-x: auto; scrollbar-width: none;
        }
        .gc-nav-links::-webkit-scrollbar { display: none; }
        .gc-nav-link {
          display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px;
          font-family: var(--font-display); font-weight: 600; font-size: 15px;
          color: var(--ink-soft); text-decoration: none; white-space: nowrap;
          border-bottom: 2px solid transparent;
        }
        .gc-nav-link[aria-current="page"] { color: var(--ink); font-weight: 800; border-bottom-color: var(--terracotta); }
        .gc-nav-code-inline { display: none; }
        .gc-nav-side { display: flex; align-items: center; justify-content: end; gap: 6px; }
        .gc-nav-code {
          display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px;
          font-family: var(--font-display); font-weight: 700; font-size: 14px;
          color: var(--ink-soft); text-decoration: none; white-space: nowrap;
        }
        .gc-nav-code:hover { color: var(--ink); }
        .gc-nav-licensed {
          font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--stage-1-text); background: var(--stage-1);
          border: 1.5px solid var(--stage-1-bold); border-radius: 100px; padding: 6px 12px; white-space: nowrap;
        }
        .gc-nav-pilot { padding: 10px 18px !important; font-size: 14px !important; white-space: nowrap !important; }
        @media (max-width: 760px) {
          .gc-nav-inner { grid-template-columns: 1fr auto; min-height: 0; padding-top: 6px; }
          .gc-nav-brand { font-size: 15px; }
          .gc-nav-links {
            grid-column: 1 / -1; grid-row: 2; justify-content: flex-start;
            margin: 0 calc(-1 * clamp(16px, 4vw, 40px)); padding: 0 clamp(10px, 3vw, 34px);
          }
          .gc-nav-code { display: none; }
          .gc-nav-code-inline { display: inline-flex; }
          .gc-nav-licensed { font-size: 11px; padding: 5px 9px; }
          .gc-nav-licensed-long { display: none; }
          .gc-nav-pilot { padding: 8px 14px !important; font-size: 13px !important; }
        }
      `}</style>
    </nav>
  )
}
