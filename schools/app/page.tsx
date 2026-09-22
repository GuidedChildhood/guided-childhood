import Link from 'next/link'
import type { Metadata } from 'next'
import { CURRICULUM as MODULES, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER, KEY_STAGE_WHY, type CharacterKey } from '@gc/shared/schools-curriculum'
import { INTRO_CHARACTERS } from '@gc/shared/intro-characters'
import FriendMark from '@gc/shared/components/FriendMark'
import { COMPANY } from '@gc/shared/legal'
import Reveal from '@/components/Reveal'
import HomeReveals from '@/components/HomeReveals'
import HeroWall from '@/components/home/HeroWall'
import LessonOpens from '@/components/home/LessonOpens'
import SiteNav from '@/components/SiteNav'
import { navAccess } from '@/lib/licence'
import { PILOT_PATH } from '@/lib/links'
import { PILOT_PLACES } from '@/lib/pilot'
import { TASTER_MODULES } from '@/lib/taster'
import { FLAGGED_MODULES } from '@gc/shared/schools-curriculum'

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
    `A complete digital literacy scheme of work for UK schools. ${MODULES.length} modules, Reception to Year 13, taught from an interactive player with word for word scripts, printable packs, parent notes and the statutory mapping a school can show. Mapped to the statutory RSHE guidance, KCSIE 2026 and all eight Education for a Connected World strands.`,
  alternates: { canonical: 'https://schools.guidedchildhood.com/' },
  openGraph: {
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guided Childhood Schools: the digital literacy curriculum, Reception to Year 13' }],
    title: 'Guided Childhood Schools: the digital literacy curriculum, Reception to Year 13',
    description:
      `The ban takes the apps. We build the judgement. ${MODULES.length} modules mapped to the statutory RSHE guidance and KCSIE 2026, taught by the DiGi Squad, feeding the passport to sixteen.`,
    url: 'https://schools.guidedchildhood.com/',
    siteName: 'Guided Childhood Schools',
    type: 'website',
  },
}


const ESPRESSO = 'var(--deep-teal)'
const GOLD = 'var(--terracotta)'

const eyebrow = (color = 'var(--terracotta-dark)'): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase', color,
})

const softShadow = '0 1px 2px rgba(46,40,24,0.05), 0 30px 60px -34px rgba(46,40,24,0.42)'

const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', ...PAGE.hero,
  fontWeight: 900, color: 'var(--ink)',
}

import { PRICING_BANDS } from '@/lib/pricing'
import { PAGE } from '@gc/shared/page-scale'

