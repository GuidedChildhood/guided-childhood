'use client'

import { useEffect, useState } from 'react'

// Is DiGi's machinery running, on the board Justin already reads.
//
// Justin: "show me how to check the embedding api, and that DiGi running checks
// are added to the insight dashboard we have."
//
// The reason this exists rather than a SQL snippet: semantic retrieval fails
// SILENTLY. No key, or an unembedded bank, and everything falls back to keyword
// matching while looking completely normal. The same is true of every scheduled
// job here. A thing that can be switched off without looking broken has to be
// visible somewhere a person actually goes, or it will sit off for months.
//
// So the rule for this panel: it says the uncomfortable thing first and in
// plain words. No green ticks that mean "probably".

type Checks = {
  knowledge: { configured: boolean; total: number; embedded: number }
  memory: { total: number; embedded: number }
  answerReview: { period: string; summary: string; suggestions: { observation: string; change: string; target: string }[]; model: string | null } | null
  followupsPending: number
  safety30d: { total: number; serious: number }
  jobs: { label: string; lastRun: string | null; ok: boolean | null; overdue: boolean }[]
}

const card: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '20px 22px', marginBottom: 22, boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
}

function when(iso: string | null): string {
  if (!iso) return 'never'
  const hours = (Date.now() - new Date(iso).getTime()) / 3_600_000
  if (hours < 1) return 'just now'
  if (hours < 24) return `${Math.round(hours)}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function DigiChecksPanel() {
  const [checks, setChecks] = useState<Checks | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [embedNote, setEmbedNote] = useState('')

  async function load() {
    try {
      const res = await fetch('/api/admin/digi-checks')
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Could not read the checks.'); return }
      setChecks(json)
    } catch { setError('Could not reach the checks.') }
  }

  useEffect(() => { load() }, [])

  async function embedBank() {
    setBusy(true); setEmbedNote('Embedding...')
    try {
      const res = await fetch('/api/admin/digi-checks', { method: 'POST' })
      const json = await res.json()
      // "0 embedded" is ambiguous: it looks the same whether nothing needed
      // doing or everything failed. Say which.
      setEmbedNote(
        !json.configured
          ? 'EMBEDDING_API_KEY is not set, so nothing was embedded.'
          : json.missing === 0
            ? 'Nothing to do, the whole bank is already searchable.'
            : `${json.embedded} embedded${json.failed ? `, ${json.failed} failed` : ''}.`
      )
      await load()
    } catch { setEmbedNote('That did not run.') }
    finally { setBusy(false) }
  }

  if (error) {
    return <div style={card}><p style={{ margin: 0, color: 'var(--ink-soft)' }}>{error}</p></div>
  }
  if (!checks) {
    return <div style={card}><p style={{ margin: 0, color: 'var(--ink-soft)' }}>Reading DiGi&rsquo;s checks...</p></div>
  }

  const k = checks.knowledge
  const bankGap = k.total - k.embedded
  // Three states, and they are genuinely different problems, so they get
  // genuinely different words rather than one amber warning.
  const bankState = !k.configured ? 'off' : bankGap > 0 ? 'partial' : 'on'

  return (
    <div style={card}>
      <p className="eyebrow" style={{ marginBottom: 12 }}>DiGi checks</p>

      {/* The one that fails silently, so it leads. */}
      <div style={{
        background: bankState === 'on' ? 'var(--stage-2)' : bankState === 'partial' ? '#FFF6E5' : '#FDECEC',
        borderRadius: 14, padding: '14px 16px', marginBottom: 16,
      }}>
        <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
          {bankState === 'on' && 'Meaning search is on'}
          {bankState === 'partial' && `Meaning search is partly on, ${bankGap} findings still unembedded`}
          {bankState === 'off' && 'Meaning search is OFF'}
        </p>
        <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          {bankState === 'on' && `All ${k.total} findings in the research bank are searchable by meaning, so DiGi finds the right one even when a parent never types the obvious word.`}
          {bankState === 'partial' && `${k.embedded} of ${k.total} are searchable by meaning. The rest are reachable by keyword only, which means they are effectively invisible unless a parent happens to use the right word.`}
          {bankState === 'off' && 'EMBEDDING_API_KEY is not set, so nothing is embedded and every question falls back to keyword matching. It works, and it is the thing that fails when a parent describes a worry instead of naming it.'}
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
          <button onClick={embedBank} disabled={busy} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 'var(--text-base)', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Embedding...' : 'Embed the research bank'}
          </button>
          {embedNote && <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>{embedNote}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
        <Stat label="Bank embedded" value={`${k.embedded}/${k.total}`} />
        <Stat label="Memories embedded" value={`${checks.memory.embedded}/${checks.memory.total}`} />
        <Stat label="Follow ups waiting" value={String(checks.followupsPending)} />
        <Stat label="Safety flags, 30d" value={`${checks.safety30d.serious} of ${checks.safety30d.total}`} />
      </div>

      {/* The scheduled jobs. A missing run is the alert, so "never" and
          "overdue" are called out rather than left as an old timestamp
          somebody has to do arithmetic on. */}
      <p className="eyebrow" style={{ margin: '0 0 8px' }}>Scheduled jobs</p>
      <div style={{ background: 'var(--cream)', borderRadius: 14, padding: '4px 14px', marginBottom: 18 }}>
        {checks.jobs.map((j, i) => (
          <div
            key={j.label}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, padding: '11px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--border)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              {/* A fixed width marker so every label starts on the same x.
                  Ragged first letters are most of why a list like this reads
                  as noise rather than a table. */}
              <span aria-hidden style={{
                width: 18, textAlign: 'center', flexShrink: 0, fontWeight: 800,
                color: j.ok === false ? 'var(--danger)' : j.overdue ? '#A37A2A' : 'var(--retro-green)',
              }}>
                {j.ok === false ? '⚠' : j.overdue ? '·' : '✓'}
              </span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {j.label}
              </span>
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, flexShrink: 0,
              color: j.ok === false ? 'var(--danger)' : j.overdue ? '#A37A2A' : 'var(--ink-muted)',
            }}>
              {j.ok === false ? 'failed' : j.lastRun === null ? 'not yet run' : j.overdue ? `overdue, ${when(j.lastRun)}` : when(j.lastRun)}
            </span>
          </div>
        ))}
      </div>

      {/* The monthly critique of how DiGi answers. Proposals only. */}
      {checks.answerReview ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '13px 15px' }}>
          <p className="eyebrow" style={{ margin: '0 0 6px' }}>
            How DiGi answered, {checks.answerReview.period}
          </p>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 10px' }}>
            {checks.answerReview.summary}
          </p>
          {checks.answerReview.suggestions.map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '0 0 2px', fontWeight: 600 }}>{s.observation}</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.target}</span>
                {' '}{s.change}
              </p>
            </div>
          ))}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', margin: '8px 0 0', lineHeight: 1.5 }}>
            Suggestions only. Nothing here changes how DiGi answers until you make the change yourself.
          </p>
        </div>
      ) : (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          No answer review yet. It runs on the 2nd of each month, reads DiGi&rsquo;s lowest scoring evals, its flagged replies and what parents wrote back, and proposes what to change. Until the first one lands there is nothing here, which is the honest state rather than an empty chart.
        </p>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--cream)', borderRadius: 12, padding: '10px 12px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 2 }}>{label}</div>
    </div>
  )
}
