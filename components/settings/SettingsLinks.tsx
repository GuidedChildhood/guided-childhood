'use client'

import Link from 'next/link'

// The way out of Settings to the things Settings does not itself hold.
//
// Justin looked for the devices he had added and could not find them from here,
// which is fair: Settings held his profile, his children and his billing, and
// then stopped. Duolingo, Greenlight and GoHenry all do the same simple thing,
// a plain list of rows with a chevron, so Settings becomes the one place you go
// when you are not sure where something lives.
//
// Rows, not buttons. These go somewhere rather than doing something, and they
// should not compete with Save or with Delete my account for attention.

const LINKS = [
  {
    href: '/dashboard/devices',
    title: 'Devices and their settings',
    body: 'Every screen in the house, what is set up on each one, and the step by step guides.',
  },
  {
    href: '/dashboard/notifications',
    title: 'Notifications',
    body: 'Everything waiting on you, in one list.',
  },
  {
    href: '/dashboard/quests',
    title: 'Quests, stars and the child app',
    body: 'Jobs, what stars are worth, and the code your child signs in with.',
  },
]

export default function SettingsLinks() {
  return (
    <section style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--ink)' }}>Everything else</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none',
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px',
              padding: '14px 16px',
            }}
          >
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.25 }}>
                {l.title}
              </span>
              <span style={{ display: 'block', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '2px' }}>
                {l.body}
              </span>
            </span>
            <span aria-hidden style={{ fontSize: '18px', color: 'var(--ink-muted)', flexShrink: 0 }}>›</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
