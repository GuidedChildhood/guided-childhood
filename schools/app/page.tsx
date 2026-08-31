import Link from 'next/link'
import type { Metadata } from 'next'
import { CURRICULUM as MODULES, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER, KEY_STAGE_WHY } from '@gc/shared/schools-curriculum'
import { INTRO_CHARACTERS } from '@gc/shared/intro-characters'
import Reveal from '@/components/Reveal'
import HomeReveals from '@/components/HomeReveals'

// THE SCHOOLS MARKETING PAGE, rebuilt 31 August 2026 to the parents page
// bar (plans/2026-08-31-schools-marketing-apple-plan.md). What changed and
// why lives in the plan; the short version: the year by year journey is on
// the page, the evidence spine is on the page with only verified claims,
// the characters move (the intro clips are real product assets, not
// decoration), the statutory labels say 2026, and the page carries JSON-LD
// and an FAQ so search engines read the same answers a head does.
//
// Copy rules enforced here: no dashes in copy, no "safe" as a promise,
// never allow or deny, every named source is kinship and framing only, and
// where the evidence is unsettled the page says so, because heads talk to
// researchers and the honest line is the credible line.

export const metadata: Metadata = {
  title: 'The Digital Literacy Curriculum for UK Schools, Reception to Year 13',
  description:
    'A complete digital literacy scheme of work for UK schools. 21 modules, Reception to Year 13, taught from an interactive player with word for word scripts, printable packs, parent notes and the coverage evidence Ofsted asks for. Mapped to the statutory RSHE guidance, KCSIE 2026 and all eight Education for a Connected World strands.',
  alternates: { canonical: 'https://schools.guidedchildhood.com/' },
  openGraph: {
    title: 'Guided Childhood Schools: the digital literacy curriculum, Reception to Year 13',
    description:
      'The ban takes the apps. We build the judgement. 21 modules mapped to the statutory RSHE guidance and KCSIE 2026, taught by the DiGi Squad, feeding the passport to sixteen.',
    url: 'https://schools.guidedchildhood.com/',
    siteName: 'Guided Childhood Schools',
    type: 'website',
  },
}

const MAILCHIMP_ENQUIRY = 'https://mailchi.mp/thesocialbillboard/school'

const ESPRESSO = 'var(--deep-teal)'
const GOLD = 'var(--terracotta)'

const eyebrow = (color = 'var(--terracotta-dark)'): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase', color,
})

const softShadow = '0 1px 2px rgba(46,40,24,0.05), 0 30px 60px -34px rgba(46,40,24,0.42)'

const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 3.1rem)',
  fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)',
}

import { PRICING_BANDS } from '@/lib/pricing'

// The FAQ is one array feeding both the visible accordion and the FAQPage
// JSON-LD, the parents home page pattern, so search and reader can never
// disagree. Answers align with hub/faq, tuned for a head skim reading.
const FAQS = [
  {
    q: 'Does this meet the new statutory RSHE guidance?',
    a: 'Yes. The guidance published in July 2025 becomes compulsory on 1 September 2026, and every module is mapped to it line by line, including the newly named areas. The full mapping matrix is public on this site, so you can check the coverage before you spend a penny.',
  },
  {
    q: 'What about KCSIE 2026?',
    a: 'Keeping Children Safe in Education 2026 names generative AI, deepfakes, misinformation and conspiracy theories as risks schools must address. The mapping matrix shows exactly which modules teach each one, with the honest note on depth where a module touches a risk rather than owning it.',
  },
  {
    q: 'Does it replace our PSHE scheme?',
    a: 'No. It is the digital literacy and online safety spine that sits inside your PSHE provision. It covers all eight Education for a Connected World strands so your existing scheme keeps everything else.',
  },
  {
    q: 'What pupil data do you hold?',
    a: 'None. There are no pupil accounts and no logins for children. A school unlocks the curriculum with one code, lessons are taught from the board, and paper carries the pupil work. Your DPO gets a data protection pack that says the same thing in their language.',
  },
  {
    q: 'How quickly can we start?',
    a: 'The same day. Your code arrives with the invoice, the code opens every lesson, and any teacher can teach module one this afternoon from the run sheet with no training session first.',
  },
  {
    q: 'Can parents see the materials?',
    a: 'Yes, all of them. The statutory guidance gives parents the right to view curriculum materials, and we build for it rather than around it: the parent pack, the per lesson parent notes, and the transparency text for your website are all included and all print.',
  },
]

