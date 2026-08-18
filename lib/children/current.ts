// The child the parent is currently looking at, read from the URL, for client
// components that need to SEND it rather than render it.
//
// ?child= is the single source of truth for which child a page is about (see
// plans/multi-child-two-session-contract.md), and the switcher in the dashboard
// layout is what puts it there. A tick, an approval or any other write started
// from a page has to name the same child that page is showing, or the parent
// approves Alma's job and Teo gets the stars.
//
// Read at call time from window.location rather than through useSearchParams,
// deliberately. These are click handlers, not renders: the value that matters
// is the one in the URL at the moment of the tap, and a handler that closed
// over a stale render is exactly how the wrong child gets credited. It also
// keeps callers free of the Suspense boundary useSearchParams demands.
export function currentChildId(): string | null {
  if (typeof window === 'undefined') return null
  const id = new URLSearchParams(window.location.search).get('child')
  return id && id.length > 0 ? id : null
}
