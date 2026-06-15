import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Digital Health Check | Guided Childhood',
  description: 'Five minutes. No signup. Find out where the gaps are in your child\'s digital life and get a personalised starting point from Guided Childhood.',
}

const AREAS = [
  { label: 'Screen routines', desc: 'TV, bedtime, mealtimes, morning', color: 'var(--coral-lt)', text: 'var(--coral)' },
  { label: 'Gaming', desc: 'Time, meltdowns, online gaming safety', color: 'var(--lav)', text: 'var(--lav-deep)' },
  { label: 'Sleep', desc: 'Devices in the bedroom, late-night use', color: 'var(--green-lt)', text: 'var(--green-dark)' },
  { label: 'Mood and wellbeing', desc: 'Mood after screens, anxiety, withdrawal', color: 'var(--gold-lt)', text: 'var(--gold-dark)' },
  { label: 'Social media', desc: 'Platforms, accounts you know about, social comparison', color: 'var(--coral-lt)', text: 'var(--coral)' },
  { label: 'Digital literacy', desc: 'Algorithms, privacy, misinformation, AI', color: 'var(--lav)', text: 'var(--lav-deep)' },
]

export default function DigitalWellbeingPage() {
  return (
    <div style={{ background: 'var(--cream)' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)', textDecoration: 'none' }}>Guided Childhood</Link>
        <Link href="/starter-pack" style={{ background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 700, padding: '9px 22px', borderRadius: '100px', textDecoration: 'none', boxShadow: '0 3px 0 var(--gold-hover)' }}>
          Get Started
        </Link>
      </header>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', textAlign: 'center', background: 'var(--gold-lt)', borderBottom: '1px solid rgba(242,201,76,0.35)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--gold-dark)', marginBottom: '14px' }}>Free · 5 minutes · No signup needed</p>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-.04em', color: 'var(--ink)', marginBottom: '20px' }}>
            The Digital Health Check
          </h1>
          <p style={{ fontSize: 'clamp(.92rem, 1.5vw, 1.1rem)', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 28px' }}>
            Answer questions about what's happening at home. TV routines, gaming, sleep, mood, social media, digital literacy. You'll get a personalised read of where the gaps are and exactly where to start.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '16px 32px' }}>
            Take the free health check →
          </Link>
          <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--ink-muted)' }}>No account needed. No email required. Results instantly.</p>
        </div>
      </section>

      {/* What it covers */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--gold-dark)', marginBottom: '12px' }}>Six areas</p>
            <h2 style={{ marginBottom: '12px' }}>What the check covers</h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}>Most parents are surprised. The issues they knew about are rarely the ones that need the most attention.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {AREAS.map((area, i) => (
              <div key={i} style={{ background: area.color, borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: area.text, marginBottom: '8px' }}>{area.label}</div>
                <p style={{ fontSize: '.83rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>What you get</p>
            <h2>Your personalised result</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { num: '01', title: 'Your child\'s stage', body: 'Which of the five stages your child is at, and what that means for which conversations matter most right now.' },
              { num: '02', title: 'Your top three priorities', body: 'The three areas where the research says action will have the most impact at your child\'s age and stage.' },
              { num: '03', title: 'One thing to do tonight', body: 'A single concrete action, based on your answers, that you can take tonight. Not a plan. One thing.' },
              { num: '04', title: 'Your starting point in Guided Childhood', body: 'If you want to go further, you\'ll know exactly where to start in the platform and what your first week looks like.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px 28px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--gold-lt)', lineHeight: 1, flexShrink: 0 }}>{item.num}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '.85rem', color: 'var(--ink-soft)', lineHeight: 1.72 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research note */}
      <section style={{ padding: '40px 32px', background: 'var(--green-lt)', borderTop: '1px solid #D3ECD9', borderBottom: '1px solid #D3ECD9' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.78 }}>
            The Digital Health Check is grounded in findings from Odgers and Jensen (2020), Orben and Przybylski (2019), and Scott et al. (2019). It does not provide clinical advice or diagnosis. If you are concerned about your child's mental health, please contact your GP or CAMHS.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', textAlign: 'center', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '14px' }}>Find out where you are. It takes 5 minutes.</h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.78, marginBottom: '24px' }}>Free. No signup. No email. Results immediately.</p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '16px 32px' }}>
            Take the free check →
          </Link>
          <p style={{ marginTop: '16px', fontSize: '.8rem', color: 'var(--ink-muted)' }}>Or <Link href="/" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'underline' }}>explore Guided Childhood</Link> first.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#FDFBF8', borderTop: '1px solid var(--border)', padding: '28px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '.86rem', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>← Guided Childhood</Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--ink-light)' }}>© 2026 The Social Billboard · Justin Phillips</p>
        </div>
      </footer>
    </div>
  )
}
