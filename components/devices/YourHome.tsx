'use client'
import { useEffect, useState } from 'react'
import {
  DEVICE_SUGGESTIONS, deviceIcon, KIND_LABEL,
  type FamilyDevice,
} from '@/lib/devices/family'

// The screens in this house, by name.
//
// This is the list the passport counts, the list the setup guides are chosen
// from, and the list a timer picks a device out of. Everything about screens in
// the app hangs off it, which is why it is the first thing on the Devices page
// rather than a setting buried somewhere.
//
// Two of the same is the case that matters most and was impossible before: a
// house with two iPads had one row called tablet, so twenty minutes could be
// granted but never to a particular iPad. Adding the same suggestion twice is
// therefore allowed and expected, and renaming is right there on the row.

type Props = { childName?: string | null }

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '18px 18px 20px', marginBottom: 20,
}

export default function YourHome({ childName }: Props) {
  const [devices, setDevices] = useState<FamilyDevice[] | null>(null)
  const [askedAt, setAskedAt] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [showRetired, setShowRetired] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/devices/family')
      const data = await res.json()
      setDevices(Array.isArray(data.devices) ? data.devices : [])
      setAskedAt(data.askedAt ?? null)
    } catch { setDevices([]) }
  }

  async function add(label: string, kind: string, guideKey: string | null) {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/devices/family', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAsked: true, devices: [{ label, kind, guideKey }] }),
      })
      await load()
    } finally { setBusy(false) }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/devices/family', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      })
      await load()
    } finally { setBusy(false) }
  }

  if (devices === null) {
    return <div style={{ ...CARD, height: 120, opacity: 0.4 }} aria-hidden />
  }

  const live = devices.filter(d => !d.retiredAt)
  const retired = devices.filter(d => d.retiredAt)
  const name = childName && childName !== 'Your child' ? childName : null

  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
          The screens in your home
        </h2>
        {live.length > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
            {live.length}
          </span>
        )}
      </div>

      <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
        {live.length === 0
          ? askedAt
            ? 'Nothing listed yet. Add the screens you have and the guides below narrow to just those, and a timer can run on a named device instead of a category.'
            : `Tell us what you actually have. Until you do, the passport counts every guide we publish rather than the ${name ? `screens ${name} uses` : 'screens in your house'}, and a timer can only say tablet rather than which one.`
          : 'Add a new one the day it arrives. Every device here gets its own age matched settings guide, and its own timer.'}
      </p>

      {live.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {live.map(d => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              border: '1.5px solid var(--border)', borderRadius: 14, padding: '11px 13px',
            }}>
              <span aria-hidden style={{ fontSize: 21, lineHeight: 1, flexShrink: 0 }}>{deviceIcon(d)}</span>
              {editing === d.id ? (
                <>
                  <input
                    className="input"
                    value={draft}
                    autoFocus
                    onChange={e => setDraft(e.target.value.slice(0, 60))}
                    onKeyDown={e => { if (e.key === 'Enter' && draft.trim()) { patch(d.id, { label: draft }); setEditing(null) } }}
                    style={{ flex: 1, minWidth: 0, fontSize: 16, padding: '8px 12px' }}
                  />
                  <button
                    type="button"
                    onClick={() => { if (draft.trim()) patch(d.id, { label: draft }); setEditing(null) }}
                    style={LINK_BTN}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)', lineHeight: 1.2 }}>
                      {d.label}
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--ink-light)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>
                      {KIND_LABEL[d.kind]}
                    </span>
                  </span>
                  <button type="button" onClick={() => { setEditing(d.id); setDraft(d.label) }} style={LINK_BTN}>
                    Rename
                  </button>
                  {/* Not a delete. Sold or broken keeps the row, so last term's
                      screen time still says which device it happened on. */}
                  <button type="button" onClick={() => patch(d.id, { retired: true })} style={{ ...LINK_BTN, color: 'var(--ink-muted)' }}>
                    Gone
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div style={{ border: '1.5px dashed var(--border)', borderRadius: 14, padding: '13px 13px 6px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: '0 0 10px' }}>
            What arrived?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
            {DEVICE_SUGGESTIONS.map(s => (
              <button
                key={s.label}
                type="button"
                disabled={busy}
                onClick={() => { add(s.label, s.kind, s.guideKey); setAdding(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: '1.5px solid var(--border)', borderRadius: 100,
                  background: '#fff', padding: '8px 13px', cursor: busy ? 'default' : 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--ink)',
                  opacity: busy ? 0.5 : 1,
                }}
              >
                <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setAdding(false)} style={{ ...LINK_BTN, marginBottom: 8 }}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          style={{
            width: '100%', padding: '13px 16px', borderRadius: 16,
            border: '2px solid var(--terracotta)', background: '#fff',
            color: 'var(--terracotta)', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5,
          }}
        >
          + Add a device
        </button>
      )}

      {retired.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={() => setShowRetired(v => !v)} style={LINK_BTN}>
            {showRetired ? 'Hide' : `${retired.length} no longer in the house`}
          </button>
          {showRetired && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 9 }}>
              {retired.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => patch(d.id, { retired: false })}
                  style={{
                    border: '1.5px solid var(--border)', borderRadius: 100, background: 'var(--cream)',
                    padding: '7px 12px', cursor: 'pointer', fontSize: 14.5, color: 'var(--ink-soft)',
                  }}
                >
                  {d.label} · put back
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const LINK_BTN: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  color: 'var(--terracotta)', letterSpacing: '0.04em', padding: '4px 2px',
}
