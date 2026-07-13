import Link from 'next/link'

// The guide: one calm page that explains how Guided Childhood works and maps
// the whole learning journey from 4 to 16, so a parent always knows what they
// have, what it is for, and where to start. A how it works explainer plus a
// browsable lesson map, in one place. Static and self contained, it reads the
// pathway from the same syllabus the lessons are built on.

const HOW_IT_WORKS: { emoji: string; title: string; body: string; href: string; cta: string }[] = [
  {
    emoji: '🌱', title: 'The daily practice, ten minutes',
    body: 'Each day gives you one small thing: a moment, the words for it, a quick check in. Small enough to keep, big enough to change the week. This is the habit everything hangs on.',
    href: '/dashboard/daily', cta: 'Do today’s practice',
  },
  {
    emoji: '🗺️', title: 'The pathway to 16',
    body: 'One plan that turns 16 from a cliff edge into a gentle ramp. The settings relax as your child earns it, one stage at a time, all the way to independence.',
    href: '/dashboard/pathway', cta: 'See the pathway',
  },
  {
    emoji: '✦', title: 'Lessons that grow judgement',
    body: 'Calm, age matched lessons that teach real digital judgement: spotting the advert, the fake, the pull of the feed. A short video, an activity, a task. Learned together for the young, on their own as they grow.',
    href: '/dashboard/lessons', cta: 'Open the lessons',
  },
  {
    emoji: '⭐', title: 'Quests and games that earn screen time',
    body: 'Everyday jobs, real play and quick learning games earn stars, and stars buy the screen time you agree. Play pays the most, on purpose, so earned time already did its job.',
    href: '/dashboard/quests', cta: 'Set up quests',
  },
  {
    emoji: '💬', title: 'Scripts for the hard moments',
    body: 'The exact words for the meltdown, the handover, the first phone conversation. Word for word, ready for tonight, so you are never caught without something to say.',
    href: '/dashboard/scripts', cta: 'Find the words',
  },
  {
    emoji: '◎', title: 'DiGi, for the eleven at night question',
    body: 'A real answer for your child and your stage, never a lecture and never a list of links. DiGi reads the moments you have flagged and helps you with the one that matters now.',
    href: '/dashboard/digi', cta: 'Ask DiGi',
  },
]

const LESSON_MAP: { stage: string; ages: string; lessons: string[] }[] = [
  { stage: 'Reception', ages: 'ages 4 to 5', lessons: ['Screens and kindness, real and not real'] },
  { stage: 'Years 1 to 2', ages: 'ages 5 to 7', lessons: ['Kind screens, calm bodies', 'Real, pretend, or made by a computer'] },
  { stage: 'Years 3 to 6', ages: 'ages 7 to 11', lessons: ['Screen routines that work', 'Gaming: time, intensity and spend', 'How algorithms work', 'Privacy and digital reputation', 'Kind and safe online', 'Copyright and ownership'] },
  { stage: 'Years 7 to 9', ages: 'ages 11 to 14', lessons: ['Mood and screens', 'Social workarounds', 'Scams, fraud and money', 'Bodies, image and pressure'] },
  { stage: 'Years 10 to 11', ages: 'ages 14 to 16', lessons: ['Manipulation and persuasion', 'Consent, images and the law', 'Sextortion', 'Radicalisation and misogyny'] },
  { stage: 'Sixth form and up', ages: 'ages 16 plus', lessons: ['AI mastery and data rights', 'Digital identity and future work'] },
]

export default function GuidePage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '4px' }}>Your guide</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '10px' }}>
        How Guided Childhood works
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '15.5px', lineHeight: 1.6, marginBottom: '28px' }}>
        Ten minutes a day, and a childhood ready for the phone rather than broken by it. Here is everything you have, what each part is for, and where to start.
      </p>

      {/* How it works, the parts and what they are for */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
        {HOW_IT_WORKS.map((step, i) => (
          <div key={step.title} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 5px 20px rgba(46,40,24,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ width: 40, height: 40, borderRadius: '11px', flexShrink: 0, background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{step.emoji}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ink-muted)' }}>Step {i + 1}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em' }}>{step.title}</span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>{step.body}</p>
            <Link href={step.href} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
              {step.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* The lesson map, the whole journey 4 to 16 */}
      <div style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '22px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
          The lesson map
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em', color: '#fff', margin: '0 0 6px' }}>
          Every lesson, 4 to 16
        </h2>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.55, margin: 0 }}>
          The whole journey, mapped to your child’s stage. Co watched at the start, on their own as they grow, each one building the judgement that makes independence at 16 a step, not a fall.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
        {LESSON_MAP.map(band => (
          <div key={band.stage} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>{band.stage}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)' }}>{band.ages}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {band.lessons.map(l => (
                <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
                  <span style={{ color: 'var(--terracotta)', flexShrink: 0, marginTop: '1px' }}>✦</span>
                  <span style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.45 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Start here */}
      <div style={{ background: 'var(--tint-sage)', borderRadius: '18px', padding: '20px 22px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Not sure where to start?
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
          Start with today’s ten minute practice. Everything else grows from there.
        </p>
        <Link href="/dashboard/daily" style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '14px', padding: '13px 24px', textDecoration: 'none', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
          Start today’s practice
        </Link>
      </div>
    </div>
  )
}
