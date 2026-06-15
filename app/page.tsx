import Link from 'next/link'
import AnnouncementBar from '@/components/marketing/AnnouncementBar'
import FaqAccordion from '@/components/marketing/FaqAccordion'

const STAGES = [
  { num: '01', name: 'Foundation', ks: 'EYFS and KS1 · Yr R to 2', ages: 'Ages 4 to 7', device: 'Shared screen', deviceStyle: { background: '#EEF7F2', color: '#2E7D5A' }, tags: ['TV routines', 'Co-viewing', 'No solo device'], quote: '"I can\'t get my four-year-old off the iPad. What am I doing wrong?"', accent: '#AFDCA2', cls: 1 },
  { num: '02', name: 'First Steps', ks: 'KS2 · Yr 3 to 5', ages: 'Ages 8 to 10', device: 'Restricted phone', deviceStyle: { background: '#E7ECF8', color: '#3D5BA9' }, tags: ['After-school TV', 'Gaming time', 'Boredom'], quote: '"The moment he walks in from school it\'s TV or gaming. I can\'t break the cycle."', accent: '#3D5BA9', cls: 2 },
  { num: '03', name: 'Explorer', ks: 'KS2/KS3 · Yr 6 to 8', ages: 'Ages 11 to 13', device: 'Guided smartphone', deviceStyle: { background: '#FEF3E8', color: '#D4600A' }, tags: ['Mood after screens', 'Sleep rules', 'Workarounds'], quote: '"Her mood drops every time she puts her phone down. I\'m worried."', accent: '#D4600A', cls: 3, critical: true },
  { num: '04', name: 'Navigator', ks: 'KS3/KS4 · Yr 9 to 10', ages: 'Ages 13 to 15', device: 'Monitored social', deviceStyle: { background: '#FEFAE8', color: '#C9962A' }, tags: ['VPNs', 'Unknown accounts', 'Reputation'], quote: '"He has accounts I don\'t know about. What do I do?"', accent: '#F2C94C', cls: 4 },
  { num: '05', name: 'Independent', ks: 'KS4/KS5 · Yr 11+', ages: 'Ages 16+', device: 'Trust-based', deviceStyle: { background: '#EEF7F2', color: '#2E7D5A' }, tags: ['Full access', 'AI literacy', 'Readiness'], quote: '"She\'s 16 next month. I have no idea if she\'s ready."', accent: '#AFDCA2', cls: 5 },
]

const WALKTHROUGHS = [
  { stage: 'Stage 2 · Ages 8 to 10', problem: '"He walks in from school and the TV has to go on immediately. Every single day. If I say no, it\'s a meltdown."', solution: 'Children use screens to decompress because they have not learned another way to transition. The fix is not a ban. It is a 20-minute wind-down routine you introduce once, with a script, so it does not become a fight every evening.', tags: ['Transition script', 'Weekly action', 'DiGi support'] },
  { stage: 'Stage 3 · Ages 11 to 13', problem: '"Her mood after she comes off her phone is awful. Flat, she snaps. I don\'t know if the phone is doing this or if it\'s just her."', solution: 'Research identifies ages 11 to 13 as the peak sensitivity window for girls. The mood drop is a real signal, not just teenage behaviour. The weekly check-in tracks it. The Stage 3 guide gives you the conversation to have before it becomes a pattern.', tags: ['Mood tracker', 'Stage 3 guide', 'Research context'] },
  { stage: 'Stage 4 · Ages 13 to 15', problem: '"I found out he\'s been using a VPN to get around the parental controls. I don\'t know where to start."', solution: 'A workaround is not a technology problem. It is a trust conversation. The Stage 4 script walks you through how to respond without destroying the relationship or ignoring the behaviour, so you address the breach without making secrecy the new normal.', tags: ['Trust script', 'Stage 4 guide'] },
  { stage: 'Stage 5 · Age 16', problem: '"She turns 16 in two months. She\'ll have full access to everything. I have no idea if she\'s actually ready."', solution: 'If you have been on the pathway since Stage 1 or 2, the readiness checklist at Stage 5 is a confirmation, not a starting point. If you are starting now, Stage 5 builds the specific skills needed in the months before full access. No cliff edge.', tags: ['Readiness checklist', 'The 16 conversation'] },
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
  { letter: 'T', word: 'Timing', desc: 'Right device at the right age. Not all-or-nothing. Not a cliff edge.', bg: '#EEF7F2', color: '#2E7D5A' },
  { letter: 'R', word: 'Relationships', desc: 'Connection is the strongest protective factor the research has found.', bg: '#FEF3E8', color: '#D4600A' },
  { letter: 'U', word: 'Upstream', desc: 'Environment before rules. Platform mechanics matter more than willpower.', bg: '#FEFAE8', color: '#C9962A' },
  { letter: 'S', word: 'Sleep', desc: 'The bedroom rule is the single highest-impact action in this system.', bg: '#FEFAE8', color: '#C9962A' },
  { letter: 'T', word: 'Transparency', desc: 'Openness over secrecy. Co-navigation over monitoring.', bg: '#E7ECF8', color: '#3D5BA9' },
]

