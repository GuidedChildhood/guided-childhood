// What the child sees the instant their link opens, before the data lands.
//
// The page behind this runs two waves of reads against the database. Without a
// loading file the App Router shows nothing at all while they run, or worse, on
// a tap from another child screen it leaves the OLD screen frozen on the phone
// until the new one is ready. See app/(dashboard)/dashboard/loading.tsx for the
// day Justin reported exactly that on the parent side.
//
// A shape, not a spinner, and no words. A spinner says wait; a shape says the
// page is on its way and here is where things will be. One quiet tone
// throughout, because colour in a skeleton reads as content that vanishes.
//
// The wrapper copies KidQuestScreen's outer column (full height, centred,
// 22px 16px 40px padding, a 420px wide column) so the blocks sit exactly where
// the real cards land and nothing jumps when the page swaps in. Cream rather
// than the buddy colour, because the buddy is not known until the data is.

function Block({ height }: { height: number }) {
  return (
    <div
      aria-hidden
      style={{
        height,
        width: '100%',
        border: 'var(--edge)',
        borderRadius: 'var(--radius-card)',
        background: 'var(--cream)',
        opacity: 0.35,
        marginBottom: 14,
        animation: 'gcKidPulse 1.4s ease-in-out infinite',
      }}
    />
  )
}

export default function KidLoading() {
  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--cream)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '22px 16px 40px',
    }}>
      {/* Announced once, politely, for a screen reader. Visually there is no
          text at all. */}
      <span role="status" aria-live="polite" style={{
        position: 'absolute', width: 1, height: 1, overflow: 'hidden',
        clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap',
      }}>
        Loading
      </span>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* The greeting, then the big today card, then the next one down. */}
        <Block height={72} />
        <Block height={220} />
        <Block height={120} />
      </div>
      {/* One rule, inline, because there is no keyframes file to reach for.
          prefers-reduced-motion gets a still shape, the same reassurance
          without the movement. */}
      <style>{`
        @keyframes gcKidPulse { 0%,100% { opacity: .35 } 50% { opacity: .18 } }
        @media (prefers-reduced-motion: reduce) {
          [style*="gcKidPulse"] { animation: none !important }
        }
      `}</style>
    </div>
  )
}
