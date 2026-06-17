import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The DiGi Squad | Guided Childhood',
  description: 'Meet Teo, Olga and Alam. Three kids on a mission to help every child navigate the digital world with confidence, smarts, and safety.',
}

const SQUAD = [
  {
    name: 'Teo',
    age: 'Age 8',
    role: 'Screen Time Captain',
    power: 'Knows exactly when to play and when to stop. Teaches kids how to be the boss of the screen, not the other way around.',
    color: 'var(--coral)',
    colorLight: 'var(--coral-lt)',
    colorDark: '#C0392B',
    kit: 'Orange football kit · Number 10',
    lessons: [
      'Why your brain wants more screen time even when you are tired',
      'The 20 minute wind-down trick that actually works',
      'How to make a screen routine your whole family agrees on',
      'What to do when you REALLY want to keep playing',
    ],
    stage: 'Stage 2 to 3 · Ages 7 to 11',
    emoji: '⚽',
  },
  {
    name: 'Olga',
    age: 'Age 9',
    role: 'Online Smarts',
    power: 'Spots the tricks, the fakes and the traps before anyone else. Teaches kids to think before they tap.',
    color: 'var(--gold-dark)',
    colorLight: 'var(--gold-lt)',
    colorDark: '#A07820',
    kit: 'Orange and yellow stripes · Blue dungarees',
    lessons: [
      'How to tell if something online is real or made up',
      'What a stranger online actually looks like',
      'Why passwords matter and how to make a great one',
      'What to do if something makes you feel weird online',
    ],
    stage: 'Stage 2 to 4 · Ages 8 to 13',
    emoji: '🔍',
  },
  {
    name: 'Alam',
    age: 'Age 6',
    role: 'Privacy Guardian',
    power: 'Keeps the whole squad safe. Teaches kids what information is theirs to keep and what to never share.',
    color: 'var(--green-dark)',
    colorLight: 'var(--green-lt)',
    colorDark: '#1E5C3F',
    kit: 'Pink tutu · Orange cape',
    lessons: [
      'Your five pieces of private information that stay private always',
      'Why photos can share more than you think',
      'Who it is actually OK to talk to online',
      'What to do if someone asks for your personal information',
    ],
    stage: 'Stage 1 to 2 · Ages 4 to 9',
    emoji: '🛡️',
  },
]

const DIGI_ANIMALS = [
  { name: 'DiGi', animal: 'Owl', role: 'Team guide', color: '#2E7D5A', stage: 'All stages' },
  { name: 'Hog', animal: 'Hedgehog', role: 'Stage 1', color: '#5C8A5A', stage: 'Ages 0 to 3' },
  { name: 'Robin', animal: 'Robin', role: 'Stage 2', color: '#C0392B', stage: 'Ages 4 to 6' },
  { name: 'Scout', animal: 'Red Squirrel', role: 'Stage 3', color: '#8B4513', stage: 'Ages 7 to 9' },
  { name: 'Brock', animal: 'Badger', role: 'Stage 4', color: '#4A4A4A', stage: 'Ages 10 to 12' },
  { name: 'Vix', animal: 'Fox', role: 'Stage 5', color: '#D4600A', stage: 'Ages 13 to 16' },
]

