import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { STAGES } from '@/lib/content/stages'
import FaqAccordion from '@/components/marketing/FaqAccordion'

const STAGE_COLORS = {
  1: { bg: 'var(--stage-1)', text: 'var(--ink)', border: 'var(--stage-1)', accent: 'var(--terracotta)' },
  2: { bg: 'var(--stage-2)', text: 'var(--ink)', border: 'var(--stage-2)', accent: 'var(--terracotta)' },
  3: { bg: 'var(--stage-3)', text: 'var(--ink)', border: 'var(--stage-3)', accent: 'var(--terracotta)' },
  4: { bg: 'var(--stage-4)', text: 'var(--ink)', border: 'var(--stage-4)', accent: 'var(--terracotta)' },
  5: { bg: 'var(--stage-5)', text: 'var(--ink)', border: 'var(--stage-5)', accent: 'var(--terracotta)' },
} as const

async function getFounderData() {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_founder', true)
      .eq('subscription_status', 'active')
    return { taken: count ?? 0, available: (count ?? 0) < 50 }
  } catch {
    return { taken: 0, available: true }
  }
}

const FEATURES = [
  {
    icon: '◎',
    title: 'DiGi AI advisor',
    desc: 'Stage-specific. Research-grounded. Available at 11pm when you need it. Ask about social media, TV battles, gaming, mood changes, workarounds. Always a calibrated next step.',
    tag: 'Available 24/7',
    tagColor: 'var(--terracotta)',
    tagBg: 'var(--stage-2)',
  },
  {
    icon: '◻',
    title: '17 conversation scripts',
    desc: 'Say this, not this, and why it works. Social media, TV rules, bedtime battles, gaming, the boredom fight, mood after screens. Every difficult moment covered.',
    tag: 'For every hard moment',
    tagColor: 'var(--terracotta)',
    tagBg: 'var(--stage-4)',
  },
  {
    icon: '△',
    title: 'Weekly wellbeing tracker',
    desc: 'Five questions, once a week. Over time, patterns emerge. DiGi responds to what you find. You spot things before they become problems.',
    tag: 'Patterns not panic',
    tagColor: 'var(--terracotta)',
    tagBg: 'var(--stage-5)',
  },
  {
    icon: '⌂',
    title: 'Five developmental stages',
    desc: 'Age 4 to 16. Each stage has different risks, different conversations, and a different device recommendation. The pathway meets your child where they are.',
    tag: 'Ages 4 to 16',
    tagColor: 'var(--terracotta)',
    tagBg: 'var(--stage-1)',
  },
  {
    icon: '◈',
    title: 'Family agreement builder',
    desc: 'A document your whole family creates together. Agreed, not imposed. Reviewed each term. Changes the dynamic from rules to relationship.',
    tag: 'Agreed not imposed',
    tagColor: 'var(--terracotta)',
    tagBg: 'var(--stage-2)',
  },
  {
    icon: '◉',
    title: 'Stage curriculum',
    desc: 'Units 1 to 4 per stage. Practical, parent-led. Covers devices, social media, gaming, AI, and wellbeing. Structured so you always know what comes next.',
    tag: 'Structured pathway',
    tagColor: 'var(--terracotta)',
    tagBg: 'var(--stage-4)',
  },
]

const TESTIMONIALS = [
  {
    quote: 'The bedroom rule conversation took three minutes. I had been putting it off for months. The script made it feel possible.',
    name: 'Sarah',
    stage: 'Stage 2',
    initials: 'S',
    avatarBg: 'var(--stage-2)',
  },
  {
    quote: 'Her mood was dropping every Sunday. DiGi was the first thing that helped me understand why and what to actually do about it.',
    name: 'Emma',
    stage: 'Stage 3',
    initials: 'E',
    avatarBg: 'var(--stage-3)',
  },
  {
    quote: 'I was ready to just ban TikTok. The algorithm conversation changed everything. He actually thanks me for it now.',
    name: 'Mark',
    stage: 'Stage 3',
    initials: 'M',
    avatarBg: 'var(--stage-4)',
  },
  {
    quote: 'Five minutes a week on the tracker. Sounds small. Has changed how I see what is happening with my daughter completely.',
    name: 'Laura',
    stage: 'Stage 4',
    initials: 'L',
    avatarBg: 'var(--stage-5)',
  },
]