// A clean taste of the real map for the second section: six real modules,
// no fake browser chrome and no invented progress bars. The old hero
// mockup faked 3/3 tracking, which looked like a feature we deliberately
// do not have (no pupil data, ever) and read as a broken screenshot on a
// phone. Justin killed it on 31 August; the hero now shows the real
// lesson opening instead, and this preview stays honest.
function MapPreview() {
  const showcase = MODULES.slice(0, 6)
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '14px' }}>
        {showcase.map(m => {
          const ch = CHARACTERS[m.character]
          return (
            <div key={m.moduleId} style={{ background: '#fff', border: `1.5px solid ${ch.accent}`, borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: ch.soft, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: 'var(--text-sm)' }}>{ch.emblem}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: ch.ink, marginLeft: 'auto' }}>M{String(m.n).padStart(2, '0')}</span>
              </div>
              <div style={{ padding: '9px 10px 11px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.3 }}>{m.title}</div>
              </div>
            </div>
          )
        })}
      </div>
      <Link href="/curriculum" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
        All {MODULES.length} modules on the open map →
      </Link>
    </div>
  )
}

// THE WALL AT SIXTEEN: the hero visual, asked for by Justin on 31 August
// after two rounds ("the character is covered too much, maybe a small
// brick wall representing the wall at 16"). It draws the whole pitch in
// one picture: the ban builds a wall at sixteen, the curriculum is the
// road that walks a child up to it, and the passport is what opens the
// door when they arrive. Drawn in SVG and DOM, no stock art, no AI image,
// so it stays crisp at any size. The five Planet Friends walk the road in
// age order using the same cutout art the lessons use.
function WallAtSixteen() {
  const BRICK = '#C97B54'
  const MORTAR = '#A85E3D'
  const rows = 8
  const wallW = 190
  const wallH = 250
  const bh = wallH / rows
  // The five friends in stage order, youngest at the start of the road.
  const walkers = [
    { key: 'pebble' as const, x: 4, y: 76, size: 46 },
    { key: 'bloop' as const, x: 22, y: 66, size: 50 },
    { key: 'orbit' as const, x: 40, y: 54, size: 54 },
    { key: 'nova' as const, x: 57, y: 42, size: 58 },
    { key: 'cosmo' as const, x: 73, y: 30, size: 62 },
  ]
  return (
    <div style={{ background: '#fff', borderRadius: '24px', padding: 'clamp(18px, 2.5vw, 26px)', boxShadow: '0 2px 4px rgba(46,40,24,0.08), 0 50px 90px -40px rgba(46,40,24,0.6)' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '10 / 8', background: 'linear-gradient(180deg, #FBF6EA 0%, #F6EDDA 100%)', borderRadius: '18px', overflow: 'hidden' }}>

        {/* The wall, offset brick courses drawn one rectangle at a time */}
        <svg viewBox={`0 0 ${wallW} ${wallH}`} preserveAspectRatio="none" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '38%' }} aria-hidden>
          <rect x="0" y="0" width={wallW} height={wallH} fill={MORTAR} />
          {Array.from({ length: rows }).map((_, r) => {
            const offset = r % 2 === 0 ? 0 : -34
            return Array.from({ length: 5 }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={offset + c * 68 + 3}
                y={r * bh + 3}
                width={62}
                height={bh - 6}
                rx={3}
                fill={BRICK}
              />
            ))
          })}
          {/* The door: gold, arched, slightly open with warm light inside */}
          <path d={`M ${wallW * 0.30} ${wallH} L ${wallW * 0.30} ${wallH * 0.52} Q ${wallW * 0.50} ${wallH * 0.36} ${wallW * 0.70} ${wallH * 0.52} L ${wallW * 0.70} ${wallH} Z`} fill="#7A5A0E" />
          <path d={`M ${wallW * 0.33} ${wallH} L ${wallW * 0.33} ${wallH * 0.54} Q ${wallW * 0.50} ${wallH * 0.40} ${wallW * 0.67} ${wallH * 0.54} L ${wallW * 0.67} ${wallH} Z`} fill="#EDC35F" />
          <path d={`M ${wallW * 0.36} ${wallH} L ${wallW * 0.36} ${wallH * 0.56} Q ${wallW * 0.50} ${wallH * 0.44} ${wallW * 0.60} ${wallH * 0.55} L ${wallW * 0.60} ${wallH} Z`} fill="#FEF08A" opacity="0.85" />
          <circle cx={wallW * 0.62} cy={wallH * 0.78} r="4" fill="#7A5A0E" />
        </svg>

        {/* The 16 sign on the wall */}
        <div style={{ position: 'absolute', right: '12%', top: '10%', background: '#FDF4D9', border: '2px solid #7A5A0E', borderRadius: '10px', padding: '4px 12px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.1rem, 2.6vw, 1.6rem)', color: '#7A5A0E', boxShadow: '0 3px 0 rgba(122,90,14,0.35)', transform: 'rotate(3deg)' }}>
          16
        </div>

        {/* The rising dashed road, start of the journey to the door */}
        <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
          <path d="M -2 76 C 25 74, 45 62, 66 44 S 82 30, 88 26" fill="none" stroke="#C99A28" strokeWidth="2.6" strokeDasharray="5 4" strokeLinecap="round" opacity="0.75" />
        </svg>

        {/* The five friends walking the road in age order */}
        {walkers.map((wk, i) => {
          const ch = CHARACTERS[wk.key]
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={wk.key}
              src={ch.img}
              alt={ch.name}
              style={{
                position: 'absolute', left: `${wk.x}%`, top: `${wk.y}%`,
                width: `${wk.size}px`, height: 'auto',
                filter: 'drop-shadow(0 4px 6px rgba(46,40,24,0.28))',
                zIndex: 5 + i,
              }}
            />
          )
        })}

        {/* The passport, waiting at the door */}
        <div style={{ position: 'absolute', right: '26%', top: '46%', background: '#7C2D3E', border: '2px solid #EDC35F', borderRadius: '7px', padding: '5px 7px 6px', transform: 'rotate(-7deg)', boxShadow: '0 4px 8px rgba(46,40,24,0.3)', zIndex: 20 }}>
          <div style={{ fontSize: '13px', textAlign: 'center', lineHeight: 1 }}>⭐</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '6.5px', fontWeight: 700, letterSpacing: '0.1em', color: '#EDC35F', marginTop: '3px' }}>PASSPORT</div>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink-muted)', textAlign: 'center', margin: '14px 0 0' }}>
        The ban builds a wall at sixteen. We build the road, and the passport opens the door.
      </p>
    </div>
  )
}

