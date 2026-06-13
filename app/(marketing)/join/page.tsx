import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { STAGES } from '@/lib/content/stages'

const STAGE_COLORS = {
  1: { bg: 'var(--green-lt)', text: 'var(--green-dark)', border: 'var(--green)' },
  2: { bg: 'var(--lav)', text: 'var(--lav-deep)', border: '#b8c8f0' },
  3: { bg: 'var(--coral-lt)', text: 'var(--coral)', border: 'var(--coral)' },
  4: { bg: 'var(--gold-lt)', text: 'var(--gold-dark)', border: 'var(--gold)' },
  5: { bg: 'var(--warm)', text: 'var(--ink-soft)', border: 'var(--border)' },
} as const

async function getFounderData() {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_founder', true)
      .eq('subscription_status', 'active')
    return { taken: count ?? 0, available: (count ?? 0) < 50 }
  } catch {
    return { taken: 0, available: true }
  }
}

export default async function JoinPage() {
  const { taken, available } = await getFounderData()
  const remaining = 50 - taken

  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Nav */}
      <header style={{ padding: '0 24px', borderBottom: '1px solid var(--border)', background: 'var(--warm)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', textDecoration: 'none' }}>
            Guided Childhood
          </Link>
          <Link href="/starter-pack" className="btn btn-gold" style={{ padding: '10px 20px', fontSize: '12px' }}>
            Start free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px', textAlign: 'center', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '20px' }}>A digital parenting membership</p>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '20px', letterSpacing: '-0.03em' }}>
            Raise a child who is ready for the digital world
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ink-soft)', maxWidth: '540px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Not a ban. Not more screen time rules. A pathway, from age 4 to 16, with the conversations, tools and AI advisor to navigate every stage.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '16px', padding: '18px 40px' }}>
            Find your child's stage — it is free
          </Link>
          <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-light)' }}>
            Three questions. No account needed. Your pathway is waiting.
          </p>
        </div>
      </section>

      {/* Guarantee */}
      <div style={{ background: 'var(--green-lt)', borderTop: '1px solid var(--green)', borderBottom: '1px solid var(--green)', padding: '16px 24px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--green-dark)', letterSpacing: '0.08em' }}>
          30-DAY MONEY-BACK GUARANTEE ON ALL PAID PLANS · CANCEL ANYTIME · NO LOCK-IN
        </span>
      </div>

      {/* Stage cards with parent quotes */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--warm)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow" style={{ marginBottom: '10px' }}>Five stages</p>
            <h2>The pathway meets your child where they are</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
            {STAGES.map(stage => {
              const color = STAGE_COLORS[stage.id as keyof typeof STAGE_COLORS]
              return (
                <div key={stage.id} style={{ background: color.bg, border: `2px solid ${color.border}`, borderRadius: '16px', padding: '22px', ...(stage.isCritical ? { borderLeftWidth: '5px' } : {}) }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color.text, background: 'rgba(255,255,255,0.5)', padding: '3px 8px', borderRadius: '100px' }}>
                      Stage {stage.id} · {stage.name}
                    </span>
                    {stage.isCritical && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: 'var(--coral)', padding: '3px 8px', borderRadius: '100px' }}>
                        Critical Window
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', marginBottom: '2px' }}>{stage.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: color.text, marginBottom: '4px' }}>{stage.keyStage} · {stage.yearGroup}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '12px' }}>{stage.ages}</div>
                  <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: '14px', fontStyle: 'italic' }}>{stage.focus}</p>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', fontSize: '12px', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {stage.parentQuote}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/starter-pack" className="btn btn-gold">
              Find my child's stage
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST framework */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>The method</p>
          <h2 style={{ marginBottom: '12px' }}>The TRUST framework</h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Research-backed. Tested with parents. A repeatable loop from age 4 to 16.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            {[
              { letter: 'T', word: 'Timing', desc: 'Right conversation, right moment' },
              { letter: 'R', word: 'Relationship', desc: 'Connection before compliance' },
              { letter: 'U', word: 'Understanding', desc: 'Know the platform first' },
              { letter: 'S', word: 'Structure', desc: 'Bedroom rule, family agreement' },
              { letter: 'T', word: 'Transition', desc: 'Graduation, not a cliff edge' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '24px 16px', borderRight: i < 4 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--green-dark)', marginBottom: '8px' }}>{item.letter}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>{item.word}</div>
                <p style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Justin story */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--green-lt)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '16px' }}>Why I built this</p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: 'var(--ink)', fontWeight: 700, lineHeight: 1.5, marginBottom: '24px', fontStyle: 'italic' }}>
            "I spent ten years researching the impact of digital technology on young people. The research was clear. The guidance for parents was not."
          </blockquote>
          <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '16px' }}>
            Every parent I spoke to was worried. Not because they were doing something wrong. Because the guidance they were given was either too alarmist to be useful, or too vague to act on.
          </p>
          <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '24px' }}>
            Guided Childhood is the platform I wanted to hand them. Staged by age. Specific to the challenge. A DiGi advisor that speaks plainly and ends every response with a concrete next step.
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--green-dark)' }}>
            Justin Phillips, Founder · Bath, UK
          </p>
          <Link href="/starter-pack" className="btn btn-green" style={{ marginTop: '24px', display: 'inline-flex' }}>
            Start your child's pathway
          </Link>
        </div>
      </section>

      {/* Expert bench */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--warm)' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>The research bench</p>
          <h2 style={{ marginBottom: '12px' }}>Grounded in peer-reviewed research</h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            DiGi is trained on the same evidence base as the UK Surgeon General Advisory and Ofcom's media literacy framework. No opinions. Just the science.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { name: 'Prof. Candace Odgers', institution: 'UC Irvine / Duke', note: 'Effects depend on vulnerability, not hours' },
              { name: 'Dr Amy Orben', institution: 'Cambridge MRC', note: 'The 11-13 developmental window' },
              { name: 'Prof. Andrew Przybylski', institution: 'Oxford OII', note: 'The Goldilocks effect — moderate use' },
              { name: 'Prof. Sonia Livingstone', institution: 'LSE', note: 'Children need skills and agency, not just rules' },
            ].map((expert, i) => (
              <div key={i} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{expert.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green-dark)', letterSpacing: '0.06em', marginBottom: '8px' }}>{expert.institution}</div>
                <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, fontStyle: 'italic' }}>{expert.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is inside */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow" style={{ marginBottom: '10px' }}>What is inside</p>
            <h2>Everything you need. At the right moment.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {[
              { icon: '◎', title: 'DiGi AI advisor', desc: 'Stage-specific. Research-grounded. Available any time. Never allow/deny. Always a calibrated pathway.' },
              { icon: '◻', title: '17 conversation scripts', desc: 'Say this, not this, and why it works. For every stage and every difficult moment.' },
              { icon: '△', title: 'Weekly wellbeing tracker', desc: 'Five questions, once a week. Over time, patterns emerge. DiGi responds to what you find.' },
              { icon: '⌂', title: 'Five developmental stages', desc: 'Age 4 to 16. Each stage has different risks, different conversations, and a different device recommendation.' },
              { icon: '◈', title: 'Family agreement builder', desc: 'A document your whole family creates together. Agreed, not imposed. Reviewed each term.' },
              { icon: '◉', title: 'Stage curriculum', desc: 'Units 1 to 4 per stage. Practical, parent-led. Covers devices, social media, gaming, AI, and wellbeing.' },
            ].map((feature, i) => (
              <div key={i} style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--green-dark)' }}>{feature.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{feature.title}</div>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcome narrative */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--ink)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '16px' }}>How this shows up in your home</p>
          <h2 style={{ color: '#fff', marginBottom: '40px', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>Three moments. Each one real.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { time: 'Tonight', desc: 'The bedroom rule is in place. Devices sleep in the kitchen. Everyone sleeps better.' },
              { time: 'This term', desc: 'You have had the algorithm conversation. They come to you when something weird shows up. The door is open.' },
              { time: 'At 16', desc: 'A young person who knows how algorithms work, what their digital footprint says about them, and how to get help when something goes wrong online.' },
            ].map((moment, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '22px', textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>{moment.time}</div>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{moment.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--warm)' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ marginBottom: '10px' }}>What parents say</p>
            <h2>From parents who started where you are</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {[
              { quote: 'The bedroom rule conversation took three minutes. I had been putting it off for months. The script made it feel possible.', name: 'Sarah', stage: 'Stage 2 parent' },
              { quote: 'Her mood was dropping every Sunday. DiGi was the first thing that helped me understand why and what to actually do about it.', name: 'Emma', stage: 'Stage 3 parent' },
              { quote: 'I was ready to just ban TikTok. The algorithm conversation changed everything. He actually thanks me for it now.', name: 'Mark', stage: 'Stage 3 parent' },
              { quote: 'Five minutes a week on the tracker. Sounds small. Has changed how I see what is happening with my daughter completely.', name: 'Laura', stage: 'Stage 4 parent' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px' }}>
                <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '16px' }}>
                  "{t.quote}"
                </p>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px' }}>{t.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', marginTop: '2px' }}>{t.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not too late */}
      <section style={{ padding: 'clamp(40px, 6vw, 64px) 24px', background: 'var(--gold-lt)', borderTop: '1px solid var(--gold)', borderBottom: '1px solid var(--gold)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>It is not too late</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
            The phone is already there. The accounts already exist. You are not starting from zero — you are starting from now. Every stage has a next step. The algorithm conversation is just as important after the phone as before it.
          </p>
          <Link href="/starter-pack" className="btn btn-gold">
            Find your starting point
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>Membership</p>
          <h2 style={{ marginBottom: '8px' }}>Simple pricing. Start free.</h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px', marginBottom: '40px' }}>30-day money-back guarantee on all paid plans. Cancel any time.</p>

          {/* Founder rate */}
          {available && (
            <div style={{ background: 'var(--ink)', borderRadius: '20px', padding: '32px', marginBottom: '20px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 20px', borderRadius: '0 20px 0 14px' }}>
                {remaining} of 50 places remain
              </div>
              <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '12px' }}>Founder rate — first 50 members</p>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '3rem', color: '#fff' }}>£7.99</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}> / month</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', marginTop: '4px' }}>
                  Locked for life. Never increases.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                {[
                  'All 5 stages, for life',
                  'Unlimited DiGi conversations',
                  'All 17 conversation scripts',
                  'Wellbeing tracker',
                  'Family agreement builder',
                  'Monthly live Pathway Sessions',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--gold)' }}>✓</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/starter-pack" className="btn btn-gold" style={{ display: 'flex', justifyContent: 'center', fontSize: '15px', padding: '16px' }}>
                Start with the starter check — then claim your place
              </Link>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Standard */}
            <div style={{ background: 'var(--warm)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', textAlign: 'left' }}>
              <p className="eyebrow" style={{ marginBottom: '10px' }}>Standard</p>
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem' }}>£12.99</span>
                <span style={{ color: 'var(--ink-muted)', fontSize: '13px' }}> / month</span>
              </div>
              <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['All 5 stages', 'Unlimited DiGi', 'All 17 scripts', 'Wellbeing tracker', 'Cancel any time'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--green-dark)', fontSize: '13px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/starter-pack" className="btn btn-ink" style={{ display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
                Start Standard
              </Link>
            </div>

            {/* Annual */}
            <div style={{ background: 'var(--warm)', border: '2px solid var(--green-dark)', borderRadius: '20px', padding: '24px', textAlign: 'left', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--green-dark)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                Save £57
              </div>
              <p className="eyebrow" style={{ marginBottom: '10px', marginTop: '6px' }}>Annual</p>
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem' }}>£99</span>
                <span style={{ color: 'var(--ink-muted)', fontSize: '13px' }}> / year</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green-dark)', marginTop: '4px' }}>£8.25 / month</div>
              </div>
              <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Everything Standard', 'One payment, full year', 'Best value'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--green-dark)', fontSize: '13px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/starter-pack" className="btn btn-green" style={{ display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
                Start Annual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--warm)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ marginBottom: '10px' }}>Questions</p>
            <h2>Things parents ask before they start</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { q: 'Is this about banning phones or social media?', a: 'No. This is a pathway, not a ban. The research is clear that restriction without education produces children who are less capable, not more protected. Guided Childhood prepares your child for the digital world, at the right pace for their stage.' },
              { q: 'How fast does it work?', a: 'Some parents notice a difference in the first week, usually after having one conversation using a script that lands differently than they expected. The tracker starts showing patterns after four to six weeks.' },
              { q: 'What if my partner is not on board?', a: 'Start yourself. The scripts and DiGi give you the language to have the conversation at home first. Sharing your dashboard on any device is straightforward.' },
              { q: 'Is it too late if my child already has a phone and social media?', a: 'No. The algorithm conversation is just as important after the accounts exist as before. Stage 3 and 4 parents often see the fastest change because there is a specific, immediate thing to address.' },
              { q: 'How much time does it take each week?', a: 'Five minutes a day is realistic. Weekly actions, a quick DiGi question, the tracker once a week. The pathway moves even on the weeks when life is too busy to look at it.' },
            ].map((faq, i) => (
              <div key={i} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 22px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>{faq.q}</div>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px', textAlign: 'center', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '16px' }}>Your starting point is three questions away</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '16px' }}>
            Find your child's stage. Free.
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px', marginBottom: '28px', lineHeight: 1.7 }}>
            Age, main challenge, how you are feeling. Three questions. Your personalised pathway is waiting on the other side.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '16px', padding: '18px 40px' }}>
            Start the check — it is free
          </Link>
          <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-light)' }}>
            No account needed. No card. Your pathway is yours from the first question.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', background: 'var(--warm)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', textDecoration: 'none' }}>
            Guided Childhood
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Sign in', '/login']].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
