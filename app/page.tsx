import type { Metadata } from 'next'
import Link from 'next/link'
import AnnouncementBar from '@/components/marketing/AnnouncementBar'
import FlipCards from '@/components/marketing/FlipCards'
import HomeReveals from '@/components/marketing/HomeReveals'
import PassportSection from '@/components/marketing/PassportSection'
import SeeInside from '@/components/marketing/SeeInside'
import DigiGreeter from '@/components/marketing/DigiGreeter'
import BackToTop from '@/components/marketing/BackToTop'
import MarketingNav from '@/components/marketing/MarketingNav'
import HeaderActions from '@/components/marketing/HeaderActions'
import FounderBadge from '@/components/marketing/FounderBadge'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { CONTACT, hasAddress } from '@/lib/content/contact'
// The live origin, from the one place it is written down. This page had five
// copies of https://www.guidedchildhood.co.uk hardcoded, a domain the business
// does not own, in the two things that decide which address Google indexes:
// the canonical and the Organization and WebSite structured data. The 9 August
// pass fixed robots, the sitemap and the metadataBase and missed the home page,
// which is the page all of it points at.
import { SITE_URL } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Guided Childhood · A clear digital pathway from first screen to 16',
  description: 'What to do, when to do it, how to do it. Age by age lessons, habits and quests for UK families, all science backed, finished with your child\'s Digital Passport. Ask DiGi anything at any hour.',
  keywords: [
    'digital parenting UK', 'screen time scripts', 'digital literacy for children',
    'child screen time advice', 'social media age UK', 'digital parenting pathway',
    'digital passport for children', 'screen time arguments', 'under 16 social media ban',
    'online safety for children UK', 'AI literacy for kids', 'screen time rewards',
    'chores for screen time', 'safe device settings by age',
  ],
  openGraph: {
    title: 'A clear digital pathway from first screen to 16.',
    description: 'What to do, when to do it, how to do it. Age by age lessons, habits and quests, all science backed, finished with their Digital Passport. Free to start.',
    url: SITE_URL,
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A clear digital pathway from first screen to 16.',
    description: 'What to do, when to do it, how to do it. Age by age lessons, habits and quests, all science backed, finished with their Digital Passport.',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

// ── Stage definitions (ported unchanged: verbatim parent quotes per stage) ───

const STAGES = [
  {
    num: '01', name: 'Foundation', ks: 'EYFS and KS1', ages: 'Ages 4 to 7',
    device: 'Shared screen',
    tags: ['TV routines', 'Co viewing', 'No solo device'],
    quote: '"I cannot get my four year old off the iPad. What am I doing wrong?"',
    bg: 'var(--stage-1)', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)',
  },
  {
    num: '02', name: 'First Steps', ks: 'KS2 · Yr 3 to 5', ages: 'Ages 8 to 10',
    device: 'Restricted phone',
    tags: ['After school TV', 'Gaming time', 'Boredom'],
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
    device: 'Trust based',
    tags: ['Full access', 'AI literacy', 'Readiness'],
    quote: '"She is 16 next month. I have no idea if she is ready."',
    bg: 'var(--stage-5)', bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)',
  },
]

// ── The three strongest parent moments (from the 13 card set; the rest live
//    in the product). Chosen as the 11 o'clock proof: the nightly fight, the
//    signal parents fear, and the guilt loop. ─────────────────────────────────

const MOMENTS = [
  {
    frontLabel: 'Bedtime every night',
    front: '"He will not hand over his phone at bedtime. Every single night the same argument. I dread it."',
    backLabel: 'What actually fixes this',
    back: 'You are not overreacting. Blue light delays sleep onset by 90 minutes and teenagers need 9 hours. The argument is not about the phone. It is about the bedroom. Say: "The phone charges in the hallway overnight. Not as punishment. This is the rule for the whole house including me." Make it structural tonight. There is no argument when there is no decision to make.',
    bg: 'var(--stage-1)',
    stage: 'Stage 2 to 4 · Ages 8 to 15',
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
    frontLabel: 'I keep shouting',
    front: '"I lose patience every time. I end up shouting. I feel guilty. And tomorrow the exact same thing happens again."',
    backLabel: 'What actually fixes this',
    back: 'You are not a bad parent. You are a parent without a script for a problem that did not exist when you were a child. Guilt after shouting means you care. Say nothing tonight except: "I am sorry I shouted earlier. Tomorrow we try again." Then use DiGi to get the exact words before the next moment happens. You do not lose patience when you already know what to say.',
    bg: 'var(--stage-2)',
    stage: 'All stages',
  },
]

// ── The only real testimonials. Never invent a fourth. ───────────────────────

const TESTIMONIALS = [
  {
    quote: 'I was so nervous about giving my 11 year old a smartphone. With DiGi I can ask for help at every step, it shows me exactly how to set things up safely, and it settles me whenever a problem comes up.',
    name: 'Rachel',
  },
  {
    quote: 'It was gone midnight and I still could not get my 12 year old to sleep. I have so many moments like that in a week, and DiGi remembers them. It catches up with me on Sunday with a plan to make it better, and I do not feel like a bad parent anymore.',
    name: 'Joanne Reed',
  },
  {
    quote: 'I was worried Lilly was on her device too much. Now I can track how she is doing, and the quests help her balance her screen time with getting outside to play.',
    name: 'Maria Daniels',
  },
]

// ── Photography (Higgsfield Soul, candid editorial). To swap a photo, replace
//    the URL. The bright 12 Aug batch lives in the Higgsfield gallery. ───────

