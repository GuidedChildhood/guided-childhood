import Link from 'next/link'
import type { Metadata } from 'next'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

export const metadata: Metadata = {
  title: 'DiGi and the Planet Friends | Guided Childhood',
  description: 'Meet DiGi and the Planet Friends. DiGi the star guides every child, and a new Planet Friend grows up alongside them at each stage from 4 to 16.',
}

// The star DiGi guides the whole way. Each stage unlocks one Planet Friend who
// grows up with the child. This is the parents app cast, the same DiGi and the
// same Pebble, Bloop, Orbit, Nova and Cosmo the child meets inside the app, so
// the marketing web and the product never show a family two different casts.
const FRIENDS = STAGE_CHARACTERS

const STEPS = [
  { step: '01', title: 'Meet your Friend', desc: 'DiGi introduces the Planet Friend for your child’s stage. Warm, funny, never preachy. A child of five and up can follow it without help.', bg: 'var(--stage-2)' },
  { step: '02', title: 'Learn together', desc: 'Each short lesson ends with one question to ask at dinner or bedtime. You do not need to know the answer. The conversation is the whole point.', bg: 'var(--stage-4)' },
  { step: '03', title: 'Earn the next one', desc: 'Jobs done, lessons learned and calm screen offs earn stars and stamps. Reach the next stage and a new Planet Friend joins the team.', bg: 'var(--stage-5)' },
]

