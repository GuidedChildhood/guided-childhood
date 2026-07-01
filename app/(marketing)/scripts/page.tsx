import Link from 'next/link'
import { STAGES } from '@/lib/content/stages'
import PrintButton from './PrintButton'

export const metadata = {
  title: 'Conversation Scripts | Guided Childhood',
  description: 'Word-for-word scripts for every stage of digital parenting. Screen time, bedroom rules, the algorithm conversation, online safety. Five stages, ages 4 to 16.',
}

const STAGE_COLORS = [
  { bg: 'var(--stage-1)', border: 'var(--stage-1)', deep: 'var(--terracotta)', wash: 'var(--terracotta-lt)' },
  { bg: 'var(--stage-2)', border: 'var(--stage-2)', deep: 'var(--terracotta)', wash: 'var(--terracotta-lt)' },
  { bg: 'var(--stage-3)', border: 'var(--stage-3)', deep: 'var(--terracotta)', wash: 'var(--terracotta-lt)' },
  { bg: 'var(--stage-4)', border: 'var(--stage-4)', deep: 'var(--terracotta)', wash: 'var(--terracotta-lt)' },
  { bg: 'var(--stage-5)', border: 'var(--stage-5)', deep: 'var(--terracotta)', wash: 'var(--terracotta-lt)' },
]

export default function ScriptsPage() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── Nav ──────────────────────────────────────── */}
      <header className="scripts-nav no-print" style={{
        padding: '0 24px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(247,243,238,.97)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <PrintButton />
            <Link href="/join" className="btn btn-gold" style={{ fontSize: '12px', padding: '10px 20px' }}>
              Join →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ padding: 'clamp(40px, 6vw, 72px) 24px 32px', maxWidth: '760px', margin: '0 auto' }}>
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>Five stages · Ages 4 to 16</p>
        <h1 style={{ marginBottom: '16px', letterSpacing: '-.04em' }}>
          The conversations<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>that change everything.</em>
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '12px' }}>
          One script per stage. Read it through in 10 minutes. Say it tonight.
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--ink-muted)', letterSpacing: '.06em' }}>
          The full library has 17 scripts. Available to members.
        </p>
      </section>

      {/* ── Script Cards ─────────────────────────────── */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {STAGES.map((stage, i) => {
          const col = STAGE_COLORS[i]
          return (
            <article
              key={stage.id}
              className="script-card"
              style={{
                background: '#fff',
                border: `1.5px solid ${col.border}`,
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,.05)',
              }}
            >
              {/* Card header */}
              <div style={{
                background: col.bg,
                borderBottom: `1px solid ${col.border}`,
                padding: '20px 28px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
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
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '.56rem',
                          fontWeight: 700,
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          color: '#fff',
                          background: 'var(--terracotta)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                        }}>
                          Critical window
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.55rem)', letterSpacing: '-.03em', marginBottom: '4px', color: 'var(--ink)' }}>
                      {stage.script.title}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem', color: col.deep, fontWeight: 600, letterSpacing: '.04em' }}>
                      {stage.name} · {stage.keyStage} · {stage.yearGroup}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Say this */}
                <div style={{
                  background: col.bg,
                  border: `1.5px solid ${col.border}`,
                  borderRadius: '14px',
                  padding: '20px 22px',
                  position: 'relative',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '.57rem',
                    fontWeight: 700,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: col.deep,
                    marginBottom: '12px',
                  }}>
                    Say this
                  </div>
                  <p style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                  }}>
                    "{stage.script.sayThis}"
                  </p>
                </div>

                {/* Not this */}
                <div style={{
                  background: 'var(--stage-1)',
                  border: '1px solid var(--stage-1)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '.57rem',
                    fontWeight: 700,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: 'var(--terracotta)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}>
                    Not this
                  </div>
                  <p style={{ fontSize: '.92rem', fontStyle: 'italic', color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}>
                    "{stage.script.notThis}"
                  </p>
                </div>

                {/* Why it works */}
                <div style={{
                  background: 'var(--stage-5)',
                  border: '1px solid var(--stage-5)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '.57rem',
                    fontWeight: 700,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: 'var(--terracotta)',
                    marginBottom: '8px',
                  }}>
                    Why it works
                  </div>
                  <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.75, margin: 0 }}>
                    {stage.script.why}
                  </p>
                </div>

                {/* Tonight's action */}
                <div style={{
                  background: 'var(--stage-2)',
                  border: '1px solid var(--stage-2)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '.57rem',
                    fontWeight: 700,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: 'var(--terracotta)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}>
                    Tonight
                  </div>
                  <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0 }}>
                    {stage.action}
                  </p>
                </div>

              </div>
            </article>
          )
        })}
      </div>

      {/* ── Upsell ───────────────────────────────────── */}
      <section className="no-print" style={{ maxWidth: '760px', margin: '40px auto 0', padding: '0 24px 80px' }}>
        <div style={{
          background: 'var(--deep-teal)',
          borderRadius: '20px',
          padding: 'clamp(28px, 5vw, 40px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(231,236,248,.06)', pointerEvents: 'none' }} />
          <p className="eyebrow" style={{ color: 'rgba(175,220,162,.8)', marginBottom: '12px' }}>Full library</p>
          <h2 style={{ color: '#fff', marginBottom: '12px', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            17 scripts. Every hard moment.
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.95rem', lineHeight: 1.8, marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
            Screen time endings, mood after phones, the social media ask, the bedroom rule fight, online safety, gaming, and everything in between. All staged by age.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '13px' }}>
              Find my child's stage →
            </Link>
            <Link href="/join" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '.06em',
              color: 'rgba(255,255,255,.6)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 20px',
            }}>
              See membership →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Print styles ─────────────────────────────── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .script-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #ddd !important; margin-bottom: 24px; }
          section:first-of-type { padding-top: 20px !important; }
          @page { margin: 20mm; }
        }
      `}</style>

    </div>
  )
}