// The six faces, each carrying the corner of digital life they actually
// teach in the shipped curriculum (the castLine data is the authority, so
// these lines can never drift from the lessons again). Five have finished
// intro clips on our own CDN, animated from their own art.
const SQUAD: { key: keyof typeof CHARACTERS; clip?: string; line: string }[] = [
  { key: 'digi', line: 'The golden star. Carries the heaviest lessons and closes every one.' },
  { key: 'pebble', clip: INTRO_CHARACTERS.celebrate.clip, line: 'First steps: kindness, feelings, and telling a grown up.' },
  { key: 'bloop', clip: INTRO_CHARACTERS.dance.clip, line: 'Routines, gaming, and the habits that stick.' },
  { key: 'orbit', clip: INTRO_CHARACTERS.football.clip, line: 'The detective: real, pretend, and made by a computer.' },
  { key: 'nova', clip: INTRO_CHARACTERS.nova.clip, line: 'The calm one: mood, wellbeing, and the serious years.' },
  { key: 'cosmo', clip: INTRO_CHARACTERS.cosmo.clip, line: 'Street smart: scams, workarounds, AI and the road to work.' },
]

// The one line a head needs per stage now lives in the shared manifest
// (KEY_STAGE_WHY) so this page and the curriculum map can never disagree.
const STAGE_WHY = KEY_STAGE_WHY

