'use client'

import { useEffect } from 'react'

// On passport day the day's one thing is a LOOK at the record, so arriving on
// the pathway from the road is the completion. The pathway page renders this
// only when the road sent the parent here on a passport day (the rung's link
// carries passportday=1); the server route is idempotent, so a second visit
// or a second device changes nothing.
export default function MarkPassportLook({ childId }: { childId: string | null }) {
  useEffect(() => {
    fetch('/api/daily/day-done', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: childId ?? undefined, focus: 'passport' }),
    }).catch(() => { /* the road's own poster retries on the next home visit */ })
  }, [childId])
  return null
}
