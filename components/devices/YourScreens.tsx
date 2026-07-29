'use client'

import { useEffect, useMemo, useState } from 'react'
import GuideBody from './GuideBody'
import type { DeviceGuide } from '@/app/(dashboard)/dashboard/devices/DeviceList'
import {
  DEVICE_SUGGESTIONS, deviceIcon, KIND_LABEL,
  type FamilyDevice,
} from '@/lib/devices/family'

// One list of screens, not two.
//
// The page used to show a parent their own two devices in one card and our
// twenty six published guides in another, with a coverage ring counting a third
// thing again. Justin, looking at his own phone: "still a bit unclear on
// devices, it's confusing, have 2 lists". He was right, and the loop he asked
// for is the one every app in this category already uses.
//
// Checked against the references first, per the Mobbin first rule. Google Home,
// SmartThings, Roku and Alexa all show one list, your devices, plus a single
// add control. None of them shelves a catalogue beside it. Alexa goes further
// and puts the suggestions inside the same list as dashed rows you have not got
// yet, which is exactly the "suggested list of devices by age" Justin
// described. Chime, Deel and Revolut answer the other half: the status lives on
// the row, so you tap it, do the thing, and come back to a row that has
// changed.
//
// So: your devices, each carrying its own status and its own guide. Then the
// suggestions, dashed, clearly not yours yet. Then one way to add anything
// else. The catalogue is still reachable, it is just no longer competing.
//
// The data already worked this way. family_devices.guide_key has always pointed
// at device_guides.device_key and homeSetupCount has always counted the family's
// own list. Only the screen was telling a different story.

type Props = {
  guides: DeviceGuide[]
  childAge: number
  childName?: string | null
  completed: Set<string>
  notOwned: Set<string>
  pending: string | null
  onToggleGuide: (key: string) => void
  onNotOwned: (key: string) => void
}

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '18px 18px 20px', marginBottom: 20,
}

const LINK_BTN: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  color: 'var(--terracotta)', letterSpacing: '0.04em', padding: '4px 2px',
}

