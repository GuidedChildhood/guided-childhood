import MethodIcon, { type MethodId } from './MethodIcon'

// How the platform works, as a drawing rather than four screenshots.
//
// ── WHY THIS REPLACED THE MOCKS ─────────────────────────────────────────────
//
// Justin, 9 September 2026: "Happy News style diagrams to quickly illustrate
// the solution without too much text. Happy for you to change diagrams we have
// there and make better simpler versions in Happy News style."
//
// How it works was four numbered steps, each with two or three sentences and a
// full simulation of a real screen under it. One of those simulations quoted a
// script in full, twice, inside a nested SAY THIS panel. It was an honest
// attempt at "show the real product", but at 390 it came to well over a
// thousand pixels per step, and a parent scrolling a sales page does not read
// a fake screenshot of an app they have not bought. They skim for shape.
//
// So this is the shape: four beats, drawn, four words each, one line under the
// lot. A parent gets the loop in about three seconds, which is roughly all the
// attention this section has ever actually had.
//
// The vertical rail rather than a horizontal row: four steps across a 358px
// phone gives each one 80px, which is not enough for a plate and a label, and
// a horizontally scrolling diagram hides half the mechanism from anybody who
// does not think to swipe it.

type Beat = { id: MethodId; label: string; sub: string }

const BEATS: Beat[] = [
  { id: 'moment',  label: 'Something goes wrong', sub: 'The handover, bedtime, the mood after' },
  { id: 'checkin', label: 'You tap how it went',  sub: 'Ten seconds, any day, catch up whenever' },
  { id: 'script',  label: 'You get what to do',   sub: 'The words, ready before the moment' },
  { id: 'passport',label: 'It moves',             sub: 'Five stars per worry, stamped when it settles' },
]

export default function SolveLoop() {
  return (
    <div className="wow-fu" style={{ marginTop: 6 }}>
      {BEATS.map((b, i) => (
        <div key={b.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* The plate, and the rail that joins it to the next one. */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <span aria-hidden style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--terracotta-lt)', border: '2px solid var(--ink)', boxSizing: 'border-box',
              boxShadow: '0 4px 0 var(--ink)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MethodIcon id={b.id} size={27} />
            </span>
            {i < BEATS.length - 1 && (
              <span aria-hidden style={{
                width: 0, flex: 1, minHeight: 26,
                borderLeft: '3px dashed var(--ink)', opacity: 0.35, margin: '6px 0 2px',
              }} />
            )}
          </div>
          <div style={{ minWidth: 0, paddingBottom: i < BEATS.length - 1 ? 20 : 0, paddingTop: 5 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'var(--text-lg)', lineHeight: 1.2, color: 'var(--ink)',
              letterSpacing: '-0.01em',
            }}>
              {b.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
              lineHeight: 1.45, color: 'var(--ink-soft)', marginTop: 3,
            }}>
              {b.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
