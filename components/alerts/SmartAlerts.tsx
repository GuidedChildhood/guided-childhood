'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Suggestion } from '@/lib/alerts/suggestions'

// The home nudge: the ranked suggestions, shown two at a time, calm and
// dismissable. A dismissed one steps back for three days so it never nags.
//
// These are the SHORT FACTUAL half of how the notification layer works: many
// small nudges here, and exactly one reflective card from DiGi above them.
// That split is Justin's own call, and it is what four apps in the references
// already do (Withings Highlights then Read, Plenty of Fish For you then
// Latest, Apple Store, komoot).
//
// So a nudge is one line. If a thing needs a paragraph to make sense, it is
// not a nudge and it belongs in the card above.

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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          Things you could do now
        </span>
        {live.length > 2 && (
          <button
            onClick={() => setShowAll(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}
          >
            {showAll ? 'Show less' : `See all ${live.length}`}
          </button>
        )}
      </div>

      {/* Rows, not cards.
          Each of these used to be a card in its own right: emoji tile, title,
          a line and a half of body, and its own button, stacked under the DiGi
          prompts which were doing the same thing bigger. Two card stacks in a
          row is how Home got long enough that Justin was scrolling past his
          own advice.
          These are the short factual half of the split: one line each, the
          whole row is the link, and the body is gone rather than truncated,
          because a fact that needs a paragraph to explain it is not a nudge,
          it is the reflective card above. Withings puts its Read rows exactly
          like this under a single Highlights card, and Plenty of Fish does the
          same with Latest under For you. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {shown.map((s, i) => (
          <div key={s.key} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#fff', border: `1.5px solid ${i === 0 ? 'var(--terracotta)' : 'var(--border)'}`,
            borderRadius: '14px', paddingRight: 4,
          }}>
            <Link href={s.href} style={{
              flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '11px',
              textDecoration: 'none', padding: '11px 4px 11px 13px',
            }}>
              <span aria-hidden style={{ fontSize: '19px', lineHeight: 1, flexShrink: 0 }}>{s.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15.5px',
                  color: 'var(--ink)', lineHeight: 1.25,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {s.title}
                </span>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11.5px',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: i === 0 ? 'var(--terracotta-dark)' : 'var(--ink-muted)', marginTop: 1,
                }}>
                  {s.cta}
                </span>
              </span>
              <span aria-hidden style={{ fontSize: '17px', color: 'var(--ink-light)', flexShrink: 0 }}>›</span>
            </Link>
            <button
              onClick={() => dismiss(s.key)}
              aria-label={`Not now: ${s.title}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', fontSize: '14px', padding: '11px 7px', flexShrink: 0, lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
