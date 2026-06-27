import Link from 'next/link'
import AnnouncementBar from '@/components/marketing/AnnouncementBar'
import FaqAccordion from '@/components/marketing/FaqAccordion'

const STAGES = [
  {
    num: '01', name: 'Foundation', ks: 'EYFS and KS1', ages: 'Ages 4 to 7',
    device: 'Shared screen', deviceBg: 'var(--stage-1)', deviceColor: 'var(--terracotta)',
    tags: ['TV routines', 'Co-viewing', 'No solo device'],
    quote: '"I can\'t get my four-year-old off the iPad. What am I doing wrong?"',
    accent: 'var(--stage-1)', accentDark: 'var(--terracotta)',
  },
  {
    num: '02', name: 'First Steps', ks: 'KS2 · Yr 3 to 5', ages: 'Ages 8 to 10',
    device: 'Restricted phone', deviceBg: 'var(--stage-3)', deviceColor: 'var(--terracotta)',
    tags: ['After-school TV', 'Gaming time', 'Boredom'],
    quote: '"The moment he walks in from school it\'s TV or gaming. I can\'t break the cycle."',
    accent: 'var(--stage-3)', accentDark: 'var(--terracotta)',
  },
  {
    num: '03', name: 'Explorer', ks: 'KS2/KS3 · Yr 6 to 8', ages: 'Ages 11 to 13',
    device: 'Guided smartphone', deviceBg: 'var(--stage-1)', deviceColor: 'var(--terracotta)',
    tags: ['Mood after screens', 'Sleep rules', 'Workarounds'],
    quote: '"Her mood drops every time she puts her phone down. I\'m worried."',
    accent: 'var(--stage-1)', accentDark: 'var(--terracotta-dark)', critical: true,
  },
  {
    num: '04', name: 'Navigator', ks: 'KS3/KS4 · Yr 9 to 10', ages: 'Ages 13 to 15',
    device: 'Monitored social', deviceBg: 'var(--stage-5)', deviceColor: 'var(--terracotta)',
    tags: ['VPNs', 'Unknown accounts', 'Reputation'],
    quote: '"He has accounts I don\'t know about. What do I do?"',
    accent: 'var(--stage-5)', accentDark: 'var(--terracotta)',
  },
  {
    num: '05', name: 'Independent', ks: 'KS4/KS5 · Yr 11+', ages: 'Ages 16+',
    device: 'Trust-based', deviceBg: 'var(--stage-1)', deviceColor: 'var(--terracotta)',
    tags: ['Full access', 'AI literacy', 'Readiness'],
    quote: '"She\'s 16 next month. I have no idea if she\'s ready."',
    accent: 'var(--stage-1)', accentDark: 'var(--terracotta)',
  },
]

const WALKTHROUGHS = [
  {
    stage: 'Stage 2 · Ages 8 to 10',
    problem: '"He walks in from school and the TV has to go on immediately. Every single day. If I say no, it\'s a meltdown."',
    solution: 'Children use screens to decompress because they have not learned another way to transition. The fix is not a ban. It is a 20-minute wind-down routine you introduce once, with a script, so it does not become a fight every evening.',
    tags: ['Transition script', 'Weekly action', 'DiGi support'],
  },
  {
    stage: 'Stage 3 · Ages 11 to 13',
    problem: '"Her mood after she comes off her phone is awful. Flat, she snaps. I don\'t know if the phone is doing this or if it\'s just her."',
    solution: 'Research identifies ages 11 to 13 as the peak sensitivity window for girls. The mood drop is a real signal, not just teenage behaviour. The weekly check-in tracks it. The Stage 3 guide gives you the conversation to have before it becomes a pattern.',
    tags: ['Mood tracker', 'Stage 3 guide', 'Research context'],
  },
  {
    stage: 'Stage 4 · Ages 13 to 15',
    problem: '"I found out he\'s been using a VPN to get around the parental controls. I don\'t know where to start."',
    solution: 'A workaround is not a technology problem. It is a trust conversation. The Stage 4 script walks you through how to respond without destroying the relationship or ignoring the behaviour, so you address the breach without making secrecy the new normal.',
    tags: ['Trust script', 'Stage 4 guide'],
  },
  {
    stage: 'Stage 5 · Age 16',
    problem: '"She turns 16 in two months. She\'ll have full access to everything. I have no idea if she\'s actually ready."',
    solution: 'If you have been on the pathway since Stage 1 or 2, the readiness checklist at Stage 5 is a confirmation, not a starting point. If you are starting now, Stage 5 builds the specific skills needed in the months before full access. No cliff edge.',
    tags: ['Readiness checklist', 'The 16 conversation'],
  },
]

const BEHAVIOUR_ISSUES = [
  'Coming home from school and demanding the TV on immediately. Every single day.',
  'Bedtime becoming a battle. Devices in the bedroom until midnight or later.',
  'Mealtimes hijacked. Phone on the table, eyes down, nobody talking.',
  'Morning routines falling apart. Screens replacing breakfast and getting ready.',
  '"I\'m bored." Said the moment any screen is removed. Within minutes.',
  'Homework being avoided. Screens as the reason nothing gets done.',
  'Reading replaced. Books untouched. Passive scrolling instead.',
  'Gaming obsession. Hours disappearing. Meltdowns when it\'s stopped.',
  'Mood crashes after screens. Flat, snappy, difficult to reach.',
  'Family time replaced by everyone on their own device.',
  'Snacking and junk food linked to passive screen time.',
  'Rules being tested constantly. Fights about the same things every week.',
]

const DIGITAL_GAPS = [
  'No idea how algorithms work or what they\'re being shown and why.',
  'Social media before you agreed to it. Through a friend\'s account or a VPN.',
  'Can\'t spot misinformation or AI-generated content.',
  'No sense of digital reputation or what stays online permanently.',
  'Group chats and messaging apps you don\'t know about.',
  'Privacy settings never touched. Personal information freely shared.',
  'Online friendships with no safety framework or sense of risk.',
  'Not ready for the full digital autonomy they\'ll have at 16.',
]

