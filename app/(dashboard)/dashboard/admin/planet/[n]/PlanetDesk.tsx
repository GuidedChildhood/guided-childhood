'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { State } from '@/publishing/engine/workflow'

// The newspaper desk's buttons. Every one posts to /api/admin/planet, which
// hands the decision to the workflow; a refusal comes back in plain words and
// is shown as it is, never swallowed.

type Story = {
  id: string
  total: number | null
  decision: string | null
  note: string | null
  record: { headline: string; category: string; summary: string; limitations: string; verification: string; recommendation: string; source: { org: string; url: string; evidence: string; published?: string }; numericalClaims?: { claim: string; verified: boolean }[]; page?: number }
}

export type DeskData = {
  issue: number
  state: State
  storiesHash: string | null
  contentHash: string | null
  pdfHash: string | null
  stories: Story[]
  sources: { id: string; org: string; title: string; url: string; verification: string; supports: string; note?: string }[]
  report: { ok: boolean; editorial: { level: string; rule: string; detail: string; page?: number }[]; layout: Record<string, { level: string; rule: string; detail: string; page: number }[]> } | null
  previews: (string | null)[]
  pdf: string | null
  sourcesPdf: string | null
  generations: { id: string; slot: string; recipe: string; tier: string; model: string; status: string; credits: number | null; url: string | null; reason: string | null }[]
  budget: { credits: number; approved_by: string; at: string } | null
  releases: { channel: string; status: string; at: string; external: string | null }[]
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}
const CARD: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: '16px 16px 18px',
}
const H2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '30px 0 10px', color: 'var(--ink)' }
const BIG: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', background: 'var(--terracotta)',
  border: 'var(--edge)', borderRadius: 16, boxShadow: '0 5px 0 var(--terracotta-dark)', padding: '12px 18px', cursor: 'pointer', minHeight: 48,
}
const QUIET: React.CSSProperties = { ...BIG, background: '#fff', boxShadow: '0 5px 0 var(--border)' }
const SMALL: React.CSSProperties = { ...QUIET, fontSize: 'var(--text-sm)', padding: '8px 12px', minHeight: 40, boxShadow: '0 3px 0 var(--border)' }

const CHANNELS = [
  ['website', 'The website page and downloads'],
  ['mailchimp', 'A draft email campaign'],
  ['drive', 'The package in Google Drive'],
  ['linkedin', 'LinkedIn (you post it)'],
  ['instagram', 'Instagram (you post it)'],
  ['facebook', 'Facebook (you post it)'],
  ['schools', 'The schools email (you send it)'],
] as const

