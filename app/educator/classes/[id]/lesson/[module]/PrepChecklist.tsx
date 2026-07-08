'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The tick off list for a lesson. State persists per class + module in
// localStorage (v1: per browser, which matches how a teacher preps on
// their own laptop). Phase 4 can move ticks to the database if leads
// want prep visibility across staff.

export type PrepItem = {
  key: string
  label: string
  detail?: string
  href?: string
  external?: boolean
}

export default function PrepChecklist({
  storageKey,
  groups,
}: {
  storageKey: string
  groups: { heading: string; items: PrepItem[] }[]
}) {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setDone(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [storageKey])

  const toggle = (key: string) => {
    setDone(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const ticked = groups.reduce((n, g) => n + g.items.filter(i => done[i.key]).length, 0)

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '14px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-dark)' }}>
          Lesson checklist
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
          color: ticked === total ? 'var(--green-dark)' : 'var(--ink-muted)',
          background: ticked === total ? 'var(--green-lt)' : 'var(--warm)',
          border: '1.5px solid var(--border)', borderRadius: '10px', padding: '4px 12px',
        }}>
          {loaded ? `${ticked} of ${total} done${ticked === total ? ' · ready to teach' : ''}` : `${total} steps`}
        </span>
      </div>

      {groups.map(group => (
        <div key={group.heading} style={{ marginBottom: '18px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            {group.heading}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {group.items.map(item => {
              const isDone = !!done[item.key]
              return (
                <div key={item.key} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  background: isDone ? 'var(--green-lt)' : 'var(--warm)',
                  border: isDone ? '1.5px solid var(--green)' : '1.5px solid var(--border)',
                  borderRadius: '14px', padding: '12px 14px', transition: 'background 0.15s, border-color 0.15s',
                }}>
                  <button
                    onClick={() => toggle(item.key)}
                    aria-label={isDone ? `Mark ${item.label} not done` : `Mark ${item.label} done`}
                    style={{
                      flexShrink: 0, width: '26px', height: '26px', borderRadius: '8px',
                      border: isDone ? '2px solid var(--green-dark)' : '2px solid var(--ink-light)',
                      background: isDone ? 'var(--green-dark)' : '#fff',
                      color: '#fff', fontWeight: 900, fontSize: '15px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                    }}
                  >
                    {isDone ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14.5px',
                      color: 'var(--ink)', textDecoration: isDone ? 'line-through' : 'none',
                      opacity: isDone ? 0.65 : 1,
                    }}>
                      {item.label}
                    </div>
                    {item.detail && (
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: '2px' }}>
                        {item.detail}
                      </div>
                    )}
                  </div>
                  {item.href && (
                    <Link href={item.href} target={item.external ? '_blank' : undefined} style={{
                      flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                      color: 'var(--green-dark)', textDecoration: 'none', padding: '4px 2px',
                    }}>
                      Open →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