// The evidence spine, four rows, only verified claims. The deep version
// with sources lives on /philosophy; this is the shop window of it.
const EVIDENCE = [
  {
    label: 'The regulators',
    title: 'Statutory by construction',
    body: 'The RSHE guidance becomes compulsory on 1 September 2026 and every module maps to it line by line. KCSIE 2026 names generative AI, deepfakes, misinformation and conspiracy theories, and the public matrix shows which module teaches each. All eight Education for a Connected World strands are covered, Reception to Year 13.',
    link: { href: '/hub/rshe-mapping', label: 'Read the full mapping matrix' },
  },
  {
    label: 'The scientists',
    title: 'Staged because the science is staged',
    body: 'Cambridge research (Orben, Przybylski and colleagues, Nature Communications 2022) found age windows where social media use and lower life satisfaction are most closely linked: around 11 to 13 for girls and 14 to 15 for boys. It is correlational and the effects are small, so we use it for timing, never as proof of harm. And Cambridge work on inoculation shows people resist manipulation best when they practise the tricks in weakened form first, which is exactly how the misinformation modules teach.',
    link: { href: '/philosophy', label: 'The science, honestly stated' },
  },
  {
    label: 'The practitioners',
    title: 'The clinical voices in the room',
    body: 'UK trauma psychotherapist Catherine Knibbs argues in Tech Smart Parenting (2025) that asking whether to ban screens is the wrong question, and that the adult response to what a child has seen decides whether that child ever tells again. Our scripts teach that calm response from the first lesson. The Good Inside language of sturdy leadership shapes how DiGi speaks, and we share Common Sense Media’s founding belief that this is taught, not blocked.',
    link: { href: '/philosophy', label: 'Who we listen to and where we differ' },
  },
  {
    label: 'Us',
    title: 'Never allow or deny',
    body: 'Every answer in every lesson is a calibrated pathway, never a flat yes or no, because judgement is the thing being taught. School lessons earn credit toward the same passport to sixteen a family follows at home, readiness is an educational judgement that reduces risk rather than removing it, and we hold no pupil data at all.',
    link: { href: '/philosophy', label: 'Read the whole philosophy' },
  },
]

