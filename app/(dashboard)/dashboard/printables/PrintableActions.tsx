'use client'

import { useState } from 'react'
import type { Printable } from '@/lib/printables/registry'

// The two actions under every sheet: the real PDF download, and the star
// wiring. Add to quests creates a one off family quest through the same
// approve loop as everything else, so the finished paper pays screen time.

export default function PrintableActions({ printable }: { printable: Printable }) {
  const [added, setAdded] = useState(false)

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

  const downloadStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px',
    padding: '10px 16px', textDecoration: 'none',
    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
    boxShadow: '0 3px 0 var(--terracotta-dark)',
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
    </div>
  )
}
