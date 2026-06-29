import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const NAV_TABS = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/dashboard/digi', label: 'DiGi', icon: '◎' },
  { href: '/dashboard/moments', label: 'Moments', icon: '✦' },
  { href: '/dashboard/scripts', label: 'Scripts', icon: '◻' },
  { href: '/dashboard/tracker', label: 'Tracker', icon: '△' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, subscription_tier, subscription_status').eq('id', user.id).single()
    : { data: null }

  const isPaid = profile?.subscription_status === 'active'

  return (
    <div style={{ minHeight: '100dvh', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      {/* Desktop top nav */}
      <header style={{
        display: 'none',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,.96)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }} className="desktop-nav">
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '64px', gap: '32px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '34px', height: '34px', background: 'var(--terracotta)', borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 0 var(--terracotta-dark)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '16px' }}>
                {[5, 9, 14, 8].map((h, i) => (
                  <div key={i} style={{ width: '3px', height: `${h}px`, background: '#fff', borderRadius: '1.5px' }} />
                ))}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-.03em' }}>
              Guided Childhood
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: '4px', flex: 1 }}>
            {NAV_TABS.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: '7px 14px',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '.84rem',
                  fontWeight: 600,
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  transition: 'color .15s, background .15s',
                }}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isPaid && (
              <Link href="/dashboard/upgrade" className="btn" style={{ padding: '10px 20px', fontSize: '13px' }}>
                Upgrade
              </Link>
            )}
            <Link href="/dashboard/settings" style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '.04em' }}>
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
