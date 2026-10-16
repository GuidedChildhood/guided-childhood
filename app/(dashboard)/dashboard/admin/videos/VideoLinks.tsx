'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CHANNEL_LABEL, LINK_CHANNELS, type Channel } from '@/lib/video/link'

export type VideoLinkRow = {
  code: string
  title: string
  active: boolean
  channel: Channel
  url: string
  opened: number
  started: number
  startedWeek: number
  signedUp: number
  cardOn: number
  paying: number
}

export type ChannelRow = {
  channel: Channel
  label: string
  links: number
  startedWeek: number
  started: number
  signedUp: number
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

const FIELD: React.CSSProperties = {
  minWidth: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
  padding: '12px 14px', border: 'var(--edge)', borderRadius: 12, background: 'var(--cream)', color: 'var(--ink)',
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ flex: '1 1 0', minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1 }}>{n}</div>
      <div style={{ ...MONO, marginTop: 6 }}>{label}</div>
    </div>
  )
}

/** What each channel's link is called in the add form's hint. */
const CODE_HINT: Partial<Record<Channel, string>> = {
  linkedin: 'li-1022-the-post-in-a-few-words',
  facebook: 'fb-1021-phone-policy (the Sunday batch prints it)',
  group: 'grp-1022-the-group-name',
}

