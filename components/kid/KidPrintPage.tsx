'use client'

import { useEffect, useState } from 'react'
import KidSheetPaper, { type SheetPaperSpec } from '@/components/kid/KidSheetPaper'
import BucketSheet, { type BucketIdea } from '@/components/printables/BucketSheet'
import StarChartSheet, { type SheetJob } from '@/components/printables/StarChartSheet'
import { canPrintHere, tickPrintableStep } from '@/lib/kid/print-anywhere'
import { HAPPY, SmileyDot } from '@/components/kid/HappyNewsBits'

// The print page: one printable, drawn alone, asking for the print dialog
// the moment it is ready.
//
// This is where the installed app sends a child when it cannot print for
// itself (see lib/kid/print-anywhere). It opens in real Safari, which can.
// The page is deliberately plain: a thin bar saying what to do if the dialog
// does not appear, the paper, and nothing else. Nothing here needs the app
// behind it, so it works opened cold.
//
// Three shapes of paper share it: a sheet from the registry, the bucket
// list with the child's picks, and the star chart with their jobs. The
// builders pack their picks into the URL, because a Safari tab shares no
// storage with the installed app that opened it.

export type PrintJob =
  | { kind: 'sheet'; sheet: SheetPaperSpec; key: string }
  | { kind: 'bucket'; title: string; childName: string; picked: BucketIdea[] }
  | { kind: 'star'; name: string; weekLabel: string | null; jobs: SheetJob[]; starMinutes: number }

export default function KidPrintPage({ job, token, autoPrint = true }: {
  job: PrintJob
  token: string
  /** Off in the dev fixture, where a print dialog would only get in the way. */
  autoPrint?: boolean
}) {
  const [ready, setReady] = useState(job.kind !== 'sheet')
  const [asked, setAsked] = useState(false)

  // Landing here IS the print, as far as the five a day is concerned.
  useEffect(() => { tickPrintableStep(token) }, [token])

  // Ask for the dialog once the art is on the page, and only once. A short
  // wait lets fonts and the last image settle so the paper is not half drawn.
  useEffect(() => {
    if (!autoPrint || !ready || asked) return
    if (!canPrintHere()) return
    setAsked(true)
    const t = setTimeout(() => { try { window.focus(); window.print() } catch { /* the bar still says how */ } }, 500)
    return () => clearTimeout(t)
  }, [autoPrint, ready, asked])

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', fontFamily: 'var(--font-body)' }}>
      <style>{`@media print {
        .kid-print-bar { display: none !important; }
        @page { margin: 8mm; }
      }`}</style>
      <div className="kid-print-bar" style={{
        position: 'sticky', top: 0, zIndex: 2, display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', background: HAPPY.butter, borderBottom: `2.5px solid ${HAPPY.ink}`,
      }}>
        <SmileyDot size={22} color="#fff" />
        <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: HAPPY.ink, lineHeight: 1.3 }}>
          {job.kind === 'sheet' ? job.sheet.title : job.kind === 'bucket' ? (job.title || 'My Bucket List') : 'My star chart'}.
          {' '}No print box? Tap share, then Print. Then close this tab to go back to your app.
        </div>
        <button
          onClick={() => { try { window.print() } catch { /* nothing to do */ } }}
          style={{
            flexShrink: 0, padding: '10px 14px', borderRadius: 14, border: `2px solid ${HAPPY.ink}`, cursor: 'pointer',
            background: '#fff', color: HAPPY.ink, boxShadow: `0 3px 0 ${HAPPY.ink}`,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
          }}
        >
          🖨️ Print
        </button>
      </div>

      {job.kind === 'sheet' && (
        <KidSheetPaper sheet={job.sheet} onLoaded={() => setReady(true)} onFailed={() => setReady(false)} />
      )}
      {job.kind === 'bucket' && (
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '10px 16px 30px' }}>
          <BucketSheet title={job.title} childName={job.childName} picked={job.picked} framed={false} />
        </div>
      )}
      {job.kind === 'star' && (
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '10px 12px 30px', overflowX: 'auto' }}>
          <style>{`@media print { .sheet-scroll { overflow: visible !important } .sheet-scroll > div { min-width: 0 !important } }`}</style>
          <div className="sheet-scroll" style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 560 }}>
              <StarChartSheet name={job.name} weekLabel={job.weekLabel} jobs={job.jobs} starMinutes={job.starMinutes} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
