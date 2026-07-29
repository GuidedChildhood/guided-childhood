'use client'

import { useMemo, useState } from 'react'
import GuideBody from '@/components/devices/GuideBody'

export type DeviceGuide = {
  device_key: string
  name: string
  category: string
  emoji: string
  min_age: number
  subtitle: string
  why: string
  steps: string[]
  note: string
  sort_order: number
}

// Controlled now: the coverage board above shares the same completed set and
// open guide, so marking a device set up updates the ring live and a board
// tile can open the matching guide here.
export default function DeviceList({
  devices,
  childAge,
  completed,
  notOwned,
  pending,
  onToggle,
  onNotOwned,
  onRestore,
  openKey,
  setOpenKey,
}: {
  devices: DeviceGuide[]
  childAge: number
  completed: Set<string>
  notOwned: Set<string>
  pending: string | null
  onToggle: (key: string) => void
  onNotOwned: (key: string) => void
  onRestore: (key: string) => void
  openKey: string | null
  setOpenKey: (key: string | null) => void
}) {
  const categories = useMemo(() => ['All', ...Array.from(new Set(devices.map(d => d.category)))], [devices])
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = devices.filter(d => {
    if (activeCategory !== 'All' && d.category !== activeCategory) return false
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) && !d.subtitle.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
        Every guide, step by step
      </div>

      {/* Search */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search any device, iPhone, Xbox, Alexa, Roblox"
        className="input"
        style={{ marginBottom: '14px' }}
      />

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '18px', paddingBottom: '4px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: '100px',
              border: `1.5px solid ${activeCategory === cat ? 'var(--terracotta)' : 'var(--border)'}`,
              background: activeCategory === cat ? 'var(--terracotta)' : '#fff',
              color: activeCategory === cat ? '#fff' : 'var(--ink)',
              fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-muted)', fontSize: '16px' }}>
          <strong style={{ display: 'block', color: 'var(--ink)', marginBottom: '6px', fontWeight: 700 }}>No device found</strong>
          Try a brand or type, like iPad, console, or TV.
        </div>
      )}

      {/* Device list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(d => {
          const isOpen = openKey === d.device_key
          const isDone = completed.has(d.device_key)
          const isNotOwned = notOwned.has(d.device_key)

          return (
            <div
              key={d.device_key}
              id={`device-${d.device_key}`}
              style={{
                background: '#fff', border: `1.5px solid ${isOpen ? 'var(--terracotta)' : 'var(--border)'}`,
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: isOpen ? '0 8px 32px rgba(26,26,46,0.08)' : 'none',
                transition: 'border-color 0.15s', scrollMarginTop: '90px',
              }}
            >
              <button
                onClick={() => setOpenKey(isOpen ? null : d.device_key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--stage-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                  {d.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: 'var(--ink)' }}>{d.name}</span>
                    {isDone && <span style={{ fontSize: '15px', color: 'var(--terracotta)' }}>✓</span>}
                    {isNotOwned && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '2px 8px' }}>
                        Not in our home
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>{d.subtitle}</div>
                </div>
                <span style={{ fontSize: '16px', color: 'var(--ink-light)', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
              </button>

              {isOpen && (
                <GuideBody
                  guide={d}
                  childAge={childAge}
                  isDone={isDone}
                  busy={pending === d.device_key}
                  onToggle={() => onToggle(d.device_key)}
                  footer={
                    /* The escape from saying yes to a device you do not own. It
                       drops off the checklist and the ring, but stays here to
                       find again the day it arrives. */
                    <button
                      onClick={() => (isNotOwned ? onRestore(d.device_key) : onNotOwned(d.device_key))}
                      disabled={pending === d.device_key}
                      style={{
                        marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600,
                        color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px', padding: '2px 0',
                      }}
                    >
                      {isNotOwned ? 'We have this now, put it back on the list' : 'We do not have this yet'}
                    </button>
                  }
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
