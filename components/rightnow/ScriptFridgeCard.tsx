'use client'

import { createPortal } from 'react-dom'
import { PrintBrandHeader, PrintBrandFooter } from '@gc/shared/components/PrintBrand'

// The script, as a card for the fridge.
//
// Justin, 29 September 2026, with the Right now sheet on his phone: "can we
// check all options to print are perfect professional print outs, all branded
// and perfect for cards on the fridge."
//
// What Print the card used to send to the printer was the phone sheet itself:
// the page hidden around it with visibility, the grey and pink boxes that most
// printers drop unless background graphics are ticked, no logo, and the whole
// hidden app still taking up room behind it. This is a real card instead: one
// side of A4, the card centred inside a dotted cut line, branded top and foot,
// the words at a size that reads from across the kitchen.
//
// It is portalled straight onto <body> and is display none on screen. In print
// every other child of <body> is display none, so the page holds the card and
// nothing else, and can never run to a second sheet.

export type FridgeScript = {
  title: string
  say_this: string
  not_this: string
  crisis?: boolean
}

const INK = '#1A1A2E'
const INK_SOFT = '#52526A'
const BUTTER = '#FDF3D0'
const GOLD = '#EDC35F'
const CORAL_BG = '#FCEDEA'
const CORAL = '#B4453C'

export default function ScriptFridgeCard({ script, moment }: { script: FridgeScript; moment?: string | null }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="script-fridge-print" aria-hidden>
      <style>{`
        .script-fridge-print { display: none; }
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          body > *:not(.script-fridge-print) { display: none !important; }
          html, body { background: #fff !important; zoom: 1 !important; }
          .script-fridge-print {
            display: flex !important; justify-content: center; align-items: flex-start;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
        }
      `}</style>
      <div data-fridge-card style={{
        width: '150mm', boxSizing: 'border-box', marginTop: '6mm',
        border: `0.6mm dashed ${INK_SOFT}`, borderRadius: '6mm', padding: '4mm',
        fontFamily: 'var(--font-body)', color: INK, breakInside: 'avoid',
      }}>
        <div style={{ border: `0.8mm solid ${INK}`, borderRadius: '4mm', padding: '8mm 9mm 6mm', background: '#fff' }}>
          <PrintBrandHeader />

          {moment && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8pt', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_SOFT, textAlign: 'center', marginTop: '3mm' }}>
              {moment}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20pt', lineHeight: 1.15, letterSpacing: '-0.01em', textAlign: 'center', margin: '1.5mm 0 5mm' }}>
            {script.title}
          </div>

          <div style={{ background: BUTTER, border: `0.6mm solid ${INK}`, borderRadius: '4mm', padding: '5mm 6mm', boxShadow: `0 1.4mm 0 ${GOLD}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8pt', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_SOFT, marginBottom: '2mm' }}>
              Say this
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17pt', lineHeight: 1.38 }}>
              {script.say_this}
            </div>
          </div>

          <div style={{ background: CORAL_BG, border: `0.4mm solid ${CORAL}`, borderRadius: '4mm', padding: '4mm 6mm', marginTop: '5mm' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8pt', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: CORAL, marginBottom: '1.5mm' }}>
              {script.crisis ? 'A human, right now' : 'Not this'}
            </div>
            <div style={{ fontSize: '11pt', lineHeight: 1.45, color: CORAL }}>
              {script.not_this}
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11pt', textAlign: 'center', color: INK, margin: '5mm 0 1mm' }}>
            Breathe out slowly once. You first, then them.
          </div>

          <PrintBrandFooter />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '7pt', letterSpacing: '0.08em', color: INK_SOFT, textAlign: 'center', marginTop: '2.5mm' }}>
          Cut along the dotted line and pop it on the fridge
        </div>
      </div>
    </div>,
    document.body,
  )
}