const HF = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'
const PHOTO_FAMILY_GRASS = HF + 'hf_20260812_114033_5c4f1927-62b5-4b85-98a7-f11dd12dc2cd.png'

// ─────────────────────────────────────────────────────────────────────────────


// The nine questions parents actually type, answered once. This one list
// renders the visible FAQ section AND the FAQPage structured data below,
// so what Google is told always matches what a visitor can read.
const FAQS = [
  { q: 'At what age should my child get their first phone?',
    a: "There is no single right age. Guided Childhood uses a five stage pathway from ages 4 to 16. The right time depends on your child's stage of development, your family structure, and what boundaries you have in place. Stage 2 (ages 8 to 10) is typically when children get a restricted first device. Stage 3 (ages 11 to 13) is when smartphones become more common. The question is not when but how." },
  { q: 'How do I deal with screen time arguments every day?',
    a: 'Screen time arguments happen when limits are inconsistent or when structure is missing. Guided Childhood gives you the exact scripts for the most common daily battles including after school TV demands, bedtime phone fights, and gaming meltdowns. The fix is structural, not stricter. One consistent routine replaces most daily arguments within two weeks.' },
  { q: 'When should children be allowed on social media?',
    a: 'The UK minimum age for most platforms is 13. Research by Dr Amy Orben at Cambridge identifies ages 11 to 13 as the highest sensitivity window, particularly for girls. Guided Childhood Stage 3 covers exactly this: the conversation to have before access, what to watch for during access, and the boundaries that protect without destroying trust.' },
  { q: 'Is screen time really harmful for children?',
    a: 'The research is more nuanced than most headlines suggest. Professor Candice Odgers at UC Irvine and Professor Andrew Przybylski at Oxford both find that the effects depend heavily on context, vulnerability, and structure. Screen time is not uniformly harmful. Too much, too early, without structure, for already vulnerable children is where risk concentrates. Guided Childhood is built on this nuanced research, not panic.' },
  { q: 'What is Guided Childhood and how does it work?',
    a: 'Guided Childhood is a clear digital pathway from first screen to 16 for UK families. You identify your child\'s stage, then the pathway tells you what to do, when to do it and how to do it: daily moments with the exact words, 160 scripts for the hard conversations, 100 lessons you can teach at home, a Digital Passport your child earns stage by stage, family quests where real jobs earn stars and stars buy agreed screen time, a child app for checking and requesting jobs, printables in English and Spanish, 24 age gated learning games, device setting checklists, a wellbeing tracker, a family agreement builder, and DiGi, your evidence led guide, whenever you need the specific words. It takes around ten minutes a day, and if you miss a few days the pathway catches you up.' },
  { q: 'Does Guided Childhood prepare my child for the UK under 16 social media ban?',
    a: 'Yes, that is the core of it. The UK ban delays social media access until 16 but does not teach children anything. Guided Childhood builds the judgement in the years before: a five stage pathway from age 4, lessons in misinformation, algorithms and AI literacy, and a Digital Passport earned stage by stage, so 16 arrives as a step rather than a cliff edge. Arriving with habits beats arriving with rules.' },
  { q: 'How do children earn screen time on Guided Childhood?',
    a: 'Children tick off real jobs and chores in their own app, and outside play pays the most. Stars land in their star bank, and stars buy agreed screen time on the star timer. Because the deal is theirs, the daily argument ends. Families without a child device run the whole thing from the parent app.' },
  { q: 'How do I teach my child about AI and chatbots?',
    a: 'Guided Childhood includes age by age AI literacy lessons: what an AI chatbot is, why it sounds confident when it is wrong, how algorithms and recommendation feeds work, and how to spot AI generated content. By 16 your child is AI literate, not just supervised.' },
  { q: 'Is banning devices better than teaching digital literacy?',
    a: 'OECD research finds device access among UK teenagers is now nearly universal, so the gap that remains is not who owns a device but who is taught to use one well. A ban does not close that gap. It removes the deep end from the child who was never taught, while the child already getting lessons is unaffected. Guided Childhood teaches digital literacy in stages instead, the same way children are taught to swim.' },
]

