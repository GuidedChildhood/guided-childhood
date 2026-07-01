import Link from 'next/link'
import { STAGES } from '@/lib/content/stages'

export const metadata = {
  title: 'The Full Pathway · Ages 4 to 16 | Guided Childhood',
  description: 'Five stages. Twenty units. Ten minutes each. The complete digital parenting programme from first screens to genuine independence.',
}

const STAGE_PALETTE = [
  { bg: 'var(--stage-1)', border: 'var(--stage-1)', deep: 'var(--terracotta)', light: 'var(--terracotta-lt)', tag: 'var(--terracotta)' },
  { bg: 'var(--stage-2)', border: 'var(--stage-2)', deep: 'var(--terracotta)', light: 'var(--terracotta-lt)', tag: 'var(--terracotta)' },
  { bg: 'var(--stage-3)', border: 'var(--stage-3)', deep: 'var(--terracotta)', light: 'var(--terracotta-lt)', tag: 'var(--terracotta)' },
  { bg: 'var(--stage-4)', border: 'var(--stage-4)', deep: 'var(--terracotta)', light: 'var(--terracotta-lt)', tag: 'var(--terracotta)' },
  { bg: 'var(--stage-5)', border: 'var(--stage-5)', deep: 'var(--terracotta)', light: 'var(--terracotta-lt)', tag: 'var(--terracotta)' },
] as const

const UNITS: Record<number, { title: string; preview: string; locked: boolean }[]> = {
  1: [
    { title: 'First device rules', preview: 'The timer is the rule, not you. How to set the structure before habits form.', locked: false },
    { title: 'What screens do to young brains', preview: '', locked: true },
    { title: 'Building the family agreement', preview: '', locked: true },
    { title: 'When something feels wrong', preview: '', locked: true },
  ],
  2: [
    { title: 'The bedroom rule', preview: 'One conversation. One rule. The highest-impact change in the whole system.', locked: false },
    { title: 'YouTube and how it learns', preview: '', locked: true },
    { title: 'First online friendships', preview: '', locked: true },
    { title: 'Gaming: what it is actually doing', preview: '', locked: true },
  ],
  3: [
    { title: 'The algorithm conversation', preview: 'Before social media. The talk that changes everything. Word for word.', locked: false },
    { title: 'Social media readiness', preview: '', locked: true },
    { title: 'Identity, comparison, and the feed', preview: '', locked: true },
    { title: 'When something goes wrong online', preview: '', locked: true },
  ],
  4: [
    { title: 'Keeping the door open', preview: 'The script that means they call you first, not last. Works before anything happens.', locked: false },
    { title: 'Digital footprint and identity', preview: '', locked: true },
    { title: 'Group chats and invisible pressure', preview: '', locked: true },
    { title: 'The ban and what comes next', preview: '', locked: true },
  ],
  5: [
    { title: 'Handing over the wheel', preview: 'How to step back without stepping away. The conversation that completes the pathway.', locked: false },
    { title: 'AI literacy and what it changes', preview: '', locked: true },
    { title: 'Career, presence, and footprint', preview: '', locked: true },
    { title: 'Digital independence audit', preview: '', locked: true },
  ],
}

const KS_LABELS: Record<number, string> = {
  1: 'Aligns with KS1',
  2: 'Aligns with KS2',
  3: 'Aligns with KS3',
  4: 'Aligns with KS3 to KS4',
  5: 'Aligns with KS4 to KS5',
}

