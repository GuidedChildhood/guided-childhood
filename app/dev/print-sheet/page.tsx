'use client'

import { printSheet } from '@/lib/kid/print-sheet'
import { getPrintable } from '@/lib/printables/registry'

// A harness for the print window, built for Justin's report on 9 August 2026:
// "when clicked printable it displays print which is great but need a way back
// to platform."
//
// The real button lives on the child's Quests screen, which needs a live link
// token and the service key, so the window it opens had never been driven by
// anything but a child on a phone. That is exactly how it shipped with no way
// out of it. This opens the same window, with the same sheet he was looking at.

const SHEET = getPrintable('kindness-bucket-list')

// ?src= swaps the sheet for a local one. The art is on the CDN, which is not
// reachable from every environment, and the print dialog fires from the image's
// OWN onload, so without a picture that path cannot be checked at all. It also
// gives a way to point at a URL that will never load, which is how the "that
// sheet did not come through" message gets tested.
export default function PrintSheetFixture() {
  const title = SHEET?.title ?? 'My Kindness Bucket List'
  // Read at click time rather than from the server, so this stays a plain
  // client page with no searchParams promise to unwrap.
  const sheetUrl = () =>
    new URLSearchParams(window.location.search).get('src') || SHEET?.sheetUrl || ''
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '30px 18px', fontFamily: 'var(--font-body)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', color: 'var(--ink)', margin: '0 0 6px' }}>
        Print window harness
      </h1>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '0 0 18px', lineHeight: 1.55 }}>
        {title}
      </p>
      <button
        id="gc-print"
        onClick={() => printSheet(sheetUrl(), title)}
        style={{
          padding: '13px 20px', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: 'var(--terracotta)', color: 'var(--ink)', boxShadow: '0 5px 0 var(--terracotta-dark)',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
        }}
      >
        🖨️ Print it now
      </button>
    </div>
  )
}
