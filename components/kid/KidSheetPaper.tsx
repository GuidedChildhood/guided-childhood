'use client'

import { useState } from 'react'
import DrawnPaper from '@/components/printables/drawn/DrawnPaper'
import { PrintBrandMark } from '@gc/shared/components/PrintBrand'
import type { DrawnSpec } from '@/components/printables/drawn'

// The paper: one printable sheet as it lands on the printer.
//
// Lifted out of KidSheetOverlay so the same paper can be drawn in three
// places without drifting: the sheet screen on the printables tab, the
// assigned printable's overlay, and the print page that opens in real Safari
// when the installed app cannot print for itself.
//
// When a heading rides along, the paper composes a proper sheet: the name and
// kicker printed as crisp text above the art, instead of trusting words baked
// into an image. Justin, 12 August 2026, on a photographed mockup of the
// Bloop sheet standing in for the sheet itself: "We need proper printable
// here not image." The extra pages and the write in page each print as their
// own sheet of paper.

export type SheetPaperSpec = {
  url: string
  title: string
  extraUrls?: string[]
  heading?: { name: string; kicker: string }
  writeIn?: { title: string; blurb: string; lines: number }
  /** A sheet drawn in code (the happy news device balance set): no image, the real sheet at any size. */
  drawn?: DrawnSpec
}

export default function KidSheetPaper({ sheet, onFailed, onLoaded }: {
  sheet: SheetPaperSpec
  onFailed?: () => void
  onLoaded?: () => void
}) {
  // The sheet art lives on the CDN, so on a bad connection the image is the
  // one thing here that can fail. Failing silently left a blank page with no
  // explanation, so this says what happened.
  const [failed, setFailed] = useState(false)
  const fail = () => { setFailed(true); onFailed?.() }

  if (sheet.drawn) {
    return (
      <div className="kid-sheet-paper">
        <DrawnPaper spec={sheet.drawn} />
      </div>
    )
  }

  if (failed) {
    return (
      <p className="kid-sheet-oops" style={{ padding: '30px 22px', textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 700, lineHeight: 1.55, color: 'var(--ink)' }}>
        That sheet did not come through. Check the wifi and try again, or ask a grown up to print it for you.
      </p>
    )
  }

  return (
    <div className="kid-sheet-paper">
      {/* THE BRAND ON EVERY PAGE (29 September 2026 print audit). The drawn
          sheets carry the logo in their own paper; these photo sheets carried
          none. A print only line under each page, with the picture capped so
          the line always lands on the same sheet as it rather than on a
          second page of its own. */}
      <style>{`
      .kid-sheet-brand { display: none; }
      @media print {
        .kid-sheet-writein { page-break-before: always; break-before: page; }
        .kid-sheet-extra { page-break-before: always; break-before: page; }
        .kid-sheet-page { break-inside: avoid; page-break-inside: avoid; }
        .kid-sheet-page img { width: auto !important; max-width: 100% !important; max-height: 258mm; margin: 0 auto; }
        .kid-sheet-page.has-heading { padding-top: 0 !important; padding-bottom: 0 !important; }
        .kid-sheet-page.has-heading img { max-height: 200mm; }
        .kid-sheet-brand { display: flex !important; justify-content: center; align-items: center; gap: 10px; margin-top: 3mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }`}</style>
      {sheet.heading ? (
        // The composed sheet: crisp text, clean art, a sprinkle of stars to
        // colour. What lands on paper is a real colouring sheet, not a photo
        // of one.
        <div className="kid-sheet-page has-heading" style={{ maxWidth: 700, margin: '0 auto', padding: '26px 22px 40px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 13vw, 72px)',
            letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1, color: '#1A1A2E',
          }}>
            {sheet.heading.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-md)',
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1A1A2E', margin: '10px 0 4px',
          }}>
            {sheet.heading.kicker}
          </div>
          <div aria-hidden style={{ fontSize: 'var(--text-xl)', letterSpacing: '0.35em', color: '#1A1A2E', margin: '6px 0 2px' }}>
            ☆ ☆ ☆ ☆ ☆
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sheet.url} alt={sheet.title} loading="eager" decoding="sync" onError={fail} onLoad={onLoaded} style={{ width: '100%', display: 'block' }} />
          <div className="kid-sheet-brand" aria-hidden><PrintBrandMark /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#C99A28' }}>guidedchildhood.com</span></div>
        </div>
      ) : (
        <div className="kid-sheet-page">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sheet.url} alt={sheet.title} loading="eager" decoding="sync" onError={fail} onLoad={onLoaded} style={{ width: '100%', display: 'block' }} />
          <div className="kid-sheet-brand" aria-hidden><PrintBrandMark /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#C99A28' }}>guidedchildhood.com</span></div>
        </div>
      )}

      {/* The remaining pages of a multi page craft, each its own sheet of
          paper, so the bucket craft keeps the cut out bucket it exists for. */}
      {(sheet.extraUrls ?? []).map(u => (
        <div key={u} className="kid-sheet-extra kid-sheet-page">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u} alt={sheet.title} loading="eager" decoding="sync" style={{ width: '100%', display: 'block', marginTop: 14 }} />
          <div className="kid-sheet-brand" aria-hidden><PrintBrandMark /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#C99A28' }}>guidedchildhood.com</span></div>
        </div>
      ))}

      {/* The write in page, its own sheet of paper when printed. On screen it
          sits under the sheet so a child scrolling knows page two is coming. */}
      {sheet.writeIn && (
        <div className="kid-sheet-writein" style={{ maxWidth: 700, margin: '0 auto', padding: '30px 26px 60px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(30px, 9vw, 44px)', lineHeight: 1.1, color: '#1A1A2E', textAlign: 'center' }}>
            {sheet.writeIn.title}
          </div>
          <p style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: '#52526A', lineHeight: 1.5, textAlign: 'center', margin: '10px 0 26px' }}>
            {sheet.writeIn.blurb}
          </p>
          {Array.from({ length: sheet.writeIn.lines }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 46 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: '#9A9AB0', paddingBottom: 4 }}>
                {i + 1}.
              </span>
              <div style={{ flex: 1, borderBottom: '2.5px dotted #B9B9CC', height: '100%' }} />
            </div>
          ))}
          <div className="kid-sheet-brand" aria-hidden><PrintBrandMark /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#C99A28' }}>guidedchildhood.com</span></div>
        </div>
      )}
    </div>
  )
}
