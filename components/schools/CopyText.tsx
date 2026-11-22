'use client'

import { useState } from 'react'

// One button that copies a piece of text and says so for two seconds. The text
// is also on the page in full, so a browser without clipboard access can still
// select it by hand.
export default function CopyText({ text, label, track }: { text: string; label: string; track: string }) {
  const [done, setDone] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch { /* the text is on the page to select by hand */ }
  }
  return (
    <button type="button" onClick={copy} className="btn btn-gold" data-track={track} aria-live="polite" style={{ minHeight: '48px' }}>
      {done ? 'Copied' : label}
    </button>
  )
}
