import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PlanChooser from '@/components/upgrade/PlanChooser'
import WhatYouAreBuying from '@/components/upgrade/WhatYouAreBuying'
import { hasPaidPlan } from '@/lib/access'
import { getPrintable } from '@/lib/printables/registry'

// What a parent calls the page they were heading for. Only the ones somebody
// actually gets bounced off, in their words rather than the route's: nobody
// taps "tracker" thinking "/dashboard/tracker".
const PAGE_NAMES: Record<string, string> = {
  '/dashboard/scripts': 'The scripts',
  '/dashboard/digi': 'DiGi',
  '/dashboard/lessons': 'The lessons',
  '/dashboard/pathway': 'The pathway',
  '/dashboard/printables': 'The printables',
  '/dashboard/quests': 'The quest board',
  '/dashboard/tracker': 'The wellbeing tracker',
  '/dashboard/agreement': 'The family agreement',
  '/dashboard/daily': 'Your day',
  '/dashboard/moments': 'The moments',
  '/dashboard/learning': 'What school is doing',
  '/dashboard/homework': 'The homework helper',
  '/dashboard/insights': 'Your insights',
  '/dashboard/keepsakes': 'The keepsakes',
  '/dashboard/week': 'Your week',
  '/dashboard': 'Your home page',
}

/** The friendliest name for a path, matching the longest prefix that fits. */
function pageNameFor(path: string | undefined): string | null {
  if (!path || !path.startsWith('/dashboard')) return null
  const hit = Object.keys(PAGE_NAMES)
    .filter(k => path === k || path.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0]
  return hit ? PAGE_NAMES[hit] : null
}

async function getFounderCount(): Promise<number> {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_founder', true)
      .eq('subscription_status', 'active')
    return count ?? 0
  } catch {
    return 0
  }
}