export default function VideoLinks({ rows, channels, fridayNumber, startedEver, byChannel }: {
  rows: VideoLinkRow[]
  channels: ChannelRow[]
  fridayNumber: number
  startedEver: number
  /** False before migration 379, when every link is still a film. */
  byChannel: boolean
}) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [channel, setChannel] = useState<Channel>('linkedin')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    const res = await fetch('/api/admin/video-links', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(byChannel ? { title, channel, code: code.trim() || undefined } : { title }),
    }).catch(() => null)
    const json = res ? await res.json().catch(() => ({})) : {}
    setBusy(false)
    if (!res?.ok) { setErr(json.error ?? 'Could not save that link just now.'); return }
    setTitle(''); setCode('')
    router.refresh()
  }

  async function toggle(c: string, active: boolean) {
    await fetch('/api/admin/video-links', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c, active }),
    }).catch(() => null)
    router.refresh()
  }

  async function copy(url: string) {
    try { await navigator.clipboard.writeText(url); setCopied(url); setTimeout(() => setCopied(null), 2000) } catch { /* the link is on screen to copy by hand */ }
  }

  return (
    <>
      {/* ── THE FRIDAY NUMBER ────────────────────────────────────────────
          Read every Friday (plans/2026-09-30-control-room.md): how many
          stage checks were begun in the last seven days, and which channel
          sent them. It decides where next week's hour goes. */}
      <section style={{ ...CARD, background: 'var(--terracotta-lt)', boxShadow: '0 5px 0 var(--terracotta-dark)' }} data-friday-number>
        <div style={MONO}>The Friday number</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', margin: '8px 0 4px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.6rem, 9vw, 3.4rem)', color: 'var(--ink)', lineHeight: 1 }}>{fridayNumber}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            stage checks begun in the last seven days
          </span>
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
          {startedEver} begun since counting started.
          {!byChannel && ' Only film links are counted until migration 379 is applied.'}
        </p>
        <div role="table" aria-label="Stage checks by channel" style={{ background: '#fff', border: 'var(--edge)', borderRadius: 14, overflow: 'hidden' }}>
          <div role="row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 44px 44px 56px', gap: 6, padding: '10px 12px', borderBottom: '1.5px solid var(--border)' }}>
            <span role="columnheader" style={MONO}>Channel</span>
            <span role="columnheader" style={{ ...MONO, textAlign: 'right' }}>Week</span>
            <span role="columnheader" style={{ ...MONO, textAlign: 'right' }}>All</span>
            <span role="columnheader" style={{ ...MONO, textAlign: 'right' }}>Joined</span>
          </div>
          {channels.map((c, i) => (
            <div role="row" key={c.channel} data-channel={c.channel} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 44px 44px 56px', gap: 6, padding: '10px 12px', borderTop: i === 0 ? 'none' : '1.5px solid var(--border)', alignItems: 'baseline' }}>
              <span role="cell" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', minWidth: 0, overflowWrap: 'break-word', hyphens: 'none' }}>
                {c.label}
                {c.links > 1 && <span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}> · {c.links} links</span>}
              </span>
              <span role="cell" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', textAlign: 'right' }}>{c.startedWeek}</span>
              <span role="cell" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink-soft)', textAlign: 'right' }}>{c.started}</span>
              <span role="cell" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink-soft)', textAlign: 'right' }}>
                {c.channel === 'direct' || c.channel === 'referral' || c.channel === 'school' ? '' : c.signedUp}
              </span>
            </div>
          ))}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          Week and All are stage checks begun. Joined is families who signed up after
          following a link. No link means typed in, bookmarked or the home page.
        </p>
      </section>

      <form onSubmit={add} style={{ ...CARD, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }} data-video-link-add>
        <label style={{ ...MONO, flexBasis: '100%' }} htmlFor="link-title">Make a link for a post</label>
        <input
          id="link-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="A name you will know it by"
          style={{ ...FIELD, flex: '1 1 220px' }}
        />
        {byChannel && (
          <>
            <select
              aria-label="Where it is posted"
              value={channel}
              onChange={e => setChannel(e.target.value as Channel)}
              style={{ ...FIELD, flex: '1 1 160px' }}
            >
              {LINK_CHANNELS.map(c => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
            </select>
            <input
              aria-label="Exact code, optional"
              value={code}
              onChange={e => setCode(e.target.value.toLowerCase())}
              placeholder={`Exact code, optional: ${CODE_HINT[channel] ?? 'made from the name'}`}
              style={{ ...FIELD, flex: '1 1 100%', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
            />
          </>
        )}
        <button type="submit" disabled={busy || title.trim().length < 2} style={{ ...BUTTON, opacity: busy || title.trim().length < 2 ? 0.6 : 1 }}>
          {busy ? 'Saving' : 'Make the link'}
        </button>
        {err && <p style={{ flexBasis: '100%', margin: 0, color: 'var(--terracotta-dark)', fontSize: 'var(--text-base)' }}>{err}</p>}
      </form>

      {rows.length === 0 ? (
        <div style={CARD}>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 'var(--text-md)', lineHeight: 1.55 }}>
            No links yet. Make one above and put it in the post, the first comment or the caption.
          </p>
        </div>
      ) : rows.map(r => (
        <div key={r.code} style={{ ...CARD, opacity: r.active ? 1 : 0.6 }} data-video-link-row>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', minWidth: 0, overflowWrap: 'anywhere' }}>{r.title}</h2>
            <span style={MONO}>{r.active ? CHANNEL_LABEL[r.channel] : 'Switched off'}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '10px 0 14px', flexWrap: 'wrap' }}>
            <code style={{ flex: '1 1 220px', minWidth: 0, overflowWrap: 'anywhere', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--cream)', border: 'var(--edge)', borderRadius: 10, padding: '8px 10px', color: 'var(--ink)' }}>
              {r.url}
            </code>
            <button type="button" onClick={() => copy(r.url)} style={{ ...BUTTON, background: '#fff', boxShadow: '0 5px 0 var(--ink)', padding: '8px 14px', fontSize: 'var(--text-base)' }}>
              {copied === r.url ? 'Copied' : 'Copy link'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <Stat n={r.opened} label="Followed the link" />
            <Stat n={r.started} label="Began the stage check" />
            <Stat n={r.startedWeek} label="Began this week" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Stat n={r.signedUp} label="Signed up" />
            <Stat n={r.cardOn} label="Card on, still free" />
            <Stat n={r.paying} label="Paying" />
          </div>
          <button type="button" onClick={() => toggle(r.code, !r.active)} style={{ marginTop: 14, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ink-muted)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}>
            {r.active ? 'Switch this link off' : 'Switch this link back on'}
          </button>
        </div>
      ))}
    </>
  )
}
