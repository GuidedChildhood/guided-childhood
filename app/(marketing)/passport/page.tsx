import Link from 'next/link'
import { STAGES } from '@/lib/content/stages'
import {
  PASSPORT_EVIDENCE,
  PASSPORT_TAGLINE,
  PASSPORT_ANALOGY,
  STAGE_READINESS,
} from '@/lib/content/passport'

export const metadata = {
  title: 'The Social Media Passport · Guided Childhood',
  description:
    'The digital pathway is your child’s social media passport. Gradual, guided exposure from age 4 to 16, built on the evidence, so 16 is a step and not a cliff edge.',
}

const STAGE_BG = ['var(--stage-1)', 'var(--stage-2)', 'var(--stage-3)', 'var(--stage-4)', 'var(--stage-5)']

export default function PassportPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 20px 64px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)',
          marginBottom: '16px',
        }}>
          The idea behind the pathway
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(2rem, 6vw, 3.2rem)', letterSpacing: '-0.035em',
          lineHeight: 1.08, marginBottom: '18px',
        }}>
          {PASSPORT_TAGLINE}
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>
          {PASSPORT_ANALOGY}
        </p>
      </div>

      {/* The cliff edge, and the ramp */}
      <div style={{
        background: 'var(--deep-teal)', borderRadius: '22px',
        padding: '32px 28px', marginBottom: '44px', color: '#fff',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)',
          marginBottom: '14px',
        }}>
          Why 16 matters
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '14px' }}>
          A ban is a wall. A wall postpones the problem to 16.
        </h2>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', marginBottom: '14px' }}>
          As the UK lowers the voting age to 16, a teenager can meet their first vote and their first social media in the same year. Two of the biggest things they will ever do, arriving together, with no run up. That is the cliff edge.
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          The passport builds the ramp instead. Gradual, guided exposure through the school years, so by 16 your child already knows the ground under their feet. Preparing, not postponing.
        </p>
      </div>

      {/* The five stamps */}
      <div style={{ marginBottom: '44px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.025em', marginBottom: '8px', textAlign: 'center' }}>
          Five stamps, earned one at a time
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, textAlign: 'center', maxWidth: '520px', margin: '0 auto 28px' }}>
          Each stage is a stamp in the passport. No stage is skipped, and the training turns heavy from about 13, the run up to 16.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STAGES.map(stage => {
            const r = STAGE_READINESS[stage.id]
            const heavy = r.weight === 'heavy'
            return (
              <div key={stage.id} style={{
                background: STAGE_BG[stage.id - 1],
                border: heavy ? '2.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                borderRadius: '18px', padding: '20px 22px',
                display: 'flex', gap: '18px', alignItems: 'flex-start',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '30px',
                  lineHeight: 1, color: 'var(--terracotta)', opacity: 0.55, flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {String(stage.id).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                      {stage.name} · {stage.ages}
                    </span>
                    {heavy && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--terracotta)', color: '#fff', padding: '2px 8px', borderRadius: '100px' }}>
                        Heavy training
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '5px' }}>
                    {r.title}
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
                    {r.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* The evidence */}
      <div style={{ marginBottom: '44px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.025em', marginBottom: '8px', textAlign: 'center' }}>
          What the evidence says
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, textAlign: 'center', maxWidth: '520px', margin: '0 auto 28px' }}>
          The passport is not a hunch. It is the nuanced reading of the research, harms and benefits both taken seriously.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {PASSPORT_EVIDENCE.map((e, i) => (
            <div key={i} style={{
              background: 'var(--cream)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '22px 24px',
              borderLeft: '4px solid var(--terracotta)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                {e.headline}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '10px' }}>
                {e.detail}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.04em', color: 'var(--ink-muted)', margin: 0 }}>
                {e.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'var(--stage-4)', borderRadius: '22px',
        padding: '36px 28px', textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 4.5vw, 2.1rem)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '12px' }}>
          Start building the passport tonight
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 22px' }}>
          A couple of minutes to build your child’s pathway, then free access to the platform. No card. The ramp to 16 starts wherever your child is now.
        </p>
        <Link href="/starter-pack" className="btn btn-gold" style={{ display: 'inline-flex', fontSize: '15px', padding: '15px 30px' }}>
          Start, it is free
        </Link>
      </div>
    </div>
  )
}