export default function HomePage() {
  return (
    <div className="home-v2" style={{ background: '#fff', overflowX: 'hidden' }}>

      <style>{`html:has(.home-v2){scroll-behavior:smooth} @media(prefers-reduced-motion:reduce){html:has(.home-v2){scroll-behavior:auto}} .home-v2 h2{font-family:var(--font-display);font-size:clamp(1.9rem,3.2vw,2.7rem);font-weight:900;letter-spacing:-.03em;line-height:1.08;color:var(--ink)} .home-v2 .lead{font-size:1.05rem} .home-v2 .body-lg{font-size:1rem} .hero-circle .chip-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:18px} .hero-circle .chip{position:static;max-width:100%} @media(max-width:819px){.hero-circle .chip-row{flex-direction:column;align-items:stretch} .hero-circle .chip{width:100%} .hero-circle .chip span:last-child{white-space:normal!important} .hero-passport{top:-58px!important;right:0!important;padding:9px 11px!important} .hero-passport .hero-passport-word{font-size:.85rem!important}} @media(min-width:820px){.hero-circle .chip-row{display:contents} .hero-circle .chip{position:absolute} .hero-circle .chip-1{top:26%;left:-7%} .hero-circle .chip-2{top:-3%;right:0} .hero-circle .chip-3{top:52%;right:-8%} .hero-circle .chip-4{bottom:2%;right:6%} .hero-circle .chip-5{bottom:16%;left:-7%}} .home-v2 .faq details{border-bottom:1px solid var(--border)} .home-v2 .faq details:last-child{border-bottom:none} .home-v2 .faq summary{cursor:pointer;font-family:var(--font-display);font-weight:800;font-size:1.05rem;color:var(--ink);padding:16px 0;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:14px} .home-v2 .faq summary::-webkit-details-marker{display:none} .home-v2 .faq summary::after{content:"+";font-weight:900;font-size:1.25rem;color:var(--terracotta);flex-shrink:0;transition:transform .18s ease} .home-v2 .faq details[open] summary::after{transform:rotate(45deg)} @media(max-width:430px){.home-v2 .brand-word{display:none}}`}</style>

      <AnnouncementBar />
      <HomeReveals />

      {/* JSON-LD structured data, aligned with the locked message */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Guided Childhood',
            description: 'A clear digital pathway from first screen to 16. Age by age lessons, habits and quests for UK families, all science backed, finished with their Digital Passport.',
            url: SITE_URL,
            foundingDate: '2024',
            founder: { '@type': 'Person', name: 'Justin Phillips' },
            areaServed: { '@type': 'Country', name: 'United Kingdom' },
            knowsAbout: ['digital parenting', 'screen time', 'online safety', 'children social media', 'parental controls', 'digital wellbeing', 'AI literacy for children', 'digital literacy curriculum', 'under 16 social media ban', 'digital passport for children'],
            slogan: 'A clear digital pathway from first screen to 16.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Guided Childhood',
            url: SITE_URL,
            description: 'A clear digital pathway from first screen to 16.',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_URL}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(f => ({
              '@type': 'Question', name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
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
        padding: '0 clamp(14px, 4vw, 28px)',
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
          <span className="brand-word" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem, 4vw, 1rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.03em' }}>
            Guided Childhood
          </span>
        </Link>

        <MarketingNav />

        {/* The two buttons know whether they are talking to a stranger or a
            member. Signed in, they read Account and My dashboard instead of Log
            in and Get Started, so a parent who types the brand into the address
            bar is not sold a trial for the thing they already pay for.
            The check runs in the BROWSER, inside HeaderActions, so this page
            stays static for the people who have never heard of us. See that
            file for why a server side session read would have been the wrong
            trade. */}
        <HeaderActions />
      </header>

      {/* ================================================================
          1 · HERO — the locked message, one CTA, and the pathway itself
          drawn with the Planet Friends the child will actually meet
          ================================================================ */}
      <section id="hero" aria-label="Hero" style={{ padding: 'clamp(56px, 7vw, 88px) 32px clamp(48px, 6vw, 80px)', background: 'radial-gradient(ellipse 90% 130% at 88% 45%, #FAEDC2 0%, #FDF6DE 42%, #FFFBEE 72%)', overflow: 'hidden' }}>
        <div className="hero-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div>
            <p className="fu eyebrow" style={{ marginBottom: '18px' }}>
              For parents of children aged 4 to 16
            </p>
            {/* Mobile floor is 2rem, not 2.9: at 46px the 48 character
                headline ran six lines on an iPhone and pushed the CTA below
                the fold (Justin's screenshots, 26 and 27 Aug 2026). 32px is
                the bottom of the industry range for mobile heroes (Airbnb 32,
                Stripe and Duolingo 36), which this long headline needs, and
                it holds up when iOS text size is set larger than default.
                Laptops never use the floor, so only phones change. */}
            <h1 className="fu" style={{ fontSize: 'clamp(2rem, 5.2vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-.035em', color: 'var(--ink)', maxWidth: '560px', marginBottom: '18px' }}>
              A clear digital pathway from first screen to 16.
            </h1>
            <p className="fu" style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '490px', marginBottom: '26px' }}>
              What to do, when to do it, how to do it. Age by age lessons, habits and quests, all science backed, finished with their Digital Passport.
            </p>
            <div className="fu" style={{ marginBottom: '12px' }}>
              <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: 'var(--text-lg)', padding: '17px 42px' }}>
                Start for free
              </Link>
            </div>
            <p className="fu" style={{ fontSize: '.85rem', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '18px' }}>
              Three questions. Two minutes. Free. No card required.
            </p>
            {/* The badge reads the REAL seat count now. It used to be this
                sentence hardcoded, which meant that after the fiftieth sale the
                shopfront would have gone on advertising 7.99 for life while
                checkout refused to sell it. See FounderBadge for why it counts
                in the browser rather than on the server.

                Merge note, 12 August 2026: main bumped this line from .86rem to
                .96rem while this branch was replacing the block. That size is
                carried forward inside FounderBadge rather than lost, which is
                the whole reason this conflict was worth reading rather than
                resolving by picking a side. */}
            <FounderBadge />
            {/* Proof bar: named research beside the one real hero quote */}
            <div className="fu proof-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 26px', alignItems: 'center', maxWidth: '520px' }}>
              <p style={{ fontSize: 'clamp(.86rem, .7rem + .35vw, 1rem)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.65, flex: '1 1 260px', minWidth: '240px', margin: 0 }}>
                Built on five of the world's leading researchers in children, social media and mental health, and live data from more than ten national bodies. Reviewed weekly, because the landscape never sits still.
              </p>
              <div style={{ flex: '0 1 200px', minWidth: '180px', borderLeft: '2px solid var(--terracotta)', paddingLeft: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>Parent quote</div>
                <p style={{ fontSize: '.96rem', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                  &ldquo;With DiGi I can ask for help at every step.&rdquo; <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Rachel</span>
                </p>
              </div>
            </div>
          </div>

          {/* The signature: the road to 16, drawn with the five Planet Friends
              rising stage by stage toward the passport. House art from the CDN,
              the same characters the child meets inside the product. */}
          <div className="fu hero-path" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div className="fu hero-circle" style={{ position: 'relative', padding: '26px 0' }}>
          <div style={{ width: 'min(72vw, 380px)', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', margin: '0 auto', boxShadow: '0 24px 70px rgba(26,26,46,0.16)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTO_FAMILY_GRASS}
              alt="A family laughing together on the grass, their phone left face down beside them"
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div className="chip-row">
            {[
              ['\uD83C\uDF19', 'Bedtime battles', 'var(--stage-1-bold)'],
              ['\u2B50', 'Do your chores and earn device time', 'var(--stage-2-bold)'],
              ['\uD83D\uDEE1\uFE0F', 'Balanced, safe device use', 'var(--stage-2)'],
              ['\uD83D\uDCF1', 'Social media, ready by 16', 'var(--stage-3-bold)'],
              ['\uD83E\uDD16', 'AI chatbots, explained', 'var(--stage-5-bold)'],
            ].map((chip, i) => {
              const [icon, label, tint] = chip as [string, string, string]
              return (
                <div key={label} className={`chip chip-${i + 1}`} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: '#fff', border: '1px solid var(--border)', borderRadius: '13px', padding: '9px 14px 9px 9px', boxShadow: '0 8px 24px rgba(26,26,46,0.12)' }}>
                  <span aria-hidden style={{ width: 32, height: 32, borderRadius: '9px', background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '.98rem', fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
            <div aria-hidden style={{ position: 'relative', minHeight: '190px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(2px, 1vw, 12px)', width: '100%', maxWidth: '480px', justifyContent: 'center', position: 'relative', paddingBottom: '30px' }}>
              {STAGE_CHARACTERS.map((c, i) => (
                <div key={c.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transform: `translateY(-${i * 24}px)`, flex: '0 0 auto' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.cutout}
                    alt=""
                    loading={i < 2 ? 'eager' : 'lazy'}
                    style={{ width: 'clamp(44px, 5.5vw, 66px)', height: 'auto', filter: 'drop-shadow(0 6px 10px rgba(26,26,46,0.18))' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    {c.ages.replace('Ages ', '')}
                  </span>
                </div>
              ))}
              {/* The destination: the passport, earned at the top of the path */}
              <div className="hero-passport" style={{ position: 'absolute', top: '-52px', right: '-6px', transform: 'rotate(6deg)', background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 60%, #4A1723 100%)', borderRadius: '8px 10px 10px 8px', padding: '12px 14px', boxShadow: '0 10px 26px rgba(0,0,0,0.25), inset 0 0 0 1.5px rgba(237,195,95,0.55)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.85)', marginBottom: '4px' }}>Digital</div>
                <div className="hero-passport-word" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: '#EDC35F', letterSpacing: '.02em' }}>PASSPORT</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', width: 'min(100%, 460px)', borderBottom: '2px dashed var(--terracotta)', opacity: .5 }} />
            </div>
          </div>
        </div>

        {/* The ban framing, small, directly under the promise */}
        <p className="fu" style={{ maxWidth: '720px', margin: '40px auto 0', textAlign: 'center', fontSize: 'clamp(.98rem, .8rem + .4vw, 1.18rem)', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          Every answer you find says ban it all, or give in and dread it. Neither one teaches your child a single thing. <strong style={{ color: 'var(--ink)' }}>There is a third way, a guided one.</strong>
        </p>
        {/* Everything else inside, said at whisper volume: one loud image,
            one quiet pill row. How the best sites show breadth without
            crowding. */}
        <div className="fu" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '760px', margin: '24px auto 0' }}>
          {[
            'The habit forming star system', '160 scripts', '100 lessons', 'Printables',
            'Homework help', 'School syllabus tracking', 'Outside play pays most', 'The wellbeing tracker',
          ].map(item => (
            <span key={item} style={{ fontSize: '.84rem', fontWeight: 600, color: 'var(--ink-soft)', background: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '7px 14px' }}>
              {item}
            </span>
          ))}
        </div>
        <div className="fu" style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 34px' }}>
            Fix your fight first
          </Link>
        </div>
      </section>

      {/* ================================================================
          2 · THE 11 O'CLOCK MOMENT — DiGi, any question, any hour,
          and it remembers your family
          ================================================================ */}
      <section aria-label="Ask DiGi anything" style={{ padding: 'clamp(64px, 9vw, 104px) 32px', background: 'var(--cream)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col">

            <div>
              <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>
                Ask anything, any hour
              </p>
              <h2 className="fu" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span>The expert in your pocket at 11 o&rsquo;clock.</span>
                <DigiCharacter mood="wave" size={56} />
              </h2>
              <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.82, marginBottom: '12px' }}>
                It&rsquo;s 11 o&rsquo;clock and you&rsquo;ve just seen something on their phone. You cannot ring anyone. You cannot think straight. You just need to know what to do before they wake up. DiGi has read every study so you do not have to. Tell it what happened and it gives you a researched answer and the exact words to use tomorrow morning.
              </p>
              <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.82, marginBottom: '12px' }}>
                Not general advice. The script for tonight.
              </p>
              <p className="fu" style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.82, marginBottom: '28px' }}>
                <strong>And DiGi remembers.</strong>{' '}What you tell us matters: your child&rsquo;s age, their stage, what happened last month. Every answer starts from your family&rsquo;s history, not from zero.
              </p>
              <ul className="fu" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {[
                  'Knows your child\'s exact age and developmental stage',
                  'Remembers what you have told it, week to week',
                  'Covers screen time, gaming, social media, mood, sleep and online safety',
                  'Built on Odgers, Orben, Przybylski, Livingstone and the NHS guidance',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.97rem', color: 'var(--ink-soft)' }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 900, flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: 'var(--text-base)' }}>
                Ask DiGi your first question
              </Link>
            </div>

            {/* The chat, exactly as it works in the product */}
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
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em' }}>DiGi</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--ink-muted)', marginTop: '1px' }}>Guided Childhood Advisor</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '.67rem', color: 'var(--terracotta)', fontWeight: 600, background: 'rgba(255,255,255,.6)', padding: '4px 10px', borderRadius: '100px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                    Online now
                  </div>
                </div>

                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'var(--terracotta)', border: '2px solid var(--terracotta-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 var(--terracotta-dark)' }}><DigiCharacter mood="speak" size={26} /></span>
                    <div className="bubble-digi" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '4px 18px 18px 18px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)', fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                      What is happening at home with screens right now?
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="bubble-parent">
                      Every evening my nine year old comes in from school and immediately wants the TV on. If I say no it is a full meltdown.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'var(--terracotta)', border: '2px solid var(--terracotta-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 var(--terracotta-dark)' }}><DigiCharacter mood="speak" size={26} /></span>
                    <div className="bubble-digi" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '4px 18px 18px 18px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)', fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                      This is one of the most common patterns at Stage 2. The fix is a 20 minute wind down routine with a script so it does not become a fight. Want the exact words for tonight?
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="bubble-parent">Yes please</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'var(--terracotta)', border: '2px solid var(--terracotta-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 var(--terracotta-dark)' }}><DigiCharacter mood="speak" size={26} /></span>
                    <div className="bubble-digi" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '4px 18px 18px 18px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)', fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
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
                  <Link href="/starter-pack" aria-label="Ask DiGi" style={{
                    background: 'var(--terracotta)',
                    color: 'var(--ink)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.97rem',
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

          {/* The three moments every parent recognises, script on the back */}
          <div style={{ marginTop: '52px' }}>
            <p className="eyebrow fu" style={{ textAlign: 'center', color: 'var(--terracotta)', marginBottom: '10px' }}>Tap a card, get the script</p>
            <h3 className="fu" style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)', letterSpacing: '-.02em', color: 'var(--ink)', margin: '0 0 28px' }}>
              The moments you will recognise
            </h3>
            <FlipCards cards={MOMENTS} />
          </div>
        </div>
      </section>

      {/* ================================================================
          3 · WE DRIVE YOU — what to do, when, how
          ================================================================ */}
      <section id="how-it-works" aria-label="We drive you" style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What to do, when, how</p>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              You are not the strategist.<br />You are the parent. <span style={{ color: 'var(--terracotta)' }}>We drive.</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '540px', margin: '0 auto' }}>
              Nine in ten parents argue with their kids over screens, and policing without a plan is exactly what every parent has been left to do. So we do the planning. Every week the pathway hands you the next step: this week&rsquo;s lesson, tonight&rsquo;s script, the one habit to set. Start at 4 or start at 13, it meets your child where they are.
            </p>
          </div>

          <div className="three-col">
            {[
              {
                num: '01',
                title: 'Ten minutes a day',
                body: 'One moment, one script, one small win each evening. Miss a few days and the pathway catches you up. Life happens, the plan holds.',
                tint: 'var(--stage-1-bold)',
              },
              {
                num: '02',
                title: 'The road to 16',
                body: 'Your child moves along five stages, earning passport stamps as they learn. By the time the apps arrive at sixteen, they are ready, because ready was built.',
                tint: 'var(--stage-2-bold)',
              },
              {
                num: '03',
                title: 'They earn their screen time',
                body: 'Real jobs and play earn stars. Stars buy agreed screen time on the star timer. The argument ends because the deal is theirs, and they keep it.',
                tint: 'var(--stage-3-bold)',
              },
            ].map(step => (
              <div key={step.num} className="fu" style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 5px 0 var(--border)', padding: '30px 26px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ width: 46, height: 46, borderRadius: '14px', background: step.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: '18px', boxShadow: '0 3px 0 rgba(0,0,0,0.1)' }}>
                  {step.num}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', margin: '0 0 10px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '.97rem', color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <p className="fu" style={{ textAlign: 'center', marginTop: '32px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            Guardrails you teach. Not gates you lock.
          </p>

          <div className="fu" style={{ textAlign: 'center', marginTop: '22px' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 34px' }}>
              Start tonight
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          4 · INSIDE THE PLATFORM — proof, not promises
          ================================================================ */}
      <section aria-label="Inside the platform" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The real thing, not a mockup</p>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              One calm system.<br />Every part <span style={{ color: 'var(--terracotta)' }}>earns its place.</span>
            </h2>
          </div>

          {/* Specific claims beat adjectives */}
          <div className="fu" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 56px)', flexWrap: 'wrap', marginBottom: '44px' }}>
            {[
              ['160', 'scripts'],
              ['100', 'lessons'],
              ['5', 'stages'],
              ['1', 'family account, every child'],
            ].map(([n, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.03em', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.64rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '6px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* The inventory, eight parts, one line each */}
          <div className="fu" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            {[
              ['Daily tips that fit tonight', 'A script and a tip for the exact fight you are having. Ten minutes a day, and the pathway catches you up whenever life happens.'],
              ['Chores earn screen time', 'Your child ticks real jobs in their own app, stars land in their star bank, stars buy agreed device time. The fight ends because the deal is theirs.'],
              ['Balance, watched together', 'Safe device settings by age, matched with the reward star system. Outside play pays the most stars, and the wellbeing tracker shows the balance shifting.'],
              ['Lessons in social media, gaming and AI', 'Age by age lessons so they can spot an algorithm, a fake and an AI chatbot long before 16. Social media and AI literate, not just supervised.'],
              ['School calendar reminders', 'Term dates, homework rhythms and school activity messages home, so the plan fits real weeks, not perfect ones.'],
              ['The Digital Passport', 'Every stage stamped, every page earned. Tap each page open above, done by 16.'],
            ].map(([title, body]) => (
              <div key={title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px 18px 16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '.98rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.01em', marginBottom: '6px' }}>{title}</div>
                <p style={{ fontSize: '.98rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>

          <p className="fu" style={{ textAlign: 'center', fontSize: '.98rem', color: 'var(--ink-muted)', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 10px' }}>
            Plus printables in English and Spanish, 24 age gated learning games, and school activity messages home. No device of their own yet? Everything works through your app, so a six year old can hold their first jobs list years before their first phone.
          </p>
          <p className="fu" style={{ textAlign: 'center', fontSize: '.98rem', color: 'var(--ink-muted)', margin: '0 0 44px' }}>
            For schools: <Link href="https://www.guidedchildhood.com/schools" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>see the school programme</Link>
          </p>

          <SeeInside />
        </div>
      </section>

      {/* ================================================================
          5 · WATCHING WITH YOU — safety without surveillance
          ================================================================ */}
      <section aria-label="Safety without surveillance" style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Safety without surveillance</p>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              We will never ask you to <span style={{ color: 'var(--terracotta)' }}>spy on your child.</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '540px', margin: '0 auto' }}>
              Control apps sell certainty and deliver an arms race. Kids disable them in days, and every fight gets worse. We teach the settings worth setting, show you what to look for, and build the one thing no app can: a child who comes to you first.
            </p>
          </div>

          <div className="three-col">
            {[
              {
                title: 'The settings that matter',
                body: 'Per age, per device, done together rather than in secret. A checklist you set once and review each stage, so the workaround conversation is a trust conversation, not a discovery.',
                tint: 'var(--stage-2)',
              },
              {
                title: 'The signals worth noticing',
                body: 'Mood after screens, sleep, withdrawal from things they loved. What the research says to pay attention to, for your child and for you, without panic and without diagnosis.',
                tint: 'var(--stage-3)',
              },
              {
                title: 'Balance that holds',
                body: 'Screens and outdoors, both done well. Quests push play outside, the star timer keeps the deal honest, and the wellbeing tracker shows the balance actually shifting.',
                tint: 'var(--stage-1)',
              },
            ].map(col => (
              <div key={col.title} className="fu" style={{ background: col.tint, borderRadius: '20px', border: '1px solid var(--border)', padding: '28px 24px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', margin: '0 0 10px' }}>
                  {col.title}
                </h3>
                <p style={{ fontSize: '.95rem', color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                  {col.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          6 · THREE ACTS — tonight, this term, sixteen. The passport is
          the finish line.
          ================================================================ */}
      <section aria-label="What changes and when" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px 0' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What changes and when</p>
            <h2 className="fu" style={{ margin: 0 }}>
              Tonight. This term. Sixteen. <span style={{ color: 'var(--terracotta)' }}>Always.</span>
            </h2>
          </div>

          <div className="three-col" style={{ marginBottom: '24px' }}>
            {[
              {
                label: 'Tonight',
                body: '"The phone charges in the hallway from tonight. Whole house rule, mine included." One script, one calmer bedtime.',
                tint: 'var(--stage-1-bold)',
              },
              {
                label: 'This term',
                body: 'The fights shrink. The conversations open. You trust yourself as a parent again.',
                tint: 'var(--stage-2-bold)',
              },
              {
                label: 'At 16',
                body: 'They walk into social media the way you wanted them to. Ready, not just released. Passport stamped, habits set, and they still come to you.',
                tint: 'var(--stage-5-bold)',
              },
              {
                label: 'Always',
                body: '"I trust myself as a parent again." The rules become a relationship. That is the whole point.',
                tint: 'var(--stage-4-bold)',
              },
            ].map(act => (
              <div key={act.label} className="fu" style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 5px 0 var(--border)', padding: '28px 24px' }}>
                <div style={{ display: 'inline-block', background: act.tint, borderRadius: '100px', padding: '5px 14px', fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '14px' }}>
                  {act.label}
                </div>
                <p style={{ fontSize: '.97rem', color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                  {act.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <PassportSection />
      </section>

      {/* ================================================================
          7 · WHERE IS YOUR CHILD RIGHT NOW — the five stages, each led
          by a real parent's words and its Planet Friend
          ================================================================ */}
      <section id="stages" aria-label="The five stages" style={{ padding: 'clamp(80px, 10vw, 120px) 32px', background: '#fff', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Start where your child is</p>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              Where is your child <span style={{ color: 'var(--terracotta)' }}>right now?</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto' }}>
              Multiple children at different stages? One account covers all of them.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: '16px' }}>
            {STAGES.map((s, i) => {
              const friend = STAGE_CHARACTERS[i]
              return (
                <div key={s.num} className="fu" style={{ background: s.bg, border: s.critical ? '2px solid var(--stage-3-bold)' : '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: s.bold, padding: '14px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', color: s.text, opacity: .75 }}>{s.num} · {s.ages}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: s.text, letterSpacing: '-.02em' }}>{s.name}</div>
                    </div>
                    {friend && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={friend.cutout} alt={`${friend.name}, the ${s.ages} Planet Friend`} loading="lazy" style={{ width: '44px', height: 'auto', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <p style={{ fontSize: '1.04rem', color: 'var(--ink)', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 14px', flex: 1 }}>
                      {s.quote}
                    </p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                      {s.ks} · {s.device}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {s.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '.64rem', fontWeight: 600, color: 'var(--ink-soft)', background: 'rgba(255,255,255,.7)', border: '1px solid var(--border)', borderRadius: '100px', padding: '3px 9px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="fu" style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 34px' }}>
              Find my child&rsquo;s stage
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          8 · JUSTIN AND THE RESEARCH BENCH
          ================================================================ */}
      <section id="about" aria-label="Founder and research" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col-wide" style={{ marginBottom: '52px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '24px',
                overflow: 'hidden',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(61,115,154,.18)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
              <p className="fu" style={{ fontSize: '.98rem', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '14px' }}>
                I am Justin Phillips, founder of The Social Billboard and Guided Childhood. I am not a researcher. I read the researchers. Then I built a platform that translates what they found into something parents can actually use this week.
              </p>
              <p className="fu" style={{ fontSize: '.98rem', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '28px' }}>
                The problem is not the phone. The problem is nobody gave parents a map. A law about social media does not give you one. Guided Childhood does.
              </p>
              <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: 'var(--text-base)' }}>
                Find my starting point
              </Link>
            </div>
          </div>

          {/* Science backed, said once, names live on the evidence page */}
          <div className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', margin: '0 0 6px' }}>
              The science moves. So do we.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--ink-muted)', margin: 0 }}>
              Five leading researchers in children, social media and mental health. Live data from more than ten national associations, NHS and NSPCC among them. Every lesson and every DiGi answer reviewed weekly against the newest findings, so tonight's guidance matches the world your child is actually in. <Link href="/evidence" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>See the evidence</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          9 · REAL WORDS, REAL PRICE
          ================================================================ */}
      <section aria-label="Testimonials and pricing" style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

          <p className="eyebrow fu" style={{ textAlign: 'center', color: 'var(--terracotta-dark)', marginBottom: '10px' }}>From our first families</p>
          <h2 className="fu" style={{ textAlign: 'center', margin: '0 0 12px' }}>
            Real words from <span style={{ color: 'var(--terracotta)' }}>real parents</span>
          </h2>
          <p className="fu" style={{ textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 32px' }}>
            You are not doing this wrong, and you are not doing it alone.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '64px' }}>
            {TESTIMONIALS.map((p) => (
              <div key={p.name} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px 22px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 0 var(--border)' }}>
                <div aria-hidden style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--terracotta)', lineHeight: 0.7, marginBottom: '10px' }}>&ldquo;</div>
                <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 18px', flex: 1 }}>
                  {p.quote}
                </p>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '3px' }}>Guided Childhood parent</div>
                </div>
              </div>
            ))}
          </div>

          {/* Vivid future framing above the price, then the price */}
          <p className="fu" style={{ textAlign: 'center', fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 36px' }}>
            Imagine this time next year. You know exactly what to say. The conversations do not spiral. Your child comes to you.
          </p>

          <div id="pricing" style={{ scrollMarginTop: '84px' }} />
          <div className="fu" style={{ background: 'var(--terracotta)', borderRadius: '14px', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', flexShrink: 0 }}>Limited</span>
              <span style={{ fontSize: '.98rem', fontWeight: 600, color: '#fff' }}>
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
                tier: 'Try it first', name: 'Free Trial', price: 'Free', period: '',
                save: 'Four days. No card required.',
                features: [
                  ['✓', 'Four days inside the platform'],
                  ['✓', 'DiGi, with a daily limit'],
                  ['✓', 'A starter set of scripts'],
                  ['✓', 'Your age stage roadmap'],
                ],
                cta: 'Start free trial', href: '/starter-pack',
                note: 'The founder rate is claimed at sign up, first 50 families only. Start your trial now and it is yours.',
                ctaBg: 'transparent', ctaColor: 'var(--ink)', ctaBorder: '2px solid var(--border)', ctaShadow: 'none',
                cardStyle: {},
              },
              {
                tier: 'Best value', name: 'Annual OS', price: '£99', period: '/year',
                save: 'Save £57. Two months free.',
                features: [
                  ['✓', 'Full five stage dashboard'],
                  ['✓', 'Weekly three action plan'],
                  ['✓', 'All scripts and guides'],
                  ['✓', 'Full curriculum, all lessons'],
                  ['✓', 'Digital wellbeing tracker'],
                  ['✓', 'DiGi, unlimited'],
                  ['✓', 'School lesson packs included'],
                ],
                cta: 'Start now', href: '/starter-pack',
                note: '',
                ctaBg: 'var(--terracotta)', ctaColor: 'var(--ink)', ctaBorder: 'none', ctaShadow: '0 5px 0 var(--terracotta-dark)',
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
                cta: 'Start now', href: '/starter-pack',
                note: '',
                ctaBg: 'var(--terracotta)', ctaColor: 'var(--ink)', ctaBorder: 'none', ctaShadow: '0 5px 0 var(--terracotta-dark)',
                cardStyle: {},
              },
            ].map((plan, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', ...plan.cardStyle }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px', minHeight: '2em' }}>
                  {plan.tier}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: '16px', minHeight: '2.6em', display: 'flex', alignItems: 'flex-start' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '5px' }}>
                  {plan.period && <span style={{ fontSize: '.97rem', fontWeight: 700, color: 'var(--ink)' }}>£</span>}
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
                    <li key={fi} style={{ display: 'flex', gap: '9px', fontSize: '1rem', color: 'var(--ink-soft)', alignItems: 'flex-start' }}>
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
                {plan.note && (
                  <p style={{ fontSize: '.78rem', color: 'var(--ink-muted)', lineHeight: 1.55, textAlign: 'center', margin: '10px 0 0' }}>
                    {plan.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQS — the same nine answers the structured data carries,
          visible, because a page must show what it tells Google it has
          ================================================================ */}
      <section id="faqs" aria-label="Questions parents ask" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p className="eyebrow fu" style={{ textAlign: 'center', color: 'var(--terracotta-dark)', marginBottom: '10px' }}>FAQs</p>
          <h2 className="fu" style={{ textAlign: 'center', margin: '0 0 26px' }}>
            Questions parents <span style={{ color: 'var(--terracotta)' }}>ask us</span>
          </h2>
          <div className="faq fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '6px 24px', boxShadow: '0 5px 0 var(--border)' }}>
            {FAQS.map(f => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 18px' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          10 · FINAL CTA — one button, said once
          ================================================================ */}
      <section aria-label="Start today" style={{ textAlign: 'center', padding: 'clamp(80px, 10vw, 120px) 32px', background: '#FFFBEE', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--stage-1-bold)', borderRadius: '100px', padding: '6px 16px', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--stage-1-text)' }}>
              Your family&rsquo;s pathway starts free today
            </span>
          </div>
          <h2 className="fu" style={{ fontSize: 'clamp(1.9rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: '18px' }}>
            It is not too late.<br />
            <span style={{ color: 'var(--terracotta)' }}>It is not too early either.</span>
          </h2>
          <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.8, marginBottom: '36px' }}>
            There are more school pickups, more car journeys, more evenings ahead of you than behind you. Start tonight. One account covers all your children.
          </p>
          <div style={{ marginBottom: '20px' }}>
            <Link href="/starter-pack" className="btn btn-gold fu" style={{ fontSize: 'var(--text-md)', padding: '17px 40px' }}>
              Start for free
            </Link>
          </div>
          <div style={{ fontSize: '.72rem', color: 'var(--ink-muted)' }}>
            No card required · 30 day money back on launch
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER — the Digital Health Check's one and only link lives here
          ================================================================ */}
      <footer style={{ background: 'var(--deep-teal)', padding: 'clamp(48px, 6vw, 72px) 32px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--terracotta)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '15px' }}>
                    {[5, 9, 14, 8].map((h, i) => (
                      <div key={i} style={{ width: '3px', height: `${h}px`, background: '#fff', borderRadius: '1.5px' }} />
                    ))}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>Guided Childhood</span>
              </div>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: '240px' }}>
                A clear digital pathway from first screen to 16. For UK families. Built on the research.
              </p>

              {/* WHO YOU ARE BUYING FROM, in words rather than behind a link.
                  The email used to be the label on a Contact link and the name
                  was in a copyright line at 35 per cent opacity, so a visitor
                  could not tell who was behind this without opening the terms.
                  It is a legal requirement for selling online as well as the
                  decent thing, so it is set at a readable weight rather than
                  tucked away at footnote grey. */}
              <address style={{ fontStyle: 'normal', marginTop: '18px', fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,.72)', maxWidth: '240px' }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>{CONTACT.founder}</div>
                <div style={{ color: 'rgba(255,255,255,.6)' }}>{CONTACT.product}</div>
                {hasAddress() && (
                  <div style={{ marginTop: '8px', color: 'rgba(255,255,255,.6)' }}>
                    {CONTACT.address.map(line => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                )}
                <a
                  href={`mailto:${CONTACT.email}`}
                  style={{ display: 'inline-block', marginTop: '8px', color: 'var(--butter, #EDC35F)', fontWeight: 700, textDecoration: 'none' }}
                >
                  {CONTACT.email}
                </a>
              </address>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Guides</div>
              {[['Stage 1 · Ages 4 to 7', '#stages'], ['Stage 2 · Ages 8 to 10', '#stages'], ['Stage 3 · Ages 11 to 13', '#stages'], ['Stage 4 · Ages 13 to 15', '#stages'], ['Stage 5 · Ages 16+', '#stages']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <Link href={href} style={{ fontSize: '.96rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500, lineHeight: 1.4 }}>{label}</Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Tools</div>
              {[['Free Trial', '/starter-pack'], ['Digital Health Check', 'https://www.guidedchildhood.com/digitalwellbeing'], ['Ask DiGi', '/starter-pack'], ['For Schools', 'https://www.guidedchildhood.com/schools'], ['Pricing', '#pricing']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <Link
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{ fontSize: '.96rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500 }}
                  >{label}</Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Company</div>
              {[['About', '/pathway'], ['Contact', 'mailto:hello@guidedchildhood.com'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Login', '/login']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <Link href={href} style={{ fontSize: '.96rem', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500 }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.64rem', color: 'rgba(255,255,255,.35)' }}>
              © 2026 {CONTACT.business} · {CONTACT.founder}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Online Safety Act 2023', 'DfE', 'Ofcom', 'Statutory RSE'].map(tag => (
                <span key={tag} style={{ fontSize: '.64rem', color: 'rgba(255,255,255,.3)', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <DigiGreeter />
      <BackToTop />
    </div>
  )
}