const TRUST = [
  { letter: 'T', word: 'Timing', desc: 'Right device at the right age. Not all-or-nothing. Not a cliff edge.', bg: 'var(--stage-2)', color: 'var(--terracotta)' },
  { letter: 'R', word: 'Relationships', desc: 'Connection is the strongest protective factor the research has found.', bg: 'var(--stage-1)', color: 'var(--terracotta)' },
  { letter: 'U', word: 'Upstream', desc: 'Environment before rules. Platform mechanics matter more than willpower.', bg: 'var(--stage-5)', color: 'var(--terracotta)' },
  { letter: 'S', word: 'Sleep', desc: 'The bedroom rule is the single highest-impact action in this system.', bg: 'var(--stage-5)', color: 'var(--terracotta)' },
  { letter: 'T', word: 'Transparency', desc: 'Openness over secrecy. Co-navigation over monitoring.', bg: 'var(--stage-3)', color: 'var(--terracotta)' },
]

const RESEARCHERS = [
  { name: 'Prof. Candace Odgers', uni: 'UC Irvine · Duke University', finding: 'Effects depend on vulnerability and environment, not just the device. Structure is protective.' },
  { name: 'Dr. Amy Orben', uni: 'Cambridge MRC · Oxford', finding: 'Developmental sensitivity windows: 11 to 13 for girls, 14 to 15 for boys. These are the stages we protect most carefully.' },
  { name: 'Prof. Andrew Przybylski', uni: 'Oxford Internet Institute', finding: 'The Goldilocks effect. Moderate use is not inherently harmful. Too much, too early, structured wrong: that is where risk lives.' },
  { name: 'Prof. Sonia Livingstone', uni: 'LSE, London', finding: 'Children need skills and agency, not just restrictions. Every stage builds graduated digital skills.' },
]

const TESTIMONIALS = [
  { text: '"I used to spiral every time the phone conversation came up. Now I have the exact words. It changed how we talk about it completely."', by: 'Sarah M.', stage: 'Stage 3', initials: 'SM' },
  { text: '"The weekly check-in is the thing I didn\'t know I needed. I spotted something shifting in my son before it became a real problem."', by: 'Tom K.', stage: 'Stage 4', initials: 'TK' },
  { text: '"My daughter and I are actually talking about this stuff now. DiGi gave me the language and the pathway gave me the confidence."', by: 'Clare H.', stage: 'Stage 3', initials: 'CH' },
]

const TICKER_ITEMS = [
  ['Ages 4 to 16', 'one framework'],
  ['12 behaviour issues', 'with scripts'],
  ['8 digital literacy gaps', 'covered'],
  ['Built on', 'Odgers · Orben · Przybylski'],
  ['10 minutes', 'a week. That is all.'],
  ['DiGi', 'AI advisor any time'],
]

