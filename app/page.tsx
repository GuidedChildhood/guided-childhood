import Link from 'next/link'
import Image from 'next/image'
import AnnouncementBar from '@/components/marketing/AnnouncementBar'
import FaqAccordion from '@/components/marketing/FaqAccordion'
import FlipCards from '@/components/marketing/FlipCards'

// ── Stage definitions ────────────────────────────────────────────────────────

const STAGES = [
  {
    num: '01', name: 'Foundation', ks: 'EYFS and KS1', ages: 'Ages 4 to 7',
    device: 'Shared screen',
    tags: ['TV routines', 'Co-viewing', 'No solo device'],
    quote: '"I cannot get my four-year-old off the iPad. What am I doing wrong?"',
    bg: 'var(--stage-1)', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)',
  },
  {
    num: '02', name: 'First Steps', ks: 'KS2 · Yr 3 to 5', ages: 'Ages 8 to 10',
    device: 'Restricted phone',
    tags: ['After-school TV', 'Gaming time', 'Boredom'],
    quote: '"The moment he walks in from school it is TV or gaming. I cannot break the cycle."',
    bg: 'var(--stage-2)', bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)',
  },
  {
    num: '03', name: 'Explorer', ks: 'KS2/KS3 · Yr 6 to 8', ages: 'Ages 11 to 13',
    device: 'Guided smartphone',
    tags: ['Mood after screens', 'Sleep rules', 'Workarounds'],
    quote: '"Her mood drops every time she puts her phone down. I am worried."',
    bg: 'var(--stage-3)', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)',
    critical: true,
  },
  {
    num: '04', name: 'Navigator', ks: 'KS3/KS4 · Yr 9 to 10', ages: 'Ages 13 to 15',
    device: 'Monitored social',
    tags: ['VPNs', 'Unknown accounts', 'Reputation'],
    quote: '"He has accounts I do not know about. What do I do?"',
    bg: 'var(--stage-4)', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)',
  },
  {
    num: '05', name: 'Independent', ks: 'KS4/KS5 · Yr 11+', ages: 'Ages 16+',
    device: 'Trust-based',
    tags: ['Full access', 'AI literacy', 'Readiness'],
    quote: '"She is 16 next month. I have no idea if she is ready."',
    bg: 'var(--stage-5)', bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)',
  },
]

// ── Flipping Placard data ────────────────────────────────────────────────────

const PLACARDS = [
  {
    frontLabel: 'Every morning',
    front: '"They will not get off their device to get ready for school. Every single morning is a fight and I am exhausted by 8am."',
    backLabel: 'What actually fixes this',
    back: 'You are not losing control. Willpower is lowest in the morning for everyone, including them. The fix is structural, not stricter. Tonight, move the device outside the bedroom. Say: "Screens start after shoes and bag are done. One week, then we review." The structure does the work so you do not have to argue.',
    bg: 'var(--stage-1)',
    stage: 'Stage 1 to 3 · Ages 4 to 13',
  },
  {
    frontLabel: 'After school',
    front: '"She comes straight home and the TV goes on immediately. If I say no it is a meltdown. I cannot break this cycle no matter what I try."',
    backLabel: 'What actually fixes this',
    back: 'She is not being difficult. She is decompressing the only way she has been taught. Say: "Before the TV goes on, let us do the five things: shoes away, bag on hook, snack, five minutes outside, then TV." Say it once, warmly. Hold it the same way every day. The routine replaces the demand within two weeks.',
    bg: 'var(--stage-2)',
    stage: 'Stage 2 · Ages 8 to 10',
  },
  {
    frontLabel: 'Homework fight',
    front: '"He says he is doing homework on his laptop. He is watching YouTube. Nothing gets done and he lies about it."',
    backLabel: 'What actually fixes this',
    back: 'He is not lazy. Every human brain chooses stimulating content over hard work when both are available. Homework and a device cannot share the same room. Say: "Homework goes in here. Phone goes on the kitchen counter. Thirty minutes focused, then it comes back." Phone out of sight. Not just face-down.',
    bg: 'var(--stage-3)',
    stage: 'Stage 2 to 3 · Ages 8 to 13',
  },
  {
    frontLabel: 'Dinner table',
    front: '"Dinner is everyone on their phone. Nobody talks. I feel invisible in my own family and I do not know how to change it."',
    backLabel: 'What actually fixes this',
    back: 'You cannot ask your child to put their phone down while yours is on the table. The rule only holds when you follow it first. Say: "Dinner is phone-free for all of us, including me." Then do it. Every night for one month. Shared rules hold. Rules aimed only at children do not.',
    bg: 'var(--stage-4)',
    stage: 'All stages',
  },
  {
    frontLabel: 'Mood crash',
    front: '"Her mood after she comes off her phone is awful. Flat, snappy, impossible to reach. I do not know if the phone is causing this or if it is just her."',
    backLabel: 'What actually fixes this',
    back: 'The research says yes, it is the phone. A mood drop after screens is a tracked signal, particularly for girls aged 11 to 13. The phone creates a contrast effect: real life feels flat after the stimulation. Say: "I notice you seem low after your phone time. I am not upset, I want to understand it with you." Track it for two weeks. The pattern becomes the conversation.',
    bg: 'var(--stage-5)',
    stage: 'Stage 3 · Critical window · Ages 11 to 13',
  },
  {
    frontLabel: 'Bedtime every night',
    front: '"He will not hand over his phone at bedtime. Every single night the same argument. I dread it."',
    backLabel: 'What actually fixes this',
    back: 'You are not overreacting. Blue light delays sleep onset by 90 minutes and teenagers need 9 hours. The argument is not about the phone. It is about the bedroom. Say: "The phone charges in the hallway overnight. Not as punishment. This is the rule for the whole house including me." Make it structural tonight. There is no argument when there is no decision to make.',
    bg: 'var(--stage-1)',
    stage: 'Stage 2 to 4 · Ages 8 to 15',
  },
  {
    frontLabel: 'I keep shouting',
    front: '"I lose patience every time. I end up shouting. I feel guilty. And tomorrow the exact same thing happens again."',
    backLabel: 'What actually fixes this',
    back: 'You are not a bad parent. You are a parent without a script for a problem that did not exist when you were a child. Guilt after shouting means you care. Say nothing tonight except: "I am sorry I shouted earlier. Tomorrow we try again." Then use DiGi to get the exact words before the next moment happens. You do not lose patience when you already know what to say.',
    bg: 'var(--stage-2)',
    stage: 'All stages',
  },
  {
    frontLabel: 'TikTok request',
    front: '"She is 13 and asking for TikTok. All her friends have it. I have no idea what to say and I do not want to damage our relationship."',
    backLabel: 'What actually fixes this',
    back: 'The answer is not yes or no. It is a conversation you have before she gets access. Say: "Show me how it works. I want to understand what you want it for." Spend 20 minutes watching it together, not to judge but to understand. The conversation you have now is more protective than any parental control. Most harms come from platforms accessed in secret because this conversation never happened.',
    bg: 'var(--stage-3)',
    stage: 'Stage 3 · Ages 11 to 13',
  },
  {
    frontLabel: 'Gaming meltdown',
    front: '"When I turn off the game he screams and cries. He cannot regulate himself at all. I feel like I cannot win either way."',
    backLabel: 'What actually fixes this',
    back: 'He is not manipulating you. He is genuinely dysregulated. Games are engineered to maximise emotional investment at the exact moment you ask him to stop. Say: "Five more minutes, then we wind down." Give the warning before the moment, not during it. Then follow through the same way every time. Predictable endings end the meltdowns. Unpredictable endings create them.',
    bg: 'var(--stage-1)',
    stage: 'Stage 2 to 3 · Ages 7 to 12',
  },
  {
    frontLabel: 'Bored immediately',
    front: '"The second I take the screen away they say they are bored. Within two minutes. Every single time."',
    backLabel: 'What actually fixes this',
    back: 'That is not boredom. That is withdrawal. Their brain is calibrated to expect constant stimulation. Real boredom, the kind that leads to creativity, takes 20 minutes to kick in. Say: "I know it feels boring right now. That feeling passes and you do not need me to fix it." Then do not fix it. Tolerate the discomfort alongside them. The boredom itself is the skill being built.',
    bg: 'var(--stage-2)',
    stage: 'All stages · Ages 5 to 13',
  },
  {
    frontLabel: 'Secret accounts',
    front: '"I found apps on his phone I did not know about. I do not know whether to confront him or pretend I did not see."',
    backLabel: 'What actually fixes this',
    back: 'Confront it, but not as a police investigation. Secrecy is the real risk. The apps are the symptom. Say: "I found something on your phone. I am not angry. I want to understand." Ask what he uses it for before you react. How you handle this moment determines whether he tells you the next thing. Curiosity first. Consequences after you understand.',
    bg: 'var(--stage-4)',
    stage: 'Stage 3 to 4 · Ages 11 to 15',
  },
  {
    frontLabel: 'Sleep ruined',
    front: '"She is exhausted every morning. I think she is on her phone in bed but I cannot catch her doing it."',
    backLabel: 'What actually fixes this',
    back: 'You do not need to catch her. You need to remove the opportunity. The bedroom phone is the single highest-impact change in all the research on children and sleep. Say: "The phone charges in the hallway from tonight. Not because I do not trust you. Because sleep is not optional and this rule is not either." One structural change. More impact than any conversation or app timer.',
    bg: 'var(--stage-5)',
    stage: 'Stage 2 to 4 · Ages 8 to 15',
  },
  {
    frontLabel: 'Body image worry',
    front: '"I am worried about what she is seeing on Instagram. Her relationship with her body has changed since she got her phone."',
    backLabel: 'What actually fixes this',
    back: 'You are right to worry. Research shows Instagram use correlates with body dissatisfaction in girls aged 11 to 13 more than any other platform. The conversation to have is not about the app. It is about the algorithm. Say: "The app shows you things to keep you looking, not because they are true or normal. Let me show you how it actually works." Understanding the mechanic is more protective than removing the app.',
    bg: 'var(--stage-3)',
    stage: 'Stage 3 · Critical window · Ages 11 to 13',
  },
]

