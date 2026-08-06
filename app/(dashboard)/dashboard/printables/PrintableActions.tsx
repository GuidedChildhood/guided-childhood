'use client'

import { useState } from 'react'
import type { Printable } from '@/lib/printables/registry'

// The two actions under every sheet: the real PDF download, and the star
// wiring. Add to quests creates a one off family quest through the same
// approve loop as everything else, so the finished paper pays screen time.

// A SHEET MUST NEVER TAKE THE APP WITH IT.
//
// Justin, 6 August 2026: "when you goto print it there's no way to navigate
// back to app."
//
// These were plain same tab links. On a desktop browser that is harmless, the
// PDF arrives as a download because the route sends Content-Disposition
// attachment and the page never moves. On a phone it is not harmless, and on the
// installed PWA it is a trap:
//
//   iOS Safari largely ignores the download attribute and renders the PDF.
//   A standalone PWA has no address bar, no tabs and no back button, so a
//   navigation to a PDF replaces the whole app with a viewer that has nothing
//   to go back to. The only way out is to kill the app and reopen it.
//
// So every sheet opens away from the app instead. In a browser that is a new
// tab; in the PWA it hands off to the system browser and the app stays exactly
// where it was, still on the printables page, with the star buttons still there
// to tap when the sheet comes back finished. That is the whole loop, and the
// loop was being broken by the first step in it.
//
// The child app already did this correctly on every one of its sheet links.
// This is the parent side catching up.
const OPEN_AWAY = { target: '_blank', rel: 'noopener noreferrer' } as const

export default function PrintableActions({ printable, isPaid = true }: { printable: Printable; isPaid?: boolean }) {
  const [added, setAdded] = useState(false)
  const [sent, setSent] = useState(false)
  const [done, setDone] = useState(false)

  // They did it: the parent records the finished sheet themselves. A young child
  // colouring at the table never taps "I did it", and a family with no child app
  // never can, so this is how the paper that was actually finished lands its
  // stars and counts on the off screen total.
  async function markDone() {
    if (done) return
    setDone(true)
    try {
      const r = await fetch('/api/printables/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printable_key: printable.key }),
      })
      if (!r.ok) setDone(false)
    } catch { setDone(false) }
  }

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
    fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800,
    boxShadow: '0 3px 0 var(--terracotta-dark)',
  }

  // Free parents see the beautiful preview (the sell) but the download and
  // the star wiring are a member feature, so the printables sit behind the
  // paywall like the rest of the library.
  //
  // Except the ones marked free. The Starter Pack is handed to strangers on
  // the marketing site, so charging a member for the same booklet was the
  // wrong way round, and it also meant nobody could open it to check it.
  if (!isPaid && !printable.free) {
    return (
      <a href="/dashboard/upgrade" style={{ ...downloadStyle, background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'none', color: 'var(--ink)' }}>
        🔒 Members download and print
      </a>
    )
  }

  // The finished products offer both editions straight from public: the full
  // colour version to print and use, and the colour in version to print and
  // colour for stars. Everything else falls back to the single generated sheet.
  const hasLocal = Boolean(printable.pdfColour && printable.pdfColourIn)

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {hasLocal ? (
        <>
          <a href={printable.pdfColour} {...OPEN_AWAY} style={downloadStyle}>
            ⬇ Colour
          </a>
          <a href={printable.pdfColourIn} {...OPEN_AWAY} style={{ ...downloadStyle, background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'none' }}>
            ⬇ Colour in
          </a>
        </>
      ) : (
        <>
          <a href={`/api/printables/${printable.key}/pdf`} {...OPEN_AWAY} style={downloadStyle}>
            ⬇ PDF{printable.sheetUrlEs ? ' · English' : ''}
          </a>
          {printable.sheetUrlEs && (
            <a href={`/api/printables/${printable.key}/pdf?lang=es`} {...OPEN_AWAY} style={downloadStyle}>
              ⬇ PDF · Espanol
            </a>
          )}
        </>
      )}
      <button
        onClick={addToQuests}
        disabled={added}
        style={{
          background: added ? 'var(--tint-sage)' : '#fff',
          border: '1.5px solid var(--border)', borderRadius: '12px',
          padding: '10px 16px', cursor: added ? 'default' : 'pointer',
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
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
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
        }}
      >
        {sent ? 'Sent to their app ✓' : '📲 Send to my child'}
      </button>
      <button
        onClick={markDone}
        disabled={done}
        title="Record it done and land the stars, for a sheet finished away from the app"
        style={{
          background: done ? 'var(--tint-sage)' : '#fff',
          border: '1.5px solid var(--border)', borderRadius: '12px',
          padding: '10px 16px', cursor: done ? 'default' : 'pointer',
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
        }}
      >
        {done ? `Done, ⭐ ${printable.stars} landed ✓` : `✅ They did it · ⭐ ${printable.stars}`}
      </button>
    </div>
  )
}