const RESEARCHERS = [
  { name: 'Prof. Candace Odgers', uni: 'UC Irvine · Duke University', finding: 'Effects depend on vulnerability and environment, not just the device. Structure is protective.' },
  { name: 'Dr. Amy Orben', uni: 'Cambridge MRC · Oxford', finding: 'Developmental sensitivity windows: 11 to 13 for girls, 14 to 15 for boys. These are the stages we protect most carefully.' },
  { name: 'Prof. Andrew Przybylski', uni: 'Oxford Internet Institute', finding: 'The Goldilocks effect. Moderate use is not inherently harmful. Too much, too early, structured wrong: that is where risk lives.' },
  { name: 'Prof. Sonia Livingstone', uni: 'LSE, London', finding: 'Children need skills and agency, not just restrictions. Every stage builds graduated digital skills.' },
]

const TESTIMONIALS = [
  { text: '"I used to spiral every time the phone conversation came up. Now I have the exact words. It changed how we talk about it completely."', by: 'Sarah M.', stage: 'Stage 3' },
  { text: '"The weekly check-in is the thing I didn\'t know I needed. I spotted something shifting in my son before it became a real problem."', by: 'Tom K.', stage: 'Stage 4' },
  { text: '"My daughter and I are actually talking about this stuff now. DiGi gave me the language and the pathway gave me the confidence."', by: 'Clare H.', stage: 'Stage 3' },
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
      <header style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 300, height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--green)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '15px' }}>
              {[5, 9, 13, 7].map((h, i) => <div key={i} style={{ width: '3px', height: `${h}px`, background: 'var(--ink)', borderRadius: '1.5px', opacity: .7 }} />)}
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em' }}>Guided Childhood</span>
        </Link>
        <nav style={{ display: 'flex', gap: '2px' }}>
          {[['Find Your Stage', '#stages'], ['How It Works', '#how-it-works'], ['For Schools', '/schools'], ['Pricing', '#pricing']].map(([label, href]) => (
            <Link key={href} href={href} style={{ background: 'none', textDecoration: 'none', display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 500, color: 'var(--ink-soft)', padding: '6px 13px', borderRadius: '100px' }}>
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/starter-pack" style={{ background: 'var(--green)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 700, padding: '9px 22px', borderRadius: '100px', textDecoration: 'none' }}>
          Get Started
        </Link>
      </header>

      {/* Cross-link bar */}
      <div style={{ background: '#EFE9DF', borderBottom: '1px solid var(--border)', padding: '9px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {[['🏫 For schools', '/schools'], ['📋 Free Health Check', '/digitalwellbeing'], ['🎁 Free Starter Pack', '/starter-pack']].map(([label, href]) => (
          <Link key={href} href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '5px 13px', fontSize: '.72rem', fontWeight: 700, color: 'var(--ink)', textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Hero */}
      <section aria-label="Hero" style={{ padding: '48px 24px 72px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
          Science-backed · Ages 4 to 16 · Built for UK families
        </p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-.04em', color: 'var(--ink)', maxWidth: '740px', margin: '0 auto 20px' }}>
          From their first screen<br />to the moment they are<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>ready for the world.</em>
        </h1>
        <p style={{ fontSize: 'clamp(.92rem, 1.5vw, 1.05rem)', color: 'var(--ink-soft)', lineHeight: 1.82, maxWidth: '480px', margin: '0 auto 28px' }}>
          A science-backed programme that starts at age 4 and builds your child's habits, skills, and resilience all the way to 16. Every stage. Every issue. No cliff edge.
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left', maxWidth: '420px' }}>
          {['Covers behaviour and routines, not just social media', '10 minutes a week. Scripts for every hard moment. No guilt.', 'At 16 your child is prepared, not thrown off a cliff edge'].map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.9rem', color: 'var(--ink-soft)' }}>
              <span style={{ color: 'var(--green-dark)', fontWeight: 900, fontSize: '1rem', marginTop: '1px' }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
        <Link href="/starter-pack" style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', padding: '17px 36px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 5px 0 var(--gold-hover)', marginBottom: '12px' }}>
          Find your starting point →
        </Link>
        <p style={{ fontSize: '.74rem', color: 'var(--ink-muted)', marginBottom: '24px' }}>Takes 2 minutes · Free · Tells you exactly where to begin</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '28px', justifyContent: 'center' }}>
          <span style={{ color: 'var(--coral)', fontSize: '.95rem', letterSpacing: '2px' }}>★★★★★</span>
          <span style={{ fontSize: '.78rem', color: 'var(--ink-muted)', fontWeight: 600 }}>131 parents already on their pathway</span>
        </div>
        <div>
          <p style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>Aligned with</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['Online Safety Act 2023', 'DfE', 'Statutory RSE', 'Ofcom'].map(tag => (
              <span key={tag} style={{ background: '#FDFBF8', border: '1px solid var(--border)', borderRadius: '100px', padding: '5px 13px', fontSize: '.71rem', fontWeight: 700, color: 'var(--ink-muted)' }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ background: 'var(--green)', padding: '11px 0', overflow: 'hidden', whiteSpace: 'nowrap' }} aria-hidden="true">
        <div className="ticker-track" style={{ display: 'inline-flex' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map(([strong, rest], i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', padding: '0 28px', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-soft)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              <strong style={{ color: 'var(--ink)' }}>{strong}</strong>{rest}
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--coral)', opacity: .7, display: 'inline-block', flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* Stage cards */}
      <section id="stages" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--coral)', marginBottom: '12px' }}>The five stages</p>
            <h2 style={{ marginBottom: '12px' }}>Find your stage</h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
              One framework from their first screen at age 4 to full independence at 16. Find where your child is now and start there.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '11px' }}>
            {STAGES.map(s => (
              <div key={s.num} style={{ background: s.critical ? 'var(--coral-lt)' : '#fff', border: `1px solid ${s.critical ? 'rgba(212,96,10,0.25)' : 'var(--border)'}`, borderRadius: '16px', padding: '24px 18px 20px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: s.accent }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '7px' }}>Stage {s.num}</div>
                {s.critical && <div style={{ display: 'inline-flex', background: 'var(--coral-lt)', border: '1px solid rgba(212,96,10,0.25)', borderRadius: '100px', padding: '2px 7px', fontSize: '.58rem', fontWeight: 700, color: 'var(--coral)', marginBottom: '5px', alignSelf: 'flex-start' }}>Critical window</div>}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>{s.name}</div>
                <div style={{ fontSize: '.73rem', color: 'var(--ink-muted)', marginBottom: '11px' }}>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--ink)', letterSpacing: '-.01em', lineHeight: 1.3 }}>{s.ks}</strong>
                  <span>{s.ages}</span>
                </div>
                <div style={{ ...s.deviceStyle, display: 'inline-flex', borderRadius: '100px', padding: '2px 9px', fontSize: '.6rem', fontWeight: 700, marginBottom: '12px', alignSelf: 'flex-start' }}>{s.device}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {s.tags.map(t => <span key={t} style={{ background: '#FDFBF8', border: '1px solid var(--border)', borderRadius: '100px', padding: '2px 8px', fontSize: '.62rem', color: 'var(--ink-soft)', fontWeight: 600 }}>{t}</span>)}
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '.85rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55, marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>{s.quote}</p>
                <Link href="/starter-pack" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '11px', fontSize: '.72rem', fontWeight: 600, color: s.critical ? '#fff' : 'var(--ink)', background: s.critical ? 'var(--coral)' : 'var(--green)', border: 'none', padding: '7px 14px', borderRadius: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '.02em', textDecoration: 'none' }}>
                  Start here →
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--ink-muted)', marginTop: '22px' }}>Multiple children? One account covers all of them.</p>
        </div>
      </section>

      {/* How it works — walkthrough cards */}
      <section id="how-it-works" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>How it works</p>
            <h2 style={{ marginBottom: '12px' }}>The problem. <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>Then what you do.</em></h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
              Most parenting advice is a tip you forget by morning. This is a system. Here is what it looks like in real family life.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '820px', margin: '0 auto' }}>
            {WALKTHROUGHS.map((w, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '260px 1fr', background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--coral-lt)', padding: '24px 20px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '9px' }}>The problem</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.45, marginBottom: '7px' }}>{w.problem}</p>
                  <span style={{ fontSize: '.7rem', color: 'var(--ink-muted)' }}>{w.stage}</span>
                </div>
                <div style={{ padding: '24px 22px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: '9px' }}>What Guided Childhood gives you</div>
                  <p style={{ fontSize: '.86rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '11px' }}>{w.solution}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {w.tags.map((t, j) => (
                      <span key={j} style={{ borderRadius: '100px', padding: '3px 10px', fontSize: '.66rem', fontWeight: 700, background: j === 0 ? 'var(--green-lt)' : j === 1 ? '#EFE9DF' : 'var(--lav)', color: j === 0 ? 'var(--green-dark)' : j === 1 ? 'var(--ink-soft)' : 'var(--lav-deep)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Time commitment row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--green-lt)', border: '1px solid #D3ECD9', borderRadius: '14px', overflow: 'hidden', maxWidth: '820px', margin: '4px auto 0' }}>
            {[['2 min', 'Weekly check-in'], ['3', 'Actions per week'], ['<5 min', 'Each action'], ['24/7', 'DiGi available']].map(([num, label], i) => (
              <div key={i} style={{ textAlign: 'center', padding: '20px 12px', borderRight: i < 3 ? '1px solid #D3ECD9' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 800, color: 'var(--green-dark)', lineHeight: 1, marginBottom: '5px' }}>{num}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--ink-soft)', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '.77rem', color: 'var(--ink-muted)', marginTop: '11px', fontStyle: 'italic' }}>Most parents spend 10 minutes a week. That is genuinely all it takes.</p>
        </div>
      </section>

      {/* DiGi section */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>Your 24/7 digital parenting advisor</p>
            <h2 style={{ marginBottom: '16px' }}>Meet DiGi</h2>
            <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.78, marginBottom: '20px' }}>
              Ask DiGi anything. TV demands the moment they walk in, gaming meltdowns, mood after screens, unknown accounts. It knows the research and gives you the exact words for tonight.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {['Calibrated to your child\'s age and stage', 'Covers all 20 issues, not just social media', 'Available at 11pm when everything kicks off'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.88rem', color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--green-dark)', fontWeight: 900, flexShrink: 0, marginTop: '2px' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '13px' }}>Find your starting point →</Link>
            <p style={{ fontSize: '.72rem', color: 'var(--ink-muted)', marginTop: '10px' }}>Like texting someone who has read all the research</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(28,26,20,.1)', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--green-lt)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #D3ECD9' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--green-dark)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>D</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '.88rem', fontWeight: 700, color: 'var(--ink)' }}>DiGi</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '.67rem', color: 'var(--ink-muted)' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green-dark)', flexShrink: 0 }} />
                  Guided Childhood Advisor · Available now
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '180px' }}>
              <div style={{ padding: '10px 13px', borderRadius: '12px', fontSize: '.8rem', lineHeight: 1.65, maxWidth: '88%', background: '#FDFBF8', color: 'var(--ink)', borderBottomLeftRadius: '4px', alignSelf: 'flex-start' }}>
                What's happening at home with screens right now?
              </div>
              <div style={{ padding: '10px 13px', borderRadius: '12px', fontSize: '.8rem', lineHeight: 1.65, maxWidth: '88%', background: 'var(--green)', color: 'var(--ink)', borderBottomRightRadius: '4px', alignSelf: 'flex-end' }}>
                Every evening my 9-year-old comes in from school and immediately wants the TV on. If I say no it's a full meltdown.
              </div>
              <div style={{ padding: '10px 13px', borderRadius: '12px', fontSize: '.8rem', lineHeight: 1.65, maxWidth: '88%', background: '#FDFBF8', color: 'var(--ink)', borderBottomLeftRadius: '4px', alignSelf: 'flex-start' }}>
                This is one of the most common patterns at Stage 2. The fix is a 20-minute wind-down routine with a script so it doesn't become a fight. Want the exact words for tonight?
              </div>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', background: '#FDFBF8' }}>
              <input readOnly style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '8px 14px', fontFamily: 'var(--font-body)', fontSize: '.79rem', color: 'var(--ink-light)', outline: 'none' }} placeholder="Ask DiGi about what's happening at home..." aria-label="Ask DiGi" />
              <Link href="/starter-pack" style={{ background: 'var(--green-dark)', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', flexShrink: 0, textDecoration: 'none' }}>→</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 20 issues */}
      <section id="issues" style={{ padding: 'clamp(60px, 8vw, 80px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--coral)', marginBottom: '12px' }}>The full picture</p>
            <h2 style={{ marginBottom: '12px' }}>Twenty things showing up<br />in homes right now</h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>Most platforms pick one. Guided Childhood covers all twenty. Scripts, weekly actions, and DiGi support for every item on both lists.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <span style={{ background: 'var(--coral-lt)', color: 'var(--coral)', fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '8px' }}>12 issues</span>
                <span style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--ink)' }}>Behaviour and routines</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {BEHAVIOUR_ISSUES.map((item, i) => (
                  <li key={i} style={{ fontSize: '.8rem', color: 'var(--ink-soft)', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: 1.55 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--coral)', display: 'inline-block', flexShrink: 0, marginTop: '5px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <span style={{ background: 'var(--lav)', color: 'var(--lav-deep)', fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '8px' }}>8 gaps</span>
                <span style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--ink)' }}>Digital literacy</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {DIGITAL_GAPS.map((item, i) => (
                  <li key={i} style={{ fontSize: '.8rem', color: 'var(--ink-soft)', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: 1.55 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lav-deep)', display: 'inline-block', flexShrink: 0, marginTop: '5px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ background: 'var(--green-lt)', border: '1px solid #D3ECD9', borderRadius: '12px', padding: '16px 20px', marginTop: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: 'var(--green-dark)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>✓</span>
            <p style={{ fontSize: '.83rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Guided Childhood covers all 20. The behaviour issues are just as central to the platform as the digital literacy ones.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/starter-pack" className="btn btn-gold">Find your starting point →</Link>
          </div>
        </div>
      </section>

      {/* Mental health signals */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--coral)', marginBottom: '12px' }}>Signs to watch for</p>
            <h2 style={{ marginBottom: '12px' }}>What the research says to<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>pay attention to</em></h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>Not a scare list. These are signals. The earlier you spot them, the simpler the response.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', maxWidth: '880px', margin: '0 auto' }}>
            {[
              { dot: 'var(--coral)', label: 'Behaviour signals', color: 'var(--coral)', items: [
                ['Meltdowns when screens are removed', 'A sign that screens have become the primary regulation strategy. The framework builds alternatives before removing access.'],
                ['Mood drops of 20 minutes or more after screens', 'The research identifies this duration as a meaningful signal, particularly in girls aged 11 to 13. Worth tracking, not diagnosing.'],
                ['Sleep disruption caused by devices in the bedroom', 'The single highest-impact change you can make. The research shows this consistently across all age groups.'],
                ['Withdrawal from offline activities they used to love', 'Not always screen-caused. But worth noting when it coincides with increased screen time.'],
              ]},
              { dot: 'var(--lav-deep)', label: 'Mental health signals', color: 'var(--lav-deep)', items: [
                ['Persistent anxiety about notifications', 'Checking before sleep, on waking, at meals. The research links this to platform mechanics, not personality.'],
                ['Appearance comparison and self-critical talk after scrolling', 'Research shows this is amplified by appearance-based content at the 11 to 13 window. What they look at matters as much as how long.'],
                ['Secrecy and hidden device use', 'Not always a crisis. But secrecy is the signal to act on. The script for this is specific and non-confrontational.'],
                ['Prolonged low mood coinciding with a change in platform use', "Prof. Odgers' research is clear that pre-existing vulnerability matters more than the platform. But the timing is worth noting."],
              ]},
            ].map((col, ci) => (
              <div key={ci} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '16px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: col.color }}>{col.label}</span>
                </div>
                {col.items.map(([title, body], ii) => (
                  <div key={ii} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.6, paddingBottom: ii < col.items.length - 1 ? '11px' : 0, borderBottom: ii < col.items.length - 1 ? '1px solid var(--border)' : 'none', marginBottom: ii < col.items.length - 1 ? '11px' : 0 }}>
                    <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '2px', fontSize: '.84rem' }}>{title}</strong>
                    {body}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--gold-lt)', border: '1px solid rgba(242,201,76,0.35)', borderRadius: '12px', padding: '16px 20px', marginTop: '16px', maxWidth: '880px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: 'var(--gold-dark)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>⚠</span>
            <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              These signals do not mean something is wrong. They mean something is worth paying attention to. The Digital Health Check takes 5 minutes and gives you a personalised read.{' '}
              <Link href="/digitalwellbeing" style={{ color: 'var(--gold-dark)', fontWeight: 700, textDecoration: 'underline' }}>Take it free here.</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Online risks */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--coral)', marginBottom: '12px' }}>The risks, mapped</p>
            <h2 style={{ marginBottom: '12px' }}>Every major online risk.<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>What it is. What you do.</em></h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>Each risk is covered at the right stage, in the right way. Not all at once. Not as a scare list.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '13px', maxWidth: '920px', margin: '0 auto 20px' }}>
            {[
              { label: 'Contact risks', color: 'var(--coral)', items: [['Online grooming', 'adults building trust through gaming and messaging. Stage 3 and 4 cover the warning signs and the conversation.'], ['Unknown contacts', "who they are really talking to, without destroying trust to find out."], ['Cyberbullying', "in group chats, gaming lobbies, and social platforms. What to do when it is your child on either side."]] },
              { label: 'Content risks', color: 'var(--lav-deep)', items: [['Age-inappropriate content', 'violent, sexual, or extremist material encountered through algorithms, search, or sharing.'], ['Misinformation and AI content', 'what is real, what is generated, and how to build the skills that spot the difference.'], ['Self-harm and eating disorder content', 'algorithmically amplified content that targets vulnerability.']] },
              { label: 'Conduct and safety risks', color: 'var(--gold-dark)', items: [['Sextortion and image-based abuse', 'what it is, how it starts, and the conversation to have before it becomes a possibility.'], ['Radicalisation', 'how extremist communities recruit through gaming and niche forums. What a gradual shift looks like.'], ['Digital reputation and permanence', 'what gets shared, what stays, and the consent conversation that changes behaviour.']] },
            ].map((col, ci) => (
              <div key={ci} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: col.color, marginBottom: '12px' }}>{col.label}</div>
                {col.items.map(([title, body], ii) => (
                  <div key={ii} style={{ fontSize: '.79rem', color: 'var(--ink-soft)', display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: ii < col.items.length - 1 ? '9px' : 0, lineHeight: 1.55 }}>
                    <span style={{ color: col.color, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>›</span>
                    <span><strong style={{ color: 'var(--ink)' }}>{title}</strong> — {body}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>Every risk above is covered at the right stage. Not all at once. At the right age, in the right way.</p>
        </div>
      </section>

      {/* TRUST method */}
      <section id="how" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>The Guided Childhood method</p>
            <h2 style={{ marginBottom: '12px' }}>One framework that <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>runs the lot</em></h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>TRUST runs through every action, script, and lesson from age 4 to 16. Not a tip sheet. A system.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', marginTop: '44px' }}>
            {TRUST.map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: '140px', maxWidth: '185px', textAlign: 'center', padding: '24px 14px', position: 'relative' }}>
                {i < TRUST.length - 1 && <span style={{ position: 'absolute', right: '-12px', top: '28px', fontSize: '1rem', color: 'var(--ink-light)' }}>→</span>}
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 13px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, lineHeight: 1, color: item.color }}>{item.letter}</span>
                </div>
                <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '6px' }}>{item.word}</div>
                <p style={{ fontSize: '.76rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '56px', alignItems: 'center' }}>
          <div>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--ink)', margin: '0 auto', boxShadow: '0 6px 28px rgba(143,191,159,.3)' }}>JP</div>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.3vw, 2.2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '15px' }}>
              I watched my daughter scroll for <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>three hours</em> and realised the conversation I was missing
            </h2>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '12px' }}>
              I'm Justin Phillips, founder of The Social Billboard and Guided Childhood. I'm not a researcher. I read the researchers. Then I built a platform that translates what they've found into something parents can actually use this week.
            </p>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '20px' }}>
              The problem isn't the phone. The problem is nobody gave parents a map. A law about social media doesn't give you one. Guided Childhood does.
            </p>
            <Link href="/starter-pack" className="btn btn-gold">Find my starting point →</Link>
          </div>
        </div>
      </section>

      {/* What changes */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8', textAlign: 'center' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--coral)', marginBottom: '12px' }}>What changes</p>
          <h2 style={{ marginBottom: '12px' }}>How this shows up <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>in your home</em></h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 44px' }}>You're solving today's problem in a way that builds capacity for tomorrow.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
            {[
              { num: '01', numColor: 'var(--green-lt)', title: 'The hard moments don\'t make you spiral', body: 'You have a framework, not a random tip. When the gaming fight happens, when the mood drops, when the unknown contact appears, you already know what to do.', tag: 'Framework not tips', tagStyle: { background: 'var(--green-lt)', color: 'var(--green-dark)' } },
              { num: '02', numColor: 'var(--coral-lt)', title: 'Your child starts building the actual skills', body: 'Resilience, self-regulation, digital literacy. Not because you went soft, but because you held the boundary and the connection at the same time.', tag: 'Skills not compliance', tagStyle: { background: 'var(--coral-lt)', color: 'var(--coral)' } },
              { num: '03', numColor: '#EFE9DF', title: 'You trust yourself as a parent', body: "Not because it got easy. Because you stopped needing it to be. The challenges change as they grow. Your approach doesn't have to.", tag: 'Confidence not certainty', tagStyle: { background: 'var(--gold-lt)', color: 'var(--gold-dark)' } },
            ].map((oc, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '32px 26px', border: '1px solid var(--border)', textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', fontWeight: 900, lineHeight: 1, marginBottom: '14px', color: oc.numColor }}>{oc.num}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px', lineHeight: 1.3 }}>{oc.title}</h3>
                <p style={{ fontSize: '.83rem', color: 'var(--ink-soft)', lineHeight: 1.72, marginBottom: '14px' }}>{oc.body}</p>
                <span style={{ ...oc.tagStyle, display: 'inline-flex', borderRadius: '100px', padding: '3px 10px', fontSize: '.63rem', fontWeight: 700 }}>{oc.tag}</span>
              </div>
            ))}
          </div>
          <Link href="/starter-pack" style={{ display: 'inline-block', background: 'var(--coral)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.9rem', padding: '14px 28px', borderRadius: '100px', textDecoration: 'none', border: 'none' }}>
            Find my starting point →
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p className="eyebrow" style={{ color: 'var(--coral)', marginBottom: '12px' }}>What parents say</p>
            <h2>It actually <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>works</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ color: 'var(--coral)', fontSize: '.9rem', letterSpacing: '2px', marginBottom: '10px' }}>★★★★★</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '12px' }}>{t.text}</p>
                <span style={{ fontSize: '.74rem', color: 'var(--ink-muted)', fontWeight: 600 }}>{t.by} <span style={{ background: 'var(--green-lt)', color: 'var(--green-dark)', borderRadius: '100px', padding: '2px 8px', fontSize: '.64rem', fontWeight: 700, marginLeft: '6px' }}>{t.stage}</span></span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 1.9vw, 1.7rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>No, it is not too late.</p>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', maxWidth: '420px', margin: '0 auto 22px', lineHeight: 1.78 }}>There are more school pickups, more car journeys, more evenings ahead of you than behind you. The pathway starts from wherever you are.</p>
            <Link href="/starter-pack" className="btn btn-gold">Find my starting point →</Link>
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>The research</p>
            <h2 style={{ marginBottom: '12px' }}>Built on evidence, <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>not panic</em></h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>Every child benefits from a guided digital childhood. The research tells us which children need it most urgently.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {RESEARCHERS.map((r, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '.88rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>{r.name}</h4>
                <div style={{ fontSize: '.68rem', color: 'var(--ink-muted)', marginBottom: '9px', fontWeight: 500 }}>{r.uni}</div>
                <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{r.finding}</p>
              </div>
            ))}
          </div>
          <div style={{ background: '#EFE9DF', borderRadius: '12px', padding: '24px', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px' }}>Our thesis in plain language</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px' }}>
              {['Social media amplifies existing vulnerabilities. It does not harm all children equally.', 'Environment and structure are more protective than any restriction or ban alone.', 'Ages 11 to 13 require the most care, especially for girls. That is exactly what Stage 3 is for.', 'Staged, graduated access with education builds the skills children need at 16.'].map((pt, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--green-dark)', fontWeight: 700, flexShrink: 0 }}>•</span>
                  {pt}
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--gold-lt)', padding: '26px 24px', textAlign: 'center' }}>
            <p className="eyebrow" style={{ color: 'var(--gold-dark)', marginBottom: '8px' }}>Free · 5 minutes · No signup needed</p>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '8px' }}>Not sure where to start? The tool will tell you.</h3>
            <p style={{ fontSize: '.86rem', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 16px' }}>Answer questions about what's happening at home. TV routines, gaming, sleep, mood, social media access. The Digital Health Check shows you where the gaps are and gives you a personalised starting point.</p>
            <Link href="/digitalwellbeing" className="btn btn-gold">Take the free Digital Health Check →</Link>
          </div>
        </div>
      </section>

      {/* Policy strip */}
      <div style={{ background: '#EFE9DF', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
        {['Online Safety Act 2023', 'Education for a Connected World (DfE)', 'Statutory RSE and Health Education', 'Ofcom Media Literacy Framework', 'DfE AI in Education Guidance 2025'].map((item, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 18px', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-soft)', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0, display: 'inline-block' }} />
            {item}
          </div>
        ))}
      </div>

      {/* Schools crossover */}
      <section id="teachers" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: 'var(--green-lt)', borderTop: '1px solid #D3ECD9', borderBottom: '1px solid #D3ECD9', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>For schools</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.2rem)', marginBottom: '12px' }}>Not just safety.<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>Full digital education.</em></h2>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '12px' }}>Most school programmes cover what to do when something goes wrong. Guided Childhood covers everything before that moment and everything that comes after.</p>
            <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '20px' }}>Screen behaviour, routines, every online risk, digital literacy, AI, and full readiness at 16. EYFS to Sixth Form. Every lesson comes with a parent note so school work extends into the home.</p>
            <Link href="/schools" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--green-dark)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.88rem', padding: '13px 24px', borderRadius: '12px', textDecoration: 'none' }}>
              See the full school programme →
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '26px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: '14px' }}>What the school curriculum covers</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {['Screen behaviour, routines, and emotional regulation', 'Grooming, manipulation, consent, and online strangers', 'Sextortion, radicalisation, and dark web awareness', 'Misinformation, deepfakes, and AI-generated content', 'Algorithms, social media, privacy, digital reputation', 'AI literacy, data rights, full readiness at 16', 'Parent note with every single lesson'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '9px', fontSize: '.82rem', color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--green-dark)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', fontSize: '.72rem', color: 'var(--ink-muted)' }}>
              Mapped to RSE, Online Safety Act, Education for a Connected World, and Ofsted requirements.
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>Simple pricing</p>
            <h2>Start free. Stay as long<br />as you <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>need.</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.08fr 1fr', gap: '12px' }}>
            {[
              {
                tier: 'Free forever', name: 'Starter Pack', price: 'Free', period: '', save: 'Yours immediately on sign-up',
                features: [['✓', true, 'Age-stage roadmap'], ['✓', true, 'Family digital agreement template'], ['✓', true, '5 conversation scripts'], ['✓', true, 'Warning signs checklist'], ['✓', true, 'Age restrictions guide']],
                cta: 'Get Free Pack', href: '/starter-pack', ctaClass: 'bp-out',
                style: {},
              },
              {
                tier: 'Most popular', name: 'Guided Childhood OS', price: '£12.99', period: '/month', save: 'First 50 members: lock in £7.99/month for life.',
                features: [['✓', true, 'Full 5-stage dashboard'], ['✓', true, 'Weekly 3-action plan'], ['✓', true, 'All scripts and guides'], ['✓', true, 'Full curriculum, all lessons'], ['✓', true, 'Digital wellbeing tracker'], ['✓', false, 'DiGi AI advisor, unlimited'], ['✓', false, 'School lesson packs included']],
                cta: 'Start now', href: '/join', ctaClass: 'bp-coral',
                style: { background: '#EFE9DF', borderColor: 'rgba(212,96,10,0.25)', transform: 'scale(1.025)' },
              },
              {
                tier: 'Best value', name: 'Annual OS', price: '£99', period: '/year', save: 'Save £57. Two months free.',
                features: [['✓', true, 'Everything in monthly'], ['✓', true, 'Multi-child profiles'], ['✓', true, 'Priority DiGi access'], ['✓', true, 'School pack downloads']],
                cta: 'Start now', href: '/join', ctaClass: 'bp-green',
                style: {},
              },
            ].map((plan, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '26px', display: 'flex', flexDirection: 'column', ...plan.style }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px', minHeight: '2em' }}>{plan.tier}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-.01em', color: 'var(--ink)', marginBottom: '14px', minHeight: '2.6em', display: 'flex', alignItems: 'flex-start' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '4px' }}>
                  {plan.period && <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>£</span>}
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{plan.price.replace('£','')}</span>
                  <span style={{ fontSize: '.76rem', color: 'var(--ink-muted)' }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: '.71rem', color: 'var(--green-dark)', fontWeight: 700, marginBottom: '18px', minHeight: '16px' }}>{plan.save}</div>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 16px' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px', flex: 1 }}>
                  {plan.features.map(([check, isGreen, label], fi) => (
                    <li key={fi} style={{ display: 'flex', gap: '8px', fontSize: '.8rem', color: 'var(--ink-soft)', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 900, fontSize: '.73rem', marginTop: '2px', flexShrink: 0, color: isGreen ? 'var(--green-dark)' : 'var(--coral)' }}>{check}</span>
                      {label}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{
                  width: '100%', marginTop: 'auto', padding: '13px', borderRadius: '14px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.82rem', cursor: 'pointer', transition: 'all .18s', textDecoration: 'none', display: 'block', textAlign: 'center',
                  ...(plan.ctaClass === 'bp-out' ? { background: 'transparent', color: 'var(--ink)', border: '2px solid var(--border)' } : plan.ctaClass === 'bp-coral' ? { background: 'var(--coral)', color: '#fff', border: 'none' } : { background: 'var(--green)', color: 'var(--ink)', border: 'none' }),
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          {/* Founder bar */}
          <div style={{ background: 'var(--coral-lt)', border: '1px solid rgba(212,96,10,0.25)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>Founder Rate: First 50 Members Only</h4>
              <p style={{ fontSize: '.8rem', color: 'var(--ink-soft)' }}>Lock in <strong>£7.99/month for life</strong>. Places are limited to the first 50 members.</p>
            </div>
            <Link href="/starter-pack" style={{ background: 'var(--coral)', color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.8rem', padding: '10px 22px', borderRadius: '100px', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-block' }}>
              Claim Founder Rate
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: '#FDFBF8' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p className="eyebrow" style={{ color: 'var(--green-dark)', marginBottom: '12px' }}>Common questions</p>
            <h2>And in case you are <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--coral)' }}>wondering</em></h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 32px', background: 'var(--green)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3.2rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.03em', marginBottom: '14px', lineHeight: 1.1 }}>
            Ready to start?<br />Pick <em style={{ fontStyle: 'italic', fontWeight: 300 }}>your</em> path.
          </h2>
          <p style={{ fontSize: '.97rem', color: 'var(--ink-soft)', lineHeight: 1.78, marginBottom: '28px' }}>131 parents already on the pathway. Find your starting point in 2 minutes, or grab the free starter pack and begin tonight.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '11px' }}>
            <Link href="/starter-pack" style={{ display: 'inline-block', background: 'var(--ink)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.9rem', padding: '14px 28px', borderRadius: '100px', textDecoration: 'none' }}>
              Find my starting point →
            </Link>
            <Link href="/starter-pack" style={{ display: 'inline-block', background: 'rgba(255,255,255,.3)', border: '1.5px solid rgba(28,26,20,.15)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.9rem', padding: '14px 28px', borderRadius: '100px', textDecoration: 'none' }}>
              Get the free starter pack
            </Link>
          </div>
          <div style={{ fontSize: '.71rem', color: 'var(--ink-muted)', marginBottom: '14px' }}>No card. No catch. Start where you are.</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,.4)', border: '1px solid rgba(28,26,20,.1)', borderRadius: '100px', padding: '6px 14px', fontSize: '.7rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
            ✓ 30-day money-back guarantee on launch
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#FDFBF8', borderTop: '1px solid var(--border)', padding: '36px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '.86rem', fontWeight: 700, color: 'var(--ink-muted)' }}>Guided Childhood · The OS for Modern Parenting</div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Find Your Stage', '#stages'], ['Schools', '/schools'], ['Pricing', '#pricing'], ['Health Check', '/digitalwellbeing'], ['Free Starter Pack', '/starter-pack'], ['Login', '/login']].map(([label, href]) => (
              <Link key={href + label} href={href} style={{ fontSize: '.73rem', color: 'var(--ink-muted)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--ink-light)' }}>© 2026 The Social Billboard · Justin Phillips</div>
        </div>
      </footer>
    </div>
  )
}
