import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const NAV_TABS = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/dashboard/digi', label: 'DiGi', icon: '◎' },
  { href: '/dashboard/scripts', label: 'Scripts', icon: '◻' },
  { href: '/dashboard/tracker', label: 'Tracker', icon: '△' },
  { href: '/dashboard/upgrade', label: 'Upgrade', icon: '★' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, subscription_tier, subscription_status').eq('id', user.id).single()
    : { data: null }

  const isPaid = profile?.subscription_status === 'active'

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Desktop top nav */}
      <header style={{
        display: 'none',
        borderBottom: '1px solid var(--border)',
        background: 'var(--warm)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }} className="desktop-nav">
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '60px', gap: '32px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', textDecoration: 'none', flexShrink: 0 }}>
            Guided Childhood
          </Link>
          <nav style={{ display: 'flex', gap: '4px', flex: 1 }}>
            {NAV_TABS.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: 'var(--ink-muted)',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isPaid && (
              <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ padding: '10px 20px', fontSize: '12px' }}>
                Upgrade
              </Link>
            )}
            <Link href="/dashboard/settings" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              {profile?.full_name ?? 'Account'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="bottom-tab-bar">
        {NAV_TABS.map(tab => (
          <Link key={tab.href} href={tab.href} className="tab-item" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
        }
      `}</style>
    </div>
  )
}
