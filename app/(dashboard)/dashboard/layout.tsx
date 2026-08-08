import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavTabs from '@/components/dashboard/NavTabs'
import NotificationsBell from '@/components/dashboard/NotificationsBell'
import MobileTabBar from '@/components/dashboard/MobileTabBar'
import OpenAtTheTop from '@/components/dashboard/OpenAtTheTop'
import RightNowButton from '@/components/rightnow/RightNowButton'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import AppBadge from '@/components/pwa/AppBadge'
import SetupNextBar from '@/components/setup/SetupNextBar'
import BackToToday from '@/components/home/BackToToday'
import { Suspense } from 'react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Everything actually waiting on the parent, as ONE number.
  //
  // Justin: "on quest it says 1 in red on home page, click on it and you get
  // red 6 on jobs, but when you click jobs nothing there to match the 6."
  //
  // Three red circles, three different things, and nothing said so:
  //
  //   this badge   quest_requests pending   a child PITCHING a new job
  //   the tile     quest_ticks pending      a child saying they DID one
  //   the page     neither, because it filtered to one child
  //
  // So a parent followed a red 1 about a pitch, met a red 6 about approvals,
  // and landed on a form. Every hop was a different question, drawn in the same
  // notification red, which teaches a parent that the numbers mean nothing.
  //
  // A badge is a promise that something needs you. Both of these do, and both
  // are answered on the same "Waiting for you" tab, so they are one count. The
  // tile reads the same union (board-status), so the numbers now agree wherever
  // a parent looks.
  // The profile rides in the same wave: this layout renders on every page,
  // so a separate await here was one extra database round trip on every
  // single navigation.
  const [ticksRes, asksRes, profileRes] = user
    ? await Promise.all([
        supabase.from('quest_ticks').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('status', 'pending'),
        supabase.from('quest_requests').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('status', 'pending'),
        supabase.from('profiles').select('full_name, subscription_tier, subscription_status').eq('id', user.id).single(),
      ])
    : [{ count: 0 }, { count: 0 }, { data: null }]
  const pendingAsks = (ticksRes.count ?? 0) + (asksRes.count ?? 0)
  const profile = (profileRes as { data: { full_name: string | null; subscription_tier: string | null; subscription_status: string | null } | null }).data

  const isPaid = profile?.subscription_status === 'active'

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', display: 'flex', flexDirection: 'column' }}>
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
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', letterSpacing: '-.03em' }}>
              Guided Childhood
            </span>
          </Link>
          <NavTabs pendingAsks={pendingAsks ?? 0} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <NotificationsBell />
            {!isPaid && (
              <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ padding: '10px 20px', fontSize: 'var(--text-base)' }}>
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
      {/* Clear the fixed bottom bar and the phone's own home indicator, so the
          last card on a page is never tucked under the tabs. */}
      <main style={{ flex: 1, paddingBottom: 'calc(88px + env(safe-area-inset-bottom))' }}>
        {/* The way back from a welcome card action, above the page it sent them
            to. One place for every destination. useSearchParams needs the
            boundary, and the bar is nothing until the param is there anyway. */}
        <Suspense fallback={null}><BackToToday /></Suspense>
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
      {/* Reopening the app lands at the top, not halfway down where it was
          left. Here rather than on each page so every dashboard route gets it. */}
      <OpenAtTheTop />

      <MobileTabBar pendingAsks={pendingAsks ?? 0} />

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
