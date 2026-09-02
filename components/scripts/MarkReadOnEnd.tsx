'use client'

import { band } from '@/components/scripts/card-system'
import { useEffect, useRef, useState } from 'react'
import { currentChildId } from '@/lib/children/current'

// Reaching the end of a script counts on the pathway.
//
// Justin, 10 August 2026, twice: "it doesn't update if I read it", and then
// "once read through needs to update pathway."
//
// ── The distinction this rests on ────────────────────────────────────────────
//
// Opening a script has counted for nothing since migration 157, for a good
// reason: a parent who scrolled through ten scripts came back to ten ticks and
// a passport that disagreed with every one of them. That reasoning is still
// right and this does not undo it.
//
// What it adds is the state in between. OPENED is a page that rendered. READ is
// a parent who got to the bottom. They are not the same thing, and only the
// second one is worth anything, which is why this fires on the end of the
// script and not on arrival.
//
// ── Why the end, and not a timer ─────────────────────────────────────────────
//
// A timer measures a tab being open, which is a phone on a kitchen counter as
// often as it is a person reading. The last block of the script coming into
// view is the closest honest signal we have that somebody got there, and it
// costs one observer and no polling.
//
// USED still outranks it and always will. Read means they have the words; used
// means they had the conversation, and only the parent can tell us that.

export default function MarkReadOnEnd({
  sortOrder,
  /** Already used or set aside, so there is nothing left for reading to add. */
  settled = false,
}: {
  sortOrder: number
  settled?: boolean
}) {
  const endRef = useRef<HTMLDivElement>(null)
  const [marked, setMarked] = useState(false)

  useEffect(() => {
    if (settled || marked) return
    const el = endRef.current
    if (!el) return

    // Once. A parent scrolling back up and down again is one reading, and a
    // route call per bounce would be noise in the log and a write for nothing.
    let done = false
    const observer = new IntersectionObserver(entries => {
      if (done || !entries.some(e => e.isIntersecting)) return
      done = true
      observer.disconnect()
      fetch('/api/scripts/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder, status: 'read' , child_id: currentChildId() }),
      })
        .then(r => { if (r.ok) setMarked(true) })
        .catch(() => { /* a passport tick is not worth an error in a parent's face */ })
    }, {
      // A little slack, so the very bottom of a long page counts without
      // needing the last pixel. A parent who has read the closing line has read
      // it whether or not the footer is fully on screen.
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [sortOrder, settled, marked])

  return (
    <div ref={endRef}>
      {marked && (
        <p
          role="status"
          // The child's Printed! bar, for the parent: a green band with
          // white words, because reading to the end is the moment that lands.
          style={{
            ...band('green'),
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 900,
            lineHeight: 1.2, margin: '0 0 12px',
          }}
        >
          Read. Your pathway has moved.
        </p>
      )}
    </div>
  )
}