export default function SchoolsPage() {
  const totalModules = MODULES.length

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Guided Childhood Schools',
      url: 'https://schools.guidedchildhood.com',
      description: 'A digital literacy scheme of work for UK schools, Reception to Year 13, built on the Education for a Connected World framework and the statutory RSHE guidance.',
      parentOrganization: { '@type': 'Organization', name: 'Guided Childhood', url: 'https://www.guidedchildhood.com' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Guided Childhood Schools',
      url: 'https://schools.guidedchildhood.com',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'The Guided Childhood digital literacy curriculum',
      description: 'Twenty one modules of digital literacy and online safety, Reception to Year 13, mapped to the statutory RSHE guidance, KCSIE 2026 and all eight Education for a Connected World strands.',
      provider: { '@type': 'Organization', name: 'Guided Childhood Schools', url: 'https://schools.guidedchildhood.com' },
      educationalLevel: 'Reception to Year 13',
      teaches: 'Digital literacy, online safety, media literacy, AI literacy',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>
      <HomeReveals />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav. On a phone the in page links hide (the sections are one thumb
          scroll away), and the bar is allowed to WRAP rather than overlap:
          a fixed 64px height broke on 31 August for readers with larger
          accessibility text sizes, where the logo and the pilot button
          collided because neither could shrink. flex wrap plus min height
          means the button drops to a tidy second row whenever it cannot
          share the line, at any text size, and nothing ever overlaps. */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, minHeight: '64px', padding: '8px clamp(16px, 4vw, 40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '4px 10px', background: 'rgba(249,248,246,0.82)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="schools-nav-logo" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          ⭐ Guided Childhood <span style={{ color: 'var(--terracotta-dark)' }}>Schools</span>
        </Link>
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center', minWidth: 0, marginLeft: 'auto' }}>
          <a className="schools-nav-link" href="https://www.guidedchildhood.com" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>For parents</a>
          <Link className="schools-nav-link" href="#journey" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Curriculum</Link>
          <Link className="schools-nav-link" href="/philosophy" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Philosophy</Link>
          <Link className="schools-nav-link" href="#pricing" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Pricing</Link>
          <Link className="schools-nav-link" href="/curriculum" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>The map</Link>
          <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '10px 22px', fontSize: 'var(--text-sm)', marginLeft: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Request a pilot
          </a>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(150deg, #2B5665 0%, #1E4652 55%, #173C46 100%)', color: '#fff', padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px) clamp(80px, 10vw, 140px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-140px', right: '-100px', width: '620px', height: '620px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(237,195,95,0.22) 0%, transparent 62%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-200px', left: '-140px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(254,240,138,0.09) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'center' }} className="schools-hero-grid">
          <Reveal>
            <p style={{ ...eyebrow(GOLD), marginBottom: '22px' }}>For schools, heads and PSHE leads</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5.4vw, 4.4rem)', fontWeight: 900, lineHeight: 1.03, letterSpacing: '-0.045em', marginBottom: '22px', color: '#fff' }}>
              The digital literacy curriculum,<br />
              ready for <span style={{ color: GOLD }}>September 2026.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.02rem, 1.5vw, 1.22rem)', color: 'rgba(255,250,240,0.9)', lineHeight: 1.7, maxWidth: '500px', marginBottom: '32px' }}>
              <strong style={{ color: '#fff', fontWeight: 800 }}>The ban takes the apps. We build the judgement.</strong> A complete scheme of work, Reception to Year 13, mapped to the statutory RSHE guidance and KCSIE 2026. Every lesson taught from an interactive script, with printable packs and the coverage evidence Ofsted asks for. Ready in your classroom tomorrow.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '16px 32px' }}>
                Request a free pilot
              </a>
              <Link href="#journey" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '16px 30px', borderRadius: '16px', textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.24)' }}>
                See every year
              </Link>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'rgba(255,250,240,0.6)' }}>
              Free one term pilot for the first schools. We reply within 48 hours.
            </p>
          </Reveal>
          <Reveal delay={0.12} y={34}>
            <WallAtSixteen />
          </Reveal>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#211C10', color: '#fff', padding: 'clamp(30px, 4vw, 44px) clamp(20px, 4vw, 40px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '22px' }}>
          {[
            { n: `${totalModules}`, count: totalModules, l: 'modules, Reception to Year 13' },
            { n: '8 of 8', l: 'Connected World strands covered' },
            { n: '0', l: 'pupil accounts or logins needed' },
            { n: '48 hrs', l: 'from enquiry to your pilot' },
          ].map(s => (
            <div key={s.l} className="fu" style={{ textAlign: 'center' }}>
              <div className={s.count ? 'stat-num' : undefined} data-count={s.count} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,250,240,0.64)', marginTop: '8px', lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEE A LESSON OPEN ── the real product moment ── */}
      <section style={{ padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'center' }} className="schools-hero-grid">
          <div className="fu">
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>This is a real lesson opening</p>
            <h2 style={{ ...h2, maxWidth: '520px', marginBottom: '18px' }}>
              A friend at the door, then a lesson with a spine.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '18px' }}>
              Every lesson opens with a character animated from our own art, then runs the same six phases in the same order, the shape the strongest teaching research keeps arriving at: retrieval first, small steps, guided practice, and every child proving it before the close.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {['Connect', 'Recall', 'Teach', 'Practise', 'Prove', 'Reflect'].map(ph => (
                <span key={ph} style={{ background: '#fff', border: '2px solid var(--border)', borderRadius: '100px', padding: '6px 14px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>{ph}</span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '520px' }}>
              Under the slides sits a word for word script, the misconceptions to expect, the differentiation both ways, and a run sheet that walks any teacher through the whole lesson, no specialist knowledge needed.
            </p>
          </div>
          <div className="fu">
            <MapPreview />
          </div>
        </div>
      </section>

      {/* ── ONE LESSON, EVERYTHING ── */}
      <section style={{ padding: '0 clamp(20px, 4vw, 40px) clamp(72px, 10vw, 130px)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu">
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>One lesson, everything in it</p>
            <h2 style={{ ...h2, maxWidth: '760px', marginBottom: '18px' }}>
              A teacher opens one page. The whole lesson is already there.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '620px', marginBottom: '48px' }}>
              No hunting through a portal. No prep the night before. Everything a non specialist needs to teach it well, generated from the lesson itself and updated the moment the world changes.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {[
              { icon: '🎬', title: 'The interactive lesson', body: 'A projector led player with the animated DiGi Squad, timed talk tasks, auto marked checks, and a word for word teacher script on every slide.' },
              { icon: '🧭', title: 'The run sheet', body: 'Before, during and after on one printable page: what to print, every phase with its script, and what goes home. Any teacher can run it cold.' },
              { icon: '🖨️', title: 'The printable pack', body: 'Teacher one pager, worksheet with the answer thinking, bookmark, quiz cards, and a colour pupil booklet. A paper fallback runs the whole lesson with no screen.' },
              { icon: '🏡', title: 'A note that reaches home', body: 'Every lesson ends with a parent note. What we taught, one question for the dinner table, and the passport line that says what the lesson earned.' },
              { icon: '🛡️', title: 'Safeguarding built in', body: 'The sensitive modules carry a DSL note, a ten minute staff briefing, and disclosure handling written into the script, calm on every page.' },
              { icon: '📋', title: 'The compliance hub', body: 'The statutory mapping, policy ready text, the parent pack and a data protection pack for your DPO. All of it public or printable.' },
            ].map(f => (
              <div key={f.title} className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '22px', padding: '26px', height: '100%', boxShadow: softShadow }}>
                <div style={{ fontSize: 'var(--text-2xl)', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '9px' }}>{f.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SQUAD ── now with the real clips ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px)', background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu">
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>Taught by the DiGi Squad</p>
            <h2 style={{ ...h2, maxWidth: '720px', marginBottom: '18px' }}>
              A cast children remember, carrying lessons that matter.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '44px' }}>
              Each character owns a corner of digital life, so a child meets a familiar face every time the topic comes back, year after year. These are the actual lesson intros, animated from our own character art so the style never drifts.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: '14px' }}>
            {SQUAD.map(c => {
              const ch = CHARACTERS[c.key]
              return (
                <div key={c.key} className="fu" style={{ background: ch.soft, border: `1.5px solid ${ch.accent}`, borderRadius: '20px', padding: '16px 14px 20px', textAlign: 'center', height: '100%' }}>
                  <div style={{ width: '100%', aspectRatio: '1', margin: '0 auto 14px', borderRadius: '16px', background: '#fff', border: `2px solid ${ch.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {c.clip ? (
                      <video src={c.clip} autoPlay muted loop playsInline aria-label={`${ch.name} animated`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : ch.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ch.img} alt={ch.name} style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: 'var(--text-3xl)' }}>{ch.emblem}</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: ch.ink, marginBottom: '6px' }}>{ch.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{c.line}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── THE JOURNEY ── every year, what it covers, and why then ── */}
      <section id="journey" style={{ padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu">
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>The journey, Reception to Year 13</p>
            <h2 style={{ ...h2, maxWidth: '760px', marginBottom: '18px' }}>
              Every year has a job. Here is all of it.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '640px', marginBottom: '44px' }}>
              The same ten behaviours spiral through the whole scheme, deeper each time: privacy, verification, persuasion resistance, AI judgement, help seeking, footprint, balance, money, identity and kindness. Below each stage is the reason its content lands at that age, because a scheme should be able to say why.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {KEY_STAGE_ORDER.map(ks => {
              const meta = KEY_STAGE_META[ks]
              const mods = MODULES.filter(m => m.keyStage === ks)
              return (
                <div key={ks} className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '22px', overflow: 'hidden', boxShadow: softShadow }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr' }} className="schools-curric-row">
                    <div style={{ background: ESPRESSO, color: '#fff', padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <div style={{ ...eyebrow(GOLD), fontSize: 'var(--text-sm)' }}>{meta.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 900, letterSpacing: '-0.01em' }}>{meta.years}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'rgba(255,250,240,0.75)', lineHeight: 1.5 }}>{meta.strapline}</div>
                      <div style={{ marginTop: 'auto', paddingTop: '12px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,250,240,0.55)' }}>
                        {mods.length} module{mods.length === 1 ? '' : 's'}
                      </div>
                    </div>
                    <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '640px' }}>
                        {STAGE_WHY[ks]}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                        {mods.map(m => {
                          const ch = CHARACTERS[m.character]
                          return (
                            <div key={m.moduleId} style={{ background: ch.soft, border: `1px solid ${ch.accent}`, borderRadius: '14px', padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                                <span style={{ fontSize: 'var(--text-sm)' }}>{ch.emblem}</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.3 }}>{m.title}</span>
                                {m.crown && <span style={{ marginLeft: 'auto' }} title="Crown module">👑</span>}
                              </div>
                              <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 'var(--text-sm)', fontWeight: 600, color: ch.ink, lineHeight: 1.45 }}>
                                &ldquo;{m.outcome}&rdquo;
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="fu" style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
            <Link href="/curriculum" className="btn btn-gold" style={{ padding: '15px 32px', fontSize: 'var(--text-md)' }}>
              Open the full curriculum map
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE EVIDENCE SPINE ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px)', background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu">
            <p style={{ ...eyebrow('var(--green-dark)'), marginBottom: '14px' }}>Why we believe what we believe</p>
            <h2 style={{ ...h2, maxWidth: '760px', marginBottom: '18px' }}>
              Built on the regulators, the scientists and the clinicians. Honestly.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '640px', marginBottom: '44px' }}>
              A head should be able to trace every design decision in this scheme to a named source, and to see where the evidence is genuinely unsettled, because the honest line is the credible line. The full picture, source by source, is on the philosophy page.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {EVIDENCE.map(e => (
              <div key={e.label} className="fu" style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '22px', padding: '26px', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ ...eyebrow('var(--green-dark)'), fontSize: 'var(--text-sm)' }}>{e.label}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>{e.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{e.body}</p>
                <Link href={e.link.href} style={{ marginTop: 'auto', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
                  {e.link.label} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOME AND SCHOOL, ONE PASSPORT ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px)', background: 'var(--stage-1)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div className="fu">
            <p style={{ ...eyebrow('var(--terracotta)'), marginBottom: '14px' }}>
              Home and school, one passport
            </p>
            <h2 style={{ ...h2, marginBottom: '18px' }}>
              The learning carries on at home
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 2.4vw, 1.18rem)', lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '680px', margin: '0 auto 14px' }}>
              Every pupil&rsquo;s family gets the Guided Childhood parent app, with DiGi, the daily practice and the same passport to sixteen your curriculum follows. What a child meets in class, a parent can carry on that evening, so the message is one message and not two.
            </p>
            <p style={{ fontSize: 'clamp(1rem, 2.4vw, 1.18rem)', lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '680px', margin: '0 auto' }}>
              The passport earns a stamp for each stage on the road to 16, and in time a family will be able to print it as a keepsake book of the journey. One shared pathway, school and home walking it together.
            </p>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(28px, 4vw, 56px)', alignItems: 'center' }} className="schools-hero-grid">
              <div>
                <p style={{ ...eyebrow(), marginBottom: '14px' }}>Ready for inspection, ready for parents</p>
                <h2 style={{ ...h2, fontSize: 'clamp(1.9rem, 3.4vw, 2.9rem)', lineHeight: 1.1, marginBottom: '18px' }}>
                  The paperwork is already written, and it prints.
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Every module is mapped to the RSHE guidance that becomes statutory on 1 September 2026, including deepfakes, misogynistic content, gambling and the harms of pornography. Your DSL gets the safeguarding crosswalk, your DPO gets the data protection pack, and parents get a transparency pack built for consultation.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  All of it regenerates from the live curriculum, so it can never fall out of date in a filing cabinet.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'RSHE statutory 2026', desc: 'In force 1 September 2026, mapped module by module, matrix public.' },
                  { label: 'KCSIE 2026', desc: 'Generative AI, deepfakes, misinformation and conspiracy theories, each mapped to the module that teaches it.' },
                  { label: 'Connected World', desc: 'All eight UKCIS strands, Reception to Year 13.' },
                  { label: 'No pupil data', desc: 'No pupil accounts, no logins, nothing to breach. One code per school.' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: softShadow }}>
                    <div style={{ ...eyebrow('var(--green-dark)'), fontSize: 'var(--text-sm)', marginBottom: '9px' }}>{item.label}</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ ...eyebrow(), marginBottom: '14px' }}>One licence, everything included</p>
              <h2 style={{ ...h2, marginBottom: '16px' }}>
                Simple annual pricing.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto' }}>
                Every teacher, every year group, all {totalModules} modules, from £1.50 per pupil per year.
                Paid by invoice with 30 day terms, the way schools actually buy.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', alignItems: 'stretch' }}>
            {PRICING_BANDS.map(band => (
              <div key={band.key} className="fu" style={{ height: '100%' }}>
                <div style={{
                  background: band.featured ? ESPRESSO : '#fff',
                  color: band.featured ? '#fff' : 'var(--ink)',
                  border: band.featured ? 'none' : '1px solid var(--border)',
                  borderRadius: '22px', padding: '26px 22px', height: '100%',
                  display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative',
                  boxShadow: band.featured ? '0 2px 4px rgba(46,40,24,0.1), 0 40px 70px -34px rgba(46,40,24,0.55)' : softShadow,
                }}>
                  {band.featured && (
                    <span style={{ position: 'absolute', top: '16px', right: '18px', ...eyebrow(GOLD), fontSize: 'var(--text-xs)' }}>Most schools</span>
                  )}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: band.featured ? GOLD : 'var(--ink-muted)' }}>{band.tier}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: band.featured ? 'rgba(255,250,240,0.7)' : 'var(--ink-muted)', marginBottom: '12px' }}>{band.pupils}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: band.onApplication ? '1.3rem' : '2rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                    {band.price}
                    {!band.onApplication && <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: band.featured ? 'rgba(255,250,240,0.64)' : 'var(--ink-muted)', marginLeft: '5px' }}>a year</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, color: band.featured ? GOLD : 'var(--terracotta-dark)', marginTop: 'auto', paddingTop: '10px' }}>
                    {band.perPupil}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '30px' }}>
            <Link href="/pricing" className="btn btn-gold" style={{ padding: '15px 32px', fontSize: 'var(--text-md)' }}>
              See what is included and request an invoice
            </Link>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
              Every band includes everything · one code opens it for your whole staff room
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '0 clamp(20px, 4vw, 40px) clamp(72px, 10vw, 130px)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div className="fu" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>The questions heads actually ask</p>
            <h2 style={h2}>Straight answers.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map(f => (
              <details key={f.q} className="fu schools-faq" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '4px 22px', boxShadow: softShadow }}>
                <summary style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', padding: '16px 0', cursor: 'pointer', listStyle: 'none' }}>
                  {f.q}
                </summary>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.7, padding: '0 0 18px' }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'linear-gradient(150deg, #2B5665 0%, #1E4652 55%, #173C46 100%)', color: '#fff', padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '720px', height: '720px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(237,195,95,0.16) 0%, transparent 62%)', pointerEvents: 'none' }} />
        <div className="fu" style={{ maxWidth: '660px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '44px', marginBottom: '18px' }}>⭐</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.2vw, 3.3rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '18px', color: '#fff' }}>
            Be one of the first schools to teach it.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'rgba(255,250,240,0.84)', lineHeight: 1.7, marginBottom: '32px' }}>
            A free one term pilot for the first schools who want to get ahead of the statutory September. Tell us your school and we will reply within 48 hours, with the free assembly pack either way.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '17px 36px' }}>
              Request your pilot
            </a>
            <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '17px 34px', borderRadius: '16px', textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.26)' }}>
              Get the free assembly pack
            </a>
          </div>
        </div>
      </section>

      {/* Footer: the open pages, so a sceptical head can walk the evidence
          without asking anyone for anything. */}
      <footer style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '40px clamp(20px, 4vw, 40px) 30px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', justifyContent: 'space-between', marginBottom: '26px' }}>
            <div style={{ maxWidth: '300px' }}>
              <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 900, color: 'var(--ink)', textDecoration: 'none' }}>⭐ Guided Childhood Schools</Link>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: '10px' }}>
                The digital literacy curriculum feeding the passport to sixteen. Taught, not banned into existence.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ ...eyebrow('var(--ink-muted)'), marginBottom: '10px' }}>Open to everyone</div>
                {[
                  { href: '/curriculum', label: 'The curriculum map' },
                  { href: '/hub/rshe-mapping', label: 'The statutory mapping' },
                  { href: '/philosophy', label: 'Our philosophy' },
                  { href: '/pricing', label: 'Pricing' },
                ].map(l => (
                  <div key={l.href} style={{ marginBottom: '7px' }}>
                    <Link href={l.href} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}>{l.label}</Link>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ ...eyebrow('var(--ink-muted)'), marginBottom: '10px' }}>For families</div>
                <div style={{ marginBottom: '7px' }}>
                  <a href="https://www.guidedchildhood.com" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}>The parents app</a>
                </div>
                <div style={{ marginBottom: '7px' }}>
                  <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}>Request a pilot</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)' }}>© 2026 The Social Billboard · Justin Phillips</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)' }}>RSHE statutory 2026 · KCSIE 2026 · Education for a Connected World · No pupil data</p>
          </div>
        </div>
      </footer>

      {/* Responsive: stack the two column grids on small screens, and
          collapse the header to logo + pilot button so it never wraps. */}
      <style>{`
        @media (max-width: 860px) {
          .schools-hero-grid { grid-template-columns: 1fr !important; }
          .schools-curric-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 960px) {
          .schools-nav-link { display: none; }
        }
        @media (max-width: 420px) {
          .schools-nav-logo { font-size: var(--text-base) !important; }
        }
        .schools-faq summary::-webkit-details-marker { display: none; }
        .schools-faq summary { position: relative; padding-right: 30px !important; }
        .schools-faq summary::after {
          content: '+'; position: absolute; right: 2px; top: 50%;
          transform: translateY(-50%); font-family: var(--font-display);
          font-weight: 800; font-size: 1.3rem; color: var(--terracotta-dark);
          transition: transform 0.2s ease;
        }
        .schools-faq[open] summary::after { transform: translateY(-50%) rotate(45deg); }
      `}</style>
    </div>
  )
}