export default function DigiSquadPage() {
  return (
    <div style={{ background: 'var(--cream)' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em', textDecoration: 'none' }}>Guided Childhood</Link>
        <nav className="nav-links-desktop" style={{ gap: '2px' }}>
          {[['For parents', '/'], ['For schools', '/schools'], ['The squad', '/digi-squad']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 500, color: 'var(--ink-soft)', padding: '6px 13px', borderRadius: '100px', textDecoration: 'none' }}>{label}</Link>
          ))}
        </nav>
        <Link href="/starter-pack" className="btn btn-green" style={{ padding: '9px 22px', fontSize: '.78rem' }}>
          Get started free
        </Link>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0d2b1a 0%, #1a4a2e 60%, #0f3320 100%)', padding: 'clamp(64px, 9vw, 112px) 24px clamp(56px, 8vw, 96px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(242,201,76,.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(175,220,162,.05)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(175,220,162,.15)', border: '1px solid rgba(175,220,162,.3)', borderRadius: '100px', padding: '5px 14px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '24px' }}>
            ⚽ Meet the team
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.08, marginBottom: '20px' }}>
            The DiGi Squad
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.65, maxWidth: '560px', margin: '0 auto 16px' }}>
            Three kids on a mission. Teo, Olga and Alam teach children everything they need to be safe, smart and in control online.
          </p>
          <p style={{ color: 'rgba(255,255,255,.45)', fontFamily: 'var(--font-mono)', fontSize: '.78rem', letterSpacing: '.06em', marginBottom: '40px' }}>
            Guided by DiGi the owl · Powered by real research · Built for ages 4 to 16
          </p>

          {/* Squad preview strip */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {SQUAD.map((s) => (
              <div key={s.name} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '16px', padding: '20px 24px', minWidth: '180px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{s.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>{s.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginTop: '4px' }}>{s.role}</div>
              </div>
            ))}
          </div>

          <Link href="/starter-pack" className="btn btn-gold">
            Join the squad for free
          </Link>
        </div>
      </section>

      {/* Squad members */}
      {SQUAD.map((s, i) => (
        <section key={s.name} className="section-lg" style={{ background: i % 2 === 0 ? 'var(--cream)' : 'var(--warm)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="two-col" style={{ gap: '64px' }}>

              {/* Character card */}
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ background: s.colorLight, border: `2px solid ${s.color}`, borderRadius: '20px', padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `${s.color}15`, pointerEvents: 'none' }} />
                  <div style={{ fontSize: '5rem', marginBottom: '16px', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.15))' }}>{s.emoji}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: s.color, marginBottom: '8px' }}>{s.stage}</div>
                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '4px', color: s.colorDark }}>{s.name}</h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.78rem', fontWeight: 600, color: s.color, marginBottom: '16px' }}>{s.role}</div>
                  <div style={{ background: 'rgba(255,255,255,.7)', borderRadius: '10px', padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: s.colorDark, letterSpacing: '.05em' }}>
                    {s.kit}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <p className="eyebrow" style={{ marginBottom: '12px' }}>Meet {s.name} · {s.age}</p>
                <h2 style={{ marginBottom: '16px' }}>{s.role}</h2>
                <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>{s.power}</p>

                <div style={{ marginBottom: '32px' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
                    Lessons with {s.name}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {s.lessons.map((lesson, li) => (
                      <div key={li} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: s.colorLight, border: `1.5px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontWeight: 800, fontSize: '.68rem', flexShrink: 0, marginTop: '2px' }}>
                          {li + 1}
                        </span>
                        <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6, margin: 0 }}>{lesson}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/starter-pack" className="btn btn-ink" style={{ fontSize: '.78rem', padding: '12px 24px' }}>
                  Start with {s.name}
                </Link>
              </div>

            </div>
          </div>
        </section>
      ))}

      {/* DiGi animal guides */}
      <section className="section-lg" style={{ background: 'var(--ink)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ color: 'var(--green)', marginBottom: '12px' }}>The animal guides</p>
            <h2 style={{ color: '#fff', marginBottom: '16px' }}>Every stage has its own guide</h2>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
              DiGi the owl coaches the whole squad. Each developmental stage also has its own UK animal guide, chosen for the personality traits that match that age.
            </p>
          </div>
          <div className="three-col" style={{ gap: '12px', maxWidth: '840px', margin: '0 auto' }}>
            {DIGI_ANIMALS.map((a) => (
              <div key={a.name} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: `0 4px 16px ${a.color}55` }}>
                  <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>{a.name[0]}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '.95rem', marginBottom: '4px' }}>{a.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'rgba(255,255,255,.5)', marginBottom: '6px' }}>{a.animal}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>{a.stage}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works for kids */}
      <section className="section-lg" style={{ background: 'var(--warm)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ marginBottom: '12px' }}>How it works</p>
            <h2>Designed for kids. Guided by parents.</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '540px', margin: '16px auto 0', lineHeight: 1.65 }}>
              Short animated lessons with Teo, Olga and Alam. Each one takes under five minutes and comes with a family conversation starter so parents and children learn together.
            </p>
          </div>
          <div className="three-col">
            {[
              { step: '01', title: 'Watch together', desc: 'A short animated lesson with a squad character. Warm, funny, never preachy. Kids aged 5 upwards can follow it without help.', color: 'var(--green-dark)', bg: 'var(--green-lt)' },
              { step: '02', title: 'Talk about it', desc: 'Each lesson ends with one question to ask at dinner or bedtime. Parents do not need to know the answer. The conversation is the point.', color: 'var(--lav-deep)', bg: 'var(--lav)' },
              { step: '03', title: 'Do the mission', desc: 'A simple one-thing challenge for the week. Teo teaches kids to put the phone face-down at meals. Olga teaches them to think before they share.', color: 'var(--gold-dark)', bg: 'var(--gold-lt)' },
            ].map((item) => (
              <div key={item.step} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', borderTop: `4px solid ${item.color}` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: item.color, marginBottom: '12px', background: item.bg, display: 'inline-block', padding: '4px 10px', borderRadius: '100px' }}>
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
                After every squad lesson, DiGi sends you a one-paragraph summary of what was covered, why it matters at your child&rsquo;s exact stage, and what to say tonight.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '32px' }}>
                You do not need to have watched the lesson. DiGi bridges the gap so the learning does not stop when the screen turns off.
              </p>
              <Link href="/starter-pack" className="btn btn-gold">
                Get the free starter pack
              </Link>
            </div>

            <div className="digi-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div className="digi-avatar">D</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>DiGi</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--green-dark)' }}>After Teo&rsquo;s lesson today</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div className="digi-avatar-sm">D</div>
                  <div className="bubble-digi">
                    Teo taught the kids why their brain keeps wanting more screen time even when they are tired. The word he used: &ldquo;the dopamine loop.&rdquo; Your child now knows that phrase.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div className="digi-avatar-sm">D</div>
                  <div className="bubble-digi">
                    Tonight you could ask: &ldquo;What did Teo say about why it is hard to stop?&rdquo; Just that. Let them explain it back to you.
                  </div>
                </div>
                <div style={{ background: 'var(--green-lt)', border: '1px solid #D3ECD9', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: '8px' }}>Why this matters · Stage 3 · Ages 9 to 11</div>
                  <p style={{ fontSize: '.82rem', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                    Children who can name what is happening in their brain are significantly better at self-regulating. Teo makes that naming feel like football tactics, not a lecture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'var(--green-dark)', padding: 'clamp(64px, 9vw, 104px) 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ color: 'var(--green)', marginBottom: '16px' }}>The DiGi Squad</p>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>
            Teo, Olga and Alam are waiting.<br />First lesson is free.
          </h2>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.65 }}>
            Get your child&rsquo;s stage, their squad character, and the first lesson free with the starter pack. No account required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/starter-pack" className="btn btn-gold">
              Get the free starter pack
            </Link>
            <Link href="/join" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
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
