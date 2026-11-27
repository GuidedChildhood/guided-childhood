import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import AnnouncementBar from '@/components/marketing/AnnouncementBar'
import HeroPhoto from '@/components/marketing/HeroPhoto'
import HomeReveals from '@/components/marketing/HomeReveals'
import PassportSection from '@/components/marketing/PassportSection'
import DigiGreeter from '@/components/marketing/DigiGreeter'
import BackToTop from '@/components/marketing/BackToTop'
import MarketingNav from '@/components/marketing/MarketingNav'
import HeaderActions from '@/components/marketing/HeaderActions'
import FounderBadge from '@/components/marketing/FounderBadge'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { STAGES as PRODUCT_STAGES } from '@/lib/content/stages'
import { STAGE_OUTCOMES } from '@/lib/content/stage-outcomes'
import { TRY_LESSONS } from '@/lib/content/try-lessons'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { CONTACT, hasAddress, hasCompany } from '@/lib/content/contact'
// The live origin, from the one place it is written down. This page had five
// copies of https://www.guidedchildhood.co.uk hardcoded, a domain the business
// does not own, in the two things that decide which address Google indexes:
// the canonical and the Organization and WebSite structured data. The 9 August
// pass fixed robots, the sitemap and the metadataBase and missed the home page,
// which is the page all of it points at.
import { SITE_URL } from '@/lib/config/site'
import { pageMetadata } from '@/lib/seo/meta'
import { GUIDES } from '@/lib/content/guides'

export const metadata: Metadata = {
  // pageMetadata gives the canonical, the share card image and the Twitter
  // card. Before 19 November 2026 this page's own openGraph replaced the root
  // layout's whole object and left out the image, so a shared home page link
  // showed no picture.
  ...pageMetadata({
    title: 'Guided Childhood: first tablet to first phone, ages 4 to 16',
    absoluteTitle: true,
    // In the parent's words, not ours (the board's audience lens, 12 November
    // 2026): the nightly fight, the phone coming, what to say tonight. The
    // product names (the Digital Passport, the tracker) are inside the page.
    description: 'For UK parents of children aged 4 to 16: the words for the screen fights and the first phone, lessons for their age, and a Passport to 16. Free for 4 days.',
    path: '',
  }),
  keywords: [
    'digital parenting UK', 'screen time scripts', 'digital literacy for children',
    'child screen time advice', 'social media age UK', 'digital parenting pathway',
    'digital passport for children', 'Guided Digital Childhood Passport', 'screen time arguments', 'under 16 social media ban',
    'online safety for children UK', 'AI literacy for kids', 'screen time rewards',
    'chores for screen time', 'safe device settings by age',
  ],
}

// ── Stage definitions (ported unchanged: verbatim parent quotes per stage) ───
// `want` is ours, not a quote: what the parent is hoping for, beside the worry
// they arrive with. Added 23 September 2026 after Pam's review said the page
// only ever spoke in problems.

// THE PRODUCT'S OWN NAMES AND AGES (home-stage-names-match-product, 16 October
// 2026). This list said First Steps and Navigator, and 'Ages 11 to 13' beside
// 'Ages 13 to 15', so the parent of a 13 year old saw two stages here and the
// quiz then gave her one. The names and ages are now read from lib/content/
// stages.ts by stage number, the same list the stage check and the app use,
// so they cannot drift again. The rest of each card is the home page's own.
const HOME_STAGES = [
  {
    num: '01', name: 'Foundation', ks: 'EYFS and KS1', ages: 'Ages 4 to 7',
    device: 'Shared screen',
    tags: ['TV routines', 'Co viewing', 'No solo device'],
    quote: '"I cannot get my four year old off the iPad. What am I doing wrong?"',
    want: 'Screen time that ends calmly, because the routine decides, not you.',
    bg: 'var(--stage-1)', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)',
  },
  {
    num: '02', name: 'Builder', ks: 'KS2 · Yr 3 to 5', ages: 'Ages 8 to 10',
    device: 'Restricted phone',
    tags: ['After school TV', 'Gaming time', 'Boredom'],
    quote: '"The moment he walks in from school it is TV or gaming. I cannot break the cycle."',
    want: 'An after school rhythm they know by heart, with screens in it and the fight taken out.',
    bg: 'var(--stage-2)', bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)',
  },
  {
    num: '03', name: 'Explorer', ks: 'KS2/KS3 · Yr 6 to 8', ages: 'Ages 11 to 12',
    device: 'Guided smartphone',
    tags: ['Mood after screens', 'Sleep rules', 'Workarounds'],
    quote: '"Her mood drops every time she puts her phone down. I am worried."',
    want: 'A child who can tell you how their phone makes them feel, and wants to.',
    bg: 'var(--stage-3)', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)',
    critical: true,
  },
  {
    num: '04', name: 'Shaper', ks: 'KS3/KS4 · Yr 9 to 10', ages: 'Ages 13 to 15',
    device: 'Monitored social',
    tags: ['VPNs', 'Unknown accounts', 'Reputation'],
    quote: '"He has accounts I do not know about. What do I do?"',
    want: 'To be the first person they call when something online goes wrong.',
    bg: 'var(--stage-4)', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)',
  },
  {
    num: '05', name: 'Independent', ks: 'KS4/KS5 · Yr 11+', ages: 'Ages 16 and above',
    device: 'Trust based',
    tags: ['Full access', 'AI literacy', 'Readiness'],
    quote: '"She is 16 next month. I have no idea if she is ready."',
    want: 'A young adult who knows what their phone gives them, and what it costs.',
    bg: 'var(--stage-5)', bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)',
  },
]

