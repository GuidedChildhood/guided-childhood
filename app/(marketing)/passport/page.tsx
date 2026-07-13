import Link from 'next/link'
import { STAGES } from '@/lib/content/stages'
import {
  PASSPORT_EVIDENCE,
  PASSPORT_TAGLINE,
  PASSPORT_ANALOGY,
  PHONE_LADDER,
  STAGE_READINESS,
} from '@/lib/content/passport'

export const metadata = {
  title: 'The Social Media Passport · Guided Childhood',
  description:
    'The digital pathway is your child’s social media passport. Gradual, guided exposure from age 4 to 16, built on the evidence, so 16 is a step and not a cliff edge.',
}

const STAGE_RING = ['var(--stage-1)', 'var(--stage-2)', 'var(--stage-3)', 'var(--stage-4)', 'var(--stage-5)']

// One readable type scale for the whole page, big by default and bigger again
// on a phone, so nothing here is a squint. Apple calm: large type, generous
// space, one accent, high contrast.
const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.72rem, 2.4vw, 0.82rem)',
  fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta)',
}
const H2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900,
  fontSize: 'clamp(1.9rem, 5.5vw, 2.6rem)', letterSpacing: '-0.03em', lineHeight: 1.1,
}
const BODY: React.CSSProperties = {
  fontSize: 'clamp(1.08rem, 3vw, 1.25rem)', lineHeight: 1.7, color: 'var(--ink-soft)',
}