export default function PathwayPage() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── Nav ─────────────────────────────────────── */}
      <header style={{
        padding: '0 24px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(247,243,238,.97)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--terracotta)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 0 rgba(0,0,0,.18)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '13px' }}>
                {[3, 7, 11, 6].map((h, i) => (
                  <div key={i} style={{ width: '2.5px', height: `${h}px`, background: '#fff', borderRadius: '1.5px' }} />
                ))}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.95rem', color: 'var(--ink)' }}>Guided Childhood</span>
          </Link>
          <Link href="/join" className="btn btn-gold" style={{ fontSize: '12px', padding: '10px 20px' }}>
            Join as Founder →
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ padding: 'clamp(48px, 7vw, 80px) 24px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>The complete programme</p>
        <h1 style={{ marginBottom: '20px', letterSpacing: '-.04em', lineHeight: 1.05 }}>
          Ages 4 to 16.<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>Always a next step.</em>
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.85, maxWidth: '580px', marginBottom: '28px' }}>
          Five stages. Twenty units. Ten minutes each. Every conversation your child needs, at exactly the right moment. From first screens at four to genuine independence at sixteen.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid var(--border)', background: '#fff', marginBottom: '8px' }}>
          {[
            { n: '5', label: 'Stages' },
            { n: '20', label: 'Units' },
            { n: '10', label: 'Minutes each' },
            { n: '12', label: 'Years covered' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1,
              minWidth: '80px',
              padding: '18px 12px',
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--ink)', lineHeight: 1, letterSpacing: '-.03em' }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', color: 'var(--ink-muted)', marginTop: '4px', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pathway ──────────────────────────────────── */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

        {STAGES.map((stage, si) => {
          const col = STAGE_PALETTE[si]
          const units = UNITS[stage.id]

          return (
            <div key={stage.id} style={{ position: 'relative', marginBottom: '8px' }}>

              {/* Connecting line (not on last) */}
              {si < STAGES.length - 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '-28px',
                  left: '32px',
                  width: '2px',
                  height: '28px',
                  background: `linear-gradient(${col.deep}, ${STAGE_PALETTE[si + 1].deep})`,
                  opacity: .35,
                  zIndex: 1,
                }} />
              )}

              <article style={{
                background: '#fff',
                border: `1.5px solid ${col.border}`,
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,.05)',
              }}>

                {/* Stage header */}
                <div style={{ background: col.bg, borderBottom: `1px solid ${col.border}`, padding: '22px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '.58rem',
                          fontWeight: 700,
                          letterSpacing: '.14em',
                          textTransform: 'uppercase',
                          color: col.deep,
                          background: '#fff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: `1px solid ${col.border}`,
                        }}>
                          Stage {stage.id} · {stage.ages}
                        </span>
                        {stage.isCritical && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff', background: 'var(--terracotta)', padding: '4px 10px', borderRadius: '8px' }}>
                            Critical window
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: col.tag, opacity: .75 }}>
                          {KS_LABELS[stage.id]}
                        </span>
                      </div>
                      <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '6px', letterSpacing: '-.03em' }}>
                        {stage.name}
                      </h2>
                      <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '500px' }}>
                        {stage.focus}
                      </p>
                    </div>
                    <div style={{
                      background: '#fff',
                      border: `1px solid ${col.border}`,
                      borderRadius: '12px',
                      padding: '10px 14px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: col.deep, lineHeight: 1 }}>4</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.54rem', color: 'var(--ink-muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: '3px' }}>units</div>
                    </div>
                  </div>

                  {/* Device note */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${col.border}` }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: col.deep, flexShrink: 0 }}>Device now</span>
                    <span style={{ fontSize: '.82rem', color: 'var(--ink-soft)', fontWeight: 500 }}>{stage.device}</span>
                  </div>
                </div>

                {/* Units */}
                <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>
                    Programme units · 10 minutes each
                  </div>

                  {units.map((unit, ui) => (
                    <div
                      key={ui}
                      style={{
                        background: unit.locked ? 'var(--cream)' : col.bg,
                        border: `1px solid ${unit.locked ? 'var(--border)' : col.border}`,
                        borderRadius: '14px',
                        padding: '14px 18px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        opacity: unit.locked ? .65 : 1,
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '8px',
                        background: unit.locked ? 'var(--border)' : col.deep,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}>
                        {unit.locked ? (
                          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                            <rect x="1" y="5" width="8" height="7" rx="1.5" fill="#9B958A"/>
                            <path d="M3 5V3.5a2 2 0 014 0V5" stroke="#9B958A" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, color: '#fff' }}>{ui + 1}</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '.9rem', color: unit.locked ? 'var(--ink-muted)' : 'var(--ink)', marginBottom: unit.preview ? '4px' : 0, lineHeight: 1.3 }}>
                          {unit.locked ? (
                            <span style={{ filter: 'blur(3.5px)', userSelect: 'none', pointerEvents: 'none' }}>{unit.title}</span>
                          ) : unit.title}
                        </div>
                        {!unit.locked && unit.preview && (
                          <p style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{unit.preview}</p>
                        )}
                        {unit.locked && (
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.58rem', color: 'var(--ink-muted)', margin: 0, letterSpacing: '.04em' }}>Unlocks with membership</p>
                        )}
                      </div>
                      {!unit.locked && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, color: col.deep, background: '#fff', border: `1px solid ${col.border}`, borderRadius: '8px', padding: '3px 8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          10 min
                        </div>
                      )}
                    </div>
                  ))}

                </div>

                {/* Stage script preview */}
                <div style={{ padding: '0 28px 24px' }}>
                  <div style={{
                    background: col.bg,
                    border: `1px solid ${col.border}`,
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.56rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: col.deep, marginBottom: '6px' }}>
                        Stage script
                      </div>
                      <p style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{stage.script.title}</p>
                      <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.55, margin: 0, filter: 'blur(2.5px)', userSelect: 'none' }}>
                        "{stage.script.sayThis}"
                      </p>
                    </div>
                    <Link href="/scripts" style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '.6rem',
                      fontWeight: 700,
                      letterSpacing: '.06em',
                      color: col.deep,
                      background: '#fff',
                      border: `1px solid ${col.border}`,
                      borderRadius: '10px',
                      padding: '8px 12px',
                      textDecoration: 'none',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}>
                      Read →
                    </Link>
                  </div>
                </div>

              </article>
            </div>
          )
        })}

        {/* ── End of pathway ──────────────────────────── */}
        <div style={{
          textAlign: 'center',
          padding: '40px 24px',
          marginBottom: '8px',
        }}>
          <div style={{ width: '2px', height: '40px', background: 'linear-gradient(var(--terracotta), transparent)', margin: '0 auto 20px' }} />
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--stage-2)',
            border: '1.5px solid var(--stage-2)',
            borderRadius: '100px',
            padding: '12px 24px',
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--terracotta)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
              They reach 16 ready
            </span>
          </div>
          <p style={{ marginTop: '16px', fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '420px', margin: '16px auto 0' }}>
            The ban comes in Spring 2027. Your child reaches 16 knowing how algorithms work, what their digital footprint says about them, and how to get help when something goes wrong online.
          </p>
        </div>

      </div>

      {/* ── Founder CTA ──────────────────────────────── */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'var(--deep-teal)',
          borderRadius: '20px',
          padding: 'clamp(32px, 5vw, 48px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(242,201,76,.07)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '560px' }}>
            <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '12px' }}>Founder rate · First 50 members</p>
            <h2 style={{ color: '#fff', marginBottom: '14px', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', letterSpacing: '-.03em' }}>
              Unlock all 20 units.<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>£7.99 a month. For life.</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.95rem', lineHeight: 1.82, marginBottom: '24px' }}>
              Every stage. Every unit. Every script. DiGi when you need it. The full pathway from wherever your child is now to genuine independence at 16. Locked in before the price goes up.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['All 20 units', '100 plus expert scripts', 'DiGi AI advisor', 'Wellbeing tracker', 'Family agreement builder'].map((f, i) => (
                <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', fontWeight: 600, letterSpacing: '.04em', color: 'rgba(255,255,255,.8)', background: 'rgba(255,255,255,.08)', padding: '5px 11px', borderRadius: '8px' }}>
                  {f}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/join" className="btn btn-gold" style={{ fontSize: '14px', padding: '16px 32px' }}>
                Join as a Founder →
              </Link>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.04em' }}>
                30 day money back. Cancel any time.
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
