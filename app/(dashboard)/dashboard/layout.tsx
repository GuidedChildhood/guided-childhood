import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavTabs from '@/components/dashboard/NavTabs'
import MobileTabBar from '@/components/dashboard/MobileTabBar'
import RightNowButton from '@/components/rightnow/RightNowButton'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import AppBadge from '@/components/pwa/AppBadge'
import SetupNextBar from '@/components/setup/SetupNextBar'

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
          <NavTabs />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isPaid && (
              <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ padding: '10px 20px', fontSize: '13px' }}>
                Upgrade
              </Link>
            )}
            <Link href="/dashboard/settings" style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '.04em' }}>
              {profile?.full_name ?? 'Account'}
            </Link>
          </div>
        </div>
      </header>

      {/* One nav on mobile, not two: the scrollable top strip was removed so
          the bottom bar is the single place to move around. Every section
          reaches from Home or the bottom bar. */}

      {/* Main content */}
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {children}
      </main>

      {/* Install prompt: Android gets the real install event, iPhone gets
          the guided two taps (Apple allows no automatic prompt) */}
      <InstallPrompt />
      <AppBadge />

      {/* The guided rail: while setup is unfinished, a Next step bar walks the
          parent onward from any page that is not the step's own page. */}
      <SetupNextBar />

      {/* Mobile bottom tab bar: Home, Scripts, DiGi, Quests, Progress */}
      <MobileTabBar />

      {/* Help now: a floating action just above the tab bar on mobile (and the
          pill on desktop), so crisis words stay one tap away from any page. */}
      <RightNowButton variant="fab" />

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
        }
      `}</style>
    </div>
  )
}
