'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// THE THREE ROOMS OF FRENCH, ONE TAP APART (10 November 2026).
//
// The only way between the units, the print room and the coverage grid was
// the breadcrumb, which goes up but never across. A teacher on a lesson page
// who wants the sheets should not have to climb to the top and come back
// down. So every French page carries this one control, the same three
// choices in the same place: a segmented control, because these are three
// views of one scheme rather than three places to go.
//
// The teach view covers the whole screen and does not show it.

const ROOMS = [
  { href: '/languages/fr', label: 'Units' },
  { href: '/languages/fr/print', label: 'Print room' },
  { href: '/languages/fr/coverage', label: 'Coverage' },
]

export default function FrenchNav() {
  const pathname = usePathname()
  const active = (href: string) =>
    href === '/languages/fr'
      ? !pathname.startsWith('/languages/fr/print') && !pathname.startsWith('/languages/fr/coverage')
      : pathname.startsWith(href)
  return (
    <nav aria-label="French" className="no-print gc-fr-rooms">
      <span className="gc-fr-rooms-name">French</span>
      <div className="gc-fr-rooms-track">
        {ROOMS.map(r => (
          <Link key={r.href} href={r.href} className="gc-fr-room" aria-current={active(r.href) ? 'page' : undefined}>
            {r.label}
          </Link>
        ))}
      </div>
      <style>{`
        .gc-fr-rooms {
          max-width: 1040px; margin: 0 auto var(--space-4);
          display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); flex-wrap: wrap;
        }
        .gc-fr-rooms-name {
          font-family: var(--font-display); font-weight: 900; font-size: var(--text-lg); color: var(--ink);
        }
        .gc-fr-rooms-track {
          display: inline-flex; padding: var(--space-1); gap: var(--space-1);
          background: var(--warm); border: 1px solid var(--border); border-radius: var(--radius-btn);
        }
        .gc-fr-room {
          display: inline-flex; align-items: center; min-height: 40px; padding: 0 var(--space-3);
          font-family: var(--font-display); font-weight: 700; font-size: var(--text-sm);
          color: var(--ink-soft); text-decoration: none; white-space: nowrap;
          border-radius: var(--radius-tile);
          transition: background-color .18s ease, color .18s ease, box-shadow .18s ease;
        }
        .gc-fr-room:hover { color: var(--ink); }
        .gc-fr-room[aria-current="page"] {
          background: var(--white); color: var(--ink); font-weight: 800;
          box-shadow: 0 1px 2px rgba(23,60,70,0.08), 0 4px 12px -6px rgba(23,60,70,0.25);
        }
        .gc-fr-room:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        @media (max-width: 640px) {
          .gc-fr-rooms-name { display: none; }
          .gc-fr-rooms-track { width: 100%; }
          .gc-fr-room { flex: 1 1 0; justify-content: center; min-height: 44px; padding: 0 var(--space-2); }
        }
        @media (prefers-reduced-motion: reduce) { .gc-fr-room { transition: none; } }
      `}</style>
    </nav>
  )
}