export default async function UpgradePage(
  { searchParams }: { searchParams: Promise<{ sheet?: string; from?: string }> },
) {
  // Which sheet sent them here, when a Print button did. The printables route
  // redirects a signed in parent without access to this page rather than
  // answering a whole browser tab with raw JSON, and it names the sheet so the
  // wall says what they were reaching for instead of being generic.
  const { sheet, from } = await searchParams
  const wantedSheet = sheet ? getPrintable(sheet)?.title ?? null : null
  // And which PAGE sent them, when the paywall in the middleware did. Same
  // reasoning as the sheet above: a parent bounced here off a tap knows what
  // they were reaching for, and a wall that cannot name it reads as the app
  // having lost their place rather than as a price.
  const wantedPage = pageNameFor(from)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier, is_founder, trial_ends_at')
    .eq('id', user.id)
    .single()

  // Already unlocked (subscriber, live trial, or the founder). The old
  // silent redirect home made every Unlock link feel broken: you tapped
  // upgrade and just landed on Home with no explanation. Say it instead.
  // hasPaidPlan, NOT hasFullAccess. See lib/access.ts for the full argument:
  // hasFullAccess is true throughout the free days, so asking it here made this
  // page refuse to sell to every parent in their trial, which is the only
  // window where the founder offer has any urgency.
  if (hasPaidPlan(profile)) {
    return (
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.6rem', marginBottom: '14px' }}>🎉</div>
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '10px' }}>Nothing to unlock</p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '12px' }}>
          You already have everything.
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '28px' }}>
          Your account has full access: every stage, unlimited DiGi, every script, rehearsals, the tracker and the agreement builder. If a button sent you here, it was checking, and the answer is yes.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" className="btn btn-gold" style={{ padding: '14px 24px', fontSize: 'var(--text-md)' }}>
            Back to home
          </Link>
          <Link
            href="/dashboard/settings"
            style={{
              display: 'inline-flex', alignItems: 'center', padding: '14px 24px',
              background: '#fff', color: 'var(--ink)', borderRadius: '16px', textDecoration: 'none',
              border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            }}
          >
            Manage my plan
          </Link>
        </div>
      </div>
    )
  }

  const founderCount = await getFounderCount()
  const founderAvailable = founderCount < 50
  const founderRemaining = 50 - founderCount

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ marginBottom: '8px', color: 'var(--terracotta)' }}>Guided Childhood</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '12px' }}>
          Unlock the full pathway
        </h1>
        {wantedSheet && (
          <p style={{
            display: 'inline-block', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '14px', padding: '10px 16px', margin: '0 0 14px',
            fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, fontWeight: 600,
          }}>
            🖨️ {wantedSheet} is a member sheet. Unlock below and it prints straight away.
          </p>
        )}
        {/* Named, and only when there is a name for it. A generic "you need to
            upgrade" makes a parent work out what they lost. */}
        {!wantedSheet && wantedPage && (
          <p style={{
            display: 'inline-block', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '14px', padding: '10px 16px', margin: '0 0 14px',
            fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, fontWeight: 600,
          }}>
            {wantedPage} is part of the membership. Unlock below and you land straight back on it.
          </p>
        )}
        <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-lg)', maxWidth: '440px', margin: '0 auto' }}>
          All five stages, unlimited DiGi, 100 plus expert scripts grounded in the research, the wellbeing tracker, and the family agreement builder.
        </p>
      </div>

      {/* One subscription, every child: the family framing the best family
          apps lead with. */}
      <div style={{ background: 'var(--tint-sage)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
          One subscription covers every child, at every stage from 4 to 16.
        </span>
      </div>

      <WhatYouAreBuying />

      {/* Pricing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>

        {/* Founder rate, the hero while spots remain */}
        {founderAvailable && (
          <div style={{
            background: 'var(--deep-teal)',
            borderRadius: '22px',
            padding: '28px 24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 34px rgba(46,40,24,0.28)',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              background: 'var(--terracotta)', color: 'var(--ink)',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '6px 16px', borderRadius: '0 22px 0 14px',
            }}>
              {founderRemaining} of 50 left
            </div>

            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '10px' }}>Founder rate</p>
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.6rem', color: '#fff', letterSpacing: '-0.03em' }}>£7.99</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-md)' }}> / month</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta)', marginTop: '4px' }}>
                Locked for life, never increases
              </div>
            </div>
            <ul style={{ margin: '0 0 22px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                'Everything in the platform, for life at this rate',
                // The loop itself, named in the list rather than only in the
                // block above, because a parent skimming the ticks should see
                // the one thing they cannot get anywhere else.
                'Screen time they earn with jobs, reading and time outside',
                'All 5 stages as your child grows',
                'Unlimited DiGi conversations',
                '100 plus expert scripts',
                'Wellbeing tracker and the family agreement builder',
                'Monthly live Pathway Session with Justin (from member 50)',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--terracotta)', fontSize: 'var(--text-md)', marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
            <form action="/api/stripe/checkout" method="POST">
              <input type="hidden" name="tier" value="founder" />
              <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-md)', padding: '16px' }}>
                Claim founder rate, £7.99 a month
              </button>
            </form>
          </div>
        )}

        {/* Standard plans with the yearly and monthly toggle */}
        <PlanChooser heading={founderAvailable ? 'Or the standard rate' : 'Choose your plan'} />
      </div>

      {/* Fear remover: full access now, cancel any time, money back. The
          same job the trial timeline does on the best paywalls, in our
          money back model. */}
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '20px 22px', marginBottom: '32px', boxShadow: '0 4px 22px rgba(26,26,46,0.05)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
          No risk, here is exactly how it works
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: '🔓', t: 'Today', d: 'Full access to everything the moment you join. Every stage, unlimited DiGi, every script.' },
            { icon: '✋', t: 'Any time', d: 'Cancel in a tap from Settings. No calls, no forms, no guilt.' },
            { icon: '↩', t: 'First 30 days', d: 'Not for you? Email us and we refund every penny, no questions asked.' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{
                width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
                background: 'var(--tint-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-md)',
              }}>{s.icon}</span>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{s.t}</span>
                <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '1px' }}>{s.d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: '20px', textAlign: 'center' }}>Common questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              q: 'Is this a ban on devices?',
              a: 'No. This is a pathway. The research is clear that restriction without education creates children who are less capable, not more protected. We prepare your child for the digital world, at the right pace for their age.',
            },
            {
              q: 'How much time does it take?',
              a: 'Five minutes a day is the goal. Weekly actions, a quick DiGi conversation, and the tracker once a week. The platform moves even when you are busy.',
            },
            {
              q: 'What if my partner is not on board?',
              a: 'Start yourself. The scripts and DiGi give you the language. Often one good conversation opens the door. You can share access on any device.',
            },
            {
              q: 'Is it too late if my child already has a phone?',
              a: 'No. The algorithm conversation is just as important after the phone as before it. Stage 3 and 4 parents are often the ones who see the fastest change.',
            },
          ].map((faq, i) => (
            <div key={i} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', marginBottom: '8px' }}>{faq.q}</div>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none' }}>
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
