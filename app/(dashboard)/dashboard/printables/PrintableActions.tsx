'use client'

import { useState } from 'react'
import type { Printable } from '@/lib/printables/registry'

// The two actions under every sheet: the real PDF download, and the star
// wiring. Add to quests creates a one off family quest through the same
// approve loop as everything else, so the finished paper pays screen time.

export default function PrintableActions({ printable, isPaid = true }: { printable: Printable; isPaid?: boolean }) {
  const [added, setAdded] = useState(false)
  const [sent, setSent] = useState(false)

  async function addToQuests() {
    if (added) return
    setAdded(true)
    try {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Finish the ${printable.title} sheet`,
          emoji: '🖨️',
          stars: printable.stars,
          schedule: 'once',
          child_id: null,
        }),
      })
    } catch { setAdded(false) }
  }

  // Send it straight to the child's app, where it jumps to the top of their to
  // do. They print it, do it, and show it to be confirmed like any printable.
  async function sendToChild() {
    if (sent) return
    setSent(true)
    try {
      const r = await fetch('/api/printables/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printable_key: printable.key }),
      })
      if (!r.ok) setSent(false)
    } catch { setSent(false) }
  }

  const downloadStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px',
    padding: '10px 16px', textDecoration: 'none',
    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
    boxShadow: '0 3px 0 var(--terracotta-dark)',
  }

  // Free parents see the beautiful preview (the sell) but the download and
  // the star wiring are a member feature, so the printables sit behind the
  // paywall like the rest of the library.
  if (!isPaid) {
    return (
      <a href="/dashboard/upgrade" style={{ ...downloadStyle, background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'none', color: 'var(--ink)' }}>
        🔒 Members download and print
      </a>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a href={`/api/printables/${printable.key}/pdf`} style={downloadStyle}>
        ⬇ PDF{printable.sheetUrlEs ? ' · English' : ''}
      </a>
      {printable.sheetUrlEs && (
        <a href={`/api/printables/${printable.key}/pdf?lang=es`} style={downloadStyle}>
          ⬇ PDF · Espanol
        </a>
      )}
      <button
        onClick={addToQuests}
        disabled={added}
        style={{
          background: added ? 'var(--tint-sage)' : '#fff',
          border: '1.5px solid var(--border)', borderRadius: '12px',
          padding: '10px 16px', cursor: added ? 'default' : 'pointer',
          fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)',
        }}
      >
        {added ? 'On the quest list ✓' : `Add to quests · ⭐ ${printable.stars}`}
      </button>
      <button
        onClick={sendToChild}
        disabled={sent}
        style={{
          background: sent ? 'var(--tint-sage)' : 'var(--stage-1)',
          border: '1.5px solid var(--border)', borderRadius: '12px',
          padding: '10px 16px', cursor: sent ? 'default' : 'pointer',
          fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)',
        }}
      >
        {sent ? 'Sent to their app ✓' : '📲 Send to my child'}
      </button>
    </div>
  )
}
