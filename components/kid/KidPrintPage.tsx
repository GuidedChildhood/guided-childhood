'use client'

import { useEffect, useState } from 'react'
import KidSheetPaper, { type SheetPaperSpec } from '@/components/kid/KidSheetPaper'
import BucketSheet, { type BucketIdea } from '@/components/printables/BucketSheet'
import StarChartSheet, { type SheetJob } from '@/components/printables/StarChartSheet'
import { tickPrintableStep, type PrintableTick } from '@/lib/kid/print-anywhere'
import { HAPPY, SmileyDot } from '@/components/kid/HappyNewsBits'

// The print page: one printable, drawn alone, with one big Print button.
//
// This is where the installed app sends a child when it cannot print for
// itself (see lib/kid/print-anywhere). It opens in real Safari, which can.
// The page is deliberately plain: a bar with the Print button, the paper, and
// nothing else. Nothing here needs the app behind it, so it works opened cold.
//
// NO AUTOMATIC PRINT. The first cut asked for the dialog the moment the paper
// had loaded, and Safari on the iPhone answered with a box of its own: "This
// website has been blocked from automatically printing", Ignore or Allow
// (Justin's screenshot, 2 September 2026). Safari only opens the print sheet
// for a print asked for by a tap, so the tap is the whole design now: the
// button is the first thing on the page, big enough to be the obvious next
// move, and window.print runs inside its handler and nowhere else.
//
// Three shapes of paper share it: a sheet from the registry, the bucket
// list with the child's picks, and the star chart with their jobs. The
// builders pack their picks into the URL, because a Safari tab shares no
// storage with the installed app that opened it.
//
// WHAT HAPPENS AFTER. Justin, 2 September 2026, standing on this page with
// Jonny's star chart: "When I click print here it should update the 1 of 5
// jobs on child app and go back to the 5 a day marked as completed and onto
// next." The tick was already landing the moment this page opened (his row
// had it). What was missing was any sign of it, and any way on. So the bar
// now says when the print counted as one of today's five, and once the
// paper has been printed the bar turns into the way back: close this tab,
// open the app, the next step is waiting. A Safari tab cannot open the
// installed app itself, so the honest instruction is the whole of it; the
// app, meanwhile, has walked itself home to the day (see afterPrintableTicked
// on the home screen and the builders), so the child returns to a five that
// has already moved on.

export type PrintJob =
  | { kind: 'sheet'; sheet: SheetPaperSpec; key: string }
  | { kind: 'bucket'; title: string; childName: string; picked: BucketIdea[] }
  | { kind: 'star'; name: string; weekLabel: string | null; jobs: SheetJob[]; starMinutes: number }

