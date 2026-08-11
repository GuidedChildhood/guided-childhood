'use client'

import Image from 'next/image'
import { getPrintable } from '@/lib/printables/registry'
import { printSheet, printPack } from '@/lib/kid/print-sheet'

// The two places a child meets a printable before they print it, and the window
// they land in when they do.
//
// Justin, 11 August 2026, with two screenshots of the child's app: "make sure
// all printables are higher quality, best you can do, and can navigate back to
// quests", then, on the Word Fishing card, "again this thumbnail does not look
// good please fix, and nav back to quests from print."
//
// Both of those live three thousand lines inside KidQuestScreen, behind a live
// link token, which is why a cover cropped to its top inch and a nine page pack
// with no way out of it both shipped. This is the smallest thing that renders
// them: the same registry, the same components, no child required.
//
// Word Fishing is the default because it is the sheet in his screenshots, and
// the one with a built nine page PDF behind it.

const KEYS = ['word-fishing', 'ice-cream-shop', 'calm-down-corner', 'left-and-right']

export default function PrintableCoversFixture() {
  const sheets = KEYS.map(k => getPrintable(k)).filter(Boolean) as NonNullable<ReturnType<typeof getPrintable>>[]
  const hero = sheets[0]

  return (
    <div style={{ background: 'var(--app-bg, #EDEEF7)', minHeight: '100dvh', padding: '20px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 430, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 14px' }}>
          Printable covers and the print window
        </p>

        {/* THE HERO, the card a grown up's send lands on. */}
        <div id="gc-hero" style={{ background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 18, padding: '14px 16px', marginBottom: 16, boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div className="gc-cover" style={{
              position: 'relative', width: 152, height: 215, borderRadius: 8,
              overflow: 'hidden', background: '#fff',
              border: '1.5px solid var(--border)', boxShadow: '0 4px 0 rgba(26,26,46,0.10)',
            }}>
              <Image src={hero.previewUrl} alt="" fill sizes="152px" style={{ objectFit: 'contain' }} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            Your grown up sent you this
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 10 }}>
            {hero.title}
          </div>
          <button
            id="gc-print-hero"
            onClick={() => { if (hero.pdfColourIn) printPack(hero.pdfColourIn, hero.title); else printSheet(hero.sheetUrl, hero.title) }}
            style={{ width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 14, padding: '12px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', boxShadow: '0 4px 0 var(--terracotta-dark)' }}
          >
            🖨️ Print it
          </button>
        </div>

        {/* THE LIST TILE, the one on the Printables tab. */}
        {sheets.map(p => (
          <div key={p.key} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: '11px 13px 13px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div className="gc-cover" style={{ position: 'relative', width: 68, height: 96, borderRadius: 9, flexShrink: 0, overflow: 'hidden', background: '#fff', border: '1.5px solid var(--border)' }}>
                <Image src={p.previewUrl} alt="" fill sizes="68px" style={{ objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.22 }}>
                  {p.emoji} {p.title}
                </div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.35, marginTop: 2 }}>
                  Colour the whole page for {p.stars} stars
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