const STAGES = HOME_STAGES.map((s, i) => ({ ...s, name: PRODUCT_STAGES[i].name, ages: PRODUCT_STAGES[i].ages }))

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
    a: "There is no single right age. Guided Childhood uses a five stage pathway from ages 4 to 16. The right time depends on your child's stage of development, your family structure, and what boundaries you have in place. Stage 2 (ages 8 to 10) is typically when children get a restricted first device. Stage 3 (ages 11 to 12) is when smartphones become more common. How you get there matters more than the date." },
  { q: 'How do I deal with screen time arguments every day?',
    a: 'Screen time arguments happen when limits are inconsistent or when structure is missing. Guided Childhood gives you the exact scripts for the most common daily battles including after school TV demands, bedtime phone fights, and gaming meltdowns. One consistent routine takes most of the daily negotiation out of it, and you rate the worry each day and watch your own number move.' },
  { q: 'When should children be allowed on social media?',
    a: 'The UK minimum age for most platforms is 13. Research by Dr Amy Orben at Cambridge identifies ages 11 to 13 as the highest sensitivity window, particularly for girls. Guided Childhood Stage 3 covers exactly this: the conversation to have before access, what to watch for during access, and the boundaries that protect without destroying trust.' },
  { q: 'Is screen time really harmful for children?',
    a: 'The research is more nuanced than most headlines suggest. Professor Candice Odgers at UC Irvine and Professor Andrew Przybylski at Oxford both find that the effects depend heavily on context, vulnerability, and structure. Screen time is not uniformly harmful. Too much, too early, without structure, for already vulnerable children is where risk concentrates. Guided Childhood is built on this nuanced research, not panic.' },
  { q: 'What is Guided Childhood and how does it work?',
    a: 'Guided Childhood is a clear digital pathway from first screen to 16 for UK families. You identify your child\'s stage, then the pathway tells you what to do, when to do it and how to do it: daily moments with the exact words, 160 scripts for the hard conversations, 100 lessons you can teach at home, a Digital Passport your child earns stage by stage, family quests where real jobs earn stars and stars buy agreed screen time, a child app for checking and requesting jobs, printables in English and Spanish, 24 age gated learning games, device setting checklists, a wellbeing tracker, a family agreement builder, and DiGi, your evidence led guide, whenever you need the specific words. It takes around ten minutes a day, and if you miss a few days the pathway catches you up.' },
  { q: 'Does Guided Childhood prepare my child for the UK under 16 social media ban?',
    a: 'Yes, that is the core of it. The UK plans to restrict under 16 access to some social media from spring 2027. A deadline delays the apps. It does not teach children anything. Guided Childhood builds the judgement in the years before: a five stage pathway from age 4, lessons in misinformation, algorithms and AI literacy, and a Digital Passport earned stage by stage, so 16 arrives as a step rather than a cliff edge. Arriving with habits beats arriving with rules.' },
  { q: 'How does screen time work on Guided Childhood?',
    a: 'You set a daily screen allowance for each child, and a timer you can both see counts it down. If you want, real jobs and outside time can earn extra minutes, with outside play paying the most. Screens rest an hour before bed by default. Families without a child device run the whole thing from the parent app.' },
  { q: 'How do I teach my child about AI and chatbots?',
    a: 'Guided Childhood includes age by age AI literacy lessons: what an AI chatbot is, why it sounds confident when it is wrong, how algorithms and recommendation feeds work, and how to spot AI generated content. By 16 your child is AI literate, not just supervised.' },
  { q: 'Is banning devices better than teaching digital literacy?',
    a: 'OECD research finds device access among UK teenagers is now nearly universal, so the gap that remains is not who owns a device but who is taught to use one well. A ban does not close that gap. It removes the deep end from the child who was never taught, while the child already getting lessons is unaffected. Guided Childhood teaches digital literacy in stages instead, the same way children are taught to swim.' },
]