export default function YourScreens({
  guides, childAge, childName, completed, notOwned, pending, onToggleGuide, onNotOwned,
}: Props) {
  const [devices, setDevices] = useState<FamilyDevice[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState('')
  const [showRetired, setShowRetired] = useState(false)
  // Suggestions a parent has waved away this visit. Not persisted: a dismissed
  // suggestion is "not today", not "never", and a family that buys a Switch in
  // October should see it offered again.
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/devices/family')
      const data = await res.json()
      setDevices(Array.isArray(data.devices) ? data.devices : [])
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

  const guideFor = useMemo(() => {
    const byKey = new Map(guides.map(g => [g.device_key, g]))
    return (key: string | null) => (key ? byKey.get(key) ?? null : null)
  }, [guides])

  if (devices === null) {
    return <div style={{ ...CARD, height: 160, opacity: 0.4 }} aria-hidden />
  }

  const live = devices.filter(d => !d.retiredAt)
  const retired = devices.filter(d => d.retiredAt)
  const name = childName && childName !== 'Your child' ? childName : null

  // A device is done when the guide covering it has been worked through. One a
  // parent named themselves, with no guide behind it, is not a job we set them,
  // so it never sits there looking unfinished.
  const isDone = (d: FamilyDevice) => !d.guideKey || completed.has(d.guideKey)
  const doneCount = live.filter(isDone).length

  // What to suggest. Age matched, not already in the house, not waved away, and
  // capped at four so it reads as a hint rather than a second catalogue.
  const haveGuideKeys = new Set(live.map(d => d.guideKey).filter(Boolean) as string[])
  const haveLabels = new Set(live.map(d => d.label.toLowerCase()))
  const suggestions = DEVICE_SUGGESTIONS
    .filter(s => !haveLabels.has(s.label.toLowerCase()))
    .filter(s => !s.guideKey || !haveGuideKeys.has(s.guideKey))
    .filter(s => !dismissed.has(s.label))
    .filter(s => !s.guideKey || !notOwned.has(s.guideKey))
    .filter(s => {
      const g = guideFor(s.guideKey)
      return !g || childAge >= g.min_age
    })
    .slice(0, 3)

  // The add picker searches our own suggestion names AND the guide names, so
  // typing Xbox finds it whether the parent thinks of it as a device we list or
  // a guide we publish.
  const q = query.trim().toLowerCase()
  const pickList = DEVICE_SUGGESTIONS.filter(s => {
    if (!q) return true
    if (s.label.toLowerCase().includes(q)) return true
    const g = guideFor(s.guideKey)
    return !!g && (g.name.toLowerCase().includes(q) || g.subtitle.toLowerCase().includes(q))
  })

  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
          The screens in your home
        </h2>
        {live.length > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: doneCount === live.length ? 'var(--retro-green)' : 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
            {doneCount} of {live.length} set up
          </span>
        )}
      </div>

      <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
        {live.length === 0
          ? `Add what you actually have and each one arrives with its own settings guide, matched to ${name ? `${name}'s` : 'your child’s'} age. Nothing here is a rule, it is what most families set.`
          : 'Tap any screen to walk through its settings. Mark it set up and it ticks off here.'}
      </p>

      {/* The family's own screens. Status on the row, guide inside the row. */}
      {live.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {live.map(d => {
            const guide = guideFor(d.guideKey)
            const done = isDone(d)
            const open = openId === d.id
            const waiting = !!d.guideKey && pending === d.guideKey

            return (
              <div key={d.id} style={{
                border: `1.5px solid ${open ? 'var(--terracotta)' : 'var(--border)'}`,
                borderRadius: 14, overflow: 'hidden',
                boxShadow: open ? '0 8px 32px rgba(26,26,46,0.08)' : 'none',
                transition: 'border-color 0.15s',
              }}>
                {editing === d.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px' }}>
                    <span aria-hidden style={{ fontSize: 21, lineHeight: 1, flexShrink: 0 }}>{deviceIcon(d)}</span>
                    <input
                      className="input"
                      value={draft}
                      autoFocus
                      onChange={e => setDraft(e.target.value.slice(0, 60))}
                      onKeyDown={e => { if (e.key === 'Enter' && draft.trim()) { patch(d.id, { label: draft }); setEditing(null) } }}
                      style={{ flex: 1, minWidth: 0, fontSize: 16, padding: '8px 12px' }}
                    />
                    <button type="button" onClick={() => { if (draft.trim()) patch(d.id, { label: draft }); setEditing(null) }} style={LINK_BTN}>
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => (guide ? setOpenId(open ? null : d.id) : undefined)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                        padding: '12px 13px', background: 'none', border: 'none',
                        cursor: guide ? 'pointer' : 'default', textAlign: 'left',
                      }}
                    >
                      <span aria-hidden style={{ fontSize: 21, lineHeight: 1, flexShrink: 0 }}>{deviceIcon(d)}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)', lineHeight: 1.2 }}>
                          {d.label}
                        </span>
                        {/* The status a parent came here to read, on the row,
                            the way every setup checklist worth copying does it. */}
                        <span style={{
                          display: 'block', fontFamily: 'var(--font-mono)', fontSize: 12.5,
                          letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2,
                          color: done ? 'var(--retro-green)' : 'var(--terracotta-dark)',
                        }}>
                          {done ? (d.guideKey ? '✓ Settings in place' : KIND_LABEL[d.kind]) : 'Not set up yet'}
                        </span>
                      </span>
                      {guide && (
                        <span aria-hidden style={{ fontSize: 16, color: 'var(--ink-light)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                      )}
                    </button>

                    {open && guide && (
                      <GuideBody
                        guide={guide}
                        childAge={childAge}
                        isDone={done}
                        busy={waiting}
                        onToggle={() => {
                          onToggleGuide(guide.device_key)
                          // Marking it done settles the row back into the list
                          // rather than leaving the walkthrough hanging open.
                          if (!done) setOpenId(null)
                        }}
                        footer={
                          <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                            <button type="button" onClick={() => { setEditing(d.id); setDraft(d.label); setOpenId(null) }} style={LINK_BTN}>
                              Rename
                            </button>
                            {/* Not a delete. Sold or broken keeps the row, so
                                last term's screen time still says which device
                                it happened on. */}
                            <button type="button" onClick={() => { patch(d.id, { retired: true }); setOpenId(null) }} style={{ ...LINK_BTN, color: 'var(--ink-muted)' }}>
                              Gone from the house
                            </button>
                          </div>
                        }
                      />
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Suggestions, inside the same list and clearly not yours yet. Dashed,
          the way Alexa marks the ones you have not got. We advise, we do not
          insist, so each one can be waved away and nothing counts down. */}
      {suggestions.length > 0 && !picking && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: '0 0 9px' }}>
            {live.length === 0 ? 'Most families have these' : `Also common at ${childAge}`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* The whole row adds it, so the tap target is the row rather than
                a few words of link text. An earlier pass had "We have this" as
                a text button beside a subtitle, and between them they left the
                subtitle about ninety pixels to wrap into, so every suggestion
                stood four lines tall and the card ran off the screen. */}
            {suggestions.map(s => {
              const sub = guideFor(s.guideKey)?.subtitle
              return (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  border: '1.5px dashed var(--border)', borderRadius: 14,
                  background: 'var(--cream)', paddingRight: 6,
                }}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => add(s.label, s.kind, s.guideKey)}
                    style={{
                      flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 11,
                      background: 'none', border: 'none', textAlign: 'left',
                      padding: '11px 4px 11px 13px', cursor: busy ? 'default' : 'pointer',
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    <span aria-hidden style={{ fontSize: 21, lineHeight: 1, flexShrink: 0, opacity: 0.65 }}>{s.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.2 }}>
                        {s.label}
                      </span>
                      {sub && (
                        <span style={{ display: 'block', fontSize: 13.5, color: 'var(--ink-muted)', lineHeight: 1.35, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub}
                        </span>
                      )}
                    </span>
                    <span aria-hidden style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                      border: '1.5px solid var(--terracotta)', color: 'var(--terracotta)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1,
                    }}>
                      +
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`We do not have a ${s.label}`}
                    onClick={() => {
                      // Local first so the row goes immediately, then recorded
                      // against the guide so it stays gone on the next visit
                      // and drops out of the coverage ring too. A suggestion
                      // with no guide behind it can only be a this visit
                      // dismissal, which is the honest limit rather than a fake
                      // promise.
                      setDismissed(prev => new Set(prev).add(s.label))
                      if (s.guideKey) onNotOwned(s.guideKey)
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', fontSize: 15, padding: '10px 6px', flexShrink: 0, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* One way to add anything else, with the search that used to sit over
          the whole catalogue. */}
      {picking ? (
        <div style={{ border: '1.5px dashed var(--border)', borderRadius: 14, padding: '13px 13px 10px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: '0 0 10px' }}>
            What arrived?
          </p>
          <input
            className="input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search iPhone, Xbox, Fire tablet, Switch"
            style={{ marginBottom: 12, fontSize: 16 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
            {pickList.map(s => (
              <button
                key={s.label}
                type="button"
                disabled={busy}
                onClick={() => { add(s.label, s.kind, s.guideKey); setPicking(false); setQuery('') }}
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
          {pickList.length === 0 && (
            <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 10px' }}>
              Nothing matching. Every guide we publish is at the bottom of this page, and DiGi can walk you through anything that is not listed.
            </p>
          )}
          <button type="button" onClick={() => { setPicking(false); setQuery('') }} style={{ ...LINK_BTN, marginBottom: 4 }}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPicking(true)}
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
