import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PlanChooser from '@/components/upgrade/PlanChooser'

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

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier, is_founder')
    .eq('id', user.id)
    .single()

  if (profile?.subscription_status === 'active') {
    redirect('/dashboard')
  }

  const founderCount = await getFounderCount()
  const founderAvailable = founderCount < 50
  const founderRemaining = 50 - founderCount

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ marginBottom: '8px', color: 'var(--terracotta)' }}>Guided Childhood</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '12px' }}>
          Unlock the full pathway
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '16px', maxWidth: '440px', margin: '0 auto' }}>
          All five stages, unlimited DiGi, 100 plus expert scripts grounded in the research, the wellbeing tracker, and the family agreement builder.
        </p>
      </div>

      {/* One subscription, every child: the family framing the best family
          apps lead with. */}
      <div style={{ background: 'var(--tint-sage)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
          One subscription covers every child, at every stage from 4 to 16.
        </span>
      </div>

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
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '6px 16px', borderRadius: '0 22px 0 14px',
            }}>
              {founderRemaining} of 50 left
            </div>

            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '10px' }}>Founder rate</p>
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.6rem', color: '#fff', letterSpacing: '-0.03em' }}>£7.99</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}> / month</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta)', marginTop: '4px' }}>
                Locked for life, never increases
              </div>
            </div>
            <ul style={{ margin: '0 0 22px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                'Everything in the platform, for life at this rate',
                'All 5 stages as your child grows',
                'Unlimited DiGi conversations',
                '100 plus expert scripts',
                'Wellbeing tracker and the family agreement builder',
                'Monthly live Pathway Session with Justin (from member 50)',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--terracotta)', fontSize: '14px', marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
            <form action="/api/stripe/checkout" method="POST">
              <input type="hidden" name="tier" value="founder" />
              <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '16px' }}>
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
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
                background: 'var(--tint-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
              }}>{s.icon}</span>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>{s.t}</span>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '1px' }}>{s.d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', textAlign: 'center' }}>Common questions</h2>
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
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{faq.q}</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