export default async function JoinPage() {
  const { taken, available } = await getFounderData()
  const remaining = 50 - taken
  const pct = Math.round((taken / 50) * 100)

  return (
    <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>

      {/* Nav */}
      <header style={{
        padding: '0 28px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(247,243,238,.97)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 300,
      }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '64px', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--terracotta)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 rgba(0,0,0,.2)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '15px' }}>
                {[4, 8, 13, 7].map((h, i) => <div key={i} style={{ width: '3px', height: `${h}px`, background: '#fff', borderRadius: '1.5px' }} />)}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.98rem', color: 'var(--ink)' }}>Guided Childhood</span>
          </Link>
          <Link href="/starter-pack" className="btn btn-gold" style={{ padding: '10px 22px', fontSize: '12px' }}>
            Start free →
          </Link>
        </div>
      </header>

      {/* ================================================================
          HERO
          ================================================================ */}
      <section style={{ padding: 'clamp(64px, 10vw, 104px) 32px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
        {/* Background */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '-100px', right: '-100px', width: '440px', height: '440px', borderRadius: '50%', background: 'var(--stage-2)', opacity: .06, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Urgency badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--stage-1)', border: '1.5px solid var(--terracotta-lt)', borderRadius: '100px', padding: '7px 16px', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--terracotta)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
              UK social media ban confirmed · Spring 2027
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.03,
            letterSpacing: '-.04em',
            color: 'var(--ink)',
            marginBottom: '24px',
          }}>
            Raise a child who is<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>ready for everything.</em>
          </h1>

          <p style={{ fontSize: 'clamp(.98rem, 1.6vw, 1.12rem)', color: 'var(--ink-soft)', lineHeight: 1.88, maxWidth: '620px', margin: '0 auto 36px' }}>
            A science-backed digital parenting membership. A pathway from age 4 to 16 covering social media, TV, gaming, bedtime, behaviour and everything in between. Scripts for every hard moment. DiGi available when you need it.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '17px 36px' }}>
              Find your child's stage — it is free →
            </Link>
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--ink-light)', letterSpacing: '.06em' }}>
            Three questions. No account needed. Your pathway is waiting.
          </p>

          {/* Social proof row */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            {[
              { num: '131', label: 'Families on the pathway' },
              { num: '5', label: 'Stages · Ages 4 to 16' },
              { num: '17', label: 'Conversation scripts' },
              { num: '20', label: 'Issues covered' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.03em' }}>{s.num}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--ink-muted)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee strip */}
      <div style={{ background: 'var(--stage-2)', borderTop: '1px solid var(--stage-2)', borderBottom: '1px solid var(--stage-2)', padding: '14px 32px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
        {['30 day money back guarantee', 'Cancel any time', 'No lock-in'].map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--terracotta)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', flexShrink: 0 }}>✓</span>
            {item}
          </span>
        ))}
      </div>

      {/* ================================================================
          STAGE CARDS
          ================================================================ */}
      <section className="section-lg" style={{ background: '#FDFBF8' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Five stages</p>
            <h2 style={{ marginBottom: '14px' }}>The pathway meets your child where they are</h2>
            <p style={{ fontSize: '.98rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}>
              Every stage has different risks, different conversations, and a different device recommendation. Find yours and start there.
            </p>
          </div>

          <div className="stages-grid">
            {STAGES.map(stage => {
              const color = STAGE_COLORS[stage.id as keyof typeof STAGE_COLORS]
              return (
                <div key={stage.id} style={{
                  background: color.bg,
                  border: `1px solid ${color.border}`,
                  borderRadius: '16px',
                  padding: '22px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Accent top bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color.accent }} />

                  {stage.isCritical && (
                    <span style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'var(--terracotta)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '100px', marginBottom: '8px' }}>
                      Critical window
                    </span>
                  )}

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: color.text, marginBottom: '6px' }}>
                    Stage {stage.id}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '3px' }}>
                    {stage.name}
                  </div>
                  <div style={{ fontSize: '.73rem', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                    <strong style={{ display: 'block', fontSize: '.87rem', color: 'var(--ink)', letterSpacing: '-.01em', lineHeight: 1.3 }}>{stage.keyStage}</strong>
                    {stage.ages}
                  </div>

                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '.82rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55, marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,.08)', flex: 1 }}>
                    {stage.parentQuote}
                  </p>

                  <Link href="/starter-pack" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '12px',
                    fontSize: '.72rem',
                    fontWeight: 700,
                    color: stage.isCritical ? '#fff' : 'var(--ink)',
                    background: stage.isCritical ? 'var(--terracotta)' : color.accent,
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '.02em',
                    textDecoration: 'none',
                    boxShadow: stage.isCritical ? '0 3px 0 rgba(192,57,43,.4)' : `0 3px 0 ${color.text}44`,
                  }}>
                    Start here →
                  </Link>
                </div>
              )
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href="/starter-pack" className="btn btn-gold">Find my child's stage →</Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          TRUST FRAMEWORK
          ================================================================ */}
      <section className="section-lg">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The method</p>
            <h2 style={{ marginBottom: '14px' }}>
              One framework.{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>All the way through.</em>
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '.98rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.82 }}>
              Research-backed. Tested with parents. TRUST runs through every action, script, and lesson from age 4 to 16.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0 }}>
            {[
              { letter: 'T', word: 'Timing', desc: 'Right conversation, right moment. Not too early, not too late.', bg: 'var(--stage-2)', color: 'var(--terracotta)' },
              { letter: 'R', word: 'Relationships', desc: 'Connection before compliance. The relationship is the protection.', bg: 'var(--stage-1)', color: 'var(--terracotta)' },
              { letter: 'U', word: 'Upstream', desc: 'Environment before rules. Platform mechanics matter more than willpower.', bg: 'var(--stage-5)', color: 'var(--terracotta)' },
              { letter: 'S', word: 'Sleep', desc: 'Bedroom rule. The single highest-impact change in the system.', bg: 'var(--cream)', color: 'var(--ink-soft)' },
              { letter: 'T', word: 'Transparency', desc: 'Openness over secrecy. Co-navigation over monitoring.', bg: 'var(--stage-4)', color: 'var(--terracotta)' },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1,
                minWidth: '140px',
                maxWidth: '180px',
                textAlign: 'center',
                padding: '28px 14px',
                position: 'relative',
              }}>
                {i < 4 && <span className="hide-mobile" style={{ position: 'absolute', right: '-12px', top: '28px', fontSize: '.9rem', color: 'var(--ink-light)' }}>→</span>}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: `0 4px 0 ${item.color}33`,
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: item.color }}>
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
          JUSTIN STORY
          ================================================================ */}
      <section className="section-lg" style={{ background: 'var(--terracotta-dark)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--green) 0%, rgba(175,220,162,.4) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.4rem',
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 6px 24px rgba(0,0,0,.2)',
              letterSpacing: '-.02em',
            }}>
              JP
            </div>
            <div>
              <p className="eyebrow" style={{ color: 'var(--terracotta-lt)', marginBottom: '8px' }}>Why I built this</p>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9rem', color: '#fff' }}>Justin Phillips</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'rgba(255,255,255,.5)', marginTop: '2px' }}>Founder, Guided Childhood · Bath, UK</div>
            </div>
          </div>

          <blockquote style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 2.8vw, 1.7rem)',
            color: '#fff',
            fontWeight: 700,
            lineHeight: 1.48,
            marginBottom: '24px',
            fontStyle: 'italic',
            borderLeft: '3px solid var(--terracotta-lt)',
            paddingLeft: '24px',
          }}>
            "I watched my daughter scroll for three hours and realised the conversation I was missing."
          </blockquote>

          <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.88, marginBottom: '16px' }}>
            Every parent I spoke to was worried. Not because they were doing something wrong. Because the guidance they were given was either too alarmist to be useful, or too vague to act on.
          </p>
          <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.88, marginBottom: '32px' }}>
            Guided Childhood is the platform I wanted to hand them. Staged by age. Specific to the challenge. A DiGi advisor that speaks plainly and ends every response with a concrete next step.
          </p>

          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '13px' }}>
            Start your child's pathway →
          </Link>
        </div>
      </section>

      {/* ================================================================
          EXPERT BENCH
          ================================================================ */}
      <section className="section-lg" style={{ background: '#FDFBF8' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The research bench</p>
            <h2 style={{ marginBottom: '14px' }}>
              Built on evidence,{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>not panic</em>
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '.98rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.82 }}>
              DiGi is trained on the same evidence base as the UK Surgeon General Advisory and Ofcom's media literacy framework. No opinions. Just the science.
            </p>
          </div>

          <div className="four-col">
            {[
              { name: 'Prof. Candace Odgers', institution: 'UC Irvine · Duke', note: 'Effects depend on vulnerability and environment, not hours of use.', initial: 'CO', bg: 'var(--stage-2)', color: 'var(--terracotta)' },
              { name: 'Dr Amy Orben', institution: 'Cambridge MRC · Oxford', note: 'The 11 to 13 developmental window. Peak sensitivity for girls.', initial: 'AO', bg: 'var(--stage-1)', color: 'var(--terracotta)' },
              { name: 'Prof. Andrew Przybylski', institution: 'Oxford OII', note: 'The Goldilocks effect. Moderate, structured use is not the problem.', initial: 'AP', bg: 'var(--stage-5)', color: 'var(--terracotta)' },
              { name: 'Prof. Sonia Livingstone', institution: 'LSE, London', note: 'Children need skills and agency, not just restrictions.', initial: 'SL', bg: 'var(--stage-4)', color: 'var(--terracotta)' },
            ].map((expert, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: expert.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.8rem', color: expert.color, flexShrink: 0 }}>
                  {expert.initial}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--ink)', marginBottom: '3px' }}>{expert.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.63rem', color: expert.color, letterSpacing: '.06em', marginBottom: '8px', fontWeight: 600 }}>{expert.institution}</div>
                  <p style={{ fontSize: '.79rem', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{expert.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          WHAT IS INSIDE
          ================================================================ */}
      <section className="section-lg">
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What is inside</p>
            <h2 style={{ marginBottom: '14px' }}>
              Everything you need.{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>At the right moment.</em>
            </h2>
          </div>

          <div className="three-col">
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '1.6rem', color: 'var(--terracotta)', lineHeight: 1 }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.3 }}>{f.title}</div>
                <p style={{ fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.72, flex: 1 }}>{f.desc}</p>
                <span style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  background: f.tagBg,
                  color: f.tagColor,
                  borderRadius: '100px',
                  padding: '4px 11px',
                  fontSize: '.63rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '.04em',
                  marginTop: 'auto',
                }}>
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          OUTCOME NARRATIVE
          ================================================================ */}
      <section className="section-lg" style={{ background: 'var(--deep-teal)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '14px' }}>How this shows up in your home</p>
          <h2 style={{ color: '#fff', marginBottom: '44px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '-.03em' }}>
            Three moments. Each one real.
          </h2>
          <div className="three-col" style={{ gap: '16px' }}>
            {[
              { time: 'Tonight', color: 'var(--stage-2)', desc: 'The bedroom rule is in place. Devices sleep in the kitchen. Everyone sleeps better. The conversation took four minutes and the script meant you did not flinch.' },
              { time: 'This term', color: 'var(--stage-5)', desc: 'You have had the algorithm conversation. They come to you when something weird shows up. The door is open. That is the whole thing.' },
              { time: 'Spring 2027', color: 'var(--stage-1)', desc: 'The ban comes into force. Your child reaches 16 ready. They know how algorithms work, what their digital footprint says about them, and how to get help when something goes wrong online. The switch flips. They are not starting from zero.' },
            ].map((moment, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '18px', padding: '28px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: moment.color }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: moment.color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 700 }}>
                  {moment.time}
                </div>
                <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.78)', lineHeight: 1.78 }}>{moment.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      <section className="section-lg" style={{ background: '#FDFBF8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>What parents say</p>
            <h2>
              From parents who started{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>where you are</em>
            </h2>
          </div>

          <div className="two-col-issues" style={{ gap: '14px', marginBottom: '16px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--gold)', fontSize: '.95rem', letterSpacing: '2px', marginBottom: '14px' }}>★★★★★</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '.92rem', color: 'var(--ink)', lineHeight: 1.68, fontStyle: 'italic', flex: 1, marginBottom: '18px' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.8rem', color: 'var(--ink-soft)', flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.82rem', color: 'var(--ink)' }}>{t.name}</div>
                    <span style={{ background: 'var(--stage-2)', color: 'var(--terracotta)', borderRadius: '100px', padding: '2px 8px', fontSize: '.62rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {t.stage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          NOT TOO LATE
          ================================================================ */}
      <section style={{ padding: 'clamp(48px, 6vw, 72px) 32px', background: 'var(--stage-5)', borderTop: '1px solid var(--stage-5)', borderBottom: '1px solid var(--stage-5)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '18px', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-.03em' }}>
            Spring 2027 is the date.<br />Now is the time.
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.96rem', lineHeight: 1.85, marginBottom: '28px' }}>
            The phone is already there. The accounts already exist. The ban is coming. You are not starting from zero. You are starting from now. Every stage has a next step.
          </p>
          <Link href="/starter-pack" className="btn btn-gold">Find your starting point →</Link>
        </div>
      </section>

      {/* ================================================================
          PRICING
          ================================================================ */}
      <section className="section-lg">
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Membership</p>
            <h2 style={{ marginBottom: '10px' }}>Simple pricing. Start free.</h2>
            <p style={{ color: 'var(--ink-muted)', fontSize: '.96rem', lineHeight: 1.7 }}>
              30 day money back guarantee on all paid plans. Cancel any time.
            </p>
          </div>

          {/* Founder rate — dark card */}
          {available && (
            <div style={{
              background: 'var(--deep-teal)',
              borderRadius: '20px',
              padding: 'clamp(28px, 4vw, 40px)',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Background circles */}
              <div aria-hidden="true" style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(242,201,76,.08)', pointerEvents: 'none' }} />

              <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--gold)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '8px 20px', borderRadius: '0 20px 0 14px' }}>
                {remaining} of 50 places remain
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p className="eyebrow" style={{ color: 'var(--gold)' }}>Founder rate — first 50 members</p>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'rgba(255,255,255,.5)' }}>{taken} taken</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,.1)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold)', borderRadius: '100px', transition: 'width 1s ease' }} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.8rem, 5vw, 3.6rem)', color: '#fff', lineHeight: 1, letterSpacing: '-.04em' }}>£7.99</span>
                  <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.95rem' }}> / month</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--gold)', marginTop: '6px', fontWeight: 600 }}>
                  Locked for life. Never increases.
                </div>
              </div>

              <div className="two-col-issues" style={{ gap: '10px', marginBottom: '28px' }}>
                {[
                  'All 5 stages, for life',
                  'Unlimited DiGi conversations',
                  'All 17 conversation scripts',
                  'Wellbeing tracker',
                  'Family agreement builder',
                  'Monthly live Pathway Sessions',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.8)' }}>{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/starter-pack" className="btn btn-gold" style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '14px', padding: '17px' }}>
                Start with the free check — then claim your place →
              </Link>
            </div>
          )}

          {/* Standard + Annual */}
          <div className="two-col-issues" style={{ gap: '16px' }}>
            {/* Standard */}
            <div style={{ background: '#FDFBF8', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
              <p className="eyebrow" style={{ marginBottom: '12px' }}>Standard</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.4rem', color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.03em' }}>£12.99</span>
                <span style={{ color: 'var(--ink-muted)', fontSize: '.82rem' }}> / month</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
                {['All 5 stages', 'Unlimited DiGi', 'All 17 scripts', 'Wellbeing tracker', 'Cancel any time'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '9px', alignItems: 'center', fontSize: '.84rem', color: 'var(--ink-soft)' }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/starter-pack" className="btn btn-ink" style={{ display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
                Start Standard
              </Link>
            </div>

            {/* Annual */}
            <div style={{ background: 'var(--stage-2)', border: '2px solid var(--terracotta)', borderRadius: '20px', padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--terracotta)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                Save £57
              </div>
              <p className="eyebrow" style={{ marginBottom: '12px', marginTop: '8px', color: 'var(--terracotta)' }}>Annual</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.4rem', color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.03em' }}>£99</span>
                <span style={{ color: 'var(--ink-muted)', fontSize: '.82rem' }}> / year</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--terracotta)', fontWeight: 700, marginBottom: '20px' }}>
                £8.25 / month · Two months free
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
                {['Everything in Standard', 'One payment, full year', 'Best value'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '9px', alignItems: 'center', fontSize: '.84rem', color: 'var(--ink-soft)' }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/starter-pack" className="btn btn-green" style={{ display: 'flex', justifyContent: 'center', fontSize: '13px' }}>
                Start Annual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ
          ================================================================ */}
      <section className="section-lg" style={{ background: '#FDFBF8' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Questions</p>
            <h2>Things parents ask before they start</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
      <section style={{ padding: 'clamp(72px, 10vw, 112px) 32px', textAlign: 'center', background: 'var(--terracotta-dark)', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '540px', margin: '0 auto', position: 'relative' }}>
          <p className="eyebrow" style={{ color: 'var(--terracotta-lt)', marginBottom: '18px' }}>Your starting point is three questions away</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#fff', marginBottom: '18px', letterSpacing: '-.04em', lineHeight: 1.06 }}>
            Find your child's stage.<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Free.</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.97rem', lineHeight: 1.85, marginBottom: '32px' }}>
            Age, main challenge, how you are feeling. Three questions. Your personalised pathway is waiting on the other side.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '17px 36px', display: 'inline-flex' }}>
            Start the check — it is free →
          </Link>
          <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.04em' }}>
            No account needed. No card. Your pathway is yours from the first question.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '36px 32px', background: '#FDFBF8' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.92rem', color: 'var(--ink)', textDecoration: 'none' }}>
            Guided Childhood
          </Link>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[['Home', '/'], ['Schools', '/schools'], ['Health Check', 'https://wellbeing.guidedchildhood.com/'], ['Login', '/login']].map(([label, href]) => (
              <Link
                key={href} href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--ink-muted)', textDecoration: 'none' }}
              >{label}</Link>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--ink-light)' }}>© 2026 The Social Billboard</div>
        </div>
      </footer>

    </div>
  )
}
