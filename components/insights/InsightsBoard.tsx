'use client'

import { useState } from 'react'

// The founder facing view of the daily insight agent. Run it for a window,
// and it themes what parents asked DiGi, shows the gaps against what we have,
// and ranks what to build next. Optionally emails the same to Justin.

type Theme = { label: string; count: number; stages?: string[]; example?: string }
type Gap = { topic: string; whatParentsAsk?: string; coverage?: 'none' | 'partial'; note?: string }
type Rec = { type: string; title: string; why: string; priority: number }
type Report = { summary?: string; themes?: Theme[]; gaps?: Gap[]; recommendations?: Rec[] }
type Payload = { generatedAt: string; days: number; count: number; report: Report }

const TYPE_TINT: Record<string, { bg: string; fg: string }> = {
  script: { bg: 'var(--stage-2)', fg: 'var(--stage-2-text)' },
  lesson: { bg: 'var(--stage-4)', fg: 'var(--stage-4-text)' },
  device_guide: { bg: 'var(--stage-1)', fg: 'var(--stage-1-text)' },
  research: { bg: 'var(--stage-3)', fg: 'var(--stage-3-text)' },
  philosophy: { bg: 'var(--stage-5)', fg: 'var(--stage-5-text)' },
}

export default function InsightsBoard() {
  const [days, setDays] = useState(30)
  const [emailIt, setEmailIt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<Payload | null>(null)

  async function run() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/digi-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, email: emailIt }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Could not run the insight.'); return }
      setData(json)
    } catch {
      setError('Could not reach the insight agent.')
    } finally {
      setLoading(false)
    }
  }

  const recs = (data?.report.recommendations ?? []).slice().sort((a, b) => a.priority - b.priority)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 64px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 8 }}>
        Founder only
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,2.2rem)', letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 8 }}>
        What parents asked DiGi
      </h1>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 16 }}>
        The insight agent reads real DiGi conversations, themes them, and ranks what to build next. Aggregated and de-identified, never a single family.
      </p>

      {/* One tap export of every script, for generating the voice batch. Same
          login as this page, so it just works from here. */}
      <a
        href="/api/admin/scripts-export"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22,
          padding: '9px 14px', borderRadius: 10, textDecoration: 'none',
          background: 'var(--tint-sage)', border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700,
          letterSpacing: '0.04em', color: 'var(--ink)',
        }}
      >
        ⬇ Download all scripts (for the voice batch)
      </a>
      <br />


      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
              background: days === d ? 'var(--ink)' : 'var(--white,#fff)',
              color: days === d ? '#fff' : 'var(--ink-soft)',
              border: '1.5px solid var(--border)',
            }}>{d} days</button>
          ))}
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
          <input type="checkbox" checked={emailIt} onChange={e => setEmailIt(e.target.checked)} />
          Email it to me
        </label>
        <button onClick={run} disabled={loading} className="btn btn-gold" style={{ padding: '10px 20px', fontSize: 13.5, marginLeft: 'auto', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Reading conversations...' : 'Run the insight'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: 14, marginBottom: 16 }}>{error}</p>}

      {data && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)', marginBottom: 16 }}>
            {data.count} questions over {data.days} days
          </div>

          {/* Summary */}
          {data.report.summary && (
            <div style={{ background: 'var(--tint-sage)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', marginBottom: 22 }}>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink)', fontWeight: 500, margin: 0 }}>{data.report.summary}</p>
            </div>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={sectionH}>Build next, in order</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recs.map((r, i) => {
                  const tint = TYPE_TINT[r.type] ?? { bg: 'var(--stage-2)', fg: 'var(--ink)' }
                  return (
                    <div key={i} style={{ background: 'var(--white,#fff)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 14, boxShadow: '0 2px 12px rgba(26,26,46,0.05)' }}>
                      <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>{r.title}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: tint.bg, color: tint.fg, padding: '3px 8px', borderRadius: 100 }}>{r.type.replace('_', ' ')}</span>
                        </div>
                        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{r.why}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Themes */}
          {(data.report.themes ?? []).length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={sectionH}>What keeps coming up</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
                {(data.report.themes ?? []).map((t, i) => (
                  <div key={i} style={{ background: 'var(--white,#fff)', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14.5, color: 'var(--ink)' }}>{t.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--terracotta-dark)' }}>{t.count}</span>
                    </div>
                    {t.stages && t.stages.length > 0 && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-muted)', letterSpacing: '0.04em', marginBottom: 6 }}>{t.stages.join(' · ')}</div>
                    )}
                    {t.example && <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>&ldquo;{t.example}&rdquo;</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gaps */}
          {(data.report.gaps ?? []).length > 0 && (
            <section>
              <h2 style={sectionH}>Gaps in what we offer</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(data.report.gaps ?? []).map((g, i) => (
                  <div key={i} style={{ background: 'var(--white,#fff)', border: '1px solid var(--border)', borderLeft: `3px solid ${g.coverage === 'none' ? 'var(--danger)' : 'var(--terracotta)'}`, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>{g.topic}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: g.coverage === 'none' ? 'var(--danger)' : 'var(--terracotta-dark)' }}>{g.coverage === 'none' ? 'nothing yet' : 'partial'}</span>
                    </div>
                    {g.whatParentsAsk && <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 3px' }}>{g.whatParentsAsk}</p>}
                    {g.note && <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', lineHeight: 1.5, margin: 0 }}>{g.note}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

const sectionH: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem',
  letterSpacing: '-0.01em', color: 'var(--ink)', marginBottom: 12,
}
