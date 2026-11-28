'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export type SchoolLinkRow = {
  code: string
  name: string
  active: boolean
  /** The last day of the paid licence, YYYY-MM-DD, or null: no school pass. */
  licensedUntil: string | null
  url: string
  signedUp: number
  cardOn: number
  paying: number
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}

const CARD: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
  boxShadow: 'var(--lift)', padding: '16px 16px 18px', marginBottom: 14,
}

const BUTTON: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
  color: 'var(--ink)', background: 'var(--terracotta)', border: 'var(--edge)',
  borderRadius: 16, boxShadow: '0 5px 0 var(--terracotta-dark)', padding: '12px 18px', cursor: 'pointer',
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ flex: '1 1 0', minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1 }}>{n}</div>
      <div style={{ ...MONO, marginTop: 6 }}>{label}</div>
    </div>
  )
}

export default function SchoolLinks({ rows }: { rows: SchoolLinkRow[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    const res = await fetch('/api/admin/school-links', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }),
    }).catch(() => null)
    const json = res ? await res.json().catch(() => ({})) : {}
    setBusy(false)
    if (!res?.ok) { setErr(json.error ?? 'Could not save that school just now.'); return }
    setName('')
    router.refresh()
  }

  async function toggle(code: string, active: boolean) {
    await fetch('/api/admin/school-links', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, active }),
    }).catch(() => null)
    router.refresh()
  }

  // THE SCHOOL PASS (27 November 2026): the last day of the paid licence.
  async function setPass(code: string, until: string | null) {
    const res = await fetch('/api/admin/school-links', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, licensed_until: until }),
    }).catch(() => null)
    if (!res?.ok) setErr('Could not save the licence date. Has migration 408 run?')
    router.refresh()
  }

  async function copy(url: string) {
    try { await navigator.clipboard.writeText(url); setCopied(url); setTimeout(() => setCopied(null), 2000) } catch { /* the link is on screen to copy by hand */ }
  }

  return (
    <>
      <form onSubmit={add} style={{ ...CARD, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }} data-school-link-add>
        <label style={{ ...MONO, flexBasis: '100%' }} htmlFor="school-name">Add a school</label>
        <input
          id="school-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="The name parents know it by"
          style={{
            flex: '1 1 220px', minWidth: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
            padding: '12px 14px', border: 'var(--edge)', borderRadius: 12, background: 'var(--cream)', color: 'var(--ink)',
          }}
        />
        <button type="submit" disabled={busy || name.trim().length < 2} style={{ ...BUTTON, opacity: busy || name.trim().length < 2 ? 0.6 : 1 }}>
          {busy ? 'Saving' : 'Make the link'}
        </button>
        {err && <p style={{ flexBasis: '100%', margin: 0, color: 'var(--terracotta-dark)', fontSize: 'var(--text-base)' }}>{err}</p>}
      </form>

      {rows.length === 0 ? (
        <div style={CARD}>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 'var(--text-md)', lineHeight: 1.55 }}>
            No schools yet. Add the first pilot school above and send them the link it makes.
          </p>
        </div>
      ) : rows.map(r => (
        <div key={r.code} style={{ ...CARD, opacity: r.active ? 1 : 0.6 }} data-school-link-row>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{r.name}</h2>
            {!r.active && <span style={MONO}>Switched off</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '10px 0 14px', flexWrap: 'wrap' }}>
            <code style={{ flex: '1 1 220px', minWidth: 0, overflowWrap: 'anywhere', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--cream)', border: 'var(--edge)', borderRadius: 10, padding: '8px 10px', color: 'var(--ink)' }}>
              {r.url}
            </code>
            <button type="button" onClick={() => copy(r.url)} style={{ ...BUTTON, background: '#fff', boxShadow: '0 5px 0 var(--ink)', padding: '8px 14px', fontSize: 'var(--text-base)' }}>
              {copied === r.url ? 'Copied' : 'Copy link'}
            </button>
          </div>
          {/* The code a family types on Settings or the upgrade page if they
              signed up without the link (27 November 2026). Put it on the letter. */}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '-6px 0 12px', overflowWrap: 'anywhere' }}>
            Family code for the letter: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)', overflowWrap: 'anywhere' }}>{r.code}</strong>
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Stat n={r.signedUp} label="Signed up" />
            <Stat n={r.cardOn} label="Card on, still free" />
            <Stat n={r.paying} label="Paying" />
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }} data-school-pass>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }} htmlFor={`pass-${r.code}`}>
              {r.licensedUntil ? 'School pass on until' : 'Licence paid? School pass until'}
            </label>
            <input
              id={`pass-${r.code}`}
              type="date"
              defaultValue={r.licensedUntil ?? ''}
              onChange={e => { if (e.target.value) setPass(r.code, e.target.value) }}
              style={{ minHeight: 44, maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', padding: '6px 10px', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', fontSize: 'var(--text-base)' }}
            />
            {r.licensedUntil && (
              <button type="button" onClick={() => setPass(r.code, null)} style={{ minHeight: 44, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}>
                End the pass
              </button>
            )}
          </div>
          <button type="button" onClick={() => toggle(r.code, !r.active)} style={{ marginTop: 14, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}>
            {r.active ? 'Switch this link off' : 'Switch this link back on'}
          </button>
        </div>
      ))}
    </>
  )
}
