'use client'

import Link from 'next/link'
import type { DeviceGuide } from './DeviceList'

// The coverage board: one glance answer to have I set the settings on
// everything. It layers the way protection actually works, the network
// first because one setup covers every device in the house, then each
// device, then the apps on them. Patterns borrowed from the best setup
// checklists (Chime section groups, the World App and Acorns coverage ring,
// the Clubhouse empty circle to green tick), rebuilt in our own skin.
//
// The network item is synthetic, it has no guide row, so it persists its
// done state under the free text key 'network' through the same api. Every
// other row reflects the guide's own mark as set up, and tapping it opens
// that guide below.

const NETWORK_KEY = 'network'
const APP_KEYS = new Set(['roblox', 'youtube', 'tiktok', 'snapchat', 'instagram', 'whatsapp'])

type LayerItem = {
  key: string
  name: string
  emoji: string
  why: string
  isNetwork?: boolean
}

function ring(pct: number) {
  const r = 26
  const circ = 2 * Math.PI * r
  return { r, circ, offset: circ * (1 - pct) }
}

export default function DeviceCoverageBoard({
  devices,
  childAge,
  completed,
  notOwned,
  pending,
  onToggle,
  onOpen,
  onRestore,
}: {
  devices: DeviceGuide[]
  childAge: number
  completed: Set<string>
  notOwned: Set<string>
  pending: string | null
  onToggle: (key: string) => void
  onOpen: (key: string) => void
  onRestore: (key: string) => void
}) {
  const network: LayerItem = {
    key: NETWORK_KEY,
    name: 'Home broadband and Wifi',
    emoji: '🛜',
    why: 'One setup covers every device in the house. The best first move.',
    isNetwork: true,
  }

  // Age ready devices the family actually has, split into the device layer
  // and the app layer. Not owned devices drop out of both, so they never
  // count against coverage.
  const ready = devices.filter(d => childAge >= d.min_age && !notOwned.has(d.device_key))
  const deviceItems: LayerItem[] = ready
    .filter(d => !APP_KEYS.has(d.device_key))
    .map(d => ({ key: d.device_key, name: d.name, emoji: d.emoji, why: d.subtitle }))
  const appItems: LayerItem[] = ready
    .filter(d => APP_KEYS.has(d.device_key))
    .map(d => ({ key: d.device_key, name: d.name, emoji: d.emoji, why: d.subtitle }))

  // The quiet group of things the family said they do not have yet, kept so
  // the guide is one tap away the day one arrives.
  const notOwnedItems: LayerItem[] = devices
    .filter(d => notOwned.has(d.device_key))
    .map(d => ({ key: d.device_key, name: d.name, emoji: d.emoji, why: d.subtitle }))

  const layers: { label: string; blurb: string; items: LayerItem[] }[] = [
    { label: 'Your home network', blurb: 'Set this first. It protects every screen at once.', items: [network] },
    { label: 'Your devices', blurb: 'Every screen your family uses, set for their age.', items: deviceItems },
    { label: 'The apps on them', blurb: 'The apps that need their own settings on top.', items: appItems },
  ].filter(l => l.items.length > 0)

  // Coverage across everything shown, and the single next thing to do.
  const allKeys = layers.flatMap(l => l.items.map(i => i.key))
  const total = allKeys.length
  const done = allKeys.filter(k => completed.has(k)).length
  const nextKey = allKeys.find(k => !completed.has(k)) ?? null
  const pct = total ? done / total : 0
  const { r, circ, offset } = ring(pct)
  const allDone = done === total && total > 0

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '22px',
      padding: '20px 20px 22px', marginBottom: '22px', boxShadow: '0 6px 26px rgba(26,26,46,0.07)',
    }}>
      {/* Header with the coverage ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '6px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            Device coverage
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', letterSpacing: '-0.03em', lineHeight: 1.12, margin: '3px 0 0' }}>
            {allDone ? 'Every screen is covered' : 'Every screen, covered'}
          </h2>
        </div>
        <div style={{ position: 'relative', flexShrink: 0, width: 64, height: 64 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
            <circle cx="32" cy="32" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="32" cy="32" r={r} fill="none"
              stroke={allDone ? 'var(--tint-sage)' : 'var(--terracotta)'} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: 'var(--ink)', lineHeight: 1 }}>{done}<span style={{ color: 'var(--ink-muted)', fontSize: '11px' }}>/{total}</span></span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        {allDone
          ? 'Settings are in place across the network, the devices and the apps. Come back whenever a new device arrives.'
          : 'Protection works in layers. Set the network first, then each device, then the apps on them.'}
      </p>

      {/* Layers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {layers.map(layer => (
          <div key={layer.label}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '9px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)' }}>
                {layer.label}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--ink-muted)', textAlign: 'right', flex: 1, minWidth: 0 }}>
                {layer.blurb}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Set up rows sink to the bottom, so the layer always leads
                  with what is still left to do. Marking one set up flips it
                  down here into the done pile. */}
              {[...layer.items]
                .sort((a, b) => Number(completed.has(a.key)) - Number(completed.has(b.key)))
                .map(item => {
                  const isDone = completed.has(item.key)
                  const isNext = item.key === nextKey
                  return (
                    <Row
                      key={item.key}
                      item={item}
                      isDone={isDone}
                      isNext={isNext}
                      busy={pending === item.key}
                      onToggle={onToggle}
                      onOpen={onOpen}
                    />
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Not in our home yet: the escape hatch, kept findable for the day a
          device arrives. */}
      {notOwnedItems.length > 0 && (
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Not in our home yet
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '9px' }}>
            {notOwnedItems.map(item => (
              <div key={item.key} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'var(--cream)', border: '1.5px solid var(--border)',
                borderRadius: '15px', padding: '10px 13px', opacity: 0.9,
              }}>
                <div style={{ width: 34, height: 34, borderRadius: '10px', flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>
                  {item.emoji}
                </div>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink-soft)' }}>
                  {item.name}
                </span>
                <button
                  onClick={() => onRestore(item.key)}
                  disabled={pending === item.key}
                  style={{
                    flexShrink: 0, background: 'none', border: '1.5px solid var(--border)', borderRadius: '100px',
                    padding: '6px 13px', cursor: pending === item.key ? 'wait' : 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: 'var(--ink)',
                  }}
                >
                  We have it now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ item, isDone, isNext, busy, onToggle, onOpen }: {
  item: LayerItem
  isDone: boolean
  isNext: boolean
  busy: boolean
  onToggle: (key: string) => void
  onOpen: (key: string) => void
}) {
  const tick = (
    <span
      aria-hidden="true"
      style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDone ? 'var(--tint-sage)' : '#fff',
        border: isDone ? '2px solid var(--tint-sage)' : '2px solid var(--border)',
        color: '#2D5016', fontSize: '13px', fontWeight: 800,
      }}
    >
      {isDone ? '✓' : ''}
    </span>
  )

  const body = (
    <>
      <div style={{
        width: 40, height: 40, borderRadius: '11px', flexShrink: 0,
        background: isDone ? 'var(--tint-sage)' : 'var(--stage-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px',
      }}>
        {item.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)' }}>
            {item.name}
          </span>
          {isNext && !isDone && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', background: '#fff', border: '1px solid var(--terracotta)', borderRadius: '100px', padding: '2px 7px' }}>
              Start here
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '1px' }}>{item.why}</div>
      </div>
    </>
  )

  const shell: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textAlign: 'left',
    background: isDone ? 'var(--cream)' : isNext ? 'var(--terracotta-lt)' : '#fff',
    border: `1.5px solid ${isNext && !isDone ? 'var(--terracotta)' : 'var(--border)'}`,
    borderRadius: '15px', padding: '11px 13px', cursor: 'pointer',
    opacity: isDone ? 0.85 : 1,
    transition: 'opacity 0.3s ease, background 0.3s ease, border-color 0.3s ease',
  }

  // The network row has no guide to open, so its body links to a DiGi
  // walkthrough and its tick toggles done. Device rows open the guide below;
  // marking done happens inside that guide, so the tick here is read only.
  if (item.isNetwork) {
    return (
      <div style={{ ...shell, cursor: 'default' }}>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent('Can you walk me through setting up parental filtering on my home broadband and Wifi router step by step?')}`}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, textDecoration: 'none' }}
        >
          {body}
        </Link>
        <button
          onClick={() => onToggle(item.key)}
          disabled={busy}
          aria-label={isDone ? 'Mark home network not set up' : 'Mark home network set up'}
          style={{ background: 'none', border: 'none', padding: 0, cursor: busy ? 'wait' : 'pointer' }}
        >
          {tick}
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => onOpen(item.key)} style={shell}>
      {body}
      {tick}
    </button>
  )
}
