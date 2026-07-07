'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

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

// Steps are seeded as "**bold lead in** rest of the step". Render the bold
// part as a real bold span instead of shipping raw markup to the client.
function renderStep(step: string) {
  const match = step.match(/^\*\*(.+?)\*\*(.*)$/)
  if (!match) return <span>{step}</span>
  return (
    <>
      <strong style={{ color: 'var(--ink)' }}>{match[1]}</strong>
      <span>{match[2]}</span>
    </>
  )
}

export default function DeviceList({
  devices,
  childAge,
  initialCompleted,
}: {
  devices: DeviceGuide[]
  childAge: number
  initialCompleted: string[]
}) {
  const categories = useMemo(() => ['All', ...Array.from(new Set(devices.map(d => d.category)))], [devices])
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted))
  const [pending, setPending] = useState<string | null>(null)

  const filtered = devices.filter(d => {
    if (activeCategory !== 'All' && d.category !== activeCategory) return false
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) && !d.subtitle.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const toggleComplete = async (key: string) => {
    setPending(key)
    const isDone = completed.has(key)
    setCompleted(prev => {
      const next = new Set(prev)
      if (isDone) next.delete(key)
      else next.add(key)
      return next
    })
    try {
      await fetch('/api/devices/complete', {
        method: isDone ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_key: key }),
      })
    } catch { /* non-blocking */ }
    setPending(null)
  }

  return (
    <div>
      {/* Progress summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.02em' }}>
          {completed.size} of {devices.length} devices set up
        </div>
        <div style={{ flex: 1, minWidth: '80px', maxWidth: '160px', height: '8px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{
            width: `${devices.length ? (completed.size / devices.length) * 100 : 0}%`,
            height: '100%', background: 'var(--terracotta)', borderRadius: '100px',
            transition: 'width 0.25s ease',
          }} />
        </div>
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
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
          <strong style={{ display: 'block', color: 'var(--ink)', marginBottom: '6px', fontWeight: 700 }}>No device found</strong>
          Try a brand or type, like iPad, console, or TV.
        </div>
      )}

      {/* Device list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(d => {
          const isOpen = openKey === d.device_key
          const isDone = completed.has(d.device_key)
          const ageReady = childAge >= d.min_age

          return (
            <div
              key={d.device_key}
              style={{
                background: '#fff', border: `1.5px solid ${isOpen ? 'var(--terracotta)' : 'var(--border)'}`,
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: isOpen ? '0 8px 32px rgba(26,26,46,0.08)' : 'none',
                transition: 'border-color 0.15s',
              }}
            >
              <button
                onClick={() => setOpenKey(isOpen ? null : d.device_key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--stage-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {d.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{d.name}</span>
                    {isDone && <span style={{ fontSize: '13px', color: 'var(--terracotta)' }}>✓</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{d.subtitle}</div>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--ink-light)', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 18px 20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: ageReady ? 'var(--stage-2)' : 'var(--stage-5)',
                    color: ageReady ? 'var(--stage-2-text)' : 'var(--stage-5-text)',
                    fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '10px', marginBottom: '14px',
                  }}>
                    {ageReady ? `✓ Suitable to set up now` : `Most families introduce this around age ${d.min_age} plus, here is how, for when you are ready`}
                  </div>

                  <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '16px' }}>
                    {d.why}
                  </p>

                  <ol style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '16px' }}>
                    {d.steps.map((step, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', padding: '11px 0', borderBottom: i < d.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--ink)', color: 'var(--terracotta-lt)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.65 }}>
                          {renderStep(step)}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div style={{ background: 'var(--stage-5)', borderLeft: '2.5px solid var(--terracotta)', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '14px' }}>
                    <strong style={{ color: 'var(--terracotta)', fontWeight: 700 }}>Pathway note: </strong>
                    {d.note}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => toggleComplete(d.device_key)}
                      disabled={pending === d.device_key}
                      className={isDone ? 'btn btn-outline' : 'btn btn-gold'}
                      style={{ flex: 1, minWidth: '140px', justifyContent: 'center', fontSize: '13px' }}
                    >
                      {isDone ? 'Marked as set up ✓' : 'Mark as set up'}
                    </button>
                    <Link
                      href={`/dashboard/digi?device=${d.device_key}&q=${encodeURIComponent(`Can you walk me through setting up ${d.name} step by step?`)}`}
                      className="btn btn-outline"
                      style={{ flex: 1, minWidth: '140px', justifyContent: 'center', fontSize: '13px' }}
                    >
                      DiGi can walk me through it
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