// The FAQ is one array feeding both the visible accordion and the FAQPage
// JSON-LD, the parents home page pattern, so search and reader can never
// disagree. Answers align with hub/faq, tuned for a head skim reading.
const FAQS = [
  {
    q: 'Does this meet the new statutory RSHE guidance?',
    a: 'The guidance published in July 2025 comes into force on 1 September 2026, and every module is mapped to the requirements it teaches, requirement by requirement, including the newly named areas. The matrix names what it does not cover as well as what it does, because a scheme that claimed everything would be lying to you. It is public on this site, so you can check the coverage before you spend a penny.',
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--space-3)', marginBottom: '14px' }}>
        {showcase.map(m => {
          const ch = CHARACTERS[m.character]
          return (
            <div key={m.moduleId} style={{ background: '#fff', border: `1.5px solid ${ch.accent}`, borderRadius: 'var(--radius-tile)', overflow: 'hidden' }}>
              <div style={{ background: ch.soft, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <FriendMark character={m.character} size={22} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: ch.ink, marginLeft: 'auto' }}>{m.keyStage}</span>
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

// The hero picture lives in components/home/HeroWall.tsx since 20 September
// 2026, where it builds itself on arrival (plans/week-of-2026-09-21-schools-
// home-apple-plan.md). The pitch it draws is unchanged: the ban builds a wall
// at sixteen, the curriculum is the road, the passport opens the door.

// The faces, each carrying the corner of digital life they actually teach.
//
// WHY THIS IS COMPUTED (14 September 2026). The lines used to be six hand
// written strings, with a comment claiming they could never drift from the
// lessons. They drifted. The morning the manifest was corrected so the map
// named the friend each lesson actually uses, three of the six lines here
// went stale in one commit: Orbit was still selling the real and pretend
// lesson that is Pebble's, Nova was still selling the mood lesson that is
// Orbit's, and Cosmo was selling four lessons that had moved to Orbit and
// Nova, in the retired fox's own words ("street smart"). So the strip now
// SHOWS only a friend the manifest actually gives a module to, and the guard
// (scripts/check-character-voices.mjs) holds it. Cosmo fronts nothing today,
// so Cosmo is not on the page today. He returns here on his own, with no one
// having to remember, the moment the sixth form lessons are written in his
// voice and the manifest says so.
const SQUAD: { key: CharacterKey; clip?: string; line: string }[] = [
  { key: 'digi', line: 'The golden star. Carries the heaviest lessons and closes every one.' },
  { key: 'pebble', clip: INTRO_CHARACTERS.pebble.clip, line: 'First steps: kindness, feelings, and what is real.' },
  { key: 'bloop', clip: INTRO_CHARACTERS.bloop.clip, line: 'Routines, gaming, privacy, and who really made this.' },
  { key: 'orbit', clip: INTRO_CHARACTERS.orbit.clip, line: 'The questions years: mood, scams, deepfakes, and whether it is doing your thinking.' },
  { key: 'nova', clip: INTRO_CHARACTERS.nova.clip, line: 'The calm one: persuasion, the serious years, and arriving ready at sixteen.' },
  { key: 'cosmo', clip: INTRO_CHARACTERS.cosmo.clip, line: 'The sixth form: mastery, data rights, and the road to work.' },
]

/** The friends this page may sell: the ones the shipped curriculum actually
 *  gives a lesson to. A face here that fronts no module is a promise the
 *  product does not keep. */
const FRONTS_A_MODULE = new Set(MODULES.map(m => m.character))
const CAST = SQUAD.filter(c => FRONTS_A_MODULE.has(c.key))

// The one line a head needs per stage now lives in the shared manifest
// (KEY_STAGE_WHY) so this page and the curriculum map can never disagree.
const STAGE_WHY = KEY_STAGE_WHY

// The evidence spine, four rows, only verified claims. The deep version
// with sources lives on /philosophy; this is the shop window of it.
const EVIDENCE = [
  {
    label: 'The regulators',
    title: 'Built on the statutory guidance',
    body: 'The RSHE guidance becomes compulsory on 1 September 2026 and every module is mapped to it, topic by topic, on the public matrix. KCSIE 2026 names generative AI, deepfakes, misinformation and conspiracy theories, and the public matrix shows which module teaches each. All eight Education for a Connected World strands are covered, Reception to Year 13.',
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

export default async function SchoolsPage() {
  const totalModules = MODULES.length
  // The header shows a licensed school its two rooms and a stranger the door.
  const nav = await navAccess()
  // The smallest annual price, read from the bands rather than typed here, so
  // the strip can never disagree with the pricing page.
  const fromPrice = PRICING_BANDS.filter(b => !b.onApplication).map(b => b.price)[0] ?? '£495'

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
      description: `${MODULES.length} modules of digital literacy and online safety, Reception to Year 13, mapped to the statutory RSHE guidance, KCSIE 2026 and all eight Education for a Connected World strands.`,
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
    <div style={{ background: 'var(--cream)', overflowX: 'clip' }}>
      {/* overflow-x CLIP, not hidden. Hidden makes this div a scroll container
          for position: sticky, so the lesson board (components/home/LessonOpens)
          scrolled away with the page instead of staying beside its steps; clip
          stops sideways scroll without doing that. */}
      <HomeReveals />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteNav {...nav} />

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(150deg, #2B5665 0%, #1E4652 55%, #173C46 100%)', color: '#fff', padding: 'clamp(48px, 6.5vw, 96px) clamp(20px, 4vw, 40px) clamp(64px, 8vw, 120px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }} className="schools-hero-grid">
          <Reveal>
            <p style={{ ...eyebrow(GOLD), marginBottom: '22px' }}>For schools, heads and PSHE leads</p>
            {/* Three lines at 1440 by 900, so the button sits on the first
                screen. Five lines pushed it under the fold (the schools
                review, 13 September 2026). */}
            <h1 style={{ fontFamily: 'var(--font-display)', ...PAGE.hero, fontWeight: 900, marginBottom: 'var(--space-4)', color: '#fff', textWrap: 'balance' }}>
              The digital literacy curriculum, ready for <span style={{ color: GOLD }}>September 2026.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', ...PAGE.lead, color: 'rgba(255,250,240,0.9)', maxWidth: '500px', marginBottom: 'var(--space-5)' }}>
              <strong style={{ color: '#fff', fontWeight: 800 }}>The ban takes the apps. We build the judgement.</strong> A complete scheme of work, Reception to Year 13, mapped to the statutory RSHE guidance and KCSIE 2026, taught from a word for word script with printable packs. Ready in your classroom tomorrow.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: '18px' }}>
              <Link href={PILOT_PATH} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '16px 32px' }}>
                Request a free pilot
              </Link>
              <Link href="#journey" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '16px 30px', borderRadius: 'var(--radius-btn)', textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.24)' }}>
                See every year
              </Link>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'rgba(255,250,240,0.6)' }}>
              Free one term pilot for the first {PILOT_PLACES} schools. We reply within two working days, usually the same day.
            </p>
          </Reveal>
          <Reveal delay={0.12} y={34}>
            <HeroWall />
          </Reveal>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#211C10', color: '#fff', padding: 'clamp(30px, 4vw, 44px) clamp(20px, 4vw, 40px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
          {/* Every figure here is read from the manifest or the price bands,
              never typed: a stat a head can check and find wrong costs the
              whole page (the schools review, 13 September 2026). */}
          {[
            { n: `${totalModules}`, count: totalModules, l: 'modules, Reception to Year 13' },
            { n: `${KEY_STAGE_ORDER.length}`, count: KEY_STAGE_ORDER.length, l: 'key stages on one licence' },
            { n: `${FLAGGED_MODULES.length}`, count: FLAGGED_MODULES.length, l: 'staff briefings for the safeguarding flagged modules' },
            { n: `From ${fromPrice}`, l: 'a year for the whole school, no VAT added' },
          ].map(s => (
            <div key={s.l} className="fu" style={{ textAlign: 'center' }}>
              <div className={s.count ? 'stat-num' : undefined} data-count={s.count} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,250,240,0.64)', marginTop: '8px', lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── A LESSON OPENS ── the real product moment, as you scroll ── */}
      <section style={{ padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu" style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>This is a real lesson opening</p>
            <h2 style={{ ...h2, maxWidth: '760px', marginBottom: '18px' }}>
              A friend at the door, then a lesson with a spine.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '620px' }}>
              Every lesson runs the same six phases in the same order, the shape the strongest teaching research keeps arriving at: retrieval first, small steps, guided practice, and the class proving it before the close. Scroll, and watch one open.
            </p>
          </div>
          <LessonOpens />
        </div>
      </section>

      {/* ── ONE LESSON, EVERYTHING ── */}
      <section style={{ padding: '0 clamp(20px, 4vw, 40px) clamp(72px, 10vw, 130px)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          {/* The map preview sits beside the promise, so the six real modules
              are the picture for "everything is already there". It used to
              carry the lesson opening section's right column. */}
          <div className="fu schools-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <p style={{ ...eyebrow(), marginBottom: '14px' }}>One lesson, everything in it</p>
              <h2 style={{ ...h2, maxWidth: '760px', marginBottom: '18px' }}>
                A teacher opens one page. The whole lesson is already there.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '620px' }}>
                No hunting through a portal. No prep the night before. Everything a non specialist needs to teach it well, generated from the lesson itself and updated the moment the world changes.
              </p>
            </div>
            <MapPreview />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {[
              { icon: '🎬', title: 'The interactive lesson', body: 'A projector led player with the animated DiGi Squad, timed talk tasks, auto marked checks, and a word for word teacher script on every slide.' },
              { icon: '🧭', title: 'The run sheet', body: 'Before, during and after on one printable page: what to print, every phase with its script, and what goes home. Any teacher can run it cold.' },
              { icon: '🖨️', title: 'The printable pack', body: 'Teacher one pager, worksheet with the answer thinking, bookmark, quiz cards, and a colour pupil booklet. A paper fallback runs the whole lesson with no screen.' },
              { icon: '🏡', title: 'A note that reaches home', body: 'Every lesson ends with a parent note. What we taught, one question for the dinner table, and the passport line that says what the lesson earned.' },
              { icon: '🛡️', title: 'Safeguarding built in', body: 'The sensitive modules carry a DSL note, a ten minute staff briefing, and disclosure handling written into the script, calm on every page.' },
              { icon: '📋', title: 'The compliance hub', body: 'The statutory mapping, policy ready text, the parent pack and a data protection pack for your DPO. All of it public or printable.' },
            ].map(f => (
              <div key={f.title} className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '26px', height: '100%', boxShadow: softShadow }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
            {CAST.map(c => {
              const ch = CHARACTERS[c.key]
              return (
                <div key={c.key} className="fu" style={{ background: ch.soft, border: `1.5px solid ${ch.accent}`, borderRadius: 'var(--radius-card)', padding: '16px 14px 20px', textAlign: 'center', height: '100%' }}>
                  <div style={{ width: '100%', aspectRatio: '1', margin: '0 auto 14px', borderRadius: 'var(--radius-btn)', background: '#fff', border: `2px solid ${ch.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {KEY_STAGE_ORDER.map(ks => {
              const meta = KEY_STAGE_META[ks]
              const mods = MODULES.filter(m => m.keyStage === ks)
              return (
                <div key={ks} className="fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: softShadow }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr' }} className="schools-curric-row">
                    <div style={{ background: ESPRESSO, color: '#fff', padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <div style={{ ...eyebrow(GOLD), fontSize: 'var(--text-sm)' }}>{meta.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 900, letterSpacing: '-0.01em' }}>{meta.years}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'rgba(255,250,240,0.75)', lineHeight: 1.5 }}>{meta.strapline}</div>
                      <div style={{ marginTop: 'auto', paddingTop: '12px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,250,240,0.55)' }}>
                        {mods.length} module{mods.length === 1 ? '' : 's'}
                      </div>
                    </div>
                    <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '640px' }}>
                        {STAGE_WHY[ks]}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-3)' }}>
                        {mods.map(m => {
                          const ch = CHARACTERS[m.character]
                          return (
                            <div key={m.moduleId} style={{ background: ch.soft, border: `1px solid ${ch.accent}`, borderRadius: 'var(--radius-tile)', padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '5px' }}>
                                <FriendMark character={m.character} size={24} />
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
          <div className="schools-evidence-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
            {EVIDENCE.map(e => (
              <div key={e.label} className="fu" style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '26px', height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
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
            <p style={{ ...PAGE.lead, color: 'var(--ink-soft)', maxWidth: '680px', margin: '0 auto var(--space-3)' }}>
              Every lesson ends with a home code on the parent note. A family using the Guided Childhood parent app enters it, and the lesson lands in their child&rsquo;s own passport to sixteen, the same passport your curriculum follows. What a child meets in class, a parent can carry on that evening, so the message is one message and not two.
            </p>
            <p style={{ ...PAGE.lead, color: 'var(--ink-soft)', maxWidth: '680px', margin: '0 auto' }}>
              The passport earns a stamp for each stage on the road to 16, and in time a family will be able to print it as a keepsake book of the journey. One shared pathway, school and home walking it together.
            </p>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="fu">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }} className="schools-hero-grid">
              <div>
                <p style={{ ...eyebrow(), marginBottom: '14px' }}>Ready for inspection, ready for parents</p>
                <h2 style={{ ...h2, marginBottom: 'var(--space-4)' }}>
                  The paperwork is already written, and it prints.
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Every module is mapped to the RSHE guidance that becomes statutory on 1 September 2026, including deepfakes, misogynistic content, gambling and the harms of pornography. Your DSL gets the safeguarding crosswalk, your DPO gets the data protection pack, and parents get a transparency pack built for consultation.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  All of it regenerates from the live curriculum, so it can never fall out of date in a filing cabinet.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {[
                  { label: 'RSHE statutory 2026', desc: 'In force 1 September 2026, mapped module by module, matrix public.' },
                  { label: 'KCSIE 2026', desc: 'Generative AI, deepfakes, misinformation and conspiracy theories, each mapped to the module that teaches it.' },
                  { label: 'Connected World', desc: 'All eight UKCIS strands, Reception to Year 13.' },
                  { label: 'No pupil data', desc: 'No pupil accounts, no logins, nothing to breach. One code per school.' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '20px', boxShadow: softShadow }}>
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
                Every teacher, every year group, all {totalModules} modules, from £495 a year.
                Paid by invoice with 30 day terms, the way schools actually buy.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-3)', alignItems: 'stretch' }}>
            {PRICING_BANDS.map(band => (
              <div key={band.key} className="fu" style={{ height: '100%' }}>
                <div style={{
                  background: band.featured ? ESPRESSO : '#fff',
                  color: band.featured ? '#fff' : 'var(--ink)',
                  border: band.featured ? 'none' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-card)', padding: '26px 22px', height: '100%',
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', position: 'relative',
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', marginTop: '30px' }}>
            <Link href="/pricing" className="btn btn-gold" style={{ padding: '15px 32px', fontSize: 'var(--text-md)' }}>
              See what is included and request an invoice
            </Link>
            <p style={{ marginTop: '14px', fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
              Not buying yet? <Link href="/draw" style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'none' }}>Enter the free class pack draw</Link>, one school wins every term.
            </p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {FAQS.map(f => (
              <details key={f.q} className="fu schools-faq" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', padding: '4px 22px', boxShadow: softShadow }}>
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
        <div className="fu" style={{ maxWidth: '660px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '44px', marginBottom: '18px' }}>⭐</div>
          <h2 style={{ fontFamily: 'var(--font-display)', ...PAGE.hero, fontWeight: 900, marginBottom: 'var(--space-4)', color: '#fff' }}>
            Be one of the first schools to teach it.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'rgba(255,250,240,0.84)', lineHeight: 1.7, marginBottom: '32px' }}>
            A free one term pilot for the first {PILOT_PLACES} schools who want to get ahead of the statutory September. Tell us your school and we will reply within two working days, usually the same day. Or teach the sample lesson first and ask after.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={PILOT_PATH} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '17px 36px' }}>
              Request your pilot
            </Link>
            {/* The second door used to promise a free assembly pack that was
                never built (plans/master-build-plan.md still has the box
                unticked). The sample lesson is real, so it stands here. */}
            <Link href={`/lesson/${TASTER_MODULES[0]}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '17px 34px', borderRadius: 'var(--radius-btn)', textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.26)' }}>
              Teach the sample lesson first
            </Link>
          </div>
        </div>
      </section>

      {/* Footer: the open pages, so a sceptical head can walk the evidence
          without asking anyone for anything. */}
      <footer style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '40px clamp(20px, 4vw, 40px) 30px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', justifyContent: 'space-between', marginBottom: '26px' }}>
            <div style={{ maxWidth: '300px' }}>
              <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 900, color: 'var(--ink)', textDecoration: 'none' }}>⭐ Guided Childhood Schools</Link>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: '10px' }}>
                The digital literacy curriculum feeding the passport to sixteen. Taught, not banned into existence.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
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
                  <Link href={PILOT_PATH} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)', textDecoration: 'none' }}>Request a pilot</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)' }}>© 2026{' '}{COMPANY.name} · Company number{' '}{COMPANY.number} · {COMPANY.address}</p>
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
        /* Four evidence cards: four across on a desk, two by two on a tablet,
           one column on a phone. auto-fill left the fourth card alone in a
           row of three. */
        @media (max-width: 1040px) {
          .schools-evidence-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 600px) {
          .schools-evidence-grid { grid-template-columns: 1fr !important; }
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