// ── Walkthroughs ─────────────────────────────────────────────────────────────

const WALKTHROUGHS = [
  {
    stage: 'Stage 2 · Ages 8 to 10',
    problem: '"He walks in from school and the TV has to go on immediately. Every single day. If I say no, it is a meltdown."',
    solution: 'Children use screens to decompress because they have not learned another way to transition. The fix is not a ban. It is a 20-minute wind-down routine you introduce once, with a script, so it does not become a fight every evening.',
    tags: ['Transition script', 'Weekly action', 'DiGi support'],
  },
  {
    stage: 'Stage 3 · Ages 11 to 13',
    problem: '"Her mood after she comes off her phone is awful. Flat, she snaps. I do not know if the phone is doing this or if it is just her."',
    solution: 'Research identifies ages 11 to 13 as the peak sensitivity window for girls. The mood drop is a real signal, not just teenage behaviour. The weekly check-in tracks it. The Stage 3 guide gives you the conversation to have before it becomes a pattern.',
    tags: ['Mood tracker', 'Stage 3 guide', 'Research context'],
  },
  {
    stage: 'Stage 4 · Ages 13 to 15',
    problem: '"I found out he has been using a VPN to get around the parental controls. I do not know where to start."',
    solution: 'A workaround is not a technology problem. It is a trust conversation. The Stage 4 script walks you through how to respond without destroying the relationship or ignoring the behaviour, so you address the breach without making secrecy the new normal.',
    tags: ['Trust script', 'Stage 4 guide'],
  },
  {
    stage: 'Stage 5 · Age 16',
    problem: '"She turns 16 in two months. She will have full access to everything. I have no idea if she is actually ready."',
    solution: 'If you have been on the pathway since Stage 1 or 2, the readiness checklist at Stage 5 is a confirmation, not a starting point. If you are starting now, Stage 5 builds the specific skills needed in the months before full access. No cliff edge.',
    tags: ['Readiness checklist', 'The 16 conversation'],
  },
]

// ── 20 issues ────────────────────────────────────────────────────────────────

const BEHAVIOUR_ISSUES = [
  'Coming home from school and demanding the TV on immediately. Every single day.',
  'Bedtime becoming a battle. Devices in the bedroom until midnight or later.',
  'Mealtimes hijacked. Phone on the table, eyes down, nobody talking.',
  'Morning routines falling apart. Screens replacing breakfast and getting ready.',
  '"I am bored." Said the moment any screen is removed. Within minutes.',
  'Homework being avoided. Screens as the reason nothing gets done.',
  'Reading replaced. Books untouched. Passive scrolling instead.',
  'Gaming obsession. Hours disappearing. Meltdowns when it is stopped.',
  'Mood crashes after screens. Flat, snappy, difficult to reach.',
  'Family time replaced by everyone on their own device.',
  'Snacking and junk food linked to passive screen time.',
  'Rules being tested constantly. Fights about the same things every week.',
]

const DIGITAL_GAPS = [
  'No idea how algorithms work or what they are being shown and why.',
  'Social media before you agreed to it. Through a friend\'s account or a VPN.',
  'Cannot spot misinformation or AI-generated content.',
  'No sense of digital reputation or what stays online permanently.',
  'Group chats and messaging apps you do not know about.',
  'Privacy settings never touched. Personal information freely shared.',
  'Online friendships with no safety framework or sense of risk.',
  'Not ready for the full digital autonomy they will have at 16.',
]

// ── TRUST method ─────────────────────────────────────────────────────────────

const TRUST = [
  { letter: 'T', word: 'Timing', desc: 'Right device at the right age. Not all-or-nothing. Not a cliff edge.', bg: 'var(--stage-1)', color: 'var(--stage-1-text)' },
  { letter: 'R', word: 'Relationships', desc: 'Connection is the strongest protective factor the research has found.', bg: 'var(--stage-2)', color: 'var(--stage-2-text)' },
  { letter: 'U', word: 'Upstream', desc: 'Environment before rules. Platform mechanics matter more than willpower.', bg: 'var(--stage-5)', color: 'var(--stage-5-text)' },
  { letter: 'S', word: 'Sleep', desc: 'The bedroom rule is the single highest-impact action in this system.', bg: 'var(--stage-3)', color: 'var(--stage-3-text)' },
  { letter: 'T', word: 'Transparency', desc: 'Openness over secrecy. Co-navigation over monitoring.', bg: 'var(--stage-4)', color: 'var(--stage-4-text)' },
]

// ── Researchers ──────────────────────────────────────────────────────────────

