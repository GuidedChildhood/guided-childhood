'use client'

import { useEffect } from 'react'
import { currentChildId } from '@/lib/children/current'

// Records that THIS person opened THIS script for THIS child, from the browser,
// once the page is really on the screen.
//
// The script page used to write the opened row during its server render.
// Justin, 5 September 2026, on Todd's road: "Todd has updated script and
// today's done when have only done first child." The database had the same
// script opened for Jonny and for Todd 267 milliseconds apart: the child
// switcher pills on Jonny's script page link to the same script for Todd, and
// a link that fully prefetches renders the page on the server, and a render
// that writes is a read nobody did. The deck already records its open from the
// browser (DeckViewer); the reader now does the same, through the same route.
export default function RecordScriptOpen({ sortOrder }: { sortOrder: number }) {
  useEffect(() => {
    fetch('/api/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sort_order: sortOrder, child_id: currentChildId() }),
    }).catch(() => { /* the next open records it; nothing on the page depends on this */ })
  }, [sortOrder])
  return null
}