export default function PassportPage() {
  return (
    <div style={{ background: '#FFFBEE' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: 'clamp(56px, 9vw, 96px) 24px clamp(64px, 9vw, 104px)' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(56px, 9vw, 88px)' }}>
          <p style={{ ...EYEBROW, marginBottom: '20px' }}>The idea behind the pathway</p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(2.4rem, 8vw, 4rem)', letterSpacing: '-0.04em',
            lineHeight: 1.05, marginBottom: '24px',
          }}>
            {PASSPORT_TAGLINE}
          </h1>
          <p style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', lineHeight: 1.55, color: 'var(--ink-soft)', maxWidth: '640px', margin: '0 auto', fontWeight: 500 }}>
            {PASSPORT_ANALOGY}
          </p>
          <p style={{ fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', lineHeight: 1.6, color: 'var(--ink-muted)', maxWidth: '560px', margin: '20px auto 0' }}>
            Not about banning. About preparation, the skills to navigate the digital world rather than hide from it.
          </p>
        </div>

        {/* Why 16 matters */}
        <div style={{
          background: 'var(--deep-teal)', borderRadius: '28px',
          padding: 'clamp(32px, 6vw, 48px)', marginBottom: 'clamp(56px, 9vw, 88px)', color: '#fff',
        }}>
          <p style={{ ...EYEBROW, marginBottom: '18px' }}>Why 16 matters</p>
          <h2 style={{ ...H2, color: '#fff', marginBottom: '20px' }}>
            A ban is a wall. A wall postpones the problem to 16.
          </h2>
          <p style={{ ...BODY, color: 'rgba(255,255,255,0.9)', marginBottom: '18px' }}>
            As the UK lowers the voting age to 16, a teenager can meet their first vote and their first social media in the same year. Two of the biggest things they will ever do, arriving together, with no run up. That is the cliff edge.
          </p>
          <p style={{ ...BODY, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            The passport builds the ramp instead. Gradual, guided exposure through the school years, so by 16 your child already knows the ground under their feet. Preparing, not postponing.
          </p>
        </div>

        {/* Five stamps */}
        <div style={{ marginBottom: 'clamp(56px, 9vw, 88px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
            <h2 style={{ ...H2, marginBottom: '16px' }}>Five stamps, earned one at a time</h2>
            <p style={{ ...BODY, maxWidth: '560px', margin: '0 auto' }}>
              Each stage is a stamp in the passport. No stage is skipped, and the training turns heavy from about 13, the run up to 16.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {STAGES.map((stage, i) => {
              const r = STAGE_READINESS[stage.id]
              const heavy = r.weight === 'heavy'
              const isFinal = stage.id === 5
              return (
                <div key={stage.id} style={{
                  background: '#fff',
                  border: heavy ? '2.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                  borderRadius: '22px', padding: 'clamp(20px, 4vw, 26px)',
                  display: 'flex', gap: 'clamp(16px, 3vw, 24px)', alignItems: 'center',
                }}>
                  <div style={{
                    flexShrink: 0, width: 'clamp(64px, 14vw, 84px)', height: 'clamp(64px, 14vw, 84px)',
                    borderRadius: '50%', border: `3px dashed ${isFinal ? 'var(--terracotta)' : STAGE_RING[i]}`,
                    background: isFinal ? 'var(--terracotta-lt)' : `color-mix(in srgb, ${STAGE_RING[i]} 45%, white)`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 2rem)', lineHeight: 1, color: isFinal ? 'var(--terracotta-dark)' : 'var(--ink)' }}>
                      {stage.id}
                    </span>
                    {isFinal && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--terracotta-dark)', textTransform: 'uppercase', marginTop: '2px' }}>
                        Ready
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.7rem, 2.6vw, 0.78rem)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                        {stage.name} · {stage.ages}
                      </span>
                      {heavy && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--terracotta)', color: '#fff', padding: '3px 9px', borderRadius: '100px' }}>
                          Heavy training
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 4vw, 1.4rem)', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '6px', lineHeight: 1.2 }}>
                      {r.title}
                    </div>
                    <p style={{ fontSize: 'clamp(1rem, 2.8vw, 1.12rem)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                      {r.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* The phone ladder */}
        <div style={{ marginBottom: 'clamp(56px, 9vw, 88px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
            <p style={{ ...EYEBROW, marginBottom: '14px' }}>The question every parent asks</p>
            <h2 style={{ ...H2, marginBottom: '16px' }}>What phone, at what age</h2>
            <p style={{ ...BODY, maxWidth: '560px', margin: '0 auto' }}>
              A staircase, not a yes or no. A feature phone buys independence without handing over the algorithm, so the feed waits until your child is ready for it.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PHONE_LADDER.map((rung, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
                padding: 'clamp(20px, 4vw, 26px)', display: 'flex', gap: 'clamp(16px, 3vw, 24px)', alignItems: 'flex-start',
              }}>
                <div style={{ flexShrink: 0, width: 'clamp(80px, 20vw, 116px)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.72rem, 2.6vw, 0.82rem)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--terracotta)', textTransform: 'uppercase', lineHeight: 1.3 }}>
                    {rung.ages}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.1rem, 3.6vw, 1.3rem)', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '6px', lineHeight: 1.25 }}>
                    {rung.device}
                  </div>
                  <p style={{ fontSize: 'clamp(1rem, 2.8vw, 1.12rem)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                    {rung.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The evidence */}
        <div style={{ marginBottom: 'clamp(56px, 9vw, 88px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
            <h2 style={{ ...H2, marginBottom: '16px' }}>What the evidence says</h2>
            <p style={{ ...BODY, maxWidth: '560px', margin: '0 auto' }}>
              The passport is not a hunch. It is the nuanced reading of the research, harms and benefits both taken seriously.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {PASSPORT_EVIDENCE.map((e, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid var(--border)',
                borderRadius: '22px', padding: 'clamp(24px, 5vw, 32px)',
                borderLeft: '5px solid var(--terracotta)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.2rem, 4vw, 1.45rem)', color: 'var(--ink)', marginBottom: '12px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  {e.headline}
                </h3>
                <p style={{ fontSize: 'clamp(1.02rem, 2.8vw, 1.15rem)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '14px' }}>
                  {e.detail}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)', letterSpacing: '0.03em', color: 'var(--ink-muted)', margin: 0 }}>
                  {e.source}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'var(--stage-4)', borderRadius: '28px',
          padding: 'clamp(40px, 7vw, 56px) clamp(28px, 5vw, 40px)', textAlign: 'center',
        }}>
          <h2 style={{ ...H2, marginBottom: '16px' }}>Start building the passport tonight</h2>
          <p style={{ ...BODY, color: 'var(--ink)', maxWidth: '480px', margin: '0 auto 28px' }}>
            A couple of minutes to build your child’s pathway, then free access to the platform. No card. The ramp to 16 starts wherever your child is now.
          </p>
          <Link href="/starter-pack" className="btn btn-gold" style={{ display: 'inline-flex', fontSize: 'clamp(1rem, 3vw, 1.15rem)', padding: '17px 36px' }}>
            Start, it is free
          </Link>
        </div>
      </div>
    </div>
  )
}
