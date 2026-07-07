import Link from 'next/link'
import type { Metadata } from 'next'
import { CURRICULUM as MODULES, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER } from '@/lib/content/schools-curriculum'
import Reveal from './Reveal'

export const metadata: Metadata = {
  title: 'For Schools | Guided Childhood',
  description: 'A digital literacy scheme of work from Reception to Year 13. 21 modules, every lesson taught from an interactive player with a word for word script, printable packs, and coverage evidence for Ofsted. Mapped to RSHE 2025, KCSIE and Education for a Connected World.',
}

const MAILCHIMP_ENQUIRY = 'https://mailchi.mp/thesocialbillboard/school'

// Real brand tokens (warm, buttery, editorial):
//   cream #F9F8F6 · ink #1A1A2E · butter gold --terracotta #EDC35F
//   espresso --deep-teal #2E2818 · pale gold --gold #FEF08A
const ESPRESSO = 'var(--deep-teal)'
const GOLD = 'var(--terracotta)'

const eyebrow = (color = 'var(--terracotta-dark)'): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase', color,
})

// The premium warm surface: a hair of a highlight over a deep soft espresso drop.
const softShadow = '0 1px 2px rgba(46,40,24,0.05), 0 30px 60px -34px rgba(46,40,24,0.42)'

const PRICING = [
  { tier: 'Small school', pupils: 'Up to 300 pupils', price: '£299', period: 'per year', features: ['Unlimited teacher logins', 'All 21 modules, Reception to Year 13', 'Every printable pack and pupil booklet', 'The compliance and safeguarding Hub', 'Coverage reporting for governors'], featured: false },
  { tier: 'Medium school', pupils: '300 to 800 pupils', price: '£499', period: 'per year', features: ['Everything in Small school', 'Parent evening pack', 'Staff CPD briefings for every sensitive module', 'Priority pilot onboarding'], featured: true },
  { tier: 'Large or MAT', pupils: '800 plus, or a trust', price: '£999', period: 'per year', features: ['Everything in Medium school', 'Multi school coverage dashboard', 'Co branded parent materials', 'A named onboarding lead'], featured: false },
]

