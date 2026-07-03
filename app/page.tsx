import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import AnnouncementBar from '@/components/marketing/AnnouncementBar'
import FaqAccordion from '@/components/marketing/FaqAccordion'
import FlipCards from '@/components/marketing/FlipCards'
import DigiWalker from '@/components/marketing/DigiWalker'
import DigiCharacter from '@/components/digi/DigiCharacter'

export const metadata: Metadata = {
  title: 'Guided Childhood, Screen Time and Digital Literacy Guide for UK Families · Ages 4 to 16',
  description: 'Stop guessing what to say. Guided Childhood gives UK parents exact scripts for every screen time fight, a stage-by-stage digital literacy pathway from age 4 to 16, and DiGi your AI parenting advisor available at 11pm. Built on the research, not a ban.',
  keywords: [
    'digital parenting UK', 'screen time scripts', 'digital literacy for children',
    'child screen time advice', 'social media age UK', 'digital parenting pathway',
    'AI parenting advisor', 'screen time arguments', 'digital literacy divide',
    'online safety for children UK',
  ],
  openGraph: {
    title: 'Stop guessing what to say about screens. Get the exact words tonight.',
    description: 'The stage-by-stage digital literacy guide for UK families. Exact scripts for screen time battles, gaming meltdowns, social media access, and bedtime fights. Ages 4 to 16. Free starter pack.',
    url: 'https://www.guidedchildhood.co.uk',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stop guessing what to say about screens. Get the exact words tonight.',
    description: 'The stage-by-stage digital literacy guide for UK families. Ages 4 to 16. Free starter pack.',
  },
  alternates: {
    canonical: 'https://www.guidedchildhood.co.uk',
  },
}

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

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Guided Childhood',
            description: 'The stage-by-stage digital parenting guide for UK families. Ages 4 to 16. Built on the research.',
            url: 'https://www.guidedchildhood.co.uk',
            foundingDate: '2024',
            founder: { '@type': 'Person', name: 'Justin Phillips' },
            areaServed: { '@type': 'Country', name: 'United Kingdom' },
            knowsAbout: ['digital parenting', 'screen time', 'online safety', 'children social media', 'parental controls', 'digital wellbeing'],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Guided Childhood',
            url: 'https://www.guidedchildhood.co.uk',
            description: 'The stage-by-stage digital parenting guide for UK families.',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.guidedchildhood.co.uk/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'At what age should my child get their first phone?',
                acceptedAnswer: { '@type': 'Answer', text: 'There is no single right age. Guided Childhood uses a 5-stage pathway from ages 4 to 16. The right time depends on your child\'s stage of development, your family structure, and what boundaries you have in place. Stage 2 (ages 8 to 10) is typically when children get a restricted first device. Stage 3 (ages 11 to 13) is when smartphones become more common. The question is not when but how.' },
              },
              {
                '@type': 'Question',
                name: 'How do I deal with screen time arguments every day?',
                acceptedAnswer: { '@type': 'Answer', text: 'Screen time arguments happen when limits are inconsistent or when structure is missing. Guided Childhood gives you the exact scripts for the most common daily battles including after-school TV demands, bedtime phone fights, and gaming meltdowns. The fix is structural, not stricter. One consistent routine replaces most daily arguments within two weeks.' },
              },
              {
                '@type': 'Question',
                name: 'When should children be allowed on social media?',
                acceptedAnswer: { '@type': 'Answer', text: 'The UK minimum age for most platforms is 13. Research by Dr Amy Orben at Cambridge identifies ages 11 to 13 as the highest-sensitivity window, particularly for girls. Guided Childhood Stage 3 covers exactly this: the conversation to have before access, what to watch for during access, and the boundaries that protect without destroying trust.' },
              },
              {
                '@type': 'Question',
                name: 'Is screen time really harmful for children?',
                acceptedAnswer: { '@type': 'Answer', text: 'The research is more nuanced than most headlines suggest. Professor Candace Odgers at UC Irvine and Professor Andrew Przybylski at Oxford both find that the effects depend heavily on context, vulnerability, and structure. Screen time is not uniformly harmful. Too much, too early, without structure, for already-vulnerable children is where risk concentrates. Guided Childhood is built on this nuanced research, not panic.' },
              },
              {
                '@type': 'Question',
                name: 'What is Guided Childhood and how does it work?',
                acceptedAnswer: { '@type': 'Answer', text: 'Guided Childhood is a stage-by-stage digital parenting platform for UK families with children aged 4 to 16. You identify your child\'s stage, get the exact scripts for the situations you are facing right now, complete weekly check-ins and actions, and ask DiGi (your AI parenting advisor) for the specific words you need in any moment. It takes around 10 minutes a week.' },
              },
              {
                '@type': 'Question',
                name: 'Is banning devices better than teaching digital literacy?',
                acceptedAnswer: { '@type': 'Answer', text: 'OECD research finds device access among UK teenagers is now nearly universal, so the gap that remains is not who owns a device but who is taught to use one well. LSE research describes this as a second digital divide, with children in poorer schools significantly more likely to be taught by someone unsure with the technology. A ban does not close that gap. It removes the deep end from the child who was never taught, while the child already getting lessons is unaffected. Guided Childhood teaches digital literacy in stages instead, the same way children are taught to swim.' },
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Every child has a device now. That was never the hard part.',
            description: 'Access to devices has closed among UK teenagers. What has not closed is who gets taught to use them well. A look at the second digital divide, and why teaching beats banning.',
            author: { '@type': 'Person', name: 'Justin Phillips' },
            publisher: { '@type': 'Organization', name: 'Guided Childhood' },
            mainEntityOfPage: 'https://www.guidedchildhood.co.uk',
          },
        ]) }}
      />

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
              color: 'var(--ink)',
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
            <p className="fu" style={{ fontSize: '1.02rem', color: 'var(--ink)', lineHeight: 1.78, maxWidth: '440px', marginBottom: '28px' }}>
              The stage by stage guide, exact scripts for the hard moments, and DiGi, your AI parenting advisor available at 11pm.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '.8rem', color: 'var(--ink-muted)', fontWeight: 600 }}>Free starter pack · No card needed · Built on the research</span>
            </div>
            <div className="fu" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
              <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '16px 36px' }}>
                Start my pathway free
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

          {/* Right: Daily digest app preview */}
          <div className="hero-chips" style={{ position: 'relative', height: '480px' }}>

            {/* Main app preview card */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '10px',
              right: '10px',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 16px 60px rgba(26,26,46,0.13)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              zIndex: 1,
            }}>
              {/* Card header */}
              <div style={{ background: 'var(--stage-3)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '2px' }}>Stage 3 · Ages 11 to 13</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>Your dashboard today</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '100px', padding: '5px 11px', letterSpacing: '0.06em', flexShrink: 0 }}>
                  10 min
                </div>
              </div>

              {/* Tonight's script */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '7px' }}>Tonight&apos;s script</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Screen time shutdown</div>
                <div style={{ background: 'var(--stage-2)', borderRadius: '10px', padding: '9px 12px', fontSize: '11px', color: 'var(--ink)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;Let&apos;s do a 5 minute warning from now on, so it never feels like a surprise.&rdquo;
                </div>
              </div>

              {/* Device tip row */}
              <div style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', background: 'var(--stage-1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>📱</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--ink)' }}>iOS Screen Time</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--ink-muted)', marginTop: '1px' }}>2 steps · App limits for Instagram</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--terracotta)' }}>Settings →</div>
              </div>

              {/* AI literacy row */}
              <div style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', background: 'var(--stage-5)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>🤖</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--ink)' }}>AI literacy · Lesson 3</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--ink-muted)', marginTop: '1px' }}>Mapped to RSE · 8 minutes</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--terracotta)' }}>Start →</div>
              </div>

              {/* Ask DiGi row */}
              <div style={{ padding: '11px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DigiCharacter mood="idle" size={30} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--ink)' }}>Ask DiGi about this situation</div>
                <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, color: 'var(--terracotta)' }}>Ask →</div>
              </div>
            </div>

            {/* Floating: progress badge top right */}
            <div className="digi-pop-in" style={{
              position: 'absolute',
              top: '-26px',
              right: '20px',
              background: '#fff',
              borderRadius: '14px',
              padding: '9px 14px',
              boxShadow: '0 6px 28px rgba(26,26,46,0.14)',
              border: '1.5px solid var(--border)',
              textAlign: 'center',
              zIndex: 3,
              animationDelay: '0.8s',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 900, color: 'var(--terracotta)', lineHeight: 1 }}>4→16</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>Every stage</div>
            </div>

            {/* Floating: age-safe chip */}
            <div className="digi-pop-in" style={{
              position: 'absolute',
              bottom: '24px',
              right: '-8px',
              background: 'var(--stage-2)',
              borderRadius: '100px',
              padding: '7px 14px',
              boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
              zIndex: 3,
              animationDelay: '1.1s',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: '#2D5016', letterSpacing: '0.06em' }}>Age-safe · School-aligned · AI-ready</div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================
          AUTHORITY BAR — research institutions
          ================================================================ */}
      <section aria-label="Research foundations" style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '18px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', flexShrink: 0 }}>
            Built on research from
          </span>
          {[
            'UC Irvine',
            'Oxford Internet Institute',
            'University of Cambridge MRC',
            'LSE London',
            'Prof. Sonia Livingstone',
          ].map((inst, i, arr) => (
            <div key={inst} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)', letterSpacing: '-.01em' }}>{inst}</span>
              {i < arr.length - 1 && <span style={{ color: 'var(--border)', fontSize: '1rem', lineHeight: 1 }}>·</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          STATS — warm cream strip, large terracotta numbers
          ================================================================ */}
      <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="stats-strip" style={{ maxWidth: '960px', margin: '0 auto' }}>
          {[
            { num: '200',  label: 'Families on their pathway' },
            { num: '5',    label: 'Stages from age 4 to 16' },
            { num: '12',   label: 'Daily situations with scripts' },
            { num: '2027', label: 'Social media ban. Start now.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '36px 20px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', fontWeight: 900, color: 'var(--terracotta)', lineHeight: 1, marginBottom: '8px', letterSpacing: '-.04em' }}>
                {s.num}
              </div>
              <div style={{ fontSize: '.74rem', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.4, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          THE REAL DIVIDE — digital literacy narrative, deep water reframe
          ================================================================ */}
      <section aria-label="The digital literacy divide" style={{ padding: 'clamp(80px, 10vw, 120px) 32px', background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>The real divide</p>
            <h2 className="fu" style={{ marginBottom: '22px' }}>
              Every child has a device now.<br />
              <span style={{ color: 'var(--terracotta)' }}>That was never the hard part.</span>
            </h2>
            <div style={{ maxWidth: '660px', margin: '0 auto', textAlign: 'left' }}>
              <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '16px' }}>
                The OECD looked at teenagers across the developed world and found something that should stop every parent scrolling. Access is not the problem anymore. Almost every UK teenager already has a tablet. Nearly all have a smartphone. The gap in who owns a device has basically closed.
              </p>
              <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.85 }}>
                Then they looked at what children actually did with them. Teenagers from higher income homes used their devices to learn far more often than teenagers from lower income homes. Same phone. Same wifi. Different childhood. The gap did not close. It moved. It stopped being about who owns a device and became about who gets taught to use one.
              </p>
            </div>
          </div>

          {/* Stat row: data forward, mono labels, large numbers */}
          <div className="fu divide-stat-row" style={{ display: 'grid', gap: '1px', background: 'var(--border)', borderRadius: '20px', overflow: 'hidden', marginBottom: '64px' }}>
            {[
              { num: 'Nearly universal', label: 'UK teenagers who already own a smartphone or tablet, per OECD' },
              { num: '6 points', label: 'How much more likely a child in a poorer school is taught by someone unsure with the technology, per LSE' },
              { num: '4 in 10 vs 8 in 10', label: 'Children from the least affluent homes who can swim 25 metres unaided, against the wealthiest. Cost rations the lesson, not the water' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', padding: 'clamp(24px, 3vw, 32px) clamp(20px, 2.5vw, 28px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)', fontWeight: 900, color: 'var(--terracotta)', lineHeight: 1.1, marginBottom: '10px', letterSpacing: '-.02em' }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p className="fu" style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', fontWeight: 800, color: 'var(--ink)', marginBottom: '48px' }}>
            We have met this exact shape before. Deep water.
          </p>

          {/* Deep water reframe, DiGi walks across it as you scroll */}
          <DigiWalker>
            <div className="two-col fu">
              <div style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '20px', padding: 'clamp(24px, 3vw, 32px)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
                  How we handle deep water
                </p>
                <p style={{ fontSize: '.95rem', color: 'var(--ink)', lineHeight: 1.8 }}>
                  We do not ban children from water. We teach them to swim. In stages. A parent in the water. A hand held at the edge. Lying back on your arm. Floating on their front while you let go for one second, then two, until one day they swim the length alone and you are stood at the side, not in the water, because they no longer need you there. That is not permissiveness. It is the most responsible thing a parent does.
                </p>
              </div>
              <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '20px', padding: 'clamp(24px, 3vw, 32px)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '14px' }}>
                  Now read that again. About screens.
                </p>
                <p style={{ fontSize: '.95rem', color: 'var(--ink)', lineHeight: 1.8 }}>
                  A ban keeps the child who was never taught out of the water and calls it safety. The child already having lessons is untouched by it. They keep learning while the rule takes the deep end away from the child who never had a hand held at the edge, then leaves them to meet it alone the day the rule stops applying. Guardrails you teach outlast gates you lock.
                </p>
              </div>
            </div>
          </DigiWalker>

          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <p className="fu" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: '14px' }}>
              Guardrails you teach. Not gates you lock.
            </p>
            <p className="fu" style={{ fontSize: '.95rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto 28px' }}>
              That is the whole pathway. Five stages, from the first shared screen at four to full independence at sixteen. Guided the entire way. Never handed the deep end with no warning.
            </p>
            <div className="fu" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '14px', padding: '15px 30px' }}>
                Start your pathway free
              </Link>
              <Link href="/schools" style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem', fontWeight: 700, color: 'var(--terracotta)', textDecoration: 'none' }}>
                See what we built for schools →
              </Link>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--ink-light)', marginTop: '24px', letterSpacing: '.02em' }}>
              Sources: OECD digital equity findings, LSE second digital divide research, Swim England participation data
            </p>
          </div>

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
            <p style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
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
                // Real stock photos — one per stage, age-matched
                const STAGE_IMGS = [
                  'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_081926_eace355f-0905-46ee-9fbe-0e374e1283be.png', // parent+young child co-viewing stage 1
                  'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_084000_16cf13f2-fce4-4488-b8b7-25c7b85b6b60.png', // child aged 8-9 at kitchen table with tablet stage 2
                  'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_081928_d5e7d499-fcb6-4fbd-aa01-89c0afa69472.png', // pre-teen friends with phone stage 3
                  'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_084001_49386d86-1418-4b32-ac2e-8d812b7d4c80.png', // teen aged 13-14 with phone stage 4
                  'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_081932_8bcc0ecc-d6df-43b7-b98d-05677db4296c.png', // independent young person stage 5
                ]
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

                      {/* Photo area with device badge overlaid at bottom */}
                      <div style={{
                        height: '200px',
                        position: 'relative',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}>
                        <Image
                          src={STAGE_IMGS[i]}
                          alt={`${s.name} stage, ${s.ages}`}
                          fill
                          style={{ objectFit: 'cover', objectPosition: 'center top' }}
                          sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 20vw"
                        />
                        {/* Gradient fade at bottom */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.28) 100%)',
                        }} />
                        {/* Device policy badge overlaid on photo */}
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '12px',
                          background: s.bg,
                          borderRadius: '100px',
                          padding: '4px 10px',
                          fontSize: '9px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.06em',
                          color: s.text,
                          zIndex: 1,
                        }}>
                          {s.device}
                        </div>
                        {s.critical && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '12px',
                            background: 'var(--terracotta)',
                            borderRadius: '100px',
                            padding: '3px 9px',
                            fontSize: '8px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--ink)',
                            letterSpacing: '0.06em',
                            zIndex: 1,
                          }}>
                            Critical window
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: s.bold, marginBottom: '4px' }}>
                          Stage {s.num}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                          {s.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                          {s.ks}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-light)', marginBottom: '10px' }}>
                          {s.ages}
                        </div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '10px', flex: 1 }}>
                          {s.quote}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '12px' }}>
                          {s.tags.map(t => (
                            <span key={t} style={{ background: s.bg, borderRadius: '100px', padding: '3px 8px', fontSize: '9px', color: s.text, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ padding: '0 14px 14px' }}>
                        <div style={{
                          background: s.bold,
                          color: s.text,
                          borderRadius: '10px',
                          padding: '10px',
                          fontSize: '11px',
                          fontWeight: 800,
                          fontFamily: 'var(--font-display)',
                          letterSpacing: '-0.01em',
                          textAlign: 'center',
                          boxShadow: '0 3px 0 rgba(0,0,0,0.12)',
                        }}>
                          Start here →
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

          {/* DiGi pathway guide */}
          <div style={{ marginTop: '56px', paddingTop: '48px', borderTop: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <DigiCharacter mood="wave" size={88} />
              {/* Speech bubble */}
              <div className="digi-pop-in" style={{
                position: 'absolute',
                top: '4px',
                left: '100px',
                background: '#fff',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px',
                boxShadow: '0 4px 20px rgba(26,26,46,0.1)',
                border: '1.5px solid var(--border)',
                width: '200px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--ink)',
                lineHeight: 1.45,
              }}>
                I have every step from 4 to 16 covered. Ask me anything.
                <div style={{ position: 'absolute', left: '-10px', top: '14px', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '10px solid var(--border)' }} />
                <div style={{ position: 'absolute', left: '-8px', top: '14px', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '10px solid #fff' }} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800, color: 'var(--ink)', textAlign: 'center', marginTop: '4px' }}>
              DiGi guides you through every stage
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, maxWidth: '380px', textAlign: 'center' }}>
              Tell DiGi what is happening. Get the exact words for tonight. Available at 11pm when you need it most.
            </p>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '12px', padding: '11px 24px', marginTop: '4px' }}>
              Ask DiGi your first question
            </Link>
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
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
                  <DigiCharacter mood="idle" size={36} />
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
                <p style={{ fontSize: '.88rem', color: 'var(--ink)', lineHeight: 1.75 }}>{f.body}</p>
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}>
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
                    <p style={{ fontSize: '.92rem', color: 'var(--ink)', lineHeight: 1.75 }}>
                      {row.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '14px', padding: '16px 36px' }}>
              Start my pathway free
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
              Tap any card to see the exact words to use, the structural change that works, and why it works. No generic advice. The script for your situation tonight.
            </p>
          </div>

          <FlipCards cards={PLACARDS} />

        </div>
      </section>

      {/* ================================================================
          TRANSFORMATION TIMELINE — Good Inside DAY 1→27 pattern
          ================================================================ */}
      <section aria-label="What changes" style={{ padding: 'clamp(72px, 9vw, 104px) 32px', background: '#FFFBEE', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What parents tell us</p>
            <h2 className="fu" style={{ marginBottom: '14px' }}>
              Here is what changes{' '}
              <span style={{ color: 'var(--terracotta)' }}>and when</span>
            </h2>
          </div>

          {/* Timeline connector row */}
          <div style={{ position: 'relative' }}>
            <div className="hide-mobile" style={{
              position: 'absolute',
              top: '20px',
              left: 'calc(12.5% + 12px)',
              right: 'calc(12.5% + 12px)',
              height: '2px',
              borderTop: '2.5px dashed var(--border)',
              zIndex: 0,
            }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', position: 'relative', zIndex: 1 }}>
              {[
                {
                  marker: 'After week 1',
                  bg: 'var(--stage-1-bold)',
                  text: 'var(--stage-1-text)',
                  title: 'The fight is still there. But you know what to say.',
                  quote: '"I used the transition script on day three. He pushed back, obviously. But I held it and I did not spiral. That had never happened before."',
                  by: 'Parent of a 9-year-old',
                },
                {
                  marker: 'After month 1',
                  bg: 'var(--stage-2-bold)',
                  text: 'var(--stage-2-text)',
                  title: 'The routine is running itself.',
                  quote: '"The bedtime thing is just done now. Phone in the hall, no argument, three weeks in a row. I did not think that was possible."',
                  by: 'Parent of an 11-year-old',
                },
                {
                  marker: 'After month 3',
                  bg: 'var(--stage-3-bold)',
                  text: 'var(--stage-3-text)',
                  title: 'Your child came to you first.',
                  quote: '"She actually showed me something that worried her online. She came to me. Six months ago that would not have happened."',
                  by: 'Parent of a 13-year-old',
                },
                {
                  marker: 'After month 6',
                  bg: 'var(--stage-4-bold)',
                  text: 'var(--stage-4-text)',
                  title: 'You trust yourself as a parent again.',
                  quote: '"I am not guessing any more. I know where we are, what we are building towards, and why. That is the whole thing."',
                  by: 'Parent of a 15-year-old',
                },
              ].map((item, i) => (
                <div key={i} className="fu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Marker pill */}
                  <div style={{
                    background: item.bg,
                    color: item.text,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '5px 13px',
                    borderRadius: '100px',
                    marginBottom: '20px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(26,26,46,0.08)',
                  }}>
                    {item.marker}
                  </div>
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(26,26,46,0.05)', flex: 1, width: '100%' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '10px', letterSpacing: '-0.02em' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '11.5px', fontStyle: 'italic', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '10px' }}>
                      {item.quote}
                    </p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>
                      {item.by}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '14px', padding: '15px 32px' }}>
              Start your pathway today
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          SCRIPT CATEGORIES — Edukids program card grid
          ================================================================ */}
      <section style={{ padding: 'clamp(80px, 10vw, 112px) 32px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>100 plus scripts</p>
            <h2 style={{ marginBottom: '14px' }}>
              What to say in{' '}
              <span style={{ color: 'var(--terracotta)' }}>every situation</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
              Each script has the exact words, what not to say, and why it works. Across six areas of digital life.
            </p>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '100px', padding: '8px 18px', marginBottom: '40px' }}>
            <span style={{ fontSize: '13px' }}>🔬</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.02em' }}>
              Every script is grounded in the research and tested to get the best real response, not just something to say.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="cat-grid">
            {([
              { label: 'First Device',  desc: 'Setting foundations before and after the first screen arrives.', bg: 'var(--stage-1-bold)', text: 'var(--stage-1-text)', img: 'hf_20260701_114000_83af1d7a-f4d0-42b1-bbbb-50189bb257ec.png', count: '18 scripts', ks: 'Stage 1 and 2' },
              { label: 'Social Media',  desc: 'Navigating platforms, algorithms, and identity with your child.', bg: 'var(--stage-3-bold)', text: 'var(--stage-3-text)', img: 'hf_20260701_114002_8859c51a-5549-455b-abb9-7ef0ea4b235b.png', count: '22 scripts', ks: 'Stage 3 and 4' },
              { label: 'Gaming',        desc: 'Healthy gaming conversations without the daily battle.', bg: 'var(--stage-2-bold)', text: 'var(--stage-2-text)', img: 'hf_20260701_111842_c658f4e6-31f2-4b4e-98df-4517281cb6d7.png', count: '15 scripts', ks: 'All stages' },
              { label: 'Safety',        desc: 'What to say when something goes wrong online.', bg: 'var(--stage-4-bold)', text: 'var(--stage-4-text)', img: 'hf_20260701_114003_bc2f938b-e551-415c-9aff-09e57ac8cb6c.png', count: '20 scripts', ks: 'Stage 3 to 5' },
              { label: 'Wellbeing',     desc: 'Mood, sleep, body image, and the digital connection.', bg: 'var(--stage-5-bold)', text: 'var(--stage-5-text)', img: 'hf_20260701_115127_7be715f0-bf0b-4ac1-b3ff-38c243b04b36.png', count: '16 scripts', ks: 'Stage 2 to 4' },
              { label: 'AI and Tech',   desc: 'Deepfakes, AI tools, and what digital literacy looks like.', bg: 'var(--stage-1-bold)', text: 'var(--stage-1-text)', img: 'hf_20260701_114006_5fcc7cc3-35eb-4ce5-ac24-bea685ae33e6.png', count: '12 scripts', ks: 'Stage 4 and 5' },
            ]).map((cat) => (
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
                    height: '180px',
                    position: 'relative',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    <Image
                      src={`https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/${cat.img}`}
                      alt={cat.label}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center top' }}
                      sizes="(max-width: 540px) 100vw, (max-width: 860px) 50vw, 33vw"
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px', right: '12px',
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: '100px', padding: '4px 10px',
                      fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: cat.text, letterSpacing: '0.04em',
                    }}>
                      {cat.count}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '12px', left: '12px',
                      background: cat.bg,
                      borderRadius: '100px', padding: '3px 10px',
                      fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 600,
                      color: cat.text, letterSpacing: '0.06em', textTransform: 'uppercase',
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
              Start my pathway free
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          BALANCE — devices used well encourage the outdoor life too
          ================================================================ */}
      <section style={{ background: '#fff', padding: 'clamp(80px, 10vw, 112px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col" style={{ alignItems: 'center' }}>
            <div style={{
              position: 'relative', height: 'clamp(260px, 32vw, 380px)',
              borderRadius: '24px', overflow: 'hidden',
              boxShadow: '0 12px 44px rgba(26,26,46,0.12)',
            }}>
              <Image
                src="https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_112019_dc9be7a5-36d2-4c6c-92fc-fbb75515e423.png"
                alt="Children running and playing together outdoors"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Not screens or outdoors</p>
              <h2 style={{ marginBottom: '18px' }}>
                Both, done <span style={{ color: 'var(--terracotta)' }}>well</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, marginBottom: '16px' }}>
                A device set up well makes more room for real life, not less. Every stage on the pathway includes the boundary that protects outdoor play, unstructured time, and face to face connection, alongside the digital safety and AI literacy your child actually needs.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, marginBottom: '24px' }}>
                The goal is a child who is genuinely ready for the digital world ahead of them, including AI, and who still runs outside, still plays, and still talks to you. One does not come at the cost of the other when the structure is right.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Screen time structures built to protect time outside, not compete with it',
                  'Conversations that build real connection, not just device rules',
                  'AI literacy and digital safety taught alongside healthy offline habits',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '.95rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto' }}>
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

          {/* Curriculum list + Home educator CTA */}
          <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
            <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '16px' }}>
                What the lessons cover
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, padding: 0 }}>
                {[
                  'Screen behaviour, routines, and emotional regulation',
                  'Grooming, manipulation, consent, and online strangers',
                  'Sextortion, radicalisation, and dark web awareness',
                  'Misinformation, deepfakes, and AI-generated content',
                  'Algorithms, social media, privacy, digital reputation',
                  'AI literacy, data rights, full readiness at 16',
                  'Parent note included with every single lesson',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'var(--stage-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '12px' }}>
                Schools and home educators
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.35, marginBottom: '12px' }}>
                Want to bring this into your school or use it at home?
              </h3>
              <p style={{ fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.72, marginBottom: '20px' }}>
                We work with schools across the UK and with families who home educate. Every lesson comes ready to use, mapped to RSE and the Online Safety Act, with a parent note included so the learning extends beyond the classroom.
              </p>
              <a href="mailto:hello@guidedchildhood.com?subject=School%20or%20Home%20Education%20Enquiry" style={{
                display: 'inline-block',
                background: 'var(--terracotta)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '.72rem',
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                padding: '12px 22px',
                borderRadius: '16px',
                textDecoration: 'none',
                boxShadow: '0 5px 0 var(--terracotta-dark)',
              }}>
                Contact us to find out more
              </a>
              <p style={{ fontSize: '.7rem', color: 'var(--ink-muted)', marginTop: '12px' }}>
                We will reply within one working day.
              </p>
            </div>
          </div>
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
              <h2 className="fu" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span>DiGi has read every study.<br />Ask anything.</span>
                <DigiCharacter mood="wave" size={56} />
              </h2>
              <p className="fu" style={{ fontSize: '.94rem', color: 'var(--ink)', lineHeight: 1.82, marginBottom: '12px' }}>
                Most parents search Google at 10pm trying to work out what to do about a specific thing that happened today. DiGi replaces that. Tell it what happened, your child's age and stage, and it gives you the exact words and the structural change that will make a difference.
              </p>
              <p className="fu" style={{ fontSize: '.94rem', color: 'var(--ink)', lineHeight: 1.82, marginBottom: '28px' }}>
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
                    <DigiCharacter mood="speak" size={52} />
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
                    color: 'var(--ink)',
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
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
              These signals do not mean something is wrong. They mean something is worth paying attention to. The Digital Health Report reads the real patterns in under 10 minutes. Serious flags are always shown free.{' '}
              <Link href="https://wellbeing.guidedchildhood.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'underline' }}>
                Run a report here.
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
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
                    <span><strong style={{ color: 'var(--ink)' }}>{title}:</strong> {body}</span>
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
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
                width: '160px',
                height: '160px',
                borderRadius: '24px',
                overflow: 'hidden',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(61,115,154,.18)',
              }}>
                <img
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260630_110934_b98c5da7-a06d-414d-b320-72540a7cc384.png"
                  alt="Justin Phillips, founder of Guided Childhood"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
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
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '14px' }}>
                I am Justin Phillips, founder of The Social Billboard and Guided Childhood. I am not a researcher. I read the researchers. Then I built a platform that translates what they found into something parents can actually use this week.
              </p>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '28px' }}>
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
          <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 48px' }}>
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
            <p style={{ fontSize: '.92rem', color: 'var(--ink)', maxWidth: '420px', margin: '0 auto 26px', lineHeight: 1.8 }}>
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
            <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
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
            <p style={{ fontSize: '.88rem', color: 'var(--ink)', lineHeight: 1.75, maxWidth: '500px', margin: '0 auto 20px' }}>
              Upload their data from YouTube, TikTok, Instagram, Facebook or their browser history. No logins needed. The Digital Health Report shows you the patterns underneath, and where to start.
            </p>
            <Link href="https://wellbeing.guidedchildhood.com/" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get your child&apos;s Digital Health Report</Link>
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
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink)', lineHeight: 1.82, marginBottom: '14px' }}>
                Most school programmes cover what to do when something goes wrong. Guided Childhood covers everything before that moment and everything that comes after.
              </p>
              <p className="fu" style={{ fontSize: '.92rem', color: 'var(--ink)', lineHeight: 1.82, marginBottom: '28px' }}>
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
                tier: 'Best value', name: 'Annual OS', price: '£99', period: '/year',
                save: 'Save £57. Two months free.',
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
                tier: 'Monthly', name: 'Guided Childhood OS', price: '£12.99', period: '/month',
                save: 'First 50: lock in £7.99/month for life.',
                features: [
                  ['✓', 'Everything in annual'],
                  ['✓', 'Pay month to month'],
                  ['✓', 'Cancel any time'],
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
              Your family's pathway starts free today
            </span>
          </div>
          <h2 className="fu" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.05, marginBottom: '18px' }}>
            Start your family's<br />
            <span style={{ color: 'var(--terracotta)' }}>guided childhood today</span>
          </h2>
          <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, marginBottom: '36px' }}>
            No setup. No waiting. The starter pack is free and arrives immediately. One account covers all your children.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: '15px', padding: '17px 40px' }}>
              Start my pathway free
            </Link>
            <Link href="https://wellbeing.guidedchildhood.com/" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 700, padding: '17px 36px', borderRadius: 'var(--radius-btn)',
              border: '2px solid var(--ink)', color: 'var(--ink)', textDecoration: 'none',
              background: 'transparent', transition: 'background .15s',
            }}>
              Get the health report
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
      <footer style={{ background: 'var(--deep-teal)', padding: 'clamp(48px, 6vw, 72px) 32px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>

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
              {[['Free Starter Pack', '/starter-pack'], ['Digital Health Check', 'https://wellbeing.guidedchildhood.com/'], ['Ask DiGi', '/starter-pack'], ['For Schools', '/schools'], ['Pricing', '#pricing']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <Link
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500 }}
                  >{label}</Link>
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