export default function KidPrintPage({ job, token }: {
  job: PrintJob
  token: string
}) {
  // What landing here did to today's five, once the route has answered.
  const [tick, setTick] = useState<PrintableTick | null>(null)
  // The dialog has been and gone: the paper is theirs, the bar becomes the way back.
  const [printed, setPrinted] = useState(false)
  // Close this tab was tapped and the tab is still here: Safari would not
  // close a tab it did not open by script, so the child is told the other way.
  const [stuck, setStuck] = useState(false)

  // Landing here IS the print, as far as the five a day is concerned.
  useEffect(() => {
    let live = true
    void tickPrintableStep(token).then(t => { if (live) setTick(t) })
    return () => { live = false }
  }, [token])

  // The dialog closing is the moment the paper is theirs, however it was
  // opened: the auto print, the button, or the share sheet's own Print.
  useEffect(() => {
    const done = () => setPrinted(true)
    window.addEventListener('afterprint', done)
    return () => window.removeEventListener('afterprint', done)
  }, [])

  // Inside the tap, always: that is the one place Safari lets a page print.
  function printNow() {
    try { window.print() } catch { /* nothing to do */ }
    // print() holds the page until the dialog closes where it can, so by
    // here the paper has been sent or the child has chosen not to. Either way
    // the way back is what they need next.
    setPrinted(true)
  }

  function closeTab() {
    try { window.close() } catch { /* not ours to close */ }
    setTimeout(() => setStuck(true), 400)
  }

  const title = job.kind === 'sheet' ? job.sheet.title : job.kind === 'bucket' ? (job.title || 'My Bucket List') : 'My star chart'
  const counted = !!tick && tick.done.includes('printable') && tick.steps.includes('printable')
  const doneCount = tick ? tick.done.length : 0
  const total = tick ? tick.steps.length : 0

  return (
    <div className="kid-print-root" style={{ minHeight: '100dvh', background: '#fff', fontFamily: 'var(--font-body)' }}>
      <style>{`@media print {
        .kid-print-bar { display: none !important; }
        /* Nothing but the sheet takes any room on paper. The page's own
           minimum height and the wrapper's padding were adding up to a page
           and a bit, which put a footer alone on page two. The body zoom is
           the one screen readability dial and has no place on paper. */
        body { zoom: 1 !important; }
        .kid-print-root { min-height: 0 !important; }
        .kid-print-wrap { padding: 0 !important; max-width: none !important; }
        /* No @page rule here on purpose. Each sheet declares its own paper
           (the bucket is an A4 sheet with no page margin, the star chart
           wants 10mm) and a page margin set here fought the bucket's: the
           phone laid the sheet out narrower than its drawing and the footer
           tipped onto page two. */
      }`}</style>

      {printed ? (
        // The way back. Green, because the job is done; big, because this is
        // the one thing left to read on the page.
        <div className="kid-print-bar" style={{
          position: 'sticky', top: 0, zIndex: 2,
          padding: '14px 16px 16px', background: HAPPY.green, borderBottom: `2.5px solid ${HAPPY.ink}`, color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SmileyDot size={26} color="#fff" />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1.1 }}>
              Printed!{counted ? ' That is one of your five done.' : ''}
            </div>
          </div>
          <p style={{ margin: '8px 0 12px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', lineHeight: 1.3 }}>
            {stuck
              ? 'Swipe back to your app to carry on. Your next one is waiting there.'
              : 'Now close this tab and open your app. Your next one is waiting there.'}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {!stuck && (
              <button
                onClick={closeTab}
                style={{
                  padding: '12px 18px', borderRadius: 16, border: `2px solid ${HAPPY.ink}`, cursor: 'pointer',
                  background: HAPPY.butter, color: HAPPY.ink, boxShadow: `0 4px 0 ${HAPPY.ink}`,
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
                }}
              >
                ✓ Done, close this tab
              </button>
            )}
            <button
              onClick={printNow}
              style={{
                padding: '12px 16px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.7)', cursor: 'pointer',
                background: 'transparent', color: '#fff',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              }}
            >
              Print it again
            </button>
          </div>
        </div>
      ) : (
        <div className="kid-print-bar" style={{
          position: 'sticky', top: 0, zIndex: 2,
          padding: '12px 14px 14px', background: HAPPY.butter, borderBottom: `2.5px solid ${HAPPY.ink}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <SmileyDot size={24} color="#fff" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: HAPPY.ink, lineHeight: 1.15 }}>
                {title} is ready
              </div>
              <div style={{ marginTop: 3, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: HAPPY.ink, opacity: 0.85 }}>
                {counted
                  ? `✓ ${tick?.ticked ? 'ONE OF YOUR FIVE FOR TODAY' : 'ON YOUR FIVE FOR TODAY'} · ${doneCount} OF ${total} DONE`
                  : 'TAP PRINT AND THE PRINT BOX OPENS'}
              </div>
            </div>
          </div>
          <button
            onClick={printNow}
            style={{
              display: 'block', width: '100%', padding: '14px 18px', borderRadius: 16, border: `2px solid ${HAPPY.ink}`, cursor: 'pointer',
              background: '#fff', color: HAPPY.ink, boxShadow: `0 5px 0 ${HAPPY.ink}`,
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
            }}
          >
            🖨️ Print it
          </button>
        </div>
      )}

      {job.kind === 'sheet' && (
        <KidSheetPaper sheet={job.sheet} />
      )}
      {job.kind === 'bucket' && (
        <div className="kid-print-wrap" style={{ maxWidth: 760, margin: '0 auto', padding: '10px 16px 30px' }}>
          <BucketSheet title={job.title} childName={job.childName} picked={job.picked} framed={false} />
        </div>
      )}
      {job.kind === 'star' && (
        <div className="kid-print-wrap" style={{ maxWidth: 820, margin: '0 auto', padding: '10px 12px 30px', overflowX: 'auto' }}>
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