// PROBLEM, THEN THE FIX (Justin, 26 November 2026: "flash up one at a time
// the solutions we offer"). Every section opens on the problem in a parent's
// words, then names the fix and shows the real screen. Scrolling sections, not
// an auto playing carousel, because a parent reading on a phone misses slides
// that move on their own. Quote marks only where the words are a real parent's
// (research/homepage-audience-language.md, the Mumsnet thread).
// plans/2026-11-26-problem-solution-homepage-plan.md
function Problem({ n, topic, children }: { n: number; topic: string; children: React.ReactNode }) {
  return (
    <>
      <p className="eyebrow fu" style={{ color: 'var(--terracotta-dark)', marginBottom: '12px' }}>{n}. {topic}</p>
      <p className="fu" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: '560px', margin: '0 auto 14px' }}>
        {children}
      </p>
    </>
  )
}

function Phone({ src, alt, width = 260 }: { src: string; alt: string; width?: number }) {
  return (
    <div className="fu" style={{ width, maxWidth: '100%', margin: '0 auto', borderRadius: '28px', overflow: 'hidden', border: '6px solid var(--ink)', boxShadow: '0 22px 60px rgba(26,26,46,0.20)', background: '#fff' }}>
      <Image src={src} alt={alt} width={780} height={1460} sizes={`${width}px`} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="home-v2" style={{ background: '#fff', overflowX: 'hidden' }}>

      <style>{`html:has(.home-v2){scroll-behavior:smooth} @media(prefers-reduced-motion:reduce){html:has(.home-v2){scroll-behavior:auto}} .home-v2 h2{font-family:var(--font-display);font-size:clamp(1.9rem,3.2vw,2.7rem);font-weight:900;letter-spacing:-.03em;line-height:1.08;color:var(--ink)} .home-v2 .lead{font-size:var(--text-md)} .home-v2 .body-lg{font-size:var(--text-base)} .hero-circle .chip-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:18px} .hero-circle .chip{position:static;max-width:100%} @media(max-width:819px){.hero-circle .chip-row{flex-direction:column;align-items:stretch} .hero-circle .chip{width:100%} .hero-circle .chip span:last-child{white-space:normal!important} .hero-passport{top:-110px!important;left:2px!important;right:auto!important;transform:rotate(-6deg)!important;padding:9px 11px!important} .hero-passport .hero-passport-word{font-size:.85rem!important}} @media(min-width:820px){.hero-passport{top:26px!important;right:-14px!important} .hero-circle .chip-row{display:contents} .hero-circle .chip{position:absolute} .hero-circle .chip-1{top:26%;left:-7%} .hero-circle .chip-2{top:-3%;right:0} .hero-circle .chip-3{top:52%;right:-8%} .hero-circle .chip-4{bottom:2%;right:6%} .hero-circle .chip-5{bottom:16%;left:-7%}} .home-v2 .faq details{border-bottom:1px solid var(--border)} .home-v2 .faq details:last-child{border-bottom:none} .home-v2 .faq summary{cursor:pointer;font-family:var(--font-display);font-weight:800;font-size:var(--text-md);color:var(--ink);padding:16px 0;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:14px} .home-v2 .faq summary::-webkit-details-marker{display:none} .home-v2 .faq summary::after{content:"+";font-weight:900;font-size:1.25rem;color:var(--terracotta);flex-shrink:0;transition:transform .18s ease} .home-v2 .faq details[open] summary::after{transform:rotate(45deg)} @media(max-width:430px){.home-v2 .brand-word{display:none}}`}</style>

      <AnnouncementBar />
      <HomeReveals />

      {/* JSON-LD structured data, aligned with the locked message */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Guided Childhood',
            url: SITE_URL,
            description: 'A clear digital pathway from first screen to 16.',
            publisher: { '@id': `${SITE_URL}/#organization` },
            // The SearchAction that sat here pointed at /search, which has
            // never existed. Removed 19 November 2026; the Organization moved
            // to the root layout so every page carries it.
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Guided Childhood',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web, iOS, Android',
            url: SITE_URL,
            description: 'The words to say tonight, a plan for your child\'s age from 4 to 16, a check in that shows what is working, and your child\'s own app where jobs earn screen time.',
            publisher: { '@id': `${SITE_URL}/#organization` },
            // The standing prices, as the pricing section below shows them.
            // The founder rate is left out on purpose: it is capped at 50 and
            // structured data that outlives the last seat would be wrong.
            offers: [
              { '@type': 'Offer', name: 'Free start', price: '0', priceCurrency: 'GBP' },
              { '@type': 'Offer', name: 'Monthly', price: '12.99', priceCurrency: 'GBP' },
              { '@type': 'Offer', name: 'Annual', price: '99', priceCurrency: 'GBP' },
            ],
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
              From first tablet to first phone.
            </h1>
            {/* What the parent gets, not what the product contains. The line
                used to list features (lessons, habits, quests, the passport);
                an outside review on 24 September 2026 said the hero should
                carry the benefit, and the benefit is our own one line story
                (THE-STORY.md, section 1). The features are the sections below. */}
            <p className="fu" style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '490px', marginBottom: '26px' }}>
              Ready before 16, one stage at a time. Lessons for their age, the right words, and a Passport they earn.
            </p>
            {/* The stage check, named. Every CTA routes to /starter-pack, the
                three question stage check, and THE-STORY.md says the hook is
                used everywhere, identical. This button said "Start for free",
                which asks a parent to decide on a product; "Find my child's
                stage" asks the question they arrived with. */}
            <div className="fu" style={{ marginBottom: '12px' }}>
              <Link href="/starter-pack" data-track="home-hero" className="btn btn-gold" style={{ fontSize: 'var(--text-lg)', padding: '17px 42px' }}>
                Find my child&rsquo;s stage
              </Link>
            </div>
            <p className="fu" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '18px' }}>
              Three questions. Two minutes. Free for 4 days. No card, so nothing is ever charged unless you pick a plan.
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
                Every lesson shows its source and follows the RSHE guidance schools use. Schools teach the same lessons, so home and class say the same thing.
              </p>
              <div style={{ flex: '0 1 200px', minWidth: '180px', borderLeft: '2px solid var(--terracotta)', paddingLeft: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>Parent quote</div>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
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
          <div style={{ position: 'relative', width: 'min(72vw, 380px)', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', margin: '0 auto', boxShadow: '0 24px 70px rgba(26,26,46,0.16)' }}>
            {/* The largest thing in the first fold, so it is the one image
                on the site allowed to load before anything else. */}
            <HeroPhoto
              src={PHOTO_FAMILY_GRASS}
              alt="A family laughing together on the grass, their phone left face down beside them"
              sizes="(max-width: 528px) 72vw, 380px"
              priority
            />
          </div>
          <div className="chip-row">
            {[
              ['\uD83D\uDCDA', 'What they learn at their age', 'var(--stage-1-bold)'],
              ['\uD83D\uDCD8', 'The Passport to 16', 'var(--stage-2-bold)'],
              ['\uD83D\uDCAC', 'What to say tonight', 'var(--stage-2)'],
              ['\uD83D\uDCF1', 'Phone setup by age', 'var(--stage-3-bold)'],
              ['\u23F1\uFE0F', 'A timer you both see', 'var(--stage-5-bold)'],
            ].map((chip, i) => {
              const [icon, label, tint] = chip as [string, string, string]
              return (
                <div key={label} className={`chip chip-${i + 1}`} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '9px 14px 9px 9px', boxShadow: '0 8px 24px rgba(26,26,46,0.12)' }}>
                  <span aria-hidden style={{ width: 32, height: 32, borderRadius: '9px', background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-base)', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{label}</span>
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
                  {/* next/image so a 512 pixel cutout shown at 66 is sent at
                      its shown size, not its full one (19 November 2026). */}
                  <Image
                    src={c.cutout}
                    alt=""
                    width={512}
                    height={512}
                    sizes="66px"
                    loading={i < 2 ? 'eager' : 'lazy'}
                    style={{ width: 'clamp(44px, 5.5vw, 66px)', height: 'auto', filter: 'drop-shadow(0 6px 10px rgba(26,26,46,0.18))' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    {c.ages.replace('Ages ', '')}
                  </span>
                </div>
              ))}
              {/* The destination: the passport, earned at the end of the path.
                  Justin's 29 Aug screenshot showed it sitting on top of the
                  13 to 15 and 16+ characters and hiding their labels. The only
                  reliably empty spots are the top left corner on phones (the
                  characters climb away from it) and past the path's end on
                  desktop, so the media queries below pin it there; every age
                  label stays readable at every width, checked 360 to 1440. */}
              <div className="hero-passport" style={{ position: 'absolute', top: '-52px', right: '-6px', transform: 'rotate(6deg)', background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 60%, #4A1723 100%)', borderRadius: '8px 10px 10px 8px', padding: '12px 14px', boxShadow: '0 10px 26px rgba(0,0,0,0.25), inset 0 0 0 1.5px rgba(237,195,95,0.55)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.85)', marginBottom: '4px' }}>Digital</div>
                <div className="hero-passport-word" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: '#EDC35F', letterSpacing: '.02em' }}>PASSPORT</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', width: 'min(100%, 460px)', borderBottom: '2px dashed var(--terracotta)', opacity: .5 }} />
            </div>
          </div>
        </div>

      </section>

      {/* ================================================================
          2 · THE CURRICULUM — what children their age learn this year.
          Justin, 25 November 2026: lead with the curriculum and the
          Passport, "ready before 16". Each line is a lesson's own outcome,
          quoted word for word from content/modules through
          lib/content/stage-outcomes.ts, which the stage outcomes guard holds
          to the lessons, so this section can only say what we teach.
          ================================================================ */}
      <section id="stages" aria-label="What children learn at each stage" style={{ padding: 'clamp(80px, 10vw, 120px) 32px', background: '#fff', borderTop: '1px solid var(--border)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Problem n={1} topic="What school teaches">
              You find out what they covered about phones and the internet after it has happened, if you find out at all.
            </Problem>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              Know what school teaches, and <span style={{ color: 'var(--terracotta)' }}>get there first</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
              Short lessons for each age that follow the RSHE guidance schools use, so you can do them together at home first. Open one and try it now, no account.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {STAGES.map((s, i) => {
              const friend = STAGE_CHARACTERS[i]
              const outcomes = STAGE_OUTCOMES[(i + 1) as 1 | 2 | 3 | 4 | 5] ?? []
              return (
                <div key={s.num} className="fu" style={{ background: s.bg, border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: s.bold, padding: '14px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', color: s.text, opacity: .75 }}>{s.num} · {s.ages}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: s.text, letterSpacing: '-.02em' }}>{s.name}</div>
                    </div>
                    {friend && (
                      <Image src={friend.cutout} alt={`${friend.name}, the ${s.ages} Planet Friend`} width={512} height={512} sizes="44px" loading="lazy" style={{ width: '44px', height: 'auto', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: s.text, marginBottom: '10px' }}>
                      By the end, your child can say
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      {outcomes.map(o => (
                        <li key={o.moduleId}>
                          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 700, lineHeight: 1.45, margin: '0 0 3px' }}>&ldquo;{o.outcome}&rdquo;</p>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, margin: 0 }}>{o.title}</p>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '14px' }}>
                      {s.ks}
                    </div>
                    <Link href={`/try/${TRY_LESSONS[(i + 1) as 1 | 2 | 3 | 4 | 5]}`} data-track={`home-try-${i + 1}`} style={{ marginTop: '12px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--ink)', borderRadius: 'var(--radius-btn)', boxShadow: '0 3px 0 var(--ink)', textDecoration: 'none' }}>
                      Try a lesson
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="fu" style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/starter-pack" data-track="home-curriculum" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 34px' }}>
              Find my child&rsquo;s stage
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          2 · GETTING THE BALANCE RIGHT — the stars and the timer,
          in Justin's words (25 November 2026). The allowance comes first
          and earning is the extra, because a Mumsnet parent read earning as
          "screens to avoid screens". Every tile is a setting that exists:
          core daily minutes and the bedtime window are in
          lib/quests/time-tiers.ts.
          ================================================================ */}
      <section aria-label="Getting the balance right" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Problem n={2} topic="Screen time">
              &ldquo;It&rsquo;s utterly miserable constantly policing screen time.&rdquo;
            </Problem>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              Getting the balance <span style={{ color: 'var(--terracotta)' }}>right</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
              Real jobs, outside time and a timer you can both see. Screen time ends because the timer says so, not because you&rsquo;re the bad guy.
            </p>
          </div>
          <div style={{ marginBottom: '36px' }}>
            <Phone src="/marketing/kid-page.png" alt="The child app: star bank, daily goal, a saving goal for film night, and today's jobs" />
          </div>
          <div className="three-col">
            {[
              ['A daily allowance you set', 'Pick the minutes for each child. The timer counts them down where you can both see it.', 'var(--stage-1-bold)'],
              ['Extra minutes, if you want them', 'Real jobs and outside time can earn more, and outside play pays the most. It works from your phone if they have no device yet.', 'var(--stage-2-bold)'],
              ['Screens rest before bed', 'Bedtime starts an hour before they sleep, set for their age, and you can change it any time.', 'var(--stage-3-bold)'],
            ].map(([title, body, tint]) => (
              <div key={title} className="fu" style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', boxShadow: '0 5px 0 var(--border)', padding: '26px 24px' }}>
                <span aria-hidden style={{ display: 'block', width: 36, height: 6, borderRadius: 3, background: tint, marginBottom: '16px' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em', margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          3 · THE PASSPORT — earned stage by stage, done by 16
          ================================================================ */}
      <PassportSection problem={<Problem n={3} topic="The road to 16">The phone and the apps arrive at once, and nothing before it felt like getting ready.</Problem>} />

      {/* ================================================================
          4 · DIGI THAT REMEMBERS — back in on 26 November 2026. The
          pricing review named it the part a parent is most likely to pay
          for, and the 25 November rebuild had cut it. The conversation is
          an illustration of how DiGi answers, labelled as one; the memory
          claim rests on digi_conversations per child and Joanne's own words
          below in the testimonials.
          ================================================================ */}
      <section aria-label="DiGi remembers your family" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Problem n={4} topic="DiGi">
              It&rsquo;s eleven at night, you&rsquo;ve just seen something on their phone, and there&rsquo;s nobody to ring.
            </Problem>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              Ask DiGi, and it <span style={{ color: 'var(--terracotta)' }}>remembers your family</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
              It knows your child&rsquo;s age and stage and what you told it last week, so the answer starts from your family, with the words to say tonight.
            </p>
          </div>
          <div className="fu" style={{ maxWidth: '520px', margin: '0 auto', background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(26,26,46,0.10)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--stage-5)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)' }}>
              <DigiCharacter mood="speak" size={44} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)' }}>DiGi</div>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>An example</span>
            </div>
            <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="bubble-parent">Every day he comes in from school and wants the TV on straight away. If I say no it&rsquo;s a meltdown.</div>
              </div>
              <div className="bubble-digi" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '4px 18px 18px 18px', fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
                That&rsquo;s really common at nine, and it was bedtime you told me about last week, so let&rsquo;s keep the same idea: one routine he knows by heart. Say it once, warmly: &ldquo;Shoes off, snack, five minutes outside, then TV.&rdquo; Then hold it.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5 · SCHOOL AND HOMEWORK — the school week and homework help, as
          the child sees them (dev previews with made up names, captured
          26 November 2026; no real child is shown).
          ================================================================ */}
      <section aria-label="School and homework" style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Problem n={5} topic="School and homework">
              PE kit, the reading record, the trip letter, and the homework they forgot to mention until bedtime.
            </Problem>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              The school week and homework, <span style={{ color: 'var(--terracotta)' }}>in one place</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
              Forward the school emails and the reminders land on the right day, for you and for them. Homework goes in one place, and when they&rsquo;re stuck DiGi gives a hint, never the answer.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', justifyContent: 'center' }}>
            <Phone src="/marketing/kid-school-week.png" alt="The child app's school week: the days, and what is coming up from school" width={240} />
            <Phone src="/marketing/homework-help.png" alt="Homework help in the child app: today's homework written down in one place" width={240} />
          </div>
        </div>
      </section>

      {/* ================================================================
          6 · SAFE SETTINGS BY AGE — last, because settings guides are free
          elsewhere (Internet Matters, the phone makers). What we add is the
          settings growing with the child and a check every two weeks.
          ================================================================ */}
      <section aria-label="Safe settings by age" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Problem n={6} topic="Phone settings">
              &ldquo;This was a huge waste of money time and energy.&rdquo; A parent, on a parental control app.
            </Problem>
            <h2 className="fu" style={{ margin: '0 0 14px' }}>
              Safe settings that <span style={{ color: 'var(--terracotta)' }}>grow with them</span>
            </h2>
            <p className="fu" style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
              Step by step settings for their age on the phone, tablet and console they actually have. Every two weeks DiGi asks if anything new has arrived, and the settings loosen as they show they&rsquo;re ready.
            </p>
          </div>
        </div>
      </section>


      {/* ================================================================
          5 · THE DAD WHO DID THE HOMEWORK — trust from the sources and the
          schools, never from a title (Justin, 25 November 2026: never claim
          expert or clinical status). Facts from
          content/brand-story/founder-context.md: a dad of three, his wife a
          teacher.
          ================================================================ */}
      <section id="about" aria-label="Founder and research" style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: 'clamp(72px, 9vw, 108px) 24px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div className="two-col-wide" style={{ marginBottom: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                width: '160px',
                height: '160px',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(61,115,154,.18)',
              }}>
                <HeroPhoto
                  src={HF + 'hf_20260630_110934_b98c5da7-a06d-414d-b320-72540a7cc384.png'}
                  alt="Justin Phillips, founder of Guided Childhood"
                  sizes="160px"
                  position="center top"
                />
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '14px' }}>
                Justin Phillips
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-light)', marginTop: '3px' }}>Founder, Guided Childhood</p>
            </div>

            <div>
              <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Who is behind this</p>
              <h2 className="fu" style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '18px' }}>
                The dad who did <span style={{ color: 'var(--terracotta)' }}>the homework</span>
              </h2>
              <p className="fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '14px' }}>
                I am Justin Phillips. I have three children and my wife is a teacher. I am not a researcher or a clinician. I read the researchers, and turned what they found into lessons and words you can use this week.
              </p>
              <p className="fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.85, marginBottom: '28px' }}>
                Every lesson shows where it comes from. The lessons follow the RSHE guidance schools work to, and schools teach the same ones, so what your child hears at home matches what they hear in class.
              </p>
              <Link href="/starter-pack" data-track="home-about" className="btn btn-gold fu" style={{ fontSize: 'var(--text-base)' }}>
                Find my child&rsquo;s stage
              </Link>
            </div>
          </div>

          <div className="fu" style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '22px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', margin: '0 0 6px' }}>
              The science moves. So do we.
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', margin: '0 0 8px' }}>
              The leading researchers in children, social media and mental health, and live data from national bodies, NHS and NSPCC among them. DiGi is tested every Monday against a fixed set of hard cases and the research library is refreshed twice a month with a human deciding what goes in.
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', margin: 0 }}>
              For schools: <Link href="https://schools.guidedchildhood.com" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>see the school programme</Link>
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
              <div key={p.name} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '24px 22px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 0 var(--border)' }}>
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

          <div id="pricing" style={{ scrollMarginTop: '84px' }} />
          <div className="fu" style={{ background: 'var(--terracotta)', borderRadius: 'var(--radius-tile)', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', flexShrink: 0 }}>Limited</span>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: '#fff' }}>
                Founder Rate: first 50 members only. Lock in{' '}
                <strong>£7.99/month for life.</strong>
              </span>
            </div>
            <Link href="/starter-pack" style={{
              background: '#fff', color: 'var(--terracotta)', fontFamily: 'var(--font-mono)', fontWeight: 700,
              fontSize: 'var(--text-xs)', letterSpacing: '.06em', textTransform: 'uppercase',
              padding: '9px 20px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              Claim Founder Rate
            </Link>
          </div>

          <div className="price-grid fu">
            {[
              {
                tier: 'Try it first', name: 'Free for 4 days', price: 'Free', period: '',
                save: 'No card, so nothing is ever charged unless you pick a plan.',
                features: [
                  ['✓', 'Four days inside the platform'],
                  ['✓', 'DiGi, with a daily limit'],
                  ['✓', 'A starter set of scripts'],
                  ['✓', 'Your age stage roadmap'],
                ],
                cta: 'Start free trial', href: '/starter-pack',
                note: 'The founder rate is offered after your first check in, first 50 families only. Start free and see it working first.',
                ctaBg: 'transparent', ctaColor: 'var(--ink)', ctaBorder: '2px solid var(--border)', ctaShadow: 'none',
                cardStyle: {},
              },
              {
                tier: 'Best value', name: 'Annual OS', price: '£99', period: '/year',
                save: '£8.25 a month. Save £56.88 against paying monthly.',
                // The full product, star quest first, per THE-STORY §10: the
                // star quest leads every list of what is inside. This list was
                // five stages, a stale "weekly three action plan" and DiGi,
                // about half of what a subscription actually holds. The
                // complete honest list lived only on /dashboard/upgrade
                // (WhatYouAreBuying), a page seen after the buying decision.
                // Same rows, condensed for a pricing card.
                features: [
                  ['✓', 'The road to 16, every stage'],
                  ['✓', 'The Passport, and printables with their name on'],
                  ['✓', 'Every lesson for their age, at home'],
                  ['✓', 'All 160 scripts, with what to say when they push back'],
                  ['✓', 'Phone and device setup by age'],
                  ['✓', 'The timer, daily allowance and jobs, in their own app'],
                  ['✓', 'Ask DiGi, unlimited'],
                  ['✓', 'The wellbeing tracker, and what is working'],
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
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '28px', display: 'flex', flexDirection: 'column', ...plan.cardStyle }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px', minHeight: '2em' }}>
                  {plan.tier}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: '16px', minHeight: '2.6em', display: 'flex', alignItems: 'flex-start' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '5px' }}>
                  {plan.period && <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)' }}>£</span>}
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.04em' }}>
                    {plan.price.replace('£', '')}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginLeft: '2px' }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--terracotta)', fontWeight: 700, marginBottom: '20px', minHeight: '16px' }}>
                  {plan.save}
                </div>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 18px' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px', flex: 1 }}>
                  {plan.features.map(([check, label], fi) => (
                    <li key={fi} style={{ display: 'flex', gap: '9px', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 900, fontSize: 'var(--text-xs)', marginTop: '2px', flexShrink: 0, color: 'var(--terracotta)' }}>{check}</span>
                      {label}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} style={{
                  width: '100%', marginTop: 'auto', padding: '14px', borderRadius: 'var(--radius-tile)',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)',
                  textDecoration: 'none', display: 'block', textAlign: 'center',
                  background: plan.ctaBg, color: plan.ctaColor, border: plan.ctaBorder, boxShadow: plan.ctaShadow,
                  transition: 'transform .15s, box-shadow .15s',
                }}>
                  {plan.cta}
                </Link>
                {plan.note && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55, textAlign: 'center', margin: '10px 0 0' }}>
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
          <div className="faq fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '6px 24px', boxShadow: '0 5px 0 var(--border)' }}>
            {FAQS.map(f => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 18px' }}>{f.a}</p>
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--stage-1-bold)', borderRadius: 'var(--radius-pill)', padding: '6px 16px', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--stage-1-text)' }}>
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
              Find my child&rsquo;s stage
            </Link>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
            Free for 4 days · No card, so nothing is ever charged unless you pick a plan
          </div>
        </div>
      </section>

      {/* ================================================================
          GUIDES · a quiet strip under the last stage check button, never
          above it (plans/2026-11-02-guides-plan.md). Three cards, no feed.
          ================================================================ */}
      <section aria-label="Guides for parents" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: 'clamp(48px, 6vw, 72px) 16px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>Guides for the questions parents ask most</h2>
            <Link href="/guides" data-track="home-guides-all" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>All guides</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {GUIDES.slice(0, 3).map(g => (
              <Link key={g.slug} href={`/guides/${g.slug}`} data-track={`home-guide-${g.slug}`} style={{ display: 'block', textDecoration: 'none', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '18px 20px' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>{g.ages}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', lineHeight: 1.3, color: 'var(--ink)' }}>{g.question}</span>
              </Link>
            ))}
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
              <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: '240px' }}>
                A clear digital pathway from first screen to 16. For UK families. Built on the research.
              </p>

              {/* WHO YOU ARE BUYING FROM, in words rather than behind a link.
                  The email used to be the label on a Contact link and the name
                  was in a copyright line at 35 per cent opacity, so a visitor
                  could not tell who was behind this without opening the terms.
                  It is a legal requirement for selling online as well as the
                  decent thing, so it is set at a readable weight rather than
                  tucked away at footnote grey. */}
              <address style={{ fontStyle: 'normal', marginTop: '18px', fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'rgba(255,255,255,.72)', maxWidth: '240px' }}>
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
              {PRODUCT_STAGES.map(st => [`Stage ${st.id} · ${st.ages}`, '#stages']).map(([label, href]) => (
                <div key={label} style={{ marginBottom: 0 }}>
                  <Link href={href} style={{ display: 'inline-block', padding: '11px 0', fontSize: 'var(--text-base)', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500, lineHeight: 1.4 }}>{label}</Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Tools</div>
              {[['Free Trial', '/starter-pack'], ['Digital Health Check', 'https://www.guidedchildhood.com/digitalwellbeing'], ['Ask DiGi', '/starter-pack'], ['For Schools', 'https://schools.guidedchildhood.com'], ['Pricing', '#pricing']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 0 }}>
                  <Link
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{ display: 'inline-block', padding: '11px 0', fontSize: 'var(--text-base)', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500 }}
                  >{label}</Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '16px' }}>Company</div>
              {[['About', '/pathway'], ['Contact', 'mailto:hello@guidedchildhood.com'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Login', '/login']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 0 }}>
                  <Link href={href} style={{ display: 'inline-block', padding: '11px 0', fontSize: 'var(--text-base)', color: 'rgba(255,255,255,.6)', textDecoration: 'none', fontWeight: 500 }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', color: 'rgba(255,255,255,.35)', lineHeight: 1.7 }}>
              © 2026 {CONTACT.business} · {CONTACT.founder}
              {hasCompany() && (
                <span style={{ display: 'block' }}>
                  {CONTACT.companyName}, company number {CONTACT.companyNumber}, registered in England and Wales
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Online Safety Act 2023', 'DfE', 'Ofcom', 'Statutory RSE'].map(tag => (
                <span key={tag} style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.3)', fontWeight: 600 }}>{tag}</span>
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
