import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

      {/* Guarantee */}
      <div style={{ background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '14px', padding: '14px 18px', marginBottom: '28px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta)', letterSpacing: '0.08em' }}>
          30-DAY MONEY-BACK GUARANTEE · NO QUESTIONS ASKED
        </span>
      </div>

      {/* Pricing cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>

        {/* Founder rate */}
        {founderAvailable && (
          <div style={{
            background: 'var(--deep-teal)',
            borderRadius: '20px',
            padding: '28px 24px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: 'var(--gold)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: '0 20px 0 14px',
            }}>
              {founderRemaining} of 50 left
            </div>

            <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '10px' }}>Founder rate</p>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: '#fff' }}>£7.99</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}> / month</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', marginTop: '4px' }}>
                Locked for life, never increases
              </div>
            </div>
            <ul style={{ margin: '0 0 22px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Everything in the platform, for life at this rate',
                'All 5 stages as your child grows',
                'Unlimited DiGi conversations',
                '100 plus expert scripts',
                'Wellbeing tracker with trend chart',
                'Family agreement builder',
                'Monthly live Pathway Session with Justin (starts at member 50)',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '14px' }}>✓</span>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{item}</span>
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

        {/* Standard monthly */}
        <div style={{ background: 'var(--cream)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>Standard</p>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)' }}>£12.99</span>
            <span style={{ color: 'var(--ink-muted)', fontSize: '14px' }}> / month</span>
          </div>
          <ul style={{ margin: '0 0 22px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'All 5 stages',
              'Unlimited DiGi',
              '100 plus expert scripts',
              'Wellbeing tracker',
              'Family agreement builder',
              'Cancel any time',
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--terracotta)', fontSize: '14px' }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{item}</span>
              </li>
            ))}
          </ul>
          <form action="/api/stripe/checkout" method="POST">
            <input type="hidden" name="tier" value="standard" />
            <button type="submit" className="btn btn-ink" style={{ width: '100%', justifyContent: 'center' }}>
              Start standard, £12.99 a month
            </button>
          </form>
        </div>

        {/* Annual */}
        <div style={{ background: 'var(--cream)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--terracotta)',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '5px 16px',
            borderRadius: '100px',
            whiteSpace: 'nowrap',
          }}>
            Save £57 a year
          </div>
          <p className="eyebrow" style={{ marginBottom: '10px', marginTop: '4px' }}>Annual</p>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)' }}>£99</span>
            <span style={{ color: 'var(--ink-muted)', fontSize: '14px' }}> / year</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta)', marginTop: '4px' }}>
              Equivalent to £8.25 / month
            </div>
          </div>
          <ul style={{ margin: '0 0 22px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Everything in Standard', 'One payment, full year', 'Best value'].map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--terracotta)', fontSize: '14px' }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{item}</span>
              </li>
            ))}
          </ul>
          <form action="/api/stripe/checkout" method="POST">
            <input type="hidden" name="tier" value="annual" />
            <button type="submit" className="btn btn-green" style={{ width: '100%', justifyContent: 'center' }}>
              Start annual, £99 a year
            </button>
          </form>
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
