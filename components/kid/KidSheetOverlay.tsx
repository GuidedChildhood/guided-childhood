'use client'

import { useEffect, useState } from 'react'
import { playKidSound } from '@/lib/sound/kidSounds'

// A printable sheet, printed from right where the child is standing.
//
// Justin, 11 August 2026, with Teo stranded on a bare image of the Summer
// Bucket List: no bar, no back, no way home. The old path opened a popup
// window with its own toolbar, and when the installed app blocked the popup
// it fell back to opening the raw image, which inside a standalone app has
// no address bar, no tabs and no back button. A dead end, found the same
// way the last dead end was found: by a child hitting it.
//
// So there is no window any more. The sheet opens as an overlay ON the page
// the child is already on: a bar with the way back and a print button, the
// sheet below it, and a print rule that hides everything except the sheet.
// Nothing can be blocked and nothing can strand, because nothing leaves.

// When a heading rides along, the overlay composes a proper sheet: the name
// and kicker printed as crisp text above the art, instead of trusting words
// baked into an image. Justin, 12 August 2026, on a photographed mockup of
// the Bloop sheet standing in for the sheet itself: "We need proper
// printable here not image."
export type OverlaySheet = {
  url: string
  title: string
  // The remaining pages of a multi page sheet (the crafts). Each prints as
  // its own sheet of paper. Justin, 12 August 2026, on the two page bucket
  // craft losing its cut out page: "it also failed when trying to print."
  extraUrls?: string[]
  heading?: { name: string; kicker: string }
  // A write in page after the sheet: a titled set of dotted lines, printed
  // as its own second page. Justin, 12 August 2026, on the reading list:
  // "add here a place of them adding books they want to read."
  writeIn?: { title: string; blurb: string; lines: number }
}

export default function KidSheetOverlay({ sheet, onClose }: {
  sheet: OverlaySheet | null
  onClose: () => void
}) {
  // The sheet art lives on the CDN, so on a bad connection the image is the
  // one thing here that can fail. Failing silently left the old window
  // blank with no explanation, so this one says what happened and the bar
  // above still works either way.
  const [failed, setFailed] = useState(false)
  // True once the print dialog has closed. The way back was always in the top
  // bar, but a child who has just printed is looking at the bottom of a long
  // sheet, not at a small button above it. Justin, 20 August 2026: "if they
  // print, easy for them to click back to printables page." So the moment the
  // dialog closes, a big bar rises from the bottom with the one thing they
  // want next. afterprint fires whether they printed or cancelled, and either
  // way the child is done with the sheet.
  const [printed, setPrinted] = useState(false)
  useEffect(() => {
    const done = () => setPrinted(true)
    window.addEventListener('afterprint', done)
    return () => window.removeEventListener('afterprint', done)
  }, [])
  if (!sheet) return null
  return (
    <div className="kid-sheet-overlay" style={{ position: 'fixed', inset: 0, zIndex: 220, background: '#fff', overflowY: 'auto' }}>
      {/* On paper, only the sheet: everything else on the page is hidden and
          the overlay is lifted to the page origin so the image starts at the
          top of the first sheet of paper. */}
      <style>{`@media print {
        body * { visibility: hidden !important; }
        .kid-sheet-overlay, .kid-sheet-overlay * { visibility: visible !important; }
        .kid-sheet-overlay { position: absolute !important; inset: 0 !important; overflow: visible !important; }
        .kid-sheet-overlay .kid-sheet-bar { display: none !important; }
        .kid-sheet-writein { page-break-before: always; break-before: page; }
        .kid-sheet-extra { page-break-before: always; break-before: page; }
        @page { margin: 8mm; }
      }`}</style>

      <div className="kid-sheet-bar" style={{
        position: 'sticky', top: 0, zIndex: 2, display: 'flex', gap: 10, alignItems: 'center',
        padding: '12px 14px', background: 'var(--terracotta-lt)', borderBottom: '1.5px solid rgba(26,26,46,0.12)',
      }}>
        <button
          onClick={() => { playKidSound('tap'); onClose() }}
          style={{
            flex: 1, padding: '12px 10px', border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            color: 'var(--ink)', background: '#fff', boxShadow: '0 4px 0 rgba(26,26,46,0.14)',
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => { playKidSound('tap'); window.print() }}
          style={{
            flex: 1, padding: '12px 10px', border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            color: 'var(--ink)', background: 'var(--terracotta)', boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          🖨️ Print it
        </button>
      </div>

      {failed ? (
        <p style={{ padding: '30px 22px', textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 700, lineHeight: 1.55, color: 'var(--ink)' }}>
          That sheet did not come through. Check the wifi and try again, or ask a grown up to print it for you.
        </p>
      ) : sheet.heading ? (
        // The composed sheet: crisp text, clean art, a sprinkle of stars to
        // colour. What lands on paper is a real colouring sheet, not a photo
        // of one.
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '26px 22px 40px', textAlign: 'center' }}>
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
          <img
            src={sheet.url}
            alt={sheet.title}
            loading="eager"
            decoding="sync"
            onError={() => setFailed(true)}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sheet.url}
          alt={sheet.title}
          loading="eager"
          decoding="sync"
          onError={() => setFailed(true)}
          style={{ width: '100%', display: 'block' }}
        />
      )}

      {/* The remaining pages of a multi page craft, each its own sheet of
          paper. These used to be dropped entirely: the overlay only knew one
          url, so the bucket craft printed its list page and lost the cut out
          bucket it exists for. */}
      {!failed && (sheet.extraUrls ?? []).map(u => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={u}
          className="kid-sheet-extra"
          src={u}
          alt={sheet.title}
          loading="eager"
          decoding="sync"
          style={{ width: '100%', display: 'block', marginTop: 14 }}
        />
      ))}

      {/* The big way home, once the print dialog has been and gone. Fixed to
          the bottom so it is under the child's thumb wherever they scrolled,
          and hidden on paper like the bar above. */}
      {printed && (
        <div
          className="kid-sheet-bar"
          style={{
            position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 3,
            padding: '12px 14px calc(12px + env(safe-area-inset-bottom))',
            background: 'var(--terracotta-lt)', borderTop: '1.5px solid rgba(26,26,46,0.12)',
          }}
        >
          <button
            onClick={() => { playKidSound('tap'); onClose() }}
            style={{
              width: '100%', padding: '16px 12px', border: 'none', borderRadius: 16, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
              color: '#fff', background: '#2F8F6B', boxShadow: '0 5px 0 rgba(26,26,46,0.25)',
            }}
          >
            Done! Back to my printables
          </button>
        </div>
      )}

      {/* The write in page, its own sheet of paper when printed. On screen it
          sits under the sheet so a child scrolling knows page two is coming. */}
      {!failed && sheet.writeIn && (
        <div className="kid-sheet-writein" style={{ maxWidth: 700, margin: '0 auto', padding: '30px 26px 60px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(30px, 9vw, 44px)',
            lineHeight: 1.1, color: '#1A1A2E', textAlign: 'center',
          }}>
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
        </div>
      )}
    </div>
  )
}
