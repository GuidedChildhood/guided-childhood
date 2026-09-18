'use client'

import { OPEN_MOMENT_EVENT } from '@/components/rightnow/RightNowButton'

// ADD A MOMENT WHERE THE QUESTION IS ASKED.
//
// Justin, 18 September 2026: "it should say add any new moments as copy and
// then [an] add moments [control] so they can add a new moment to go on check
// in and fall into [the routine] each day until it gets 5 stars."
//
// The check in used to end with a link to the moments deck. A parent who has
// just been asked whether anything else happened had to leave the page, land
// somewhere else, and find the control there. That is how a question turns
// into an errand, and an errand at the end of a thirty second job is where
// people stop.
//
// The moment sheet is already on every dashboard page, mounted once by the
// layout. This asks it to open rather than building a second one, so there is
// still exactly one sheet, one set of situations and one share panel in the
// house.
export default function AddMomentHere() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_MOMENT_EVENT))}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px',
        background: '#fff', color: 'var(--ink)', border: 'var(--edge)',
        borderRadius: 'var(--radius-tile)', cursor: 'pointer',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
      }}
    >
      <span aria-hidden>⚡</span>
      Add a moment
    </button>
  )
}
