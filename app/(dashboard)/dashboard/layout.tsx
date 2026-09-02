import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { paymentNeedsAttention } from '@/lib/access'
import NavTabs from '@/components/dashboard/NavTabs'
import NotificationsBell from '@/components/dashboard/NotificationsBell'
import MobileTabBar from '@/components/dashboard/MobileTabBar'
import OpenAtTheTop from '@/components/dashboard/OpenAtTheTop'
import RightNowButton from '@/components/rightnow/RightNowButton'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import AppBadge from '@/components/pwa/AppBadge'
import SetupNextBar from '@/components/setup/SetupNextBar'
import BackToToday from '@/components/home/BackToToday'
import ChildRail from '@/components/children/ChildRail'
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
  const [ticksRes, asksRes, profileRes, kidsRes] = user
    ? await Promise.all([
        supabase.from('quest_ticks').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('status', 'pending'),
        supabase.from('quest_requests').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('status', 'pending'),
        supabase.from('profiles').select('full_name, subscription_tier, subscription_status').eq('id', user.id).single(),
        // Every child, for the switcher rail below. In this wave rather than a
        // separate await for the same reason the profile is: the layout renders
        // on every navigation, so an extra round trip here is an extra round
        // trip everywhere.
        supabase.from('children').select('id, name, is_primary, age_band').eq('parent_id', user.id)
          .order('is_primary', { ascending: false }).order('created_at', { ascending: true }),
      ])
    : [{ count: 0 }, { count: 0 }, { data: null }, { data: [] }]
  const pendingAsks = (ticksRes.count ?? 0) + (asksRes.count ?? 0)
  const kids = ((kidsRes as { data: { id: string; name: string | null; is_primary: boolean | null; age_band: string | null }[] | null }).data) ?? []
  const profile = (profileRes as { data: { full_name: string | null; subscription_tier: string | null; subscription_status: string | null } | null }).data

  // A subscription that is mid retry is still a subscription, so it must not
  // wear an Upgrade chip. See lib/access.ts: past_due keeps everything while
  // Stripe works through its retries.
  const isPaid = profile?.subscription_status === 'active' || profile?.subscription_status === 'past_due'
  const cardBounced = paymentNeedsAttention(profile)

  return (
    <div className="gc-shell" style={{ minHeight: '100dvh', background: 'var(--app-bg)', display: 'flex', flexDirection: 'column' }}>
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
          <Suspense fallback={null}><NavTabs pendingAsks={pendingAsks ?? 0} /></Suspense>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <NotificationsBell />
            {/* ── SAY WHAT THE BUTTON DOES, AND WHAT THE LINK IS ───────────
                Justin, 13 August 2026: "tab top left has name but should say
                settings, next to Start subscription, which obviously if they
                pay changes to Manage subscription."

                Two small lies were being told up here. "Upgrade" is the word
                for moving between paid plans, and nobody here has one yet, so
                it read as an add on rather than as the way to start; and the
                one route to billing, the card, cancelling and signing out was
                labelled with the parent's own name, which names WHOSE account
                it is rather than what happens when you tap it.

                Both now say the thing they do, and the button swaps with the
                subscription rather than vanishing, so a member always has a
                way to their billing from any page. */}
            <Link
              href={isPaid ? '/dashboard/settings#billing' : '/dashboard/upgrade'}
              className={isPaid ? undefined : 'btn btn-gold'}
              style={isPaid
                ? { fontFamily: 'var(--font-mono)', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '.04em' }
                : {
                    // ── TIDIER, AND SMALLER THAN THE HOUSE BUTTON ──────────
                    // Justin, 18 August 2026: "start subscription button seems
                    // messy and a bit too big, please tidy."
                    // It was the full chunky button, 10 by 20 at body size with
                    // the 0 5px 0 shadow, sitting in a 64px header beside two
                    // quiet mono links. The house button is right where it is
                    // the thing you came to press; in a header it is furniture
                    // shouting. Smaller type, tighter padding, a flatter shadow
                    // and a pill radius, so it still reads as the one gold
                    // thing up there without overpowering the row it sits in.
                    padding: '8px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '.72rem',
                    fontWeight: 700,
                    letterSpacing: '.04em',
                    borderRadius: '100px',
                    boxShadow: '0 2px 0 var(--terracotta-dark)',
                    whiteSpace: 'nowrap',
                  }}
            >
              {isPaid ? 'Manage subscription' : 'Start subscription'}
            </Link>
            <Link href="/dashboard/settings" style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '.04em' }}>
              Settings
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
      {/* 88px of room at the foot for the NOW button; the tab bar itself is in
          flow now (sticky, see globals.css) so it carries its own height and
          the safe area inset. */}
      <main style={{ flex: 1, paddingBottom: '88px' }}>
        {/* The way back from a welcome card action, above the page it sent them
            to. One place for every destination. useSearchParams needs the
            boundary, and the bar is nothing until the param is there anyway. */}
        <Suspense fallback={null}><BackToToday /></Suspense>
        {/* THE CARD BOUNCED, and this is the only thing standing between a
            family and losing the app without ever being told.
            Justin, 11 August 2026: "so will this work if payment is not
            received even though they subscribed?"
            Nothing is taken away here. Stripe retries a failed charge for about
            three weeks and they keep everything throughout, so this is not a
            wall, it is the one warning before the retries run out and the
            subscription cancels itself. On every page, because the page a
            parent happens to open is not something we get to choose. */}
        {cardBounced && (
          <div style={{ padding: '12px 16px 0' }}>
            <div style={{
              maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center',
              gap: 12, flexWrap: 'wrap', background: 'var(--danger-bg)',
              border: '1.5px solid var(--danger-border)', borderRadius: 16, padding: '13px 16px',
            }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
                  Your last payment did not go through
                </div>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '3px 0 0' }}>
                  Nothing has changed yet and everything still works. Your bank is being asked again over the next few weeks, and updating the card now takes a minute and settles it.
                </p>
              </div>
              <Link
                href="/dashboard/settings#billing"
                style={{
                  flexShrink: 0, textDecoration: 'none', background: 'var(--terracotta)',
                  color: 'var(--ink)', borderRadius: 12, padding: '11px 16px',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                  boxShadow: '0 3px 0 var(--terracotta-dark)',
                }}
              >
                Update the card
              </Link>
            </div>
          </div>
        )}
        {/* The child switcher, once, for every per child page. It sits above
            the page rather than inside it so the choice survives a tap: pick
            Alma on Home, go to Lessons, and it is still Alma. useSearchParams
            needs the boundary, and the rail is nothing until the params are
            there anyway. */}
        <Suspense fallback={null}><ChildRail kids={kids} /></Suspense>
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

      {/* Both nav bars read ?child= so the chosen child survives a tap, and
          useSearchParams needs the boundary. */}
      <Suspense fallback={null}><MobileTabBar pendingAsks={pendingAsks ?? 0} /></Suspense>

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