export default function DigiSquadPage() {
  return (
    <div style={{ background: 'var(--cream)' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em', textDecoration: 'none' }}>Guided Childhood</Link>
        <nav className="nav-links-desktop" style={{ gap: '2px' }}>
          {[['For parents', '/'], ['For schools', '/schools'], ['The Friends', '/digi-squad']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 500, color: 'var(--ink-soft)', padding: '6px 13px', borderRadius: '100px', textDecoration: 'none' }}>{label}</Link>
          ))}
        </nav>
        <Link href="/starter-pack" className="btn btn-green" style={{ padding: '9px 22px', fontSize: '.78rem' }}>
          Get started free
        </Link>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0d2b1a 0%, #1a4a2e 60%, #0f3320 100%)', padding: 'clamp(64px, 9vw, 112px) 24px clamp(56px, 8vw, 96px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '18%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(242,201,76,.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(175,220,162,.05)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <img src="/digi-squad/DiGi-star.svg" alt="DiGi" width={92} height={92} style={{ margin: '0 auto 20px', display: 'block', animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(242,201,76,.14)', border: '1px solid rgba(242,201,76,.3)', borderRadius: '100px', padding: '5px 14px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>
            Meet the team
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.08, marginBottom: '20px' }}>
            DiGi and the Planet Friends
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.65, maxWidth: '580px', margin: '0 auto 16px' }}>
            DiGi the star guides every child. A new Planet Friend grows up alongside them at each stage, so no child ever walks the digital world alone.
          </p>
          <p style={{ color: 'rgba(255,255,255,.45)', fontFamily: 'var(--font-mono)', fontSize: '.78rem', letterSpacing: '.06em', marginBottom: '40px' }}>
            Five Friends · Powered by real research · Built for ages 4 to 16
          </p>

          {/* Friends preview strip */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {FRIENDS.map((f) => (
              <div key={f.key} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '16px', padding: '16px 18px', minWidth: '132px', textAlign: 'center' }}>
                <img src={f.img} alt={f.name} width={64} height={64} style={{ borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px', display: 'block', border: `2px solid ${f.colour}` }} />
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{f.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginTop: '4px' }}>{f.ages}</div>
              </div>
            ))}
          </div>

          <Link href="/starter-pack" className="btn btn-gold">
            Meet your first Friend free
          </Link>
        </div>
      </section>

      {/* Friends, one section each, alternating */}
      {FRIENDS.map((f, i) => (
        <section key={f.key} className="section-lg" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="two-col" style={{ gap: '64px' }}>

              {/* Character card */}
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ background: `${f.colour}12`, border: `2px solid ${f.colour}`, borderRadius: '20px', padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `${f.colour}18`, pointerEvents: 'none' }} />
                  <img src={f.img} alt={f.name} width={168} height={168} style={{ borderRadius: '50%', objectFit: 'cover', margin: '0 auto 18px', display: 'block', border: `3px solid ${f.colour}`, boxShadow: '0 8px 24px rgba(0,0,0,.12)' }} />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: f.colour, marginBottom: '8px' }}>Stage {f.stageId} · {f.ages}</div>
                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', marginBottom: '4px', color: 'var(--ink)' }}>{f.name}</h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.78rem', fontWeight: 600, color: f.colour }}>{f.action}</div>
                </div>
              </div>

              {/* Content */}
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <p className="eyebrow" style={{ marginBottom: '12px' }}>Meet {f.name} · {f.ages}</p>
                <h2 style={{ marginBottom: '16px' }}>{f.blurb}</h2>
                <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>
                  {f.name} is the Planet Friend for {f.role}. Earn {f.name} on the way to Stage {f.stageId}, and DiGi and {f.name} take that part of the journey together.
                </p>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px', marginBottom: '28px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>{f.name} says</div>
                  <p style={{ color: 'var(--ink)', fontSize: '.98rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{f.intro}</p>
                </div>
                <Link href="/starter-pack" className="btn btn-ink" style={{ fontSize: '.78rem', padding: '12px 24px' }}>
                  Start with {f.name}
                </Link>
              </div>

            </div>
          </div>
        </section>
      ))}

      {/* DiGi the guide */}
      <section className="section-lg" style={{ background: 'var(--deep-teal)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="/digi-squad/DiGi-star.svg" alt="DiGi" width={72} height={72} style={{ margin: '0 auto 16px', display: 'block' }} />
            <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '12px' }}>The guide</p>
            <h2 style={{ color: '#fff', marginBottom: '16px' }}>DiGi is with your child the whole way</h2>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.65 }}>
              DiGi the star never changes as your child grows. DiGi introduces each Planet Friend, explains what your child just learned, and always answers with a calm next step for their exact age, never a flat yes or no.
            </p>
          </div>
        </div>
      </section>

      {/* How it works for kids */}
      <section className="section-lg" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ marginBottom: '12px' }}>How it works</p>
            <h2>Designed for kids. Guided by parents.</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '540px', margin: '16px auto 0', lineHeight: 1.65 }}>
              Short lessons with DiGi and the Planet Friends. Each one takes under five minutes and comes with a family conversation starter, so parents and children learn together.
            </p>
          </div>
          <div className="three-col">
            {STEPS.map((item) => (
              <div key={item.step} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', borderTop: '4px solid var(--gold-dark)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '12px', background: item.bg, display: 'inline-block', padding: '4px 10px', borderRadius: '100px' }}>
                  Step {item.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DiGi chat preview */}
      <section className="section-lg">
        <div className="container">
          <div className="two-col" style={{ gap: '64px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>For parents</p>
              <h2 style={{ marginBottom: '20px' }}>DiGi explains what your child just learned</h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '16px' }}>
                After every lesson, DiGi sends you a one paragraph summary of what was covered, why it matters at your child&rsquo;s exact stage, and what to say tonight.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '32px' }}>
                You do not need to have watched the lesson. DiGi bridges the gap, so the learning does not stop when the screen turns off.
              </p>
              <Link href="/starter-pack" className="btn btn-gold">
                Start my pathway free
              </Link>
            </div>

            <div className="digi-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <img src="/digi-squad/DiGi-star.svg" alt="DiGi" width={40} height={40} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>DiGi</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>After today&rsquo;s lesson with Bloop</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <img src="/digi-squad/DiGi-star.svg" alt="" width={26} height={26} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div className="bubble-digi">
                    Bloop helped your child see why their brain keeps wanting more screen time even when they are tired. The words they used: &ldquo;the wanting feeling.&rdquo; Your child now has a name for it.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <img src="/digi-squad/DiGi-star.svg" alt="" width={26} height={26} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div className="bubble-digi">
                    Tonight you could ask: &ldquo;What did Bloop say about why it is hard to stop?&rdquo; Just that. Let them explain it back to you.
                  </div>
                </div>
                <div style={{ background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '8px' }}>Why this matters · Stage 2 · Ages 8 to 10</div>
                  <p style={{ fontSize: '.82rem', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                    Children who can name what is happening in their brain are far better at steadying themselves. Bloop makes that naming feel like a game, not a lecture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'var(--gold-dark)', padding: 'clamp(64px, 9vw, 104px) 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ color: '#fff', opacity: .8, marginBottom: '16px' }}>DiGi and the Planet Friends</p>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>
            DiGi and Pebble are waiting.<br />First lesson is free.
          </h2>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.65 }}>
            Get your child&rsquo;s stage, their first Planet Friend, and the first lesson free with the starter pack. No account required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/starter-pack" className="btn btn-ink">
              Start my pathway free
            </Link>
            <Link href="/join" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.45)' }}>
              Full membership
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--ink)', textDecoration: 'none' }}>Guided Childhood</Link>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[['Home', '/'], ['For schools', '/schools'], ['Join', '/join'], ['Ban workarounds', '/ban-workarounds']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'var(--ink-muted)', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--ink-light)', margin: 0 }}>&copy; 2026 Guided Childhood</p>
      </footer>

    </div>
  )
}
