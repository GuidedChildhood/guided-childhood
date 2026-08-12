// The thing that happens the instant a parent taps a tab.
//
// Justin, 12 August 2026: "does not go back to home when I click button here
// from pathway. Also going to home seems to not be that quick in general."
//
// ── IT DID GO BACK, IT JUST SHOWED NOTHING WHILE IT WENT ────────────────────
//
// There was no loading file anywhere in this app, not one. In the App Router
// that has a specific and horrible consequence: navigating to a dynamic server
// page leaves the OLD PAGE ON SCREEN, frozen, until the new one has finished
// rendering on the server. Tap Home from the pathway and you carry on looking
// at the pathway. Nothing moves, nothing spins, nothing says it heard you. So
// you tap it again, and now two renders are in flight.
//
// That is the whole of the first half of his report. The button worked every
// time. It just had no way to say so.
//
// ── AND IT IS SLOW ENOUGH TO NOTICE, WHICH IS THE OTHER HALF ────────────────
//
// Home runs 26 Supabase queries. Most are batched into two Promise.all waves,
// but five more sit on their own between the waves: readNudgeFacts,
// getFamilyRegion and rollVisit each block everything after them for a full
// round trip. This file does not fix that, and it is not pretending to. It
// makes the tap answer immediately while the work happens, which is the
// difference between an app that is thinking and an app that is broken.
//
// ── WHY A SHAPE AND NOT A SPINNER ───────────────────────────────────────────
//
// A spinner says "wait". A shape says "your page is coming and here is where
// things will be", and it measurably feels faster because the eye has somewhere
// to rest. These blocks are the real proportions of Home: the greeting bubble,
// the big Today card, then two smaller ones.
//
// It sits at the dashboard segment, so every tab gets it. The layout, and with
// it the bottom nav, stays put underneath, so the tab a parent pressed is
// already lit while this shows. That is most of the reassurance right there.

function Block({ height, radius = 20 }: { height: number; radius?: number }) {
  return (
    <div
      aria-hidden
      style={{
        height, borderRadius: radius, background: 'var(--border)',
        opacity: 0.55, marginBottom: 14,
        animation: 'gcPulse 1.4s ease-in-out infinite',
      }}
    />
  )
}

export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Announced once, politely. A screen reader should hear that something
          is on its way rather than have the page go quiet. */}
      <span role="status" aria-live="polite" style={{
        position: 'absolute', width: 1, height: 1, overflow: 'hidden',
        clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap',
      }}>
        Loading
      </span>

      {/* DiGi's greeting: the round avatar and its speech bubble.
          GREY, LIKE EVERY OTHER BLOCK, and that is a fix rather than a taste
          call. Justin, 12 August 2026: "every time we change to another tab at
          home it puts a yellow circle flash between screens."
          This circle was drawn in terracotta with a terracotta border, so it
          was the ONLY coloured thing in a grey skeleton. Colour in a skeleton
          reads as content, and content that appears for 200ms and then vanishes
          reads as a glitch. The eye goes straight to it, which is the opposite
          of what a placeholder is for.
          A skeleton should be one quiet tone throughout: it is saying "the page
          is on its way", not "here is a thing". */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
        <div aria-hidden style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'var(--border)', opacity: 0.55,
          animation: 'gcPulse 1.4s ease-in-out infinite',
        }} />
        <div style={{ flex: 1 }}><Block height={62} radius={18} /></div>
      </div>

      {/* Today, sorted: the tall one. */}
      <Block height={210} />
      <Block height={96} />
      <Block height={96} />

      {/* No keyframes file to reach for, and one rule is not worth one.
          prefers-reduced-motion gets a still shape, which is the same
          reassurance without the movement. */}
      <style>{`
        @keyframes gcPulse { 0%,100% { opacity: .55 } 50% { opacity: .28 } }
        @media (prefers-reduced-motion: reduce) {
          [style*="gcPulse"] { animation: none !important }
        }
      `}</style>
    </div>
  )
}