// A miniature of the real product, framed in browser chrome, so a head can
// SEE the premium curriculum map before they ever log in. Built from the
// same character manifest the live product renders from.
function ProductMockup() {
  const showcase = MODULES.slice(0, 6)
  return (
    <div style={{
      background: '#fff', borderRadius: '18px', overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(46,40,24,0.08), 0 50px 90px -40px rgba(46,40,24,0.6)',
      border: '1px solid rgba(255,255,255,0.12)',
    }}>
      {/* Browser chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 14px', background: '#F1EFEA', borderBottom: '1px solid var(--border)' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E06C5A' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E9B949' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7BB662' }} />
        <span style={{ marginLeft: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', background: '#fff', borderRadius: '6px', padding: '3px 12px', flex: 1, maxWidth: '260px' }}>
          guidedchildhood.app/educator/curriculum
        </span>
      </div>
      {/* The map preview */}
      <div style={{ padding: '18px', background: 'var(--cream)' }}>
        <div style={{ ...eyebrow('var(--green-dark)'), fontSize: '0.6rem', marginBottom: '3px' }}>The whole programme · Reception to Year 13</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '12px' }}>The curriculum map</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {showcase.map((m, i) => {
            const ch = CHARACTERS[m.character]
            return (
              <div key={m.moduleId} style={{ background: '#fff', border: `1.5px solid ${ch.accent}`, borderRadius: '11px', overflow: 'hidden' }}>
                <div style={{ background: ch.soft, padding: '5px 7px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#fff', border: `1.5px solid ${ch.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>{ch.emblem}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '6.5px', fontWeight: 700, color: ch.ink, marginLeft: 'auto' }}>M{String(m.n).padStart(2, '0')}</span>
                </div>
                <div style={{ padding: '6px 7px 8px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '8px', color: 'var(--ink)', lineHeight: 1.25, marginBottom: '5px', minHeight: '20px' }}>{m.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ height: '4px', flex: 1, borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: i === 0 ? '100%' : i === 1 ? '66%' : i === 2 ? '33%' : '0%', background: ch.accent }} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '6px', color: 'var(--ink-muted)' }}>{i === 0 ? '3/3' : i === 1 ? '2/3' : i === 2 ? '1/3' : '0/3'}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function SchoolsPage() {
  const totalModules = MODULES.length
  return (
    <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, height: '64px', padding: '0 clamp(20px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(249,248,246,0.82)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
          ⭐ Guided Childhood <span style={{ color: 'var(--terracotta-dark)' }}>Schools</span>
        </Link>
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Link href="#curriculum" style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none' }}>Curriculum</Link>
          <Link href="#pricing" style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none' }}>Pricing</Link>
          <Link href="/login?next=/educator" style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none' }}>Sign in</Link>
          <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '10px 22px', fontSize: '0.84rem', marginLeft: '6px' }}>
            Request a pilot
          </a>
        </nav>
      </header>

      {/* ── HERO ── espresso, oversized, product mockup right ── */}
      <section style={{ background: ESPRESSO, color: '#fff', padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px) clamp(80px, 10vw, 140px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-140px', right: '-100px', width: '620px', height: '620px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(237,195,95,0.22) 0%, transparent 62%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-200px', left: '-140px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(254,240,138,0.09) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'center' }} className="schools-hero-grid">
          <Reveal>
            <p style={{ ...eyebrow(GOLD), marginBottom: '22px' }}>Digital literacy curriculum · Reception to Year 13</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 5.6vw, 4.6rem)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.045em', marginBottom: '24px' }}>
              The ban takes the apps.<br />
              We build the <span style={{ color: GOLD }}>judgement.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.02rem, 1.5vw, 1.22rem)', color: 'rgba(255,250,240,0.9)', lineHeight: 1.7, maxWidth: '500px', marginBottom: '32px' }}>
              <strong style={{ color: '#fff', fontWeight: 800 }}>The complete online safety and digital literacy scheme of work for the new RSHE guidance,</strong> statutory from September 2026. Twenty one modules, Reception to Year 13, each taught from an interactive script with printable packs and the coverage evidence Ofsted asks for. Ready in your classroom tomorrow.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: '1rem', padding: '16px 32px' }}>
                Request a free pilot
              </a>
              <Link href="#curriculum" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', padding: '16px 30px', borderRadius: '16px', textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.24)' }}>
                See the curriculum
              </Link>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'rgba(255,250,240,0.6)' }}>
              Free one term pilot for the first schools. We reply within 48 hours.
            </p>
          </Reveal>
          <Reveal delay={0.12} y={34}>
            <ProductMockup />
          </Reveal>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#211C10', color: '#fff', padding: 'clamp(30px, 4vw, 44px) clamp(20px, 4vw, 40px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '22px' }}>
          {[
            { n: `${totalModules}`, l: 'modules, Reception to Year 13' },
            { n: '8 of 8', l: 'Connected World strands covered' },
            { n: '0', l: 'pupil accounts or logins needed' },
            { n: '48 hrs', l: 'from enquiry to your pilot' },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,250,240,0.64)', marginTop: '8px', lineHeight: 1.4 }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ONE LESSON, EVERYTHING ── the artefacts ── */}
      <section style={{ padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <Reveal>
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>One lesson, everything in it</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)', maxWidth: '760px', marginBottom: '18px' }}>
              A teacher opens one page. The whole lesson is already there.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '620px', marginBottom: '48px' }}>
              No hunting through a portal. No prep the night before. Everything a non specialist needs to teach it well, generated from the lesson itself and updated the moment the world changes.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {[
              { icon: '🎬', title: 'The interactive lesson', body: 'A projector led player with the animated DiGi Squad, timed talk tasks, auto marked checks, and a word for word teacher script on every slide.' },
              { icon: '🖨️', title: 'The printable pack', body: 'Teacher one pager, worksheet, bookmark, start and exit quiz cards, and a colour pupil booklet. Every quiz already has your pupils names on it.' },
              { icon: '📊', title: 'Coverage that builds itself', body: 'One tap records the lesson. The curriculum map fills, and your governors report writes itself as a side effect of teaching.' },
              { icon: '🏡', title: 'A note that reaches home', body: 'Every lesson ends with a parent note. What we taught, and one question for the dinner table. No login, nothing to sign up for.' },
              { icon: '🛡️', title: 'Safeguarding built in', body: 'The five sensitive modules carry a DSL note, a ten minute staff briefing, and disclosure handling written into the script.' },
              { icon: '📋', title: 'The compliance Hub', body: 'RSHE 2025 mapping, policy ready text, the parent pack and a data protection pack for your DPO. All of it prints.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.06} as="div" style={{ height: '100%' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '22px', padding: '26px', height: '100%', boxShadow: softShadow }}>
                  <div style={{ fontSize: '30px', marginBottom: '16px' }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '9px' }}>{f.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SQUAD ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px)', background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <Reveal>
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>Taught by the DiGi Squad</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)', maxWidth: '720px', marginBottom: '18px' }}>
              A cast children remember, carrying lessons that matter.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '44px' }}>
              Each character owns a corner of digital life, so a child meets a familiar face every time the topic comes back. DiGi, the golden star, is always there at the close.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: '14px' }}>
            {[
              { key: 'digi', line: 'The golden star who closes every lesson' },
              { key: 'zara', line: 'Truth, checks and the detective work' },
              { key: 'oliver', line: 'Screen time, routines and gaming' },
              { key: 'sofia', line: 'Kindness, privacy and staying safe' },
              { key: 'vix', line: 'Street smart on scams and workarounds' },
              { key: 'brock', line: 'The calm one, for mood and wellbeing' },
            ].map((c, i) => {
              const ch = CHARACTERS[c.key as keyof typeof CHARACTERS]
              return (
                <Reveal key={c.key} delay={(i % 3) * 0.05} as="div" style={{ height: '100%' }}>
                  <div style={{ background: ch.soft, border: `1.5px solid ${ch.accent}`, borderRadius: '20px', padding: '22px 18px', textAlign: 'center', height: '100%' }}>
                    <div style={{ width: '56px', height: '56px', margin: '0 auto 14px', borderRadius: '50%', background: '#fff', border: `2px solid ${ch.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{ch.emblem}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: ch.ink, marginBottom: '6px' }}>{ch.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{c.line}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section id="curriculum" style={{ padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <Reveal>
            <p style={{ ...eyebrow(), marginBottom: '14px' }}>The scheme of work</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)', maxWidth: '760px', marginBottom: '18px' }}>
              {totalModules} modules that build from first screens to the working world.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '620px', marginBottom: '44px' }}>
              Not a bolt on, not a one off assembly. A proper spine that sits inside your PSHE provision and covers all eight Education for a Connected World strands, EYFS to Year 13.
            </p>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {KEY_STAGE_ORDER.map((ks, i) => {
              const meta = KEY_STAGE_META[ks]
              const mods = MODULES.filter(m => m.keyStage === ks)
              return (
                <Reveal key={ks} delay={i * 0.05}>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(180px, 220px) 1fr', boxShadow: softShadow }} className="schools-curric-row">
                    <div style={{ background: ESPRESSO, color: '#fff', padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ ...eyebrow(GOLD), fontSize: '0.64rem', marginBottom: '7px' }}>{meta.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, marginBottom: '3px' }}>{meta.years}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(255,250,240,0.7)', lineHeight: 1.45 }}>{meta.strapline}</div>
                    </div>
                    <div style={{ padding: '22px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignContent: 'center' }}>
                      {mods.map(m => {
                        const ch = CHARACTERS[m.character]
                        return (
                          <span key={m.moduleId} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: ch.soft, border: `1px solid ${ch.accent}`, borderRadius: '100px', padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>
                            <span style={{ fontSize: '11px' }}>{ch.emblem}</span>{m.title}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 120px) clamp(20px, 4vw, 40px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'clamp(28px, 4vw, 56px)', alignItems: 'center' }} className="schools-hero-grid">
              <div>
                <p style={{ ...eyebrow(), marginBottom: '14px' }}>Ready for inspection, ready for parents</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 3.4vw, 2.9rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: '18px' }}>
                  The paperwork is already written, and it prints.
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.02rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Every module is mapped to the RSHE 2025 guidance that becomes statutory in September 2026, including deepfakes, misogynistic and incel content, gambling and the harms of pornography. Your DSL gets the safeguarding crosswalk, your DPO gets the data protection pack, and parents get a transparency pack built for consultation.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.02rem', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  All of it regenerates from the live curriculum, so it can never fall out of date in a filing cabinet.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'RSHE 2025', desc: 'Statutory September 2026, mapped module by module.' },
                  { label: 'KCSIE 2025', desc: 'Online content harms addressed in every relevant module.' },
                  { label: 'Connected World', desc: 'All eight UKCIS strands, EYFS to Year 13.' },
                  { label: 'Data minimised', desc: 'First name and initial only. No pupil accounts.' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: softShadow }}>
                    <div style={{ ...eyebrow('var(--green-dark)'), fontSize: '0.62rem', marginBottom: '9px' }}>{item.label}</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ ...eyebrow(), marginBottom: '14px' }}>One licence, everything included</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink)', marginBottom: '16px' }}>
                Simple annual pricing.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
                Every teacher, every year group, all {totalModules} modules. No per seat fees, no per lesson charges.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
            {PRICING.map((plan, i) => (
              <Reveal key={plan.tier} delay={i * 0.07} as="div" style={{ height: '100%' }}>
                <div style={{
                  background: plan.featured ? ESPRESSO : '#fff',
                  color: plan.featured ? '#fff' : 'var(--ink)',
                  border: plan.featured ? 'none' : '1px solid var(--border)',
                  borderRadius: '24px', padding: '32px 28px', display: 'flex', flexDirection: 'column', height: '100%',
                  boxShadow: plan.featured ? '0 2px 4px rgba(46,40,24,0.1), 0 40px 70px -34px rgba(46,40,24,0.55)' : softShadow,
                  position: 'relative',
                }}>
                  {plan.featured && (
                    <span style={{ position: 'absolute', top: '20px', right: '20px', ...eyebrow(GOLD), fontSize: '0.6rem' }}>Most schools</span>
                  )}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: plan.featured ? GOLD : 'var(--ink-muted)', marginBottom: '6px' }}>{plan.tier}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: plan.featured ? 'rgba(255,250,240,0.7)' : 'var(--ink-muted)', marginBottom: '18px' }}>{plan.pupils}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '22px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em' }}>{plan.price}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: plan.featured ? 'rgba(255,250,240,0.64)' : 'var(--ink-muted)' }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1, padding: 0 }}>
                    {plan.features.map(feat => (
                      <li key={feat} style={{ display: 'flex', gap: '10px', fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: plan.featured ? 'rgba(255,255,255,0.82)' : 'var(--ink-soft)', alignItems: 'flex-start', lineHeight: 1.5 }}>
                        <span style={{ color: GOLD, fontWeight: 900, flexShrink: 0 }}>✓</span>{feat}
                      </li>
                    ))}
                  </ul>
                  <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{
                    width: '100%', padding: '14px', borderRadius: '14px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.92rem',
                    textDecoration: 'none', display: 'block', textAlign: 'center', cursor: 'pointer',
                    ...(plan.featured
                      ? { background: GOLD, color: 'var(--ink)', boxShadow: '0 5px 0 var(--terracotta-dark)' }
                      : { background: 'var(--cream)', color: 'var(--ink)', border: '1.5px solid var(--border)' }),
                  }}>
                    Request a pilot
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-muted)', marginTop: '24px' }}>
            10 percent off a two year commitment · a free assembly pack with every enquiry · all teacher logins included
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: ESPRESSO, color: '#fff', padding: 'clamp(72px, 10vw, 130px) clamp(20px, 4vw, 40px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '720px', height: '720px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(237,195,95,0.16) 0%, transparent 62%)', pointerEvents: 'none' }} />
        <Reveal>
          <div style={{ maxWidth: '660px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '44px', marginBottom: '18px' }}>⭐</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.2vw, 3.3rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '18px' }}>
              Be one of the first schools to teach it.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.08rem', color: 'rgba(255,250,240,0.84)', lineHeight: 1.7, marginBottom: '32px' }}>
              A free one term pilot for the first schools who want to get ahead of September 2026. Tell us your school and we will reply within 48 hours, with the free assembly pack either way.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '17px 36px' }}>
                Request your pilot
              </a>
              <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', padding: '17px 34px', borderRadius: '16px', textDecoration: 'none', color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.26)' }}>
                Get the free assembly pack
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '30px clamp(20px, 4vw, 40px)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--ink-muted)', textDecoration: 'none' }}>← Guided Childhood</Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-light)' }}>© 2026 The Social Billboard · Justin Phillips</p>
        </div>
      </footer>

      {/* Responsive: stack the two column grids on small screens */}
      <style>{`
        @media (max-width: 860px) {
          .schools-hero-grid { grid-template-columns: 1fr !important; }
          .schools-curric-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
