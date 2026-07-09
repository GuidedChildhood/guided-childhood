'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Suggestion } from '@/lib/alerts/suggestions'

// The home nudge: the ranked suggestions, shown two at a time, calm and
// dismissable. A dismissed one steps back for three days so it never nags.
// This is the one proactive layer that surfaces the whole service at the
// right moment, replacing the old prompts strip.

const DISMISS_KEY = 'gc_alert_dismiss'
const COOL_OFF = 3 * 86400000

export default function SmartAlerts({ suggestions }: { suggestions: Suggestion[] }) {
  const [dismissed, setDismissed] = useState<Record<string, number>>({})
  const [ready, setReady] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    try { setDismissed(JSON.parse(localStorage.getItem(DISMISS_KEY) || '{}')) } catch { /* first run */ }
    setReady(true)
  }, [])

  // Render nothing until we have read the dismiss state, so a just dismissed
  // card does not flash back on load.
  if (!ready) return null

  const now = Date.now()
  const live = suggestions.filter(s => !(dismissed[s.key] && now - dismissed[s.key] < COOL_OFF))
  if (live.length === 0) return null

  const shown = showAll ? live : live.slice(0, 2)

  function dismiss(key: string) {
    const next = { ...dismissed, [key]: Date.now() }
    setDismissed(next)
    try { localStorage.setItem(DISMISS_KEY, JSON.stringify(next)) } catch { /* private mode */ }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Things you could do now
        </span>
        {live.length > 2 && (
          <button
            onClick={() => setShowAll(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)' }}
          >
            {showAll ? 'Show less' : `See all ${live.length}`}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {shown.map((s, i) => (
          <div key={s.key} style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: '13px',
            background: '#fff', border: `1.5px solid ${i === 0 ? 'var(--terracotta)' : 'var(--border)'}`,
            borderRadius: '16px', padding: '14px 15px',
            boxShadow: i === 0 ? '0 5px 18px rgba(224,122,63,0.12)' : 'none',
          }}>
            <span style={{
              width: 40, height: 40, borderRadius: '11px', flexShrink: 0,
              background: i === 0 ? 'var(--terracotta-lt)' : 'var(--cream)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px',
            }}>{s.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.2 }}>
                {s.title}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: '3px 0 9px' }}>
                {s.body}
              </div>
              <Link href={s.href} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px',
                color: 'var(--ink)', background: i === 0 ? 'var(--terracotta)' : '#fff',
                border: i === 0 ? 'none' : '1.5px solid var(--border)',
                borderRadius: '11px', padding: '8px 14px',
                boxShadow: i === 0 ? '0 3px 0 var(--terracotta-dark)' : 'none',
              }}>
                {s.cta} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <button
              onClick={() => dismiss(s.key)}
              aria-label="Not now"
              style={{ position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', fontSize: '13px', padding: '4px' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