export default function PlanetDesk({ data }: { data: DeskData }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [channels, setChannels] = useState<string[]>(['website', 'drive'])
  const [credits, setCredits] = useState(String(data.budget?.credits ?? ''))

  async function act(action: string, extra: Record<string, unknown> = {}) {
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/planet', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ issue: data.issue, action, note: note || undefined, ...extra }) })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) setMsg(body.error ?? `That did not work (${res.status})`)
      else { setNote(''); router.refresh() }
    } catch {
      setMsg('Could not reach the server. Nothing was changed.')
    } finally { setBusy(false) }
  }

  const errors = data.report ? [...data.report.editorial, ...Object.values(data.report.layout).flat()].filter(f => f.level === 'error') : []
  const warns = data.report ? [...data.report.editorial, ...Object.values(data.report.layout).flat()].filter(f => f.level === 'warn') : []
  const approvedCount = data.stories.filter(s => s.decision === 'approved').length

  return (
    <div>
      {msg && <p role="alert" style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>{msg}</p>}

      {/* ── APPROVAL ONE ───────────────────────────────────────────── */}
      <h2 style={H2}>The stories</h2>
      {!data.stories.length && <p style={{ color: 'var(--ink-soft)' }}>No candidates yet. The routine researches them in week one.</p>}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
        {data.stories.map(s => {
          const r = s.record
          return (
            <li key={s.id} style={{ ...CARD, borderColor: s.decision === 'approved' ? 'var(--retro-green)' : s.decision === 'rejected' ? 'var(--danger-border)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={MONO}>{r.category} · {s.total ?? '?'}/100 · {r.verification}{r.page ? ` · page ${r.page}` : ''}</span>
                <span style={{ ...MONO, color: 'var(--ink)' }}>{s.decision ?? 'not decided'}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', margin: '6px 0' }}>{r.headline}</h3>
              <p style={{ margin: '0 0 6px', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{r.summary}</p>
              <p style={{ margin: '0 0 6px', fontSize: 'var(--text-sm)', lineHeight: 1.5, color: 'var(--ink-soft)' }}><b>Limits:</b> {r.limitations}</p>
              <a href={r.source.url} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', fontWeight: 700 }}>{r.source.org}, {r.source.evidence}{r.source.published ? `, ${r.source.published}` : ''} ↗</a>
              {data.state === 'EDITORIAL_REVIEW' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <button disabled={busy} style={SMALL} onClick={() => act('decide-story', { storyId: s.id, decision: 'approved' })}>Approve</button>
                  <button disabled={busy} style={SMALL} onClick={() => act('decide-story', { storyId: s.id, decision: 'rejected' })}>Reject</button>
                  <button disabled={busy} style={SMALL} onClick={() => act('decide-story', { storyId: s.id, decision: 'revise' })}>Needs a revision</button>
                </div>
              )}
              {s.note && <p style={{ margin: '8px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>Your note: {s.note}</p>}
            </li>
          )
        })}
      </ul>

      {data.state === 'EDITORIAL_REVIEW' && (
        <div style={{ ...CARD, marginTop: 14, background: 'var(--tint-butter)' }}>
          <label htmlFor="note" style={MONO}>A note for the desk (optional)</label>
          <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={2} style={{ width: '100%', marginTop: 6, borderRadius: 12, border: 'var(--edge)', padding: 10, fontSize: 'var(--text-md)' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <button disabled={busy || approvedCount < 3} style={BIG} onClick={() => act('approve-stories', { reviewedHash: data.storiesHash })}>Approve these {approvedCount} stories</button>
            <button disabled={busy} style={QUIET} onClick={() => act('request-changes')}>Request changes</button>
          </div>
        </div>
      )}

      {/* ── THE PROOF ──────────────────────────────────────────────── */}
      <h2 style={H2}>The paper</h2>
      {data.report && (
        <p style={{ fontSize: 'var(--text-sm)', color: errors.length ? 'var(--danger)' : 'var(--ink-soft)', fontWeight: 700 }}>
          {errors.length ? `${errors.length} problems block this proof.` : 'Every check passed: twelve pages, nothing clipped, fonts embedded, contrast and print resolution clear.'}
          {warns.length ? ` ${warns.length} things worth a look.` : ''}
        </p>
      )}
      {errors.length > 0 && <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)' }}>{errors.slice(0, 12).map((e, i) => <li key={i}>Page {e.page ?? '?'}: {e.detail}</li>)}</ul>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {data.previews.map((src, i) => src ? (
          <a key={i} href={src} target="_blank" rel="noreferrer" style={{ display: 'block', border: 'var(--edge)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Page ${i + 1}`} style={{ width: '100%', display: 'block' }} />
          </a>
        ) : <div key={i} style={{ aspectRatio: '210 / 297', border: '1px dashed var(--border)', borderRadius: 10, display: 'grid', placeItems: 'center', ...MONO }}>Page {i + 1}</div>)}
      </div>
      <p style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
        {data.pdf && <a href={data.pdf} target="_blank" rel="noreferrer" style={{ fontWeight: 800, color: 'var(--ink)' }}>Open the PDF ↗</a>}
        {data.sourcesPdf && <a href={data.sourcesPdf} target="_blank" rel="noreferrer" style={{ fontWeight: 800, color: 'var(--ink)' }}>Every source, in full ↗</a>}
      </p>

      {data.state === 'PROOF_READY' && (
        <div style={{ ...CARD, marginTop: 14, background: 'var(--tint-butter)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Before you approve: scan both QR codes on page 12 with your phone, and open any source on a page where a number matters to you.</p>
          <label htmlFor="note2" style={MONO}>What needs changing (if anything)</label>
          <textarea id="note2" value={note} onChange={e => setNote(e.target.value)} rows={2} style={{ width: '100%', marginTop: 6, borderRadius: 12, border: 'var(--edge)', padding: 10, fontSize: 'var(--text-md)' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <button disabled={busy || errors.length > 0} style={BIG} onClick={() => act('approve-final', { contentHash: data.contentHash, pdfHash: data.pdfHash })}>Approve the paper</button>
            <button disabled={busy} style={QUIET} onClick={() => act('request-changes')}>Request revisions</button>
          </div>
        </div>
      )}

      {(data.state === 'FINAL_APPROVED' || data.state === 'PUBLISHED') && (
        <div style={{ ...CARD, marginTop: 14 }}>
          <p style={{ ...MONO, margin: '0 0 8px' }}>Authorise publication</p>
          <p style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', lineHeight: 1.5, color: 'var(--ink-soft)' }}>The routine carries out what you tick, using only the PDF you approved. Social posts are prepared for you to post yourself.</p>
          {CHANNELS.map(([c, label]) => {
            const done = data.releases.find(r => r.channel === c)
            return (
              <label key={c} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', fontSize: 'var(--text-md)' }}>
                <input type="checkbox" checked={channels.includes(c)} disabled={!!done} onChange={e => setChannels(e.target.checked ? [...channels, c] : channels.filter(x => x !== c))} style={{ width: 22, height: 22 }} />
                {label}{done ? ` · ${done.status} ${new Date(done.at).toLocaleDateString('en-GB')}` : ''}
              </label>
            )
          })}
          <button disabled={busy || !channels.length} style={{ ...BIG, marginTop: 10 }} onClick={() => act('authorise', { channels })}>Authorise</button>
        </div>
      )}

      {/* ── THE ART ────────────────────────────────────────────────── */}
      <h2 style={H2}>The art</h2>
      <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5, color: 'var(--ink-soft)', margin: '0 0 10px' }}>
        Every page already has its own drawings. Higgsfield can paint richer backgrounds; characters are never generated, they are always the approved Planet Friends.
        Nothing is generated without a budget here.
      </p>
      <div style={{ ...CARD, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label htmlFor="credits" style={MONO}>Credit budget for this issue</label>
        <input id="credits" inputMode="numeric" value={credits} onChange={e => setCredits(e.target.value)} style={{ width: 100, borderRadius: 12, border: 'var(--edge)', padding: '8px 10px', fontSize: 'var(--text-md)' }} />
        <button disabled={busy} style={SMALL} onClick={() => act('budget', { credits: Number(credits) })}>Set budget</button>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
          {data.budget ? `Set at ${data.budget.credits}.` : 'None set.'} Spent: {data.generations.reduce((s, g) => s + (g.credits ?? 0), 0)} credits.
        </span>
      </div>
      {data.generations.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginTop: 10 }}>
          {data.generations.map(g => (
            <div key={g.id} style={CARD}>
              {g.url && (/* eslint-disable-next-line @next/next/no-img-element */ <img src={g.url} alt={`${g.slot}, ${g.tier}`} style={{ width: '100%', borderRadius: 10 }} />)}
              <p style={{ ...MONO, margin: '8px 0 4px' }}>{g.slot} · {g.tier} · {g.status}{g.credits != null ? ` · ${g.credits} cr` : ''}</p>
              {g.status === 'completed' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button disabled={busy} style={SMALL} onClick={() => act('art-decision', { generationId: g.id, decision: 'approved' })}>Use it</button>
                  <button disabled={busy} style={SMALL} onClick={() => act('art-decision', { generationId: g.id, decision: 'rejected' })}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── SOURCES ────────────────────────────────────────────────── */}
      <h2 style={H2}>Every source</h2>
      <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
        {data.sources.map(s => (
          <li key={s.id} style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
            <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--ink)', fontWeight: 800 }}>{s.org}, {s.title} ↗</a>
            <span style={{ color: 'var(--ink-soft)' }}> · {s.verification}. {s.supports}{s.note ? ` ${s.note}` : ''}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