export default function HomePage() {
  return (
    <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>

      {/* Announcement bar */}
      <AnnouncementBar />

      {/* Nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        height: '64px',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(247,243,238,.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        gap: '16px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '34px',
            height: '34px',
            background: 'var(--terracotta)',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 0 rgba(0,0,0,.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '16px' }}>
              {[5, 9, 14, 8].map((h, i) => (
                <div key={i} style={{ width: '3px', height: `${h}px`, background: '#fff', borderRadius: '1.5px', opacity: .9 }} />
              ))}
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em' }}>
            Guided Childhood
          </span>
        </Link>

        <nav className="nav-links-desktop">
          {[['Find Your Stage', '#stages'], ['How It Works', '#how-it-works'], ['For Schools', '/schools'], ['Pricing', '#pricing']].map(([label, href]) => (
            <Link key={href} href={href} style={{
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '.84rem',
              fontWeight: 500,
              color: 'var(--ink-soft)',
              padding: '7px 14px',
              borderRadius: '100px',
              transition: 'color .15s, background .15s',
            }}>
              {label}
            </Link>
          ))}
        </nav>

        <Link href="/starter-pack" className="btn btn-green" style={{ fontSize: '13px', padding: '10px 22px', flexShrink: 0 }}>
          Get Started →
        </Link>
      </header>

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section aria-label="Hero" style={{ padding: 'clamp(56px, 8vw, 96px) 32px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>

        {/* Background decoration */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'var(--stage-2)',
          opacity: 0.07, pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-80px', left: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'var(--stage-5)',
          opacity: 0.06, pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="hero-grid">

            {/* LEFT: Text */}
            <div>
              <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '18px', letterSpacing: '.14em' }}>
                Science-backed · Ages 4 to 16 · UK families
              </p>

              <h1 className="fu" style={{
                fontSize: 'clamp(2.8rem, 4.8vw, 4.6rem)',
                fontWeight: 800,
                lineHeight: 1.03,
                letterSpacing: '-.04em',
                color: 'var(--ink)',
                marginBottom: '24px',
              }}>
                From their first screen<br />
                to the moment<br />
                they are{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>
                  ready for everything.
                </em>
              </h1>

              <p className="fu" style={{
                fontSize: 'clamp(.96rem, 1.5vw, 1.07rem)',
                color: 'var(--ink-soft)',
                lineHeight: 1.88,
                maxWidth: '520px',
                marginBottom: '32px',
              }}>
                A science-backed programme that starts at age 4 and builds your child's habits, skills and resilience all the way to 16. Every stage. Every issue. No cliff edge.
              </p>

              <ul className="fu" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                {[
                  'Covers behaviour, sleep, gaming, social media and 20 more issues',
                  'Ten minutes a week. Scripts for every hard moment. No guilt.',
                  'At 16 your child is prepared. Not thrown off a cliff edge.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '.93rem', color: 'var(--ink-soft)' }}>
                    <span className="hero-benefit-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="fu" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
                <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '14px', padding: '16px 32px' }}>
                  Get free starter pack →
                </Link>
                <Link href="#stages" style={{
                  fontSize: '.88rem',
                  fontWeight: 600,
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  Find your stage ↓
                </Link>
              </div>

              {/* Social proof */}
              <div className="fu" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div className="avatar-stack">
                  {[
                    { l: 'SM', bg: 'var(--stage-2)' },
                    { l: 'TK', bg: 'var(--stage-5)' },
                    { l: 'CH', bg: 'var(--stage-1)' },
                    { l: '+', bg: 'var(--cream)' },
                  ].map(({ l, bg }, i) => (
                    <div key={i} className="avatar-stack-item" style={{ background: bg, color: l === '+' ? 'var(--ink-muted)' : 'var(--ink)', zIndex: 4 - i }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <span style={{ color: 'var(--terracotta)', fontSize: '.9rem', letterSpacing: '2px' }}>★★★★★</span>
                  <span style={{ fontSize: '.8rem', color: 'var(--ink-muted)', fontWeight: 600, marginLeft: '8px' }}>
                    131 parents already on their pathway
                  </span>
                </div>
              </div>

              {/* Aligned with strip */}
              <div className="fu" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                  Aligned with
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['Online Safety Act 2023', 'DfE', 'Statutory RSE', 'Ofcom'].map(tag => (
                    <span key={tag} style={{
                      background: 'var(--cream)',
                      border: '1px solid var(--border)',
                      borderRadius: '100px',
                      padding: '5px 13px',
                      fontSize: '.71rem',
                      fontWeight: 700,
                      color: 'var(--ink-muted)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: DiGi chat visual */}
            <div style={{ position: 'relative', paddingTop: '24px', paddingBottom: '24px' }}>

              {/* Floating badge top-left */}
              <div style={{
                position: 'absolute',
                top: '4px',
                left: '16px',
                background: '#fff',
                border: '1.5px solid var(--border)',
                borderRadius: '100px',
                padding: '7px 14px',
                fontSize: '.68rem',
                fontWeight: 700,
                color: 'var(--ink-soft)',
                boxShadow: '0 4px 20px rgba(28,26,20,.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2,
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)', display: 'inline-block' }} />
                Ages 4 to 16 · One pathway
              </div>

              {/* Main DiGi card */}
              <div className="digi-card" style={{ margin: '0 8px' }}>

                {/* Card header */}
                <div style={{
                  background: 'var(--stage-2)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid var(--border)',
                  borderRadius: '20px 20px 0 0',
                }}>
                  <div className="digi-avatar">D</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)' }}>
                      DiGi
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '.67rem', color: 'var(--ink-muted)', marginTop: '1px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0 }} />
                      Digital parenting advisor · Available now
                    </div>
                  </div>
                  <span style={{
                    background: 'var(--stage-1)',
                    color: 'var(--terracotta)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '.58rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '100px',
                    flexShrink: 0,
                  }}>
                    Stage 2
                  </span>
                </div>

                {/* Conversation */}
                <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* DiGi opens */}
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi">
                      What is happening at home with screens right now?
                    </div>
                  </div>

                  {/* Parent reply */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="bubble-parent">
                      Every evening my 9-year-old comes in from school and immediately demands the TV on. If I say no it is a meltdown.
                    </div>
                  </div>

                  {/* DiGi response */}
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi">
                      This is one of the most common Stage 2 patterns. The fix is a 20-minute wind-down routine, with a script you use once. Want the exact words for tonight?
                    </div>
                  </div>
                </div>

                {/* Input row */}
                <div style={{
                  padding: '10px 16px 16px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border)',
                }}>
                  <div style={{
                    flex: 1,
                    background: 'var(--cream)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '100px',
                    padding: '10px 16px',
                    fontSize: '.78rem',
                    color: 'var(--ink-light)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    Ask DiGi about what is happening at home...
                  </div>
                  <Link href="/starter-pack" style={{
                    background: 'var(--terracotta)',
                    color: '#fff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    fontSize: '.95rem',
                    flexShrink: 0,
                    boxShadow: '0 3px 0 rgba(0,0,0,.2)',
                  }}>
                    →
                  </Link>
                </div>
              </div>

              {/* Floating badge bottom-right */}
              <div style={{
                position: 'absolute',
                bottom: '4px',
                right: '16px',
                background: 'var(--stage-5)',
                border: '1.5px solid var(--terracotta-dark)',
                borderRadius: '100px',
                padding: '7px 14px',
                fontSize: '.68rem',
                fontWeight: 700,
                color: 'var(--ink)',
                boxShadow: '0 4px 20px rgba(240,220,152,.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2,
              }}>
                ✓ Ten minutes a week. That is all.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          STATS STRIP
          ================================================================ */}
      <div style={{ background: 'var(--ink)' }}>
        <div className="stats-strip" style={{ maxWidth: '1040px', margin: '0 auto' }}>
          {[
            { num: '131', label: 'Families on their pathway' },
            { num: '5', label: 'Stages from age 4 to 16' },
            { num: '20', label: 'Issues covered with scripts' },
            { num: '2027', label: 'Spring. The ban date. Preparation starts now.' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              padding: '24px 28px',
              textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,.09)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1,
                marginBottom: '5px',
                letterSpacing: '-.03em',
              }}>
                {s.num}
              </div>
              <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.55)', fontWeight: 500, lineHeight: 1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div style={{ background: 'var(--stage-2)', padding: '11px 0', overflow: 'hidden', whiteSpace: 'nowrap' }} aria-hidden="true">
        <div className="ticker-track" style={{ display: 'inline-flex' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map(([strong, rest], i) => (
            <span key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '0 28px',
              fontSize: '.72rem',
              fontWeight: 600,
              color: 'var(--ink-soft)',
              letterSpacing: '.04em',
              textTransform: 'uppercase',
            }}>
              <strong style={{ color: 'var(--ink)' }}>{strong}</strong>
              {rest}
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--terracotta)', opacity: .7, display: 'inline-block', flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ================================================================
          STAGE CARDS
          ================================================================ */}
      <section id="stages" className="section-lg" style={{ background: 'var(--cream)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The five stages</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>Find your stage</h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              One framework from their first screen at age 4 to full independence at 16. Find where your child is now and start there.
            </p>
          </div>

          <div className="stages-grid">
            {STAGES.map(s => (
              <div key={s.num} style={{
                background: s.critical ? 'var(--stage-1)' : '#fff',
                border: `1px solid ${s.critical ? 'rgba(90,138,106,.25)' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '24px 18px 20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow .2s',
              }}>
                {/* Accent top bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: s.accent }} />

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                  Stage {s.num}
                </div>

                {s.critical && (
                  <div style={{
                    display: 'inline-flex',
                    background: 'var(--terracotta)',
                    borderRadius: '100px',
                    padding: '2px 8px',
                    fontSize: '.58rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '6px',
                    alignSelf: 'flex-start',
                  }}>
                    Critical window
                  </div>
                )}

                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: '.73rem', color: 'var(--ink-muted)', marginBottom: '11px' }}>
                  <strong style={{ display: 'block', fontSize: '.88rem', color: 'var(--ink)', letterSpacing: '-.01em', lineHeight: 1.3 }}>{s.ks}</strong>
                  <span>{s.ages}</span>
                </div>

                <div style={{ background: s.deviceBg, color: s.deviceColor, display: 'inline-flex', borderRadius: '100px', padding: '3px 10px', fontSize: '.6rem', fontWeight: 700, marginBottom: '12px', alignSelf: 'flex-start' }}>
                  {s.device}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {s.tags.map(t => (
                    <span key={t} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '2px 8px', fontSize: '.62rem', color: 'var(--ink-soft)', fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>

                <p style={{ fontFamily: 'var(--font-display)', fontSize: '.85rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55, marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  {s.quote}
                </p>

                <Link href="/starter-pack" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '12px',
                  fontSize: '.72rem',
                  fontWeight: 700,
                  color: s.critical ? '#fff' : 'var(--ink)',
                  background: s.critical ? 'var(--terracotta)' : 'var(--stage-2)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '.02em',
                  textDecoration: 'none',
                  boxShadow: s.critical ? '0 3px 0 var(--terracotta-dark)' : '0 3px 0 var(--terracotta)',
                }}>
                  Start here →
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--ink-muted)', marginTop: '24px' }}>
            Multiple children? One account covers all of them.
          </p>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section id="how-it-works" className="section-lg" style={{ scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>How it works</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              The problem.{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>Then what you do.</em>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              Most parenting advice is a tip you forget by morning. This is a system. Here is what it looks like in real family life.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '860px', margin: '0 auto' }}>
            {WALKTHROUGHS.map((w, i) => (
              <div key={i} className="walkthrough-row fu">
                <div style={{ background: 'var(--stage-1)', padding: '28px 24px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
                    The problem
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '.92rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.45, marginBottom: '8px' }}>
                    {w.problem}
                  </p>
                  <span style={{ fontSize: '.7rem', color: 'var(--ink-muted)', fontWeight: 600 }}>{w.stage}</span>
                </div>
                <div style={{ padding: '28px 26px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
                    What Guided Childhood gives you
                  </div>
                  <p style={{ fontSize: '.87rem', color: 'var(--ink-soft)', lineHeight: 1.72, marginBottom: '12px' }}>
                    {w.solution}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {w.tags.map((t, j) => (
                      <span key={j} style={{
                        borderRadius: '100px',
                        padding: '4px 11px',
                        fontSize: '.66rem',
                        fontWeight: 700,
                        background: j === 0 ? 'var(--stage-2)' : j === 1 ? 'var(--cream)' : 'var(--stage-4)',
                        color: j === 0 ? 'var(--terracotta)' : j === 1 ? 'var(--ink-soft)' : 'var(--terracotta-dark)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Time stats */}
          <div className="time-stats">
            {[['2 min', 'Weekly check-in'], ['3', 'Actions per week'], ['<5 min', 'Each action'], ['24/7', 'DiGi available']].map(([num, label], i) => (
              <div key={i} style={{ textAlign: 'center', padding: '22px 12px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--terracotta)', lineHeight: 1, marginBottom: '5px', letterSpacing: '-.02em' }}>
                  {num}
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--ink-soft)', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '.77rem', color: 'var(--ink-muted)', marginTop: '13px', fontStyle: 'italic' }}>
            Most parents spend ten minutes a week. That is genuinely all it takes.
          </p>
        </div>
      </section>

      {/* ================================================================
          DIGI SECTION
          ================================================================ */}
      <section style={{ padding: 'clamp(64px, 9vw, 104px) 32px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col">

            {/* Left: Copy */}
            <div>
              <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>
                Your 24/7 digital parenting advisor
              </p>
              <h2 className="fu" style={{ marginBottom: '20px' }}>
                Meet DiGi
              </h2>
              <p className="fu" style={{ fontSize: '.94rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '12px' }}>
                DiGi knows every stage, every issue and all the research. Ask it anything. TV demands the moment they walk in, gaming meltdowns, mood after screens, unknown accounts.
              </p>
              <p className="fu" style={{ fontSize: '.94rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '28px' }}>
                It gives you the exact words for tonight. Not tomorrow. Tonight.
              </p>
              <ul className="fu" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {[
                  'Calibrated to your child\'s exact age and stage',
                  'Covers all 20 issues, not just social media',
                  'Available at 11pm when everything kicks off',
                  'Like texting someone who has read all the research',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.9rem', color: 'var(--ink-soft)' }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 900, flexShrink: 0, marginTop: '2px', fontSize: '.9rem' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '13px' }}>
                Find your starting point →
              </Link>
            </div>

            {/* Right: DiGi full conversation card */}
            <div className="fu">
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 60px rgba(28,26,20,.12)',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--stage-2) 0%, var(--stage-2) 100%)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '13px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'var(--terracotta)',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 16px rgba(90,138,106,.4)',
                    letterSpacing: '-.02em',
                  }}>
                    D
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>DiGi</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--ink-muted)', marginTop: '1px' }}>Guided Childhood Advisor</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '.67rem', color: 'var(--terracotta)', fontWeight: 600, background: 'var(--stage-2)', padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)' }} />
                    Online now
                  </div>
                </div>

                {/* Conversation */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi">
                      What's happening at home with screens right now?
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="bubble-parent">
                      Every evening my 9-year-old comes in from school and immediately wants the TV on. If I say no it's a full meltdown.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi">
                      This is one of the most common patterns at Stage 2. The fix is a 20-minute wind-down routine with a script so it doesn't become a fight. Want the exact words for tonight?
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="bubble-parent">Yes please</div>
                  </div>

                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi" style={{ background: 'var(--stage-2)', border: '1px solid var(--border)' }}>
                      <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--terracotta)', fontSize: '.76rem' }}>Stage 2 · Transition script</strong>
                      "Before you get the TV on, let's do your five things: shoes away, bag on hook, snack, five minutes outside, then TV. Deal?" Deliver it once, warmly. Then hold it.
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div style={{ padding: '10px 16px 16px', display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid var(--border)', background: 'var(--cream)' }}>
                  <input
                    readOnly
                    style={{
                      flex: 1,
                      background: '#fff',
                      border: '1.5px solid var(--border)',
                      borderRadius: '100px',
                      padding: '10px 16px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '.79rem',
                      color: 'var(--ink-light)',
                      outline: 'none',
                    }}
                    placeholder="Ask DiGi about what is happening at home..."
                    aria-label="Ask DiGi"
                  />
                  <Link href="/starter-pack" style={{
                    background: 'var(--terracotta)',
                    color: '#fff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.9rem',
                    flexShrink: 0,
                    textDecoration: 'none',
                    boxShadow: '0 3px 0 rgba(0,0,0,.2)',
                  }}>
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          20 ISSUES
          ================================================================ */}
      <section id="issues" className="section-lg">
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The full picture</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              Twenty things showing up<br />in homes right now
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              Most platforms pick one. Guided Childhood covers all twenty. Scripts, weekly actions, and DiGi support for every item on both lists.
            </p>
          </div>

          <div className="two-col-issues" style={{ marginTop: '40px' }}>
            <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{
                  background: 'var(--stage-1)',
                  color: 'var(--terracotta)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '.58rem',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  padding: '5px 11px',
                  borderRadius: '8px',
                }}>
                  12 issues
                </span>
                <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>Behaviour and routines</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BEHAVIOUR_ISSUES.map((item, i) => (
                  <li key={i} style={{ fontSize: '.81rem', color: 'var(--ink-soft)', display: 'flex', gap: '9px', alignItems: 'flex-start', lineHeight: 1.55 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)', display: 'inline-block', flexShrink: 0, marginTop: '5px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{
                  background: 'var(--stage-4)',
                  color: 'var(--terracotta-dark)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '.58rem',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  padding: '5px 11px',
                  borderRadius: '8px',
                }}>
                  8 gaps
                </span>
                <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>Digital literacy</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {DIGITAL_GAPS.map((item, i) => (
                  <li key={i} style={{ fontSize: '.81rem', color: 'var(--ink-soft)', display: 'flex', gap: '9px', alignItems: 'flex-start', lineHeight: 1.55 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta-dark)', display: 'inline-block', flexShrink: 0, marginTop: '5px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: 'var(--stage-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: 'var(--terracotta)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>✓</span>
            <p style={{ fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              Guided Childhood covers all 20. The behaviour issues are just as central to the platform as the digital literacy ones.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href="/starter-pack" className="btn btn-gold">Find your starting point →</Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          MENTAL HEALTH SIGNALS
          ================================================================ */}
      <section className="section-lg" style={{ background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Signs to watch for</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              What the research says to{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>pay attention to</em>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              Not a scare list. These are signals. The earlier you spot them, the simpler the response.
            </p>
          </div>

          <div className="two-col-issues" style={{ maxWidth: '880px', margin: '0 auto' }}>
            {[
              { dot: 'var(--terracotta)', label: 'Behaviour signals', color: 'var(--terracotta)', items: [
                ['Meltdowns when screens are removed', 'A sign that screens have become the primary regulation strategy. The framework builds alternatives before removing access.'],
                ['Mood drops of 20 minutes or more after screens', 'The research identifies this duration as a meaningful signal, particularly in girls aged 11 to 13. Worth tracking, not diagnosing.'],
                ['Sleep disruption caused by devices in the bedroom', 'The single highest-impact change you can make. The research shows this consistently across all age groups.'],
                ['Withdrawal from offline activities they used to love', 'Not always screen-caused. But worth noting when it coincides with increased screen time.'],
              ]},
              { dot: 'var(--terracotta-dark)', label: 'Mental health signals', color: 'var(--terracotta-dark)', items: [
                ['Persistent anxiety about notifications', 'Checking before sleep, on waking, at meals. The research links this to platform mechanics, not personality.'],
                ['Appearance comparison and self-critical talk after scrolling', 'Research shows this is amplified by appearance-based content at the 11 to 13 window. What they look at matters as much as how long.'],
                ['Secrecy and hidden device use', 'Not always a crisis. But secrecy is the signal to act on. The script for this is specific and non-confrontational.'],
                ['Prolonged low mood coinciding with a change in platform use', 'Research is clear that pre-existing vulnerability matters more than the platform. But the timing is worth noting.'],
              ]},
            ].map((col, ci) => (
              <div key={ci} className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: col.color }}>
                    {col.label}
                  </span>
                </div>
                {col.items.map(([title, body], ii) => (
                  <div key={ii} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.6, paddingBottom: ii < col.items.length - 1 ? '13px' : 0, borderBottom: ii < col.items.length - 1 ? '1px solid var(--border)' : 'none', marginBottom: ii < col.items.length - 1 ? '13px' : 0 }}>
                    <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '3px', fontSize: '.84rem' }}>{title}</strong>
                    {body}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--stage-5)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 22px', marginTop: '18px', maxWidth: '880px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: 'var(--terracotta-dark)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>⚑</span>
            <p style={{ fontSize: '.83rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              These signals do not mean something is wrong. They mean something is worth paying attention to. The Digital Health Check takes 5 minutes and gives you a personalised read.{' '}
              <Link href="/digitalwellbeing" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'underline' }}>
                Take it free here.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          ONLINE RISKS
          ================================================================ */}
      <section className="section-lg">
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The risks, mapped</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              Every major online risk.{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>What it is. What you do.</em>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              Each risk is covered at the right stage, in the right way. Not all at once. Not as a scare list.
            </p>
          </div>

          <div className="risks-grid fu" style={{ marginBottom: '20px' }}>
            {[
              { label: 'Contact risks', color: 'var(--terracotta)', items: [
                ['Online grooming', 'adults building trust through gaming and messaging. Stage 3 and 4 cover the warning signs and the conversation.'],
                ['Unknown contacts', 'who they are really talking to, without destroying trust to find out.'],
                ['Cyberbullying', 'in group chats, gaming lobbies, and social platforms. What to do when it is your child on either side.'],
              ]},
              { label: 'Content risks', color: 'var(--terracotta-dark)', items: [
                ['Age-inappropriate content', 'violent, sexual, or extremist material encountered through algorithms, search, or sharing.'],
                ['Misinformation and AI content', 'what is real, what is generated, and how to build the skills that spot the difference.'],
                ['Self-harm and eating disorder content', 'algorithmically amplified content that targets vulnerability.'],
              ]},
              { label: 'Conduct and safety risks', color: 'var(--terracotta-dark)', items: [
                ['Sextortion and image-based abuse', 'what it is, how it starts, and the conversation to have before it becomes a possibility.'],
                ['Radicalisation', 'how extremist communities recruit through gaming and niche forums. What a gradual shift looks like.'],
                ['Digital reputation and permanence', 'what gets shared, what stays, and the consent conversation that changes behaviour.'],
              ]},
            ].map((col, ci) => (
              <div key={ci} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: col.color, marginBottom: '14px' }}>
                  {col.label}
                </div>
                {col.items.map(([title, body], ii) => (
                  <div key={ii} style={{ fontSize: '.8rem', color: 'var(--ink-soft)', display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: ii < col.items.length - 1 ? '10px' : 0, lineHeight: 1.55 }}>
                    <span style={{ color: col.color, fontWeight: 700, flexShrink: 0, marginTop: '1px', fontSize: '.9rem' }}>›</span>
                    <span><strong style={{ color: 'var(--ink)' }}>{title}</strong> — {body}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
            Every risk above is covered at the right stage. Not all at once. At the right age, in the right way.
          </p>
        </div>
      </section>

      {/* ================================================================
          TRUST METHOD
          ================================================================ */}
      <section id="how" className="section-lg" style={{ background: 'var(--cream)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The Guided Childhood method</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              One framework that{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>runs the lot</em>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              TRUST runs through every action, script, and lesson from age 4 to 16. Not a tip sheet. A system.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
            {TRUST.map((item, i) => (
              <div key={i} className="fu" style={{ flex: 1, minWidth: '140px', maxWidth: '180px', textAlign: 'center', padding: '28px 14px', position: 'relative' }}>
                {i < TRUST.length - 1 && (
                  <span className="hide-mobile" style={{ position: 'absolute', right: '-12px', top: '30px', fontSize: '.9rem', color: 'var(--ink-light)' }}>→</span>
                )}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: `0 4px 0 ${item.color}22`,
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, lineHeight: 1, color: item.color }}>
                    {item.letter}
                  </span>
                </div>
                <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '7px' }}>
                  {item.word}
                </div>
                <p style={{ fontSize: '.77rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          ABOUT JUSTIN
          ================================================================ */}
      <section className="section-lg">
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col-wide">
            {/* Avatar */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '128px',
                height: '128px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--stage-2) 0%, var(--terracotta) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '2.6rem',
                fontWeight: 800,
                color: '#fff',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(90,138,106,.3)',
                letterSpacing: '-.03em',
              }}>
                JP
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '14px' }}>
                Justin Phillips
              </p>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-light)', marginTop: '3px' }}>Founder, Guided Childhood</p>
            </div>

            {/* Copy */}
            <div>
              <h2 className="fu" style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.4rem)', fontWeight: 700, lineHeight: 1.18, marginBottom: '18px' }}>
                I watched my daughter scroll for{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>three hours</em>{' '}
                and realised the conversation I was missing
              </h2>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: '14px' }}>
                I'm Justin Phillips, founder of The Social Billboard and Guided Childhood. I'm not a researcher. I read the researchers. Then I built a platform that translates what they've found into something parents can actually use this week.
              </p>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: '28px' }}>
                The problem isn't the phone. The problem is nobody gave parents a map. A law about social media doesn't give you one. Guided Childhood does.
              </p>
              <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '13px' }}>
                Find my starting point →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          WHAT CHANGES
          ================================================================ */}
      <section className="section-lg" style={{ background: 'var(--cream)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What changes</p>
          <h2 className="fu" style={{ marginBottom: '14px' }}>
            How this shows up{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>in your home</em>
          </h2>
          <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 48px' }}>
            You are solving today's problem in a way that builds capacity for tomorrow.
          </p>

          <div className="three-col fu" style={{ marginBottom: '32px' }}>
            {[
              {
                num: '01', numColor: 'var(--stage-2)', title: 'The hard moments don\'t make you spiral',
                body: 'You have a framework, not a random tip. When the gaming fight happens, when the mood drops, when the unknown contact appears, you already know what to do.',
                tag: 'Framework not tips', tagBg: 'var(--stage-2)', tagColor: 'var(--ink)',
              },
              {
                num: '02', numColor: 'var(--stage-1)', title: 'Your child starts building the actual skills',
                body: 'Resilience, self-regulation, digital literacy. Not because you went soft, but because you held the boundary and the connection at the same time.',
                tag: 'Skills not compliance', tagBg: 'var(--stage-1)', tagColor: 'var(--ink)',
              },
              {
                num: '03', numColor: 'var(--stage-5)', title: 'You trust yourself as a parent',
                body: "Not because it got easy. Because you stopped needing it to be. The challenges change as they grow. Your approach doesn't have to.",
                tag: 'Confidence not certainty', tagBg: 'var(--stage-5)', tagColor: 'var(--ink)',
              },
            ].map((oc, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '18px', padding: '36px 28px', border: '1px solid var(--border)', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: '16px',
                  color: oc.numColor,
                  opacity: 0.25,
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  letterSpacing: '-.04em',
                }}>
                  {oc.num}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.3, paddingRight: '40px' }}>
                  {oc.title}
                </h3>
                <p style={{ fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '18px' }}>
                  {oc.body}
                </p>
                <span style={{ background: oc.tagBg, color: oc.tagColor, display: 'inline-flex', borderRadius: '100px', padding: '4px 12px', fontSize: '.64rem', fontWeight: 700 }}>
                  {oc.tag}
                </span>
              </div>
            ))}
          </div>

          <Link href="/starter-pack" className="btn btn-gold">Find my starting point →</Link>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      <section className="section-lg">
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What parents say</p>
            <h2 className="fu">
              It actually{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>works</em>
            </h2>
          </div>

          <div className="three-col fu" style={{ marginBottom: '40px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ color: 'var(--terracotta)', fontSize: '1rem', letterSpacing: '2px', marginBottom: '14px' }}>★★★★★</div>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '.92rem',
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  lineHeight: 1.68,
                  marginBottom: '16px',
                  flex: 1,
                }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: ['var(--stage-2)', 'var(--stage-4)', 'var(--stage-5)'][i],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '.72rem',
                    color: 'var(--ink-soft)',
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--ink)' }}>{t.by}</div>
                    <span style={{
                      background: 'var(--stage-2)',
                      color: 'var(--terracotta)',
                      borderRadius: '100px',
                      padding: '2px 8px',
                      fontSize: '.62rem',
                      fontWeight: 700,
                    }}>
                      {t.stage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px', letterSpacing: '-.02em' }}>
              No, it is not too late.
            </p>
            <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', maxWidth: '420px', margin: '0 auto 26px', lineHeight: 1.8 }}>
              There are more school pickups, more car journeys, more evenings ahead of you than behind you. The pathway starts from wherever you are.
            </p>
            <Link href="/starter-pack" className="btn btn-gold">Find my starting point →</Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          RESEARCH
          ================================================================ */}
      <section id="research" className="section-lg" style={{ background: 'var(--cream)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The research</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              Built on evidence,{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>not panic</em>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              Every child benefits from a guided digital childhood. The research tells us which children need it most urgently.
            </p>
          </div>

          <div className="four-col fu" style={{ marginBottom: '24px' }}>
            {RESEARCHERS.map((r, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                  {r.name}
                </h4>
                <div style={{ fontSize: '.68rem', color: 'var(--ink-muted)', marginBottom: '10px', fontWeight: 500 }}>{r.uni}</div>
                <p style={{ fontSize: '.79rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{r.finding}</p>
              </div>
            ))}
          </div>

          <div className="fu" style={{ background: 'var(--cream)', borderRadius: '14px', padding: '26px', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
              Our thesis in plain language
            </h3>
            <div className="two-col-issues" style={{ gap: '12px' }}>
              {[
                'Social media amplifies existing vulnerabilities. It does not harm all children equally.',
                'Environment and structure are more protective than any restriction or ban alone.',
                'Ages 11 to 13 require the most care, especially for girls. That is exactly what Stage 3 is for.',
                'Staged, graduated access with education builds the skills children need at 16.',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', gap: '9px', fontSize: '.83rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                  <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>•</span>
                  {pt}
                </div>
              ))}
            </div>
          </div>

          <div className="fu" style={{ border: '1px solid var(--border)', borderRadius: '14px', background: 'var(--stage-5)', padding: '32px 28px', textAlign: 'center' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Free · 5 minutes · No signup needed</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '10px' }}>
              Not sure where to start? The tool will tell you.
            </h3>
            <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto 20px' }}>
              Answer questions about what is happening at home. TV routines, gaming, sleep, mood, social media access. The Digital Health Check shows you where the gaps are and gives you a personalised starting point.
            </p>
            <Link href="/digitalwellbeing" className="btn btn-gold">Take the free Digital Health Check →</Link>
          </div>
        </div>
      </section>

      {/* Policy strip */}
      <div style={{ background: 'var(--cream)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0 }}>
        {['Online Safety Act 2023', 'Education for a Connected World (DfE)', 'Statutory RSE and Health Education', 'Ofcom Media Literacy Framework', 'DfE AI in Education Guidance 2025'].map((item, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 18px', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-soft)', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0, display: 'inline-block' }} />
            {item}
          </div>
        ))}
      </div>

      {/* ================================================================
          SCHOOLS CROSSOVER
          ================================================================ */}
      <section id="teachers" className="section-lg" style={{ background: 'var(--stage-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col">
            <div>
              <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>For schools</p>
              <h2 className="fu" style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)', marginBottom: '16px' }}>
                Not just safety.<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>Full digital education.</em>
              </h2>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '14px' }}>
                Most school programmes cover what to do when something goes wrong. Guided Childhood covers everything before that moment and everything that comes after.
              </p>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '28px' }}>
                Screen behaviour, routines, every online risk, digital literacy, AI, and full readiness at 16. EYFS to Sixth Form. Every lesson comes with a parent note so school work extends into the home.
              </p>
              <Link href="/schools" className="btn btn-ink fu" style={{ fontSize: '13px' }}>
                See the full school programme →
              </Link>
            </div>

            <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '18px', padding: '28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '16px' }}>
                What the school curriculum covers
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Screen behaviour, routines, and emotional regulation',
                  'Grooming, manipulation, consent, and online strangers',
                  'Sextortion, radicalisation, and dark web awareness',
                  'Misinformation, deepfakes, and AI-generated content',
                  'Algorithms, social media, privacy, digital reputation',
                  'AI literacy, data rights, full readiness at 16',
                  'Parent note with every single lesson',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '.84rem', color: 'var(--ink-soft)' }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '.72rem', color: 'var(--ink-muted)' }}>
                Mapped to RSE, Online Safety Act, Education for a Connected World, and Ofsted requirements.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          PRICING
          ================================================================ */}
      <section id="pricing" className="section-lg" style={{ scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Simple pricing</p>
            <h2 className="fu">
              Start free. Stay as long<br />as you{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>need.</em>
            </h2>
          </div>

          {/* Founder urgency bar */}
          <div className="fu" style={{ background: 'var(--terracotta)', borderRadius: '12px', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', flexShrink: 0 }}>Limited</span>
              <span style={{ fontSize: '.88rem', fontWeight: 600, color: '#fff' }}>
                Founder Rate: first 50 members only. Lock in{' '}
                <strong>£7.99/month for life.</strong>
              </span>
            </div>
            <Link href="/starter-pack" style={{
              background: '#fff',
              color: 'var(--terracotta)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '.72rem',
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              padding: '9px 20px',
              borderRadius: '100px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              Claim Founder Rate →
            </Link>
          </div>

          <div className="price-grid fu">
            {[
              {
                tier: 'Free forever', name: 'Starter Pack', price: 'Free', period: '',
                save: 'Yours immediately on sign-up',
                features: [
                  ['✓', 'green', 'Age-stage roadmap'],
                  ['✓', 'green', 'Family digital agreement template'],
                  ['✓', 'green', '5 conversation scripts'],
                  ['✓', 'green', 'Warning signs checklist'],
                  ['✓', 'green', 'Age restrictions guide'],
                ],
                cta: 'Get Free Pack', href: '/starter-pack',
                ctaBg: 'transparent', ctaColor: 'var(--ink)', ctaBorder: '2px solid var(--border)', ctaShadow: 'none',
                style: {},
              },
              {
                tier: 'Most popular', name: 'Guided Childhood OS', price: '£12.99', period: '/month',
                save: 'First 50: lock in £7.99/month for life.',
                features: [
                  ['✓', 'green', 'Full 5-stage dashboard'],
                  ['✓', 'green', 'Weekly 3-action plan'],
                  ['✓', 'green', 'All scripts and guides'],
                  ['✓', 'green', 'Full curriculum, all lessons'],
                  ['✓', 'green', 'Digital wellbeing tracker'],
                  ['✓', 'coral', 'DiGi AI advisor, unlimited'],
                  ['✓', 'coral', 'School lesson packs included'],
                ],
                cta: 'Start now', href: '/join',
                ctaBg: 'var(--terracotta)', ctaColor: '#fff', ctaBorder: 'none', ctaShadow: '0 5px 0 var(--terracotta-dark)',
                style: { background: 'var(--stage-1)', border: '2px solid rgba(90,138,106,.35)', transform: 'scale(1.025)' },
              },
              {
                tier: 'Best value', name: 'Annual OS', price: '£99', period: '/year',
                save: 'Save £57. Two months free.',
                features: [
                  ['✓', 'green', 'Everything in monthly'],
                  ['✓', 'green', 'Multi-child profiles'],
                  ['✓', 'green', 'Priority DiGi access'],
                  ['✓', 'green', 'School pack downloads'],
                ],
                cta: 'Start now', href: '/join',
                ctaBg: 'var(--terracotta)', ctaColor: '#fff', ctaBorder: 'none', ctaShadow: '0 5px 0 var(--terracotta-dark)',
                style: {},
              },
            ].map((plan, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '18px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                ...plan.style,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px', minHeight: '2em' }}>
                  {plan.tier}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.01em', color: 'var(--ink)', marginBottom: '16px', minHeight: '2.6em', display: 'flex', alignItems: 'flex-start' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '5px' }}>
                  {plan.period && <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>£</span>}
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.03em' }}>
                    {plan.price.replace('£', '')}
                  </span>
                  <span style={{ fontSize: '.77rem', color: 'var(--ink-muted)', marginLeft: '2px' }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--terracotta)', fontWeight: 700, marginBottom: '20px', minHeight: '16px' }}>
                  {plan.save}
                </div>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 18px' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px', flex: 1 }}>
                  {plan.features.map(([check, color, label], fi) => (
                    <li key={fi} style={{ display: 'flex', gap: '9px', fontSize: '.81rem', color: 'var(--ink-soft)', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 900, fontSize: '.74rem', marginTop: '2px', flexShrink: 0, color: color === 'green' ? 'var(--terracotta)' : 'var(--terracotta-dark)' }}>
                        {check}
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{
                  width: '100%',
                  marginTop: 'auto',
                  padding: '14px',
                  borderRadius: '14px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '.84rem',
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center',
                  background: plan.ctaBg,
                  color: plan.ctaColor,
                  border: plan.ctaBorder,
                  boxShadow: plan.ctaShadow,
                  transition: 'transform .15s, box-shadow .15s',
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ
          ================================================================ */}
      <section className="section-lg" style={{ background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Common questions</p>
            <h2 className="fu">
              And in case you are{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>wondering</em>
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
      <section style={{ textAlign: 'center', padding: 'clamp(80px, 10vw, 120px) 32px', background: 'var(--stage-2)', position: 'relative', overflow: 'hidden' }}>
        {/* Background circles */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(0,0,0,.04)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-100px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(90,138,106,.15)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3.4rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.04em', marginBottom: '16px', lineHeight: 1.06 }}>
            Ready to start?<br />
            Pick{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>your</em>
            {' '}path.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '36px' }}>
            131 parents already on the pathway. Find your starting point in 2 minutes, or grab the free starter pack and begin tonight.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '14px', padding: '16px 32px' }}>
              Find my starting point →
            </Link>
            <Link href="/starter-pack" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '.05em',
              textTransform: 'uppercase',
              padding: '16px 32px',
              borderRadius: 'var(--radius-btn)',
              textDecoration: 'none',
              background: 'rgba(28,28,42,.08)',
              border: '1.5px solid rgba(28,28,42,.2)',
              color: 'var(--ink)',
              transition: 'background .2s',
            }}>
              Get the free starter pack
            </Link>
          </div>
          <div style={{ fontSize: '.72rem', color: 'var(--ink-muted)', marginBottom: '18px' }}>
            No card. No catch. Start where you are.
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(28,28,42,.06)', border: '1px solid rgba(28,28,42,.15)', borderRadius: '100px', padding: '7px 16px', fontSize: '.71rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
            ✓ 30-day money-back guarantee on launch
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '40px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '6px' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--terracotta)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '13px' }}>
                  {[4, 7, 11, 6].map((h, i) => (
                    <div key={i} style={{ width: '2.5px', height: `${h}px`, background: '#fff', borderRadius: '1px', opacity: .9 }} />
                  ))}
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>Guided Childhood</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', color: 'var(--ink-light)' }}>
              The OS for Modern Parenting
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Find Your Stage', '#stages'], ['Schools', '/schools'], ['Pricing', '#pricing'], ['Health Check', '/digitalwellbeing'], ['Free Starter Pack', '/starter-pack'], ['Login', '/login']].map(([label, href]) => (
              <Link key={href + label} href={href} style={{ fontSize: '.74rem', color: 'var(--ink-muted)', textDecoration: 'none', fontWeight: 500 }}>
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--ink-light)' }}>
            © 2026 The Social Billboard · Justin Phillips
          </div>
        </div>
      </footer>

    </div>
  )
}
