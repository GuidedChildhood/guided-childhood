import Link from 'next/link'
import { STAGES } from '@/lib/content/stages'

const STAGE_COLORS = {
  1: { bg: 'var(--green-lt)', text: 'var(--green-dark)', border: 'var(--green)' },
  2: { bg: 'var(--lav)', text: 'var(--lav-deep)', border: '#b8c8f0' },
  3: { bg: 'var(--coral-lt)', text: 'var(--coral)', border: 'var(--coral)' },
  4: { bg: 'var(--gold-lt)', text: 'var(--gold-dark)', border: 'var(--gold)' },
  5: { bg: 'var(--warm)', text: 'var(--ink-soft)', border: 'var(--border)' },
} as const

export default function HomePage() {
  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Nav */}
      <header style={{ padding: '0 24px', borderBottom: '1px solid var(--border)', background: 'var(--warm)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', textDecoration: 'none' }}>
            Guided Childhood
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/starter-pack" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Get started
            </Link>
            <Link href="/join" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Membership
            </Link>
            <Link href="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href="/starter-pack" className="btn btn-gold" style={{ padding: '10px 20px', fontSize: '12px' }}>
              Start free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px', textAlign: 'center', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '20px' }}>A digital parenting pathway</p>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Raise a child who is ready for the digital world
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--ink-soft)', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Five developmental stages. Conversation scripts for every difficult moment. DiGi, your AI advisor. The after-school TV fight, the bedtime battle, the algorithm conversation, the moment something goes wrong online. Everything a parent needs, at the right moment.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '16px 32px' }}>
              Find your child's stage
            </Link>
            <Link href="/join" className="btn btn-outline" style={{ fontSize: '15px', padding: '16px 32px' }}>
              See what is inside
            </Link>
          </div>
          <p style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-light)' }}>
            Free to start. No card required.
          </p>
        </div>
      </section>

      {/* Stage cards */}
      <section id="stages" style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--warm)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow" style={{ marginBottom: '10px' }}>The five stages</p>
            <h2 style={{ marginBottom: '12px' }}>A pathway from 4 to 16</h2>
            <p style={{ color: 'var(--ink-muted)', maxWidth: '500px', margin: '0 auto', fontSize: '16px' }}>
              Every stage has different risks, different conversations, and a different relationship with technology. The pathway meets your child where they are.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {STAGES.map(stage => {
              const color = STAGE_COLORS[stage.id as keyof typeof STAGE_COLORS]
              return (
                <div
                  key={stage.id}
                  style={{
                    background: color.bg,
                    border: `2px solid ${color.border}`,
                    borderRadius: '14px',
                    padding: '20px',
                    ...(stage.isCritical ? { borderLeftWidth: '5px' } : {}),
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color.text, background: color.bg, padding: '3px 8px', borderRadius: '100px', border: `1px solid ${color.border}` }}>
                      Stage {stage.id}
                    </span>
                    {stage.isCritical && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: 'var(--coral)', padding: '3px 8px', borderRadius: '100px' }}>
                        Critical Window
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', marginBottom: '2px' }}>
                    {stage.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: color.text, marginBottom: '4px' }}>
                    {stage.keyStage} · {stage.yearGroup}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '4px' }}>{stage.ages}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-light)', marginBottom: '14px' }}>{stage.usGrade}</div>
                  <p style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>{stage.focus}</p>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/starter-pack" className="btn btn-gold">
              Find your child's stage — it is free
            </Link>
          </div>
        </div>
      </section>

      {/* How it works (TRUST) */}
      <section id="how" style={{ padding: 'clamp(48px, 8vw, 80px) 24px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>The method</p>
          <h2 style={{ marginBottom: '12px' }}>The TRUST framework</h2>
          <p style={{ color: 'var(--ink-muted)', maxWidth: '480px', margin: '0 auto 40px', fontSize: '16px' }}>
            Five steps. A repeatable loop. Works from age 4 to 16, across every device and every difficult conversation.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { letter: 'T', word: 'Timing', desc: 'The right conversation at the right developmental moment' },
              { letter: 'R', word: 'Relationship', desc: 'Connection before compliance. Always.' },
              { letter: 'U', word: 'Understanding', desc: 'Know the platform before setting the rule' },
              { letter: 'S', word: 'Structure', desc: 'The bedroom rule, the family agreement, the routine' },
              { letter: 'T', word: 'Transition', desc: 'Graduation, not a cliff edge. Each stage prepares the next.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--green-dark)', marginBottom: '6px' }}>
                  {item.letter}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>{item.word}</div>
                <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DiGi callout */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--ink)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '16px' }}>Your AI advisor</p>
          <h2 style={{ color: '#fff', marginBottom: '16px', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            DiGi knows the research. DiGi knows your stage. DiGi is available at 11pm.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Not a generic chatbot. DiGi is trained on peer-reviewed research, speaks in plain language, and is specific to your child's stage. Every response ends with one concrete next step.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '16px 32px' }}>
            Try DiGi free — 3 messages a day
          </Link>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              'Never allow/deny',
              'Always a calibrated pathway',
              'Research-grounded',
              'Stage-specific',
            ].map((tag, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '100px', letterSpacing: '0.06em' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Schools */}
      <section id="teachers" style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'var(--green-lt)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <a id="schools" style={{ display: 'none' }} />
          <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '10px' }}>For schools</p>
          <h2 style={{ marginBottom: '16px' }}>The ban handles access. We handle readiness. Ofsted will ask about the second part.</h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '16px', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            21 modules, EYFS to Year 13. Oak National Academy format. Zero-prep slide decks, teacher notes, no login to browse. Every module pairs with a parent version sent home. Full statutory alignment for your DSL: KCSIE, RSHE, Online Safety Act, Ofcom.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/starter-pack" className="btn btn-green" style={{ fontSize: '14px' }}>
              Request a pilot for your school
            </Link>
          </div>
          <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-light)' }}>
            Free one-term pilot for selected schools. 48-hour response.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: 'clamp(48px, 8vw, 80px) 24px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>Pricing</p>
          <h2 style={{ marginBottom: '12px' }}>Free to start. Simple when you are ready.</h2>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '40px', fontSize: '16px' }}>30-day money-back guarantee on all paid plans.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', textAlign: 'left' }}>
            {[
              { name: 'Free', price: '£0', period: '', features: ['Stage card', '3 DiGi messages/day', '3 scripts', 'Stage 1 curriculum'], cta: 'Start free', href: '/starter-pack', style: {} },
              { name: 'Standard', price: '£12.99', period: '/month', features: ['All 5 stages', 'Unlimited DiGi', 'All 17 scripts', 'Wellbeing tracker', 'Family agreement'], cta: 'Start Standard', href: '/join', style: {} },
              { name: 'Annual', price: '£99', period: '/year', features: ['Everything Standard', 'Save £57 a year', '£8.25 / month effective'], cta: 'Best value', href: '/join', style: { borderColor: 'var(--green-dark)', borderWidth: '2px' } },
            ].map((plan, i) => (
              <div key={i} style={{ background: 'var(--warm)', border: `2px solid var(--border)`, borderRadius: '16px', padding: '24px', ...plan.style }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ marginBottom: '18px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem' }}>{plan.price}</span>
                  <span style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>{plan.period}</span>
                </div>
                <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--green-dark)', fontSize: '13px' }}>✓</span>
                      <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="btn btn-gold" style={{ display: 'flex', justifyContent: 'center', fontSize: '12px', padding: '12px' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', background: 'var(--warm)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', marginBottom: '6px' }}>Guided Childhood</div>
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', maxWidth: '280px', lineHeight: 1.6 }}>
              A digital parenting pathway for children aged 4 to 16. Founded by Justin Phillips, Bath UK.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>Platform</div>
              {[['Starter check', '/starter-pack'], ['Membership', '/join'], ['Schools', '/join'], ['Login', '/login']].map(([label, href]) => (
                <div key={href} style={{ marginBottom: '8px' }}>
                  <Link href={href} style={{ fontSize: '13px', color: 'var(--ink-soft)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>Company</div>
              {[['Privacy', '/privacy'], ['Terms', '/terms']].map(([label, href]) => (
                <div key={href} style={{ marginBottom: '8px' }}>
                  <Link href={href} style={{ fontSize: '13px', color: 'var(--ink-soft)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1080px', margin: '24px auto 0', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-light)' }}>
            Guided by research from Cambridge MRC, Oxford OII, LSE, and the US Surgeon General Advisory. This platform does not provide clinical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