const RESEARCHERS = [
  { name: 'Prof. Candace Odgers', uni: 'UC Irvine · Duke University', finding: 'Effects depend on vulnerability and environment, not just the device. Structure is protective.' },
  { name: 'Dr. Amy Orben', uni: 'Cambridge MRC · Oxford', finding: 'Developmental sensitivity windows: 11 to 13 for girls, 14 to 15 for boys. These are the stages we protect most carefully.' },
  { name: 'Prof. Andrew Przybylski', uni: 'Oxford Internet Institute', finding: 'The Goldilocks effect. Moderate use is not inherently harmful. Too much, too early, structured wrong: that is where risk lives.' },
  { name: 'Prof. Sonia Livingstone', uni: 'LSE, London', finding: 'Children need skills and agency, not just restrictions. Every stage builds graduated digital skills.' },
]

// ── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { text: '"I used to spiral every time the phone conversation came up. Now I have the exact words. It changed how we talk about it completely."', by: 'Sarah M.', stage: 'Stage 3', initials: 'SM' },
  { text: '"The weekly check-in is the thing I did not know I needed. I spotted something shifting in my son before it became a real problem."', by: 'Tom K.', stage: 'Stage 4', initials: 'TK' },
  { text: '"My daughter and I are actually talking about this stuff now. DiGi gave me the language and the pathway gave me the confidence."', by: 'Clare H.', stage: 'Stage 3', initials: 'CH' },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ background: '#fff', overflowX: 'hidden' }}>

      <AnnouncementBar />

      {/* ================================================================
          NAV
          ================================================================ */}
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
        background: 'rgba(255,255,255,.96)',
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
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '16px' }}>
              {[5, 9, 14, 8].map((h, i) => (
                <div key={i} style={{ width: '3px', height: `${h}px`, background: '#fff', borderRadius: '1.5px' }} />
              ))}
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.03em' }}>
            Guided Childhood
          </span>
        </Link>

        <nav className="nav-links-desktop">
          {[['Find Your Stage', '#stages'], ['How It Works', '#how-it-works'], ['For Schools', '/schools'], ['Pricing', '#pricing']].map(([label, href]) => (
            <Link key={href} href={href} style={{
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '.84rem',
              fontWeight: 600,
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
          Get Started
        </Link>
      </header>

      {/* ================================================================
          HERO — Good Inside split: left text, right floating chips
          ================================================================ */}
      <section aria-label="Hero" style={{ padding: 'clamp(56px, 7vw, 88px) 32px clamp(48px, 6vw, 80px)', background: '#FFFBEE' }}>
        <div className="hero-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Left: text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--terracotta)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff' }}>
                For UK parents · Ages 4 to 16
              </span>
            </div>
            <h1 className="fu" style={{ fontSize: 'clamp(2.4rem, 4.8vw, 3.9rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-.04em', color: 'var(--ink)', marginBottom: '22px' }}>
              Raising kids<br />with screens<br />
              <span style={{ color: 'var(--terracotta)' }}>is something you can learn.</span>
            </h1>
            <p className="fu" style={{ fontSize: '1.02rem', color: 'var(--ink-soft)', lineHeight: 1.78, maxWidth: '440px', marginBottom: '28px' }}>
              The stage by stage guide, exact scripts for the hard moments, and DiGi, your AI parenting advisor available at 11pm.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <span style={{ color: '#F59E0B', letterSpacing: '2px', fontSize: '.95rem' }}>★★★★★</span>
              <span style={{ fontSize: '.8rem', color: 'var(--ink-muted)', fontWeight: 600 }}>200 parents already on their pathway</span>
            </div>
            <div className="fu" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
              <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '16px 36px' }}>
                Get free starter pack
              </Link>
              <Link href="#stages" style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}>
                Find your stage →
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Online Safety Act 2023', 'DfE', 'Statutory RSE', 'Ofcom'].map(tag => (
                <span key={tag} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px 12px', fontSize: '.66rem', fontWeight: 700, color: 'var(--ink-muted)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Two Edukids-style photo shape cards */}
          <div className="hero-chips" style={{ position: 'relative', height: '480px' }}>

            {/* Decorative dotted connector */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 460 480" fill="none" aria-hidden="true">
              <path d="M120 310 Q230 360 340 190" stroke="rgba(0,0,0,0.1)" strokeWidth="2.5" strokeDasharray="7 5" fill="none"/>
              <circle cx="120" cy="310" r="5" fill="#A8D87C" opacity="0.8"/>
              <circle cx="340" cy="190" r="5" fill="#FECDD3" opacity="0.8"/>
            </svg>

            {/* Card 1: Mum and daughter co-viewing, Ages 4 to 10 */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '215px',
              height: '315px',
              background: '#A8D87C',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 12px 52px rgba(0,0,0,0.16)',
              zIndex: 1,
            }}>
              <Image
                src="https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260630_084108_484031e7-fad8-4b2f-8cff-0b6816f84a8f.png"
                alt="Mother and daughter co-viewing on a tablet"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="215px"
              />
              {/* Overlay gradient at bottom */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100px',
                background: 'linear-gradient(to top, rgba(168,216,124,0.92) 0%, transparent 100%)',
              }} />
              {/* Stage badge */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '100px',
                padding: '5px 12px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#2D5016',
                letterSpacing: '0.06em',
              }}>
                Stage 1 and 2
              </div>
              {/* Bottom label */}
              <div style={{
                position: 'absolute',
                bottom: '18px',
                left: '14px',
                right: '14px',
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.92)',
                  borderRadius: '10px',
                  padding: '7px 11px',
                  fontSize: '10px',
                  color: '#2D5016',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}>
                  Co-viewing · Ages 4 to 10
                </div>
              </div>
            </div>

            {/* Card 2: Teen girl on phone, Ages 11 to 16 */}
            <div style={{
              position: 'absolute',
              top: '85px',
              right: '0',
              width: '215px',
              height: '345px',
              background: '#FECDD3',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 12px 52px rgba(0,0,0,0.16)',
              zIndex: 2,
            }}>
              <Image
                src="https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260630_084109_eb560b3a-3d67-4248-8488-fa78dfb4474f.png"
                alt="Teenage girl scrolling on her smartphone"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="215px"
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100px',
                background: 'linear-gradient(to top, rgba(254,205,211,0.92) 0%, transparent 100%)',
              }} />
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '100px',
                padding: '5px 12px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#881337',
                letterSpacing: '0.06em',
              }}>
                Stage 3 to 5
              </div>
              <div style={{
                position: 'absolute',
                bottom: '18px',
                left: '14px',
                right: '14px',
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.92)',
                  borderRadius: '10px',
                  padding: '7px 11px',
                  fontSize: '10px',
                  color: '#881337',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}>
                  Social media · Ages 11 to 16
                </div>
              </div>
            </div>

            {/* Floating badge: Critical window */}
            <div style={{
              position: 'absolute',
              bottom: '36px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#fff',
              borderRadius: '16px',
              padding: '12px 18px',
              boxShadow: '0 4px 24px rgba(26,26,46,0.18)',
              border: '1.5px solid var(--border)',
              whiteSpace: 'nowrap',
              zIndex: 3,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--terracotta)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>
                Critical window
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                Stage 3 · Ages 11 to 13
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================
          STATS — dark navy strip, large white numbers
          ================================================================ */}
      <section style={{ background: '#1A1A2E' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { num: '200',  label: 'Families on their pathway' },
            { num: '5',    label: 'Stages from age 4 to 16' },
            { num: '12',   label: 'Daily situations with scripts' },
            { num: '2027', label: 'Social media ban. Start now.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '36px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '8px', letterSpacing: '-.04em' }}>
                {s.num}
              </div>
              <div style={{ fontSize: '.74rem', color: 'rgba(255,255,255,.55)', fontWeight: 600, lineHeight: 1.4, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          STAGE PATHWAY WALKTHROUGH — tree / journey visual
          ================================================================ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 32px', background: '#FFFBEE', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The guided pathway</p>
            <h2 style={{ marginBottom: '14px' }}>
              From first screen to{' '}
              <span style={{ color: 'var(--terracotta)' }}>digital independence</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
              Each stage has different risks, different conversations, and different boundaries. You never skip ahead. You never fall behind. The platform grows with your child.
            </p>
          </div>

          {/* Pathway cards — desktop: 5 columns, mobile: vertical scroll */}
          <div style={{ position: 'relative' }}>

            {/* Gradient connector line (desktop only) */}
            <div style={{
              position: 'absolute',
              top: '88px',
              left: 'calc(10% + 8px)',
              right: 'calc(10% + 8px)',
              height: '3px',
              background: 'linear-gradient(90deg, var(--stage-1-bold), var(--stage-2-bold), var(--stage-3-bold), var(--stage-4-bold), var(--stage-5-bold))',
              borderRadius: '2px',
              zIndex: 0,
            }} className="hide-mobile" />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px',
              position: 'relative',
              zIndex: 1,
            }} className="pathway-grid">
              {STAGES.map((s, i) => {
                const STAGE_IMGS = [
                  'hf_20260630_084110_ac9ec982-d093-403a-82c8-57c07d87cdcf.png',
                  'hf_20260630_084111_92dd968e-fd25-43a1-9712-c3b37e73dbfc.png',
                  'hf_20260630_084113_c8fcfab7-ac40-4486-88e1-4ae849574bf9.png',
                  'hf_20260630_084114_b45f784f-0707-4323-9719-654a35ec847a.png',
                  'hf_20260630_084115_570aea40-97a8-458c-b11b-accf13458643.png',
                ]
                const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'
                return (
                  <Link key={s.num} href="/starter-pack" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      background: '#fff',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      border: '1px solid rgba(0,0,0,0.04)',
                    }}>

                      {/* Photo area */}
                      <div style={{
                        background: s.bold,
                        height: '132px',
                        position: 'relative',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}>
                        <Image
                          src={`${CDN}${STAGE_IMGS[i]}`}
                          alt={s.name}
                          fill
                          style={{ objectFit: 'cover', objectPosition: 'center top' }}
                          sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 20vw"
                        />
                        {/* Stage number dot */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '26px',
                          height: '26px',
                          background: 'rgba(255,255,255,0.82)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 900,
                          fontFamily: 'var(--font-display)',
                          color: s.text,
                          zIndex: 1,
                        }}>
                          {i + 1}
                        </div>
                        {s.critical && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(0,0,0,0.16)',
                            borderRadius: '100px',
                            padding: '3px 8px',
                            fontSize: '8px',
                            fontWeight: 700,
                            color: s.text,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            zIndex: 1,
                          }}>
                            Critical
                          </div>
                        )}
                      </div>

                      {/* Card content */}
                      <div style={{ padding: '14px 14px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '3px' }}>
                          {s.ages}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                          {s.name}
                        </div>
                        <span style={{ display: 'inline-block', background: s.bg, color: 'var(--ink-soft)', borderRadius: '100px', padding: '2px 8px', fontSize: '10px', fontWeight: 600, marginBottom: '8px', alignSelf: 'flex-start' }}>
                          {s.device}
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: 'auto' }}>
                          {s.tags.slice(0, 2).map(t => (
                            <span key={t} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '2px 7px', fontSize: '9px', color: 'var(--ink-soft)', fontWeight: 600 }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '14px', padding: '15px 32px' }}>
              Find your stage
            </Link>
            <p style={{ fontSize: '.76rem', color: 'var(--ink-muted)', marginTop: '12px' }}>
              Multiple children at different stages? One account covers all of them.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          STAGE CARDS
          ================================================================ */}
      <section id="stages" style={{ padding: 'clamp(88px, 11vw, 132px) 32px', background: '#F5F3FF', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The five stages</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>Where is your child right now?</h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
              Every stage has different risks, different conversations, and different boundaries. Start where your child is. The platform grows with them so you are never behind and never guessing.
            </p>
          </div>

          <div className="stages-grid">
            {STAGES.map(s => (
              <div key={s.num} className="fu" style={{
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 32px rgba(26,26,46,0.07)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>

                {/* Apple-style large coloured header */}
                <div style={{
                  background: s.bold,
                  padding: '28px 24px 22px',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '.54rem',
                    fontWeight: 700,
                    letterSpacing: '.18em',
                    textTransform: 'uppercase',
                    color: s.text,
                    opacity: 0.65,
                    display: 'block',
                    marginBottom: '8px',
                  }}>
                    Stage {s.num}
                  </span>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: s.text,
                    letterSpacing: '-.035em',
                    lineHeight: 1.0,
                    marginBottom: '6px',
                  }}>
                    {s.name}
                  </h3>
                  <div style={{
                    fontSize: '.73rem',
                    fontWeight: 600,
                    color: s.text,
                    opacity: 0.72,
                  }}>
                    {s.ages}
                  </div>
                  {s.critical && (
                    <span style={{
                      position: 'absolute',
                      top: '18px',
                      right: '16px',
                      background: 'rgba(0,0,0,0.16)',
                      borderRadius: '100px',
                      padding: '3px 10px',
                      fontSize: '.52rem',
                      fontWeight: 700,
                      color: s.text,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                    }}>
                      Critical
                    </span>
                  )}
                </div>

                {/* White body */}
                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '10px' }}>{s.ks}</div>

                  <span style={{
                    background: s.bg,
                    color: 'var(--ink-soft)',
                    display: 'inline-flex',
                    borderRadius: '100px',
                    padding: '3px 10px',
                    fontSize: '.6rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    alignSelf: 'flex-start',
                  }}>
                    {s.device}
                  </span>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                    {s.tags.map(t => (
                      <span key={t} style={{
                        background: 'var(--cream)',
                        border: '1px solid var(--border)',
                        borderRadius: '100px',
                        padding: '2px 8px',
                        fontSize: '.61rem',
                        color: 'var(--ink-soft)',
                        fontWeight: 600,
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '.82rem',
                    fontStyle: 'italic',
                    color: 'var(--ink)',
                    lineHeight: 1.55,
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)',
                    marginBottom: '14px',
                  }}>
                    {s.quote}
                  </p>

                  <Link href="/starter-pack" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.72rem',
                    fontWeight: 700,
                    color: s.text,
                    background: s.bold,
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-.01em',
                    textDecoration: 'none',
                    boxShadow: '0 3px 0 rgba(0,0,0,.13)',
                  }}>
                    Start here
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--ink-muted)', marginTop: '24px' }}>
            Multiple children? One account covers all of them.
          </p>
        </div>
      </section>

      {/* ================================================================
          FEATURES — 3 cards on sage green
          ================================================================ */}
      <section style={{ background: '#F0FDF4', padding: 'clamp(72px, 9vw, 112px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What you get</p>
            <h2 className="fu">
              Our <span style={{ color: 'var(--terracotta)' }}>digital parenting</span> tools
            </h2>
          </div>
          <div className="three-col">
            {([
              {
                iconBg: 'var(--stage-1-bold)',
                title: 'Stage by Stage Guide',
                body: 'The right boundaries and conversations for your child\'s exact age. From first screen at 4 to full independence at 16. You never fall behind.',
                svg: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4V7z"/>
                    <line x1="9" y1="3" x2="9" y2="17"/>
                    <line x1="15" y1="7" x2="15" y2="21"/>
                  </svg>
                ),
              },
              {
                iconBg: 'var(--terracotta)',
                title: 'DiGi AI Advisor',
                body: 'Tell DiGi what happened today. Get the exact words and the structural fix. Available at 11pm when the guilt spiral hits. No generic advice.',
                svg: (
                  <span style={{ fontSize: '1.6rem', color: '#fff', lineHeight: 1, fontFamily: 'var(--font-display)', fontWeight: 800 }}>◎</span>
                ),
              },
              {
                iconBg: 'var(--stage-2-bold)',
                title: 'Weekly Scripts',
                body: 'Twelve real situations with exact scripts. The gaming fight, the phone at bedtime, TikTok at 13. Start using them tonight.',
                svg: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="13" x2="13" y2="13"/>
                  </svg>
                ),
              },
            ] as const).map((f, i) => (
              <div key={i} className="fu" style={{ background: '#fff', borderRadius: '24px', padding: '36px 28px', boxShadow: '0 6px 32px rgba(26,26,46,.06)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 0 rgba(0,0,0,0.15)' }}>
                  {f.svg}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', lineHeight: 1.2 }}>{f.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          WHAT THIS COVERS — Apple-style problem rows
          ================================================================ */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(80px, 11vw, 128px) 32px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>What this covers</p>
            <h2 className="fu" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.05, marginBottom: '18px' }}>
              The fights you have every day.<br />
              <span style={{ color: 'var(--terracotta)' }}>Scripts for all of them.</span>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}>
              Every situation below has a guide, an exact script and a structural fix. Not tomorrow. Tonight.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { label: 'Every morning', problem: 'They will not get off their device to get ready for school.', fix: 'The routine starts tonight. Device outside the bedroom. Shoes first, screens second. Say it once, hold it every day.', bg: 'var(--stage-1)', bold: 'var(--stage-1-bold)', ages: 'Ages 4 to 13' },
              { label: 'After school every day', problem: 'The TV goes on the second she is home. If I say no it is a meltdown.', fix: 'She is decompressing the only way she has been taught. A 20-minute wind-down routine with a script replaces the demand within two weeks.', bg: 'var(--stage-2)', bold: 'var(--stage-2-bold)', ages: 'Ages 8 to 10' },
              { label: 'Mood after her phone', problem: 'She is flat, snappy and impossible to reach after she puts her phone down.', fix: 'The research tracks this signal specifically at ages 11 to 13. You get the check-in and the conversation before it becomes a pattern.', bg: 'var(--stage-3)', bold: 'var(--stage-3-bold)', ages: 'Ages 11 to 13 · Critical window', critical: true },
              { label: 'Bedtime every night', problem: 'He will not hand over his phone at bedtime. Every night the same argument.', fix: 'One structural change. The phone charges in the hallway from tonight. Not a rule to enforce. A structure that removes the argument.', bg: 'var(--stage-4)', bold: 'var(--stage-4-bold)', ages: 'Ages 8 to 15' },
              { label: 'TikTok at 13', problem: 'She is 13 and asking for TikTok. All her friends have it. I have no idea what to say.', fix: 'The answer is not yes or no. You get the conversation to have before she gets access. The conversation is the protection.', bg: 'var(--stage-5)', bold: 'var(--stage-5-bold)', ages: 'Ages 11 to 13' },
            ].map((row, i) => (
              <div key={i} className="fu" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderRadius: i === 0 ? '24px 24px 0 0' : i === 4 ? '0 0 24px 24px' : '0',
                overflow: 'hidden',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.5)' : 'none',
              }}>
                <div style={{ background: row.bg, padding: '40px 36px' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
                    {row.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(.95rem, 1.6vw, 1.12rem)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.5 }}>
                    &ldquo;{row.problem}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '18px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '.08em' }}>{row.ages}</span>
                    {row.critical && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.55rem', fontWeight: 700, background: row.bold, color: '#fff', borderRadius: '100px', padding: '2px 9px', letterSpacing: '.06em' }}>Critical window</span>}
                  </div>
                </div>
                <div style={{ background: '#fff', padding: '40px 36px', display: 'flex', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '12px' }}>
                      What Guided Childhood gives you
                    </p>
                    <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.75 }}>
                      {row.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '14px', padding: '16px 36px' }}>
              Get your free starter pack
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          FLIPPING PLACARDS — daily moments
          ================================================================ */}
      <section style={{ padding: 'clamp(88px, 11vw, 132px) 32px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>
              Real moments. Real scripts.
            </p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              The situations every parent<br />
              <span style={{ color: 'var(--terracotta)' }}>is dealing with right now.</span>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
              Tap any card to see the exact words to use, the structural change that works, and why it works. No generic advice. The script for your situation tonight.
            </p>
          </div>

          <FlipCards cards={PLACARDS} />

        </div>
      </section>

      {/* ================================================================
          SCRIPT CATEGORIES — Edukids program card grid
          ================================================================ */}
      <section style={{ padding: 'clamp(80px, 10vw, 112px) 32px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>100 plus scripts</p>
            <h2 style={{ marginBottom: '14px' }}>
              What to say in{' '}
              <span style={{ color: 'var(--terracotta)' }}>every situation</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
              Each script has the exact words, what not to say, and why it works. Across six areas of digital life.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="cat-grid">
            {([
              { label: 'First Device',  desc: 'Setting foundations before and after the first screen arrives.', bg: 'var(--stage-1-bold)', text: 'var(--stage-1-text)', icon: '📱', count: '18 scripts', ks: 'Stage 1 and 2' },
              { label: 'Social Media',  desc: 'Navigating platforms, algorithms, and identity with your child.', bg: 'var(--stage-3-bold)', text: 'var(--stage-3-text)', icon: '📸', count: '22 scripts', ks: 'Stage 3 and 4' },
              { label: 'Gaming',        desc: 'Healthy gaming conversations without the daily battle.', bg: 'var(--stage-2-bold)', text: 'var(--stage-2-text)', icon: '🎮', count: '15 scripts', ks: 'All stages' },
              { label: 'Safety',        desc: 'What to say when something goes wrong online.', bg: 'var(--stage-4-bold)', text: 'var(--stage-4-text)', icon: '🛡️', count: '20 scripts', ks: 'Stage 3 to 5' },
              { label: 'Wellbeing',     desc: 'Mood, sleep, body image, and the digital connection.', bg: 'var(--stage-5-bold)', text: 'var(--stage-5-text)', icon: '🌱', count: '16 scripts', ks: 'Stage 2 to 4' },
              { label: 'AI and Tech',   desc: 'Deepfakes, AI tools, and what digital literacy looks like.', bg: 'var(--stage-1-bold)', text: 'var(--stage-1-text)', icon: '🤖', count: '12 scripts', ks: 'Stage 4 and 5' },
            ] as const).map((cat) => (
              <Link key={cat.label} href="/starter-pack" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(26,26,46,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>

                  {/* Photo area */}
                  <div style={{
                    background: cat.bg,
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '20px',
                    flexShrink: 0,
                  }}>
                    <div style={{ fontSize: '60px', lineHeight: 1, filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.08))' }}>
                      {cat.icon}
                    </div>
                    {/* Script count badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255,255,255,0.88)',
                      borderRadius: '100px',
                      padding: '4px 10px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: cat.text,
                      letterSpacing: '0.04em',
                    }}>
                      {cat.count}
                    </div>
                    {/* Stage badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(255,255,255,0.75)',
                      borderRadius: '100px',
                      padding: '3px 10px',
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: cat.text,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      {cat.ks}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                      {cat.label}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '14px', flex: 1 }}>
                      {cat.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--terracotta)', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                      Explore scripts →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '14px', padding: '15px 32px' }}>
              Get your free starter pack
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section id="how-it-works" className="section-lg" style={{ background: '#fff', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>How it works</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              Your situation.{' '}
              <span style={{ color: 'var(--terracotta)' }}>The exact script. Tonight.</span>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto' }}>
              Generic screen time advice does not work because it ignores your child's age, stage and the specific thing that happened today. This is what it looks like when the platform gives you what you actually need.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '860px', margin: '0 auto' }}>
            {WALKTHROUGHS.map((w, i) => (
              <div key={i} className="walkthrough-row fu">
                <div style={{ background: 'var(--cream)', padding: '28px 24px', borderRight: '1px solid var(--border)' }}>
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
                        background: j === 0 ? 'var(--stage-2)' : j === 1 ? 'var(--cream)' : 'var(--stage-1)',
                        color: 'var(--ink)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="time-stats">
            {[['2 min', 'Weekly check-in'], ['3', 'Actions per week'], ['5 min', 'Each action'], ['24/7', 'DiGi available']].map(([num, label], i) => (
              <div key={i} style={{ textAlign: 'center', padding: '22px 12px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--terracotta)', lineHeight: 1, marginBottom: '5px', letterSpacing: '-.03em' }}>
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
          DiGi SECTION
          ================================================================ */}
      <section style={{ padding: 'clamp(64px, 9vw, 104px) 32px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col">

            <div>
              <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>
                Your AI digital parenting advisor
              </p>
              <h2 className="fu" style={{ marginBottom: '20px' }}>
                DiGi has read every study.<br />Ask anything.
              </h2>
              <p className="fu" style={{ fontSize: '.94rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '12px' }}>
                Most parents search Google at 10pm trying to work out what to do about a specific thing that happened today. DiGi replaces that. Tell it what happened, your child's age and stage, and it gives you the exact words and the structural change that will make a difference.
              </p>
              <p className="fu" style={{ fontSize: '.94rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '28px' }}>
                Not general advice. The script for tonight.
              </p>
              <ul className="fu" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {[
                  'Knows your child\'s exact age and developmental stage',
                  'Covers screen time, gaming, social media, mood, sleep and online safety',
                  'Available at 11pm when the guilt spiral kicks in',
                  'Built on Odgers, Orben, Przybylski, Livingstone and the NHS guidance',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.9rem', color: 'var(--ink-soft)' }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 900, flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '13px' }}>
                Ask DiGi your first question
              </Link>
            </div>

            <div className="fu">
              <div style={{
                background: '#fff',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 60px rgba(26,26,46,0.10)',
                overflow: 'hidden',
              }}>
                <div style={{
                  background: 'var(--stage-5)',
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
                    background: 'var(--stage-5-bold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    <Image src="/digi-squad/DiGi-star.svg" alt="DiGi" width={52} height={52} style={{ objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em' }}>DiGi</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--ink-muted)', marginTop: '1px' }}>Guided Childhood Advisor</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '.67rem', color: 'var(--terracotta)', fontWeight: 600, background: 'rgba(255,255,255,.6)', padding: '4px 10px', borderRadius: '100px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                    Online now
                  </div>
                </div>

                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi">
                      What is happening at home with screens right now?
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="bubble-parent">
                      Every evening my 9-year-old comes in from school and immediately wants the TV on. If I say no it is a full meltdown.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi">
                      This is one of the most common patterns at Stage 2. The fix is a 20-minute wind-down routine with a script so it does not become a fight. Want the exact words for tonight?
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="bubble-parent">Yes please</div>
                  </div>
                  <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-end' }}>
                    <div className="digi-avatar-sm">D</div>
                    <div className="bubble-digi" style={{ background: 'var(--stage-2)' }}>
                      <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--terracotta)', fontSize: '.76rem' }}>Stage 2 · Transition script</strong>
                      "Before you get the TV on, let's do your five things: shoes away, bag on hook, snack, five minutes outside, then TV. Deal?" Say it once, warmly. Then hold it.
                    </div>
                  </div>
                </div>

                <div style={{ padding: '10px 16px 16px', display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid var(--border)', background: 'var(--cream)' }}>
                  <div style={{
                    flex: 1,
                    background: '#fff',
                    border: '1.5px solid var(--border)',
                    borderRadius: '100px',
                    padding: '10px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '.79rem',
                    color: 'var(--ink-light)',
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
                    fontSize: '.9rem',
                    flexShrink: 0,
                    textDecoration: 'none',
                    boxShadow: '0 3px 0 var(--terracotta-dark)',
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
      <section id="issues" className="section-lg" style={{ background: '#fff' }}>
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
            <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ background: 'var(--stage-1)', color: 'var(--stage-1-text)', fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: '8px' }}>
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

            <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ background: 'var(--stage-5)', color: 'var(--stage-5-text)', fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '5px 11px', borderRadius: '8px' }}>
                  8 gaps
                </span>
                <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>Digital literacy</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {DIGITAL_GAPS.map((item, i) => (
                  <li key={i} style={{ fontSize: '.81rem', color: 'var(--ink-soft)', display: 'flex', gap: '9px', alignItems: 'flex-start', lineHeight: 1.55 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)', display: 'inline-block', flexShrink: 0, marginTop: '5px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href="/starter-pack" className="btn btn-gold">Find your starting point</Link>
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
              <span style={{ color: 'var(--terracotta)' }}>pay attention to</span>
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
                ['Appearance comparison and self-critical talk after scrolling', 'Research shows this is amplified by appearance-based content at the 11 to 13 window.'],
                ['Secrecy and hidden device use', 'Not always a crisis. But secrecy is the signal to act on. The script for this is specific and non-confrontational.'],
                ['Prolonged low mood coinciding with a change in platform use', 'Research is clear that pre-existing vulnerability matters more than the platform. But the timing is worth noting.'],
              ]},
            ].map((col, ci) => (
              <div key={ci} className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px' }}>
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

          <div style={{ background: 'var(--stage-5)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 22px', marginTop: '18px', maxWidth: '880px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: 'var(--stage-5-text)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>⚑</span>
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
      <section className="section-lg" style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The risks, mapped</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              Every major online risk.{' '}
              <span style={{ color: 'var(--terracotta)' }}>What it is. What you do.</span>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              Each risk is covered at the right stage, in the right way. Not all at once.
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
              <div key={ci} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: col.color, marginBottom: '14px' }}>
                  {col.label}
                </div>
                {col.items.map(([title, body], ii) => (
                  <div key={ii} style={{ fontSize: '.8rem', color: 'var(--ink-soft)', display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: ii < col.items.length - 1 ? '10px' : 0, lineHeight: 1.55 }}>
                    <span style={{ color: col.color, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>›</span>
                    <span><strong style={{ color: 'var(--ink)' }}>{title}</strong> — {body}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
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
              <span style={{ color: 'var(--terracotta)' }}>runs the lot</span>
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
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: '0 4px 16px rgba(0,0,0,.06)',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 900, lineHeight: 1, color: item.color }}>
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
      <section className="section-lg" style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col-wide">
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
                fontWeight: 900,
                color: '#fff',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(61,115,154,.25)',
                letterSpacing: '-.03em',
              }}>
                JP
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '14px' }}>
                Justin Phillips
              </p>
              <p style={{ fontSize: '.73rem', color: 'var(--ink-light)', marginTop: '3px' }}>Founder, Guided Childhood</p>
            </div>

            <div>
              <h2 className="fu" style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '18px' }}>
                I watched my daughter scroll for{' '}
                <span style={{ color: 'var(--terracotta)' }}>three hours</span>{' '}
                and realised the conversation I was missing
              </h2>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: '14px' }}>
                I am Justin Phillips, founder of The Social Billboard and Guided Childhood. I am not a researcher. I read the researchers. Then I built a platform that translates what they found into something parents can actually use this week.
              </p>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: '28px' }}>
                The problem is not the phone. The problem is nobody gave parents a map. A law about social media does not give you one. Guided Childhood does.
              </p>
              <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '13px' }}>
                Find my starting point
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
            <span style={{ color: 'var(--terracotta)' }}>in your home</span>
          </h2>
          <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 48px' }}>
            You are solving today's problem in a way that builds capacity for tomorrow.
          </p>

          <div className="three-col fu" style={{ marginBottom: '32px' }}>
            {[
              {
                num: '01', numBg: 'var(--stage-2)', title: 'The hard moments do not make you spiral',
                body: 'You have a framework, not a random tip. When the gaming fight happens, when the mood drops, when the unknown contact appears, you already know what to do.',
                tag: 'Framework not tips', tagBg: 'var(--stage-2)',
              },
              {
                num: '02', numBg: 'var(--stage-1)', title: 'Your child starts building the actual skills',
                body: 'Resilience, self-regulation, digital literacy. Not because you went soft, but because you held the boundary and the connection at the same time.',
                tag: 'Skills not compliance', tagBg: 'var(--stage-1)',
              },
              {
                num: '03', numBg: 'var(--stage-5)', title: 'You trust yourself as a parent',
                body: 'Not because it got easy. Because you stopped needing it to be. The challenges change as they grow. Your approach does not have to.',
                tag: 'Confidence not certainty', tagBg: 'var(--stage-5)',
              },
            ].map((oc, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '36px 28px', border: '1px solid var(--border)', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: '16px',
                  color: oc.numBg,
                  opacity: 0.5,
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  letterSpacing: '-.04em',
                }}>
                  {oc.num}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.3, paddingRight: '40px' }}>
                  {oc.title}
                </h3>
                <p style={{ fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: '18px' }}>
                  {oc.body}
                </p>
                <span style={{ background: oc.tagBg, color: 'var(--ink)', display: 'inline-flex', borderRadius: '100px', padding: '4px 12px', fontSize: '.64rem', fontWeight: 700 }}>
                  {oc.tag}
                </span>
              </div>
            ))}
          </div>

          <Link href="/starter-pack" className="btn btn-gold">Find my starting point</Link>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      <section className="section-lg" style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What parents say</p>
            <h2 className="fu">
              It actually{' '}
              <span style={{ color: 'var(--terracotta)' }}>works</span>
            </h2>
          </div>

          <div className="three-col fu" style={{ marginBottom: '40px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--terracotta)', fontSize: '1rem', letterSpacing: '2px', marginBottom: '14px' }}>★★★★★</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '.92rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.68, marginBottom: '16px', flex: 1 }}>
                  {t.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: ['var(--stage-2)', 'var(--stage-4)', 'var(--stage-5)'][i],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '.72rem', color: 'var(--ink-soft)', flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--ink)' }}>{t.by}</div>
                    <span style={{ background: 'var(--stage-2)', color: 'var(--terracotta)', borderRadius: '100px', padding: '2px 8px', fontSize: '.62rem', fontWeight: 700 }}>
                      {t.stage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px', letterSpacing: '-.03em' }}>
              No, it is not too late.
            </p>
            <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', maxWidth: '420px', margin: '0 auto 26px', lineHeight: 1.8 }}>
              There are more school pickups, more car journeys, more evenings ahead of you than behind you. The pathway starts from wherever you are.
            </p>
            <Link href="/starter-pack" className="btn btn-gold">Find my starting point</Link>
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
              <span style={{ color: 'var(--terracotta)' }}>not panic</span>
            </h2>
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
              Every child benefits from a guided digital childhood. The research tells us which children need it most urgently.
            </p>
          </div>

          <div className="four-col fu" style={{ marginBottom: '24px' }}>
            {RESEARCHERS.map((r, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                  {r.name}
                </h4>
                <div style={{ fontSize: '.68rem', color: 'var(--ink-muted)', marginBottom: '10px', fontWeight: 500 }}>{r.uni}</div>
                <p style={{ fontSize: '.79rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{r.finding}</p>
              </div>
            ))}
          </div>

          <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '26px', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
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

          <div className="fu" style={{ border: '1px solid var(--border)', borderRadius: '16px', background: 'var(--stage-5)', padding: '32px 28px', textAlign: 'center' }}>
            <p className="eyebrow" style={{ color: 'var(--stage-5-text)', marginBottom: '10px' }}>Free · 5 minutes · No signup needed</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '10px' }}>
              Not sure where to start? The tool will tell you.
            </h3>
            <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto 20px' }}>
              Answer questions about what is happening at home. TV routines, gaming, sleep, mood, social media access. The Digital Health Check shows you where the gaps are and gives you a personalised starting point.
            </p>
            <Link href="/digitalwellbeing" className="btn btn-gold">Take the free Digital Health Check</Link>
          </div>
        </div>
      </section>

      {/* Policy strip */}
      <div style={{ background: 'var(--cream)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0, borderTop: '1px solid var(--border)' }}>
        {['Online Safety Act 2023', 'Education for a Connected World (DfE)', 'Statutory RSE and Health Education', 'Ofcom Media Literacy Framework', 'DfE AI in Education Guidance 2025'].map((item, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 18px', fontSize: '.72rem', fontWeight: 600, color: 'var(--ink-soft)', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0, display: 'inline-block' }} />
            {item}
          </div>
        ))}
      </div>

      {/* ================================================================
          SCHOOLS
          ================================================================ */}
      <section id="teachers" className="section-lg" style={{ background: 'var(--stage-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col">
            <div>
              <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>For schools</p>
              <h2 className="fu" style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)', marginBottom: '16px' }}>
                Not just safety.<br />
                <span style={{ color: 'var(--terracotta)' }}>Full digital education.</span>
              </h2>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '14px' }}>
                Most school programmes cover what to do when something goes wrong. Guided Childhood covers everything before that moment and everything that comes after.
              </p>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.82, marginBottom: '28px' }}>
                Screen behaviour, routines, every online risk, digital literacy, AI, and full readiness at 16. EYFS to Sixth Form. Every lesson comes with a parent note so school work extends into the home.
              </p>
              <Link href="/schools" className="btn btn-ink fu" style={{ fontSize: '13px' }}>
                See the full school programme
              </Link>
            </div>

            <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
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
      <section id="pricing" className="section-lg" style={{ scrollMarginTop: '70px', background: '#fff' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Simple pricing</p>
            <h2 className="fu">
              Start free. Stay as long<br />as you{' '}
              <span style={{ color: 'var(--terracotta)' }}>need.</span>
            </h2>
          </div>

          <div className="fu" style={{ background: 'var(--terracotta)', borderRadius: '14px', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', flexShrink: 0 }}>Limited</span>
              <span style={{ fontSize: '.88rem', fontWeight: 600, color: '#fff' }}>
                Founder Rate: first 50 members only. Lock in{' '}
                <strong>£7.99/month for life.</strong>
              </span>
            </div>
            <Link href="/starter-pack" style={{
              background: '#fff', color: 'var(--terracotta)', fontFamily: 'var(--font-mono)', fontWeight: 700,
              fontSize: '.72rem', letterSpacing: '.06em', textTransform: 'uppercase',
              padding: '9px 20px', borderRadius: '100px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              Claim Founder Rate
            </Link>
          </div>

          <div className="price-grid fu">
            {[
              {
                tier: 'Free forever', name: 'Starter Pack', price: 'Free', period: '',
                save: 'Yours immediately on sign-up',
                features: [
                  ['✓', 'Age-stage roadmap'],
                  ['✓', 'Family digital agreement template'],
                  ['✓', '5 conversation scripts'],
                  ['✓', 'Warning signs checklist'],
                  ['✓', 'Age restrictions guide'],
                ],
                cta: 'Get Free Pack', href: '/starter-pack',
                ctaBg: 'transparent', ctaColor: 'var(--ink)', ctaBorder: '2px solid var(--border)', ctaShadow: 'none',
                cardStyle: {},
              },
              {
                tier: 'Most popular', name: 'Guided Childhood OS', price: '£12.99', period: '/month',
                save: 'First 50: lock in £7.99/month for life.',
                features: [
                  ['✓', 'Full 5-stage dashboard'],
                  ['✓', 'Weekly 3-action plan'],
                  ['✓', 'All scripts and guides'],
                  ['✓', 'Full curriculum, all lessons'],
                  ['✓', 'Digital wellbeing tracker'],
                  ['✓', 'DiGi AI advisor, unlimited'],
                  ['✓', 'School lesson packs included'],
                ],
                cta: 'Start now', href: '/join',
                ctaBg: 'var(--terracotta)', ctaColor: '#fff', ctaBorder: 'none', ctaShadow: '0 5px 0 var(--terracotta-dark)',
                cardStyle: { background: 'var(--stage-1)', border: '2px solid rgba(61,115,154,.25)', transform: 'scale(1.025)' },
              },
              {
                tier: 'Best value', name: 'Annual OS', price: '£99', period: '/year',
                save: 'Save £57. Two months free.',
                features: [
                  ['✓', 'Everything in monthly'],
                  ['✓', 'Multi-child profiles'],
                  ['✓', 'Priority DiGi access'],
                  ['✓', 'School pack downloads'],
                ],
                cta: 'Start now', href: '/join',
                ctaBg: 'var(--terracotta)', ctaColor: '#fff', ctaBorder: 'none', ctaShadow: '0 5px 0 var(--terracotta-dark)',
                cardStyle: {},
              },
            ].map((plan, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', ...plan.cardStyle }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px', minHeight: '2em' }}>
                  {plan.tier}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: '16px', minHeight: '2.6em', display: 'flex', alignItems: 'flex-start' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '5px' }}>
                  {plan.period && <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)' }}>£</span>}
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.04em' }}>
                    {plan.price.replace('£', '')}
                  </span>
                  <span style={{ fontSize: '.77rem', color: 'var(--ink-muted)', marginLeft: '2px' }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--terracotta)', fontWeight: 700, marginBottom: '20px', minHeight: '16px' }}>
                  {plan.save}
                </div>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 18px' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px', flex: 1 }}>
                  {plan.features.map(([check, label], fi) => (
                    <li key={fi} style={{ display: 'flex', gap: '9px', fontSize: '.81rem', color: 'var(--ink-soft)', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 900, fontSize: '.74rem', marginTop: '2px', flexShrink: 0, color: 'var(--terracotta)' }}>{check}</span>
                      {label}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{
                  width: '100%', marginTop: 'auto', padding: '14px', borderRadius: '14px',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.84rem',
                  textDecoration: 'none', display: 'block', textAlign: 'center',
                  background: plan.ctaBg, color: plan.ctaColor, border: plan.ctaBorder, boxShadow: plan.ctaShadow,
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
              <span style={{ color: 'var(--terracotta)' }}>wondering</span>
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ================================================================
          FINAL CTA — bold centered panel
          ================================================================ */}
      <section style={{ textAlign: 'center', padding: 'clamp(80px, 10vw, 120px) 32px', background: '#FFFBEE' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--stage-1-bold)', borderRadius: '100px', padding: '6px 16px', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--stage-1-text)' }}>
              Join 200 families already on their pathway
            </span>
          </div>
          <h2 className="fu" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.05, marginBottom: '18px' }}>
            Start your family's<br />
            <span style={{ color: 'var(--terracotta)' }}>guided childhood today</span>
          </h2>
          <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '36px' }}>
            No setup. No waiting. The starter pack is free and arrives immediately. One account covers all your children.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '15px', padding: '17px 40px' }}>
              Get the free starter pack
            </Link>
            <Link href="/digitalwellbeing" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 700, padding: '17px 36px', borderRadius: 'var(--radius-btn)',
              border: '2px solid var(--ink)', color: 'var(--ink)', textDecoration: 'none',
              background: 'transparent', transition: 'background .15s',
            }}>
              Take the health check
            </Link>
          </div>
          <div style={{ fontSize: '.72rem', color: 'var(--ink-muted)' }}>
            No card required · 30-day money-back on launch
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER — dark navy with columns
          ================================================================ */}
      <footer style={{ background: '#1A1A2E', padding: 'clamp(48px, 6vw, 72px) 32px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--terracotta)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '15px' }}>
                    {[5, 9, 14, 8].map((h, i) => (
                      <div key={i} style={{ width: '3px', height: `${h}px`, background: '#fff', borderRadius: '1.5px' }} />
                    ))}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>Guided Childhood</span>
              </div>
              <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: '240px' }}>
                The stage-by-stage digital parenting guide for UK families. Ages 4 to 16. Built on the research.
              </p>
            </div>

            {/* Guides */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Guides</div>
              {[['Stage 1 · Ages 4 to 7', '#stages'], ['Stage 2 · Ages 8 to 10', '#stages'], ['Stage 3 · Ages 11 to 13', '#stages'], ['Stage 4 · Ages 13 to 15', '#stages'], ['Stage 5 · Ages 16+', '#stages']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <Link href={href} style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500, lineHeight: 1.4 }}>{label}</Link>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Tools</div>
              {[['Free Starter Pack', '/starter-pack'], ['Digital Health Check', '/digitalwellbeing'], ['Ask DiGi', '/starter-pack'], ['For Schools', '/schools'], ['Pricing', '#pricing']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <Link href={href} style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500 }}>{label}</Link>
                </div>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Company</div>
              {[['About', '/'], ['Blog', '/'], ['Contact', '/'], ['Privacy', '/'], ['Terms', '/'], ['Login', '/login']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <Link href={href} style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500 }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.64rem', color: 'rgba(255,255,255,.35)' }}>
              © 2026 The Social Billboard · Justin Phillips
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Online Safety Act 2023', 'DfE', 'Ofcom', 'Statutory RSE'].map(tag => (
                <span key={tag} style={{ fontSize: '.64rem', color: 'rgba(255,255,255,.3)', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
