'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// The educator top bar: one consistent way around the whole workspace.
// Hidden when printing so the paper packs stay clean.

const LINKS = [
  { href: '/educator', label: 'Home' },
  { href: '/educator/curriculum', label: 'Curriculum' },
  { href: '/educator/print', label: 'Print room' },
  { href: '/educator/reports', label: 'Reports' },
  { href: '/educator/hub', label: 'The Hub' },
]

export default function EducatorNav({ schoolName }: { schoolName?: string }) {
  const pathname = usePathname()

  return (
    <>
      <style>{`@media print { .educator-nav { display: none !important; } }`}</style>
      <nav className="educator-nav" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--cream)', borderBottom: '1.5px solid var(--border)',
        padding: '10px 20px',
      }}>
        <div style={{
          maxWidth: '980px', margin: '0 auto', display: 'flex',
          alignItems: 'center', gap: '6px', flexWrap: 'wrap',
        }}>
          <Link href="/educator" style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px',
            color: 'var(--ink)', textDecoration: 'none', marginRight: '10px',
          }}>
            ⭐ Guided Childhood <span style={{ fontWeight: 700, color: 'var(--green-dark)' }}>Schools</span>
          </Link>
          {LINKS.map(l => {
            const active = l.href === '/educator' ? pathname === '/educator' : pathname.startsWith(l.href)
            return (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                color: active ? 'var(--ink)' : 'var(--ink-muted)',
                background: active ? 'var(--gold)' : 'transparent',
                boxShadow: active ? '0 3px 0 var(--gold-hover)' : 'none',
                borderRadius: '12px', padding: '7px 14px', textDecoration: 'none',
              }}>
                {l.label}
              </Link>
            )
          })}
          <Link href="/educator/settings" style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
          }}>
            {schoolName && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
                {schoolName}
              </span>
            )}
            <span style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: pathname.startsWith('/educator/settings') ? 'var(--gold)' : 'var(--warm)',
              border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }} aria-label="Settings">⚙️</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
