'use client'

import { useEffect, useRef } from 'react'
import type { StepKey } from '@/lib/kid/five-a-day'

// A step of the five that is finished by reading it, ticked on arrival.
//
// Most of the five are things a child does and then says they have done. One is
// not. lib/kid/five-a-day.ts says it plainly: the balance "completes by being
// READ", because asking a child to confirm they have looked at their own
// balance would make it a test they can fail rather than the mirror it is
// meant to be.
//
// That intent was written down and never wired up, so Check my balance was a
// link with an arrow: a child tapped it, read the page, went back, and the row
// still sat there undone. Four of five, for ever, through no fault of theirs.
//
// Fires once per mount and never blocks anything. The endpoint already refuses
// a step that is not part of today and already dedupes the done list, so the
// worst a repeat can do is nothing at all.

export default function MarkStepOnArrival({ token, step }: { token: string; step: StepKey }) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current || !token) return
    sent.current = true
    // No await and no error surface. A child came here to look at their
    // balance, and a failed tick is not something to interrupt them with.
    fetch('/api/kid/day', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, step }),
    }).catch(() => { /* ticks again on the next visit */ })
  }, [token, step])

  return null
}
